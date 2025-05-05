import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage, deleteToken } from "firebase/messaging";

// ✅ Firebase Config (Uses environment variables)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGEINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID,
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const fireBaseMessaging = getMessaging(app);
const fireBaseMessaging = '';

// ✅ Function to request notification permission and generate token
export const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      await generateNewToken();
    } else {
      console.error("❌ Notification permission denied.");
    }
  } catch (error) {
    console.error("🚨 Error requesting notification permission:", error);
  }
};

// ✅ Function to generate a new FCM token
// const generateNewToken = async () => {
//   try {
//     console.log("Checking existing FCM token...");

//     const existingToken = await getToken(fireBaseMessaging, {
//       vapidKey: "BLdMbpbydMVgzTl_ZNGPcnOk-EAoA8dYMsOtVqlgajdN9FXNXTlyVntoVq5mCfBHIB8-4xzSO51YCdTbSbkLXF0",
//     });

//     if (existingToken) {
//       console.log("✅ Using existing FCM Token:", existingToken);
//       return existingToken; // Return existing token if available
//     } else {
//       console.log("🔄 No token found, generating a new one...");
//       const newToken = await getToken(fireBaseMessaging, {
//         vapidKey: "BLdMbpbydMVgzTl_ZNGPcnOk-EAoA8dYMsOtVqlgajdN9FXNXTlyVntoVq5mCfBHIB8-4xzSO51YCdTbSbkLXF0",
//       });

//       if (newToken) {
//         console.log("✅ New FCM Token Generated:", newToken);
//         localStorage.setItem('fcmToken', newToken);
//         return newToken;
//       } else {
//         console.error("❌ Failed to get a token. Ensure permissions are granted.");
//       }
//     }
//   } catch (error) {
//     console.error("🚨 Error generating/retrieving token:", error);
//   }
// };
const generateNewToken = async () => {
  try {

    // Check if token is already stored in localStorage
    const existingToken = localStorage.getItem('fcmToken');
    
    if (existingToken) {
      return existingToken; // Return existing token if available
    } else {

      // Generate new token
      const newToken = await getToken(fireBaseMessaging, {
        vapidKey: "BLdMbpbydMVgzTl_ZNGPcnOk-EAoA8dYMsOtVqlgajdN9FXNXTlyVntoVq5mCfBHIB8-4xzSO51YCdTbSbkLXF0",
      });

      if (newToken) {
        
        // Store the newly generated token in localStorage
        localStorage.setItem('fcmToken', newToken);
        return newToken;
      } else {
        console.error("❌ Failed to get a token. Ensure permissions are granted.");
      }
    }
  } catch (error) {
    console.error("🚨 Error generating/retrieving token:", error);
  }
};
// ✅ Function to handle foreground messages
export const setupOnMessageListener = () => {
  onMessage(fireBaseMessaging, (payload) => {
    // alert(`New Notification: ${payload.notification.title}`);
  });
};

export { db, fireBaseMessaging, generateNewToken };
