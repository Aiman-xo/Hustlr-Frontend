import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchWorkerAnalytics } from "../../redux/slice/workerSlice";
import api from "../../api/axiosInstance";

/**
 * WorkerFinancials - Redesigned to match EmployerPayments premium light style.
 */
export default function WorkerFinancials() {
    const dispatch = useDispatch();
    const { analytics, loading: analyticsLoading } = useSelector((state) => state.worker);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    useEffect(() => {
        dispatch(FetchWorkerAnalytics());
        
        const fetchHistory = async () => {
            try {
                const resp = await api.get('worker-payment-history/');
                setHistory(resp.data);
            } catch (err) {
                console.error("Failed to fetch payout history:", err);
            } finally {
                setHistoryLoading(false);
            }
        };
        fetchHistory();
    }, [dispatch]);

    // Format data from DynamoDB
    const summary = analytics?.summary || { total_revenue: 0, job_count: 0, penalty_count: 0 };

    return (
        <div className="flex-1 bg-[#f7f8f5] min-h-screen text-[#161811] font-['Manrope'] antialiased p-6">
            <div className="max-w-[1000px] mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-wrap justify-between items-end gap-4 mb-8 pl-1">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-black tracking-tight text-[#161811] uppercase leading-tight">Earnings Ledger</h2>
                        <p className="text-[#7c8c5f] text-[11px] font-bold tracking-tight">Platform revenue & job performance summary</p>
                    </div>
                </div>

                {/* Main Balance Card - Reference Style - Reduced */}
                <div className="bg-white rounded-none p-8 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="size-16 rounded-none bg-[#89d006]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#89d006] font-black text-3xl">account_balance_wallet</span>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Available Balance</p>
                            <h1 className="text-[#161811] text-4xl font-black leading-none tracking-tighter">₹{parseFloat(summary.total_revenue).toFixed(2)}</h1>
                            {/* <div className="flex items-center gap-2 mt-2">
                                <div className="flex text-[#89d006]">
                                    {[1,2,3,4].map(i => <span key={i} className="material-symbols-outlined text-[14px] fill-current" style={{fontVariationSettings: "'FILL' 1"}}>star</span>)}
                                    <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 0"}}>star_half</span>
                                </div>
                                <span className="text-[#161811] font-black text-xs">4.8</span>
                                <span className="text-gray-400 text-[9px] font-bold tracking-tight">/ 5.0 RATING</span>
                            </div> */}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <button className="flex items-center justify-center gap-2 min-w-[180px] rounded-none h-11 px-6 bg-[#89d006] text-[#161811] text-xs font-black shadow-sm">
                            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
                            <span>TOTAL EARNED</span>
                        </button>
                        <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest">Next payout: Auto-cycle</p>
                    </div>
                </div>

                {/* Stats Grid - Reduced size */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                     <div className="bg-white p-6 rounded-none shadow-sm flex flex-col gap-4 transition-all hover:shadow-md">
                        <div className="flex justify-between items-start">
                            <div className="bg-[#f7f8f5] p-3 rounded-none">
                                <span className="material-symbols-outlined text-[#89d006] text-xl font-black">task_alt</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[#7c8c5f] font-black text-[9px] uppercase tracking-[0.2em] mb-1">Jobs Completed</p>
                            <p className="text-2xl font-black text-[#161811]">{summary.job_count}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-none shadow-sm flex flex-col gap-4 transition-all hover:shadow-md">
                        <div className="flex justify-between items-start">
                            <div className="bg-[#f7f8f5] p-3 rounded-none">
                                <span className="material-symbols-outlined text-amber-500 text-xl font-black">warning</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[#7c8c5f] font-black text-[9px] uppercase tracking-[0.2em] mb-1">Penalty Records</p>
                            <p className="text-2xl font-black text-[#161811]">{summary.penalty_count}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-none shadow-sm flex flex-col gap-4 transition-all hover:shadow-md">
                        <div className="flex justify-between items-start">
                            <div className="bg-[#f7f8f5] p-3 rounded-none">
                                <span className="material-symbols-outlined text-[#89d006] text-xl font-black">verified</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[#7c8c5f] font-black text-[9px] uppercase tracking-[0.2em] mb-1">Profile Status</p>
                            <p className="text-xl font-black text-[#161811] uppercase tracking-tighter">PRO VERIFIED</p>
                        </div>
                    </div>
                </div>

                {/* Transaction Ledger Table - Reduced details */}
                <div className="bg-white rounded-none shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-[#f3f5f0] flex flex-wrap justify-between items-center gap-3 bg-white">
                        <h3 className="text-sm font-black uppercase tracking-tight text-[#161811]">Recent Transactions</h3>
                    </div>

                    <div className="p-1">
                        {historyLoading ? (
                            <div className="py-12 text-center text-[10px] text-gray-400 font-black uppercase animate-pulse italic tracking-widest">Auditing transaction ledger...</div>
                        ) : history.length > 0 ? history.map((pay, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 transition-all hover:bg-[#fcfdfa] border-b border-[#f3f5f0] last:border-0 group">
                                <div className="size-10 rounded-none bg-[#f7f8f5] flex items-center justify-center text-[#161811] group-hover:bg-[#89d006]/10 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">payments</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="font-black text-sm tracking-tight text-[#161811]">#WORK-{pay.job}</span>
                                        <span className={`px-1.5 py-0.5 rounded-none text-[8px] font-black uppercase tracking-widest ${pay.was_penalty_applied ? 'bg-amber-100 text-amber-700' : 'bg-[#89d006]/10 text-[#89d006]'}`}>
                                            {pay.was_penalty_applied ? "Penalty" : "Verified"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-[9px] font-bold uppercase tracking-widest">
                                        <span>Bank Transfer</span>
                                        <span>•</span>
                                        <span>{new Date(pay.paid_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-lg text-[#161811]">₹{parseFloat(pay.total_amount).toFixed(2)}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="py-12 text-center text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] italic">No transaction records found on the ledger</div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center mt-8 mb-8">
                    <button className="px-6 py-2 border-2 border-[#f3f5f0] rounded-none text-[9px] font-black uppercase tracking-widest text-gray-400 hover:border-[#89d006] hover:text-[#161811] transition-all">
                        Load Historical Archives
                    </button>
                </div>

            </div>
        </div>
    );
}
