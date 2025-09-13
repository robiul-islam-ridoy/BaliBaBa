import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirebaseConfig } from './config.js';

// Initialize Firebase
const firebaseConfig = await getFirebaseConfig(); 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM elements
const loginForm = document.getElementById('loginForm');
const registerBtn = document.getElementById('registerBtn');
const errorBox = document.getElementById('errorBox');

// Show error
function showError(msg) {
  if (errorBox) {
    errorBox.textContent = msg;
    errorBox.style.color = 'red';
  } else {
    alert(msg);
  }
}

// Redirect if already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = '/shop';
  }
});

// Login form submit
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) return showError('Please fill all fields');

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = '/shop';
  } catch (err) {
    showError('Login failed: ' + err.message);
  }
});

// Go to registration page
registerBtn.addEventListener('click', () => {
  window.location.href = '/register';
});
