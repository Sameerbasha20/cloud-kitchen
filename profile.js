import { getAuth, onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

import { app } from "./firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

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

  emailInput.value = user.email;

  const snap = await getDoc(doc(db, "users", user.uid));
  if (snap.exists()) {
    const data = snap.data();
    nameInput.value = data.name || "";
    avatarPreview.src = data.avatar || avatarPreview.src;
  }
});

/* ===============================
   PREVIEW AVATAR
================================ */
avatarInput.addEventListener("change", (e) => {
  selectedFile = e.target.files[0];
  if (selectedFile) {
    avatarPreview.src = URL.createObjectURL(selectedFile);
  }
});

/* ===============================
   SAVE PROFILE
================================ */
saveBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  let avatarURL = null;

  if (selectedFile) {
    // ✅ CORRECT PATH (matches rules)
    const avatarRef = ref(
      storage,
      `avatars/${user.uid}/${selectedFile.name}`
    );

    await uploadBytes(avatarRef, selectedFile);
    avatarURL = await getDownloadURL(avatarRef);
  }

  await updateDoc(doc(db, "users", user.uid), {
    name: nameInput.value,
    ...(avatarURL && { avatar: avatarURL })
  });

  alert("Profile updated successfully!");
});