import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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

/* ===============================
   FIREBASE CONFIG
================================ */
const firebaseConfig = {
  apiKey: "AIzaSyD_d-3XHe5Mzv-cgMKYvXQoWnSaXwPp-gU",
  authDomain: "cloud-kitchen-40ed2.firebaseapp.com",
  projectId: "cloud-kitchen-40ed2",
  storageBucket: "cloud-kitchen-40ed2.firebasestorage.app",
  messagingSenderId: "132072129862",
  appId: "1:132072129862:web:7fd86fed49f0fd0484d147"
};

/* ===============================
   INIT
================================ */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

/* ===============================
   ELEMENTS
================================ */
const avatarPreview = document.getElementById("avatarPreview");
const avatarInput = document.getElementById("profileAvatar");
const nameInput = document.getElementById("profileName");
const emailInput = document.getElementById("profileEmail");
const saveBtn = document.getElementById("saveProfile");

/* ===============================
   LOAD PROFILE
================================ */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) return;

  const data = snap.data();

  avatarPreview.src = data.avatar;
  nameInput.value = data.name || "";
  emailInput.value = data.email;
});

/* ===============================
   SAVE PROFILE
================================ */
saveBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  let avatarURL = avatarPreview.src;

  // Upload new avatar if selected
  if (avatarInput.files.length > 0) {
    const file = avatarInput.files[0];
    const avatarRef = ref(
      storage,
      `avatars/${user.uid}/avatar.png`
    );

    await uploadBytes(avatarRef, file);
    avatarURL = await getDownloadURL(avatarRef);
  }

  await updateDoc(doc(db, "users", user.uid), {
    name: nameInput.value,
    avatar: avatarURL
  });

  alert("Profile updated successfully!");
});
