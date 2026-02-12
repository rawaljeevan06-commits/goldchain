// js/admin.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function showMsg(text) {
  const el = document.getElementById("adminMsg");
  if (el) el.textContent = text;
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    const data = snap.exists() ? snap.data() : {};

    if (data.admin !== true) {
      showMsg("Access denied. Admins only.");
      setTimeout(() => (window.location.href = "dashboard.html"), 800);
      return;
    }

    // ✅ Admin is allowed
    showMsg("Admin access granted ✅");
    // TODO: Load admin data here

  } catch (err) {
    console.error(err);
    showMsg("Error loading admin access.");
    setTimeout(() => (window.location.href = "dashboard.html"), 800);
  }
});
