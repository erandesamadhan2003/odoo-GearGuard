import { api, TEAM_URL } from "../api/api";

export const getAllTeams = async () => {
  try {
    const response = await api.get(TEAM_URL.GET_ALL);
    return response.data;
  } catch (error) {
    console.error("Get all teams error:", error);
    throw error;
  }
};

export const getTeamById = async (teamId: string | number) => {
  try {
    const response = await api.get(TEAM_URL.GET_BY_ID(teamId));
    return response.data;
  } catch (error) {
    console.error("Get team by ID error:", error);
    throw error;
  }
};

export const createTeam = async (teamData: {
  teamName: string;
  description?: string;
}) => {
  try {
    const response = await api.post(TEAM_URL.CREATE, teamData);
    return response.data;
  } catch (error) {
    console.error("Create team error:", error);
    throw error;
  }
};

export const updateTeam = async (
  teamId: string | number,
  teamData: { teamName: string; description?: string }
) => {
  try {
    const response = await api.put(TEAM_URL.UPDATE(teamId), teamData);
    return response.data;
  } catch (error) {
    console.error("Update team error:", error);
    throw error;
  }
};

export const deleteTeam = async (teamId: string | number) => {
  try {
    const response = await api.delete(TEAM_URL.DELETE(teamId));
    return response.data;
  } catch (error) {
    console.error("Delete team error:", error);
    throw error;
  }
};

export const addTeamMember = async (
  teamId: string | number,
  memberData: { userId: string | number; isLead: boolean }
) => {
  try {
    const response = await api.post(TEAM_URL.ADD_MEMBER(teamId), memberData);
    return response.data;
  } catch (error) {
    console.error("Add team member error:", error);
    throw error;
  }
};

export const removeTeamMember = async (
  teamId: string | number,
  userId: string | number
) => {
  try {
    const response = await api.delete(TEAM_URL.REMOVE_MEMBER(teamId, userId));
    return response.data;
  } catch (error) {
    console.error("Remove team member error:", error);
    throw error;
  }
};
