import React, { useState } from 'react';

const BillingModal = ({ isOpen, onClose, onConfirm, laborAmount, isLoading }) => {
    const [materialAmount, setMaterialAmount] = useState(0);
    const PRIMARY = "#8ad007";

    if (!isOpen) return null;

    const totalAmount = parseFloat(laborAmount) + parseFloat(materialAmount || 0);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)'
        }}>
            <div style={{
                background: '#fff',
                padding: '32px',
                borderRadius: '24px',
                width: '400px',
                boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
                fontFamily: "'Manrope', sans-serif"
            }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 900 }}>Job Completed!</h3>
                <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#71717a' }}>Great work. Please review the billing details below.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>Labor Amount</span>
                        <span style={{ fontSize: '16px', fontWeight: 800 }}>₹{parseFloat(laborAmount).toFixed(2)}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Material / Bill Amount (Optional)</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: '#94a3b8' }}>₹</span>
                            <input
                                type="number"
                                value={materialAmount}
                                onChange={(e) => setMaterialAmount(e.target.value)}
                                placeholder="0.00"
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 28px',
                                    borderRadius: '12px',
                                    border: '1.5px solid #e2e8f0',
                                    fontSize: '15px',
                                    fontWeight: 700,
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = PRIMARY}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: `${PRIMARY}10`, borderRadius: '12px', border: `1.5px solid ${PRIMARY}30` }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: PRIMARY }}>Total Amount</span>
                        <span style={{ fontSize: '20px', fontWeight: 900, color: PRIMARY }}>₹{totalAmount.toFixed(2)}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '14px',
                            border: '1.5px solid #e2e8f0',
                            background: '#fff',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(materialAmount)}
                        disabled={isLoading}
                        style={{
                            flex: 2,
                            padding: '12px',
                            borderRadius: '14px',
                            border: 'none',
                            background: PRIMARY,
                            color: '#fff',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: `0 8px 16px ${PRIMARY}40`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Bill'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillingModal;
