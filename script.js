// -------------------------
// HELPER: PRELOAD IMAGES WITH PROGRESS FUNCTION
// -------------------------
function preloadImagesWithProgress(imageArray, progressCallback) {
  let loadedCount = 0;
  const totalImages = imageArray.length;
  
  return new Promise((resolve, reject) => {
    imageArray.forEach(src => {
      const img = new Image();
      img.src = src.trim(); // remove extra spaces
      img.onload = () => {
        loadedCount++;
        progressCallback(loadedCount / totalImages);
        if (loadedCount === totalImages) {
          resolve();
        }
      };
      img.onerror = () => reject(new Error('Failed to load image: ' + src));
    });
  });
}

// -------------------------
// UPDATE PROGRESS BAR FUNCTION
// -------------------------
function updateProgressBar(progressRatio) {
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    progressBar.style.width = `${progressRatio * 100}%`;
  }
}

// -------------------------
// INITIALIZE HERO SECTION AFTER PRELOADING
// -------------------------
function initHeroSection() {
  const heroSection = document.querySelector('.hero-section');
  // (Existing hero initialization code here)
  // ...
  // After initializing Three.js scene and GSAP animations,
  // Fade in the hero content (using GSAP fade from 0 to 1, for example)
  gsap.fromTo(heroSection, { opacity: 0 }, { opacity: 1, duration: 1 });
}

// -------------------------
// START PRELOADING ON DOMContentLoaded
// -------------------------
document.addEventListener('DOMContentLoaded', () => {
  // List of hero assets to preload (ensure URLs have no extra spaces)
  const heroAssets = [
    './images/AboutUs/solarek.webp',
    './images/leafBanner/leaf.webp'
  ];
  
  preloadImagesWithProgress(heroAssets, updateProgressBar)
    .then(() => {
      // Optionally, add a slight delay to show the progress bar filled
      setTimeout(() => {
        // Fade out the progress bar overlay
        gsap.to('#progress-container', { opacity: 0, duration: 0.5, onComplete: () => {
          document.getElementById('progress-container').style.display = 'none';
          // Now initialize the hero section animations and Three.js scene
          initHeroSection();
        }});
      }, 200);
    })
    .catch(err => {
      console.error(err);
      // In case of error, proceed with initialization
      initHeroSection();
    });
});


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
  const solarek = { width: 5000, height: 3500 };
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
    '/images/AboutUs/solarek.webp',
    '/images/leafBanner/leaf.webp'
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
      './images/leafBanner/leaf.webp',
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
// MAIN INITIALIZATION (Hero Section)
// -------------------------
document.addEventListener('DOMContentLoaded', () => {
  initHeroSection();
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
  
  let isScrolling = false, isTouching = false;
  window.addEventListener('scroll', () => {
    isScrolling = true;
    setTimeout(() => { isScrolling = false; }, 200);
  });
  
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
  
  function revealFacebookTimelines() {
    const timelines = document.querySelectorAll('.fb-page-wrapper');
    const triggerBottom = window.innerHeight * 0.8;
    timelines.forEach(timeline => {
      const timelineTop = timeline.getBoundingClientRect().top;
      if (timelineTop < triggerBottom) {
        timeline.classList.add('revealed');
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

// -------------------------
// NEW: Facebook Graph API Page Timeline Fetch
// -------------------------

// IMPORTANT: To fetch a page's timeline, you need a valid Page Access Token that has the pages_read_engagement permission.
// Replace the value below with your valid Page Access Token.
const fbPageAccessToken = "EAAT8VyHgCQ8BO8XCpY2qNOdK0j5jH0trMBLhZAfWZBRojrfmR4A7HtMZAMQ4NbXhsHBv2fdQsZB0ZAPsvEaevBqTKBfZBdf80M2nSd8ZBVkww93AZAPx2HvMOhGIzmpEYPe4eo9uO1bfYvhuGBuo6J4hb723kFrCqCEebxFInTyrG9rmkC7P2JArPwZDZD";
// Your App ID (for reference, if needed)
const fbAppId = "10235620378314828";

/**
 * Fetches and renders timeline posts for a given Facebook page.
 * @param {string} pageName - The page’s username or ID (e.g., "SolarQuotes").
 * @param {string} containerSelector - CSS selector for the container to render posts into.
 * @param {string} [nextURL] - (Optional) URL for fetching the next page of results.
 */
async function fetchFBPageTimeline(pageName, containerSelector, nextURL) {
  let url = "";
  if (nextURL) {
    url = nextURL;
  } else {
    // Initial URL to fetch page posts
    url = `https://graph.facebook.com/v12.0/${pageName}/posts?fields=message,created_time,story,permalink_url&access_token=${fbPageAccessToken}`;
  }
  
  console.log("Fetching timeline for page", pageName, "from:", url);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Fetched data for page", pageName, data);
    
    if (data.error) {
      console.error("Graph API Error for page", pageName, data.error);
      return;
    }
    renderFBPagePosts(data.data, containerSelector);
    
    // Add a "Load More" button if more posts are available
    if (data.paging && data.paging.next) {
      const container = document.querySelector(containerSelector);
      if (container) {
        const loadMoreBtn = document.createElement("button");
        loadMoreBtn.textContent = "Load More Posts";
        loadMoreBtn.style.marginTop = "10px";
        loadMoreBtn.addEventListener("click", () => {
          loadMoreBtn.remove();
          fetchFBPageTimeline(pageName, containerSelector, data.paging.next);
        });
        container.appendChild(loadMoreBtn);
      } else {
        console.error("Page timeline container not found for selector:", containerSelector);
      }
    }
  } catch (error) {
    console.error("Error fetching timeline for page", pageName, error);
  }
}

/**
 * Renders fetched page posts into the specified container.
 * @param {Array} posts - Array of post objects.
 * @param {string} containerSelector - CSS selector for the container element.
 */
function renderFBPagePosts(posts, containerSelector) {
  console.log("Rendering page posts:", posts);
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error("Page timeline container not found for selector:", containerSelector);
    return;
  }
  // Clear container before rendering posts
  container.innerHTML = "";
  
  if (!posts || posts.length === 0) {
    container.innerHTML = "<p>No posts available.</p>";
    return;
  }
  
  posts.forEach(post => {
    const postDiv = document.createElement("div");
    postDiv.className = "fb-post-custom";
    postDiv.style.border = "1px solid #ddd";
    postDiv.style.padding = "15px";
    postDiv.style.marginBottom = "15px";
    postDiv.style.borderRadius = "5px";
    postDiv.style.background = "#f9f9f9";
    
    const content = post.message || post.story || "No content available";
    const contentP = document.createElement("p");
    contentP.textContent = content;
    
    const timeEl = document.createElement("small");
    const d = new Date(post.created_time);
    timeEl.textContent = d.toLocaleString();
    
    if (post.permalink_url) {
      const linkEl = document.createElement("a");
      linkEl.href = post.permalink_url;
      linkEl.target = "_blank";
      linkEl.rel = "noopener noreferrer";
      linkEl.textContent = "View on Facebook";
      postDiv.appendChild(linkEl);
    }
    
    postDiv.appendChild(contentP);
    postDiv.appendChild(timeEl);
    container.appendChild(postDiv);
  });
}

// When the DOM is fully loaded, fetch timeline posts for each page.
document.addEventListener("DOMContentLoaded", () => {
  // For SolarQuotes – this will replace the contents of its fb-page-wrapper.
  fetchFBPageTimeline("SolarQuotes", ".timeline-container.solar-quotes .fb-page-wrapper");
  
  // For OneStepOffTheGrid – this will replace the contents of its fb-page-wrapper.
  fetchFBPageTimeline("OneStepOffTheGrid", ".timeline-container.one-step-off-the-grid .fb-page-wrapper");
});