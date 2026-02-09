// profile.js
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

import { auth, db, storage } from "./firebase.js";

const avatarPreview = document.getElementById("avatarPreview");
const avatarInput = document.getElementById("profileAvatar");
const nameInput = document.getElementById("profileName");
const emailInput = document.getElementById("profileEmail");
const saveBtn = document.getElementById("saveProfile");

let currentUser = null;
let selectedFile = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

  const snap = await getDoc(doc(db, "users", user.uid));
  const data = snap.data();

  avatarPreview.src = data.avatar;
  nameInput.value = data.name || "";
  emailInput.value = data.email;
});

// Preview avatar
avatarInput.addEventListener("change", (e) => {
  selectedFile = e.target.files[0];
  if (selectedFile) {
    avatarPreview.src = URL.createObjectURL(selectedFile);
  }
});

// Save profile
saveBtn.addEventListener("click", async () => {
  if (!currentUser) return;

  let avatarURL = avatarPreview.src;

  if (selectedFile) {
    const avatarRef = ref(storage, `avatars/${currentUser.uid}.png`);
    await uploadBytes(avatarRef, selectedFile);
    avatarURL = await getDownloadURL(avatarRef);
  }

  await updateDoc(doc(db, "users", currentUser.uid), {
    name: nameInput.value,
    avatar: avatarURL
  });

  alert("Profile updated successfully!");
});
