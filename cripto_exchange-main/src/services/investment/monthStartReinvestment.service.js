import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

/**
 * Month-Start Reinvestment Service
 * Runs on 28th of each month.
 * For every user in the system:
 *   - Reads their main_balance to determine amount and plan
 *   - Creates a fresh investment entry (main_balance is NOT deducted)
 * Skips users who have no wallet or whose main_balance is zero.
 */
class MonthStartReinvestmentService {
  /**
   * Pick the right InvestmentPlan for a given amount.
   * Falls back to the plan with the highest min_amount if nothing matches exactly.
   */
  async findPlanForAmount(amount) {
    const numAmount = parseFloat(amount);

    // Find a plan whose range covers the amount
    const plan = await prisma.investmentPlan.findFirst({
      where: {
        min_amount: { lte: numAmount },
        OR: [
          { max_amount: null },
          { max_amount: { gte: numAmount } }
        ]
      },
      orderBy: { min_amount: 'desc' }
    });

    return plan;
  }

  /**
   * Calculate monthly interest rate based on tier.
   * < 1000     → 5%
   * 1000–5000  → 7%
   * 5001–10000 → 8%
   * > 10000    → 9%
   */
  calculateMonthlyRate(amount) {
    const num = parseFloat(amount);
    if (num < 1000) return 5;
    if (num <= 5000) return 7;
    if (num <= 10000) return 8;
    return 9;
  }

  /**
   * Create an automated investment for a single user.
   * Uses main_balance as the investment amount — balance is NOT deducted.
   */
  async createReinvestmentForUser(user, wallet) {
    const amount = parseFloat(wallet.main_balance);

    if (amount <= 0) {
      return { skipped: true, reason: 'main_balance is zero or negative' };
    }

    const plan = await this.findPlanForAmount(amount);

    if (!plan) {
      return { skipped: true, reason: `No investment plan found for amount ${amount}` };
    }

    const monthlyRate = this.calculateMonthlyRate(amount);

    const investment = await prisma.$transaction(async (tx) => {
      // Create the investment record — main_balance is read-only here, not deducted
      const newInvestment = await tx.investment.create({
        data: {
          id: randomUUID(),
          user_id: user.id,
          plan_id: plan.id,
          amount: amount,
          remaining_principal: amount,
          monthly_interest_rate: monthlyRate,
          start_date: new Date(),
          status: 'ACTIVE'
        }
      });

      // Audit transaction log
      await tx.transaction.create({
        data: {
          id: randomUUID(),
          user_id: user.id,
          type: 'AUTO_REINVESTMENT',
          source_wallet: 'MAIN_BALANCE',
          destination_wallet: 'INVESTMENT',
          gross_amount: amount,
          net_amount: amount,
          status: 'COMPLETED',
          reference_id: newInvestment.id,
          description: `Auto-reinvestment on 28th: ${amount} USDT at ${monthlyRate}% monthly (${plan.name})`
        }
      });

      return newInvestment;
    }, { timeout: 10000 });

    return { skipped: false, investment };
  }

  /**
   * Main entry point — processes all users regardless of robot status.
   */
  async processMonthlyReinvestments() {
    // Get all users with wallets (no robot_status filter)
    const allUsers = await prisma.user.findMany({
      include: { Wallet: true }
    });

    if (allUsers.length === 0) {
      console.log('[MonthStartReinvestment] No users found.');
      return { processed: 0, skipped: 0, failed: 0, details: [] };
    }

    console.log(`[MonthStartReinvestment] Processing ${allUsers.length} users (no robot status filter).`);

    let processed = 0;
    let skipped = 0;
    let failed = 0;
    const details = [];

    for (const user of allUsers) {
      if (!user.Wallet) {
        console.warn(`[MonthStartReinvestment] User ${user.id} has no wallet — skipping.`);
        skipped++;
        details.push({ userId: user.id, status: 'skipped', reason: 'no wallet' });
        continue;
      }

      try {
        const result = await this.createReinvestmentForUser(user, user.Wallet);

        if (result.skipped) {
          console.log(`[MonthStartReinvestment] Skipped user ${user.id}: ${result.reason}`);
          skipped++;
          details.push({ userId: user.id, status: 'skipped', reason: result.reason });
        } else {
          console.log(
            `[MonthStartReinvestment] Created investment ${result.investment.id} for user ${user.id} — amount: ${result.investment.amount}`
          );
          processed++;
          details.push({ userId: user.id, status: 'success', investmentId: result.investment.id });
        }
      } catch (err) {
        console.error(`[MonthStartReinvestment] Failed for user ${user.id}:`, err.message);
        failed++;
        details.push({ userId: user.id, status: 'failed', error: err.message });
      }
    }

    console.log(
      `[MonthStartReinvestment] Done — processed: ${processed}, skipped: ${skipped}, failed: ${failed}`
    );

    return { processed, skipped, failed, details };
  }
}

export default new MonthStartReinvestmentService();
