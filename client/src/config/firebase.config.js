
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_nm-qzLT0uVVXOt6w8vC5pPzOTOAni-k",
  authDomain: "acmeacademy-4e1a4.firebaseapp.com",
  projectId: "acmeacademy-4e1a4",
  storageBucket: "acmeacademy-4e1a4.firebasestorage.app",
  messagingSenderId: "185359047117",
  appId: "1:185359047117:web:f9aa879948d9f5ccaa4c84",
  measurementId: "G-P4Z43WRCFL"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);