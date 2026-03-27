import investmentService from './investment.service.js';
import DepositToInvestmentJob from '../jobs/depositToInvestment.job.js';

export async function processPendingDeposits() {
  return await DepositToInvestmentJob.processAllPendingDeposits();
}

