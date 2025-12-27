import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";
import { KanbanBoard } from "@/components/requests/KanbanBoard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { isOperator } from "@/utils/roles";

export default function KanbanPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Maintenance Board
            </h1>
            <p className="text-slate-600 mt-1">
              Drag and drop requests to update their status
            </p>
          </div>
          {isOperator(user) && (
            <Button
              onClick={() => navigate("/requests/new")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-4 py-3 bg-white rounded-lg border border-slate-200 flex-wrap">
          <span className="text-sm font-medium text-slate-600">
            Column Colors:
          </span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-slate-600">New</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-xs text-slate-600">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-xs text-slate-600">On Hold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-slate-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-slate-600">Cancelled</span>
          </div>
        </div>

        <KanbanBoard />
      </div>
    </DashboardLayout>
  );
}
