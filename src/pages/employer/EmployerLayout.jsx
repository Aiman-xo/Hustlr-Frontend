import { useState } from "react";
import EmployerSidebar from "./sidebar/EmployerSidebar";
import { Outlet } from "react-router-dom";

const EmployerLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
      <div className="flex bg-[#f7f8f5] min-h-screen relative overflow-x-hidden">
        
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#e2e6db] flex items-center justify-between px-4 z-40">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
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
            <span className="font-extrabold text-[#161811]">Hustlr</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-[#7c8c5f] hover:bg-[#f3f5f0] rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <EmployerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <main className="flex-1 h-screen overflow-y-auto pt-16 md:pt-0">
          <Outlet /> 
        </main>
      </div>
    );
  };
  
  export default EmployerLayout;