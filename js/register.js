import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const registerForm = document.getElementById("registerForm");
const errorBox = document.getElementById("errorBox");

function showError(msg) {
  errorBox.textContent = msg;
}

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const fullName = document.getElementById("fullName").value.trim();

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save profile to Firestore
    await setDoc(doc(db, "users", user.uid), {
      email,
      fullName,
      createdAt: serverTimestamp(),
    });

    // Redirect to shop
    window.location.href = "/shop";
  } catch (err) {
    console.error(err);
    showError("Registration failed: " + err.message);
  }
});

// Optional: redirect if already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "/shop";
  }
});
