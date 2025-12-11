// auth.js
// Using Firebase CDN Modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

/* ---------------------- Firebase Config (Corrected) ---------------------- */
const firebaseConfig = {
  apiKey: "AIzaSyBP-rRs3PMpnLJN5ioJHY6vlAhXEwhh-Xc",
  authDomain: "ak-tup-offlclal.firebaseapp.com",
  projectId: "ak-tup-offlclal",
  storageBucket: "ak-tup-offlclal.appspot.com",
  messagingSenderId: "526899333324",
  appId: "1:526899333324:web:e29889503231e873ec9a69"
};
/* ------------------------------------------------------------------------ */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ------------------ Registration ------------------ */
const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  registerBtn.addEventListener("click", () => {
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPass").value.trim();
    if (!email || !pass) return alert("Email এবং Password দিন");

    createUserWithEmailAndPassword(auth, email, pass)
      .then(() => {
        alert("Registration Successful!");
        location.href = "login.html";
      })
      .catch(err => alert(err.message));
  });
}

/* ------------------ Login ------------------ */
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("logEmail").value.trim();
    const pass = document.getElementById("logPass").value.trim();
    if (!email || !pass) return alert("Email এবং Password দিন");

    signInWithEmailAndPassword(auth, email, pass)
      .then(() => {
        alert("Login Successful!");
        location.href = "dashboard.html";
      })
      .catch(err => alert(err.message));
  });
}

/* ------------------ Logout ------------------ */
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      location.href = "index.html";
    });
  });
}

/* ------------------ Dashboard & Auth State ------------------ */
onAuthStateChanged(auth, (user) => {
  const userEmailEl = document.getElementById("userEmail");
  const userUidEl = document.getElementById("userUid");

  if (userEmailEl && userUidEl) {
    if (user) {
      userEmailEl.innerText = `Welcome, ${user.email}`;
      userUidEl.innerText = `UID: ${user.uid}`;
    } else {
      alert("অনুগ্রহ করে লগইন করুন");
      location.href = "login.html";
    }
  }

  const dashLink = document.getElementById("dashLink");
  if (dashLink) dashLink.style.display = user ? "inline-block" : "none";
});

/* ------------------ Products (Diamond Top-up) ------------------ */
const products = [
  { id: 1, title: "25 Diamond", price: 25 },
  { id: 2, title: "115 Diamond", price: 78 },
  { id: 3, title: "610 Diamond", price: 395 },
  { id: 4, title: "1240 Diamond", price: 790 },
  { id: 5, title: "2530 Diamond", price: 1580 },
  { id: 6, title: "5050 Diamond", price: 3160 }
];

function renderProducts() {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = "";
  products.forEach(p => {
    const el = document.createElement("div");
    el.className = "product card";
    el.innerHTML = `
      <h4>${p.title}</h4>
      <p><strong>৳ ${p.price}</strong></p>
      <button data-id="${p.id}" class="primary buyBtn">Order</button>
    `;
    container.appendChild(el);
  });

  container.querySelectorAll(".buyBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const user = auth.currentUser;

      if (!user) {
        if (confirm("অর্ডার করতে লগইন প্রয়োজন। এখন লগইন করবেন?"))
          location.href = "login.html";
        return;
      }

      const prod = products.find(x => x.id == id);
      if (!prod) return;

      alert(`অর্ডার সফল (ডেমো): ${prod.title} - ৳${prod.price}\nআপনি: ${user.email}`);

      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.push({ ...prod, email: user.email, ts: Date.now() });
      localStorage.setItem("orders", JSON.stringify(orders));

      location.href = "dashboard.html";
    });
  });
}

renderProducts();

/* ------------------ Show Orders on Dashboard ------------------ */
(function showOrdersOnDashboard() {
  const ordersEl = document.getElementById("orders");
  if (!ordersEl) return;

  const orders = JSON.parse(localStorage.getItem("orders") || "[]");

  if (orders.length === 0) {
    ordersEl.innerHTML = "<p>No orders.</p>";
    return;
  }

  ordersEl.innerHTML = orders.map(o => `
    <div class="card" style="margin-bottom:10px">
      <strong>${o.title}</strong>
      <div>৳ ${o.price}</div>
      <small>${new Date(o.ts).toLocaleString()}</small>
    </div>
  `).join("");
})();
