// auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { auth, db } from "./firebase.js";

const DEFAULT_AVATAR =
  "https://firebasestorage.googleapis.com/v0/b/cloud-kitchen-40ed2.firebasestorage.app/o/default.png?alt=media";

/* ===============================
   SIGNUP
================================ */
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = signupForm.signupEmail.value;
    const password = signupForm.signupPassword.value;

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: "",
        avatar: DEFAULT_AVATAR,
        createdAt: serverTimestamp()
      });

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

    const email = loginForm.loginEmail.value;
    const password = loginForm.loginPassword.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
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
        <a href="profile.html" title="My Profile">
          <img src="${data.avatar}" class="avatar" />
        </a>
        <div class="account-menu">
          <p>${data.email}</p>
          <button onclick="logout()">Logout</button>
        </div>
      </div>
    `;
  });
}
