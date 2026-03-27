import cron from 'node-cron';
import monthStartReinvestmentService from '../services/investment/monthStartReinvestment.service.js';

let isRunning = false;

/**
 * Month-Start Reinvestment Job
 * Schedule: 28th of every month at 00:00 UTC
 * For every user with robot_status = ACTIVE:
 *   reads main_balance, picks the right plan, creates a new investment.
 */
function startMonthStartReinvestmentJob() {
  // '0 0 28 * *' → midnight on the 28th of every month
  cron.schedule('0 0 28 * *', async () => {
    if (isRunning) {
      console.warn('[MonthStartReinvestmentJob] Previous run still in progress — skipping.');
      return;
    }

    isRunning = true;
    console.log('[MonthStartReinvestmentJob] Starting monthly auto-reinvestment...');
    const start = Date.now();

    try {
      const result = await monthStartReinvestmentService.processMonthlyReinvestments();
      const duration = ((Date.now() - start) / 1000).toFixed(2);
      console.log(
        `[MonthStartReinvestmentJob] Completed in ${duration}s — processed: ${result.processed}, skipped: ${result.skipped}, failed: ${result.failed}`
      );
    } catch (err) {
      console.error('[MonthStartReinvestmentJob] Fatal error:', err.message);
    } finally {
      isRunning = false;
    }
  }, {
    scheduled: true,
    timezone: 'UTC'
  });

  console.log('[MonthStartReinvestmentJob] Scheduled — runs at 00:00 UTC on the 28th of each month.');
}

export default startMonthStartReinvestmentJob;
