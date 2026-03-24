import { apiClient } from "./api";

export interface ReceiverSearchRequest {
  identifier: string;
}

export interface ReceiverInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface SearchReceiverResponse {
  success: boolean;
  message?: string;
  data: ReceiverInfo;
}

export interface TransferRequest {
  receiver: string;
  amount: number;
  description?: string;
  transactionCode: string;
}

export interface TransferResponse {
  success: boolean;
  transferId: string;
  receiver: ReceiverInfo;
  amount: number;
  description?: string;
  timestamp: string;
  newBalance: number;
  message?: string;
}

class TransferService {
  /**
   * Search for a receiver by email, phone, or user ID
   */
  async searchReceiver(identifier: string): Promise<ReceiverInfo> {
    try {
      const response = await apiClient.post<SearchReceiverResponse>(
        "/transfers/search-receiver",
        { identifier },
      );

      if (!response.data.success) {
        throw new Error("Receiver not found");
      }

      // Extract receiver from nested data property
      const receiverData = response.data.data;
      if (!receiverData) {
        throw new Error("Invalid response from server");
      }

      return receiverData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Initiate a P2P transfer
   */
  async initiateTransfer(data: TransferRequest): Promise<TransferResponse> {
    try {
      const response = await apiClient.post<TransferResponse>(
        "/transfers",
        data,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Transfer failed");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const transferService = new TransferService();
