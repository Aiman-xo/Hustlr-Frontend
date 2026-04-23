import React, { useEffect, useState } from 'react';

/**
 * A Premium Success Modal with a high-end Green Tick Animation.
 */
export default function PaymentSuccessModal({ isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 bg-slate-900/60 backdrop-blur-sm ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-[6px] p-10 max-w-sm w-full shadow-2xl text-center transform transition-all duration-500 ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-10'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          .checkmark-circle {
            width: 100px;
            height: 100px;
            position: relative;
            display: inline-block;
            vertical-align: top;
            margin-bottom: 24px;
          }
          .checkmark-circle .background {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: #8ad007;
            position: absolute;
            transform: scale(0);
            animation: grow 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .checkmark-circle .checkmark {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            display: block;
            stroke-width: 4;
            stroke: #fff;
            stroke-miterlimit: 10;
            stroke-dashoffset: 48;
            stroke-dasharray: 48;
            animation: stroke 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
            position: relative;
            z-index: 10;
          }
          
          @keyframes grow {
            0% { transform: scale(0); }
            100% { transform: scale(1); }
          }
          @keyframes stroke {
            100% { stroke-dashoffset: 0; }
          }
        `}</style>
        
        <div className="checkmark-circle">
          <div className="background"></div>
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <path className="checkmark_check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-2">Payment Success!</h2>
        <p className="text-slate-500 font-medium  text-xs mb-8 leading-relaxed">
          Your transaction was verified successfully. The worker will be notified of the payout.
        </p>

        <button 
          onClick={onClose}
          className="w-full bg-[#8ad007] text-white font-black py-4 rounded-sm shadow-lg shadow-[#8ad007]/30 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest cursor-pointer"
        >
          Great, thanks!
        </button>
      </div>
    </div>
  );
}
