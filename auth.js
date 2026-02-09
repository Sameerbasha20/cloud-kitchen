// ===============================
// Firebase Imports
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ===============================
// Firebase Config
// ===============================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "cloud-kitchen-40ed2.firebaseapp.com",
  projectId: "cloud-kitchen-40ed2",
  storageBucket: "cloud-kitchen-40ed2.firebasestorage.app",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

// ===============================
// Init Firebase
// ===============================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===============================
// UI Elements
// ===============================
const authArea = document.getElementById("authArea");

// ===============================
// Auth State Listener
// ===============================
onAuthStateChanged(auth, async (user) => {
  if (!authArea) return;

  // ===============================
  // USER LOGGED IN
  // ===============================
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    // 🔥 AUTO-CREATE USER DOCUMENT
    if (!snap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        avatar:
          "https://cloud-kitchen-40ed2.firebasestorage.app/avatars/default.png",
        createdAt: new Date()
      });
    }

    const userData = (await getDoc(userRef)).data();

    authArea.innerHTML = `
      <div class="user-menu">
        <img src="${userData.avatar}" class="avatar" />
        <button id="logoutBtn">Logout</button>
      </div>
    `;

    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await signOut(auth);
      location.reload();
    });

  // ===============================
  // USER LOGGED OUT
  // ===============================
  } else {
    authArea.innerHTML = `
      <a href="login.html" class="btn-login">Login</a>
      <a href="signup.html" class="btn-signup">Sign Up</a>
    `;
  }
});
