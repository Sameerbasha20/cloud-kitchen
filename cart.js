// cart.js
import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { auth, db } from "./firebase.js";

/* =======================
   CART HELPERS
======================= */

// Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Update cart count in header
export function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  const cartEl = document.getElementById("cart-count");
  if (cartEl) cartEl.textContent = count;
}

/* =======================
   ADD TO CART (USED BY menu.js)
======================= */

export function addToCart(item) {
  const cart = getCart();

  const existing = cart.find(i => i.id === item.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  saveCart(cart);
  alert("Added to cart");
}

/* =======================
   PLACE ORDER
======================= */

export async function placeOrder() {
  const user = auth.currentUser;
  const cart = getCart();

  if (!user) {
    alert("Please login to place an order");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  // Calculate total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // 🔹 Fetch user snapshot
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.exists() ? userSnap.data() : {};

  // 🔹 Create order in Firestore
  await addDoc(collection(db, "orders"), {
    userId: user.uid,
    userName: userData.name || "Unknown",
    userEmail: userData.email || user.email || "",

    items: cart,
    total,
    status: "pending",
    createdAt: serverTimestamp()
  });

  // Clear cart
  localStorage.removeItem("cart");
  updateCartCount();

  alert("Order placed successfully");

  // Optional redirect
  window.location.href = "my-orders.html";
}

/* =======================
   INIT
======================= */

updateCartCount();
