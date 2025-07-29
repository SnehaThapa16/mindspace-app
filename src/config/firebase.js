import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyDgzTMmx8awwgf_ZIUYfaCzTZduUuK2O_o",
  authDomain: "mindspace-app-d9fe5.firebaseapp.com",
  projectId: "mindspace-app-d9fe5",
  storageBucket: "mindspace-app-d9fe5.firebasestorage.app",
  messagingSenderId: "99451409841",
  appId: "1:99451409841:web:2d2dd6d18cc75dac941990"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;