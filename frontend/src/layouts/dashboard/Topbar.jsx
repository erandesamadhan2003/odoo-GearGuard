// src/layouts/dashboard/Topbar.jsx
import { UserCircle, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Topbar = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">

      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Collapse button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-100 transition"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>

        {/* Breadcrumb / Title */}
        <div className="text-base font-medium text-slate-500">
          Dashboard
        </div>
      </div>

      {/* Right (User) */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-base font-medium text-slate-700">
          {user?.fullName ?? "User"}
        </span>
        <UserCircle className="w-8 h-8 text-slate-500" />
      </div>
    </header>
  );
};
