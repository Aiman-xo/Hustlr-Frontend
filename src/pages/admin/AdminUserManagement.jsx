import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkers, fetchEmployers, toggleWorkerBlock, toggleEmployerBlock } from "../../redux/slice/adminSlice";
import BlockConfirmModal from "../../components/admin/BlockConfirmModal";
import AdminLoader from "../../components/admin/AdminLoader";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { workers, employers, loading, searchQuery } = useSelector((state) => state.admin);
  const [activeTab, setActiveTab] = useState("workers");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchWorkers());
    dispatch(fetchEmployers());
  }, [dispatch]);

  if (loading && !workers.length && !employers.length) {
    return <AdminLoader />;
  }

  // Handle Modal Trigger
  const openBlockModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (activeTab === "workers") {
      dispatch(toggleWorkerBlock(selectedUser.id));
    } else {
      dispatch(toggleEmployerBlock(selectedUser.id));
    }
    setIsModalOpen(false);
  };

  const currentData = activeTab === "workers" ? workers : employers;
  
  // Search Filter
  const filteredData = currentData.filter(user => 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.company_name && user.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    user.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">User Management</h1>
          <p className="text-xs text-neutral-500 mt-1">Manage and audit across the platform's user base.</p>
        </div>
        <div className="flex bg-neutral-900/50 border border-neutral-800 p-1 rounded-lg self-start">
          <button
            onClick={() => setActiveTab("workers")}
            className={`px-6 py-2 text-xs font-bold uppercase transition-all rounded ${
              activeTab === "workers" ? "bg-white text-black" : "text-neutral-500 hover:text-white"
            }`}
          >
            Workers
          </button>
          <button
            onClick={() => setActiveTab("employers")}
            className={`px-6 py-2 text-xs font-bold uppercase transition-all rounded ${
              activeTab === "employers" ? "bg-white text-black" : "text-neutral-500 hover:text-white"
            }`}
          >
            Employers
          </button>
        </div>
      </div>

      {/* Table Section */}
      <section className="bg-neutral-900/50 border border-neutral-800 rounded-lg shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-900 border-b border-neutral-800">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Identity</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Location</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Platform ID</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {filteredData.length > 0 ? (
                filteredData.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-800/10 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center bg-neutral-900 text-xs font-bold overflow-hidden">
                          {user.profile_pic ? (
                            <img src={user.profile_pic} alt={user.username} className="w-full h-full object-cover" />
                          ) : (
                            user.username?.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-white leading-tight">{user.company_name || user.username}</span>
                          <span className="text-[10px] text-neutral-500 font-medium uppercase">{user.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-neutral-300">{user.city || "Not Specified"}</td>
                    <td className="px-8 py-5 text-xs text-neutral-600 font-mono">PNL-{user.id.toString().padStart(5, '0')}</td>
                    <td className="px-8 py-5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          user.is_active ? "text-white border border-white" : "text-red-500 border border-red-500"
                        }`}
                      >
                        {user.is_active ? "Verified" : "Blocked"}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <button 
                        onClick={() => openBlockModal(user)}
                        className={`px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-tight transition-all ${
                            user.is_active ? "text-red-500 hover:bg-neutral-800 border border-neutral-800" : "text-white bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {user.is_active ? "Block User" : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-neutral-500 text-sm italic">
                    No users matching "{searchQuery}" in this context.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Global Modals */}
      <BlockConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmAction} 
        user={selectedUser} 
      />
    </div>
  );
};

export default UserManagement;
