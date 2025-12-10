
// auth.js - module
// Firebase Import (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

/* ============================
   Replace with your Firebase config (you already have these values)
   ============================ */
const firebaseConfig = {
  apiKey: "AIzaSyBP-rRs3PMpnLJN5ioJHY6vlAhXEwhh-Xc",
  authDomain: "ak-tup-offlclal.firebaseapp.com",
  projectId: "ak-tup-offlclal",
  storageBucket: "ak-tup-offlclal.appspot.com",
  messagingSenderId: "526899333324",
  appId: "1:526899333324:web:e29889503231e873ec9a69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* --------------------------
   Helper: small alert box
   -------------------------- */
function showMsg(msg) {
  // simple alert — আপনি চাইলে nicer UI করবেন
  alert(msg);
}

/* --------------------------
   REGISTER
   Only run if register page elements exist
   -------------------------- */
const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  registerBtn.addEventListener("click", () => {
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPass").value;

    if (!email || !pass) {
      showMsg("Email ও Password দিন");
      return;
    }
    if (pass.length < 6) {
      showMsg("Password কমপক্ষে 6 অক্ষর হতে হবে");
      return;
    }

    createUserWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        showMsg("Registration Successful!");
        // redirect to dashboard
        window.location.href = "index.html";
      })
      .catch((error) => {
        showMsg(error.message);
      });
  });
}

/* --------------------------
   LOGIN
   -------------------------- */
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("logEmail").value.trim();
    const pass = document.getElementById("logPass").value;

    if (!email || !pass) {
      showMsg("Email ও Password দিন");
      return;
    }

    signInWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        showMsg("Login Successful!");
        window.location.href = "index.html";
      })
      .catch((error) => {
        showMsg(error.message);
      });
  });
}

/* --------------------------
   LOGOUT (in dashboard)
   -------------------------- */
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        window.location.href = "login.html";
      })
      .catch((error) => {
        showMsg(error.message);
      });
  });
}

/* --------------------------
   Protect dashboard: redirect if not logged in
   Also show user email on dashboard
   -------------------------- */
onAuthStateChanged(auth, (user) => {
  // If user is on index.html (dashboard) and no user => send to login
  const path = window.location.pathname.split("/").pop();

  if (path === "" || path === "index.html") {
    if (user) {
      // show email
      const userEmailEl = document.getElementById("userEmail");
      const userIdEl = document.getElementById("userId");
      if (userEmailEl) userEmailEl.textContent = user.email || "No Email";
      if (userIdEl) userIdEl.textContent = `UID: ${user.uid}`;
    } else {
      // not logged in -> go to login page
      window.location.href = "login.html";
    }
  } else {
    // If user is logged in and on login/register page, optionally redirect to dashboard:
    if (user && (path === "login.html" || path === "register.html")) {
      window.location.href = "index.html";
    }
  }
});
