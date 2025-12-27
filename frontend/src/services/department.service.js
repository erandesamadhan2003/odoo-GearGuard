import { api, DEPARTMENT_URL } from "../api/api";

export const getAllDepartments = async () => {
    try {
        const response = await api.get(DEPARTMENT_URL.GET_ALL);
        return response.data;
    } catch (error) {
        console.error("Get all departments error:", error);
        throw error;
    }
}

export const createDepartment = async (departmentData) => {
    try {
        const response = await api.post(DEPARTMENT_URL.CREATE, departmentData);
        return response.data;
    } catch (error) {
        console.error("Create department error:", error);
        throw error;
    }
}

export const updateDepartment = async (departmentId, departmentData) => {
    try {
        const response = await api.put(DEPARTMENT_URL.UPDATE(departmentId), departmentData);
        return response.data;
    } catch (error) {
        console.error("Update department error:", error);
        throw error;
    }
}

export const deleteDepartment = async (departmentId) => {
    try {
        const response = await api.delete(DEPARTMENT_URL.DELETE(departmentId));
        return response.data;
    } catch (error) {
        console.error("Delete department error:", error);
        throw error;
    }
}
