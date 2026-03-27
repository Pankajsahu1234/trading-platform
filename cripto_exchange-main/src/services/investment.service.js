import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto'
const prisma = new PrismaClient();

class InvestmentService {
  /**
   * Calculate monthly percentage based on investment amount (Tier Based)
   * < 1000     → 5%
   * 1000–5000  → 7%
   * 5001–10000 → 8%
   * > 10000    → 9%
   */
  calculateMonthlyPercentage(amount) {
    const numAmount = parseFloat(amount);

    if (numAmount < 1000) {
      return 5;
    } else if (numAmount <= 5000) {
      return 7;
    } else if (numAmount <= 10000) {
      return 8;
    } else {
      return 9;
    }
  }

  /**
   * Create new investment
   */
  async createInvestment(userId, planId, amount) {
    try {
      // Validate investment plan
      const plan = await prisma.investmentPlan.findUnique({
        where: { id: planId }
      });

      if (!plan) {
        throw new Error('Invalid investment plan');
      }

      // Check if amount is within plan limits
      const numAmount = parseFloat(amount);
      if (numAmount < parseFloat(plan.min_amount)) {
        throw new Error(`Minimum investment amount is ${plan.min_amount}`);
      }

      if (plan.max_amount && numAmount > parseFloat(plan.max_amount)) {
        throw new Error(`Maximum investment amount is ${plan.max_amount}`);
      }

      // Get user wallet
      const wallet = await prisma.wallet.findUnique({
        where: { user_id: userId }
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // Check if user has sufficient balance
      if (parseFloat(wallet.investment_balance) < numAmount) {
        throw new Error('Insufficient investment balance');
      }

      // Calculate monthly percentage based on tier
      const monthlyPercentage = this.calculateMonthlyPercentage(amount);

      // Create investment
      const investment = await prisma.$transaction(async (tx) => {
        // Deduct from investment balance
        await tx.wallet.update({
          where: { user_id: userId },
          data: {
            investment_balance: {
              decrement: amount
            }
          }
        });

        // Create investment record
        const newInvestment = await tx.investment.create({
          data: {
           id: randomUUID(),
            id: randomUUID(),
            user_id: userId,
            plan_id: planId,
            amount: amount,
            remaining_principal: amount,
            monthly_interest_rate: monthlyPercentage,
            start_date: new Date(),
            status: 'ACTIVE'
          }
        });

        // Create transaction record
        await tx.transaction.create({
          data: {
           id: randomUUID(),
            id: randomUUID(),
            user_id: userId,
            type: 'INVESTMENT',
            source_wallet: 'INVESTMENT_BALANCE',
            destination_wallet: 'INVESTMENT',
            gross_amount: amount,
            net_amount: amount,
            status: 'COMPLETED',
            reference_id: newInvestment.id,
            description: `Investment created with ${monthlyPercentage}% monthly interest`
          }
        });

        // Activate referral if this is user's first investment
        const referral = await tx.referral.findFirst({
          where: {
            referred_user_id: userId,
            activation_status: false
          }
        });

        if (referral) {
          await tx.referral.update({
            where: { id: referral.id },
            data: {
              activation_status: true,
              bonus_credited: false
            }
          });

          console.log(`Referral activated for user ${userId}`);
        }

        return newInvestment;
      }, {
        timeout: 10000 // 10 second timeout
      });

      return investment;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user investments
   */
  async getUserInvestments(userId, status = null) {
    try {
      const where = { user_id: userId };
      
      if (status) {
        where.status = status;
      }

      const investments = await prisma.investment.findMany({
        where,
        include: {
          InvestmentPlan: true
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      return investments;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get single investment details
   */
  async getInvestmentById(investmentId, userId) {
    try {
      const investment = await prisma.investment.findFirst({
        where: {
          id: investmentId,
          user_id: userId
        },
        include: {
          InvestmentPlan: true
        }
      });

      if (!investment) {
        throw new Error('Investment not found');
      }

      return investment;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Calculate daily interest for all active investments
   * Called by cron job daily
   * Only credits interest if user has ACTIVE robot status
   */
  async calculateDailyInterest() {
    try {
      const activeInvestments = await prisma.investment.findMany({
        where: {
          status: 'ACTIVE',
          remaining_principal: {
            gt: 0
          }
        },
        include: {
          User: true
        }
      });

      console.log(`Processing daily interest for ${activeInvestments.length} investments`);

      const results = [];

      let totalDailyInterest = 0;
      let skippedCount = 0;

      for (const investment of activeInvestments) {
        try {
          // Check if user has active robot status
          if (investment.User.robot_status !== 'ACTIVE') {
            console.log(
              `[DailyInterest] ⏭️  Skipped User:${investment.user_id} Inv:${investment.id} - Robot status: ${investment.User.robot_status}`
            );
            skippedCount++;
            results.push({
              investmentId: investment.id,
              userId: investment.user_id,
              skipped: true,
              reason: `Robot status is ${investment.User.robot_status}, not ACTIVE`,
              success: true
            });
            continue;
          }

          const dailyRate = parseFloat(investment.monthly_interest_rate) / 30 / 100;
          const remaining = parseFloat(investment.remaining_principal);
          const dailyInterest = remaining * dailyRate;
          totalDailyInterest += dailyInterest;

          console.log(
            `[DailyInterest] Inv:${investment.id} User:${investment.user_id}` +
              ` Principal:${remaining.toFixed(2)} Rate:${investment.monthly_interest_rate}%` +
              ` DailyRate:${(dailyRate * 100).toFixed(4)}% Interest:+${dailyInterest.toFixed(2)}`
          );

          // Add to profit wallet
          await prisma.$transaction(async (tx) => {
            await tx.wallet.update({
              where: { user_id: investment.user_id },
              data: {
                profit_balance: {
                  increment: dailyInterest
                },
                 total_profit: {
                  increment: dailyInterest
                },

              }
            });

            // Log transaction
            await tx.transaction.create({
              data: {
               id: randomUUID(),
                id: randomUUID(),
                user_id: investment.user_id,
                type: 'DAILY_INTEREST',
                source_wallet: 'INVESTMENT',
                destination_wallet: 'PROFIT_BALANCE',
                gross_amount: dailyInterest,
                net_amount: dailyInterest,
                status: 'COMPLETED',
                reference_id: investment.id,
                description: `Daily interest credited: ${dailyInterest.toFixed(2)} (Rate: ${investment.monthly_interest_rate}%)`
              }
            });
          });

          results.push({
            investmentId: investment.id,
            userId: investment.user_id,
            dailyInterest,
            success: true
          });
        } catch (error) {
          console.error(`Error processing investment ${investment.id}:`, error.message);
          results.push({
            investmentId: investment.id,
            userId: investment.user_id,
            error: error.message,
            success: false
          });
        }
      }

      const creditedCount = results.filter(r => r.success && !r.skipped).length;
      console.log(`🎯 Daily interest summary:`);
      console.log(`   - Credited: ${creditedCount} investments | Total: ${totalDailyInterest.toFixed(2)}`);
      console.log(`   - Skipped: ${skippedCount} investments (inactive robot status)`);
      return results;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Withdraw profit (allowed anytime)
   */
  async withdrawProfit(userId, amount) {
    try {
      const wallet = await prisma.wallet.findUnique({
        where: { user_id: userId }
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const numAmount = parseFloat(amount);
      
      if (parseFloat(wallet.profit_balance) < numAmount) {
        throw new Error('Insufficient profit balance');
      }

      const withdrawal = await prisma.$transaction(async (tx) => {
        // Deduct from profit balance
        await tx.wallet.update({
          where: { user_id: userId },
          data: {
            profit_balance: {
              decrement: amount
            }
          }
        });

        // Create withdrawal record
        const newWithdrawal = await tx.withdrawal.create({
          data: {
           id: randomUUID(),
            id: randomUUID(),
            user_id: userId,
            type: 'PROFIT',
            requested_amount: amount,
            net_amount: amount,
            status: 'PENDING',
            ticket_raised_date: new Date()
          }
        });

        // Create transaction record
        await tx.transaction.create({
          data: {
           id: randomUUID(),
            id: randomUUID(),
            user_id: userId,
            type: 'PROFIT_WITHDRAWAL',
            source_wallet: 'PROFIT_BALANCE',
            destination_wallet: 'EXTERNAL',
            gross_amount: amount,
            net_amount: amount,
            status: 'PENDING',
            reference_id: newWithdrawal.id,
            description: 'Profit withdrawal requested'
          }
        });

        return newWithdrawal;
      });

      return withdrawal;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Withdraw principal (only on 28th, partial allowed, FIFO)
   */
  async withdrawPrincipal(userId, amount) {
    try {
      // Check if today is 28th
      const today = new Date();
      const dayOfMonth = today.getDate();

      if (dayOfMonth !== 28) {
        throw new Error('Principal withdrawal is only allowed on the 28th of each month');
      }

      // Check if user already has a pending principal withdrawal this month
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const startOfMonth = new Date(currentYear, currentMonth, 1);
      const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

      const existingWithdrawal = await prisma.withdrawal.findFirst({
        where: {
          user_id: userId,
          type: 'PRINCIPAL',
          created_at: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      });

      if (existingWithdrawal) {
        throw new Error('You already have a principal withdrawal request for this month');
      }

      // Get all active investments ordered by start_date (FIFO)
      const investments = await prisma.investment.findMany({
        where: {
          user_id: userId,
          status: 'ACTIVE',
          remaining_principal: {
            gt: 0
          }
        },
        orderBy: {
          start_date: 'asc'
        }
      });

      if (investments.length === 0) {
        throw new Error('No active investments found');
      }

      // Calculate total remaining principal
      const totalPrincipal = investments.reduce((sum, inv) => {
        return sum + parseFloat(inv.remaining_principal);
      }, 0);

      const numAmount = parseFloat(amount);

      if (numAmount > totalPrincipal) {
        throw new Error(`Withdrawal amount exceeds total remaining principal (${totalPrincipal})`);
      }

      // Process FIFO withdrawal
      const withdrawal = await prisma.$transaction(async (tx) => {
        let remainingToWithdraw = numAmount;
        const affectedInvestments = [];

        for (const investment of investments) {
          if (remainingToWithdraw <= 0) break;

          const investmentPrincipal = parseFloat(investment.remaining_principal);
          const deductAmount = Math.min(remainingToWithdraw, investmentPrincipal);
          const newRemainingPrincipal = investmentPrincipal - deductAmount;

          // Update investment
          await tx.investment.update({
            where: { id: investment.id },
            data: {
              remaining_principal: newRemainingPrincipal,
              status: newRemainingPrincipal === 0 ? 'COMPLETED' : 'ACTIVE'
            }
          });

          affectedInvestments.push({
            id: investment.id,
            deducted: deductAmount,
            newRemaining: newRemainingPrincipal
          });

          remainingToWithdraw -= deductAmount;
        }

        // Create withdrawal record
        const newWithdrawal = await tx.withdrawal.create({
          data: {
           id: randomUUID(),
            id: randomUUID(),
            user_id: userId,
            type: 'PRINCIPAL',
            requested_amount: amount,
            net_amount: amount,
            status: 'PENDING',
            ticket_raised_date: new Date()
          }
        });

        // Create transaction record
        await tx.transaction.create({
          data: {
           id: randomUUID(),
            id: randomUUID(),
            user_id: userId,
            type: 'PRINCIPAL_WITHDRAWAL',
            source_wallet: 'INVESTMENT',
            destination_wallet: 'PENDING_WITHDRAWAL',
            gross_amount: amount,
            net_amount: amount,
            status: 'PENDING',
            reference_id: newWithdrawal.id,
            description: `Principal withdrawal requested (affects ${affectedInvestments.length} investments)`
          }
        });

        return {
          withdrawal: newWithdrawal,
          affectedInvestments
        };
      });

      return withdrawal;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get investment summary for user
   */
  async getInvestmentSummary(userId) {
    try {
      const investments = await prisma.investment.findMany({
        where: {
          user_id: userId,
          status: 'ACTIVE'
        }
      });

      const summary = {
        totalInvested: 0,
        totalRemainingPrincipal: 0,
        activeInvestments: investments.length,
        investments: []
      };

      investments.forEach(inv => {
        summary.totalInvested += parseFloat(inv.amount);
        summary.totalRemainingPrincipal += parseFloat(inv.remaining_principal);
        summary.investments.push({
          id: inv.id,
          amount: inv.amount,
          remainingPrincipal: inv.remaining_principal,
          monthlyRate: inv.monthly_interest_rate,
          startDate: inv.start_date
        });
      });

      const wallet = await prisma.wallet.findUnique({
        where: { user_id: userId }
      });

      summary.profitBalance = wallet ? wallet.profit_balance : 0;

      return summary;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all investment plans
   */
  async getInvestmentPlans() {
    try {
      const plans = await prisma.investmentPlan.findMany({
        orderBy: {
          min_amount: 'asc'
        }
      });

      return plans;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Auto create investment from deposit (cron job)
   */
  async autoInvestFromDeposit(depositId) {
    return await prisma.$transaction(async (tx) => {
      //  Lock + check (prevents race condition)
      const deposit = await tx.deposit.findFirst({
        where: {
          id: depositId,
        }
      });
      if (!deposit) {
        throw new Error(`Deposit not found or already processed: ${depositId}`);
      }
      const amount = Number(deposit.amount);

      //  Plan selection
      const plan = await tx.investmentPlan.findFirst({
        where: {
          min_amount: amount < 1000 ? 100 : 1000
        }
      });

      if (!plan) {
        throw new Error(`No suitable investment plan for amount ${amount}`);
      }
      let monthly_rate;

      if (amount < 1000) {
        monthly_rate = 5;
      } else if (amount >= 1000 && amount < 5000) {
        monthly_rate = 7;
      } else if (amount >= 5000 && amount < 10000) {
        monthly_rate = 8;
      } else {
        monthly_rate = 9;
      }
      //  Create investment (INSIDE TX)
      const newInvestment = await tx.investment.create({
              data: {
                user_id: deposit.user_id,
                plan_id: plan.id,
                amount: amount,
                status: 'ACTIVE', // optional but recommended
                remaining_principal:amount,
                monthly_interest_rate:monthly_rate,
                start_date: new Date()
              }
            })
      //  Create relation
      await tx.depositeInvestmentRelation.create({
        data: {
          depositeId: depositId,
          investmentId: newInvestment.id
        }
      });

      console.log(`✅ Auto-invested deposit ${depositId} → investment ${newInvestment.id}`);

      return newInvestment;
    },
    {
    timeout: 15000 // 15 seconds
  });
  }
}

export default new InvestmentService();
