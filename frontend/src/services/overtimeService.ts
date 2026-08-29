import { OvertimeRequest, RequestOvertimeInput, OvertimeStatus } from '../types';
import { api } from './api';

export const overtimeService = {
  async getOvertimeRequests(team_id?: string): Promise<OvertimeRequest[]> {
    const qParams: Record<string, string> = {};
    if (team_id) qParams.team_id = team_id;
    return await api.get<OvertimeRequest[]>('/overtime/requests', { params: qParams });
  },

  async submitRequest(input: RequestOvertimeInput): Promise<OvertimeRequest> {
    return await api.post<OvertimeRequest>('/overtime/requests', {
      employee_id: input.employee_id,
      requested_hours: Number(input.requested_hours),
      reason: input.reason,
      project_name: input.project_name,
      date: input.date
    });
  },

  async reviewRequest(
    requestId: string, 
    status: OvertimeStatus, 
    manager_notes?: string, 
    reviewerName?: string
  ): Promise<OvertimeRequest> {
    return await api.put<OvertimeRequest>(`/overtime/requests/${requestId}/review`, {
      status,
      manager_notes: manager_notes,
      reviewer_name: reviewerName
    });
  }
};
