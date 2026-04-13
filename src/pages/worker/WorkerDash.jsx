import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FetchWorkerAnalytics } from '../../redux/slice/workerSlice'
import { 
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, Cell 
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const PRIMARY = "#8ad007";
const BG_COLOR = "#f7f8f5";

function WorkerDash() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { analytics, loading } = useSelector((state) => state.worker)

    useEffect(() => {
        dispatch(FetchWorkerAnalytics());
    }, [dispatch]);

    if (loading && !analytics) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f7f8f5]">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#8ad007]/20 border-t-[#8ad007]"></div>
            </div>
        );
    }

    if (!analytics) return null;

    const { summary, chart_data } = analytics;

    // --- DYNAMIC DATA TRANSFORMATION ---
    // Map backend chart_data to Recharts format and aggregate by date
    const dynamicChartData = (chart_data.labels || []).map((label, idx) => ({
        name: label, // YYYY-MM-DD
        revenue: chart_data.revenue_points[idx] || 0,
        labor: chart_data.labor_points[idx] || 0,
        count: 1 
    }));

    // Aggregate by label to handle multiple jobs on the same day
    const aggregatedData = Object.values(dynamicChartData.reduce((acc, curr) => {
        if (!acc[curr.name]) acc[curr.name] = { ...curr };
        else {
            acc[curr.name].revenue += curr.revenue;
            acc[curr.name].labor += curr.labor;
            acc[curr.name].count += 1;
        }
        return acc;
    }, {}));

    // Sort by date to ensure the timeline makes sense
    aggregatedData.sort((a, b) => new Date(a.name) - new Date(b.name));

    // For better visualization if data is sparse, ensure we have at least these points
    const displayData = aggregatedData.length > 0 ? aggregatedData : [{ name: 'No Data', revenue: 0, count: 0 }];

    return (
        <div className="min-h-screen p-8" style={{ background: BG_COLOR, fontFamily: "'Manrope', sans-serif" }}>
            {/* Top Toolbar */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-extrabold text-[#161811]">Worker Dashboard</h1>
                    <p className="mt-1 text-xs font-medium text-[#7c8c5f]">Track your performance and earnings overview.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-[#e2e6db] text-[#7c8c5f] hover:text-[#161811] transition-colors">
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                    </button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-[#e2e6db] text-[#7c8c5f] hover:text-[#161811] transition-colors">
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                    </button>
                </div>
            </div>

            {/* Summary Stats Grid */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Total Works Taken */}
                <div className="flex justify-between items-center rounded-xl bg-white p-6 shadow-sm border border-[#e2e6df] border-opacity-40">
                    <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#94a3b8]">Total Works Taken</p>
                        <h2 className="mt-1 text-2xl font-black text-[#161811]">{summary.job_count || 0}</h2>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8ad007]/10 text-[#8ad007]">
                        <span className="material-symbols-outlined font-bold text-[24px]">task_alt</span>
                    </div>
                </div>

                {/* Total Revenue */}
                <div className="flex justify-between items-center rounded-xl bg-white p-6 shadow-sm border border-[#e2e6df] border-opacity-40">
                    <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#94a3b8]">Total Revenue</p>
                        <h2 className="mt-1 text-2xl font-black text-[#161811]">₹ {Number(summary.total_revenue || 0).toLocaleString()}</h2>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8ad007]/10 text-[#8ad007]">
                        <span className="material-symbols-outlined font-bold text-[24px]">payments</span>
                    </div>
                </div>

                {/* Average Rating */}
                <div className="flex justify-between items-center rounded-xl bg-white p-6 shadow-sm border border-[#e2e6df] border-opacity-40">
                    <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#94a3b8]">Penalty Count</p>
                        <div className="mt-1 flex items-baseline gap-1">
                            <h2 className="text-2xl font-black text-[#161811]">{summary.penalty_count}</h2>
                        </div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8ad007]/10 text-[#8ad007]">
                        <span className="material-symbols-outlined font-bold text-[24px]">warning</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Bar Chart */}
                <div className="rounded-xl bg-white p-7 shadow-sm border border-[#e2e6df] border-opacity-40">
                    <div className="mb-8 flex items-center justify-between">
                        <h3 className="text-sm font-black text-[#161811]">Total Revenue Generated</h3>
                        <span className="rounded-md bg-[#f8fafc] px-3 py-1 text-[8px] font-black text-[#94a3b8]">Trend Breakdown</span>
                    </div>
                    <div className="h-[280px] w-100%">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={displayData}>
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                                    {displayData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PRIMARY} />
                                    ))}
                                </Bar>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} dy={10} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Works Taken Line Chart */}
                <div className="rounded-xl bg-white p-7 shadow-sm border border-[#e2e6df] border-opacity-40">
                    <div className="mb-8 flex items-center justify-between">
                        <h3 className="text-sm font-black text-[#161811]">Total Works Taken</h3>
                        <span className="rounded-md bg-[#f8fafc] px-3 py-1 text-[8px] font-black text-[#94a3b8]">Workload Timeline</span>
                    </div>
                    <div className="h-[280px] w-100%">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={displayData}>
                                <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} dy={10} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                                <Line 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke={PRIMARY} 
                                    strokeWidth={4} 
                                    dot={{ r: 4, fill: PRIMARY, strokeWidth: 0 }} 
                                    activeDot={{ r: 6, strokeWidth: 0 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-[#8ad007]"></div>
                            <span className="text-[10px] font-bold text-[#64748b]">Works Completed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Browse Jobs CTA Banner */}
            <div className="mt-8 relative overflow-hidden rounded-2xl bg-[#8ad007] p-8 md:p-12 text-white shadow-xl shadow-[#8ad007]/20">
                {/* Decorative background elements */}
                <div className="absolute top-[-20%] right-[-10%] h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-5%] h-32 w-32 rounded-full bg-black/5 blur-2xl"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="max-w-xl text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-black leading-tight">Ready for your next big opportunity?</h2>
                        <p className="mt-2 text-base font-medium opacity-90">Discover high-paying gigs tailored to your skills. Your next paycheck is just a click away.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/worker/job-feed')}
                        className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-black text-[#8ad007] transition-all hover:scale-105 active:scale-95 shadow-lg"
                    >
                        Browse Job Feed
                        <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </button>
                </div>

                {/* Background Icon Decoration */}
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 select-none pointer-events-none">
                    <span className="material-symbols-outlined text-[240px] font-thin">rocket_launch</span>
                </div>
            </div>
        </div>
    )
}

export default WorkerDash