import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_d-3XHe5Mzv-cgMKYvXQoWnSaXwPp-gU",
  authDomain: "cloud-kitchen-40ed2.firebaseapp.com",
  projectId: "cloud-kitchen-40ed2",
  storageBucket: "cloud-kitchen-40ed2.appspot.com",
  messagingSenderId: "132072129862",
  appId: "1:132072129862:web:7fd86fed49f0fd0484d147"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.signup = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => location.href = "login.html")
    .catch(e => alert(e.message));

window.login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)
    .then(() => location.href = "index.html")
    .catch(e => alert(e.message));

window.logout = () =>
  signOut(auth).then(() => location.href = "login.html");
