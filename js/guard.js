// js/guard.js
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { auth } from "./firebase.js";

// Wait until Firebase finishes restoring session, then decide.
export function requireAuth(redirectTo = "login.html") {
  return new Promise((resolve) => {
    let done = false;

    const unsub = onAuthStateChanged(auth, (user) => {
      if (done) return;
      done = true;
      try { unsub(); } catch (e) {}
      if (!user) {
        window.location.replace(redirectTo);
        return;
      }
      resolve(user);
    });

    // Safety fallback (prevents “instant redirect” timing issues)
    setTimeout(() => {
      if (done) return;
      done = true;
      try { unsub(); } catch (e) {}
      // If still unknown after timeout, do NOT force logout; just redirect to login.
      window.location.replace(redirectTo);
    }, 2500);
  });
}
