import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, FileText, User, ShieldAlert, Filter, Check, X, AlertTriangle, KeyRound, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export default function Approvals() {
  const [requests, setRequests] = useState<any[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // --- EMBEDDED LOGIN STATE ---
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("logged_in_user") || "";
    setCurrentUserRole(role);

    if (role === "Employee User" || !role) {
      setRequests([]); 
    } else {
      loadRequests(role);
    }
  }, []);

  const loadRequests = (role: string) => {
    const allData = JSON.parse(localStorage.getItem("approval_requests") || "[]");
    
    // SMART LOGIC: svhec na ella pending requests-aiyum kaattum. 
    // Illana specific role-ku uriya requests-a mattum kaattum.
    const filteredData = allData.filter((req: any) => 
      (role === "svhec" || req.pendingWith === role) && req.status === "Pending"
    );
    setRequests(filteredData);
  };

  // --- INLINE ADMIN LOGIN LOGIC ---
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ==========================================
    // UPDATED CREDENTIALS HERE
    // ==========================================
    const adminUser = "svhec";
    const adminPass = "svhec@123";

    if (authUsername === adminUser && authPassword === adminPass) {
      // Success!
      localStorage.setItem("logged_in_user", adminUser);
      localStorage.setItem("logged_in_role", "Super Admin");
      setCurrentUserRole(adminUser);
      setAuthError("");
      loadRequests(adminUser); 
    } else {
      setAuthError("Invalid Admin credentials!");
    }
  };

  const handleAction = (id: string, action: 'Approve' | 'Reject') => {
    const allData = JSON.parse(localStorage.getItem("approval_requests") || "[]");
    const updatedData = allData.map((req: any) => {
      if (req.id === id) {
        return { ...req, status: action === 'Approve' ? 'Approved' : 'Rejected' };
      }
      return req;
    });
    localStorage.setItem("approval_requests", JSON.stringify(updatedData));

    setRequests(requests.filter(req => req.id !== id));
    
    setNotification({
      msg: `Request ${id} has been successfully ${action.toLowerCase()}d.`,
      type: action === 'Approve' ? 'success' : 'error'
    });

    setTimeout(() => setNotification(null), 3000);
  };

  // Split requests for high-priority display
  const emergencyRequests = requests.filter(req => req.isEmergency);
  const normalRequests = requests.filter(req => !req.isEmergency);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 relative z-10 pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg flex items-center gap-3">
            <CheckCircle className="text-emerald-400" size={32} /> Pending Approvals
          </h1>
          <p className="text-blue-200/60 text-sm mt-2 font-medium">
            Review and take action on workflow requests assigned to you.
          </p>
        </div>
        
        {currentUserRole && currentUserRole !== "Employee User" && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#111C3B]/80 border border-blue-500/30 rounded-xl shadow-lg backdrop-blur-md">
            <ShieldAlert size={18} className="text-blue-400" />
            <span className="text-xs font-extrabold text-blue-300 uppercase tracking-widest">
              Viewing as: <span className="text-white ml-1">{currentUserRole} (Admin)</span>
            </span>
          </div>
        )}
      </div>

      {notification && (
        <div className={`w-full border px-6 py-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3 animate-in slide-in-from-top-4 fade-in z-50
          ${notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-rose-500/10 border-rose-500/40 text-rose-400'}
        `}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span className="font-bold text-sm tracking-wide">{notification.msg}</span>
        </div>
      )}

      {/* ======================================= */}
      {/* LOGIN OR LIST VIEW */}
      {/* ======================================= */}
      {(!currentUserRole || currentUserRole === "Employee User") ? (
        
        <div className="w-full flex items-center justify-center py-10">
          <div className="bg-[#111C3B]/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-blue-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-md flex flex-col items-center text-center">
            
            <div className="relative w-20 h-20 mb-6 group cursor-pointer">
              <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl opacity-40 animate-pulse"></div>
              <div className="relative w-full h-full bg-gradient-to-tr from-[#050B1A] to-[#111C3B] rounded-2xl flex items-center justify-center shadow-2xl border border-blue-500/30">
                <ShieldCheck size={36} className="text-blue-400 drop-shadow-md" />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">
               Admin Access
            </h2>
            <p className="text-blue-200/60 text-sm mb-8 font-medium">
              Authenticate to manage all pending approvals
            </p>

            {authError && (
              <div className="w-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold py-3 px-4 rounded-xl mb-6 flex items-center justify-center gap-2 animate-in fade-in zoom-in">
                <AlertCircle size={16} className="text-rose-500 shrink-0" /> {authError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="w-full space-y-5 text-left">
              <div className="relative group/input">
                <label className="text-[10px] font-extrabold text-blue-300/70 uppercase tracking-widest px-1">Username</label>
                <div className="relative mt-1.5 shadow-inner rounded-2xl overflow-hidden">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <User size={18} className="text-blue-200/40 group-focus-within/input:text-blue-400 transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)} 
                    className="relative w-full pl-11 pr-4 py-3.5 bg-[#050B1A]/80 border border-blue-900/50 text-white rounded-2xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-medium placeholder-blue-200/20" 
                    placeholder="Enter admin username" 
                    required 
                  />
                </div>
              </div>

              <div className="relative group/input">
                <label className="text-[10px] font-extrabold text-blue-300/70 uppercase tracking-widest px-1">Password</label>
                <div className="relative mt-1.5 shadow-inner rounded-2xl overflow-hidden">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <KeyRound size={18} className="text-blue-200/40 group-focus-within/input:text-blue-400 transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)} 
                    className="relative w-full pl-11 pr-4 py-3.5 bg-[#050B1A]/80 border border-blue-900/50 text-white rounded-2xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-medium placeholder-blue-200/20" 
                    placeholder="Enter admin password" 
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="group relative w-full flex items-center justify-center gap-3 py-4 mt-4 bg-blue-600 border border-blue-500/30 text-white rounded-2xl font-extrabold text-base transition-all duration-300 shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.5)] hover:bg-blue-500 hover:-translate-y-1"
              >
                Secure Login
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </form>
          </div>
        </div>

      ) : requests.length === 0 ? (
        
        <div className="w-full bg-[#111C3B]/60 backdrop-blur-xl p-12 rounded-[2rem] border border-emerald-500/20 text-center shadow-xl flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
          <CheckCircle size={64} className="text-emerald-500/40 mb-4" />
          <h3 className="text-2xl font-extrabold text-white mb-2">You're all caught up!</h3>
          <p className="text-blue-200/60 font-bold">No pending requests found for the svhec dashboard.</p>
        </div>

      ) : (
        
        <div className="space-y-10">
          {/* EMERGENCY SECTION */}
          {emergencyRequests.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-rose-500 flex items-center gap-2 drop-shadow-md border-b border-rose-500/20 pb-2">
                <AlertTriangle size={24} className="animate-pulse" /> CRITICAL EMERGENCY REQUESTS
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {emergencyRequests.map((req) => (
                  <div key={req.id} className="bg-rose-950/40 backdrop-blur-xl p-6 rounded-[2rem] border-2 border-rose-500/50 shadow-[0_10px_30px_rgba(244,63,94,0.2)] flex flex-col justify-between group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-rose-600 animate-pulse"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/50 flex items-center justify-center">
                          <AlertTriangle size={24} className="text-rose-400" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-white text-lg">{req.title}</h3>
                          <p className="text-xs font-bold text-rose-300/80 uppercase">{req.id} • {req.date}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#050B1A]/70 border border-rose-900/50 rounded-2xl p-4 mb-6 grid grid-cols-2 gap-4">
                      <div className="col-span-2"><p className="text-xs font-bold text-rose-200 italic">"{req.desc}"</p></div>
                      <div><p className="text-[10px] font-extrabold text-rose-300/60 uppercase">Requester</p><p className="text-sm font-bold text-white">{req.requester}</p></div>
                      <div><p className="text-[10px] font-extrabold text-rose-300/60 uppercase">Target Role</p><p className="text-sm font-bold text-white">{req.pendingWith}</p></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => handleAction(req.id, 'Reject')} className="flex-1 py-3 bg-rose-500/20 border border-rose-500/50 text-white font-extrabold rounded-xl hover:bg-rose-600">Reject</button>
                      <button onClick={() => handleAction(req.id, 'Approve')} className="flex-1 py-3 bg-emerald-600 border border-emerald-500 text-white font-extrabold rounded-xl hover:bg-emerald-500">Approve</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NORMAL SECTION */}
          {normalRequests.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-extrabold text-blue-200/80 uppercase tracking-widest border-b border-blue-900/50 pb-2">Standard Requests</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {normalRequests.map((req) => (
                  <div key={req.id} className="bg-[#111C3B]/60 backdrop-blur-xl p-6 rounded-[2rem] border border-blue-500/20 shadow-lg flex flex-col justify-between group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center"><FileText size={20} className="text-blue-400" /></div>
                        <div><h3 className="font-extrabold text-white text-lg">{req.title}</h3><p className="text-xs font-bold text-blue-300/60 uppercase">{req.id}</p></div>
                      </div>
                    </div>
                    <div className="bg-[#050B1A]/50 border border-blue-900/40 rounded-2xl p-4 mb-6 grid grid-cols-2 gap-4">
                      <div><p className="text-[10px] font-extrabold text-blue-300/50 uppercase">Requester</p><p className="text-sm font-bold text-white">{req.requester}</p></div>
                      <div><p className="text-[10px] font-extrabold text-blue-300/50 uppercase">Target Role</p><p className="text-sm font-bold text-white">{req.pendingWith}</p></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => handleAction(req.id, 'Reject')} className="flex-1 py-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-extrabold rounded-xl hover:bg-rose-600 hover:text-white">Reject</button>
                      <button onClick={() => handleAction(req.id, 'Approve')} className="flex-1 py-3 bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-extrabold rounded-xl hover:bg-emerald-600 hover:text-white">Approve</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}