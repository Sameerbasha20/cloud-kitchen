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
  getDoc,
  serverTimestamp
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

/* ===============================
   INIT
================================ */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ===============================
   CONSTANTS
================================ */
const DEFAULT_AVATAR =
  "https://firebasestorage.googleapis.com/v0/b/cloud-kitchen-40ed2.appspot.com/o/avatars%2Fdefault.png?alt=media";

/* ===============================
   SIGNUP
================================ */
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
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

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      // 🔁 Auto-create Firestore doc if missing
      if (!snap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          avatar: DEFAULT_AVATAR,
          createdAt: serverTimestamp()
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

    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      const data = snap.exists()
        ? snap.data()
        : { email: user.email, avatar: DEFAULT_AVATAR };

      authArea.innerHTML = `
        <div class="account">
          <img src="${data.avatar}" class="avatar" alt="User Avatar" />
          <div class="account-menu">
            <p>${data.email}</p>
            <button onclick="logout()">Logout</button>
          </div>
        </div>
      `;
    } catch (err) {
      console.error("Auth UI error:", err);
    }
  });
}
