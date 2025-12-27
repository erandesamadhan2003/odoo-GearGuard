import { useEffect } from "react";
import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";
import { useDashboard } from "@/hooks/useDashboard";
import { useRequest } from "@/hooks/useRequest";
import { useAuth } from "@/hooks/useAuth";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { OverdueAlert } from "@/components/dashboard/OverdueAlert";
import { RecentRequests } from "@/components/dashboard/RecentRequests";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  ClipboardList,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
} from "lucide-react";
import { useNavigate, Navigate } from "react-router";
import { isAdminOrManager, isTechnician, isOperator } from "@/utils/roles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import moment from "moment";

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Admin/Manager Dashboard
  if (isAdminOrManager(user)) {
    return <AdminManagerDashboard />;
  }

  // Technician Dashboard
  if (isTechnician(user)) {
    return <TechnicianDashboard />;
  }

  // Operators should be redirected to requests page instead
  if (isOperator(user)) {
    return <Navigate to="/requests" replace />;
  }

  // Default fallback
  return (
    <DashboardLayout>
      <div className="text-center py-12">
        <p className="text-slate-600">Loading dashboard...</p>
      </div>
    </DashboardLayout>
  );
};

// Admin/Manager Dashboard Component
const AdminManagerDashboard = () => {
  const { stats, loading, getDashboardStats, getOverdueRequests } =
    useDashboard();
  const { requests, getAllRequests } = useRequest();
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardStats();
    getOverdueRequests();
    getAllRequests();
  }, []);

  if (loading && !stats) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">
              Overview of your maintenance operations
            </p>
          </div>
          <QuickActions />
        </div>

        <OverdueAlert count={stats?.overdueCount || 0} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Requests"
            value={stats?.totalRequests || 0}
            icon={ClipboardList}
            variant="primary"
            onClick={() => navigate("/requests")}
          />
          <StatsCard
            title="In Progress"
            value={stats?.byStage?.in_progress || 0}
            icon={Clock}
            variant="warning"
            onClick={() => navigate("/requests?stage=in_progress")}
          />
          <StatsCard
            title="Completed"
            value={stats?.byStage?.completed || 0}
            icon={CheckCircle2}
            variant="success"
            onClick={() => navigate("/requests?stage=completed")}
          />
          <StatsCard
            title="Overdue"
            value={stats?.overdueCount || 0}
            icon={AlertTriangle}
            variant="danger"
            onClick={() => navigate("/requests?filter=overdue")}
          />
        </div>

        <RecentRequests requests={requests.slice(0, 5)} />
      </div>
    </DashboardLayout>
  );
};

// Technician Dashboard Component
const TechnicianDashboard = () => {
  const { assignedRequests, loading, getAssignedRequests } = useRequest();
  const navigate = useNavigate();

  useEffect(() => {
    getAssignedRequests();
  }, []);

  const inProgressCount = assignedRequests.filter(
    (r) => r.stage === "in_progress"
  ).length;
  const completedCount = assignedRequests.filter(
    (r) => r.stage === "completed" || r.stage === "repaired"
  ).length;
  const newCount = assignedRequests.filter((r) => r.stage === "new").length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Dashboard</h1>
          <p className="text-slate-600 mt-1">Requests assigned to you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="New Assignments"
            value={newCount}
            icon={ClipboardList}
            variant="info"
            onClick={() => navigate("/requests?stage=new")}
          />
          <StatsCard
            title="In Progress"
            value={inProgressCount}
            icon={Clock}
            variant="warning"
            onClick={() => navigate("/requests?stage=in_progress")}
          />
          <StatsCard
            title="Completed"
            value={completedCount}
            icon={CheckCircle2}
            variant="success"
            onClick={() => navigate("/requests?stage=completed")}
          />
        </div>

        <RecentRequests
          requests={assignedRequests.slice(0, 5)}
          title="Recently Assigned Requests"
        />
      </div>
    </DashboardLayout>
  );
};
