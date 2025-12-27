import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
} from "@/services/department.service";

const initialState = {
    departments: [],
    selectedDepartment: null,
    loading: false,
    error: null
};

// Async Thunks
export const fetchAllDepartments = createAsyncThunk(
    'department/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllDepartments();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
        }
    }
);

export const addDepartment = createAsyncThunk(
    'department/create',
    async (departmentData, { rejectWithValue }) => {
        try {
            const response = await createDepartment(departmentData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create department');
        }
    }
);

export const modifyDepartment = createAsyncThunk(
    'department/update',
    async ({ departmentId, departmentData }, { rejectWithValue }) => {
        try {
            const response = await updateDepartment(departmentId, departmentData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update department');
        }
    }
);

export const removeDepartment = createAsyncThunk(
    'department/delete',
    async (departmentId, { rejectWithValue }) => {
        try {
            const response = await deleteDepartment(departmentId);
            return { departmentId, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete department');
        }
    }
);

const departmentSlice = createSlice({
    name: 'department',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setSelectedDepartment: (state, action) => {
            state.selectedDepartment = action.payload;
        },
        clearSelectedDepartment: (state) => {
            state.selectedDepartment = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Departments
            .addCase(fetchAllDepartments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllDepartments.fulfilled, (state, action) => {
                state.loading = false;
                state.departments = action.payload.departments || [];
            })
            .addCase(fetchAllDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Department
            .addCase(addDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.departments.push(action.payload.department);
            })
            .addCase(addDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Modify Department
            .addCase(modifyDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(modifyDepartment.fulfilled, (state, action) => {
                state.loading = false;
                const updatedDepartment = action.payload.department;
                const index = state.departments.findIndex(
                    (dept) => dept.departmentId === updatedDepartment.departmentId || dept.id === updatedDepartment.id
                );
                if (index !== -1) {
                    state.departments[index] = updatedDepartment;
                }
                if (state.selectedDepartment && (state.selectedDepartment.departmentId === updatedDepartment.departmentId || state.selectedDepartment.id === updatedDepartment.id)) {
                    state.selectedDepartment = updatedDepartment;
                }
            })
            .addCase(modifyDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove Department
            .addCase(removeDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeDepartment.fulfilled, (state, action) => {
                state.loading = false;
                const departmentId = action.payload.departmentId;
                state.departments = state.departments.filter(
                    (dept) => dept.departmentId !== departmentId && dept.id !== departmentId
                );
                if (state.selectedDepartment && (state.selectedDepartment.departmentId === departmentId || state.selectedDepartment.id === departmentId)) {
                    state.selectedDepartment = null;
                }
            })
            .addCase(removeDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, setSelectedDepartment, clearSelectedDepartment } = departmentSlice.actions;
export default departmentSlice.reducer;
