// ===================== GLOBAL VARIABLES =====================
let disableAllScroll = false; // Global kill-switch flag (active only when exactly one missing input remains)
let brandImages = []; // Array for brand images
let missingInputs = []; // Track missing inputs in missing mode

// Product selection globals (for package display and modal)
let selectedPanel = null;
let selectedInverter = null;
let selectedBattery = null;
let selectedSystemSize = ""; // required field
let selectedHomeType = "";   // required field
let selectedPowerSupply = ""; // required field
let hasShownBatteryCloud = false;
let hasShownFormCloud = false;
window.activeTextCloud = null;
// Use window.activeTextCloud directly
if (window.activeTextCloud) {
  clearTimeout(window.activeTextCloud.fadeTimeout);
  clearTimeout(window.activeTextCloud.removeTimeout);
  window.activeTextCloud.remove();
  window.activeTextCloud = null;
}

// Pricing / mapping
const defaultPanels = 15;
const systemPanelsMapping = {
  "6.6kW": 15,
  "10kW": 24,
  "13kW": 30,
  "20kW": 46
};
const extraCharges = { doubleStorey: 250, threePhase: 100 };

// Submission and missing mode flags
let lastButtonClicked = null;       // stores the last clicked submit button
let submissionAttempted = false;    // becomes true when a submit button is clicked

// We'll use this to cancel any scheduled normal scroll.
let defaultScrollTimeout = null;

// ------------------------
// Universal Banner Parallax and Zoom
// ------------------------
// ------------------------
// Universal Banner Parallax (No Zoom)
// ------------------------
function universalParallax() {
  const bannerSection = document.querySelector('.universalBanner');
  const bannerImage = document.querySelector('.universalBanner .banner-image');
  let precomputedValues = [];
  let ticking = false;
  let lastScrollY = 0;

  // Ensure elements exist
  if (!bannerSection || !bannerImage) return;

  // Add CSS to force hardware acceleration
  bannerImage.style.willChange = 'transform';
  bannerImage.style.backfaceVisibility = 'hidden';
  bannerImage.style.transformStyle = 'preserve-3d';

  // Preload the background image
  const preloadImage = new Image();
  preloadImage.src = '../images/universalBanner/Solar-drone-photo-Perth.webp';
  preloadImage.onload = () => {
    console.log('Banner image preloaded');
    precomputeTransformValues();
    requestAnimationFrame(() => updateParallax(window.scrollY));
  };

  // Precompute transform values
  function precomputeTransformValues() {
    const sectionTop = bannerSection.offsetTop;
    const sectionHeight = bannerSection.clientHeight;
    const maxScroll = sectionTop + sectionHeight;
    const step = 10;

    precomputedValues = [];

    for (let scrollY = sectionTop - window.innerHeight; scrollY <= maxScroll; scrollY += step) {
      const progress = Math.min(Math.max((scrollY - sectionTop) / sectionHeight, 0), 1);

      // Parallax effect: Move the image upward by 25% of the section height as you scroll down
      const parallaxY = progress * sectionHeight * 0.25;

      precomputedValues.push({
        scrollY,
        transform: `translate3d(-50%, calc(-50% + ${parallaxY}px), 0)`
      });
    }
  }

  function getPrecomputedTransform(scrollY) {
    let closest = precomputedValues.reduce((prev, curr) =>
      Math.abs(curr.scrollY - scrollY) < Math.abs(prev.scrollY - scrollY) ? curr : prev
    );
    return closest.transform;
  }

  function updateParallax(scrollY) {
    const sectionTop = bannerSection.offsetTop;
    const sectionHeight = bannerSection.clientHeight;
    const windowHeight = window.innerHeight;

    if (scrollY > sectionTop + sectionHeight + windowHeight || scrollY < sectionTop - windowHeight) {
      ticking = false;
      return;
    }

    const transform = getPrecomputedTransform(scrollY);
    bannerImage.style.transform = transform;
    ticking = false;
  }

  function onScroll() {
    lastScrollY = window.scrollY;

    if (!ticking) {
      requestAnimationFrame(() => updateParallax(lastScrollY));
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  window.addEventListener('resize', () => {
    precomputeTransformValues();
    requestAnimationFrame(() => updateParallax(window.scrollY));
  });
}

document.addEventListener('DOMContentLoaded', universalParallax);

// -------------------
// Text Cloud Configuration
// -------------------
const textCloudConfig = [
  { selector: '#panels-section', message: "Choose your panel", key: 'panels' },
  { selector: '#system-size-input', message: "Choose your system size", key: 'systemSize' },
  { selector: '#home-type-input', message: "Choose your house type", key: 'homeType' },
  { selector: '#power-supply-input', message: "Choose your power supply", key: 'powerSupply' },
  { selector: '#inverters-section', message: "Choose your inverter", key: 'inverter' },
  { selector: '#battery-storage', message: "Choose your battery storage", key: 'battery' },
  { selector: '#solar-package', message: "Here’s a glimpse of your future solar package.", key: 'solarPackage' },
  { selector: '.package-form', message: "Fill in your details", key: 'packageForm' }
];
let textCloudFlags = {
  panels: false,
  systemSize: false,
  homeType: false,
  powerSupply: false,
  inverter: false,
  battery: false,
  solarPackage: false,
  packageForm: false
};

// --------------------
// Scroll Functions
// --------------------
function normalScrollToSection(sectionId, offset) {
  const isMissing = missingInputs.some(m => m.id === sectionId);
  if (!isMissing && disableAllScroll && sectionId !== lastButtonClicked?.id) return;
  const section = document.getElementById(sectionId);
  if (section) {
    const topPos = section.offsetTop - offset;
    window.scrollTo({ top: topPos, behavior: 'smooth' });
  }
}

function scrollToSection(sectionId) {
  if (disableAllScroll && sectionId !== lastButtonClicked?.id) return;
  const section = document.getElementById(sectionId);
  if (section) {
    let topPos = section.offsetTop;
    if (["system-size-input", "home-type-input", "power-supply-input"].includes(sectionId)) {
      topPos = section.offsetTop - (window.innerHeight / 2) + (section.offsetHeight / 2);
    }
    window.scrollTo({ top: topPos, behavior: 'smooth' });
  }
}

function scrollToForm() {
  if (disableAllScroll && lastButtonClicked?.id !== "enquire-button") return;
  const formEl = document.querySelector('.package-form');
  if (formEl) {
    const desiredOffset = 300;
    const elementTop = formEl.getBoundingClientRect().top + window.pageYOffset;
    const targetPos = elementTop + desiredOffset;
    window.scrollTo({ top: targetPos, behavior: 'smooth' });
  }
}

function scrollToConfirmButton() {
  if (disableAllScroll && lastButtonClicked?.id !== "confirm-selection") return;
  const btn = document.getElementById("confirm-selection");
  if (btn) btn.scrollIntoView({ behavior: "smooth" });
}

// --------------------
// Standard Helpers
// --------------------
function getPathPrefix() {
  return window.location.pathname.includes('/packages/') ? "../" : "./";
}

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

function preloadImages(images) {
  return new Promise((resolve, reject) => {
    const promises = images.map(image =>
      new Promise((res, rej) => {
        const img = new Image();
        img.src = image.url;
        img.onload = () => res(image.url);
        img.onerror = () => rej(image.url);
      })
    );
    Promise.allSettled(promises).then(results => {
      const failed = results.filter(r => r.status === "rejected");
      failed.length > 0 ? reject(failed.map(item => item.reason).join(", ")) : resolve();
    });
  });
}

// --------------------
// Text Cloud Functions
// --------------------
function showTextCloud(message, duration = 2000, withIcon = false) {
  if (activeTextCloud) {
    clearTimeout(activeTextCloud.fadeTimeout);
    clearTimeout(activeTextCloud.removeTimeout);
    activeTextCloud.remove();
    activeTextCloud = null;
  }
  let iconHTML = withIcon ? `<span class="warning-icon">⚠️</span> ` : "";
  const cloud = document.createElement("div");
  cloud.className = "text-cloud";
  cloud.innerHTML = iconHTML + message;
  cloud.style.opacity = "1";
  document.body.appendChild(cloud);
  activeTextCloud = cloud;
  cloud.fadeTimeout = setTimeout(() => {
    cloud.style.opacity = "0";
    cloud.removeTimeout = setTimeout(() => {
      cloud.remove();
      if (activeTextCloud === cloud) activeTextCloud = null;
    }, 500);
  }, duration);
}

function showCombinedMissingMessage(missingArr) {
  showTextCloud("Missing: " + missingArr.join(", "), 2500, true);
}

function showTextCloudForSection(key) {
  if (!textCloudFlags[key]) {
    const config = textCloudConfig.find(c => c.key === key);
    if (config) {
      showTextCloud(config.message, 3000);
      textCloudFlags[key] = true; // Mark as shown
    }
  }
}

// --------------------
// Intersection Observer for Text Clouds
// --------------------
function setupTextCloudObserver() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -300px 0px', // Shrink the bottom margin by 300px, requiring the section to be 300px lower
    threshold: 0.5 // Trigger when 50% of the section is visible within the adjusted viewport
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log('Section in view:', entry.target.id || entry.target.className);
        console.log('Intersection ratio:', entry.intersectionRatio);
        const config = textCloudConfig.find(c => entry.target.matches(c.selector));
        if (config && !textCloudFlags[config.key]) {
          console.log(`Triggering text cloud for ${config.key} with rootMargin -300px bottom`);
          showTextCloud(config.message, 3000);
          textCloudFlags[config.key] = true;
          console.log(`Text cloud displayed for ${config.key}: ${config.message}`);
        }
      }
    });
  }, observerOptions);

  textCloudConfig.forEach(config => {
    const element = document.querySelector(config.selector);
    if (element) {
      console.log('Observing element:', element.id || element.className);
      observer.observe(element);
    } else {
      console.error('Element not found for selector:', config.selector);
    }
  });
}

// --------------------
// Missing Mode Validator for Select Fields
// --------------------
function getMissingSelectFields() {
  missingInputs = [];
  const sysSelect = document.getElementById("system-size-select");
  const homeSelect = document.getElementById("home-type-select");
  const powerSelect = document.getElementById("power-supply-select");
  
  if (sysSelect && (!sysSelect.value || sysSelect.value.trim() === "")) {
    missingInputs.push({ id: "system-size-input", name: "System Size", element: sysSelect });
  }
  if (homeSelect && (!homeSelect.value || homeSelect.value.trim() === "")) {
    missingInputs.push({ id: "home-type-input", name: "Home Type", element: homeSelect });
  }
  if (powerSelect && (!powerSelect.value || powerSelect.value.trim() === "")) {
    missingInputs.push({ id: "power-supply-input", name: "Power Supply", element: powerSelect });
  }
  return missingInputs.map(input => input.name);
}

// Check missing inputs and handle scrolling
function checkMissingAndMaybeReturn() {
  const missingArr = getMissingSelectFields();
  const currentMissingCount = missingArr.length;

  missingInputs.forEach(input => {
    if (submissionAttempted) {
      input.element.classList.add("missing");
    }
  });
  ["system-size-select", "home-type-select", "power-supply-select"].forEach(id => {
    const el = document.getElementById(id);
    if (el && !missingInputs.some(m => m.element === el)) {
      el.classList.remove("missing");
    }
  });

  if (submissionAttempted) {
    if (currentMissingCount > 1) {
      disableAllScroll = false;
      const nextMissing = missingInputs[0];
      if (defaultScrollTimeout) clearTimeout(defaultScrollTimeout);
      defaultScrollTimeout = setTimeout(() => {
        normalScrollToSection(nextMissing.id, 350);
      }, 1000);
    } else if (currentMissingCount === 1) {
      disableAllScroll = true;
      const lastMissing = missingInputs[0];
      if (defaultScrollTimeout) clearTimeout(defaultScrollTimeout);
      defaultScrollTimeout = setTimeout(() => {
        normalScrollToSection(lastMissing.id, 350);
      }, 1000);
    } else if (currentMissingCount === 0) {
      disableAllScroll = false;
      if (defaultScrollTimeout) clearTimeout(defaultScrollTimeout);
      if (lastButtonClicked) {
        defaultScrollTimeout = setTimeout(() => {
          normalScrollToSection(lastButtonClicked.id, 0);
        }, 500);
      }
    }
  }
}

// --------------------
// Attach auto-return listeners for required selects
// --------------------
function attachAutoReturnListener(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.addEventListener("input", checkMissingAndMaybeReturn);
    field.addEventListener("blur", checkMissingAndMaybeReturn);
  }
}

// --------------------
// Focus/Blur Handlers for Input Fields
// --------------------
function attachFocusHandlers(inputEl, defaultText) {
  if (!inputEl) return;
  inputEl.addEventListener("focus", () => {
    if (inputEl.value === defaultText) inputEl.value = "";
  });
  inputEl.addEventListener("blur", () => {
    if (inputEl.value.trim() === "") inputEl.value = defaultText;
    checkDefaultInputs();
  });
  inputEl.addEventListener("input", checkDefaultInputs);
}

// --------------------
// Input Handlers for Select Fields (Modified for Text Clouds)
// --------------------
function handleSystemSizeSelection(value) {
  if (value === "") return;
  selectedSystemSize = value;
  updatePanelPrice();
  document.getElementById("home-type-input").style.display = "block";
  updatePackageDisplay();
  checkMissingAndMaybeReturn();
  if (!submissionAttempted) {
    normalScrollToSection("home-type-input", 350);
    showTextCloudForSection('homeType'); // Show text cloud for home type
  } else if (missingInputs.length > 1) {
    const nextMissing = missingInputs.find(m => m.id !== "system-size-input");
    if (nextMissing) normalScrollToSection(nextMissing.id, 350);
  } else if (missingInputs.length === 0 && lastButtonClicked) {
    normalScrollToSection(lastButtonClicked.id, 0);
  }
}

function handleHomeTypeSelection(value) {
  if (value === "") return;
  selectedHomeType = value;
  updatePackageDisplay();
  document.getElementById("power-supply-input").style.display = "block";
  updatePackageDisplay();
  checkMissingAndMaybeReturn();
  if (!submissionAttempted) {
    normalScrollToSection("power-supply-input", 360);
    showTextCloudForSection('powerSupply'); // Show text cloud for power supply
  } else if (missingInputs.length > 1) {
    const nextMissing = missingInputs.find(m => m.id !== "home-type-input");
    if (nextMissing) normalScrollToSection(nextMissing.id, 350);
  } else if (missingInputs.length === 0 && lastButtonClicked) {
    normalScrollToSection(lastButtonClicked.id, 0);
  }
}

function handlePowerSupplySelection(value) {
  if (value === "") return;
  selectedPowerSupply = value;
  updatePackageDisplay();
  checkMissingAndMaybeReturn();
  if (!submissionAttempted) {
    normalScrollToSection("inverters-section", 0);
    showTextCloudForSection('inverter'); // Show text cloud for inverter
  } else if (missingInputs.length === 0 && lastButtonClicked) {
    normalScrollToSection(lastButtonClicked.id, 0);
  }
}

// --------------------
// Real-Time Default Checking for Selects
// --------------------
function checkDefaultInputs() {
  const sysSelect = document.getElementById("system-size-select");
  const homeSelect = document.getElementById("home-type-select");
  const powerSelect = document.getElementById("power-supply-select");
  if (sysSelect) {
    if (sysSelect.value.trim() === "" && submissionAttempted) {
      selectedSystemSize = "";
      if (submissionAttempted) sysSelect.classList.add("missing");
    } else {
      selectedSystemSize = sysSelect.value;
      sysSelect.classList.remove("missing");
    }
  }
  if (homeSelect) {
    if (homeSelect.value.trim() === "" && submissionAttempted) {
      selectedHomeType = "";
      if (submissionAttempted) homeSelect.classList.add("missing");
    } else {
      selectedHomeType = homeSelect.value;
      homeSelect.classList.remove("missing");
    }
  }
  if (powerSelect) {
    if (powerSelect.value.trim() === "" && submissionAttempted) {
      selectedPowerSupply = "";
      if (submissionAttempted) powerSelect.classList.add("missing");
    } else {
      selectedPowerSupply = powerSelect.value;
      powerSelect.classList.remove("missing");
    }
  }
  checkMissingAndMaybeReturn();
}

// --------------------
// Package Data Helper Functions
// --------------------
function collectPackageData() {
  const homeTypeMapping = {
    "single": "Single Storey",
    "double": "Double Storey"
  };
  const powerSupplyMapping = {
    "single": "Single-Phase",
    "three": "Three-Phase"
  };
  
  const sysText = selectedSystemSize ? selectedSystemSize : "Not selected";
  const homeText = homeTypeMapping[selectedHomeType] || "Not selected";
  const powerText = powerSupplyMapping[selectedPowerSupply] || "Not selected";
  let batteryLine = "Not selected";
  if (selectedBattery) {
    batteryLine = `<strong>${selectedBattery.name}</strong> ${selectedBattery.specs}`;
  }
  return `
    <ul class="package-summary-list">
      <li>Panel: <strong>${selectedPanel ? selectedPanel.name : "Not selected"}</strong></li>
      <li>Inverter: <strong>${selectedInverter ? selectedInverter.name : "Not selected"}</strong></li>
      <li>Battery: <strong>${batteryLine}</strong></li>
      <li>System Size: <strong>${sysText}</strong></li>
      <li>House Type: <strong>${homeText}</strong></li>
      <li>Power Supply: <strong>${powerText}</strong></li>
      <br>
    </ul>
  `;
}

function updateFormSummary() {
  const formEl = document.querySelector(".package-form");
  if (formEl) {
    let summaryEl = document.getElementById("package-summary");
    if (!summaryEl) {
      summaryEl = document.createElement("div");
      summaryEl.id = "package-summary";
      const firstGroup = formEl.querySelector(".form-group");
      formEl.insertBefore(summaryEl, firstGroup);
    }
    summaryEl.innerHTML = collectPackageData();
  }
}

// --------------------
// Validate Form Details
// --------------------
function validateFormDetails() {
  const fullNameField = document.getElementById("fullName");
  const mobileField = document.getElementById("mobilePhone");
  const emailField = document.getElementById("email");
  const addressField = document.getElementById("installationAddress");
  const messageField = document.getElementById("message");
  let missing = [];

  if (!fullNameField || fullNameField.value.trim() === "") {
    missing.push("Full Name");
  }
  if (!mobileField || mobileField.value.trim() === "") {
    missing.push("Mobile Phone");
  } else {
    let mVal = mobileField.value.trim().replace(/\s/g, "");
    if (!/^\d+$/.test(mVal)) {
      missing.push("Valid Mobile Number");
    }
  }
  if (!emailField || emailField.value.trim() === "") {
    missing.push("Email");
  } else if (!emailField.value.includes("@")) {
    missing.push("Valid Email");
  }
  if (!addressField || addressField.value.trim() === "") {
    missing.push("Installation Address");
  }
  if (!messageField || messageField.value.trim() === "") {
    missing.push("Message");
  }

  if (missing.length > 0) {
    showTextCloud("Please fill in: " + missing.join(", "), 3000, true);
    return false;
  }
  return true;
}

// --------------------
// Brand Carousel and Product Functions
// --------------------
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

const solarProducts = {
  panels: [
    {
      id: 1,
      name: "Canadian Solar 400W",
      brand: "Canadian Solar",
      specs: "400W Mono PERC",
      country: "Canada",
      warranty: "25 years",
      datasheet: "canadian-400w.pdf",
      image: "../images/Panels/Canadian-Solar-440-W.webp",
      price: 1500,
      popularity: 3,
      description: "Solar panel description goes here..."
    },
    {
      id: 2,
      name: "Trina Solar 410W",
      brand: "Trina",
      specs: "410W Mono PERC",
      country: "China",
      warranty: "25 years",
      datasheet: "trina-410w.pdf",
      image: "../images/Panels/Trina.webp",
      price: 1560,
      popularity: 5,
      description: "Solar panel description goes here..."
    }
  ],
  inverters: [
    {
      id: 1,
      name: "Fronius Primo 5.0",
      brand: "Fronius",
      specs: "5kW Single Phase",
      country: "Austria",
      warranty: "10 years",
      datasheet: "fronius-primo.pdf",
      image: "../images/Inverters/FroniusSymo.webp",
      price: 1200,
      popularity: 4,
      description: "Inverter description goes here..."
    },
    {
      id: 2,
      name: "SMA Sunny Boy 5.0",
      brand: "SMA",
      specs: "5kW Single Phase",
      country: "Germany",
      warranty: "10 years",
      datasheet: "sma-sunny-boy.pdf",
      image: "../images/Inverters/SMA.webp",
      price: 1150,
      popularity: 2,
      description: "Inverter description goes here..."
    }
  ],
  batteries: [
    {
      id: 1,
      name: "Tesla Powerwall",
      brand: "Tesla",
      specs: "13.5 kWh",
      country: "USA",
      warranty: "10 years",
      datasheet: "tesla-powerwall.pdf",
      image: "https://switchtecsolutions.com.au/wp-content/uploads/2024/08/powerwall-2.png.webp",
      price: 8000,
      popularity: 5,
      description: "Battery storage system description..."
    }
  ]
};

function createProductCard(product, type) {
  const card = document.createElement("div");
  card.className = "product-card product";
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name} Solar Product">
    <h3>${product.name}</h3>
    <p>Specs: ${product.specs}</p>
    <p>Country: ${product.country}</p>
    <p>Datasheet: <a href="${product.datasheet}" target="_blank">Download</a></p>
    <button class="read-more-btn" data-type="${type}" data-id="${product.id}">Read More</button>
  `;
  card.querySelector(".read-more-btn").addEventListener("click", handleModalOpen);
  card.addEventListener("click", (e) => {
    if (e.target.classList.contains("read-more-btn")) return;
    if (type === "panel") {
      document.querySelectorAll("#panels-grid .product-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedPanel = product;
      document.getElementById("system-size-input").style.display = "block";
      normalScrollToSection("system-size-input", 350);
      showTextCloudForSection('systemSize');
    } else if (type === "inverter") {
      document.querySelectorAll("#inverters-grid .product-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedInverter = product;
      scrollToSection("battery-storage");
      showTextCloudForSection('battery');
    } else if (type === "battery") {
      document.querySelectorAll("#battery-grid .product-card").forEach(c => c.classList.remove("selected-battery"));
      card.classList.add("selected-battery");
      selectedBattery = product;
      showSolarPackageSection();
      showTextCloudForSection('solarPackage');
    }
    updatePackageDisplay();
  });
  return card;
}

function handleModalOpen(e) {
  e.preventDefault();
  const type = e.target.dataset.type;
  const id = parseInt(e.target.dataset.id);
  let product;
  if (type === "panel") {
    product = solarProducts.panels.find(p => p.id === id);
  } else if (type === "inverter") {
    product = solarProducts.inverters.find(p => p.id === id);
  } else if (type === "battery") {
    product = solarProducts.batteries.find(p => p.id === id);
  }
  if (!product) return;
  const brand = brandImages.find(b => b.name.toLowerCase() === product.brand.toLowerCase());
  const brandLogoUrl = brand ? brand.url : "";
  const logoClass = type === "panel" ? "brand-logo-panel" : (type === "inverter" ? "brand-logo-inverter" : "brand-logo-battery");
  const modal = document.getElementById("product-modal");
  document.querySelector(".modal-product-image").innerHTML = `
    <div class="product-image-container">
      <img src="${product.image}" alt="${product.name}" class="main-product-image">
      ${brandLogoUrl ? `<img src="${brandLogoUrl}" alt="${product.brand}" class="${logoClass}">` : ""}
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
  modal.style.display = "block";
}

function updatePanelPrice() {
  if (selectedPanel) {
    const pricePerPanel = selectedPanel.price / defaultPanels;
    const numPanels = systemPanelsMapping[selectedSystemSize] || 15;
    const updatedPrice = pricePerPanel * numPanels;
    const panelPriceElem = document.getElementById("panel-price");
    if (panelPriceElem) {
      panelPriceElem.textContent = `Price: $${updatedPrice}`;
    }
  }
}

function updatePackageDisplay() {
  const panelImage = document.getElementById("selected-panel-image");
  const inverterImage = document.getElementById("selected-inverter-image");
  const batteryImage = document.getElementById("selected-battery-image");
  const packageDesc = document.getElementById("package-description");
  const confirmBtn = document.getElementById("confirm-selection");

  let panelLogo = document.getElementById("panel-logo");
  let inverterLogo = document.getElementById("inverter-logo");
  if (!panelLogo) {
    panelLogo = document.createElement("img");
    panelLogo.id = "panel-logo";
    panelLogo.classList.add("logo-overlay");
    panelImage.parentNode.appendChild(panelLogo);
  }
  if (!inverterLogo) {
    inverterLogo = document.createElement("img");
    inverterLogo.id = "inverter-logo";
    inverterLogo.classList.add("logo-overlay");
    inverterImage.parentNode.appendChild(inverterLogo);
  }
  
  if (selectedPanel) {
    panelImage.src = selectedPanel.image;
    panelImage.style.visibility = "visible";
    const pBrand = brandImages.find(b => b.name.toLowerCase() === selectedPanel.brand.toLowerCase());
    if (pBrand) {
      panelLogo.src = pBrand.url;
      panelLogo.style.visibility = "visible";
    } else {
      panelLogo.style.visibility = "hidden";
    }
  }
  if (selectedInverter) {
    inverterImage.src = selectedInverter.image;
    inverterImage.style.visibility = "visible";
    const iBrand = brandImages.find(b => b.name.toLowerCase() === selectedInverter.brand.toLowerCase());
    if (iBrand) {
      inverterLogo.src = iBrand.url;
      inverterLogo.style.visibility = "visible";
    } else {
      inverterLogo.style.visibility = "hidden";
    }
  }
  if (selectedBattery) {
    batteryImage.src = selectedBattery.image;
    batteryImage.style.visibility = "visible";
    const container = document.getElementById("panel-inverter-container");
    let batteryLogo = document.getElementById("battery-logo");
    if (!batteryLogo) {
      batteryLogo = document.createElement("img");
      batteryLogo.id = "battery-logo";
      batteryLogo.classList.add("logo-overlay", "brand-logo-battery");
      container.appendChild(batteryLogo);
    }
    batteryLogo.src = getPathPrefix() + "images/BrandLogos/Tesla.webp";
    batteryLogo.style.visibility = "visible";
    document.getElementById("image-combination").classList.add("with-battery");
  } else {
    batteryImage.style.visibility = "hidden";
    let batteryLogo = document.getElementById("battery-logo");
    if (batteryLogo) batteryLogo.style.visibility = "hidden";
    document.getElementById("image-combination").classList.remove("with-battery");
  }
  
  if (selectedPanel && selectedInverter) {
    let desc = `My installation will consist of <strong>${selectedPanel.name}</strong> panels and <strong>${selectedInverter.name}</strong> inverter`;
    if (selectedBattery) desc += ` and <strong>${selectedBattery.name}</strong> battery storage system.`;
    packageDesc.innerHTML = desc;
    document.getElementById("solar-package-input").value =
      `Panels: ${selectedPanel.name}\nInverter: ${selectedInverter.name}` +
      (selectedBattery ? `\nBattery: ${selectedBattery.name}` : "");
    
    const pricePerPanel = selectedPanel.price / defaultPanels;
    const numPanels = systemPanelsMapping[selectedSystemSize] || 15;
    const panelCost = numPanels * pricePerPanel;
    const inverterCost = selectedInverter.price;
    const batteryCost = selectedBattery ? selectedBattery.price : 0;
    let extraCost = 0;
    if (selectedHomeType && selectedHomeType.toLowerCase().includes("double"))
      extraCost += extraCharges.doubleStorey;
    if (selectedPowerSupply && selectedPowerSupply.toLowerCase().includes("three"))
      extraCost += extraCharges.threePhase;
    const total = panelCost + inverterCost + batteryCost + extraCost;
    document.getElementById("total-cost").textContent = `Total = $${total} AUD`;
    confirmBtn.style.visibility = "visible";
  } else {
    packageDesc.textContent = "";
    confirmBtn.style.visibility = "hidden";
  }
  
  if (document.getElementById("package-summary"))
    updateFormSummary();
}

function showSolarPackageSection() {
  const sec = document.getElementById("solar-package");
  if (selectedPanel && selectedInverter) {
    sec.style.display = "block";
    scrollToSolarPackage(-30);
  }
}

function scrollToSolarPackage(offset = 0) {
  if (disableAllScroll) return;
  const sec = document.getElementById("solar-package");
  if (sec) {
    const topPos = sec.offsetTop - offset;
    window.scrollTo({ top: topPos, behavior: "smooth" });
  }
}

function handleNotInterested() {
  selectedBattery = null;
  updatePackageDisplay();
  showSolarPackageSection();
}

function updateSolarPackageInput() {
  let details = "";
  if (selectedPanel) details += `Panels: ${selectedPanel.name}\n`;
  if (selectedInverter) details += `Inverter: ${selectedInverter.name}\n`;
  if (selectedBattery) details += `Battery: ${selectedBattery.name}\n`;
  if (selectedSystemSize) details += `System Size: ${selectedSystemSize}\n`;
  if (selectedHomeType) details += `House Type: ${selectedHomeType}\n`;
  if (selectedPowerSupply) details += `Power Supply: ${selectedPowerSupply}\n`;
  const input = document.getElementById("solar-package-input");
  if (input) input.value = details;
}

// --------------------
// Final Initialization
// --------------------
document.addEventListener("DOMContentLoaded", function() {
  initializeBrandImages();
  if (document.getElementById("brands")) {
    initializeBrandSlider(".brand-card", "#brands");
  }
  if (document.getElementById("solar-logo-cards-container")) {
    initializeBrandSlider(".solar-brand-card", "#solar-logo-cards-container");
  }
  preloadImages(brandImages)
    .then(() => console.log("All brand images have been progressively loaded."))
    .catch((error) => console.error("Error preloading images:", error));
  
  updatePackageDisplay();
  
  const panelsGrid = document.getElementById("panels-grid");
  const invertersGrid = document.getElementById("inverters-grid");
  const batteryGrid = document.getElementById("battery-grid");
  
  solarProducts.panels.forEach(panel => panelsGrid.appendChild(createProductCard(panel, "panel")));
  solarProducts.inverters.forEach(inv => invertersGrid.appendChild(createProductCard(inv, "inverter")));
  if (solarProducts.batteries) {
    solarProducts.batteries.forEach(bat => batteryGrid.appendChild(createProductCard(bat, "battery")));
  }
  document.getElementById("solar-package").style.display = "none";
  
  // Attach listeners to select elements
  const sysSelect = document.getElementById("system-size-select");
  const homeSelect = document.getElementById("home-type-select");
  const powerSelect = document.getElementById("power-supply-select");
  
  if (sysSelect) {
    attachFocusHandlers(sysSelect, "Choose size");
    sysSelect.addEventListener("change", (e) => {
      handleSystemSizeSelection(e.target.value);
      checkDefaultInputs();
      updatePackageDisplay();
    });
    attachAutoReturnListener("system-size-select");
  }
  if (homeSelect) {
    attachFocusHandlers(homeSelect, "Choose your house type");
    homeSelect.addEventListener("change", (e) => {
      handleHomeTypeSelection(e.target.value);
      checkDefaultInputs();
      updatePackageDisplay();
    });
    attachAutoReturnListener("home-type-select");
  }
  if (powerSelect) {
    attachFocusHandlers(powerSelect, "Choose power supply");
    powerSelect.addEventListener("change", (e) => {
      handlePowerSupplySelection(e.target.value);
      checkDefaultInputs();
      updatePackageDisplay();
    });
    attachAutoReturnListener("power-supply-select");
  }
  
  setupTextCloudObserver();
  
  function markSubmissionAttempt() {
    submissionAttempted = true;
  }
  
  document.getElementById("confirm-selection").addEventListener("click", function() {
    lastButtonClicked = this;
    markSubmissionAttempt();
    checkDefaultInputs();
    const missing = getMissingSelectFields();
    if (missing.length > 0) {
      showCombinedMissingMessage(missing);
      checkMissingAndMaybeReturn();
    } else {
      updateFormSummary();
      scrollToForm();
    }
  });
  
  document.getElementById("enquire-button").addEventListener("click", function(e) {
    e.preventDefault();
    lastButtonClicked = this;
    markSubmissionAttempt();
    checkDefaultInputs();
    const missing = getMissingSelectFields();
    if (missing.length > 0) {
      showCombinedMissingMessage(missing);
      checkMissingAndMaybeReturn();
    } else {
      updateFormSummary();
      updateSolarPackageInput();
      if (!validateFormDetails()) return;
      showTextCloud("Thank you, your message has been forwarded. Have a nice day.", 4000, false);
      setTimeout(() => { submissionAttempted = false; }, 4500);
      scrollToConfirmButton();
      const form = document.querySelector(".package-form");
      if (form) {
        const formData = new FormData(form);
        fetch(form.action, {
          method: form.method,
          headers: { "Accept": "application/json" },
          body: formData
        }).then(response => {
          if (response.ok) console.log("Message sent successfully via enquire-button.");
          else console.error("Error sending message via enquire-button.");
        }).catch(err => console.error("Error submitting form:", err));
      }
    }
  });
  
  document.getElementById("not-interested-btn").addEventListener("click", () => {
    handleNotInterested();
  });
  
  (function addBatteryOnlyButton() {
    const batterySec = document.getElementById("battery-storage");
    const notIntBtn = document.getElementById("not-interested-btn");
    if (batterySec && notIntBtn) {
      let btnContainer = batterySec.querySelector(".button-container");
      if (!btnContainer) {
        btnContainer = document.createElement("div");
        btnContainer.className = "button-container";
        batterySec.insertBefore(btnContainer, notIntBtn);
      }
      if (!btnContainer.contains(notIntBtn)) {
        btnContainer.appendChild(notIntBtn);
      }
      const batteryOnly = document.createElement("a");
      batteryOnly.id = "battery-only-btn";
      batteryOnly.href = "./battery-only.html";
      batteryOnly.textContent = "Battery only";
      btnContainer.appendChild(batteryOnly);
    }
  })();
  
  document.addEventListener("click", (e) => {
    const modal = document.getElementById("product-modal");
    if (modal && modal.style.display === "block" && e.target === modal) {
      modal.style.display = "none";
    }
  });
  document.addEventListener("click", (e) => {
    const modal = document.getElementById("product-modal");
    if (modal && (e.target.classList.contains("close") || e.target.classList.contains("modal-close"))) {
      modal.style.display = "none";
    }
  });
});

// --------------------
// Filter Bar Sorting for Solar Products
// --------------------
function sortProducts(type, criteria) {
  const grid = document.getElementById(type === "panel" ? "panels-grid" : "inverters-grid");
  let products = [...solarProducts[type + "s"]];
  if (criteria === "expensive") {
    products.sort((a, b) => b.price - a.price);
  } else if (criteria === "cheap") {
    products.sort((a, b) => a.price - b.price);
  } else if (criteria === "popular") {
    products.sort((a, b) => b.popularity - a.popularity);
  }
  grid.innerHTML = "";
  products.forEach(product => grid.appendChild(createProductCard(product, type)));
}
document.getElementById("panel-filter").addEventListener("change", function() {
  sortProducts("panel", this.value);
});
document.getElementById("inverter-filter").addEventListener("change", function() {
  sortProducts("inverter", this.value);
});