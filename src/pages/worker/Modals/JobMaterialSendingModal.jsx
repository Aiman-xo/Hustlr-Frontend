import React, { useState, useEffect } from 'react';

const MaterialModal = ({ isOpen, onClose, onConfirm, jobId, primary = "#8ad007",isLoading}) => {
  const [draftItems, setDraftItems] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setDraftItems([]);
      setInputValue("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (!inputValue.trim()) return;
    setDraftItems([...draftItems, { job: jobId, item_description: inputValue.trim() }]);
    setInputValue("");
  };

  const handleRemoveItem = (index) => {
    setDraftItems(draftItems.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4 font-['Manrope']">
      {/* Modal Card - Reduced Width and Padding */}
      <div className="bg-white w-full max-w-sm rounded-xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Modal Header - Compact */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex-shrink-0">
              <svg className="w-full h-full" viewBox="0 0 400 400">
                <rect fill={primary} height="300" rx="60" width="300" x="50" y="50"></rect>
                <g transform="translate(200, 200)">
                  <circle cx="0" cy="0" fill="#ffffff" r="15"></circle>
                  <rect fill="#ffffff" height="50" rx="8" width="16" x="-8" y="-65"></rect>
                  <rect fill="#ffffff" height="50" rx="8" width="16" x="-8" y="15"></rect>
                  <rect fill="#ffffff" height="16" rx="8" width="50" x="-65" y="-8"></rect>
                  <rect fill="#ffffff" height="16" rx="8" width="50" x="15" y="-8"></rect>
                </g>
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Add Materials</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Job {jobId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          <div className="flex gap-2 mb-4">
            <input 
              autoFocus
              className="flex-1 rounded-lg border border-slate-200 focus:border-[#8ad007] text-xs p-2.5 transition-all outline-none" 
              placeholder="e.g. PVC Pipe, Cement..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
            />
            <button 
              onClick={handleAddItem}
              style={{ backgroundColor: `${primary}15`, color: primary, borderColor: `${primary}30` }}
              className="px-3 rounded-lg text-xs font-bold transition-all border"
            >
              Add
            </button>
          </div>

          {/* List Area - Smaller height */}
          <div className="bg-slate-50 rounded-lg border border-slate-100 min-h-[80px] max-h-[160px] overflow-y-auto p-1.5">
            {draftItems.length === 0 ? (
              <div className="h-[70px] flex items-center justify-center text-slate-400 text-[11px] italic">
                No items added.
              </div>
            ) : (
              <div className="space-y-1">
                {draftItems.map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded-md shadow-sm border border-slate-100 gap-2">
                    <span className="text-slate-700 text-xs font-medium break-words whitespace-pre-wrap flex-1">{item.item_description}</span>
                    <button onClick={() => handleRemoveItem(idx)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer - Compact */}
        <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-2">
          <button 
            onClick={onClose}
            className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={draftItems.length === 0 || isLoading}
            onClick={() => onConfirm(draftItems)}
            style={{ 
              backgroundColor: draftItems.length > 0 && !isLoading ? primary : '#e2e8f0',
              cursor: draftItems.length > 0 && !isLoading ? 'pointer' : 'not-allowed'
            }}
            className="flex-[1.5] text-white text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 min-h-[40px]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">send</span>
                <span>Send ({draftItems.length})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialModal;