import {
  LayoutDashboard,
  Cpu,
  Users,
  Tags,
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Equipment", icon: Cpu },
  { label: "Teams", icon: Users },
  { label: "Categories", icon: Tags },
];

export const Sidebar = ({ collapsed }) => {
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
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="w-full flex items-center gap-3 px-3 py-2.5
              rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600
              transition text-base font-medium"
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};
