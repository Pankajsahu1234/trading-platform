import { apiClient } from "./api";

export interface InvestmentGrowthData {
  time: string;
  price: number;
  volume: number;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  min_amount: number;
  max_amount: number | null;
  base_monthly_interest: number;
  description: string;
}

export interface Investment {
  id: string;
  amount: number;
  remaining_principal: number;
  monthly_interest_rate: number;
  start_date: string;
  status: string;
}

export interface InvestmentSummary {
  totalInvested: number;
  totalRemainingPrincipal: number;
  activeInvestments: number;
  profitBalance: number;
  investments: Investment[];
}

class InvestmentService {
  async getInvestmentGrowth(): Promise<InvestmentGrowthData[]> {
    try {
      const response = await apiClient.get<InvestmentGrowthData[]>(
        "/investments/growth"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching investment growth:", error);
      throw error;
    }
  }

  async getInvestmentPlans(): Promise<InvestmentPlan[]> {
    try {
      const response = await apiClient.get<InvestmentPlan[]>(
        "/investments/plans"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching investment plans:", error);
      throw error;
    }
  }

  async getInvestmentSummary(): Promise<InvestmentSummary> {
    try {
      const response = await apiClient.get<InvestmentSummary>(
        "/investments/summary"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching investment summary:", error);
      throw error;
    }
  }

  async getUserInvestments(status?: string): Promise<Investment[]> {
    try {
      const params = status ? { status } : {};
      const response = await apiClient.get<Investment[]>("/investments", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user investments:", error);
      throw error;
    }
  }

  async createInvestment(
    planId: string,
    amount: number
  ): Promise<Investment> {
    try {
      const response = await apiClient.post<Investment>("/investments", {
        plan_id: planId,
        amount,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating investment:", error);
      throw error;
    }
  }
}

export const investmentService = new InvestmentService();
