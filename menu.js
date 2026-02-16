document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".menu-card");
  const tabs = document.querySelectorAll(".tab-btn");
  const searchInput = document.getElementById("searchInput");

  // NEW: dropdown elements
  const comboDropdown = document.querySelector(".combo-dropdown");
  const comboToggle = document.querySelector(".combo-toggle");
  const comboMenu = document.querySelector(".combo-menu");
  const comboItems = document.querySelectorAll(".combo-item");

  let currentCategory = "all";
  let currentSubCategory = "all";

  /* ===============================
      FILTER + SEARCH FUNCTION
  =============================== */
  function filterItems() {
    const searchValue = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";

    cards.forEach(card => {
      const category = (card.dataset.category || "").toLowerCase();
      const subcategory = (card.dataset.subcategory || "").toLowerCase();
      const name = (card.dataset.name || "").toLowerCase();

      let matchCategory = false;

      // ALL
      if (currentCategory === "all") {
        matchCategory = true;
      }

      // COMBO
      else if (currentCategory === "combo") {
        if (currentSubCategory === "all") {
          matchCategory = category === "combo";
        } else {
          matchCategory =
            category === "combo" &&
            subcategory === currentSubCategory;
        }
      }

      // OTHER CATEGORIES
      else {
        matchCategory = category === currentCategory;
      }

      const matchSearch = name.includes(searchValue);

      if (matchCategory && matchSearch) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }

  /* ===============================
      MAIN TAB CLICK EVENTS
  =============================== */
  tabs.forEach(tab => {
    tab.addEventListener("click", function () {
      const isComboToggle = this.classList.contains("combo-toggle");

      // If user clicked Combos main button, just toggle dropdown, do not reset category here
      if (isComboToggle) {
        if (comboMenu) {
          const open = comboMenu.style.display === "block";
          comboMenu.style.display = open ? "none" : "block";
        }
        return;
      }

      // Normal tabs (All, Veg, Non‑Veg, Juices)
      tabs.forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");

      currentCategory = (this.dataset.category || "all").toLowerCase();
      currentSubCategory = "all";

      // Close dropdown if open
      if (comboMenu) comboMenu.style.display = "none";

      filterItems();
    });
  });

  /* ===============================
      COMBO DROPDOWN EVENTS
  =============================== */

  // Choose specific combo subcategory
  comboItems.forEach(item => {
    item.addEventListener("click", () => {
      currentCategory = "combo";
      currentSubCategory = (item.dataset.sub || "all").toLowerCase();

      // Active state on main tabs
      tabs.forEach(btn => btn.classList.remove("active"));
      if (comboToggle) comboToggle.classList.add("active");

      // Close dropdown
      if (comboMenu) comboMenu.style.display = "none";

      filterItems();
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", e => {
    if (comboDropdown && !comboDropdown.contains(e.target)) {
      if (comboMenu) comboMenu.style.display = "none";
    }
  });

  /* ===============================
      SEARCH EVENT
  =============================== */
  if (searchInput) {
    searchInput.addEventListener("input", filterItems);
  }

  /* ===============================
      CART + QUANTITY SYSTEM
  =============================== */
  cards.forEach(card => {
    const plus = card.querySelector(".plus");
    const minus = card.querySelector(".minus");
    const qtyDisplay = card.querySelector(".qty");
    const addBtn = card.querySelector(".add-to-cart");

    let quantity = 1;

    if (plus && minus && qtyDisplay) {
      plus.addEventListener("click", () => {
        quantity++;
        qtyDisplay.textContent = quantity;
      });

      minus.addEventListener("click", () => {
        if (quantity > 1) {
          quantity--;
          qtyDisplay.textContent = quantity;
        }
      });
    }

    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const item = {
          id: card.dataset.id,
          name: card.dataset.name,
          price: Number(card.dataset.price),
          image: card.dataset.image,
          quantity: quantity
        };

        addToCart(item);

        quantity = 1;
        if (qtyDisplay) qtyDisplay.textContent = 1;
      });
    }
  });

  // Initial render
  filterItems();
});

/* ===============================
    ADD TO CART FUNCTION
================================ */
function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(i => i.id === item.id);

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  showToast(item.name + " added to cart!");
}

/* ===============================
    MODERN TOAST NOTIFICATION
================================ */
function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");

  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "#2E7D32";
  toast.style.color = "#fff";
  toast.style.padding = "12px 20px";
  toast.style.borderRadius = "999px";
  toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
  toast.style.zIndex = "9999";
  toast.style.opacity = "0";
  toast.style.transform = "translateY(10px)";
  toast.style.transition = "all 0.3s ease";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 10);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}