import { api, EQUIPMENT_CATEGORY_URL } from "../api/api";

export const getAllCategories = async () => {
    try {
        const response = await api.get(EQUIPMENT_CATEGORY_URL.GET_ALL);
        return response.data;
    } catch (error) {
        console.error("Get all categories error:", error);
        throw error;
    }
}

export const createCategory = async (categoryData) => {
    try {
        const response = await api.post(EQUIPMENT_CATEGORY_URL.CREATE, categoryData);
        return response.data;
    } catch (error) {
        console.error("Create category error:", error);
        throw error;
    }
}

export const updateCategory = async (categoryId, categoryData) => {
    try {
        const response = await api.put(EQUIPMENT_CATEGORY_URL.UPDATE(categoryId), categoryData);
        return response.data;
    } catch (error) {
        console.error("Update category error:", error);
        throw error;
    }
}

export const deleteCategory = async (categoryId) => {
    try {
        const response = await api.delete(EQUIPMENT_CATEGORY_URL.DELETE(categoryId));
        return response.data;
    } catch (error) {
        console.error("Delete category error:", error);
        throw error;
    }
}
