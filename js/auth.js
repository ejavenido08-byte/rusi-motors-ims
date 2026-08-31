import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { logActivity } from './logs.js';

export function requireAuth() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = 'index.html';
    }
  });
}

export function redirectIfLoggedIn() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = 'dashboard.html';
    }
  });
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  logActivity('AUTH', `User logged in: ${email}`, credential.user.uid).catch(() => {});
  return credential.user;
}

export async function logoutUser() {
  const user = auth.currentUser;
  if (user) {
    logActivity('AUTH', `User logged out: ${user.email}`, user.uid).catch(() => {});
  }
  await signOut(auth);
  window.location.href = 'index.html';
}

export function getCurrentUser() {
  return auth.currentUser;
}

export function populateSidebarUser() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const nameEl   = document.getElementById('sidebar-user-name');
      const roleEl   = document.getElementById('sidebar-user-role');
      const avatarEl = document.getElementById('sidebar-user-avatar');
      const displayName = user.displayName || user.email.split('@')[0];
      const initials    = displayName.substring(0, 2).toUpperCase();
      if (nameEl)   nameEl.textContent   = displayName;
      if (roleEl)   roleEl.textContent   = user.email === 'admin@rusimotors.com' ? 'Administrator' : 'Staff';
      if (avatarEl) avatarEl.textContent = initials;
    }
  });
}
