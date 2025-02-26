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
  { selector: '#solar-package', message: "Are you happy with this package?", key: 'solarPackage' },
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

// ===================== HELPER FUNCTIONS =====================
function getPathPrefix() {
  const path = window.location.pathname;

  if (path.includes('packages.html')) {
    return "../";  // One level up
  } else if (path.includes('dashboard.html')) {
    return "./";   // Current directory
  } else {
    return "/";    // Root directory
  }
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
    if (sectionId === 'system-size-input' ||
        sectionId === 'home-type-input' ||
        sectionId === 'power-supply-input') {
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
  textCloudConfig.forEach(config => {
    const el = document.querySelector(config.selector);
    if (el) {
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      if (Math.abs(elCenter - viewportCenter) < tolerance) {
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

// ===================== INPUT HANDLERS =====================
function handleSystemSizeSelection(value) {
  if (value === "") return;
  selectedSystemSize = value;
  updatePanelPrice();
  document.getElementById('home-type-input').style.display = 'block';
  scrollToSection('home-type-input');
  updatePackageDisplay();
}

function handleHomeTypeSelection(value) {
  if (value === "") return;
  selectedHomeType = value;
  document.getElementById('power-supply-input').style.display = 'block';
  scrollToSection('power-supply-input');
}

function handlePowerSupplySelection(value) {
  if (value === "") return;
  selectedPowerSupply = value;
  scrollToSection('inverters-section');
  updatePackageDisplay();
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
      scrollToSection('system-size-input');
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
      `Panels: ${selectedPanel.name}, Inverter: ${selectedInverter.name}` +
      (selectedBattery ? `, Battery: ${selectedBattery.name}` : '');
    
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
  
  document.getElementById('confirm-selection').addEventListener('click', () => {
    scrollToForm();
  });
  
  document.getElementById('not-interested-btn').addEventListener('click', () => {
    handleNotInterested();
  });
  
  function attachFormSubmitHandler() {
    const packageForm = document.querySelector('.package-form');
    if (packageForm) {
        packageForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(packageForm);

            // Append Panel, Inverter, and Battery Selection
            if (selectedPanel) {
                formData.append('panelSelection', selectedPanel.name);
            }
            if (selectedInverter) {
                formData.append('inverterSelection', selectedInverter.name);
            }
            if (selectedBattery) {
                formData.append('batterySelection', selectedBattery.name);
            }

            // Append System Size, Home Type, and Power Supply Type
            formData.append('systemSize', selectedSystemSize || "Not selected");
            formData.append('homeType', selectedHomeType || "Not selected");
            formData.append('powerSupply', selectedPowerSupply || "Not selected");

            // Append Overall Description
            let description = `Panel: ${selectedPanel ? selectedPanel.name : "Not selected"}, `;
            description += `Inverter: ${selectedInverter ? selectedInverter.name : "Not selected"}, `;
            description += `Battery: ${selectedBattery ? selectedBattery.name : "Not selected"}, `;
            description += `System Size: ${selectedSystemSize}, `;
            description += `Home Type: ${selectedHomeType}, `;
            description += `Power Supply: ${selectedPowerSupply}`;

            formData.append('description', description);

            // Show confirmation message
            showTextCloud("Thank you, your message has been forwarded. Have a nice day.", 4000);

            // Delay submission to allow the message to be read
            setTimeout(() => {
                packageForm.submit(); // Submit the form after 4 seconds
            }, 4000);
        });
    }
}

  
  document.addEventListener('click', (e) => {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    if (modal.style.display === 'block' && e.target === modal) {
      modal.style.display = 'none';
    }
  });
  document.addEventListener('click', (e) => {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    if (e.target.classList.contains('close') || e.target.classList.contains('modal-close')) {
      modal.style.display = 'none';
    }
  });
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