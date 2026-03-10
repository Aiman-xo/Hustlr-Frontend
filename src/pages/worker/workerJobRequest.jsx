import { useEffect, useState } from "react";
import { FetchJobInbox, JobRequestHandle } from "../../redux/slice/workerSlice";
import { useSelector, useDispatch } from "react-redux";
import JobDetailsModal from "./Modals/JobRequestSeeMoreModal";

const PRIMARY = "#8ad007";

export default function WorkerRequests() {
  const dispatch = useDispatch();
  const { jobInbox, updatedJobInbox } = useSelector((state) => state.worker);

  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Accepted", "Declined"];

  const filteredRequests = (jobInbox || [])
    .map((job, index) => {
      const isUpdated = updatedJobInbox && updatedJobInbox.id === job.id;
      const currentJob = isUpdated ? updatedJobInbox : job;

      return {
        id: job.id,
        client: currentJob.employer_name || `Employer #${currentJob.employer}`,
        avatar: currentJob.employer_profile_image || null,
        title: "Job Request",
        description: currentJob.description,
        location: currentJob.city,
        status: currentJob.status, 
        originalJob: currentJob,
      };
    })
    .filter((r) => {
      if (activeTab === "All") return true;
      if (activeTab === "Accepted") return r.status === "accepted";
      if (activeTab === "Declined") return r.status === "rejected";
      return true;
    });

  useEffect(() => {
    dispatch(FetchJobInbox());
  }, [dispatch]);

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", padding: "36px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>Requests</h1>
        <p style={{ color: "#71717a", fontSize: 12, marginTop: 3 }}>Review and manage your incoming job opportunities.</p>
      </div>

      <div style={{ display: "flex", gap: 5, background: "#f4f4f5", borderRadius: 10, padding: 5, width: "fit-content", marginBottom: 20 }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "7px 18px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12,
              fontWeight: 700, background: activeTab === tab ? PRIMARY : "transparent",
              color: activeTab === tab ? "#fff" : "#71717a",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filteredRequests.length === 0 ? (
          <div style={{ textAlign: "center", padding: "44px 0", color: "#a1a1aa", fontSize: 13 }}>No requests in this category.</div>
        ) : (
          filteredRequests.map((req) => (
            <RequestCard key={req.id} req={req} jobData={req.originalJob} status={req.status} />
          ))
        )}
      </div>
    </div>
  );
}

function RequestCard({ req, jobData, status }) {
  const dispatch = useDispatch();
  const [openDetails, setOpenDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ show: false, type: null });

  const isPending = !status || status === "" || status === "pending";

  const triggerAction = () => {
    const actionType = confirmModal.type;
    setConfirmModal({ show: false, type: null });
    setIsProcessing(true);

    setTimeout(() => {
      dispatch(JobRequestHandle({ jobRequestId: req.id, action: actionType === 'accept' ? 'accept' : 'reject' }));
      setIsProcessing(false);
    }, 1000);
  };

  const badge =
    status === "accepted" ? { bg: "rgba(138,208,7,0.12)", color: "#5a9200", label: "Accepted" } :
    status === "rejected" ? { bg: "#fef2f2", color: "#ef4444", label: "Declined" } :
    { bg: "#fff7ed", color: "#ea580c", label: "Pending" };

  return (
    <>
      <div style={{ background: "#fff", borderRadius: 18, padding: "20px 22px", border: "1px solid #f4f4f5", display: "flex", gap: 18, position: "relative" }}>
        <div style={{ position: "absolute", top: 16, right: 16, background: badge.bg, color: badge.color, fontSize: 9, fontWeight: 800, padding: "4px 10px", borderRadius: 99 }}>
          {badge.label}
        </div>

        <div style={{ width: 50, height: 50, borderRadius: 12, background: "#f4f4f5", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {req.avatar ? <img src={req.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span className="material-symbols-outlined" style={{ color: "#a1a1aa" }}>person</span>}
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#a1a1aa", marginBottom: 4 }}>{req.client}</p>
          <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 6px" }}>{req.title}</h3>
          <p style={{ color: "#71717a", fontSize: 12, marginBottom: 10 }}>{req.description}</p>
          
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#52525b", marginBottom: 14 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>{req.location}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              {isProcessing ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: PRIMARY, fontSize: 12, fontWeight: 700 }}>
                   <div className="spinner" style={{ width: 16, height: 16, border: `2px solid ${PRIMARY}`, borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
                   Processing...
                </div>
              ) : isPending ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setConfirmModal({ show: true, type: 'accept' })} style={{ padding: "8px 22px", background: PRIMARY, border: "none", borderRadius: 9, fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Accept</button>
                  <button onClick={() => setConfirmModal({ show: true, type: 'reject' })} style={{ padding: "8px 22px", background: "#fff", border: `1.5px solid ${PRIMARY}`, borderRadius: 9, fontSize: 12, fontWeight: 700, color: PRIMARY, cursor: "pointer" }}>Decline</button>
                </div>
              ) : (
                <div style={{ color: status === 'accepted' ? "#5a9200" : "#ef4444", fontWeight: 700, fontSize: 12 }}>
                  {status === 'accepted' ? "✓ You accepted this job" : "✕ You declined this job"}
                </div>
              )}
            </div>

            <button onClick={() => setOpenDetails(true)} style={{ background: "transparent", border: "none", color: PRIMARY, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              See More <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Aesthetic Glass Modal */}
      {confirmModal.show && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '24px', borderRadius: '24px', width: '320px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800 }}>Are you sure?</h4>
            <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#71717a' }}>Do you really want to {confirmModal.type} this request?</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmModal({ show: false, type: null })} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #e4e4e7', background: '#fff', cursor: 'pointer', fontWeight: 600,fontSize:'12px' }}>Cancel</button>
              <button onClick={triggerAction} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: PRIMARY, color: '#fff', cursor: 'pointer', fontWeight: 600,fontSize:'12px' }}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {openDetails && <JobDetailsModal isOpen={openDetails} onClose={() => setOpenDetails(false)} job={jobData} />}

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </>
  );
}