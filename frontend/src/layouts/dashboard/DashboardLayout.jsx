import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-40
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-64"}`}
      >
        <Sidebar collapsed={collapsed} />
      </aside>

      {/* Main area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300
        ${collapsed ? "ml-16" : "ml-64"}`}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <Topbar
            collapsed={collapsed}
            toggleSidebar={() => setCollapsed(!collapsed)}
          />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
