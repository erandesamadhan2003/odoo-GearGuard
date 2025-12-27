import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-304 mx-auto px-6 h-16 flex items-center justify-between">

        {/* LEFT: Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            navigate("/");
            setOpen(false);
          }}
        >
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base">
            G
          </div>
          <span className="text-xl font-semibold text-slate-900 tracking-tight">
            GearGuard
          </span>
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-5">
          {isAuthenticated && (
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-base font-medium text-slate-700 hover:text-blue-600 transition"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
          )}

          {isAuthenticated ? (
            <>
              <span className="text-base text-slate-600">
                Hi, <span className="font-medium">{user?.fullName}</span>
              </span>

              <Button
                variant="outline"
                size="default"
                onClick={logout}
                className="flex items-center gap-2 text-base"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="default"
                onClick={() => navigate("/login")}
                className="text-base cursor-pointer"
              >
                Login
              </Button>

              <Button
                size="default"
                onClick={() => navigate("/signup")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 text-base cursor-pointer"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <X className="w-6 h-6 text-slate-800" />
          ) : (
            <Menu className="w-6 h-6 text-slate-800" />
          )}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-6 py-4 flex flex-col gap-4">

            {isAuthenticated && (
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setOpen(false);
                }}
                className="flex items-center gap-2 text-base font-medium text-slate-700"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </button>
            )}

            {isAuthenticated ? (
              <>
                <span className="text-base text-slate-600">
                  Logged in as <b>{user?.fullName}</b>
                </span>

                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="justify-start cursor-pointer"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate("/login");
                    setOpen(false);
                  }}
                >
                  Login
                </Button>

                <Button
                  onClick={() => {
                    navigate("/signup");
                    setOpen(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
