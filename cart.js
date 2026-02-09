import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { auth, db } from "./firebase.js";

async function placeOrder(cart, total) {
  const user = auth.currentUser;

  if (!user) {
    alert("Please login to place an order");
    return;
  }

  // 🔹 Fetch user profile snapshot
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  const userData = userSnap.exists() ? userSnap.data() : {};

  // 🔹 Create order with snapshot
  await addDoc(collection(db, "orders"), {
    userId: user.uid,
    userName: userData.name || "Unknown",
    userEmail: userData.email || user.email || "",

    items: cart,
    total,
    status: "pending",
    createdAt: serverTimestamp()
  });

  alert("Order placed successfully");
}
