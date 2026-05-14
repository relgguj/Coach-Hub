import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
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
// Watch for sign-in / sign-out and update the page accordingly
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  const userBar = document.getElementById("user-bar");
  const authSection = document.getElementById("auth-section");
  const userEmail = document.getElementById("user-email");
  const appContainer = document.getElementById("app-container");
  if (user) {
    currentUser = user;  // NEW: track who's signed in
    if (userBar) userBar.style.display = "block";
    if (authSection) authSection.style.display = "none";
    if (appContainer) appContainer.style.display = "block";
    if (userEmail) userEmail.textContent = user.email;
    console.log("Signed in as:", user.email);
     if (window.onUserSignedIn) window.onUserSignedIn();  // NEW
 } else {
    currentUser = null;
    if (userBar) userBar.style.display = "none";
    if (authSection) authSection.style.display = "block";
    if (appContainer) appContainer.style.display = "none";
    // Clear localStorage so next signed-in user starts fresh
    try { localStorage.removeItem('mch_v9'); } catch(e) {}
    console.log("Signed out");
  }
});

// Sign-out button handler
const signoutBtn = document.getElementById("signout-btn");
if (signoutBtn) {
  signoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  });
}
// ── FIRESTORE SAVE ──
// Track the current signed-in user (set by the auth listener)
let currentUser = null;

// Debounce timer — waits a moment after the last save call before actually writing
let saveTimer = null;

// Save data to Firestore (debounced — waits 1 second to batch rapid changes)
async function saveToFirestore(data) {
  if (!currentUser) {
    console.log("Not signed in — skipping Firestore save");
    return;
  }
  // Cancel any pending save and schedule a new one
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      const userDocRef = doc(db, "users", currentUser.uid, "data", "coachHub");
      await setDoc(userDocRef, data);
      console.log("✓ Saved to Firestore");
    } catch (error) {
      console.error("Firestore save failed:", error);
    }
  }, 1000); // wait 1 second of quiet before saving
}

// Expose the save function to the main app
window.saveToFirestore = saveToFirestore; 
// Load data from Firestore for the current user
async function loadFromFirestore() {
  if (!currentUser) {
    console.log("Not signed in — cannot load from Firestore");
    return null;
  }
  try {
    const userDocRef = doc(db, "users", currentUser.uid, "data", "coachHub");
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      console.log("✓ Loaded from Firestore");
      return docSnap.data();
    } else {
      console.log("No Firestore data yet — first-time sign in");
      return null;
    }
  } catch (error) {
    console.error("Firestore load failed:", error);
    return null;
  }
}

// Expose to main app
window.loadFromFirestore = loadFromFirestore;
