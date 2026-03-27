// jobs/depositToInvestment.job.js

import { PrismaClient } from '@prisma/client';
import investmentService from '../services/investment.service.js';

const prisma = new PrismaClient();

class DepositToInvestmentJob {

  static async processAllPendingDeposits() {
    try {
      console.log('🧠 Starting deposit to investment conversion job...');

      // ✅ Efficient query (NO full table scan)
      const deposits = await prisma.deposit.findMany({
        where: {
          DepositeInvestmentRelations: {
            none: {}   //  no relation exists
          }
        },
        select: {
          id: true
        }
      });


      console.log(`Found ${deposits.length} deposits to process`);

      let successCount = 0;

      for (const deposit of deposits) {
        try {
          await investmentService.autoInvestFromDeposit(deposit.id);
          successCount++;
        } catch (error) {
          console.error(` Failed deposit ${deposit.id}:`, error.message);
        }
      }

      console.log(`✅ Job completed. Success: ${successCount}/${deposits.length}`);

    } catch (error) {
      console.error('❌ Job failed:', error);
      throw error;
    }
  }
}

export default DepositToInvestmentJob;