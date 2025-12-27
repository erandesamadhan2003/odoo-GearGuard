import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllEquipment,
    fetchEquipmentById,
    addEquipment,
    modifyEquipment,
    removeEquipment,
    fetchEquipmentRequests,
    fetchEquipmentByDepartment,
    clearError as clearEquipmentError,
    clearSelectedEquipment,
    clearEquipmentRequests
} from "@/store/slices/equipementSlice";
import {
    fetchAllCategories,
    addCategory,
    modifyCategory,
    removeCategory,
    clearError as clearCategoryError,
    setSelectedCategory,
    clearSelectedCategory
} from "@/store/slices/equipmentCategorySlice";

export const useEquipment = () => {
    const dispatch = useDispatch();

    // Equipment state
    const {
        equipment,
        selectedEquipment,
        equipmentRequests,
        loading: equipmentLoading,
        error: equipmentError,
        pagination
    } = useSelector((state) => state.equipment);

    // Equipment Category state
    const {
        categories,
        selectedCategory,
        loading: categoryLoading,
        error: categoryError
    } = useSelector((state) => state.equipmentCategory);

    // Equipment Methods
    const getAllEquipment = async (filters = {}) => {
        try {
            const result = await dispatch(fetchAllEquipment(filters)).unwrap();
            return result;
        } catch (err) {
            console.error('Get all equipment error:', err);
            throw err;
        }
    };

    const getEquipmentById = async (equipmentId) => {
        try {
            const result = await dispatch(fetchEquipmentById(equipmentId)).unwrap();
            return result;
        } catch (err) {
            console.error('Get equipment by ID error:', err);
            throw err;
        }
    };

    const createEquipment = async (equipmentData) => {
        try {
            const result = await dispatch(addEquipment(equipmentData)).unwrap();
            return result;
        } catch (err) {
            console.error('Create equipment error:', err);
            throw err;
        }
    };

    const updateEquipment = async (equipmentId, equipmentData) => {
        try {
            const result = await dispatch(modifyEquipment({ equipmentId, equipmentData })).unwrap();
            return result;
        } catch (err) {
            console.error('Update equipment error:', err);
            throw err;
        }
    };

    const deleteEquipment = async (equipmentId) => {
        try {
            const result = await dispatch(removeEquipment(equipmentId)).unwrap();
            return result;
        } catch (err) {
            console.error('Delete equipment error:', err);
            throw err;
        }
    };

    const getEquipmentRequests = async (equipmentId) => {
        try {
            const result = await dispatch(fetchEquipmentRequests(equipmentId)).unwrap();
            return result;
        } catch (err) {
            console.error('Get equipment requests error:', err);
            throw err;
        }
    };

    const getEquipmentByDepartment = async (departmentId) => {
        try {
            const result = await dispatch(fetchEquipmentByDepartment(departmentId)).unwrap();
            return result;
        } catch (err) {
            console.error('Get equipment by department error:', err);
            throw err;
        }
    };

    // Equipment Category Methods
    const getAllCategories = async () => {
        try {
            const result = await dispatch(fetchAllCategories()).unwrap();
            return result;
        } catch (err) {
            console.error('Get all categories error:', err);
            throw err;
        }
    };

    const createCategory = async (categoryData) => {
        try {
            const result = await dispatch(addCategory(categoryData)).unwrap();
            return result;
        } catch (err) {
            console.error('Create category error:', err);
            throw err;
        }
    };

    const updateCategory = async (categoryId, categoryData) => {
        try {
            const result = await dispatch(modifyCategory({ categoryId, categoryData })).unwrap();
            return result;
        } catch (err) {
            console.error('Update category error:', err);
            throw err;
        }
    };

    const deleteCategory = async (categoryId) => {
        try {
            const result = await dispatch(removeCategory(categoryId)).unwrap();
            return result;
        } catch (err) {
            console.error('Delete category error:', err);
            throw err;
        }
    };

    const selectCategory = (category) => {
        dispatch(setSelectedCategory(category));
    };

    // Utility Methods
    const clearEquipmentError = () => {
        dispatch(clearEquipmentError());
    };

    const clearCategoryError = () => {
        dispatch(clearCategoryError());
    };

    const clearSelected = () => {
        dispatch(clearSelectedEquipment());
    };

    const clearRequests = () => {
        dispatch(clearEquipmentRequests());
    };

    const clearCategory = () => {
        dispatch(clearSelectedCategory());
    };

    return {
        // Equipment state
        equipment,
        selectedEquipment,
        equipmentRequests,
        equipmentLoading,
        equipmentError,
        pagination,

        // Equipment Category state
        categories,
        selectedCategory,
        categoryLoading,
        categoryError,

        // Equipment methods
        getAllEquipment,
        getEquipmentById,
        createEquipment,
        updateEquipment,
        deleteEquipment,
        getEquipmentRequests,
        getEquipmentByDepartment,

        // Equipment Category methods
        getAllCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        selectCategory,

        // Utility methods
        clearEquipmentError,
        clearCategoryError,
        clearSelected,
        clearRequests,
        clearCategory
    };
};
