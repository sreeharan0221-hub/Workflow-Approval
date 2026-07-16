 import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { FileText, Clock, CheckCircle, XCircle, PlusCircle } from "lucide-react";

// --- GET LOCAL DATA (Unchanged Logic) ---
export const getStoredRequests = () => {
  const stored = localStorage.getItem("approval_requests");
  if (stored) return JSON.parse(stored);

  const categories = ["Infrastructure and Resources 🏢", "Financial Approval 💰", "Hiring and Recruitment 👥", "Project Approval 📊"];
  const generated = Array.from({ length: 342 }).map((_, i) => ({
    id: `REQ-${1000 + i}`,
    title: `Workflow Request ${i + 1}`,
    employee: "Employee User",
    dept: "Operations",
    category: categories[Math.floor(Math.random() * categories.length)],
    amount: `₹${Math.floor(Math.random() * 50000) + 1000}`,
    status: Math.random() > 0.8 ? "Pending" : (Math.random() > 0.7 ? "Rejected" : "Approved"),
    date: new Date().toISOString().split('T')[0],
    desc: "Auto generated request",
    isEmergency: Math.random() > 0.95
  }));
  localStorage.setItem("approval_requests", JSON.stringify(generated));
  return generated;
};

const barData = [
  { name: "Oct", approved: 65, rejected: 8, pending: 12 },
  { name: "Nov", approved: 78, rejected: 11, pending: 15 },
  { name: "Dec", approved: 52, rejected: 6, pending: 10 },
  { name: "Jan", approved: 91, rejected: 14, pending: 20 },
  { name: "Feb", approved: 85, rejected: 9, pending: 18 },
  { name: "Mar", approved: 90, rejected: 12, pending: 28 },
];

const pieData = [
  { name: "Engineering", value: 35, color: "#3b82f6" }, 
  { name: "Sales", value: 22, color: "#f59e0b" }, 
  { name: "Marketing", value: 15, color: "#8b5cf6" }, 
  { name: "Operations", value: 18, color: "#10b981" }, 
  { name: "Finance", value: 10, color: "#f43f5e" }, 
];

// Dark Theme Custom Tooltip for Bar Chart 
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0B1221]/90 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-blue-500/20 text-white transform transition-all scale-105">
        <p className="font-extrabold text-blue-400 mb-3 border-b border-blue-900/50 pb-2">{label} Report</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between items-center gap-6 mb-2 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: entry.color }}></span>
              <span className="text-blue-200/80 font-medium">{entry.name}</span>
            </span>
            <span className="font-bold text-white text-base">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Dark Theme Custom Legend for Pie Chart 
const CustomPieLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-6">
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform">
          <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ backgroundColor: entry.color }}></div>
          <span className="text-sm font-bold text-blue-200/70">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });

  useEffect(() => {
    const data = getStoredRequests();
    setStats({
      pending: data.filter((r: any) => r.status === "Pending").length,
      approved: data.filter((r: any) => r.status === "Approved").length,
      rejected: data.filter((r: any) => r.status === "Rejected").length,
      total: data.length
    });
  }, []);

  // Updated colors and backgrounds for Dark Theme Glassmorphism
  const summaryCards = [
    { title: "Pending", count: stats.pending, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-500/20", link: "/requests", filterStatus: "Pending" },
    { title: "Approved", count: stats.approved, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/20", link: "/requests", filterStatus: "Approved" },
    { title: "Rejected", count: stats.rejected, icon: XCircle, color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-500/20", link: "/requests", filterStatus: "Rejected" },
    { title: "Total Requests", count: stats.total, icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-500/20", link: "/requests", filterStatus: "" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10 animate-in fade-in duration-500 relative z-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">Dashboard Overview</h1>
          <p className="text-blue-200/60 text-sm mt-1 font-medium">Welcome back! Here is the summary of your approval workflows.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate("/requests/new")} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-extrabold rounded-xl hover:bg-blue-500 transition-all shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:-translate-y-1">
            <PlusCircle size={20} /> New Request
          </button>
        </div>
      </div>

      {/* STATS CARDS (Premium Glassmorphism) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {summaryCards.map((card, idx) => (
          <div key={idx} onClick={() => card.link && navigate(card.link, { state: { statusFilter: card.filterStatus } })} className={`bg-[#111C3B]/60 backdrop-blur-xl p-6 rounded-3xl border ${card.border} shadow-lg flex flex-col justify-between hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all cursor-pointer group`}>
            <div className={`${card.bg} border border-white/5 p-3 rounded-2xl w-max mb-4 group-hover:scale-110 transition-transform`}><card.icon size={28} className={card.color} /></div>
            <h3 className={`text-4xl font-extrabold ${card.color} drop-shadow-md`}>{card.count}</h3>
            <p className="text-sm font-bold text-blue-200/60 mt-1 uppercase tracking-wider">{card.title}</p>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BAR CHART */}
        <div className="bg-[#111C3B]/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-blue-500/20 shadow-xl lg:col-span-2">
          <h3 className="font-extrabold text-white mb-6 text-lg tracking-wide">Monthly Approvals Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                {/* Dark theme grid lines */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e3a8a" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                
                <RechartsTooltip content={<CustomBarTooltip />} cursor={{ fill: '#1e3a8a', opacity: 0.2 }} />
                
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }} />
                <Bar dataKey="approved" name="Approved" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Bar dataKey="rejected" name="Rejected" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-[#111C3B]/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-blue-500/20 shadow-xl">
          <h3 className="font-extrabold text-white mb-2 text-lg tracking-wide">Requests By Department</h3>
          <p className="text-xs text-blue-300/50 font-bold uppercase tracking-widest mb-6">Distribution of workflow origins</p>
          <div className="h-[300px] flex flex-col justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={5} 
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend content={<CustomPieLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}