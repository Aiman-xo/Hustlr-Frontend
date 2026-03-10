import React, { useState } from 'react';
import { GenerateOTP } from '../../../redux/slice/forgotSlice';
import { useDispatch,useSelector} from 'react-redux';


const ForgotPasswordModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    let [email,setEmail] = useState('')
    let [localError,setLocalError] = useState('')
    const dispatch =useDispatch()
    const {loading,error} = useSelector((state)=>state.resetPass)

    function handleGenerateOTP(){
        if (!email.trim()){
            setLocalError('Please Give your email!')
            return;
        }
        setLocalError("");
        dispatch(GenerateOTP(email))

    }

 

  

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Forgot Password?</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#89cf07] flex items-center justify-center text-white shadow-lg shadow-[#89cf07]/30 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="material-symbols-outlined text-[32px] fill-icon">lock_reset</span>
            </div>
            <div className="space-y-1">
              <p className="text-gray-600 text-xs font-medium leading-relaxed">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
            <div className="w-full space-y-1.5 text-left">
              <label className="text-xs font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">mail</span>
                <input 
                  className="w-full pl-10 pr-3 py-3 rounded-xl text-[#161811] focus:outline-0 focus:ring-2 focus:ring-[#89cf07]/20 border border-slate-200 bg-white  text-xs font-bold placeholder:text-slate-400 transition-all" 
                  placeholder="marcus@example.com" 
                  type="email"
                  onChange={(e)=>{
                    setEmail(e.target.value)
                  }}
                />
              </div>
              {(error || localError) && (
                <p className="mt-2 text-[9px] text-red-500 text-center font-bold uppercase">{error || localError}</p>
                )}
            </div>
            <div className="w-full space-y-2 pt-2">
              <button className="w-full text-xs bg-[#89cf07] hover:bg-[#89cf07]/90 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-[#89cf07]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              onClick={handleGenerateOTP}>
                <span>{loading?'Generating...':'Generate OTP'}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
              <button 
                onClick={onClose}
                className="w-full text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">keyboard_backspace</span>
                <span>Back to Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;