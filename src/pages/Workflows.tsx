import React, { useState } from "react";
import { GitBranch, Settings, FileText, Users, Edit2, X, Check, Building2, Target, Calendar, ArrowRight, RotateCcw, AlertTriangle, Clock, Timer } from "lucide-react";

// --- UPDATED: MANAGER CHANGED TO TEAM LEADER ---
const initialRules = [
  { id: 1, title: "Infrastructure and Resources 🏢", type: "Standard", desc: "Hardware, software, and IT asset requests.", steps: [{role: "Employee", timeout: 0}, {role: "IT Helpdesk", timeout: 24}, {role: "Managing Director", timeout: 0}], color: "emerald", icon: Building2 },
  { id: 2, title: "Financial Approval 💰", type: "Standard", desc: "For budgets and expenses over ₹10,000.", steps: [{role: "Employee", timeout: 0}, {role: "Team Leader", timeout: 48}, {role: "Accountant", timeout: 24}, {role: "CFO", timeout: 0}], color: "blue", icon: FileText },
  { id: 3, title: "Hiring and Recruitment 👥", type: "Standard", desc: "Standard recruitment requests for all departments.", steps: [{role: "Employee", timeout: 0}, {role: "Team Leader", timeout: 48}, {role: "HR Team", timeout: 0}], color: "indigo", icon: Users },
  { id: 4, title: "Project Approval 📊", type: "Standard", desc: "New project initiations and milestone sign-offs.", steps: [{role: "Employee", timeout: 0}, {role: "Team Leader", timeout: 24}, {role: "CFO", timeout: 0}], color: "amber", icon: Target },
  { id: 5, title: "Leave Approval 🗓️", type: "Fast-Track", desc: "Standard PTO, Sick leave, and HR queries.", steps: [{role: "Employee", timeout: 0}, {role: "Reporting Manager", timeout: 0}], color: "purple", icon: Calendar },
  
  // 🔥 EMERGENCY LOGIC: Team Leader-ku 2 Hours time, illana MD-ku Jump aagum!
  { id: 6, title: "Emergency Approval 🚨", type: "Critical", desc: "High priority requests requiring immediate attention.", steps: [{role: "Employee", timeout: 0}, {role: "Team Leader", timeout: 2}, {role: "Managing Director", timeout: 0}], color: "rose", icon: AlertTriangle }
];

export default function Workflows() {
  const [rules, setRules] = useState(initialRules);
  const [editingRule, setEditingRule] = useState<any>(null);
  
  const [tempSteps, setTempSteps] = useState<{role: string, timeout: number}[]>([]);

  const handleEditClick = (rule: any) => {
    setEditingRule(rule);
    setTempSteps(JSON.parse(JSON.stringify(rule.steps))); 
  };

  const handleSaveConfig = () => {
    if (tempSteps.length === 0) {
      alert("Please select at least one role!");
      return;
    }
    const updatedRules = rules.map(r => r.id === editingRule.id ? { ...r, steps: tempSteps } : r);
    setRules(updatedRules);
    setEditingRule(null);
  };

  const handleNodeClick = (role: string) => {
    const existingIndex = tempSteps.findIndex(s => s.role === role);
    if (existingIndex !== -1) {
      setTempSteps(tempSteps.slice(0, existingIndex + 1));
    } else {
      setTempSteps([...tempSteps, { role, timeout: 24 }]);
    }
  };

  const updateSLA = (index: number, hours: number) => {
    const newSteps = [...tempSteps];
    newSteps[index].timeout = hours;
    setTempSteps(newSteps);
  };

  const handleResetFlow = () => setTempSteps([]);

  const getTheme = (color: string) => {
    switch(color) {
      case 'blue': return { card: 'bg-blue-500/10 text-blue-400 border-blue-500/30', badge: 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]', lightBg: 'bg-blue-900/40 border-blue-500/40 text-blue-300' };
      case 'purple': return { card: 'bg-purple-500/10 text-purple-400 border-purple-500/30', badge: 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)]', lightBg: 'bg-purple-900/40 border-purple-500/40 text-purple-300' };
      case 'emerald': return { card: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', badge: 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]', lightBg: 'bg-emerald-900/40 border-emerald-500/40 text-emerald-300' };
      case 'amber': return { card: 'bg-amber-500/10 text-amber-400 border-amber-500/30', badge: 'bg-amber-600 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)]', lightBg: 'bg-amber-900/40 border-amber-500/40 text-amber-300' };
      case 'indigo': return { card: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', badge: 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.5)]', lightBg: 'bg-indigo-900/40 border-indigo-500/40 text-indigo-300' };
      case 'rose': return { card: 'bg-rose-500/10 text-rose-400 border-rose-500/30', badge: 'bg-rose-600 text-white shadow-[0_0_10px_rgba(225,29,72,0.5)]', lightBg: 'bg-rose-900/40 border-rose-500/40 text-rose-300' };
      default: return { card: 'bg-slate-500/10 text-slate-400 border-slate-500/30', badge: 'bg-slate-600 text-white', lightBg: 'bg-slate-800 border-slate-600 text-slate-300' };
    }
  };

  const TreeNode = ({ role }: { role: string }) => {
    const stepIndex = tempSteps.findIndex(s => s.role === role);
    const isSelected = stepIndex !== -1;
    const stepNumber = stepIndex + 1;
    
    return (
      <div onClick={() => handleNodeClick(role)} className="relative flex flex-col items-center cursor-pointer transition-all hover:-translate-y-1 z-10 w-36">
        <div className={`w-10 h-10 rounded-full mb-[-12px] z-20 border-[3px] border-[#0B1221] shadow-lg flex items-center justify-center text-white font-extrabold text-sm transition-colors
          ${isSelected ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]' : 'bg-slate-700'}`}>
          {role.charAt(0)}
        </div>
        <div className={`w-full py-4 px-2 text-center rounded-xl font-bold text-xs shadow-lg border transition-all backdrop-blur-md
          ${isSelected ? 'bg-blue-600/30 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-[#111C3B]/80 border-blue-900/50 text-blue-200/70 hover:bg-[#1e293b]/80 hover:border-blue-500/50'}
        `}>
          {isSelected && (
            <span className="absolute -top-3 -right-2 w-6 h-6 bg-amber-500 border-2 border-[#0B1221] text-white rounded-full flex items-center justify-center text-[11px] font-extrabold shadow-md animate-in zoom-in">
              {stepNumber}
            </span>
          )}
          {role}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10 animate-in fade-in duration-500 relative z-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg flex items-center gap-3">
            <GitBranch className="text-emerald-400" size={32} /> Workflow Automation
          </h1>
          <p className="text-blue-200/60 text-sm mt-1 font-medium">Configure category-based routing and auto-escalation SLAs.</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-extrabold text-white mb-6 flex items-center gap-2 drop-shadow-sm">
          <Settings className="text-blue-400" /> Category Routing Configurator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rules.map((rule) => {
            const IconTag = rule.icon;
            const theme = getTheme(rule.color);
            
            return (
              <div key={rule.id} className="bg-[#111C3B]/60 backdrop-blur-xl p-6 rounded-3xl border border-blue-500/20 shadow-lg hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] transition-all group relative flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl border ${theme.card}`}><IconTag size={28} /></div>
                    <span className="text-[10px] uppercase tracking-widest font-extrabold text-blue-300/80 bg-blue-900/40 px-3 py-1.5 rounded-lg border border-blue-500/20 shadow-inner">
                      {rule.type}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-xl text-white mb-1 drop-shadow-sm">{rule.title}</h3>
                  <p className="text-sm text-blue-200/60 mb-4 font-medium">{rule.desc}</p>
                  
                  <div className="mt-6 pt-6 border-t border-blue-900/50 relative">
                    <p className="absolute -top-3 left-4 bg-[#0B1221] px-2 text-[10px] font-extrabold text-blue-400/80 uppercase tracking-widest rounded-full border border-blue-900/30">Hierarchy Flow</p>
                    <div className="flex flex-col relative">
                      <div className="absolute left-[15px] top-2 bottom-4 w-0.5 bg-blue-900/50 z-0"></div>
                      
                      {/* --- RENDER STEPS WITH SLA ESCALATION TIMERS --- */}
                      {rule.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-4 relative z-10 mb-4 last:mb-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 border-[#0B1221] shadow-lg z-10
                            ${idx === rule.steps.length - 1 ? theme.badge : 'bg-slate-700 text-blue-200'}
                          `}>
                            {idx + 1}
                          </div>
                          <div className={`flex-1 px-4 py-3 rounded-xl border font-bold text-sm backdrop-blur-md shadow-sm
                            ${idx === rule.steps.length - 1 ? theme.lightBg : 'bg-[#050B1A]/80 border-blue-900/40 text-blue-100'}
                          `}>
                            <div className="flex justify-between items-center">
                              <span>{step.role}</span>
                              
                              {/* Show SLA Jump Shift info for intermediate roles */}
                              {idx > 0 && idx !== rule.steps.length - 1 && (
                                <span className={`text-[10px] flex items-center gap-1.5 px-2 py-1 rounded border shadow-inner ${
                                  rule.color === 'rose' 
                                  ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' 
                                  : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                }`}>
                                  <Clock size={12}/> Escalate: {step.timeout}h
                                </span>
                              )}
                              
                              {idx === rule.steps.length - 1 && <span className="text-[10px] uppercase font-extrabold text-white opacity-90 bg-white/20 px-2 py-0.5 rounded shadow-sm">Final Authority</span>}
                            </div>
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>
                </div>

                <button onClick={() => handleEditClick(rule)} className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-blue-600/10 border border-blue-500/30 text-blue-300 font-extrabold rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.1)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  <Edit2 size={16} /> Configure SLA & Flow
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {editingRule && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#030712]/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0B1221] rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-5xl overflow-hidden border border-blue-500/30 flex flex-col max-h-[95vh]">
            
            <div className="flex justify-between items-center p-6 border-b border-blue-900/50 bg-[#050B1A]">
              <div>
                <h3 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Building2 size={24} className="text-emerald-400" /> Organizational Hierarchy & SLAs
                </h3>
                <p className="text-sm text-blue-200/60 font-medium mt-1">Configure auto-escalation timeouts for <span className="text-blue-300 font-bold">{editingRule.title}</span></p>
              </div>
              <button onClick={() => setEditingRule(null)} className="p-2 hover:bg-white/5 rounded-full text-blue-200/50 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 bg-[#050B1A]/50 custom-scrollbar">
              <div className="flex flex-col items-center w-full min-w-[700px] select-none py-6">
                 
                 <TreeNode role="Managing Director" />
                 <div className="w-0.5 h-8 bg-blue-900/50 shadow-[0_0_10px_rgba(30,58,138,0.5)]"></div>
                 <div className="w-[65%] border-t-2 border-blue-900/50 h-8 relative shadow-[0_0_10px_rgba(30,58,138,0.5)]">
                    <div className="absolute top-0 left-0 w-0.5 h-8 bg-blue-900/50"></div>
                    <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-blue-900/50 -ml-px"></div>
                    <div className="absolute top-0 right-0 w-0.5 h-8 bg-blue-900/50"></div>
                 </div>

                 <div className="flex justify-between w-[65%] -mt-8">
                    <TreeNode role="CFO" />
                    <TreeNode role="Admin" />
                    <TreeNode role="IT Helpdesk" />
                 </div>

                 <div className="w-0.5 h-8 bg-blue-900/50 shadow-[0_0_10px_rgba(30,58,138,0.5)]"></div>
                 <div className="w-[85%] border-t-2 border-blue-900/50 h-8 relative shadow-[0_0_10px_rgba(30,58,138,0.5)]">
                    <div className="absolute top-0 left-0 w-0.5 h-8 bg-blue-900/50"></div>
                    <div className="absolute top-0 left-1/3 w-0.5 h-8 bg-blue-900/50 -ml-px"></div>
                    <div className="absolute top-0 right-1/3 w-0.5 h-8 bg-blue-900/50 -mr-px"></div>
                    <div className="absolute top-0 right-0 w-0.5 h-8 bg-blue-900/50"></div>
                 </div>

                 <div className="flex justify-between w-[85%] -mt-8">
                    <TreeNode role="Accountant" />
                    <TreeNode role="Finance Team" />
                    <TreeNode role="HR Team" />
                    <TreeNode role="Reporting Manager" />
                 </div>

                 <div className="w-0.5 h-8 bg-blue-900/50"></div>
                 <div className="flex justify-center w-full -mt-8"><TreeNode role="Team Leader" /></div>
                 <div className="w-0.5 h-8 bg-blue-900/50"></div>
                 <div className="-mt-8"><TreeNode role="Employee" /></div>

              </div>
            </div>

            <div className="border-t border-blue-900/50 bg-[#0B1221]">
              <div className="p-5 bg-blue-900/10 border-b border-blue-900/30 flex items-center gap-3 overflow-x-auto custom-scrollbar min-h-[90px]">
                <span className="text-xs font-extrabold text-blue-400/70 uppercase tracking-widest shrink-0 mt-[-20px]">Selected Path & SLA:</span>
                
                {tempSteps.length === 0 ? (
                  <span className="text-sm font-bold text-rose-400 italic mt-[-20px]">No roles selected. Click chart to build...</span>
                ) : (
                  tempSteps.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <span className={`px-4 py-2 rounded-lg text-sm font-extrabold shadow-lg border w-full text-center
                          ${idx === tempSteps.length - 1 ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-[#111C3B] text-blue-200 border-blue-900/50'}
                        `}>
                          <span className="mr-2 opacity-60">{idx + 1}.</span>{step.role}
                        </span>
                        
                        {/* --- SLA INPUT BOX FOR INTERMEDIATE ROLES --- */}
                        {idx > 0 && idx < tempSteps.length - 1 && (
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-extrabold shadow-inner mt-1 border ${
                            editingRule.color === 'rose' 
                            ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' 
                            : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                          }`}>
                            <Timer size={12} /> Shift in
                            <input 
                              type="number" 
                              min="1" 
                              value={step.timeout} 
                              onChange={(e) => updateSLA(idx, Number(e.target.value))}
                              className={`w-8 bg-[#050B1A] rounded outline-none text-center border ${
                                editingRule.color === 'rose' ? 'border-rose-500/50 text-rose-300' : 'border-amber-500/50 text-amber-300'
                              }`}
                            />
                            hrs
                          </div>
                        )}
                        {(idx === 0 || idx === tempSteps.length - 1) && <div className="h-6 mt-1"></div>}
                      </div>

                      {idx !== tempSteps.length - 1 && <ArrowRight size={18} className="text-blue-500/50 shrink-0 mt-[-24px]" />}
                    </React.Fragment>
                  ))
                )}
              </div>

              <div className="p-6 flex justify-between items-center">
                <button onClick={handleResetFlow} className="flex items-center gap-2 px-5 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-extrabold rounded-xl hover:bg-rose-500 hover:text-white transition shadow-sm">
                  <RotateCcw size={18} /> Reset Path
                </button>
                <div className="flex gap-3">
                  <button onClick={() => setEditingRule(null)} className="px-6 py-3 bg-transparent border border-blue-500/30 text-blue-300 font-bold rounded-xl hover:bg-white/5 transition shadow-sm">
                    Cancel
                  </button>
                  <button onClick={handleSaveConfig} className="px-8 py-3 bg-emerald-600 text-white font-extrabold rounded-xl hover:bg-emerald-500 transition shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 flex items-center gap-2">
                    <Check size={18} /> Confirm Hierarchy & SLAs
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}