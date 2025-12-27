import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllTeams,
    fetchTeamById,
    addTeam,
    modifyTeam,
    removeTeam,
    addMemberToTeam,
    removeMemberFromTeam,
    clearError,
    clearSelectedTeam
} from "@/store/slices/teamSlice";

export const useTeams = () => {
    const dispatch = useDispatch();

    // Team state
    const {
        teams,
        selectedTeam,
        teamMembers,
        loading,
        error
    } = useSelector((state) => state.team);

    // Team Methods
    const getAllTeams = async () => {
        try {
            const result = await dispatch(fetchAllTeams()).unwrap();
            return result;
        } catch (err) {
            console.error('Get all teams error:', err);
            throw err;
        }
    };

    const getTeamById = async (teamId) => {
        try {
            const result = await dispatch(fetchTeamById(teamId)).unwrap();
            return result;
        } catch (err) {
            console.error('Get team by ID error:', err);
            throw err;
        }
    };

    const createTeam = async (teamData) => {
        try {
            const result = await dispatch(addTeam(teamData)).unwrap();
            return result;
        } catch (err) {
            console.error('Create team error:', err);
            throw err;
        }
    };

    const updateTeam = async (teamId, teamData) => {
        try {
            const result = await dispatch(modifyTeam({ teamId, teamData })).unwrap();
            return result;
        } catch (err) {
            console.error('Update team error:', err);
            throw err;
        }
    };

    const deleteTeam = async (teamId) => {
        try {
            const result = await dispatch(removeTeam(teamId)).unwrap();
            return result;
        } catch (err) {
            console.error('Delete team error:', err);
            throw err;
        }
    };

    // Team Member Methods
    const addMember = async (teamId, memberData) => {
        try {
            const result = await dispatch(addMemberToTeam({ teamId, memberData })).unwrap();
            return result;
        } catch (err) {
            console.error('Add team member error:', err);
            throw err;
        }
    };

    const removeMember = async (teamId, userId) => {
        try {
            const result = await dispatch(removeMemberFromTeam({ teamId, userId })).unwrap();
            return result;
        } catch (err) {
            console.error('Remove team member error:', err);
            throw err;
        }
    };

    // Utility Methods
    const clearTeamError = () => {
        dispatch(clearError());
    };

    const clearSelected = () => {
        dispatch(clearSelectedTeam());
    };

    return {
        // State
        teams,
        selectedTeam,
        teamMembers,
        loading,
        error,

        // Team methods
        getAllTeams,
        getTeamById,
        createTeam,
        updateTeam,
        deleteTeam,

        // Member methods
        addMember,
        removeMember,

        // Utility methods
        clearTeamError,
        clearSelected
    };
};
