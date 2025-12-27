import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import userReducer from "./slices/userSlice.js";
import departmentReducer from "./slices/departmentSlice.js";
import teamReducer from "./slices/teamSlice.js";
import equipmentCategoryReducer from "./slices/equipmentCategorySlice.js";
import equipmentReducer from "./slices/equipementSlice.js";
import maintenanceRequestReducer from "./slices/maintenanceRequestSlice.js";
import dashboardReducer from "./slices/dashboardSlice.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        department: departmentReducer,
        team: teamReducer,
        equipmentCategory: equipmentCategoryReducer,
        equipment: equipmentReducer,
        maintenanceRequest: maintenanceRequestReducer,
        dashboard: dashboardReducer,
    },
});
