/* ============================================================
   ChariDham Central — Site-wide Announcement / News Ticker
   ------------------------------------------------------------
   HOW TO BROADCAST URGENT NEWS:
     1. Edit the NEWS_ITEMS array below.
        - Each item supports:
            text:  "your message"           (required)
            link:  "optional-url"           (clickable; opens the link)
            image: "images/news-photo.jpg"  (clickable; opens a lightbox)
          If both image and link are given, image wins.
        - Use emojis freely.
     2. Bump NEWS_VERSION (e.g. 'v1' -> 'v2') whenever you change
        the news.  This makes the banner re-appear for users who
        previously dismissed it.
     3. Save the file.  That's it — the banner shows on every
        page that includes <script src="news.js" defer></script>.

   To temporarily turn the banner OFF, set NEWS_ITEMS = [].
   ============================================================ */

(function () {
  'use strict';

  // ── EDIT THESE ────────────────────────────────────────────
  var NEWS_VERSION = 'v3';

  var NEWS_ITEMS = [
    { text: '🗞️ ODISHA NEWS: Tap to view the latest temple update 🙏', image: 'images/odishanews.jpeg' },
    { text: '📹 NEW: Watch our latest temple video on Facebook — click to view 🙏', link: 'https://www.facebook.com/share/v/1CXCdGo2ed/' },
    { text: '🛕 Char Dham Yatra 2026 registration is now OPEN — book your slot today.', link: '#' },
    { text: '🚁 Limited helicopter darshan seats available for Kedarnath.', link: '#' },
    { text: '🙏 Daily temple bhajans & devotional videos on our Wisdom page.', link: 'wisdom.html#bhajans' },
    { text: '📞 24×7 Yatra helpline: +91 1236 5656' }
  ];
  // ──────────────────────────────────────────────────────────

  if (!NEWS_ITEMS || NEWS_ITEMS.length === 0) return;

  // Skip the TICKER if this user already dismissed THIS version of the news.
  // The full news list on news.html should still render, so we only suppress the banner.
  var bannerDismissed = false;
  try {
    if (window.localStorage &&
        localStorage.getItem('charidham_news_dismissed') === NEWS_VERSION) {
      bannerDismissed = true;
    }
  } catch (e) { /* localStorage may be blocked — show banner anyway */ }

  // ── Inject styles ─────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent =
    '.news-banner{position:relative;display:flex;align-items:stretch;' +
      'background:linear-gradient(90deg,#8b1a1a 0%,#c45e1e 60%,#d4a017 100%);' +
      'color:#fff;font-family:\'Open Sans\',sans-serif;font-size:.86rem;' +
      'box-shadow:0 2px 6px rgba(0,0,0,.18);overflow:hidden;}' +
    '.news-banner-label{flex-shrink:0;display:flex;align-items:center;gap:8px;' +
      'background:rgba(0,0,0,.28);padding:0 14px;font-weight:700;' +
      'letter-spacing:1.2px;text-transform:uppercase;font-size:.72rem;}' +
    '.news-banner-label::before{content:"";width:9px;height:9px;border-radius:50%;' +
      'background:#ffd84d;box-shadow:0 0 10px #ffd84d;' +
      'animation:newsPulse 1.4s ease-in-out infinite;}' +
    '.news-banner-label-link{color:#fff;text-decoration:none;' +
      'transition:background .2s,color .2s;cursor:pointer;}' +
    '.news-banner-label-link:hover{background:rgba(0,0,0,.42);color:#ffd84d;}' +
    '.news-banner-label-link::after{content:"\\2192";margin-left:6px;font-weight:700;}' +
    '@keyframes newsPulse{0%,100%{opacity:.45;transform:scale(.9)}50%{opacity:1;transform:scale(1.15)}}' +
    '.news-banner-track{flex:1;overflow:hidden;position:relative;}' +
    '.news-banner-track-inner{display:inline-flex;white-space:nowrap;padding:9px 0;' +
      'animation:newsScroll 45s linear infinite;will-change:transform;}' +
    '.news-banner:hover .news-banner-track-inner,' +
    '.news-banner:focus-within .news-banner-track-inner{animation-play-state:paused;}' +
    '.news-banner-item{display:inline-flex;align-items:center;padding:0 28px;' +
      'border-right:1px solid rgba(255,255,255,.35);}' +
    '.news-banner-item a{color:#fff;text-decoration:underline;text-underline-offset:3px;}' +
    '.news-banner-item a:hover{color:#ffe9b3;}' +
    '.news-banner-img-btn{background:transparent;border:0;color:#fff;font:inherit;' +
      'cursor:pointer;padding:0;display:inline-flex;align-items:center;gap:8px;' +
      'text-decoration:underline;text-underline-offset:3px;}' +
    '.news-banner-img-btn:hover{color:#ffe9b3;}' +
    '.news-banner-img-btn::before{content:"\\1F5BC\\FE0F";text-decoration:none;font-size:.95em;}' +
    '@keyframes newsScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}' +
    '.news-banner-close{flex-shrink:0;background:transparent;border:0;color:#fff;' +
      'cursor:pointer;font-size:1.05rem;line-height:1;padding:0 14px;opacity:.85;' +
      'transition:opacity .2s,background .2s;}' +
    '.news-banner-close:hover{opacity:1;background:rgba(0,0,0,.22);}' +
    /* Lightbox for image news items */
    '.news-lightbox{position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:99999;' +
      'display:none;align-items:center;justify-content:center;padding:24px;' +
      'animation:newsFadeIn .25s ease;}' +
    '.news-lightbox.open{display:flex;}' +
    '@keyframes newsFadeIn{from{opacity:0}to{opacity:1}}' +
    '.news-lightbox-img{max-width:92vw;max-height:80vh;border-radius:8px;' +
      'box-shadow:0 12px 40px rgba(0,0,0,.6);background:#000;}' +
    '.news-lightbox-cap{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);' +
      'color:#eee;background:rgba(0,0,0,.55);padding:8px 16px;border-radius:20px;' +
      'font-family:\'Open Sans\',sans-serif;font-size:.85rem;max-width:90vw;text-align:center;}' +
    '.news-lightbox-close{position:absolute;top:18px;right:24px;background:transparent;' +
      'border:0;color:#fff;font-size:2rem;line-height:1;cursor:pointer;opacity:.85;}' +
    '.news-lightbox-close:hover{opacity:1;color:#ffd84d;}' +
    '@media(max-width:640px){' +
      '.news-banner{font-size:.78rem;}' +
      '.news-banner-label{padding:0 10px;font-size:.62rem;letter-spacing:.5px;}' +
      '.news-banner-label-text{display:none;}' +
      '.news-banner-track-inner{animation-duration:30s;padding:8px 0;}' +
      '.news-banner-item{padding:0 18px;}' +
    '}' +
    '@media(prefers-reduced-motion:reduce){' +
      '.news-banner-track-inner{animation:none;}' +
      '.news-banner-label::before{animation:none;}' +
    '}';
  document.head.appendChild(style);

  // ── Build ticker content ──────────────────────────────────
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function renderItem(item, index) {
    var safeText = escapeHtml(item.text || '');
    if (item.image) {
      // Image-backed news item: render as a button that triggers the lightbox.
      // We tag it with data-news-img / data-news-cap so the click handler
      // (added once below) can pick up the right image to display.
      return '<span class="news-banner-item">' +
        '<button type="button" class="news-banner-img-btn" ' +
        'data-news-img="' + escapeHtml(item.image) + '" ' +
        'data-news-cap="' + escapeHtml(item.text || '') + '">' +
        safeText + '</button></span>';
    }
    if (item.link) {
      var href = String(item.link);
      var isExternal = /^https?:\/\//i.test(href);
      var attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      return '<span class="news-banner-item"><a href="' +
        escapeHtml(href) + '"' + attrs + '>' + safeText + '</a></span>';
    }
    return '<span class="news-banner-item">' + safeText + '</span>';
  }

  var itemsHtml = NEWS_ITEMS.map(renderItem).join('');
  // duplicate sequence so the marquee loops seamlessly
  var trackHtml = itemsHtml + itemsHtml;

  // Make the "Urgent" label a clickable link to the full news page,
  // unless we're already ON news.html (avoid linking to self).
  var onNewsPage = /(^|\/)news\.html(\?|#|$)/i.test(location.pathname + location.search + location.hash);
  var labelHtml = onNewsPage
    ? '<div class="news-banner-label" aria-hidden="true">' +
        '<span class="news-banner-label-text">Urgent</span>' +
      '</div>'
    : '<a class="news-banner-label news-banner-label-link" href="news.html" ' +
        'aria-label="View all announcements">' +
        '<span class="news-banner-label-text">Urgent</span>' +
      '</a>';

  var banner = document.createElement('div');
  banner.className = 'news-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Site announcements');
  banner.innerHTML =
    labelHtml +
    '<div class="news-banner-track">' +
      '<div class="news-banner-track-inner">' + trackHtml + '</div>' +
    '</div>' +
    '<button class="news-banner-close" type="button" aria-label="Dismiss announcement">✕</button>';

  banner.querySelector('.news-banner-close').addEventListener('click', function () {
    banner.style.display = 'none';
    try { localStorage.setItem('charidham_news_dismissed', NEWS_VERSION); } catch (e) {}
  });

  // ── Lightbox for image-backed news items ──────────────────
  var lightbox = null;
  function openLightbox(src, caption) {
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'news-lightbox';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.setAttribute('aria-label', 'Announcement image');
      lightbox.innerHTML =
        '<button type="button" class="news-lightbox-close" aria-label="Close image">\u2715</button>' +
        '<img class="news-lightbox-img" alt="" />' +
        '<div class="news-lightbox-cap"></div>';
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox || e.target.classList.contains('news-lightbox-close')) {
          closeLightbox();
        }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
      });
      document.body.appendChild(lightbox);
    }
    lightbox.querySelector('.news-lightbox-img').src = src;
    var capEl = lightbox.querySelector('.news-lightbox-cap');
    capEl.textContent = caption || '';
    capEl.style.display = caption ? 'block' : 'none';
    lightbox.classList.add('open');
  }
  function closeLightbox() {
    if (lightbox) lightbox.classList.remove('open');
  }

  // Delegate clicks for all image news buttons (handles both copies of the duplicated track)
  banner.addEventListener('click', function (e) {
    var btn = e.target.closest('.news-banner-img-btn');
    if (!btn) return;
    e.preventDefault();
    openLightbox(btn.getAttribute('data-news-img'), btn.getAttribute('data-news-cap'));
  });

  // ── Full news list (for news.html) ────────────────────────
  // If a page contains <div id="news-list-container"></div> we fill it
  // with one card per NEWS_ITEMS entry — image, headline, action button(s).
  function renderNewsList() {
    var host = document.getElementById('news-list-container');
    if (!host) return;

    if (!NEWS_ITEMS.length) {
      host.innerHTML =
        '<div class="news-empty"><div class="icon">\ud83d\udcdd</div>' +
        '<p>No active announcements right now. Please check back soon.</p></div>';
      return;
    }

    var listHtml = '<div class="news-list">';
    NEWS_ITEMS.forEach(function (item, idx) {
      var safeText = escapeHtml(item.text || '');
      var hasImg   = !!item.image;
      var hasLink  = !!item.link;
      var imgHtml  = '';
      if (hasImg) {
        imgHtml =
          '<button type="button" class="news-card-thumb" ' +
          'data-news-img="' + escapeHtml(item.image) + '" ' +
          'data-news-cap="' + escapeHtml(item.text || '') + '" ' +
          'aria-label="View image">' +
            '<img src="' + escapeHtml(item.image) + '" alt="" loading="lazy" />' +
          '</button>';
      }

      var actions = '';
      if (hasImg) {
        actions += '<button type="button" class="news-btn news-btn-primary news-card-img-trigger" ' +
                   'data-news-idx="' + idx + '">\ud83d\udd0d View Image</button>';
      }
      if (hasLink) {
        var href = String(item.link);
        var isExternal = /^https?:\/\//i.test(href);
        var linkAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
        var linkLabel = isExternal ? '\u2197 Open Link' : '\u2192 Read More';
        actions += '<a class="news-btn ' +
                   (hasImg ? 'news-btn-outline' : 'news-btn-primary') + '" ' +
                   'href="' + escapeHtml(href) + '"' + linkAttrs + '>' + linkLabel + '</a>';
      }

      listHtml +=
        '<article class="news-card' + (hasImg ? '' : ' no-image') + '">' +
          imgHtml +
          '<div class="news-card-body">' +
            '<span class="news-card-badge">Announcement #' + (idx + 1) + '</span>' +
            '<div class="news-card-text">' + safeText + '</div>' +
            (actions ? '<div class="news-card-actions">' + actions + '</div>' : '') +
          '</div>' +
        '</article>';
    });
    listHtml += '</div>';
    host.innerHTML = listHtml;

    // Wire image triggers (both the thumb and the "View Image" button) to lightbox
    host.addEventListener('click', function (e) {
      var thumb = e.target.closest('.news-card-thumb');
      if (thumb) {
        e.preventDefault();
        openLightbox(thumb.getAttribute('data-news-img'), thumb.getAttribute('data-news-cap'));
        return;
      }
      var trig = e.target.closest('.news-card-img-trigger');
      if (trig) {
        e.preventDefault();
        var idx = parseInt(trig.getAttribute('data-news-idx'), 10);
        var it  = NEWS_ITEMS[idx];
        if (it && it.image) openLightbox(it.image, it.text || '');
      }
    });
  }

  // ── Insert above the existing .top-bar (or at top of body) ─
  function insertBanner() {
    if (!bannerDismissed) {
      var topBar = document.querySelector('.top-bar');
      if (topBar && topBar.parentNode) {
        topBar.parentNode.insertBefore(banner, topBar);
      } else if (document.body) {
        document.body.insertBefore(banner, document.body.firstChild);
      }
    }
    renderNewsList();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertBanner);
  } else {
    insertBanner();
  }
})();
