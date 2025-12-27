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
          {/* Show "New Request" button for operators */}
          {isOperator(user) && (
            <Button
              onClick={() => navigate("/requests/new")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          )}
        </div>
        <KanbanBoard />
      </div>
    </DashboardLayout>
  );
}
