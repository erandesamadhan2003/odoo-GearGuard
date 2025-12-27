import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "@/services/equipmentCategory.service";

const initialState = {
    categories: [],
    selectedCategory: null,
    loading: false,
    error: null
};

// Async Thunks
export const fetchAllCategories = createAsyncThunk(
    'equipmentCategory/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllCategories();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

export const addCategory = createAsyncThunk(
    'equipmentCategory/create',
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await createCategory(categoryData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create category');
        }
    }
);

export const modifyCategory = createAsyncThunk(
    'equipmentCategory/update',
    async ({ categoryId, categoryData }, { rejectWithValue }) => {
        try {
            const response = await updateCategory(categoryId, categoryData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update category');
        }
    }
);

export const removeCategory = createAsyncThunk(
    'equipmentCategory/delete',
    async (categoryId, { rejectWithValue }) => {
        try {
            const response = await deleteCategory(categoryId);
            return { categoryId, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
        }
    }
);

const equipmentCategorySlice = createSlice({
    name: 'equipmentCategory',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        clearSelectedCategory: (state) => {
            state.selectedCategory = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Categories
            .addCase(fetchAllCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.categories || [];
            })
            .addCase(fetchAllCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Category
            .addCase(addCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload.category);
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Modify Category
            .addCase(modifyCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(modifyCategory.fulfilled, (state, action) => {
                state.loading = false;
                const updatedCategory = action.payload.category;
                const index = state.categories.findIndex(
                    (cat) => cat.categoryId === updatedCategory.categoryId || cat.id === updatedCategory.id
                );
                if (index !== -1) {
                    state.categories[index] = updatedCategory;
                }
                if (state.selectedCategory && (state.selectedCategory.categoryId === updatedCategory.categoryId || state.selectedCategory.id === updatedCategory.id)) {
                    state.selectedCategory = updatedCategory;
                }
            })
            .addCase(modifyCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove Category
            .addCase(removeCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeCategory.fulfilled, (state, action) => {
                state.loading = false;
                const categoryId = action.payload.categoryId;
                state.categories = state.categories.filter(
                    (cat) => cat.categoryId !== categoryId && cat.id !== categoryId
                );
                if (state.selectedCategory && (state.selectedCategory.categoryId === categoryId || state.selectedCategory.id === categoryId)) {
                    state.selectedCategory = null;
                }
            })
            .addCase(removeCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, setSelectedCategory, clearSelectedCategory } = equipmentCategorySlice.actions;
export default equipmentCategorySlice.reducer;
