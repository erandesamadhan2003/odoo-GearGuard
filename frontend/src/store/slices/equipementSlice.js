import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getAllEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    getEquipmentRequests,
    getEquipmentByDepartment
} from "@/services/equipment.service";

const initialState = {
    equipment: [],
    selectedEquipment: null,
    equipmentRequests: [],
    loading: false,
    error: null,
    pagination: null
};

// Async Thunks
export const fetchAllEquipment = createAsyncThunk(
    'equipment/fetchAll',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const response = await getAllEquipment(filters);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch equipment');
        }
    }
);

export const fetchEquipmentById = createAsyncThunk(
    'equipment/fetchById',
    async (equipmentId, { rejectWithValue }) => {
        try {
            const response = await getEquipmentById(equipmentId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch equipment details');
        }
    }
);

export const addEquipment = createAsyncThunk(
    'equipment/create',
    async (equipmentData, { rejectWithValue }) => {
        try {
            const response = await createEquipment(equipmentData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create equipment');
        }
    }
);

export const modifyEquipment = createAsyncThunk(
    'equipment/update',
    async ({ equipmentId, equipmentData }, { rejectWithValue }) => {
        try {
            const response = await updateEquipment(equipmentId, equipmentData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update equipment');
        }
    }
);

export const removeEquipment = createAsyncThunk(
    'equipment/delete',
    async (equipmentId, { rejectWithValue }) => {
        try {
            const response = await deleteEquipment(equipmentId);
            return { equipmentId, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete equipment');
        }
    }
);

export const fetchEquipmentRequests = createAsyncThunk(
    'equipment/fetchRequests',
    async (equipmentId, { rejectWithValue }) => {
        try {
            const response = await getEquipmentRequests(equipmentId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch equipment requests');
        }
    }
);

export const fetchEquipmentByDepartment = createAsyncThunk(
    'equipment/fetchByDepartment',
    async (departmentId, { rejectWithValue }) => {
        try {
            const response = await getEquipmentByDepartment(departmentId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch equipment by department');
        }
    }
);

const equipmentSlice = createSlice({
    name: 'equipment',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedEquipment: (state) => {
            state.selectedEquipment = null;
        },
        clearEquipmentRequests: (state) => {
            state.equipmentRequests = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Equipment
            .addCase(fetchAllEquipment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllEquipment.fulfilled, (state, action) => {
                state.loading = false;
                state.equipment = action.payload.equipment || [];
                state.pagination = action.payload.pagination || null;
            })
            .addCase(fetchAllEquipment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Equipment By ID
            .addCase(fetchEquipmentById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEquipmentById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedEquipment = action.payload.equipment;
            })
            .addCase(fetchEquipmentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Equipment
            .addCase(addEquipment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addEquipment.fulfilled, (state, action) => {
                state.loading = false;
                state.equipment.push(action.payload.equipment);
            })
            .addCase(addEquipment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Modify Equipment
            .addCase(modifyEquipment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(modifyEquipment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.equipment.findIndex(
                    (eq) => eq.equipmentId === action.payload.equipment.equipmentId
                );
                if (index !== -1) {
                    state.equipment[index] = action.payload.equipment;
                }
                if (state.selectedEquipment?.equipmentId === action.payload.equipment.equipmentId) {
                    state.selectedEquipment = action.payload.equipment;
                }
            })
            .addCase(modifyEquipment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove Equipment
            .addCase(removeEquipment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeEquipment.fulfilled, (state, action) => {
                state.loading = false;
                state.equipment = state.equipment.filter(
                    (eq) => eq.equipmentId !== action.payload.equipmentId
                );
                if (state.selectedEquipment?.equipmentId === action.payload.equipmentId) {
                    state.selectedEquipment = null;
                }
            })
            .addCase(removeEquipment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Equipment Requests
            .addCase(fetchEquipmentRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEquipmentRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.equipmentRequests = action.payload.requests || [];
            })
            .addCase(fetchEquipmentRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Equipment By Department
            .addCase(fetchEquipmentByDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEquipmentByDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.equipment = action.payload.equipment || [];
            })
            .addCase(fetchEquipmentByDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearSelectedEquipment, clearEquipmentRequests } = equipmentSlice.actions;
export default equipmentSlice.reducer;
