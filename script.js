
document.addEventListener('DOMContentLoaded', () => {
  const heroSection = document.querySelector('.hero-section');
  const heroImage = document.querySelector('.hero-image img');
  let lastScroll = 0;

  // Manually set the dimensions of the image
  const imageWidth = 4000;  // Set to your desired width (e.g., 6000px)
  const imageHeight = 1000; // Set to your desired height (e.g., 3000px)

  // Set the image to the desired size
  heroImage.style.width = `${imageWidth}px`;
  heroImage.style.height = `${imageHeight}px`;

  // Update parallax function
  function updateParallax() {
    const scrollY = window.scrollY;
    const sectionTop = heroSection.offsetTop;
    const sectionHeight = heroSection.clientHeight;
    
    // Only animate when section is visible
    if (scrollY > sectionTop + sectionHeight || scrollY < sectionTop) return;

    // Calculate parallax movement (25% of scroll distance)
    const progress = (scrollY - sectionTop) / sectionHeight;
    const parallaxY = progress * sectionHeight * 0.25;

    // Apply the parallax transform
    heroImage.style.transform = `
        translate3d(-50%, calc(-50% + ${parallaxY}px), 0)
    `;

    requestAnimationFrame(updateParallax);
  }

  // Initialize parallax on scroll
  window.addEventListener('scroll', () => {
    if (Math.abs(window.scrollY - lastScroll) > 2) {
        requestAnimationFrame(updateParallax);
        lastScroll = window.scrollY;
    }
  });
});


// Function to preload images before they are used - for sliders in packages html and index.
function preloadImages(images) {
  return new Promise((resolve) => {
    const promises = images.map(image => {
      return new Promise((res, rej) => {
        const img = new Image();
        img.src = image.url;  // Ensure we use 'url' instead of 'path'
        img.onload = () => res(image.url);
        img.onerror = () => {
          console.error(`Failed to preload image: ${image.url}`);
          rej(image.url);
        };
      });
    });

    Promise.allSettled(promises).then(() => resolve()); // Ensures function completes even with failures
  });
}


// Preload Facebook Timelines when the page is loaded
function preloadFBTimelines() {
  const wrappers = document.querySelectorAll('.fb-page-wrapper');

  wrappers.forEach(wrapper => {
    // Trigger XFBML parsing on page load to preload Facebook timelines
    if (typeof FB !== 'undefined' && !wrapper.classList.contains('fb-parsed')) {
      FB.XFBML.parse(wrapper);
      wrapper.classList.add('fb-parsed'); // Mark as parsed to prevent re-parsing
    }
  });
}

// Initialize all functions
function initAll() {
    revealButtons();
    revealServices();
    revealCards();
    revealArticles();
    revealFBTimelines();
    preloadFBTimelines();  // Preload Facebook timelines
}

// Event Listeners (REPLACES ALL OTHERS)
window.addEventListener('load', initAll);
window.addEventListener('scroll', handleScroll, { passive: true });

// Combined Scroll Handler with Throttling
let lastCall = 0;
let timeout;

function handleScroll() {
    const now = Date.now();
    if (now - lastCall < 100) return; // Throttle to 10fps
    lastCall = now;

    // Throttle the revealFBTimelines function to prevent constant re-parsing
    if (timeout) {
        clearTimeout(timeout); // Clear the previous timeout if any
    }

    timeout = setTimeout(() => {
        // Use requestAnimationFrame to optimize rendering
        requestAnimationFrame(() => {
            revealButtons();
            revealServices();
            revealCards();
            revealArticles();
            revealFBTimelines(); // Facebook timelines reveal logic
        });
    }, 100); // Delay the execution of FB.XFBML.parse to 100ms (adjust as needed)
}

// =================================================================
// REVEAL FUNCTIONS (KEEP THESE AS IS)
// =================================================================

// BRANDS CARDS REVEAL BOUNCE EFFECT
function revealCards() {
  const cards = document.querySelectorAll('.brand-card');
  const triggerBottom = window.innerHeight * 0.9;

  cards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      card.classList.toggle('active', cardTop < triggerBottom);
  });
}

// FANCY BUTTONS REVEAL EFFECT
function revealButtons() {
  const buttons = document.querySelectorAll('.fancy-button');
  const triggerBottom = window.innerHeight * 0.8;

  buttons.forEach(button => {
      const buttonTop = button.getBoundingClientRect().top;
      const isRevealed = buttonTop < triggerBottom;
      button.classList.toggle('revealed', isRevealed);

      // Ensure pointer events are always enabled when revealed
      if (isRevealed) {
          button.style.pointerEvents = 'auto';
      }
  });
}

// Handle clicks properly
document.querySelectorAll('.fancy-button').forEach(button => {
  button.addEventListener('click', function (event) {
      const url = this.getAttribute('href');

      if (this.classList.contains('mirror-left')) {
          // If it's the "Browse Solar Packages" button → open in new tab
          event.preventDefault();
          setTimeout(() => {
              window.open(url, '_blank', 'noopener,noreferrer');
          }, 100); // Small delay to prevent blocking
      } else {
          // "Solar Savings Calculator" opens normally
          window.location.href = url;
      }
  });

  // Fix for Safari/Chrome requiring second tap
  button.addEventListener('touchend', function (event) {
      event.preventDefault(); // Prevent weird behavior
      this.click(); // Force immediate action on first tap
  }, { passive: false });
});

// Run reveal effect on scroll
window.addEventListener('scroll', revealButtons);
document.addEventListener('DOMContentLoaded', revealButtons);


// ARTICLE REVEAL EFFECT
function revealArticles() {
  const articles = document.querySelectorAll('.article-card');
  const triggerBottom = window.innerHeight * 0.8; // 80% of the window height

  articles.forEach((article, index) => {
      const articleTop = article.getBoundingClientRect().top;

      // If the article is in view, add the 'revealed' class and apply staggered effect
      if (articleTop < triggerBottom) {
          setTimeout(() => {
              article.classList.add('revealed');
          }, index * 200); // 200ms stagger
      } else {
          // If the article is out of view, remove the 'revealed' class
          article.classList.remove('revealed');
      }
  });
}

// LEARN REVEAL EFFECT //
// Learn Card Reveal Effect
function revealLearnCards() {
  const learnCards = document.querySelectorAll('.learn-card');
  const triggerBottom = window.innerHeight * 0.8;

  learnCards.forEach((card, index) => {
      const cardTop = card.getBoundingClientRect().top;
      if (cardTop < triggerBottom) {
          setTimeout(() => {
              card.classList.add('revealed');
          }, index * 200); // 200ms stagger for a smooth animation
      } else {
          card.classList.remove('revealed'); // Reset when out of view
      }
  });
}

// Trigger the reveal effect on scroll
window.addEventListener('scroll', revealLearnCards);

// Initial call to display the reveal effect when the page loads
revealLearnCards();


// REVEAL SERVICES SECTIONS - Packages.html (inverter and panels reveal)
function revealServices() {
  const services = document.querySelectorAll('.service-category');
  const products = document.querySelectorAll('.product');
  const triggerBottom = window.innerHeight * 0.8;

  services.forEach(service => {
      const serviceTop = service.getBoundingClientRect().top;
      const isActive = serviceTop < triggerBottom;
      service.classList.toggle('active', isActive);

      service.querySelectorAll('.product').forEach((product, index) => {
          product.classList.toggle('revealed', isActive);
      });
  });

  products.forEach(product => {
      product.classList.toggle('revealed', 
          product.getBoundingClientRect().top < triggerBottom
      );
  });

  // REVEAL UNIQUE SERVICE PRODUCT EFFECT (specific to #unique-services)
function revealUniqueServices() {
  const products = document.querySelectorAll('#unique-services .unique-service-product'); // Scoped to #unique-services
  const triggerBottom = window.innerHeight * 0.8;

  products.forEach((product, index) => {
      const productTop = product.getBoundingClientRect().top;
      const isActive = productTop < triggerBottom;
      const revealDirection = product.getAttribute('data-reveal-direction');
      const delay = parseFloat(product.getAttribute('data-reveal-delay')) || 0;

      if (isActive) {
          setTimeout(() => {
              product.classList.add('revealed');
              // Add specific direction-based reveal
              product.style.transform = revealDirection === 'right' ? 'translateX(0)' : 'translateX(0)';
          }, delay * 200); // 200ms stagger
      } else {
          product.classList.remove('revealed');
          // Reset position based on direction
          product.style.transform = revealDirection === 'right' ? 'translateX(100px)' : 'translateX(-100px)'; // Reset position
      }
  });
}

// Trigger reveal effect on scroll
window.addEventListener('scroll', revealUniqueServices);

// Initial call to display the reveal effect when the page loads
revealUniqueServices();


// Trigger reveal effect on scroll
window.addEventListener('scroll', revealUniqueServices);

// Initial call to display the reveal effect when the page loads
revealUniqueServices();

}


// ARTICLE REVEAL EFFECT
function revealArticles() {
  const articles = document.querySelectorAll('.article-card');
  const triggerBottom = window.innerHeight * 0.8;

  articles.forEach((article, index) => {
      const articleTop = article.getBoundingClientRect().top;
      if (articleTop < triggerBottom) {
          setTimeout(() => {
              article.classList.add('revealed');
          }, index * 200); // 200ms stagger
      } else {
          article.classList.remove('revealed'); // Reset when out of view
      }
  });
}

// Ensure to trigger the reveal on page load and on scroll
window.addEventListener('load', revealArticles);
window.addEventListener('scroll', revealArticles);


// FACEBOOK TIMELINE REVEAL
function revealFBTimelines() {
  const wrappers = document.querySelectorAll('.fb-page-wrapper');
  const triggerBottom = window.innerHeight * 0.9;

  wrappers.forEach(wrapper => {
      const top = wrapper.getBoundingClientRect().top;
      
      // Toggle visibility based on scroll position
      wrapper.classList.toggle('revealed', top < triggerBottom);
      
      // Ensure Facebook XFBML parsing only happens once when the element comes into view
      if (top < triggerBottom && typeof FB !== 'undefined' && !wrapper.classList.contains('fb-parsed')) {
          FB.XFBML.parse(wrapper);
          wrapper.classList.add('fb-parsed'); // Prevent re-parsing
      }
  });
}

//Navigation Dropdown menu/sumbenu//

document.addEventListener('DOMContentLoaded', function() {
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  
  // Toggle href attributes based on viewport
  const toggleHrefs = () => {
      document.querySelectorAll('.dropdown > a').forEach(toggle => {
          if (mediaQuery.matches) {
              // Store original href and disable navigation
              toggle.dataset.originalHref = toggle.href;
              toggle.href = 'javascript:void(0);';
          } else {
              // Restore original href
              if (toggle.dataset.originalHref) {
                  toggle.href = toggle.dataset.originalHref;
              }
          }
      });
  };

  // Initial href setup
  toggleHrefs();

  // Toggle mobile menu
  if (mobileMenu && navLinks) {
      mobileMenu.addEventListener('click', (e) => {
          e.stopPropagation();
          navLinks.classList.toggle('active');
      });
  }

  // Handle dropdown toggles
  document.querySelectorAll('.dropdown > a').forEach(toggle => {
      toggle.addEventListener('click', function(e) {
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

  // Handle submenu items
  document.querySelectorAll('.dropdown-content a').forEach(link => {
      link.addEventListener('click', () => {
          if (mediaQuery.matches) {
              closeAllDropdowns();
              navLinks.classList.remove('active');
          }
      });
  });

  // Close all menus when clicking outside
  document.addEventListener('click', function(e) {
      if (!e.target.closest('.nav-links')) {
          closeAllDropdowns();
          navLinks.classList.remove('active');
      }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
      toggleHrefs(); // Update hrefs on resize
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

// Toggler
document.addEventListener('DOMContentLoaded', function() {
    const menuToggler = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-logg');

    // Toggle menu
    if(menuToggler) {
        menuToggler.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent this click from triggering document click
            this.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
    }

    // Close menu when clicking anywhere outside
    document.addEventListener('click', function(e) {
        if(!e.target.closest('.nav-logg') && !e.target.closest('#mobile-menu')) {
            menuToggler.classList.remove('open');
            navLinks.classList.remove('open');
        }
    });

    // Close menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggler.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });
});


let brandImages = []; // Global array for brand images

// Global variables for selections
let selectedPanel = null;
let selectedInverter = null;
let selectedBattery = null;
let selectedSystemSize = "6.6kW"; // default system size

// Default panels count (price is defined for 15 panels)
const defaultPanels = 15;

// Flags for text cloud messages
let panelMessageShown = false;
let systemSizeMessageShown = false;
let inverterMessageShown = false;
let batteryMessageShown = false;

// Function to get path prefix dynamically
function getPathPrefix() {
  const path = window.location.pathname;
  return path.includes('packages.html') ? './' : '../';
}

// Initialize brandImages array
function initializeBrandImages() {
  const prefix = getPathPrefix();
  brandImages = [
    { name: 'Trina', url: `${prefix}images/BrandLogos/Trina-Solar.png` },
    { name: 'SMA', url: `${prefix}images/BrandLogos/SMA.png` },
    { name: 'Canadian Solar', url: `${prefix}images/BrandLogos/Canadian-Solar.png` },
    { name: 'DaSolar', url: `${prefix}images/BrandLogos/DaSolar.png` },
    { name: 'Fronius', url: `${prefix}images/BrandLogos/Fronius.png` },
    { name: 'Growatt', url: `${prefix}images/BrandLogos/Growatt.png` },
    { name: 'Huawei/iStore', url: `${prefix}images/BrandLogos/Huawei.png` },
    { name: 'JASolar', url: `${prefix}images/BrandLogos/JASolar.png` },
    { name: 'Goodwe', url: `${prefix}images/BrandLogos/Goodwe.jpg` },
    { name: 'Jinko', url: `${prefix}images/BrandLogos/Jinko.png` },
    { name: 'Longi', url: `${prefix}images/BrandLogos/Longi.png` },
    { name: 'Risen', url: `${prefix}images/BrandLogos/Risen-Solar.png` },
    { name: 'Seraphim', url: `${prefix}images/BrandLogos/Seraphim.png` },
    { name: 'Sofar', url: `${prefix}images/BrandLogos/Sofar.png` },
    { name: 'SolarEdge', url: `${prefix}images/BrandLogos/Solar-Edge.png` },
    { name: 'Solis', url: `${prefix}images/BrandLogos/Solis.png` },
    { name: 'Sungrow', url: `${prefix}images/BrandLogos/Sungrow.png` },
    { name: 'EgingPV', url: `${prefix}images/BrandLogos/EgingPV.png` },
    { name: 'QCells', url: `${prefix}images/BrandLogos/QCells.png` }
  ];
}

// Preload images
function preloadImages(images) {
  return new Promise((resolve, reject) => {
    const promises = images.map(image => {
      return new Promise((res, rej) => {
        const img = new Image();
        img.src = image.url;
        img.onload = () => res(image.url);
        img.onerror = () => {
          console.error(`Failed to preload image: ${image.url}`);
          rej(image.url);
        };
      });
    });
    Promise.allSettled(promises)
      .then(results => {
        const failed = results.filter(result => result.status === "rejected");
        failed.length > 0 ? reject(failed.map(item => item.reason).join(', ')) : resolve();
      });
  });
}

// Product Data Array
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
      price: 1500, // Price for 15 panels
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

// Create product card (price line removed)
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

// Handle system size selection; scroll to inverters section when an option is selected
function handleSystemSizeSelection(value) {
  if(value === "") return; // do nothing if "Choose size" is selected
  selectedSystemSize = value;
  scrollToSection('inverters-section');
  if (!inverterMessageShown) {
    showTextCloud("Choose your inverter", 2000);
    inverterMessageShown = true;
  }
}

// Update package display (images, logos, description, total cost)
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
    
    let batteryLogo = document.getElementById('battery-logo');
    if (!batteryLogo) {
      batteryLogo = document.createElement('img');
      batteryLogo.id = 'battery-logo';
      batteryLogo.classList.add('logo-overlay');
      batteryImage.parentNode.appendChild(batteryLogo);
    }
    const batteryBrand = brandImages.find(brand => brand.name.toLowerCase() === selectedBattery.brand.toLowerCase());
    if (batteryBrand) {
      batteryLogo.src = batteryBrand.url;
      batteryLogo.style.visibility = 'visible';
    } else {
      batteryLogo.style.visibility = 'hidden';
    }
  } else {
    batteryImage.style.visibility = 'hidden';
    let batteryLogo = document.getElementById('battery-logo');
    if (batteryLogo) {
      batteryLogo.style.visibility = 'hidden';
    }
  }
  
  if (selectedPanel && selectedInverter) {
    let description = `My installation will consist of <strong>${selectedPanel.name}</strong> panels, <strong>${selectedInverter.name}</strong> inverter`;
    if (selectedBattery) {
      description += ` and <strong>${selectedBattery.name}</strong> battery storage system.`;
    }
    packageDescription.innerHTML = description;
    document.getElementById('solar-package-input').value =
      `Panels: ${selectedPanel.name}, Inverter: ${selectedInverter.name}` +
      (selectedBattery ? `, Battery: ${selectedBattery.name}` : '');
    
    // Total cost calculation:
    const pricePerPanel = selectedPanel.price / defaultPanels;
    const systemPanels = { "6.6kW": 15, "10kW": 24, "13kW": 30, "20kW": 46 }[selectedSystemSize];
    const panelCost = systemPanels * pricePerPanel;
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

// Show the solar package section, scroll to it, and ask user if happy with package
function showSolarPackageSection() {
  const solarPackageSection = document.getElementById('solar-package');
  if (selectedPanel && selectedInverter) {
    solarPackageSection.style.display = 'block';
    scrollToSection('solar-package');
    showTextCloud("Are you happy with this package?", 4000);
  }
}

// Handle "Not Interested" for battery: resets battery selection
function handleNotInterested() {
  selectedBattery = null;
  updatePackageDisplay();
  showSolarPackageSection();
}

// Smooth scroll helper
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

function scrollToForm() {
  const packageForm = document.querySelector('.package-form');
  if (packageForm) {
    window.scrollTo({
      top: packageForm.offsetTop - 50,
      behavior: 'smooth'
    });
  }
}

// Show a temporary text cloud message for a given duration (ms)
// Cloud appears at 30% from top
function showTextCloud(message, duration) {
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

// IntersectionObservers for panels and battery sections
function initObservers() {
  const panelsSection = document.getElementById('panels-section');
  const systemSizeSection = document.getElementById('system-size-input');
  const invertersSection = document.getElementById('inverters-section');
  const batterySection = document.getElementById('battery-storage');
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
}



// Modal handling for product details (price removed)
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
  const logoClass = type === 'panel' ? 'brand-logo-panel' : (type === 'inverter' ? 'brand-logo-inverter' : 'brand-logo-battery');
  
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

// Close modal when clicking outside or on close button
document.addEventListener('click', (e) => {
  const modal = document.getElementById('product-modal');
  const closeButton = modal.querySelector('.close');
  if (e.target === modal || e.target === closeButton) {
    modal.style.display = 'none';
  }
});
document.addEventListener('click', (e) => {
  const modal = document.getElementById('product-modal');
  const closeButton = document.querySelector('.modal-close');
  if (e.target === modal || e.target === closeButton) {
    modal.style.display = 'none';
  }
});

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeBrandImages();
  preloadImages(brandImages).then(() => {
    console.log('All images preloaded successfully');
  }).catch(error => {
    console.error('Error preloading images:', error);
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
  
  // Initially hide the solar package section
  document.getElementById('solar-package').style.display = 'none';
  
  // "Let's enquire!" button: when clicked, show cloud and scroll to form
  document.getElementById('confirm-selection').addEventListener('click', () => {
    showTextCloud("Fill in your details", 3000);
    setTimeout(scrollToForm, 3000);
  });
  
  // "Not Interested" button: resets battery selection and updates display
  document.getElementById('not-interested-btn').addEventListener('click', () => {
    handleNotInterested();
  });
  
  // When package form is submitted, show final cloud message
  const packageForm = document.querySelector('.package-form');
  if (packageForm) {
    packageForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent actual submission for testing
      showTextCloud("Thank you, your message has been forwarded. Have a nice day.", 4000);
      setTimeout(() => {
        packageForm.submit();
      }, 4000);
    });
  }
});



//Articles - logic
document.addEventListener('DOMContentLoaded', function() {

  // ----- MAIN PAGE: ARTICLES WITH MODAL & PAGINATION -----
  const articlesPerPage = 6; // 6 articles per page in Articles section
  let currentArticlePage = 1;

  // Render main page articles (only those with displayOnMain true)
  function displayArticles(page) {
    const articlesGrid = document.getElementById('articles-grid');
    if (!articlesGrid) return;

    // Filter based on displayOnMain
    const mainArticles = allArticles.filter(article => article.displayOnMain); 
    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const articlesToShow = mainArticles.slice(startIndex, endIndex);

    articlesGrid.innerHTML = '';
    articlesToShow.forEach(article => {
      articlesGrid.innerHTML += `
        <div class="article-card" data-article-id="${article.id}">
          <img src="${article.image}" alt="${article.title}">
          <h3>${article.title}</h3>
          <p>${article.snippet}</p>
          <a href="#" class="read-more-btn">Read More</a>
        </div>
      `;
    });
    updateArticlesPagination(mainArticles.length);
    setupArticleClickEvents();
  }

  // Set up pagination controls for main page
  function updateArticlesPagination(totalArticles) {
    const totalPages = Math.ceil(totalArticles / articlesPerPage);
    const pageNumbers = document.getElementById('page-numbers');
    let html = '';

    let startPage = Math.max(1, currentArticlePage - 2);
    let endPage = Math.min(totalPages, currentArticlePage + 2);
    if (currentArticlePage <= 3) { endPage = Math.min(5, totalPages); }
    if (currentArticlePage >= totalPages - 2) { startPage = Math.max(totalPages - 4, 1); }

    html += `<button class="page-nav" id="prev-page" ${currentArticlePage === 1 ? 'disabled' : ''}><</button>`;

    for (let i = startPage; i <= endPage; i++) {
      html += `<button class="page-number ${i === currentArticlePage ? 'active-page' : ''}" data-page="${i}">${i}</button>`;
    }

    html += `<button class="page-nav" id="next-page" ${currentArticlePage === totalPages ? 'disabled' : ''}>></button>`;
    pageNumbers.innerHTML = html;

    document.querySelectorAll('.page-number').forEach(button => {
      button.addEventListener('click', function() {
        handleArticlePageChange(parseInt(this.getAttribute('data-page')));
      });
    });
    document.getElementById('prev-page').addEventListener('click', () => navigateArticlesPages('prev', totalPages));
    document.getElementById('next-page').addEventListener('click', () => navigateArticlesPages('next', totalPages));
  }

  function handleArticlePageChange(newPage) {
    if (newPage === currentArticlePage) return;
    currentArticlePage = newPage;
    displayArticles(currentArticlePage);
    scrollToSection('articles');
  }

  function navigateArticlesPages(direction, totalPages) {
    const newPage = direction === 'prev' ? currentArticlePage - 1 : currentArticlePage + 1;
    if (newPage >= 1 && newPage <= totalPages) {
      handleArticlePageChange(newPage);
    }
  }

  function scrollToSection(sectionId) {
    let targetElement;

    if (sectionId === 'articles') {
        targetElement = document.getElementById('articles-grid');
    } else if (sectionId === 'learn') {
        targetElement = document.getElementById('learn-grid');
    }

    if (!targetElement) return;

    const offset = window.innerWidth <= 768 ? -20 : -100;
    window.scrollTo({
        top: targetElement.offsetTop + offset,
        behavior: 'smooth'
    });
  }

  // Setup click events on each article card (to open modal)
  function setupArticleClickEvents() {
    document.querySelectorAll('.article-card').forEach(card => {
      card.addEventListener('click', function(e) {
        e.preventDefault();
        const articleId = this.getAttribute('data-article-id');
        const article = allArticles.find(a => a.id == articleId);
        if (article) {
          displayModal(article);
        }
      });
    });
  }

  // Modal display for main articles
  function displayModal(article) {
    const modal = document.getElementById('article-modal');
    document.getElementById('modal-article-content').innerHTML = `
      <div class="modal-header">
        <h1 class="modal-title">${article.title}</h1>
        <p class="modal-snippet">${article.snippet}</p>
      </div>
      <p class="modal-published">${article.publishedDate}</p>
      <img src="${article.image}" alt="${article.title}" class="modal-banner">
      <p class="modal-comment">${article.comment}</p>
      <div class="modal-fulltext">
        ${article.fullText}
      </div>
    `;
    modal.style.display = "block";

    document.querySelector('.close').onclick = () => { modal.style.display = "none"; };
    window.onclick = (event) => {
      if (event.target == modal) { modal.style.display = "none"; }
    };
  }

  // Initially display main articles if the container exists
  if (document.getElementById('articles-grid')) {
    displayArticles(currentArticlePage);
  }

  // ----- LEARN PAGE: SQUARE THUMBNAILS WITH READ MORE (separate pagination) -----
  const learnArticlesPerPage = 3; // 3 cards per page on the Learn page
  let currentLearnPage = 1;

  // Render Learn page articles (only those with displayOnLearn true)
  function displayLearnArticles(page) {
    const learnGrid = document.getElementById('learn-grid');
    if (!learnGrid) return;

    // Filter articles that have displayOnLearn or displayOnMain set to true
    const learnArticles = allArticles.filter(article => article.displayOnLearn || article.displayOnMain);
    const startIndex = (page - 1) * learnArticlesPerPage;
    const endIndex = startIndex + learnArticlesPerPage;
    const articlesToShow = learnArticles.slice(startIndex, endIndex);

    learnGrid.innerHTML = '';
    articlesToShow.forEach(article => {
      learnGrid.innerHTML += `
        <div class="learn-card" data-article-id="${article.id}">
          <img src="${article.image}" alt="${article.title}">
          <div class="overlay">
            <h3>${article.title}</h3>
            <p>${article.snippet}</p>
            <a href="${article.fullArticlePath}" class="learn-read-more-btn" target="_blank">Read More</a>
          </div>
        </div>
      `;
    });
    updateLearnPagination(learnArticles.length);
  }

  // Setup pagination for the Learn page
  function updateLearnPagination(totalArticles) {
    const totalPages = Math.ceil(totalArticles / learnArticlesPerPage);
    const pageNumbers = document.getElementById('learn-page-numbers');
    let html = '';

    let startPage = Math.max(1, currentLearnPage - 1);
    let endPage = Math.min(totalPages, currentLearnPage + 1);
    if (currentLearnPage <= 2) { endPage = Math.min(3, totalPages); }
    if (currentLearnPage >= totalPages - 1) { startPage = Math.max(totalPages - 2, 1); }

    html += `<button class="page-nav" id="learn-prev-page" ${currentLearnPage === 1 ? 'disabled' : ''}><</button>`;
    for (let i = startPage; i <= endPage; i++) {
      html += `<button class="page-number ${i === currentLearnPage ? 'active-page' : ''}" data-page="${i}">${i}</button>`;
    }
    html += `<button class="page-nav" id="learn-next-page" ${currentLearnPage === totalPages ? 'disabled' : ''}>></button>`;
    pageNumbers.innerHTML = html;

    document.querySelectorAll('#learn-page-numbers .page-number').forEach(button => {
      button.addEventListener('click', function() {
        handleLearnPageChange(parseInt(this.getAttribute('data-page')));
      });
    });
    document.getElementById('learn-prev-page').addEventListener('click', () => navigateLearnPages('prev', totalPages));
    document.getElementById('learn-next-page').addEventListener('click', () => navigateLearnPages('next', totalPages));
  }

  function handleLearnPageChange(newPage) {
    if (newPage === currentLearnPage) return;
    currentLearnPage = newPage;
    displayLearnArticles(currentLearnPage);
    scrollToSection('learn');
  }

  function navigateLearnPages(direction, totalPages) {
    const newPage = direction === 'prev' ? currentLearnPage - 1 : currentLearnPage + 1;
    if (newPage >= 1 && newPage <= totalPages) {
      handleLearnPageChange(newPage);
    }
  }

  // Initially display Learn articles if the container exists
  if (document.getElementById('learn-grid')) {
    displayLearnArticles(currentLearnPage);
  }

});


// Filter Bar , function () sorting the solar by cheapest, most popular and most expensive

function sortProducts(type, criteria) {
  const grid = document.getElementById(type === "panel" ? "panels-grid" : "inverters-grid");
  let products = [...solarProducts[type + "s"]]; // Clone the array to avoid modifying the original

  // Sorting logic
  if (criteria === "expensive") {
    products.sort((a, b) => b.price - a.price); // High to Low
  } else if (criteria === "cheap") {
    products.sort((a, b) => a.price - b.price); // Low to High
  } else if (criteria === "popular") {
    products.sort((a, b) => b.popularity - a.popularity); // Most to Least Popular
  }

  // Clear container and re-render products
  grid.innerHTML = "";
  products.forEach(product => grid.appendChild(createProductCard(product, type)));
}

// Add event listeners for dropdown filters
document.getElementById("panel-filter").addEventListener("change", function() {
  sortProducts("panel", this.value);
});

document.getElementById("inverter-filter").addEventListener("change", function() {
  sortProducts("inverter", this.value);
});
