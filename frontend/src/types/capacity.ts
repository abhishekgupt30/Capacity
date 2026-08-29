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
  weeklyCapacity: number; // e.g. 40
  allocatedHours: number; // e.g. 48
  completedHours: number; // e.g. 18
  overtimeHours: number;  // e.g. 8
  efficiencyIndex: number; // e.g. 72%
  blockersCount: number;
  status: CapacityStatus;
  skills: string[];
  activeTaskCount: number;
}

export interface TeamMetrics {
  teamId: string;
  teamName: string;
  department: string;
  activeResources: number;
  efficiencyIndex: number;
  totalCapacityHours: number;
  totalAllocatedHours: number;
  utilizationRate: number; // percentage e.g. 78.4
  blockersIdentified: number;
  avgCycleTimeDays: number;
  criticalDependencies: number;
  overloadedMembersCount: number;
  status: CapacityStatus;
}

export interface DailyWorkload {
  day: string;
  date: string;
  allocated: number;
  completed: number;
  capacity: number;
}
