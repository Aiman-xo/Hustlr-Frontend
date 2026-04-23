import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

/**
 * EmployerPayments - Premium Light-Only Design.
 */
export default function EmployerPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const resp = await api.get('payment-history/');
                setPayments(resp.data);
                
            } catch (err) {
                console.error("Failed to fetch payment history:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    console.log(payments);

    const filteredPayments = payments.filter(p => 
        p.razorpay_payment_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.job.toString().includes(searchTerm)
    );

    const totalSpent = payments.reduce((acc, curr) => acc + parseFloat(curr.total_amount || 0), 0);

    return (
        <div className="flex-1 bg-[#f7f8f5] min-h-screen text-[#161811] font-['Manrope'] antialiased p-6">
            <div className="max-w-[1000px] mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-wrap justify-between items-end gap-4 mb-8 pl-1">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-black tracking-tight text-[#161811] uppercase leading-tight">Payments Ledger</h2>
                        <p className="text-[#7c8c5f] text-[11px] font-bold tracking-tight">Platform spending & transaction audit</p>
                    </div>
                </div>

                {/* Total Disbursed Card - Reference Style - Reduced */}
                <div className="bg-white rounded-none p-8 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="size-16 rounded-none bg-[#89d006]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#89d006] font-black text-3xl">account_balance_wallet</span>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Total Disbursed</p>
                            <h1 className="text-[#161811] text-4xl font-black leading-none tracking-tighter">₹{totalSpent.toFixed(2)}</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="bg-[#89d006]/10 text-[#89d006] text-[9px] font-black px-2 py-0.5 rounded-none uppercase tracking-widest">Active Payroll</span>
                                <span className="text-gray-400 text-[10px] font-bold tracking-tight uppercase">Platform Verified</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-center gap-2 min-w-[180px] rounded-none h-11 px-6 bg-[#89d006] text-[#161811] text-xs font-black shadow-sm">
                            <span className="material-symbols-outlined text-base">analytics</span>
                            <span>FINANCIAL REPORT</span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards - Borderless - Reduced */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    <div className="bg-white p-6 rounded-none shadow-sm flex flex-col gap-4 transition-all hover:shadow-md">
                        <div className="flex justify-between items-start">
                            <div className="bg-[#f7f8f5] p-3 rounded-none">
                                <span className="material-symbols-outlined text-[#89d006] text-xl font-black">payments</span>
                            </div>
                            <span className="text-[#89d006] text-[8px] font-black bg-[#89d006]/10 px-2 py-0.5 uppercase tracking-widest">+12.5%</span>
                        </div>
                        <div>
                            <p className="text-[#7c8c5f] font-black text-[9px] uppercase tracking-[0.2em] mb-1">Monthly Velocity</p>
                            <p className="text-xl font-black text-[#161811] uppercase tracking-tighter">EXPEDITED</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-none shadow-sm flex flex-col gap-4 transition-all hover:shadow-md">
                        <div className="flex justify-between items-start">
                            <div className="bg-[#f7f8f5] p-3 rounded-none">
                                <span className="material-symbols-outlined text-amber-500 text-xl font-black">verified_user</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[#7c8c5f] font-black text-[9px] uppercase tracking-[0.2em] mb-1">Trust Rating</p>
                            <p className="text-xl font-black text-[#161811] uppercase tracking-tighter">VERIFIED PRO</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-none shadow-sm flex flex-col gap-4 transition-all hover:shadow-md text-[#161811]">
                        <div className="flex justify-between items-start">
                            <div className="bg-[#f7f8f5] p-3 rounded-none">
                                <span className="material-symbols-outlined text-[#89d006] text-xl font-black">security</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[#7c8c5f] font-black text-[9px] uppercase tracking-[0.2em] mb-1">Escrow Protection</p>
                            <p className="text-xl font-black uppercase tracking-tighter">FULLY ACTIVE</p>
                        </div>
                    </div>
                </div>

                {/* Main Table Card - Clean - Reduced */}
                <div className="bg-white rounded-none shadow-sm overflow-hidden mb-8">
                    <div className="p-6 border-b border-[#f3f5f0] flex flex-wrap justify-between items-center gap-4 bg-white">
                        <h3 className="text-sm font-black uppercase tracking-tight text-[#161811]">Transaction History</h3>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#161811] text-base font-black">search</span>
                            <input 
                                className="pl-10 pr-4 py-2 bg-[#f7f8f5] border-none rounded-none text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-[#89d006]/20 w-64 transition-all" 
                                placeholder="FILTER BY ID..." 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="p-1">
                        {loading ? (
                            <div className="py-12 text-center text-[10px] text-gray-400 font-black uppercase animate-pulse italic tracking-widest">Syncing platform ledger...</div>
                        ) : filteredPayments.length > 0 ? filteredPayments.map((pay, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 transition-all hover:bg-[#fcfdfa] border-b border-[#f3f5f0] last:border-0 group">
                                <div className="size-10 rounded-none bg-[#f7f8f5] flex items-center justify-center text-[#161811] group-hover:bg-[#89d006]/10 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="font-black text-sm tracking-tight text-[#161811]">#WORK-{pay.job}</span>
                                        <span className="px-1.5 py-0.5 rounded-none text-[8px] font-black uppercase tracking-widest bg-[#89d006]/10 text-[#89d006]">SUCCESS</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-[9px] font-bold uppercase tracking-widest">
                                        <span>{new Date(pay.paid_at).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span className="font-mono text-[#161811]/30">{pay.razorpay_payment_id || '--'}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-lg text-[#161811]">₹{parseFloat(pay.total_amount).toFixed(2)}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="py-12 text-center text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] italic">No settlements found in requested period</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
