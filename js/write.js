/* ═══════════════════════════════════════════════════
   HEXBREACH — Write Page Scripts
   js/write.js
   ═══════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────
   WORD / CHAR COUNT
   ──────────────────────────────────────── */
(function () {
  const titleInput = document.getElementById('post-title');
  const bodyArea   = document.getElementById('post-body');
  const wcDisplay  = document.getElementById('word-count');
  const charDisplay = document.getElementById('char-count');
  const statusEl   = document.getElementById('editor-status');

  function updateCount() {
    const body  = bodyArea ? bodyArea.value : '';
    const words = body.trim() ? body.trim().split(/\s+/).length : 0;
    const chars = body.length;
    if (wcDisplay)   wcDisplay.textContent   = words + ' words';
    if (charDisplay) charDisplay.textContent = chars + ' chars';
    if (statusEl)    statusEl.textContent    = '● EDITING';
  }

  if (bodyArea)   bodyArea.addEventListener('input', updateCount);
  if (titleInput) titleInput.addEventListener('input', updateCount);
})();

/* ────────────────────────────────────────
   TOOLBAR ACTIONS
   ──────────────────────────────────────── */
(function () {
  const body = document.getElementById('post-body');
  if (!body) return;

  document.querySelectorAll('.toolbar-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const action = this.dataset.action;
      const start  = body.selectionStart;
      const end    = body.selectionEnd;
      const sel    = body.value.substring(start, end);
      let insert   = '';

      switch (action) {
        case 'bold':        insert = `**${sel || 'bold text'}**`; break;
        case 'italic':      insert = `_${sel || 'italic text'}_`; break;
        case 'code':        insert = `\`${sel || 'code'}\``; break;
        case 'codeblock':   insert = `\`\`\`\n${sel || '// code here'}\n\`\`\``; break;
        case 'h2':          insert = `\n## ${sel || 'Heading'}\n`; break;
        case 'h3':          insert = `\n### ${sel || 'Sub-heading'}\n`; break;
        case 'link':        insert = `[${sel || 'link text'}](https://)`; break;
        case 'blockquote':  insert = `\n> ${sel || 'quote'}\n`; break;
        case 'hr':          insert = `\n---\n`; break;
        case 'list':        insert = `\n- ${sel || 'item'}\n`; break;
        default: return;
      }

      body.value = body.value.substring(0, start) + insert + body.value.substring(end);
      body.focus();
      body.selectionStart = body.selectionEnd = start + insert.length;
      body.dispatchEvent(new Event('input'));
    });
  });
})();

/* ────────────────────────────────────────
   AUTO-SAVE DRAFT
   ──────────────────────────────────────── */
(function () {
  let saveTimer;

  function autoSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      const draft = collectDraft();
      localStorage.setItem('hexbreach_draft', JSON.stringify(draft));
      const statusEl = document.getElementById('editor-status');
      if (statusEl) {
        const prev = statusEl.textContent;
        statusEl.textContent = '● AUTO-SAVED';
        statusEl.style.color = 'var(--glow)';
        setTimeout(() => {
          statusEl.textContent = prev;
          statusEl.style.color = '';
        }, 2000);
      }
    }, 1500);
  }

  ['post-title', 'post-body'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', autoSave);
  });

  // Restore on load
  try {
    const raw = localStorage.getItem('hexbreach_draft');
    if (raw) {
      const draft = JSON.parse(raw);
      const titleEl = document.getElementById('post-title');
      const bodyEl  = document.getElementById('post-body');
      if (titleEl && draft.title) titleEl.value = draft.title;
      if (bodyEl  && draft.body)  { bodyEl.value  = draft.body;  bodyEl.dispatchEvent(new Event('input')); }
    }
  } catch (e) { /* ignore */ }
})();

/* ────────────────────────────────────────
   COLLECT DRAFT DATA
   ──────────────────────────────────────── */
function collectDraft() {
  return {
    title   : (document.getElementById('post-title') || {}).value || '',
    category: (document.getElementById('post-category') || {}).value || '',
    cve     : (document.getElementById('post-cve') || {}).value || '',
    severity: (document.getElementById('post-severity') || {}).value || '',
    tags    : (document.getElementById('post-tags') || {}).value || '',
    body    : (document.getElementById('post-body') || {}).value || '',
    savedAt : new Date().toISOString(),
  };
}

/* ────────────────────────────────────────
   SAVE DRAFT (manual)
   ──────────────────────────────────────── */
function saveDraft() {
  localStorage.setItem('hexbreach_draft', JSON.stringify(collectDraft()));
  const btn = document.getElementById('btn-save-draft');
  if (!btn) return;
  const orig = btn.textContent;
  btn.textContent = '[ Saved ]';
  setTimeout(() => { btn.textContent = orig; }, 2000);
}

/* ────────────────────────────────────────
   PUBLISH
   ──────────────────────────────────────── */
function publishPost() {
  const draft = collectDraft();

  if (!draft.title.trim()) {
    const ti = document.getElementById('post-title');
    if (ti) { ti.style.borderColor = 'var(--accent)'; ti.focus(); }
    return;
  }

  if (!draft.body.trim()) {
    const ba = document.getElementById('post-body');
    if (ba) { ba.style.borderColor = 'var(--accent)'; ba.focus(); }
    return;
  }

  // In production: POST draft to your backend API
  console.log('HEXBREACH: publishing post', draft);
  localStorage.removeItem('hexbreach_draft');

  alert(
    'POST PUBLISHED\n──────────────\n' +
    'Title    : ' + draft.title + '\n' +
    'Category : ' + (draft.category || 'Uncategorised') + '\n' +
    'Tags     : ' + (draft.tags || 'none') + '\n\n' +
    '[Connect to your backend API]'
  );
}

/* ────────────────────────────────────────
   PREVIEW TOGGLE
   ──────────────────────────────────────── */
function togglePreview() {
  const body    = document.getElementById('post-body');
  const preview = document.getElementById('post-preview');
  const btn     = document.getElementById('btn-preview');
  if (!body || !preview) return;

  const isPreviewMode = preview.style.display !== 'none';

  if (isPreviewMode) {
    preview.style.display = 'none';
    body.style.display    = '';
    if (btn) btn.textContent = 'Preview';
  } else {
    // Very basic markdown → HTML (real app: use marked.js)
    let html = body.value
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/^### (.+)$/gm,  '<h3>$1</h3>')
      .replace(/^## (.+)$/gm,   '<h2>$1</h2>')
      .replace(/^# (.+)$/gm,    '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/_(.+?)_/g,      '<em>$1</em>')
      .replace(/`([^`]+)`/g,    '<code>$1</code>')
      .replace(/^> (.+)$/gm,    '<blockquote>$1</blockquote>')
      .replace(/^- (.+)$/gm,    '<li>$1</li>')
      .replace(/---/g,          '<hr>')
      .replace(/\n\n/g,         '</p><p>')
      .replace(/\n/g,           '<br>');

    preview.innerHTML   = '<p>' + html + '</p>';
    preview.style.display = '';
    body.style.display    = 'none';
    if (btn) btn.textContent = 'Edit';
  }
}

// Expose
window.saveDraft    = saveDraft;
window.publishPost  = publishPost;
window.togglePreview = togglePreview;
