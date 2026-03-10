export default function JobDetailsModal({ isOpen, onClose, job }) {
    if (!isOpen) return null;
  
    const PRIMARY = "#8ad007";
  
    return (
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff",
            width: "100%",
            maxWidth: 580,
            borderRadius: 24,
            boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
            border: "1px solid #f4f4f5",
            overflow: "hidden",
            position: "relative",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              zIndex: 10,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(8px)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              color: PRIMARY,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              close
            </span>
          </button>
  
          {/* Banner */}
          <div
            style={{
              height: 180,
              width: "100%",
              backgroundImage: `url("${job?.project_image || ""}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
              }}
            />
          </div>
  
          {/* Content */}
          <div style={{ padding: "22px 26px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Title & Client */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 2,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 12,
                      color: PRIMARY,
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    auto_awesome
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: PRIMARY,
                    }}
                  >
                    Job Request
                  </span>
                </div>
  
                <h2
                  style={{
                    fontSize: 17,
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                    margin: 0,
                    color: "#161811",
                  }}
                >
                  {job?.description}
                </h2>
  
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    marginTop: 3,
                  }}
                >
                <div
                style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    backgroundColor: "#f4f4f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                }}
                >
                {job?.employer_profile_image ? (
                    <img
                    src={job.employer_profile_image}
                    alt="employer"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                    />
                ) : (
                    <span
                    className="material-symbols-outlined"
                    style={{
                        fontSize: 12,
                        color: "#a1a1aa",
                    }}
                    >
                    person
                    </span>
                )}
                </div>

                <span
                style={{
                    color: "#71717a",
                    fontWeight: 700,
                    fontSize: 11,
                }}
                >
                {job?.employer_name}
                </span>
                </div>
              </div>
  
              {/* Description */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <h4
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "#a1a1aa",
                    margin: 0,
                  }}
                >
                  Work Description
                </h4>
                <p
                  style={{
                    color: "#52525b",
                    fontSize: 12,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {job?.description}
                </p>
              </div>
  
              {/* Location */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                  background: "#f9f9f9",
                  borderRadius: 14,
                  padding: "14px 16px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      color: "#a1a1aa",
                    }}
                  >
                    City / Location
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      color: "#161811",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 15, color: PRIMARY }}
                    >
                      location_on
                    </span>
                    <span style={{ fontWeight: 700, fontSize: 12 }}>
                      {job?.city}
                    </span>
                  </div>
                </div>
  
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      color: "#a1a1aa",
                    }}
                  >
                    Status
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: PRIMARY }}>
                    {job?.status}
                  </span>
                </div>
              </div>
  
              {/* Close CTA */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: "8px 28px",
                    background: PRIMARY,
                    border: "none",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#fff",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(138,208,7,0.3)",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }