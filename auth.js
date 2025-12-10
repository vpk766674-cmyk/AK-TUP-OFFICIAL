import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBP-rRs3PMpnLJN5ioJHY6vlAhXEwhh-Xc",
  authDomain: "ak-tup-offlclal.firebaseapp.com",
  projectId: "ak-tup-offlclal",
  storageBucket: "ak-tup-offlclal.appspot.com",
  messagingSenderId: "526899333324",
  appId: "1:526899333324:web:e29889503231e873ec9a69"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("registerBtn")?.addEventListener("click", () => {
  const email = document.getElementById("regEmail").value;
  const pass = document.getElementById("regPass").value;

  createUserWithEmailAndPassword(auth, email, pass)
    .then(() => alert("Registration Successful!"))
    .catch(error => alert(error.message));
});

document.getElementById("loginBtn")?.addEventListener("click", () => {
  const email = document.getElementById("logEmail").value;
  const pass = document.getElementById("logPass").value;

  signInWithEmailAndPassword(auth, email, pass)
    .then(() => alert("Login Successful!"))
    .catch(error => alert(error.message));
});
