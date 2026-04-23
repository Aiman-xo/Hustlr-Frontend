import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SeeJobRequests, AcceptJobStart } from '../../redux/slice/employerSlice';
import { CreateRazorpayClient, VerifyPayment } from '../../redux/slice/paymentSlice';
import PaymentSuccessModal from "./Modals/PaymentSuccessModal";
import { useNavigate } from 'react-router-dom';
import Timer from '../../components/Timer';
import api from '../../api/axiosInstance';
import { Link } from 'react-router-dom';

import { toast } from 'react-toastify';

const primary = "#8ad007";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  .employer-works-container *:not(.material-symbols-outlined) { font-family: 'Manrope', sans-serif; box-sizing: border-box; }
  .material-symbols-outlined { font-family: 'Material Symbols Outlined' !important; }

  .timer-pulse { animation: pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite; }
  @keyframes pulse-ring { 0%,100%{opacity:1} 50%{opacity:0.4} }

  .donut-segment { transition: stroke-dasharray 0.3s ease; }

  .employer-works-container input[type="checkbox"] {
    accent-color: ${primary};
    width: 16px; height: 16px;
    border-radius: 4px;
    cursor: pointer;
  }

  .tab-btn {
    padding: 6px 16px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    background: transparent;
    color: #6b7280;
  }
  .tab-btn:hover { color: ${primary}; }
  .tab-btn.active {
    background: ${primary};
    color: white;
    box-shadow: 0 4px 12px ${primary}40;
  }

  .work-card {
    background: white;
    border-radius: 16px;
    border: 1px solid #f3f4f6;
    overflow: hidden;
    margin-bottom: 24px;
    transition: box-shadow 0.2s;
  }
  .work-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }

  .icon-btn {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 1px solid #e5e7eb;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    background: white;
    color: #6b7280;
    transition: all 0.2s;
  }
  .icon-btn:hover {
    background: ${primary}18;
    border-color: ${primary};
    color: ${primary};
  }

  .primary-btn {
    padding: 10px 24px;
    background: ${primary};
    color: white;
    font-weight: 800;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0 4px 14px ${primary}40;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .primary-btn:hover { opacity: 0.9; }

  .ghost-btn {
    padding: 10px 24px;
    background: transparent;
    color: #9ca3af;
    font-weight: 700;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .ghost-btn:hover { background: #f9fafb; }

  .section-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
  }

  .tag {
    padding: 3px 10px;
    background: #f3f4f6;
    border-radius: 999px;
    font-size: 9px;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const Avatar = ({ src, size = 56, border = primary }) => (
    <div style={{
        width: size, height: size, borderRadius: 14, flexShrink: 0,
        backgroundColor: src ? 'transparent' : '#f3f4f6',
        backgroundImage: src ? `url(${src})` : 'none',
        backgroundSize: "cover", backgroundPosition: "center",
        border: `2px solid ${border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden"
    }}>
        {!src && <span className="material-symbols-outlined" style={{ fontSize: size * 0.6, color: "#9ca3af" }}>person</span>}
    </div>
);

const ProjectThumbnail = ({ src }) => (
  <div style={{
      width: "100%", height: 100, borderRadius: 12, marginTop: 16,
      backgroundColor: '#f3f4f6', overflow: "hidden", border: "1px solid #e5e7eb",
      position: 'relative', cursor: 'pointer'
  }}>
      {src ? (
          <img src={src} alt="Project" style={{ width: "100%", height: "100%", objectCover: "cover" }} />
      ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#cbd5e1" }}>image</span>
              <span style={{ fontSize: 8, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" }}>No Image</span>
          </div>
      )}
  </div>
);

const IconBtn = ({ icon }) => (
    <button className="icon-btn">
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>
    </button>
);

const ContactBtns = () => (
    <div style={{ display: "flex", gap: 8, paddingRight: 16, marginRight: 8, borderRight: "1px solid #f3f4f6" }}>
        <IconBtn icon="call" />
        <IconBtn icon="videocam" />
        <Link to={'/employer/messages'}>
        <IconBtn icon="chat_bubble"/>
        </Link>
    </div>
);

const JobChecklist = ({ jobId }) => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await api.get(`see-job-materials/${jobId}/`);
                setMaterials(response.data);
            } catch (err) {
                console.error("Failed to fetch materials:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMaterials();
    }, [jobId]);

    const handleToggle = async (materialId) => {
        try {
            const response = await api.post(`material-toggle/${materialId}/`);
            setMaterials(prev => prev.map(m =>
                m.id === materialId ? { ...m, is_available_at_site: response.data.is_available_at_site } : m
            ));
        } catch (err) {
            console.error("Failed to toggle material:", err);
        }
    };

    if (loading) return <div style={{ fontSize: 11, color: "#9ca3af" }}>Loading checklist...</div>;

    return (
        <div style={{ background: "#fafafa", borderRadius: 10, border: "1px solid #f3f4f6", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {materials.length > 0 ? materials.map((item) => (
                <label key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                    <input
                        type="checkbox"
                        checked={item.is_available_at_site}
                        onChange={() => handleToggle(item.id)}
                        style={{ marginTop: 3 }}
                    />
                    <span style={{ fontSize: 12, color: item.is_available_at_site ? "#161811" : "#6b7280", fontWeight: item.is_available_at_site ? 600 : 400, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {item.item_description}
                    </span>
                </label>
            )) : (
                <span style={{ fontSize: 11, color: "#9ca3af", fontStyle: "italic" }}>No materials listed by worker.</span>
            )}
        </div>
    );
};

const TABS = ["All", "Active", "Accepted", "Completed", "Request to Start"];

const EmployerWorks = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { allJobRequests } = useSelector((state) => state.employer);
    const [activeTab, setActiveTab] = useState("All");
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const RELEVANT_STATUSES = 'accepted,in_progress,starting,completed';

    const getStatusForTab = (tab) => {
        switch (tab) {
            case "Active": return "in_progress";
            case "Accepted": return "accepted";
            case "Completed": return "completed";
            case "Request to Start": return "starting";
            case "All":
            default: return RELEVANT_STATUSES;
        }
    };

    useEffect(() => {
        dispatch(SeeJobRequests({ status: getStatusForTab(activeTab), page: 1 }));
    }, [dispatch, activeTab]);

    const handleAcceptStart = async (jobId) => {
        try {
            await dispatch(AcceptJobStart(jobId)).unwrap();
            dispatch(SeeJobRequests({ status: getStatusForTab(activeTab), page: 1 }));
        } catch (err) {
            console.error("Failed to accept start:", err);
        }
    };

    const handlePayment = async (job) => {
        if (!job.billing_info?.id) {
            toast.error("No billing information available for this job.");
            return;
        }

        try {
            const orderData = await dispatch(CreateRazorpayClient(job.billing_info.id)).unwrap();
            
            if (!orderData?.order_id) {
                toast.error("Failed to create payment order. Please try again.");
                return;
            }

            if (!window.Razorpay) {
                toast.error("Razorpay SDK failed to load. Please check your internet connection.");
                return;
            }

            const options = {
                key: orderData.key_id, 
                name: "Hustlr Platform",
                description: `Work ref: #WORK-${job.id}`,
                order_id: orderData.order_id,
                handler: async (response) => {
                    try {
                        await dispatch(VerifyPayment({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        })).unwrap();
                        
                        setIsSuccessModalOpen(true);
                        dispatch(SeeJobRequests({ status: getStatusForTab(activeTab), page: 1 }));
                    } catch (verifyError) {
                        console.error("Payment verification failed:", verifyError);
                        toast.error("Verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: job.employer_name || "Employer",
                    email: "employer@hustlr.com",
                },
                theme: { color: "#8ad007" },
            };

            const rzp = new window.Razorpay(options);
            
            rzp.on('payment.failed', function (response) {
                console.error("Razorpay Payment Failed:", response.error);
                toast.error(`Payment failed: ${response.error.description}`);
            });

            rzp.open();
        } catch (error) {
            console.error("Payment initiation failed:", error);
            toast.error("Failed to initiate payment. Please try again.");
        }
    };

    const activeJobs = allJobRequests.filter(j => j.status === 'in_progress');
    const acceptedJobs = allJobRequests.filter(j => j.status === 'accepted');
    const startingJobs = allJobRequests.filter(j => j.status === 'starting');
    const completedJobs = allJobRequests.filter(j => j.status === 'completed');

    const activeCount = activeJobs.length;
    const completedCount = completedJobs.length;
    const startingCount = startingJobs.length;
    const acceptedCount = acceptedJobs.length;

    const totalVisibleRelevant = activeCount + completedCount + startingCount + acceptedCount;
    const yieldPercentage = totalVisibleRelevant > 0 ? Math.round((completedCount / totalVisibleRelevant) * 100) : 0;

    return (
        <div className="employer-works-container">
            <PaymentSuccessModal 
                isOpen={isSuccessModalOpen} 
                onClose={() => setIsSuccessModalOpen(false)} 
            />
            <style>{styles}</style>
            <div style={{ background: "#f7f8f5", minHeight: "100vh", padding: "28px 32px" }}>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>

                    {/* Header */}
                    <div style={{ background: "white", borderRadius: 20, padding: "28px 32px", marginBottom: 24, border: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
                        <div style={{ flex: 1 }}>
                            <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 4, margin: 0 }}>Work Management</h1>
                            <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6, maxWidth: 360, marginTop: 6, marginBottom: 20 }}>
                                Oversee active sessions, approve new requests, and manage your operational flow in real-time.
                            </p>
                            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                                {[[totalVisibleRelevant.toString().padStart(2, '0'), "Total", primary],
                                [activeCount.toString().padStart(2, '0'), "Active", "#161811"],
                                [completedCount.toString().padStart(2, '0'), "Completed", "#161811"]].map(([val, label, color], i) => (
                                    <React.Fragment key={label}>
                                        {i > 0 && <div style={{ width: 1, height: 32, background: "#e5e7eb" }} />}
                                        <div>
                                            <div style={{ fontSize: 22, fontWeight: 800, color }}>{val}</div>
                                            <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Donut */}
                        <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
                            <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
                                <circle cx="70" cy="70" r="56" fill="transparent" stroke="#f3f4f6" strokeWidth="10" />
                                <circle
                                    cx="70" cy="70" r="56" fill="transparent" stroke={primary} strokeWidth="10"
                                    strokeDasharray="352"
                                    strokeDashoffset={352 - (352 * yieldPercentage) / 100}
                                    strokeLinecap="round" className="donut-segment"
                                />
                            </svg>
                            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontSize: 18, fontWeight: 900 }}>{yieldPercentage}%</span>
                                <span style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>Yield</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ display: "inline-flex", padding: 4, background: "white", borderRadius: 12, border: "1px solid #f3f4f6" }}>
                            {TABS.map(t => (
                                <button key={t} className={`tab-btn${activeTab === t ? " active" : ""}`} onClick={() => setActiveTab(t)}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* Active Work Section */}
                    {(activeTab === "All" || activeTab === "Active") && activeJobs.length > 0 && (
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                                <span className="section-dot" style={{ background: primary, animation: "pulse-ring 2s infinite" }} />
                                <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Active Work</h3>
                            </div>

                            {activeJobs.map(job => (
                                <div key={job.id} alt="Active Job Card" className="work-card">
                                    <div style={{ display: "flex" }}>
                                        <div style={{ width: 220, padding: "24px 20px", background: "#fafafa", borderRight: "1px solid #f3f4f6", flexShrink: 0 }}>
                                            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                                                <Avatar src={job.worker_profile_image} size={52} />
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: 13, color: "#161811" }}>{job.worker_name}</div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 3, color: primary }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>star</span>
                                                        <span style={{ fontSize: 12, fontWeight: 700 }}>4.9</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                <div style={{ background: `${primary}18`, borderRadius: 8, padding: "8px 10px", display: "flex", justifyContent: "space-between" }}>
                                                    <span style={{ fontSize: 9, fontWeight: 700, color: primary, textTransform: "uppercase" }}>Status</span>
                                                    <span style={{ fontSize: 9, fontWeight: 700, color: primary }}>IN PROGRESS</span>
                                                </div>
                                                <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: 8, padding: "8px 10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                    <Timer startTime={job.start_time} isActive={job.is_timer_active} />
                                                </div>
                                            </div>
                                            <ProjectThumbnail src={job.project_image} />
                                        </div>

                                        <div style={{ flex: 1, padding: "24px" }}>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                                                <div>
                                                    <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Material Notes Checklist</div>
                                                    <JobChecklist jobId={job.id} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Uploaded Bill/Receipt</div>
                                                    <div style={{ borderRadius: 10, border: "1px solid #e5e7eb", background: "#f9fafb", padding: "12px", textAlign: "center" }}>
                                                        {job.billing_info?.bill_image ? (
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                                                <span className="material-symbols-outlined" style={{ fontSize: 24, color: primary }}>receipt_long</span>
                                                                <a 
                                                                    href={job.billing_info.bill_image} 
                                                                    target="_blank" 
                                                                    rel="noreferrer"
                                                                    style={{ fontSize: 10, color: primary, fontWeight: 800, textDecoration: 'none', borderBottom: `1px solid ${primary}` }}
                                                                >
                                                                    View Receipt
                                                                </a>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#cbd5e1", marginBottom: 4 }}>receipt_long</span>
                                                                <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>No receipts uploaded yet.</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                                    <div>
                                                        <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>Hourly Rate</div>
                                                        <div style={{ fontSize: 14, fontWeight: 700 }}>₹{job.contract_hourly_rate || job.hourly_rate}</div>
                                                    </div>
                                                    <div style={{ width: 1, height: 28, background: "#e5e7eb" }} />
                                                    <div>
                                                        <div style={{ fontSize: 9, fontWeight: 700, color: primary, textTransform: "uppercase", letterSpacing: "0.1em" }}>Tracking ID</div>
                                                        <div style={{ fontSize: 14, fontWeight: 900, color: primary }}>#WORK-{job.id}</div>
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <ContactBtns />
                                                    <button className="primary-btn" style={{ opacity: 0.6, cursor: 'not-allowed' }}>In Session</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Request to Start Section */}
                    {(activeTab === "All" || activeTab === "Request to Start") && startingJobs.length > 0 && (
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                                <span className="section-dot" style={{ background: "#f97316" }} />
                                <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Request to Start</h3>
                            </div>

                            {startingJobs.map(job => (
                                <div key={job.id} alt="Start Request Card" style={{ background: "white", borderRadius: 16, border: `2px solid ${primary}50`, overflow: "hidden", position: "relative", marginBottom: 24 }}>
                                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${primary}60, ${primary}, ${primary}60)` }} />
                                    <div style={{ display: "flex" }}>
                                        <div style={{ width: 220, padding: "24px 20px", background: `${primary}08`, borderRight: `1px solid ${primary}20`, flexShrink: 0 }}>
                                            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                                                <Avatar src={job.worker_profile_image} size={52} border={primary} />
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: 13, color: "#161811" }}>{job.worker_name}</div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 3, color: primary }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>star</span>
                                                        <span style={{ fontSize: 12, fontWeight: 700 }}>4.8</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ background: "#fff7ed", borderRadius: 8, padding: "8px 10px", display: "flex", justifyContent: "space-between" }}>
                                                <span style={{ fontSize: 9, fontWeight: 700, color: "#ea580c", textTransform: "uppercase" }}>Status</span>
                                                <span style={{ fontSize: 9, fontWeight: 700, color: "#ea580c" }}>PENDING START</span>
                                            </div>
                                            <ProjectThumbnail src={job.project_image} />
                                        </div>

                                        <div style={{ flex: 1, padding: "24px" }}>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16 }}>
                                                <div>
                                                    <h4 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 6px", color: "#161811" }}>Worker is ready.</h4>
                                                    <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6, margin: 0 }}>
                                                        {job.worker_name} has arrived and is requesting to start the session. Approve now to begin the timer.
                                                    </p>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Site Checklist</div>
                                                    <JobChecklist jobId={job.id} />
                                                </div>
                                            </div>
                                            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                                                <div>
                                                    <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>Contract Rate</div>
                                                    <div style={{ fontSize: 18, fontWeight: 900, color: primary }}>₹{job.contract_hourly_rate || job.hourly_rate}/hr</div>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <ContactBtns />
                                                    <button className="primary-btn" onClick={() => handleAcceptStart(job.id)}>Approve Start</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Accepted Section */}
                    {(activeTab === "All" || activeTab === "Accepted") && acceptedJobs.length > 0 && (
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                                <span className="section-dot" style={{ background: "#3b82f6" }} />
                                <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Accepted</h3>
                            </div>

                            {acceptedJobs.map(job => (
                                <div key={job.id} alt="Accepted Job Card" className="work-card">
                                    <div style={{ display: "flex" }}>
                                        <div style={{ width: 220, padding: "24px 20px", background: "#eff6ff", borderRight: "1px solid #f3f4f6", flexShrink: 0 }}>
                                            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                                                <Avatar src={job.worker_profile_image} size={52} border="#60a5fa" />
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: 13, color: "#161811" }}>{job.worker_name}</div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 3, color: primary }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>star</span>
                                                        <span style={{ fontSize: 12, fontWeight: 700 }}>5.0</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                <div style={{ background: "#dbeafe", borderRadius: 8, padding: "8px 10px", display: "flex", justifyContent: "space-between" }}>
                                                    <span style={{ fontSize: 9, fontWeight: 700, color: "#2563eb", textTransform: "uppercase" }}>Status</span>
                                                    <span style={{ fontSize: 9, fontWeight: 700, color: "#2563eb" }}>ACCEPTED</span>
                                                </div>
                                                <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: 8, padding: "6px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#3b82f6" }}>schedule</span>
                                                    <span style={{ fontSize: 12, fontWeight: 700 }}>Est. {job.estimated_hours || 4} Hours</span>
                                                </div>
                                            </div>
                                            <ProjectThumbnail src={job.project_image} />
                                        </div>

                                        <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 6px", color: "#161811" }}>{job.description ? job.description.substring(0, 40) + "..." : "Job Offer Accepted"}</h4>
                                                    <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6, maxWidth: 340, margin: "0 0 12px" }}>
                                                        The worker has accepted the job offer. They are currently finalizing their schedule to begin work.
                                                    </p>
                                                    <div style={{ display: "flex", gap: 6 }}>
                                                        <span className="tag">{job.city}</span>
                                                        <span className="tag">Ready to Sync</span>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                                    <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>Agreed BasePay</div>
                                                    <div style={{ fontSize: 22, fontWeight: 900, color: primary }}>₹{job.base_pay || (job.contract_hourly_rate * (job.estimated_hours || 1))}</div>
                                                </div>
                                            </div>
                                            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                                                <div style={{ display: "flex", gap: 8 }}>
                                                    <IconBtn icon="call" /><IconBtn icon="videocam" /><IconBtn icon="chat_bubble" />
                                                </div>
                                                <button className="ghost-btn" onClick={() => setSelectedJob(job)}>View Details</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Completed Section */}
                    {(activeTab === "All" || activeTab === "Completed") && completedJobs.length > 0 && (
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                                <span className="section-dot" style={{ background: "#4ade80" }} />
                                <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Completed</h3>
                            </div>

                            {completedJobs.map(job => (
                                <div key={job.id} alt="Completed Job Card" className="work-card" style={{ opacity: 0.8 }}>
                                    <div style={{ display: "flex" }}>
                                        <div style={{ width: 220, padding: "24px 20px", background: "#f0fdf4", borderRight: "1px solid #f3f4f6", flexShrink: 0 }}>
                                            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                                                <Avatar src={job.worker_profile_image} size={52} border="#4ade80" />
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: 13, color: "#161811" }}>{job.worker_name}</div>
                                                    <div style={{ color: "#4ade80", fontSize: 12, fontWeight: 700 }}>Job Finished</div>
                                                </div>
                                            </div>
                                            <div style={{ background: "#dcfce7", borderRadius: 8, padding: "6px 10px", textAlign: 'center' }}>
                                                <span style={{ fontSize: 9, fontWeight: 700, color: "#166534", textTransform: "uppercase" }}>Completed</span>
                                            </div>
                                        </div>

                                        <div style={{ flex: 1, padding: "24px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                <div>
                                                    <h4 style={{ fontSize: 16, fontWeight: 900, color: "#161811" }}>Workflow Completed</h4>
                                                    <p style={{ fontSize: 12, color: "#9ca3af" }}>Session finished and stored in archive.</p>
                                                </div>
                                                <div style={{ display: "flex", gap: 10 }}>
                                                    <button className="primary-btn" style={{ background: "#161811", boxShadow: "none", borderRadius:'5px' }} onClick={() => navigate(`/employer/invoice/${job.id}`)}>View Invoice</button>
                                                    {job.billing_info?.is_paid ? (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', background: '#f0fdf4', border: '1px solid #4ade80', borderRadius: 2 }}>
                                                            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#16a34a' }}>check_circle</span>
                                                            <span style={{ fontSize: 10, fontWeight: 900, color: '#16a34a', textTransform: 'uppercase' }}>Paid</span>
                                                        </div>
                                                    ) : (
                                                        <button className="primary-btn" style={{ background: "#8ad007", boxShadow: "none", borderRadius:'5px' }} onClick={() => handlePayment(job)}>Payout</button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {totalVisibleRelevant === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 20, border: '1px solid #f3f4f6' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#e5e7eb', marginBottom: 16 }}>work_history</span>
                            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#161811', margin: '0 0 8px' }}>No relevant works found</h3>
                            <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Active assignments and starting requests will appear here.</p>
                        </div>
                    )}

                    {/* Job Details Modal */}
                    {selectedJob && (
                        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={() => setSelectedJob(null)}>
                            <div style={{ background: 'white', borderRadius: 24, width: '100%', maxWidth: 500, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
                                <div style={{ position: 'relative', height: 200 }}>
                                    <div style={{ height: '100%', width: '100%', background: selectedJob.project_image ? `url(${selectedJob.project_image})` : '#f3f4f6', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                        {!selectedJob.project_image && <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined" style={{ fontSize: 48, color: '#e5e7eb' }}>image</span></div>}
                                    </div>
                                    <button onClick={() => setSelectedJob(null)} style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: '50%', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                                    </button>
                                </div>
                                <div style={{ padding: 32 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                                        <div>
                                            <h2 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 4px' }}>{selectedJob.worker_name}</h2>
                                            <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Project ID: #WORK-{selectedJob.id}</p>
                                        </div>
                                        <div style={{ padding: '6px 12px', background: `${primary}15`, borderRadius: 10, color: primary, fontSize: 10, fontWeight: 800 }}>
                                            {selectedJob.status.toUpperCase()}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                                        <div style={{ padding: 16, background: '#f9fafb', borderRadius: 16 }}>
                                            <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 4 }}>Budget</div>
                                            <div style={{ fontSize: 16, fontWeight: 800 }}>₹{selectedJob.base_pay || (selectedJob.contract_hourly_rate * (selectedJob.estimated_hours || 1))}</div>
                                        </div>
                                        <div style={{ padding: 16, background: '#f9fafb', borderRadius: 16 }}>
                                            <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 4 }}>Rate</div>
                                            <div style={{ fontSize: 16, fontWeight: 800 }}>₹{selectedJob.contract_hourly_rate || selectedJob.hourly_rate}/hr</div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: 24 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 8 }}>Job Description</div>
                                        <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                            {selectedJob.description || "No description provided for this job request."}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', gap: 12 }}>
                                        {selectedJob.status === 'starting' ? (
                                            <button className="primary-btn" style={{ flex: 1 }} onClick={() => { handleAcceptStart(selectedJob.id); setSelectedJob(null); }}>Approve Start</button>
                                        ) : (
                                            <button className="primary-btn" style={{ flex: 1 }} onClick={() => setSelectedJob(null)}>Close View</button>
                                        )}
                                        {/* <button className="ghost-btn" style={{ flex: 1 }}>Message</button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployerWorks;
