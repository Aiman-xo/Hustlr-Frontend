// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import api from "../api/axiosInstance";
import { getMessaging, getToken } from "firebase/messaging";
import { toast } from "react-toastify";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBH5yFLKvYJDQaXU6nnVJucWdlMXr0y8t4",
  authDomain: "hustlr-push-notification.firebaseapp.com",
  projectId: "hustlr-push-notification",
  storageBucket: "hustlr-push-notification.firebasestorage.app",
  messagingSenderId: "857946832582",
  appId: "1:857946832582:web:171c2432ae43d69361a1c7",
  measurementId: "G-VDYVDRNY8T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app)
const analytics = getAnalytics(app);

export const requestAndSaveToken = async () => {
    try {
      // 1. Ask for permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Notification permission denied");
        return;
      }
  
      // 2. Get the Token from Firebaset
      const currentToken = await getToken(messaging, {
        vapidKey: "BFjg4MVMEsJRrDP7wo3G7mWybzGW5kte9uX9Sn3WohxCLVhl4lsV3pQtoI2nKGTLpDf3nOD9CJaLC_lVqXvolHs"
      });
  
      if (currentToken) {
        // 3. Send to your new Django Endpoint
        // const accessToken = localStorage.getItem("access_token");
        await api.post('update-fcm_token/', 
          { fcm_token: currentToken },
          // { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        console.log("FCM Token synced to Django");
      }
    } catch (error) {
      console.error("Error syncing FCM token:", error);
      console.error("couldnt send token!");
    }
  };