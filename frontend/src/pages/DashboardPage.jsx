import { useEffect } from "react";
import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";
import { useDashboard } from "@/hooks/useDashboard";
import { useRequest } from "@/hooks/useRequest";
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
  Clock
} from "lucide-react";
import { useNavigate } from "react-router";

export const DashboardPage = () => {
  const {
    stats,
    overdueRequests,
    loading,
    getDashboardStats,
    getOverdueRequests,
  } = useDashboard();
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">
              Overview of your maintenance operations
            </p>
          </div>
          <QuickActions />
        </div>

        {/* Overdue Alert */}
        <OverdueAlert count={stats?.overdueCount || 0} />

        {/* Stats Grid */}
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
            title="Repaired"
            value={stats?.byStage?.repaired || 0}
            icon={CheckCircle2}
            variant="success"
            onClick={() => navigate("/requests?stage=repaired")}
          />
          <StatsCard
            title="Overdue"
            value={stats?.overdueCount || 0}
            icon={AlertTriangle}
            variant="danger"
            onClick={() => navigate("/requests?filter=overdue")}
          />
        </div>

        {/* Recent Requests */}
        <RecentRequests 
          requests={requests.slice(0, 5)} 
        />
      </div>
    </DashboardLayout>
  );
};
