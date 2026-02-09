import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===============================
   FIREBASE CONFIG
================================ */
const firebaseConfig = {
  apiKey: "AIzaSyD_d-3XHe5Mzv-cgMKYvXQoWnSaXwPp-gU",
  authDomain: "cloud-kitchen-40ed2.firebaseapp.com",
  projectId: "cloud-kitchen-40ed2",
  storageBucket: "cloud-kitchen-40ed2.appspot.com",
  messagingSenderId: "132072129862",
  appId: "1:132072129862:web:7fd86fed49f0fd0484d147"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ===============================
   SIGNUP
================================ */
window.signup = async (email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // 🔥 CREATE USER DOCUMENT
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      avatar: "https://cloud-kitchen-40ed2.firebasestorage.app/avatars/default.png",
      createdAt: new Date()
    });

    location.href = "login.html";
  } catch (err) {
    alert(err.message);
  }
};

/* ===============================
   LOGIN
================================ */
window.login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    location.href = "index.html";
  } catch (err) {
    alert(err.message);
  }
};

/* ===============================
   LOGOUT
================================ */
window.logout = async () => {
  await signOut(auth);
  location.href = "login.html";
};

/* ===============================
   NAVBAR AUTH UI
================================ */
const authArea = document.getElementById("authArea");

if (authArea) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const snap = await getDoc(doc(db, "users", user.uid));
      const data = snap.data();

      authArea.innerHTML = `
        <div class="account">
          <img src="${data.avatar}" class="avatar">
          <div class="account-menu">
            <p>${user.email}</p>
            <button onclick="logout()">Logout</button>
          </div>
        </div>
      `;
    } else {
      authArea.innerHTML = `
        <a href="login.html" class="auth-link">Login</a>
        <a href="signup.html" class="auth-link">Sign Up</a>
      `;
    }
  });
}
