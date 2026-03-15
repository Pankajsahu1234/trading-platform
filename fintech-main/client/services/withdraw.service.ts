import { apiClient } from "./api";

// ─── Request Payload ────────────────────────────────────────────────
export interface WithdrawalRequest {
  type: "PROFIT" | "PRINCIPAL";
  amount: number;
  walletAddress: string;
}

// ─── API Response ───────────────────────────────────────────────────
export interface WithdrawalData {
  name: string;
  withdrawalType: "PROFIT" | "PRINCIPAL";
  walletAddress: string;
  requestedAmount: number;
  penaltyAmount?: number; // only present for PRINCIPAL
  finalAmount: number;
}

export interface WithdrawalResponse {
  success: boolean;
  message: string;
  data: WithdrawalData;
}

// ─── Service ────────────────────────────────────────────────────────
const withdrawService = {
  initiateWithdrawal: async (payload: WithdrawalRequest): Promise<WithdrawalResponse> => {
    const response = await apiClient.post<WithdrawalResponse>(
      "/withdrawals/request",
      payload
    );
    return response.data;
  },
};

export default withdrawService;