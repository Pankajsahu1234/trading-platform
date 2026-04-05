// src/services/user.service.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  status: true,
  referral_count: true,
  referral_rank_id: true,
  created_at: false,
  is_email_verified: true,
  two_factor_enabled: true,
  lock_until: false,
  referral_code: true,
};

const basicUserSelect = {
  name: true,
  email: true,
  phone: true,
  status: true,
  referral_code: true,
};
// 🔹 Create User
async function createUser(data) {
  return await prisma.user.create({
    data,
    select: publicUserSelect,
  });
}

// 🔹 Get All Users
async function getAllUsers() {
  const users = await prisma.user.findMany({
    select: publicUserSelect,
    orderBy: { created_at: "desc" },
  });

  // Fetch total deposits and withdrawals for each user
  const usersWithTotals = await Promise.all(
    users.map(async (user) => {
      // Calculate total deposits
      const depositResult = await prisma.deposit.aggregate({
        where: { user_id: user.id },
        _sum: { amount: true },
      });

      // Calculate total withdrawals (only completed ones)
      const withdrawalResult = await prisma.withdrawal.aggregate({
        where: { user_id: user.id, status: "Completed" },
        _sum: { requested_amount: true },
      });

      return {
        ...user,
        total_deposit: depositResult._sum.amount
          ? Number(depositResult._sum.amount)
          : 0,
        total_withdrawal: withdrawalResult._sum.requested_amount
          ? Number(withdrawalResult._sum.requested_amount)
          : 0,
      };
    }),
  );

  return usersWithTotals;
}

// 🔹 Get Single User
async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });

  if (!user) return null;

  // Calculate total deposits
  const depositResult = await prisma.deposit.aggregate({
    where: { user_id: id },
    _sum: { amount: true },
  });

  // Calculate total withdrawals (only completed ones)
  const withdrawalResult = await prisma.withdrawal.aggregate({
    where: { user_id: id, status: "Completed" },
    _sum: { requested_amount: true },
  });

  return {
    ...user,
    total_deposit: depositResult._sum.amount
      ? Number(depositResult._sum.amount)
      : 0,
    total_withdrawal: withdrawalResult._sum.requested_amount
      ? Number(withdrawalResult._sum.requested_amount)
      : 0,
  };
}

async function getUserByRefralCode(referral_code) {
  return await prisma.user.findUnique({
    where: { referral_code },
    select: basicUserSelect,
  });
}

// 🔹 Update User
async function updateUser(id, data) {
  return await prisma.user.update({
    where: { id },
    data,
    select: publicUserSelect,
  });
}

// 🔹 Delete User
async function deleteUser(id) {
  return await prisma.user.delete({
    where: { id },
  });
}

export {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByRefralCode,
};
