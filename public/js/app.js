import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirebaseConfig } from "./config.js";

// Initialize Firebase
const firebaseConfig = await getFirebaseConfig();
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// DOM refs
const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const openCartBtn = document.getElementById("openCartBtn");
const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
const cartItemsDiv = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const addProductForm = document.getElementById("addProductForm");
const searchInput = document.getElementById("searchInput");
const logoutBtn = document.getElementById("logoutBtn");


// Redirect if not logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/";
  }
});

// Toast helpers
function showToast(id, message) {
  const toastEl = document.getElementById(id);
  if (!toastEl) return;
  const body = toastEl.querySelector(".toast-body");
  if (body) body.textContent = message;
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 }); // auto-hide in 3s
  toast.show();
}

// Cart helpers
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart_v1") || "[]");
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart_v1", JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const cart = getCart();
  cartCount.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

// Logout
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "/";
  } catch (err) {
    showToast("errorToast", "Logout failed: " + err.message);
  }
});

// Render products
let products = [];
function renderProducts(filter = "") {
  productGrid.innerHTML = "";
  const f = filter.trim().toLowerCase();
  const show = products.filter((p) =>
    (p.name + " " + (p.description || "")).toLowerCase().includes(f)
  );
  if (show.length === 0) {
    productGrid.innerHTML =
      '<div class="col-12"><p class="text-muted">No products found.</p></div>';
    return;
  }

  show.forEach((p) => {
    const col = document.createElement("div");
    col.className = "col-sm-6 col-md-4 col-lg-3 mb-4";
    col.innerHTML = `
      <div class="card product-card h-100">
        <img src="${p.imageUrl}" class="card-img-top" alt="${
      p.name
    }" onerror="this.src='https://via.placeholder.com/300x180?text=No+Image'">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text text-truncate">${p.description || ""}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <span class="badge bg-primary badge-price">${p.price} BDT</span>
            <button class="btn btn-sm btn-outline-success add-to-cart" data-id="${
              p.id
            }">Add</button>
          </div>
        </div>
      </div>
    `;
    productGrid.appendChild(col);
  });

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      addToCart(id);
    });
  });
}

function addToCart(productId) {
  const cart = getCart();
  const prod = products.find((p) => p.id === productId);
  if (!prod) return showToast("errorToast", "Product not found");
  const existing = cart.find((i) => i.id === productId);
  if (existing) existing.qty += 1;
  else
    cart.push({
      id: productId,
      name: prod.name,
      price: prod.price,
      imageUrl: prod.imageUrl,
      qty: 1,
    });
  saveCart(cart);
}

// Cart modal
openCartBtn.addEventListener("click", () => {
  renderCart();
  cartModal.show();
});

function renderCart() {
  const cart = getCart();
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p class="text-muted">Cart is empty.</p>';
    cartTotalEl.textContent = "0";
    return;
  }
  cartItemsDiv.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.qty;
    const el = document.createElement("div");
    el.className = "d-flex align-items-center mb-3";
    el.innerHTML = `
      <img src="${item.imageUrl}" style="width:70px;height:55px;object-fit:cover" onerror="this.src='https://via.placeholder.com/70x55'" class="me-3">
      <div class="flex-grow-1">
        <strong>${item.name}</strong><br>
        <small>${item.price} BDT</small>
      </div>
      <div class="d-flex align-items-center">
        <button class="btn btn-sm btn-outline-secondary me-2 change-qty" data-id="${item.id}" data-delta="-1">-</button>
        <span class="me-2">${item.qty}</span>
        <button class="btn btn-sm btn-outline-secondary me-3 change-qty" data-id="${item.id}" data-delta="1">+</button>
        <button class="btn btn-sm btn-danger remove-item" data-id="${item.id}">Remove</button>
      </div>
    `;
    cartItemsDiv.appendChild(el);
  });

  cartTotalEl.textContent = total;

  document.querySelectorAll(".change-qty").forEach((b) =>
    b.addEventListener("click", () => {
      const id = b.dataset.id;
      const delta = Number(b.dataset.delta);
      const cart = getCart();
      const it = cart.find((x) => x.id === id);
      if (!it) return;
      it.qty += delta;
      if (it.qty <= 0) {
        cart.splice(
          cart.findIndex((x) => x.id === id),
          1
        );
      }
      saveCart(cart);
      renderCart();
    })
  );

  document.querySelectorAll(".remove-item").forEach((b) =>
    b.addEventListener("click", () => {
      const id = b.dataset.id;
      let cart = getCart();
      cart = cart.filter((x) => x.id !== id);
      saveCart(cart);
      renderCart();
    })
  );
}

// Checkout (open modal)
checkoutBtn.addEventListener("click", () => {
  const cart = getCart();
  if (cart.length === 0) return showToast("errorToast", "Cart is empty");

  const checkoutModal = new bootstrap.Modal(
    document.getElementById("checkoutModal")
  );
  checkoutModal.show();
});

// Confirm checkout (submit order)
document.getElementById('confirmCheckoutBtn').addEventListener('click', async () => {
  const cart = getCart();
  if(cart.length===0) return showToast('errorToast', 'Cart is empty');

  const name = document.getElementById('checkoutName').value.trim();
  const phone = document.getElementById('checkoutPhone').value.trim();
  const location = document.getElementById('checkoutLocation').value.trim();

  if(!name || !phone || !location){
    return showToast('errorToast', 'Please fill out all fields.');
  }

  // Show spinner and disable button
  const btnText = document.getElementById('checkoutBtnText');
  const spinner = document.getElementById('checkoutSpinner');
  btnText.textContent = 'Processing...';
  spinner.classList.remove('d-none');
  const confirmBtn = document.getElementById('confirmCheckoutBtn');
  confirmBtn.disabled = true;

  const order = { 
    createdAt: new Date(), 
    customerName: name, 
    phone, 
    location, 
    items: cart, 
    total: cart.reduce((s,i)=>s+i.qty*i.price,0) 
  };

  try{
    await addDoc(collection(db,'orders'), order);
    localStorage.removeItem('cart_v1'); 
    updateCartUI(); 
    renderCart(); 

    bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
    cartModal.hide(); 

    showToast('successToast', 'Order placed successfully!');
  } catch(e){ 
    console.error(e); 
    showToast('errorToast', 'Failed to place order: ' + e.message);
  } finally {
    // Hide spinner and enable button
    spinner.classList.add('d-none');
    btnText.textContent = 'Place Order';
    confirmBtn.disabled = false;
  }
});


// Admin add product
addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("pName").value.trim();
  const price = Number(document.getElementById("pPrice").value);
  const imageUrl = document.getElementById("pImage").value.trim();
  const description = document.getElementById("pDesc").value.trim();
  if (!name || !price || !imageUrl)
    return showToast("errorToast", "Name, price and image url are required");
  try {
    const docRef = await addDoc(collection(db, "products"), {
      name,
      price,
      imageUrl,
      description,
      createdAt: new Date(),
    });
    await setDoc(
      doc(db, "products", docRef.id),
      { id: docRef.id },
      { merge: true }
    );
    addProductForm.reset();
    bootstrap.Modal.getInstance(document.getElementById("adminModal")).hide();
    showToast("successToast", "✅ Product added successfully!");
  } catch (err) {
    console.error(err);
    showToast("errorToast", "❌ Failed to add product: " + err.message);
  }
});

// Firestore live subscription
function subscribeProducts() {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  onSnapshot(
    q,
    (snap) => {
      products = [];
      snap.forEach((doc) => {
        const d = doc.data();
        d.id = d.id || doc.id;
        d.price = Number(d.price) || 0;
        products.push(d);
      });
      renderProducts(searchInput.value);
    },
    (err) => {
      console.error("products onSnapshot error", err);
    }
  );
}

// Search input
searchInput.addEventListener("input", () => renderProducts(searchInput.value));

// Initial
updateCartUI();
subscribeProducts();
