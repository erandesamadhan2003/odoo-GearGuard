import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import "./App.css";
import { Home } from "./pages/Home";
import { Login } from "./pages/auth/Login";
import { Signup } from "./pages/auth/Signup";
import { DashboardPage } from "./pages/DashboardPage";
import { useSelector } from "react-redux";
import KanbanPage from "./pages/KanbanPage";
import { CreateRequestPage } from "./pages/requests/CreateRequestPage";
import { EditRequestPage } from "./pages/requests/EditRequestPage";
import { RequestDetailPage } from "./pages/RequestDetailPage";
import { RequestsPage } from "./pages/RequestsPage";
import { EquipmentPage } from "./pages/EquipmentPage";
import { EquipmentDetailPage } from "./pages/EquipmentDetailPage";
import { CreateEquipmentPage } from "./pages/CreateEquipmentPage";
import { EditEquipmentPage } from "./pages/EditEquipmentPage";
import { TeamsPage } from "./pages/TeamsPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { DepartmentsPage } from "./pages/DepartmentsPage";
import { CalendarPage } from "./pages/CalendarPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AuthCallBack } from "./pages/auth/AuthCallBack";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) {
    return null;
  }

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) {
    return null;
  }

  if (token && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },
  {
    path: "/auth/callback",
    element: <AuthCallBack />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/equipment",
    element: (
      <ProtectedRoute>
        <EquipmentPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/equipment/new",
    element: (
      <ProtectedRoute>
        <CreateEquipmentPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/equipment/:id",
    element: (
      <ProtectedRoute>
        <EquipmentDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/equipment/:id/edit",
    element: (
      <ProtectedRoute>
        <EditEquipmentPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/requests",
    element: (
      <ProtectedRoute>
        <KanbanPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/requests/list",
    element: (
      <ProtectedRoute>
        <RequestsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/requests/new",
    element: (
      <ProtectedRoute>
        <CreateRequestPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/requests/:id",
    element: (
      <ProtectedRoute>
        <RequestDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/requests/:id/edit",
    element: (
      <ProtectedRoute>
        <EditRequestPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/kanban",
    element: (
      <ProtectedRoute>
        <KanbanPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teams",
    element: (
      <ProtectedRoute>
        <TeamsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/categories",
    element: (
      <ProtectedRoute>
        <CategoriesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/departments",
    element: (
      <ProtectedRoute>
        <DepartmentsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/calendar",
    element: (
      <ProtectedRoute>
        <CalendarPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/analytics",
    element: (
      <ProtectedRoute>
        <AnalyticsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={Router} />
    </>
  );
}

export default App;
