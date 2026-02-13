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
export function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Update cart count in navbar
export function updateCartCount() {
  const cart = getCart();

  // support both qty and quantity (old data)
  const count = cart.reduce((sum, item) => {
    const q = item.qty ?? item.quantity ?? 0;
    return sum + q;
  }, 0);

  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.textContent = count;
  }
}

/* =======================
   ADD TO CART
======================= */

export function addToCart(item) {
  const cart = getCart();

  const existing = cart.find(i => i.id === item.id);

  if (existing) {
    // prefer qty, fallback to quantity
    if (typeof existing.qty === "number") {
      existing.qty += 1;
    } else if (typeof existing.quantity === "number") {
      existing.quantity += 1;
    } else {
      existing.qty = 2; // previously had 1
    }
  } else {
    // store with qty so everything is consistent going forward
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
    return false;
  }

  if (cart.length === 0) {
    alert("Your cart is empty");
    return false;
  }

  // Normalize items and calculate total
  const normalizedItems = cart.map(item => {
    const qty = item.qty ?? item.quantity ?? 1;
    return {
      ...item,
      qty,
      quantity: undefined // optional: drop old field
    };
  });

  const total = normalizedItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.qty,
    0
  );

  try {
    // Fetch user snapshot
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.exists() ? userSnap.data() : {};

    // Create order in Firestore
    await addDoc(collection(db, "orders"), {
      userId: user.uid,
      userName: userData.name || "Unknown",
      userEmail: userData.email || user.email || "",
      items: normalizedItems,
      total,
      status: "pending",
      createdAt: serverTimestamp()
    });

    // Clear cart
    localStorage.removeItem("cart");
    updateCartCount();

    alert("Order placed successfully");
    return true;
  } catch (error) {
    console.error("Order placement failed:", error);
    alert("Failed to place order. Please try again.");
    return false;
  }
}

/* =======================
   INIT
======================= */

// Ensure cart count is correct on page load
updateCartCount();
