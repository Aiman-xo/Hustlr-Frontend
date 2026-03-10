import { FetchActiveJobs, SetJobEstimateTime, SendJobMaterials, GetJobMaterials, StartJob, FinishJob } from "../../redux/slice/workerSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect,useState } from "react";
import MaterialModal from "./Modals/JobMaterialSendingModal";
import Timer from "../../components/Timer";
import BillingModal from "./Modals/BillingModal";

const primary = "#8ad007";


const PingDot = () => (
  <span className="relative flex h-2.5 w-2.5">
    <span
      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
      style={{ backgroundColor: primary }}
    />
    <span
      className="relative inline-flex rounded-full h-2.5 w-2.5"
      style={{ backgroundColor: primary }}
    />
  </span>
);

const IconSVG = ({ name }) => {
  const icons = {
    checklist: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
    upload: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    note: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    call: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    video: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    chat: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    timer: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    edit: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    add: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  };
  return icons[name] || null;
};

const JobCard = ({ job, onUpdateEstimate }) => {
  const completedCount = job.tasks.filter((t) => t.done).length;

  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [calculatedLabor, setCalculatedLabor] = useState(0);

  const dispatch = useDispatch()
  const { loading, error, materialNotes } = useSelector((state) => state.worker)

  const handleEditClick = () => {
    // Pre-fill with current number if it exists
    const currentHours = job.estimated_hours || "";
    setInputVal(currentHours.toString());
    setIsEditing(true);
  };


  const handleSend = async () => {
    const trimmed = inputVal.trim();
    if (!trimmed || isNaN(trimmed)) return;

    setIsUpdating(true); // Disable UI during API call
    try {
      // Trigger the Thunk provided in your prompt
      await dispatch(SetJobEstimateTime({
        jobRequestId: job.id,
        estimate_time: parseFloat(trimmed)
      })).unwrap();

      // Re-fetch jobs so the UI shows the new data from the DB
      dispatch(FetchActiveJobs());
      setIsEditing(false);
    } catch (error) {
      //none
    } finally {
      setIsUpdating(false);
    }
  };


  const handleMaterialConfirm = async (draftItems) => {
    setIsSubmitting(true); // Start spinner

    // Create a 2-second delay
    setTimeout(async () => {
      try {
        await dispatch(SendJobMaterials(draftItems)).unwrap();
        setOpen(false);
      } catch (err) {
        console.error("Submission failed:", err);
      } finally {
        setIsSubmitting(false); // Stop spinner
      }
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
    if (e.key === "Escape") setIsEditing(false);
  };

  const handleStart = async () => {
    setIsUpdating(true);
    try {
      await dispatch(StartJob(job.id)).unwrap();
      dispatch(FetchActiveJobs());
    } catch (err) {
      console.error("Start failed:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStopClick = () => {
    if (job.start_time) {
      const start = new Date(job.start_time).getTime();
      const now = new Date().getTime();
      const hours = (now - start) / (1000 * 3600);
      const labor = hours * (job.contract_hourly_rate || job.hourly_rate || 0);
      setCalculatedLabor(labor);
      setShowBillingModal(true);
    }
  };

  const handleFinishConfirm = async (materialAmount) => {
    setIsUpdating(true);
    try {
      await dispatch(FinishJob({ jobRequestId: job.id, material_amount: materialAmount })).unwrap();
      setShowBillingModal(false);
      dispatch(FetchActiveJobs());
    } catch (err) {
      console.error("Finish failed:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e2e6db",
        borderRadius: "14px",
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s",
        fontFamily: "'Manrope', sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = primary;
        e.currentTarget.style.boxShadow = `0 4px 24px -2px rgba(138,208,7,0.12)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e2e6db";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Card Header */}
      <div
        style={{
          background: "#fafbfc",
          borderBottom: "1.5px solid #e2e6db",
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <PingDot />
          <span style={{ fontWeight: 700, fontSize: "13px", color: "#161811" }}>{job.title}</span>
        </div>


        <span
          style={{
            fontSize: "10px",
            fontFamily: "monospace",
            fontWeight: 700,
            color: primary,
            background: `${primary}18`,
            padding: "3px 10px",
            borderRadius: "999px",
            letterSpacing: "0.03em",
          }}
        >
          # {job.id}
        </span>
      </div>

      {/* Card Body */}
      <div
        style={{
          padding: "24px",
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: "28px",
        }}
      >
        {/* Left Panel */}
        <div
          style={{
            borderRight: "1.5px solid #e2e6db",
            paddingRight: "28px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
            {/* Estimated Time */}
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "9px",
                  fontWeight: 800,
                  color: "#7c8c5f",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Estimated Time
              </p>

              {isEditing ? (
                /* ── UPDATED EDIT MODE ── */
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <input
                    autoFocus
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="No. of hours"
                    value={inputVal}
                    disabled={loading} // Use Redux loading
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                      width: "100%",
                      background: loading ? "#f9faf8" : "#fff",
                      border: `1.5px solid ${loading ? "#e2e6db" : primary}`,
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: loading ? "#9aad7a" : "#161811",
                      padding: "7px 10px",
                      fontFamily: "'Manrope', sans-serif",
                      outline: "none",
                      boxSizing: "border-box",
                      boxShadow: loading ? "none" : `0 0 0 3px ${primary}1a`,
                    }}
                  />

                  {/* Error Message from Redux */}
                  {error && (
                    <span style={{ color: "#e63946", fontSize: "9px", fontWeight: 600 }}>
                      {error}
                    </span>
                  )}

                  <div style={{ display: "flex", gap: "5px" }}>
                    <button
                      onClick={handleSend}
                      disabled={loading} // Use Redux loading
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        background: loading ? "#9aad7a" : primary,
                        color: "#fff",
                        border: "none",
                        borderRadius: "7px",
                        fontSize: "10px",
                        fontWeight: 800,
                        cursor: loading ? "not-allowed" : "pointer",
                        fontFamily: "'Manrope', sans-serif",
                        letterSpacing: "0.05em",
                        boxShadow: loading ? "none" : `0 2px 8px -1px ${primary}55`,
                        transition: "opacity 0.12s",
                      }}
                    >
                      {loading ? "Saving..." : "Send"}
                    </button>

                    <button
                      onClick={() => !loading && setIsEditing(false)}
                      disabled={loading}
                      style={{
                        padding: "6px 10px",
                        background: "transparent",
                        color: "#7c8c5f",
                        border: "1.5px solid #e2e6db",
                        borderRadius: "7px",
                        fontSize: "11px",
                        fontWeight: 600,
                        cursor: loading ? "not-allowed" : "pointer",
                        fontFamily: "'Manrope', sans-serif",
                        transition: "all 0.12s",
                        lineHeight: 1,
                        opacity: loading ? 0.5 : 1,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                /* ── DISPLAY MODE (Unchanged) ── */
                <div style={{ position: "relative" }}>
                  <input
                    readOnly
                    value={job.estimatedTime}
                    onClick={handleEditClick}
                    style={{
                      width: "100%",
                      background: "#f3f5f0",
                      border: "1.5px solid transparent",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#161811",
                      padding: "7px 28px 7px 10px",
                      fontFamily: "'Manrope', sans-serif",
                      outline: "none",
                      boxSizing: "border-box",
                      cursor: "pointer",
                    }}
                  />
                  <span
                    onClick={handleEditClick}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: primary,
                      display: "flex",
                      cursor: "pointer",
                    }}
                  >
                    <IconSVG name="edit" />
                  </span>
                </div>
              )}
            </div>


            {/* Session Duration / Timer */}
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontSize: "9px",
                  fontWeight: 800,
                  color: "#7c8c5f",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                {job.status === 'in_progress' ? 'Live Progress' : 'Last Session'}
              </p>
              {job.status === 'in_progress' ? (
                <Timer startTime={job.start_time} isActive={job.is_timer_active} />
              ) : (
                <p
                  style={{
                    fontSize: "26px",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    color: "#161811",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1,
                  }}
                >
                  {job.sessionDuration || "00:00:00"}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons Layer */}
          <div style={{ marginTop: "12px" }}>
            {job.status === 'accepted' && (
              <button
                onClick={handleStart}
                disabled={isUpdating}
                style={{
                  width: "100%",
                  height: "44px",
                  background: primary,
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: 800,
                  cursor: isUpdating ? "not-allowed" : "pointer",
                  boxShadow: `0 4px 16px -2px ${primary}44`,
                  transition: "all 0.2s"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>play_circle</span>
                {isUpdating ? "Starting..." : "Start Work Session"}
              </button>
            )}

            {job.status === 'starting' && (
              <div style={{
                width: "100%",
                padding: "12px",
                background: "#fffbeb",
                border: "1px solid #fef3c7",
                borderRadius: "10px",
                textAlign: "center"
              }}>
                <p style={{ color: "#d97706", fontSize: "11px", fontWeight: 700, margin: 0 }}>
                  Waiting for Employer to accept start...
                </p>
              </div>
            )}

            {job.status === 'in_progress' && (
              <button
                onClick={handleStopClick}
                disabled={isUpdating}
                style={{
                  width: "100%",
                  height: "44px",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: 800,
                  cursor: isUpdating ? "not-allowed" : "pointer",
                  boxShadow: `0 4px 16px -2px rgba(239, 68, 68, 0.3)`,
                  transition: "all 0.2s"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>stop_circle</span>
                Stop & Submit Bill
              </button>
            )}

            {job.status === 'completed' && (
              <div style={{
                width: "100%",
                padding: "12px",
                background: "#f0fdf4",
                border: "1px solid #dcfce7",
                borderRadius: "10px",
                textAlign: "center"
              }}>
                <p style={{ color: "#16a34a", fontSize: "11px", fontWeight: 800, margin: 0 }}>
                  ✓ Job Completed & Billed
                </p>
              </div>
            )}
          </div>

          <p style={{ textAlign: "center", fontSize: "10px", color: "#7c8c5f", marginTop: '8px' }}>
            {job.status === 'in_progress' ? `Started at: ${new Date(job.start_time).toLocaleTimeString()}` : job.startedAt}
          </p>


        </div>


        {/* Right Panel */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "14px" }}>
          {/* Tasks */}
          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between", // Pushes content to opposite ends
                width: "100%",                  // Ensures it spans the full width
                gap: "6px",
                fontSize: "9px",
                fontWeight: 800,
                color: "#7c8c5f",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              {/* Left Side: Icon and Title */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: primary, display: "flex" }}>
                  <IconSVG name="checklist" />
                </span>
                <span>Job Tasks &amp; Materials</span>
              </div>

              {/* Right Side: Employer Name */}
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#9aad7a",
                  letterSpacing: "0.02em",
                  textTransform: "none", // Keeps name from being all caps if you prefer
                }}
              >
                {job.employer_name || "Private Employer"}
              </span>
            </label>

            <div
              style={{
                background: "#fafbfc",
                border: "1.5px solid #e2e6db",
                borderRadius: "10px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {job.tasks.map((task) => (
                <div key={task.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="checkbox"
                    defaultChecked={task.done}
                    readOnly
                    style={{
                      width: "15px",
                      height: "15px",
                      accentColor: primary,
                      cursor: "pointer",
                      borderRadius: "4px",
                      flexShrink: 0,
                    }}
                  />
                  <label
                    style={{
                      fontSize: "11px",
                      fontWeight: 500,
                      color: task.done ? "#9aad7a" : "#161811",
                      textDecoration: task.done ? "line-through" : "none",
                      cursor: "pointer",
                      transition: "color 0.15s",
                    }}
                  >
                    {task.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              {[
                { icon: "upload", label: "Upload Bill" },
                { icon: "note", label: "Send Note" },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  onClick={() => {
                    if (label === "Send Note") {
                      setOpen(true);
                    } else {
                      console.log("Upload Bill clicked");
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "7px 12px",
                    border: "1.5px solid #e2e6db",
                    borderRadius: "8px",
                    background: "transparent",
                    color: "#7c8c5f",
                    fontSize: "9px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    fontFamily: "'Manrope', sans-serif",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = primary;
                    e.currentTarget.style.color = primary;
                    e.currentTarget.style.background = `${primary}0d`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e6db";
                    e.currentTarget.style.color = "#7c8c5f";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <IconSVG name={icon} />
                  {label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
              {["call", "video", "chat"].map((icon) => (
                <button
                  key={icon}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    border: "none",
                    background: `${primary}18`,
                    color: primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = primary;
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${primary}18`;
                    e.currentTarget.style.color = primary;
                  }}
                >
                  <IconSVG name={icon} />
                </button>

              ))}

            </div>
          </div>
        </div>
        {(error) && (
          <p className="mt-2 text-[9px] text-red-500 text-center font-bold uppercase">{error}</p>
        )}
      </div>
      {/* Place this at the end of the JobCard JSX */}
      <MaterialModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleMaterialConfirm}
        jobId={job.id}
        primary={primary}
        isLoading={isSubmitting}
      />
      <BillingModal
        isOpen={showBillingModal}
        onClose={() => setShowBillingModal(false)}
        onConfirm={handleFinishConfirm}
        laborAmount={calculatedLabor}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default function MyJobs() {
  const dispatch = useDispatch()
  const { loading, error, activeJobs, materialNotes } = useSelector((state) => state.worker)

  // MyJobs.js
  useEffect(() => {
    const fetchAllData = async () => {
      const result = await dispatch(FetchActiveJobs()).unwrap();
      // After jobs are fetched, loop through and get materials for each
      if (result && result.length > 0) {
        result.forEach(job => {
          dispatch(GetJobMaterials(job.id));
        });
      }
    };
    fetchAllData();
  }, [dispatch]);

  useEffect(() => {
    if (activeJobs) {
      console.log(activeJobs);
    }
  }, [dispatch, activeJobs])

  const handleUpdateEstimate = (jobId, newLabel) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, estimatedTime: newLabel } : j))
    );
  };

  return (
    <>

      <div
        style={{
          minHeight: "100vh",
          background: "#f7f8f5",
          padding: "32px",
          fontFamily: "'Manrope', sans-serif",
          boxSizing: "border-box",
        }}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "28px",
          }}
        >

          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#161811", margin: 0, letterSpacing: "-0.02em" }}>
              My Jobs
            </h1>
            <p style={{ fontSize: "12px", color: "#7c8c5f", margin: "4px 0 0", fontWeight: 500 }}>
              Manage your active assignments and ongoing tasks.
            </p>
          </div>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 18px",
              background: primary,
              color: "#fff",
              border: "none",
              borderRadius: "9px",
              fontSize: "12px",
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "'Manrope', sans-serif",
              boxShadow: `0 4px 14px -2px ${primary}55`,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <IconSVG name="add" />
            Find New Work
          </button>
        </div>

        {/* Section Label */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
          <span
            style={{
              padding: "3px 12px",
              background: `${primary}18`,
              color: primary,
              fontSize: "9px",
              fontWeight: 900,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              borderRadius: "999px",
            }}
          >
            Live Now
          </span>
          <h2 style={{ fontSize: "16px", fontWeight: 900, color: "#161811", margin: 0 }}>Active Works</h2>
        </div>



        {/* Job Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {loading && <p>Loading jobs...</p>}

          {activeJobs && activeJobs.map((job) => {
            // 1. Filter logic happens inside the function block
            const relevantNotes = materialNotes ? materialNotes.filter(note => note.job === job.id) : [];

            // 2. You MUST return the JSX
            return (
              <JobCard
                key={job.id}
                job={{
                  ...job,
                  title: job.description || "No Description Provided",
                  estimatedTime: job.estimated_hours ? `Est. ${job.estimated_hours} hours` : "Set Estimate",
                  sessionDuration: "00:00:00",
                  startedAt: `Location: ${job.city}`,
                  // 3. Transform the filtered notes into the tasks format the JobCard expects
                  tasks: relevantNotes.map(note => ({
                    id: note.id,
                    label: note.item_description,
                    done: note.is_available_at_site
                  }))
                }}
                onUpdateEstimate={handleUpdateEstimate}
              />
            );
          })}

          {!loading && activeJobs?.length === 0 && <p>No active jobs found.</p>}
        </div>
      </div>
    </>
  );
}