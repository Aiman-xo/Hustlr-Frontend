import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { FetchProfile,ProfileSetup,WorkerProfilePost } from '../../redux/slice/profileSlice';
import { SaveLocation, updateAccessToken } from '../../redux/slice/authSlice';
import { FetchSkill } from '../../redux/slice/profileSlice';
import LocationPicker from './LocationPicker';
import axios from 'axios';



const WorkerProfileSetup = () => {
    const navigate = useNavigate()
    const {role} = useSelector(state=>state.auth)
    const dispatch = useDispatch()
    const {loading,error,profileData,skills,workerData} = useSelector(state=>state.profile)
    const [skillSearch, setSkillSearch] = useState('');
    const [redirecting,setRedirecting] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    // This tracks what the user is typing
    const [mapSearch, setMapSearch] = useState(""); 
    // This is what we actually send to the map when they hit Enter
    const [activeSearch, setActiveSearch] = useState("");


  const [workerformData, setWorkerFormData] = useState({
    base_Pay: '',
    job_description: '',
    experience: '',
    hourly_rate:'',
  });

  const [profileformData,setProfileFormData] = useState({
    image:null,
    phone_number:'',
    username:''
    
  })

  useEffect(()=>{
    dispatch(FetchProfile())

    console.log(profileData);
  },[dispatch])

  useEffect(() => {
    if (profileData) {
  
      setProfileFormData({
        image: profileData.image ?? '',
        city: profileData.city ?? '',
        phone_number: profileData.phone_number ?? '',
        username: profileData.username ?? '',
      });
    }
  }, [profileData]);
  
  useEffect(() => {
    if (skillSearch.trim() === '') {
      // Don't fetch if search is empty
      return;
    }
    
    const timer = setTimeout(() => {
      dispatch(FetchSkill(skillSearch));
    }, 400);
  
    return () => clearTimeout(timer);
  }, [skillSearch, dispatch]);

 
  

  
    const [localError,setLocalError] = useState('')

    const [selectedSkills, setSelectedSkills] = useState([]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        setProfileFormData(prev => ({
        ...prev,
        image: file
        }));
    };
  

    const handleSkillRemove = (id) => {
        setSelectedSkills(prev => prev.filter(s => s.id !== id));
    };

    const handleSkillAdd = (skillObj) => {
        if (selectedSkills.find(s => s.id === skillObj.id)) return;
        setSelectedSkills(prev => [...prev, skillObj]);
        setSkillSearch('')
    };


    // Fixed: Always return an array even if skills is null/undefined
    const filteredSkills = (skills || []).filter(
        skill => !selectedSkills.some(s => s.id === skill.id)
    );
  

  const handleProfileSubmit = async(e) => {
    e.preventDefault();
    if (!workerformData.base_Pay || !workerformData.experience || !workerformData.hourly_rate || !workerformData.job_description || !profileformData.phone_number || !profileformData.username){
        setLocalError('Pleaase fill all the required details!')
        return;
    }

    if (!selectedLocation) {
        setLocalError('Please pin your location on the map!')
        return;
    }

    if (workerformData.experience < 0 || workerformData.base_Pay <0 || workerformData.hourly_rate <0){
        setLocalError('cannot set negative')
        return
    }
    const formData = new FormData();
    const workerProfileData = new FormData()
    // Text fields
    formData.append('username', profileformData.username);
    formData.append('phone_number', profileformData.phone_number);
    // Image field (ONLY if new image selected)
    if (profileformData.image instanceof File) {
      formData.append('image', profileformData.image);
    }

    workerProfileData.append('base_Pay',workerformData.base_Pay);
    workerProfileData.append('job_description',workerformData.job_description);
    workerProfileData.append('experience',workerformData.experience);
    workerProfileData.append('hourly_rate',workerformData.hourly_rate);
    selectedSkills.forEach(skill => {
        workerProfileData.append('skills', skill.id);
      });

    try{
        await dispatch(ProfileSetup(formData)).unwrap()
        await dispatch(WorkerProfilePost(workerProfileData)).unwrap()
        await dispatch(SaveLocation(selectedLocation)).unwrap();

        try {
            const resp = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {}, { withCredentials: true });
            const { access_token } = resp.data;
            localStorage.setItem('access_token', access_token);
            dispatch(updateAccessToken(access_token));
        } catch (refreshErr) {
            console.error("Failed to refresh token after profile setup", refreshErr);
        }

        setRedirecting(true);

        setTimeout(() => {
            navigate("/worker/dashboard");
          }, 2000);
    }catch(error){
        //nothing
    }


    console.log('Profile setup submitted', workerformData);
  };


  return (
<div className="bg-white text-[#161811] transition-colors duration-200">
  {/* Header */}
  <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
    <div className="px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="bg-[#8ad007] size-8 rounded-xl flex items-center justify-center text-white shadow-sm shadow-[#8ad007]/20">
          <svg className="size-5" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
          </svg>
        </div>
        <h2 className="text-lg font-bold tracking-tight">Hustlr</h2>
      </div>
    </div>
  </header>

  {/* Main Content */}
  <main className="max-w-4xl mx-auto px-6 py-8">
    {/* Progress Bar */}
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[#8ad007] uppercase tracking-wider">Step 3 of 4</span>
        <span className="text-xs font-medium text-gray-500">75% Complete</span>
      </div>
      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
        <div className="bg-[#8ad007] h-full transition-all duration-500" style={{ width: '75%' }}></div>
      </div>
    </div>

    {/* Page Title */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-3">Complete Your <span className='text-[#8ad007]'>{role}</span> Profile</h1>
      <p className="text-base text-gray-500 max-w-2xl leading-relaxed">
        Tell us about your services and where you work. This information helps us match you with the right clients in your area.
      </p>
    </div>

    {/* Profile Photo Upload */}
    <div className="mb-8 flex flex-col items-center">
      <div className="relative group">
        <div className="size-24 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">

          {/* IMAGE */}
          {profileformData.image ? (
            <img
              src={
                profileformData.image instanceof File
                  ? URL.createObjectURL(profileformData.image)
                  : profileformData.image
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

        {/* Upload Button */}
        <label className="absolute bottom-0 right-0 bg-white text-[#8ad007] p-1.5 rounded-full shadow-lg border border-gray-100 hover:scale-105 transition-transform cursor-pointer">
          <span className="material-symbols-outlined !text-lg">add_a_photo</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>

      <p className="mt-3 text-xs font-medium text-gray-500">
        Upload Profile Photo
      </p>
    </div>


    <form onSubmit={handleProfileSubmit} className="space-y-8">
      {/* Job Details Section */}
      <section className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="material-symbols-outlined text-[#8ad007] text-[20px]">payments</span>
          <h2 className="text-lg font-bold">Job Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">U</span>
              <input 
                className="w-full pl-7 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#89cf07]/20 transition-all outline-none text-sm" 
                placeholder="name123" 
                type="text" 
                value={profileformData.username}
                onChange={(e) => setProfileFormData({ ...profileformData, username: e.target.value })}
                onFocus={() => setLocalError('')}
              />
            </div>
          </div>

          {/* Hourly Rate */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold">Hourly Rate (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">₹</span>
              <input 
                className="w-full pl-7 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#89cf07]/20 transition-all outline-none text-sm" 
                placeholder="000" 
                type="number" 
                value={workerformData.hourly_rate}
                onChange={(e) => setWorkerFormData({ ...workerformData, hourly_rate: e.target.value })}
                onFocus={() => setLocalError('')}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Phone Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold">Phone Number</label>
            <div className="flex gap-2">
              <div className="w-20 relative">
                <select 
                  className="w-full pl-2 pr-7 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#89cf07]/20 transition-all outline-none appearance-none text-xs"
                >
                  <option>IN +91</option>
                  <option>🇺🇸 +1</option>
                  <option>🇬🇧 +44</option>
                  <option>🇨🇦 +1</option>
                  <option>🇦🇺 +61</option>
                </select>
                <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none !text-base">expand_more</span>
              </div>
              <input 
                className="flex-1 px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-2 focus:ring-[#89cf07]/20 transition-all outline-none text-sm" 
                placeholder="000-000-0000" 
                type="tel"
                value={profileformData.phone_number}
                onChange={(e) => setProfileFormData({ ...profileformData, phone_number: e.target.value })}
                onFocus={() => setLocalError('')}
              />
            </div>
          </div>

          {/* Base Pay */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold">Base Pay (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">₹</span>
              <input 
                className="w-full pl-7 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#89cf07]/20 transition-all outline-none text-sm" 
                placeholder="000" 
                type="number" 
                value={workerformData.base_Pay}
                onChange={(e) => setWorkerFormData({ ...workerformData, base_Pay: e.target.value })}
                onFocus={() => setLocalError('')}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold">Experience</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">1</span>
              <input 
                className="w-full pl-7 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#89cf07]/20 transition-all outline-none text-sm" 
                placeholder="000" 
                type="number" 
                value={workerformData.experience}
                onChange={(e) => setWorkerFormData({ ...workerformData, experience: e.target.value })}
                onFocus={() => setLocalError('')}
              />
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold">Job Description</label>
          <textarea 
            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#89cf07]/20 transition-all outline-none resize-none text-sm" 
            placeholder="Describe your experience, tools you own, and the types of jobs you excel at..." 
            rows="3"
            value={workerformData.job_description}
            onChange={(e) => setWorkerFormData({ ...workerformData, job_description: e.target.value })}
            onFocus={() => setLocalError('')}
          ></textarea>
        </div>
      </section>

      {(error || localError) && (
            <p className="mt-2 text-[9px] text-red-500 text-center font-bold uppercase">{error || localError}</p>
        )}

      {/* Home Location Section */}
        <section className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#8ad007] text-[20px]">distance</span>
            <h2 className="text-lg font-bold">Set Home Location</h2>
            </div>
            <div className="text-xs text-gray-500">Your address is never shared publicly</div>
        </div>

        {/* Address Search Display (Auto-filled by map) */}
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
        {/* --- END OF LOCATION PICKER REPLACEMENT --- */}

        </section>

      {/* Skills & Expertise Section */}
      <section className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="material-symbols-outlined text-[#8ad007] text-[20px]">bolt</span>
          <h2 className="text-lg font-bold">Skills & Expertise</h2>
        </div>

        {/* Selected Skills */}
        <div className="flex flex-wrap gap-2.5">
          {selectedSkills.map((skill) => (
            <div
              key={skill.id}
              className="inline-flex items-center gap-1.5 bg-[#8ad007] text-white px-3 py-1.5 rounded-full text-xs font-medium"
            >
              {skill.name}
              <span
                className="material-symbols-outlined text-xs cursor-pointer"
                onClick={() => handleSkillRemove(skill.id)}
              >
                close
              </span>
            </div>
          ))}
        </div>


        {/* Search Skills */}
        <div className="mt-5">
          <input 
            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#89cf07]/20 outline-none text-sm" 
            placeholder="Search more skills..." 
            type="text"
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
          />
        </div>

        {/* Skills Dropdown */}
        {skillSearch.trim() && filteredSkills.length > 0 && (
          <div className="w-full flex flex-col gap-0.5 mt-2">
            {filteredSkills.map((skillObj) => (
              <div
                key={skillObj.id}
                className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-[11px] font-medium hover:bg-gray-200 cursor-pointer border hover:border-[#8ad007]/30"
                onClick={() => handleSkillAdd(skillObj)}
              >
                <span className="material-symbols-outlined text-[12px] leading-none">
                  add
                </span>
                {skillObj.name}
              </div>
            ))}
          </div>
        )}
      </section>




      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-4 pb-12">
        <button 
          type="button"
          className="flex items-center gap-2 text-gray-500 hover:text-[#161811] font-medium transition-colors text-sm"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Personal Details
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
  </main>

  {/* Footer */}
  <footer className="border-t border-gray-100 py-6 bg-gray-50/50">
    <div className="max-w-5xl mx-auto px-6 text-center text-xs text-gray-400">
      © 2024 Hustlr Marketplace Inc. All rights reserved. 
      <span className="mx-2">•</span>
      <a className="hover:text-[#8ad007] underline underline-offset-4" href="#">Terms of Service</a>
      <span className="mx-2">•</span>
      <a className="hover:text-[#8ad007] underline underline-offset-4" href="#">Privacy Policy</a>
    </div>
  </footer>
</div>
  );
};

export default WorkerProfileSetup;