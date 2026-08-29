export type AgentStatus =
  | 'idle'
  | 'analyzing'
  | 'simulating'
  | 'ready'
  | 'approved'
  | 'rejected'
  | 'error';

export interface TaskShift {
  task_id: string;
  task_title: string;
  hours: number;
  from_member_id: string;
  from_member_name: string;
  to_member_id: string;
  to_member_name: string;
  reason: string;
  confidence_score: number;
}

export interface MemberLoadComparison {
  member_id: string;
  member_name: string;
  title: string;
  before_hours: number;
  proposed_hours: number;
  capacity_hours: number;
  before_status: string;
  proposed_status: string;
  before_utilization: number;
  proposed_utilization: number;
}

export interface RebalancePlan {
  id: string;
  team_id: string;
  team_name: string;
  generated_at: string;
  summary: string;
  shifts: TaskShift[];
  member_comparisons: MemberLoadComparison[];
  expected_impact: {
    overload_reduction_percent: number;
    burnout_risk_reduction_percent: number;
    velocity_gain_multiplier: number;
    predicted_cycle_time_savings_days: number;
    balanced_ratio: string;
  };
  status: 'pending_approval' | 'approved' | 'rejected';
  agent_log_steps?: Array<{
    timestamp: string;
    level: string;
    message: string;
  }>;
}

export interface AgentLogStep {
  step: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  timestamp?: string;
  details?: string[];
}

export interface BottleneckReport {
  id: string;
  title: string;
  description: string;
  pod_name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metric_impact: string;
  suggested_action: string;
}
