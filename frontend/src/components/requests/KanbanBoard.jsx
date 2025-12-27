import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { KanbanColumn } from "./KanbanColumn";

const teams = [
  { id: 1, name: "Electrical Team" },
  { id: 2, name: "Mechanical Team" },
  { id: 3, name: "IT Support" },
];

const requests = [
  {
   request_id: 1,
    subject: "AC not working",
    stage: "new",
    priority: "urgent",
    equipment_name: "Office AC",
    is_overdue: true,
    maintenance_team_id: 1,
    assigned_technician: { name: "Rahul" },
  },
  {
    request_id: 2,
    subject: "Printer issue",
    stage: "in_progress",
    priority: "medium",
    equipment_name: "HP Printer",
    is_overdue: false,
    maintenance_team_id: 3,
    assigned_technician: { name: "Anita" },
  },
  {
    request_id: 3,
    subject: "Generator maintenance",
    stage: "repaired",
    priority: "low",
    equipment_name: "Generator",
    is_overdue: false,
    maintenance_team_id: 2,
    assigned_technician: { name: "Rohit" },
  },
  {
    request_id: 4,
    subject: "Network switch failure",
    stage: "new",
    priority: "high",
    equipment_name: "Cisco Switch",
    is_overdue: true,
    maintenance_team_id: 3,
    assigned_technician: null,
  },
  {
    request_id: 5,
    subject: "Water leakage near pump",
    stage: "in_progress",
    priority: "urgent",
    equipment_name: "Water Pump",
    is_overdue: true,
    maintenance_team_id: 2,
    assigned_technician: { name: "Suresh" },
  }
];

export const KanbanBoard = () => {
  const [selectedTeam, setSelectedTeam] = useState("all");

  const filteredRequests =
    selectedTeam === "all"
      ? requests
      : requests.filter(
          r => r.maintenance_team_id === Number(selectedTeam)
        );

  const grouped = {
    new: [],
    in_progress: [],
    repaired: [],
    scrapped: [],
  };

  filteredRequests.forEach(r => grouped[r.stage].push(r));

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Team Filter */}
      <div className="flex gap-4 mb-4">
        <select
          className="border px-3 py-2 rounded"
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
        >
          <option value="all">All Teams</option>
          {teams.map(t => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["new", "in_progress", "repaired", "scrapped"].map(stage => (
          <KanbanColumn
            key={stage}
            stage={stage}
            items={grouped[stage]}
          />
        ))}
      </div>
    </DndProvider>
  );
};
