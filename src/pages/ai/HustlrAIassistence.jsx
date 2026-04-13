import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import JobRequestModal from "../employer/Modals/SendRequestModal";
import axios from "axios";
import api from "../../api/axiosInstance";
import ReactMarkdown from "react-markdown";
import { toast } from 'react-toastify';
import { Icons } from './AIicons';
import { SendInterest } from '../../redux/slice/workerSlice';

// ─── Typing indicator ──────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{ animationDelay: `${i * 0.15}s` }}
          className="w-2 h-2 rounded-full bg-[#89d006] animate-bounce"
        />
      ))}
    </div>
  );
}

function JobCard({ job, onInterestClick }) {
  const [isSending, setIsSending] = useState(false);

  const handleClick = async () => {
    setIsSending(true);
    await onInterestClick(job);
    setIsSending(false);
  };

  return (
    <div className="group relative flex flex-col gap-3 p-4 bg-white border border-[#89d006]/20 rounded-2xl shadow-sm hover:shadow-md hover:border-[#89d006] transition-all duration-300">
      {/* Job Image */}
      {(job.job_image || job.project_image) && (
        <div className="w-full h-32 rounded-lg overflow-hidden mb-1 ring-1 ring-gray-100">
          <img
            src={job.job_image || job.project_image}
            alt={job.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x200?text=Job+Image';
              e.target.onerror = null;
            }}
          />
        </div>
      )}

      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#89d006] transition-colors line-clamp-1">{job.title}</h4>
          <span className="text-[10px] font-bold text-[#89d006] bg-[#89d006]/10 px-2 py-0.5 rounded-full whitespace-nowrap">
            {job.type || "Job Post"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {job.avatar && (
            <img src={job.avatar} alt="" className="w-5 h-5 rounded-full bg-gray-100" />
          )}
          <span className="text-[11px] font-semibold text-gray-500">{job.employer_name}</span>
        </div>

        <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">{job.description}</p>
      </div>

      <button
        onClick={handleClick}
        disabled={isSending}
        className="w-full py-2 bg-[#89d006] hover:bg-[#89d006]/90 disabled:bg-gray-300 text-white text-xs font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-[#89d006]/20 flex items-center justify-center gap-2 mt-1"
      >
        {isSending && <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />}
        {isSending ? "Sending..." : "I'm interested"}
      </button>
    </div>
  );
}

function WorkerCard({ worker, onHireClick }) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-white border border-gray-100 hover:border-[#89d006]/40 hover:bg-[#89d006]/5 transition-all group shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative">
          {worker.avatar ? (
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#89d006]/10 text-[#89d006] flex items-center justify-center font-bold border border-[#89d006]/20">
              {worker.name?.charAt(0)}
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#89d006] border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-900 truncate">{worker.name}</p>
            <span className="text-[10px] font-bold text-[#89d006]">Verified</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Icons.Star />
            <span className="text-xs font-semibold text-gray-700">{worker.rating || "5.0"}</span>
            <span className="text-[10px] text-gray-400">• {worker.jobs || "20+"} jobs</span>
          </div>
        </div>
      </div>

      {worker.bio && (
        <p className="text-xs text-gray-600 line-clamp-2 italic leading-relaxed">"{worker.bio}"</p>
      )}

      {worker.skills && worker.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {worker.skills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="text-[9px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-medium capitalize">
              {skill}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={() => onHireClick(worker)}
        className="w-full py-2 bg-white hover:bg-[#89d006] hover:text-white border border-[#89d006] text-[#89d006] text-xs font-bold rounded-lg transition-all active:scale-95 shadow-sm mt-1"
      >
        Send Hiring Request
      </button>
    </div>
  );
}

// ─── Message bubble (FIXED) ──────────────────────────────────────────────────
// Added 'userRole' to the props destructuring
function Message({ msg, onHireClick, onInterestClick, userRole }) {
  const isUser = msg.role === "user";
  const normalizedRole = userRole?.toLowerCase();

  return (
    <div className={`flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
      {!isUser && (
        <div className="flex items-center gap-1.5 mb-0.5">
          <div className="w-5 h-5 rounded-full bg-[#89d006]/20 text-[#89d006] flex items-center justify-center">
            <Icons.Sparkle />
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hustlr AI</span>
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
            ? "bg-[#89d006] text-white rounded-tr-sm font-medium shadow-md shadow-[#89d006]/20"
            : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm space-y-3"
          }`}
      >
        <div className="markdown-content prose prose-sm max-w-none prose-p:leading-relaxed prose-p:my-1 prose-strong:text-[#89d006] prose-strong:font-bold">
          <ReactMarkdown>{msg.text}</ReactMarkdown>
        </div>

        {/* Render Workers ONLY if user is employer AND workers exist in message */}
        {/* Render Workers - Only for Employers */}
        {msg.workers && msg.workers.length > 0 && normalizedRole === "employer" && (
          <div className="grid grid-cols-1 gap-3 pt-2">
            {msg.workers.map((w, idx) => (
              <WorkerCard key={w.id || `w-${idx}`} worker={w} onHireClick={onHireClick} />
            ))}
          </div>
        )}

        {/* Render Jobs - Only for Workers */}
        {msg.jobs && msg.jobs.length > 0 && normalizedRole === "worker" && (
          <div className="grid grid-cols-1 gap-3 pt-2">
            {msg.jobs.map((j, idx) => (
              <JobCard key={j.id || `j-${idx}`} job={j} onInterestClick={onInterestClick} />
            ))}
          </div>
        )}

      </div>
      <span className="text-[10px] text-gray-400 px-1">{msg.time}</span>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function HustlrAIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  const bottomRef = useRef(null);
  const dispatch = useDispatch();

  const { user, role: reduxRole } = useSelector((state) => state.auth);
  
  // Ultimate truth: Which dashboard is the user currently looking at?
  const path = window.location.pathname.toLowerCase();
  const urlRole = path.includes('/employer') ? 'employer' : (path.includes('/worker') ? 'worker' : null);

  // Bulletproof role detection: URL > Redux State > User Object > Fallback
  const currentRole = (urlRole || reduxRole || user?.role || user?.active_role || "worker").toLowerCase();
  const employerId = user?.id || 1;

  const QUICK_ACTIONS = currentRole === "worker"
    ? ["Available jobs nearby", "High paying cleaning tasks", "Electrical work"]
    : ["Find cleaners within 5km", "Find top-rated plumbers", "Plumber around me"];

  const handleOpenModal = (worker) => {
    setSelectedWorker(worker);
    setIsModalOpen(true);
  };

  const handleInterestClick = async (job) => {
    try {
      // Using Redux action instead of direct api call
      const response = await dispatch(SendInterest(job.id)).unwrap();
      toast.success("Interest sent successfully!");
    } catch (err) {
      console.error("Interest Error:", err);
      // err will be the rejected value from thunkApi.rejectWithValue
      const errorMsg = err?.error || "Failed to send interest.";
      toast.error(errorMsg);
    }
  };

  // stop pulsing the FAB after first open
  useEffect(() => { if (open) setPulse(false); }, [open]);

  useEffect(() => {
    // Only set the initial message if there are no messages yet
    if (messages.length === 0 && currentRole) {
      const isWorker = currentRole === "worker";

      const greeting = {
        id: "greeting",
        role: "ai",
        text: isWorker
          ? `Hello ${user?.name || "there"}! I'm your Hustlr AI. I can help you find high-paying jobs nearby and summarize the requirements. What kind of work are you looking for?`
          : `Hello ${user?.name || "there"}! I'm your Hustlr AI. I can help you find reliable workers nearby and summarize their experience. How can I assist you today?`,
        time: "Just now"
      };

      setMessages([greeting]);
    }
  }, [user, messages.length, currentRole]);

  // auto-scroll to bottom
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  // close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: text.trim(), time: now }]);
    setInput("");
    setLoading(true);

    try {
      console.log("AI Search Debug:", { query: text.trim(), user_id: user?.id, role: currentRole });

      const res = await axios.get(`http://127.0.0.1/ai/search`, {
        params: {
          query: text.trim(),
          user_id: user?.id,
          role: currentRole,
        }
      });

      const data = res.data;
      console.log("AI Search Response:", data);

      let reply = "I found some potential matches, but I'm having trouble summarizing them right now.";

      if (data.answer) {
        if (typeof data.answer === 'string') {
          reply = data.answer;
        } else if (Array.isArray(data.answer)) {
          // Handle structured response (Gemini content blocks)
          reply = data.answer.map(block => {
            if (typeof block === 'string') return block;
            if (block.text) return block.text;
            return "";
          }).join("");
        }
      }

      const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        role: "ai",
        text: reply,
        workers: data.workers || [], // Store the metadata for rendering cards
        jobs: data.jobs || [],
        time: replyTime
      }]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: "I'm having trouble connecting to the AI service right now. Please make sure the service is running.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <>
      {/* ── Backdrop (mobile) ─────────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Side Panel ────────────────────────────────────────────────────────── */}
      <div
        style={{ fontFamily: "'Manrope', sans-serif" }}
        className={`fixed top-0 right-0 h-full w-[400px] max-w-full bg-white shadow-2xl border-l border-gray-100 z-50 flex flex-col transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#89d006] rounded-lg flex items-center justify-center text-white shadow-md shadow-[#89d006]/30">
              <Icons.Bot />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 leading-none">AI Hustlr Assistant</h2>
              <span className="text-[10px] text-[#89d006] font-semibold">● Online</span>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Icons.Close />
          </button>
        </div>

        {/* Scrollable chat area */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 scroll-smooth"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}>

          {/* Quick Actions */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quick Actions</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => sendMessage(action)}
                  className="px-3 py-1.5 text-xs font-semibold bg-gray-50 hover:bg-[#89d006]/10 border border-gray-200 hover:border-[#89d006]/40 text-gray-600 hover:text-[#6aaa00] rounded-lg transition-all"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          {messages.map((msg) => (
              <Message
                key={msg.id}
                msg={msg}
                onHireClick={handleOpenModal}
                onInterestClick={handleInterestClick}
                userRole={currentRole}
              />
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex flex-col items-start gap-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#89d006]/20 text-[#89d006] flex items-center justify-center">
                  <Icons.Sparkle />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hustlr AI</span>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm">
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="px-4 py-4 border-t border-gray-100 bg-white/90 backdrop-blur-md">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 focus-within:border-[#89d006]/60 focus-within:bg-white rounded-xl px-3 py-2 transition-all shadow-sm">
            <button className="text-gray-400 hover:text-[#89d006] transition-colors shrink-0">
              <Icons.Attach />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder:text-gray-400 min-w-0"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-8 h-8 shrink-0 bg-[#89d006] hover:bg-[#7bc005] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-all active:scale-95 shadow shadow-[#89d006]/30"
            >
              <Icons.Send />
            </button>
          </div>
          <p className="text-center text-[9px] text-gray-400 uppercase tracking-widest font-medium mt-2">
            Hustlr Intelligence Model v2.4
          </p>
        </div>
      </div>

      {/* ── Floating Action Button ─────────────────────────────────────────────── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#89d006] hover:bg-[#7bc005] text-white rounded-2xl shadow-xl shadow-[#89d006]/40 flex items-center justify-center transition-all active:scale-95 hover:scale-105"
          style={{
            animation: pulse ? "fabPulse 2s ease-in-out infinite" : "none",
          }}
          aria-label="Open AI Assistant"
        >
          <Icons.Bot />
          {/* Unread badge */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow">
            2
          </span>
        </button>
      )}

      {/* FAB pulse animation */}
      <style>{`
        @keyframes fabPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(137, 208, 6, 0.5); }
          50% { box-shadow: 0 0 0 12px rgba(137, 208, 6, 0); }
        }
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Hire Modal */}
      <JobRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workerData={selectedWorker}
      />
    </>
  );
}