(function () {
  // -------------------------
  // UTILITY FUNCTIONS
  // -------------------------
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const preloadImages = (imageArray) => Promise.all(
    imageArray.map(src => new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(src);
      img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    }))
  );

  // -------------------------
  // FACEBOOK SDK LOADING
  // -------------------------
  const loadFacebookSDK = () => {
    if (!document.getElementById('social-timelines') || document.getElementById('fb-sdk-script')) return;
    const fbRoot = document.createElement('div');
    fbRoot.id = 'fb-root';
    document.body.appendChild(fbRoot);
    const fbScript = document.createElement('script');
    fbScript.id = 'fb-sdk-script';
    fbScript.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v22.0&appId=1426450195430892';
    fbScript.async = fbScript.defer = true;
    document.body.appendChild(fbScript);
  };

  window.fbAsyncInit = () => {
    FB.init({ appId: '1426450195430892', xfbml: true, version: 'v22.0' });
    console.log('FB SDK initialized');
    scaleFacebookTimelines();
  };

  // -------------------------
  // SERVICE WORKER REGISTRATION
  // -------------------------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () =>
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker registered:', reg.scope))
        .catch(err => console.error('Service Worker failed:', err))
    );
  }

  // -------------------------
  // FACEBOOK TIMELINE SCALING
  // -------------------------
  const scaleFacebookTimelines = () => {
    const containers = document.querySelectorAll('.timeline-container');
    containers.forEach(container => {
      const scaler = container.querySelector('.scaler');
      const fbPage = container.querySelector('.fb-page');
      if (!scaler || !fbPage) return console.warn('Scaler or fb-page missing:', container);
      const containerWidth = Math.max(container.clientWidth - 40, 100);
      const defaultWidth = 500, defaultHeight = 600;
      const scale = containerWidth / defaultWidth;
      scaler.style.transform = `scale(${scale})`;
      scaler.style.transformOrigin = 'top left';
      scaler.style.width = `${defaultWidth}px`;
      scaler.style.height = `${defaultHeight}px`;
      fbPage.style.width = `${defaultWidth}px`;
      fbPage.style.height = `${defaultHeight}px`;
      container.style.height = `${defaultHeight * scale + 40}px`;
    });
  };

  // -------------------------
  // MODERN LOADING BAR
  // -------------------------
  const initModernLoading = () => {
    const progressBar = document.querySelector('.loading-bar');
    const percentageText = document.getElementById('loading-percentage');
    const loadingScreen = document.getElementById('loading-screen');
    const images = Array.from(document.querySelectorAll('img:not([loading="lazy"])'));
    let loadedImages = 0;

    const finishLoading = () => {
      progressBar.style.width = '100%';
      percentageText.textContent = '100%';
      setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          initPage();
        }, 500);
      }, 300);
    };

    if (!images.length) return finishLoading();
    images.forEach(img => {
      if (img.complete) {
        loadedImages++;
      } else {
        img.onload = () => {
          loadedImages++;
          const percent = Math.round((loadedImages / images.length) * 100);
          progressBar.style.width = `${percent}%`;
          percentageText.textContent = `${percent}%`;
          if (loadedImages === images.length) finishLoading();
        };
        img.onerror = () => loadedImages++; // Continue even if an image fails
      }
    });
    if (loadedImages === images.length) finishLoading();
  };

  // -------------------------
  // HERO SECTION INITIALIZATION
  // -------------------------
  const getHeroDimensions = () => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    return {
      solarek: { width: 5000, height: 3500 },
      leaves: isMobile ? { width: 4200, height: 3700 } : { width: 6500, height: 4500 }
    };
  };

  const initHeroSection = async () => {
    const heroSection = document.querySelector('.hero-section');
    const heroCanvas = document.getElementById('hero-canvas');
    if (!heroSection || !heroCanvas || !window.THREE || !window.gsap) {
      console.error('Hero section setup failed: missing elements or libraries');
      return;
    }

    const { solarek, leaves } = getHeroDimensions();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, antialias: true });
    renderer.setClearColor(0x000000);
    const canvasHeight = window.innerHeight * 1.3;
    renderer.setSize(window.innerWidth, canvasHeight);
    camera.position.z = 5;

    const textureLoader = new THREE.TextureLoader();
    try {
      const [firstImageTexture, secondImageTexture] = await Promise.all([
        textureLoader.loadAsync('https://naturespark.com.au/images/AboutUs/solarek.webp'),
        textureLoader.loadAsync('https://naturespark.com.au/images/leafBanner/leaf.webp')
      ]);

      const planeWidth = 20, planeHeight = 20 * (solarek.height / solarek.width);
      const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
      const firstMaterial = new THREE.MeshBasicMaterial({ map: firstImageTexture, transparent: true, side: THREE.DoubleSide });
      const secondMaterial = new THREE.MeshBasicMaterial({ map: secondImageTexture, transparent: true, side: THREE.DoubleSide });
      const firstPlane = new THREE.Mesh(geometry, firstMaterial);
      const secondPlane = new THREE.Mesh(geometry, secondMaterial);

      const scaleDivider = 4000;
      const updatePlaneScales = () => {
        firstPlane.scale.set(solarek.width / scaleDivider, solarek.height / scaleDivider, 1);
        secondPlane.scale.set(leaves.width / scaleDivider, leaves.height / scaleDivider, 1);
      };
      updatePlaneScales();

      firstPlane.position.set(0, 0, -1);
      secondPlane.position.set(0, 0, 0);
      scene.add(firstPlane, secondPlane);

      const parallaxIntensityFirst = 0.25, parallaxIntensitySecond = 0.15, rotationIntensity = 0.3;
      const animateParallax = () => {
        requestAnimationFrame(animateParallax);
        const scrollY = window.scrollY;
        const { offsetTop: sectionTop, clientHeight: sectionHeight } = heroSection;
        if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight) {
          const progress = (scrollY - sectionTop) / sectionHeight;
          firstPlane.position.y = -(progress * parallaxIntensityFirst * sectionHeight) / 100;
          secondPlane.position.y = -(progress * parallaxIntensitySecond * sectionHeight) / 100;
          secondPlane.rotation.z = -progress * rotationIntensity;
        }
        renderer.render(scene, camera);
      };
      animateParallax();

      window.addEventListener('resize', debounce(() => {
        const newCanvasHeight = window.innerHeight * 1.3;
        renderer.setSize(window.innerWidth, newCanvasHeight);
        camera.aspect = window.innerWidth / newCanvasHeight;
        camera.updateProjectionMatrix();
        updatePlaneScales();
      }, 100));
    } catch (err) {
      console.error('Hero texture loading failed:', err);
    }
  };

  // -------------------------
  // UI & NAVIGATION INITIALIZATION
  // -------------------------
  const initUI = () => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    let isScrolling = false, isTouching = false;

    // Parallax for Build Solar Section
    const buildSolarSection = document.getElementById('build-solar');
    const buildSolarVideo = document.querySelector('.build-solar-video video');
    let lastScrollBuild = 0;
    const updateParallaxBuild = () => {
      if (!buildSolarSection || !buildSolarVideo) return;
      const scrollY = window.scrollY;
      const { offsetTop: sectionTop, clientHeight: sectionHeight } = buildSolarSection;
      if (scrollY <= sectionTop + sectionHeight && scrollY >= sectionTop) {
        const progress = (scrollY - sectionTop) / sectionHeight;
        buildSolarVideo.style.transform = `translate(-50%, calc(-50% + ${progress * sectionHeight * 0.25}px))`;
      }
    };
    window.addEventListener('scroll', debounce(() => {
      if (Math.abs(window.scrollY - lastScrollBuild) > 2) {
        requestAnimationFrame(updateParallaxBuild);
        lastScrollBuild = window.scrollY;
      }
    }, 50));

    // Reveal Animations with IntersectionObserver
    const observerOptions = { threshold: 0.1 };
    const createObserver = (selector, className, delay = 0, toggle = false) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add(className);
              if (!toggle) observer.unobserve(entry.target);
            }, delay);
          } else if (toggle) {
            entry.target.classList.remove(className);
          }
        });
      }, observerOptions);
      document.querySelectorAll(selector).forEach(el => observer.observe(el));
    };
    createObserver('.fancy-button', 'revealed', 0, true);
    createObserver('.brand-card', 'active', 0, true);
    createObserver('.article-card', 'revealed', 200);
    createObserver('.learn-card', 'revealed', 300);
    createObserver('.fb-page-wrapper', 'revealed', 0, true);
    createObserver('.panels-grid .product, .inverters-grid .product, .battery-grid .product', 'revealed', 0, true);

    const uniqueServicesObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseFloat(entry.target.getAttribute('data-reveal-delay')) || 0;
          setTimeout(() => {
            entry.target.classList.add('revealed');
            entry.target.style.transform = 'translate(0)';
          }, delay * 200);
          uniqueServicesObserver.unobserve(entry.target);
        } else {
          const direction = entry.target.getAttribute('data-reveal-direction');
          entry.target.classList.remove('revealed');
          entry.target.style.transform = direction === 'right' ? 'translateX(50px)' :
                                        direction === 'left' ? 'translateX(-50px)' :
                                        direction === 'bottom' ? 'translateY(50px)' : '';
        }
      });
    }, observerOptions);
    document.querySelectorAll('#unique-services .unique-service-product').forEach(el => uniqueServicesObserver.observe(el));

    // Navigation Handling
    const handleButtonClick = (button, e) => {
      if (isScrolling || isTouching) {
        e.preventDefault();
        return;
      }
      const url = button.getAttribute('href');
      if (!url) return;
      if (button.classList.contains('mirror-left')) {
        e.preventDefault();
        setTimeout(() => window.open(url, '_blank', 'noopener,noreferrer'), 100);
      } else {
        window.location.href = url;
      }
    };
    document.querySelectorAll('.fancy-button, .savings-btn, .build-button').forEach(button => {
      button.addEventListener('click', e => handleButtonClick(button, e));
      button.addEventListener('touchstart', () => isTouching = true);
      button.addEventListener('touchend', e => {
        isTouching = false;
        e.preventDefault();
        button.click();
      }, { passive: false });
    });

    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenu && navLinks) {
      mobileMenu.addEventListener('click', e => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('open');
      });
    }

    const toggleHrefs = () => {
      document.querySelectorAll('.dropdown > a:not(.dropbtn)').forEach(toggle => {
        const href = toggle.getAttribute('href');
        if (href?.endsWith('#unique-services')) return;
        if (mediaQuery.matches) {
          toggle.dataset.originalHref = href;
          toggle.href = 'javascript:void(0);';
        } else if (toggle.dataset.originalHref) {
          toggle.href = toggle.dataset.originalHref;
        }
      });
    };
    toggleHrefs();
    mediaQuery.addEventListener('change', toggleHrefs);

    const closeAllDropdowns = () => {
      document.querySelectorAll('.dropdown-content, .dropdown').forEach(el => el.classList.remove('active'));
    };

    document.querySelectorAll('.dropdown > .dropbtn').forEach(dropbtn => {
      dropbtn.addEventListener('click', e => {
        if (mediaQuery.matches) return;
        e.preventDefault();
        e.stopPropagation();
        const dropdown = dropbtn.parentElement;
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        const isActive = dropdownContent.classList.contains('active');
        closeAllDropdowns();
        if (!isActive) {
          dropdownContent.classList.add('active');
          dropdown.classList.add('active');
        }
      });
    });

    document.querySelectorAll('.dropdown > a').forEach(link => {
      link.addEventListener('click', e => {
        if (!mediaQuery.matches) return;
        e.preventDefault();
        e.stopPropagation();
        const dropdown = link.parentElement;
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        const isActive = dropdownContent.classList.contains('active');
        closeAllDropdowns();
        if (!isActive) {
          dropdownContent.classList.add('active');
          dropdown.classList.add('active');
        }
      });
    });

    window.addEventListener('scroll', () => {
      if (mediaQuery.matches && navLinks?.classList.contains('active')) {
        closeAllDropdowns();
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('open');
      }
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.nav-links')) {
        closeAllDropdowns();
        navLinks?.classList.remove('active');
      }
    });

    window.addEventListener('resize', debounce(() => {
      if (!mediaQuery.matches) {
        closeAllDropdowns();
        navLinks?.classList.remove('active');
      }
      scaleFacebookTimelines();
    }, 100));
  };

  // -------------------------
  // PAGE INITIALIZATION
  // -------------------------
  const initPage = () => {
    initHeroSection();
    initUI();
    loadFacebookSDK();
    scaleFacebookTimelines();
  };

  // -------------------------
  // EVENT HANDLERS
  // -------------------------
  document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    if (localStorage.getItem('loadingScreenShown')) {
      loadingScreen.style.display = 'none';
      mainContent.classList.remove('hidden');
      mainContent.style.display = 'block';
      initPage();
    } else {
      initModernLoading();
      localStorage.setItem('loadingScreenShown', 'true');
    }
  });

  window.addEventListener('pageshow', event => {
    if (event.persisted) initHeroSection();
  });

  window.addEventListener('load', () => {
    const subPageImages = [
      'https://naturespark.com.au/images/universalBanner/Solar-drone-photo-Perth.webp',
      'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/green.webp',
      'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/blue.webp',
      'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/orange.webp'
    ];
    preloadImages(subPageImages).catch(err => console.error('Preload failed:', err));
  });
})();