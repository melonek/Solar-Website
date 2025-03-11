// ===================== HELPER FUNCTIONS =====================

// Promise‑based image preloader (for critical assets and sub‑page assets)
function preloadImages(imagePaths) {
  return Promise.all(
    imagePaths.map(url =>
      new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          console.log(`Preloaded image: ${url}`);
          resolve();
        };
        img.onerror = () => {
          console.error(`Failed to preload image: ${url}`);
          resolve(); // Resolve even on error so initialization isn’t blocked
        };
      })
    )
  );
}

// ===================== PRELOAD SUB-PAGE ASSETS =====================
const subPageImages = [
  './images/universalBanner/Solar-drone-photo-Perth.webp',
  './images/Green,Blue,Orange-sectionsInPpackages/green.webp',
  './images/Green,Blue,Orange-sectionsInPpackages/blue.webp',
  './images/Green,Blue,Orange-sectionsInPpackages/orange.webp'
];
window.addEventListener('load', () => {
  preloadImages(subPageImages);
});

// ===================== MAIN INITIALIZATION =====================
document.addEventListener('DOMContentLoaded', () => {
  // -------------------------
  // HERO SECTION PARALLAX WITH THREE.JS AND GSAP (WITH PRELOADING AND 130VH HEIGHT)
  // -------------------------
  const heroSection = document.querySelector('.hero-section');
  const heroCanvas = document.querySelector('#hero-canvas');
  
  if (!heroSection) console.error("Hero section (.hero-section) not found in DOM.");
  if (!heroCanvas) console.error("Canvas (#hero-canvas) not found in DOM.");
  if (typeof THREE === 'undefined') console.error("Three.js library not loaded. Check CDN or network.");
  if (typeof gsap === 'undefined') console.error("GSAP library not loaded. Check CDN or network.");
  if (typeof ScrollSmoother === 'undefined') console.warn("ScrollSmoother not loaded. Proceeding without smooth scrolling.");
  
  const heroImagePaths = [
    './images/AboutUs/solarek.webp',
    './images/leafBanner/—Pngtree—falling green leaves_5629857.webp'
  ];
  
  if (heroSection && heroCanvas && typeof THREE !== 'undefined' && typeof gsap !== 'undefined') {
    preloadImages(heroImagePaths).then(() => {
      // Register ScrollSmoother if available
      if (typeof ScrollSmoother !== 'undefined') {
        gsap.registerPlugin(ScrollSmoother);
        ScrollSmoother.create({
          smooth: 1,
          effects: true,
        });
      } else {
        console.log("Running parallax without ScrollSmoother.");
      }
      
      // Three.js Scene Setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, antialias: true });
      
      // Set clear color to black so the canvas background isn’t gray
      renderer.setClearColor(0x000000);
      
      // Set canvas size to 130vh
      const canvasHeight = window.innerHeight * 1.3;
      renderer.setSize(window.innerWidth, canvasHeight);
      camera.aspect = window.innerWidth / canvasHeight;
      camera.updateProjectionMatrix();
      camera.position.z = 5;
      
      // Load textures (should be instant because of preloading)
      const textureLoader = new THREE.TextureLoader();
      const firstImageTexture = textureLoader.load(
        './images/AboutUs/solarek.webp',
        () => console.log('First image loaded successfully'),
        undefined,
        (err) => console.error('Error loading first image:', err)
      );
      const secondImageTexture = textureLoader.load(
        './images/leafBanner/—Pngtree—falling green leaves_5629857.webp',
        () => console.log('Second image loaded successfully'),
        undefined,
        (err) => console.error('Error loading second image:', err)
      );
      
      // Image dimensions (in pixels)
      const firstImageWidth = 5000, firstImageHeight = 3500;
      const secondImageWidth = 6500, secondImageHeight = 4500;
      
      // Create planes with fixed size to overflow viewport
      const planeWidth = 20;
      const planeHeight = 20 * (firstImageHeight / firstImageWidth);
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
      
      // Scale planes to match desired dimensions (without downscaling)
      firstPlane.scale.set(firstImageWidth / 4000, firstImageHeight / 4000, 1);
      secondPlane.scale.set(secondImageWidth / 4000, secondImageHeight / 4000, 1);
      
      // Position planes (first behind, second in front)
      firstPlane.position.set(0, 0, -1);
      secondPlane.position.set(0, 0, 0);
      scene.add(firstPlane, secondPlane);
      
      // Parallax settings
      const parallaxIntensityFirst = 0.25;
      const parallaxIntensitySecond = 0.15;
      const rotationIntensity = 0.3;
      
      function animateParallax() {
        requestAnimationFrame(animateParallax);
        const scrollY = window.scrollY;
        const sectionTop = heroSection.offsetTop;
        const sectionHeight = heroSection.clientHeight;
        
        if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight) {
          const progress = (scrollY - sectionTop) / sectionHeight;
          const parallaxYFirst = progress * parallaxIntensityFirst * sectionHeight;
          const parallaxYSecond = progress * parallaxIntensitySecond * sectionHeight;
          const rotation = -progress * rotationIntensity;
          
          firstPlane.position.y = -parallaxYFirst / 100;
          secondPlane.position.y = -parallaxYSecond / 100;
          secondPlane.rotation.z = rotation;
        }
        renderer.render(scene, camera);
      }
      animateParallax();
      
      window.addEventListener('resize', () => {
        const newCanvasHeight = window.innerHeight * 1.3;
        renderer.setSize(window.innerWidth, newCanvasHeight);
        camera.aspect = window.innerWidth / newCanvasHeight;
        camera.updateProjectionMatrix();
      });
    }).catch(() => {
      console.error("Preloading failed for one or more hero images, but proceeding with initialization.");
    });
  } else {
    console.error("Initialization failed for hero section. Check console for errors and ensure CDN scripts are loaded correctly.");
  }
  
  // -------------------------
  // FACEBOOK SDK INITIALIZATION & TIMELINE PRELOAD
  // -------------------------
  window.fbAsyncInit = function() {
    FB.init({
      appId: '1426450195430892',
      xfbml: true,
      version: 'v22.0'
    });
    preloadFBTimelines();
  };
  
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v22.0&appId=1426450195430892';
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
  
  function preloadFBTimelines() {
    const wrappers = document.querySelectorAll('.fb-page-wrapper');
    wrappers.forEach(wrapper => {
      if (typeof FB !== 'undefined' && !wrapper.classList.contains('fb-parsed')) {
        FB.XFBML.parse(wrapper);
        wrapper.classList.add('fb-parsed', 'revealed');
      }
    });
  }
  
  function updateFBTimeline(container) {
    if (container && typeof FB !== 'undefined') {
      FB.XFBML.parse(container);
    } else {
      console.error("Container not found or FB is not defined.");
    }
  }
  
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
    const buttons = document.querySelectorAll('.fancy-button'),
          triggerBottom = window.innerHeight * 0.8;
    buttons.forEach(button => {
      const buttonTop = button.getBoundingClientRect().top;
      button.classList.toggle('revealed', buttonTop < triggerBottom);
    });
  }
  window.addEventListener('scroll', revealButtons);
  window.addEventListener('load', revealButtons);
  
  function revealCards() {
    const cards = document.querySelectorAll('.brand-card'),
          triggerBottom = window.innerHeight * 0.9;
    cards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      card.classList.toggle('active', cardTop < triggerBottom);
    });
  }
  
  function revealArticles() {
    const articles = document.querySelectorAll('.article-card'),
          triggerBottom = window.innerHeight * 0.8;
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
    const learnCards = document.querySelectorAll('.learn-card'),
          triggerBottom = window.innerHeight * 0.8;
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
    const products = document.querySelectorAll('#unique-services .unique-service-product'),
          triggerBottom = window.innerHeight * 0.8;
    products.forEach(product => {
      const productTop = product.getBoundingClientRect().top,
            revealDirection = product.getAttribute('data-reveal-direction'),
            delay = parseFloat(product.getAttribute('data-reveal-delay')) || 0;
      if (productTop < triggerBottom) {
        setTimeout(() => {
          product.classList.add('revealed');
          product.style.transform = 'translateX(0)';
        }, delay * 200);
      } else {
        product.classList.remove('revealed');
        product.style.transform = (revealDirection === 'right') ? 'translateX(50px)' : 'translateX(-50px)';
      }
    });
  }
  
  function revealProductSections() {
    const sections = document.querySelectorAll('.panels-grid .product, .inverters-grid .product, .battery-grid .product'),
          triggerBottom = window.innerHeight * 0.8;
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      section.classList.toggle('revealed', sectionTop < triggerBottom);
    });
  }
  window.addEventListener('scroll', revealProductSections);
  revealFacebookTimelines();
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
    if (typeof preloadFBTimelines === 'function') preloadFBTimelines();
  }
  window.addEventListener('load', initAll);
  
  // -------------------------
  // BUTTON CLICK HANDLERS
  // -------------------------
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
  
  // -------------------------
  // NAVIGATION DROPDOWN & TOGGLER
  // -------------------------
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  
  function toggleHrefs() {
    document.querySelectorAll('.dropdown > a').forEach(toggle => {
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
  
  // -------------------------
  // NAVIGATION DROPDOWN HANDLERS
  // -------------------------
  document.querySelectorAll('.dropdown > .dropbtn').forEach(dropbtn => {
    dropbtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const dropdown = this.parentElement;
      const dropdownContent = dropdown.querySelector('.dropdown-content');
      const isActive = dropdownContent.classList.contains('active');
      // Close all dropdowns before toggling this one.
      closeAllDropdowns();
      navLinks.classList.remove('active');
      if (!isActive) {
        dropdownContent.classList.add('active');
        dropdown.classList.add('active');
      }
    });
  });
  
  // For dropdowns that are still links:
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
