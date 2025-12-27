import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getAllRequests,
    getRequestById,
    createRequest,
    updateRequest,
    deleteRequest,
    updateRequestStage,
    assignRequest,
    getCalendarRequests,
    getMyRequests,
    getAssignedToMe
} from "@/services/maintenanceRequest.service";

const initialState = {
    requests: [],
    selectedRequest: null,
    myRequests: [],
    assignedRequests: [],
    calendarEvents: [],
    loading: false,
    error: null,
    pagination: null,
    // Kanban board state
    kanbanColumns: {
        new: [],
        in_progress: [],
        on_hold: [],
        completed: [],
        cancelled: []
    }
};

// Async Thunks
export const fetchAllRequests = createAsyncThunk(
    'maintenanceRequest/fetchAll',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const response = await getAllRequests(filters);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch requests');
        }
    }
);

export const fetchRequestById = createAsyncThunk(
    'maintenanceRequest/fetchById',
    async (requestId, { rejectWithValue }) => {
        try {
            const response = await getRequestById(requestId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch request details');
        }
    }
);

export const addRequest = createAsyncThunk(
    'maintenanceRequest/create',
    async (requestData, { rejectWithValue }) => {
        try {
            const response = await createRequest(requestData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create request');
        }
    }
);

export const modifyRequest = createAsyncThunk(
    'maintenanceRequest/update',
    async ({ requestId, requestData }, { rejectWithValue }) => {
        try {
            const response = await updateRequest(requestId, requestData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update request');
        }
    }
);

export const removeRequest = createAsyncThunk(
    'maintenanceRequest/delete',
    async (requestId, { rejectWithValue }) => {
        try {
            const response = await deleteRequest(requestId);
            return { requestId, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete request');
        }
    }
);

export const changeRequestStage = createAsyncThunk(
    'maintenanceRequest/updateStage',
    async ({ requestId, stage }, { rejectWithValue }) => {
        try {
            const response = await updateRequestStage(requestId, { stage });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update request stage');
        }
    }
);

export const assignRequestToTechnician = createAsyncThunk(
    'maintenanceRequest/assign',
    async ({ requestId, assignedToUserId }, { rejectWithValue }) => {
        try {
            const response = await assignRequest(requestId, { assignedToUserId });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to assign request');
        }
    }
);

export const fetchCalendarRequests = createAsyncThunk(
    'maintenanceRequest/fetchCalendar',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const response = await getCalendarRequests(filters);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch calendar requests');
        }
    }
);

export const fetchMyRequests = createAsyncThunk(
    'maintenanceRequest/fetchMyRequests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getMyRequests();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch my requests');
        }
    }
);

export const fetchAssignedToMe = createAsyncThunk(
    'maintenanceRequest/fetchAssignedToMe',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAssignedToMe();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch assigned requests');
        }
    }
);

// Helper function to organize requests into Kanban columns
const organizeKanbanColumns = (requests) => {
    const columns = {
        new: [],
        in_progress: [],
        on_hold: [],
        completed: [],
        cancelled: []
    };

    requests.forEach(request => {
        const stage = request.stage?.toLowerCase() || 'new';
        if (columns[stage]) {
            columns[stage].push(request);
        } else {
            columns.new.push(request);
        }
    });

    return columns;
};

const maintenanceRequestSlice = createSlice({
    name: 'maintenanceRequest',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedRequest: (state) => {
            state.selectedRequest = null;
        },
        // Optimistic update for Kanban drag and drop
        moveRequestOptimistic: (state, action) => {
            const { requestId, fromStage, toStage } = action.payload;

            // Find and remove from source column
            const fromColumn = state.kanbanColumns[fromStage];
            const requestIndex = fromColumn.findIndex(req => req.requestId === requestId || req.id === requestId);

            if (requestIndex !== -1) {
                const [request] = fromColumn.splice(requestIndex, 1);
                // Update stage and add to destination column
                request.stage = toStage;
                state.kanbanColumns[toStage].push(request);
            }
        },
        // Revert optimistic update on failure
        revertRequestMove: (state, action) => {
            const { requestId, fromStage, toStage } = action.payload;

            // Find and remove from current column
            const toColumn = state.kanbanColumns[toStage];
            const requestIndex = toColumn.findIndex(req => req.requestId === requestId || req.id === requestId);

            if (requestIndex !== -1) {
                const [request] = toColumn.splice(requestIndex, 1);
                // Revert stage and add back to original column
                request.stage = fromStage;
                state.kanbanColumns[fromStage].push(request);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Requests
            .addCase(fetchAllRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.requests = action.payload.requests || [];
                state.pagination = action.payload.pagination || null;
                state.kanbanColumns = organizeKanbanColumns(state.requests);
            })
            .addCase(fetchAllRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Request By ID
            .addCase(fetchRequestById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRequestById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedRequest = action.payload.request;
            })
            .addCase(fetchRequestById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Request
            .addCase(addRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addRequest.fulfilled, (state, action) => {
                state.loading = false;
                const newRequest = action.payload.request;
                state.requests.push(newRequest);

                // Add to appropriate Kanban column
                const stage = newRequest.stage?.toLowerCase() || 'new';
                if (state.kanbanColumns[stage]) {
                    state.kanbanColumns[stage].push(newRequest);
                }
            })
            .addCase(addRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Modify Request
            .addCase(modifyRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(modifyRequest.fulfilled, (state, action) => {
                state.loading = false;
                const updatedRequest = action.payload.request;
                const requestId = updatedRequest.requestId || updatedRequest.id;

                // Update in requests array
                const index = state.requests.findIndex(req =>
                    (req.requestId || req.id) === requestId
                );
                if (index !== -1) {
                    state.requests[index] = updatedRequest;
                }

                // Update in Kanban columns
                state.kanbanColumns = organizeKanbanColumns(state.requests);

                // Update selected request if it's the same
                if (state.selectedRequest && (state.selectedRequest.requestId || state.selectedRequest.id) === requestId) {
                    state.selectedRequest = updatedRequest;
                }
            })
            .addCase(modifyRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove Request
            .addCase(removeRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeRequest.fulfilled, (state, action) => {
                state.loading = false;
                const requestId = action.payload.requestId;

                // Remove from requests array
                state.requests = state.requests.filter(req =>
                    (req.requestId || req.id) !== requestId
                );

                // Remove from Kanban columns
                Object.keys(state.kanbanColumns).forEach(stage => {
                    state.kanbanColumns[stage] = state.kanbanColumns[stage].filter(req =>
                        (req.requestId || req.id) !== requestId
                    );
                });

                // Clear selected request if it's the deleted one
                if (state.selectedRequest && (state.selectedRequest.requestId || state.selectedRequest.id) === requestId) {
                    state.selectedRequest = null;
                }
            })
            .addCase(removeRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Change Request Stage
            .addCase(changeRequestStage.pending, (state) => {
                state.error = null;
            })
            .addCase(changeRequestStage.fulfilled, (state, action) => {
                const updatedRequest = action.payload.request;
                const requestId = updatedRequest.requestId || updatedRequest.id;

                // Update in requests array
                const index = state.requests.findIndex(req =>
                    (req.requestId || req.id) === requestId
                );
                if (index !== -1) {
                    state.requests[index] = updatedRequest;
                }

                // Update Kanban columns
                state.kanbanColumns = organizeKanbanColumns(state.requests);

                // Update selected request if it's the same
                if (state.selectedRequest && (state.selectedRequest.requestId || state.selectedRequest.id) === requestId) {
                    state.selectedRequest = updatedRequest;
                }
            })
            .addCase(changeRequestStage.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Assign Request
            .addCase(assignRequestToTechnician.pending, (state) => {
                state.error = null;
            })
            .addCase(assignRequestToTechnician.fulfilled, (state, action) => {
                const updatedRequest = action.payload.request;
                const requestId = updatedRequest.requestId || updatedRequest.id;

                // Update in requests array
                const index = state.requests.findIndex(req =>
                    (req.requestId || req.id) === requestId
                );
                if (index !== -1) {
                    state.requests[index] = updatedRequest;
                }

                // Update in Kanban columns
                state.kanbanColumns = organizeKanbanColumns(state.requests);

                // Update selected request if it's the same
                if (state.selectedRequest && (state.selectedRequest.requestId || state.selectedRequest.id) === requestId) {
                    state.selectedRequest = updatedRequest;
                }
            })
            .addCase(assignRequestToTechnician.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Fetch Calendar Requests
            .addCase(fetchCalendarRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCalendarRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.calendarEvents = action.payload.requests || action.payload.events || [];
            })
            .addCase(fetchCalendarRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch My Requests
            .addCase(fetchMyRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.myRequests = action.payload.requests || [];
            })
            .addCase(fetchMyRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Assigned To Me
            .addCase(fetchAssignedToMe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssignedToMe.fulfilled, (state, action) => {
                state.loading = false;
                state.assignedRequests = action.payload.requests || [];
            })
            .addCase(fetchAssignedToMe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearSelectedRequest, moveRequestOptimistic, revertRequestMove } = maintenanceRequestSlice.actions;
export default maintenanceRequestSlice.reducer;
