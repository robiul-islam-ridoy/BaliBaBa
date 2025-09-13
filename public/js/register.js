import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { firebaseConfig } from './config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM elements
const registerForm = document.getElementById('registerForm');
const loginBtn = document.getElementById('loginBtn');
const errorBox = document.getElementById('errorBox');

function showError(msg) {
  if (errorBox) {
    errorBox.textContent = msg;
    errorBox.style.color = 'red';
  } else {
    alert(msg);
  }
}

// Registration
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();

  if (!email || !password) return showError('Please fill all fields');

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert('Registration successful! You can now log in.');
    window.location.href = '/';
  } catch (err) {
    showError('Registration failed: ' + err.message);
  }
});

// Go to login page
loginBtn.addEventListener('click', () => {
  window.location.href = '/';
});
