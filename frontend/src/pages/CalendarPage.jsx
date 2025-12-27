import { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";
import { useRequest } from "@/hooks/useRequest";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/common/Card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { MaintenanceCalendar } from "@/components/calender/MaintenanceCalendar";
import { Badge } from "@/components/common/Badge";
import { Select } from "@/components/common/Select";
import { isAdminOrManager } from "@/utils/roles";
import { Navigate } from "react-router";

export const CalendarPage = () => {
  const { user } = useAuth();
  const { calendarEvents, loading, getCalendarRequests } = useRequest();
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Only Admin and Manager can view Calendar (following dashboard pattern)
  if (!isAdminOrManager(user)) {
    return <Navigate to="/requests" replace />;
  }

  useEffect(() => {
    getCalendarRequests();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStageColor = (stage) => {
    switch (stage?.toLowerCase()) {
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in_progress":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "on_hold":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Calendar</h1>
            <p className="text-slate-600 mt-1">
              View and manage scheduled maintenance requests
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={view}
              onChange={setView}
              options={[
                { value: "month", label: "Month" },
                { value: "week", label: "Week" },
                { value: "day", label: "Day" },
                { value: "agenda", label: "Agenda" },
              ]}
              className="w-32"
            />
          </div>
        </div>

        {/* Calendar */}
        {loading ? (
          <div className="flex items-center justify-center h-[600px]">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <MaintenanceCalendar 
                view={view} 
                currentDate={currentDate}
                onViewChange={setView}
                onNavigate={setCurrentDate}
              />
            </CardContent>
          </Card>
        )}

        {/* Legend */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">Priority:</span>
                <Badge className={getPriorityColor("high")}>High</Badge>
                <Badge className={getPriorityColor("medium")}>Medium</Badge>
                <Badge className={getPriorityColor("low")}>Low</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">Stage:</span>
                <Badge className={getStageColor("completed")}>Completed</Badge>
                <Badge className={getStageColor("in_progress")}>In Progress</Badge>
                <Badge className={getStageColor("on_hold")}>On Hold</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

