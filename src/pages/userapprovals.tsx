import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Users, ShieldAlert, Check, X, ShieldCheck, User, KeyRound, ArrowRight, AlertCircle } from 'lucide-react';

export default function UserApprovals() {
  const [users, setUsers] = useState<any[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    // Check if svhec is already logged in via local storage
    const currentRole = localStorage.getItem("logged_in_user");
    if (currentRole === "svhec") {
      setIsAdminLoggedIn(true);
      loadPendingUsers();
    }
  }, []);

  const loadPendingUsers = () => {
    const registeredUsers = JSON.parse(localStorage.getItem("registered_users") || "[]");
    const pending = registeredUsers.filter((u: any) => u.status === "Pending");
    setUsers(pending);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authUsername === "svhec" && authPassword === "svhec@123") {
      localStorage.setItem("logged_in_user", "svhec");
      localStorage.setItem("logged_in_role", "Super Admin");
      setIsAdminLoggedIn(true);
      setAuthError("");
      loadPendingUsers();
    } else {
      setAuthError("Invalid Admin credentials!");
    }
  };

  const handleAction = (username: string, action: 'Approved' | 'Rejected') => {
    const registeredUsers = JSON.parse(localStorage.getItem("registered_users") || "[]");
    const updatedUsers = registeredUsers.map((u: any) => {
      if (u.username === username) return { ...u, status: action };
      return u;
    });
    localStorage.setItem("registered_users", JSON.stringify(updatedUsers));
    
    // Remove from UI list
    setUsers(users.filter(u => u.username !== username));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 relative z-10 pb-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg flex items-center gap-3">
            <Users className="text-purple-400" size={32} /> User Registrations
          </h1>
          <p className="text-blue-200/60 text-sm mt-2 font-medium">Review and approve new user accounts to grant workspace access.</p>
        </div>
      </div>

      {!isAdminLoggedIn ? (
        // --- ADMIN LOGIN PORTAL ---
        <div className="w-full flex items-center justify-center py-10">
          <div className="bg-[#111C3B]/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-blue-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-md flex flex-col items-center text-center">
            <div className="relative w-20 h-20 mb-6 group cursor-pointer">
              <div className="absolute inset-0 bg-purple-600 rounded-2xl blur-xl opacity-40 animate-pulse"></div>
              <div className="relative w-full h-full bg-gradient-to-tr from-[#050B1A] to-[#111C3B] rounded-2xl flex items-center justify-center border border-purple-500/30">
                <ShieldCheck size={36} className="text-purple-400" />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2">Admin Security</h2>
            <p className="text-blue-200/60 text-sm mb-8">Authenticate as SVHEC Admin to manage users</p>

            {authError && (
              <div className="w-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold py-3 rounded-xl mb-6 flex items-center justify-center gap-2">
                <AlertCircle size={16} /> {authError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="w-full space-y-5 text-left">
              <div className="relative group/input">
                {/* INTHA LINE LA THAAN PLACEHOLDER MAATHI IRUKKEN 👇 */}
                <input type="text" value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-[#050B1A]/80 border border-blue-900/50 text-white rounded-2xl focus:border-purple-500 focus:ring-1 outline-none" placeholder="Enter Admin Username" required />
                <User size={18} className="absolute left-4 top-4 text-blue-200/40" />
              </div>
              <div className="relative group/input">
                {/* INTHA LINE LA THAAN PLACEHOLDER MAATHI IRUKKEN 👇 */}
                <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-[#050B1A]/80 border border-blue-900/50 text-white rounded-2xl focus:border-purple-500 focus:ring-1 outline-none" placeholder="••••••••" required />
                <KeyRound size={18} className="absolute left-4 top-4 text-blue-200/40" />
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-3 py-4 bg-purple-600 text-white rounded-2xl font-extrabold hover:bg-purple-500 transition-all">
                Login & Manage Users <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>

      ) : users.length === 0 ? (
        // --- NO PENDING USERS ---
        <div className="w-full bg-[#111C3B]/60 backdrop-blur-xl p-12 rounded-[2rem] border border-emerald-500/20 text-center flex flex-col items-center">
          <CheckCircle size={64} className="text-emerald-500/40 mb-4" />
          <h3 className="text-2xl font-extrabold text-white mb-2">No Pending Registrations</h3>
          <p className="text-blue-200/60 font-bold">All users have been processed.</p>
        </div>
      ) : (
        // --- PENDING USERS LIST ---
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          {users.map((user, idx) => (
            <div key={idx} className="bg-[#111C3B]/60 backdrop-blur-xl p-6 rounded-[2rem] border border-blue-500/20 shadow-lg flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/50"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-extrabold text-xl shadow-inner">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg">{user.username}</h3>
                  <span className="bg-purple-900/40 text-purple-300 text-[10px] px-2 py-0.5 rounded border border-purple-500/30 uppercase tracking-widest font-bold">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="bg-[#050B1A]/50 border border-blue-900/40 rounded-xl p-3 mb-6">
                <p className="text-[10px] text-blue-300/50 uppercase tracking-widest">Registered On</p>
                <p className="text-sm font-bold text-white">{user.date}</p>
              </div>

              <div className="flex items-center gap-3 mt-auto">
                <button onClick={() => handleAction(user.username, 'Rejected')} className="flex-1 py-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-extrabold rounded-xl hover:bg-rose-600 hover:text-white flex justify-center items-center gap-2"><X size={16}/> Reject</button>
                <button onClick={() => handleAction(user.username, 'Approved')} className="flex-1 py-3 bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-extrabold rounded-xl hover:bg-emerald-600 hover:text-white flex justify-center items-center gap-2"><Check size={16}/> Approve</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}