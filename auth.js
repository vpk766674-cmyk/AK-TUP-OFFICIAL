// Firebase Import (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBP-rRs3PMpnLJN5********",  
  authDomain: "ak-tup-offlclal.firebaseapp.com",
  projectId: "ak-tup-offlclal",
  storageBucket: "ak-tup-offlclal.appspot.com",
  messagingSenderId: "526899333324",
  appId: "1:526899333324:web:e29889503231e873ec9a69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// REGISTER
document.getElementById("registerBtn").addEventListener("click", function () {
  const email = document.getElementById("regEmail").value;
  const pass = document.getElementById("regPass").value;

  createUserWithEmailAndPassword(auth, email, pass)
    .then(() => alert("Registration Successful!"))
    .catch((error) => alert(error.message));
});

// LOGIN
document.getElementById("loginBtn").addEventListener("click", function () {
  const email = document.getElementById("logEmail").value;
  const pass = document.getElementById("logPass").value;

  signInWithEmailAndPassword(auth, email, pass)
    .then(() => alert("Login Successful!"))
    .catch((error) => alert(error.message));
});
