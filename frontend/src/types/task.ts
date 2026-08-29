export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  estimated_hours: number;
  completed_hours?: number;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee_id: string;
  assignee_name: string | null;
  assignee_avatar?: string;
  team_id: string;
  project_key?: string;
  tags: string[];
  blocker_risk?: boolean;
  created_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  estimated_hours: number;
  deadline: string;
  priority: TaskPriority;
  status?: TaskStatus;
  assignee_id: string;
  team_id: string;
  project_key?: string;
  tags?: string[];
}
