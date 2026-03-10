import React from 'react';
import { VerifyOTP } from '../../../redux/slice/forgotSlice';
import { useDispatch,useSelector } from 'react-redux';
import { useState,useRef,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const VerifyOTPModal = ({ isOpen, onClose }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {loading,error} = useSelector((state)=>state.resetPass)
    const [redirecting, setRedirecting] = useState(false);


    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
  
    // Handle input change
    const handleChange = (index, value) => {
        // Only allow numbers and single digit
        const numValue = value.replace(/[^0-9]/g, '');
        if (numValue.length > 1) return;
        
        const newOtp = [...otp];
        newOtp[index] = numValue;
        setOtp(newOtp);
    
        // Auto-focus next input
        if (numValue && index < 5) {
        inputRefs.current[index + 1]?.focus();
        }
    };
  
    // Handle backspace
    const handleKeyDown = (index, e) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };
  
    // Handle paste
    const handlePaste = (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').slice(0, 6);
      const newOtp = [...otp];
      
      for (let i = 0; i < pastedData.length; i++) {
        if (/^\d$/.test(pastedData[i])) {
          newOtp[i] = pastedData[i];
        }
      }
      setOtp(newOtp);
    };
    // Submit handler
    const handleSubmit = async() => {
      const otpString = otp.join(''); // Combine array into string
      
      if (otpString.length === 6) {
        // Send to backend
        console.log('OTP to send:', otpString);

        try{
            await dispatch(VerifyOTP(otpString)).unwrap();

            setRedirecting(true);

            setTimeout(() => {
                onClose()
                navigate("/resetPassword");
              }, 2000);

        }
        catch(error){
            console.log('rrror');
        }


      }
    };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Verify OTP</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#89cf07] flex items-center justify-center text-white shadow-lg shadow-[#89cf07]/30 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="material-symbols-outlined text-[32px] fill-icon">verified_user</span>
            </div>
            <div className="space-y-1">
              <p className="text-gray-600 text-xs font-medium leading-relaxed">
                Enter the 6-digit code sent to your email address.
              </p>
            </div>
            <div className="w-full flex justify-between gap-2 py-3">
                {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-11 h-12 text-center text-lg font-bold rounded-xl text-[#161811] focus:outline-0 focus:ring-2 focus:ring-[#89cf07]/20 border border-slate-200 bg-white  placeholder:text-slate-400 transition-all"
                    maxLength="1"
                    placeholder="0"
                    type='text'
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                />
                ))}
            </div>
            {(error) && (
                <p className="mt-2 text-[9px] text-red-500 text-center font-bold uppercase">{error || localError}</p>
                )}
            <div className="w-full space-y-3 pt-2">
              <button className="w-full text-xs bg-[#89cf07] hover:bg-[#89cf07]/90 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-[#89cf07]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              onClick={handleSubmit}>
                    {(loading || redirecting) ? (
                        <>
                        <span className="animate-spin material-symbols-outlined text-[16px]">
                            progress_activity
                        </span>
                        <span>{redirecting ? "Redirecting..." : "Verifying..."}</span>
                        </>
                    ) : (
                        <>
                        <span>Verify & Continue</span>
                        <span className="material-symbols-outlined text-[16px]">
                            arrow_forward
                        </span>
                        </>
                    )}
              </button>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-gray-500">Didn't receive the code?</p>
                <button className="text-[#89cf07] font-bold hover:underline transition-all text-xs">
                  Resend Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPModal;