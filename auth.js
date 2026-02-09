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

/* ===============================
   INIT
================================ */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ===============================
   AUTH FUNCTIONS
================================ */
window.signup = async (email, password) => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // 🔥 CREATE USER DOCUMENT (THIS FIXES YOUR ERROR)
    await setDoc(doc(db, "users", cred.user.uid), {
      email: cred.user.email,
      avatar: "https://cloud-kitchen-40ed2.firebasestorage.app/avatars/default.png",
      createdAt: new Date()
    });

    alert("Account created successfully!");
    location.href = "login.html";
  } catch (e) {
    alert(e.message);
  }
};

window.login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)
    .then(() => location.href = "index.html")
    .catch(e => alert(e.message));

window.logout = () =>
  signOut(auth).then(() => location.href = "login.html");

/* ===============================
   NAVBAR AUTH UI
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

    // 🔥 SAFE READ (doc now exists)
    const snap = await getDoc(doc(db, "users", user.uid));
    const data = snap.exists() ? snap.data() : {};

    const avatar = data.avatar ||
      "https://cloud-kitchen-40ed2.firebasestorage.app/avatars/default.png";

    authArea.innerHTML = `
      <div class="account">
        <img src="${avatar}" class="avatar" />
        <button onclick="logout()" class="logout-btn">Logout</button>
      </div>
    `;
  });
}
