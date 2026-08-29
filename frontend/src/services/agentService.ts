import { RebalancePlan, BottleneckReport, AgentLogStep } from '../types';
import { api } from './api';

export const agentService = {
  async getBottlenecks(team_id: string): Promise<BottleneckReport[]> {
    return await api.get<BottleneckReport[]>(`/agent/bottlenecks?team_id=${team_id}`);
  },

  async runRebalanceSimulation(team_id: string): Promise<RebalancePlan> {
    return await api.post<RebalancePlan>('/agent/rebalance', { team_id: team_id });
  },

  async approvePlan(planId: string): Promise<{ success: boolean; message: string }> {
    return await api.post<{ success: boolean; message: string }>(`/agent/plans/${planId}/approve`);
  },

  async rejectPlan(planId: string, reason?: string): Promise<{ success: boolean; message: string }> {
    return await api.post<{ success: boolean; message: string }>(`/agent/plans/${planId}/reject`, { reason });
  }
};
