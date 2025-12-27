import { useDispatch, useSelector } from "react-redux";
import {
    fetchDashboardStats,
    fetchOverdueRequests,
    fetchRequestsByTeam,
    fetchRequestsByCategory,
    clearError,
    clearDashboardData
} from "@/store/slices/dashboardSlice";

export const useDashboard = () => {
    const dispatch = useDispatch();

    // Dashboard state
    const {
        stats,
        overdueRequests,
        requestsByTeam,
        requestsByCategory,
        loading,
        error
    } = useSelector((state) => state.dashboard);

    // Dashboard Methods
    const getDashboardStats = async () => {
        try {
            const result = await dispatch(fetchDashboardStats()).unwrap();
            return result;
        } catch (err) {
            console.error('Get dashboard stats error:', err);
            // Don't throw, just log the error to prevent uncaught promise rejection
            return null;
        }
    };

    const getOverdueRequests = async () => {
        try {
            const result = await dispatch(fetchOverdueRequests()).unwrap();
            return result;
        } catch (err) {
            console.error('Get overdue requests error:', err);
            throw err;
        }
    };

    const getRequestsByTeam = async () => {
        try {
            const result = await dispatch(fetchRequestsByTeam()).unwrap();
            return result;
        } catch (err) {
            console.error('Get requests by team error:', err);
            return null;
        }
    };

    const getRequestsByCategory = async () => {
        try {
            const result = await dispatch(fetchRequestsByCategory()).unwrap();
            return result;
        } catch (err) {
            console.error('Get requests by category error:', err);
            return null;
        }
    };

    // Utility Methods
    const clearDashboardError = () => {
        dispatch(clearError());
    };

    const clearData = () => {
        dispatch(clearDashboardData());
    };

    return {
        // State
        stats,
        overdueRequests,
        requestsByTeam,
        requestsByCategory,
        loading,
        error,

        // Methods
        getDashboardStats,
        getOverdueRequests,
        getRequestsByTeam,
        getRequestsByCategory,

        // Utility methods
        clearDashboardError,
        clearData
    };
};
