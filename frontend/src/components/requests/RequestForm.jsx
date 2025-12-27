import { useState } from "react";
import { FaTools, FaUserCog } from "react-icons/fa";

const mockEquipment = [
    {
        equipment_id: 1,
        equipment_name: "Office AC",
        category_id: 1,
        maintenance_team_id: 2,
        maintenance_team_name: "Mechanical Team",
        default_technician_id: 5,
        technician_name: "Rahul",
    },
    {
        equipment_id: 2,
        equipment_name: "Printer",
        category_id: 2,
        maintenance_team_id: 3,
        maintenance_team_name: "IT Support",
        default_technician_id: 6,
        technician_name: "Anita",
    },
];

export const RequestForm = ({initialData}) => {
    const [search, setSearch] = useState("");
    const [form, setForm] = useState(
        initialData || {
            subject: "",
            description: "",
            equipmentId: "",
            categoryId: null,
            maintenanceTeamId: null,
            assignedToUserId: null,
            priority: "medium",
            requestType: "corrective",
            scheduledDate: "",
            durationHours: "",
        }
    );

    // 🔹 Auto-fill logic when equipment selected
    const handleEquipmentChange = (id) => {
        const eq = mockEquipment.find(e => e.equipment_id === Number(id));

        setForm(prev => ({
            ...prev,
            equipmentId: id,
            categoryId: eq?.category_id,
            maintenanceTeamId: eq?.maintenance_team_id,
            assignedToUserId: eq?.default_technician_id,
            technicianName: eq?.technician_name,
            teamName: eq?.maintenance_team_name,
        }));
    };

    const filteredEquipment = mockEquipment.filter(eq =>
        eq.equipment_name.toLowerCase().includes(search.toLowerCase())
    );

    const submit = (e) => {
        e.preventDefault();
        console.log("FINAL REQUEST DATA:", form);
        alert("Request submitted (mock)");
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">
                Create Maintenance Request
            </h2>

            <form onSubmit={submit} className="space-y-5">

                {/* Subject */}
                <div>
                    <label className="text-sm font-medium">Subject</label>
                    <input
                        className="input mt-1"
                        placeholder="Enter issue title"
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        className="input mt-1 min-h-[90px]"
                        placeholder="Describe the issue..."
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                </div>

                {/* Equipment Search */}
                <div>
                    <label className="text-sm font-medium">Equipment</label>
                    <input
                        className="input mt-1"
                        placeholder="Search equipment..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="input mt-2"
                        value={form.equipmentId}
                        onChange={(e) => handleEquipmentChange(e.target.value)}
                    >
                        <option value="">Select Equipment</option>
                        {filteredEquipment.map(eq => (
                            <option key={eq.equipment_id} value={eq.equipment_id}>
                                {eq.equipment_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Auto-filled info */}
                {(form.teamName || form.technicianName) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded">
                        <div className="flex items-center gap-2 text-sm">
                            <FaTools className="text-gray-600" />
                            <span>
                                <strong>Team:</strong>{" "}
                                {form.teamName || "Not Assigned"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <FaUserCog className="text-gray-600" />
                            <span>
                                <strong>Technician:</strong>{" "}
                                {form.technicianName || "Not Assigned"}
                            </span>
                        </div>
                    </div>
                )}

                {/* Priority & Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Priority</label>
                        <select
                            className="input mt-1"
                            value={form.priority}
                            onChange={(e) =>
                                setForm({ ...form, priority: e.target.value })
                            }
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Request Type</label>
                        <select
                            className="input mt-1"
                            value={form.requestType}
                            onChange={(e) =>
                                setForm({ ...form, requestType: e.target.value })
                            }
                        >
                            <option value="corrective">Corrective</option>
                            <option value="preventive">Preventive</option>
                        </select>
                    </div>
                </div>

                {/* Date & Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Scheduled Date</label>
                        <input
                            type="date"
                            className="input mt-1"
                            value={form.scheduledDate}
                            onChange={(e) =>
                                setForm({ ...form, scheduledDate: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Duration (hours)</label>
                        <input
                            type="number"
                            step="0.5"
                            className="input mt-1"
                            placeholder="e.g. 2.5"
                            value={form.durationHours}
                            onChange={(e) =>
                                setForm({ ...form, durationHours: e.target.value })
                            }
                        />
                    </div>
                </div>

                {/* Submit */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                    >
                        Create Request
                    </button>
                </div>
            </form>
        </div>
    );
};