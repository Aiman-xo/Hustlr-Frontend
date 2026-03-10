import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const nav = useNavigate();

  return (
    <div className="bg-[#f7f8f5] h-screen flex flex-col font-['Manrope',_sans-serif] text-slate-900 overflow-hidden selection:bg-[#89cf07]/30">
      <div className="relative flex-1 flex flex-col overflow-hidden">
        
        {/* Background Accents */}
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-[#89cf07]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-[#89cf07]/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* --- Navigation --- */}
        <header className="flex items-center justify-center py-8 z-20 shrink-0">
          <div className="flex flex-col items-center gap-1 group cursor-default">
            <div className="flex items-center justify-center">
              {/* Added explicit width/height to SVG */}
              <svg className="w-12 h-12" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(50, 50)">
                  <circle cx="0" cy="0" r="6" fill="#8ad007"/>
                  <rect x="-3" y="-28" width="6" height="22" rx="3" fill="#8ad007"/>
                  <rect x="-3" y="6" width="6" height="22" rx="3" fill="#8ad007"/>
                  <rect x="-28" y="-3" width="22" height="6" rx="3" fill="#8ad007"/>
                  <rect x="6" y="-3" width="22" height="6" rx="3" fill="#8ad007"/>
                  <rect x="-3" y="-22" width="6" height="16" rx="3" fill="#8ad007" transform="rotate(45 0 0)"/>
                  <rect x="-3" y="-22" width="6" height="16" rx="3" fill="#8ad007" transform="rotate(135 0 0)"/>
                  <rect x="-3" y="-22" width="6" height="16" rx="3" fill="#8ad007" transform="rotate(225 0 0)"/>
                  <rect x="-3" y="-22" width="6" height="16" rx="3" fill="#8ad007" transform="rotate(315 0 0)"/>
                </g>
              </svg>
            </div>
            <h2 className="text-[10px] font-black tracking-[0.3em] uppercase italic text-[#1c230f] mt-1">Hustlr</h2>
          </div>
        </header>

        {/* --- Main Content --- */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
          <div className="w-full max-w-2xl mx-auto text-center">
            
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2 text-[#1c230f]">
                Choose Your Path
              </h1>
              <p className="text-slate-500 text-[13px] max-w-[300px] mx-auto font-medium leading-relaxed">
                Select how you'd like to use the Hustlr platform to get started.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mb-8">
              {/* Worker Card */}
              <button 
                className="group relative bg-white/50 backdrop-blur-xl border border-white rounded-2xl p-7 text-left transition-all duration-300 hover:border-[#89cf07]/40 hover:shadow-xl hover:shadow-[#89cf07]/5 hover:-translate-y-1 overflow-hidden"
                onClick={() => nav('/register/worker')}
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#89cf07]/10 group-hover:bg-[#89cf07] transition-all duration-300"></div>
                <div className="w-10 h-10 rounded-lg bg-[#89cf07]/10 text-[#89cf07] flex items-center justify-center mb-5 group-hover:bg-[#89cf07] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-xl">work</span>
                </div>
                <h3 className="text-base font-black mb-1.5 transition-colors">I am a Worker</h3>
                <p className="text-slate-500 text-[12px] leading-relaxed mb-5">
                  Browse opportunities, showcase skills, and get paid for your expertise.
                </p>
                <div className="flex items-center text-[#89cf07] text-[10px] font-black uppercase tracking-widest gap-2">
                  <span>Get started</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </button>

              {/* Employer Card */}
              <button 
                className="group relative bg-white/50 backdrop-blur-xl border border-white rounded-2xl p-7 text-left transition-all duration-300 hover:border-[#89cf07]/40 hover:shadow-xl hover:shadow-[#89cf07]/5 hover:-translate-y-1 overflow-hidden"
                onClick={() => nav('/register/employer')}
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#89cf07]/10 group-hover:bg-[#89cf07] transition-all duration-300"></div>
                <div className="w-10 h-10 rounded-lg bg-[#89cf07]/10 text-[#89cf07] flex items-center justify-center mb-5 group-hover:bg-[#89cf07] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-xl">person_search</span>
                </div>
                <h3 className="text-base font-black mb-1.5 transition-colors">I am an Employer</h3>
                <p className="text-slate-500 text-[12px] leading-relaxed mb-5">
                  Post projects, discover top-tier talent, and grow your business faster.
                </p>
                <div className="flex items-center text-[#89cf07] text-[10px] font-black uppercase tracking-widest gap-2">
                  <span>Post a job</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </button>
            </div>

            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[12px]">info</span>
              Switch roles anytime in settings
            </p>
          </div>
        </main>

        {/* --- Minimal Footer --- */}
        <footer className="px-6 py-6 shrink-0">
          <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between border-t border-slate-200 pt-6 gap-3">
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.15em]">
              © 2026 Hustlr Platform
            </p>
            <div className="flex gap-5">
              <a className="text-slate-400 hover:text-[#89cf07] text-[9px] font-bold uppercase tracking-widest transition-colors" href="#">Terms</a>
              <a className="text-slate-400 hover:text-[#89cf07] text-[9px] font-bold uppercase tracking-widest transition-colors" href="#">Privacy</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default RoleSelection;