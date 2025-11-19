// This file runs only when contact.html is loaded

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore, collection, addDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBOVl1hdmprJXpgdN_sNTO3FsNePD_zNZY",
  authDomain: "aahes-cee-cutoffs.firebaseapp.com",
  databaseURL: "https://aahes-cee-cutoffs-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aahes-cee-cutoffs",
  storageBucket: "aahes-cee-cutoffs.firebasestorage.app",
  messagingSenderId: "706066626405",
  appId: "1:706066626405:web:0d254ab82beb288108938c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Wait until router injects the HTML
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value;
    const email = emailInput.value;
    const phn = phoneInput.value;
    const msg = msgInput.value;

    await addDoc(collection(db, "noti"), {
      name, email, phn, msg,
      time: serverTimestamp()
    });

    alert("Message sent!");
    form.reset();
  });

});
