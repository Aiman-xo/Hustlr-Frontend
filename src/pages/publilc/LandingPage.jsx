import React, { useEffect, useRef,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ── Hustlr Logo SVG ──────────────────────────────────────────────────────────
const HustlrLogo = ({ size = 32, rounded = "rounded-xl" }) => (
  <div className={`bg-[#89cf07] ${rounded} flex items-center justify-center shadow-lg shadow-[#89cf07]/30`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: size * 0.65, height: size * 0.65 }}>
      <g transform="translate(50, 50)">
        <circle cx="0" cy="0" r="7" fill="#fff" />
        <rect x="-3.5" y="-30" width="7" height="23" rx="3.5" fill="#fff" />
        <rect x="-3.5" y="7" width="7" height="23" rx="3.5" fill="#fff" />
        <rect x="-30" y="-3.5" width="23" height="7" rx="3.5" fill="#fff" />
        <rect x="7" y="-3.5" width="23" height="7" rx="3.5" fill="#fff" />
        <rect x="-3.5" y="-23" width="7" height="17" rx="3.5" fill="#fff" transform="rotate(45 0 0)" />
        <rect x="-3.5" y="-23" width="7" height="17" rx="3.5" fill="#fff" transform="rotate(135 0 0)" />
        <rect x="-3.5" y="-23" width="7" height="17" rx="3.5" fill="#fff" transform="rotate(225 0 0)" />
        <rect x="-3.5" y="-23" width="7" height="17" rx="3.5" fill="#fff" transform="rotate(315 0 0)" />
      </g>
    </svg>
  </div>
);

// ── Custom SVG Icons ────────────────────────────────────────────────────────
const UserIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8ad007" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="8" r="5"/><path d="M2 20c0-6 20-6 20 0"/>
  </svg>
);

const CheckIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8ad007" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="4"/><polyline points="7,12 10,16 17,8"/>
  </svg>
);

const MoneyIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8ad007" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><text x="12" y="17" fontSize="13" fontWeight="600" fill="#8ad007" textAnchor="middle" stroke="none">₹</text>
  </svg>
);

const ShieldIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8ad007" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L22 7v6c0 6-5 10-10 12C7 23 2 19 2 13V7z"/><polyline points="9,12 11,14 16,9"/>
  </svg>
);

const BoltIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8ad007" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
  </svg>
);

const NetworkIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8ad007" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/>
    <line x1="12" y1="8" x2="5" y2="16"/><line x1="12" y1="8" x2="19" y2="16"/>
    <line x1="8" y1="19" x2="16" y2="19"/>
  </svg>
);

const MiniBoltIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8ad007" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
  </svg>
);

const BriefcaseIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8ad007" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="3"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="2" y1="13" x2="22" y2="13"/>
  </svg>
);

const HustlrLanding = () => {
  const nav = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: '50k+',
    jobsCompleted: '200k+',
    totalPayouts: '₹12M+',
    activeJobs: '2,400+',
    averageRating: '4.9 ★'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await axios.get(`${apiUrl}/api/platform-stats/`);
        const data = response.data;
        
        setStats({
          totalUsers: data.total_users > 1000 ? (data.total_users / 1000).toFixed(1) + 'k+' : data.total_users,
          jobsCompleted: data.jobs_completed > 1000 ? (data.jobs_completed / 1000).toFixed(1) + 'k+' : data.jobs_completed,
          totalPayouts: data.total_payouts > 1000 ? '₹' + (data.total_payouts / 1000).toFixed(1) + 'k+' : '₹' + data.total_payouts,
          activeJobs: data.active_jobs,
          averageRating: data.average_rating + ' ★'
        });
      } catch (error) {
        console.error("Error fetching platform stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", background: '#f8f9f5', color: '#1c230f', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
          pointer-events: none;
        }

        .feature-card {
          background: #fff;
          border: 1px solid rgba(137, 207, 7, 0.12);
          border-radius: 24px;
          padding: 36px 32px;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #89cf07, transparent);
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(137, 207, 7, 0.12);
          border-color: rgba(137, 207, 7, 0.3);
        }

        .feature-card:hover::before {
          opacity: 1;
        }

        .stat-item {
          text-align: center;
          padding: 28px 20px;
        }

        .pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(137, 207, 7, 0.08);
          border: 1px solid rgba(137, 207, 7, 0.2);
          border-radius: 100px;
          color: #5a9200;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .ping-dot {
          position: relative;
          display: flex;
          width: 8px;
          height: 8px;
        }

        .ping-dot span:first-child {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          position: absolute;
          display: inline-flex;
          border-radius: 50%;
          width: 100%;
          height: 100%;
          background: #89cf07;
          opacity: 0.6;
        }

        .ping-dot span:last-child {
          position: relative;
          display: inline-flex;
          border-radius: 50%;
          width: 8px;
          height: 8px;
          background: #89cf07;
        }

        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }

        .hero-image-wrap {
          position: relative;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(28, 35, 15, 0.15), 0 0 0 1px rgba(137, 207, 7, 0.15);
        }

        .hero-image-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(28,35,15,0.55) 0%, transparent 50%);
        }

        .glass-card {
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 16px;
          padding: 14px 18px;
        }

        .btn-primary {
          background: #89cf07;
          color: #fff;
          font-weight: 800;
          font-size: 14px;
          padding: 14px 32px;
          border-radius: 100px;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(137,207,7,0.35);
          transition: all 0.25s ease;
          letter-spacing: 0.01em;
        }

        .btn-primary:hover {
          background: #7bbf00;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(137,207,7,0.45);
        }

        .btn-secondary {
          background: rgba(28,35,15,0.05);
          color: #1c230f;
          font-weight: 700;
          font-size: 14px;
          padding: 14px 32px;
          border-radius: 100px;
          border: 1.5px solid rgba(28,35,15,0.12);
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .btn-secondary:hover {
          background: rgba(28,35,15,0.08);
          border-color: rgba(28,35,15,0.2);
        }

        .floating-card {
          position: absolute;
          background: #fff;
          border-radius: 18px;
          padding: 12px 16px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 10px;
          animation: floatY 4s ease-in-out infinite;
        }

        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .divider-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, transparent, rgba(28,35,15,0.12), transparent);
        }

        .footer-link {
          color: #71717a;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
          text-decoration: none;
        }

        .footer-link:hover {
          color: #89cf07;
        }

        .how-step {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(137,207,7,0.1);
          border: 1px solid rgba(137,207,7,0.2);
          color: #5a9200;
          font-weight: 900;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      `}</style>

      {/* ── Navigation ───────────────────────────────────────────────── */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '18px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <HustlrLogo size={34} />
            <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.02em' }}>Hustlr</span>
          </div>
        </div>
      </header>

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 90, paddingBottom: 60, overflow: 'hidden' }}>
        {/* Background blobs */}
        <div className="blob" style={{ width: 600, height: 600, background: '#89cf07', top: '-200px', left: '-100px' }} />
        <div className="blob" style={{ width: 400, height: 400, background: '#b5e64a', bottom: '-100px', right: '-80px' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

            {/* Left: Text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div className="pill-badge">
                <span className="ping-dot"><span /><span /></span>
                {stats.activeJobs} Active Gigs Live
              </div>

              <h1 style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', margin: 0 }}>
                Hire Talent.<br />
                Get Work.<br />
                <span style={{ color: '#89cf07' }}>Instantly.</span>
              </h1>

              <p style={{ fontSize: 17, color: '#52525b', lineHeight: 1.7, margin: 0, maxWidth: 420, fontWeight: 500 }}>
                The high-velocity marketplace connecting verified professionals with ambitious projects — no middlemen, no delays.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="btn-primary" onClick={() => nav('/role')}>Get Started — It's Free</button>
                <button className="btn-secondary" onClick={() => nav('/login')}>Sign In</button>
              </div>

              {/* Social proof */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 8 }}>
                <div style={{ display: 'flex', marginRight: 4 }}>
                  {['#a8c070', '#89cf07', '#6aaa00', '#b5e64a'].map((c, i) => (
                    <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid #f8f9f5', marginLeft: i > 0 ? -8 : 0 }} />
                  ))}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1c230f' }}>{stats.totalUsers} Hustlrs</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#71717a', fontWeight: 500 }}>already on the platform</p>
                </div>
              </div>
            </div>

            {/* Right: Hero Visual — Branded SVG Illustration */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'relative',
                borderRadius: 32,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #1c230f 0%, #2a3512 60%, #1c230f 100%)',
                aspectRatio: '4/3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 40px 100px rgba(28, 35, 15, 0.2), 0 0 0 1px rgba(137, 207, 7, 0.2)',
              }}>
                <div style={{ position: 'absolute', width: 350, height: 350, background: '#89cf07', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />

                <svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg" style={{ width: '90%', maxWidth: 440 }}>
                  {[...Array(8)].map((_, row) =>
                    [...Array(10)].map((_, col) => (
                      <circle key={`${row}-${col}`} cx={24 + col * 48} cy={20 + row * 46} r="1.5" fill="rgba(137,207,7,0.15)" />
                    ))
                  )}

                  <rect x="110" y="60" width="260" height="240" rx="20" fill="rgba(255,255,255,0.04)" stroke="rgba(137,207,7,0.25)" strokeWidth="1" />
                  <rect x="110" y="60" width="260" height="48" rx="20" fill="rgba(137,207,7,0.08)" />
                  <rect x="110" y="88" width="260" height="20" fill="rgba(137,207,7,0.08)" />
                  <circle cx="136" cy="84" r="6" fill="rgba(255,255,255,0.15)" />
                  <circle cx="154" cy="84" r="6" fill="rgba(255,255,255,0.1)" />
                  <circle cx="172" cy="84" r="6" fill="rgba(255,255,255,0.07)" />

                  <g transform="translate(240, 185)">
                    <rect x="-34" y="-34" width="68" height="68" rx="18" fill="#89cf07" />
                    <circle cx="0" cy="0" r="7" fill="#fff" />
                    <rect x="-3.5" y="-28" width="7" height="20" rx="3.5" fill="#fff" />
                    <rect x="-3.5" y="8" width="7" height="20" rx="3.5" fill="#fff" />
                    <rect x="-28" y="-3.5" width="20" height="7" rx="3.5" fill="#fff" />
                    <rect x="8" y="-3.5" width="20" height="7" rx="3.5" fill="#fff" />
                    <rect x="-3.5" y="-22" width="7" height="15" rx="3.5" fill="#fff" transform="rotate(45 0 0)" />
                    <rect x="-3.5" y="-22" width="7" height="15" rx="3.5" fill="#fff" transform="rotate(135 0 0)" />
                    <rect x="-3.5" y="-22" width="7" height="15" rx="3.5" fill="#fff" transform="rotate(225 0 0)" />
                    <rect x="-3.5" y="-22" width="7" height="15" rx="3.5" fill="#fff" transform="rotate(315 0 0)" />
                  </g>

                  <text x="240" y="246" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="13" fontWeight="800" fontFamily="Manrope, sans-serif" letterSpacing="0.5">Hustlr</text>
                  <text x="240" y="262" textAnchor="middle" fill="rgba(137,207,7,0.7)" fontSize="9" fontWeight="700" fontFamily="Manrope, sans-serif" letterSpacing="2">FREELANCE PLATFORM</text>

                  <rect x="130" y="120" width="88" height="28" rx="8" fill="rgba(137,207,7,0.12)" stroke="rgba(137,207,7,0.2)" strokeWidth="0.8" />
                  <text x="174" y="138" textAnchor="middle" fill="#89cf07" fontSize="9" fontWeight="800" fontFamily="Manrope, sans-serif">✓ VERIFIED PRO</text>
                  <rect x="262" y="120" width="88" height="28" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                  <text x="306" y="138" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontWeight="700" fontFamily="Manrope, sans-serif">⚡ INSTANT PAY</text>

                  {[
                    { x1: 206, y1: 170, x2: 68, y2: 120 },
                    { x1: 206, y1: 185, x2: 60, y2: 210 },
                    { x1: 274, y1: 170, x2: 412, y2: 120 },
                    { x1: 274, y1: 185, x2: 420, y2: 210 },
                  ].map((line, i) => (
                    <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="rgba(137,207,7,0.2)" strokeWidth="1" strokeDasharray="4,4" />
                  ))}

                  {[
                    { cx: 56, cy: 108, color: '#89cf07', label: 'Designer' },
                    { cx: 44, cy: 218, color: '#6aaa00', label: 'Dev' },
                    { cx: 424, cy: 108, color: '#b5e64a', label: 'Writer' },
                    { cx: 436, cy: 218, color: '#89cf07', label: 'Manager' },
                  ].map((node, i) => (
                    <g key={i}>
                      <circle cx={node.cx} cy={node.cy} r="22" fill="rgba(255,255,255,0.04)" stroke={node.color} strokeWidth="1.5" />
                      <circle cx={node.cx} cy={node.cy} r="13" fill={node.color} opacity="0.25" />
                      <text x={node.cx} y={node.cy + 5} textAnchor="middle" fill={node.color} fontSize="12" fontWeight="900" fontFamily="Manrope, sans-serif">H</text>
                      <text x={node.cx} y={node.cy + 38} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="7" fontFamily="Manrope, sans-serif">{node.label}</text>
                    </g>
                  ))}

                  <rect x="130" y="278" width="220" height="6" rx="3" fill="rgba(255,255,255,0.06)" />
                  <rect x="130" y="278" width="154" height="6" rx="3" fill="#89cf07" opacity="0.6" />
                  <text x="130" y="298" fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="Manrope, sans-serif">Project Progress</text>
                  <text x="350" y="298" textAnchor="end" fill="#89cf07" fontSize="8" fontWeight="800" fontFamily="Manrope, sans-serif">70%</text>
                </svg>

                <div style={{ position: 'absolute', bottom: 24, left: 24, zIndex: 2 }}>
                  <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: '#89cf07', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
</svg>
                    </div>
                    <div>
                      <p style={{ margin: 0, color: '#89cf07', fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Just Matched</p>
                      <p style={{ margin: 0, color: '#fff', fontSize: 12, fontWeight: 700 }}>Workers</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stat card */}
              <div className="floating-card" style={{ top: 24, right: -20, animationDelay: '0s',borderRadius:"5px" }}>
                <div style={{ width: 36, height: 36, borderRadius: 4, background: 'rgba(137,207,7,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BriefcaseIcon size={20} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#1c230f', lineHeight: 1 }}>{stats.jobsCompleted}</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#71717a', fontWeight: 600 }}>Jobs Completed</p>
                </div>
              </div>

              {/* Floating rating card */}
              {/* <div className="floating-card" style={{ bottom: 60, left: -24, animationDelay: '2s' }}>
                <div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: '#89cf07', fontSize: 13 }}>★</span>
                    ))}
                  </div>
                  <p style={{ margin: 0, fontSize: 11, color: '#71717a', fontWeight: 600 }}>{stats.averageRating} avg rating</p>
                </div>
              </div> */}
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats Strip ──────────────────────────────────────────────── */}
      <section style={{ background: '#fff', borderTop: '1px solid rgba(28,35,15,0.06)', borderBottom: '1px solid rgba(28,35,15,0.06)', padding: '20px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0 }}>
          {[
            { label: 'Active Hustlrs', value: stats.totalUsers, icon: <UserIcon size={22} /> },
            { label: 'Jobs Completed', value: stats.jobsCompleted, icon: <CheckIcon size={22} /> },
            { label: 'Total Payouts', value: stats.totalPayouts, icon: <MoneyIcon size={22} /> },
          ].map((stat, i) => (
            <React.Fragment key={i}>
              <div className="stat-item" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ marginBottom: 12 }}>{stat.icon}</div>
                <p style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 900, color: '#1c230f', letterSpacing: '-0.02em' }}>{stat.value}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#71717a', fontWeight: 600, letterSpacing: '0.05em' }}>{stat.label}</p>
              </div>
              {i < 2 && <div className="divider-line" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── Features Section ─────────────────────────────────────────── */}
      <section style={{ padding: '100px 32px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="pill-badge" style={{ display: 'inline-flex', marginBottom: 20 }}>Why Hustlr?</div>
          <h2 style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.03em', margin: '0 auto 16px', lineHeight: 1.1 }}>
            Built for the way<br />people actually work
          </h2>
          <p style={{ color: '#71717a', fontSize: 16, maxWidth: 420, margin: '0 auto', lineHeight: 1.7 }}>
            No fluff, no delays. Just vetted talent, instant payouts, and real results.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            {
              icon: <ShieldIcon size={24} />,
              title: 'Vetted Professionals',
              desc: 'Every talent undergoes a multi-step reliability assessment before joining the platform.',
            },
            {
              icon: <BoltIcon size={24} />,
              title: 'Instant Pay',
              desc: 'Funds are released the moment milestones are approved. No waiting, no delays.',
            },
            {
              icon: <NetworkIcon size={24} />,
              title: 'Smart Matching',
              desc: 'Our AI connects you with the right talent or the right job, every single time.',
            },
          ].map((feat, i) => (
            <div key={i} className="feature-card">
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(137,207,7,0.08)', border: '1px solid rgba(137,207,7,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 24 }}>
                {feat.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.01em' }}>{feat.title}</h3>
              <p style={{ color: '#71717a', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it Works ─────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div className="pill-badge" style={{ marginBottom: 24 }}>How it Works</div>
            <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 48px', lineHeight: 1.1 }}>
              Up and running<br />in minutes
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
              {[
                { step: '1', title: 'Create your profile', desc: 'Sign up and tell us whether you\'re hiring or looking for work.' },
                { step: '2', title: 'Post or Browse', desc: 'Post a job opening or browse available gigs matched to your skills.' },
                { step: '3', title: 'Get to work', desc: 'Accept a request, complete the work, get paid. Simple as that.' },
              ].map((item) => (
                <div key={item.step} className="how-step">
                  <div className="step-number">{item.step}</div>
                  <div>
                    <p style={{ margin: '0 0 6px', fontWeight: 800, fontSize: 16, color: '#1c230f' }}>{item.title}</p>
                    <p style={{ margin: 0, color: '#71717a', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div style={{ background: 'linear-gradient(135deg, #1c230f 0%, #2d3a17 100%)', borderRadius: 32, padding: 48, display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: 300, height: 300, background: '#89cf07', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.12, top: -80, right: -80 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ color: '#89cf07', fontWeight: 800, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Start Today</p>
              <h3 style={{ color: '#fff', fontSize: 30, fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 16 }}>
                Your next opportunity is one click away
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
                Join thousands of professionals already earning and growing on Hustlr.
              </p>
              <button
                className="btn-primary"
                onClick={() => nav('/role')}
                style={{ width: '100%', textAlign: 'center' }}
              >
                Join Hustlr for Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer style={{ background: '#f8f9f5', borderTop: '1px solid rgba(28,35,15,0.06)', padding: '60px 32px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48, flexWrap: 'wrap', gap: 32 }}>
            <div style={{ maxWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <HustlrLogo size={30} rounded="rounded-lg" />
                <span style={{ fontWeight: 900, fontSize: 17 }}>Hustlr</span>
              </div>
              <p style={{ color: '#71717a', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                The modern standard for professional services. Secure, fast, and fair.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 60, flexWrap: 'wrap' }}>
              {[
                { title: 'Platform', links: ['Browse Jobs', 'Post a Job', 'Pricing'] },
                { title: 'Company', links: ['About', 'Blog', 'Careers'] },
                { title: 'Support', links: ['Help Center', 'Contact', 'Privacy'] },
              ].map((col) => (
                <div key={col.title}>
                  <p style={{ margin: '0 0 16px', fontSize: 11, fontWeight: 800, color: '#a1a1aa', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{col.title}</p>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {col.links.map(link => (
                      <li key={link}><span className="footer-link">{link}</span></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(28,35,15,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ margin: 0, color: '#a1a1aa', fontSize: 12, fontWeight: 600 }}>© 2025 Hustlr. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 24 }}>
              <span className="footer-link" style={{ fontSize: 12 }}>Terms</span>
              <span className="footer-link" style={{ fontSize: 12 }}>Privacy</span>
              <span className="footer-link" style={{ fontSize: 12 }}>Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HustlrLanding;