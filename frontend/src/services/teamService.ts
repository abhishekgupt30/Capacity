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

  async getTeamMembers(teamId: string = 'team_alpha_01'): Promise<MemberCapacity[]> {
    try {
      return await api.get<MemberCapacity[]>(`/teams/${teamId}/members`);
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

  async getTeamMetrics(teamId: string = 'team_alpha_01'): Promise<TeamMetrics> {
    try {
      return await api.get<TeamMetrics>(`/teams/${teamId}/metrics`);
    } catch {
      return INITIAL_TEAM_METRICS;
    }
  },

  async updateMemberHours(memberId: string, deltaHours: number): Promise<MemberCapacity[]> {
    const members = await this.getTeamMembers();
    const updated = members.map(m => {
      if (m.id === memberId) {
        const newAllocated = Math.max(0, m.allocatedHours + deltaHours);
        return {
          ...m,
          allocatedHours: newAllocated,
          status: newAllocated > m.weeklyCapacity ? 'overloaded' : newAllocated >= 35 ? 'approaching' : newAllocated >= 28 ? 'balanced' : 'underutilized'
        };
      }
      return m;
    });
    localStorage.setItem('capacita_team_members', JSON.stringify(updated));
    return updated;
  }
};
