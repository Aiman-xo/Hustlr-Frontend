import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../../redux/slice/adminSlice";
import { logoutUser } from "../../redux/slice/authSlice";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery } = useSelector((state) => state.admin);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "dashboard" },
    { name: "User Management", path: "/admin/users", icon: "group" },
    { name: "Job Oversight", path: "/admin/jobs", icon: "work_history" },
    { name: "Financials", path: "/admin/financials", icon: "payments" },
    // { name: "Settings", path: "/admin/settings", icon: "settings" },
  ];

  return (
    <div className="bg-black text-white min-h-screen font-['Inter']">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col py-8 px-4 bg-black border-r border-neutral-800 z-50">
        <div className="mb-12 px-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-white text-3xl">auto_awesome</span>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white leading-none">Hustlr</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold mt-1">Admin Console</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-3 pl-5 transition-all duration-200 ${
                location.pathname === item.path
                  ? "text-white font-bold border-l-4 border-white bg-neutral-900"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900 border-l-4 border-transparent"
              }`}
            >
              <span className="material-symbols-outlined mr-3">{item.icon}</span>
              <span className="text-sm tracking-tight">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto px-4">
          <button
            onClick={handleLogout}
            className="w-full bg-white text-black py-3 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* TopNavBar */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-black/90 backdrop-blur-md border-b border-neutral-800">
        <div className="flex items-center justify-between px-8 h-full">
          <div className="flex-1 max-w-md">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full bg-neutral-900 border-none rounded-md py-2 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-neutral-700 transition-all placeholder:text-neutral-600"
                placeholder="Search by name, company, or Job ID..."
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-neutral-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full border-2 border-black"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-neutral-800">
              <div className="text-right">
                <p className="text-sm font-bold text-white leading-none">Admin Profile</p>
                <p className="text-[10px] text-neutral-500 font-medium">System Manager</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold">
                AD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-64 pt-16 min-h-screen bg-black">
        <div className="p-8">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
