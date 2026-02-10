// profile.js
import { auth, db, storage } from "./firebase.js";

import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

const avatarPreview = document.getElementById("avatarPreview");
const avatarInput = document.getElementById("profileAvatar");
const nameInput = document.getElementById("profileName");
const emailInput = document.getElementById("profileEmail");
const saveBtn = document.getElementById("saveProfile");

let selectedFile = null;

/* ===============================
   AUTH STATE
================================ */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  if (emailInput) {
    emailInput.value = user.email || "";
  }

  const snap = await getDoc(doc(db, "users", user.uid));
  if (snap.exists()) {
    const data = snap.data();

    if (nameInput) {
      nameInput.value = data.name || "";
    }

    if (avatarPreview && data.avatar) {
      avatarPreview.src = data.avatar;
    }
  }
});

/* ===============================
   PREVIEW AVATAR
================================ */
if (avatarInput) {
  avatarInput.addEventListener("change", (e) => {
    selectedFile = e.target.files[0];
    if (selectedFile && avatarPreview) {
      avatarPreview.src = URL.createObjectURL(selectedFile);
    }
  });
}

/* ===============================
   SAVE PROFILE
================================ */
if (saveBtn) {
  saveBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;

    let avatarURL = null;

    try {
      // Upload avatar if selected
      if (selectedFile) {
        const avatarRef = ref(
          storage,
          `avatars/${user.uid}/${selectedFile.name}`
        );

        await uploadBytes(avatarRef, selectedFile);
        avatarURL = await getDownloadURL(avatarRef);
      }

      // Update Firestore profile
      await updateDoc(doc(db, "users", user.uid), {
        name: nameInput?.value || "",
        ...(avatarURL && { avatar: avatarURL })
      });

      // 🔁 Update navbar avatar immediately
      const navAvatar = document.getElementById("nav-avatar");
      if (navAvatar && avatarURL) {
        navAvatar.src = avatarURL;
      }

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Failed to update profile. Check console.");
    }
  });
}
