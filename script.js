/**
 * main.js
 *
 * - Preloads images.
 * - Runs a custom pixelated loading animation on #loading-canvas.
 * - While loading, only the loading screen is visible.
 * - When loading completes, hides #loading-screen and reveals #main-content.
 * - Re-triggers hero animations (for #hero-canvas, .hero-image, and hero text) per CSS.
 * - Initializes the Three.js scene for the hero canvas.
 */

/* -------------------------
   HELPER: PRELOAD IMAGES FUNCTION
------------------------- */
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

/* ====================
   Helper: Draw a Rounded Rectangle
=================== */
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

/* ====================
   Helper: Draw Pixel Text (using an offscreen canvas)
=================== */
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

/* ====================
   Helper: Draw Loading Bar with Animated Green Fill
=================== */
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

/* ====================
   Helper: Re-Trigger Hero Animations
   Resets CSS animations on hero elements.
=================== */
function reTriggerHeroAnimations() {
  const animatedElements = document.querySelectorAll('#hero-canvas, .hero-image, .hero-content .main-title, .hero-content .subtitle');
  animatedElements.forEach(el => {
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  });
}

/* ====================
   Main: Start Loading Animation with Responsive Scaling
=================== */
function startLoadingAnimation(callback) {
  const canvas = document.getElementById('loading-canvas');
  if (!canvas) {
    console.error("Loading canvas (#loading-canvas) not found.");
    if (callback) callback();
    return;
  }
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;
  
  // Set canvas to fill the viewport.
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Phase durations.
  const textRevealDuration = 3000; // in ms
  const fillDuration = 2000;       // in ms
  
  // Define separate vertical gaps (in cell units) for each section.
  const gapSec1Sec2 = -10; // Gap between sec1 and sec2.
  const gapSec2Sec3 = 10; // Gap between sec2 and sec3.
  
  // NEW: Define a top margin for sec1 (in cell units).
  const sec1MarginTop = -10;
  
  // Offscreen definitions.
  const baseOffWidth = 200;
  const sec1 = { text: "LOADING...", width: 200, height: 40 };
  const sec2 = { text: "NATURE'S SPARK", width: 200, height: 40 };
  const sec3 = { width: 150, height: 5 }; // Loading bar dimensions.
  const compositeOffWidth = Math.max(sec1.width, sec2.width, sec3.width);
  
  // --- Offscreen canvas for Section 1 (with sun icon) ---
  // Increase off1 width to provide space for the sun icon.
  const off1Width = sec1.width + sec1.height;
  const off1 = document.createElement('canvas');
  off1.width = off1Width;
  off1.height = sec1.height;
  const offCtx1 = off1.getContext('2d');
  offCtx1.imageSmoothingEnabled = false;
  offCtx1.fillStyle = "#000";
  offCtx1.fillRect(0, 0, off1.width, off1.height);
  
  // Draw "LOADING..." text in the left portion (centered in a box of width sec1.width).
  offCtx1.font = "bold 20px monospace";
  offCtx1.textAlign = "center";
  offCtx1.textBaseline = "middle";
  offCtx1.fillStyle = "#FFF";
  offCtx1.fillText(sec1.text, sec1.width / 2, off1.height / 2);
  
  // ---- Fine control for sun position.
  const gapBetween = -40; // gap between text and sun.
  const sunOffsetX = 0; // adjust horizontally (positive moves right)
  const sunOffsetY = -5; // adjust vertically (positive moves down)
  
  const defaultSunCenterX = sec1.width + sec1.height / 2 + gapBetween;
  const defaultSunCenterY = off1.height / 2;
  const sunCenterX = defaultSunCenterX + sunOffsetX;
  const sunCenterY = defaultSunCenterY + sunOffsetY;
  
  // Draw the sun circle (smaller; same height as LOADING...).
  const sunRadius = sec1.height * 0.25;
  offCtx1.beginPath();
  offCtx1.arc(sunCenterX, sunCenterY, sunRadius, 0, Math.PI * 2);
  offCtx1.fillStyle = "yellow";
  offCtx1.fill();
  offCtx1.strokeStyle = "orange";
  offCtx1.lineWidth = 2;
  offCtx1.stroke();
  
  // Draw rays as small triangles.
  const rayHeight = 5;
  const rayWidth = 6;
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
  // Top ray.
  drawTriangle(offCtx1,
    sunCenterX - rayWidth / 2, sunCenterY - sunRadius,
    sunCenterX + rayWidth / 2, sunCenterY - sunRadius,
    sunCenterX, sunCenterY - sunRadius - rayHeight
  );
  // Bottom ray.
  drawTriangle(offCtx1,
    sunCenterX - rayWidth / 2, sunCenterY + sunRadius,
    sunCenterX + rayWidth / 2, sunCenterY + sunRadius,
    sunCenterX, sunCenterY + sunRadius + rayHeight
  );
  // Left ray.
  drawTriangle(offCtx1,
    sunCenterX - sunRadius, sunCenterY - rayWidth / 2,
    sunCenterX - sunRadius, sunCenterY + rayWidth / 2,
    sunCenterX - sunRadius - rayHeight, sunCenterY
  );
  // Right ray.
  drawTriangle(offCtx1,
    sunCenterX + sunRadius, sunCenterY - rayWidth / 2,
    sunCenterX + sunRadius, sunCenterY + rayWidth / 2,
    sunCenterX + sunRadius + rayHeight, sunCenterY
  );
  
  // Draw sun eyes.
  offCtx1.beginPath();
  offCtx1.arc(sunCenterX - sunRadius / 2, sunCenterY - sunRadius / 3, 2, 0, Math.PI * 2);
  offCtx1.arc(sunCenterX + sunRadius / 2, sunCenterY - sunRadius / 3, 2, 0, Math.PI * 2);
  offCtx1.fillStyle = "black";
  offCtx1.fill();
  
  // Draw sun smile.
  offCtx1.beginPath();
  offCtx1.arc(sunCenterX, sunCenterY, sunRadius / 2, 0, Math.PI, false);
  offCtx1.strokeStyle = "black";
  offCtx1.lineWidth = 2;
  offCtx1.stroke();
  
  // --- Offscreen canvas for Section 2.
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
  
  // --- Offscreen canvas for Section 3 (loading bar border).
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
  
  // Calculate total composite height (in cell rows) with added sec1MarginTop.
  const totalRowsComposite = off1.height + off2.height + off3.height + gapSec1Sec2 + gapSec2Sec3 + sec1MarginTop;
  const totalRowsText = off1.height + off2.height + gapSec1Sec2 + sec1MarginTop;
  
  const blockSize = 6, gap = 1;
  const cell = blockSize + gap;
  const baseDrawingWidth = compositeOffWidth * cell;
  const scaleFactor = (canvas.width < baseDrawingWidth) ? canvas.width / baseDrawingWidth : 1;
  const effectiveCell = cell * scaleFactor;
  const effectiveBlockSize = blockSize * scaleFactor;
  const effectiveCompositeHeight = totalRowsComposite * effectiveCell;
  // For sec1 and sec2, use composite centering.
  const offsetX = (canvas.width - baseDrawingWidth * scaleFactor) / 2;
  const offsetY = (canvas.height - effectiveCompositeHeight) / 2;
  
  // For sec3 (loading bar), center it independently.
  function getSec3X() {
    return (canvas.width - (sec3.width * effectiveCell)) / 2;
  }
  
  // For sec1 and sec2, use composite centering.
  function getSectionOffset(secWidth) {
    return ((compositeOffWidth - secWidth) * effectiveCell) / 2;
  }
  
  const rowDelay = textRevealDuration / totalRowsText;
  let currentRow = 0;
  
  function drawTextRows() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw sec1 and sec2. Note: we add sec1MarginTop to each yOffset.
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
    // For sec3, vertical offset = off1.height + off2.height + gapSec1Sec2 + gapSec2Sec3 + sec1MarginTop.
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
    // Redraw sec1 and sec2.
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
    
    // Draw the loading bar fill for sec3.
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
      // When loading is complete, hide the loading screen...
      const loadingOverlay = document.getElementById('loading-screen');
      if (loadingOverlay) {
        loadingOverlay.style.display = "none";
      }
      // ...and reveal the main content.
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.classList.remove('hidden');
        mainContent.style.display = "block";
      }
      // Re-trigger CSS animations for hero elements.
      reTriggerHeroAnimations();
      if (callback) callback();
    }
  }
  
  drawTextRows();
}

/* -------------------------
   HANDLE PAGE SHOW (for bfcache)
------------------------- */
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    initHeroSection();
  }
});

/* -------------------------
   PRELOAD SUB-PAGE ASSETS
------------------------- */
const subPageImages = [
  '/images/universalBanner/Solar-drone-photo-Perth.webp',
  '/images/Green,Blue,Orange-sectionsInPpackages/green.webp',
  '/images/Green,Blue,Orange-sectionsInPpackages/blue.webp',
  './images/Green,Blue,Orange-sectionsInPpackages/orange.webp'
];
window.addEventListener('load', () => {
  preloadImages(subPageImages).catch(err => console.error(err));
});

/* -------------------------
   HELPER: GET HERO DIMENSIONS (responsive sizing)
------------------------- */
function getHeroDimensions() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const solarek = { width: 5000, height: 3500 };
  const leaves = isMobile ? { width: 4200, height: 3700 } : { width: 6500, height: 4500 };
  return { solarek, leaves, isMobile };
}

/* -------------------------
   HERO SECTION INITIALIZATION
------------------------- */
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
    './images/leafBanner/leaf.webp'
  ];
  
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
      const dims = getHeroDimensions();
      firstPlane.scale.set(dims.solarek.width / scaleDivider, dims.solarek.height / scaleDivider, 1);
      secondPlane.scale.set(dims.leaves.width / scaleDivider, dims.leaves.height / scaleDivider, 1);
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
  }).catch(() => {
    console.error("Preloading failed for one or more hero images, but proceeding with initialization.");
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