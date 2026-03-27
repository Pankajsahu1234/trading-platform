import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Month-End Deactivation Service
 * Runs on 27th of each month.
 * Marks all ACTIVE investments as INACTIVE so fresh investments
 * can be created on the 28th based on current main wallet balance.
 */
class MonthEndDeactivationService {
  async deactivateAllActiveInvestments() {
    const activeInvestments = await prisma.investment.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, user_id: true, amount: true }
    });

    if (activeInvestments.length === 0) {
      console.log('[MonthEndDeactivation] No active investments found.');
      return { deactivated: 0, failed: 0, details: [] };
    }

    console.log(`[MonthEndDeactivation] Found ${activeInvestments.length} active investments to deactivate.`);

    const results = await Promise.allSettled(
      activeInvestments.map(inv =>
        prisma.investment.update({
          where: { id: inv.id },
          data: { status: 'INACTIVE' }
        })
      )
    );

    const deactivated = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(
          `[MonthEndDeactivation] Failed to deactivate investment ${activeInvestments[i].id}:`,
          r.reason?.message
        );
      }
    });

    console.log(`[MonthEndDeactivation] Done — deactivated: ${deactivated}, failed: ${failed}`);

    return {
      deactivated,
      failed,
      details: activeInvestments.map((inv, i) => ({
        investmentId: inv.id,
        userId: inv.user_id,
        success: results[i].status === 'fulfilled'
      }))
    };
  }
}

export default new MonthEndDeactivationService();
