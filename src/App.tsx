 import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/landing"; 
import Auth from "./pages/Auth"; 
import AppSidebar from "./components/layout/AppSidebar"; 
import Dashboard from "./pages/Dashboard"; 
import RequestHistory from "./pages/RequestHistory"; 
import NewRequest from "./pages/NewRequest"; 
import Approvals from "./pages/Approvals"; 
import Workflows from "./pages/Workflows"; 
import AdminPanel from "./pages/AdminPanel";
import UserApprovals from "./pages/userapprovals";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    // GLOBAL PREMIUM DARK BLUE THEME APPLIED HERE
    <div className="flex h-screen w-full bg-[#0A1128] text-slate-200 overflow-hidden relative selection:bg-blue-500/30 font-sans">
      
      {/* --- UNIVERSAL BACKGROUND EFFECTS --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] animate-pulse pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/5 blur-[120px] animate-pulse pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0"></div>

      <AppSidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className={`flex-1 p-4 md:p-8 overflow-y-auto z-10 transition-all duration-300 custom-scrollbar ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {children}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<DashboardLayout><UserApprovals /></DashboardLayout>} />
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/workflows" element={<DashboardLayout><Workflows /></DashboardLayout>} />
        <Route path="/requests" element={<DashboardLayout><RequestHistory /></DashboardLayout>} />
        <Route path="/reports" element={<DashboardLayout><RequestHistory /></DashboardLayout>} />
        <Route path="/requests/new" element={<DashboardLayout><NewRequest /></DashboardLayout>} />
        <Route path="/approvals" element={<DashboardLayout><Approvals /></DashboardLayout>} />
        <Route path="/admin" element={<DashboardLayout><AdminPanel /></DashboardLayout>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}