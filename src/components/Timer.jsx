import React, { useState, useEffect } from 'react';

const Timer = ({ startTime, isActive }) => {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let intervalId;

        const calculateElapsed = () => {
            if (startTime) {
                const start = new Date(startTime).getTime();
                const now = new Date().getTime();
                setElapsedTime(Math.max(0, Math.floor((now - start) / 1000)));
            }
        };

        if (isActive && startTime) {
            calculateElapsed(); // Initial calculation
            intervalId = setInterval(calculateElapsed, 1000);
        } else if (!isActive && startTime) {
            calculateElapsed();
        }

        return () => clearInterval(intervalId);
    }, [startTime, isActive]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: isActive ? '#8ad007' : '#71717a',
            fontWeight: '800',
            fontSize: '14px',
            fontFamily: "'JetBrains Mono', monospace"
        }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', animation: isActive ? 'pulse 2s infinite' : 'none' }}>
                timer
            </span>
            {formatTime(elapsedTime)}
            <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default Timer;
