 import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, GitBranch, FilePlus, CheckSquare, Settings, BarChart3, Zap, Menu, LogOut, Users } from "lucide-react";

const navItems = [
  { to: "/users", icon: Users, label: "Manage Users" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/workflows", icon: GitBranch, label: "Workflows" },
  { to: "/requests/new", icon: FilePlus, label: "New Request" },
  { to: "/approvals", icon: CheckSquare, label: "Approvals" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
  { to: "/admin", icon: Settings, label: "Admin Panel" },
];

interface AppSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function AppSidebar({ isOpen, toggleSidebar }: AppSidebarProps) {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState("Employee");

  useEffect(() => {
    const storedName = localStorage.getItem("logged_in_user");
    const storedRole = localStorage.getItem("logged_in_role");
    if (storedName) setUserName(storedName);
    if (storedRole) setUserRole(storedRole);
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("current_admin_role");
    localStorage.removeItem("logged_in_user");
    localStorage.removeItem("logged_in_role");
    navigate("/");
  };

  const avatarText = userName ? userName.substring(0, 2).toUpperCase() : "US";

  return (
    // DARK THEME SIDEBAR APPLIED HERE
    <aside className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-[#050B1A]/95 backdrop-blur-3xl border-blue-900/30 shadow-[10px_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      
      {/* Header Section */}
      <div className={`flex h-20 items-center px-6 border-b border-blue-900/30 ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {isOpen && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-white/10">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-wide">Approve<span className="text-emerald-400">Flow</span></h1>
              <p className="text-[10px] font-extrabold text-blue-300/60 uppercase tracking-widest">Workspace</p>
            </div>
          </div>
        )}
        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-white/5 text-blue-300/60 hover:text-white transition-colors">
          <Menu size={22} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2 px-4 py-8 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={!isOpen ? item.label : ""} 
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl transition-all duration-300 ${isOpen ? 'px-4 py-3.5' : 'p-3 justify-center'} ${
                isActive 
                  ? "bg-blue-600/20 text-blue-400 font-extrabold border border-blue-500/30 shadow-[inset_0_0_20px_rgba(37,99,235,0.1)]" 
                  : "text-blue-200/50 hover:bg-white/5 hover:text-blue-300 font-bold border border-transparent"
              }`
            }
          >
            <item.icon className={`shrink-0 ${isOpen ? 'h-5 w-5' : 'h-6 w-6'}`} />
            {isOpen && <span className="text-sm truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Profile & Logout Section */}
      <div className="relative p-5 border-t border-blue-900/30 bg-[#030712]/50">
        {showLogout && (
          <div className={`absolute bottom-full mb-3 bg-[#0B1221] border border-blue-900/50 shadow-2xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 ${isOpen ? 'left-5 right-5' : 'left-5 w-48 z-50'}`}>
            <button 
              onClick={handleLogoutClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-extrabold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
            >
              <LogOut size={18} />
              <span>Secure Logout</span>
            </button>
          </div>
        )}
        <div 
          onClick={() => setShowLogout(!showLogout)}
          className={`flex items-center cursor-pointer hover:bg-white/5 p-2.5 -m-2.5 rounded-xl transition-colors border border-transparent hover:border-blue-900/30 ${isOpen ? 'justify-start gap-3' : 'justify-center'}`}
        >
          <div className="w-10 h-10 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-extrabold text-sm shrink-0 shadow-sm">
            {avatarText}
          </div>
          {isOpen && (
            <div className="overflow-hidden text-left">
              <p className="text-sm font-extrabold text-white truncate">{userName}</p>
              <p className="text-[10px] text-blue-300/60 font-extrabold truncate uppercase tracking-widest">{userRole}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}