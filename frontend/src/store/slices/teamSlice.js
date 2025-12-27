import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getAllTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember
} from "@/services/maintenance.service";

const initialState = {
    teams: [],
    selectedTeam: null,
    teamMembers: [],
    loading: false,
    error: null
};

// Async Thunks
export const fetchAllTeams = createAsyncThunk(
    'team/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllTeams();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch teams');
        }
    }
);

export const fetchTeamById = createAsyncThunk(
    'team/fetchById',
    async (teamId, { rejectWithValue }) => {
        try {
            const response = await getTeamById(teamId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch team details');
        }
    }
);

export const addTeam = createAsyncThunk(
    'team/create',
    async (teamData, { rejectWithValue }) => {
        try {
            const response = await createTeam(teamData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create team');
        }
    }
);

export const modifyTeam = createAsyncThunk(
    'team/update',
    async ({ teamId, teamData }, { rejectWithValue }) => {
        try {
            const response = await updateTeam(teamId, teamData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update team');
        }
    }
);

export const removeTeam = createAsyncThunk(
    'team/delete',
    async (teamId, { rejectWithValue }) => {
        try {
            const response = await deleteTeam(teamId);
            return { teamId, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete team');
        }
    }
);

export const addMemberToTeam = createAsyncThunk(
    'team/addMember',
    async ({ teamId, memberData }, { rejectWithValue }) => {
        try {
            const response = await addTeamMember(teamId, memberData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add team member');
        }
    }
);

export const removeMemberFromTeam = createAsyncThunk(
    'team/removeMember',
    async ({ teamId, userId }, { rejectWithValue }) => {
        try {
            const response = await removeTeamMember(teamId, userId);
            return { teamId, userId, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove team member');
        }
    }
);

const teamSlice = createSlice({
    name: 'team',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedTeam: (state) => {
            state.selectedTeam = null;
            state.teamMembers = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Teams
            .addCase(fetchAllTeams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllTeams.fulfilled, (state, action) => {
                state.loading = false;
                state.teams = action.payload.teams || [];
            })
            .addCase(fetchAllTeams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Team By ID
            .addCase(fetchTeamById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeamById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTeam = action.payload.team;
                state.teamMembers = action.payload.members || [];
            })
            .addCase(fetchTeamById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Team
            .addCase(addTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTeam.fulfilled, (state, action) => {
                state.loading = false;
                state.teams.push(action.payload.team);
            })
            .addCase(addTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Modify Team
            .addCase(modifyTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(modifyTeam.fulfilled, (state, action) => {
                state.loading = false;
                const updatedTeam = action.payload.team;
                const index = state.teams.findIndex(
                    (team) => team.teamId === updatedTeam.teamId || team.id === updatedTeam.id
                );
                if (index !== -1) {
                    state.teams[index] = updatedTeam;
                }
                if (state.selectedTeam && (state.selectedTeam.teamId === updatedTeam.teamId || state.selectedTeam.id === updatedTeam.id)) {
                    state.selectedTeam = updatedTeam;
                }
            })
            .addCase(modifyTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove Team
            .addCase(removeTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeTeam.fulfilled, (state, action) => {
                state.loading = false;
                const teamId = action.payload.teamId;
                state.teams = state.teams.filter(
                    (team) => team.teamId !== teamId && team.id !== teamId
                );
                if (state.selectedTeam && (state.selectedTeam.teamId === teamId || state.selectedTeam.id === teamId)) {
                    state.selectedTeam = null;
                    state.teamMembers = [];
                }
            })
            .addCase(removeTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Member To Team
            .addCase(addMemberToTeam.pending, (state) => {
                state.error = null;
            })
            .addCase(addMemberToTeam.fulfilled, (state, action) => {
                const newMember = action.payload.member;
                if (newMember) {
                    state.teamMembers.push(newMember);
                }
            })
            .addCase(addMemberToTeam.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Remove Member From Team
            .addCase(removeMemberFromTeam.pending, (state) => {
                state.error = null;
            })
            .addCase(removeMemberFromTeam.fulfilled, (state, action) => {
                const { userId } = action.payload;
                state.teamMembers = state.teamMembers.filter(
                    (member) => member.userId !== userId && member.id !== userId
                );
            })
            .addCase(removeMemberFromTeam.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const { clearError, clearSelectedTeam } = teamSlice.actions;
export default teamSlice.reducer;
