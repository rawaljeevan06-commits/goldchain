// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBrNIJ-NAMZ1iSnib8zPLDqICBBawL3GRM",
  authDomain: "goldchain-e5470.firebaseapp.com",
  projectId: "goldchain-e5470",
  storageBucket: "goldchain-e5470.firebasestorage.app",
  messagingSenderId: "614150237166",
  appId: "1:614150237166:web:c3e9b7f8549a78e5a87cff"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
