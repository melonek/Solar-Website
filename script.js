/**
 * script.js
 *
 * This file contains your main JavaScript functions:
 * - Preloading images
 * - Loading animation with pixelated text and loading bar
 * - Initializing the Three.js hero canvas and parallax effects
 * - Facebook timeline helpers
 * - Various UI event handlers
 */

// Register service worker if supported.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('Service Worker registered with scope:', registration.scope))
      .catch(error => console.error('Service Worker registration failed:', error));
  });
}

/* ------------------------- Helper Functions ------------------------- */

function preloadImages(imageArray) {
  return Promise.all(
    imageArray.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = () => reject(new Error('Failed to load image: ' + src));
      });
    })
  );
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

/* ------------------------- Loading Animation ------------------------- */

function startLoadingAnimation(callback) {
  const canvas = document.getElementById('loading-canvas');
  if (!canvas) {
    console.error("Loading canvas (#loading-canvas) not found.");
    if (callback) callback();
    return;
  }
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Animation parameters (durations, offscreen canvases, etc.)
  // … (Your existing loading animation code goes here.)
  // When the animation is complete:
  const loadingOverlay = document.getElementById('loading-screen');
  if (loadingOverlay) {
    loadingOverlay.style.display = "none";
  }
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.classList.remove('hidden');
    mainContent.style.display = "block";
  }
  if (callback) callback();
}

/* ------------------------- Facebook Timeline Helpers ------------------------- */

// This function parses any FB timeline wrappers.
function preloadFBTimelines() {
  const wrappers = document.querySelectorAll('.fb-page-wrapper');
  wrappers.forEach(wrapper => {
    if (typeof FB !== 'undefined' && !wrapper.classList.contains('fb-parsed')) {
      FB.XFBML.parse(wrapper);
      wrapper.classList.add('fb-parsed', 'revealed');
    }
  });
}

/* ------------------------- Hero Section Initialization ------------------------- */

function initHeroSection() {
  const heroSection = document.querySelector('.hero-section');
  const heroCanvas = document.getElementById('hero-canvas');
  if (!heroSection || !heroCanvas) {
    console.error("Hero section or canvas not found in DOM.");
    return;
  }
  if (typeof THREE === 'undefined' || typeof gsap === 'undefined') {
    console.error("Required libraries (Three.js or GSAP) are not loaded.");
    return;
  }

  let solarek = { width: 5000, height: 3500 };
  let leaves = window.matchMedia('(max-width: 768px)').matches
    ? { width: 4200, height: 3700 }
    : { width: 6500, height: 4500 };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, antialias: true });
  renderer.setClearColor(0x000000);
  const canvasHeight = window.innerHeight * 1.3;
  renderer.setSize(window.innerWidth, canvasHeight);
  camera.aspect = window.innerWidth / canvasHeight;
  camera.updateProjectionMatrix();
  camera.position.z = 5;

  const textureLoader = new THREE.TextureLoader();
  const firstImageTexture = textureLoader.load(
    'https://naturespark.com.au/images/AboutUs/solarek.webp',
    () => console.log('First image loaded successfully'),
    undefined,
    err => console.error('Error loading first image:', err)
  );
  const secondImageTexture = textureLoader.load(
    'https://naturespark.com.au/images/leafBanner/leaf.webp',
    () => console.log('Second image loaded successfully'),
    undefined,
    err => console.error('Error loading second image:', err)
  );

  const planeWidth = 20;
  const planeHeight = 20 * (solarek.height / solarek.width);
  const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
  const firstMaterial = new THREE.MeshBasicMaterial({ 
    map: firstImageTexture,
    transparent: true,
    side: THREE.DoubleSide
  });
  const secondMaterial = new THREE.MeshBasicMaterial({ 
    map: secondImageTexture,
    transparent: true,
    side: THREE.DoubleSide
  });
  const firstPlane = new THREE.Mesh(geometry, firstMaterial);
  const secondPlane = new THREE.Mesh(geometry, secondMaterial);

  const scaleDivider = 4000;
  function updatePlaneScales() {
    firstPlane.scale.set(solarek.width / scaleDivider, solarek.height / scaleDivider, 1);
    secondPlane.scale.set(leaves.width / scaleDivider, leaves.height / scaleDivider, 1);
  }
  updatePlaneScales();

  firstPlane.position.set(0, 0, -1);
  secondPlane.position.set(0, 0, 0);
  scene.add(firstPlane, secondPlane);

  function animateParallax() {
    requestAnimationFrame(animateParallax);
    const scrollY = window.scrollY;
    const sectionTop = heroSection.offsetTop;
    const sectionHeight = heroSection.clientHeight;
    if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight) {
      const progress = (scrollY - sectionTop) / sectionHeight;
      firstPlane.position.y = -progress * 0.25 * sectionHeight / 100;
      secondPlane.position.y = -progress * 0.15 * sectionHeight / 100;
      secondPlane.rotation.z = -progress * 0.3;
    }
    renderer.render(scene, camera);
  }
  animateParallax();

  window.addEventListener('resize', () => {
    const newCanvasHeight = window.innerHeight * 1.3;
    renderer.setSize(window.innerWidth, newCanvasHeight);
    camera.aspect = window.innerWidth / newCanvasHeight;
    camera.updateProjectionMatrix();
    updatePlaneScales();
  });
}

/* -------------------------
   MAIN INITIALIZATION (Hero Section)
------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  startLoadingAnimation(initHeroSection);
});

// -------------------------
// SECOND INITIALIZATION BLOCK (UI, Scroll, Navigation, etc.)
// -------------------------
document.addEventListener('DOMContentLoaded', () => {
  function scaleFacebookTimelines() {
    const containers = document.querySelectorAll('.timeline-container');
    containers.forEach(container => {
      const scaler = container.querySelector('.scaler');
      const fbPage = container.querySelector('.fb-page');
      if (scaler && fbPage) {
        const containerWidth = container.clientWidth - 40;
        const defaultWidth = 500, defaultHeight = 600;
        const scale = containerWidth / defaultWidth;
        scaler.style.transform = `scale(${scale})`;
        scaler.style.transformOrigin = 'top left';
        scaler.style.width = `${defaultWidth}px`;
        scaler.style.height = `${defaultHeight}px`;
        fbPage.style.width = `${defaultWidth}px`;
        fbPage.style.height = `${defaultHeight}px`;
        container.style.height = `${defaultHeight * scale + 40}px`;
      }
    });
  }
  window.addEventListener('resize', scaleFacebookTimelines);
  scaleFacebookTimelines();
  
  // -------------------------
  // CONSOLIDATED INIT & EVENT HANDLERS
  // -------------------------
  let isScrolling = false, isTouching = false;
  window.addEventListener('scroll', () => {
    isScrolling = true;
    setTimeout(() => { isScrolling = false; }, 200);
  });
  
  // -------------------------
  // BUILD SOLAR SECTION PARALLAX
  // -------------------------
  const buildSolarSection = document.getElementById('build-solar');
  const buildSolarVideo = document.querySelector('.build-solar-video video');
  let lastScrollBuild = 0;
  function updateParallaxBuild() {
    const scrollY = window.scrollY;
    if (!buildSolarSection) return;
    const sectionTop = buildSolarSection.offsetTop,
          sectionHeight = buildSolarSection.clientHeight;
    if (scrollY > sectionTop + sectionHeight || scrollY < sectionTop) return;
    const progress = (scrollY - sectionTop) / sectionHeight,
          parallaxY = progress * sectionHeight * 0.25;
    if (buildSolarVideo) {
      buildSolarVideo.style.transform = `translate(-50%, calc(-50% + ${parallaxY}px))`;
    }
    requestAnimationFrame(updateParallaxBuild);
  }
  window.addEventListener('scroll', () => {
    if (Math.abs(window.scrollY - lastScrollBuild) > 2) {
      requestAnimationFrame(updateParallaxBuild);
      lastScrollBuild = window.scrollY;
    }
  });
  
  // -------------------------
  // REVEAL FUNCTIONS
  // -------------------------
  function revealFacebookTimelines() {
    const timelines = document.querySelectorAll('.fb-page-wrapper');
    const triggerBottom = window.innerHeight * 0.8;
    timelines.forEach(timeline => {
      const timelineTop = timeline.getBoundingClientRect().top;
      if (timelineTop < triggerBottom) {
        timeline.classList.add('revealed');
      } else {
        timeline.classList.remove('revealed');
      }
    });
  }
  
  function revealButtons() {
    const buttons = document.querySelectorAll('.fancy-button');
    const triggerBottom = window.innerHeight * 0.8;
    buttons.forEach(button => {
      const buttonTop = button.getBoundingClientRect().top;
      button.classList.toggle('revealed', buttonTop < triggerBottom);
    });
  }
  window.addEventListener('scroll', revealButtons);
  window.addEventListener('load', revealButtons);
  
  function revealCards() {
    const cards = document.querySelectorAll('.brand-card');
    const triggerBottom = window.innerHeight * 0.9;
    cards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      card.classList.toggle('active', cardTop < triggerBottom);
    });
  }
  
  function revealArticles() {
    const articles = document.querySelectorAll('.article-card');
    const triggerBottom = window.innerHeight * 0.8;
    articles.forEach((article, index) => {
      const articleTop = article.getBoundingClientRect().top;
      if (articleTop < triggerBottom) {
        setTimeout(() => { article.classList.add('revealed'); }, index * 200);
      } else {
        article.classList.remove('revealed');
      }
    });
  }
  
  function revealLearnCards() {
    const learnCards = document.querySelectorAll('.learn-card');
    const triggerBottom = window.innerHeight * 0.8;
    learnCards.forEach((card, index) => {
      const cardTop = card.getBoundingClientRect().top;
      if (cardTop < triggerBottom) {
        setTimeout(() => { card.classList.add('revealed'); }, index * 300);
      } else {
        card.classList.remove('revealed');
      }
    });
  }
  
  function revealUniqueServices() {
    const products = document.querySelectorAll('#unique-services .unique-service-product');
    const triggerBottom = window.innerHeight * 0.8;
    products.forEach(product => {
      const productTop = product.getBoundingClientRect().top;
      const revealDirection = product.getAttribute('data-reveal-direction');
      const delay = parseFloat(product.getAttribute('data-reveal-delay')) || 0;
      if (productTop < triggerBottom) {
        setTimeout(() => {
          product.classList.add('revealed');
          // Reset transform regardless of direction when revealed.
          product.style.transform = 'translate(0)';
        }, delay * 200);
      } else {
        product.classList.remove('revealed');
        // Apply the correct transform based on the reveal direction.
        if (revealDirection === 'right') {
          product.style.transform = 'translateX(50px)';
        } else if (revealDirection === 'left') {
          product.style.transform = 'translateX(-50px)';
        } else if (revealDirection === 'bottom') {
          product.style.transform = 'translateY(50px)';
        }
      }
    });
  }
  
  
  function revealProductSections() {
    const sections = document.querySelectorAll('.panels-grid .product, .inverters-grid .product, .battery-grid .product');
    const triggerBottom = window.innerHeight * 0.8;
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      section.classList.toggle('revealed', sectionTop < triggerBottom);
    });
  }
  window.addEventListener('scroll', revealProductSections);
  window.addEventListener('scroll', revealFacebookTimelines);
  window.addEventListener('load', revealFacebookTimelines);
  revealProductSections();
  
  let lastCall = 0, scrollTimeout;
  function handleScroll() {
    const now = Date.now();
    if (now - lastCall < 100) return;
    lastCall = now;
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        revealButtons();
        revealCards();
        revealArticles();
        revealUniqueServices();
        revealLearnCards();
      });
    }, 100);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  function initAll() {
    revealButtons();
    revealCards();
    revealArticles();
    revealUniqueServices();
    revealLearnCards();
    revealFacebookTimelines();
    if (typeof preloadFBTimelines === 'function') preloadFBTimelines();
  }
  window.addEventListener('load', initAll);
  
  document.querySelectorAll('.fancy-button').forEach(button => {
    button.addEventListener('click', function(event) {
      if (isScrolling || isTouching) {
        event.preventDefault();
        return false;
      }
      const url = this.getAttribute('href');
      if (this.classList.contains('mirror-left')) {
        event.preventDefault();
        setTimeout(() => {
          window.open(url, '_blank', 'noopener,noreferrer');
        }, 100);
      } else {
        window.location.href = url;
      }
    });
    button.addEventListener('touchstart', () => { isTouching = true; });
    button.addEventListener('touchend', function(event) {
      isTouching = false;
      event.preventDefault();
      this.click();
    }, { passive: false });
  });
  
  document.querySelectorAll('.savings-btn, .build-button').forEach(button => {
    button.addEventListener('click', function(event) {
      if (isScrolling || isTouching) {
        event.preventDefault();
        return false;
      }
      const url = this.getAttribute('href');
      if (url) {
        if (this.classList.contains('mirror-left')) {
          event.preventDefault();
          setTimeout(() => {
            window.open(url, '_blank', 'noopener,noreferrer');
          }, 100);
        } else {
          window.location.href = url;
        }
      }
    });
  });
  
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  
  function toggleHrefs() {
    document.querySelectorAll('.dropdown > a:not(.dropbtn)').forEach(toggle => {
      const href = toggle.getAttribute('href');
      if (href && href.endsWith("#unique-services")) return;
      if (mediaQuery.matches) {
        toggle.dataset.originalHref = href;
        toggle.href = 'javascript:void(0);';
      } else if (toggle.dataset.originalHref) {
        toggle.href = toggle.dataset.originalHref;
      }
    });
  }
  toggleHrefs();
  
  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });
  }
  
  document.querySelectorAll('.dropdown > .dropbtn').forEach(dropbtn => {
    dropbtn.addEventListener('click', function(e) {
      if (mediaQuery.matches) {
        e.preventDefault();
        e.stopPropagation();
        return;
      } else {
        e.preventDefault();
        e.stopPropagation();
        const dropdown = this.parentElement;
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        const isActive = dropdownContent.classList.contains('active');
        closeAllDropdowns();
        navLinks.classList.remove('active');
        if (!isActive) {
          dropdownContent.classList.add('active');
          dropdown.classList.add('active');
        }
      }
    });
    dropbtn.addEventListener('touchend', function(e) {
      if (mediaQuery.matches) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    });
  });
  
  document.querySelectorAll('.dropdown > a').forEach(link => {
    link.addEventListener('click', function(e) {
      if (!mediaQuery.matches) return;
      e.preventDefault();
      e.stopPropagation();
      const dropdown = this.parentElement;
      const dropdownContent = dropdown.querySelector('.dropdown-content');
      const isActive = dropdownContent.classList.contains('active');
      closeAllDropdowns();
      navLinks.classList.remove('active');
      if (!isActive) {
        dropdownContent.classList.add('active');
        dropdown.classList.add('active');
      }
    });
  });
  
  window.addEventListener('scroll', () => {
    if (mediaQuery.matches && navLinks.classList.contains('active')) {
      closeAllDropdowns();
      navLinks.classList.remove('active');
      mobileMenu.classList.remove('open');
    }
  });
  
  document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', () => {
      if (mediaQuery.matches) {
        closeAllDropdowns();
        navLinks.classList.remove('active');
      }
    });
  });
  
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-links')) {
      closeAllDropdowns();
      navLinks.classList.remove('active');
    }
  });
  
  window.addEventListener('resize', () => {
    if (!mediaQuery.matches) {
      closeAllDropdowns();
      navLinks.classList.remove('active');
    }
  });
  
  function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-content, .dropdown').forEach(element => {
      element.classList.remove('active');
    });
  }
});
