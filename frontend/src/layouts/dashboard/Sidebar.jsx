import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Cpu,
  Wrench,
  Users,
  Tags,
  Building2,
  Calendar,
  BarChart3,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { getRoleDisplayName } from "@/utils/roles";

export const Sidebar = ({ collapsed }) => {
  const { user } = useAuth();

  // Filter navigation items based on role matrix
  const getNavItems = () => {
    const allItems = [
      { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: ["admin", "manager"] }, // Only Admin/Manager per matrix
      { label: "Equipment", icon: Cpu, path: "/equipment", roles: ["admin", "manager", "technician", "user"] },
      { label: "Requests", icon: Wrench, path: "/requests", roles: ["admin", "manager", "technician", "user"] },
      { label: "Teams", icon: Users, path: "/teams", roles: ["admin", "manager"] },
      { label: "Categories", icon: Tags, path: "/categories", roles: ["admin"] },
      { label: "Departments", icon: Building2, path: "/departments", roles: ["admin"] },
      { label: "Calendar", icon: Calendar, path: "/calendar", roles: ["admin", "manager"] }, // Only Admin/Manager (not in matrix but follows pattern)
      { label: "Analytics", icon: BarChart3, path: "/analytics", roles: ["admin", "manager"] }, // Only Admin/Manager per matrix
    ];

    return allItems.filter(item => item.roles.includes(user?.role || "user"));
  };

  const navItems = getNavItems();

  return (
    <div className="h-full flex flex-col">
      {/* Brand */}
      <div className="h-16 flex items-center justify-center border-b border-slate-200">
        <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
          G
        </div>
        {!collapsed && (
          <span className="ml-3 text-lg font-semibold text-slate-900">
            GearGuard
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition",
                "hover:bg-blue-50 hover:text-blue-600",
                isActive ? "bg-blue-50 text-blue-600" : "text-slate-700"
              )
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-200">
        {collapsed ? (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-sm">
                {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shrink-0">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {getRoleDisplayName(user?.role || "user")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
