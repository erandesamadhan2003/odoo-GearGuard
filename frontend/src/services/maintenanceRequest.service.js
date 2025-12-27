import { api, MAINTENANCE_REQUEST_URL } from "../api/api";

export const getAllRequests = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();

        if (filters.stage) {
            queryParams.append('stage', filters.stage);
        }
        if (filters.teamId) {
            queryParams.append('teamId', filters.teamId);
        }
        if (filters.priority) {
            queryParams.append('priority', filters.priority);
        }

        const queryString = queryParams.toString();
        const url = queryString ? `${MAINTENANCE_REQUEST_URL.GET_ALL}?${queryString}` : MAINTENANCE_REQUEST_URL.GET_ALL;

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Get all requests error:", error);
        throw error;
    }
}

export const getRequestById = async (requestId) => {
    try {
        const response = await api.get(MAINTENANCE_REQUEST_URL.GET_BY_ID(requestId));
        return response.data;
    } catch (error) {
        console.error("Get request by ID error:", error);
        throw error;
    }
}

export const createRequest = async (requestData) => {
    try {
        const response = await api.post(MAINTENANCE_REQUEST_URL.CREATE, requestData);
        return response.data;
    } catch (error) {
        console.error("Create request error:", error);
        throw error;
    }
}

export const updateRequest = async (requestId, requestData) => {
    try {
        const response = await api.put(MAINTENANCE_REQUEST_URL.UPDATE(requestId), requestData);
        return response.data;
    } catch (error) {
        console.error("Update request error:", error);
        throw error;
    }
}

export const deleteRequest = async (requestId) => {
    try {
        const response = await api.delete(MAINTENANCE_REQUEST_URL.DELETE(requestId));
        return response.data;
    } catch (error) {
        console.error("Delete request error:", error);
        throw error;
    }
}

export const updateRequestStage = async (requestId, stageData) => {
    try {
        const response = await api.patch(MAINTENANCE_REQUEST_URL.UPDATE_STAGE(requestId), stageData);
        return response.data;
    } catch (error) {
        console.error("Update request stage error:", error);
        throw error;
    }
}

export const assignRequest = async (requestId, assignmentData) => {
    try {
        const response = await api.patch(MAINTENANCE_REQUEST_URL.ASSIGN(requestId), assignmentData);
        return response.data;
    } catch (error) {
        console.error("Assign request error:", error);
        throw error;
    }
}

export const getCalendarRequests = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();

        if (filters.month) {
            queryParams.append('month', filters.month);
        }
        if (filters.year) {
            queryParams.append('year', filters.year);
        }

        const queryString = queryParams.toString();
        const url = queryString ? `${MAINTENANCE_REQUEST_URL.GET_CALENDAR}?${queryString}` : MAINTENANCE_REQUEST_URL.GET_CALENDAR;

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Get calendar requests error:", error);
        throw error;
    }
}

export const getMyRequests = async () => {
    try {
        const response = await api.get(MAINTENANCE_REQUEST_URL.GET_MY_REQUESTS);
        return response.data;
    } catch (error) {
        console.error("Get my requests error:", error);
        throw error;
    }
}

export const getAssignedToMe = async () => {
    try {
        const response = await api.get(MAINTENANCE_REQUEST_URL.GET_ASSIGNED_TO_ME);
        return response.data;
    } catch (error) {
        console.error("Get assigned to me error:", error);
        throw error;
    }
}
