// -------------------------
// FACEBOOK SDK INITIALIZATION & TIMELINE PRELOAD
// -------------------------
window.fbAsyncInit = function() {
  FB.init({
    appId: '1426450195430892',  // Your Facebook App ID
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

// Re-render Facebook timelines when needed
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
      const defaultWidth = 500;
      const defaultHeight = 600;
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

// Attach event listeners for scaling timelines
window.addEventListener('resize', scaleFacebookTimelines);
document.addEventListener('DOMContentLoaded', scaleFacebookTimelines);

// -------------------------
// CONSOLIDATED INIT & EVENT HANDLERS
// -------------------------
document.addEventListener('DOMContentLoaded', () => {
  let isScrolling = false;
  let isTouching = false;
  window.addEventListener('scroll', () => {
    isScrolling = true;
    setTimeout(() => { isScrolling = false; }, 200);
  });

  // -------------------------
  // HERO SECTION PARALLAX WITH THREE.JS AND GSAP (WITH PRELOADING AND 130VH HEIGHT)
  // -------------------------
  const heroSection = document.querySelector('.hero-section');
  const heroCanvas = document.querySelector('#hero-canvas');

  // Check for DOM elements and libraries with specific diagnostics
  if (!heroSection) console.error("Hero section (.hero-section) not found in DOM.");
  if (!heroCanvas) console.error("Canvas (#hero-canvas) not found in DOM.");
  if (typeof THREE === 'undefined') console.error("Three.js library not loaded. Check CDN or network.");
  if (typeof gsap === 'undefined') console.error("GSAP library not loaded. Check CDN or network.");
  if (typeof ScrollSmoother === 'undefined') console.warn("ScrollSmoother not loaded. Proceeding without smooth scrolling. Check CDN or network.");

  // Preload images function
  function preloadImages(imagePaths) {
    return Promise.all(
      imagePaths.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = () => {
            console.log(`Preloaded image: ${url}`);
            resolve();
          };
          img.onerror = () => {
            console.error(`Failed to preload image: ${url}`);
            resolve(); // Resolve anyway to avoid blocking
          };
        });
      })
    );
  }

  // Image URLs
  const imagePaths = [
    './images/AboutUs/solarek.webp',
    './images/leafBanner/—Pngtree—falling green leaves_5629857.webp'
  ];

  // Preload images and then initialize Three.js
  if (heroSection && heroCanvas && typeof THREE !== 'undefined' && typeof gsap !== 'undefined') {
    preloadImages(imagePaths).then(() => {
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

      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, antialias: true });

      // Set canvas size to 130vh
      const canvasHeight = window.innerHeight * 1.3; // 130vh
      renderer.setSize(window.innerWidth, canvasHeight);
      camera.aspect = window.innerWidth / canvasHeight;
      camera.updateProjectionMatrix();
      camera.position.z = 5;

      // Load textures (preloaded, so these should be instant)
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

      // Image size controls (in pixels, adjust these to zoom in/out)
      const firstImageWidth = 5000;
      const firstImageHeight = 3500;
      const secondImageWidth = 6500;
      const secondImageHeight = 4500;

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

      // Scale planes to match pixel dimensions without downscaling
      firstPlane.scale.set(firstImageWidth / 4000, firstImageHeight / 4000, 1);
      secondPlane.scale.set(secondImageWidth / 4000, secondImageHeight / 4000, 1);

      // Position planes (second in front)
      firstPlane.position.set(0, 0, -1);
      secondPlane.position.set(0, 0, 0);
      scene.add(firstPlane, secondPlane);

      // Parallax and rotation intensities
      const parallaxIntensityFirst = 0.25;
      const parallaxIntensitySecond = 0.15;
      const rotationIntensity = 0.3;

      // Animation loop
      function animateParallax() {
        requestAnimationFrame(animateParallax);
        const scrollY = window.scrollY;
        const sectionTop = heroSection.offsetTop;
        const sectionHeight = heroSection.clientHeight;

        if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight) {
          const progress = (scrollY - sectionTop) / sectionHeight;
          const parallaxYFirst = progress * parallaxIntensityFirst * sectionHeight;
          const parallaxYSecond = progress * parallaxIntensitySecond * sectionHeight;
          const rotation = -progress * rotationIntensity; // Counterclockwise

          firstPlane.position.y = -parallaxYFirst / 100;
          secondPlane.position.y = -parallaxYSecond / 100;
          secondPlane.rotation.z = rotation;
        }

        renderer.render(scene, camera);
      }
      animateParallax();

      // Resize handler (update canvas to 150vh)
      window.addEventListener('resize', () => {
        const newCanvasHeight = window.innerHeight * 1.5; // 150vh
        renderer.setSize(window.innerWidth, newCanvasHeight);
        camera.aspect = window.innerWidth / newCanvasHeight;
        camera.updateProjectionMatrix();
      });
    }).catch(() => {
      console.error("Preloading failed for one or more images, but proceeding with initialization.");
    });
  } else {
    console.error("Initialization failed. Check console for specific errors and ensure CDN scripts are loaded correctly.");
  }

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
      if (href && href.endsWith("#unique-services")) {
        return;
      }
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

  document.querySelectorAll('.dropdown > a').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      if (!mediaQuery.matches) return;
      const href = this.getAttribute('href');
      if (href && href.endsWith("#unique-services")) {
        if (!this.dataset.toggledOnce) {
          e.preventDefault();
          e.stopPropagation();
          const dropdown = this.parentElement;
          const dropdownContent = dropdown.querySelector('.dropdown-content');
          closeAllDropdowns();
          navLinks.classList.remove('active');
          dropdownContent.classList.add('active');
          dropdown.classList.add('active');
          this.dataset.toggledOnce = "true";
          setTimeout(() => {
            delete this.dataset.toggledOnce;
          }, 2000);
        } else {
          delete this.dataset.toggledOnce;
          closeAllDropdowns();
          navLinks.classList.remove('active');
          window.location.href = this.getAttribute('href');
        }
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
    toggleHrefs();
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