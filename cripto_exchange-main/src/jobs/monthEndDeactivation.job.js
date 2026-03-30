import cron from 'node-cron';
import monthEndDeactivationService from '../services/investment/monthEndDeactivation.service.js';

let isRunning = false;

/**
 * Month-End Deactivation Job
 * Schedule: 27th of every month at 05:00 pm UTC
 * Marks all ACTIVE investments as INACTIVE.
 */
function startMonthEndDeactivationJob() {
 cron.schedule('30 3 28 * *', async () => {
    if (isRunning) {
      console.warn('[MonthEndDeactivationJob] Previous run still in progress — skipping.');
      return;
    }

    isRunning = true;
    console.log('[MonthEndDeactivationJob] Starting month-end investment deactivation...');
    const start = Date.now();

    try {
      const result = await monthEndDeactivationService.deactivateAllActiveInvestments();
      const duration = ((Date.now() - start) / 1000).toFixed(2);
      console.log(
        `[MonthEndDeactivationJob] Completed in ${duration}s — deactivated: ${result.deactivated}, failed: ${result.failed}`
      );
    } catch (err) {
      console.error('[MonthEndDeactivationJob] Fatal error:', err.message);
    } finally {
      isRunning = false;
    }
  }, {
    scheduled: true,
    timezone: 'UTC'
  });

  console.log('[MonthEndDeactivationJob] Scheduled — runs at 00:00 UTC on the 27th of each month.');
}

export default startMonthEndDeactivationJob;
