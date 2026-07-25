if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
window.scrollTo(0, 0);
window.addEventListener('load', () => { 
  AOS.init({ 
    once: true, 
    offset: 0,
    duration: 800,
    anchorPlacement: 'top-bottom'
  }); 
  window.scrollTo(0, 0); 
});

/* =========================================
    SISTEMA DE TRADUÇÃO BILINGUE
    ========================================= */
const langBtn = document.getElementById('languageToggle');
const langFlag = document.getElementById('langFlag');
const langText = document.getElementById('langText');

// Dicionários para textos JS dinâmicos (Typewriter e Planetas)
const dynamicTexts = {
  en: {
    heroWords: ["Hi, I'm Pietro Dalbem.", "Backend Developer (PHP/SQL).", "Full Stack Engineer.", "UI/UX Designer.", "IoT Prototyper (Arduino)."],
    techDefault: "> Click or hover over the rotating technologies to see specific details of my technical domain.",
    php: "> Scalable back-end development in MVC. Mastery of secure logic, object orientation and efficient server-side data handling.",
    mysql: "> Secure relational data engineering. Advanced table modeling, complex relationships and high-performance queries.",
    js: "> Creation of dynamic and reactive interfaces. Asynchronous DOM manipulation, events and fluid integration with REST APIs.",
    c: "> Low-level microcontroller programming. Embedded logic in C for IoT and automation with Arduino hardware.",
    html: "> Semantic, accessible and SEO-optimized structuring. Clear content hierarchy for modern web.",
    css: "> Advanced and responsive styling. Creation of fluid layouts, Design Systems, animations and modern interfaces with Bootstrap."
  },
  pt: {
    heroWords: ["Olá, eu sou o Pietro Dalbem.", "Desenvolvedor Backend (PHP/SQL).", "Engenheiro Full Stack.", "UI/UX Designer.", "Prototipador IoT (Arduino)."],
    techDefault: "> Clique ou passe o mouse nas tecnologias giratórias para ver detalhes específicos do meu domínio técnico.",
    php: "> Desenvolvimento back-end escalável em MVC. Domínio da lógica segura, orientação a objetos e tratamento eficiente de dados server-side.",
    mysql: "> Engenharia de dados relacionais segura. Modelagem avançada de tabelas, relacionamentos complexos e queries de alta performance.",
    js: "> Criação de interfaces dinâmicas e reativas. Manipulação assíncrona da DOM, eventos e integração fluída com APIs rest.",
    c: "> Programação de baixo nível. Lógica embarcada em C para IoT e automação com hardware Arduino.",
    html: "> Estruturação semântica, acessível e otimizada para SEO. Hierarquia de conteúdo clara para web moderna.",
    css: "> Estilização avançada e responsiva. Criação de layouts fluídos, Design Systems, animações e interfaces com Bootstrap."
  }
};

// Pega o idioma atual salvo ou define 'en' como padrão
let currentLang = localStorage.getItem('portfolioLang') || 'en';

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('portfolioLang', lang);

  // Atualiza botão
  if (lang === 'en') {
    langFlag.src = 'https://flagcdn.com/w20/us.png';
    langText.textContent = 'EN';
  } else {
    langFlag.src = 'https://flagcdn.com/w20/br.png';
    langText.textContent = 'PT';
  }

  // Substitui os textos HTML fixos
  document.querySelectorAll('[data-en]').forEach(el => {
    el.innerHTML = el.getAttribute(`data-${lang}`);
  });

  // Atualiza o texto default dos planetas se nenhum estiver selecionado
  const techTextElement = document.getElementById('tech-text');
  if (techTextElement && techTextElement.style.color !== "var(--primary)") { // se não tiver planeta ativo
    techTextElement.innerHTML = dynamicTexts[lang].techDefault;
  }
}

// Toggle ao clicar
if (langBtn) {
  langBtn.addEventListener('click', () => {
    setLanguage(currentLang === 'en' ? 'pt' : 'en');
  });
}

// Inicia idioma na primeira carga
setLanguage(currentLang);

/* =========================================
    MÁQUINA DE ESCREVER (TYPEWRITER)
    ========================================= */
let heroIndex = 0, heroChar = 0, heroDeleting = false;
function typeHero() {
  // Puxa as palavras baseado no idioma atual dinamicamente
  const words = dynamicTexts[currentLang].heroWords;

  // Previne erro caso o index fique maior que o array ao trocar idioma no meio
  if (heroIndex >= words.length) heroIndex = 0;

  const currentWord = words[heroIndex];
  const typewriterElement = document.getElementById("typewriter");

  if (!typewriterElement) return;

  if (heroDeleting) { typewriterElement.textContent = currentWord.substring(0, heroChar - 1); heroChar--; }
  else { typewriterElement.textContent = currentWord.substring(0, heroChar + 1); heroChar++; }

  let speed = heroDeleting ? 40 : 80;
  if (!heroDeleting && heroChar === currentWord.length) { speed = 2500; heroDeleting = true; }
  else if (heroDeleting && heroChar === 0) { heroDeleting = false; heroIndex = (heroIndex + 1) % words.length; speed = 400; }

  setTimeout(typeHero, speed);
}
window.addEventListener('load', typeHero);

/* =========================================
    LÓGICA DOS PLANETAS E SISTEMA SOLAR
    ========================================= */
const pietroPhoto = document.getElementById('pietro-photo');
const solarWrapper = document.getElementById('solar-system');
const techTextElement = document.getElementById('tech-text');
const techTitleElement = document.getElementById('tech-title');
const allPlanets = document.querySelectorAll('.planet');

let typingTimer;
let inactivityTimer;

function typeTechText(text, index) {
  if (index < text.length) {
    techTextElement.textContent += text.charAt(index);
    typingTimer = setTimeout(() => typeTechText(text, index + 1), 10);
  }
}

function activateTech(planet) {
  clearTimeout(typingTimer);
  clearTimeout(inactivityTimer);
  
  if (pietroPhoto) pietroPhoto.classList.add('photo-react'); 
  if (solarWrapper) solarWrapper.classList.add('paused');
  allPlanets.forEach(p => p.classList.remove('selected')); 
  planet.classList.add('selected');
  const techKey = planet.getAttribute('data-tech');
  if (techTitleElement) techTitleElement.textContent = techKey.toUpperCase(); 
  if (techTextElement) {
    techTextElement.textContent = ""; 
    techTextElement.style.color = "var(--primary)";
    typeTechText(dynamicTexts[currentLang][techKey], 0);
  }
  
  inactivityTimer = setTimeout(() => {
    resetTech();
  }, 60000);
}

function resetTech() {
  clearTimeout(typingTimer);
  clearTimeout(inactivityTimer);
  
  if (pietroPhoto) pietroPhoto.classList.remove('photo-react'); 
  if (solarWrapper) solarWrapper.classList.remove('paused'); 
  allPlanets.forEach(p => p.classList.remove('selected'));
  if (techTitleElement) techTitleElement.textContent = "Stack & Core Tech";
  if (techTextElement) {
    techTextElement.textContent = dynamicTexts[currentLang].techDefault;
    techTextElement.style.color = "#cbd5e1";
  }
}

const sun = document.querySelector('.sun');
if (sun) {
  sun.addEventListener('click', (e) => {
    e.preventDefault();
    resetTech();
  });
}

allPlanets.forEach(planet => {
  if (window.innerWidth > 768) {
    planet.addEventListener('mouseover', () => activateTech(planet)); 
    planet.addEventListener('mouseout', resetTech);
  } else {
    planet.addEventListener('click', (e) => { 
      e.preventDefault(); 
      activateTech(planet); 
    });
  }
});

if (window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    const photo = document.querySelector('.hero-img-vertical');
    if (photo && !photo.classList.contains('photo-react')) {
      const x = (window.innerWidth / 2 - e.clientX) / 70; 
      const y = (window.innerHeight / 2 - e.clientY) / 70;
      photo.style.transform = `translateX(${x}px) translateY(${y}px)`;
    }
  });
}

/* =========================================
    MENU LEQUE NO FOOTER
    ========================================= */
const fanToggle = document.getElementById('fanToggle');
const fanContainer = document.getElementById('fanContainer');

if (fanToggle && fanContainer) {
  fanToggle.addEventListener('click', () => {
    fanContainer.classList.toggle('active');
    const icon = fanToggle.querySelector('i');
    if (fanContainer.classList.contains('active')) {
      icon.classList.remove('fa-phone');
      icon.classList.add('fa-xmark');
    } else {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-phone');
    }
  });

  document.addEventListener('click', (event) => {
    if (!fanContainer.contains(event.target) && fanContainer.classList.contains('active')) {
      fanContainer.classList.remove('active');
      const icon = fanToggle.querySelector('i');
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-phone');
    }
  });
}

/* =========================================
    NOVAS ANIMAÇÕES E INTERAÇÕES
    ========================================= */

// Magnetic Buttons
document.querySelectorAll('.magnetic-wrap').forEach(wrap => {
  wrap.addEventListener('mousemove', (e) => {
    const x = e.offsetX - wrap.offsetWidth / 2;
    const y = e.offsetY - wrap.offsetHeight / 2;
    wrap.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  wrap.addEventListener('mouseleave', () => {
    wrap.style.transform = 'translate(0px, 0px)';
  });
});

// Simple Card Tilt Effect
document.querySelectorAll('.expertise-card, .project-item').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  });
});

// Glitch effect on section titles
document.querySelectorAll('.section-title').forEach(title => {
  title.addEventListener('mouseenter', () => {
    title.style.animation = 'glitch 0.3s linear infinite';
  });
  title.addEventListener('mouseleave', () => {
    title.style.animation = 'none';
  });
});

/* =========================================
   SPOTLIGHT CARDS & PARTICLES
   ========================================= */

// Spotlight Effect for Cards
document.querySelectorAll('.expertise-card, .project-item').forEach(card => {
  card.classList.add('spotlight-card');
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// Inicializar Particles.js
if (window.particlesJS) {
  particlesJS('particles-js', {
    "particles": {
      "number": { "value": 100, "density": { "enable": true, "value_area": 800 } },
      "color": { "value": "#FF2A4D" },
      "shape": { "type": "circle" },
      "opacity": { "value": 0.8, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0.3, "sync": false } },
      "size": { "value": 4, "random": true, "anim": { "enable": false } },
      "line_linked": { "enable": true, "distance": 150, "color": "#FF2A4D", "opacity": 0.6, "width": 1.5 },
      "move": { "enable": true, "speed": 2.0, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": { "enable": true, "mode": "grab" },
        "onclick": { "enable": true, "mode": "push" },
        "resize": true
      },
      "modes": {
        "grab": { "distance": 140, "line_linked": { "opacity": 0.8 } },
        "push": { "particles_nb": 4 }
      }
    },
    "retina_detect": true
  });
}

/* =========================================
   SERVICE WORKER REGISTRATION (PWA)
   ========================================= */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

/* =========================================
   PWA INSTALL BUTTON LOGIC
   ========================================= */
let deferredPrompt;
const installBtn = document.getElementById('installPwaBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  if (installBtn) {
    installBtn.classList.remove('d-none');
  }
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    // Hide the app provided install promotion
    installBtn.classList.add('d-none');
    // Show the install prompt
    if (deferredPrompt) {
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      // We've used the prompt, and can't use it again, throw it away
      deferredPrompt = null;
    }
  });
}

window.addEventListener('appinstalled', () => {
  // Hide the app-provided install promotion
  if (installBtn) {
    installBtn.classList.add('d-none');
  }
  // Clear the deferredPrompt so it can be garbage collected
  deferredPrompt = null;
  console.log('PWA was installed');
});
