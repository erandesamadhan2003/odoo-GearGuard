import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllRequests,
    fetchRequestById,
    addRequest,
    modifyRequest,
    removeRequest,
    changeRequestStage,
    assignRequestToTechnician,
    fetchCalendarRequests,
    fetchMyRequests,
    fetchAssignedToMe,
    clearError,
    clearSelectedRequest,
    moveRequestOptimistic,
    revertRequestMove
} from "@/store/slices/maintenanceRequestSlice";

export const useRequest = () => {
    const dispatch = useDispatch();

    // Maintenance Request state
    const {
        requests,
        selectedRequest,
        myRequests,
        assignedRequests,
        calendarEvents,
        loading,
        error,
        pagination,
        kanbanColumns
    } = useSelector((state) => state.maintenanceRequest);

    // Request Methods
    const getAllRequests = async (filters = {}) => {
        try {
            const result = await dispatch(fetchAllRequests(filters)).unwrap();
            return result;
        } catch (err) {
            console.error('Get all requests error:', err);
            throw err;
        }
    };

    const getRequestById = async (requestId) => {
        try {
            const result = await dispatch(fetchRequestById(requestId)).unwrap();
            return result;
        } catch (err) {
            console.error('Get request by ID error:', err);
            throw err;
        }
    };

    const createRequest = async (requestData) => {
        try {
            const result = await dispatch(addRequest(requestData)).unwrap();
            return result;
        } catch (err) {
            console.error('Create request error:', err);
            throw err;
        }
    };

    const updateRequest = async (requestId, requestData) => {
        try {
            const result = await dispatch(modifyRequest({ requestId, requestData })).unwrap();
            return result;
        } catch (err) {
            console.error('Update request error:', err);
            throw err;
        }
    };

    const deleteRequest = async (requestId) => {
        try {
            const result = await dispatch(removeRequest(requestId)).unwrap();
            return result;
        } catch (err) {
            console.error('Delete request error:', err);
            throw err;
        }
    };

    // Stage Management
    const updateRequestStage = async (requestId, stage) => {
        try {
            const result = await dispatch(changeRequestStage({ requestId, stage })).unwrap();
            return result;
        } catch (err) {
            console.error('Update request stage error:', err);
            throw err;
        }
    };

    // Kanban Drag and Drop with Optimistic Updates
    const moveRequest = async (requestId, fromStage, toStage) => {
        // Optimistic update
        dispatch(moveRequestOptimistic({ requestId, fromStage, toStage }));

        try {
            // Actual API call
            const result = await dispatch(changeRequestStage({ requestId, stage: toStage })).unwrap();
            return result;
        } catch (err) {
            // Revert on failure
            dispatch(revertRequestMove({ requestId, fromStage, toStage }));
            console.error('Move request error:', err);
            throw err;
        }
    };

    // Assignment
    const assignRequest = async (requestId, assignedToUserId) => {
        try {
            const result = await dispatch(assignRequestToTechnician({ requestId, assignedToUserId })).unwrap();
            return result;
        } catch (err) {
            console.error('Assign request error:', err);
            throw err;
        }
    };

    // Calendar and User-Specific Views
    const getCalendarRequests = async (filters = {}) => {
        try {
            const result = await dispatch(fetchCalendarRequests(filters)).unwrap();
            return result;
        } catch (err) {
            console.error('Get calendar requests error:', err);
            throw err;
        }
    };

    const getMyRequests = async () => {
        try {
            const result = await dispatch(fetchMyRequests()).unwrap();
            return result;
        } catch (err) {
            console.error('Get my requests error:', err);
            throw err;
        }
    };

    const getAssignedRequests = async () => {
        try {
            const result = await dispatch(fetchAssignedToMe()).unwrap();
            return result;
        } catch (err) {
            console.error('Get assigned requests error:', err);
            throw err;
        }
    };

    // Utility Methods
    const clearRequestError = () => {
        dispatch(clearError());
    };

    const clearSelected = () => {
        dispatch(clearSelectedRequest());
    };

    return {
        // State
        requests,
        selectedRequest,
        myRequests,
        assignedRequests,
        calendarEvents,
        loading,
        error,
        pagination,
        kanbanColumns,

        // Request CRUD methods
        getAllRequests,
        getRequestById,
        createRequest,
        updateRequest,
        deleteRequest,

        // Stage and assignment methods
        updateRequestStage,
        assignRequest,

        // Kanban methods
        moveRequest,

        // View-specific methods
        getCalendarRequests,
        getMyRequests,
        getAssignedRequests,

        // Utility methods
        clearRequestError,
        clearSelected
    };
};
