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

export function getBasePath() {
  const path = window.location.pathname;
  return path.substring(0, path.lastIndexOf('/') + 1);
}

export async function getUserRole(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) return snap.data().role || 'Staff';
    return 'Admin';
  } catch { return 'Admin'; }
}

export async function cacheUserRole(uid) {
  const role = await getUserRole(uid);
  sessionStorage.setItem('rusi_role', role);
  return role;
}

export function getCachedRole() {
  return sessionStorage.getItem('rusi_role') || 'Admin';
}

export function requireAuth() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.replace(getBasePath() + 'index.html');
    } else {
      if (!sessionStorage.getItem('rusi_role')) {
        await cacheUserRole(user.uid);
      }
      applyRoleUI(sessionStorage.getItem('rusi_role') || 'Admin');
    }
  });
}

export function redirectIfLoggedIn() {
  onAuthStateChanged(auth, (user) => {
    if (user) window.location.replace(getBasePath() + 'dashboard.html');
  });
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const role = await cacheUserRole(credential.user.uid);
  logActivity('AUTH', `User logged in: ${email} [${role}]`, credential.user.uid).catch(() => {});
  return credential.user;
}

export async function registerUser(email, password, name, role) {
  if (!['Staff', 'Manager'].includes(role)) throw new Error('Invalid role.');
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;
  await setDoc(doc(db, 'users', uid), {
    name, email, role,
    status: 'Active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  logActivity('AUTH', `New ${role} registered: ${email}`, uid).catch(() => {});
  await signOut(auth);
  return uid;
}

export async function logoutUser() {
  const user = auth.currentUser;
  if (user) logActivity('AUTH', `User logged out: ${user.email}`, user.uid).catch(() => {});
  sessionStorage.clear();
  try { await signOut(auth); } catch (e) {}
  window.location.replace(getBasePath() + 'index.html');
}

export function populateSidebarUser() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    const nameEl   = document.getElementById('sidebar-user-name');
    const roleEl   = document.getElementById('sidebar-user-role');
    const avatarEl = document.getElementById('sidebar-user-avatar');
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

export function applyRoleUI(role) {
  const hierarchy = { 'Admin': 3, 'Manager': 2, 'Staff': 1 };
  document.querySelectorAll('[data-role]').forEach(el => {
    const allowed = el.getAttribute('data-role').split(',').map(r => r.trim());
    if (!allowed.includes(role)) el.style.display = 'none';
  });
  document.querySelectorAll('[data-min-role]').forEach(el => {
    const minRole = el.getAttribute('data-min-role');
    if ((hierarchy[role] || 0) < (hierarchy[minRole] || 0)) el.style.display = 'none';
  });
}

export function getCurrentUser() {
  return auth.currentUser;
}
