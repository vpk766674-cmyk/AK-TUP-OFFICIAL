// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Register
const regBtn = document.getElementById("registerBtn");
if (regBtn) {
  regBtn.addEventListener("click", () => {
    const email = document.getElementById("regEmail").value;
    const pass = document.getElementById("regPass").value;
    createUserWithEmailAndPassword(auth, email, pass)
      .then(() => alert("Account Created!"))
      .catch((e) => alert(e.message));
  });
}

// Login
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value;
    const pass = document.getElementById("loginPass").value;
    signInWithEmailAndPassword(auth, email, pass)
      .then(() => {
        alert("Login Successful!");
        window.location.href = "topup.html";
      })
      .catch((e) => alert(e.message));
  });
}
