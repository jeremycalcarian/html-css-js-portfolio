/* ===========================
   Helpers + Refresh reset
=========================== */
const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

// Reset the intro flag ONLY on hard reload (F5 / Cmd+R / pull-to-refresh)
(() => {
  try {
    const nav = performance.getEntriesByType?.('navigation')?.[0];
    const isReload = nav ? nav.type === 'reload'
                         : (performance.navigation && performance.navigation.type === 1); // TYPE_RELOAD
    if (isReload) localStorage.removeItem('hasSeenIntro');
  } catch (_) { /* noop */ }
})();

/* Optional: legacy hamburger helper (harmless if not used) */
function toggleMenu() {
  const menu = document.querySelector('.menu-links');
  const icon = document.querySelector('.hamburger-icon');
  menu?.classList.toggle('open');
  icon?.classList.toggle('open');
}

/* ===========================
   Typewriter (guarded)
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  const textElement = document.getElementById('animated-text');
  if (!textElement) return;

  const text = 'Jeremy Calcarian';
  let index = 0;
  let isAdding = true;

  const typeEffect = () => {
    if (isAdding) {
      if (index < text.length) {
        textElement.innerHTML += text.charAt(index++);
        setTimeout(typeEffect, 100);
      } else {
        isAdding = false;
        setTimeout(typeEffect, 2000);
      }
    } else {
      if (index > 0) {
        textElement.innerHTML = text.substring(0, --index);
        setTimeout(typeEffect, 100);
      } else {
        isAdding = true;
        setTimeout(typeEffect, 500);
      }
    }
  };
  typeEffect();
});

/* ===========================
   Typewriter Numbers (guarded)
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  const typewriterNumbers = document.querySelectorAll('.typewriter-number');
  if (!typewriterNumbers.length) return;

  typewriterNumbers.forEach(number => {
    const target = +number.getAttribute('data-target');
    const duration = 8000;
    const interval = 50;
    let current = 0;
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
});

/* ===========================
   Particles (guarded)
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  if (!window.particlesJS) return;
  particlesJS('particles-js', {
    particles:{
      number:{ value:100, density:{ enable:true, value_area:800 } },
      color:{ value:'#00ff88' },
      shape:{ type:'circle' },
      opacity:{ value:.28, random:true },
      size:{ value:3, random:true },
      line_linked:{ enable:true, distance:140, color:'#00ff88', opacity:.15, width:1 },
      move:{ enable:true, speed:2, out_mode:'out' }
    },
    interactivity:{
      detect_on:'canvas',
      events:{ onhover:{ enable:true, mode:'repulse' }, onclick:{ enable:true, mode:'push' }, resize:true }
    },
    retina_detect:true
  });
});

/* ===========================
   House track recommender
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  const houseTracks = [
    '5veX2gRTIhuwxyelOqeeOM','4lq9lGXtJnAPLWVZav5Uyh','2klm9vgplHbcAq5VIHZCu4','3f5LJiAEHHZtW8bzF4qpNr',
    '5HphzVqJsiVij9zqLF5d14','5F9rZa65ePNd3HZFkavre7','2CtAajnRp5uwRCpQck0ki8','3X7zc5bxxXSZeHELV0I8DE',
    '0u5aRUEwlWhtO32VASKoLi','1YBvhB1094Q5Niw1GDSRY3','6jhAJgaS9OttFwP5Cn8WII','7u0fz3V6cYeYTX91DMmIvQ',
    '0xaXwvcjq7aAKwMKe22Bw7','1aNUSKBe6UMyMk3pEu9ws7','4zRvloWWpWHVgtdete6b1A','59NraMJsLaMCVtwXTSia8i',
    '39iL6MNqs9MIile4ohbx6K','0FBdJP7yzvq88bG1keGgt4','04gs2fDnnjT6995ruR1qbk','30uUMdzRVdYd9KuP9rJXxo',
    '6q36Cqt2d3O5jqrQR9uXCp','6Uz2230ZgSmqQli5SMaIZY','70fplEUWEuEIaJ2peNpPxW','0aeYqWitH0mkLtzcpeheWk',
    '6q6GR1UxIkyaVJuUNYtEjw','78nx0HDJIFD5xDq2L5420Z','1iKiLPkFnYhbCm5uvaDwjS','2y7UV3mw1igF35pj4b3xn7',
    '1AS1oLvEr6PNsCLnuEUmCi','38tYIX8o2VDBpfowqBVPYK'
  ];

  const btn     = document.getElementById('recommend-btn');
  const rec     = document.getElementById('recommendation');
  const moreMsg = document.getElementById('more-msg');
  if (!btn || !rec) return;

  let clickCount = 0;
  let shuffled = [];
  let idx = 0;

  const shuffleArray = (array) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  const resetShuffle = () => { shuffled = shuffleArray(houseTracks); idx = 0; };
  resetShuffle();

  btn.addEventListener('click', () => {
    clickCount++;
    if (moreMsg && clickCount >= 5) moreMsg.style.display = 'block';
    if (idx >= shuffled.length) resetShuffle();

    const id = shuffled[idx++];
    rec.innerHTML = `
      <iframe
        src="https://open.spotify.com/embed/track/${id}?utm_source=generator"
        width="100%" height="80" frameborder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      ></iframe>
    `;
    rec.classList.remove('show'); void rec.offsetWidth; rec.classList.add('show');
  });
});

/* ===========================
   Overlay + DJ interactions
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  const overlay   = document.getElementById('djOverlay');
  const scroller  = document.getElementById('dj');           // scrollable area inside overlay
  const wrap      = document.querySelector('.dj-wrap');
  const launchBtn = document.getElementById('launchDJ');
  const skipHint  = document.getElementById('skipHint');

  if (!overlay || !scroller) return;

  const lockBody   = () => document.body.classList.add('lock');
  const unlockBody = () => document.body.classList.remove('lock');

  /* Hide the "Scroll to continue" hint on mobile */
  if (isMobile() && skipHint) {
    skipHint.style.display = 'none';
    // Also remove from a11y tree on mobile:
    skipHint.setAttribute('aria-hidden', 'true');
  }

  /* ---------- Cinematic intro ---------- */
  function revealIn(){
    if (!wrap) return;

    overlay.classList.add('intro-phase-1');

    setTimeout(() => {
      overlay.classList.remove('intro-phase-1');
      overlay.classList.add('intro-phase-2');
    }, 500);

    setTimeout(() => {
      overlay.classList.remove('intro-phase-2');
      overlay.classList.add('intro-phase-3');
    }, 1300);

    setTimeout(() => {
      const leftPlatter  = document.getElementById('leftPlatter');
      const rightPlatter = document.getElementById('rightPlatter');
      const knobs = document.querySelectorAll('.knob');
      const arms  = document.querySelectorAll('.arm');

      leftPlatter?.classList.add('intro-spin');
      rightPlatter?.classList.add('intro-spin');
      arms.forEach(a => a.classList.add('intro-nudge'));
      knobs.forEach(k => k.classList.add('intro-turn'));

      if (window.gsap) {
        gsap.fromTo('.intro', { opacity:0, y:30, filter:'blur(10px)' },
                             { opacity:1, y:0,  filter:'blur(0)', duration:0.8, ease:'power2.out' });
      }

      setTimeout(() => {
        overlay.classList.remove('intro-phase-3');
        leftPlatter?.classList.remove('intro-spin');
        rightPlatter?.classList.remove('intro-spin');
        arms.forEach(a => a.classList.remove('intro-nudge'));
        knobs.forEach(k => k.classList.remove('intro-turn'));
      }, 2500);
    }, 1300);
  }

  function exitOverlay(callback){
    if (overlay.classList.contains('closed') || overlay.classList.contains('closing')) return;
    overlay.classList.add('closing');
    overlay.classList.remove('intro-phase-1','intro-phase-2','intro-phase-3');

    const finish = () => {
      overlay.classList.remove('open','closing');
      overlay.classList.add('closed');
      unlockBody();

      // Mark as seen ONLY after the user truly dismissed it
      try { localStorage.setItem('hasSeenIntro', 'true'); } catch(_) {}

      if (typeof callback === 'function') callback();
    };

    if (wrap && window.gsap) {
      gsap.to(wrap, {
        yPercent:-6, scale:.85, opacity:0, filter:'blur(12px) brightness(0.3)',
        duration:.65, ease:'power2.in', onComplete: finish
      });
    } else {
      finish();
    }
  }

  function launchOverlay(){
    overlay.classList.remove('closed','closing','intro-phase-1','intro-phase-2','intro-phase-3');
    overlay.offsetHeight; // reflow
    if (wrap && window.gsap) {
      gsap.set(wrap, { clearProps:'all' });
      gsap.set('.intro', { clearProps:'all' });
    }
    overlay.classList.add('open');
    lockBody();
    // keep the page at top
    try {
      window.scrollTo({ top: 0, behavior: ('instant' in window) ? 'instant' : 'auto' });
    } catch(_) { window.scrollTo(0,0); }
    requestAnimationFrame(revealIn);
  }

  // Expose for inline onclick="launchOverlay()"
  window.launchOverlay = launchOverlay;

  /* ---------- First load behavior ---------- */
  if (overlay.classList.contains('open')) {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';
    if (!hasSeenIntro) {
      lockBody();
      revealIn();
      // DO NOT set localStorage here — only set when closed (in exitOverlay)
    } else {
      overlay.classList.remove('open');
      overlay.classList.add('closed');
      unlockBody();
    }
  }

  /* ---------- Desktop: allow wheel to dismiss ---------- */
  overlay.addEventListener('wheel', () => {
    if (!isMobile()) exitOverlay();
  }, { passive: true });

  /* ---------- Skip hint (desktop only) ---------- */
  if (!isMobile()) {
    skipHint?.addEventListener('click', () => exitOverlay());
    skipHint?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') exitOverlay();
    });
  }

  /* ---------- Anchor links: close overlay then scroll ---------- */
  function scrollToHash(h){
    const el = document.querySelector(h);
    if (!el) return;
    const navH = document.querySelector('nav')?.offsetHeight || 0;
    const y = el.getBoundingClientRect().top + window.scrollY - (navH + 10);
    window.scrollTo({ top: Math.max(y, 0), behavior:'smooth' });
  }
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const h = a.getAttribute('href');
      if (!h || h.length <= 1) return;
      e.preventDefault();
      if (overlay.classList.contains('open')) {
        exitOverlay(() => scrollToHash(h));
      } else {
        scrollToHash(h);
      }
    });
  });

  /* ---------- Pads -> load track -> exit & scroll ---------- */
  const pads   = Array.from(document.querySelectorAll('.pad'));
  const left   = document.getElementById('leftPlatter');
  const right  = document.getElementById('rightPlatter');
  const screen = document.getElementById('screen');
  const sTitle = document.getElementById('screenTitle');
  const sMeta  = document.getElementById('screenMeta');
  const sProg  = document.getElementById('screenProgress');

  let AC;
  function beep(freq=220, dur=0.12){
    try{
      AC = AC || new (window.AudioContext||window.webkitAudioContext)();
      const o=AC.createOscillator(); const g=AC.createGain();
      o.type='sine'; o.frequency.value=freq;
      const now = AC.currentTime;
      g.gain.setValueAtTime(.0001, now);
      g.gain.linearRampToValueAtTime(.04, now+.01);
      g.gain.exponentialRampToValueAtTime(.0001, now+dur);
      o.connect(g); g.connect(AC.destination); o.start(now); o.stop(now+dur);
    }catch(e){}
  }

  function loadTrack(targetSel, title){
    if (!screen || !sProg) return;
    screen.classList.remove('playing');
    if (sTitle) sTitle.textContent = 'Loading';
    if (sMeta)  sMeta.textContent  = title || 'Track';
    sProg.style.width = '0%';
    requestAnimationFrame(()=>{ sProg.style.width = '100%'; });
    left?.animate([{transform:'rotate(0deg)'},{transform:'rotate(16deg)'}], {duration:150,easing:'ease-out'});
    right?.animate([{transform:'rotate(0deg)'},{transform:'rotate(16deg)'}], {duration:150,easing:'ease-out'});
    setTimeout(()=>{
      screen.classList.add('playing');
      if (sTitle) sTitle.textContent = 'Playing';
      beep();
      setTimeout(()=> exitOverlay(()=> scrollToHash(targetSel)), 650);
    }, 750);
  }

  pads.forEach((pad) => {
    pad.addEventListener('click', () => {
      pads.forEach(p => p.classList.remove('active'));
      pad.classList.add('active');
      const target = pad.getAttribute('data-target') || '#about';
      const t = pad.querySelector('.pad-title')?.textContent || 'Track';
      loadTrack(target, t);
    });
  });

  /* ---------- Tempo & Vibe ---------- */
  const tempo = document.getElementById('tempo');
  tempo?.addEventListener('input', () => {
    const t = parseFloat(tempo.value || '1');
    document.documentElement.style.setProperty('--tempo', String(t));
    document.querySelectorAll('.vu span').forEach((bar, idx) => {
      bar.style.animationDuration = (0.9 + (idx % 3) * 0.2) / t + 's';
    });
  });

  const vibe = document.getElementById('vibe');
  function updateVibe(){
    if (!vibe) return;
    const h = parseInt(vibe.value || '150', 10);
    const g = `hsl(${h}, 100%, 52%)`;
    const c = `hsl(${(h+36)%360}, 100%, 52%)`;
    document.documentElement.style.setProperty('--green', g);
    document.documentElement.style.setProperty('--cyan', c);
    document.documentElement.style.setProperty('--border', 'rgba(0,255,136,.22)');
  }
  vibe?.addEventListener('input', updateVibe);
  updateVibe();

  /* ===========================
     Mobile overscroll guards
     (allow scrolling inside overlay,
      block bounce/pull-to-refresh)
  ============================ */
  let startY = 0;
  function onTouchStart(e){ startY = e.touches[0].clientY; }
  function onTouchMove(e){
    if (!overlay.classList.contains('open') || !isMobile()) return;
    const dy = e.touches[0].clientY - startY;
    const atTop    = scroller.scrollTop <= 0;
    const atBottom = Math.ceil(scroller.scrollTop + scroller.clientHeight) >= scroller.scrollHeight;

    if ((atTop && dy > 0) || (atBottom && dy < 0)) {
      e.preventDefault(); // block bounce / scroll chaining
    }
  }
  function onEdgeWheel(e){
    if (!overlay.classList.contains('open') || !isMobile()) return;
    const atTop    = scroller.scrollTop <= 0 && e.deltaY < 0;
    const atBottom = Math.ceil(scroller.scrollTop + scroller.clientHeight) >= scroller.scrollHeight && e.deltaY > 0;
    if (atTop || atBottom) e.preventDefault();
  }

  // Bind once; CSS also helps with overscroll-behavior
  scroller.addEventListener('touchstart', onTouchStart, { passive:true  });
  scroller.addEventListener('touchmove',  onTouchMove,  { passive:false });
  scroller.addEventListener('wheel',      onEdgeWheel,  { passive:false });

  /* ---------- Launch buttons ---------- */
  launchBtn?.addEventListener('click', launchOverlay);
  document.querySelector('.logo')?.addEventListener('click', launchOverlay);
});
