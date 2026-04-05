import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class AdminDashboardService {
  async getDashboardStats() {
    // total users
    const totalUsers = await prisma.user.count();

    // total deposits from Deposit table
    const depositSum = await prisma.deposit.aggregate({
      _sum: {
        amount: true,
      },
    });

    // total withdrawals (only completed ones)
    const withdrawalSum = await prisma.withdrawal.aggregate({
      where: {
        status: "Completed",
      },
      _sum: {
        requested_amount: true,
      },
    });

    // robot activated users
    const robotUsers = await prisma.user.count({
      where: {
        robot_status: "ACTIVE",
      },
    });

    return {
      totalUsers,
      totalDeposits: Number(depositSum._sum.amount || 0),
      totalWithdrawals: Number(withdrawalSum._sum.requested_amount || 0),
      robotActivatedUsers: robotUsers,
    };
  }
}

export default new AdminDashboardService();
