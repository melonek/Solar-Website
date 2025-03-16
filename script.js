/**
 * main.js
 *
 * - Preloads images.
 * - Runs a custom pixelated loading animation on #loading-canvas.
 * - While loading, only the loading screen is visible.
 * - When loading completes, hides #loading-screen and reveals #main-content.
 * - Re-triggers hero animations (for #hero-canvas, .hero-image, and hero text) per CSS.
 * - Initializes the Three.js scene for the hero canvas.
 * - Lazy-loads the Facebook SDK after main content is visible.
 */

// ------------------------- FACEBOOK SDK INITIALIZATION -------------------------
// Define fbAsyncInit so that when the SDK loads, it initializes correctly.
window.fbAsyncInit = function() {
  FB.init({
    appId: '1426450195430892', // Your App ID
    xfbml: true,               // Auto-parse XFBML (ensure elements are visible)
    version: 'v22.0'
  });
  console.log('FB SDK initialized via fbAsyncInit');
  // The SDK will auto-parse XFBML once loaded.
};

// ------------------------- SERVICE WORKER -------------------------
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

// ------------------------- HELPER FUNCTIONS -------------------------
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

function drawPixelText(ctx, text, areaX, areaY, areaWidth, areaHeight, fontFamily, color) {
  const pixelSize = 5, gap = 1;
  const cellSize = pixelSize + gap;
  const gridCols = Math.floor(areaWidth / cellSize);
  const gridRows = Math.floor(areaHeight / cellSize);
  const offCanvas = document.createElement('canvas');
  offCanvas.width = gridCols;
  offCanvas.height = gridRows;
  const offCtx = offCanvas.getContext('2d');
  offCtx.imageSmoothingEnabled = false;
  const offFontSize = Math.floor(gridRows * 0.8);
  offCtx.font = `bold ${offFontSize}px ${fontFamily}`;
  offCtx.fillStyle = color;
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';
  offCtx.clearRect(0, 0, gridCols, gridRows);
  offCtx.fillText(text, gridCols / 2, gridRows / 2);
  const imageData = offCtx.getImageData(0, 0, gridCols, gridRows);
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      const index = (row * gridCols + col) * 4;
      if (imageData.data[index + 3] > 128) {
        ctx.fillStyle = color;
        ctx.fillRect(areaX + col * cellSize, areaY + row * cellSize, pixelSize, pixelSize);
      }
    }
  }
}

function drawLoadingBarWithFill(ctx, x, y, width, height, fillProgress) {
  const borderRadius = 3;
  drawRoundedRect(ctx, x, y, width, height, borderRadius);
  ctx.strokeStyle = "#FFF";
  ctx.lineWidth = 1;
  ctx.stroke();
  const innerX = x + 1, innerY = y + 1;
  const innerWidth = width - 2, innerHeight = height - 2;
  const currentFillWidth = innerWidth * fillProgress;
  ctx.fillStyle = "#00FF00";
  ctx.fillRect(innerX, innerY, currentFillWidth, innerHeight);
}

function reTriggerHeroAnimations() {
  const animatedElements = document.querySelectorAll('#hero-canvas, .hero-image, .hero-content .main-title, .hero-content .subtitle');
  animatedElements.forEach(el => {
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  });
}

// ------------------------- CUSTOM FACEBOOK TIMELINE SCALING FUNCTION -------------------------
// We use our custom .scaler element to override Facebook’s native scaling.
function scaleFacebookTimelines() {
  const containers = document.querySelectorAll('.timeline-container');
  containers.forEach(container => {
    const scaler = container.querySelector('.scaler');
    const fbPage = container.querySelector('.fb-page');
    if (scaler && fbPage) {
      const rawWidth = container.clientWidth;
      console.log("Raw container width:", rawWidth);
      // If the container's width is too small (likely because it’s hidden), delay scaling.
      if (rawWidth < 100) {
        setTimeout(scaleFacebookTimelines, 200);
        return;
      }
      // Subtract any known padding (here, 40px)
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
window.addEventListener('resize', scaleFacebookTimelines);

// ------------------------- LOADING ANIMATION -------------------------
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
  
  // Phase durations.
  const textRevealDuration = 2000; // in ms
  const fillDuration = 1500;       // in ms
  
  // Vertical gaps and margins.
  const gapSec1Sec2 = -10;
  const gapSec2Sec3 = 10;
  const sec1MarginTop = -10;
  
  // Offscreen definitions.
  const baseOffWidth = 200;
  const sec1 = { text: "LOADING...", width: 200, height: 40 };
  const sec2 = { text: "NATURE'S SPARK", width: 200, height: 40 };
  const sec3 = { width: 150, height: 5 };
  const compositeOffWidth = Math.max(sec1.width, sec2.width, sec3.width);
  
  // Offscreen canvas for Section 1.
  const off1Width = sec1.width + sec1.height;
  const off1 = document.createElement('canvas');
  off1.width = off1Width;
  off1.height = sec1.height;
  const offCtx1 = off1.getContext('2d');
  offCtx1.imageSmoothingEnabled = false;
  offCtx1.fillStyle = "#000";
  offCtx1.fillRect(0, 0, off1.width, off1.height);
  offCtx1.font = "bold 20px monospace";
  offCtx1.textAlign = "center";
  offCtx1.textBaseline = "middle";
  offCtx1.fillStyle = "#FFF";
  offCtx1.fillText(sec1.text, sec1.width / 2, off1.height / 2);
  
  // Sun icon details.
  const gapBetween = -40;
  const sunOffsetX = 0;
  const sunOffsetY = -5;
  const defaultSunCenterX = sec1.width + sec1.height / 2 + gapBetween;
  const defaultSunCenterY = off1.height / 2;
  const sunCenterX = defaultSunCenterX + sunOffsetX;
  const sunCenterY = defaultSunCenterY + sunOffsetY;
  const sunRadius = sec1.height * 0.25;
  offCtx1.beginPath();
  offCtx1.arc(sunCenterX, sunCenterY, sunRadius, 0, Math.PI * 2);
  offCtx1.fillStyle = "yellow";
  offCtx1.fill();
  offCtx1.strokeStyle = "orange";
  offCtx1.lineWidth = 2;
  offCtx1.stroke();
  const rayHeight = 5, rayWidth = 6;
  function drawTriangle(ctx, x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
  }
  offCtx1.fillStyle = "yellow";
  offCtx1.strokeStyle = "orange";
  offCtx1.lineWidth = 1;
  drawTriangle(offCtx1,
    sunCenterX - rayWidth / 2, sunCenterY - sunRadius,
    sunCenterX + rayWidth / 2, sunCenterY - sunRadius,
    sunCenterX, sunCenterY - sunRadius - rayHeight
  );
  drawTriangle(offCtx1,
    sunCenterX - rayWidth / 2, sunCenterY + sunRadius,
    sunCenterX + rayWidth / 2, sunCenterY + sunRadius,
    sunCenterX, sunCenterY + sunRadius + rayHeight
  );
  drawTriangle(offCtx1,
    sunCenterX - sunRadius, sunCenterY - rayWidth / 2,
    sunCenterX - sunRadius, sunCenterY + rayWidth / 2,
    sunCenterX - sunRadius - rayHeight, sunCenterY
  );
  drawTriangle(offCtx1,
    sunCenterX + sunRadius, sunCenterY - rayWidth / 2,
    sunCenterX + sunRadius, sunCenterY + rayWidth / 2,
    sunCenterX + sunRadius + rayHeight, sunCenterY
  );
  offCtx1.beginPath();
  offCtx1.arc(sunCenterX - sunRadius / 2, sunCenterY - sunRadius / 3, 2, 0, Math.PI * 2);
  offCtx1.arc(sunCenterX + sunRadius / 2, sunCenterY - sunRadius / 3, 2, 0, Math.PI * 2);
  offCtx1.fillStyle = "black";
  offCtx1.fill();
  offCtx1.beginPath();
  offCtx1.arc(sunCenterX, sunCenterY, sunRadius / 2, 0, Math.PI, false);
  offCtx1.strokeStyle = "black";
  offCtx1.lineWidth = 2;
  offCtx1.stroke();
  
  // Offscreen canvas for Section 2.
  const off2 = document.createElement('canvas');
  off2.width = sec2.width;
  off2.height = sec2.height;
  const offCtx2 = off2.getContext('2d');
  offCtx2.imageSmoothingEnabled = false;
  offCtx2.fillStyle = "#000";
  offCtx2.fillRect(0, 0, off2.width, off2.height);
  offCtx2.font = "bold 20px monospace";
  offCtx2.textAlign = "center";
  offCtx2.textBaseline = "middle";
  offCtx2.fillStyle = "#00ffea";
  offCtx2.shadowColor = "rgba(0,255,234,0.5)";
  offCtx2.shadowBlur = 10;
  offCtx2.fillText(sec2.text, off2.width / 2, off2.height / 2);
  
  // Offscreen canvas for Section 3.
  const off3 = document.createElement('canvas');
  off3.width = sec3.width;
  off3.height = sec3.height;
  const offCtx3 = off3.getContext('2d');
  offCtx3.imageSmoothingEnabled = false;
  offCtx3.fillStyle = "#000";
  offCtx3.fillRect(0, 0, off3.width, off3.height);
  const lbX = 0, lbY = 0, lbW = sec3.width, lbH = sec3.height;
  const borderRadius = 3;
  drawRoundedRect(offCtx3, lbX, lbY, lbW, lbH, borderRadius);
  offCtx3.strokeStyle = "#FFF";
  offCtx3.lineWidth = 1;
  offCtx3.stroke();
  
  const totalRowsComposite = off1.height + off2.height + off3.height + gapSec1Sec2 + gapSec2Sec3 + sec1MarginTop;
  const totalRowsText = off1.height + off2.height + gapSec1Sec2 + sec1MarginTop;
  
  const blockSize = 6, gap = 1;
  const cell = blockSize + gap;
  const baseDrawingWidth = compositeOffWidth * cell;
  const scaleFactor = (canvas.width < baseDrawingWidth) ? canvas.width / baseDrawingWidth : 1;
  const effectiveCell = cell * scaleFactor;
  const effectiveBlockSize = blockSize * scaleFactor;
  const effectiveCompositeHeight = totalRowsComposite * effectiveCell;
  const offsetX = (canvas.width - baseDrawingWidth * scaleFactor) / 2;
  const offsetY = (canvas.height - effectiveCompositeHeight) / 2;
  
  function getSec3X() {
    return (canvas.width - (sec3.width * effectiveCell)) / 2;
  }
  
  function getSectionOffset(secWidth) {
    return ((compositeOffWidth - secWidth) * effectiveCell) / 2;
  }
  
  const rowDelay = textRevealDuration / totalRowsText;
  let currentRow = 0;
  
  function drawTextRows() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    [
      { data: offCtx1.getImageData(0, 0, off1.width, off1.height), yOffset: sec1MarginTop, width: off1.width, rows: off1.height },
      { data: offCtx2.getImageData(0, 0, off2.width, off2.height), yOffset: off1.height + gapSec1Sec2 + sec1MarginTop, width: off2.width, rows: off2.height }
    ].forEach(sec => {
      const rowsToDraw = Math.min(sec.rows, Math.max(0, currentRow - sec.yOffset));
      const secOffsetX = getSectionOffset(sec.width);
      if (rowsToDraw > 0) {
        for (let y = 0; y < rowsToDraw; y++) {
          for (let x = 0; x < sec.width; x++) {
            const index = (y * sec.width + x) * 4;
            if (sec.data.data[index + 3] > 128) {
              const r = sec.data.data[index];
              const g = sec.data.data[index + 1];
              const b = sec.data.data[index + 2];
              ctx.fillStyle = `rgba(${r},${g},${b},${sec.data.data[index + 3] / 255})`;
              const destX = offsetX + secOffsetX + x * effectiveCell;
              const destY = offsetY + (sec.yOffset + y) * effectiveCell;
              ctx.fillRect(destX, destY, effectiveBlockSize, effectiveBlockSize);
            }
          }
        }
      }
    });
    currentRow++;
    if (currentRow <= totalRowsText) {
      setTimeout(drawTextRows, rowDelay);
    } else {
      drawLoadingBarBorder();
      animateLoadingBarFill(performance.now());
    }
  }
  
  function drawLoadingBarBorder() {
    const off3Data = offCtx3.getImageData(0, 0, off3.width, off3.height);
    const sec3OffsetY = off1.height + off2.height + gapSec1Sec2 + gapSec2Sec3 + sec1MarginTop;
    const sec3X = getSec3X();
    for (let y = 0; y < off3.height; y++) {
      for (let x = 0; x < off3.width; x++) {
        const index = (y * off3.width + x) * 4;
        if (off3Data.data[index + 3] > 128) {
          const r = off3Data.data[index];
          const g = off3Data.data[index + 1];
          const b = off3Data.data[index + 2];
          ctx.fillStyle = `rgba(${r},${g},${b},${off3Data.data[index + 3] / 255})`;
          const destX = sec3X + x * effectiveCell;
          const destY = offsetY + (sec3OffsetY + y) * effectiveCell;
          ctx.fillRect(destX, destY, effectiveBlockSize, effectiveBlockSize);
        }
      }
    }
  }
  
  function animateLoadingBarFill(fillStartTime) {
    const now = performance.now();
    const fillProgress = Math.min((now - fillStartTime) / fillDuration, 1);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    [
      { data: offCtx1.getImageData(0, 0, off1.width, off1.height), yOffset: sec1MarginTop, width: off1.width, rows: off1.height },
      { data: offCtx2.getImageData(0, 0, off2.width, off2.height), yOffset: off1.height + gapSec1Sec2 + sec1MarginTop, width: off2.width, rows: off2.height }
    ].forEach(sec => {
      const secOffsetX = getSectionOffset(sec.width);
      for (let y = 0; y < sec.rows; y++) {
        for (let x = 0; x < sec.width; x++) {
          const index = (y * sec.width + x) * 4;
          if (sec.data.data[index + 3] > 128) {
            const r = sec.data.data[index];
            const g = sec.data.data[index + 1];
            const b = sec.data.data[index + 2];
            ctx.fillStyle = `rgba(${r},${g},${b},${sec.data.data[index + 3] / 255})`;
            const destX = offsetX + secOffsetX + x * effectiveCell;
            const destY = offsetY + (sec.yOffset + y) * effectiveCell;
            ctx.fillRect(destX, destY, effectiveBlockSize, effectiveBlockSize);
          }
        }
      }
    });
    drawLoadingBarBorder();
    
    const lbInnerX = lbX + 1;
    const lbInnerY = lbY + 1;
    const lbInnerW = lbW - 2;
    const lbInnerH = lbH - 2;
    const sec3X = getSec3X();
    const sec3OffsetY = off1.height + off2.height + gapSec1Sec2 + gapSec2Sec3 + sec1MarginTop;
    const fillX = sec3X + lbInnerX * effectiveCell;
    const fillY = offsetY + (sec3OffsetY + lbInnerY) * effectiveCell;
    const effectiveInnerW = lbInnerW * effectiveCell;
    const effectiveInnerH = lbInnerH * effectiveCell;
    const currentFillW = effectiveInnerW * fillProgress;
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(fillX, fillY, currentFillW, effectiveInnerH);
    
    if (fillProgress < 1) {
      requestAnimationFrame(() => animateLoadingBarFill(fillStartTime));
    } else {
      // Hide the loading overlay and reveal main content.
      const loadingOverlay = document.getElementById('loading-screen');
      if (loadingOverlay) {
        loadingOverlay.style.display = "none";
      }
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.classList.remove('hidden');
        mainContent.style.display = "block";
      }
      reTriggerHeroAnimations();
      if (callback) callback();
      // Instead of re-parsing FB elements here, we lazy-load the Facebook SDK
      // only after main content has fully transitioned.
      mainContent.addEventListener('transitionend', () => {
        if (!document.getElementById('fb-root')) {
          const fbRoot = document.createElement('div');
          fbRoot.id = 'fb-root';
          document.body.appendChild(fbRoot);
          
          const script = document.createElement('script');
          script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v22.0&appId=1426450195430892';
          script.async = true;
          script.defer = true;
          document.body.appendChild(script);
        }
      });
    }
  }
  
  drawTextRows();
}

// ------------------------- HANDLE PAGESHOW (for bfcache) -------------------------
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    initHeroSection();
  }
});

// ------------------------- PRELOAD SUB-PAGE ASSETS -------------------------
const subPageImages = [
  'https://naturespark.com.au/images/universalBanner/Solar-drone-photo-Perth.webp',
  'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/green.webp',
  'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/blue.webp',
  'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/orange.webp'
];
window.addEventListener('load', () => {
  preloadImages(subPageImages).catch(err => console.error(err));
});

// ------------------------- GET HERO DIMENSIONS (responsive sizing) -------------------------
function getHeroDimensions() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const solarek = { width: 5000, height: 3500 };
  const leaves = isMobile ? { width: 4200, height: 3700 } : { width: 6500, height: 4500 };
  return { solarek, leaves, isMobile };
}

// ------------------------- HERO SECTION INITIALIZATION -------------------------
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
    updatePlaneScales();
  });
}

// ------------------------- MAIN INITIALIZATION -------------------------
document.addEventListener('DOMContentLoaded', () => {
  startLoadingAnimation(initHeroSection);
});

// ------------------------- SECOND INITIALIZATION BLOCK (UI, Scroll, Navigation, etc.) -------------------------
document.addEventListener('DOMContentLoaded', () => {
  // BUILD SOLAR SECTION PARALLAX
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
  
  // REVEAL FUNCTIONS
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

document.addEventListener('DOMContentLoaded', () => {
  const loadingOverlay = document.getElementById('loading-screen');
  const mainContent = document.getElementById('main-content');

  // Check if the loading screen has been shown before
  if (localStorage.getItem('loadingScreenShown')) {
    // Skip the animation and reveal the content immediately
    if (loadingOverlay) loadingOverlay.style.display = 'none';
    if (mainContent) {
      mainContent.classList.remove('hidden');
      mainContent.style.display = 'block';
    }
    initHeroSection();
  } else {
    // Run the loading animation, then set the flag
    startLoadingAnimation(() => {
      initHeroSection();
      localStorage.setItem('loadingScreenShown', 'true');
    });
  }
});
