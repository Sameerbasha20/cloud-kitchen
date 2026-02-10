import { getAuth, onAuthStateChanged, signOut } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { auth } from "./firebase.js";
import { updateCartCount } from "./cart.js";

/* ===============================
   INIT NAVBAR
================================ */
export function initNavbar(activePage = "") {
  highlightActiveLink(activePage);
  setupMobileMenu();
  setupAuthUI();
  updateCartCount();
}

/* ===============================
   ACTIVE LINK
================================ */
function highlightActiveLink(activePage) {
  if (!activePage) return;

  document.querySelectorAll(".nav-links a").forEach(link => {
    if (link.dataset.page === activePage) {
      link.classList.add("active");
    }
  });
}

/* ===============================
   MOBILE MENU
================================ */
function setupMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (!toggle || !navLinks) return;

  toggle.onclick = () => {
    navLinks.classList.toggle("active");
  };
}

/* ===============================
   AUTH / PROFILE UI
================================ */
function setupAuthUI() {
  const authArea = document.getElementById("authArea");
  if (!authArea) return;

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      authArea.innerHTML = `
        <a href="login.html" class="auth-link">Login</a>
        <a href="signup.html" class="auth-link">Sign Up</a>
      `;
      return;
    }

    const avatar =
      user.photoURL ||
      "images/avatars/default.png";

    authArea.innerHTML = `
      <div class="avatar-wrapper">
        <img src="${avatar}" class="avatar" id="avatarBtn">
        <div class="avatar-menu" id="avatarMenu">
          <p>${user.email}</p>
          <button id="profileBtn">Profile</button>
          <button id="logoutBtn">Logout</button>
        </div>
      </div>
    `;

    const avatarBtn = document.getElementById("avatarBtn");
    const avatarMenu = document.getElementById("avatarMenu");

    avatarBtn.onclick = () => {
      avatarMenu.classList.toggle("show");
    };

    document.getElementById("profileBtn").onclick = () => {
      window.location.href = "profile.html";
    };

    document.getElementById("logoutBtn").onclick = async () => {
      await signOut(auth);
      window.location.href = "index.html";
    };

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".avatar-wrapper")) {
        avatarMenu.classList.remove("show");
      }
    });
  });
}
