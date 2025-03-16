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

(function () {
  // Scoped variables to avoid global conflicts
  let hasShownBatteryCloud = false;
  let hasShownFormCloud = false;
  let activeTextCloud = null;
  let selectedBattery = null;

  // Initialize when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded, initializing battery-only page...");
    try {
      populateBrandSlider();
      populateBatteryGrid();
      attachModalHandlers();
      attachSorting();
      attachEnquiryScroll();
      attachFormSubmitHandler();
      setupScrollObservers();
      setupFallbackScrollListener();
    } catch (error) {
      console.error("Error during initialization:", error);
    }
  });

  // ===================== BRAND SLIDER =====================
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
      // Use backticks to create a template literal
      card.innerHTML = `<img src="${brand.url || ''}" alt="${brand.name || 'Brand'}">`;
      brandContainer.appendChild(card);
    });
    initializeBrandSlider('.solar-brand-card', '#solar-logo-cards-container');
  }

  function initializeBrandSlider(cardSelector, containerSelector) {
    const cards = document.querySelectorAll(cardSelector);
    if (!cards.length) return;
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
        card.classList.remove("active");
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

  // ===================== BATTERY GRID POPULATION =====================
  function populateBatteryGrid() {
    const batteryGrid = document.getElementById('battery-grid');
    if (!batteryGrid) {
      console.warn("Battery grid not found!");
      return;
    }

    // Preserve the hero-image container if it exists
    const heroImageElement = batteryGrid.querySelector('.hero-image');
    // Remove only product cards (assume they have the class 'product-card')
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
      try {
        const card = createProductCard(battery, 'battery');
        card.setAttribute('data-id', battery.id || Math.random());
        card.addEventListener('click', function (e) {
          if (!e.target.classList.contains('read-more-btn')) {
            handleBatterySelection(battery, this);
          }
        });
        batteryGrid.appendChild(card);
      } catch (error) {
        console.error("Error creating product card:", error);
      }
    });

    // Create the bundle button and insert it after the battery grid
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

  // ===================== BATTERY SELECTION =====================
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

  // ===================== UPDATE BATTERY PACKAGE DISPLAY =====================
  function updateBatteryPackageDisplay() {
    const batteryImage = document.getElementById('selected-battery-alone-image');
    const batteryPackage = document.getElementById('battery-package');
    const totalCostDisplay = document.getElementById('total-cost');
    const batteryContainer = document.getElementById('battery-image-combination');

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
        const parent = buttonContainer.parentNode;
        if (parent) {
          parent.insertBefore(enquiryDescription, buttonContainer);
        } else {
          console.warn("Button container has no parentNode, appending to battery package as fallback.");
          batteryPackage.appendChild(enquiryDescription);
        }
      } else {
        console.warn("Button container not found in battery package, appending to battery package as fallback.");
        batteryPackage.appendChild(enquiryDescription);
      }
    }
    enquiryDescription.innerHTML = `I would like to enquire about <strong>${selectedBattery.specs || ''}</strong>, <strong>${selectedBattery.name || ''}</strong> battery storage system.`;

    batteryPackage.style.display = 'block';

    if (document.getElementById('package-summary')) {
      updateBatteryFormSummary();
    }
  }

  // ===================== BATTERY PACKAGE SUMMARY HELPER FUNCTIONS =====================
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

  // ===================== SCROLL TO FORM & SHOW TEXT CLOUD =====================
  function attachEnquiryScroll() {
    const confirmSelectionBtn = document.getElementById('confirm-selection');
    if (confirmSelectionBtn) {
      confirmSelectionBtn.addEventListener('click', () => {
        console.log("Confirm selection button clicked");
        if (!selectedBattery) {
          showTextCloud("Please select a battery before enquiring.", 5000, true);
          setTimeout(() => {
            scrollToSection('battery-grid');
          }, 3000);
        } else {
          updateBatteryFormSummary();
          scrollTo_form();
          showTextCloud("Fill in details", 5000);
        }
      });
    } else {
      console.warn("Confirm selection button not found!");
    }
  }

  // ===================== ATTACH FORM SUBMISSION HANDLER =====================
  function attachFormSubmitHandler() {
    const packageForm = document.querySelector('.package-form');
    if (!packageForm) {
      console.warn("Package form not found!");
      return;
    }

    packageForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent default form submission

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
        method: form.method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      }).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      }).then(data => {
        showTextCloud("Thank you, your message has been forwarded. Have a nice day.", 5000);
        packageForm.reset();
      }).catch(error => {
        console.error("Fetch error:", error.message);
        showTextCloud("Oops! There was a problem submitting your form: " + error.message, 5000, true);
      });
    });
  }

  // ===================== SCROLL TO FORM FUNCTION =====================
  function scrollTo_form() {
    const formSection = document.querySelector('.package-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn("Form section not found for scrollTo_form!");
    }
  }

  // ===================== MODAL HANDLERS =====================
  function handleModalOpen(e) {
    e.preventDefault();
    const type = e.target.dataset.type;
    const id = parseInt(e.target.dataset.id);
    let product;
    if (type === "battery") {
      product = solarProducts.batteries.find(p => p.id === id);
    }
    if (!product) return;
    const brand = brandImages.find(b => b.name.toLowerCase() === product.brand.toLowerCase());
    const brandLogoUrl = brand ? brand.url : "";
    const modal = document.getElementById("product-modal");

    // Set the modal content for battery
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

  // ===================== SORTING FUNCTION =====================
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
    let products = [...solarProducts[type + "s"]];
    if (criteria === "expensive") {
      products.sort((a, b) => b.price - a.price);
    } else if (criteria === "cheap") {
      products.sort((a, b) => a.price - b.price);
    } else if (criteria === "popular") {
      products.sort((a, b) => b.popularity - a.popularity);
    }
    grid.innerHTML = '';
    // Reinsert the hero-image container from within the battery-grid
    const hero = grid.querySelector('.hero-image');
    if (hero) grid.appendChild(hero);
    products.forEach(product => grid.appendChild(createProductCard(product, type)));
  }

  // ===================== SCROLL FUNCTION =====================
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn(`Section ${sectionId} not found for scrollToSection!`);
    }
  }

  // ===================== TEXT CLOUD FUNCTION =====================
  function showTextCloud(message, duration = 5000, withIcon = false) {
    console.log("Showing text cloud:", message);
    if (activeTextCloud) {
      clearTimeout(activeTextCloud.fadeTimeout);
      clearTimeout(activeTextCloud.removeTimeout);
      activeTextCloud.remove();
      activeTextCloud = null;
    }
    const cloud = document.createElement("div");
    cloud.className = "text-cloud";
    const iconHTML = withIcon ? '<span class="warning-icon">⚠️</span>' : "";
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
    cloud.style.display = 'block';
    document.body.appendChild(cloud);
    console.log("Text cloud appended to DOM:", cloud);
    activeTextCloud = cloud;
    activeTextCloud.fadeTimeout = setTimeout(() => {
      console.log("Fading out text cloud:", message);
      cloud.style.opacity = "0";
      activeTextCloud.removeTimeout = setTimeout(() => {
        console.log("Removing text cloud:", message);
        cloud.remove();
        if (activeTextCloud === cloud) activeTextCloud = null;
      }, 1000);
    }, duration);
  }

  // ===================== SETUP SCROLL OBSERVERS FOR TEXT CLOUDS =====================
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
          console.log("Battery grid section visible, showing cloud");
          showTextCloud("Choose your battery", 5000);
          hasShownBatteryCloud = true;
        }
      });
    }, observerOptions);
    batteryObserver.observe(batteryGridSection);
  }

  // ===================== FALLBACK SCROLL LISTENER FOR "Choose your battery" =====================
  function setupFallbackScrollListener() {
    window.addEventListener('scroll', () => {
      const batteryGridSection = document.getElementById('battery-grid');
      if (!batteryGridSection || hasShownBatteryCloud) return;
      const rect = batteryGridSection.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top >= 0 && rect.top <= windowHeight * 0.5) {
        console.log("Fallback scroll: Battery grid in view, showing cloud");
        showTextCloud("Choose your battery", 5000);
        hasShownBatteryCloud = true;
      }
    });
  }

  // Define banner configurations
  const bannerConfigs = [
    {
      sectionSelector: '.panels-section',
      canvasId: 'hero-canvas',
      firstImagePath: 'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/green.webp',
      secondImagePath: '',
      firstWidth: 4500,
      firstHeight: 3500,
      secondWidth: 8000,
      secondHeight: 4000
    },
    {
      sectionSelector: '.inverters-section',
      canvasId: 'inverter-canvas',
      firstImagePath: 'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/blue.webp',
      secondImagePath: '',
      firstWidth: 4500,
      firstHeight: 3500,
      secondWidth: 4000,
      secondHeight: 1000
    },
    {
      sectionSelector: '.battery-storage',
      canvasId: 'battery-canvas',
      firstImagePath: 'https://naturespark.com.au/images/Green,Blue,Orange-sectionsInPpackages/orange.webp',
      secondImagePath: '',
      firstWidth: 6500,
      firstHeight: 4500,
      secondWidth: 2000,
      secondHeight: 2000
    }
  ];

  // Preload all images (non-blocking)
  const allImagePaths = bannerConfigs.flatMap(config => [config.firstImagePath, config.secondImagePath]);
  preloadImages(allImagePaths);

  // Initialize banners for each grid immediately
  bannerConfigs.forEach(config => {
    initParallaxBanner(
      config.sectionSelector,
      config.canvasId,
      config.firstImagePath,
      config.secondImagePath,
      config.firstWidth,
      config.firstHeight,
      config.secondWidth,
      config.secondHeight
    );
  });
})();
