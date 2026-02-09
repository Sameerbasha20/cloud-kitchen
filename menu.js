// menu.js
import { addToCart } from "./cart.js";

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const buttons = document.querySelectorAll(".add-to-cart");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".menu-card");

      const item = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: Number(card.dataset.price),
        imageUrl: card.dataset.image
      };

      addToCart(item);
    });
  });
});
