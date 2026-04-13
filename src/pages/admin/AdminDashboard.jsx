import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../redux/slice/adminSlice";
import AdminLoader from "../../components/admin/AdminLoader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading && !stats) {
    return <AdminLoader />;
  }

  const chartData = {
    labels: stats?.growth_stats?.labels || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Daily Registrations",
        data: stats?.growth_stats?.counts || [0, 0, 0, 0, 0, 0, 0],
        fill: true,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderColor: "#ffffff",
        borderWidth: 2,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#000000",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#000000",
        titleFont: { size: 10, weight: "bold" },
        bodyFont: { size: 12 },
        padding: 12,
        borderColor: "#333333",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#1a1a1a" },
        ticks: { color: "#666666", font: { size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#666666", font: { size: 10 } },
      },
    },
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Console.Stats</h1>
          <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-2">Real-time platform intelligence</p>
        </div>
        <div className="flex gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] text-neutral-400 font-black uppercase">Live System</span>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Gross Billing", value: `₹${stats?.financials?.total_platform_billing.toLocaleString() || 0}`, icon: "payments", trend: "+12%" },
          { label: "Active Nodes", value: stats?.users?.total_active || 0, icon: "analytics", trend: "Stable" },
          { label: "Total Workforce", value: stats?.users?.total_workers || 0, icon: "engineering", trend: "+5%" },
          { label: "Job Requests", value: stats?.jobs?.active || 0, icon: "assignment", trend: "High" },
        ].map((item, i) => (
          <div key={i} className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-lg hover:border-neutral-700 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-neutral-500 group-hover:text-white transition-colors">
                {item.icon}
              </span>
              <span className="text-[10px] font-black text-white px-2 py-0.5 bg-neutral-800 rounded">{item.trend}</span>
            </div>
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{item.label}</h3>
            <p className="text-3xl font-black text-white mt-1 tracking-tighter">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 p-8 rounded-lg">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Platform Traction <span className="text-neutral-600 ml-2">/ Last 7 Days</span></h2>
            <div className="flex gap-4">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-white rounded-sm"></span>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">Growth</span>
                </div>
            </div>
          </div>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Quick Audit */}
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-lg">
          <h2 className="text-sm font-black uppercase tracking-widest text-white mb-8 text-center">System Health</h2>
          <div className="space-y-6">
            {[
              { label: "Pending Jobs", count: stats?.jobs?.pending || 0, color: "bg-yellow-500" },
              { label: "Completed Success", count: stats?.jobs?.completed || 0, color: "bg-white" },
              { label: "Suspended Accounts", count: stats?.users?.total_blocked || 0, color: "bg-red-500" },
              { label: "Open Postings", count: stats?.jobs?.total_job_posts || 0, color: "bg-blue-500" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-8 ${stat.color}`}></div>
                  <span className="text-xs font-bold text-neutral-400 group-hover:text-white transition-colors">{stat.label}</span>
                </div>
                <span className="text-xl font-black text-white">{stat.count}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 border border-neutral-800 rounded text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
