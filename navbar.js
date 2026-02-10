import { auth } from "./firebase.js";
import { signOut, onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { updateCartCount } from "./cart.js";

export function initNavbar(activePage = "") {
  /* ------------------------
     ACTIVE LINK
  ------------------------- */
  document.querySelectorAll(".nav-links a").forEach(link => {
    if (link.dataset.page === activePage) {
      link.classList.add("active");
    }
  });

  /* ------------------------
     CART COUNT
  ------------------------- */
  updateCartCount();

  /* ------------------------
     PROFILE MENU TOGGLE
  ------------------------- */
  const avatar = document.getElementById("navAvatar");
  const menu = document.getElementById("avatarMenu");
  const logoutBtn = document.getElementById("logoutBtn");
  const emailEl = document.getElementById("navUserEmail");

  if (!avatar || !menu) return;

  // Toggle menu on avatar click
  avatar.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.style.display =
      menu.style.display === "block" ? "none" : "block";
  });

  // Close menu when clicking outside
  document.addEventListener("click", () => {
    menu.style.display = "none";
  });

  /* ------------------------
     AUTH STATE
  ------------------------- */
  onAuthStateChanged(auth, (user) => {
    if (user) {
      emailEl.textContent = user.email;
    } else {
      // If logged out, redirect safely
      window.location.href = "login.html";
    }
  });

  /* ------------------------
     LOGOUT
  ------------------------- */
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}
