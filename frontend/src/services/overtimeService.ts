import { OvertimeRequest, RequestOvertimeInput, OvertimeStatus } from '../types';
import { INITIAL_OVERTIME_REQUESTS, INITIAL_MEMBERS } from '../data/mockData';
import { api } from './api';

export const overtimeService = {
  async getOvertimeRequests(teamId?: string): Promise<OvertimeRequest[]> {
    try {
      const qParams: Record<string, string> = {};
      if (teamId) qParams.team_id = teamId;
      return await api.get<OvertimeRequest[]>('/overtime/requests', { params: qParams });
    } catch {
      const saved = localStorage.getItem('capacita_overtime_requests');
      return saved ? JSON.parse(saved) : INITIAL_OVERTIME_REQUESTS;
    }
  },

  async submitRequest(input: RequestOvertimeInput): Promise<OvertimeRequest> {
    try {
      return await api.post<OvertimeRequest>('/overtime/requests', input);
    } catch {
      const saved = localStorage.getItem('capacita_overtime_requests');
      const current: OvertimeRequest[] = saved ? JSON.parse(saved) : [...INITIAL_OVERTIME_REQUESTS];
      
      const member = INITIAL_MEMBERS.find(m => m.id === input.employeeId) || INITIAL_MEMBERS[1]; // default Alex

      const newRequest: OvertimeRequest = {
        id: `ot_req_${Date.now()}`,
        employeeId: input.employeeId,
        employeeName: member.name,
        employeeTitle: member.title,
        employeeAvatar: member.avatar,
        teamId: 'team_alpha_01',
        teamName: 'Alpha Engineering',
        requestedHours: Number(input.requestedHours),
        currentCapacityHours: member.weeklyCapacity,
        currentAllocatedHours: member.allocatedHours,
        reason: input.reason,
        projectName: input.projectName,
        date: input.date,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const updated = [newRequest, ...current];
      localStorage.setItem('capacita_overtime_requests', JSON.stringify(updated));
      return newRequest;
    }
  },

  async reviewRequest(
    requestId: string, 
    status: OvertimeStatus, 
    managerNotes?: string, 
    reviewerName: string = 'Sarah Jenkins'
  ): Promise<OvertimeRequest> {
    try {
      return await api.put<OvertimeRequest>(`/overtime/requests/${requestId}/review`, {
        status,
        manager_notes: managerNotes,
        reviewer_name: reviewerName
      });
    } catch {
      const saved = localStorage.getItem('capacita_overtime_requests');
      const requests: OvertimeRequest[] = saved ? JSON.parse(saved) : [...INITIAL_OVERTIME_REQUESTS];
      const index = requests.findIndex(r => r.id === requestId);
      if (index !== -1) {
        requests[index].status = status;
        requests[index].reviewedBy = reviewerName;
        requests[index].reviewedAt = new Date().toISOString();
        requests[index].managerNotes = managerNotes;
        localStorage.setItem('capacita_overtime_requests', JSON.stringify(requests));
        return requests[index];
      }
      throw new Error('Overtime request not found');
    }
  }
};
