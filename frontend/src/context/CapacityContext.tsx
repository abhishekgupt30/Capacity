import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  MemberCapacity, 
  Task, 
  OvertimeRequest, 
  TeamMetrics, 
  RebalancePlan, 
  AgentStatus,
  CreateTaskInput,
  TaskStatus,
  RequestOvertimeInput,
  OvertimeStatus,
  BottleneckReport,
  AgentLogStep
} from '../types';
import { 
  INITIAL_MEMBERS, 
  INITIAL_TASKS, 
  INITIAL_OVERTIME_REQUESTS, 
  INITIAL_TEAM_METRICS,
  DEFAULT_REBALANCE_PLAN,
  BOTTLENECK_ALERTS
} from '../data/mockData';
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
  
  // Actions
  runAgentRebalance: () => Promise<void>;
  approveAgentPlan: () => Promise<void>;
  rejectAgentPlan: (reason?: string) => Promise<void>;
  resetToInitialDemoState: () => void;
  
  // Task Actions
  createTask: (input: CreateTaskInput) => Promise<Task>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<Task>;
  reassignTask: (taskId: string, newAssigneeId: string, newAssigneeName: string) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;
  
  // Overtime Actions
  submitOvertime: (input: RequestOvertimeInput) => Promise<OvertimeRequest>;
  reviewOvertime: (requestId: string, status: OvertimeStatus, notes?: string) => Promise<OvertimeRequest>;
  
  // Refreshes
  refreshData: () => Promise<void>;
}

const CapacityContext = createContext<CapacityContextType | undefined>(undefined);

export const CapacityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<MemberCapacity[]>(INITIAL_MEMBERS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequest[]>(INITIAL_OVERTIME_REQUESTS);
  const [metrics, setMetrics] = useState<TeamMetrics>(INITIAL_TEAM_METRICS);
  const [bottlenecks, setBottlenecks] = useState<BottleneckReport[]>(BOTTLENECK_ALERTS);
  const [rebalancePlan, setRebalancePlan] = useState<RebalancePlan | null>(null);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('idle');
  const [agentLogs, setAgentLogs] = useState<AgentLogStep[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load persisted data or defaults on mount
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedMembers, fetchedTasks, fetchedOT, fetchedMetrics, fetchedBottlenecks] = await Promise.all([
        teamService.getTeamMembers('team_alpha_01'),
        taskService.getTasks({ teamId: 'team_alpha_01' }),
        overtimeService.getOvertimeRequests('team_alpha_01'),
        teamService.getTeamMetrics('team_alpha_01'),
        agentService.getBottlenecks('team_alpha_01')
      ]);
      setMembers(fetchedMembers);
      setTasks(fetchedTasks);
      setOvertimeRequests(fetchedOT);
      setMetrics(fetchedMetrics);
      setBottlenecks(fetchedBottlenecks);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Recalculate metrics when members change
  useEffect(() => {
    const totalAllocated = members.reduce((acc, m) => acc + m.allocatedHours, 0);
    const totalCapacity = members.reduce((acc, m) => acc + m.weeklyCapacity, 0);
    const overloaded = members.filter(m => m.allocatedHours > m.weeklyCapacity).length;
    const totalBlockers = members.reduce((acc, m) => acc + m.blockersCount, 0);
    const utilization = totalCapacity > 0 ? (totalAllocated / totalCapacity) * 100 : 78.4;
    
    // Average efficiency
    const avgEff = members.length > 0
      ? Math.round(members.reduce((acc, m) => acc + m.efficiencyIndex, 0) / members.length)
      : 72;

    setMetrics(prev => ({
      ...prev,
      totalAllocatedHours: totalAllocated,
      totalCapacityHours: totalCapacity,
      utilizationRate: Number(utilization.toFixed(1)),
      overloadedMembersCount: overloaded,
      blockersIdentified: totalBlockers,
      efficiencyIndex: avgEff,
      status: overloaded > 0 ? 'overloaded' : utilization >= 85 ? 'approaching' : 'balanced'
    }));
  }, [members]);

  // Agent Rebalancing Simulation flow with realistic pipeline steps
  const runAgentRebalance = async () => {
    setAgentStatus('analyzing');
    setAgentLogs([
      { step: 1, title: 'Initializing Capacita Neural Engine', description: 'Accessing telemetry streams for Alpha Pod...', status: 'active' }
    ]);

    await new Promise(r => setTimeout(r, 600));
    setAgentLogs(prev => [
      { ...prev[0], status: 'completed' },
      { step: 2, title: 'Fetching Live Workloads & Git/Jira Telemetry', description: 'Discovered 4 active blockers and 18 backlog PR reviews.', status: 'active' }
    ]);

    await new Promise(r => setTimeout(r, 650));
    setAgentLogs(prev => [
      prev[0],
      { ...prev[1], status: 'completed' },
      { step: 3, title: 'Evaluating Capacity & Cognitive Strain Baselines', description: 'Marcus Vance operating at 120% capacity (48h/40h). Elena Rostova at 65% (26h/40h).', status: 'active' }
    ]);

    setAgentStatus('simulating');
    await new Promise(r => setTimeout(r, 700));
    setAgentLogs(prev => [
      prev[0],
      prev[1],
      { ...prev[2], status: 'completed' },
      { step: 4, title: 'Detecting Architectural Bottlenecks & PR Drag', description: 'Kafka partition deadlocks & Redis v7.2 cluster key migration require redistribution.', status: 'active' }
    ]);

    await new Promise(r => setTimeout(r, 650));
    setAgentLogs(prev => [
      prev[0],
      prev[1],
      prev[2],
      { ...prev[3], status: 'completed' },
      { step: 5, title: 'Simulating Optimal Task Shifts & Skill Affinities', description: 'Computed 10h task transfer to Elena Rostova (PostgreSQL/Redis expert).', status: 'active' }
    ]);

    await new Promise(r => setTimeout(r, 600));
    const plan = await agentService.runRebalanceSimulation('team_alpha_01');
    setRebalancePlan(plan);
    setAgentLogs(prev => [
      prev[0],
      prev[1],
      prev[2],
      prev[3],
      { ...prev[4], status: 'completed' },
      { step: 6, title: 'Rebalancing Plan Ready — Manager Approval Required', description: 'Awaiting explicit authorization from Engineering Leadership.', status: 'completed' }
    ]);
    setAgentStatus('ready');
  };

  const approveAgentPlan = async () => {
    if (!rebalancePlan) return;
    setIsLoading(true);
    await agentService.approvePlan(rebalancePlan.id);

    // Update local state directly
    setMembers(prev => prev.map(m => {
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
    }));

    setTasks(prev => prev.map(t => {
      if (t.id === 'task_04' || t.id === 'task_05') {
        return {
          ...t,
          assigneeId: 'usr_elena_03',
          assigneeName: 'Elena Rostova',
          assigneeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          blockerRisk: false
        };
      }
      return t;
    }));

    setBottlenecks([]);
    setAgentStatus('approved');
    setIsLoading(false);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const rejectAgentPlan = async (reason?: string) => {
    if (!rebalancePlan) return;
    await agentService.rejectPlan(rebalancePlan.id, reason);
    setAgentStatus('rejected');
  };

  const resetToInitialDemoState = () => {
    localStorage.removeItem('capacita_team_members');
    localStorage.removeItem('capacita_tasks');
    localStorage.removeItem('capacita_overtime_requests');
    localStorage.removeItem('capacita_agent_last_status');
    setMembers(INITIAL_MEMBERS);
    setTasks(INITIAL_TASKS);
    setOvertimeRequests(INITIAL_OVERTIME_REQUESTS);
    setMetrics(INITIAL_TEAM_METRICS);
    setBottlenecks(BOTTLENECK_ALERTS);
    setRebalancePlan(null);
    setAgentStatus('idle');
    setAgentLogs([]);
  };

  // Task Handlers
  const createTask = async (input: CreateTaskInput): Promise<Task> => {
    const newTask = await taskService.createTask(input);
    setTasks(prev => [newTask, ...prev]);

    // Update allocated hours for assignee
    await teamService.updateMemberHours(input.assigneeId, Number(input.estimatedHours));
    setMembers(prev => prev.map(m => {
      if (m.id === input.assigneeId) {
        const newAllocated = m.allocatedHours + Number(input.estimatedHours);
        return {
          ...m,
          allocatedHours: newAllocated,
          status: newAllocated > m.weeklyCapacity ? 'overloaded' : newAllocated >= 35 ? 'approaching' : 'balanced'
        };
      }
      return m;
    }));

    return newTask;
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus): Promise<Task> => {
    const updated = await taskService.updateTaskStatus(taskId, status);
    setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    return updated;
  };

  const reassignTask = async (taskId: string, newAssigneeId: string, newAssigneeName: string): Promise<Task> => {
    const updated = await taskService.reassignTask(taskId, newAssigneeId, newAssigneeName);
    setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    return updated;
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    await taskService.deleteTask(taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Overtime Handlers
  const submitOvertime = async (input: RequestOvertimeInput): Promise<OvertimeRequest> => {
    const newRequest = await overtimeService.submitRequest(input);
    setOvertimeRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  const reviewOvertime = async (requestId: string, status: OvertimeStatus, notes?: string): Promise<OvertimeRequest> => {
    const updated = await overtimeService.reviewRequest(requestId, status, notes);
    setOvertimeRequests(prev => prev.map(r => r.id === requestId ? updated : r));
    
    // If approved, update member overtime hours
    if (status === 'approved') {
      setMembers(prev => prev.map(m => {
        if (m.id === updated.employeeId) {
          return {
            ...m,
            overtimeHours: m.overtimeHours + updated.requestedHours,
            status: 'overtime'
          };
        }
        return m;
      }));
    }

    return updated;
  };

  return (
    <CapacityContext.Provider
      value={{
        members,
        tasks,
        overtimeRequests,
        metrics,
        bottlenecks,
        rebalancePlan,
        agentStatus,
        agentLogs,
        isLoading,
        runAgentRebalance,
        approveAgentPlan,
        rejectAgentPlan,
        resetToInitialDemoState,
        createTask,
        updateTaskStatus,
        reassignTask,
        deleteTask,
        submitOvertime,
        reviewOvertime,
        refreshData
      }}
    >
      {children}
    </CapacityContext.Provider>
  );
};

export const useCapacity = () => {
  const context = useContext(CapacityContext);
  if (!context) {
    throw new Error('useCapacity must be used within a CapacityProvider');
  }
  return context;
};
