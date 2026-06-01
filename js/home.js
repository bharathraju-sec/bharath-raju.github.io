/* ═══════════════════════════════════════════════════
   HEXBREACH — Homepage Scripts
   js/home.js
   ═══════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────
   NEWSLETTER SUBSCRIBE
   ──────────────────────────────────────── */
(function () {
  const form  = document.querySelector('.subscribe-form');
  if (!form) return;

  const input = form.querySelector('input[type="email"]');
  const btn   = form.querySelector('button');

  btn.addEventListener('click', function () {
    const email = input.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!valid) {
      input.style.borderColor  = 'var(--accent)';
      input.placeholder        = 'Enter a valid email address';
      return;
    }

    // Success state
    input.style.borderColor = 'rgba(0,255,229,0.4)';
    btn.textContent         = 'Subscribed ✓';
    btn.style.background    = '#00664d';
    input.value             = '';

    // In production: POST to your newsletter endpoint
    console.log('HEXBREACH: subscribed →', email);
  });
})();

/* ────────────────────────────────────────
   BLOG CARD NAVIGATION
   ──────────────────────────────────────── */
document.querySelectorAll('.blog-card').forEach(function (card) {
  card.addEventListener('click', function () {
    // In production: navigate to the post URL
    const title = (this.querySelector('h3') || {}).textContent || 'Post';
    console.log('HEXBREACH: opening post →', title);
  });
});

/* ────────────────────────────────────────
   CATEGORY FILTER
   ──────────────────────────────────────── */
document.querySelectorAll('.cat-card').forEach(function (card) {
  card.addEventListener('click', function () {
    const cat = (this.querySelector('.cat-name') || {}).textContent || '';
    // In production: redirect to blog.html?category=...
    window.location.href = 'pages/blog.html?category=' + encodeURIComponent(cat);
  });
});

/* ────────────────────────────────────────
   MODAL EDITOR (quick-write from homepage)
   ──────────────────────────────────────── */
function openEditor() {
  const modal = document.getElementById('editorModal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(restoreDraft, 60);
}

function closeEditor() {
  const modal = document.getElementById('editorModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Backdrop click
const modal = document.getElementById('editorModal');
if (modal) {
  modal.addEventListener('click', function (e) {
    if (e.target === this) closeEditor();
  });
}

// Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeEditor();
});

/* Word count */
const ta   = document.querySelector('#editorModal textarea');
const wcEl = document.getElementById('wc');
if (ta && wcEl) {
  ta.addEventListener('input', function () {
    const n = this.value.trim() ? this.value.trim().split(/\s+/).length : 0;
    wcEl.textContent = n + ' word' + (n !== 1 ? 's' : '');
  });
}

/* Save draft to localStorage */
function saveDraft() {
  const btn  = document.querySelector('.modal-footer .btn-ghost');
  const orig = btn.textContent;

  const draft = {
    title   : (document.querySelector('#editorModal input[type="text"]') || {}).value || '',
    category: (document.querySelector('#editorModal select') || {}).value || '',
    body    : ta ? ta.value : '',
    savedAt : new Date().toISOString(),
  };
  localStorage.setItem('hexbreach_draft', JSON.stringify(draft));

  btn.textContent       = '[ Saved ]';
  btn.style.color       = 'var(--glow)';
  btn.style.borderColor = 'rgba(0,255,229,0.4)';
  setTimeout(() => {
    btn.textContent       = orig;
    btn.style.color       = '';
    btn.style.borderColor = '';
  }, 2000);
}

/* Restore draft */
function restoreDraft() {
  try {
    const raw = localStorage.getItem('hexbreach_draft');
    if (!raw) return;
    const draft = JSON.parse(raw);
    const ti = document.querySelector('#editorModal input[type="text"]');
    if (ti && draft.title) ti.value = draft.title;
    if (ta && draft.body)  { ta.value = draft.body; ta.dispatchEvent(new Event('input')); }
  } catch (e) { /* ignore */ }
}

/* Publish */
function publishPost() {
  const ti = document.querySelector('#editorModal input[type="text"]');
  if (!ti || !ti.value.trim()) {
    ti.style.borderColor = 'var(--accent)';
    ti.placeholder       = 'REQUIRED: Enter a title';
    ti.focus();
    return;
  }
  localStorage.removeItem('hexbreach_draft');
  alert(
    'POST PUBLISHED\n──────────────\n' +
    'Title: ' + ti.value.trim() + '\n\n' +
    '[Connect this to your backend API]'
  );
  closeEditor();
}

// Expose to inline onclick attributes
window.openEditor  = openEditor;
window.closeEditor = closeEditor;
window.saveDraft   = saveDraft;
window.publishPost = publishPost;
