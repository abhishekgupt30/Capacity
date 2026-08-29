import { Task, CreateTaskInput, TaskStatus } from '../types';
import { INITIAL_TASKS, INITIAL_MEMBERS } from '../data/mockData';
import { api } from './api';

export const taskService = {
  async getTasks(params?: { assigneeId?: string; teamId?: string }): Promise<Task[]> {
    try {
      const qParams: Record<string, string> = {};
      if (params?.assigneeId) qParams.assignee_id = params.assigneeId;
      if (params?.teamId) qParams.team_id = params.teamId;
      return await api.get<Task[]>('/tasks', { params: qParams });
    } catch {
      const saved = localStorage.getItem('capacita_tasks');
      let tasks = saved ? JSON.parse(saved) : INITIAL_TASKS;
      if (params?.assigneeId) {
        tasks = tasks.filter((t: Task) => t.assigneeId === params.assigneeId);
      }
      if (params?.teamId) {
        tasks = tasks.filter((t: Task) => t.teamId === params.teamId);
      }
      return tasks;
    }
  },

  async createTask(input: CreateTaskInput): Promise<Task> {
    try {
      return await api.post<Task>('/tasks', input);
    } catch {
      const saved = localStorage.getItem('capacita_tasks');
      const currentTasks: Task[] = saved ? JSON.parse(saved) : [...INITIAL_TASKS];
      
      const member = INITIAL_MEMBERS.find(m => m.id === input.assigneeId) || INITIAL_MEMBERS[0];
      
      const newTask: Task = {
        id: `task_${Date.now()}`,
        title: input.title,
        description: input.description,
        estimatedHours: Number(input.estimatedHours),
        completedHours: 0,
        deadline: input.deadline,
        priority: input.priority,
        status: input.status || 'todo',
        assigneeId: input.assigneeId,
        assigneeName: member.name,
        assigneeAvatar: member.avatar,
        teamId: 'team_alpha_01',
        projectKey: `CAP-${Math.floor(100 + Math.random() * 900)}`,
        tags: input.tags && input.tags.length ? input.tags : ['Task', 'Platform'],
        createdAt: new Date().toISOString()
      };

      const updated = [newTask, ...currentTasks];
      localStorage.setItem('capacita_tasks', JSON.stringify(updated));
      return newTask;
    }
  },

  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    try {
      return await api.put<Task>(`/tasks/${taskId}/status`, { status });
    } catch {
      const saved = localStorage.getItem('capacita_tasks');
      const tasks: Task[] = saved ? JSON.parse(saved) : [...INITIAL_TASKS];
      const index = tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        tasks[index].status = status;
        if (status === 'completed') {
          tasks[index].completedHours = tasks[index].estimatedHours;
        }
        localStorage.setItem('capacita_tasks', JSON.stringify(tasks));
        return tasks[index];
      }
      throw new Error('Task not found');
    }
  },

  async reassignTask(taskId: string, newAssigneeId: string, newAssigneeName: string): Promise<Task> {
    try {
      return await api.put<Task>(`/tasks/${taskId}/reassign`, { assignee_id: newAssigneeId });
    } catch {
      const saved = localStorage.getItem('capacita_tasks');
      const tasks: Task[] = saved ? JSON.parse(saved) : [...INITIAL_TASKS];
      const index = tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        tasks[index].assigneeId = newAssigneeId;
        tasks[index].assigneeName = newAssigneeName;
        localStorage.setItem('capacita_tasks', JSON.stringify(tasks));
        return tasks[index];
      }
      throw new Error('Task not found');
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    try {
      await api.delete(`/tasks/${taskId}`);
    } catch {
      const saved = localStorage.getItem('capacita_tasks');
      const tasks: Task[] = saved ? JSON.parse(saved) : [...INITIAL_TASKS];
      const filtered = tasks.filter(t => t.id !== taskId);
      localStorage.setItem('capacita_tasks', JSON.stringify(filtered));
    }
  }
};
