function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", function () {
    const textElement = document.getElementById('animated-text');
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
// Typewriter Effect for Numbers
const typewriterNumbers = document.querySelectorAll('.typewriter-number');
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

document.addEventListener("DOMContentLoaded", function() {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 80,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#000000"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          },
          "image": {
            "src": "img/github.svg",
            "width": 100,
            "height": 100
          }
        },
        "opacity": {
          "value": 0.05,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.05,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 10,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#000000",
          "opacity": 0.2,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 3,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "repulse"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 400,
            "line_linked": {
              "opacity": 0.4
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 0.5,
            "speed": 1
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
  });
  
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

  let clickCount = 0;
  let shuffled = [];
  let index = 0;

  function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function resetShuffle() {
    shuffled = shuffleArray(houseTracks);
    index = 0;
  }

  resetShuffle();

  btn.addEventListener('click', () => {
    clickCount++;

    // show on the 5th click
    if (clickCount >= 5) {
      moreMsg.style.display = 'block';
    }

    // reshuffle if needed
    if (index >= shuffled.length) resetShuffle();

    const id = shuffled[index++];
    rec.innerHTML = `
      <iframe
        src="https://open.spotify.com/embed/track/${id}?utm_source=generator"
        width="100%" height="80" frameborder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      ></iframe>
    `;

    // trigger fade-in if you use .show on #recommendation
    rec.classList.remove('show');
    void rec.offsetWidth;
    rec.classList.add('show');
  });

  document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('djOverlay');
    const launchBtn = document.getElementById('launchDJ');
  
    // Check if user has already seen intro
    const hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';
  
  // lock scroll while overlay is open on first load
if (overlay && overlay.classList.contains('open')) { 
  const hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';

  if (!hasSeenIntro) {
    // First time → run the cinematic intro
    document.body.classList.add('lock');
    revealIn();
    localStorage.setItem('hasSeenIntro', 'true'); // <-- mark it as seen
  } else {
    // Already seen → skip straight to site
    overlay.classList.remove('open');
    overlay.classList.add('closed');
    document.body.classList.remove('lock');
  }
}


  });

document.addEventListener('DOMContentLoaded', () => {
  // particles
  if(window.particlesJS){
    particlesJS('particles-js',{
      particles:{number:{value:100,density:{enable:true,value_area:800}}, color:{value:'#00ff88'}, shape:{type:'circle'}, opacity:{value:.28,random:true}, size:{value:3,random:true}, line_linked:{enable:true,distance:140,color:'#00ff88',opacity:.15,width:1}, move:{enable:true,speed:2,out_mode:'out'}},
      interactivity:{detect_on:'canvas',events:{onhover:{enable:true,mode:'repulse'}, onclick:{enable:true,mode:'push'},resize:true}}, retina_detect:true});
  }

  // Overlay controls
  const overlay = document.getElementById('djOverlay');
  const wrap = document.querySelector('.dj-wrap');
  const launchBtn = document.getElementById('launchDJ');

  // --- Reset intro flag on every refresh ---
  localStorage.removeItem('hasSeenIntro');

  function revealIn(){
    if(!wrap) return;

    // mark intro as seen
    localStorage.setItem('hasSeenIntro', 'true');

    // Start with cinematic fade-in sequence
    overlay.classList.add('intro-phase-1');

    // Phase 1: Black screen fade (500ms)
    setTimeout(() => {
      overlay.classList.remove('intro-phase-1');
      overlay.classList.add('intro-phase-2');
    }, 500);

    // Phase 2: Silhouette outline (800ms)
    setTimeout(() => {
      overlay.classList.remove('intro-phase-2');
      overlay.classList.add('intro-phase-3');
    }, 1300);

    // Phase 3: Sharp focus + micro-animations (1000ms)
    setTimeout(() => {
      const leftPlatter = document.getElementById('leftPlatter');
      const rightPlatter = document.getElementById('rightPlatter');
      const knobs = document.querySelectorAll('.knob');
      const arms = document.querySelectorAll('.arm');

      if(leftPlatter) leftPlatter.classList.add('intro-spin');
      if(rightPlatter) rightPlatter.classList.add('intro-spin');
      arms.forEach(arm => arm.classList.add('intro-nudge'));
      knobs.forEach(knob => knob.classList.add('intro-turn'));

      if(window.gsap) {
        gsap.fromTo('.intro', 
          { opacity: 0, y: 30, filter: 'blur(10px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }
        );
      }

      setTimeout(() => {
        overlay.classList.remove('intro-phase-3');
        if(leftPlatter) leftPlatter.classList.remove('intro-spin');
        if(rightPlatter) rightPlatter.classList.remove('intro-spin');
        arms.forEach(arm => arm.classList.remove('intro-nudge'));
        knobs.forEach(knob => knob.classList.remove('intro-turn'));
      }, 2500);
    }, 1300);
  }

  function exitOverlay(callback){
    if(!overlay || overlay.classList.contains('closed') || overlay.classList.contains('closing')) return;
    overlay.classList.add('closing');

    overlay.classList.remove('intro-phase-1', 'intro-phase-2', 'intro-phase-3');

    if(wrap && window.gsap){
      gsap.to(wrap, {
        yPercent:-6, 
        scale:.85, 
        opacity:0, 
        filter:'blur(12px) brightness(0.3)', 
        duration:.65, 
        ease:'power2.in', 
        onComplete:()=>{
          overlay.classList.remove('open','closing'); 
          overlay.classList.add('closed'); 
          document.body.classList.remove('lock');
          if(typeof callback==='function') callback();
        }
      });
    } else {
      overlay.classList.remove('open'); 
      overlay.classList.add('closed'); 
      document.body.classList.remove('lock'); 
      if(callback) callback();
    }
  }

  function launchOverlay(){
    if(!overlay) return;

    overlay.classList.remove('closed', 'closing', 'intro-phase-1', 'intro-phase-2', 'intro-phase-3');
    overlay.offsetHeight;

    if(wrap && window.gsap) {
      gsap.set(wrap, { clearProps: "all" });
      gsap.set('.intro', { clearProps: "all" });
    }

    const leftPlatter = document.getElementById('leftPlatter');
    const rightPlatter = document.getElementById('rightPlatter');
    const knobs = document.querySelectorAll('.knob');
    const arms = document.querySelectorAll('.arm');

    if(leftPlatter) leftPlatter.classList.remove('intro-spin');
    if(rightPlatter) rightPlatter.classList.remove('intro-spin');
    arms.forEach(arm => arm.classList.remove('intro-nudge'));
    knobs.forEach(knob => knob.classList.remove('intro-turn'));

    overlay.classList.add('open');
    document.body.classList.add('lock');
    window.scrollTo({top:0,behavior:'smooth'}); 

    requestAnimationFrame(() => {
      revealIn();
    });
  }

  // --- Intro handling on first load ---
  if (overlay && overlay.classList.contains('open')) {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';

    if (!hasSeenIntro) {
      document.body.classList.add('lock');
      revealIn();
      localStorage.setItem('hasSeenIntro', 'true');
    } else {
      overlay.classList.remove('open');
      overlay.classList.add('closed');
      document.body.classList.remove('lock');
    }
  }

  // exit on scroll / wheel / touch
  ['wheel','touchmove'].forEach(evt=> overlay?.addEventListener(evt, ()=> exitOverlay()));
  document.getElementById('skipHint')?.addEventListener('click', ()=> exitOverlay());
  document.getElementById('skipHint')?.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') exitOverlay();});
  launchBtn?.addEventListener('click', launchOverlay);
  document.querySelector('.logo')?.addEventListener('click', launchOverlay);

  // Utility: scroll with nav offset
  function scrollToHash(h){
    const el=document.querySelector(h); if(!el) return;
    const navH = document.querySelector('nav')?.offsetHeight || 0;
    const y = el.getBoundingClientRect().top + window.scrollY - (navH + 10);
    window.scrollTo({top:Math.max(y,0), behavior:'smooth'});
  }

  // Anchor override for menu links while overlay open
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    const h=a.getAttribute('href'); if(h && h.length>1){ e.preventDefault(); exitOverlay(()=> scrollToHash(h)); }
  }));

  /* DJ interactions */
  const pads = Array.from(document.querySelectorAll('.pad'));
  const left = document.getElementById('leftPlatter');
  const right = document.getElementById('rightPlatter');

  const screen = document.getElementById('screen');
  const sTitle = document.getElementById('screenTitle');
  const sMeta = document.getElementById('screenMeta');
  const sProg = document.getElementById('screenProgress');

  let AC;
  function beep(freq=220, dur=0.12){
    try{
      AC = AC || new (window.AudioContext||window.webkitAudioContext)();
      const o=AC.createOscillator(); const g=AC.createGain(); o.type='sine'; o.frequency.value=freq;
      const now = AC.currentTime; g.gain.setValueAtTime(.0001, now); g.gain.linearRampToValueAtTime(.04, now+.01); g.gain.exponentialRampToValueAtTime(.0001, now+dur);
      o.connect(g); g.connect(AC.destination); o.start(now); o.stop(now+dur);
    }catch(e){}
  }

  function loadTrack(targetSel, title){
    if(!screen) return;
    screen.classList.remove('playing');
    sTitle.textContent = 'Loading';
    if(sMeta) sMeta.textContent = title || 'Track';
    sProg.style.width = '0%';
    requestAnimationFrame(()=>{ sProg.style.width = '100%'; });
    left?.animate([{transform:'rotate(0deg)'},{transform:'rotate(16deg)'}], {duration:150,easing:'ease-out'});
    right?.animate([{transform:'rotate(0deg)'},{transform:'rotate(16deg)'}], {duration:150,easing:'ease-out'});
    setTimeout(()=>{
      screen.classList.add('playing');
      sTitle.textContent = 'Playing';
      beep();
      setTimeout(()=> exitOverlay(()=> scrollToHash(targetSel)), 650);
    }, 750);
  }

  pads.forEach((pad)=>{
    pad.addEventListener('click', ()=>{
      pads.forEach(p=>p.classList.remove('active'));
      pad.classList.add('active');
      const target = pad.getAttribute('data-target') || '#about';
      const t = pad.querySelector('.pad-title')?.textContent || 'Track';
      loadTrack(target, t);
    });
  });

  const tempo = document.getElementById('tempo');
  tempo?.addEventListener('input', ()=>{
    const t = parseFloat(tempo.value || '1');
    document.documentElement.style.setProperty('--tempo', String(t));
    document.querySelectorAll('.vu span').forEach((bar,idx)=>{bar.style.animationDuration = (0.9 + (idx%3)*0.2)/t + 's';});
  });

  const vibe = document.getElementById('vibe');
  function updateVibe(){
    if(!vibe) return; const h = parseInt(vibe.value || '150',10);
    const g = `hsl(${h}, 100%, 52%)`; const c = `hsl(${(h+36)%360}, 100%, 52%)`;
    document.documentElement.style.setProperty('--green', g);
    document.documentElement.style.setProperty('--cyan', c);
    document.documentElement.style.setProperty('--border', 'rgba(0,255,136,.22)');
  }
  vibe?.addEventListener('input', updateVibe); updateVibe();

});

  document.addEventListener("DOMContentLoaded", () => {
    const djBoard = document.getElementById("dj-board");

    if (window.innerWidth <= 768) { // only mobile
      let startY = 0;

      djBoard.addEventListener("touchstart", e => {
        startY = e.touches[0].clientY;
      }, { passive: true });

      djBoard.addEventListener("touchmove", e => {
        const currentY = e.touches[0].clientY;

        // At top and pulling down
        if (djBoard.scrollTop === 0 && currentY > startY) {
          e.preventDefault();
        }
        // At bottom and pulling up
        if (djBoard.scrollTop + djBoard.clientHeight >= djBoard.scrollHeight && currentY < startY) {
          e.preventDefault();
        }
      }, { passive: false });
    }
  });


