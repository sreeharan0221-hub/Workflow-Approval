 import React, { useState, MouseEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, Sparkles, GitBranch, ShieldCheck, CheckCircle2, Activity } from 'lucide-react';

// Dummy live activities to simulate real-time platform usage
const liveActivities = [
  { user: "CFO", action: "approved", target: "Q3 Budget Flow", time: "Just now", color: "text-amber-400" },
  { user: "System", action: "auto-routed", target: "IT Asset Request", time: "2m ago", color: "text-blue-400" },
  { user: "HR Team", action: "verified", target: "New Hire Onboarding", time: "5m ago", color: "text-purple-400" },
  { user: "Manager", action: "reviewed", target: "Leave Application", time: "12m ago", color: "text-emerald-400" }
];

export default function Landing() {
  const navigate = useNavigate();
  const [cardTransform, setCardTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [activeNotification, setActiveNotification] = useState(0);

  // 3D Tilt Effect Logic
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setCardTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setCardTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  // Live Activity Cycler
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNotification((prev) => (prev + 1) % liveActivities.length);
    }, 4000); // Changes every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-[#030712] font-sans selection:bg-blue-500/30">

      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-blue-600/20 blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-emerald-600/20 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px] opacity-20"></div>

      {/* --- FLOATING 3D ICONS --- */}
      <div className="absolute top-[20%] left-[10%] text-blue-500/20 transform -rotate-12 animate-bounce" style={{ animationDuration: '6s' }}>
        <GitBranch size={80} strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-[25%] right-[10%] text-emerald-500/20 transform rotate-12 animate-bounce" style={{ animationDuration: '8s' }}>
        <CheckCircle2 size={100} strokeWidth={1.5} />
      </div>

      {/* --- LIVE ACTIVITY TICKER (New Feature!) --- */}
      <div className="absolute bottom-8 left-8 z-20 hidden md:flex items-center gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-8">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
          <Activity size={18} className="text-emerald-400 animate-pulse" />
        </div>
        <div className="flex flex-col pr-4" key={activeNotification}>
          <p className="text-xs font-bold text-slate-400 animate-in fade-in slide-in-from-bottom-1">
            <span className={liveActivities[activeNotification].color}>{liveActivities[activeNotification].user}</span> {liveActivities[activeNotification].action}
          </p>
          <p className="text-sm font-extrabold text-white animate-in fade-in slide-in-from-bottom-2">
            {liveActivities[activeNotification].target}
          </p>
        </div>
        <span className="absolute top-2 right-3 text-[10px] text-slate-500 font-bold">{liveActivities[activeNotification].time}</span>
      </div>

      {/* --- INTERACTIVE 3D GLASSMORPHISM CARD --- */}
      <div 
        className="relative z-10 w-full max-w-xl p-10 md:p-14 mx-4 mb-10 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)] flex flex-col items-center text-center will-change-transform"
        style={{ 
          transform: cardTransform, 
          transition: cardTransform.includes('rotateX(0deg)') ? 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'transform 0.1s ease-out',
          transformStyle: 'preserve-3d'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div style={{ transform: 'translateZ(60px)' }} className="flex flex-col items-center w-full">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-extrabold uppercase tracking-widest mb-8 backdrop-blur-md">
            <Sparkles size={14} className="animate-pulse text-emerald-400" /> Premium Enterprise
          </div>

          <div className="relative w-24 h-24 mb-8 group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-emerald-400 rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative w-full h-full bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl border border-white/20 transform group-hover:-translate-y-1 transition-transform">
              <Zap size={40} className="text-white fill-white/20 drop-shadow-xl" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
            Approve<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Flow</span>
          </h1>
          <p className="text-slate-300 font-medium leading-relaxed mb-10 text-sm md:text-base px-2 drop-shadow-md">
            The next-generation platform to automate workflows and manage hierarchical approvals in a truly immersive workspace.
          </p>

          <button
            onClick={() => navigate('/auth')}
            className="group relative w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-white to-slate-200 text-slate-900 rounded-2xl font-extrabold text-lg transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_rgba(255,255,255,0.2)] hover:-translate-y-1"
          >
            Enter Workspace
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* --- TRUSTED BY SECTION --- */}
      <div className="relative z-10 flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity duration-300">
        <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest mb-4">Trusted by modern teams</p>
        <div className="flex items-center gap-8 md:gap-12 grayscale">
          {/* Abstract Company Logos */}
          <div className="flex items-center gap-2 font-bold text-slate-300 text-xl"><ShieldCheck size={24}/> Acme Corp</div>
          <div className="flex items-center gap-2 font-bold text-slate-300 text-xl"><Zap size={24}/> TechNova</div>
          <div className="hidden md:flex items-center gap-2 font-bold text-slate-300 text-xl"><GitBranch size={24}/> FlowState</div>
        </div>
      </div>

    </div>
  );
}