import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FetchInterestRequests, HandleInterestRequest } from '../../redux/slice/employerSlice';
import Spinner from '../publilc/Spinner';
import { toast } from 'react-toastify';

const PRIMARY = "#8ad007";

const EmployerReceivedRequestsPage = () => {
    const dispatch = useDispatch();
    const { interestRequests, interestLoading } = useSelector(state => state.employer);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReq, setSelectedReq] = useState(null);
    const [actionType, setActionType] = useState(null); // 'accepted' or 'rejected'

    useEffect(() => {
        dispatch(FetchInterestRequests());
    }, [dispatch]);

    const openModal = (req, type) => {
        setSelectedReq(req);
        setActionType(type);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedReq(null);
        setActionType(null);
    };

    const confirmAction = async () => {
        if (!selectedReq || !actionType) return;
        try {
            await dispatch(HandleInterestRequest({ requestId: selectedReq.id, status: actionType })).unwrap();
            toast.success(`Request ${actionType === 'accepted' ? 'accepted' : 'rejected'} successfully!`);
        } catch (err) {
            toast.error("Failed to process request.");
        } finally {
            closeModal();
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                        Received Requests
                    </h2>
                    <p className="text-gray-400 mt-1 text-xs">
                        Review and manage interests sent by workers for your job postings.
                    </p>
                </div>
                {interestRequests.length > 0 && (
                    <span className="bg-[#8ad007] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {interestRequests.length} Pending
                    </span>
                )}
            </header>

            {interestLoading && interestRequests.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : interestRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-[#8ad007]/10 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-[#8ad007] text-3xl">inbox</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Your Inbox is Empty</h3>
                    <p className="text-gray-500 text-sm mt-1">No new interests from workers at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {interestRequests.map((req) => (
                        <div 
                            key={req.id} 
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group"
                        >
                            {/* Card Content */}
                            <div className="p-5">
                                {/* Worker Header */}
                                <div className="flex items-center gap-4 mb-5">
                                    <div 
                                        className="w-14 h-14 rounded-full bg-cover bg-center border-2 border-[#8ad007]/20 group-hover:border-[#8ad007] transition-all"
                                        style={{ 
                                            backgroundImage: req.worker_profile_image 
                                                ? `url(${req.worker_profile_image})` 
                                                : 'none',
                                            backgroundColor: '#f1f5e9'
                                        }}
                                    >
                                        {!req.worker_profile_image && (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[#7c8c5f] text-2xl">person</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-extrabold text-[#161811] truncate">
                                            {req.worker_name}
                                        </h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                                            Interested Candidate
                                        </p>
                                    </div>
                                </div>

                                {/* Job Details Highlight */}
                                <div className="space-y-3 mb-6 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <div className="flex items-start gap-2 text-xs">
                                        <span className="material-symbols-outlined text-[#8ad007] text-[16px] mt-0.5">location_on</span>
                                        <div className="min-w-0">
                                            <span className="font-bold text-gray-700">{req.city}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 text-xs">
                                        <span className="material-symbols-outlined text-[#8ad007] text-[16px] mt-0.5">payments</span>
                                        <div className="min-w-0">
                                            <span className="font-bold text-gray-700">Hourly Rate: ₹{req.hourly_rate}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 relative">
                                    <button
                                        onClick={() => openModal(req, 'accepted')}
                                        className="flex-1 py-2.5 bg-[#8ad007] text-white text-xs font-bold rounded-xl hover:bg-[#8ad007]/90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => openModal(req, 'rejected')}
                                        className="flex-1 py-2.5 bg-white border border-gray-200 text-[#7c8c5f] text-xs font-bold rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-sm">cancel</span>
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Confirmation Modal */}
            {modalOpen && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 9999, padding: "20px"
                }}>
                    <div style={{
                        background: "#fff", padding: "32px", borderRadius: "24px", width: "100%", maxWidth: "400px",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.15)", textAlign: "center", animation: "slideUp 0.3s ease-out"
                    }}>
                        <div style={{ 
                            width: "64px", height: "64px", borderRadius: "50%", 
                            background: actionType === 'accepted' ? "#f0fdf4" : "#fef2f2", 
                            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" 
                        }}>
                            <span className="material-symbols-outlined" style={{ 
                                color: actionType === 'accepted' ? PRIMARY : "#ef4444", fontSize: "32px" 
                            }}>
                                {actionType === 'accepted' ? "handshake" : "person_off"}
                            </span>
                        </div>
                        <h3 style={{ fontSize: "20px", fontWeight: "900", color: "#161811", margin: "0 0 10px 0" }}>
                            {actionType === 'accepted' ? "Accept Interest?" : "Reject Interest?"}
                        </h3>
                        <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 28px 0", lineHeight: "1.6" }}>
                            Are you sure you want to {actionType === 'accepted' ? "accept" : "reject"} <strong>{selectedReq?.worker_name}</strong>'s request for this position?
                        </p>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button 
                                onClick={closeModal}
                                style={{
                                    flex: 1, padding: "12px", borderRadius: "14px", border: "1.5px solid #e5e7eb", background: "#fff",
                                    color: "#374151", fontWeight: "700", fontSize: "14px", cursor: "pointer", transition: "all 0.2s"
                                }}
                                className="hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmAction}
                                style={{
                                    flex: 1, padding: "12px", borderRadius: "14px", border: "none", 
                                    background: actionType === 'accepted' ? PRIMARY : "#ef4444",
                                    color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer", transition: "all 0.2s",
                                    boxShadow: actionType === 'accepted' 
                                        ? "0 4px 15px rgba(138,208,7,0.3)" 
                                        : "0 4px 15px rgba(239, 68, 68, 0.3)"
                                }}
                                className="hover:opacity-90 active:scale-95"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default EmployerReceivedRequestsPage;
