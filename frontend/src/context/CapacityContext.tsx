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
  updateTaskStatus: (task_id: string, status: TaskStatus) => Promise<Task>;
  reassignTask: (task_id: string, newAssigneeId: string, newAssigneeName: string) => Promise<Task>;
  deleteTask: (task_id: string) => Promise<void>;
  
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
        taskService.getTasks({ team_id: 'team_alpha_01' }),
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
    const totalAllocated = members.reduce((acc, m) => acc + m.allocated_hours, 0);
    const totalCapacity = members.reduce((acc, m) => acc + m.weekly_capacity, 0);
    const overloaded = members.filter(m => m.allocated_hours > m.weekly_capacity).length;
    const totalBlockers = members.reduce((acc, m) => acc + m.blockers_count, 0);
    const utilization = totalCapacity > 0 ? (totalAllocated / totalCapacity) * 100 : 78.4;
    
    // Average efficiency
    const avgEff = members.length > 0
      ? Math.round(members.reduce((acc, m) => acc + m.efficiency_index, 0) / members.length)
      : 72;

    setMetrics(prev => ({
      ...prev,
      total_allocated_hours: totalAllocated,
      total_capacity_hours: totalCapacity,
      utilization_rate: Number(utilization.toFixed(1)),
      overloaded_members_count: overloaded,
      blockers_identified: totalBlockers,
      efficiency_index: avgEff,
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
          allocated_hours: 38,
          overtime_hours: 0,
          efficiency_index: 92,
          blockers_count: 0,
          status: 'balanced'
        };
      }
      if (m.id === 'usr_elena_03') {
        return {
          ...m,
          allocated_hours: 36,
          efficiency_index: 94,
          blockers_count: 0,
          status: 'balanced'
        };
      }
      return m;
    }));

    setTasks(prev => prev.map(t => {
      if (t.id === 'task_04' || t.id === 'task_05') {
        return {
          ...t,
          assignee_id: 'usr_elena_03',
          assignee_name: 'Elena Rostova',
          assignee_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          blocker_risk: false
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
    await teamService.updateMemberHours(input.assignee_id, Number(input.estimated_hours));
    setMembers(prev => prev.map(m => {
      if (m.id === input.assignee_id) {
        const newAllocated = m.allocated_hours + Number(input.estimated_hours);
        return {
          ...m,
          allocated_hours: newAllocated,
          status: newAllocated > m.weekly_capacity ? 'overloaded' : newAllocated >= 35 ? 'approaching' : 'balanced'
        };
      }
      return m;
    }));

    return newTask;
  };

  const updateTaskStatus = async (task_id: string, status: TaskStatus): Promise<Task> => {
    const updated = await taskService.updateTaskStatus(task_id, status);
    setTasks(prev => prev.map(t => t.id === task_id ? updated : t));
    return updated;
  };

  const reassignTask = async (task_id: string, newAssigneeId: string, newAssigneeName: string): Promise<Task> => {
    const updated = await taskService.reassignTask(task_id, newAssigneeId, newAssigneeName);
    setTasks(prev => prev.map(t => t.id === task_id ? updated : t));
    return updated;
  };

  const deleteTask = async (task_id: string): Promise<void> => {
    await taskService.deleteTask(task_id);
    setTasks(prev => prev.filter(t => t.id !== task_id));
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
        if (m.id === updated.employee_id) {
          return {
            ...m,
            overtime_hours: m.overtime_hours + updated.requested_hours,
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
