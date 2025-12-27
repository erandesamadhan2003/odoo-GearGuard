import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllDepartments,
    addDepartment,
    modifyDepartment,
    removeDepartment,
    clearError,
    setSelectedDepartment,
    clearSelectedDepartment
} from "@/store/slices/departmentSlice";

export const useDepartment = () => {
    const dispatch = useDispatch();

    // Department state
    const {
        departments,
        selectedDepartment,
        loading,
        error
    } = useSelector((state) => state.department);

    // Department Methods
    const getAllDepartments = async () => {
        try {
            const result = await dispatch(fetchAllDepartments()).unwrap();
            return result;
        } catch (err) {
            console.error('Get all departments error:', err);
            throw err;
        }
    };

    const createDepartment = async (departmentData) => {
        try {
            const result = await dispatch(addDepartment(departmentData)).unwrap();
            return result;
        } catch (err) {
            console.error('Create department error:', err);
            throw err;
        }
    };

    const updateDepartment = async (departmentId, departmentData) => {
        try {
            const result = await dispatch(modifyDepartment({ departmentId, departmentData })).unwrap();
            return result;
        } catch (err) {
            console.error('Update department error:', err);
            throw err;
        }
    };

    const deleteDepartment = async (departmentId) => {
        try {
            const result = await dispatch(removeDepartment(departmentId)).unwrap();
            return result;
        } catch (err) {
            console.error('Delete department error:', err);
            throw err;
        }
    };

    const selectDepartment = (department) => {
        dispatch(setSelectedDepartment(department));
    };

    // Utility Methods
    const clearDepartmentError = () => {
        dispatch(clearError());
    };

    const clearSelected = () => {
        dispatch(clearSelectedDepartment());
    };

    return {
        // State
        departments,
        selectedDepartment,
        loading,
        error,

        // Department methods
        getAllDepartments,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        selectDepartment,

        // Utility methods
        clearDepartmentError,
        clearSelected
    };
};
