import { useEffect, useState } from "react";
import JobRequestModal from "./Modals/SendRequestModal";
import { useDispatch, useSelector } from "react-redux";
import { FetchAllWorkers } from "../../redux/slice/employerSlice";

const stats = [
    { label: "Total Jobs Completed", value: "124", change: "+12%", changeColor: "text-emerald-600 bg-emerald-50", icon: "✓", iconBg: "bg-[#8ad007]/10 text-[#8ad007]" },
    { label: "Favorite Workers", value: "18", change: "+5%", changeColor: "text-emerald-600 bg-emerald-50", icon: "👥", iconBg: "bg-blue-500/10 text-blue-500" },
    { label: "Active Postings", value: "4", change: "Stable", changeColor: "text-gray-400", icon: "📋", iconBg: "bg-purple-500/10 text-purple-500" },
    { label: "Approval Rating", value: "4.9", change: "98%", changeColor: "text-orange-600 bg-orange-50", icon: "⭐", iconBg: "bg-orange-500/10 text-orange-500" },
];

export default function EmployerDash() {
    const { loading, allWorkers } = useSelector((state) => state.employer);
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openRequestModal,setOpenRequestModal] = useState(false)
    const dispatch = useDispatch();

    const workersList = allWorkers?.results || [];
    const totalCount = allWorkers?.count || 0;
    const [selectedWorker, setSelectedWorker] = useState(null); // Track the specific worker

    const handleOpenModal = (worker) => {
        setSelectedWorker(worker);
        setOpenRequestModal(true);
    };

    useEffect(() => {
        dispatch(FetchAllWorkers({ page: 1 }));
    }, [dispatch]);

    const handleSearch = () => {
        setCurrentPage(1);
        dispatch(FetchAllWorkers({ search: searchValue, page: 1 }));
    };

    
    const handleLoadMore = () => {
        if (allWorkers?.next && !loading) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            dispatch(FetchAllWorkers({ search: searchValue, page: nextPage }));
        }
    };

    return (
        <div className="flex-1 relative min-h-screen" style={{ fontFamily: "'Manrope', sans-serif", background: "#f9fafb" }}>
          {openRequestModal && (
                <JobRequestModal 
                    isOpen={openRequestModal} 
                    workerData={selectedWorker} 
                    onClose={() => setOpenRequestModal(false)}
                />
            )}
            <div className="max-w-5xl mx-auto px-6 py-6">

                {/* Header */}
                <header className="mb-6">
                    <h2 className="text-xl font-extrabold text-gray-900">Welcome back!</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                <p className="text-gray-500 text-xs">{stat.label}</p>
                                <h3 className="text-lg font-bold">{stat.value}</h3>
                            </div>
                        ))}
                    </div>
                </header>

                {/* Search Bar */}
                <section className="mb-6">
                    <div className="bg-white rounded-2xl p-1.5 shadow-md border" style={{ borderColor: "#8ad00733" }}>
                        <div className="flex items-center px-3 py-1">
                            <span className="mr-2">🔍</span>
                            <input
                                className="flex-1 outline-none text-sm py-2 bg-transparent text-gray-900"
                                placeholder="Find a worker by name or skill..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button
                                onClick={handleSearch}
                                className="text-white font-bold px-5 py-2 rounded-xl text-sm transition-all active:scale-95"
                                style={{ background: "#8ad007" }}
                            >
                                Hustle
                            </button>
                        </div>
                    </div>
                </section>

                {/* Results Section */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-sm font-bold text-gray-900">
                            Worker Search Results
                            <span className="text-gray-400 text-xs font-normal ml-2">({totalCount} workers found)</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {workersList.map((worker) => (
                            <div key={worker.id} className="group bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row items-start gap-4 hover:shadow-lg transition-all">
                                
                                {/* Avatar */}
                                {worker.avatar ? (
                                    <div className="w-16 h-16 rounded-xl bg-gray-100 bg-cover bg-center overflow-hidden flex-shrink-0"
                                         style={{ backgroundImage: `url(${worker.avatar})` }} />
                                ) : (
                                    <div className="w-16 h-16 rounded-xl bg-[#8ad007]/10 flex items-center justify-center text-[#8ad007] font-bold text-xl uppercase flex-shrink-0">
                                        {worker.name?.charAt(0) || "?"}
                                    </div>
                                )}

                                {/* Main Content */}
                                <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold text-gray-900">{worker.name}</h3>
                                        <span className="text-xs text-[#8ad007] font-medium">• {worker.city || "Remote"}</span>
                                    </div>
                                    
                                    <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                                        {worker.job_description || "No description provided."}
                                    </p>

                                    {/* Skills Pills Section */}
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {worker.skills && worker.skills.length > 0 ? (
                                            worker.skills.map((skill) => (
                                                <span 
                                                    key={skill.id} 
                                                    className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-[8px] font-bold rounded-md uppercase tracking-wider border border-gray-200"
                                                >
                                                    {skill.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-gray-400 italic">No skills listed</span>
                                        )}
                                    </div>
                                </div>

                                {/* Rate + CTA */}
                                <div className="flex flex-col items-end justify-between self-stretch min-w-[110px]">
                                    <div className="text-right">
                                        <span className="text-lg font-black text-gray-900">₹{worker.base_Pay}</span>
                                        <span className="text-gray-500 text-xs ml-0.5">/hr</span>
                                    </div>
                                    <button className="w-full text-white font-bold py-2 px-4 text-[10px] rounded-lg active:scale-95 transition-all shadow-sm hover:opacity-90" style={{ background: "#8ad007" }}
                                    onClick={()=>handleOpenModal(worker)}>
                                        Send Request
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* States & Pagination */}
                    {!loading && workersList.length === 0 && (
                        <div className="text-center py-20 text-gray-400 text-sm">No workers found.</div>
                    )}

                    {loading && <p className="text-center py-6 text-sm text-gray-400 animate-pulse">Fetching more workers...</p>}

                    {allWorkers?.next && (
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="px-10 py-2.5 border-2 border-[#8ad00733] text-[#8ad007] font-bold text-xs rounded-xl transition-all 
                                           hover:bg-[#8ad007] hover:text-white hover:border-[#8ad007] disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? "Hustling..." : "Load More Workers ▾"}
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}