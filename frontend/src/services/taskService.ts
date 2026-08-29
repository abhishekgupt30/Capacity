import { Task, CreateTaskInput, TaskStatus } from '../types';
import { api } from './api';

export const taskService = {
  async getTasks(params?: { assignee_id?: string; team_id?: string }): Promise<Task[]> {
    const qParams: Record<string, string> = {};
    if (params?.assignee_id) qParams.assignee_id = params.assignee_id;
    if (params?.team_id) qParams.team_id = params.team_id;
    return await api.get<Task[]>('/tasks', { params: qParams });
  },

  async createTask(input: CreateTaskInput): Promise<Task> {
    return await api.post<Task>('/tasks', {
      title: input.title,
      description: input.description,
      estimated_hours: Number(input.estimated_hours),
      deadline: input.deadline,
      priority: input.priority,
      status: input.status || 'todo',
      assignee_id: input.assignee_id,
      team_id: input.team_id,
      project_key: input.project_key,
      tags: input.tags || []
    });
  },

  async updateTaskStatus(task_id: string, status: TaskStatus): Promise<Task> {
    return await api.put<Task>(`/tasks/${task_id}/status`, { status });
  },

  async reassignTask(task_id: string, newAssigneeId: string): Promise<Task> {
    return await api.put<Task>(`/tasks/${task_id}/reassign`, { assignee_id: newAssigneeId });
  },

  async deleteTask(task_id: string): Promise<void> {
    await api.delete(`/tasks/${task_id}`);
  }
};
