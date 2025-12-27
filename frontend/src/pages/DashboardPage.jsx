import StatCard from "../components/dashboard/StatCard";

export const DashboardPage=()=> {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Requests" value="120" />
        <StatCard title="New" value="25" />
        <StatCard title="In Progress" value="40" />
        <StatCard title="Overdue" value="8" />
      </div>
    </div>
  );
}
