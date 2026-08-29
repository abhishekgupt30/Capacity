export type CapacityStatus = 
  | 'underutilized' // < 70%
  | 'balanced'       // 70% - 85%
  | 'approaching'    // 86% - 100%
  | 'overloaded'     // > 100%
  | 'overtime';      // Over capacity with approved/active overtime

export interface MemberCapacity {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager';
  title: string;
  avatar: string;
  weekly_capacity: number;
  allocated_hours: number;
  completed_hours: number;
  overtime_hours: number;
  efficiency_index: number;
  blockers_count: number;
  status: CapacityStatus;
  skills: string[];
  active_task_count: number;
}

export interface TeamMetrics {
  team_id: string;
  team_name: string;
  department: string;
  active_resources: number;
  efficiency_index: number;
  total_capacity_hours: number;
  total_allocated_hours: number;
  utilization_rate: number;
  blockers_identified: number;
  avg_cycle_time_days: number;
  critical_dependencies: number;
  overloaded_members_count: number;
  status: CapacityStatus;
}

export interface DailyWorkload {
  day: string;
  date: string;
  allocated: number;
  completed: number;
  capacity: number;
}
