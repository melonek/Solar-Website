(function () {
  // -------------------------
  // FACEBOOK SDK LOADING
  // -------------------------
  function loadFacebookSDK() {
    if (!document.getElementById('fb-sdk-script')) {
      let fbRoot = document.getElementById('fb-root');
      if (!fbRoot) {
        fbRoot = document.createElement('div');
        fbRoot.id = 'fb-root';
        document.body.appendChild(fbRoot);
      }
      const fbScript = document.createElement('script');
      fbScript.id = 'fb-sdk-script';
      fbScript.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v22.0&appId=1426450195430892';
      fbScript.async = true;
      fbScript.defer = true;
      document.body.appendChild(fbScript);
    }
  }

  window.fbAsyncInit = function () {
    FB.init({
      appId: '1426450195430892',
      xfbml: true,
      version: 'v22.0'
    });
    console.log('FB SDK initialized via fbAsyncInit');
    scaleFacebookTimelines(); // Ensure timelines scale after SDK loads
  };

  // -------------------------
  // SERVICE WORKER REGISTRATION
  // -------------------------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('Service Worker registered with scope:', registration.scope))
        .catch(error => console.error('Service Worker registration failed:', error));
    });
  }

  // -------------------------
  // HELPER FUNCTIONS
  // -------------------------
  function preloadImages(imageArray) {
    return Promise.all(
      imageArray.map(src => new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = () => reject(new Error('Failed to load image: ' + src));
      }))
    );
  }

  // Debounce function for performance
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function scaleFacebookTimelines() {
    const containers = document.querySelectorAll('.timeline-container');
    containers.forEach(container => {
      const scaler = container.querySelector('.scaler');
      const fbPage = container.querySelector('.fb-page');
      if (scaler && fbPage) {
        const rawWidth = container.clientWidth;
        console.log("Raw container width:", rawWidth);
        if (rawWidth < 100) {
          setTimeout(scaleFacebookTimelines, 200);
          return;
        }
        const containerWidth = rawWidth - 40;
        const defaultWidth = 500, defaultHeight = 600;
        let scale = containerWidth / defaultWidth;
        console.log(`Computed scale: ${scale} (containerWidth: ${containerWidth}, defaultWidth: ${defaultWidth})`);
        scaler.style.transform = `scale(${scale})`;
        scaler.style.transformOrigin = 'top left';
        scaler.style.width = `${defaultWidth}px`;
        scaler.style.height = `${defaultHeight}px`;
        fbPage.style.width = `${defaultWidth}px`;
        fbPage.style.height = `${defaultHeight}px`;
        container.style.height = `${defaultHeight * scale + 40}px`;
      } else {
        console.warn('Scaler or fb-page not found in:', container);
      }
    });
  }
  window.addEventListener('resize', debounce(scaleFacebookTimelines, 100));

  // -------------------------
  // MODERN LOADING BAR
  // -------------------------
  function initModernLoading() {
    const images = document.images;
    const totalImages = images.length;
    let loadedImages = 0;
    const progressBar = document.querySelector('.loading-bar');
    const percentageText = document.getElementById('loading-percentage');
    const loadingScreen = document.getElementById('loading-screen');

    function updateProgress(percent) {
      progressBar.style.width = percent + '%';
      percentageText.textContent = percent + '%';
    }

    function finishLoading() {
      // Small delay so the user sees 100%
      setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          initPage();
        }, 500);
      }, 300);
    }

    function incrementCounter() {
      loadedImages++;
      const percent = Math.round((loadedImages / totalImages) * 100);
      updateProgress(percent);
      if (loadedImages === totalImages) finishLoading();
    }

    if (totalImages === 0) {
      updateProgress(100);
      finishLoading();
    } else {
      for (let i = 0; i < totalImages; i++) {
        const img = images[i];
        if (img.complete) {
          incrementCounter();
        } else {
          img.addEventListener('load', incrementCounter, false);
          img.addEventListener('error', incrementCounter, false);
        }
      }
    }
  }

  // -------------------------
  // HERO SECTION INITIALIZATION
  // -------------------------
  function getHeroDimensions() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const solarek = { width: 5000, height: 3500 };
    const leaves = isMobile ? { width: 4200, height: 3700 } : { width: 6500, height: 4500 };
    return { solarek, leaves, isMobile };
  }

  async function initHeroSection() {
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

    let { solarek, leaves } = getHeroDimensions();
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
    try {
      const [firstImageTexture, secondImageTexture] = await Promise.all([
        textureLoader.loadAsync('https://naturespark.com.au/images/AboutUs/solarek.webp'),
        textureLoader.loadAsync('https://naturespark.com.au/images/leafBanner/leaf.webp')
      ]);

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

      window.addEventListener('resize', debounce(() => {
        const newCanvasHeight = window.innerHeight * 1.3;
        renderer.setSize(window.innerWidth, newCanvasHeight);
        camera.aspect = window.innerWidth / newCanvasHeight;
        camera.updateProjectionMatrix();
        updatePlaneScales();
      }, 100));
    } catch (err) {
      console.error('Error loading hero textures:', err);
    }
  }

  // -------------------------
  // UI & NAVIGATION INITIALIZATION
  // -------------------------
  function initUI() {
    // Build Solar Section Parallax
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
    window.addEventListener('scroll', debounce(() => {
      if (Math.abs(window.scrollY - lastScrollBuild) > 2) {
        requestAnimationFrame(updateParallaxBuild);
        lastScrollBuild = window.scrollY;
      }
    }, 50));

    // Reveal Functions for UI elements
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
            product.style.transform = 'translate(0)';
          }, delay * 200);
        } else {
          product.classList.remove('revealed');
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
    window.addEventListener('scroll', debounce(handleScroll, 50), { passive: true });

    function initAll() {
      revealButtons();
      revealCards();
      revealArticles();
      revealUniqueServices();
      revealLearnCards();
      revealFacebookTimelines();
    }
    window.addEventListener('load', initAll);

    // Navigation and mobile menu handling
    let isScrolling = false, isTouching = false;
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
  }

  // -------------------------
  // CONSOLIDATED PAGE INITIALIZATION
  // -------------------------
  function initPage() {
    initHeroSection();
    initUI();
    loadFacebookSDK();
  }

  // -------------------------
  // DOMContentLoaded HANDLER
  // -------------------------
  document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');

    if (localStorage.getItem('loadingScreenShown')) {
      if (loadingOverlay) loadingOverlay.style.display = 'none';
      if (mainContent) {
        mainContent.classList.remove('hidden');
        mainContent.style.display = 'block';
      }
      initPage();
    } else {
      initModernLoading();
      localStorage.setItem('loadingScreenShown', 'true');
    }
  });

  // -------------------------
  // HANDLE PAGESHOW (for bfcache)
  // -------------------------
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      initHeroSection();
    }
  });

  // -------------------------
  // PRELOAD SUB-PAGE ASSETS
  // -------------------------
  const subPageImages = [
    'https://naturespark.com.au/images/universalBanner/Solar-drone-photo-Perth.webp',
    'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/green.webp',
    'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/blue.webp',
    'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/orange.webp'
  ];
  window.addEventListener('load', () => {
    preloadImages(subPageImages).catch(err => console.error(err));
  });
})();