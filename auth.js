import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_MSG_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

document.getElementById("registerBtn")?.addEventListener("click", () => {
  let email = document.getElementById("regEmail").value;
  let pass = document.getElementById("regPass").value;

  createUserWithEmailAndPassword(auth, email, pass)
    .then(() => alert("Account created!"))
    .catch(err => alert(err.message));
});

document.getElementById("loginBtn")?.addEventListener("click", () => {
  let email = document.getElementById("loginEmail").value;
  let pass = document.getElementById("loginPass").value;

  signInWithEmailAndPassword(auth, email, pass)
    .then(() => window.location.href = "topup.html")
    .catch(err => alert(err.message));
});
