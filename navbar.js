// navbar.js
import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "./firebase.js";
import { updateCartCount } from "./cart.js";

const authArea = document.getElementById("authArea");

onAuthStateChanged(auth, async (user) => {
  authArea.innerHTML = "";

  if (!user) {
    authArea.innerHTML = `
      <a href="login.html" class="auth-link">Login</a>
      <a href="signup.html" class="auth-link">Signup</a>
    `;
    return;
  }

  // 🔹 fetch user profile
  const snap = await getDoc(doc(db, "users", user.uid));
  const userData = snap.exists() ? snap.data() : {};

  const avatar =
    userData.avatar ||
    "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg";

  authArea.innerHTML = `
    <a href="cart.html" class="cart-link">
      🛒 Cart <span id="cart-count">0</span>
    </a>

    <div class="account">
      <img id="nav-avatar" src="${avatar}" alt="Profile">

      <div class="account-menu" id="accountMenu">
        <p>${user.email}</p>
        <a href="profile.html">My Profile</a>
        <a href="my-orders.html">My Orders</a>
        <button id="logoutBtn">Logout</button>
      </div>
    </div>
  `;

  updateCartCount();

  const avatarBtn = document.getElementById("nav-avatar");
  const menu = document.getElementById("accountMenu");

  avatarBtn.onclick = () => {
    menu.classList.toggle("show");
  };

  document.getElementById("logoutBtn").onclick = async () => {
    await signOut(auth);
    window.location.href = "index.html";
  };
});
