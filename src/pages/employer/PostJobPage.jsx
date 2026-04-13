import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PostJob } from "../../redux/slice/employerSlice";
import { FetchSkill } from "../../redux/slice/profileSlice";
import { toast } from "react-toastify";

const PRIMARY = "#8ad007";

export default function PostJobPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { postJobLoading,loading } = useSelector((state) => state.employer);
  const { skills } = useSelector((state) => state.profile);
  const fileRef = useRef(null);

  const [form, setForm] = useState({ title: "", description: "", city: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [skillSearch, setSkillSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    if (skillSearch.trim() === '') return;
    const timer = setTimeout(() => {
        dispatch(FetchSkill(skillSearch));
    }, 400);
    return () => clearTimeout(timer);
  }, [skillSearch, dispatch]);

  const handleSkillRemove = (id) => setSelectedSkills(prev => prev.filter(s => s.id !== id));
  
  const handleSkillAdd = (skillObj) => {
      if (selectedSkills.find(s => s.id === skillObj.id)) return;
      setSelectedSkills(prev => [...prev, skillObj]);
      setSkillSearch('');
  };

  const filteredSkills = (skills || []).filter(
      skill => !selectedSkills.some(s => s.id === skill.id)
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error("Only image files (JPG, PNG, etc.) are allowed.");
      e.target.value = "";
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error("Only image files (JPG, PNG, etc.) are allowed.");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.city || selectedSkills.length ==0 || !image) {
      toast.error("Please fill all required fields.");
      return;
    }
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("city", form.city);
    if (image) formData.append("job_image", image);
    
    selectedSkills.forEach(skill => {
        formData.append("required_skills", skill.id);
    });

    try {
      const result = await dispatch(PostJob(formData)).unwrap();
      toast.success("Job posted successfully!");
      navigate("/employer/dashboard");
    } catch (err) {
      toast.error(err?.detail || err?.message || "Failed to post job.");
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Manrope', sans-serif",
        minHeight: "100vh",
        background: "#f8faf4",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 680 }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#7c8c5f",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              arrow_back
            </span>
            Back
          </button>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, color: "#161811" }}>
            Post a Job
          </h1>
          <p style={{ color: "#7c8c5f", fontSize: 13, marginTop: 6 }}>
            Fill in the details below. Workers nearby will see and apply to your post.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current.click()}
            style={{
              border: `2px dashed ${preview ? PRIMARY : "#c8d8a0"}`,
              borderRadius: 20,
              background: preview ? "transparent" : "#f0f5e6",
              height: 220,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              overflow: "hidden",
              marginBottom: 24,
              position: "relative",
              transition: "all 0.2s",
            }}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.2s",
                  }}
                  className="img-hover-overlay"
                >
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>
                    Click to change
                  </span>
                </div>
              </>
            ) : (
              <>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 40, color: PRIMARY, marginBottom: 10 }}
                >
                  add_photo_alternate
                </span>
                <p style={{ fontWeight: 700, fontSize: 14, color: "#4a5e1f", margin: 0 }}>
                  Upload a job image
                </p>
                <p style={{ fontSize: 12, color: "#7c8c5f", margin: "4px 0 0" }}>
                  Drag & drop or click to browse
                </p>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>

          {/* Card */}
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              padding: "28px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Title */}
            <div>
              <label
                style={{ fontSize: 12, fontWeight: 700, color: "#4a5e1f", marginBottom: 6, display: "block" }}
              >
                Job Title <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. House Cleaning, Plumbing Repair"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1.5px solid #e2e6db",
                  fontSize: 14,
                  fontFamily: "inherit",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border 0.2s",
                }}
                onFocus={(e) => (e.target.style.border = `1.5px solid ${PRIMARY}`)}
                onBlur={(e) => (e.target.style.border = "1.5px solid #e2e6db")}
              />
            </div>

            {/* Description */}
            <div>
              <label
                style={{ fontSize: 12, fontWeight: 700, color: "#4a5e1f", marginBottom: 6, display: "block" }}
              >
                Job Description <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                rows={5}
                placeholder="Describe the task, requirements, and any special instructions..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1.5px solid #e2e6db",
                  fontSize: 14,
                  fontFamily: "inherit",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                  transition: "border 0.2s",
                }}
                onFocus={(e) => (e.target.style.border = `1.5px solid ${PRIMARY}`)}
                onBlur={(e) => (e.target.style.border = "1.5px solid #e2e6db")}
              />
            </div>

            {/* City */}
            <div>
              <label
                style={{ fontSize: 12, fontWeight: 700, color: "#4a5e1f", marginBottom: 6, display: "block" }}
              >
                City <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 18,
                    color: "#7c8c5f",
                  }}
                >
                  location_on
                </span>
                <input
                  type="text"
                  placeholder="e.g. Kochi, Thrissur"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 16px 12px 42px",
                    borderRadius: 12,
                    border: "1.5px solid #e2e6db",
                    fontSize: 14,
                    fontFamily: "inherit",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.border = `1.5px solid ${PRIMARY}`)}
                  onBlur={(e) => (e.target.style.border = "1.5px solid #e2e6db")}
                />
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <label
                style={{ fontSize: 12, fontWeight: 700, color: "#4a5e1f", marginBottom: 6, display: "block" }}
              >
                Required Skills
              </label>

              {/* Selected Skills */}
              {selectedSkills.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                  {selectedSkills.map((skill) => (
                    <div
                      key={skill.id}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: PRIMARY,
                        color: "#fff",
                        padding: "6px 12px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {skill.name}
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 14, cursor: "pointer" }}
                        onClick={() => handleSkillRemove(skill.id)}
                      >
                        close
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Search Skills Input */}
              <div style={{ position: "relative" }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 18,
                    color: "#7c8c5f",
                  }}
                >
                  bolt
                </span>
                <input
                  type="text"
                  placeholder="Search and add required skills..."
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px 12px 42px",
                    borderRadius: 12,
                    border: "1.5px solid #e2e6db",
                    fontSize: 14,
                    fontFamily: "inherit",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.border = `1.5px solid ${PRIMARY}`)}
                  onBlur={(e) => (e.target.style.border = "1.5px solid #e2e6db")}
                />
              </div>

              {/* Skills Dropdown */}
              {skillSearch.trim() && filteredSkills.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
                  {filteredSkills.map((skillObj) => (
                    <div
                      key={skillObj.id}
                      onClick={() => handleSkillAdd(skillObj)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        background: "#f0f5e6",
                        color: "#4a5e1f",
                        padding: "6px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        border: "1px solid transparent",
                        alignSelf: "flex-start",
                      }}
                      onMouseEnter={(e) => (e.target.style.border = `1px solid ${PRIMARY}`)}
                      onMouseLeave={(e) => (e.target.style.border = "1px solid transparent")}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14, pointerEvents:"none" }}>add</span>
                      {skillObj.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={postJobLoading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 14,
                background: postJobLoading ? "#c8d8a0" : PRIMARY,
                border: "none",
                color: "#fff",
                fontSize: 14,
                fontWeight: 800,
                cursor: postJobLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "background 0.2s, transform 0.1s",
                boxShadow: `0 4px 14px ${PRIMARY}40`,
              }}
              onMouseEnter={(e) => !loading && (e.target.style.transform = "scale(1.01)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid #fff",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Posting...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    send
                  </span>
                  Post Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
