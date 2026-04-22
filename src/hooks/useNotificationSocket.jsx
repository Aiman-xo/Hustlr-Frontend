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
    console.log(`[NotificationSocket] Hook called with userId: ${userId}`);
    if (!userId) {
      console.log('[NotificationSocket] No userId yet, skipping connection.');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('[NotificationSocket] No token in localStorage, skipping connection.');
      return;
    }

    console.log(`[NotificationSocket] Connecting for userId: ${userId}`);
    const socket = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/notifications/?token=${token}`);

    socket.onopen = () => {
      console.log(`[NotificationSocket] ✅ Connected successfully for userId: ${userId}`);
    };

    socket.onclose = (e) => {
      console.log(`[NotificationSocket] ❌ Closed. Code: ${e.code}, Reason: ${e.reason}`);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('[NotificationSocket] 📩 Message received:', data);

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