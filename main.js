// js/main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

/* ====== SAME FIREBASE CONFIG AS auth.js ====== */
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

// Load live prices from /api/prices.json
async function loadPrices() {
  try {
    const res = await fetch('/api/prices.json');
    const data = await res.json();

    // fill topup.html price tables
    const ff = document.getElementById('ff-price');
    if (ff && data.free_fire) {
      ff.innerHTML = '';
      for (const k of Object.keys(data.free_fire)) {
        ff.innerHTML += `<tr><td>${k} Diamond</td><td>${data.free_fire[k]}৳</td></tr>`;
      }
    }

    const pubg = document.getElementById('pubg-price');
    if (pubg && data.pubg) {
      pubg.innerHTML = '';
      for (const k of Object.keys(data.pubg)) {
        pubg.innerHTML += `<tr><td>${k} UC</td><td>${data.pubg[k]}৳</td></tr>`;
      }
    }

    const mlbb = document.getElementById('mlbb-price');
    if (mlbb && data.mlbb) {
      mlbb.innerHTML = '';
      for (const k of Object.keys(data.mlbb)) {
        mlbb.innerHTML += `<tr><td>${k}</td><td>${data.mlbb[k]}৳</td></tr>`;
      }
    }

    // product page price list + packSelect
    const priceList = document.getElementById('price-list');
    const packSelect = document.getElementById('packSelect');
    const url = new URL(window.location.href);
    const slug = url.searchParams.get('slug') || 'freefire-idcode';
    const map = { freefire: 'free_fire', 'free-fire': 'free_fire', 'freefire-idcode':'free_fire', pubg:'pubg', mlbb:'mlbb' };
    const key = map[slug] || 'free_fire';
    const obj = data[key];

    if (priceList && obj) {
      priceList.innerHTML = '';
      for (const p of Object.keys(obj)) {
        priceList.innerHTML += `<tr><td>${p}</td><td>${obj[p]}৳</td></tr>`;
      }
    }
    if (packSelect && obj) {
      packSelect.innerHTML = '';
      for (const p of Object.keys(obj)) {
        packSelect.innerHTML += `<option value="${p}">${p} — ${obj[p]}৳</option>`;
      }
    }

  } catch (e) {
    console.error('Price load failed', e);
  }
}

// Wallet helpers
async function ensureWallet(uid) {
  const wRef = doc(db, 'wallets', uid);
  const snap = await getDoc(wRef);
  if (!snap.exists()) {
    await setDoc(wRef, { balance: 0, createdAt: Date.now() });
    return { balance: 0 };
  } else return snap.data();
}

async function addToWallet(uid, amount) {
  const wRef = doc(db, 'wallets', uid);
  const snap = await getDoc(wRef);
  if (!snap.exists()) {
    await setDoc(wRef, { balance: amount });
  } else {
    const prev = snap.data().balance || 0;
    await updateDoc(wRef, { balance: prev + amount });
  }
}

// Order submit with fake auto-approve
const placeBtn = document.getElementById('placeOrder');
if (placeBtn) {
  placeBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return alert('You must login to place order');

    const playerId = document.getElementById('playerId').value.trim();
    const pack = document.getElementById('packSelect').value;
    const txn = document.getElementById('txnId').value.trim();

    if (!playerId || !pack || !txn) return alert('PlayerID, Pack and Txn required');

    // get price from prices.json (we can also store price inside order)
    const res = await fetch('/api/prices.json'); const data = await res.json();
    const gameParam = document.getElementById('game') ? document.getElementById('game').value : null;
    // choose key
    let pKey = 'free_fire';
    if (gameParam === 'pubg') pKey = 'pubg';
    if (gameParam === 'mlbb') pKey = 'mlbb';

    const price = (data[pKey] && data[pKey][pack]) ? data[pKey][pack] : 0;

    // check duplicate txn
    const q = query(collection(db,'orders'), where('txn','==',txn));
    const existing = await getDocs(q);
    if (!existing.empty) return alert('This transaction ID already used');

    // create order with status Pending first
    const docRef = await addDoc(collection(db,'orders'), {
      userId: user.uid,
      email: user.email || '',
      game: pKey,
      playerId,
      pack,
      amount: price,
      txn,
      status: 'Pending',
      createdAt: Date.now()
    });

    // Fake Auto-Approve logic: immediately approve and add to wallet
    // (This is Option A — fake auto payment)
    await updateDoc(doc(db,'orders',docRef.id), { status: 'Approved', approvedAt: Date.now() });
    // add amount to wallet
    await ensureWallet(user.uid);
    await addToWallet(user.uid, price);

    alert('Order Submitted and Auto-Approved!');

  });
}

// show wallet balance on top of pages (if logged in)
onAuthStateChanged(auth, async (user) => {
  const balEl = document.getElementById('wallet-balance');
  if (!user) {
    if (balEl) balEl.textContent = '0৳';
    return;
  }
  await ensureWallet(user.uid);
  const wRef = doc(db,'wallets',user.uid);
  const snap = await getDoc(wRef);
  const bal = snap.exists() ? (snap.data().balance||0) : 0;
  if (balEl) balEl.textContent = bal + '৳';
});

// load prices on DOM ready
document.addEventListener('DOMContentLoaded', loadPrices);
