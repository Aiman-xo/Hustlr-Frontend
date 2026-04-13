import React from "react";

const AdminLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 border-4 border-neutral-900 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-transparent border-t-white border-l-white rounded-full animate-spin"></div>
          <span className="material-symbols-outlined absolute text-white text-xl animate-pulse">
            auto_awesome
          </span>
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-white tracking-widest uppercase mb-1">
            Processing Data
          </p>
          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest animate-pulse">
            Establishing Secure Connection...
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoader;
