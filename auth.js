// ===============================
// IMPORTS
// ===============================

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { auth, db } from "./firebase.js";

// ===============================
// CONSTANTS
// ===============================

const DEFAULT_AVATAR =
  "https://firebasestorage.googleapis.com/v0/b/cloud-kitchen-40ed2.firebasestorage.app/o/default.png?alt=media";

// ===============================
// SIGN UP
// ===============================

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = signupForm.signupEmail.value.trim();
    const password = signupForm.signupPassword.value.trim();

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: "",
        avatar: DEFAULT_AVATAR,
        role: "user",
        createdAt: serverTimestamp()
      });

      window.location.href = "index.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginForm.loginEmail.value.trim();
    const password = loginForm.loginPassword.value.trim();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "index.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

// ===============================
// LOGOUT (GLOBAL)
// ===============================

window.logout = async () => {
  await signOut(auth);
  window.location.href = "login.html";
};

// ===============================
// AUTH STATE HANDLER
// ===============================

onAuthStateChanged(auth, async (user) => {

  // Because navbar is dynamically injected,
  // we grab elements INSIDE this callback
  const authArea = document.getElementById("authArea");
  const ordersNavItem = document.getElementById("ordersNavItem");

  const currentPage = location.pathname;

  const isAuthPage =
    currentPage.includes("login") ||
    currentPage.includes("signup");

  const protectedPages = ["profile", "my-orders", "cart", "admin"];

  // ===============================
  // BLOCK AUTH PAGES IF LOGGED IN
  // ===============================

  if (user && isAuthPage) {
    window.location.href = "index.html";
    return;
  }

  // ===============================
  // PROTECT PAGES IF NOT LOGGED IN
  // ===============================

  if (
    !user &&
    protectedPages.some(page => currentPage.includes(page))
  ) {
    window.location.href = "login.html";
    return;
  }

  // If navbar not on this page, stop here
  if (!authArea) return;

  // ===============================
  // IF NOT LOGGED IN
  // ===============================

  if (!user) {

    if (ordersNavItem) {
      ordersNavItem.style.display = "none";
    }

    authArea.innerHTML = `
      <a href="login.html" class="auth-link">Login</a>
      <a href="signup.html" class="auth-link">Sign Up</a>
    `;

    return;
  }

  // ===============================
  // IF LOGGED IN
  // ===============================

  if (ordersNavItem) {
    ordersNavItem.style.display = "list-item";
  }

  let data = {};

  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    data = snap.exists() ? snap.data() : {};
  } catch (err) {
    data = {};
  }

  authArea.innerHTML = `
    <div class="account">
      <img
        src="${data.avatar || DEFAULT_AVATAR}"
        class="avatar"
        id="navAvatar"
        alt="Profile"
      />
      <div class="account-menu" id="accountMenu">
        <p class="account-email">${data.email || user.email}</p>
        <a href="profile.html">My Profile</a>
        ${
          data.role === "admin"
            ? `<a href="admin.html">Admin Dashboard</a>`
            : ""
        }
        <button type="button" onclick="logout()">Logout</button>
      </div>
    </div>
  `;

  // ===============================
  // DROPDOWN TOGGLE
  // ===============================

  const avatar = document.getElementById("navAvatar");
  const menu = document.getElementById("accountMenu");

  if (avatar && menu) {

    avatar.onclick = () => {
      menu.classList.toggle("show");
    };

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".account")) {
        menu.classList.remove("show");
      }
    });
  }

});
