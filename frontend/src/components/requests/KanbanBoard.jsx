import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { KanbanColumn } from "./KanbanColumn";
import { useRequest } from "@/hooks/useRequest";
import { useTeams } from "@/hooks/useTeams";
import { Select } from "@/components/common/Select";
import { Card } from "@/components/common/Card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useSearchParams } from "react-router";

const stages = [
  { key: "new", label: "New" },
  { key: "in_progress", label: "In Progress" },
  { key: "repaired", label: "Repaired" },
  { key: "scrapped", label: "Scrapped" },
];

export const KanbanBoard = () => {
  const [searchParams] = useSearchParams();
  const { requests, loading, getAllRequests, moveRequest } = useRequest();
  const { teams, getAllTeams } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState(
    searchParams.get("team") || "all"
  );

  useEffect(() => {
    getAllRequests();
    getAllTeams();
  }, []);

  const handleDrop = async (requestId, newStage) => {
    const request = requests.find((r) => r.requestId === requestId);
    if (request && request.stage !== newStage) {
      try {
        await moveRequest(requestId, request.stage, newStage);
      } catch (error) {
        console.error("Failed to move request:", error);
      }
    }
  };

  const filteredRequests =
    selectedTeam === "all"
      ? requests
      : requests.filter(
          (r) => r.maintenanceTeamId === parseInt(selectedTeam)
        );

  const grouped = {
    new: [],
    in_progress: [],
    repaired: [],
    scrapped: [],
  };

  filteredRequests.forEach((r) => {
    if (grouped[r.stage]) {
      grouped[r.stage].push(r);
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
      {/* Filters */}
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

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
