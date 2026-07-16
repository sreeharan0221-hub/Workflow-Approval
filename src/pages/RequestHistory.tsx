 import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import { Eye, X, FileText, CheckCircle, Clock, XCircle, Search, Filter, Download, ArrowLeft } from "lucide-react"; 
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateRequests = () => {
  const baseRequests = [
    { id: "REQ-1042", title: "MacBook Pro M3", employee: "Arun Kumar", dept: "Engineering", category: "Infrastructure and Resources 🏢", status: "Pending", date: "2023-10-24", desc: "Need a new laptop for heavy compilation tasks." },
    { id: "REQ-1041", title: "Client Dinner", employee: "Priya M", dept: "Sales", category: "Partnerships and Agreements 🤝", status: "Approved", date: "2023-10-23", desc: "Dinner with ABC Corp executives to finalize Q4 contract." },
    { id: "REQ-1040", title: "AWS Subscription", employee: "Karthik", dept: "IT", category: "Financial Approval 💰", status: "Rejected", date: "2023-10-22", desc: "Monthly server cost increase approval." },
    { id: "REQ-1039", title: "New Developer Interns", employee: "Sneha", dept: "HR", category: "Hiring and Recruitment 👥", status: "Approved", date: "2023-10-20", desc: "Permission to recruit 4 new interns for the frontend team." },
  ];

  const titles = ["Software License", "Travel Booking", "Team Lunch", "Cloud Storage", "Marketing Ads", "Consulting Fee", "Hardware Repair", "Policy Update"];
  const employees = ["Ravi Verma", "Meera Nair", "Suresh Iyer", "Kavya Singh", "Manoj Das", "Divya K", "Sanjay M", "Pooja Sharma"];
  const depts = ["Engineering", "Sales", "HR", "IT", "Marketing", "Finance", "Operations"];
  
  const categories = [
    "Financial Approval 💰",
    "Hiring and Recruitment 👥",
    "Project Approval 📊",
    "Budget Allocation 📑",
    "Leave and Policy Decisions 🗂️",
    "Partnerships and Agreements 🤝",
    "Infrastructure and Resources 🏢",
    "Marketing and Promotions 📢"
  ];

  const generated = Array.from({ length: 338 }).map((_, i) => {
    const rand = Math.random();
    const status = rand > 0.85 ? "Pending" : (rand > 0.75 ? "Rejected" : "Approved");

    return {
      id: `REQ-${1038 - i}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      employee: employees[Math.floor(Math.random() * employees.length)],
      dept: depts[Math.floor(Math.random() * depts.length)],
      category: categories[Math.floor(Math.random() * categories.length)], 
      status: status,
      date: `2023-${String(Math.floor(Math.random() * 6) + 5).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      desc: "Standard organizational request logged based on the selected category."
    };
  });

  return [...baseRequests, ...generated];
};

const allRequests = generateRequests();

export default function RequestHistory() {
  const location = useLocation();
  const navigate = useNavigate(); 
  
  const passedStatusFilter = location.state?.statusFilter || "";
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<jsPDF | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [columnFilters, setColumnFilters] = useState({
    id: "", title: "", employee: "", category: "", status: passedStatusFilter, date: ""
  });

  const handleFilterChange = (column: string, value: string) => {
    setColumnFilters(prev => ({ ...prev, [column]: value }));
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Approved': return <span className="px-3 py-1 bg-emerald-100/80 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1.5 w-max border border-emerald-200"><CheckCircle size={14}/> Approved</span>;
      case 'Pending': return <span className="px-3 py-1 bg-amber-100/80 text-amber-700 text-xs font-bold rounded-full flex items-center gap-1.5 w-max border border-amber-200"><Clock size={14}/> Pending</span>;
      case 'Rejected': return <span className="px-3 py-1 bg-rose-100/80 text-rose-700 text-xs font-bold rounded-full flex items-center gap-1.5 w-max border border-rose-200"><XCircle size={14}/> Rejected</span>;
      default: return null;
    }
  };

  const filteredRequests = useMemo(() => {
    return allRequests.filter(req => {
      const matchesGlobal = searchTerm === "" || 
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesId = req.id.toLowerCase().includes(columnFilters.id.toLowerCase());
      const matchesTitle = req.title.toLowerCase().includes(columnFilters.title.toLowerCase());
      const matchesEmployee = req.employee.toLowerCase().includes(columnFilters.employee.toLowerCase()) || req.dept.toLowerCase().includes(columnFilters.employee.toLowerCase());
      const matchesCategory = req.category.toLowerCase().includes(columnFilters.category.toLowerCase());
      const matchesStatus = columnFilters.status === "" || req.status === columnFilters.status;
      const matchesDate = req.date.includes(columnFilters.date);

      return matchesGlobal && matchesId && matchesTitle && matchesEmployee && matchesCategory && matchesStatus && matchesDate;
    });
  }, [searchTerm, columnFilters]);

  const handlePreviewPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Organization Requests Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Total Records: ${filteredRequests.length}`, 14, 34);

    const tableColumn = ["Req ID", "Title", "Employee", "Category", "Status", "Date"];
    const tableRows: any[] = [];

    filteredRequests.forEach(req => {
      const cleanCategory = req.category.replace(/[^\x00-\x7F]/g, "").trim();
      const requestData = [ req.id, req.title, `${req.employee}\n(${req.dept})`, cleanCategory, req.status, req.date ];
      tableRows.push(requestData);
    });

    autoTable(doc, {
      head: [tableColumn], body: tableRows, startY: 40, theme: 'grid', styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] }, alternateRowStyles: { fillColor: [248, 250, 252] }
    });

    const pdfBlobUrl = doc.output('bloburl');
    setPdfDoc(doc); 
    setPdfPreviewUrl(pdfBlobUrl); 
  };

  const downloadPDF = () => {
    if (pdfDoc) {
      const fileName = columnFilters.status ? `ApprovalFlow_${columnFilters.status}_Requests.pdf` : "ApprovalFlow_All_Requests.pdf";
      pdfDoc.save(fileName);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-7xl mx-auto space-y-6 pb-10 pt-4 px-4">
        
        {/* IDHU THAAN NEENGA KETTA PUDHU BACK BUTTON */}
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition w-max mb-2"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        
        {/* Premium Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-2xl p-8 shadow-xl border border-slate-800 overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-20 w-40 h-40 bg-indigo-500 rounded-full opacity-10 blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 tracking-tight">
                <FileText className="text-blue-400" size={32} /> Organization Requests
              </h1>
              <p className="text-blue-200 mt-2 text-sm font-medium opacity-90">
                Viewing {filteredRequests.length} requests {columnFilters.status && `(${columnFilters.status})`} in the system.
              </p>
            </div>
            
            <button 
              onClick={handlePreviewPDF}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-900/50 border border-blue-500"
            >
              <Eye size={18} /> Preview PDF Report
            </button>
          </div>
        </div>

        {/* Global Search */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Global search across all columns..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm shadow-sm font-medium text-slate-700"
            />
          </div>
        </div>

        {/* Scrollable Table with Column Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left text-sm relative">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 min-w-[120px]">
                    <div className="font-bold tracking-wide mb-2 text-slate-800">Req ID</div>
                    <input 
                      type="text" placeholder="Search ID..." value={columnFilters.id}
                      onChange={(e) => handleFilterChange('id', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs font-normal border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                  </th>
                  <th className="px-4 py-3 min-w-[150px]">
                    <div className="font-bold tracking-wide mb-2 text-slate-800">Title</div>
                    <input 
                      type="text" placeholder="Search Title..." value={columnFilters.title}
                      onChange={(e) => handleFilterChange('title', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs font-normal border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                  </th>
                  <th className="px-4 py-3 min-w-[150px]">
                    <div className="font-bold tracking-wide mb-2 text-slate-800">Employee / Dept</div>
                    <input 
                      type="text" placeholder="Search Employee..." value={columnFilters.employee}
                      onChange={(e) => handleFilterChange('employee', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs font-normal border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                  </th>
                  <th className="px-4 py-3 min-w-[180px]">
                    <div className="font-bold tracking-wide mb-2 text-slate-800">Category</div>
                    <input 
                      type="text" placeholder="Search Category..." value={columnFilters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs font-normal border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                  </th>
                  <th className="px-4 py-3 min-w-[130px]">
                    <div className="font-bold tracking-wide mb-2 text-slate-800">Status</div>
                    <select 
                      value={columnFilters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs font-normal border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-slate-600"
                    >
                      <option value="">All Status</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </th>
                  <th className="px-4 py-3 min-w-[120px]">
                    <div className="font-bold tracking-wide mb-2 text-slate-800">Date</div>
                    <input 
                      type="text" placeholder="YYYY-MM-DD" value={columnFilters.date}
                      onChange={(e) => handleFilterChange('date', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs font-normal border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                  </th>
                  <th className="px-4 py-3 align-top">
                    <div className="font-bold tracking-wide text-slate-800 mt-1">Action</div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-blue-50/40 transition cursor-pointer group" onClick={() => setSelectedRequest(req)}>
                      <td className="px-4 py-4 font-mono text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-colors">{req.id}</td>
                      <td className="px-4 py-4 font-bold text-slate-800">{req.title}</td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-slate-700">{req.employee}</p>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">{req.dept}</p>
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-700 text-xs">{req.category}</td>
                      <td className="px-4 py-4">{getStatusBadge(req.status)}</td>
                      <td className="px-4 py-4 text-slate-500 text-xs font-semibold">{req.date}</td>
                      <td className="px-4 py-4">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); }}
                          className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Eye size={16} /> View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-slate-500 font-medium">
                      No requests found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-sm text-slate-500 font-bold">
            <span>Showing {filteredRequests.length} of {allRequests.length} requests</span>
            <button 
              onClick={() => {
                setSearchTerm("");
                setColumnFilters({id: "", title: "", employee: "", category: "", status: "", date: ""});
              }}
              className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <Filter size={14} /> Clear All Filters
            </button>
          </div>
        </div>

        {/* Details View Popup */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 border border-slate-100">
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{selectedRequest.title}</h3>
                  <p className="text-sm text-blue-600 font-mono font-bold mt-1 bg-blue-50 inline-block px-2 py-0.5 rounded">{selectedRequest.id}</p>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Employee</p>
                    <p className="font-bold text-slate-800 mt-1">{selectedRequest.employee}</p>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{selectedRequest.dept}</p>
                  </div>
                  <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-100 shadow-sm flex flex-col justify-center">
                    <p className="text-[10px] text-blue-500 uppercase font-extrabold tracking-wider">Category</p>
                    <p className="font-bold text-blue-800 text-sm mt-1 leading-tight">{selectedRequest.category}</p>
                  </div>
                  <div className="p-2">
                    <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Date Submitted</p>
                    <p className="font-bold text-slate-700 mt-1">{selectedRequest.date}</p>
                  </div>
                  <div className="p-2">
                    <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1.5">Current Status</p>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-2">Description / Reason</p>
                  <div className="text-slate-700 bg-slate-50 p-4 rounded-xl text-sm border border-slate-200 shadow-inner font-medium">
                    {selectedRequest.desc}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setSelectedRequest(null)} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition shadow-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* IN-APP PDF PREVIEW MODAL */}
        {pdfPreviewUrl && (
          <div className="fixed inset-0 z-[60] flex flex-col bg-slate-900/90 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full h-full max-w-6xl mx-auto flex flex-col overflow-hidden border border-slate-700">
              
              <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-100">
                <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                  <FileText size={20} className="text-blue-600"/> Report Preview
                </h3>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={downloadPDF}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20"
                  >
                    <Download size={18} /> Download Now
                  </button>
                  <button 
                    onClick={() => { setPdfPreviewUrl(null); setPdfDoc(null); }} 
                    className="p-2 bg-slate-200 hover:bg-rose-100 hover:text-rose-600 rounded-lg text-slate-600 transition"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 w-full bg-slate-300">
                <iframe 
                  src={pdfPreviewUrl} 
                  className="w-full h-full border-0" 
                  title="PDF Preview" 
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}