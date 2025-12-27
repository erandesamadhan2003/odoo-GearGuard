import axios from "axios";

export const BASE_URL = "http://localhost:3000/api";

export const AUTH_URL = {
    REGISTER: `/auth/register`,
    LOGIN: `/auth/login`,
    GOOGLE_AUTH: `/auth/google`,
    GET_PROFILE: `/auth/profile`,
    LOGOUT: `/auth/logout`
}

export const USER_URL = {
    GET_ALL: '/users',
    GET_BY_ID: (userId) => `/users/${userId}`,
    UPDATE: (userId) => `/users/${userId}`,
    DELETE: (userId) => `/users/${userId}`,
    GET_TECHNICIANS: '/users/technicians',
};

export const DEPARTMENT_URL = {
    GET_ALL: '/departments',
    CREATE: '/departments',
    UPDATE: (departmentId) => `/departments/${departmentId}`,
    DELETE: (departmentId) => `/departments/${departmentId}`,
};

export const TEAM_URL = {
    GET_ALL: '/teams',
    GET_BY_ID: (teamId) => `/teams/${teamId}`,
    CREATE: '/teams',
    UPDATE: (teamId) => `/teams/${teamId}`,
    DELETE: (teamId) => `/teams/${teamId}`,
    ADD_MEMBER: (teamId) => `/teams/${teamId}/members`,
    REMOVE_MEMBER: (teamId, userId) => `/teams/${teamId}/members/${userId}`,
};

export const EQUIPMENT_CATEGORY_URL = {
    GET_ALL: '/categories',
    CREATE: '/categories',
    UPDATE: (categoryId) => `/categories/${categoryId}`,
    DELETE: (categoryId) => `/categories/${categoryId}`,
};

export const EQUIPMENT_URL = {
    GET_ALL: '/equipment',
    GET_BY_ID: (equipmentId) => `/equipment/${equipmentId}`,
    CREATE: '/equipment',
    UPDATE: (equipmentId) => `/equipment/${equipmentId}`,
    DELETE: (equipmentId) => `/equipment/${equipmentId}`,
    GET_REQUESTS: (equipmentId) => `/equipment/${equipmentId}/requests`,
    GET_BY_DEPARTMENT: (departmentId) => `/equipment/by-department/${departmentId}`,
};

export const MAINTENANCE_REQUEST_URL = {
    GET_ALL: '/requests',
    GET_BY_ID: (requestId) => `/requests/${requestId}`,
    CREATE: '/requests',
    UPDATE: (requestId) => `/requests/${requestId}`,
    DELETE: (requestId) => `/requests/${requestId}`,
    UPDATE_STAGE: (requestId) => `/requests/${requestId}/stage`,
    ASSIGN: (requestId) => `/requests/${requestId}/assign`,
    GET_CALENDAR: '/requests/calendar',
    GET_MY_REQUESTS: '/requests/my-requests',
    GET_ASSIGNED_TO_ME: '/requests/assigned-to-me',
};

export const DASHBOARD_URL = {
    GET_STATS: '/dashboard/stats',
    GET_OVERDUE: '/dashboard/overdue',
    REQUESTS_BY_TEAM: '/reports/requests-by-team',
    REQUESTS_BY_CATEGORY: '/reports/requests-by-category',
};

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('Access forbidden');
                    break;
                case 404:
                    console.error('Resource not found');
                    break;
                case 500:
                    console.error('Server error');
                    break;
                default:
                    console.error('An error occurred:', error.response.data.message);
            }
        } else if (error.request) {
            console.error('Network error - no response from server');
        } else {
            console.error('Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export { api };

