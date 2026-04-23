import React from 'react';
import { NavLink } from 'react-router-dom';
import { logoutUser } from '../../../redux/slice/authSlice';
import { useDispatch,useSelector } from 'react-redux'

const Sidebar = () => {
    const dispatch = useDispatch();
    const {unreadCount} = useSelector((state)=>state.worker);
    const getLinkClass = ({ isActive }) => {
        const baseClasses = "flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 text-xs cursor-pointer";
        
        // Styles when the link IS selected
        const activeClasses = "border-l-4 border-[#8ad007] bg-[#8ad007]/5 text-[#8ad007] font-semibold";
        
        // Styles when the link is NOT selected
        const inactiveClasses = "text-[#7c8c5f] hover:bg-[#f3f5f0] font-medium border-l-4 border-transparent";
    
        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
      };
    const profile_image = localStorage.getItem('profile_image');
    const username = localStorage.getItem('username')
  return (
    <aside className="w-64 h-screen bg-white  border-r border-[#e2e6db] flex flex-col">
      {/* Logo Section */}
      <div className="p-5 flex items-center gap-2.5">
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
        <h2 className="text-md font-extrabold tracking-tight text-[#161811]">Hustlr</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
      {/* 2. Use NavLink instead of div */}
      <NavLink to="/worker/dashboard" className={getLinkClass}>
        <span className="material-symbols-outlined text-base">grid_view</span>
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/worker/my-jobs" className={getLinkClass}>
        <span className="material-symbols-outlined text-base">work</span>
        <span>My Jobs</span>
      </NavLink>

      <NavLink to="/worker/job-feed" className={getLinkClass}>
        <span className="material-symbols-outlined text-base">travel_explore</span>
        <span>Find Jobs</span>
      </NavLink>

      <NavLink to="/worker/payouts" className={getLinkClass}>
        <span className="material-symbols-outlined text-base">account_balance_wallet</span>
        <span>Payouts</span>
      </NavLink>

      <NavLink to="/worker/requests" className={getLinkClass}>
        <span className="material-symbols-outlined text-base">pending_actions</span>
        <span>Requests</span>
      </NavLink>

      <NavLink to="/worker/messages" className={getLinkClass}>
        <span className="material-symbols-outlined text-base">forum</span>
        <span>Messages</span>
      </NavLink>

      <NavLink 
        to="/worker/notifications" 
        className={({ isActive }) => `${getLinkClass({ isActive })} flex items-center justify-between w-full`}
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined !text-[24px]">notifications</span>
          <span className="font-medium capitalize tracking-wide">Notifications</span>
        </div>

        {/* The Green Dot on the right-most side */}
        {unreadCount && <span className="flex h-4 min-w-[13px] items-center justify-center rounded-full bg-[#8ad007] px-1.5 text-[8px] font-bold text-white shadow-sm ring-1 ring-white/20">
          {unreadCount}
        </span>}
      </NavLink>
      
      <NavLink to="/worker/profile" className={getLinkClass}>
        <span className="material-symbols-outlined text-base">person</span>
        <span>Profile</span>
      </NavLink>

    </nav>
        <div 
        onClick={()=>{
            dispatch(logoutUser())
        }}
        className="flex items-center gap-2.5 px-3 py-2.5 mt-2 rounded-lg text-[#7c8c5f] hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer text-xs font-bold group"
        >
        <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">
            logout
        </span>
        <span>Logout</span>
        </div>

      {/* Footer Section */}
      <div className="p-5 border-t border-[#e2e6db]">
        {/* Switch to Employer Toggle */}
        {/* <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-medium text-[#161811] ">Switch to Employer</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input className="sr-only peer" type="checkbox" />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8ad007]"></div>
          </label>
        </div> */}

        {/* User Profile */}
        <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full border-2 border-[#8ad007] flex items-center justify-center overflow-hidden bg-[#f3f5f0]">
            {profile_image && profile_image !== "null" ? (
              <img 
                src={profile_image} 
                alt={username} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[#8ad007] font-bold text-sm">
                {username?.[0]?.toUpperCase() || 'H'}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-[#161811] ">{username ? (username[0].toUpperCase() + username.slice(1)) : 'Hustlr User'}</p>
            <p className="text-[10px] text-[#7c8c5f]">Worker</p>
          </div>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;