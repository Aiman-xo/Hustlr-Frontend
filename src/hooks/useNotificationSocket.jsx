// Hustlr-frontend/src/hooks/useNotificationSocket.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
// Import the action you'll create in your slice later
// import { addNotification } from '../redux/notificationSlice'; 

export const useNotificationSocket = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    // Connect to your separate WebSocket service port (e.g., 8001)
    // Note: Make sure the URL matches your backend (e.g., ws://localhost:8001/ws/notifications/)
    const token = localStorage.getItem('access_token')
    const socket = new WebSocket(`ws://localhost/ws/notifications/?token=${token}`);

    socket.onopen = () => {
      console.log("--- FRONTEND: WebSocket Connected Successfully ---");
    };

    socket.onclose = (e) => {
      console.log(`--- FRONTEND: WebSocket Closed. Code: ${e.code}, Reason: ${e.reason} ---`);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // 1. Update Redux State (Commented out until you have your slice ready)
      // dispatch(addNotification(data));

      // 2. Trigger React-Toastify
      // In Toastify, we usually combine title and message or use a custom component
      toast.success(
        <div>
          <strong>{data.title}</strong>
          <div>{data.message}</div>
        </div>, 
        {
          position: "top-right",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };



    return () => socket.close();
  }, [userId, dispatch]);
};