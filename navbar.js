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
     AUTH STATE (FIXED)
  ================================ */
  const authArea = document.getElementById("authArea");
  if (!authArea) return;

  onAuthStateChanged(auth, async (user) => {

    // NOT LOGGED IN
    if (!user) {
      authArea.innerHTML = `
        <a href="login.html" class="auth-link">Login</a>
        <a href="signup.html" class="auth-link">Sign Up</a>
      `;
      return;
    }

    // LOGGED IN
    const snap = await getDoc(doc(db, "users", user.uid));
    const data = snap.exists() ? snap.data() : {};

    authArea.innerHTML = `
      <div class="avatar-wrapper">
        <img
          src="${data.avatar || 'images/avatars/default.png'}"
          class="avatar"
          id="avatarBtn"
        />

        <div class="avatar-menu" id="avatarMenu">
          <p>${data.email}</p>
          <a href="profile.html">My Profile</a>
          <button id="logoutBtn">Logout</button>
        </div>
      </div>
    `;

    // TOGGLE MENU
    const avatarBtn = document.getElementById("avatarBtn");
    const avatarMenu = document.getElementById("avatarMenu");

    avatarBtn.onclick = () => {
      avatarMenu.classList.toggle("show");
    };
    
    // Mobile Toggle
const toggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (toggle) {
  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// Scroll Shadow
window.addEventListener("scroll", () => {
  const header = document.getElementById("site-header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});


    // LOGOUT
    document.getElementById("logoutBtn").onclick = async () => {
      await signOut(auth);
      window.location.href = "login.html";
    };

    // CLOSE ON OUTSIDE CLICK
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".avatar-wrapper")) {
        avatarMenu.classList.remove("show");
      }
    });
  });
}
