import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux";

import authReducer from "./slices/authSlice.js";
import userReducer from "./slices/userSlice.js";
import departmentReducer from "./slices/departmentSlice.js";
import teamReducer from "./slices/teamSlice.js";
import equipmentCategoryReducer from "./slices/equipmentCategorySlice.js";
import equipmentReducer from "./slices/equipementSlice.js";
import maintenanceRequestReducer from "./slices/maintenanceRequestSlice.js";
import dashboardReducer from "./slices/dashboardSlice.js";

// Persist configuration
const persistConfig = {
    key: "root",
    storage,
    whitelist: [
        "auth", // Persist auth state
        "user", // Persist user data
        "department", // Persist departments
        "team", // Persist teams
        "equipmentCategory", // Persist categories
        "equipment", // Persist equipment
        "maintenanceRequest", // Persist requests
        "dashboard" // Persist dashboard data
    ],
    // Optionally blacklist certain reducers or nested state
    // blacklist: ["someReducer"]
};

// Combine all reducers
const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    department: departmentReducer,
    team: teamReducer,
    equipmentCategory: equipmentCategoryReducer,
    equipment: equipmentReducer,
    maintenanceRequest: maintenanceRequestReducer,
    dashboard: dashboardReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types from redux-persist
                ignoredActions: [
                    "persist/PERSIST",
                    "persist/REHYDRATE",
                    "persist/PAUSE",
                    "persist/PERSIST",
                    "persist/PURGE",
                    "persist/REGISTER",
                ],
            },
        }),
});

// Create persistor
export const persistor = persistStore(store);
