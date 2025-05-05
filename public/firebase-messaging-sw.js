importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// ✅ Use hardcoded Firebase config (process.env doesn't work in service workers)
const firebaseConfig = {
  apiKey: "AIzaSyDYFTXPt2vAnMHMwRpsJdXEQhi08_bbGiw",
  authDomain: "advaitp2p.firebaseapp.com",
  projectId: "advaitp2p",
  storageBucket: "advaitp2p.firebasestorage.app",
  messagingSenderId: "980016524450",
  appId: "1:980016524450:web:1d1f9823798e4d44b77bfb",
  measurementId: "G-W31PM30KDC",
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// ✅ Handle background push notifications
messaging.onBackgroundMessage((payload) => {

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
