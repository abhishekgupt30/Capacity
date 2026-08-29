import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AgentLogStep, AgentStatus, BottleneckReport, CreateTaskInput, MemberCapacity,
  OvertimeRequest, OvertimeStatus, RebalancePlan, RequestOvertimeInput, Task,
  TaskStatus, TeamMetrics
} from '../types';
import { useAuth } from './AuthContext';
import { teamService } from '../services/teamService';
import { taskService } from '../services/taskService';
import { overtimeService } from '../services/overtimeService';
import { agentService } from '../services/agentService';

interface CapacityContextType {
  members: MemberCapacity[];
  tasks: Task[];
  overtimeRequests: OvertimeRequest[];
  metrics: TeamMetrics;
  bottlenecks: BottleneckReport[];
  rebalancePlan: RebalancePlan | null;
  agentStatus: AgentStatus;
  agentLogs: AgentLogStep[];
  isLoading: boolean;
  error: string | null;
  runAgentRebalance: () => Promise<void>;
  approveAgentPlan: () => Promise<void>;
  rejectAgentPlan: (reason?: string) => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<Task>;
  updateTaskStatus: (task_id: string, status: TaskStatus) => Promise<Task>;
  reassignTask: (task_id: string, newAssigneeId: string, newAssigneeName?: string) => Promise<Task>;
  deleteTask: (task_id: string) => Promise<void>;
  submitOvertime: (input: RequestOvertimeInput) => Promise<OvertimeRequest>;
  reviewOvertime: (requestId: string, status: OvertimeStatus, notes?: string) => Promise<OvertimeRequest>;
  refreshData: () => Promise<void>;
}

const emptyMetrics: TeamMetrics = {
  team_id: '', team_name: '', department: '', active_resources: 0,
  efficiency_index: 0, total_capacity_hours: 0, total_allocated_hours: 0,
  utilization_rate: 0, blockers_identified: 0, avg_cycle_time_days: 0,
  critical_dependencies: 0, overloaded_members_count: 0, status: 'underutilized'
};

const CapacityContext = createContext<CapacityContextType | undefined>(undefined);

export const CapacityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [members, setMembers] = useState<MemberCapacity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequest[]>([]);
  const [metrics, setMetrics] = useState<TeamMetrics>(emptyMetrics);
  const [bottlenecks, setBottlenecks] = useState<BottleneckReport[]>([]);
  const [rebalancePlan, setRebalancePlan] = useState<RebalancePlan | null>(null);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('idle');
  const [agentLogs, setAgentLogs] = useState<AgentLogStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    if (!user?.team_id) { setIsLoading(false); return; }
    setIsLoading(true);
    setError(null);
    try {
      const teamId = user.team_id;
      const [nextMembers, nextTasks, nextOvertime, nextMetrics, nextBottlenecks] = await Promise.all([
        teamService.getTeamMembers(teamId),
        taskService.getTasks({ team_id: teamId }),
        overtimeService.getOvertimeRequests(teamId),
        teamService.getTeamMetrics(teamId),
        agentService.getBottlenecks(teamId)
      ]);
      setMembers(nextMembers);
      setTasks(nextTasks);
      setOvertimeRequests(nextOvertime);
      setMetrics(nextMetrics);
      setBottlenecks(nextBottlenecks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load application data.');
      setMembers([]); setTasks([]); setOvertimeRequests([]); setBottlenecks([]);
    } finally { setIsLoading(false); }
  }, [user?.team_id]);

  useEffect(() => { void refreshData(); }, [refreshData]);

  const runAgentRebalance = async () => {
    if (!user?.team_id) return;
    setAgentStatus('analyzing'); setAgentLogs([]);
    setError(null);
    try {
      const plan = await agentService.runRebalanceSimulation(user.team_id);
      setRebalancePlan(plan);
      setAgentLogs((plan.agent_log_steps || []).map((log, index) => ({
        step: index + 1, title: log.level.toUpperCase(), description: log.message,
        status: 'completed', timestamp: log.timestamp
      })));
      setAgentStatus('ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate a rebalancing plan.');
      setAgentStatus('error');
    }
  };

  const approveAgentPlan = async () => {
    if (!rebalancePlan) return;
    setIsLoading(true);
    await agentService.approvePlan(rebalancePlan.id);
    await refreshData();
    setAgentStatus('approved');
    try { confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } }); } catch { /* optional visual effect */ }
  };

  const rejectAgentPlan = async (reason?: string) => {
    if (!rebalancePlan) return;
    await agentService.rejectPlan(rebalancePlan.id, reason);
    setAgentStatus('rejected');
  };

  const createTask = async (input: CreateTaskInput) => {
    const created = await taskService.createTask(input); await refreshData(); return created;
  };
  const updateTaskStatus = async (task_id: string, status: TaskStatus) => {
    const updated = await taskService.updateTaskStatus(task_id, status); await refreshData(); return updated;
  };
  const reassignTask = async (task_id: string, newAssigneeId: string) => {
    const updated = await taskService.reassignTask(task_id, newAssigneeId); await refreshData(); return updated;
  };
  const deleteTask = async (task_id: string) => { await taskService.deleteTask(task_id); await refreshData(); };
  const submitOvertime = async (input: RequestOvertimeInput) => {
    const created = await overtimeService.submitRequest(input); await refreshData(); return created;
  };
  const reviewOvertime = async (requestId: string, status: OvertimeStatus, notes?: string) => {
    const updated = await overtimeService.reviewRequest(requestId, status, notes); await refreshData(); return updated;
  };

  return <CapacityContext.Provider value={{
    members, tasks, overtimeRequests, metrics, bottlenecks, rebalancePlan,
    agentStatus, agentLogs, isLoading, error, runAgentRebalance,
    approveAgentPlan, rejectAgentPlan, createTask, updateTaskStatus,
    reassignTask, deleteTask, submitOvertime, reviewOvertime, refreshData
  }}>{children}</CapacityContext.Provider>;
};

export const useCapacity = () => {
  const context = useContext(CapacityContext);
  if (!context) throw new Error('useCapacity must be used within a CapacityProvider');
  return context;
};
