// js/admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_MSG_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function loadOrders() {
  const tbody = document.getElementById('ordersList');
  if (!tbody) return;
  tbody.innerHTML = '';

  const snap = await getDocs(collection(db,'orders'));
  snap.forEach(d => {
    const item = d.data();
    tbody.innerHTML += `<tr>
      <td>${item.email || item.userId}</td>
      <td>${item.game}</td>
      <td>${item.playerId}</td>
      <td>${item.amount}৳</td>
      <td>${item.txn}</td>
      <td id="status-${d.id}">${item.status}</td>
      <td>
        <button onclick="approve('${d.id}')">Approve</button>
        <button onclick="setPending('${d.id}')">Set Pending</button>
        <button onclick="revoke('${d.id}')">Revoke</button>
      </td>
    </tr>`;
  });
}

window.approve = async (id) => {
  await updateDoc(doc(db,'orders',id), { status:'Approved', approvedAt: Date.now() });
  document.getElementById('status-'+id).textContent = 'Approved';
};

window.setPending = async (id) => {
  await updateDoc(doc(db,'orders',id), { status:'Pending' });
  document.getElementById('status-'+id).textContent = 'Pending';
};

window.revoke = async (id) => {
  await updateDoc(doc(db,'orders',id), { status:'Revoked' });
  document.getElementById('status-'+id).textContent = 'Revoked';
};

window.addEventListener('DOMContentLoaded', loadOrders);
