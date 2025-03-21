(function () {
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
      fbScript.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v22.0&appId=1426450195430892';
      fbScript.async = true;
      fbScript.defer = true;
      fbScript.onload = () => console.log('Facebook SDK script loaded');
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
    FB.XFBML.parse(document.getElementById('social-timelines'), () => {
      console.log('Facebook timelines rendered successfully');
      scaleFacebookTimelines();
    });
  };
  
  // Override console.error to filter Facebook-specific errors
  const originalConsoleError = console.error;
  console.error = function (...args) {
    if (typeof args[0] === 'string' && args[0].includes('N_K8-X0_Ici.js')) {
      return; // Silently ignore
    }
    originalConsoleError.apply(console, args);
  };

  // -------------------------
  // SERVICE WORKER REGISTRATION
  // -------------------------
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
        const containerWidth = container.clientWidth - 40; // Adjust for padding/margins
        console.log(`Setting fb-page width to ${containerWidth}px`);
        fbPage.setAttribute('data-width', containerWidth);
        // Re-parse the widget to apply the new width
        if (window.FB) {
          FB.XFBML.parse(container);
        }
      } else {
        console.warn('fb-page not found in:', container);
      }
    });
  }
  
  // Debounce resize events
// Increase debounce delay to reduce frequent calls
window.addEventListener('resize', debounce(scaleFacebookTimelines, 200)); // Was 50ms, now 200ms

  // -------------------------
  // MODERN LOADING BAR
  // -------------------------
  function initModernLoading() {
    const criticalImages = Array.from(document.images).filter(img =>
      !img.hasAttribute('loading') || img.getAttribute('loading') !== 'lazy'
    );
    const totalImages = criticalImages.length;
    let loadedImages = 0;
    const progressBar = document.querySelector('.loading-bar');
    const percentageText = document.getElementById('loading-percentage');
    const loadingScreen = document.getElementById('loading-screen');

    function updateProgress(percent) {
      progressBar.style.width = percent + '%';
      percentageText.textContent = percent + '%';
    }

    function finishLoading() {
      setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.classList.remove('hidden');
            mainContent.style.display = 'block';
          }
          initPage();
        }, 500); // Matches CSS transition duration
      }, 300);
    }

    // Fallback to ensure loading screen hides after 2 seconds
    setTimeout(() => {
      if (!loadingScreen.classList.contains('fade-out')) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.classList.remove('hidden');
            mainContent.style.display = 'block';
          }
          initPage();
        }, 500);
      }
    }, 2000);

    if (totalImages === 0) {
      updateProgress(100);
      finishLoading();
    } else {
      setTimeout(() => {
        finishLoading();
      }, 5000);

      criticalImages.forEach(img => {
        if (img.complete) {
          loadedImages++;
          const percent = Math.round((loadedImages / totalImages) * 100);
          updateProgress(percent);
          if (loadedImages === totalImages) finishLoading();
        } else {
          img.addEventListener('load', () => {
            loadedImages++;
            const percent = Math.round((loadedImages / totalImages) * 100);
            updateProgress(percent);
            if (loadedImages === totalImages) finishLoading();
          }, false);
          img.addEventListener('error', () => {
            loadedImages++;
            const percent = Math.round((loadedImages / totalImages) * 100);
            updateProgress(percent);
            if (loadedImages === totalImages) finishLoading();
          }, false);
        }
      });
    }
  }

  // -------------------------
  // HERO SECTION INITIALIZATION
  // -------------------------
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
    let firstImageTexture, secondImageTexture;
    try {
      [firstImageTexture, secondImageTexture] = await Promise.all([
        textureLoader.loadAsync('https://naturespark.com.au/images/AboutUs/solarek.webp'),
        textureLoader.loadAsync('https://naturespark.com.au/images/leafBanner/leaf.webp')
      ]);
      console.log('Hero textures loaded successfully');
    } catch (err) {
      console.error('Error loading hero textures:', err);
      return;
    }

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
  }

  function getHeroDimensions() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const solarek = { width: 5000, height: 3500 };
    const leaves = isMobile ? { width: 4200, height: 3700 } : { width: 6500, height: 4500 };
    return { solarek, leaves, isMobile };
  }

  // -------------------------
  // GLOBAL INTERSECTION OBSERVER & REVEAL FUNCTIONS
  // -------------------------
  const revealTimeouts = new Map();
  const observerOptions = { threshold: 0.2 };

  function revealCallback(entries, observer) {
    entries.forEach(entry => {
      const delay = parseFloat(entry.target.getAttribute('data-reveal-delay')) || 0;
      if (entry.isIntersecting) {
        if (revealTimeouts.has(entry.target)) {
          clearTimeout(revealTimeouts.get(entry.target));
        }
        const timeoutId = setTimeout(() => {
          if (entry.target.classList.contains('unique-service-product')) {
            entry.target.style.transform = 'translate(0)';
          }
          entry.target.classList.add(entry.target.classList.contains('brand-card') ? 'active' : 'revealed');
        }, delay * 200);
        revealTimeouts.set(entry.target, timeoutId);
      } else {
        if (revealTimeouts.has(entry.target)) {
          clearTimeout(revealTimeouts.get(entry.target));
          revealTimeouts.delete(entry.target);
        }
        entry.target.classList.remove(entry.target.classList.contains('brand-card') ? 'active' : 'revealed');
        if (entry.target.classList.contains('unique-service-product')) {
          const revealDirection = entry.target.getAttribute('data-reveal-direction');
          if (revealDirection === 'right') {
            entry.target.style.transform = 'translateX(50px)';
          } else if (revealDirection === 'left') {
            entry.target.style.transform = 'translateX(-50px)';
          } else if (revealDirection === 'bottom') {
            entry.target.style.transform = 'translateY(50px)';
          }
        }
      }
    });
  }

  const globalRevealObserver = new IntersectionObserver(revealCallback, observerOptions);

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
    const config = { childList: true, subtree: true };
    const mutationCallback = (mutationsList) => {
      mutationsList.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches('.article-card')) {
              observeNewElement(node);
            } else {
              node.querySelectorAll('.article-card').forEach(observeNewElement);
            }
          }
        });
      });
    };
    const mutationObserver = new MutationObserver(mutationCallback);
    mutationObserver.observe(articlesGrid, config);
  }

  function observeNewElement(node) {
    if (!node.hasAttribute('data-reveal-delay')) {
      node.setAttribute('data-reveal-delay', 0);
    }
    globalRevealObserver.observe(node);
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
      const timelineTop = timeline.getBoundingClientRect().top;
      if (timelineTop < triggerBottom) {
        timeline.classList.add('revealed');
      } else {
        timeline.classList.remove('revealed');
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

  const throttledReveal = throttle(() => {
    revealFacebookTimelines();
    revealProductSections();
  }, 100);

  window.addEventListener('scroll', throttledReveal, { passive: true });
  window.addEventListener('load', () => {
    revealFacebookTimelines();
    revealProductSections();
  });
  revealProductSections(); // Initial call

  // -------------------------
  // UI & NAVIGATION INITIALIZATION
  // -------------------------
  function initUI() {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('initUI: DOMContentLoaded fired');

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
        console.log('Brand logos appended:', brands.length);
      } else {
        console.warn('Brand container not found');
      }

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
            const navLinks = document.querySelector('.nav-links');
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
          document.querySelectorAll('.dropdown-content').forEach(content => {
            if (content !== dropdownContent) content.classList.remove('active');
          });
          document.querySelectorAll('.dropdown').forEach(d => {
            if (d !== dropdown) d.classList.remove('active');
          });
          if (!isActive) {
            dropdownContent.classList.add('active');
            dropdown.classList.add('active');
            console.log('Dropdown toggled on mobile');
          } else {
            dropdownContent.classList.remove('active');
            dropdown.classList.remove('active');
          }
        });
      });

      window.addEventListener('scroll', () => {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenu = document.getElementById('mobile-menu');
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
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.remove('active');
          }
        });
      });

      document.addEventListener('click', function(e) {
        const navLinks = document.querySelector('.nav-links');
        if (!e.target.closest('.nav-links')) {
          closeAllDropdowns();
          navLinks.classList.remove('active');
        }
      });

      window.addEventListener('resize', () => {
        toggleHrefs();
        const navLinks = document.querySelector('.nav-links');
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

      function initNavigationObserver() {
        const navContainer = document.querySelector('nav') || document.body;
        const observer = new MutationObserver(() => {
          toggleHrefs();
          document.querySelectorAll('.dropdown > a').forEach(link => {
            link.addEventListener('click', function(e) {
              if (!mediaQuery.matches) return;
              e.preventDefault();
              e.stopPropagation();
              const dropdown = this.parentElement;
              const dropdownContent = dropdown.querySelector('.dropdown-content');
              const isActive = dropdownContent.classList.contains('active');
              document.querySelectorAll('.dropdown-content').forEach(content => {
                if (content !== dropdownContent) content.classList.remove('active');
              });
              document.querySelectorAll('.dropdown').forEach(d => {
                if (d !== dropdown) d.classList.remove('active');
              });
              if (!isActive) {
                dropdownContent.classList.add('active');
                dropdown.classList.add('active');
              } else {
                dropdownContent.classList.remove('active');
                dropdown.classList.remove('active');
              }
            });
          });
          console.log('Navigation updated dynamically');
          observer.disconnect();
        });
        observer.observe(navContainer, { childList: true, subtree: true });
      }
      initNavigationObserver();

      function initProductMutationObserver() {
        const productContainers = document.querySelectorAll('.panels-grid, .inverters-grid, .battery-grid');
        if (!productContainers.length) return;
        const config = { childList: true, subtree: true };
        const mutationCallback = () => {
          revealProductSections();
          console.log('Product sections updated dynamically');
        };
        productContainers.forEach(container => {
          const observer = new MutationObserver(mutationCallback);
          observer.observe(container, config);
        });
      }
      initProductMutationObserver();
    }, { once: true });
  }

  // -------------------------
  // MOBILE MENU TOGGLE SETUP
  // -------------------------
  // -------------------------
  // MOBILE MENU TOGGLE SETUP
  // -------------------------
  function setupMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    if (mobileMenu && navLinks) {
      // Toggle menu on click
      mobileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        console.log('Mobile menu toggled');
      });

      // Close menu when clicking outside on mobile
      document.addEventListener('click', (e) => {
        if (mediaQuery.matches && navLinks.classList.contains('active')) {
          if (!e.target.closest('.nav-links') && !e.target.closest('#mobile-menu')) {
            navLinks.classList.remove('active');
            mobileMenu.classList.remove('open');
            console.log('Mobile menu closed due to outside click');
          }
        }
      });

      // Handle dropdown links for same-page redirects on mobile
      document.querySelectorAll('.dropdown-content a, .nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
          if (mediaQuery.matches) {
            const href = link.getAttribute('href');
            // Check if it's an anchor link (starts with #)
            if (href && href.startsWith('#')) {
              navLinks.classList.remove('active');
              mobileMenu.classList.remove('open');
              console.log('Mobile menu closed due to same-page redirect:', href);
            }
          }
        });
      });
    } else {
      console.warn('Mobile menu or nav links not found:', { mobileMenu, navLinks });
    }
  }

  // Attach mobile menu listener as soon as DOM is ready
  document.addEventListener('DOMContentLoaded', setupMobileMenu);

  // Attach mobile menu listener as soon as DOM is ready
  document.addEventListener('DOMContentLoaded', setupMobileMenu);

  // -------------------------
  // CONSOLIDATED PAGE INITIALIZATION
  // -------------------------
  function initPage() {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && typeof initHeroSection === 'function') {
      initHeroSection();
    }
    if (typeof initUI === 'function') {
      initUI();
    }
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
      console.log('Initializing brand slider...');
      const cards = document.querySelectorAll(cardSelector);
      console.log('Found', cards.length, 'brand cards');
      if (!cards.length) {
        console.error('No brand cards found with selector:', cardSelector);
        return;
      }

      let currentStartIndex = 0;
      const batchSize = 4;

      function updateCards() {
        console.log('Updating brand cards with start index:', currentStartIndex);
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
              console.log(`Set card ${i} img src to ${brand.url}`);
            }, 50);
          } else {
            console.warn('No img element found in card:', card);
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
        container.addEventListener('mouseenter', () => {
          clearInterval(intervalId);
          console.log('Brand slider paused');
        });
        container.addEventListener('mouseleave', () => {
          intervalId = setInterval(() => {
            currentStartIndex = (currentStartIndex + batchSize) % brandImages.length;
            updateCards();
          }, 5000);
          console.log('Brand slider resumed');
        });
      } else {
        console.warn('Container not found:', containerSelector);
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

  // INITIAL LOADING HANDLERS
  window.addEventListener('load', () => {
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

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        initHeroSection();
      } else {
        console.warn("pageshow: No hero section found; skipping initHeroSection.");
      }
    }
  });

  const subPageImages = [
    'https://naturespark.com.au/images/universalBanner/Solar-drone-photo-Perth.webp',
    'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/green.webp',
    'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/blue.webp',
    'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/orange.webp'
  ];
  window.addEventListener('load', () => {
    preloadImages(subPageImages).catch(err => console.error(err));
  });

  // Define globals used in event handlers
  let isScrolling = false, isTouching = false;
})();