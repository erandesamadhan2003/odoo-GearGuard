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
import { useNavigate } from "react-router";
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

  // Operator Dashboard
  if (isOperator(user)) {
    return <OperatorDashboard />;
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

// Operator Dashboard Component
const OperatorDashboard = () => {
  const { myRequests, loading, getMyRequests } = useRequest();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getMyRequests();
      } catch (error) {
        console.error("Failed to fetch my requests:", error);
      }
    };
    fetchData();
  }, []);

  const inProgressCount = myRequests.filter(
    (r) => r.stage === "in_progress"
  ).length;
  const completedCount = myRequests.filter(
    (r) => r.stage === "completed" || r.stage === "repaired"
  ).length;
  const newCount = myRequests.filter((r) => r.stage === "new").length;

  const getPriorityVariant = (priority) => {
    const map = {
      low: "default",
      medium: "info",
      high: "warning",
      urgent: "danger",
    };
    return map[priority] || "default";
  };

  const getStageVariant = (stage) => {
    const map = {
      new: "info",
      in_progress: "warning",
      on_hold: "default",
      completed: "success",
      cancelled: "danger",
      repaired: "success",
      scrapped: "danger",
    };
    return map[stage] || "default";
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Dashboard</h1>
            <p className="text-slate-600 mt-1">
              Track your maintenance requests
            </p>
          </div>
          <Button
            onClick={() => navigate("/requests/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Request
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="bg-white hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/requests")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Requests</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {myRequests.length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-white hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/requests?stage=in_progress")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {inProgressCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-white hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/requests?stage=completed")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {completedCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Requests List */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                My Recent Requests
              </h2>
              <Button
                variant="outline"
                onClick={() => navigate("/requests")}
                className="text-sm"
              >
                View All
              </Button>
            </div>

            {myRequests.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl">
                <Wrench className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-2 text-lg">
                  You haven't created any requests yet
                </p>
                <p className="text-slate-500 text-sm mb-6">
                  Create your first maintenance request to get started
                </p>
                <Button
                  onClick={() => navigate("/requests/new")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Request
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {myRequests.slice(0, 5).map((request) => (
                  <div
                    key={request.requestId}
                    onClick={() => navigate(`/requests/${request.requestId}`)}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-blue-300 cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">
                        {request.subject}
                      </h3>
                      <div className="flex gap-2">
                        <Badge variant={getPriorityVariant(request.priority)}>
                          {request.priority}
                        </Badge>
                        <Badge variant={getStageVariant(request.stage)}>
                          {request.stage?.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                    {request.description && (
                      <p className="text-sm text-slate-600 line-clamp-1 mb-2">
                        {request.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      {request.equipment && (
                        <span className="flex items-center gap-1">
                          <Wrench className="w-3 h-3" />
                          {request.equipment.equipmentName}
                        </span>
                      )}
                      {request.scheduledDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {moment(request.scheduledDate).format("MMM D, YYYY")}
                        </span>
                      )}
                      {request.assignedTo && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Assigned to {request.assignedTo.fullName}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {myRequests.length > 5 && (
                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/requests")}
                      className="text-sm"
                    >
                      View All {myRequests.length} Requests →
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
