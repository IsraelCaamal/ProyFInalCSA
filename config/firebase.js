// config/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Añade Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAHcFdQij8ydRpESy8xNomV4ojyJcMJWrs",
  authDomain: "controlsystemapp-767b3.firebaseapp.com",
  databaseURL: "https://controlsystemapp-767b3-default-rtdb.firebaseio.com",
  projectId: "controlsystemapp-767b3",
  storageBucket: "controlsystemapp-767b3.firebasestorage.app",
  messagingSenderId: "40646193378",
  appId: "1:40646193378:web:9e2d34f3a80f3d84b26ebb",
  measurementId: "G-L1Y4P5QTF7" // (Opcional, Analytics no funciona en RN)
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore (necesario para tu app)
export const db = getFirestore(app);

// Opcional: Si luego necesitas Auth o Storage
// import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";
// export const auth = getAuth(app);
// export const storage = getStorage(app);