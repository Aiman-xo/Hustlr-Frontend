import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployerProfilePost,FetchEmployerProfile,ProfileSetup,FetchProfile } from '../../redux/slice/profileSlice';
import { useDispatch,useSelector } from 'react-redux';
import LocationPicker from '../profile/LocationPicker';
import { SaveLocation } from '../../redux/slice/authSlice';


const EmployerProfileSection= () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {loading,error,profileData,employerData} = useSelector((state)=>state.profile)
    const {isAuthenticated} = useSelector((state)=>state.auth)
    const [localError,setLocalError] = useState('')
    const [redirecting,setRedirecting] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    // This tracks what the user is typing
    const [mapSearch, setMapSearch] = useState(""); 
    // This is what we actually send to the map when they hit Enter
    const [activeSearch, setActiveSearch] = useState("");

    const [employerData2,setEmployerData] = useState({
        company_name:''
    })
    const [profileData2,setProfileData] = useState({
        image:null,
        phone_number:''
    })

    useEffect(() => {
        if (isAuthenticated) {
        dispatch(FetchProfile());
        dispatch(FetchEmployerProfile());
        }
    }, [dispatch, isAuthenticated]);

    useEffect(()=>{
        
        if(profileData){
            
            setProfileData({
                image:profileData.image ?? '',
                phone_number:profileData.phone_number??''
            })
            console.log(profileData);
        }
    },[profileData])

    useEffect(()=>{
        if(employerData){
            setEmployerData({
                company_name:employerData.company_name ?? ''
            })
        }
    },[employerData])

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        setProfileData(prev => ({
        ...prev,
        image: file
        }));
    };

    const handleEmployerProfileSubmit = async(e)=>{
        e.preventDefault();
        setLocalError('');
        if (!employerData2.company_name || !profileData2.phone_number){
            setLocalError('Please fill the Required columns!')
            return
        }
        const ProfileFormData = new FormData()
        ProfileFormData.append('phone_number',profileData2.phone_number)
        if (profileData2.image instanceof File) {
            ProfileFormData.append('image', profileData2.image);
        }
        await dispatch(EmployerProfilePost(employerData2)).unwrap()
        await dispatch(ProfileSetup(ProfileFormData)).unwrap()
        if (selectedLocation) {
            await dispatch(SaveLocation(selectedLocation)).unwrap();
        } else {
            setLocalError("Please pin your location on the map.");
        }

        setRedirecting(true);

        setTimeout(() => {
            navigate("/employer/dashboard");
        }, 2000);

    }

  return (
    <div className="min-h-screen bg-white text-[#161811] flex flex-col" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#8ad007] rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-black font-bold text-xl">bolt</span>
            </div>
            <h2 className="text-lg font-extrabold tracking-tight text-[#161811]">Hustlr</h2>
          </div>

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-[#8ad007]/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-gray-400 text-base">business</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
                {/* Progress Bar */}
                <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#8ad007] uppercase tracking-wider">Step 2 of 3</span>
            <span className="text-xs font-medium text-[#7c8c5f]">66% Complete</span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#8ad007] h-full rounded-full transition-all duration-500" style={{ width: '66%' }} />
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-3 text-[#161811]"><span className='text-[#8ad007]'>Employer</span> Profile Setup</h1>
          <p className="text-sm text-[#7c8c5f] max-w-2xl leading-relaxed">
            Let's get your business account ready. This information helps workers identify who they're working with and where to show up.
          </p>
        </div>

        <div className="space-y-6">
            <div className="flex flex-col items-center py-2">
                <div className="relative group">

                    {/* Avatar Circle */}
                    <div className="size-24 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                        {/* IMAGE */}
                        {profileData2.image ? (
                            <img
                            src={
                                profileData2.image instanceof File
                                ? URL.createObjectURL(profileData2.image)
                                : profileData2.image
                            }
                            alt="Profile"
                            className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="material-symbols-outlined text-3xl text-gray-300">
                            person
                            </span>
                        )}
                    </div>

                    {/* Camera Button */}
                    <label className="absolute bottom-0 right-0 bg-white text-[#8ad007] p-1 rounded-full shadow-lg border border-gray-100 hover:scale-105 transition-transform cursor-pointer">
                    <span className="material-symbols-outlined !text-lg">add_a_photo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange}/>
                    </label>

                </div>
                <p className="mt-3 text-xs font-medium text-[#7c8c5f]">Upload Profile Photo</p>
            </div>

          {/* Business Profile Section */}
          <form action=""onSubmit={handleEmployerProfileSubmit}>
          <section className="bg-[#f8faf3] rounded-xl p-6 border border-[#e2e6db]">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="material-symbols-outlined text-[#8ad007] text-base">domain</span>
              <h2 className="text-sm font-bold text-[#161811]">Business Profile</h2>
            </div>
            

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#161811]">Full Name or Company Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-base">person</span>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp or John Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e2e6db] rounded-lg text-xs font-medium text-[#161811] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8ad007] focus:border-[#8ad007] transition-all"
                    value={employerData2.company_name}
                    onChange={(e)=>{
                        setEmployerData({
                            ...employerData2,
                            company_name:e.target.value
                        })
                    }}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#161811]">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-base">call</span>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e2e6db] rounded-lg text-xs font-medium text-[#161811] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8ad007] focus:border-[#8ad007] transition-all"
                    value={profileData2.phone_number}
                    onChange={(e)=>{
                        setProfileData({
                            ...profileData2,
                            phone_number:e.target.value
                        })
                    }}
                  />
                </div>
              </div>
            </div>

          </section>

          {/* Location Section */}
          <section className="bg-[#f8faf3] rounded-xl p-6 border border-[#e2e6db] mt-5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#8ad007] text-base">location_on</span>
                <h2 className="text-sm font-bold text-[#161811]">Set Office / Home Location</h2>
              </div>
              <span className="text-[10px] text-[#7c8c5f] font-medium">Workers will use this to navigate to jobs</span>
            </div>

 {/* Address Search */}
 <div className="mb-5">
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[18px]">search</span>
                <input 
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#89cf07]/20 outline-none text-sm" 
                placeholder="Search city (e.g., Ernakulam) and press Enter" 
                type="text"
                value={mapSearch}
                onChange={(e) => setMapSearch(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                    e.preventDefault(); // Prevents the whole form from submitting
                    setActiveSearch(mapSearch); // Triggers the map search
                    }
                }}
                />
            </div>
            <p className="text-[10px] text-gray-400 mt-1 ml-1">Type a location and press Enter to move the map</p>
            </div>

            {/* Map Container */}
            <div className="relative w-full rounded-xl overflow-hidden border border-gray-200">
            <LocationPicker 
                onLocationSelected={(data) => {
                setSelectedLocation(data);
                // Optional: Update the search box text to the clean city name found
                setMapSearch(data.city); 
                }} 
                searchQuery={activeSearch} 
            />
            </div>
          </section>
            {(error || localError) && (
                <p className="mt-2 text-[9px] text-red-500 text-center font-bold uppercase">{error || localError}</p>
            )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-16">
            <button className="flex items-center gap-2 text-[#7c8c5f] hover:text-[#161811] text-xs font-bold transition-colors">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to Account Type
            </button>

            <button 
            type="submit"
            disabled={loading || redirecting}
            className="w-full sm:w-auto px-8 py-3 bg-[#8ad007] text-white font-bold rounded-xl shadow-xl shadow-[#8ad007]/20 hover:shadow-[#8ad007]/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group text-sm"
            >
            {loading || redirecting ? (
                    <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Finishing...</span>
                    </>
                ) : (
                    <>
                    Finish Setup
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[18px]">arrow_forward</span>
                    </>
                )}
            </button>
          </div>
        </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e2e6db] py-6 bg-[#f8faf3]">
        <div className="max-w-5xl mx-auto px-6 text-center text-[10px] text-[#7c8c5f]">
          © 2024 Hustlr Marketplace Inc. All rights reserved.
          <span className="mx-2">•</span>
          <a href="#" className="hover:text-[#8ad007] underline underline-offset-4 transition-colors">Terms of Service</a>
          <span className="mx-2">•</span>
          <a href="#" className="hover:text-[#8ad007] underline underline-offset-4 transition-colors">Privacy Policy</a>
        </div>
      </footer>

    </div>
  );
};

export default EmployerProfileSection;