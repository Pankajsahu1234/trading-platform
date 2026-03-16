import { apiClient } from "./api";

export interface RobotStatus {
  robot_status: "ACTIVE" | "INACTIVE";
  isExpired: boolean;
  activation_timestamp: string | null;
  expiry_date: string | null;
}

export interface RobotStatusResponse {
  success: boolean;
  data: RobotStatus;
}

export interface RobotActivationResponse {
  success: boolean;
  message: string;
}

class RobotService {
  async getStatus(): Promise<RobotStatus> {
    const response = await apiClient.get<RobotStatusResponse>("/robot/status");
    return response.data.data;
  }

  async activate(tx_hash: string, deposit_address: string): Promise<RobotActivationResponse> {
    const response = await apiClient.post<RobotActivationResponse>("/robot/activate", {
      tx_hash,
      deposit_address,
    });
    return response.data;
  }
}

export const robotService = new RobotService();