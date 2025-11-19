/* ============================
   CONTACT PAGE SCRIPT (SPA)
   ============================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore, collection, addDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* -----------------------------
   FIREBASE INIT (RUN ONCE)
----------------------------- */
let app, db;

function initFirebase() {
  if (!app) {
    app = initializeApp({
      apiKey: "AIzaSyBOVl1hdmprJXpgdN_sNTO3FsNePD_zNZY",
  authDomain: "aahes-cee-cutoffs.firebaseapp.com",
  databaseURL: "https://aahes-cee-cutoffs-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aahes-cee-cutoffs",
  storageBucket: "aahes-cee-cutoffs.firebasestorage.app",
  messagingSenderId: "706066626405",
  appId: "1:706066626405:web:0d254ab82beb288108938c"
    });

    db = getFirestore(app);
  }
}

/* -----------------------------
   MAIN INIT FUNCTION (Router calls this)
----------------------------- */
export function init() {
  console.log("✔ contact.js loaded");

  initFirebase(); // Start Firebase once

  // Because SPA injects HTML, wait until DOM is ready
  setTimeout(() => {
    setupContactForm();
  }, 50);
}

/* -----------------------------
   CONTACT FORM HANDLER
----------------------------- */
function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) {
    console.warn("⚠️ contactForm not found yet, retrying...");
    setTimeout(setupContactForm, 50);
    return;
  }

  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const phoneInput = document.getElementById("phoneInput");
  const msgInput = document.getElementById("msgInput");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phn = phoneInput.value.trim();
    const msg = msgInput.value.trim();

    try {
      await addDoc(collection(db, "noti"), {
        name,
        email,
        phn,
        msg,
        time: serverTimestamp()
      });

      showSuccessToast("Message Sent Successfully!");
      form.reset();
    } catch (err) {
      console.error("❌ Error saving message:", err);
      showErrorToast("Failed to send message. Try again!");
    }
  });
}

/* -----------------------------
   SUCCESS & ERROR TOASTS
----------------------------- */

function showSuccessToast(msg) {
  showToast(msg, "bg-green-600");
}

function showErrorToast(msg) {
  showToast(msg, "bg-red-600");
}

function showToast(text, color) {
  const toast = document.createElement("div");
  toast.className = `fixed bottom-5 right-5 px-4 py-2 text-white rounded-lg shadow-lg ${color} animate-slide-up`;
  toast.textContent = text;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
