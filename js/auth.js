// ============================================================
//  RUSI MOTORS – Authentication + Role Module
// ============================================================

import { auth, db } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, getDoc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { logActivity } from './logs.js';

// ── Base path helper (GitHub Pages compatible) ───────────
export function getBasePath() {
  const path = window.location.pathname;
  return path.substring(0, path.lastIndexOf('/') + 1);
}

// ── Get role from Firestore ──────────────────────────────
// If no Firestore doc exists (e.g. Admin created via Firebase Console),
// defaults to 'Admin' so the system is still usable.
export async function getUserRole(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) return snap.data().role || 'Staff';
    // No profile doc = account created manually in Firebase Console = Admin
    return 'Admin';
  } catch {
    return 'Admin'; // Fail open for admin accounts
  }
}

// ── Cache role in sessionStorage ─────────────────────────
export async function cacheUserRole(uid) {
  const role = await getUserRole(uid);
  sessionStorage.setItem('rusi_role', role);
  return role;
}

export function getCachedRole() {
  return sessionStorage.getItem('rusi_role') || 'Admin';
}

// ── Guard: require any authenticated user ────────────────
export function requireAuth() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.replace(getBasePath() + 'index.html');
    } else {
      // Cache role if not already cached
      if (!sessionStorage.getItem('rusi_role')) {
        await cacheUserRole(user.uid);
      }
      applyRoleUI(sessionStorage.getItem('rusi_role') || 'Admin');
    }
  });
}

// ── Guard: redirect to dashboard if already logged in ────
export function redirectIfLoggedIn() {
  onAuthStateChanged(auth, (user) => {
    if (user) window.location.replace(getBasePath() + 'dashboard.html');
  });
}

// ── Login ─────────────────────────────────────────────────
export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const role = await cacheUserRole(credential.user.uid);
  logActivity('AUTH', `User logged in: ${email} [${role}]`, credential.user.uid).catch(() => {});
  return credential.user;
}

// ── Register new Staff or Manager only ───────────────────
export async function registerUser(email, password, name, role) {
  if (!['Staff', 'Manager'].includes(role)) throw new Error('Invalid role. Only Staff or Manager allowed.');
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;
  await setDoc(doc(db, 'users', uid), {
    name,
    email,
    role,
    status:    'Active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  logActivity('AUTH', `New ${role} registered: ${email}`, uid).catch(() => {});
  // Sign out immediately — must OTP-login separately
  await signOut(auth);
  return uid;
}

// ── Logout ────────────────────────────────────────────────
export async function logoutUser() {
  const user = auth.currentUser;
  if (user) logActivity('AUTH', `User logged out: ${user.email}`, user.uid).catch(() => {});
  sessionStorage.clear();
  try { await signOut(auth); } catch (e) {}
  window.location.replace(getBasePath() + 'index.html');
}

// ── Populate sidebar user info ────────────────────────────
export function populateSidebarUser() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    const nameEl   = document.getElementById('sidebar-user-name');
    const roleEl   = document.getElementById('sidebar-user-role');
    const avatarEl = document.getElementById('sidebar-user-avatar');

    // Use cached role first, fallback to Firestore
    let role = sessionStorage.getItem('rusi_role');
    if (!role) role = await cacheUserRole(user.uid);

    const displayName = user.displayName || user.email.split('@')[0];
    const initials    = displayName.substring(0, 2).toUpperCase();

    if (nameEl)   nameEl.textContent   = displayName;
    if (roleEl)   roleEl.textContent   = role;
    if (avatarEl) avatarEl.textContent = initials;

    applyRoleUI(role);
  });
}

// ── Apply role-based UI hiding ────────────────────────────
export function applyRoleUI(role) {
  const hierarchy = { 'Admin': 3, 'Manager': 2, 'Staff': 1 };

  // data-role="Admin" — show only to exact role
  document.querySelectorAll('[data-role]').forEach(el => {
    const allowed = el.getAttribute('data-role').split(',').map(r => r.trim());
    if (!allowed.includes(role)) el.style.display = 'none';
  });

  // data-min-role="Manager" — show to Manager and above
  document.querySelectorAll('[data-min-role]').forEach(el => {
    const minRole = el.getAttribute('data-min-role');
    if ((hierarchy[role] || 0) < (hierarchy[minRole] || 0)) el.style.display = 'none';
  });
}

export function getCurrentUser() {
  return auth.currentUser;
}
