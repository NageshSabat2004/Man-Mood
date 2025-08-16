// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXAdk0pw_vBJMtUXS0udIQY6lthsdSrBY",
  authDomain: "menmood-dad10.firebaseapp.com",
  projectId: "menmood-dad10",
  storageBucket: "menmood-dad10.firebasestorage.app",
  messagingSenderId: "889274542021",
  appId: "1:889274542021:web:417a227d4c7c17cf7e8dac"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
