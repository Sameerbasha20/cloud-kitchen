// ===============================
// Firebase Setup
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔥 PASTE YOUR firebaseConfig HERE
const firebaseConfig = {
  apiKey: "AIzaSyD_d-3XHe5Mzv-cgMKYvXQoWnSaXwPp-gU",
  authDomain: "cloud-kitchen-40ed2.firebaseapp.com",
  projectId: "cloud-kitchen-40ed2",
  storageBucket: "cloud-kitchen-40ed2.firebasestorage.app",
  messagingSenderId: "132072129862",
  appId: "1:132072129862:web:7fd86fed49f0fd0484d147"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ===============================
// SIGN UP
// ===============================
window.signup = function (email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Account created successfully!");
      window.location.href = "login.html";
    })
    .catch(error => {
      alert(error.message);
    });
};

// ===============================
// LOGIN
// ===============================
window.login = function (email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(error => {
      alert(error.message);
    });
};

// ===============================
// LOGOUT
// ===============================
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

// ===============================
// AUTH GUARD (PROTECT PAGES)
// ===============================
window.checkAuth = function () {
  onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.href = "login.html";
    }
  });
};
