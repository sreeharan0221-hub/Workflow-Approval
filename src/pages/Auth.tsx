import React, { useState, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, User, KeyRound, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Briefcase } from "lucide-react";
import { authApi } from "../api/client";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee");
  const [successMsg, setSuccessMsg] = useState(""); 
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const availableRoles = ["Employee", "Manager", "Accountant", "CFO", "Managing Director", "IT Helpdesk", "HR Team"];

  const [cardTransform, setCardTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6; 
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
    setCardTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => setCardTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN via Java Backend API ---
        const result = await authApi.login(username, password);
        if (result.success) {
          localStorage.setItem("logged_in_user", result.username!);
          localStorage.setItem("logged_in_role", result.role!);
          navigate("/dashboard");
        } else {
          setErrorMsg(result.error || "Login failed!");
        }
      } else {
        // --- REGISTER via Java Backend API ---
        const result = await authApi.register(username, password, role);
        if (result.success) {
          setSuccessMsg(result.message || "Registration sent to Admin for approval!");
          setTimeout(() => {
            setIsLogin(true);
            setUsername("");
            setPassword("");
            setSuccessMsg("");
          }, 3000);
        } else {
          setErrorMsg(result.error || "Registration failed!");
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0A1128] font-sans selection:bg-blue-500/30">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>

      <div 
        className="relative z-10 w-full max-w-md p-10 mx-4 rounded-[2.5rem] bg-[#111C3B]/80 backdrop-blur-2xl border border-blue-400/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center will-change-transform"
        style={{ transform: cardTransform, transition: cardTransform.includes('rotateX(0deg)') ? 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'transform 0.1s ease-out', transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      >
        <div style={{ transform: 'translateZ(50px)' }} className="w-full flex flex-col items-center">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-extrabold uppercase tracking-widest mb-6">
            <ShieldCheck size={14} className="text-blue-500" /> Secure Portal
          </div>

          <div className="relative w-20 h-20 mb-6 group cursor-pointer">
            <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl opacity-40 animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-tr from-blue-700 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10">
              <Zap size={36} className="text-white fill-white/20" />
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h2>
          <p className="text-blue-200/60 text-sm mb-6 font-medium">
            {isLogin ? "Login to access your workspace" : "Register to request platform access"}
          </p>

          {successMsg && (
            <div className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold py-3 px-4 rounded-xl mb-6 shadow-sm flex items-center justify-center gap-2 animate-in fade-in zoom-in">
              <CheckCircle2 size={16} className="text-emerald-500" /> {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="w-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold py-3 px-4 rounded-xl mb-6 shadow-sm flex items-center justify-center gap-2 animate-in fade-in zoom-in">
              <AlertCircle size={16} className="text-rose-500" /> {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-5 text-left">
            
            <div className="relative group/input">
              <label className="text-[10px] font-extrabold text-blue-300/70 uppercase tracking-widest px-1">Username</label>
              <div className="relative mt-1.5 rounded-2xl overflow-hidden shadow-inner">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10"><User size={18} className="text-blue-200/40" /></div>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-[#050B1A]/60 border border-blue-900/50 text-white rounded-2xl focus:border-blue-500 focus:ring-1 outline-none font-medium" placeholder="Enter your ID" required />
              </div>
            </div>

            {/* ROLE DROPDOWN - ONLY VISIBLE DURING REGISTRATION */}
            {!isLogin && (
              <div className="relative group/input animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] font-extrabold text-blue-300/70 uppercase tracking-widest px-1">Select Role</label>
                <div className="relative mt-1.5 rounded-2xl overflow-hidden shadow-inner">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10"><Briefcase size={18} className="text-blue-200/40" /></div>
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-[#050B1A]/60 border border-blue-900/50 text-white rounded-2xl focus:border-blue-500 focus:ring-1 outline-none font-medium appearance-none cursor-pointer">
                    {availableRoles.map(r => <option key={r} value={r} className="bg-[#0B1221] text-white">{r}</option>)}
                  </select>
                </div>
              </div>
            )}

            <div className="relative group/input">
              <label className="text-[10px] font-extrabold text-blue-300/70 uppercase tracking-widest px-1">Password</label>
              <div className="relative mt-1.5 rounded-2xl overflow-hidden shadow-inner">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10"><KeyRound size={18} className="text-blue-200/40" /></div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-[#050B1A]/60 border border-blue-900/50 text-white rounded-2xl focus:border-blue-500 focus:ring-1 outline-none font-medium" placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className={`group relative w-full flex items-center justify-center gap-3 py-4 mt-6 bg-blue-600 text-white rounded-2xl font-extrabold text-lg transition-all shadow-lg hover:-translate-y-1 hover:bg-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isLoading ? "Please wait..." : (isLogin ? "Login to Dashboard" : "Register Now")}
              {!isLoading && <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />}
            </button>
          </form>

          <button type="button" onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); setSuccessMsg(""); }} className="mt-8 text-blue-200/60 font-medium text-sm hover:text-white transition-colors outline-none">
            {isLogin ? "Need an account? " : "Already have an account? "}
            <span className="text-blue-400 font-bold hover:underline">{isLogin ? "Register" : "Login"}</span>
          </button>

        </div>
      </div>
    </div>
  );
}