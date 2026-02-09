/* ===============================
   FIREBASE IMPORTS
================================ */
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
  storageBucket: "cloud-kitchen-40ed2.firebasestorage.app",
  messagingSenderId: "132072129862",
  appId: "1:132072129862:web:7fd86fed49f0fd0484d147"
};

/* ===============================
   INIT
================================ */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ===============================
   SIGNUP
================================ */
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      // 🔥 Create Firestore user automatically
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        avatar:
          "https://firebasestorage.googleapis.com/v0/b/cloud-kitchen-40ed2.appspot.com/o/avatars%2Fdefault.png?alt=media",
        createdAt: new Date()
      });

      alert("Account created!");
      window.location.href = "login.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

/* ===============================
   LOGIN
================================ */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      // 🔁 Ensure Firestore doc exists
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          email: user.email,
          avatar:
              "https://firebasestorage.googleapis.com/v0/b/cloud-kitchen-40ed2.appspot.com/o/avatars%2Fdefault.png?alt=media",

          createdAt: new Date()
        });
      }

      window.location.href = "index.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

/* ===============================
   LOGOUT
================================ */
window.logout = async () => {
  await signOut(auth);
  window.location.href = "login.html";
};

/* ===============================
   NAVBAR AUTH STATE
================================ */
const authArea = document.getElementById("authArea");

if (authArea) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      authArea.innerHTML = `
        <a href="login.html" class="auth-link">Login</a>
        <a href="signup.html" class="auth-link">Sign Up</a>
      `;
      return;
    }

    const snap = await getDoc(doc(db, "users", user.uid));
    const data = snap.data();

    authArea.innerHTML = `
      <div class="account">
        <img src="${data.avatar}" class="avatar" />
        <div class="account-menu">
          <p>${data.email}</p>
          <button onclick="logout()">Logout</button>
        </div>
      </div>
    `;
  });
}
