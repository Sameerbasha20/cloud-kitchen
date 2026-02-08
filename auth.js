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
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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
const storage = getStorage(app);

/* ===============================
   AUTH FUNCTIONS
================================ */
window.signup = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Account created successfully!");
      location.href = "login.html";
    })
    .catch(e => alert(e.message));

window.login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      location.href = "index.html";
    })
    .catch(e => alert(e.message));

window.logout = () =>
  signOut(auth).then(() => {
    location.href = "login.html";
  });

/* ===============================
   NAVBAR AUTH UI + AVATAR
================================ */
const authArea = document.getElementById("authArea");

if (authArea) {
  onAuthStateChanged(auth, async (user) => {

    /* ---------- USER NOT LOGGED IN ---------- */
    if (!user) {
      authArea.innerHTML = `
        <a href="login.html" class="auth-link">Login</a>
        <a href="signup.html" class="auth-link">Sign Up</a>
      `;
      return;
    }

    /* ---------- USER LOGGED IN ---------- */
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    const DEFAULT_AVATAR =
      "https://firebasestorage.googleapis.com/v0/b/cloud-kitchen-40ed2.firebasestorage.app/o/default.png?alt=media";

    let avatarUrl = DEFAULT_AVATAR;

    if (userSnap.exists() && userSnap.data().avatar) {
      avatarUrl = userSnap.data().avatar;
    }

    authArea.innerHTML = `
      <div class="avatar-wrapper">
        <img src="${avatarUrl}" class="avatar" id="avatarImg">

        <input type="file" id="avatarInput" accept="image/*" hidden>

        <div class="avatar-menu" id="avatarMenu">
          <p>${user.email}</p>
          <button id="changeAvatarBtn">Change Photo</button>
          <button onclick="logout()">Logout</button>
        </div>
      </div>
    `;

    /* ---------- TOGGLE MENU ---------- */
    document.getElementById("avatarImg").onclick = () => {
      document.getElementById("avatarMenu").classList.toggle("show");
    };

    /* ---------- CHANGE AVATAR ---------- */
    document.getElementById("changeAvatarBtn").onclick = () => {
      document.getElementById("avatarInput").click();
    };

    document.getElementById("avatarInput").onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const avatarRef = ref(
          storage,
          `avatars/${user.uid}/profile.png`
        );

        await uploadBytes(avatarRef, file);
        const downloadURL = await getDownloadURL(avatarRef);

        await setDoc(
          userRef,
          { avatar: downloadURL },
          { merge: true }
        );

        document.getElementById("avatarImg").src = downloadURL;
        alert("Profile picture updated!");
      } catch (err) {
        alert(err.message);
      }
    };
  });
}
