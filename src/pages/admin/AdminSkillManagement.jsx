import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSkills, addSkill } from "../../redux/slice/adminSlice";
import AdminLoader from "../../components/admin/AdminLoader";

const AdminSkillManagement = () => {
  const dispatch = useDispatch();
  const { skills, loading, searchQuery } = useSelector((state) => state.admin);
  const [newSkill, setNewSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    setIsSubmitting(true);
    try {
      await dispatch(addSkill(newSkill.trim())).unwrap();
      setNewSkill("");
    } catch (err) {
      console.error("Failed to add skill:", err);
      alert(err.Message || "Failed to add skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !skills.length) {
    return <AdminLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Skill Management</h1>
          <p className="text-xs text-neutral-500 mt-1">Configure and expand the system's recognized expertise.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Skill Form */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 shadow-2xl">
            <h2 className="text-sm font-black text-white uppercase tracking-widest mb-4">Add New Skill</h2>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5 block">Skill Name</label>
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g. Cloud Architecture"
                  className="w-full bg-black border border-neutral-800 rounded-md py-3 px-4 text-sm text-white focus:ring-1 focus:ring-white transition-all placeholder:text-neutral-700 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !newSkill.trim()}
                className="w-full bg-white text-black py-3 rounded-md font-black text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-sm">add</span>
                )}
                Register Skill
              </button>
            </form>
          </div>
        </div>

        {/* Skills List */}
        <div className="lg:col-span-2">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg shadow-2xl overflow-hidden">
            <div className="px-8 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
              <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Active Skills Repository</h2>
              <span className="bg-white text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">
                {filteredSkills.length} Total
              </span>
            </div>
            
            <div className="overflow-y-auto max-h-[600px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-neutral-900/50">
                  <tr>
                    <th className="px-8 py-3 text-[9px] font-black uppercase tracking-widest text-neutral-600">Skill Name</th>
                    <th className="px-8 py-3 text-[9px] font-black uppercase tracking-widest text-neutral-600">ID</th>
                    <th className="px-8 py-3 text-[9px] font-black uppercase tracking-widest text-neutral-600 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                  {filteredSkills.length > 0 ? (
                    filteredSkills.map((skill) => (
                      <tr key={skill.id} className="hover:bg-neutral-800/20 transition-colors group">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
                            <span className="text-sm font-bold text-white tracking-tight">{skill.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-xs text-neutral-600 font-mono">SKL-{skill.id.toString().padStart(4, '0')}</td>
                        <td className="px-8 py-4 text-right">
                          <button className="text-neutral-600 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100">
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-8 py-20 text-center text-neutral-500 text-sm italic">
                        {searchQuery ? `No skills matching "${searchQuery}"` : "No skills registered in the system."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSkillManagement;
