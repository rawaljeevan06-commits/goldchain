import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const myRefCodeEl = document.getElementById("myRefCode");
const refLinkEl = document.getElementById("refLinkEl");
const refEarnEl = document.getElementById("refEarn");
const joinedListEl = document.getElementById("joinedList");
const commissionListEl = document.getElementById("commissionList");

const copyLinkBtn = document.getElementById("copyLinkBtn");
const waShareBtn = document.getElementById("waShareBtn");
const tgShareBtn = document.getElementById("tgShareBtn");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.replace("login.html");
    return;
  }

  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) return;

    const data = snap.data();
    const referralCode = data.referralCode || "";
    const earnings = Number(data.referralEarnings || 0);

    // Show referral code + earnings
    if (myRefCodeEl) myRefCodeEl.value = referralCode;
    if (refEarnEl) refEarnEl.textContent = earnings.toFixed(2);

    // Generate referral link
    const baseURL = window.location.origin;
    const referralLink = `${baseURL}/signup.html?ref=${referralCode}`;
    if (refLinkEl) refLinkEl.value = referralLink;

    // Copy link
    copyLinkBtn?.addEventListener("click", async () => {
      await navigator.clipboard.writeText(referralLink);
      alert("✅ Referral link copied!");
    });

    // WhatsApp
    if (waShareBtn) {
      waShareBtn.href =
        `https://wa.me/?text=Join GoldChain Investment using my link: ${encodeURIComponent(referralLink)}`;
    }

    // Telegram
    if (tgShareBtn) {
      tgShareBtn.href =
        `https://t.me/share/url?url=${encodeURIComponent(referralLink)}`;
    }

    // ✅ Load joined users
    const q = query(collection(db, "users"), where("referredBy", "==", referralCode));
    const querySnap = await getDocs(q);

    if (joinedListEl) {
      if (querySnap.empty) {
        joinedListEl.innerHTML = "No joined users yet.";
      } else {
        joinedListEl.innerHTML = "";
        querySnap.forEach(docSnap => {
          const u = docSnap.data();
          joinedListEl.innerHTML += `
            <div style="margin-bottom:8px;">
              ${u.email || "User"} — Plan: $${u.plan || 0}
            </div>
          `;
        });
      }
    }

  } catch (e) {
    console.log("Referral error:", e);
  }

});
