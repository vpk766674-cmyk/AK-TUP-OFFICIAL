// js/auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

/* ====== PUT YOUR FIREBASE CONFIG BELOW ======
   Get config from Firebase Console -> Project settings -> SDK setup
*/
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_MSG_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  registerBtn.addEventListener("click", () => {
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPass").value.trim();
    if (!email || !pass) return alert("Email and password required");
    createUserWithEmailAndPassword(auth, email, pass)
      .then(() => { alert("Account created"); window.location.href = "login.html"; })
      .catch(e => alert(e.message));
  });
}

const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPass").value.trim();
    if (!email || !pass) return alert("Email and password required");
    signInWithEmailAndPassword(auth, email, pass)
      .then(() => { window.location.href = "topup.html"; })
      .catch(e => alert(e.message));
  });
}

// export auth if needed elsewhere
export { auth, app };
