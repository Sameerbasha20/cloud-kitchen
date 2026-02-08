/* ===============================
   STICKY HEADER SHADOW ON SCROLL
================================ */
const header = document.getElementById("site-header");

if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  });
}

/* ===============================
   MOBILE NAV TOGGLE
================================ */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Auto close menu when a link is clicked
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });
}

/* ===============================
   SCROLL REVEAL ANIMATION
================================ */
const sections = document.querySelectorAll("section");

if (sections.length > 0) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach(section => {
    section.classList.add("hidden");
    observer.observe(section);
  });
}
