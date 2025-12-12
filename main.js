import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// Firebase Config (same as auth.js)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Submit Order
const btn = document.getElementById("submitOrder");
if (btn) {
  btn.addEventListener("click", async () => {
    const pid = document.getElementById("playerId").value;
    const amt = document.getElementById("amount").value;
    const txn = document.getElementById("txnId").value;

    await addDoc(collection(db, "orders"), {
      playerId: pid,
      amount: amt,
      txnId: txn,
      time: Date.now()
    });

    alert("Order Submitted!");
  });
}

// Admin Fetch Orders
const ordersDiv = document.getElementById("orders");
if (ordersDiv) {
  (async () => {
    const snap = await getDocs(collection(db, "orders"));
    snap.forEach((d) => {
      const item = d.data();
      ordersDiv.innerHTML += `<p><b>ID:</b> ${item.playerId} | <b>Amount:</b> ${item.amount} | <b>Txn:</b> ${item.txnId}</p>`;
    });
  })();
}
