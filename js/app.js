// ============================================================
//  RUSI MOTORS – Main Application Utilities
// ============================================================

// ── Toast notifications ──────────────────────────────────────
export function showToast(message, type = 'info') {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <span class="toast-msg">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── Modal helpers ────────────────────────────────────────────
export function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('show');
}

export function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove('show');
}

// ── Sidebar mobile toggle ────────────────────────────────────
export function initSidebarToggle() {
  const toggle  = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }
}

// ── Live clock ───────────────────────────────────────────────
export function startClock(elementId = 'live-clock') {
  const el = document.getElementById(elementId);
  if (!el) return;

  const tick = () => {
    el.textContent = new Date().toLocaleString('en-PH', {
      weekday: 'short', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: true
    });
  };
  tick();
  setInterval(tick, 1000);
}

// ── Format currency (PHP) ────────────────────────────────────
export function formatPeso(amount) {
  return '₱' + Number(amount || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// ── Format date ──────────────────────────────────────────────
export function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: '2-digit' });
}

// ── Confirm dialog ───────────────────────────────────────────
export function confirmAction(message) {
  return window.confirm(message);
}

// ── Table search filter ──────────────────────────────────────
export function initTableSearch(inputId, tableId) {
  const input = document.getElementById(inputId);
  const table = document.getElementById(tableId);
  if (!input || !table) return;

  input.addEventListener('input', () => {
    const term = input.value.toLowerCase();
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
  });
}

// ── Export table to CSV ──────────────────────────────────────
export function exportTableCSV(tableId, filename = 'export.csv') {
  const table = document.getElementById(tableId);
  if (!table) return;

  const rows = [...table.querySelectorAll('tr')];
  const csv  = rows.map(row =>
    [...row.querySelectorAll('th, td')]
      .map(cell => `"${cell.textContent.trim().replace(/"/g, '""')}"`)
      .join(',')
  ).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Pagination helper ────────────────────────────────────────
export class Paginator {
  constructor(items, perPage = 15) {
    this.items   = items;
    this.perPage = perPage;
    this.current = 1;
  }

  get totalPages() {
    return Math.ceil(this.items.length / this.perPage);
  }

  getPage(n) {
    this.current = Math.max(1, Math.min(n, this.totalPages));
    const start  = (this.current - 1) * this.perPage;
    return this.items.slice(start, start + this.perPage);
  }

  renderControls(containerId, onPageChange) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <span class="text-secondary" style="font-size:0.8rem">
        Page ${this.current} of ${this.totalPages} &nbsp;•&nbsp; ${this.items.length} records
      </span>
      <div style="display:flex;gap:0.4rem">
        <button class="btn btn-secondary btn-sm" id="pg-prev" ${this.current <= 1 ? 'disabled' : ''}>‹ Prev</button>
        <button class="btn btn-secondary btn-sm" id="pg-next" ${this.current >= this.totalPages ? 'disabled' : ''}>Next ›</button>
      </div>
    `;

    el.querySelector('#pg-prev')?.addEventListener('click', () => onPageChange(this.current - 1));
    el.querySelector('#pg-next')?.addEventListener('click', () => onPageChange(this.current + 1));
  }
}
