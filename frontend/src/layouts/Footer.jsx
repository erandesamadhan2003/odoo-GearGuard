import { Link } from "react-router";

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white/90 backdrop-blur mt-24">
      <div className="max-w-304 mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Left */}
        <div className="text-center md:text-left">
          <h4 className="text-base font-semibold text-slate-900">
            GearGuard
          </h4>
          <p className="text-sm text-slate-600">
            Smart maintenance, simplified.
          </p>
        </div>

        {/* Center (pure text, no links) */}
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <span className="cursor-default">Home</span>
          <span className="cursor-default">Dashboard</span>
        </div>

        {/* Right */}
        <div className="text-sm text-slate-500">
          © {new Date().getFullYear()} GearGuard. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
