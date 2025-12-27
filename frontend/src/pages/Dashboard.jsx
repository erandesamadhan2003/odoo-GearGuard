import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";

export const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="text-lg text-slate-600">
          Welcome to your GearGuard dashboard.
        </p>
      </div>
    </DashboardLayout>
  );
};
