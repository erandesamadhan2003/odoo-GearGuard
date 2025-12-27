import { UserCircle, Menu, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { getRoleDisplayName } from "@/utils/roles";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/equipment": "Equipment",
  "/requests": "Requests",
  "/teams": "Teams",
  "/categories": "Categories",
  "/departments": "Departments",
  "/calendar": "Calendar",
  "/analytics": "Analytics",
  "/kanban": "Kanban Board",
};

export const Topbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const currentPath = location.pathname;
  const pageTitle =
    pageTitles[currentPath] ||
    pageTitles[currentPath.split("/").slice(0, 2).join("/")] ||
    "GearGuard";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>

          <div className="text-lg font-semibold text-slate-900">
            {pageTitle}
          </div>
        </div>

        {/* Right (User) */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-slate-200">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shrink-0">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-sm">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900 leading-tight">
                {user?.fullName ?? "User"}
              </span>
              <span className="text-xs text-slate-500 leading-tight">
                {getRoleDisplayName(user?.role ?? "user")}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Logout Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout"
      >
        <p className="mb-6 text-slate-600">Are you sure you want to logout?</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </Button>
        </div>
      </Modal>
    </>
  );
};
