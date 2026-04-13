import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../../redux/slice/authSlice';
import { FetchInterestRequests } from '../../../redux/slice/employerSlice';

const EmployerSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { interestRequests } = useSelector(state => state.employer);
  const [isWorker, setIsWorker] = useState(false);

  useEffect(() => {
    dispatch(FetchInterestRequests());
  }, [dispatch]);

  const navItems = [
    { to: '/employer/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/employer/my-posts', icon: 'grid_view', label: 'My Posts' },
    { to: '/employer/works', icon: 'work', label: 'Works' },
    { to: '/employer/works/requests', icon: 'pending_actions', label: 'Work Requests' },
    { to: '/employer/received-requests', icon: 'move_to_inbox', label: 'Received Requests', badge: interestRequests.length > 0 ? interestRequests.length : null },
    { to: '/employer/payments', icon: 'payments', label: 'Payments' },
    { to: '/employer/messages', icon: 'chat_bubble', label: 'Messages' },
    { to: '/employer/profile', icon: 'settings', label: 'Settings' },
  ];

  const getLinkClass = ({ isActive }) => {
    const baseClasses =
      'flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 text-xs cursor-pointer';
    const activeClasses =
      'border-l-4 border-[#8ad007] bg-[#8ad007]/5 text-[#8ad007] font-semibold';
    const inactiveClasses =
      'text-[#7c8c5f] hover:bg-[#f3f5f0] font-medium border-l-4 border-transparent';
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-[#e2e6db] flex flex-col">

      {/* Logo */}
      <div className="p-5 flex items-center gap-2.5">
        <div className="w-7 h-7 bg-[#8ad007] rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-black font-bold text-xl">bolt</span>
        </div>
        <h2 className="text-lg font-extrabold tracking-tight text-[#161811]">Hustlr</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto custom-scrollbar">
        {navItems.map(({ to, icon, label, badge }) => (
          <NavLink key={to} to={to} className={getLinkClass} end={to === '/employer/works'}>
            <span className="material-symbols-outlined text-base">{icon}</span>
            <span>{label}</span>
            {badge && (
              <span className="ml-auto bg-[#8ad007] text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div
        onClick={() => dispatch(logoutUser())}
        className="flex items-center gap-2.5 px-3 py-2.5 mt-2 rounded-lg text-[#7c8c5f] hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer text-xs font-bold group mx-3"
      >
        <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">
          logout
        </span>
        <span>Logout</span>
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-[#e2e6db]">

        {/* Post a Job CTA */}
        <button
          onClick={() => navigate('/employer/post-job')}
          className="w-full mb-4 py-2.5 px-3 bg-[#8ad007] hover:bg-[#8ad007]/90 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-md shadow-[#8ad007]/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>Post a Job</span>
        </button>

        {/* Switch to Worker Toggle */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-[#161811]">Switch to Worker</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isWorker}
              onChange={() => setIsWorker((prev) => !prev)}
            />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8ad007]"></div>
          </label>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full bg-cover bg-center border-2 border-[#8ad007]"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC77XuWGCRaZwq6Bmmrq_UAQA_ffMWMVb8StzXRMV0HeCzDCc0yCS_DD24ZzhP3SznggpkoBnbPQmo-at15jrvpBGBKIBOGRUjOKcp-wRY030wxGshYq7sr7qxnBOZuXI6u3ujwvYK1BbtKOeM0hf2EPJq5ClI1y-i_JtuaGMFu9gekdBZ3RSI_rfzDG7G1s54OdpGVPSgWDHtBV4M_mk6aGhJj8oz15I9EOvI7XWzHd6G9QUomXEc4hJQvGX1fgAxZlOdmGBmzxlE')",
            }}
          />
          <div>
            <p className="text-xs font-bold text-[#161811]">Marcus</p>
            <p className="text-[10px] text-[#7c8c5f]">Premium Corporate</p>
          </div>
        </div>

      </div>
    </aside>
  );
};

export default EmployerSidebar;