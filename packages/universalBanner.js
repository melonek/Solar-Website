// universal-banner.js
document.addEventListener("DOMContentLoaded", function() {
    // Helper: Preload images
    function preloadImagesUnified(items) {
      return Promise.all(
        items.map(item => {
          const url = typeof item === "string" ? item : item.url;
          return new Promise(resolve => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
              console.log(`Preloaded image: ${url}`);
              resolve(url);
            };
            img.onerror = () => {
              console.error(`Failed to preload image: ${url}`);
              resolve(url);
            };
          });
        })
      );
    }
  
    // --- Banner Parallax Initialization ---
    const crucialBannerImage = 'https://naturespark.com.au/images/universalBanner/Solar-drone-photo-Perth.webp';
    const bannerImageDiv = document.querySelector('.banner-image');
    
    preloadImagesUnified([crucialBannerImage])
      .then(() => {
        if (bannerImageDiv) {
          bannerImageDiv.style.backgroundImage = `url(${crucialBannerImage})`;
          bannerImageDiv.style.backgroundSize = 'cover';
          bannerImageDiv.style.backgroundPosition = 'center';
          gsap.set(".banner-image", { xPercent: -50, yPercent: -50, scale: 1 });
          gsap.to(".banner-image", {
            scrollTrigger: {
              trigger: ".universalBanner",
              start: "top top",
              end: "bottom top",
              scrub: true,
              // markers: true, // Uncomment for debugging
            },
            y: () => {
              const section = document.querySelector('.universalBanner');
              return section ? section.clientHeight * 0.35 : 0;
            },
            scale: 1.2,
            ease: "none",
            force3D: true
          });
        } else {
          console.error('Banner image div (.banner-image) not found in DOM.');
        }
      })
      .catch(() => {
        console.error('Banner image preloading failed, proceeding without animation.');
      });
    
    // --- Three.js Parallax Banner Initialization ---
    function initParallaxBanner(sectionSelector, canvasId, firstImagePath, firstWidth, firstHeight) {
      const section = document.querySelector(sectionSelector);
      const canvas = document.querySelector(`#${canvasId}`);
  
      if (!section) {
        console.error(`Section (${sectionSelector}) not found in DOM.`);
        return;
      }
      if (!canvas) {
        console.error(`Canvas (#${canvasId}) not found in DOM.`);
        return;
      }
      if (typeof THREE === 'undefined' || typeof gsap === 'undefined') {
        console.error("Required libraries not loaded.");
        return;
      }
  
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
      const sectionHeight = section.offsetHeight;
      const minCanvasHeight = window.innerHeight * 1.3;
      const canvasHeight = Math.max(sectionHeight, minCanvasHeight);
      renderer.setSize(window.innerWidth, canvasHeight);
      camera.aspect = window.innerWidth / canvasHeight;
      camera.updateProjectionMatrix();
      camera.position.z = 5;
  
      const textureLoader = new THREE.TextureLoader();
      const firstTexture = textureLoader.load(firstImagePath,
        () => console.log(`First image for ${canvasId} loaded successfully`),
        undefined,
        (err) => console.error(`Error loading first image for ${canvasId}:`, err)
      );
      const planeWidth = 20;
      const planeHeightValue = 20 * (firstHeight / firstWidth);
      const geometry = new THREE.PlaneGeometry(planeWidth, planeHeightValue);
      const firstMaterial = new THREE.MeshBasicMaterial({
        map: firstTexture,
        transparent: true,
        side: THREE.DoubleSide,
        color: firstTexture ? null : 0xff0000
      });
  
      const planeHeightInWorld = planeHeightValue * (firstHeight / 4000);
      const repeatsNeeded = Math.ceil((canvasHeight * 1.5) / planeHeightInWorld) + 1;
      const firstPlanes = [];
  
      for (let i = 0; i < repeatsNeeded; i++) {
        const firstPlane = new THREE.Mesh(geometry, firstMaterial);
        firstPlane.scale.set(firstWidth / 4000, firstHeight / 4000, 1);
        firstPlane.position.set(0, -i * planeHeightInWorld, -1);
        scene.add(firstPlane);
        firstPlanes.push(firstPlane);
      }
  
      const parallaxIntensityFirst = 0.25;
      const rotationIntensity = 0.3;
  
      function animate() {
        requestAnimationFrame(animate);
        const scrollY = window.scrollY;
        const sectionTop = section.offsetTop;
        const sectionHeightValue = section.clientHeight;
  
        if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeightValue) {
          const progress = (scrollY - sectionTop) / sectionHeightValue;
          const parallaxYFirst = progress * parallaxIntensityFirst * sectionHeightValue;
          firstPlanes.forEach((plane, index) => {
            plane.position.y = (-index * planeHeightInWorld) - (parallaxYFirst / 100);
          });
        }
        renderer.render(scene, camera);
      }
      animate();
  
      window.addEventListener('resize', () => {
        const newSectionHeight = section.offsetHeight;
        const newCanvasHeight = Math.max(newSectionHeight, window.innerHeight * 1.5);
        renderer.setSize(window.innerWidth, newCanvasHeight);
        camera.aspect = window.innerWidth / newCanvasHeight;
        camera.updateProjectionMatrix();
        const newRepeatsNeeded = Math.ceil((newCanvasHeight * 1.5) / planeHeightInWorld) + 1;
        if (newRepeatsNeeded > firstPlanes.length) {
          for (let i = firstPlanes.length; i < newRepeatsNeeded; i++) {
            const firstPlane = new THREE.Mesh(geometry, firstMaterial);
            firstPlane.scale.set(firstWidth / 4000, firstHeight / 4000, 1);
            firstPlane.position.set(0, -i * planeHeightInWorld, -1);
            scene.add(firstPlane);
            firstPlanes.push(firstPlane);
          }
        }
      });
    }
  
    // Banner configurations (customize as needed)
    const bannerConfigs = [
      {
        sectionSelector: '.panels-section',
        canvasId: 'hero-canvas',
        firstImagePath: 'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/green.webp',
        firstWidth: 4500,
        firstHeight: 3500,
      },
      {
        sectionSelector: '.inverters-section',
        canvasId: 'inverter-canvas',
        firstImagePath: 'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/blue.webp',
        firstWidth: 4500,
        firstHeight: 3500,
      },
      {
        sectionSelector: '.battery-storage',
        canvasId: 'battery-canvas',
        firstImagePath: 'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/orange.webp',
        firstWidth: 6500,
        firstHeight: 4500,
      }
    ];
  
    // Preload all crucial banner images and initialize each banner
    const allCrucialBannerImages = bannerConfigs.flatMap(config => [config.firstImagePath].filter(Boolean));
    preloadImagesUnified(allCrucialBannerImages)
      .then(() => console.log("Crucial Three.js banner images preloaded."))
      .catch(err => console.error("Error preloading Three.js banner images:", err));
  
    bannerConfigs.forEach(config => {
      initParallaxBanner(
        config.sectionSelector,
        config.canvasId,
        config.firstImagePath,
        config.firstWidth,
        config.firstHeight
      );
    });
  });
  