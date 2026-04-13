import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFinancials } from "../../redux/slice/adminSlice";
import AdminLoader from "../../components/admin/AdminLoader";

const AdminFinancials = () => {
  const dispatch = useDispatch();
  const { financials, financialsPagination, loading, searchQuery } = useSelector((state) => state.admin);

  useEffect(() => {
    const timer = setTimeout(() => {
        dispatch(fetchFinancials({ page: 1, search: searchQuery }));
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [dispatch, searchQuery]);

  if (loading && !financials.length) {
    return <AdminLoader />;
  }

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= financialsPagination.totalPages) {
      dispatch(fetchFinancials({ page: newPage, search: searchQuery }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Financial Analytics</h1>
          <p className="text-xs text-neutral-500 mt-1">Audit platform revenue and distribution cycles.</p>
        </div>
      </div>

      <section className="bg-neutral-900/50 border border-neutral-800 rounded-lg shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-900 border-b border-neutral-800">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Transaction ID</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Participants</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Job Reference</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Value (INR)</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {financials.length > 0 ? (
                financials.map((bill) => (
                  <tr key={bill.id} className="hover:bg-neutral-800/10 transition-colors text-sm">
                    <td className="px-8 py-5">
                      <span className="block font-mono text-[10px] text-neutral-500">TXN-{bill.id.toString().padStart(8, '0')}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-green-500 leading-tight font-medium">To: {bill.worker_name}</span>
                        <span className="text-red-500 leading-tight font-medium text-xs font-mono opacity-60">From: {bill.employer_name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-neutral-300 font-medium">Job #{bill.job_id}</span>
                    </td>
                    <td className="px-8 py-5 font-black text-white text-lg">
                      ₹{parseFloat(bill.total_amount).toLocaleString()}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border w-fit ${
                          bill.status === 'completed' ? 'text-white border-white bg-white/5' : 'text-neutral-500 border-neutral-800'
                        }`}>
                          {bill.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border w-fit ${
                          bill.is_paid ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                        }`}>
                          {bill.is_paid ? 'PAID' : 'UNPAID'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-neutral-500 text-sm italic">
                    No financial data recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pagination Controls */}
      {financialsPagination?.totalPages > 1 && (
        <div className="flex items-center justify-between bg-neutral-900/50 border border-neutral-800 p-4 rounded-lg">
          <p className="text-xs text-neutral-500 font-medium">
            Showing Page <span className="text-white font-bold">{financialsPagination.currentPage}</span> of{" "}
            <span className="text-white font-bold">{financialsPagination.totalPages}</span>
            <span className="ml-2">({financialsPagination.totalCount} total records)</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(financialsPagination.currentPage - 1)}
              disabled={financialsPagination.currentPage === 1 || loading}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded transition-all ${
                financialsPagination.currentPage === 1 || loading
                  ? "bg-neutral-900 text-neutral-700 cursor-not-allowed border border-neutral-800"
                  : "bg-white text-black hover:bg-neutral-200"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(financialsPagination.currentPage + 1)}
              disabled={financialsPagination.currentPage === financialsPagination.totalPages || loading}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded transition-all ${
                financialsPagination.currentPage === financialsPagination.totalPages || loading
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

export default AdminFinancials;
