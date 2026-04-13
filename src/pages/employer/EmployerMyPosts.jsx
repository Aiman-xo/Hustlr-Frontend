import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchMyJobPosts, DeleteJobPost } from "../../redux/slice/employerSlice";
import { toast } from "react-toastify";

// Modern green theme
const PRIMARY = "#8ad007";

export default function EmployerMyPosts() {
  const dispatch = useDispatch();
  const { myJobPosts, loading } = useSelector((state) => state.employer);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    dispatch(FetchMyJobPosts());
  }, [dispatch]);

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    try {
      await dispatch(DeleteJobPost(postToDelete.id)).unwrap();
      toast.success("Job post deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete post.");
    } finally {
      setDeleteModalOpen(false);
      setPostToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setPostToDelete(null);
  };

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", background: "#f9fafb", minHeight: "100%", padding: "24px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Header */}
        <header style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#161811", margin: 0 }}>My Posts</h1>
            <p style={{ color: "#7c8c5f", fontSize: 13, marginTop: 4 }}>Manage and view all your active job postings.</p>
          </div>
        </header>

        {/* Content */}
        {loading ? (
           <p style={{ textAlign: "center", color: "#7c8c5f", marginTop: 40 }}>Loading posts...</p>
        ) : myJobPosts.length === 0 ? (
           <div style={{ textAlign: "center", padding: "60px 0", background: "#fff", borderRadius: 16, border: "1px solid #e2e6db" }}>
             <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#c8d8a0", marginBottom: 12 }}>grid_view</span>
             <p style={{ color: "#7c8c5f", fontWeight: 600 }}>No posts created yet.</p>
           </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 16
          }}>
            {myJobPosts.map(post => (
              <div 
                key={post.id} 
                style={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "#eee",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                }}
                className="group relative"
              >
                {/* Image */}
                <img 
                  src={post.job_image || "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"} 
                  alt={post.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                {/* Info Bar (shows at bottom constantly) */}
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                  padding: "20px 12px 10px",
                  color: "#fff"
                }}>
                  <h3 style={{ fontSize: 13, fontWeight: 800, margin: "0 0 2px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: 10, margin: 0, opacity: 0.9 }}>{post.city}</p>
                </div>

                {/* Hover Overlay with Delete Button */}
                <div 
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
                >
                  <button 
                    onClick={() => handleDeleteClick(post)}
                    style={{
                      background: "#ef4444", // Red for destructive
                      color: "#fff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: 20,
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)"
                    }}
                    className="hover:scale-105 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                    Delete Post
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            background: "#fff", padding: 32, borderRadius: 20, width: "100%", maxWidth: 360,
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)", textAlign: "center"
          }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <span className="material-symbols-outlined" style={{ color: "#ef4444", fontSize: 28 }}>warning</span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#161811", margin: "0 0 8px 0" }}>Delete Job Post?</h3>
            <p style={{ fontSize: 13, color: "#7c8c5f", margin: "0 0 24px 0", lineHeight: 1.5 }}>
              Are you sure you want to delete <strong>"{postToDelete?.title}"</strong>? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button 
                onClick={cancelDelete}
                style={{
                  flex: 1, padding: "10px", borderRadius: 12, border: "1.5px solid #e2e6db", background: "#fff",
                  color: "#4a5e1f", fontWeight: 700, fontSize: 13, cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                style={{
                  flex: 1, padding: "10px", borderRadius: 12, border: "none", background: PRIMARY,
                  color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer"
                }}
                className="hover:opacity-90 active:scale-95 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
