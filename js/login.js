// js/login.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { firebaseConfig } from './config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Wait for DOM so elements exist
document.addEventListener('DOMContentLoaded', () => {
  console.log('login.js loaded — DOMContentLoaded');

  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorBox = document.getElementById('errorBox'); // optional

  if (!loginForm) {
    console.error('loginForm element not found. Check login.html has id="loginForm"');
    return;
  }
  if (!emailInput || !passwordInput) {
    console.error('email/password inputs not found. Check IDs: "email", "password"');
  }

  // Redirect if already logged in
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User already signed in -> redirecting to /shop');
      window.location.href = '/shop';
    }
  });

  // Attach submit handler
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (errorBox) errorBox.textContent = '';

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    if (!email || !password) {
      if (errorBox) errorBox.textContent = 'Please enter email and password.';
      else alert('Please enter email and password.');
      return;
    }

    try {
      console.log('Signing in with', email);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign-in successful:', cred.user.uid);
      // Redirect to the Express route /shop (server must define it)
      window.location.href = '/shop';
    } catch (err) {
      console.error('Sign-in error:', err);
      const msg = err?.message || 'Login failed';
      if (errorBox) errorBox.textContent = 'Login failed: ' + msg;
      else alert('Login failed: ' + msg);
    }
  });
});
