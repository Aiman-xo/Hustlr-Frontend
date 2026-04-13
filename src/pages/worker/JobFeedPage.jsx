import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchJobFeed, SendInterest } from "../../redux/slice/workerSlice";
import { toast } from "react-toastify";

const PRIMARY = "#8ad007";

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function JobFeedPage() {
  const dispatch = useDispatch();
  const { jobFeed, feedLoading } = useSelector((state) => state.worker);

  useEffect(() => {
    dispatch(FetchJobFeed());
  }, [dispatch]);


  const handleInterested = async (postId) => {
    const result = await dispatch(SendInterest(postId));
    if (SendInterest.fulfilled.match(result)) {
      toast.success("Your interest has been sent to the employer! 🎉");
    } else {
      const msg = result.payload?.detail || result.payload?.error || "Failed to send interest.";
      toast.error(msg);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Manrope', sans-serif",
        minHeight: "100vh",
        background: "#f8faf4",
        padding: "36px 20px",
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: 620, margin: "0 auto 28px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0, color: "#161811" }}>
          Job Feed
        </h1>
        <p style={{ color: "#7c8c5f", fontSize: 13, marginTop: 4 }}>
          Browse open job posts from employers near you.
        </p>
      </div>

      {/* Feed */}
      {feedLoading ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div
            style={{
              width: 32,
              height: 32,
              border: `3px solid ${PRIMARY}`,
              borderTop: "3px solid transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          <p style={{ color: "#7c8c5f", fontSize: 13 }}>Loading jobs...</p>
        </div>
      ) : jobFeed.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 48, color: "#c8d8a0", display: "block", marginBottom: 12 }}
          >
            search_off
          </span>
          <p style={{ fontWeight: 700, color: "#4a5e1f", fontSize: 16, margin: 0 }}>
            No jobs posted yet
          </p>
          <p style={{ color: "#7c8c5f", fontSize: 13, marginTop: 6 }}>
            Check back soon — employers are posting new jobs!
          </p>
        </div>
      ) : (
        <div style={{
          maxWidth: 1000,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 24
        }}>
          {jobFeed.map((post) => (
            <JobCard
              key={post.id}
              post={post}
              alreadyInterested={!!post.already_interested}
              onInterested={() => handleInterested(post.id)}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .feed-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; }
        .interested-btn:hover:not(:disabled) { background: #79ba06 !important; }
      `}</style>
    </div>
  );
}

function JobCard({ post, alreadyInterested, onInterested }) {
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (alreadyInterested || loading) return;
    setLoading(true);
    await onInterested();
    setLoading(false);
  };

  return (
    <div
      className="feed-card group"
      style={{
        background: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        border: "1px solid #e2e6db",
        transition: "all 0.2s",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Job Image (Square Top) */}
      <div style={{ aspectRatio: "1 / 1", width: "100%", background: "#f5f7f2", position: "relative" }}>
        {post.job_image ? (
          <img
            src={post.job_image}
            alt={post.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
             <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#c8d8a0" }}>work</span>
          </div>
        )}
        
        {/* Top left overlay badge */}
        <span
          style={{
            position: "absolute",
            top: 12, left: 12,
            background: "rgba(138,208,7,0.9)",
            color: "#fff",
            fontSize: 10,
            fontWeight: 800,
            padding: "4px 8px",
            borderRadius: 6,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          {post.city || "Remote"}
        </span>
      </div>

      {/* Content Below Image */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 4px", color: "#161811", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {post.title}
        </h3>
        
        {/* Employer Info Inline */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
          {post.employer_profile_image && !imgError ? (
            <img 
               src={post.employer_profile_image} 
               alt="employer" 
               style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover" }} 
               onError={() => setImgError(true)}
            />
          ) : (
            <span className="material-symbols-outlined" style={{ color: PRIMARY, fontSize: 16 }}>business</span>
          )}
          <span style={{ fontSize: 12, fontWeight: 700, color: "#7c8c5f", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
             {post.employer_name || "Employer"}
          </span>
        </div>

        <p
          style={{
            fontSize: 13,
            color: "#52525b",
            margin: "0 0 16px",
            lineHeight: 1.5,
            flex: 1, // pushes button to bottom
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {post.description}
        </p>

        {/* Action button */}
        <button
          className="interested-btn"
          disabled={alreadyInterested || loading}
          onClick={handleClick}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            background: alreadyInterested ? "#f0f5e6" : PRIMARY,
            border: "none",
            color: alreadyInterested ? "#5a9200" : "#fff",
            fontSize: 13,
            fontWeight: 800,
            cursor: alreadyInterested || loading ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            transition: "all 0.2s",
            boxShadow: alreadyInterested ? "none" : "0 4px 12px rgba(138,208,7,0.3)",
          }}
        >
          {loading ? (
            <div
              style={{
                width: 14,
                height: 14,
                border: "2px solid #fff",
                borderTop: "2px solid transparent",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                {alreadyInterested ? "check" : "handshake"}
              </span>
              {alreadyInterested ? "Interest Sent" : "I'm Interested"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
