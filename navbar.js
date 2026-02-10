// navbar.js
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getCart, updateCartCount } from "./cart.js";

export function initNavbar() {
  // 🔹 Update cart count when navbar loads
  updateCartCount();

  // 🔹 Watch auth state
  onAuthStateChanged(auth, user => {
    const avatarImg = document.getElementById("nav-avatar");
    const profileLink = document.querySelector(".profile-link");

    if (user) {
      // User logged in
      if (avatarImg && user.photoURL) {
        avatarImg.src = user.photoURL;
      }

      if (profileLink) {
        profileLink.href = "profile.html";
      }
    } else {
      // User not logged in
      if (avatarImg) {
        avatarImg.src = "default-avatar.png";
      }

      if (profileLink) {
        profileLink.href = "login.html";
      }
    }
  });

  // 🔹 Keep cart count in sync across tabs
  window.addEventListener("storage", e => {
    if (e.key === "cart") {
      updateCartCount();
    }
  });
}
