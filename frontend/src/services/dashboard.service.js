import { api, DASHBOARD_URL } from "../api/api";

export const getDashboardStats = async () => {
    try {
        const response = await api.get(DASHBOARD_URL.GET_STATS);
        return response.data;
    } catch (error) {
        console.error("Get dashboard stats error:", error);
        throw error;
    }
}

export const getOverdueRequests = async () => {
    try {
        const response = await api.get(DASHBOARD_URL.GET_OVERDUE);
        return response.data;
    } catch (error) {
        console.error("Get overdue requests error:", error);
        throw error;
    }
}

export const getRequestsByTeam = async () => {
    try {
        const response = await api.get(DASHBOARD_URL.REQUESTS_BY_TEAM);
        return response.data;
    } catch (error) {
        console.error("Get requests by team error:", error);
        throw error;
    }
}

export const getRequestsByCategory = async () => {
    try {
        const response = await api.get(DASHBOARD_URL.REQUESTS_BY_CATEGORY);
        return response.data;
    } catch (error) {
        console.error("Get requests by category error:", error);
        throw error;
    }
}
