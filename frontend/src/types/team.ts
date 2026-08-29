import { MemberCapacity } from './capacity';

export interface Team {
  id: string;
  name: string;
  department: string;
  description: string;
  lead_name: string;
  lead_id: string;
  members_count: number;
  members: MemberCapacity[];
  primary_focus: string;
  efficiency_index: number;
  blockers_count: number;
}
