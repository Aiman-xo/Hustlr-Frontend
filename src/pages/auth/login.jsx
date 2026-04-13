import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/slice/authSlice';
import { useDispatch, useSelector } from "react-redux";
import ForgotPasswordModal from './components/ForgotPasswordModal';
import VerifyOTPModal from './components/VerifyOTPModal';
import { GoogleAuth } from '../../redux/slice/authSlice';
import { useGoogleLogin } from '@react-oauth/google';
import { requestAndSaveToken } from '../../firebase/firebase-config';

const HustlrLogin = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
      

    const {loading,error,isAuthenticated,role} = useSelector((state)=>state.auth)
    const {otp_send} = useSelector((state)=>state.resetPass)
    
    let [localError,setLocalError] = useState('')
    let [showForgotPassword, setShowForgotPassword] = useState(false);
    let [showOTPVerify, setShowOTPVerify] = useState(false);

    let [formData,setFormData] = useState({
        email:'',
        password:''
    })

    const Login = (e)=>{
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
        
        setLocalError("");
        dispatch(loginUser(formData))
    }

    const triggerGoogleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => {
            console.log("Code received:", codeResponse.code);
            dispatch(GoogleAuth({ 
                code: codeResponse.code, 
                role: role 
            }));
        },
        onError: (error) => console.log('Google Login Failed:', error),
        flow: 'auth-code', 
    });
    useEffect(()=>{
        if(otp_send === true){
            setShowForgotPassword(false)
            setShowOTPVerify(true)
        }
    },[otp_send])


    useEffect(() => {
        if (!isAuthenticated || !role) return;
      
        // Request token for both workers and employers
        if (role === "worker" || role === "employer") {
          requestAndSaveToken();
        }

        if (role === "worker") {
          navigate("/worker/dashboard", { replace: true });
        } else if (role === "employer") {
          navigate("/employer/dashboard", { replace: true });
        } else if (role === "admin") {
          navigate("/admin", { replace: true });
        }
      }, [isAuthenticated, role, navigate]);


  return (
    // Changed min-h-screen to h-screen and added overflow-hidden to prevent scrolling
    <div className="bg-white h-screen flex flex-col font-['Manrope',_sans-serif] selection:bg-[#89cf07]/30 overflow-hidden">

        <ForgotPasswordModal 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
        />

        <VerifyOTPModal isOpen={showOTPVerify}
        onClose={()=>setShowOTPVerify(false)}/>
      
      {/* --- Top Navigation --- */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-100 px-6 md:px-10 py-3 bg-white z-10 shrink-0">
        <div className="flex items-center gap-2 text-[#161811]">
          <div className="size-5 text-[#89cf07]">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-base font-extrabold leading-tight tracking-tight">Hustlr</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 hidden sm:inline-block">New here?</span>
          <Link to="/role" className="flex min-w-[70px] cursor-pointer items-center justify-center rounded-lg h-8 px-3 bg-[#89cf07]/10 text-[#89cf07] text-xs font-bold transition-all hover:bg-[#89cf07]/20">
            Sign up
          </Link>
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
        
        {/* Central Login Card */}
        <div className="w-full max-w-[380px] bg-white rounded-xl p-6 md:p-8 border border-slate-100 z-10" 
             style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.04)' }}>
          
          {/* Headline - Scaled down font sizes */}
          <div className="mb-6">
            <h1 className="text-[#161811] tracking-tight text-2xl font-extrabold leading-tight mb-1">Welcome back</h1>
            <p className="text-slate-500 text-xs">Log in to manage your marketplace hustles.</p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={Login}>
            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label className="text-[#161811] text-xs font-semibold leading-normal">Email Address</label>
              <div className="relative">
                <input 
                  className="flex w-full rounded-lg text-[#161811] focus:outline-0 focus:ring-2 focus:ring-[#89cf07]/20 border border-slate-200 bg-white  h-10 placeholder:text-slate-400 px-4 text-xs font-normal transition-all" 
                  placeholder="e.g., alex@example.com" 
                  type="email"
                  onChange={(e)=>{
                    setFormData({
                        ...formData,
                        email:e.target.value
                    })
                  }}
                  onFocus={() => setLocalError('')}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-[#161811] text-xs font-semibold leading-normal">Password</label>
                <a className="text-[#89cf07] text-[10px] font-bold hover:underline" 
                onClick={()=>{
                    setShowForgotPassword(true)
                }}>Forgot Password?</a>
              </div>
              <div className="relative">
                <input 
                  className="flex w-full rounded-lg text-[#161811] focus:outline-0 focus:ring-2 focus:ring-[#89cf07]/20 border border-slate-200 bg-white  h-10 placeholder:text-slate-400 px-4 text-xs font-normal transition-all" 
                  placeholder="••••••••" 
                  type="password"
                  onChange={(e)=>{
                    setFormData({
                        ...formData,
                        password:e.target.value
                    })
                  }}
                  onFocus={() => setLocalError('')}
                />
              </div>
            </div>

            {/* Login Button */}
            <button className="w-full flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#89cf07] text-white text-sm font-bold transition-all hover:bg-[#89cf07]/90 active:scale-[0.98] shadow-lg shadow-[#89cf07]/10 mt-2" type="submit"
            disabled={loading}>
              <span className="text-sm">{loading?'Logging In':'Log In'}</span>
            </button>
          </form>

          {error && (
            <p className="mt-3 text-[11px] text-red-500 text-center font-medium">
                {error}
            </p>
            )}
            {localError && (
            <p className="mt-3 text-[11px] text-red-500 text-center font-medium">
                {localError}
            </p>
            )}

          {/* Divider */}
          <div className="relative my-6">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-3 text-slate-300 font-bold tracking-wider">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <button className="w-full flex items-center justify-center gap-2 rounded-lg h-10 border border-slate-200 bg-white text-slate-600 text-xs font-bold transition-all hover:bg-slate-50"
          onClick={()=>triggerGoogleLogin()}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Google
          </button>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <p className="text-[11px] text-slate-400">
              Don't have an account? 
              <Link className="text-[#89cf07] font-bold hover:underline ml-1" to="/role">Sign up</Link>
            </p>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-8 flex gap-4 text-[10px] text-slate-400 font-medium z-10">
          <a className="hover:text-[#89cf07] transition-colors" href="#">Privacy</a>
          <a className="hover:text-[#89cf07] transition-colors" href="#">Terms</a>
          <a className="hover:text-[#89cf07] transition-colors" href="#">Help</a>
        </div>

        {/* --- Visual Accents --- */}
        <div className="fixed top-0 right-0 -z-0 opacity-15 pointer-events-none">
          <div className="w-96 h-96 bg-[#89cf07] rounded-full blur-[80px] -mr-36 -mt-36"></div>
        </div>
        <div className="fixed bottom-0 left-0 -z-0 opacity-15 pointer-events-none">
          <div className="w-80 h-80 bg-[#89cf07] rounded-full blur-[60px] -ml-28 -mb-28"></div>
        </div>
      </main>
    </div>
  );
};

export default HustlrLogin;