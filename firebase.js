// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_d-3XHe5Mzv-cgMKYvXQoWnSaXwPp-gU",
  authDomain: "cloud-kitchen-40ed2.firebaseapp.com",
  projectId: "cloud-kitchen-40ed2",
  storageBucket: "cloud-kitchen-40ed2.firebasestorage.app",
  messagingSenderId: "132072129862",
  appId: "1:132072129862:web:7fd86fed49f0fd0484d147"
};

// ✅ Initialize ONCE
export const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
