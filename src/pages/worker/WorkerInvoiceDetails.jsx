import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

const primary = "#8ad007";

const customStyles = `
  .receipt-img { filter: grayscale(0.2); opacity: 0.9; transition: opacity 0.2s; }
  .receipt-img:hover { opacity: 1; }
  .receipt-wrap:hover .receipt-overlay { background: rgba(0,0,0,0.1); }
  .receipt-wrap:hover .zoom-icon { opacity: 1; }
  .zoom-icon { opacity: 0; transition: opacity 0.2s; }
`;

export default function WorkerInvoiceDetails() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                // Use the new worker-specific endpoint
                const response = await api.get(`job-request-induvidual/${jobId}/`);
                setJob(response.data);
            } catch (err) {
                console.error("Failed to fetch job details:", err);
            } finally {
                setLoading(false);
            }
        };
        if (jobId) fetchJobDetails();
    }, [jobId]);

    if (loading) return <div className="p-6 text-slate-500 font-medium">Loading details...</div>;
    if (!job) return <div className="p-6 text-slate-500 font-medium">Job details not found.</div>;

    const billing = job.billing_info || {};
    const totalAmount = billing.total_amount || 0;
    const laborAmount = billing.labor_amount || 0;
    const materialAmount = billing.material_amount || 0;

    const getSessionDuration = (start, end) => {
        if (!start || !end) return "0h 0m";
        const diffMs = new Date(end) - new Date(start);
        if (diffMs < 0) return "0h 0m";
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="flex flex-col min-h-screen font-['Manrope'] bg-[#f7f8f5] text-[#161811]">
            <style>{customStyles}</style>

            {/* Header - Reduced Height */}
            <header className="sticky top-0 z-10 bg-white border-b border-[#f3f5f0] px-6 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#89d006] text-xl font-black">description</span>
                        <span className="text-sm font-black text-[#161811] uppercase tracking-tighter">Portfolio & Ledger</span>
                    </div>
                    <span className="px-3 py-1 rounded-none bg-[#89d006]/10 text-[#89d006] text-[9px] font-black uppercase tracking-widest">
                        {job.status.toUpperCase()}
                    </span>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => navigate(-1)}
                        className="size-10 flex items-center justify-center bg-[#f7f8f5] rounded-none text-[#161811] hover:bg-[#89d006]/10 transition-all"
                    >
                        <span className="material-symbols-outlined text-lg font-bold">close</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area - Reduced Padding */}
            <div className="max-w-5xl mx-auto w-full p-6 space-y-6">
                
                {/* Summary Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Job Context Wrapper - Reduced */}
                    <div className="lg:col-span-2 bg-white rounded-none p-6 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-[#7c8c5f] uppercase tracking-[0.2em] mb-2">Project Specifics</p>
                                <h3 className="text-2xl font-black text-[#161811] mb-4 leading-tight tracking-tighter">{job.description}</h3>
                                <div className="flex items-center gap-2 text-[#7c8c5f] text-[10px] font-bold uppercase tracking-tight">
                                    <span className="material-symbols-outlined text-xs font-bold">calendar_today</span>
                                    Published {new Date(job.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Participants - Reduced sizes */}
                            <div className="flex -space-x-1.5">
                                {[
                                    { src: job.employer_profile_image, name: job.employer_name, type: 'Employer' },
                                    { src: job.worker_profile_image, name: job.worker_name, type: 'Worker (You)' }
                                ].map((user, i) => {
                                    const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';
                                    return (
                                        <div key={i} className="relative group">
                                            <div className={`
                                                w-12 h-12 rounded-none bg-white overflow-hidden shadow-sm transition-transform group-hover:-translate-y-1
                                                ${!user.src ? (i === 0 ? 'bg-[#f7f8f5]' : 'bg-[#89d006]/10') : 'bg-[#f7f8f5]'}
                                                flex items-center justify-center
                                            `}>
                                                {user.src && <img src={user.src} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" alt={user.name} />}
                                                <span className={`text-sm font-black ${i === 0 ? 'text-slate-400' : 'text-[#161811]'}`}>{initial}</span>
                                            </div>
                                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#161811] text-[#89d006] text-[8px] font-black px-2 py-1.5 rounded-none opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-30 pointer-events-none uppercase tracking-widest shadow-md">
                                                {user.type}: {user.name}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-[#f3f5f0] flex flex-wrap gap-8">
                            {[
                                ["Employer", job.employer_name],
                                ["City", job.city],
                                ["Ledger ID", `#WORK-${job.id}`]
                            ].map(([label, val]) => (
                                <div key={label}>
                                    <p className="text-[10px] font-black text-[#7c8c5f] uppercase tracking-[0.2em] mb-1">{label}</p>
                                    <p className="text-sm font-black text-[#161811] uppercase tracking-tight">{val}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Earnings Card - Reduced height and font sizes */}
                    <div className="bg-[#161811] text-white rounded-none p-8 relative overflow-hidden shadow-md flex flex-col justify-between">
                        <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[100px] opacity-10 rotate-12 scale-110 pointer-events-none">handshake</span>
                        <div className="relative">
                            <p className="text-[9px] font-black text-[#89d006] uppercase tracking-[0.3em] mb-2">Net Earnings</p>
                            <p className="text-4xl font-black text-white leading-none tracking-tighter">₹{parseFloat(totalAmount).toFixed(2)}</p>
                            {billing.was_penalty_applied && (
                                <div className="mt-4 flex items-center gap-1.5 text-[8px] bg-red-600/20 px-2 py-1 rounded-none inline-flex font-black uppercase tracking-widest text-red-500 border border-red-500/10">
                                    <span className="material-symbols-outlined text-xs font-bold">warning</span>
                                    Penalty Logged
                                </div>
                            )}
                        </div>
                        <div className="relative mt-8 space-y-3 pt-6 border-t border-white/10 uppercase tracking-widest">
                            <div className="flex justify-between text-[9px]">
                                <span className="opacity-50 font-bold tracking-tight">Labor Settlement</span>
                                <span className="font-black text-[#89d006]">₹{parseFloat(laborAmount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[9px]">
                                <span className="opacity-50 font-bold tracking-tight">Reimbursements</span>
                                <span className="font-black text-[#89d006]">₹{parseFloat(materialAmount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    <div className="space-y-6 flex flex-col">
                        {/* Time & Rate Card - Reduced spacing */}
                        <div className="bg-white rounded-none p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-10 rounded-none bg-[#f7f8f5] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#89d006] text-xl font-black">history_toggle_off</span>
                                </div>
                                <span className="text-sm font-black text-[#161811] uppercase tracking-tighter">Engagement Metrics</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#fcfdfa] p-4 rounded-none">
                                    <p className="text-[9px] font-black text-[#7c8c5f] uppercase tracking-[0.2em] mb-1">Duration</p>
                                    <p className="text-xl font-black text-[#161811] leading-none tracking-tight">{job.start_time && job.end_time ? getSessionDuration(job.start_time, job.end_time) : "N/A"}</p>
                                </div>
                                <div className="bg-[#fcfdfa] p-4 rounded-none">
                                    <p className="text-[9px] font-black text-[#7c8c5f] uppercase tracking-[0.2em] mb-1">Locked Rate</p>
                                    <p className="text-xl font-black text-[#161811] leading-none tracking-tight">₹{job.contract_hourly_rate || job.hourly_rate}<span className="text-[10px] font-black text-[#7c8c5f] ml-0.5 uppercase">/hr</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Project Log Card - Reduced padding */}
                        <div className="bg-white rounded-none p-6 shadow-sm flex-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-10 rounded-none bg-[#f7f8f5] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#89d006] text-xl font-black">summarize</span>
                                </div>
                                <span className="text-sm font-black text-[#161811] uppercase tracking-tighter">Audit Summary</span>
                            </div>
                            <div className="space-y-6">
                                <p className="text-[13px] text-[#161811] leading-tight font-bold opacity-80">
                                    Project delivery finalized for user "{job.employer_name}". 
                                    Financial settlement processed via escrow.
                                </p>
                                <div className="p-5 bg-[#161811] rounded-none border-l-2 border-[#89d006] flex gap-4 shadow-sm">
                                    <span className="material-symbols-outlined text-[#89d006] text-lg font-bold">info</span>
                                    <p className="text-[8px] text-white font-bold leading-relaxed uppercase tracking-widest opacity-80">
                                        Payout calculations are locked based on timestamps from {new Date(job.start_time).toLocaleTimeString()} to {new Date(job.end_time).toLocaleTimeString()}.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Receipt Evidence Card - Reduced sizing */}
                    <div className="bg-white rounded-none p-6 shadow-sm flex flex-col h-[500px]">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-none bg-[#f7f8f5] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#89d006] text-xl font-black">attachment</span>
                                </div>
                                <span className="text-sm font-black text-[#161811] uppercase tracking-tighter">Evidence Ledger</span>
                            </div>
                            {billing.bill_image && (
                                <a href={billing.bill_image} target="_blank" rel="noreferrer" 
                                className="px-4 py-1.5 bg-[#161811] text-[9px] font-black text-[#89d006] hover:bg-[#89d006] hover:text-[#161811] transition-all uppercase tracking-widest shadow-sm">
                                    OPEN
                                </a>
                            )}
                        </div>

                        <div className="receipt-wrap relative flex-1 bg-[#fcfdfa] rounded-none overflow-hidden cursor-zoom-in group border-2 border-dashed border-[#f3f5f0] hover:border-[#89d006]/30 transition-all">
                            {billing.bill_image ? (
                                <>
                                    <img 
                                        src={billing.bill_image} 
                                        className="receipt-img w-full h-full object-contain p-3 grayscale group-hover:grayscale-0 transition-all duration-700" 
                                        alt="Receipt Evidence"
                                        onClick={() => window.open(billing.bill_image, '_blank')}
                                    />
                                    <div className="receipt-overlay absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-[#161811]/5 transition-all pointer-events-none">
                                        <div className="zoom-icon size-12 rounded-none bg-[#89d006] shadow-md flex items-center justify-center text-[#161811] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                            <span className="material-symbols-outlined text-2xl font-black">zoom_in</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-6">
                                    <span className="material-symbols-outlined text-[60px] opacity-10">cloud_off</span>
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 opacity-40">Artifact Undefined</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-between items-center shrink-0 border-t border-[#f3f5f0] pt-6">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-[#7c8c5f] font-black uppercase tracking-widest mb-1">Audit Status</span>
                                <span className={`text-[10px] font-black tracking-tight ${billing.bill_image ? 'text-[#89d006]' : 'text-slate-300'}`}>
                                    {billing.bill_image ? 'VERIFIED' : 'PENDING'}
                                </span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-[9px] text-[#7c8c5f] font-black uppercase tracking-widest mb-1">Standard</span>
                                <span className="text-[10px] text-[#161811] font-black tracking-tight">
                                    {billing.bill_image ? 'ISO_LEDGER' : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
