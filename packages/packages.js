// ===================== GLOBAL VARIABLES =====================
let brandImages = []; // Array for brand images

// Product selection globals (for package display and modal)
let selectedPanel = null;
let selectedInverter = null;
let selectedBattery = null;
let selectedSystemSize = "6.6kW"; // default system size
let selectedHomeType = "";       // User's home type selection
let selectedPowerSupply = "";    // User's power supply selection

// Default panels count (price is defined for 15 panels)
const defaultPanels = 15;

// Mapping for number of panels per system size
const systemPanelsMapping = {
  "6.6kW": 15,
  "10kW": 24,
  "13kW": 30,
  "20kW": 46
};

// Extra charges object for surcharges (editable later)
const extraCharges = {
  doubleStorey: 250,  // Additional cost for double storey home
  threePhase: 100     // Additional cost for three-phase power supply
};

// -------------------
// Text Cloud Configuration
// -------------------
const textCloudConfig = [
  { selector: '#panels-section', message: "Choose your panel", key: 'panels' },
  { selector: '#system-size-input', message: "Choose your system size", key: 'systemSize' },
  { selector: '#home-type-input', message: "Is your home single or double-storey?", key: 'homeType' },
  { selector: '#power-supply-input', message: "Is your power single-phase or three-phase?", key: 'powerSupply' },
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
let activeTextCloud = null;
let isAutoScrolling = false;

// --------------------
// Helper: Scroll with Custom Offset
// --------------------
function scrollToSectionWithOffset(sectionId, offset) {
  const section = document.getElementById(sectionId);
  if (section) {
    const topPosition = section.offsetTop - offset;
    window.scrollTo({ top: topPosition, behavior: 'smooth' });
  }
}

// ===================== HELPER FUNCTIONS =====================
function getPathPrefix() {
  const path = window.location.pathname;
  return path.includes('/packages/') ? "../" : "./";
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
        img.onerror = () => {
          console.error(`Failed to preload image: ${image.url}`);
          rej(image.url);
        };
      })
    );
    Promise.allSettled(promises)
      .then(results => {
        const failed = results.filter(result => result.status === "rejected");
        failed.length > 0 ? reject(failed.map(item => item.reason).join(', ')) : resolve();
      });
  });
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    let topPosition = section.offsetTop;
    if (["system-size-input", "home-type-input", "power-supply-input"].includes(sectionId)) {
      topPosition = section.offsetTop - (window.innerHeight / 2) + (section.offsetHeight / 2);
    }
    isAutoScrolling = true;
    window.scrollTo({ top: topPosition, behavior: 'smooth' });
    setTimeout(() => { isAutoScrolling = false; }, 1000);
  }
}

function scrollToForm() {
  const packageForm = document.querySelector('.package-form');
  if (packageForm) {
    isAutoScrolling = true;
    window.scrollTo({ top: packageForm.offsetTop - 50, behavior: 'smooth' });
    setTimeout(() => { isAutoScrolling = false; }, 1000);
  }
}

function showTextCloud(message, duration = 2000) {
  if (activeTextCloud) {
    clearTimeout(activeTextCloud.fadeTimeout);
    clearTimeout(activeTextCloud.removeTimeout);
    activeTextCloud.remove();
    activeTextCloud = null;
  }
  const cloud = document.createElement('div');
  cloud.className = 'text-cloud';
  cloud.textContent = message;
  cloud.style.opacity = '1';
  document.body.appendChild(cloud);
  activeTextCloud = cloud;
  cloud.fadeTimeout = setTimeout(() => {
    cloud.style.opacity = '0';
    cloud.removeTimeout = setTimeout(() => {
      cloud.remove();
      if (activeTextCloud === cloud) { activeTextCloud = null; }
    }, 500);
  }, duration);
}

function checkTextClouds() {
  const tolerance = 100;
  const viewportCenter = window.innerHeight / 2;
  // Adjust this value to change when the inverters text cloud triggers
  const inverterExtraOffset = 300;  // Increase this value to trigger lower
  
  textCloudConfig.forEach(config => {
    const el = document.querySelector(config.selector);
    if (el) {
      const rect = el.getBoundingClientRect();
      let triggerPoint;
      if (config.selector === '#inverters-section') {
        triggerPoint = rect.top + inverterExtraOffset;
      } else {
        triggerPoint = rect.top + rect.height / 2;
      }
      if (Math.abs(triggerPoint - viewportCenter) < tolerance) {
        if (!textCloudFlags[config.key]) {
          showTextCloud(config.message, 2000);
          textCloudFlags[config.key] = true;
        }
      } else {
        textCloudFlags[config.key] = false;
      }
    }
  });
}
window.addEventListener('scroll', checkTextClouds);
checkTextClouds();


// ===================== PACKAGE DATA HELPER FUNCTIONS =====================
function collectPackageData() {
  const systemSizeText = selectedSystemSize ? `${selectedSystemSize} system` : "Not selected";
  const homeTypeText = selectedHomeType 
    ? (selectedHomeType.toLowerCase() === 'single' ? "Single storey household" 
       : selectedHomeType.toLowerCase() === 'double' ? "Double storey household" 
       : selectedHomeType)
    : "Not selected";
  const powerSupplyText = selectedPowerSupply 
    ? (selectedPowerSupply.toLowerCase() === 'single' ? "Single-phase power supply (1 phase)" 
       : selectedPowerSupply.toLowerCase() === 'three' ? "Three-phase power supply (3 phase)" 
       : selectedPowerSupply)
    : "Not selected";
  
  // Battery line: name and specs on one line
  let batteryLine = "Not selected";
  if (selectedBattery) {
    batteryLine = `<strong>${selectedBattery.name}</strong> <strong>${selectedBattery.specs}</strong>`;
  }
  
  return `
    <ul class="package-summary-list">
      <li>Panel: <strong>${selectedPanel ? selectedPanel.name : "Not selected"}</strong></li>
      <li>Inverter: <strong>${selectedInverter ? selectedInverter.name : "Not selected"}</strong></li>
      <li>Battery: ${batteryLine}</li>
      <li>System Size: <strong>${systemSizeText}</strong></li>
      <li>Home Type: <strong>${homeTypeText}</strong></li>
      <li>Power Supply: <strong>${powerSupplyText}</strong></li>
      <br>
    </ul>
  `;
}

function updateFormSummary() {
  const packageForm = document.querySelector('.package-form');
  if (packageForm) {
    let packageSummary = document.getElementById('package-summary');
    if (!packageSummary) {
      packageSummary = document.createElement('div');
      packageSummary.id = 'package-summary';
      const firstFormGroup = packageForm.querySelector('.form-group');
      packageForm.insertBefore(packageSummary, firstFormGroup);
    }
    packageSummary.innerHTML = collectPackageData();
  }
}

// ---------------------
// REAL‑TIME DEFAULT CHECKING (for select elements)
// ---------------------
function checkDefaultInputs() {
  const systemSizeSelect = document.getElementById('system-size-select');
  const homeTypeSelect = document.getElementById('home-type-select');
  const powerSupplySelect = document.getElementById('power-supply-select');

  if (systemSizeSelect) {
    if (systemSizeSelect.value.trim() === "") {
      selectedSystemSize = "";
      systemSizeSelect.classList.add('missing');
    } else {
      selectedSystemSize = systemSizeSelect.value;
      systemSizeSelect.classList.remove('missing');
    }
  }
  if (homeTypeSelect) {
    if (homeTypeSelect.value.trim() === "") {
      selectedHomeType = "";
      homeTypeSelect.classList.add('missing');
    } else {
      selectedHomeType = homeTypeSelect.value;
      homeTypeSelect.classList.remove('missing');
    }
  }
  if (powerSupplySelect) {
    if (powerSupplySelect.value.trim() === "") {
      selectedPowerSupply = "";
      powerSupplySelect.classList.add('missing');
    } else {
      selectedPowerSupply = powerSupplySelect.value;
      powerSupplySelect.classList.remove('missing');
    }
  }
}

// ---------------------
// FOCUS / BLUR HANDLERS FOR DEFAULT TEXT (if needed)
// ---------------------
function attachFocusHandlers(inputEl, defaultText) {
  if (!inputEl) return;
  inputEl.addEventListener('focus', () => {
    if (inputEl.value === defaultText) {
      inputEl.value = "";
    }
  });
  inputEl.addEventListener('blur', () => {
    if (inputEl.value.trim() === "") {
      inputEl.value = defaultText;
    }
    checkDefaultInputs();
  });
}

// ===================== INPUT HANDLERS =====================
function handleSystemSizeSelection(value) {
  if (value === "") return;
  selectedSystemSize = value;
  updatePanelPrice();
  document.getElementById('home-type-input').style.display = 'block';
  // Scroll to Home Type container with offset 320
  scrollToSectionWithOffset('home-type-input', 320);
  updatePackageDisplay();
}

function handleHomeTypeSelection(value) {
  if (value === "") return;
  selectedHomeType = value;
  updatePackageDisplay();
  document.getElementById('power-supply-input').style.display = 'block';
  // Scroll to Power Supply container with offset 300
  scrollToSectionWithOffset('power-supply-input', 300);
}

function handlePowerSupplySelection(value) {
  if (value === "") return;
  selectedPowerSupply = value;
  updatePackageDisplay();
  // Once Power Supply is selected, delay a bit then scroll to the Inverters section with an offset of 400
  setTimeout(() => {
    scrollToSectionWithOffset('inverters-section', 0);
  }, 300);
}

// ===================== BRAND CAROUSEL & PROGRESSIVE LOADING =====================
function initializeBrandSlider(cardSelector, containerSelector) {
  const brandCards = document.querySelectorAll(cardSelector);
  if (!brandCards.length) return;
  let currentIndex = 0;
  function updateBrandCards() {
    brandCards.forEach((card, i) => {
      const imgIndex = (currentIndex + i) % brandImages.length;
      const brandImage = brandImages[imgIndex];
      const imgElement = card.querySelector('img');
      if (imgElement) {
        imgElement.src = brandImage.url;
        imgElement.alt = brandImage.name;
      }
      card.classList.remove('active');
      setTimeout(() => card.classList.add('active'), 50);
    });
  }
  function cycleBrands() {
    brandCards.forEach(card => card.classList.remove('active'));
    setTimeout(() => {
      currentIndex = (currentIndex + 4) % brandImages.length;
      updateBrandCards();
    }, 500);
  }
  let brandInterval = setInterval(cycleBrands, 5000);
  const container = document.querySelector(containerSelector);
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(brandInterval));
    container.addEventListener('mouseleave', () => {
      brandInterval = setInterval(cycleBrands, 5000);
    });
  }
  updateBrandCards();
  setTimeout(() => {
    brandCards.forEach(card => card.classList.add('active'));
  }, 500);
}

// ===================== PACKAGE & MODAL FUNCTIONS =====================
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
      image: "../images/Inverters/FroniusSymo.png",
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
      image: "../images/Inverters/SMA.png",
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
  const card = document.createElement('div');
  card.className = 'product-card product';
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name} Solar Product">
    <h3>${product.name}</h3>
    <p>Specs: ${product.specs}</p>
    <p>Country: ${product.country}</p>
    <p>Datasheet: <a href="${product.datasheet}" target="_blank">Download</a></p>
    <button class="read-more-btn" data-type="${type}" data-id="${product.id}">Read More</button>
  `;
  card.querySelector('.read-more-btn').addEventListener('click', handleModalOpen);
  card.addEventListener('click', (e) => {
    if (e.target.classList.contains('read-more-btn')) return;
    if (type === 'panel') {
      document.querySelectorAll('#panels-grid .product-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedPanel = product;
      document.getElementById('system-size-input').style.display = 'block';
      // Scroll to System Size container with offset 340
      scrollToSectionWithOffset('system-size-input', 340);
    } else if (type === 'inverter') {
      document.querySelectorAll('#inverters-grid .product-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedInverter = product;
      scrollToSection('battery-storage');
    } else if (type === 'battery') {
      document.querySelectorAll('#battery-grid .product-card').forEach(c => c.classList.remove('selected-battery'));
      card.classList.add('selected-battery');
      selectedBattery = product;
      showSolarPackageSection();
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
  if (type === 'panel') {
    product = solarProducts.panels.find(p => p.id === id);
  } else if (type === 'inverter') {
    product = solarProducts.inverters.find(p => p.id === id);
  } else if (type === 'battery') {
    product = solarProducts.batteries.find(p => p.id === id);
  }
  if (!product) return;
  const brand = brandImages.find(b => b.name.toLowerCase() === product.brand.toLowerCase());
  const brandLogoUrl = brand ? brand.url : '';
  const logoClass = type === 'panel'
    ? 'brand-logo-panel'
    : (type === 'inverter' ? 'brand-logo-inverter' : 'brand-logo-battery');
  const modal = document.getElementById('product-modal');
  document.querySelector('.modal-product-image').innerHTML = `
    <div class="product-image-container">
      <img src="${product.image}" alt="${product.name}" class="main-product-image">
      ${brandLogoUrl ? `<img src="${brandLogoUrl}" alt="${product.brand}" class="${logoClass}">` : ''}
    </div>
  `;
  document.querySelector('.modal-product-details').innerHTML = `
    <h2>${product.name}</h2>
    <p><strong>Brand Name:</strong> ${product.brand}</p>
    <p><strong>Specifications:</strong> ${product.specs}</p>
    <p><strong>Country:</strong> ${product.country}</p>
    <p><strong>Warranty:</strong> ${product.warranty}</p>
    <p><strong>Datasheet:</strong> <a href="${product.datasheet}" target="_blank">Download</a></p>
    <p><strong>Product Description:</strong> ${product.description}</p>
  `;
  modal.style.display = 'block';
}

function updatePanelPrice() {
  if (selectedPanel) {
    const pricePerPanel = selectedPanel.price / defaultPanels;
    const numPanels = systemPanelsMapping[selectedSystemSize] || 15;
    const updatedPrice = pricePerPanel * numPanels;
    const panelPriceElem = document.getElementById('panel-price');
    if (panelPriceElem) {
      panelPriceElem.textContent = `Price: $${updatedPrice}`;
    }
  }
}

function updatePackageDisplay() {
  const panelImage = document.getElementById('selected-panel-image');
  const inverterImage = document.getElementById('selected-inverter-image');
  const batteryImage = document.getElementById('selected-battery-image');
  const packageDescription = document.getElementById('package-description');
  const confirmButton = document.getElementById('confirm-selection');

  let panelLogo = document.getElementById('panel-logo');
  let inverterLogo = document.getElementById('inverter-logo');

  if (!panelLogo) {
    panelLogo = document.createElement('img');
    panelLogo.id = 'panel-logo';
    panelLogo.classList.add('logo-overlay');
    panelImage.parentNode.appendChild(panelLogo);
  }
  if (!inverterLogo) {
    inverterLogo = document.createElement('img');
    inverterLogo.id = 'inverter-logo';
    inverterLogo.classList.add('logo-overlay');
    inverterImage.parentNode.appendChild(inverterLogo);
  }

  if (selectedPanel) {
    panelImage.src = selectedPanel.image;
    panelImage.style.visibility = 'visible';
    const panelBrand = brandImages.find(brand => brand.name.toLowerCase() === selectedPanel.brand.toLowerCase());
    if (panelBrand) {
      panelLogo.src = panelBrand.url;
      panelLogo.style.visibility = 'visible';
    } else {
      panelLogo.style.visibility = 'hidden';
    }
  }

  if (selectedInverter) {
    inverterImage.src = selectedInverter.image;
    inverterImage.style.visibility = 'visible';
    const inverterBrand = brandImages.find(brand => brand.name.toLowerCase() === selectedInverter.brand.toLowerCase());
    if (inverterBrand) {
      inverterLogo.src = inverterBrand.url;
      inverterLogo.style.visibility = 'visible';
    } else {
      inverterLogo.style.visibility = 'hidden';
    }
  }

  if (selectedBattery) {
    batteryImage.src = selectedBattery.image;
    batteryImage.style.visibility = 'visible';
    const panelInverterContainer = document.getElementById('panel-inverter-container');
    let batteryLogo = document.getElementById('battery-logo');
    if (!batteryLogo) {
      batteryLogo = document.createElement('img');
      batteryLogo.id = 'battery-logo';
      batteryLogo.classList.add('logo-overlay', 'brand-logo-battery');
      panelInverterContainer.appendChild(batteryLogo);
    }
    batteryLogo.src = getPathPrefix() + "images/BrandLogos/Tesla.webp";
    batteryLogo.style.visibility = 'visible';
    document.getElementById('image-combination').classList.add('with-battery');
  } else {
    batteryImage.style.visibility = 'hidden';
    let batteryLogo = document.getElementById('battery-logo');
    if (batteryLogo) {
      batteryLogo.style.visibility = 'hidden';
    }
    document.getElementById('image-combination').classList.remove('with-battery');
  }

  if (selectedPanel && selectedInverter) {
    let description = `My installation will consist of <strong>${selectedPanel.name}</strong> panels and <strong>${selectedInverter.name}</strong> inverter`;
    if (selectedBattery) {
      description += ` and <strong>${selectedBattery.name}</strong> battery storage system.`;
    }
    packageDescription.innerHTML = description;
    document.getElementById('solar-package-input').value =
      `Panels: ${selectedPanel.name}\nInverter: ${selectedInverter.name}` +
      (selectedBattery ? `\nBattery: ${selectedBattery.name}` : '');
    
    const pricePerPanel = selectedPanel.price / defaultPanels;
    const numPanels = systemPanelsMapping[selectedSystemSize] || 15;
    const panelCost = numPanels * pricePerPanel;
    const inverterCost = selectedInverter.price;
    const batteryCost = selectedBattery ? selectedBattery.price : 0;
    let extraCost = 0;
    if (selectedHomeType && selectedHomeType.toLowerCase().includes("double")) {
      extraCost += extraCharges.doubleStorey;
    }
    if (selectedPowerSupply && selectedPowerSupply.toLowerCase().includes("three")) {
      extraCost += extraCharges.threePhase;
    }
    const total = panelCost + inverterCost + batteryCost + extraCost;
    document.getElementById('total-cost').textContent = `Total = $${total} AUD`;
    
    confirmButton.style.visibility = 'visible';
  } else {
    packageDescription.textContent = '';
    confirmButton.style.visibility = 'hidden';
  }
  
  if (document.getElementById('package-summary')) {
    updateFormSummary();
  }
}

function showSolarPackageSection() {
  const solarPackageSection = document.getElementById('solar-package');
  if (selectedPanel && selectedInverter) {
    solarPackageSection.style.display = 'block';
    scrollToSection('solar-package');
  }
}

function handleNotInterested() {
  selectedBattery = null;
  updatePackageDisplay();
  showSolarPackageSection();
}

// ---------------------
// Function to scroll to the confirm-selection button with offset 300
function scrollToConfirmButton() {
  const confirmBtn = document.getElementById('confirm-selection');
  if (confirmBtn) {
    window.scrollTo({ top: confirmBtn.offsetTop - 300, behavior: 'smooth' });
  }
}

// ---------------------
// Function to update the hidden input with consolidated details
function updateSolarPackageInput() {
  let details = "";
  if (selectedPanel) {
    details += `Panels: ${selectedPanel.name}\n`;
  }
  if (selectedInverter) {
    details += `Inverter: ${selectedInverter.name}\n`;
  }
  if (selectedBattery) {
    details += `Battery: ${selectedBattery.name}\n`;
  }
  if (selectedSystemSize) {
    details += `System Size: ${selectedSystemSize}\n`;
  }
  if (selectedHomeType) {
    details += `Home Type: ${selectedHomeType}\n`;
  }
  if (selectedPowerSupply) {
    details += `Power Supply: ${selectedPowerSupply}\n`;
  }
  const solarPackageInput = document.getElementById('solar-package-input');
  if (solarPackageInput) {
    solarPackageInput.value = details;
  }
}

// ===================== FINAL INITIALIZATION =====================
document.addEventListener('DOMContentLoaded', function() {
  initializeBrandImages();
  
  if (document.getElementById('brands')) {
    initializeBrandSlider('.brand-card', '#brands');
  }
  if (document.getElementById('solar-logo-cards-container')) {
    initializeBrandSlider('.solar-brand-card', '#solar-logo-cards-container');
  }
  
  preloadImages(brandImages)
    .then(() => console.log('All brand images have been progressively loaded.'))
    .catch((error) => console.error('Error preloading some brand images:', error));
  
  updatePackageDisplay();
  
  const panelsGrid = document.getElementById('panels-grid');
  const invertersGrid = document.getElementById('inverters-grid');
  const batteryGrid = document.getElementById('battery-grid');
  
  solarProducts.panels.forEach(panel => panelsGrid.appendChild(createProductCard(panel, 'panel')));
  solarProducts.inverters.forEach(inverter => invertersGrid.appendChild(createProductCard(inverter, 'inverter')));
  if (solarProducts.batteries) {
    solarProducts.batteries.forEach(battery => batteryGrid.appendChild(createProductCard(battery, 'battery')));
  }
  
  document.getElementById('solar-package').style.display = 'none';
  
  // Attach listeners to select elements (using their actual IDs)
  const systemSizeSelect = document.getElementById('system-size-select');
  const homeTypeSelect = document.getElementById('home-type-select');
  const powerSupplySelect = document.getElementById('power-supply-select');
  
  if (systemSizeSelect) {
    attachFocusHandlers(systemSizeSelect, "Choose size");
    systemSizeSelect.addEventListener('input', () => { checkDefaultInputs(); updatePackageDisplay(); });
    systemSizeSelect.addEventListener('change', () => { checkDefaultInputs(); updatePackageDisplay(); });
  }
  if (homeTypeSelect) {
    attachFocusHandlers(homeTypeSelect, "Choose your home type");
    homeTypeSelect.addEventListener('input', () => { checkDefaultInputs(); updatePackageDisplay(); });
    homeTypeSelect.addEventListener('change', () => { checkDefaultInputs(); updatePackageDisplay(); });
  }
  if (powerSupplySelect) {
    attachFocusHandlers(powerSupplySelect, "Choose power supply");
    powerSupplySelect.addEventListener('input', () => { checkDefaultInputs(); updatePackageDisplay(); });
    powerSupplySelect.addEventListener('change', () => { checkDefaultInputs(); updatePackageDisplay(); });
  }
  
  // Confirm Selection button handler:
  document.getElementById('confirm-selection').addEventListener('click', function() {
    checkDefaultInputs();
    let missingField = null;
    if (!selectedSystemSize) {
      missingField = { element: document.getElementById('system-size-input'), label: 'System Size' };
    } else if (!selectedHomeType) {
      missingField = { element: document.getElementById('home-type-input'), label: 'Home Type' };
    } else if (!selectedPowerSupply) {
      missingField = { element: document.getElementById('power-supply-input'), label: 'Power Supply' };
    }
    if (missingField) {
      let offset = 50;
      if (missingField.label === "System Size") offset = 340;
      else if (missingField.label === "Home Type") offset = 320;
      else if (missingField.label === "Power Supply") offset = 300;
      showTextCloud("Please complete all selections before confirming. Missing: " + missingField.label, 2000);
      if (missingField.element) {
        setTimeout(() => {
          window.scrollTo({
            top: missingField.element.offsetTop - offset,
            behavior: 'smooth'
          });
        }, 3500);
      }
    } else {
      updateFormSummary();
      // Once all inputs are complete, scroll to the confirm button so it sits near the center.
      scrollToConfirmButton();
    }
  });
  
  document.getElementById('not-interested-btn').addEventListener('click', () => {
    handleNotInterested();
  });
  
  (function addBatteryOnlyButton() {
    const batterySection = document.getElementById('battery-storage');
    const notInterestedBtn = document.getElementById('not-interested-btn');
    if (batterySection && notInterestedBtn) {
      let buttonContainer = batterySection.querySelector('.button-container');
      if (!buttonContainer) {
        buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        batterySection.insertBefore(buttonContainer, notInterestedBtn);
      }
      if (!buttonContainer.contains(notInterestedBtn)) {
        buttonContainer.appendChild(notInterestedBtn);
      }
      const batteryOnlyBtn = document.createElement('a');
      batteryOnlyBtn.id = 'battery-only-btn';
      batteryOnlyBtn.href = "./battery-only.html";
      batteryOnlyBtn.textContent = 'Battery only';
      buttonContainer.appendChild(batteryOnlyBtn);
    }
  })();
  
  document.addEventListener('click', (e) => {
    const modal = document.getElementById('product-modal');
    if (modal && modal.style.display === 'block' && e.target === modal) {
      modal.style.display = 'none';
    }
  });
  document.addEventListener('click', (e) => {
    const modal = document.getElementById('product-modal');
    if (modal && (e.target.classList.contains('close') || e.target.classList.contains('modal-close'))) {
      modal.style.display = 'none';
    }
  });
  
  const packageForm = document.querySelector('.package-form');
  if (packageForm) {
    packageForm.addEventListener('submit', function(e) {
      if (!selectedPanel || !selectedInverter || !selectedSystemSize || !selectedHomeType || !selectedPowerSupply) {
        e.preventDefault();
        showTextCloud("Please complete all selections before submitting the form.", 3000);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      e.preventDefault();
      updateSolarPackageInput();
      
      const systemSizeText = selectedSystemSize ? `${selectedSystemSize} system` : "Not selected";
      const homeTypeText = selectedHomeType 
        ? (selectedHomeType.toLowerCase() === 'single' ? "Single storey household" 
           : selectedHomeType.toLowerCase() === 'double' ? "Double storey household" 
           : selectedHomeType)
        : "Not selected";
      const powerSupplyText = selectedPowerSupply 
        ? (selectedPowerSupply.toLowerCase() === 'single' ? "Single-phase power supply (1 phase)" 
           : selectedPowerSupply.toLowerCase() === 'three' ? "Three-phase power supply (3 phase)" 
           : selectedPowerSupply)
        : "Not selected";
      const descriptionText = `Panel: ${selectedPanel ? selectedPanel.name : "Not selected"}, Inverter: ${selectedInverter ? selectedInverter.name : "Not selected"}, Battery: ${selectedBattery ? selectedBattery.name : "Not selected"}, System Size: ${systemSizeText}, Home Type: ${homeTypeText}, Power Supply: ${powerSupplyText}`;
      document.getElementById('solar-package-input').value = descriptionText;
      showTextCloud("Thank you, your message has been forwarded. Have a nice day.", 4000);
      const formData = new FormData(packageForm);
      fetch(packageForm.action, {
        method: packageForm.method,
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      }).then(response => {
        if (response.ok) {
          console.log("Message sent successfully.");
        } else {
          console.error("Error in sending message.");
        }
      }).catch(error => {
        console.error("Error submitting form:", error);
      });
    });
  }
});

// -------------------------
// FILTER BAR SORTING FOR SOLAR PRODUCTS
// -------------------------
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
