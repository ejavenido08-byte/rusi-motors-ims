import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyDw1Wl3yjH1Oa2tjvVcbLHIL4_n_ATXHcA",
  authDomain:        "rusi-motors-ims.firebaseapp.com",
  projectId:         "rusi-motors-ims",
  storageBucket:     "rusi-motors-ims.appspot.com",
  messagingSenderId: "886388893853",
  appId:             "1:886388893853:web:7d91ec03ffac61c8390c74"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

export { auth, db };
