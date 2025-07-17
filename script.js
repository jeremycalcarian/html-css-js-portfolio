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
    '5veX2gRTIhuwxyelOqeeOM',
    '4lq9lGXtJnAPLWVZav5Uyh',
    '2klm9vgplHbcAq5VIHZCu4',
    '3f5LJiAEHHZtW8bzF4qpNr',
    '5HphzVqJsiVij9zqLF5d14',
    '5F9rZa65ePNd3HZFkavre7',
    '2CtAajnRp5uwRCpQck0ki8',
    '3X7zc5bxxXSZeHELV0I8DE',
    '0u5aRUEwlWhtO32VASKoLi',
    '1YBvhB1094Q5Niw1GDSRY3',
    '6jhAJgaS9OttFwP5Cn8WII',
    '7u0fz3V6cYeYTX91DMmIvQ',
    '0xaXwvcjq7aAKwMKe22Bw7',
    '1aNUSKBe6UMyMk3pEu9ws7',
    '4zRvloWWpWHVgtdete6b1A',
    '23RoR84KodL5HWvUTneQ1w',
    '59NraMJsLaMCVtwXTSia8i',
    '39iL6MNqs9MIile4ohbx6K',
    '0FBdJP7yzvq88bG1keGgt4',
    '04gs2fDnnjT6995ruR1qbk',
    '30uUMdzRVdYd9KuP9rJXxo',
    '6q36Cqt2d3O5jqrQR9uXCp',
    '6Uz2230ZgSmqQli5SMaIZY',
    '70fplEUWEuEIaJ2peNpPxW',
    '0aeYqWitH0mkLtzcpeheWk',
    '6q6GR1UxIkyaVJuUNYtEjw',
    '78nx0HDJIFD5xDq2L5420Z',
    '1iKiLPkFnYhbCm5uvaDwjS',
    '2y7UV3mw1igF35pj4b3xn7'
  ];
  
  const btn     = document.getElementById('recommend-btn');
  const rec     = document.getElementById('recommendation');
  const moreMsg = document.getElementById('more-msg');
  
  let clickCount = 0;
  let shuffled = [];  // store shuffled copy
  let index = 0;
  
  // Shuffle helper
  function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  
  // Initialize shuffle
  function resetShuffle() {
    shuffled = shuffleArray(houseTracks);
    index = 0;
  }
  
  resetShuffle();
  
  btn.addEventListener('click', () => {
    clickCount++;
  
    if (clickCount > 5) {
      moreMsg.classList.add('show');
    }
  
    // If we reached end, reshuffle
    if (index >= shuffled.length) {
      resetShuffle();
    }
  
    const id = shuffled[index];
    index++;
  
    rec.innerHTML = `
      <iframe
        src="https://open.spotify.com/embed/track/${id}?utm_source=generator"
        width="100%" height="80" frameborder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      ></iframe>
    `;
  
    rec.classList.remove('show');
    void rec.offsetWidth;
    rec.classList.add('show');
  });
  