// cart.js

export function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(item) {
  const cart = getCart();

  const existing = cart.find(i => i.id === item.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      qty: 1
    });
  }

  saveCart(cart);
  updateCartCount();
}

export function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  const badge = document.getElementById("cart-count");
  if (badge) {
    badge.textContent = count;
  }
}
