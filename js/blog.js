/* ═══════════════════════════════════════════════════
   HEXBREACH — Blog Listing Scripts
   js/blog.js
   ═══════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────
   FILTER BUTTONS
   ──────────────────────────────────────── */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const postRows   = document.querySelectorAll('.post-row');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Toggle active state
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter || 'all';

      postRows.forEach(function (row) {
        const cats = (row.dataset.category || '').toLowerCase();
        const show = filter === 'all' || cats.includes(filter.toLowerCase());
        row.style.display = show ? '' : 'none';
      });
    });
  });

  // Read category param from URL and auto-apply
  const params = new URLSearchParams(window.location.search);
  const cat    = params.get('category');
  if (cat) {
    filterBtns.forEach(function (btn) {
      if ((btn.dataset.filter || '').toLowerCase() === cat.toLowerCase()) {
        btn.click();
      }
    });
  }
})();

/* ────────────────────────────────────────
   POST ROW CLICK
   ──────────────────────────────────────── */
document.querySelectorAll('.post-row').forEach(function (row) {
  row.addEventListener('click', function () {
    const title = (this.querySelector('h3') || {}).textContent || 'Post';
    // In production: navigate to post page
    console.log('HEXBREACH: opening →', title);
  });
});

/* ────────────────────────────────────────
   SIDEBAR RECENT ITEMS
   ──────────────────────────────────────── */
document.querySelectorAll('.recent-item').forEach(function (item) {
  item.addEventListener('click', function () {
    const title = (this.querySelector('.recent-title') || {}).textContent || '';
    console.log('HEXBREACH: sidebar click →', title);
  });
});

/* ────────────────────────────────────────
   TAG CLOUD FILTER
   ──────────────────────────────────────── */
document.querySelectorAll('.tag-cloud-item').forEach(function (tag) {
  tag.addEventListener('click', function () {
    const t = this.textContent.trim();
    // Find and click the matching filter button, or show all matching posts
    const filterBtns = document.querySelectorAll('.filter-btn');
    let found = false;
    filterBtns.forEach(function (btn) {
      if ((btn.dataset.filter || '').toLowerCase() === t.toLowerCase()) {
        btn.click();
        found = true;
      }
    });
    if (!found) {
      // Highlight tag and filter post rows by checking their tags
      document.querySelectorAll('.post-row').forEach(function (row) {
        const tags = row.dataset.tags || '';
        row.style.display = tags.toLowerCase().includes(t.toLowerCase()) ? '' : 'none';
      });
      filterBtns.forEach(b => b.classList.remove('active'));
    }
  });
});
