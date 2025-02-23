// ===================== GLOBAL VARIABLES =====================
let brandImages = []; // Array for brand images

// Product selection globals (for package display and modal)
let selectedPanel = null;
let selectedInverter = null;
let selectedBattery = null;
let selectedSystemSize = "6.6kW"; // default system size

// Default panels count (price is defined for 15 panels)
const defaultPanels = 15;

// Mapping for number of panels per system size
const systemPanelsMapping = {
  "6.6kW": 15,
  "10kW": 24,
  "13kW": 30,
  "20kW": 46
};

// Flags for text cloud messages
let panelMessageShown = false;
let systemSizeMessageShown = false;
let inverterMessageShown = false;
let batteryMessageShown = false;
let solarPackageMessageShown = false; // For "Are you happy with this package?" cloud
let packageFormMessageShown = false;  // For "Fill in your details" on the package form

// ===================== HELPER FUNCTIONS =====================

// getPathPrefix: For packages.html (inside /packages/) return "../", for index.html (in root) return ""
function getPathPrefix() {
  const path = window.location.pathname;
  return path.includes('packages.html') ? "../" : "";
}

// Initialize brandImages using the appropriate prefix
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

// Preload images function (returns a promise)
// Progressive loading: this preloads images in the background without blocking carousel startup.
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

// Smooth scroll to a section by its ID
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    let topPosition = section.offsetTop;
    if (sectionId === 'system-size-input') {
      topPosition = section.offsetTop - (window.innerHeight / 2) + (section.offsetHeight / 2);
    }
    window.scrollTo({
      top: topPosition,
      behavior: 'smooth'
    });
  }
}

// Smooth scroll to package form
function scrollToForm() {
  const packageForm = document.querySelector('.package-form');
  if (packageForm) {
    window.scrollTo({
      top: packageForm.offsetTop - 50,
      behavior: 'smooth'
    });
  }
}

// Show a temporary text cloud message
function showTextCloud(message, duration = 2000) {
  const cloud = document.createElement('div');
  cloud.className = 'text-cloud';
  cloud.textContent = message;
  cloud.style.opacity = '1';
  document.body.appendChild(cloud);
  setTimeout(() => {
    cloud.style.opacity = '0';
    setTimeout(() => {
      cloud.remove();
    }, 500);
  }, duration);
}

// ===================== BRAND CAROUSEL & PROGRESSIVE LOADING =====================

function initializeBrandSlider(cardSelector, containerSelector) {
  const brandCards = document.querySelectorAll(cardSelector);
  if (brandCards.length === 0) return; // Exit if no brand cards exist

  let currentIndex = 0;

  // Update the brand cards with images from brandImages.
  function updateBrandCards() {
    brandCards.forEach((card, i) => {
      const imgIndex = (currentIndex + i) % brandImages.length;
      const brandImage = brandImages[imgIndex];
      const imgElement = card.querySelector('img');
      if (imgElement) {
        imgElement.src = brandImage.url;
        imgElement.alt = brandImage.name;
      }
      // For a fade-in effect, remove then add the active class.
      card.classList.remove('active');
      setTimeout(() => card.classList.add('active'), 50);
    });
  }

  // Cycle to the next set of images.
  function cycleBrands() {
    brandCards.forEach(card => card.classList.remove('active'));
    setTimeout(() => {
      currentIndex = (currentIndex + 4) % brandImages.length;
      updateBrandCards();
    }, 500);
  }

  // Start cycling every 5 seconds.
  let brandInterval = setInterval(cycleBrands, 5000);

  // Pause cycling on hover.
  const container = document.querySelector(containerSelector);
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(brandInterval));
    container.addEventListener('mouseleave', () => {
      brandInterval = setInterval(cycleBrands, 5000);
    });
  }

  // Initialize images immediately.
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
      if (!systemSizeMessageShown) {
        showTextCloud("Choose your system size", 2000);
        systemSizeMessageShown = true;
      }
      scrollToSection('system-size-input');
    } else if (type === 'inverter') {
      document.querySelectorAll('#inverters-grid .product-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedInverter = product;
      scrollToSection('battery-storage');
    } else if (type === 'battery') {
      document.querySelectorAll('#battery-grid .product-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
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

function handleSystemSizeSelection(value) {
  if (value === "") return;
  selectedSystemSize = value;
  updatePanelPrice();
  scrollToSection('inverters-section');
  if (!inverterMessageShown) {
    showTextCloud("Choose your inverter", 2000);
    inverterMessageShown = true;
  }
  updatePackageDisplay();
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
    const total = panelCost + inverterCost + batteryCost;
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
    showTextCloud("Are you happy with this package?", 2000);
  }
}

function handleNotInterested() {
  selectedBattery = null;
  updatePackageDisplay();
  showSolarPackageSection();
}

// ===================== OBSERVERS =====================

function initObservers() {
  const panelsSection = document.getElementById('panels-section');
  const systemSizeSection = document.getElementById('system-size-input');
  const invertersSection = document.getElementById('inverters-section');
  const batterySection = document.getElementById('battery-storage');
  const solarPackageSection = document.getElementById('solar-package');
  const observerOptions = { threshold: 0.5 };
  
  const panelsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !panelMessageShown) {
        showTextCloud("Choose your panel", 2000);
        panelMessageShown = true;
      } else if (!entry.isIntersecting) {
        panelMessageShown = false;
      }
    });
  }, observerOptions);
  if (panelsSection) panelsObserver.observe(panelsSection);
  
  const systemSizeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !systemSizeMessageShown) {
        showTextCloud("Choose your system size", 2000);
        systemSizeMessageShown = true;
      } else if (!entry.isIntersecting) {
        systemSizeMessageShown = false;
      }
    });
  }, observerOptions);
  if (systemSizeSection) systemSizeObserver.observe(systemSizeSection);
  
  const invertersObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !inverterMessageShown) {
        showTextCloud("Choose your inverter", 2000);
        inverterMessageShown = true;
      } else if (!entry.isIntersecting) {
        inverterMessageShown = false;
      }
    });
  }, observerOptions);
  if (invertersSection) invertersObserver.observe(invertersSection);
  
  const batteryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !batteryMessageShown) {
        showTextCloud("Choose your battery storage", 2000);
        batteryMessageShown = true;
      } else if (!entry.isIntersecting) {
        batteryMessageShown = false;
      }
    });
  }, observerOptions);
  if (batterySection) batteryObserver.observe(batterySection);
  
  const solarPackageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !solarPackageMessageShown) {
        showTextCloud("Are you happy with this package?", 2000);
        solarPackageMessageShown = true;
      } else if (!entry.isIntersecting) {
        solarPackageMessageShown = false;
      }
    });
  }, observerOptions);
  if (solarPackageSection) solarPackageObserver.observe(solarPackageSection);

  // Observer for the package form: Show "Fill in your details" and reset on scroll
  const packageForm = document.querySelector('.package-form');
  if (packageForm) {
    const packageFormObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !packageFormMessageShown) {
          showTextCloud("Fill in your details", 2000);
          packageFormMessageShown = true;
        } else if (!entry.isIntersecting) {
          packageFormMessageShown = false;
        }
      });
    }, observerOptions);
    packageFormObserver.observe(packageForm);
  }
}

// ===================== FINAL INITIALIZATION =====================
document.addEventListener('DOMContentLoaded', function() {
  // Initialize brand images and start progressive loading for the carousel.
  initializeBrandImages();
  
  // Progressive loading: Start the carousel immediately.
  if (document.getElementById('brands')) {
    initializeBrandSlider('.brand-card', '#brands');
  }
  if (document.getElementById('solar-logo-cards-container')) {
    initializeBrandSlider('.solar-brand-card', '#solar-logo-cards-container');
  }
  
  // Also, preload brand images in the background.
  preloadImages(brandImages)
    .then(() => {
      console.log('All brand images have been progressively loaded.');
    })
    .catch((error) => {
      console.error('Error preloading some brand images:', error);
    });
  
  updatePackageDisplay();
  initObservers();
  
  const panelsGrid = document.getElementById('panels-grid');
  const invertersGrid = document.getElementById('inverters-grid');
  const batteryGrid = document.getElementById('battery-grid');
  
  solarProducts.panels.forEach(panel => panelsGrid.appendChild(createProductCard(panel, 'panel')));
  solarProducts.inverters.forEach(inverter => invertersGrid.appendChild(createProductCard(inverter, 'inverter')));
  if (solarProducts.batteries) {
    solarProducts.batteries.forEach(battery => batteryGrid.appendChild(createProductCard(battery, 'battery')));
  }
  
  // Initially hide the solar package section.
  document.getElementById('solar-package').style.display = 'none';
  
  // "Let's enquire!" button: when clicked, show text cloud and scroll to the package form.
  document.getElementById('confirm-selection').addEventListener('click', () => {
    showTextCloud("Fill in your details", 2000);
    scrollToForm();
  });
  
  // "Not Interested" button: resets battery selection and updates display.
  document.getElementById('not-interested-btn').addEventListener('click', () => {
    handleNotInterested();
  });
  
  // When package form is submitted, show final cloud message then submit.
  const packageForm = document.querySelector('.package-form');
  if (packageForm) {
    packageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showTextCloud("Thank you, your message has been forwarded. Have a nice day.", 4000);
      setTimeout(() => {
        packageForm.submit();
      }, 4000);
    });
  }
  
  // Modal closing: close when clicking outside modal content or on a close element.
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
