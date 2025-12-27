import { api, USER_URL } from "../api/api";

export const getAllUsers = async () => {
    try {
        const response = await api.get(USER_URL.GET_ALL);
        return response.data;
    } catch (error) {
        console.error("Get all users error:", error);
        throw error;
    }
}

export const getUserById = async (userId) => {
    try {
        const response = await api.get(USER_URL.GET_BY_ID(userId));
        return response.data;
    } catch (error) {
        console.error("Get user by ID error:", error);
        throw error;
    }
}

export const updateUser = async (userId, userData) => {
    try {
        const response = await api.put(USER_URL.UPDATE(userId), userData);
        return response.data;
    } catch (error) {
        console.error("Update user error:", error);
        throw error;
    }
}

export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(USER_URL.DELETE(userId));
        return response.data;
    } catch (error) {
        console.error("Delete user error:", error);
        throw error;
    }
}

export const getTechnicians = async () => {
    try {
        const response = await api.get(USER_URL.GET_TECHNICIANS);
        return response.data;
    } catch (error) {
        console.error("Get technicians error:", error);
        throw error;
    }
}
