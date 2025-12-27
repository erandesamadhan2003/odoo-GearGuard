import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";
import { KanbanBoard } from "@/components/requests/KanbanBoard";

export default function KanbanPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Maintenance Board</h1>
          <p className="text-slate-600 mt-1">
            Drag and drop requests to update their status
          </p>
        </div>
        <KanbanBoard />
      </div>
    </DashboardLayout>
  );
}