// ============================================================
//  RUSI MOTORS – Activity Logging Module
// ============================================================

import { db }  from './firebase-config.js';
import { auth } from './firebase-config.js';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const LOGS_COLLECTION = 'activity_logs';

// ── Write a log entry ────────────────────────────────────────
export async function logActivity(module, action, userId = null) {
  try {
    const user = auth.currentUser;
    await addDoc(collection(db, LOGS_COLLECTION), {
      module,
      action,
      userId:    userId || user?.uid || 'system',
      userEmail: user?.email || 'system',
      timestamp: serverTimestamp(),
      ipHint:    navigator.userAgent.substring(0, 60)
    });
  } catch (err) {
    // Non-blocking – log silently
    console.warn('[ActivityLog] Failed to write log:', err.message);
  }
}

// ── Fetch logs (with optional filters) ──────────────────────
export async function fetchLogs({ maxCount = 200, module = null, startDate = null, endDate = null } = {}) {
  try {
    let q = query(
      collection(db, LOGS_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(maxCount)
    );

    if (module) {
      q = query(
        collection(db, LOGS_COLLECTION),
        where('module', '==', module),
        orderBy('timestamp', 'desc'),
        limit(maxCount)
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error('[ActivityLog] Fetch failed:', err);
    return [];
  }
}

// ── Format timestamp ─────────────────────────────────────────
export function formatLogTime(timestamp) {
  if (!timestamp) return '—';
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleString('en-PH', {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: true
  });
}

// ── Module badge colors ──────────────────────────────────────
export function getModuleBadge(module) {
  const map = {
    AUTH:      { cls: 'badge-info',    icon: '🔑' },
    INVENTORY: { cls: 'badge-success', icon: '📦' },
    SALES:     { cls: 'badge-warning', icon: '💰' },
    SUPPLIERS: { cls: 'badge-muted',   icon: '🏭' },
    REPORTS:   { cls: 'badge-info',    icon: '📊' },
    USERS:     { cls: 'badge-danger',  icon: '👤' },
    SYSTEM:    { cls: 'badge-muted',   icon: '⚙️'  }
  };
  return map[module] || { cls: 'badge-muted', icon: '📝' };
}
