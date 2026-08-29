import { MemberCapacity } from './capacity';

export interface Team {
  id: string;
  name: string;
  department: string;
  description: string;
  leadName: string;
  leadId: string;
  membersCount: number;
  members: MemberCapacity[];
  primaryFocus: string;
  efficiencyIndex: number;
  blockersCount: number;
}
