import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { KanbanColumn } from "./KanbanColumn";
import { useRequest } from "@/hooks/useRequest";
import { useTeams } from "@/hooks/useTeams";
import { useAuth } from "@/hooks/useAuth";
import { Select } from "@/components/common/Select";
import { Card } from "@/components/common/Card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useSearchParams } from "react-router";
import { isAdminOrManager, isTechnician, isOperator } from "@/utils/roles";

const stages = [
  { key: "new", label: "New" },
  { key: "in_progress", label: "In Progress" },
  { key: "on_hold", label: "On Hold" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export const KanbanBoard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { 
    requests, 
    assignedRequests,
    myRequests,
    loading, 
    getAllRequests, 
    getAssignedRequests,
    getMyRequests,
    moveRequest 
  } = useRequest();
  const { teams, getAllTeams } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState(
    searchParams.get("team") || "all"
  );

  useEffect(() => {
    if (isAdminOrManager(user)) {
      getAllRequests();
      getAllTeams();
    } else if (isTechnician(user)) {
      getAssignedRequests();
    } else if (isOperator(user)) {
      getMyRequests();
    }
  }, [user]);

  const handleDrop = async (requestId, newStage) => {
    // Get requests based on role
    const roleRequests = isAdminOrManager(user) 
      ? requests 
      : isTechnician(user) 
      ? assignedRequests 
      : myRequests;
    
    const request = roleRequests.find((r) => (r.requestId || r.id) === requestId);
    if (request && request.stage !== newStage) {
      // Check if user can update this request
      if (isTechnician(user) && request.assignedToUserId !== user.userId) {
        console.error("You can only update requests assigned to you");
        return;
      }
      
      try {
        const id = request.requestId || request.id;
        const currentStage = request.stage || "new";
        await moveRequest(id, currentStage, newStage);
        // Refresh requests after move
        if (isAdminOrManager(user)) {
          await getAllRequests();
        } else if (isTechnician(user)) {
          await getAssignedRequests();
        } else {
          await getMyRequests();
        }
      } catch (error) {
        console.error("Failed to move request:", error);
      }
    }
  };

  // Get requests based on role
  const getRoleBasedRequests = () => {
    if (isAdminOrManager(user)) return requests;
    if (isTechnician(user)) return assignedRequests;
    if (isOperator(user)) return myRequests;
    return [];
  };

  const roleRequests = getRoleBasedRequests();

  const filteredRequests =
    selectedTeam === "all"
      ? roleRequests
      : roleRequests.filter(
          (r) => r.maintenanceTeamId === parseInt(selectedTeam)
        );

  const grouped = {
    new: [],
    in_progress: [],
    on_hold: [],
    completed: [],
    cancelled: [],
  };

  filteredRequests.forEach((r) => {
    const stage = r.stage || "new";
    if (grouped[stage]) {
      grouped[stage].push(r);
    } else {
      grouped.new.push(r);
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Filters - Only for Admin/Manager */}
      {isAdminOrManager(user) && (
        <Card className="mb-6">
          <div className="p-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-slate-700">Filter by Team:</label>
              <Select
                value={selectedTeam}
                onChange={setSelectedTeam}
                className="w-64"
                options={[
                  { value: "all", label: "All Teams" },
                  ...teams.map((team) => ({
                    value: team.teamId,
                    label: team.teamName,
                  })),
                ]}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.key}
            stage={stage.key}
            label={stage.label}
            items={grouped[stage.key] || []}
            onDrop={handleDrop}
          />
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No requests found. Try adjusting your filters.
        </div>
      )}
    </DndProvider>
  );
};
