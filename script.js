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
    const gainNode = audioContext.createGain();
    
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

  const screenTitle = document.getElementById('screenTitle');
  const screenMeta = document.getElementById('screenMeta');
  const screenTime = document.getElementById('screenTime');
  const screenProgress = document.getElementById('screenProgress');
  
  if (screenTitle) screenTitle.textContent = 'Loading...';
  if (screenMeta) screenMeta.textContent = `Queue • ${track.bpm} BPM • KEY ${track.key}`;
  if (screenTime) screenTime.textContent = '00:00';
  if (screenProgress) {
    screenProgress.style.width = '0%';
    screenProgress.style.transition = 'width 0.3s ease';
  }
  
  // Quick load animation - progress bar fills fast
  setTimeout(() => { if (screenProgress) screenProgress.style.width = '100%'; }, 100);
  
  // Show loaded state and navigate
  setTimeout(() => {
    if (screenTitle) screenTitle.textContent = track.title;
    if (screenMeta) screenMeta.textContent = `Playing • ${track.bpm} BPM • KEY ${track.key}`;
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
    // fade out via CSS hook and then hard-remove
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
  const lightness = 55;
  const newGreen = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const newCyan = `hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness + 10}%)`;
  
  document.documentElement.style.setProperty('--green', newGreen);
  document.documentElement.style.setProperty('--cyan', newCyan);
}

/* ===========================
   House music recommender
=========================== */
function initHouseRecommender() {
  const houseTracks = [
    '5veX2gRTIhuwxyelOqeeOM','4lq9lGXtJnAPLWVZav5Uyh','2klm9vgplHbcAq5VIHZCu4','3f5LJiAEHHZtW8bzF4qpNr',
    '5HphzVqJsiVij9zqLF5d14','5F9rZa65ePNd3HZFkavre7','2CtAajnRp5uwRCpQck0ki8','3X7zc5bxxXSZeHELV0I8DE',
    '0u5aRUEwlWhtO32VASKoLi','1YBvhB1094Q5Niw1GDSRY3','6jhAJgaS9OttFwP5Cn8WII','7u0fz3V6cYeYTX91DMmIvQ',
    '0xaXwvcjq7aAKwMKe22Bw7','1aNUSKBe6UMyMk3pEu9ws7','4zRvloWWpWHVgtdete6b1A','59NraMJsLaMCVtwXTSia8i',
    '39iL6MNqs9MIile4ohbx6K','0FBdJP7yzvq88bG1keGgt4','04gs2fDnnjT6995ruR1qbk','30uUMdzRVdYd9KuP9rJXxo',
    '6q36Cqt2d3O5jqrQR9uXCp','6Uz2230ZgSmqQli5SMaIZY','70fplEUWEuEIaJ2peNpPxW','0aeYqWitH0mkLtzcpeheWk',
    '6q6GR1UxIkyaVJuUNYtEjw','78nx0HDJIFD5xDq2L5420Z','1iKiLPkFnYhbCm5uvaDwjS','2y7UV3mw1igF35pj4b3xn7',
    '1AS1oLvEr6PNsCLnuEUmCi','38tYIX8o2VDBpfowqBVPYK','451TMhTkxtyZPzrcuCdm9H'
  ];

  let remaining = [];      // queue of tracks left in this cycle
  let lastId = null;       // last played track id (to avoid immediate repeat across cycles)
  let pressCount = 0;      // count presses before revealing "more"

  const btn = document.getElementById('recommend-btn');
  const rec = document.getElementById('recommendation');
  const moreMsg = document.getElementById('more-msg');
  if (!btn || !rec) return;

  // Fisher–Yates shuffle
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Get next non-repeating track id
  const nextId = () => {
    if (remaining.length === 0) {
      // start a fresh cycle
      remaining = shuffle(houseTracks.slice());

      // avoid immediate repeat across cycles
      if (lastId && remaining.length > 1 && remaining[0] === lastId) {
        const swapIdx = remaining.findIndex(id => id !== lastId);
        if (swapIdx > 0) [remaining[0], remaining[swapIdx]] = [remaining[swapIdx], remaining[0]];
      }
    }
    const id = remaining.shift();
    lastId = id;
    return id;
  };

  btn.addEventListener('click', function () {
    pressCount++;

    const id = nextId();
    const iframe = `<iframe src="https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0" width="100%" height="172" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;

    rec.innerHTML = iframe;
    rec.classList.add('show');

    // Only reveal the "more/playlist" UI after the 3rd press
    if (moreMsg && pressCount >= 3) {
      moreMsg.style.display = 'block';
    }
  });
}

/* ===========================
   Initialize sliders and controls
=========================== */
function initSliders() {
  // Tempo slider
  const tempoSlider = document.getElementById('tempoSlider');
  const tempoHandle = document.getElementById('tempoHandle');
  const tempoTrack = document.getElementById('tempoTrack');

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
      tempoTrack.style.width = percentage + '%';
      tempo = 0.6 + (percentage / 100) * 1.2;
      document.documentElement.style.setProperty('--tempo', tempo);
      document.documentElement.style.setProperty('--rpm', (3 / tempo) + 's');
    });

    document.addEventListener('mouseup', function() { isDragging = false; });

    tempoHandle.style.left = 'calc(50% - 8px)';
    tempoTrack.style.width = '50%';
  }

  // Vibe slider
  const vibeSlider = document.getElementById('vibeSlider');
  const vibeHandle = document.getElementById('vibeHandle');
  const vibeTrack = document.getElementById('vibeTrack');

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
      vibeTrack.style.width = percentage + '%';
      vibe = (percentage / 100) * 360;
      updateColorTheme(vibe);
    });

    document.addEventListener('mouseup', function() { isVibing = false; });

    vibeHandle.style.left = 'calc(42% - 8px)';
    vibeTrack.style.width = '42%';
  }
}

/* ===========================
   Initialize pad buttons
=========================== */
function initPadButtons() {
  const pads = document.querySelectorAll('.pad-btn');
  pads.forEach(pad => {
    pad.addEventListener('click', function() {
      pads.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const target = this.getAttribute('data-target');
      if (target) {
        playBeep(330, 0.08);
        loadTrack(target);
      }
    });
  });
}

/* ===========================
   Hamburger menu (desktop/tablet)
=========================== */
function initHamburger() {
  const burger = document.querySelector('.hamburger-icon');
  const menu = document.querySelector('.menu-links');
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
  burger.setAttribute('aria-controls', 'navLinks'); // ok if absent
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

  // Anchor link handling
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
  const overlay = document.getElementById('djOverlay');
  const scroller = document.getElementById('dj');
  if (!overlay || !scroller) return;

  // Desktop: wheel to dismiss (NEVER on mobile)
  overlay.addEventListener('wheel', (e) => {
    if (isMobile()) return;
    if (overlay.classList.contains('open')) {
      closeSkipHint(); // remove the "scroll to continue" hint immediately
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
   Main initialization
=========================== */
function init() {
  initParticles();
  initHouseRecommender();
  initSliders();
  initPadButtons();
  initHamburger();       // NEW: robust hamburger behavior
  initInteractions();
  initOverlayScrolling(); // Desktop scroll-to-dismiss, mobile guards
  handleFirstLoad();
  console.log('🎵 DJ Controller initialized! Use the pad buttons to explore.');
}

// Global for inline handlers
window.launchOverlay = launchOverlay;

// DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
