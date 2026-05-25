// firebase/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBEegD3nO6J6z9oVUn-4NeJTYXU7etsSCI",
  authDomain: "individual-eda8d.firebaseapp.com",
  projectId: "individual-eda8d",
  storageBucket: "individual-eda8d.firebasestorage.app",
  messagingSenderId: "434625190927",
  appId: "1:434625190927:web:9811376860f613c532177a",
  measurementId: "G-MKQ8E92BPW"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// ✅ AUTH
const auth = getAuth(app);

// ✅ FIRESTORE
const db = getFirestore(app);

export { app, auth, db };