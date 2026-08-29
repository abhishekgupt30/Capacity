import { RebalancePlan, BottleneckReport, AgentLogStep } from '../types';
import { DEFAULT_REBALANCE_PLAN, BOTTLENECK_ALERTS } from '../data/mockData';
import { api } from './api';

export const agentService = {
  async getBottlenecks(teamId: string = 'team_alpha_01'): Promise<BottleneckReport[]> {
    try {
      return await api.get<BottleneckReport[]>(`/agent/bottlenecks?team_id=${teamId}`);
    } catch {
      return BOTTLENECK_ALERTS;
    }
  },

  async runRebalanceSimulation(teamId: string = 'team_alpha_01'): Promise<RebalancePlan> {
    try {
      return await api.post<RebalancePlan>('/agent/rebalance', { team_id: teamId });
    } catch {
      return {
        ...DEFAULT_REBALANCE_PLAN,
        id: `plan_sim_${Date.now()}`,
        generatedAt: new Date().toISOString()
      };
    }
  },

  async approvePlan(planId: string): Promise<{ success: boolean; message: string }> {
    try {
      return await api.post<{ success: boolean; message: string }>(`/agent/plans/${planId}/approve`);
    } catch {
      // Execute the rebalancing in local state:
      // Marcus: 48h -> 38h
      // Elena: 26h -> 36h
      const savedMembers = localStorage.getItem('capacita_team_members');
      if (savedMembers) {
        const members = JSON.parse(savedMembers);
        const updated = members.map((m: any) => {
          if (m.id === 'usr_marcus_02') {
            return {
              ...m,
              allocatedHours: 38,
              overtimeHours: 0,
              efficiencyIndex: 92,
              blockersCount: 0,
              status: 'balanced'
            };
          }
          if (m.id === 'usr_elena_03') {
            return {
              ...m,
              allocatedHours: 36,
              efficiencyIndex: 94,
              blockersCount: 0,
              status: 'balanced'
            };
          }
          return m;
        });
        localStorage.setItem('capacita_team_members', JSON.stringify(updated));
      }

      // Reassign task_04 and task_05 in local tasks
      const savedTasks = localStorage.getItem('capacita_tasks');
      if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        const updatedTasks = tasks.map((t: any) => {
          if (t.id === 'task_04' || t.id === 'task_05') {
            return {
              ...t,
              assigneeId: 'usr_elena_03',
              assigneeName: 'Elena Rostova',
              blockerRisk: false
            };
          }
          return t;
        });
        localStorage.setItem('capacita_tasks', JSON.stringify(updatedTasks));
      }

      localStorage.setItem('capacita_agent_last_status', 'approved');
      return {
        success: true,
        message: 'Plan approved. 10 hours of workload successfully shifted from Marcus Vance to Elena Rostova. Alpha Pod velocity restored.'
      };
    }
  },

  async rejectPlan(planId: string, reason?: string): Promise<{ success: boolean; message: string }> {
    try {
      return await api.post<{ success: boolean; message: string }>(`/agent/plans/${planId}/reject`, { reason });
    } catch {
      localStorage.setItem('capacita_agent_last_status', 'rejected');
      return {
        success: true,
        message: 'Rebalancing plan rejected by manager.'
      };
    }
  }
};
