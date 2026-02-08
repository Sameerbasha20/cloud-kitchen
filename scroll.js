// Sticky header shadow
const header = document.getElementById("site-header");

if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  });
}

// Mobile nav toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// Scroll reveal animation
const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.15 }
);

sections.forEach(section => {
  section.style.opacity = 0;
  section.style.transform = "translateY(40px)";
  section.style.transition = "0.6s ease";
  observer.observe(section);
});
// ===============================
// AUTH UI HANDLING (FIREBASE)
// ===============================
const authArea = document.getElementById("authArea");

if (authArea && window.firebaseAuth) {
  firebaseAuth.onAuthStateChanged(user => {
    if (user) {
      // LOGGED IN
      authArea.innerHTML = `
        <div class="account">
          <div class="account-btn" id="accountBtn">
            My Account ⌄
          </div>
          <div class="account-menu" id="accountMenu">
            <p>${user.email}</p>
            <button id="logoutBtn">Logout</button>
          </div>
        </div>
      `;

      document.getElementById("accountBtn").onclick = () => {
        document.getElementById("accountMenu").style.display =
          document.getElementById("accountMenu").style.display === "block"
            ? "none"
            : "block";
      };

      document.getElementById("logoutBtn").onclick = () => {
        firebaseAuth.signOut().then(() => {
          window.location.href = "index.html";
        });
      };
    } else {
      // NOT LOGGED IN
      authArea.innerHTML = `
        <a href="login.html" class="auth-link">Login</a>
        <a href="signup.html" class="auth-link">Sign Up</a>
      `;
    }
  });
}
