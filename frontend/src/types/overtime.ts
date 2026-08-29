export type OvertimeStatus = 'pending' | 'approved' | 'rejected';

export interface OvertimeRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeTitle: string;
  employeeAvatar?: string;
  teamId: string;
  teamName: string;
  requestedHours: number;
  currentCapacityHours: number; // e.g. 40
  currentAllocatedHours: number; // e.g. 44
  reason: string;
  projectName: string;
  date: string;
  status: OvertimeStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  managerNotes?: string;
  createdAt: string;
}

export interface RequestOvertimeInput {
  employeeId: string;
  requestedHours: number;
  reason: string;
  projectName: string;
  date: string;
}
