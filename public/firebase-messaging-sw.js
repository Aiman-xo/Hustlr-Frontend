// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');


firebase.initializeApp({

    apiKey: "AIzaSyBH5yFLKvYJDQaXU6nnVJucWdlMXr0y8t4",
    projectId: "hustlr-push-notification",
    messagingSenderId: "857946832582",
    appId: "1:857946832582:web:171c2432ae43d69361a1c7"
    
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/vite.svg'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});