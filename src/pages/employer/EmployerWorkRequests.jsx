

import { SeeJobRequests, CancelJobRequest, AcceptJobStart } from "../../redux/slice/employerSlice";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Spinner from "../publilc/Spinner";
import Timer from "../../components/Timer";

function RequestCard({ req }) {
  const { loading, error } = useSelector((state) => state.employer)
  const dispatch = useDispatch();
  const [isCancelling, setIsCancelling] = useState(false);
  const formattedDate = new Date(req.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleCancelRequest = async (jobId) => {
    setIsCancelling(true);
    try {
      const timer = new Promise((resolve) => setTimeout(resolve, 2000));

      // Dispatch the action AND wait for the timer simultaneously
      // This ensures the spinner stays for at least 2 seconds
      await Promise.all([
        dispatch(CancelJobRequest(jobId)).unwrap(),
        timer
      ]);
    } catch (error) {
      //no
    } finally {
      setIsCancelling(false); // Stop local spinner
    }


  }

  const [isAccepting, setIsAccepting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleAcceptStart = async (jobId) => {
    setIsAccepting(true);
    try {
      await dispatch(AcceptJobStart(jobId)).unwrap();
      dispatch(SeeJobRequests({ status: '', page: 1 }));
    } catch (err) {
      console.error("Accept start failed:", err);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleConfirmCancel = async () => {
    setShowCancelModal(false);
    await handleCancelRequest(req.id);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row relative">
      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div 
          className="absolute inset-0 z-50 bg-black/15 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-200"
          style={{ borderRadius: '1rem' }}
        >
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-red-500" style={{ fontSize: '24px' }}>warning</span>
          </div>
          <h4 className="text-sm font-extrabold text-gray-900 mb-2">Cancel Job Request?</h4>
          <p className="text-[11px] text-gray-500 mb-6 max-w-[200px]">
            Are you sure you want to cancel this request? This action cannot be undone.
          </p>
          <div className="flex gap-3 w-full max-w-[240px]">
            <button 
              onClick={() => setShowCancelModal(false)}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-[10px] transition-all cursor-pointer uppercase tracking-wider"
            >
              Go Back
            </button>
            <button 
              onClick={handleConfirmCancel}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-[10px] transition-all cursor-pointer uppercase tracking-wider shadow-lg shadow-red-200"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Image Panel */}
      <div className="w-full md:w-56 h-36 md:h-auto bg-gray-100 relative group flex-shrink-0 cursor-pointer">
        {req.project_image ? (
          <img
            src={req.project_image}
            alt="Project preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 min-h-[9rem]">
            <span className="material-symbols-outlined text-gray-300 text-4xl">
              image
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-3xl">
            zoom_in
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 flex flex-col">
        {/* Top Row */}
        <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
          {/* Worker info */}
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full bg-cover bg-center flex-shrink-0 flex items-center justify-center bg-gray-100"
              style={{
                backgroundImage: req.worker_profile_image ? `url(${req.worker_profile_image})` : 'none',
                outline: "2px solid rgba(138,208,7,0.15)",
              }}
            >
              {!req.worker_profile_image && (
                <span className="material-symbols-outlined text-gray-400" style={{ fontSize: "24px" }}>
                  person
                </span>
              )}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900 leading-tight">
                {req.worker_name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <div
                  className="flex items-center gap-1 text-xs font-bold"
                  style={{ color: "#8ad007" }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "13px",
                      fontVariationSettings: "'FILL' 1",
                      color: "#8ad007",
                    }}
                  >
                    star
                  </span>
                  <span>{req.rating}</span>
                </div>
                <span className="text-gray-300 text-xs">|</span>
                <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                  <span
                    className="material-symbols-outlined text-gray-400"
                    style={{ fontSize: "16px" }}
                  >
                    payments
                  </span>
                  <span>
                    ₹{req.hourly_rate}
                    <span className="text-gray-500 font-medium ml-0.5">/hr</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status + sent time */}
          <div className="flex flex-col items-end gap-1.5">
            <span
              className="px-3 py-1 text-xs font-bold rounded-full border"
              style={{
                backgroundColor: "rgba(138,208,7,0.1)",
                color: "#8ad007",
                borderColor: "rgba(138,208,7,0.25)",
              }}
            >
              {req.status}
            </span>
            <div className="flex items-center gap-1 text-gray-400 text-[11px] font-medium">
              <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>
                calendar_today
              </span>
              <span>{formattedDate
              }</span>
            </div>

          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-gray-500">
            <span className="material-symbols-outlined text-gray-400" style={{ fontSize: "15px" }}>
              location_on
            </span>
            <span className="text-xs font-semibold">{req.city}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <span className="material-symbols-outlined text-gray-400" style={{ fontSize: "15px" }}>payments</span>
            <span className="text-xs font-semibold">Base Pay: </span>
            <span className="text-xs font-bold text-gray-600">₹{req.base_pay}</span>
          </div>
          <div>
            <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Job Description
            </h4>
            <p className="text-gray-500 leading-relaxed text-xs break-words whitespace-pre-wrap">
              {req.description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
          {req.status === 'pending' ? (
            <button
              disabled={isCancelling}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 
                      ${isCancelling
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-red-500 hover:text-white text-gray-700 cursor-pointer"}`}
              onClick={() => setShowCancelModal(true)}
            >
              {isCancelling ? (
                <>
                  <Spinner />
                  Cancelling...
                </>
              ) : (
                "Cancel Request"
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2 font-bold text-xs">
              {req.status === 'cancelled' ? (
                <>
                  <span className="material-symbols-outlined text-sm text-red-500">cancel</span>
                  <span className="text-red-500">Request Cancelled</span>
                </>
              ) : req.status === 'accepted' ? (
                <>
                  <span className="material-symbols-outlined text-sm text-green-600">check_circle</span>
                  <span className="text-green-600">Request Accepted</span>
                </>
              ) : req.status === 'starting' ? (
                <button
                  disabled={isAccepting}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 
                          ${isAccepting
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-[#8ad007] text-white hover:bg-[#7ab806] cursor-pointer"}`}
                  onClick={() => handleAcceptStart(req.id)}
                >
                  {isAccepting ? <Spinner /> : <span className="material-symbols-outlined text-sm">play_arrow</span>}
                  {isAccepting ? "Accepting..." : "Accept Start"}
                </button>
              ) : req.status === 'in_progress' ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-[#8ad007]">
                    <span className="material-symbols-outlined text-sm animate-pulse">sync</span>
                    In Progress
                  </div>
                  <Timer startTime={req.start_time} isActive={req.is_timer_active} />
                </div>
              ) : req.status === 'completed' ? (
                <>
                  <span className="material-symbols-outlined text-sm text-[#8ad007]">task_alt</span>
                  <span className="text-[#8ad007]">Job Completed & Billed</span>
                </>
              ) : (
                /* Fallback for other statuses */
                <span className="text-gray-400">Status: {req.status}</span>
              )}
            </div>
          )}
          <button
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all hover:text-white"
            style={{ backgroundColor: "rgba(138,208,7,0.1)", color: "#8ad007" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#8ad007";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(138,208,7,0.1)";
              e.currentTarget.style.color = "#8ad007";
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}
            >
              chat_bubble
            </span>
          </button>

        </div>
        {(error) && (
          <p className="mt-2 text-[9px] text-red-500 text-center font-bold uppercase">{error}</p>
        )}
      </div>
    </div>
  );
}

export default function WorkRequests() {
  const [localError, setLocalError] = useState('')
  const dispatch = useDispatch()
  const { allJobRequests, totalCount, hasNext, hasPrevious } = useSelector((state) => state.employer)
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStatus, setCurrentStatus] = useState('');


  useEffect(() => {
    dispatch(SeeJobRequests({ status: currentStatus, page: currentPage }))
  }, [dispatch, currentPage, currentStatus])

  // Calculate pagination numbers
  const itemsPerPage = 5; // Adjust this to match your backend pagination limit
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalCount);

  const handleFilterChange = (status) => {
    setCurrentStatus(status);
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // Optional: scroll to top
  };

  useEffect(() => {
    if (allJobRequests) {
      console.log(allJobRequests);
    }
  }, [dispatch, allJobRequests])


  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Page Header */}
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Work Requests
          </h2>
          <p className="text-gray-400 mt-1 text-xs">
            Manage your outgoing job requests and invitations.
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { label: 'All Requests', value: '' },
            { label: 'Pending', value: 'pending' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'Accepted', value: 'accepted' },
            { label: 'Starting', value: 'starting' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Completed', value: 'completed' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleFilterChange(tab.value)}
              className="px-3 py-1.5 border rounded-lg font-bold text-[10px] shadow-sm transition-all cursor-pointer"
              style={{
                // Use your primary greenish color when active
                backgroundColor: currentStatus === tab.value ? "#8ad007" : "white",
                color: currentStatus === tab.value ? "white" : "#94a3b8", // gray-400
                borderColor: currentStatus === tab.value ? "#8ad007" : "#e5e7eb" // gray-200
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Request Cards or Empty State */}
      <div className="space-y-4">
        {allJobRequests.length > 0 ? (
          // Map the cards if data exists
          allJobRequests.map((req) => (
            <RequestCard key={req.id} req={req} />
          ))
        ) : (
          // Show this if no requests are found
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2  border-gray-200">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "rgba(138,208,7,0.1)" }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "#8ad007", fontSize: "32px" }}
              >
                folder_open
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">No {currentStatus} requests</h3>
            <p className="text-gray-500 text-sm mt-1">
              {currentStatus
                ? `You don't have any requests marked as ${currentStatus} at the moment.`
                : "You haven't sent any work requests yet."}
            </p>
            {currentStatus && (
              <button
                onClick={() => handleFilterChange('')}
                className="mt-6 text-xs font-bold underline cursor-pointer"
                style={{ color: "#8ad007" }}
              >
                View all requests
              </button>
            )}
          </div>
        )}
      </div>

      {allJobRequests.length > 0 && (
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between border-t border-gray-100 pt-6 gap-4">
          <div className="text-xs font-medium text-gray-500 order-2 md:order-1">
            <div className="text-xs font-medium text-gray-500 order-2 md:order-1">
              Showing <span className="text-gray-900 font-bold">{endIndex}</span> of <span className="text-gray-900 font-bold">{totalCount}</span> requests
            </div>
          </div>

          <div className="flex gap-2 order-1 md:order-2">
            {/* Previous Button */}
            <button
              className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-xs shadow-sm hover:bg-gray-50 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrevious}
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
              Previous
            </button>

            {/* Next Button */}
            <button
              className="flex items-center gap-1 px-4 py-2 border rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
              style={{
                backgroundColor: hasNext ? "#8ad007" : "white",
                color: hasNext ? "white" : "#cbd5e1",
                borderColor: hasNext ? "#8ad007" : "#e2e8f0"
              }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext}
            >
              Next
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      )}



    </div>
  );
}