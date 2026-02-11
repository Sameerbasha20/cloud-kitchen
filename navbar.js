import { onAuthStateChanged, signOut } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { doc, getDoc } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { auth, db } from "./firebase.js";
import { updateCartCount } from "./cart.js";

export function initNavbar(activePage = "") {

  /* ===============================
     ACTIVE LINK
  ================================ */
  document.querySelectorAll(".nav-links a").forEach(link => {
    if (link.dataset.page === activePage) {
      link.classList.add("active");
    }
  });

  /* ===============================
     CART COUNT
  ================================ */
  updateCartCount();

  /* ===============================
     MOBILE HAMBURGER (FIXED)
  ================================ */
  const toggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  /* ===============================
     STICKY SHADOW EFFECT
  ================================ */
  const header = document.getElementById("site-header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  /* ===============================
     AUTH STATE
  ================================ */
  const authArea = document.getElementById("authArea");
  if (!authArea) return;

  onAuthStateChanged(auth, async (user) => {

    // 🔹 NOT LOGGED IN
    if (!user) {
      authArea.innerHTML = `
        <a href="login.html" class="auth-link">Login</a>
        <a href="signup.html" class="auth-link">Sign Up</a>
      `;
      return;
    }

    // 🔹 LOGGED IN
    const snap = await getDoc(doc(db, "users", user.uid));
    const data = snap.exists() ? snap.data() : {};

    authArea.innerHTML = `
      <div class="avatar-wrapper">
        <img
          src="${data.avatar || 'images/avatars/default.png'}"
          class="avatar"
          id="avatarBtn"
          alt="Profile"
        />

        <div class="avatar-menu" id="avatarMenu">
          <p>${data.email}</p>
          <a href="profile.html">My Profile</a>
          ${data.role === "admin" ? `<a href="admin.html">Admin</a>` : ""}
          <button id="logoutBtn">Logout</button>
        </div>
      </div>
    `;

    const avatarBtn = document.getElementById("avatarBtn");
    const avatarMenu = document.getElementById("avatarMenu");

    // Toggle dropdown
    avatarBtn.addEventListener("click", () => {
      avatarMenu.classList.toggle("show");
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".avatar-wrapper")) {
        avatarMenu.classList.remove("show");
      }
    });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await signOut(auth);
      window.location.href = "login.html";
    });

  });
}
