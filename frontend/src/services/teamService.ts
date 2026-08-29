import { Team, MemberCapacity, TeamMetrics } from '../types';
import { api } from './api';

export const teamService = {
  async getTeams(): Promise<Team[]> {
    return await api.get<Team[]>('/teams');
  },

  async getTeamMembers(team_id: string = 'team_alpha_01'): Promise<MemberCapacity[]> {
    return await api.get<MemberCapacity[]>(`/teams/${team_id}/members`);
  },

  async getTeamMetrics(team_id: string = 'team_alpha_01'): Promise<TeamMetrics> {
    return await api.get<TeamMetrics>(`/teams/${team_id}/metrics`);
  }
};
