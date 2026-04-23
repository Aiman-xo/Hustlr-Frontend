import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

const primary = "#8ad007";

// Keep the specific animations/custom filters in a style tag
const customStyles = `
  .receipt-img { filter: grayscale(0.2); opacity: 0.9; transition: opacity 0.2s; }
  .receipt-img:hover { opacity: 1; }
  .receipt-wrap:hover .receipt-overlay { background: rgba(0,0,0,0.1); }
  .receipt-wrap:hover .zoom-icon { opacity: 1; }
  .zoom-icon { opacity: 0; transition: opacity 0.2s; }
`;

export default function InvoiceDetails() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await api.get(`request-handle/${jobId}/`);
                setJob(response.data);
            } catch (err) {
                console.error("Failed to fetch job details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetails();
    }, [jobId]);

    

    if (loading) return <div className="p-6 text-slate-500 font-medium">Loading...</div>;
    if (!job) return <div className="p-6 text-slate-500 font-medium">Job not found.</div>;

    const billing = job.billing_info || {};
    const totalAmount = billing.total_amount || 0;
    const laborAmount = billing.labor_amount || 0;
    const materialAmount = billing.material_amount || 0;

    const getSessionDuration = (start, end) => {
        if (!start || !end) return "0h 0m";
        const diffMs = new Date(end) - new Date(start);
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
                        <span className="text-sm font-black text-[#161811] uppercase tracking-tighter">Settlement Brief</span>
                    </div>
                    <span className="px-3 py-1 rounded-none bg-[#89d006]/10 text-[#89d006] text-[9px] font-black uppercase tracking-widest">
                        {job.status === 'completed' ? 'SETTLED' : job.status.toUpperCase()}
                    </span>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => navigate(-1)}
                        className="size-10 flex items-center justify-center bg-[#f7f8f5] rounded-none text-[#161811] hover:bg-[#89d006]/10 transition-all font-bold"
                    >
                        <span className="material-symbols-outlined text-lg font-bold">close</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area - Reduced Padding */}
            <div className="max-w-5xl mx-auto w-full p-6 space-y-6">
                
                {/* Top Summary Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Job Context Card - Reduced */}
                    <div className="lg:col-span-2 bg-white rounded-none p-6 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-[#7c8c5f] uppercase tracking-[0.2em] mb-2">Project Narrative</p>
                                <h3 className="text-2xl font-black text-[#161811] mb-4 leading-tight tracking-tighter break-words whitespace-pre-wrap">{job.description}</h3>
                                <div className="flex items-center gap-2 text-[#7c8c5f] text-[10px] font-bold uppercase tracking-tight">
                                    <span className="material-symbols-outlined text-xs font-bold">calendar_today</span>
                                    Logged {new Date(job.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Participants - Reduced size */}
                            <div className="flex -space-x-1.5">
                                {[
                                    { src: job.employer_profile_image, name: job.employer_name, type: 'Employer' },
                                    { src: job.worker_profile_image, name: job.worker_name, type: 'Worker' }
                                ].map((user, i) => {
                                    const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';
                                    return (
                                        <div key={i} className="relative group">
                                            <div className={`
                                                w-12 h-12 rounded-none bg-[#f7f8f5] overflow-hidden shadow-sm transition-transform group-hover:-translate-y-1
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
                            {[["Client", job.employer_name], ["Provider", job.worker_name], ["Zone", job.city],["Work-ID",job.billing_info.job]].map(([label, val]) => (
                                <div key={label}>
                                    <p className="text-[10px] font-black text-[#7c8c5f] uppercase tracking-[0.2em] mb-1">{label}</p>
                                    <p className="text-sm font-black text-[#161811] uppercase tracking-tight ">{val}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payout Card - Reduced sizing */}
                    <div className="bg-[#89d006] text-[#161811] rounded-none p-8 relative overflow-hidden shadow-md flex flex-col justify-between">
                        <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[100px] opacity-10 rotate-12 scale-110 pointer-events-none">account_balance_wallet</span>
                        <div className="relative">
                            <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.3em] mb-2">Gross Disbursement</p>
                            <p className="text-4xl font-black leading-none tracking-tighter">₹{parseFloat(totalAmount).toFixed(2)}</p>
                            {billing.was_penalty_applied && (
                                <div className="mt-4 flex items-center gap-1.5 text-[8px] bg-[#161811] px-2 py-1.5 rounded-none inline-flex font-black uppercase tracking-widest text-[#89d006]">
                                    <span className="material-symbols-outlined text-[12px] font-bold">warning</span>
                                    Quality Penalty
                                </div>
                            )}
                        </div>
                        <div className="relative mt-8 space-y-3 pt-6 border-t border-[#161811]/10 uppercase tracking-widest text-[9px]">
                            <div className="flex justify-between">
                                <span className="opacity-60 font-black tracking-tight">Labor Fee</span>
                                <span className="font-black">₹{parseFloat(laborAmount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="opacity-60 font-black tracking-tight">Procurement</span>
                                <span className="font-black">₹{parseFloat(materialAmount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Left Details */}
                    <div className="space-y-6 flex flex-col">
                        <div className="bg-white rounded-none p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-10 rounded-none bg-[#f7f8f5] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#89d006] text-xl font-black">timer</span>
                                </div>
                                <span className="text-sm font-black text-[#161811] uppercase tracking-tighter">Verified Timesheet</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#fcfdfa] p-4 rounded-none">
                                    <p className="text-[9px] font-black text-[#7c8c5f] uppercase tracking-[0.2em] mb-1">Logged Hours</p>
                                    <p className="text-xl font-black text-[#161811] leading-none tracking-tight">{getSessionDuration(job.start_time, job.end_time)}</p>
                                </div>
                                <div className="bg-[#fcfdfa] p-4 rounded-none">
                                    <p className="text-[9px] font-black text-[#7c8c5f] uppercase tracking-[0.2em] mb-1">Agreed Rate</p>
                                    <p className="text-xl font-black text-[#161811] leading-none tracking-tight">₹{job.contract_hourly_rate || job.hourly_rate || ' N/A'}<span className="text-[10px] font-black text-[#7c8c5f] ml-0.5 uppercase">/hr</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-none p-6 shadow-sm flex-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-10 rounded-none bg-[#f7f8f5] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#89d006] text-xl font-black">fact_check</span>
                                </div>
                                <span className="text-sm font-black text-[#161811] uppercase tracking-tighter">Material Audit</span>
                            </div>
                            <p className="text-base text-[#161811] leading-tight font-bold opacity-80">
                                No vendor-specific material notes were documented for this disbursement. Detailed history is available in the platform master ledger.
                            </p>
                        </div>
                    </div>

                    {/* Right Column — Receipt */}
                    <div className="bg-white rounded-none p-6 shadow-sm flex flex-col h-[500px]"> 
                        
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-none bg-[#f7f8f5] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#89d006] text-xl font-black">receipt_long</span>
                                </div>
                                <span className="text-sm font-black text-[#161811] uppercase tracking-tighter">Vendor Evidence</span>
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
                                        alt="Receipt"
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
                                    <span className="material-symbols-outlined text-[60px] opacity-10">image_not_supported</span>
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 opacity-40">Bill Undefined</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-between items-center shrink-0 border-t border-[#f3f5f0] pt-6">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-[#7c8c5f] font-black uppercase tracking-widest mb-1">Evidence ID</span>
                                <span className="text-[10px] text-[#161811] font-black tracking-tight truncate max-w-[150px]">
                                    {billing.bill_image ? 'bill_receipt_audited.jpg' : '--'}
                                </span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-[9px] text-[#7c8c5f] font-black uppercase tracking-widest mb-1">Authority</span>
                                <span className="text-[10px] text-[#161811] font-black tracking-tight">
                                    {billing.bill_image ? 'HUSTLR_LEDGER' : '--'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}