export type AgentStatus =
  | 'idle'
  | 'analyzing'
  | 'simulating'
  | 'ready'
  | 'approved'
  | 'rejected'
  | 'error';

export interface TaskShift {
  taskId: string;
  taskTitle: string;
  hours: number;
  fromMemberId: string;
  fromMemberName: string;
  toMemberId: string;
  toMemberName: string;
  reason: string;
  confidenceScore: number; // e.g. 0.94
}

export interface MemberLoadComparison {
  memberId: string;
  memberName: string;
  title: string;
  beforeHours: number;
  proposedHours: number;
  capacityHours: number;
  beforeStatus: string;
  proposedStatus: string;
  beforeUtilization: number;
  proposedUtilization: number;
}

export interface RebalancePlan {
  id: string;
  teamId: string;
  teamName: string;
  generatedAt: string;
  summary: string;
  shifts: TaskShift[];
  memberComparisons: MemberLoadComparison[];
  expectedImpact: {
    overloadReductionPercent: number; // e.g. 34
    burnoutRiskReductionPercent: number; // e.g. 85
    velocityGainMultiplier: number; // e.g. 1.25
    predictedCycleTimeSavingsDays: number; // e.g. 1.8
    balancedRatio: string; // e.g. "100% within optimal band"
  };
  status: 'pending_approval' | 'approved' | 'rejected';
}

export interface AgentLogStep {
  step: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  timestamp?: string;
  details?: string[];
}

export interface BottleneckReport {
  id: string;
  title: string;
  description: string;
  podName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metricImpact: string;
  suggestedAction: string;
}
