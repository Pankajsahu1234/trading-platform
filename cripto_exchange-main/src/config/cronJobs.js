import cron from 'node-cron';
import investmentService from '../services/investment.service.js';
import DepositToInvestmentJob from '../jobs/depositToInvestment.job.js';
import startMonthEndDeactivationJob from '../jobs/monthEndDeactivation.job.js';
import startMonthStartReinvestmentJob from '../jobs/monthStartReinvestment.job.js';

class CronJobs {
  /**
   * Initialize all cron jobs
   */
  init() {
    // Daily interest calculation - runs at midnight every day (00:00)
    this.scheduleDailyInterestCalculation();

    // Deposit to investment conversion - every 10 minutes
    this.scheduleDepositToInvestment();
    // 27th: deactivate all active investments
    startMonthEndDeactivationJob();

    // 28th: auto-reinvest from main wallet for robot-active users
    startMonthStartReinvestmentJob();

    console.log('✅ Cron jobs initialized');
  }

  /**
   * Deposit to investment cron job
   * Runs every 10 minutes
   */
  scheduleDepositToInvestment() {
    cron.schedule('*/30 * * * * *', async () => {
      try {
        console.log(' Running deposit to investment job...');
        const startTime = Date.now();

        const results = await DepositToInvestmentJob.processAllPendingDeposits();

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        
        console.log(`✅ Deposit to investment job completed in ${duration}s. Success: ${successful}/${results.length}`);
      } catch (error) {
        console.error('❌ Deposit to investment job failed:', error);
      }
    }, {
      scheduled: true,
      timezone: "UTC"
    });

    console.log('🔄 Deposit to investment scheduled (*/10 * * * *)');
  }

  /**
   * Daily interest calculation cron job
   * Runs at 00:00 (midnight) every day
   */
  scheduleDailyInterestCalculation() {
    cron.schedule('* * * * *', async () => {
      try {
        console.log('🕐 Starting daily interest calculation...');
        const startTime = Date.now();

        const results = await investmentService.calculateDailyInterest();

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        console.log(`✅ Daily interest calculation completed in ${duration}s`);
        console.log(`   - Successful: ${successful}`);
        console.log(`   - Failed: ${failed}`);

        if (failed > 0) {
          console.error('❌ Some interest calculations failed:', 
            results.filter(r => !r.success)
          );
        }
      } catch (error) {
        console.error('❌ Daily interest calculation failed:', error);
      }
    }, {
      scheduled: true,
      timezone: "UTC" // Change to your timezone if needed
    });

    console.log('📅 Daily interest calculation scheduled (runs at 00:00 UTC)');
  }

  /**
   * Manual trigger for testing
   */
  async triggerDailyInterestCalculation() {
    try {
      console.log('🔧 Manually triggering daily interest calculation...');
      const results = await investmentService.calculateDailyInterest();
      console.log('✅ Manual trigger completed:', results);
      return results;
    } catch (error) {
      console.error('❌ Manual trigger failed:', error);
      throw error;
    }
  }
}

export default new CronJobs();
