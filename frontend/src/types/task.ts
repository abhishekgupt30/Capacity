export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  estimatedHours: number;
  completedHours?: number;
  deadline: string; // ISO date string
  priority: TaskPriority;
  status: TaskStatus;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar?: string;
  teamId: string;
  projectKey?: string; // e.g. 'CAP-104', 'ARCH-88'
  tags: string[];
  blockerRisk?: boolean;
  createdAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  estimatedHours: number;
  deadline: string;
  priority: TaskPriority;
  status?: TaskStatus;
  assigneeId: string;
  tags?: string[];
}
