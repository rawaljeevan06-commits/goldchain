// js/referral.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const refCodeEl = document.getElementById("refCodeEl");
const refLinkEl = document.getElementById("refLinkEl");
const refEarnEl = document.getElementById("refEarnEl");

const copyCodeBtn = document.getElementById("copyCodeBtn");
const copyLinkBtn = document.getElementById("copyLinkBtn");

const commissionListEl = document.getElementById("commissionList");

function safeCopy(text) {
  return navigator.clipboard.writeText(text);
}

copyCodeBtn?.addEventListener("click", async () => {
  const v = refCodeEl?.value || "";
  if (!v) return;
  try {
    await safeCopy(v);
    alert("✅ Referral code copied!");
  } catch {
    alert("Copy failed, please copy manually.");
  }
});

copyLinkBtn?.addEventListener("click", async () => {
  const v = refLinkEl?.value || "";
  if (!v) return;
  try {
    await safeCopy(v);
    alert("✅ Referral link copied!");
  } catch {
    alert("Copy failed, please copy manually.");
  }
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace("login.html");
    return;
  }

  // ✅ Load your user profile
  const uSnap = await getDoc(doc(db, "users", user.uid));
  if (!uSnap.exists()) {
    if (commissionListEl) commissionListEl.innerHTML = "No profile found.";
    return;
  }

  const u = uSnap.data();
  const myCode = u.referralCode || "";

  if (refCodeEl) refCodeEl.value = myCode;
  if (refEarnEl) refEarnEl.textContent = Number(u.referralEarnings || 0).toFixed(2);

  // ✅ Build referral link: signup.html?ref=CODE
  const base = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, "/");
  const link = base + "signup.html?ref=" + encodeURIComponent(myCode);
  if (refLinkEl) refLinkEl.value = link;

  // ✅ Load commission history (last 50)
  if (commissionListEl) {
    const qCom = query(
      collection(db, "referral_commissions"),
      where("toUid", "==", user.uid),
      orderBy("at", "desc"),
      limit(50)
    );

    onSnapshot(qCom, (snap) => {
      if (snap.empty) {
        commissionListEl.innerHTML = "No commissions yet.";
        return;
      }

      commissionListEl.innerHTML = "";
      snap.forEach((d) => {
        const c = d.data();
        const amt = Number(c.commissionAmount || 0).toFixed(2);
        const dep = Number(c.depositAmount || 0).toFixed(2);
        const lvl = c.level || 1;

        commissionListEl.innerHTML += `
          <div style="padding:10px; border:1px solid rgba(255,255,255,.12); border-radius:12px; margin-bottom:10px;">
            <div style="font-weight:800; color:#facc15;">+$${amt} (Level ${lvl})</div>
            <div class="small" style="opacity:.85;">From deposit: $${dep}</div>
            <div class="small" style="opacity:.7;">Payment ID: ${c.paymentId || "-"}</div>
          </div>
        `;
      });
    });
  }
});
