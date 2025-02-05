import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAzkcwNsVNICMItb2yPqLbRd_mEzTJHeOw",
  authDomain: "auth-9dee8.firebaseapp.com",
  projectId: "auth-9dee8",
  storageBucket: "auth-9dee8.firebasestorage.app",
  messagingSenderId: "756307782838",
  appId: "1:756307782838:web:d1a3c2598ea40594cb0a17"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);