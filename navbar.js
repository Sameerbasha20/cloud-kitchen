// navbar.js
import { updateCartCount } from "./cart.js";

/* ===============================
   INIT NAVBAR
================================ */

export function initNavbar(activePage = "") {

  /* ===============================
     ACTIVE LINK
  ================================ */
  const links = document.querySelectorAll(".nav-links a");

  links.forEach(link => {
    if (link.dataset.page === activePage) {
      link.classList.add("active");
    }
  });

  /* ===============================
     CART COUNT
  ================================ */
  updateCartCount();

  /* ===============================
     MOBILE MENU (OPTIONAL)
  ================================ */
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.onclick = () => {
      navLinks.classList.toggle("active");
    };
  }
}
