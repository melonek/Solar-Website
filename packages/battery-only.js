(function () {
  // Scoped variables
  let hasShownBatteryCloud = false;
  let hasShownFormCloud = false;
  let activeTextCloud = null;
  let selectedBattery = null;
  let brandImages = [];

  // Global solarProducts data (subset for batteries)
  const solarProducts = {
    batteries: [
      {
        id: 1,
        name: "Tesla Powerwall",
        brand: "Tesla",
        specs: "13.5 kWh",
        country: "USA",
        warranty: "10 years",
        datasheet: "",
        image: "https://switchtecsolutions.com.au/wp-content/uploads/2024/08/powerwall-2.png.webp",
        price: 8000,
        popularity: 5,
        description: "Battery storage system description..."
      }
    ]
  };

  // Unified Preload Function
  function preloadImagesUnified(items) {
    return Promise.all(
      items.map(item => {
        const url = (typeof item === "string") ? item : item.url;
        return new Promise((resolve) => {
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

  // Helper to preload product card images
  function preloadProductCardImages(products) {
    const imageUrls = products.map(product => product.image);
    return preloadImagesUnified(imageUrls);
  }

  // Initialize brand images
  function initializeBrandImages() {
    const prefix = getPathPrefix();
    brandImages = [
      { name: 'Trina', url: `${prefix}images/BrandLogos/Trina-Solar.webp` },
      { name: 'SMA', url: `${prefix}images/BrandLogos/SMA.webp` },
      { name: 'Canadian Solar', url: `${prefix}images/BrandLogos/Canadian-Solar.webp` },
      { name: 'DaSolar', url: `${prefix}images/BrandLogos/DaSolar.webp` },
      { name: 'Fronius', url: `${prefix}images/BrandLogos/Fronius.webp` },
      { name: 'Growatt', url: `${prefix}images/BrandLogos/Growatt.webp` },
      { name: 'Huawei/iStore', url: `${prefix}images/BrandLogos/Huawei.webp` },
      { name: 'JASolar', url: `${prefix}images/BrandLogos/JASolar.webp` },
      { name: 'Goodwe', url: `${prefix}images/BrandLogos/Goodwe.webp` },
      { name: 'Jinko', url: `${prefix}images/BrandLogos/Jinko.webp` },
      { name: 'Longi', url: `${prefix}images/BrandLogos/Longi.webp` },
      { name: 'Risen', url: `${prefix}images/BrandLogos/Risen-Solar.webp` },
      { name: 'Seraphim', url: `${prefix}images/BrandLogos/Seraphim.webp` },
      { name: 'Sofar', url: `${prefix}images/BrandLogos/Sofar.webp` },
      { name: 'SolarEdge', url: `${prefix}images/BrandLogos/Solar-Edge.webp` },
      { name: 'Solis', url: `${prefix}images/BrandLogos/Solis.webp` },
      { name: 'Sungrow', url: `${prefix}images/BrandLogos/Sungrow.webp` },
      { name: 'EgingPV', url: `${prefix}images/BrandLogos/EgingPV.webp` },
      { name: 'QCells', url: `${prefix}images/BrandLogos/QCells.webp` },
      { name: 'Tesla', url: `${prefix}images/BrandLogos/Tesla.webp` }
    ];
  }

  // Preload brand images
  function preloadBrandImages() {
    return preloadImagesUnified(brandImages);
  }

  // Path prefix helper
  function getPathPrefix() {
    return window.location.pathname.includes('/packages/') ? "../" : "./";
  }

  // Parallax Banner Initialization (single image, subtle effect)
  function initParallaxBanner(sectionSelector, canvasId, imagePath, imageWidth, imageHeight) {
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
    if (typeof THREE === 'undefined') {
      console.error("Three.js library not loaded.");
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

    // Size canvas to match section height or a minimum
    const sectionHeight = section.offsetHeight;
    const minCanvasHeight = window.innerHeight * 1.3;
    const canvasHeight = Math.max(sectionHeight, minCanvasHeight);
    renderer.setSize(window.innerWidth, canvasHeight);
    canvas.style.width = '100%';
    canvas.style.height = `${canvasHeight}px`;
    camera.aspect = window.innerWidth / canvasHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 5;

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imagePath,
      () => console.log(`Image for ${canvasId} loaded successfully`),
      undefined,
      (err) => console.error(`Error loading image for ${canvasId}:`, err)
    );
    const planeWidth = 20;
    const planeHeightValue = 20 * (imageHeight / imageWidth);
    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeightValue);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      color: texture ? null : 0xff0000
    });

    const planeHeightInWorld = planeHeightValue * (imageHeight / 4000);
    const repeatsNeeded = Math.ceil((canvasHeight * 1.5) / planeHeightInWorld) + 1;
    const planes = [];

    for (let i = 0; i < repeatsNeeded; i++) {
      const plane = new THREE.Mesh(geometry, material);
      plane.scale.set(imageWidth / 4000, imageHeight / 4000, 1);
      plane.position.set(0, -i * planeHeightInWorld, -1);
      scene.add(plane);
      planes.push(plane);
    }

    const parallaxIntensity = 0.25; // Subtle effect, adjustable

    function animate() {
      requestAnimationFrame(animate);
      const scrollY = window.scrollY;
      const sectionTop = section.offsetTop;
      const sectionHeightValue = section.clientHeight;

      if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeightValue) {
        const progress = (scrollY - sectionTop) / sectionHeightValue;
        const parallaxY = progress * parallaxIntensity * sectionHeightValue;

        planes.forEach((plane, index) => {
          plane.position.y = (-index * planeHeightInWorld) - (parallaxY / 100);
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
      canvas.style.height = `${newCanvasHeight}px`;
      const newRepeatsNeeded = Math.ceil((newCanvasHeight * 1.5) / planeHeightInWorld) + 1;
      if (newRepeatsNeeded > planes.length) {
        for (let i = planes.length; i < newRepeatsNeeded; i++) {
          const plane = new THREE.Mesh(geometry, material);
          plane.scale.set(imageWidth / 4000, imageHeight / 4000, 1);
          plane.position.set(0, -i * planeHeightInWorld, -1);
          scene.add(plane);
          planes.push(plane);
        }
      }
    });
  }

  // Banner Config for Battery Section
  const batteryBannerConfig = {
    sectionSelector: '.battery-storage',
    canvasId: 'battery-canvas',
    imagePath: 'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/orange.webp',
    imageWidth: 6500,
    imageHeight: 4500
  };

  // Initialize when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded, initializing battery-only page...");

    initializeBrandImages();
    preloadBrandImages()
      .then(() => {
        console.log("Brand images preloaded successfully.");
        populateBrandSlider();
      })
      .catch(error => console.error("Error preloading brand images:", error));

    preloadProductCardImages(solarProducts.batteries)
      .then(() => {
        console.log("Battery product images preloaded.");
        populateBatteryGrid();
      })
      .catch(error => console.error("Error preloading battery images:", error));

    preloadImagesUnified([batteryBannerConfig.imagePath])
      .then(() => {
        console.log("Battery banner image preloaded.");
        initParallaxBanner(
          batteryBannerConfig.sectionSelector,
          batteryBannerConfig.canvasId,
          batteryBannerConfig.imagePath,
          batteryBannerConfig.imageWidth,
          batteryBannerConfig.imageHeight
        );
      })
      .catch(error => console.error("Error preloading battery banner image:", error));

    attachModalHandlers();
    attachSorting();
    attachEnquiryScroll();
    attachFormSubmitHandler();
    setupScrollObservers();
    setupFallbackScrollListener();
  });

  // Brand Slider Functions
  function populateBrandSlider() {
    const brandContainer = document.querySelector('.solar-brands-container');
    if (!brandContainer) {
      console.warn("Brand container not found!");
      return;
    }
    brandContainer.innerHTML = "";
    brandImages.slice(0, 4).forEach(brand => {
      const card = document.createElement('div');
      card.className = 'solar-brand-card';
      card.innerHTML = `<img src="${brand.url || ''}" alt="${brand.name || 'Brand'}">`;
      brandContainer.appendChild(card);
    });
    initializeBrandSlider('.solar-brand-card', '#solar-logo-cards-container');
  }

  function initializeBrandSlider(cardSelector, containerSelector) {
    const cards = document.querySelectorAll(cardSelector);
    if (!cards.length) {
      console.warn("No brand cards found for slider!");
      return;
    }
    let currentIndex = 0;

    function updateCards() {
      cards.forEach((card, i) => {
        const imgIndex = (currentIndex + i) % brandImages.length;
        const brand = brandImages[imgIndex];
        const imgEl = card.querySelector("img");
        if (imgEl) {
          imgEl.src = brand.url;
          imgEl.alt = brand.name;
        }
        card.className = 'solar-brand-card';
        setTimeout(() => card.classList.add("active"), 50);
      });
    }

    function cycle() {
      cards.forEach(card => card.classList.remove("active"));
      setTimeout(() => {
        currentIndex = (currentIndex + 4) % brandImages.length;
        updateCards();
      }, 500);
    }

    let interval = setInterval(cycle, 5000);
    const container = document.querySelector(containerSelector);
    if (container) {
      container.addEventListener("mouseenter", () => clearInterval(interval));
      container.addEventListener("mouseleave", () => {
        interval = setInterval(cycle, 5000);
      });
    }
    updateCards();
    setTimeout(() => {
      cards.forEach(card => card.classList.add("active"));
    }, 500);
  }

  // Battery Grid Population
  function populateBatteryGrid() {
    const batteryGrid = document.getElementById('battery-grid');
    if (!batteryGrid) {
      console.warn("Battery grid not found!");
      return;
    }

    const heroImageElement = batteryGrid.querySelector('.hero-image');
    const existingCards = batteryGrid.querySelectorAll('.product-card');
    existingCards.forEach(card => card.remove());

    if (!solarProducts.batteries || solarProducts.batteries.length === 0) {
      console.warn("No batteries found in solarProducts!");
      if (!heroImageElement) {
        batteryGrid.innerHTML += '<p>No battery products available.</p>';
      }
      return;
    }

    solarProducts.batteries.forEach(battery => {
      const card = createProductCard(battery, 'battery');
      card.setAttribute('data-id', battery.id || Math.random());
      card.addEventListener('click', function (e) {
        if (!e.target.classList.contains('read-more-btn')) {
          handleBatterySelection(battery, this);
        }
      });
      batteryGrid.appendChild(card);
    });

    const bundleButton = document.createElement('a');
    bundleButton.id = 'bundle-btn';
    bundleButton.classList.add('fancy-button', 'shiny');
    bundleButton.setAttribute('data-reveal', 'left');
    const innerSpan = document.createElement('span');
    innerSpan.classList.add('button-inner');
    innerSpan.textContent = 'Bundle with solar system';
    bundleButton.appendChild(innerSpan);
    bundleButton.href = '../packages/packages.html';
    batteryGrid.insertAdjacentElement('afterend', bundleButton);
  }

  function createProductCard(product, type) {
    const card = document.createElement("div");
    card.className = "product-card product";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name} Solar Product">
      <h3>${product.name}</h3>
      <p>Specs: ${product.specs}</p>
      <p>Country: ${product.country}</p>
      <p>Datasheet: <a class="download-link" href="${product.datasheet}" target="_blank">Download</a></p>
      <button class="read-more-btn shiny" data-type="${type}" data-id="${product.id}">Read More</button>
    `;
    card.querySelector(".read-more-btn").addEventListener("click", handleModalOpen);
    return card;
  }

  // Battery Selection
  function handleBatterySelection(battery, card) {
    document.querySelectorAll('.product-card').forEach(c => c.classList.remove('selected-battery'));
    card.classList.add('selected-battery');
    selectedBattery = battery;
    updateBatteryPackageDisplay();

    setTimeout(() => {
      scrollToSection('battery-package');
      showTextCloud("Here’s a glimpse of your future battery package.", 5000);
    }, 300);
  }

  // Update Battery Package Display
  function updateBatteryPackageDisplay() {
    const batteryImage = document.getElementById('selected-battery-alone-image');
    const batteryPackage = document.getElementById('battery-package');
    const totalCostDisplay = document.getElementById('total-cost');

    if (!selectedBattery || !batteryImage || !batteryPackage || !totalCostDisplay) {
      console.warn("Required elements for battery package display not found!");
      return;
    }

    batteryImage.src = selectedBattery.image || '';
    batteryImage.style.visibility = 'visible';

    const matchingBrand = brandImages.find(brand =>
      selectedBattery.name?.toLowerCase().includes(brand.name?.toLowerCase())
    );

    const brandLogo = document.getElementById('battery-brand-logo-overlay');
    if (brandLogo) {
      if (matchingBrand) {
        brandLogo.src = matchingBrand.url || '';
        brandLogo.alt = matchingBrand.name || '';
        brandLogo.style.display = 'block';
      } else {
        brandLogo.style.display = 'none';
      }
    }

    const packageDescription = document.getElementById('package-description');
    if (packageDescription) {
      packageDescription.innerHTML = `<strong>${selectedBattery.name || ''}</strong> - <strong>${selectedBattery.specs || ''}</strong>`;
    }

    totalCostDisplay.textContent = `Total: $${selectedBattery.price || 'N/A'} AUD`;
    totalCostDisplay.style.display = 'block';

    let enquiryDescription = document.getElementById('enquiry-description');
    if (!enquiryDescription) {
      enquiryDescription = document.createElement('p');
      enquiryDescription.id = 'enquiry-description';
      const buttonContainer = batteryPackage.querySelector('.button-container');
      if (buttonContainer) {
        buttonContainer.parentNode.insertBefore(enquiryDescription, buttonContainer);
      } else {
        batteryPackage.appendChild(enquiryDescription);
      }
    }
    enquiryDescription.innerHTML = `I would like to enquire about <strong>${selectedBattery.specs || ''}</strong>, <strong>${selectedBattery.name || ''}</strong> battery storage system.`;

    batteryPackage.style.display = 'block';

    if (document.getElementById('package-summary')) {
      updateBatteryFormSummary();
    }
  }

  // Battery Package Summary Helpers
  function collectBatteryPackageData() {
    return `
      <ul class="package-summary-list">
        <li>Battery: <strong>${selectedBattery ? selectedBattery.name : "Not selected"}</strong></li>
        <li>Specs: <strong>${selectedBattery ? selectedBattery.specs : "Not selected"}</strong></li>
      </ul>
    `;
  }

  function updateBatteryFormSummary() {
    const packageForm = document.querySelector('.package-form');
    if (packageForm) {
      let packageSummary = document.getElementById('package-summary');
      if (!packageSummary) {
        packageSummary = document.createElement('div');
        packageSummary.id = 'package-summary';
        const firstFormGroup = packageForm.querySelector('.form-group');
        if (firstFormGroup) {
          packageForm.insertBefore(packageSummary, firstFormGroup);
        } else {
          packageForm.insertAdjacentElement('afterbegin', packageSummary);
        }
      }
      packageSummary.innerHTML = collectBatteryPackageData();
    }
  }

  // Enquiry Scroll Handler
  function attachEnquiryScroll() {
    const confirmSelectionBtn = document.getElementById('confirm-selection');
    if (confirmSelectionBtn) {
      confirmSelectionBtn.addEventListener('click', () => {
        if (!selectedBattery) {
          showTextCloud("Please select a battery before enquiring.", 5000, true);
          setTimeout(() => {
            scrollToSection('battery-grid');
          }, 3000);
        } else {
          updateBatteryFormSummary();
          scrollToForm();
          setTimeout(() => {
            showTextCloud("Fill in details", 5000);
          }, 800);
        }
      });
    } else {
      console.warn("Confirm selection button not found!");
    }
  }

  // Scroll to Form Function
  function scrollToForm() {
    const formEl = document.querySelector('.package-form');
    if (formEl) {
      const desiredOffset = 50; // Adjust this number to change scroll position
      const elementTop = formEl.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementTop - desiredOffset, behavior: 'smooth' });
    } else {
      console.warn("Form section with class 'package-form' not found!");
    }
  }

  // Form Submission Handler
  function attachFormSubmitHandler() {
    const packageForm = document.querySelector('.package-form');
    if (!packageForm) {
      console.warn("Package form not found!");
      return;
    }

    packageForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!selectedBattery) {
        showTextCloud("Please select a battery before submitting the form.", 5000, true);
        setTimeout(() => {
          scrollToSection('battery-grid');
        }, 3000);
        return;
      }

      const solarPackageInput = document.getElementById('solar-package-input');
      if (selectedBattery && solarPackageInput) {
        solarPackageInput.value = `Battery: ${selectedBattery.name || ''} - ${selectedBattery.specs || ''}`;
      }

      const formData = new FormData(packageForm);
      fetch(packageForm.action, {
        method: packageForm.method,
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          return response.json();
        })
        .then(() => {
          showTextCloud("Thank you, your message has been forwarded. Have a nice day.", 5000);
          packageForm.reset();
        })
        .catch(error => {
          console.error("Fetch error:", error);
          showTextCloud("Oops! There was a problem submitting your form: " + error.message, 5000, true);
        });
    });
  }

  // Modal Handlers
  function handleModalOpen(e) {
    e.preventDefault();
    const type = e.target.dataset.type;
    const id = parseInt(e.target.dataset.id);
    let product = solarProducts.batteries.find(p => p.id === id);
    if (!product) return;

    const brand = brandImages.find(b => b.name.toLowerCase() === product.brand.toLowerCase());
    const brandLogoUrl = brand ? brand.url : "";
    const modal = document.getElementById("product-modal");

    document.querySelector(".modal-product-image").innerHTML = `
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.name}" class="main-product-image">
        ${brandLogoUrl ? `<img src="${brandLogoUrl}" alt="${product.brand}" class="brand-logo-battery">` : ""}
      </div>
    `;
    document.querySelector(".modal-product-details").innerHTML = `
      <h2>${product.name}</h2>
      <p><strong>Brand Name:</strong> ${product.brand}</p>
      <p><strong>Specifications:</strong> ${product.specs}</p>
      <p><strong>Country:</strong> ${product.country}</p>
      <p><strong>Warranty:</strong> ${product.warranty}</p>
      <p><strong>Datasheet:</strong> <a href="${product.datasheet}" target="_blank">Download</a></p>
      <p><strong>Product Description:</strong> ${product.description}</p>
    `;
    modal.classList.add("active");
  }

  function attachModalHandlers() {
    const modal = document.getElementById('product-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('close')) {
          modal.classList.remove("active");
        }
      });
    } else {
      console.warn("Modal not found!");
    }
  }

  // Sorting Function
  function attachSorting() {
    const batteryFilter = document.getElementById('battery-filter');
    if (batteryFilter) {
      batteryFilter.addEventListener('change', function () {
        sortProducts('battery', this.value);
      });
    } else {
      console.warn("Battery filter not found!");
    }
  }

  function sortProducts(type, criteria) {
    const grid = document.getElementById("battery-grid");
    let products = [...solarProducts.batteries];
    if (criteria === "expensive") {
      products.sort((a, b) => b.price - a.price);
    } else if (criteria === "cheap") {
      products.sort((a, b) => a.price - b.price);
    } else if (criteria === "popular") {
      products.sort((a, b) => b.popularity - a.popularity);
    }
    grid.innerHTML = '';
    const hero = grid.querySelector('.hero-image');
    if (hero) grid.appendChild(hero);
    products.forEach(product => grid.appendChild(createProductCard(product, type)));
  }

  // Scroll Function
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn(`Section ${sectionId} not found!`);
    }
  }

  // Text Cloud Function
  function showTextCloud(message, duration = 5000, withIcon = false) {
    if (activeTextCloud) {
      clearTimeout(activeTextCloud.fadeTimeout);
      clearTimeout(activeTextCloud.removeTimeout);
      activeTextCloud.remove();
      activeTextCloud = null;
    }
    const cloud = document.createElement("div");
    cloud.className = "text-cloud";
    const iconHTML = withIcon ? '<span class="warning-icon">⚠️</span> ' : "";
    cloud.innerHTML = iconHTML + message;
    cloud.style.position = 'fixed';
    cloud.style.left = '50%';
    cloud.style.top = '160px';
    cloud.style.transform = 'translate(-50%, -50%)';
    cloud.style.background = '#fff';
    cloud.style.padding = '15px 25px';
    cloud.style.borderRadius = '10px';
    cloud.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    cloud.style.zIndex = '9999';
    cloud.style.fontSize = '16px';
    cloud.style.color = '#333';
    cloud.style.opacity = '1';
    document.body.appendChild(cloud);
    activeTextCloud = cloud;
    activeTextCloud.fadeTimeout = setTimeout(() => {
      cloud.style.opacity = "0";
      activeTextCloud.removeTimeout = setTimeout(() => {
        cloud.remove();
        if (activeTextCloud === cloud) activeTextCloud = null;
      }, 1000);
    }, duration);
  }

  // Scroll Observers for Text Clouds
  function setupScrollObservers() {
    const batteryGridSection = document.getElementById('battery-grid');
    if (!batteryGridSection) {
      console.warn("Battery grid section not found for observer!");
      return;
    }
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -200px 0px',
      threshold: 0
    };
    const batteryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasShownBatteryCloud) {
          showTextCloud("Choose your battery", 5000);
          hasShownBatteryCloud = true;
        }
      });
    }, observerOptions);
    batteryObserver.observe(batteryGridSection);
  }

  // Fallback Scroll Listener
  function setupFallbackScrollListener() {
    window.addEventListener('scroll', () => {
      const batteryGridSection = document.getElementById('battery-grid');
      if (!batteryGridSection || hasShownBatteryCloud) return;
      const rect = batteryGridSection.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top >= 0 && rect.top <= windowHeight * 0.5) {
        showTextCloud("Choose your battery", 5000);
        hasShownBatteryCloud = true;
      }
    });
  }
})();