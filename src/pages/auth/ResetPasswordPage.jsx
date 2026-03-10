import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ResetPassword } from '../../redux/slice/forgotSlice';
import { clearForgotState } from '../../redux/slice/forgotSlice';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ResetPasswordFun = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {loading,error} = useSelector(state=>state.resetPass)
    const [redirecting, setRedirecting] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  let [localError,setLocalError] = useState('')
  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: ''
  });

  

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!formData.new_password.trim()){
        setLocalError('Please Enter the new password')
        return
    }
    if(!formData.confirm_password.trim()){
        setLocalError('Please confirm your password')
        return
    }
    setLocalError("");

    try {
        // 1️⃣ wait for backend success
        await dispatch(ResetPassword(formData)).unwrap();
    
        // 2️⃣ show spinner
        setRedirecting(true);

        dispatch(clearForgotState())
    
        // 3️⃣ delay then redirect
        setTimeout(() => {
          navigate("/login");
        }, 2000);
    
      } catch (error) {
        // backend error already handled in redux
      }
  };

  return (
<div className="bg-[#f8f9fa] font-['Manrope',_sans-serif] text-gray-900 flex min-h-screen items-center justify-center p-6">
  <div className="w-full max-w-md">
    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
      <div className="p-8 sm:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#8ad007] flex items-center justify-center text-white shadow-lg shadow-[#8ad007]/20 mb-5">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-1.5">
            Reset your password
          </h1>
          <p className="text-gray-500 text-xs">
            Please enter your new password below to secure your account.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input 
                className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8ad007]/20 transition-all outline-none text-sm" 
                placeholder="Enter new password" 
                type={showNewPassword ? "text" : "password"}
                value={formData.new_password}
                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
              />
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" 
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showNewPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input 
                className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#89cf07]/20 transition-all outline-none text-sm" 
                placeholder="Confirm new password" 
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirm_password}
                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              />
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showConfirmPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {(error || localError) && (
                <p className="mt-2 text-[9px] text-red-500 text-center font-bold uppercase">{error || localError}</p>
                )}

          {/* Password Requirements */}
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 mt-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Password Requirements
            </p>
            <ul className="space-y-1">
              <li className="flex items-center gap-2 text-[11px] text-gray-600">
                <span className="material-symbols-outlined text-[#8ad007] text-[14px]">check_circle</span>
                At least 8 characters
              </li>
              <li className="flex items-center gap-2 text-[11px] text-gray-600">
                <span className="material-symbols-outlined text-[#8ad007] text-[14px]">check_circle</span>
                One special character (e.g., !@#$%)
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <button 
            className="w-full bg-[#8ad007] hover:bg-[#7bc006] text-white font-bold h-10 rounded-xl shadow-lg shadow-[#8ad007]/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-3 text-sm" 
            type="submit"
          >
            {(loading || redirecting) ? (
                <>
                    <span className="animate-spin material-symbols-outlined text-[16px]">
                    progress_activity
                    </span>
                    <span>{redirecting ? "Redirecting..." : "Resetting..."}</span>
                </>
                ) : (
                "Reset Password"
                )}

          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Already remember? 
            <Link className="font-bold text-[#8ad007] hover:underline ml-1" to="/login">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>

    {/* Footer */}
    <p className="mt-8 text-center text-[11px] text-gray-400 font-medium tracking-wide">
      © 2024 HUSTLR MARKETPLACE. ALL RIGHTS RESERVED.
    </p>
  </div>
</div>
  );
};

export default ResetPasswordFun;