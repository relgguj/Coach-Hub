import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword
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

const signupBtn = document.getElementById("signup-btn");

if (signupBtn) {

  signupBtn.addEventListener("click", async () => {

    const email =
      document.getElementById("email").value;

    const password =
      document.getElementById("password").value;

    try {

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      document.getElementById("auth-message").innerText =
        "Account created successfully!";

    } catch (error) {

      document.getElementById("auth-message").innerText =
        error.message;

      console.error(error);

    }

  });

}
