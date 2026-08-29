import { Team, MemberCapacity, TeamMetrics } from '../types';
import { INITIAL_TEAMS, INITIAL_MEMBERS, INITIAL_TEAM_METRICS } from '../data/mockData';
import { api } from './api';

export const teamService = {
  async getTeams(): Promise<Team[]> {
    try {
      return await api.get<Team[]>('/teams');
    } catch {
      return INITIAL_TEAMS;
    }
  },

  async getTeamMembers(team_id: string = 'team_alpha_01'): Promise<MemberCapacity[]> {
    try {
      return await api.get<MemberCapacity[]>(`/teams/${team_id}/members`);
    } catch {
      const saved = localStorage.getItem('capacita_team_members');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
      return INITIAL_MEMBERS;
    }
  },

  async getTeamMetrics(team_id: string = 'team_alpha_01'): Promise<TeamMetrics> {
    try {
      return await api.get<TeamMetrics>(`/teams/${team_id}/metrics`);
    } catch {
      return INITIAL_TEAM_METRICS;
    }
  },

  async updateMemberHours(member_id: string, deltaHours: number): Promise<MemberCapacity[]> {
    const members = await this.getTeamMembers();
    const updated = members.map(m => {
      if (m.id === memberId) {
        const newAllocated = Math.max(0, m.allocated_hours + deltaHours);
        return {
          ...m,
          allocated_hours: newAllocated,
          status: newAllocated > m.weekly_capacity ? 'overloaded' : newAllocated >= 35 ? 'approaching' : newAllocated >= 28 ? 'balanced' : 'underutilized'
        };
      }
      return m;
    });
    localStorage.setItem('capacita_team_members', JSON.stringify(updated));
    return updated;
  }
};
