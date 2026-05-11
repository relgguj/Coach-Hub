import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBwjTHpxUk_OVe2b0Bz2FecfAmdslqJTtQ",
  authDomain: "cadence-93672.firebaseapp.com",
  projectId: "cadence-93672",
  storageBucket: "cadence-93672.firebasestorage.app",
  messagingSenderId: "987975978397",
  appId: "1:987975978397:web:ea01007a45141617493374",
  measurementId: "G-FLDQQGE7X7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
console.log("Firebase connected!");

// Helper to update the message area
function showMessage(text, isError = false) {
  const el = document.getElementById("auth-message");
  if (!el) return;
  el.textContent = text;
  el.style.color = isError ? "#b91c1c" : "#15803d";
}

// Toggle between Sign In and Sign Up modes
let isSignUpMode = false;
const toggleLink = document.getElementById("toggle-mode");
if (toggleLink) {
  toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    isSignUpMode = !isSignUpMode;
    const title = document.getElementById("auth-title");
    const signinBtn = document.getElementById("signin-btn");
    const signupBtn = document.getElementById("signup-btn");
    const toggleP = document.getElementById("auth-toggle");
    if (isSignUpMode) {
      title.textContent = "Create Account";
      signinBtn.style.display = "none";
      signupBtn.style.display = "";
      toggleP.innerHTML = 'Already have an account? <a href="#" id="toggle-mode">Sign in here</a>';
    } else {
      title.textContent = "Sign In";
      signinBtn.style.display = "";
      signupBtn.style.display = "none";
      toggleP.innerHTML = "Don't have an account? <a href=\"#\" id=\"toggle-mode\">Sign up here</a>";
    }
    // Re-attach the listener to the newly-rendered toggle link
    document.getElementById("toggle-mode").addEventListener("click", toggleLink.onclick);
    showMessage("");
  });
}

// SIGN UP handler
const signupBtn = document.getElementById("signup-btn");
if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showMessage("Account created successfully! You are now signed in.");
    } catch (error) {
      showMessage(error.message, true);
      console.error(error);
    }
  });
}

// SIGN IN handler
const signinBtn = document.getElementById("signin-btn");
if (signinBtn) {
  signinBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showMessage("Signed in successfully!");
    } catch (error) {
      showMessage(error.message, true);
      console.error(error);
    }
  });
}
