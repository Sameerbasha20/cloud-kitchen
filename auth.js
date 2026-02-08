import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

/* ===============================
   AUTH FUNCTIONS (KEEP)
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
  signOut(auth)
    .then(() => {
      location.href = "login.html";
    })
    .catch(e => alert(e.message));

/* ===============================
   NAVBAR AUTH UI
================================ */
const authArea = document.getElementById("authArea");

if (authArea) {
  onAuthStateChanged(auth, user => {
    if (user) {
      // USER LOGGED IN
      authArea.innerHTML = `
        <div class="account">
          <div class="account-btn" id="accountBtn">
            My Account ⌄
          </div>
          <div class="account-menu" id="accountMenu">
            <p>${user.email}</p>
            <button onclick="logout()">Logout</button>
          </div>
        </div>
      `;

      // Toggle dropdown
      document.getElementById("accountBtn").onclick = () => {
        const menu = document.getElementById("accountMenu");
        menu.style.display = menu.style.display === "block" ? "none" : "block";
      };
    } else {
      // USER LOGGED OUT
      authArea.innerHTML = `
        <a href="login.html" class="auth-link">Login</a>
        <a href="signup.html" class="auth-link">Sign Up</a>
      `;
    }
  });
}
