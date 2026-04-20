// Hustlr-frontend/src/hooks/useNotificationSocket.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FetchActiveJobs, GetJobMaterials, FetchJobInbox, FetchNotifications } from '../redux/slice/workerSlice';
import { SeeJobRequests, FetchInterestRequests } from '../redux/slice/employerSlice';
import { useSelector } from 'react-redux';

export const useNotificationSocket = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    // Connect to your separate WebSocket service port (e.g., 8001)
    // Note: The URL is now managed via VITE_WS_URL environment variable (e.g., in .env)
    const token = localStorage.getItem('access_token')
    const socket = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/notifications/?token=${token}`);

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

      const title = data.title || data.payload?.title || "Notification";
      const message = data.message || data.payload?.message || JSON.stringify(data);

      // 2. Trigger React-Toastify
      toast.success(
        <div>
          <strong>{title}</strong>
          <div>{message}</div>
        </div>,
        {
          position: "top-right",
          autoClose: 8000,
        }
      );

      // 3. Trigger refreshing of lists
      const type = data.type || data.payload?.type;
      if (type) {
        dispatch(FetchActiveJobs());
        dispatch(FetchJobInbox());
        dispatch(SeeJobRequests({ status: '', page: 1 }));
        dispatch(FetchInterestRequests());
        dispatch(FetchNotifications());

        // Specialized refresh for material toggles
        if (type === 'MATERIAL_TOGGLE' && (data.job_id || data.payload?.job_id)) {
          dispatch(GetJobMaterials(data.job_id || data.payload?.job_id));
        }
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };



    return () => socket.close();
  }, [userId, dispatch]);
};