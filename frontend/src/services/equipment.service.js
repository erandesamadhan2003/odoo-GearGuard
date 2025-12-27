import { api, EQUIPMENT_URL } from "../api/api";

export const getAllEquipment = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();

        if (filters.departmentId) {
            queryParams.append('departmentId', filters.departmentId);
        }
        if (filters.status) {
            queryParams.append('status', filters.status);
        }

        const queryString = queryParams.toString();
        const url = queryString ? `${EQUIPMENT_URL.GET_ALL}?${queryString}` : EQUIPMENT_URL.GET_ALL;

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Get all equipment error:", error);
        throw error;
    }
}

export const getEquipmentById = async (equipmentId) => {
    try {
        const response = await api.get(EQUIPMENT_URL.GET_BY_ID(equipmentId));
        return response.data;
    } catch (error) {
        console.error("Get equipment by ID error:", error);
        throw error;
    }
}

export const createEquipment = async (equipmentData) => {
    try {
        const response = await api.post(EQUIPMENT_URL.CREATE, equipmentData);
        return response.data;
    } catch (error) {
        console.error("Create equipment error:", error);
        throw error;
    }
}

export const updateEquipment = async (equipmentId, equipmentData) => {
    try {
        const response = await api.put(EQUIPMENT_URL.UPDATE(equipmentId), equipmentData);
        return response.data;
    } catch (error) {
        console.error("Update equipment error:", error);
        throw error;
    }
}

export const deleteEquipment = async (equipmentId) => {
    try {
        const response = await api.delete(EQUIPMENT_URL.DELETE(equipmentId));
        return response.data;
    } catch (error) {
        console.error("Delete equipment error:", error);
        throw error;
    }
}

export const getEquipmentRequests = async (equipmentId) => {
    try {
        const response = await api.get(EQUIPMENT_URL.GET_REQUESTS(equipmentId));
        return response.data;
    } catch (error) {
        console.error("Get equipment requests error:", error);
        throw error;
    }
}

export const getEquipmentByDepartment = async (departmentId) => {
    try {
        const response = await api.get(EQUIPMENT_URL.GET_BY_DEPARTMENT(departmentId));
        return response.data;
    } catch (error) {
        console.error("Get equipment by department error:", error);
        throw error;
    }
}
