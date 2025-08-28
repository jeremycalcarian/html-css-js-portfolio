/* ===========================
   Helpers + Refresh reset
=========================== */
const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

// Reset the intro flag ONLY on hard reloads (F5 / Cmd+R / pull-to-refresh)
(() => {
  let isReload = false;

  // Navigation Timing v2
  const navEntry = performance.getEntriesByType &&
                   performance.getEntriesByType('navigation')[0];
  if (navEntry && typeof navEntry.type === 'string') {
    isReload = navEntry.type === 'reload';
  } else {
    // Legacy fallback for old Safari/Android WebView.
    // 1 === TYPE_RELOAD
    const legacyNav = performance.navigation;
    if (legacyNav && legacyNav.type === 1) isReload = true;
  }

  if (isReload) {
    try { localStorage.removeItem('hasSeenIntro'); } catch(e) {}
  }
})();
/* ===========================
   Animated nav: global delegator (handles .html and pretty URLs)
=========================== */
function setupAnimatedLinkDelegation() {
  const isPageLikePath = (path) => {
    // allow "" (root), ".html|.htm", or extensionless paths like /projects or /blog/
    const m = path.match(/\.([a-z0-9]+)$/i);
    return !m || ['html','htm'].includes(m[1]);
  };

  const shouldAnimate = (a, e) => {
    if (!a) return false;
    const href = a.getAttribute('href');
    if (!href) return false;

    // respect modifier keys / middle click / downloads / opt-out flag
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if (e.button !== 0) return false; // left click only
    if (a.target === '_blank') return false;
    if (a.hasAttribute('download')) return false;
    if (a.dataset.skipAnim === 'true') return false;

    // skip in-page, mailto, tel, javascript:
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return false;

    // only same-origin page-like paths
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (!isPageLikePath(url.pathname)) return false;

    // don't animate if it's already the current page path
    if (url.pathname === window.location.pathname) return false;

    return true;
  };

  // Capture phase so we beat default navigation even if other listeners exist
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!shouldAnimate(a, e)) return;

    e.preventDefault();

    const url   = new URL(a.getAttribute('href'), window.location.href);
    const path  = url.pathname.toLowerCase();
    const label = (a.textContent || path.replace(/^\//,'') || 'Loading').trim();

    // route-specific flavor (optional)
    let meta = { bpm:'126', key:'11A' };
    if (path.includes('coursework')) meta = { bpm:'128', key:'10A' };
    else if (path.includes('project')) meta = { bpm:'124', key:'9A' };
    else if (path.includes('blog'))    meta = { bpm:'122', key:'7A' };

    loadExternalPage(url.href, label, meta);
  }, true);
}


/* ===========================
   Initialize particles
=========================== */
function initParticles() {
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: { value: 30, density: { enable: true, value_area: 800 } },
        color: { value: "#00ff88" },
        shape: { type: "circle" },
        opacity: { value: 0.1, random: true },
        size: { value: 2, random: true },
        line_linked: { enable: true, distance: 150, color: "#00ff88", opacity: 0.1, width: 1 },
        move: { enable: true, speed: 1, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: false }, resize: true },
        modes: { repulse: { distance: 100, duration: 0.4 } }
      },
      retina_detect: true
    });
  }
}

/* ===========================
   DJ Controller State
=========================== */
let currentTrack = null;
let isPlaying = false;
let tempo = 1;
let vibe = 150;
let audioContext = null;

// Track data with timing info
const trackData = {
  '#about': { title: 'About Me', artist: 'Jeremy Calcarian', bpm: '120', key: '8A', duration: 240 },
  '#experience': { title: 'Experience', artist: 'Skills Mix', bpm: '124', key: '9A', duration: 180 },
  '#coursework': { title: 'Coursework', artist: 'Academic Journey', bpm: '128', key: '10A', duration: 200 },
  '#projects': { title: 'Projects', artist: 'Portfolio Mix', bpm: '126', key: '11A', duration: 220 },
  '#blog': { title: 'Blog Posts', artist: 'Insights', bpm: '122', key: '7A', duration: 160 },
  '#contact': { title: 'Contact', artist: 'Connect', bpm: '130', key: '12A', duration: 140 },
  '#house-recommender': { title: 'House Recommender', artist: 'Music Discovery', bpm: '125', key: '6A', duration: 300 }
};

/* ===========================
   Audio feedback
=========================== */
function playBeep(freq = 220, duration = 0.12) {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    const oscillator = audioContext.createOscillator();
    const gainNode   = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = freq;

    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.04, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  } catch (e) {
    console.warn('Audio context failed:', e);
  }
}

/* ===========================
   Track loading and playback simulation
=========================== */
function loadTrack(target) {
  currentTrack = target;
  const track = trackData[target];
  if (!track) return;

  const screenTitle    = document.getElementById('screenTitle');
  const screenMeta     = document.getElementById('screenMeta');
  const screenTime     = document.getElementById('screenTime');
  const screenProgress = document.getElementById('screenProgress');

  if (screenTitle) screenTitle.textContent = 'Loading...';
  if (screenMeta)  screenMeta.textContent  = `Queue • ${track.bpm} BPM • KEY ${track.key}`;
  if (screenTime)  screenTime.textContent  = '00:00';
  if (screenProgress) {
    screenProgress.style.width = '0%';
    screenProgress.style.transition = 'width 0.3s ease';
  }

  // Quick load animation - progress bar fills fast
  setTimeout(() => { if (screenProgress) screenProgress.style.width = '100%'; }, 100);

  // Show loaded state and navigate
  setTimeout(() => {
    if (screenTitle) screenTitle.textContent = track.title;
    if (screenMeta)  screenMeta.textContent  = `Playing • ${track.bpm} BPM • KEY ${track.key}`;
    playBeep();

    setTimeout(() => {
      closeOverlay();
      setTimeout(() => scrollToSection(target), 300);
    }, 200);
  }, 400);
}

/* ===========================
   Scroll functionality
=========================== */
function scrollToSection(target) {
  const element = document.querySelector(target);
  if (!element) return;

  const navHeight = document.querySelector('nav')?.offsetHeight || 0;
  const targetPosition = element.getBoundingClientRect().top + window.scrollY - (navHeight + 10);

  window.scrollTo({ top: Math.max(targetPosition, 0), behavior: 'smooth' });
}

/* ===========================
   Overlay management
=========================== */
function closeSkipHint() {
  const skipHint = document.getElementById('skipHint');
  if (skipHint) {
    document.body.classList.add('loaded');
    setTimeout(() => { if (skipHint && skipHint.parentNode) skipHint.parentNode.removeChild(skipHint); }, 400);
  }
}

function launchOverlay() {
  const overlay = document.getElementById('djOverlay');
  if (!overlay) return;

  overlay.classList.remove('closed', 'closing');
  overlay.classList.add('open');
  document.body.classList.add('lock');

  // Keep page at top
  try { window.scrollTo({ top: 0, behavior: 'instant' }); }
  catch(e) { window.scrollTo(0, 0); }
}

function closeOverlay() {
  const overlay = document.getElementById('djOverlay');
  if (!overlay || overlay.classList.contains('closed') || overlay.classList.contains('closing')) return;

  overlay.classList.add('closing');
  closeSkipHint();

  setTimeout(() => {
    overlay.classList.remove('open', 'closing');
    overlay.classList.add('closed');
    document.body.classList.remove('lock');
    try { localStorage.setItem('hasSeenIntro', 'true'); } catch(e) {}
  }, 700);
}

/* ===========================
   Color theme updates
=========================== */
function updateColorTheme(hue) {
  const saturation = 100;
  const lightness  = 55;
  const newGreen = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const newCyan  = `hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness + 10}%)`;

  document.documentElement.style.setProperty('--green', newGreen);
  document.documentElement.style.setProperty('--cyan',  newCyan);
}

/* ===========================
   House music recommender
=========================== */
function initHouseRecommender() {
  // 1) Require DOM hooks first
  const btn     = document.getElementById('recommend-btn');
  const rec     = document.getElementById('recommendation');
  const moreMsg = document.getElementById('more-msg');

  if (!btn || !rec) {
    console.warn('[Recommender] Missing #recommend-btn or #recommendation');
    return;
  }

  // 2) Track list
  const houseTracks = [
    '5veX2gRTIhuwxyelOqeeOM','4lq9lGXtJnAPLWVZav5Uyh','2klm9vgplHbcAq5VIHZCu4','3f5LJiAEHHZtW8bzF4qpNr',
    '5HphzVqJsiVij9zqLF5d14','5F9rZa65ePNd3HZFkavre7','2CtAajnRp5uwRCpQck0ki8','3X7zc5bxxXSZeHELV0I8DE',
    '0u5aRUEwlWhtO32VASKoLi','1YBvhB1094Q5Niw1GDSRY3','6jhAJgaS9OttFwP5Cn8WII','7u0fz3V6cYeYTX91DMmIvQ',
    '0xaXwvcjq7aAKwMKe22Bw7','1aNUSKBe6UMyMk3pEu9ws7','4zRvloWWpWHVgtdete6b1A','59NraMJsLaMCVtwXTSia8i',
    '39iL6MNqs9MIile4ohbx6K','0FBdJP7yzvq88bG1keGgt4','04gs2fDnnjT6995ruR1qbk','30uUMdzRVdYd9KuP9rJXxo',
    '6q36Cqt2d3O5jqrQR9uXCp','6Uz2230ZgSmqQli5SMaIZY','70fplEUWEuEIaJ2peNpPxW','0aeYqWitH0mkLtzcpeheWk',
    '6q6GR1UxIkyaVJuUNYtEjw','78nx0HDJIFD5xDq2L5420Z','1iKiLPkFnYhbCm5uvaDwjS','2y7UV3mw1igF35pj4b3xn7',
    '1AS1oLvEr6PNsCLnuEUmCi','38tYIX8o2VDBpfowqBVPYK','451TMhTkxtyZPzrcuCdm9H', '2CXF9gb38FVXESYZFobnCQ'
  ];

  // 3) Defensive helpers
  const shuffle = (arr) => {
    if (!Array.isArray(arr)) {
      console.error('[Recommender] shuffle received non-array:', arr);
      return [];
    }
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  let pool     = [];
  let lastId   = null;
  let presses  = 0;

  const nextId = () => {
    if (!pool.length) {
      pool = shuffle(houseTracks.slice());
      // avoid immediate repeat when resetting the pool
      if (lastId && pool.length > 1 && pool[0] === lastId) {
        const swapIdx = pool.findIndex(id => id !== lastId);
        if (swapIdx > 0) [pool[0], pool[swapIdx]] = [pool[swapIdx], pool[0]];
      }
    }
    const id = pool.shift();
    lastId = id || null;
    return id;
  };

  // 4) Click handler
  btn.addEventListener('click', () => {
    const id = nextId();
    if (!id) {
      console.error('[Recommender] No track ID available.');
      return;
    }

    presses += 1;

    rec.innerHTML =
      `<iframe src="https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0"
               width="100%" height="172" frameborder="0"
               allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
               loading="lazy"></iframe>`;

    rec.classList.add('show');
    if (moreMsg && presses >= 3) moreMsg.style.display = 'block';
  });
}


/* ===========================
   Initialize sliders and controls
=========================== */
function initSliders() {
  // Tempo slider
  const tempoSlider = document.getElementById('tempoSlider');
  const tempoHandle = document.getElementById('tempoHandle');
  const tempoTrack  = document.getElementById('tempoTrack');

  if (tempoSlider && tempoHandle && tempoTrack) {
    let isDragging = false;

    tempoHandle.addEventListener('mousedown', function(e) {
      isDragging = true; e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      const rect = tempoSlider.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      tempoHandle.style.left = `calc(${percentage}% - 8px)`;
      tempoTrack.style.width  = percentage + '%';
      tempo = 0.6 + (percentage / 100) * 1.2;
      document.documentElement.style.setProperty('--tempo', tempo);
      document.documentElement.style.setProperty('--rpm', (3 / tempo) + 's');
    });

    document.addEventListener('mouseup', function() { isDragging = false; });

    tempoHandle.style.left = 'calc(50% - 8px)';
    tempoTrack.style.width  = '50%';
  }

  // Vibe slider
  const vibeSlider = document.getElementById('vibeSlider');
  const vibeHandle = document.getElementById('vibeHandle');
  const vibeTrack  = document.getElementById('vibeTrack');

  if (vibeSlider && vibeHandle && vibeTrack) {
    let isVibing = false;

    vibeHandle.addEventListener('mousedown', function(e) {
      isVibing = true; e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
      if (!isVibing) return;
      const rect = vibeSlider.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      vibeHandle.style.left = `calc(${percentage}% - 8px)`;
      vibeTrack.style.width  = percentage + '%';
      vibe = (percentage / 100) * 360;
      updateColorTheme(vibe);
    });

    document.addEventListener('mouseup', function() { isVibing = false; });

    vibeHandle.style.left = 'calc(42% - 8px)';
    vibeTrack.style.width  = '42%';
  }
}

/* ===========================
   External page load (Coursework, etc.)
   Sequence: beep → "Loading..." → progress → "Playing: X" + beep → close overlay → navigate
=========================== */
let _djNavLock = false; // avoid double-click spam

function loadExternalPage(url, label, meta = { bpm: '128', key: '10A' }) {
  if (_djNavLock) return;
  _djNavLock = true;

  launchOverlay();

  const screenTitle    = document.getElementById('screenTitle');
  const screenMeta     = document.getElementById('screenMeta');
  const screenTime     = document.getElementById('screenTime');
  const screenProgress = document.getElementById('screenProgress');

  if (screenTitle) screenTitle.textContent = 'Loading...';
  if (screenMeta)  screenMeta.textContent  = `Queue • ${meta.bpm} BPM • KEY ${meta.key}`;
  if (screenTime)  screenTime.textContent  = '00:00';

  if (screenProgress) {
    screenProgress.style.transition = 'width 0.3s ease';
    screenProgress.style.width = '0%';
    void screenProgress.offsetWidth; // reflow to restart CSS transition
    setTimeout(() => { screenProgress.style.width = '100%'; }, 90);
  }

  // first beep (same as pads)
  playBeep(330, 0.08);

  // after the quick fill, flip to "Playing"
  setTimeout(() => {
    if (screenTitle) screenTitle.textContent = label;
    if (screenMeta)  screenMeta.textContent  = `Playing • ${meta.bpm} BPM • KEY ${meta.key}`;
    playBeep(220, 0.08);

    // Let "Playing" linger a bit
    const AFTER_SECOND_BEEP = 1000; // tweak this feel (ms)

    setTimeout(() => {
      try { localStorage.setItem('hasSeenIntro', 'true'); } catch(e) {}
      closeOverlay();
      setTimeout(() => { window.location.href = url; }, 720); // allow close anim to finish
    }, AFTER_SECOND_BEEP);
  }, 380);
}

/* ===========================
   Pad buttons (handles buttons AND <a class="pad-btn">)
=========================== */
function initPadButtons() {
  const pads = document.querySelectorAll('.pad-btn');
  if (!pads.length) return;

  pads.forEach(pad => {
    pad.addEventListener('click', function(e) {
      // visual active
      pads.forEach(p => p.classList.remove('active'));
      this.classList.add('active');

      const dataTarget = this.getAttribute('data-target');
      const href       = this.getAttribute('href');

      // In-page sections via data-target="#id"
      if (dataTarget && dataTarget.startsWith('#')) {
        e.preventDefault();
        playBeep(330, 0.08);
        loadTrack(dataTarget);
        return;
      }

      // Anchor pads that navigate to another page (e.g., coursework.html)
      if (href && href.endsWith('.html')) {
        e.preventDefault();
        const label = (this.textContent || 'Loading').trim();
        const meta  = (href.includes('coursework')) ? { bpm: '128', key: '10A' } : { bpm: '124', key: '9A' };
        loadExternalPage(href, label, meta);
        return;
      }

      // Fallback: if data-target exists but isn’t a hash or html, treat like in-page
      if (dataTarget) {
        e.preventDefault();
        playBeep(330, 0.08);
        loadTrack(dataTarget);
      }
    });
  });
}

/* ===========================
   Hamburger menu (desktop/tablet)
=========================== */
function initHamburger() {
  const burger = document.querySelector('.hamburger-icon');
  const menu   = document.querySelector('.menu-links');
  if (!burger || !menu) return;

  const open = () => {
    burger.classList.add('open');
    menu.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', onOutside);
    document.addEventListener('keydown', onKeydown);
  };
  const close = () => {
    burger.classList.remove('open');
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onOutside);
    document.removeEventListener('keydown', onKeydown);
  };
  const toggle = () => (menu.classList.contains('open') ? close() : open());

  burger.setAttribute('role', 'button');
  burger.setAttribute('tabindex', '0');
  burger.setAttribute('aria-controls', 'navLinks');
  burger.setAttribute('aria-expanded', 'false');

  burger.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
  burger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });

  // Close on nav link click
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  // Close when resizing to desktop to avoid a stuck menu state
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 861px)').matches) close();
  });

  function onOutside(e) {
    if (e.target.closest('.menu-links') || e.target.closest('.hamburger-icon')) return;
    close();
  }
  function onKeydown(e) { if (e.key === 'Escape') close(); }
}

/* ===========================
   Initialize other interactions
=========================== */
function initInteractions() {
  // Knob controls
  document.querySelectorAll('.knob-control, .eq-knob').forEach(knob => {
    knob.addEventListener('click', function() {
      const currentRotation = this.style.transform ?
        parseInt(this.style.transform.replace(/[^\d-]/g, '')) : 0;
      const newRotation = (currentRotation + 45) % 360;
      this.style.transform = `rotate(${newRotation}deg)`;
      playBeep(180, 0.05);
    });
  });

  // Decorative buttons
  document.querySelectorAll('.deco-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      this.classList.toggle('active');
      playBeep(150, 0.06);
      this.style.transform = 'scale(0.95)';
      setTimeout(() => { this.style.transform = ''; }, 100);
    });
  });

  // Anchor link handling (#hash)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href.length <= 1) return;
      e.preventDefault();
      const overlay = document.getElementById('djOverlay');
      if (overlay && overlay.classList.contains('open')) {
        closeOverlay();
        setTimeout(() => { scrollToSection(href); }, 300);
      } else {
        scrollToSection(href);
      }
    });
  });

  // Route "Coursework" nav through the deck animation (desktop & hamburger)
  document.querySelectorAll('a[href*="coursework.html"]').forEach(a => {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      const href  = this.getAttribute('href');
      const label = (this.textContent || 'Coursework').trim();
      loadExternalPage(href, label, { bpm: '128', key: '10A' });
    });
  });

  // Skip hint (desktop only)
  const skipHint = document.getElementById('skipHint');
  if (skipHint && !isMobile()) {
    skipHint.addEventListener('click', closeOverlay);
    skipHint.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeOverlay(); }
    });
  }

  // Overlay launchers
  const launchBtn = document.getElementById('launchDJ');
  if (launchBtn) launchBtn.addEventListener('click', launchOverlay);
  const logo = document.querySelector('.logo');
  if (logo) logo.addEventListener('click', launchOverlay);
}

/* ===========================
   Handle first load
=========================== */
function handleFirstLoad() {
  const overlay = document.getElementById('djOverlay');
  if (!overlay) return;

  if (overlay.classList.contains('open')) {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';
    const isPageRefresh = (() => {
      const navEntry = performance.getEntriesByType &&
                       performance.getEntriesByType('navigation')[0];
      if (navEntry && typeof navEntry.type === 'string') return navEntry.type === 'reload';
      const legacyNav = performance.navigation;
      return legacyNav && legacyNav.type === 1;
    })();

    if (!hasSeenIntro || isPageRefresh) {
      document.body.classList.add('lock');
    } else {
      overlay.classList.remove('open');
      overlay.classList.add('closed');
      document.body.classList.remove('lock');
    }
  }
}

/* ===========================
   Overlay scrolling behavior
   - Desktop: wheel/scroll closes overlay (and hides "scroll to continue")
   - Mobile: no auto-close; just overscroll guards
=========================== */
function initOverlayScrolling() {
  const overlay  = document.getElementById('djOverlay');
  const scroller = document.getElementById('dj');
  if (!overlay || !scroller) return;

  // Desktop: wheel to dismiss (NEVER on mobile)
  overlay.addEventListener('wheel', (e) => {
    if (isMobile()) return;
    if (overlay.classList.contains('open')) {
      closeSkipHint();
      closeOverlay();
    }
  }, { passive: true });

  // Mobile overscroll guards
  let startY = 0;
  function onTouchStart(e){ startY = e.touches[0].clientY; }
  function onTouchMove(e){
    if (!overlay.classList.contains('open') || !isMobile()) return;
    const dy = e.touches[0].clientY - startY;
    const atTop = scroller.scrollTop <= 0;
    const atBottom = Math.ceil(scroller.scrollTop + scroller.clientHeight) >= scroller.scrollHeight;
    if ((atTop && dy > 0) || (atBottom && dy < 0)) e.preventDefault();
  }
  scroller.addEventListener('touchstart', onTouchStart, { passive: true });
  scroller.addEventListener('touchmove',  onTouchMove,  { passive: false });
}

/* ===========================
   Back/forward cache normalization
=========================== */
window.addEventListener('pageshow', (e) => {
  const overlay = document.getElementById('djOverlay');
  if (!overlay) return;
  const hasSeen = localStorage.getItem('hasSeenIntro') === 'true';
  if (e.persisted) {
    overlay.classList.toggle('open',  !hasSeen);
    overlay.classList.toggle('closed',  hasSeen);
    document.body.classList.toggle('lock', !hasSeen);
  }
});

/* ===========================
   Main initialization
=========================== */
function init() {
  initParticles();
  initHouseRecommender();
  initSliders();
  initPadButtons();
  initHamburger();
  initInteractions();        // keep your other UI handlers
  setupAnimatedLinkDelegation(); // <-- add this
  initOverlayScrolling();
  handleFirstLoad();
}



// Global for inline handlers
window.launchOverlay = launchOverlay;

// DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ===========================
   Misc UI helpers
=========================== */
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  if (!menu || !icon) return;
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

/* ===========================
   Typewriter title (optional)
=========================== */
document.addEventListener("DOMContentLoaded", function () {
  const textElement = document.getElementById('animated-text');
  if (!textElement) return;
  const text = "Jeremy Calcarian";
  let index = 0;
  let isAdding = true;

  function typeEffect() {
    if (isAdding) {
      if (index < text.length) {
        textElement.innerHTML += text.charAt(index);
        index++;
        setTimeout(typeEffect, 100);
      } else {
        isAdding = false;
        setTimeout(typeEffect, 2000);
      }
    } else {
      if (index > 0) {
        textElement.innerHTML = text.substring(0, index - 1);
        index--;
        setTimeout(typeEffect, 100);
      } else {
        isAdding = true;
        setTimeout(typeEffect, 500);
      }
    }
  }
  typeEffect();
});

/* ===========================
   Typewriter numbers (optional)
=========================== */
const typewriterNumbers = document.querySelectorAll('.typewriter-number');
typewriterNumbers.forEach(number => {
  const target   = +number.getAttribute('data-target');
  const duration = 8000;
  const interval = 50;
  let current    = 0;
  const increment = target / (duration / interval);

  const updateNumber = () => {
    current += increment;
    if (current < target) {
      number.textContent = Math.ceil(current);
      setTimeout(updateNumber, interval);
    } else {
      number.textContent = target;
      number.classList.add('complete');
    }
  };
  updateNumber();
});


