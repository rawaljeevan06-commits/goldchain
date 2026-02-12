// js/storage.js
export function setStored(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    // Safari private mode may block localStorage
    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch (err) {
      return false;
    }
  }
}

export function getStored(key) {
  try {
    const v = localStorage.getItem(key);
    if (v !== null) return v;
  } catch (e) {}
  try {
    const v2 = sessionStorage.getItem(key);
    if (v2 !== null) return v2;
  } catch (e2) {}
  return null;
}

export function removeStored(key) {
  try { localStorage.removeItem(key); } catch (e) {}
  try { sessionStorage.removeItem(key); } catch (e2) {}
}
