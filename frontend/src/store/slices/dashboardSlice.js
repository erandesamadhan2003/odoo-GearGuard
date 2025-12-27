import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getDashboardStats,
    getOverdueRequests,
    getRequestsByTeam,
    getRequestsByCategory
} from "@/services/dashboard.service";

const initialState = {
    stats: null,
    overdueRequests: [],
    requestsByTeam: [],
    requestsByCategory: [],
    loading: false,
    error: null
};

// Async Thunks
export const fetchDashboardStats = createAsyncThunk(
    'dashboard/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getDashboardStats();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
        }
    }
);

export const fetchOverdueRequests = createAsyncThunk(
    'dashboard/fetchOverdue',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getOverdueRequests();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch overdue requests');
        }
    }
);

export const fetchRequestsByTeam = createAsyncThunk(
    'dashboard/fetchRequestsByTeam',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getRequestsByTeam();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch requests by team');
        }
    }
);

export const fetchRequestsByCategory = createAsyncThunk(
    'dashboard/fetchRequestsByCategory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getRequestsByCategory();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch requests by category');
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearDashboardData: (state) => {
            state.stats = null;
            state.overdueRequests = [];
            state.requestsByTeam = [];
            state.requestsByCategory = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Dashboard Stats
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.stats;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Overdue Requests
            .addCase(fetchOverdueRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOverdueRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.overdueRequests = action.payload.overdueRequests || [];
            })
            .addCase(fetchOverdueRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Requests By Team
            .addCase(fetchRequestsByTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRequestsByTeam.fulfilled, (state, action) => {
                state.loading = false;
                state.requestsByTeam = action.payload.data || [];
            })
            .addCase(fetchRequestsByTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Requests By Category
            .addCase(fetchRequestsByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRequestsByCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.requestsByCategory = action.payload.data || [];
            })
            .addCase(fetchRequestsByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
