 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Briefcase, TrendingUp, Building2, ShieldAlert, KeyRound, ArrowRight, X, AlertCircle } from 'lucide-react';

// PREMIUM DARK THEME ROLES ARRAY
const adminRoles = [
  { 
    id: "accountant",
    title: "Accountant", 
    icon: Calculator, 
    color: "text-blue-400", 
    bg: "bg-blue-500/10", 
    border: "border-blue-500/30", 
    shadow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]",
    glow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
  },
  { 
    id: "manager",
    title: "Manager", 
    icon: Briefcase, 
    color: "text-purple-400", 
    bg: "bg-purple-500/10", 
    border: "border-purple-500/30", 
    shadow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]",
    glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
  },
  { 
    id: "cfo",
    title: "CFO", 
    icon: TrendingUp, 
    color: "text-amber-400", 
    bg: "bg-amber-500/10", 
    border: "border-amber-500/30", 
    shadow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]",
    glow: "group-hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]"
  },
  { 
    id: "md",
    title: "Managing Director", 
    icon: Building2, 
    color: "text-emerald-400", 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/30", 
    shadow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]",
    glow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
  }
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Hardcoded Passwords for Demo (Unga pazhaya logic)
  const rolePasswords: Record<string, string> = {
    accountant: "Accountant@123",
    manager: "Manager@123",
    cfo: "CFO@123",
    md: "Managing Director@123"
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole && password === rolePasswords[selectedRole.id]) {
      // Success - Save to local storage and refresh dashboard
      localStorage.setItem("logged_in_user", selectedRole.title);
      localStorage.setItem("logged_in_role", selectedRole.title);
      localStorage.setItem("current_admin_role", selectedRole.id);
      
      // Navigate to dashboard to see updated access
      navigate('/dashboard');
    } else {
      setError("Invalid access key for this role!");
    }
  };

  const closeAuthModal = () => {
    setSelectedRole(null);
    setPassword("");
    setError("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 relative z-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg flex items-center gap-3">
            <ShieldAlert className="text-blue-500" size={32} /> Admin Authentication
          </h1>
          <p className="text-blue-200/60 text-sm mt-2 font-medium">Select your administrative role to access specific workspace controls.</p>
        </div>
      </div>

      {/* --- PREMIUM DARK 3D CARDS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminRoles.map((role, idx) => (
          <div 
            key={idx}
            onClick={() => setSelectedRole(role)}
            className={`bg-[#111C3B]/60 backdrop-blur-xl p-8 rounded-[2rem] border border-blue-500/20 flex flex-col items-center justify-center text-center cursor-pointer group transition-all duration-300 hover:-translate-y-2 hover:border-blue-400/40 hover:bg-[#1A274C]/80 ${role.shadow}`}
          >
            {/* 3D Glowing Icon Wrapper */}
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border ${role.border} ${role.bg} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner ${role.glow}`}>
              <role.icon size={36} className={`${role.color} drop-shadow-lg`} />
            </div>
            
            {/* Premium Typography */}
            <h3 className="text-xl font-extrabold text-white mb-2 tracking-wide drop-shadow-sm">
              {role.title}
            </h3>
            <p className="text-[10px] font-extrabold text-blue-300/40 uppercase tracking-widest group-hover:text-blue-300/80 transition-colors">
              Click to Authenticate
            </p>
          </div>
        ))}
      </div>

      {/* --- 3D PREMIUM AUTHENTICATION MODAL --- */}
      {selectedRole && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#030712]/90 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-[#0B1221] rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-md overflow-hidden border border-blue-500/30 relative">
            
            {/* Close Button */}
            <button 
              onClick={closeAuthModal} 
              className="absolute top-6 right-6 p-2 rounded-full text-blue-300/50 hover:bg-white/5 hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-10 flex flex-col items-center text-center relative">
              
              {/* Dynamic Glow Behind Icon */}
              <div className={`absolute top-10 w-32 h-32 rounded-full blur-[60px] opacity-20 pointer-events-none ${selectedRole.bg.replace('/10', '')}`}></div>

              {/* Selected Role Icon */}
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border ${selectedRole.border} ${selectedRole.bg} shadow-2xl relative z-10`}>
                <selectedRole.icon size={36} className={`${selectedRole.color} drop-shadow-lg`} />
              </div>

              <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">
                {selectedRole.title} Login
              </h2>
              <p className="text-blue-200/60 text-xs font-medium mb-8 uppercase tracking-widest">
                Secure Access Gateway
              </p>

              {/* Error Message */}
              {error && (
                <div className="w-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold py-3 px-4 rounded-xl mb-6 shadow-[0_0_20px_rgba(244,63,94,0.15)] flex items-center justify-center gap-2 animate-in fade-in zoom-in">
                  <AlertCircle size={16} className="text-rose-500" /> {error}
                </div>
              )}

              {/* Auth Form */}
              <form onSubmit={handleAuthSubmit} className="w-full space-y-6 text-left relative z-10">
                
                <div className="relative group/input">
                  <label className="text-[10px] font-extrabold text-blue-300/70 uppercase tracking-widest px-1">Access Key (Password)</label>
                  <div className="relative mt-1.5 shadow-inner rounded-2xl overflow-hidden">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <KeyRound size={18} className="text-blue-200/40 group-focus-within/input:text-blue-400 transition-colors" />
                    </div>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} 
                      className="relative w-full pl-11 pr-4 py-4 bg-[#050B1A]/60 border border-blue-900/50 text-white rounded-2xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-medium placeholder-blue-200/20" 
                      placeholder="Enter assigned password" 
                      required 
                      autoFocus
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className={`group relative w-full flex items-center justify-center gap-3 py-4 mt-6 text-white rounded-2xl font-extrabold text-lg transition-all duration-300 shadow-lg hover:-translate-y-1 active:translate-y-0 active:shadow-inner
                    ${selectedRole.id === 'accountant' ? 'bg-blue-600 hover:bg-blue-500 hover:shadow-[0_15px_30px_rgba(37,99,235,0.4)]' : 
                      selectedRole.id === 'manager' ? 'bg-purple-600 hover:bg-purple-500 hover:shadow-[0_15px_30px_rgba(168,85,247,0.4)]' : 
                      selectedRole.id === 'cfo' ? 'bg-amber-500 hover:bg-amber-400 hover:shadow-[0_15px_30px_rgba(245,158,11,0.4)] text-amber-950' : 
                      'bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_15px_30px_rgba(16,185,129,0.4)]'}
                  `}
                >
                  Verify Identity
                  <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-300" />
                </button>

              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}