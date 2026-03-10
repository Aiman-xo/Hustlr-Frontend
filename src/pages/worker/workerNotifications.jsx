import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchNotifications, MarkasRead } from "../../redux/slice/workerSlice";

const PRIMARY = "#8ad007";

export default function WorkerNotifications() {
  const dispatch = useDispatch();
  
  // Destructure from Redux state
  const { error, loading, AllNotifications, unread_count } = useSelector((state) => state.worker);

  useEffect(() => {
    dispatch(FetchNotifications());
  }, [dispatch]);

  // Handlers
  const handleMarkAllRead = () => {
    console.log("clicked mark all", unread_count);
    if (unread_count > 0) {
      // Dispatch without an ID to trigger the 'Mark All' logic in your Django view
      dispatch(MarkasRead({ })); 
    }
  };

  const handleMarkOneRead = (id, currentlyRead) => {
    if (!currentlyRead) {
      // Dispatch specific ID to backend
      dispatch(MarkasRead({ notification_id: id }));
    }
  };

  // ── States ────────────────────────────────────────────────────────────────
//   if (loading) return <LoadingSkeleton />;
  
  if (error) return (
    <div style={containerStyle}>
      <ErrorState onRetry={() => dispatch(FetchNotifications())} />
    </div>
  );

  if (!loading && (!AllNotifications || AllNotifications.length === 0)) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Notifications</h1>
        <p style={emptyTextStyle}>You're all caught up — no notifications yet.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerWrapperStyle}>
        <div>
          <h1 style={titleStyle}>Notifications</h1>
          <p style={subtitleStyle}>
            {unread_count > 0 ? `You have ${unread_count} unread alerts.` : "Stay updated with your latest activity."}
          </p>
        </div>
        <button
          onClick={handleMarkAllRead}
          disabled={unread_count === 0}
          style={markAllBtnStyle(unread_count)}
        >
          Mark all as read
        </button>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {AllNotifications.map((n) => (
          <NotificationCard
            key={n.id}
            notification={{
              ...n,
              time: formatTime(n.created_at),
              isRead: n.is_read // Sync directly with Redux
            }}
            onRead={() => handleMarkOneRead(n.id, n.is_read)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Sub-Components & Helpers ────────────────────────────────────────────────

function NotificationCard({ notification: n, onRead }) {
  return (
    <div
      onClick={onRead}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        background: "#fff",
        borderRadius: 18,
        padding: "18px 22px",
        border: `1px solid ${n.is_read ? "#f4f4f5" : "#e6f5c0"}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        cursor: "pointer",
        opacity: n.is_read ? 0.7 : 1,
        transition: "all 0.2s ease",
      }}
    >
      <div style={badgeAreaStyle}>
        {!n.is_read && <span style={dotStyle} />}
        <span style={timeTextStyle}>{n.time}</span>
      </div>

      <h3 style={cardTitleStyle(n.is_read)}>{n.title}</h3>
      <p style={cardMessageStyle}>{n.message}</p>
    </div>
  );
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  const diffMs = new Date() - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "JUST NOW";
  if (diffMins < 60) return `${diffMins}M AGO`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}H AGO`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

// ── Styles ──────────────────────────────────────────────────────────────────
const containerStyle = { fontFamily: "'Manrope', sans-serif", padding: "36px 40px", maxWidth: 1100, margin: "0 auto" };
const headerWrapperStyle = { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 };
const titleStyle = { fontSize: 26, fontWeight: 900, margin: 0, letterSpacing: "-0.03em" };
const subtitleStyle = { color: "#71717a", fontSize: 12, marginTop: 3, fontWeight: 500 };
const emptyTextStyle = { marginTop: 44, textAlign: "center", color: "#a1a1aa", fontSize: 13 };
const badgeAreaStyle = { position: "absolute", top: 18, right: 20, display: "flex", alignItems: "center", gap: 6 };
const dotStyle = { width: 7, height: 7, borderRadius: "50%", background: PRIMARY };
const timeTextStyle = { fontSize: 10, fontWeight: 700, color: "#a1a1aa", letterSpacing: "0.1em" };
const cardTitleStyle = (isRead) => ({ fontSize: 13, fontWeight: 800, color: isRead ? "#71717a" : "#18181b", margin: 0 });
const cardMessageStyle = { fontSize: 12, fontWeight: 500, color: "#71717a", margin: 0, lineHeight: 1.55, maxWidth: 600 };
const markAllBtnStyle = (count) => ({
  background: "none", border: "none", fontSize: 12, fontWeight: 700, color: PRIMARY,
  cursor: count === 0 ? "default" : "pointer", opacity: count === 0 ? 0.35 : 1, padding: 0
});