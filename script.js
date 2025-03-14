/**
 * IMPORTANT:
 * – Ensure your HTML preload tags are correctly set up. For example:
 *   <link rel="preload" as="image" href="images/leafBanner/—Pngtree—falling green leaves_5629857.webp">
 * – Remove any extra spaces in your URLs.
 */

// -------------------------
// HELPER: PRELOAD IMAGES FUNCTION
// -------------------------
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

// -------------------------
// HANDLE PAGE SHOW (for bfcache)
// -------------------------
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    initHeroSection();
  }
});

// -------------------------
// PRELOAD X TIMELINES
// -------------------------
function preloadXTimelines() {
  if (window.twttr && window.twttr.widgets) {
    twttr.widgets.load().then(() => {
      const wrappers = document.querySelectorAll('.twitter-timeline-wrapper');
      wrappers.forEach(wrapper => {
        if (!wrapper.classList.contains('tw-parsed')) {
          wrapper.classList.add('tw-parsed');
        }
      });
      console.log("X Timelines preloaded and initialized.");
    }).catch(err => {
      console.error("Error preloading X timelines:", err);
    });
  } else {
    setTimeout(preloadXTimelines, 100);
  }
}
preloadXTimelines();

// -------------------------
// PRELOAD SUB-PAGE ASSETS
// -------------------------
const subPageImages = [
  './images/universalBanner/Solar-drone-photo-Perth.webp',
  './images/Green,Blue,Orange-sectionsInPpackages/green.webp',
  './images/Green,Blue,Orange-sectionsInPpackages/blue.webp',
  './images/Green,Blue,Orange-sectionsInPpackages/orange.webp'
];
window.addEventListener('load', () => {
  preloadImages(subPageImages).catch(err => console.error(err));
});

// -------------------------
// HELPER: GET HERO DIMENSIONS (responsive sizing)
// -------------------------
function getHeroDimensions() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  // Dimensions for the primary hero image
  const solarek = { width: 5000, height: 3500 };
  // Different dimensions for the falling leaves image based on device
  const leaves = isMobile 
    ? { width: 4200, height: 3700 }
    : { width: 6500, height: 4500 };
  return { solarek, leaves, isMobile };
}

// -------------------------
// HERO SECTION INITIALIZATION
// -------------------------
function initHeroSection() {
  const heroSection = document.querySelector('.hero-section');
  const heroCanvas = document.querySelector('#hero-canvas');
  
  if (!heroSection) {
    console.error("Hero section (.hero-section) not found in DOM.");
    return;
  }
  if (!heroCanvas) {
    console.error("Canvas (#hero-canvas) not found in DOM.");
    return;
  }
  if (typeof THREE === 'undefined') {
    console.error("Three.js library not loaded. Check CDN or network.");
    return;
  }
  if (typeof gsap === 'undefined') {
    console.error("GSAP library not loaded. Check CDN or network.");
    return;
  }
  if (typeof ScrollSmoother === 'undefined') {
    console.warn("ScrollSmoother not loaded. Proceeding without smooth scrolling.");
  }
  
  let { solarek, leaves } = getHeroDimensions();
  const heroImagePaths = [
    './images/AboutUs/solarek.webp',
    './images/leafBanner/—Pngtree—falling green leaves_5629857.webp'
  ];
  
  // Preload hero images before initializing the Three.js scene
  preloadImages(heroImagePaths).then(() => {
    if (typeof ScrollSmoother !== 'undefined') {
      gsap.registerPlugin(ScrollSmoother);
      ScrollSmoother.create({
        smooth: 1,
        effects: true,
      });
    } else {
      console.log("Running parallax without ScrollSmoother.");
    }
    
    // Setup Three.js scene, camera, and renderer
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
    
    // Create plane geometry and materials for each image
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
    
    // Helper function to update plane scales based on viewport dimensions
    const scaleDivider = 4000;
    function updatePlaneScales() {
      const dims = getHeroDimensions();
      firstPlane.scale.set(dims.solarek.width / scaleDivider, dims.solarek.height / scaleDivider, 1);
      secondPlane.scale.set(dims.leaves.width / scaleDivider, dims.leaves.height / scaleDivider, 1);
    }
    updatePlaneScales();
    
    // Set initial positions and add to scene
    firstPlane.position.set(0, 0, -1);
    secondPlane.position.set(0, 0, 0);
    scene.add(firstPlane, secondPlane);
    
    // Parallax and rotation intensities for scroll effect
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
    
    // Update renderer and scales on window resize
    window.addEventListener('resize', () => {
      const newCanvasHeight = window.innerHeight * 1.3;
      renderer.setSize(window.innerWidth, newCanvasHeight);
      camera.aspect = window.innerWidth / newCanvasHeight;
      camera.updateProjectionMatrix();
      updatePlaneScales();
    });
  }).catch(() => {
    console.error("Preloading failed for one or more hero images, but proceeding with initialization.");
  });
}

// -------------------------
// MAIN INITIALIZATION
// -------------------------
document.addEventListener('DOMContentLoaded', () => {
  initHeroSection();

  // Initialize and reveal Twitter timelines
  function initXTimelines() {
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load(document.body).then(() => {
        const wrappers = document.querySelectorAll('.twitter-timeline-wrapper');
        wrappers.forEach(wrapper => {
          wrapper.classList.add('revealed');
        });
        console.log("X Timelines successfully loaded and revealed.");
      }).catch(err => {
        console.error("Error loading X timelines:", err);
      });
    } else {
      console.log("Twitter widgets not ready, retrying...");
      setTimeout(initXTimelines, 500);
    }
  }
  
  // Use both DOMContentLoaded and load events to ensure timelines are initialized
  document.addEventListener('DOMContentLoaded', initXTimelines);
  window.addEventListener('load', () => {
    if (!document.querySelector('.twitter-timeline-wrapper.revealed')) {
      initXTimelines();
    }
  });
  
  // -------------------------
  // GENERAL SCROLL & TOUCH HANDLING
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
    const sectionTop = buildSolarSection.offsetTop;
    const sectionHeight = buildSolarSection.clientHeight;
    if (scrollY > sectionTop + sectionHeight || scrollY < sectionTop) return;
    const progress = (scrollY - sectionTop) / sectionHeight;
    const parallaxY = progress * sectionHeight * 0.25;
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
  // REVEAL FUNCTIONS FOR VARIOUS SECTIONS
  // -------------------------
  function revealXTimelines() {
    const timelines = document.querySelectorAll('.twitter-timeline-wrapper');
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
          product.style.transform = 'translateX(0)';
        }, delay * 200);
      } else {
        product.classList.remove('revealed');
        product.style.transform = (revealDirection === 'right') ? 'translateX(50px)' : 'translateX(-50px)';
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
  window.addEventListener('scroll', revealXTimelines);
  window.addEventListener('load', revealXTimelines);
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
        revealXTimelines();
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
    revealXTimelines();
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
  // NAVIGATION DROPDOWN & TOGGLER HANDLING
  // -------------------------
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
  
  // -------------------------
  // NAVIGATION DROPDOWN EVENT HANDLERS
  // -------------------------
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
