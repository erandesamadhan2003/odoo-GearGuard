import { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/common/Card";
import { useDashboard } from "@/hooks/useDashboard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, TrendingUp, Users, Wrench } from "lucide-react";
import { api, DASHBOARD_URL } from "@/api/api";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export const AnalyticsPage = () => {
  const {
    stats,
    requestsByTeam,
    requestsByCategory,
    loading,
    getDashboardStats,
    getRequestsByTeam,
    getRequestsByCategory,
  } = useDashboard();
  const [requestsOverTime, setRequestsOverTime] = useState([]);
  const [technicianPerformance, setTechnicianPerformance] = useState([]);
  const [loadingTimeSeries, setLoadingTimeSeries] = useState(false);

  useEffect(() => {
    getDashboardStats();
    getRequestsByTeam();
    getRequestsByCategory();
    fetchRequestsOverTime();
    fetchTechnicianPerformance();
  }, []);

  const fetchRequestsOverTime = async () => {
    try {
      setLoadingTimeSeries(true);
      const response = await api.get(DASHBOARD_URL.REQUESTS_OVER_TIME, {
        params: { days: 30 },
      });
      setRequestsOverTime(response.data.data || []);
    } catch (error) {
      console.error("Fetch requests over time error:", error);
    } finally {
      setLoadingTimeSeries(false);
    }
  };

  const fetchTechnicianPerformance = async () => {
    try {
      const response = await api.get(DASHBOARD_URL.TECHNICIAN_PERFORMANCE);
      setTechnicianPerformance(response.data.data || []);
    } catch (error) {
      console.error("Fetch technician performance error:", error);
    }
  };

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
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-600 mt-1">
            Comprehensive insights and performance metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Requests</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {stats?.totalRequests || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">In Progress</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {stats?.byStage?.in_progress || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Completed</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {stats?.byStage?.completed || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Overdue</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {stats?.overdueCount || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Requests Over Time */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Requests Over Time (Last 30 Days)
              </h3>
              {loadingTimeSeries ? (
                <div className="flex items-center justify-center h-64">
                  <LoadingSpinner />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={requestsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString();
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Requests"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Requests by Category */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Requests by Category
              </h3>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <LoadingSpinner />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={requestsByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {requestsByCategory.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Requests by Team */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Requests by Team
              </h3>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <LoadingSpinner />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={requestsByTeam}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="teamName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" name="Requests" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Technician Performance */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Technician Performance
              </h3>
              {technicianPerformance.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-slate-500">
                  <p>No performance data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={technicianPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="technicianName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#10b981" name="Completed" />
                    <Bar dataKey="inProgress" fill="#3b82f6" name="In Progress" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

