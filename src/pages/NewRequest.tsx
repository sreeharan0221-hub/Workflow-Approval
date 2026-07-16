import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';

export default function NewRequest() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering'); 
  const [category, setCategory] = useState('Infrastructure and Resources 🏢');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const departments = ["Engineering", "Sales", "Marketing", "Operations", "Finance", "HR"];
  const categories = [
    "Infrastructure and Resources 🏢",
    "Financial Approval 💰",
    "Hiring and Recruitment 👥",
    "Project Approval 📊",
    "Leave Approval 🗓️"
  ];

  const showBudget = category !== "Leave Approval 🗓️" && category !== "Project Approval 📊";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // ==========================================
    // 1. SMART AUTO-ROUTING LOGIC (WITH EMERGENCY OVERRIDE)
    // ==========================================
    let assignedAdmin = "Manager"; // Default

    // EMERGENCY OVERRIDE - PUDHU LOGIC!
    if (isEmergency) {
      assignedAdmin = "Managing Director"; 
    } 
    // Normal Routing Rules
    else if (category.includes("Financial")) {
      assignedAdmin = Number(amount) > 50000 ? "CFO" : "Accountant";
    } else if (category.includes("Infrastructure")) {
      assignedAdmin = "Managing Director";
    } else if (category.includes("Hiring") || category.includes("Project") || category.includes("Leave")) {
      assignedAdmin = "Manager";
    }

    // ==========================================
    // 2. CREATE REQUEST DATA
    // ==========================================
    const newRequest = {
      id: `REQ-${Math.floor(Math.random() * 90000) + 10000}`,
      title,
      requester: localStorage.getItem("logged_in_user") || "Employee User",
      dept: department,
      category,
      amount: showBudget && amount ? `₹${amount}` : "N/A",
      desc,
      isEmergency,
      status: "Pending",
      date: new Date().toISOString().split('T')[0],
      pendingWith: assignedAdmin
    };

    // 3. SAVE TO LOCALSTORAGE
    const existingRequests = JSON.parse(localStorage.getItem("approval_requests") || "[]");
    localStorage.setItem("approval_requests", JSON.stringify([newRequest, ...existingRequests]));

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => navigate('/requests'), 2000);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 relative z-10 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg flex items-center gap-3">
            <FilePlus className="text-blue-400" size={32} /> Create New Request
          </h1>
          <p className="text-blue-200/60 text-sm mt-2 font-bold tracking-wide">
            Submit a new workflow request for hierarchical approval.
          </p>
        </div>
      </div>

      {showSuccess && (
        <div className="w-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 p-6 rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.2)] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 mb-6">
          <CheckCircle2 size={28} className="text-emerald-500" />
          <div>
            <h3 className="text-lg font-extrabold">Request Submitted Successfully!</h3>
            <p className="text-sm font-bold opacity-80">Routing to the appropriate manager... Redirecting you now.</p>
          </div>
        </div>
      )}

      <div className="bg-[#111C3B]/60 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-blue-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-inner
            ${isEmergency ? 'bg-rose-500/10 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)]' : 'bg-[#050B1A]/40 border-blue-900/30'}
          `}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl flex items-center justify-center transition-colors
                ${isEmergency ? 'bg-rose-500 shadow-lg shadow-rose-500/40 text-white' : 'bg-[#111C3B] text-blue-400/50 border border-blue-900/50'}
              `}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className={`text-lg font-extrabold tracking-wide transition-colors ${isEmergency ? 'text-rose-400' : 'text-white'}`}>
                  Emergency Request
                </h3>
                <p className={`text-xs font-bold mt-1 transition-colors ${isEmergency ? 'text-rose-300/80' : 'text-blue-300/50'}`}>
                  Prioritizes your request. Routes directly to the Managing Director.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" className="sr-only peer" checked={isEmergency} onChange={() => setIsEmergency(!isEmergency)} />
              <div className="w-14 h-7 bg-[#050B1A] border border-blue-900/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-rose-500 peer-checked:border-rose-400 shadow-inner"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-extrabold text-blue-200/80 uppercase tracking-widest mb-3">Request Title <span className="text-rose-400">*</span></label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Critical Server Failure" className="w-full px-5 py-4 bg-[#050B1A]/80 border border-blue-900/50 rounded-xl text-white font-extrabold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner" required />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-blue-200/80 uppercase tracking-widest mb-3">Department <span className="text-rose-400">*</span></label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-5 py-4 bg-[#050B1A]/80 border border-blue-900/50 rounded-xl text-white font-extrabold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner appearance-none cursor-pointer" required>
                {departments.map((dept, idx) => <option key={idx} value={dept} className="bg-[#0B1221] text-white font-bold py-2">{dept}</option>)}
              </select>
            </div>

            <div className={`${showBudget ? '' : 'md:col-span-2'} transition-all duration-300`}>
              <label className="block text-xs font-extrabold text-blue-200/80 uppercase tracking-widest mb-3">Category <span className="text-rose-400">*</span></label>
              <select value={category} onChange={(e) => { setCategory(e.target.value); if (e.target.value === "Leave Approval 🗓️" || e.target.value === "Project Approval 📊") setAmount(''); }} className="w-full px-5 py-4 bg-[#050B1A]/80 border border-blue-900/50 rounded-xl text-white font-extrabold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner appearance-none cursor-pointer" required>
                {categories.map((cat, idx) => <option key={idx} value={cat} className="bg-[#0B1221] text-white font-bold py-2">{cat}</option>)}
              </select>
            </div>

            {showBudget && (
              <div className="animate-in zoom-in-95 duration-300">
                <label className="block text-xs font-extrabold text-blue-200/80 uppercase tracking-widest mb-3">Budget Amount (₹) <span className="text-rose-400">*</span></label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 5000" className="w-full px-5 py-4 bg-[#050B1A]/80 border border-blue-900/50 rounded-xl text-white font-extrabold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner" required={showBudget} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-extrabold text-blue-200/80 uppercase tracking-widest mb-3">Detailed Description <span className="text-rose-400">*</span></label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Explain the purpose and urgency of this request..." rows={5} className="w-full px-5 py-4 bg-[#050B1A]/80 border border-blue-900/50 rounded-xl text-white font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner resize-none custom-scrollbar" required></textarea>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-4 pt-6 border-t border-blue-900/40">
            <button type="button" onClick={() => navigate('/dashboard')} className="w-full sm:w-auto px-8 py-4 bg-transparent border border-blue-500/30 text-blue-300 font-extrabold rounded-xl hover:bg-white/5 transition-all shadow-sm">Discard Request</button>
            <button type="submit" disabled={isSubmitting} className={`group relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 text-white rounded-xl font-extrabold text-lg transition-all duration-300 shadow-lg hover:-translate-y-1 active:translate-y-0 ${isEmergency ? 'bg-rose-600 hover:bg-rose-500 hover:shadow-[0_15px_30px_rgba(244,63,94,0.4)]' : 'bg-blue-600 hover:bg-blue-500 hover:shadow-[0_15px_30px_rgba(37,99,235,0.4)]'} ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
              {!isSubmitting && <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}