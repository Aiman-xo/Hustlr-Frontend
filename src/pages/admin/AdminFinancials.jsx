import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFinancials } from "../../redux/slice/adminSlice";
import AdminLoader from "../../components/admin/AdminLoader";

const AdminFinancials = () => {
  const dispatch = useDispatch();
  const { financials, loading, searchQuery } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchFinancials());
  }, [dispatch]);

  if (loading && !financials.length) {
    return <AdminLoader />;
  }

  const filteredFinancials = financials.filter(bill => 
    bill.employer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bill.worker_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {filteredFinancials.length > 0 ? (
                filteredFinancials.map((bill) => (
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
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                        bill.status === 'completed' ? 'text-white border-white bg-white/5' : 'text-neutral-500 border-neutral-800'
                      }`}>
                        {bill.status}
                      </span>
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
    </div>
  );
};

export default AdminFinancials;
