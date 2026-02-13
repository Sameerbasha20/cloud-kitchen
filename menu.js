document.addEventListener("DOMContentLoaded", () => {

  const cards = document.querySelectorAll(".menu-card");
  const tabs = document.querySelectorAll(".tab-btn");
  const searchInput = document.getElementById("searchInput");

  let currentCategory = "all";

  /* ===============================
     FILTER + SEARCH FUNCTION
  =============================== */

  function filterItems() {
    const searchValue = searchInput
      ? searchInput.value.toLowerCase()
      : "";

    cards.forEach(card => {
      const category = card.dataset.category || "all";
      const name = (card.dataset.name || "").toLowerCase();

      const matchCategory =
        currentCategory === "all" || category === currentCategory;

      const matchSearch = name.includes(searchValue);

      if (matchCategory && matchSearch) {
        // let CSS control layout (flex/grid)
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }

  /* ===============================
     TAB CLICK EVENTS
  =============================== */

  if (tabs.length > 0) {
    tabs.forEach(tab => {
      tab.addEventListener("click", function () {

        tabs.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");

        currentCategory = this.dataset.category;
        filterItems();
      });
    });
  }

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

    // Quantity controls (juices have it)
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

    // Add to cart
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

        // Reset quantity
        quantity = 1;
        if (qtyDisplay) qtyDisplay.textContent = 1;
      });
    }

  });

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