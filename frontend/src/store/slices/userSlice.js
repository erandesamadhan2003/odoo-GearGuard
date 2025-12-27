import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getTechnicians
} from "@/services/user.service";

const initialState = {
    users: [],
    technicians: [],
    selectedUser: null,
    loading: false,
    error: null
};

// Async Thunks
export const fetchAllUsers = createAsyncThunk(
    'user/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllUsers();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const fetchUserById = createAsyncThunk(
    'user/fetchById',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await getUserById(userId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user details');
        }
    }
);

export const modifyUser = createAsyncThunk(
    'user/update',
    async ({ userId, userData }, { rejectWithValue }) => {
        try {
            const response = await updateUser(userId, userData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update user');
        }
    }
);

export const removeUser = createAsyncThunk(
    'user/delete',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await deleteUser(userId);
            return { userId, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
        }
    }
);

export const fetchTechnicians = createAsyncThunk(
    'user/fetchTechnicians',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getTechnicians();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch technicians');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Users
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users || [];
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch User By ID
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload.user;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Modify User
            .addCase(modifyUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(modifyUser.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload.user;
                const index = state.users.findIndex(
                    (user) => user.userId === updatedUser.userId || user.id === updatedUser.id
                );
                if (index !== -1) {
                    state.users[index] = updatedUser;
                }
                if (state.selectedUser && (state.selectedUser.userId === updatedUser.userId || state.selectedUser.id === updatedUser.id)) {
                    state.selectedUser = updatedUser;
                }
            })
            .addCase(modifyUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove User
            .addCase(removeUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                state.loading = false;
                const userId = action.payload.userId;
                state.users = state.users.filter(
                    (user) => user.userId !== userId && user.id !== userId
                );
                if (state.selectedUser && (state.selectedUser.userId === userId || state.selectedUser.id === userId)) {
                    state.selectedUser = null;
                }
            })
            .addCase(removeUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Technicians
            .addCase(fetchTechnicians.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTechnicians.fulfilled, (state, action) => {
                state.loading = false;
                state.technicians = action.payload.technicians || action.payload.users || [];
            })
            .addCase(fetchTechnicians.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, setSelectedUser, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
