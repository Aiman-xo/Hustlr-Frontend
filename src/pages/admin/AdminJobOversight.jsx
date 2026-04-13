import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../../redux/slice/adminSlice";
import AdminLoader from "../../components/admin/AdminLoader";


const AdminJobOversight = () => {
  const dispatch = useDispatch();
  const { jobs, jobsPagination, loading, searchQuery } = useSelector((state) => state.admin);
  const [activeStatus, setActiveStatus] = React.useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
        dispatch(fetchJobs({ 
            page: 1, 
            status: activeStatus === "all" ? "" : activeStatus,
            search: searchQuery
        }));
    }, 300);
    return () => clearTimeout(timer);
  }, [dispatch, activeStatus, searchQuery]);

  if (loading && !jobs.length) {
    return <AdminLoader />;
  }

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= jobsPagination.totalPages) {
      dispatch(fetchJobs({ 
        page: newPage, 
        status: activeStatus === "all" ? "" : activeStatus,
        search: searchQuery
      }));
    }
  };

  const statusOptions = [
    { id: "all", label: "All Contracts" },
    { id: "pending", label: "Pending" },
    { id: "in_progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
    { id: "cancelled_or_rejected", label: "Terminated" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Job Oversight</h1>
          <p className="text-xs text-neutral-500 mt-1">Monitor all active and historical platform contracts.</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap bg-neutral-900/50 border border-neutral-800 p-1 rounded-lg self-start">
          {statusOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveStatus(opt.id)}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-tight transition-all rounded ${
                activeStatus === opt.id ? "bg-white text-black" : "text-neutral-500 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <section className="bg-neutral-900/50 border border-neutral-800 rounded-lg shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-900 border-b border-neutral-800">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Job Details</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Contractors</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Budget/Rate</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {jobs?.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-neutral-800/10 transition-colors group text-sm">
                    <td className="px-8 py-5">
                      <span className="block font-bold text-white leading-tight truncate max-w-xs">{job.description}</span>
                      <span className="text-[10px] text-neutral-600 uppercase font-mono tracking-tighter">REF-{job.id.toString().padStart(6, '0')}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-neutral-300 font-medium lowercase">@host:{job.employer_company}</span>
                        <span className="text-neutral-500 text-xs">@worker:{job.worker_name || "Unassigned"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border w-fit ${
                          job.status === 'completed' ? 'text-green-500 border-green-500' :
                          job.status === 'in_progress' ? 'text-blue-500 border-blue-500' :
                          'text-neutral-500 border-neutral-800'
                        }`}>
                          {job.status}
                        </span>
                        {job.status === 'completed' && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border w-fit ${
                            job.is_paid ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                          }`}>
                            {job.is_paid ? 'PAID' : 'UNPAID'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 font-mono text-white">
                      ₹{job.contract_hourly_rate || 0}/hr
                    </td>
                    <td className="px-8 py-5 text-neutral-500 text-xs font-medium">
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-neutral-500 text-sm italic">
                    No matching jobs found in current oversight.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pagination Controls */}
      {jobsPagination?.totalPages > 1 && (
        <div className="flex items-center justify-between bg-neutral-900/50 border border-neutral-800 p-4 rounded-lg">
          <p className="text-xs text-neutral-500 font-medium">
            Showing Page <span className="text-white font-bold">{jobsPagination.currentPage}</span> of{" "}
            <span className="text-white font-bold">{jobsPagination.totalPages}</span>
            <span className="ml-2">({jobsPagination.totalCount} total records)</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(jobsPagination.currentPage - 1)}
              disabled={jobsPagination.currentPage === 1 || loading}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded transition-all ${
                jobsPagination.currentPage === 1 || loading
                  ? "bg-neutral-900 text-neutral-700 cursor-not-allowed border border-neutral-800"
                  : "bg-white text-black hover:bg-neutral-200"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(jobsPagination.currentPage + 1)}
              disabled={jobsPagination.currentPage === jobsPagination.totalPages || loading}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded transition-all ${
                jobsPagination.currentPage === jobsPagination.totalPages || loading
                  ? "bg-neutral-900 text-neutral-700 cursor-not-allowed border border-neutral-800"
                  : "bg-white text-black hover:bg-neutral-200"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobOversight;
