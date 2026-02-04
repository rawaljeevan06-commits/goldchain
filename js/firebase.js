// js/firebase.js
// Firebase init (global)

const firebaseConfig = {
  apiKey: "AIzaSyBrNIJ-NAMZ1iSnib8zPLDqICBBawL3GRM",
  authDomain: "goldchain-e5470.firebaseapp.com",
  projectId: "goldchain-e5470",
  storageBucket: "goldchain-e5470.firebasestorage.app",
  messagingSenderId: "614150237166",
  appId: "1:614150237166:web:c3e9b7f8549a78e5a87cff"
};

firebase.initializeApp(firebaseConfig);
window.fbAuth = firebase.auth();

console.log("Firebase ready ✅");
