(function () {
  // Expose initPage globally
  window.initPage = initPage;

  // -------------------------
  // HELPER: Debounce Function
  // -------------------------
  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // -------------------------
  // HELPER: Throttle Function
  // -------------------------
  function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function (...args) {
      const context = this;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

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
      fbScript.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v22.0&appId=1403351067527439';
      fbScript.async = true;
      fbScript.defer = true;
      fbScript.onload = () => console.log('Facebook SDK script loaded');
      document.body.appendChild(fbScript);
    }
  }

window.fbAsyncInit = function () {
  FB.init({
    appId: '1403351067527439',
    xfbml: true,
    version: 'v22.0'
  });
  console.log('FB SDK initialized via fbAsyncInit');
  const timelineContainer = document.getElementById('social-timelines');
  if (timelineContainer) {
    FB.XFBML.parse(timelineContainer, () => {
      console.log('Facebook timelines rendered successfully');
      // Delay the scaling function by 2 seconds (2000 ms)
      setTimeout(scaleFacebookTimelines, 2000);
    });
  }
};


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

  function scaleFacebookTimelines() {
    const containers = document.querySelectorAll('.timeline-container');
    containers.forEach(container => {
      const fbPage = container.querySelector('.fb-page');
      if (fbPage) {
        const containerWidth = container.clientWidth - 40;
        // Ensure fbPage has the attribute that is safe to change
        if (fbPage.getAttribute('data-width') !== containerWidth) {
          fbPage.setAttribute('data-width', containerWidth);
          // Optionally, re-parse the container only if necessary
          if (window.FB && typeof FB.XFBML.parse === 'function') {
            FB.XFBML.parse(container);
          }
        }
      } else {
        console.warn('Facebook page element not found in container:', container);
      }
    });
  }
  

  // -------------------------
  // HERO SECTION INITIALIZATION
  // -------------------------
  async function initHeroSection() {
    const heroSection = document.querySelector('.hero-section');
    const heroCanvas = document.querySelector('#hero-canvas');
    if (!heroSection || !heroCanvas || typeof THREE === 'undefined' || typeof gsap === 'undefined') {
      console.error('Hero section initialization failed: missing elements or libraries');
      return;
    }

    let { solarek, leaves } = getHeroDimensions();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, antialias: true });
    renderer.setClearColor(0x000000);
    const canvasHeight = window.innerHeight * 1.3;
    renderer.setSize(window.innerWidth, canvasHeight);
    camera.position.z = 5;

    const textureLoader = new THREE.TextureLoader();
    let firstImageTexture, secondImageTexture;
    try {
      [firstImageTexture, secondImageTexture] = await Promise.all([
        textureLoader.loadAsync('https://naturespark.com.au/images/AboutUs/solarek.webp'),
        textureLoader.loadAsync('https://naturespark.com.au/images/leafBanner/leaf.webp')
      ]);
    } catch (err) {
      console.error('Error loading hero textures:', err);
      return;
    }

    const planeWidth = 20;
    const planeHeight = 20 * (solarek.height / solarek.width);
    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
    const firstMaterial = new THREE.MeshBasicMaterial({ map: firstImageTexture, transparent: true, side: THREE.DoubleSide });
    const secondMaterial = new THREE.MeshBasicMaterial({ map: secondImageTexture, transparent: true, side: THREE.DoubleSide });
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
        firstPlane.position.y = -(progress * parallaxIntensityFirst * sectionHeight) / 100;
        secondPlane.position.y = -(progress * parallaxIntensitySecond * sectionHeight) / 100;
        secondPlane.rotation.z = -progress * rotationIntensity;
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
  }

  function getHeroDimensions() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const solarek = { width: 5000, height: 3500 };
    const leaves = isMobile ? { width: 4200, height: 3700 } : { width: 6500, height: 4500 };
    return { solarek, leaves };
  }

  // -------------------------
  // GLOBAL INTERSECTION OBSERVER & REVEAL FUNCTIONS
  // -------------------------
  const revealTimeouts = new Map();
  const observerOptions = { threshold: 0.2 };
  const globalRevealObserver = new IntersectionObserver(revealCallback, observerOptions);

  function revealCallback(entries) {
    entries.forEach(entry => {
      const delay = parseFloat(entry.target.getAttribute('data-reveal-delay')) || 0;
      if (entry.isIntersecting) {
        const timeoutId = setTimeout(() => {
          if (entry.target.classList.contains('unique-service-product')) {
            entry.target.style.transform = 'translate(0)';
          }
          entry.target.classList.add(entry.target.classList.contains('brand-card') ? 'active' : 'revealed');
        }, delay * 200);
        revealTimeouts.set(entry.target, timeoutId);
      } else {
        clearTimeout(revealTimeouts.get(entry.target));
        revealTimeouts.delete(entry.target);
        entry.target.classList.remove(entry.target.classList.contains('brand-card') ? 'active' : 'revealed');
        if (entry.target.classList.contains('unique-service-product')) {
          const revealDirection = entry.target.getAttribute('data-reveal-direction');
          if (revealDirection === 'right') entry.target.style.transform = 'translateX(50px)';
          else if (revealDirection === 'left') entry.target.style.transform = 'translateX(-50px)';
          else if (revealDirection === 'bottom') entry.target.style.transform = 'translateY(50px)';
        }
      }
    });
  }

  function observeElements(selector) {
    document.querySelectorAll(selector).forEach((el, index) => {
      if (!el.hasAttribute('data-reveal-delay')) {
        el.setAttribute('data-reveal-delay', index);
      }
      globalRevealObserver.observe(el);
    });
  }

function initArticlesMutationObserver() {
  const articlesGrid = document.getElementById('articles-grid');
  if (!articlesGrid) return;
  const mutationObserver = new MutationObserver(mutations =>
    mutations.forEach(mutation =>
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && (node.matches('.article-card') || node.querySelector('.article-card'))) {
          observeElements('.article-card');
        }
      })
    )
  );
  mutationObserver.observe(articlesGrid, { childList: true, subtree: true });
}

  function setupRevealObservers() {
    observeElements('.fancy-button');
    observeElements('.brand-card');
    observeElements('.article-card');
    observeElements('.learn-card');
    observeElements('#unique-services .unique-service-product');
    initArticlesMutationObserver();
  }

  // -------------------------
  // REVEAL FUNCTIONS (GLOBAL SCOPE)
  // -------------------------
  function revealFacebookTimelines() {
    const timelines = document.querySelectorAll('.fb-page-wrapper');
    const triggerBottom = window.innerHeight * 0.8;
    timelines.forEach(timeline => {
      timeline.classList.toggle('revealed', timeline.getBoundingClientRect().top < triggerBottom);
    });
  }

  function revealProductSections() {
    const sections = document.querySelectorAll('.panels-grid .product, .inverters-grid .product, .battery-grid .product');
    const triggerBottom = window.innerHeight * 0.8;
    sections.forEach(section => {
      section.classList.toggle('revealed', section.getBoundingClientRect().top < triggerBottom);
    });
  }

  const throttledReveal = throttle(() => {
    revealFacebookTimelines();
    revealProductSections();
  }, 100);

  window.addEventListener('scroll', throttledReveal, { passive: true });
  window.addEventListener('load', () => {
    revealFacebookTimelines();
    revealProductSections();
  });
  revealFacebookTimelines(); // Restore initial call
  revealProductSections();   // Restore initial call

  // -------------------------
  // UI & NAVIGATION INITIALIZATION
  // -------------------------
  function initUI() {
    document.addEventListener('DOMContentLoaded', () => {
      const brandContainer = document.querySelector('#brands') || document.querySelector('.brand-container');
      if (brandContainer) {
        const brands = [
          { src: 'https://naturespark.com.au/images/brands/logo1.png', alt: 'Brand 1' },
          { src: 'https://naturespark.com.au/images/brands/logo2.png', alt: 'Brand 2' },
        ];
        brands.forEach((brand, index) => {
          const brandCard = document.createElement('div');
          brandCard.className = 'brand-card';
          brandCard.setAttribute('data-reveal-delay', index * 0.2);
          const img = document.createElement('img');
          img.src = brand.src;
          img.alt = brand.alt;
          img.onerror = () => console.error(`Failed to load brand logo: ${brand.src}`);
          brandCard.appendChild(img);
          brandContainer.appendChild(brandCard);
        });
      }

      const buildSolarSection = document.getElementById('build-solar');
      const buildSolarVideo = document.querySelector('.build-solar-video video');
      let lastScrollBuild = 0;
      function updateParallaxBuild() {
        const scrollY = window.scrollY;
        if (!buildSolarSection) return;
        const sectionTop = buildSolarSection.offsetTop,
              sectionHeight = buildSolarSection.clientHeight;
        if (scrollY <= sectionTop + sectionHeight && scrollY >= sectionTop) {
          const progress = (scrollY - sectionTop) / sectionHeight;
          if (buildSolarVideo) {
            buildSolarVideo.style.transform = `translate(-50%, calc(-50% + ${progress * sectionHeight * 0.25}px))`;
          }
        }
        requestAnimationFrame(updateParallaxBuild);
      }
      window.addEventListener('scroll', () => {
        if (Math.abs(window.scrollY - lastScrollBuild) > 2) {
          requestAnimationFrame(updateParallaxBuild);
          lastScrollBuild = window.scrollY;
        }
      });

      document.querySelectorAll('.fancy-button, .savings-btn, .build-button').forEach(button => {
        button.addEventListener('click', function(event) {
          if (isScrolling || isTouching) {
            event.preventDefault();
            return;
          }
          const url = this.getAttribute('href');
          if (this.classList.contains('mirror-left')) {
            event.preventDefault();
            setTimeout(() => window.open(url, '_blank', 'noopener,noreferrer'), 100);
          } else if (url) {
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

      document.querySelectorAll('.dropdown > .dropbtn').forEach(dropbtn => {
        dropbtn.addEventListener('click', function(e) {
          if (!mediaQuery.matches) {
            e.preventDefault();
            e.stopPropagation();
            const dropdown = this.parentElement;
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            const isActive = dropdownContent.classList.contains('active');
            closeAllDropdowns();
            if (!isActive) {
              dropdownContent.classList.add('active');
              dropdown.classList.add('active');
            }
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
          dropdownContent.classList.toggle('active', !isActive);
          dropdown.classList.toggle('active', !isActive);
        });
      });

      window.addEventListener('scroll', () => {
        const navLinks = document.querySelector('.nav-links');
        if (mediaQuery.matches && navLinks.classList.contains('active')) {
          closeAllDropdowns();
          navLinks.classList.remove('active');
        }
      });

      document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', () => {
          if (mediaQuery.matches) {
            closeAllDropdowns();
            document.querySelector('.nav-links').classList.remove('active');
          }
        });
      });

      document.addEventListener('click', e => {
        const navLinks = document.querySelector('.nav-links');
        if (!e.target.closest('.nav-links')) {
          closeAllDropdowns();
          navLinks.classList.remove('active');
        }
      });

      window.addEventListener('resize', () => {
        toggleHrefs();
        if (!mediaQuery.matches) {
          closeAllDropdowns();
          document.querySelector('.nav-links').classList.remove('active');
        }
      });

      function closeAllDropdowns() {
        document.querySelectorAll('.dropdown-content, .dropdown').forEach(element => {
          element.classList.remove('active');
        });
      }

      function initNavigationObserver() {
        const navContainer = document.querySelector('nav') || document.body;
        const observer = new MutationObserver(() => {
          toggleHrefs();
          observer.disconnect();
        });
        observer.observe(navContainer, { childList: true, subtree: true });
      }
      initNavigationObserver();

      function initProductMutationObserver() {
        const productContainers = document.querySelectorAll('.panels-grid, .inverters-grid, .battery-grid');
        if (!productContainers.length) return;
        const observer = new MutationObserver(revealProductSections);
        productContainers.forEach(container => observer.observe(container, { childList: true, subtree: true }));
      }
      initProductMutationObserver();
    }, { once: true });
  }

  // -------------------------
  // MOBILE MENU TOGGLE SETUP
  // -------------------------
  function setupMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    if (mobileMenu && navLinks) {
      mobileMenu.addEventListener('click', e => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('open');
      });

      document.addEventListener('click', e => {
        if (mediaQuery.matches && navLinks.classList.contains('active') && !e.target.closest('.nav-links') && !e.target.closest('#mobile-menu')) {
          navLinks.classList.remove('active');
          mobileMenu.classList.remove('open');
        }
      });

      document.querySelectorAll('.dropdown-content a, .nav-links a').forEach(link => {
        link.addEventListener('click', () => {
          if (mediaQuery.matches && link.getAttribute('href')?.startsWith('#')) {
            navLinks.classList.remove('active');
            mobileMenu.classList.remove('open');
          }
        });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', setupMobileMenu);

  // -------------------------
  // CONSOLIDATED PAGE INITIALIZATION
  // -------------------------
  function initPage() {
    if (document.querySelector('.hero-section')) initHeroSection();
    initUI();
    loadFacebookSDK();
    setupRevealObservers();

    const brandImages = [
      { name: 'Trina', url: 'https://naturespark.com.au/images/BrandLogos/Trina-Solar.webp' },
      { name: 'SMA', url: 'https://naturespark.com.au/images/BrandLogos/SMA.webp' },
      { name: 'Canadian Solar', url: 'https://naturespark.com.au/images/BrandLogos/Canadian-Solar.webp' },
      { name: 'DaSolar', url: 'https://naturespark.com.au/images/BrandLogos/DaSolar.webp' },
      { name: 'Fronius', url: 'https://naturespark.com.au/images/BrandLogos/Fronius.webp' },
      { name: 'Growatt', url: 'https://naturespark.com.au/images/BrandLogos/Growatt.webp' },
      { name: 'Huawei/iStore', url: 'https://naturespark.com.au/images/BrandLogos/Huawei.webp' },
      { name: 'JASolar', url: 'https://naturespark.com.au/images/BrandLogos/JASolar.webp' },
      { name: 'Goodwe', url: 'https://naturespark.com.au/images/BrandLogos/Goodwe.webp' },
      { name: 'Jinko', url: 'https://naturespark.com.au/images/BrandLogos/Jinko.webp' },
      { name: 'Longi', url: 'https://naturespark.com.au/images/BrandLogos/Longi.webp' },
      { name: 'Risen', url: 'https://naturespark.com.au/images/BrandLogos/Risen-Solar.webp' },
      { name: 'Seraphim', url: 'https://naturespark.com.au/images/BrandLogos/Seraphim.webp' },
      { name: 'Sofar', url: 'https://naturespark.com.au/images/BrandLogos/Sofar.webp' },
      { name: 'SolarEdge', url: 'https://naturespark.com.au/images/BrandLogos/Solar-Edge.webp' },
      { name: 'Solis', url: 'https://naturespark.com.au/images/BrandLogos/Solis.webp' },
      { name: 'Sungrow', url: 'https://naturespark.com.au/images/BrandLogos/Sungrow.webp' },
      { name: 'EgingPV', url: 'https://naturespark.com.au/images/BrandLogos/EgingPV.webp' },
      { name: 'QCells', url: 'https://naturespark.com.au/images/BrandLogos/QCells.webp' },
      { name: 'Tesla', url: 'https://naturespark.com.au/images/BrandLogos/Tesla.webp' }
    ];

    function initializeBrandSlider(cardSelector, containerSelector) {
      const cards = document.querySelectorAll(cardSelector);
      if (!cards.length) return;

      let currentStartIndex = 0;
      const batchSize = 4;

      function updateCards() {
        cards.forEach((card, i) => {
          const imgIndex = (currentStartIndex + i) % brandImages.length;
          const brand = brandImages[imgIndex];
          const imgEl = card.querySelector('img');
          if (imgEl) {
            card.classList.remove('active');
            setTimeout(() => {
              imgEl.src = brand.url;
              imgEl.alt = brand.name;
              card.classList.add('active');
            }, 50);
          }
        });
      }

      updateCards();
      let intervalId = setInterval(() => {
        currentStartIndex = (currentStartIndex + batchSize) % brandImages.length;
        updateCards();
      }, 5000);

      const container = document.querySelector(containerSelector);
      if (container) {
        container.addEventListener('mouseenter', () => clearInterval(intervalId));
        container.addEventListener('mouseleave', () => {
          intervalId = setInterval(() => {
            currentStartIndex = (currentStartIndex + batchSize) % brandImages.length;
            updateCards();
          }, 5000);
        });
      }
    }

    initializeBrandSlider('.brand-card', '#brands');

    setTimeout(() => {
      document.querySelectorAll('.article-card').forEach((el, i) => {
        el.setAttribute('data-reveal-delay', i * 0.1);
        globalRevealObserver.observe(el);
      });
    }, 500);
  }

  const subPageImages = [
    'https://naturespark.com.au/images/universalBanner/Solar-drone-photo-Perth.webp',
    'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/green.webp',
    'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/blue.webp',
    'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/orange.webp'
  ];
  window.addEventListener('load', () => preloadImages(subPageImages).catch(err => console.error(err)));

  let isScrolling = false, isTouching = false;
})();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

