// ============================================================
//  RUSI MOTORS – Firebase Configuration
//  Replace these values with your own Firebase project config
//  Firebase Console → Project Settings → Your Apps → Web App
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── YOUR FIREBASE CONFIG ────────────────────────────────────
// TODO: Replace these placeholder values with your actual
//       Firebase project credentials after creating a project
//       at https://console.firebase.google.com
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDw1Wl3yjH1Oa2tjvVcbLHIL4_n_ATXHcA",
  authDomain: "rusi-motors-ims.firebaseapp.com",
  projectId: "rusi-motors-ims",
  storageBucket: "rusi-motors-ims.firebasestorage.app",
  messagingSenderId: "886388893853",
  appId: "1:886388893853:web:7d91ec03ffac61c8390c74"
};


// ── Initialize ──────────────────────────────────────────────
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

export { auth, db };
