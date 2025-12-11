// auth.js
// Use CDN modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

/* ----------------- Put your Firebase config here -----------------
   Replace the placeholder values with your project's values from
   Firebase Console -> Project settings -> SDK setup and config
-----------------------------------------------------------------*/
const firebaseConfig = {
  apiKey: "REPLACE_APIKEY",
  authDomain: "REPLACE_AUTHDOMAIN",
  projectId: "REPLACE_PROJECTID",
  storageBucket: "REPLACE_STORAGEBUCKET",
  messagingSenderId: "REPLACE_MESSAGING_SENDER_ID",
  appId: "REPLACE_APPID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ---------- Register ----------
   If register.html is loaded, attach event
*/
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
      .catch(e => alert(e.message));
  });
}

/* ---------- Login ----------
   If login.html is loaded, attach event
*/
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
      .catch(e => alert(e.message));
  });
}

/* ---------- Logout ----------
*/
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      location.href = "index.html";
    });
  });
}

/* ---------- Auth State & Dashboard ----------
   Show user data on dashboard and protect pages
*/
onAuthStateChanged(auth, (user) => {
  // If dashboard page
  const userEmailEl = document.getElementById("userEmail");
  const userUidEl = document.getElementById("userUid");
  if (userEmailEl && userUidEl) {
    if (user) {
      userEmailEl.innerText = `Welcome, ${user.email}`;
      userUidEl.innerText = `UID: ${user.uid}`;
      // load user's orders (dummy)
      document.getElementById("orders").innerHTML = `<p>No real orders (demo).</p>`;
    } else {
      // not logged in -> redirect to login
      alert("অনুগ্রহ করে লগইন করুন");
      location.href = "login.html";
    }
  }

  // Show/hide dashboard link in header
  const dashLink = document.getElementById("dashLink");
  if (dashLink) dashLink.style.display = user ? "inline-block" : "none";
});

/* ---------- Top-up page rendering ----------
   Simple product list, Order button requires login
*/
const products = [
  { id:1, title:"25 Diamond", price:25 },
  { id:2, title:"115 Diamond", price:78 },
  { id:3, title:"610 Diamond", price:395 },
  { id:4, title:"1240 Diamond", price:790 },
  { id:5, title:"2530 Diamond", price:1580 },
  { id:6, title:"5050 Diamond", price:3160 }
];

function renderProducts(){
  const container = document.getElementById("products");
  if (!container) return;
  container.innerHTML = "";
  products.forEach(p=>{
    const el = document.createElement("div");
    el.className = "product card";
    el.innerHTML = `
      <h4>${p.title}</h4>
      <p><strong>৳ ${p.price}</strong></p>
      <button data-id="${p.id}" class="primary buyBtn">Order</button>
    `;
    container.appendChild(el);
  });

  // handle click
  container.querySelectorAll(".buyBtn").forEach(b=>{
    b.addEventListener("click", (e)=>{
      const id = e.currentTarget.dataset.id;
      // if not logged in -> ask to login
      const user = auth.currentUser;
      if (!user) {
        if (confirm("অর্ডার করতে লগইন প্রয়োজন। এখন লগইন করবেন?")) location.href = "login.html";
        return;
      }
      // demo: show order modal / confirm
      const prod = products.find(x=>x.id==id);
      if (!prod) return;
      // In real app send to backend / payment gateway
      alert(`অর্ডার সফল (ডেমো): ${prod.title} - ৳${prod.price}\nআপনি: ${user.email}`);
      // Save order to localStorage (demo)
      const orders = JSON.parse(localStorage.getItem("orders")||"[]");
      orders.push({id:prod.id,title:prod.title,price:prod.price,email:user.email,ts:Date.now()});
      localStorage.setItem("orders", JSON.stringify(orders));
      location.href = "dashboard.html";
    });
  });
}

renderProducts();

/* ---------- show orders on dashboard from localStorage ----------
*/
(function showOrdersOnDashboard(){
  const ordersEl = document.getElementById("orders");
  if (!ordersEl) return;
  const orders = JSON.parse(localStorage.getItem("orders")||"[]");
  if (orders.length===0) {
    ordersEl.innerHTML = "<p>No orders.</p>";
    return;
  }
  ordersEl.innerHTML = orders.map(o=>`<div class="card" style="margin-bottom:10px"><strong>${o.title}</strong><div>৳ ${o.price}</div><small>${new Date(o.ts).toLocaleString()}</small></div>`).join("");
})();
