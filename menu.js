document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".menu-card").forEach(card => {

    const plus = card.querySelector(".plus");
    const minus = card.querySelector(".minus");
    const qtyDisplay = card.querySelector(".qty");
    const addBtn = card.querySelector(".add-to-cart");

    let quantity = 1;

    if (plus && minus) {

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
          price: parseInt(card.dataset.price),
          image: card.dataset.image,
          quantity: quantity
        };

        addToCart(item);

        quantity = 1;
        if (qtyDisplay) qtyDisplay.textContent = 1;
      });
    }

  });

});


function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(i => i.id === item.id);

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert(item.name + " added to cart!");
}
