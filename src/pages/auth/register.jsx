import React from 'react'
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from '../../redux/slice/authSlice';
import {useNavigate,useParams} from 'react-router-dom';
import { Link } from 'react-router-dom';
import { GoogleAuth } from '../../redux/slice/authSlice';
import { useGoogleLogin } from '@react-oauth/google';
import { requestAndSaveToken } from '../../firebase/firebase-config';

function Register() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {selectedRole} = useParams()

    const {loading,error,isAuthenticated,role,isNewUser} = useSelector((state)=>state.auth)
    
    let [localError,setLocalError] = useState('')

    let [formData,setFormData] = useState({
        email:"",
        password:"",
        confirm_password:"",
        role:selectedRole

    })


    const registeration = (e)=>{
        e.preventDefault()
        if (!formData.email.trim()) {
            setLocalError("Email is required");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]{2,}\.)+[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.email)) {
            setLocalError("Please enter a valid email address (e.g. name@gmail.com)");
            return;
        }
        
        if (!formData.password.trim()) {
            setLocalError("Password is required");
            return;
        }

        if (!formData.confirm_password.trim()){
            setLocalError('confirm your password');
            return
        }
        
        setLocalError("");
        dispatch(registerUser(formData))
    }

    const triggerGoogleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => {
            console.log("Code received:", codeResponse.code);
            dispatch(GoogleAuth({ 
                code: codeResponse.code, 
                role: selectedRole || 'worker' 
            }));
        },
        onError: (error) => console.log('Google Login Failed:', error),
        flow: 'auth-code', 
        redirect_uri: "https://hustlrr.duckdns.org:30443/api/google/auth/"
    });

    useEffect(() => {
        console.log("Redirect Check - Auth:", isAuthenticated, "Role:", role, "isNewUser:", isNewUser);
        if (!isAuthenticated || !role) return;

        if (role === "worker" || role === "employer") {
          requestAndSaveToken(); // This runs in the background
        }

        if(isNewUser){
            if (role === "worker") {
                navigate("/worker/profile-setup", { replace: true });
              } else if (role === "employer") {
                navigate("/employer/profile-setup", { replace: true });
              } else if (role === "admin") {
                navigate("/admin", { replace: true });
              }
        }
        else{
            if (role === "worker") {
                navigate("/worker/dashboard", { replace: true });
              } else if (role === "employer") {
                navigate("/employer/dashboard", { replace: true });
              } else if (role === "admin") {
                navigate("/admin", { replace: true });
              }
        }
      

      }, [isAuthenticated, role, navigate]);

  return (
<div>
  <div className="bg-[#f7f8f5] h-screen flex flex-col font-['Manrope'] transition-colors duration-300 overflow-hidden">

    {/* Header: Reduced py-3 to py-2 */}
    <header className="w-full px-6 py-2 flex justify-between items-center max-w-[1200px] mx-auto shrink-0">
      <div className="flex items-center gap-2 text-[#1c230f]">
        <div className="w-8 h-8">
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
        <h1 className="text-base font-extrabold tracking-tight">Hustlr</h1>
      </div>

      <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 hidden sm:block">Ready to get started?</span>
          {/* <button className="text-sm font-bold text-[#89cf07] hover:text-[#89cf07]/80 transition-colors">Login</button> */}
        </div>
    </header>

    {/* Main: Justify-center handles vertical centering without scroll */}
    <main className="flex-1 flex items-center justify-center px-4">
      {/* Reduced max-w and p-10 to p-6 */}
      <div className="w-full max-w-[380px] bg-white rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04)] p-6 border border-gray-100/50">
        
        {/* Title Area: Reduced mb-6 to mb-4 */}
        <div className="flex flex-col items-center mb-4">
          <div className="size-9 rounded-full flex items-center justify-center mb-2 text-[#89cf07]">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
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
          <h2 className="text-lg font-bold text-[#1c230f] text-center">Join as <span className='text-[#8ad007]'>{selectedRole}</span></h2>
          <p className="text-gray-500 text-[10px] mt-0.5 text-center">Start your journey with Hustlr today.</p>
        </div>

        {/* Form: Tightened space-y-4 to space-y-3 */}
        <form className="space-y-3" onSubmit={registeration}>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#1c230f] uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#89cf07]">
                <span className="material-symbols-outlined text-lg">mail</span>
              </div>
              <input 
                className="w-full pl-10 pr-4 py-3 bg-[#f7f8f5] border-transparent focus:bg-white focus:border-[#89cf07] focus:ring-4 focus:ring-[#89cf07]/5 rounded-lg text-xs outline-none transition-all" 
                placeholder="name@gmail.com" 
                value={formData.email}
                onChange={(e)=>setFormData({...formData, email:e.target.value})}
                onFocus={() => setLocalError('')}
                type="email" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#1c230f] uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#89cf07]">
                <span className="material-symbols-outlined text-lg">lock</span>
              </div>
              <input 
                className="w-full pl-10 pr-4 py-3 bg-[#f7f8f5] border-transparent focus:bg-white focus:border-[#89cf07] focus:ring-4 focus:ring-[#89cf07]/5 rounded-lg text-xs outline-none transition-all" 
                placeholder="••••••••"
                value={formData.password} 
                onChange={(e)=>setFormData({...formData, password:e.target.value})}
                onFocus={() => setLocalError('')}
                type="password" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#1c230f] uppercase tracking-wider ml-1">Confirm Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#89cf07]">
                <span className="material-symbols-outlined text-lg">lock_reset</span>
              </div>
              <input 
                className="w-full pl-10 pr-10 py-3 bg-[#f7f8f5] border-transparent focus:bg-white focus:border-[#89cf07] focus:ring-4 focus:ring-[#89cf07]/5 rounded-lg text-xs outline-none transition-all" 
                placeholder="••••••••"
                type="password" 
                value={formData.confirm_password} 
                onChange={(e)=>setFormData({...formData, confirm_password:e.target.value})}
                onFocus={() => setLocalError('')}
              />
              {formData.confirm_password && formData.password === formData.confirm_password && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#89cf07]">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2 py-0.5">
            <input className="mt-0.5 w-3 h-3 rounded border-gray-300 text-[#89cf07] focus:ring-[#89cf07]" id="terms" type="checkbox" />
            <label className="text-[9px] text-gray-400 leading-tight" htmlFor="terms">
              Agree to Hustlr's <a className="text-[#89cf07] font-bold" href="#">Terms</a> and <a className="text-[#89cf07] font-bold" href="#">Privacy</a>.
            </label>
          </div>

          <button 
            className="w-full bg-[#89cf07] hover:bg-[#89cf07]/90 text-[#1c230f] font-extrabold py-2.5 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-lg shadow-[#89cf07]/10" 
            disabled={loading}
            type="submit"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </form>

        {/* Divider: Reduced my-6 to my-4 */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-[9px] uppercase font-bold text-gray-300"><span className="bg-white px-2">Or continue with</span></div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 rounded-lg h-9 border border-slate-100 bg-white text-slate-500 text-[10px] font-bold hover:bg-slate-50 transition-all"
        onClick={()=>triggerGoogleLogin()}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
          Google
        </button>

        {/* Errors Area */}
        {(error || localError) && (
          <p className="mt-2 text-[9px] text-red-500 text-center font-bold uppercase">{error || localError}</p>
        )}

        <div className="mt-4 pt-3 border-t border-gray-50 text-center">
          <p className="text-[10px] text-gray-500 font-medium">
            Already have an account? <Link className="text-[#89cf07] font-bold hover:underline" to={'/login'}>Login</Link>
          </p>
        </div>
      </div>
    </main>

    {/* Footer: Reduced p-4 to p-2 */}
    <footer className="w-full p-2 text-center shrink-0">
      <div className="flex justify-center gap-4 mb-1">
        <a className="text-[8px] text-gray-400 font-bold uppercase tracking-widest" href="#">Support</a>
        <a className="text-[8px] text-gray-400 font-bold uppercase tracking-widest" href="#">FAQ</a>
      </div>
      <p className="text-[8px] text-gray-300 uppercase tracking-[0.2em]">© 2024 Hustlr Marketplace Inc.</p>
    </footer>
  </div>
</div>
  )
}

export default Register