import { useState, useRef } from "react";
import { SendJobRequest } from "../../../redux/slice/employerSlice";
import { useSelector,useDispatch } from "react-redux";
import Spinner from "../../publilc/Spinner";

const PRIMARY = "#8ad007";

export default function JobRequestModal({ isOpen = true, onClose,workerData}) {

  const dispatch = useDispatch();
  const {loading,error} = useSelector((state)=>state.employer);

  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError,setLocalError] = useState('')
  const fileInputRef = useRef(null);

  const workerID = workerData?.id;
  const workerName = workerData?.name || "Worker";
  const workerAvatar = workerData?.avatar || "";
  const workerRate = workerData?.base_Pay || "0";
  const wokerHourlyPay = workerData?.hourly_rate || "000";
  // If your worker object doesn't have a rating, you can default to 5.0 or use workerData.rating
  const workerRating = "5.0";

  if (!isOpen) return null;

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setLocalError("Only image files are allowed.");
        return;
      }
      setImageFile(file);
      setLocalError('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setLocalError("Only image files are allowed.");
        e.target.value = "";
        return;
      }
      setImageFile(file);
      setLocalError('');
    }
  };

  const handleSend = async () => {
    // 1. Validation check
    if (!imageFile || !location || !description) {
        setLocalError('Please fill the necessary data!');
        return;
    }

    // 2. Clear local errors before starting
    setLocalError('');

    // 3. Prepare FormData
    const formData = new FormData();
    formData.append('worker', workerID);
    formData.append('project_image', imageFile);
    formData.append('city', location);
    formData.append('description', description);

    try {
        // Start a timer for 2 seconds
        const timer = new Promise((resolve) => setTimeout(resolve, 2000));

        // Dispatch the action AND wait for the timer simultaneously
        // This ensures the spinner stays for at least 2 seconds
        await Promise.all([
            dispatch(SendJobRequest(formData)).unwrap(),
            timer
        ]);

        // 4. On Success: Close the modal
        onClose(); 
    } catch (err) {
        // Errors are already handled by your Redux selector (error)
        console.error("Failed to send request:", err);
    }
};

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(17,24,39,0.6)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "480px",
          background: "#fff",
          borderRadius: "1.75rem",
          boxShadow: "0 24px 60px rgba(0,0,0,0.15)",
          overflow: "hidden",
          border: "1px solid #f3f4f6",
        }}
      >
        {/* Decorative icon */}
        <div
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            color: PRIMARY,
            opacity: 0.15,
            fontSize: "1.5rem",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          ✦
        </div>

        <div style={{ padding: "1.75rem" }}>
          {/* Worker Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
                {workerAvatar ? (
                    <img
                        src={workerAvatar}
                        alt={workerName}
                        style={{ width: "4rem", height: "4rem", borderRadius: "50%", objectFit: "cover", border: `3px solid ${PRIMARY}1a` }}
                    />
                ) : (
                    <div style={{ width: "4rem", height: "4rem", borderRadius: "50%", background: `${PRIMARY}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: PRIMARY, fontWeight: 800 }}>
                        {workerName.charAt(0)}
                    </div>
                )}
              <div
                style={{
                  position: "absolute",
                  bottom: "-3px",
                  right: "-3px",
                  background: PRIMARY,
                  color: "#fff",
                  width: "1.25rem",
                  height: "1.25rem",
                  borderRadius: "50%",
                  border: "3px solid #fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.48rem",
                  fontWeight: 800,
                }}
              >
                ✓
              </div>
            </div>
            <div>
              <h2
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  color: "#111827",
                  marginBottom: "0.2rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {workerName}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.2rem",
                    color: PRIMARY,
                    fontWeight: 700,
                    fontSize: "0.72rem",
                  }}
                >
                  ★ {workerRating}
                </span>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#d1d5db" }} />
                <span style={{ color: "#111827", fontWeight: 700, fontSize: "0.72rem" }}>
                ₹{workerRate}
                  <span style={{ color: "#6b7280", fontWeight: 500, fontSize: "0.65rem" }}>/hr</span>
                </span>

                <span style={{ color: "#111827", fontWeight: 700, fontSize: "0.72rem", marginLeft:'120px'}}>
                  <span style={{color:'gray',fontWeight:200,fontSize:'10px'}}>Base Pay -</span> ₹{wokerHourlyPay}
                  <span style={{ color: "#6b7280", fontWeight: 500, fontSize: "0.65rem" }}>/hr</span>
                </span>
                
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Image Upload */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "#374151",
                  marginBottom: "0.35rem",
                }}
              >
                Upload Project Image
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                style={{
                  width: "100%",
                  padding: "1.25rem",
                  border: `2px dashed ${dragOver ? PRIMARY : "#e5e7eb"}`,
                  borderRadius: "0.75rem",
                  background: dragOver ? `${PRIMARY}08` : "#f9fafb",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.3rem",
                  cursor: "pointer",
                  transition: "border-color 0.2s, background 0.2s",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    width: "2.25rem",
                    height: "2.25rem",
                    borderRadius: "50%",
                    background: `${PRIMARY}1a`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "0.15rem",
                    fontSize: "0.95rem",
                  }}
                >
                  📷
                </div>
                {imageFile ? (
                  <p style={{ fontSize: "0.68rem", fontWeight: 700, color: PRIMARY }}>{imageFile.name}</p>
                ) : (
                  <>
                    <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151" }}>
                      Click to upload or drag and drop
                    </p>
                    <p style={{ fontSize: "0.6rem", color: "#9ca3af" }}>PNG or JPG (max. 10MB)</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "#374151",
                  marginBottom: "0.35rem",
                }}
              >
                City / Location
              </label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    fontSize: "0.875rem",
                    pointerEvents: "none",
                  }}
                >
                  📍
                </span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  style={{
                    width: "100%",
                    paddingLeft: "2.5rem",
                    paddingRight: "0.875rem",
                    paddingTop: "0.7rem",
                    paddingBottom: "0.7rem",
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.65rem",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    fontFamily: "'Manrope', sans-serif",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "#374151",
                  marginBottom: "0.35rem",
                }}
              >
                Job Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the project details, expectations, and timeline..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.7rem 0.875rem",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.65rem",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  fontFamily: "'Manrope', sans-serif",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
          <button
            onClick={handleSend}
            disabled={loading} // Prevent double-clicking
            style={{
                flex: 1,
                background: loading ? `${PRIMARY}b3` : PRIMARY, // Gray out if loading
                color: "#fff",
                fontWeight: 800,
                fontSize: "0.78rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.75rem",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : `0 8px 24px ${PRIMARY}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
            }}
            >
            {loading ? (
                <>
                <Spinner/>
                Processing...
                </>
            ) : (
                "Send Request"
            )}
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                background: "#f3f4f6",
                color: "#374151",
                fontWeight: 800,
                fontSize: "0.78rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.75rem",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Manrope', sans-serif",
                transition: "background 0.15s, transform 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#e5e7eb")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#f3f4f6")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Cancel
            </button>

          </div>
          {(error || localError) && (
                <p className="mt-2 text-[9px] text-red-500 text-center font-bold uppercase">{error || localError}</p>
            )}
        </div>
      </div>
    </div>
  );
}