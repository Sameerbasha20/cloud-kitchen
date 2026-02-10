import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { updateCartCount } from "./cart.js";

export function initNavbar(activePage = "") {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.onclick = () => {
      navLinks.classList.toggle("active");
    };
  }

  // Active link highlight
  if (activePage) {
    const activeLink = document.querySelector(
      `.nav-links a[data-page="${activePage}"]`
    );
    if (activeLink) activeLink.classList.add("active");
  }

  // Auth UI
  const authArea = document.getElementById("authArea");

  onAuthStateChanged(auth, (user) => {
    if (!authArea) return;

    if (!user) {
      authArea.innerHTML = `
        <a href="login.html" class="auth-link">Login</a>
        <a href="signup.html" class="auth-link">Sign up</a>
      `;
    } else {
      authArea.innerHTML = `
        <div class="account">
          <div class="avatar">
            <img src="images/avatars/default.png" alt="Profile">
          </div>
          <div class="account-menu">
            <p>${user.email}</p>
            <a href="profile.html" class="auth-link">Profile</a>
            <a href="my-orders.html" class="auth-link">My Orders</a>
            <button id="logoutBtn">Logout</button>
          </div>
        </div>
      `;

      document.getElementById("logoutBtn").onclick = async () => {
        await signOut(auth);
        window.location.href = "index.html";
      };
    }

    updateCartCount();
  });
}
