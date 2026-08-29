export type OvertimeStatus = 'pending' | 'approved' | 'rejected';

export interface OvertimeRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_title: string;
  employee_avatar?: string;
  team_id: string;
  team_name: string;
  requested_hours: number;
  current_capacity_hours: number;
  current_allocated_hours: number;
  reason: string;
  project_name: string;
  date: string;
  status: OvertimeStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  manager_notes?: string;
  created_at: string;
}

export interface RequestOvertimeInput {
  employee_id: string;
  requested_hours: number;
  reason: string;
  project_name: string;
  date: string;
}
