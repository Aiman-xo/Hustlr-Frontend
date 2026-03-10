import React from 'react';
import { useNavigate } from 'react-router-dom';

const HustlrLanding = () => {
    const nav = useNavigate()
  return (
    <div className="bg-[#f7f8f5] text-slate-900 transition-colors duration-300">
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      
      {/* --- Navigation --- */}
      <header className="absolute top-0 left-0 w-full z-50 py-6">
          <div className="flex items-center gap-2 justify-center">
            <div className="size-8 bg-[#89cf07] rounded-lg flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect x="50" y="50" width="300" height="300" rx="60" fill="#8ad007"/>
                
                <g transform="translate(200, 200)">
                    <circle cx="0" cy="0" r="18" fill="#ffffff"/>
                    
                    <rect x="-8" y="-72" width="16" height="57" rx="8" fill="#ffffff"/>
                    <rect x="-8" y="15" width="16" height="57" rx="8" fill="#ffffff"/>
                    <rect x="-72" y="-8" width="57" height="16" rx="8" fill="#ffffff"/>
                    <rect x="15" y="-8" width="57" height="16" rx="8" fill="#ffffff"/>
                    
                    <rect x="-8" y="-57" width="16" height="42" rx="8" fill="#ffffff" transform="rotate(45 0 0)"/>
                    <rect x="-8" y="-57" width="16" height="42" rx="8" fill="#ffffff" transform="rotate(135 0 0)"/>
                    <rect x="-8" y="-57" width="16" height="42" rx="8" fill="#ffffff" transform="rotate(225 0 0)"/>
                    <rect x="-8" y="-57" width="16" height="42" rx="8" fill="#ffffff" transform="rotate(315 0 0)"/>
                </g>
                </svg>
            </div>
            <h2 className="text-lg font-bold tracking-tight">Hustlr</h2>
          </div>
        </header>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-16 px-6 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30" 
             style={{ background: 'radial-gradient(circle at 50% 20%, rgba(137, 207, 7, 0.2) 0%, transparent 60%)' }}>
        </div>

        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#89cf07]/10 border border-[#89cf07]/20 text-[#89cf07] text-[10px] font-bold tracking-widest uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#89cf07] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#89cf07]"></span>
              </span>
              2,400+ Active Gigs
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight text-[#1c230f]">
              Hire Talent. Get Work. <span className="text-[#89cf07]">Instantly.</span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 max-w-xl font-medium leading-relaxed">
              The high-velocity marketplace connecting verified professional hustlers with the world's most ambitious projects.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2">
              <button className="bg-[#89cf07] text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-[#89cf07]/20 hover:shadow-[#89cf07]/40 transition-all w-full sm:w-auto"
              onClick={()=>nav('/role')}>
                Get Started
              </button>
              <button className="bg-white border border-slate-200 text-slate-900 text-sm font-bold px-8 py-3.5 rounded-xl hover:bg-slate-50 transition-all w-full sm:w-auto"
              onClick={()=>nav('/login')}>
                Log in
              </button>
            </div>
          </div>

          {/* Mockup Area with Glass Effect */}
          <div className="mt-16 relative rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
            <div className="aspect-video bg-slate-100 rounded-2xl bg-cover bg-center overflow-hidden flex items-end" 
                 style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80')" }}>
              <div className="w-full p-6 bg-gradient-to-t from-black/50 to-transparent flex justify-between items-end">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 flex items-center gap-3">
                  <div className="size-10 rounded-full border border-[#89cf07] bg-slate-400" />
                  <div>
                    <p className="text-[9px] text-[#89cf07] font-black uppercase">Verified Pro</p>
                    <p className="text-white text-xs font-bold">Alex Maxwell · UI Designer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Stats --- */}
      <section className="py-12 px-6 lg:px-16 bg-white border-y border-slate-100">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Active Hustlrs', value: '50k+' },
              { label: 'Jobs Completed', value: '200k+' },
              { label: 'Total Payouts', value: '$12M+' },
              { label: 'Average Rating', value: '4.9' },
            ].map((stat, i) => (
              <div key={i} className={`flex flex-col items-center md:items-start ${i !== 0 ? 'md:border-l md:border-slate-100 md:pl-8' : ''}`}>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-[#1c230f]">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Features --- */}
      <section className="py-20 px-6 lg:px-16 bg-[#f7f8f5]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="max-w-md">
              <h2 className="text-3xl font-black mb-4 tracking-tight">Why Choose Hustlr?</h2>
              <p className="text-slate-500 text-base">Vetted talent and instant payouts for high-quality output.</p>
            </div>
            <button className="text-[#89cf07] font-bold text-sm flex items-center gap-2 hover:translate-x-1 transition-transform">
            process <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'verified_user', title: 'Vetted Pros', desc: 'Every talent undergoes a multi-step reliability assessment.' },
              { icon: 'bolt', title: 'Instant Pay', desc: 'Funds are released the moment milestones are approved.' },
              { icon: 'public', title: 'Global Reach', desc: 'Smart contracts handle compliance automatically.' },
            ].map((feat, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-[#89cf07]/30 transition-all shadow-sm">
                <div className="size-10 rounded-lg bg-[#89cf07]/10 flex items-center justify-center text-[#89cf07] mb-6">
                  <span className="material-symbols-outlined text-2xl">{feat.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6 lg:px-16">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-6 bg-[#89cf07] rounded-md flex items-center justify-center">
                <svg className="text-white w-4 h-4" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L14.47 8.53L21 11L14.47 13.47L12 20L9.53 13.47L3 11L9.53 8.53L12 2Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="text-base font-black tracking-tight">Hustlr</h2>
            </div>
            <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
              The modern standard for professional services. Secure and fast.
            </p>
          </div>
          {['Platform', 'Company', 'Support'].map((menu) => (
            <div key={menu}>
              <h4 className="font-bold text-[10px] mb-6 uppercase tracking-widest text-slate-300">{menu}</h4>
              <ul className="space-y-3 text-xs font-semibold text-slate-500">
                <li className="hover:text-[#89cf07] cursor-pointer">Link Item</li>
                <li className="hover:text-[#89cf07] cursor-pointer">Link Item</li>
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1280px] mx-auto mt-12 pt-8 border-t border-slate-50 text-[9px] font-bold text-slate-300 flex flex-col md:flex-row justify-between uppercase tracking-widest">
          <p>© 2024 Hustlr Brand.</p>
          <div className="flex gap-6">
            <span className="cursor-pointer">Terms</span>
            <span className="cursor-pointer">Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
  );
};

export default HustlrLanding;