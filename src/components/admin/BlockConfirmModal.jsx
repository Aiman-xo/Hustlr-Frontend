import React from "react";

const BlockConfirmModal = ({ isOpen, onClose, onConfirm, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md p-8 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
            user?.is_active ? "bg-red-500/10 text-red-500" : "bg-white/10 text-white"
          }`}>
            <span className="material-symbols-outlined">
              {user?.is_active ? "person_off" : "person_check"}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase leading-none">
              {user?.is_active ? "Restrict Access" : "Restore Access"}
            </h2>
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1 block">Account Management</span>
          </div>
        </div>

        <p className="text-neutral-400 text-sm leading-relaxed mb-8">
          {user?.is_active ? (
            <>
              Are you sure you want to block <span className="font-bold text-white">@{user?.username}</span>? 
              This user will be immediately logged out and barred from accessing any platform services.
            </>
          ) : (
            <>
              Restore platform access for <span className="font-bold text-white">@{user?.username}</span>? 
              They will be able to login and resume activity instantly.
            </>
          )}
        </p>

        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-all bg-neutral-900 border border-neutral-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
              user?.is_active ? "bg-red-600 text-white hover:bg-red-700" : "bg-white text-black hover:bg-neutral-200"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockConfirmModal;
