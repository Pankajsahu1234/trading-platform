import express from 'express';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';
import monthEndDeactivationService from '../services/investment/monthEndDeactivation.service.js';
import monthStartReinvestmentService from '../services/investment/monthStartReinvestment.service.js';

const router = express.Router();

/**
 * POST /api/admin/cron/trigger/month-end-deactivation
 * Manually runs the 27th job — marks all ACTIVE investments as INACTIVE.
 */
router.post(
  '/cron/trigger/month-end-deactivation',
  async (req, res) => {
    try {
      console.log('[AdminCronTest] Manual trigger: month-end-deactivation');
      const start = Date.now();

      const result = await monthEndDeactivationService.deactivateAllActiveInvestments();

      res.json({
        success: true,
        durationMs: Date.now() - start,
        result
      });
    } catch (err) {
      console.error('[AdminCronTest] month-end-deactivation failed:', err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

/**
 * POST /api/admin/cron/trigger/month-start-reinvestment
 * Manually runs the 28th job — creates new investments for robot-active users.
 */
router.post(
  '/cron/trigger/month-start-reinvestment',
  async (req, res) => {
    try {
      console.log('[AdminCronTest] Manual trigger: month-start-reinvestment');
      const start = Date.now();

      const result = await monthStartReinvestmentService.processMonthlyReinvestments();

      res.json({
        success: true,
        durationMs: Date.now() - start,
        result
      });
    } catch (err) {
      console.error('[AdminCronTest] month-start-reinvestment failed:', err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

export default router;
