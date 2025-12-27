import { googleLogin } from "@/services/auth.service";
import { clearError, getCurrentUser, loginUser, logoutUser, registerUser, setCredentials, verifyUserToken } from "@/store/slices/authSlice";
import { fetchAllUsers, fetchUserById, modifyUser, removeUser, fetchTechnicians } from "@/store/slices/userSlice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router";

export const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const hasCheckedAuth = useRef(false);

    // Auth state
    const { user, token, loading, error, isAuthenticated } = useSelector((state) => state.auth);

    // User management state
    const { users, technicians, selectedUser, loading: userLoading, error: userError } = useSelector((state) => state.user);

    // Check authentication on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken && !user && !hasCheckedAuth.current) {
            hasCheckedAuth.current = true;
            dispatch(getCurrentUser());
        }
    }, [dispatch, user]);

    // Authentication Methods
    const register = async (userData) => {
        try {
            const result = await dispatch(registerUser(userData)).unwrap();
            navigate('/dashboard');
            return result;
        } catch (err) {
            console.error('Registration error:', err);
            throw err;
        }
    }

    const login = async (credentials) => {
        try {
            const result = await dispatch(loginUser(credentials)).unwrap();
            navigate('/dashboard');
            return result;
        } catch (err) {
            console.error('Login error:', err);
            throw err;
        }
    }

    const logout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
            // Navigate to login even if logout fails
            navigate('/login');
        }
    }

    const googleLoginHandler = () => {
        googleLogin();
    }

    const verifyAuthToken = async (token) => {
        try {
            // First set the token in localStorage
            localStorage.setItem('token', token);

            // Then fetch user data with the token
            const result = await dispatch(verifyUserToken(token)).unwrap();

            // Ensure credentials are properly set
            dispatch(setCredentials({
                user: result.user,
                token: token
            }));

            // Small delay to ensure state is updated
            setTimeout(() => {
                navigate('/dashboard');
            }, 100);

            return result;
        } catch (err) {
            navigate('/login');
            console.error('Token verification error:', err);
            throw err;
        }
    }

    const fetchCurrentUser = async () => {
        try {
            const result = await dispatch(getCurrentUser()).unwrap();
            return result;
        } catch (err) {
            console.error('Fetch current user error:', err);
            throw err;
        }
    }

    // User Management Methods
    const getAllUsers = async () => {
        try {
            const result = await dispatch(fetchAllUsers()).unwrap();
            return result;
        } catch (err) {
            console.error('Get all users error:', err);
            throw err;
        }
    }

    const getUserById = async (userId) => {
        try {
            const result = await dispatch(fetchUserById(userId)).unwrap();
            return result;
        } catch (err) {
            console.error('Get user by ID error:', err);
            throw err;
        }
    }

    const updateUser = async (userId, userData) => {
        try {
            const result = await dispatch(modifyUser({ userId, userData })).unwrap();
            return result;
        } catch (err) {
            console.error('Update user error:', err);
            throw err;
        }
    }

    const deleteUser = async (userId) => {
        try {
            const result = await dispatch(removeUser(userId)).unwrap();
            return result;
        } catch (err) {
            console.error('Delete user error:', err);
            throw err;
        }
    }

    const getTechnicians = async () => {
        try {
            const result = await dispatch(fetchTechnicians()).unwrap();
            return result;
        } catch (err) {
            console.error('Get technicians error:', err);
            throw err;
        }
    }

    // Error Handling
    const clearAuthError = () => {
        dispatch(clearError());
    }

    return {
        // Auth state
        user,
        token,
        loading,
        error,
        isAuthenticated,

        // User management state
        users,
        technicians,
        selectedUser,
        userLoading,
        userError,

        // Authentication methods
        register,
        login,
        logout,
        googleLoginHandler,
        verifyAuthToken,
        fetchCurrentUser,

        // User management methods
        getAllUsers,
        getUserById,
        updateUser,
        deleteUser,
        getTechnicians,

        // Utility methods
        clearAuthError
    }
}