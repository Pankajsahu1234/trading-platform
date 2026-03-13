import { useState, useMemo, useEffect, useCallback } from "react";
import { userService } from "../services/userService";
import { withdrawalService } from "../services/withdrawalService";
import { transactionService } from "../services/transactionService";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Fetch all users on mount
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.getAll();
      // API returns { success, message, data: [...] }
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : [];
      setUsers(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWithdrawals = useCallback(async () => {
    try {
      const res = await withdrawalService.getAdminPending();
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : [];
      setWithdrawals(list);
    } catch (err) {
      console.error("Failed to fetch withdrawals:", err.message);
    }
  }, []);

  // transactions fetch
  const fetchTransactions = useCallback(
    async (opts = { page: 1, limit: 10, type: "all" }) => {
      try {
        const res = await transactionService.getHistory(opts);
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];
        setTransactions(list);
      } catch (err) {
        console.error("Failed to fetch transactions:", err.message);
      }
    },
    [],
  );

  useEffect(() => {
    fetchUsers();
    fetchWithdrawals();
    fetchTransactions();
  }, [fetchUsers, fetchWithdrawals, fetchTransactions]);

  // Memoized Stats for the StatCards
  const stats = useMemo(
    () => ({
      totalUsers: users.length,
      totalDeposits: users.reduce((acc, u) => acc + (u?.totalDeposit || 0), 0),
      totalWithdrawn: users.reduce(
        (acc, u) => acc + (u?.totalWithdrawal || 0),
        0,
      ),
      platinum: users.filter((u) => u?.rank === "Platinum").length,
    }),
    [users],
  );

  // Update user via API (name + phone)
  const updateUser = async (userId, data) => {
    const updated = await userService.update(userId, data);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updated } : u)),
    );
    return updated;
  };

  // Delete user locally (no delete endpoint provided)
  const deleteUser = (id) =>
    setUsers((prev) => prev.filter((u) => u.id !== id));

  // Withdrawal Actions
  const handleWithdrawalAction = async (withdrawal, status) => {
    try {
      if (status === "Approved") {
        await withdrawalService.approveWithdrawal(withdrawal.id);
      } else if (status === "Rejected") {
        await withdrawalService.rejectWithdrawal(withdrawal.id);
      }
      // Remove the withdrawal from pending list
      setWithdrawals((prev) => prev.filter((w) => w.id !== withdrawal.id));
      // Add to transactions with final status
      const newTransaction = {
        ...withdrawal,
        status,
        processedAt: new Date().toISOString(),
      };
      setTransactions((prev) => [newTransaction, ...prev]);
    } catch (err) {
      console.error("Withdrawal action failed:", err.message);
      alert(`Failed to ${status.toLowerCase()} withdrawal: ${err.message}`);
    }
  };

  return {
    users,
    loading,
    error,
    withdrawals,
    transactions,
    stats,
    updateUser,
    deleteUser,
    handleWithdrawalAction,
    refetchUsers: fetchUsers,
  };
};
