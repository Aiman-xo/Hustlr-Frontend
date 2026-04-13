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
  return (
    <aside className="w-64 h-screen bg-white  border-r border-[#e2e6db] flex flex-col">
      {/* Logo Section */}
      <div className="p-5 flex items-center gap-2.5">
        <div className="w-7 h-7 bg-[#8ad007] rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-black font-bold text-xl">bolt</span>
        </div>
        <h2 className="text-lg font-extrabold tracking-tight text-[#161811] ">Hustlr</h2>
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
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-medium text-[#161811] ">Switch to Employer</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input className="sr-only peer" type="checkbox" />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8ad007]"></div>
          </label>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5">
          <div 
            className="w-9 h-9 rounded-full bg-cover bg-center border-2 border-[#8ad007]" 
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCKo6hHt0KwZVy9z6dkrllQ6bGRqXbnOE6-P8LHy4C4XpZZ2xdf5uT0XPtYJzGOPyLXTgt09DH1Rry20vTD73ZYNkghcIMNo0MClZCRWDloqFTWziX6OYZV9tYDbYayckpPtgcR2VbUCOAM7O2FmF5H8uBSF_3yBPDGUiLfRWviXJr_hozPje_-ZQT16-_VeDzS-5wPhukrgEgu9LXeqWoeXmhEPXJVIQljyBaM9bIf0CcuwpTtFc3GahI51edJeiQzwyyicszhIKc')"
            }}
          ></div>
          <div>
            <p className="text-xs font-bold text-[#161811] ">Alex Rivera</p>
            <p className="text-[10px] text-[#7c8c5f]">Pro Plumber</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;