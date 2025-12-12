import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_MSG_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

// Submit Order
document.getElementById("orderBtn")?.addEventListener("click", async () => {
    let game = document.getElementById("game").value;
    let uid = document.getElementById("playerID").value;
    let amount = document.getElementById("amount").value;
    let trx = document.getElementById("trxID").value;

    await addDoc(collection(db, "orders"), {
        game, uid, amount, trx,
        payment: "Bkash/Nagad",
        status: "Pending"
    });

    alert("Order Submitted!");
});

// Admin Orders
async function loadOrders() {
    let box = document.getElementById("orders");
    if (!box) return;

    let snap = await getDocs(collection(db, "orders"));
    snap.forEach(doc => {
        let data = doc.data();
        box.innerHTML += `
            <div style='border:1px solid #000; margin:10px; padding:10px;'>
                <p>Game: ${data.game}</p>
                <p>Player ID: ${data.uid}</p>
                <p>Diamond: ${data.amount}</p>
                <p>TRX: ${data.trx}</p>
                <p>Status: ${data.status}</p>
            </div>
        `;
    });
}

loadOrders();
