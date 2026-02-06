// ===============================
// SCROLL REVEAL ANIMATION
// ===============================

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.15
  }
);

// Elements to animate on scroll
document.querySelectorAll(
  "section, .menu-category, .gallery-item"
).forEach(el => {
  el.classList.add("hidden");
  observer.observe(el);
});
