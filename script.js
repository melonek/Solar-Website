// SIMPLE PARALLAX SCRIPT
document.addEventListener('DOMContentLoaded', () => {
  const heroSection = document.querySelector('.hero-section');
  const heroImage = document.querySelector('.hero-image img');
  let lastScroll = 0;

  function updateParallax() {
      const scrollY = window.scrollY;
      const sectionTop = heroSection.offsetTop;
      const sectionHeight = heroSection.clientHeight;
      
      // Only animate when section is visible
      if (scrollY > sectionTop + sectionHeight || scrollY < sectionTop) return;

      // Calculate parallax movement (25% of scroll distance)
      const progress = (scrollY - sectionTop) / sectionHeight;
      const parallaxY = progress * sectionHeight * 0.25;

      // Apply transform with hardware acceleration
      heroImage.style.transform = `
          translate3d(-50%, calc(-50% + ${parallaxY}px), 0)
      `;

      requestAnimationFrame(updateParallax);
  }

  // Optimized scroll handler
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
        img.src = image.path;
        img.onload = () => res(image.path);
        img.onerror = () => {
          console.error(`Failed to preload image: ${image.path}`);
          rej(image.path);
        };
      });
    });

    Promise.all(promises).then(() => resolve()).catch(() => resolve());
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

// Updated brand images array with local paths (adjust the path as needed)

const brandImages = [
  { name: 'Trina', url: '../images/BrandLogos/Trina-Solar.png' },
  { name: 'SMA', url: '../images/BrandLogos/SMA.png' },
  { name: 'Canadian Solar', url: "../images/BrandLogos/Canadian-Solar.png" },
  { name: 'DaSolar', url: "../images/BrandLogos/DaSolar.png" },
  { name: 'Fronius', url: "./images/BrandLogos/Fronius.png" },
  { name: 'Growatt', url: "/images/BrandLogos/Growatt.png" },
  { name: 'Huawei/iStore', url: "/images/BrandLogos/Huawei.png" },
  { name: 'JASolar', url: "./images/BrandLogos/JASolar.png" },
  { name: 'Goodwe', url: "./images/BrandLogos/Goodwe.jpg" },
  { name: 'Jinko', url: ".images/BrandLogos/Jinko.png" },
  { name: 'Longi', url: "./images/BrandLogos/Longi.png" },
  { name: 'Risen', url: "./images/BrandLogos/Risen-Solar.png" },
  { name: 'Seraphim', url: "../images/BrandLogos/Seraphim.png" },
  { name: 'Sofar', url: "../images/BrandLogos/Sofar.png" },
  { name: 'SolarEdge', url: "./images/BrandLogos/Solar-Edge.png" },
  { name: 'Solis', url: "./images/BrandLogos/Solis.png" },
  { name: 'Sungrow', url: "./images/BrandLogos/Sungrow.png" },
  { name: 'EgingPV', url: "./images/BrandLogos/EgingPV.png" },
  { name: 'QCells', url: "../images/BrandLogos/QCells.png" }
];

document.addEventListener('DOMContentLoaded', function () {
  // Wait for images to preload before starting the functionality
  preloadImages(brandImages).then(() => {
    initializeBrandSlider('.brand-card', '#brands');
    initializeBrandSlider('.solar-brand-card', '#solar-logo-cards-container');
  });
});

function initializeBrandSlider(cardSelector, containerSelector) {
  const brandCards = document.querySelectorAll(cardSelector);
  if (brandCards.length === 0) return; // Exit if no brand cards exist

  let currentIndex = 0;

  function updateBrandCards() {
    brandCards.forEach((card, i) => {
      const imgIndex = (currentIndex + i) % brandImages.length;
      const brandImage = brandImages[imgIndex];

      const imgElement = card.querySelector('img');
      imgElement.src = brandImage.url;
      imgElement.alt = brandImage.name;

      card.classList.remove('active');
      setTimeout(() => card.classList.add('active'), 50); // Animate cards into view
    });
  }

  function cycleBrands() {
    brandCards.forEach((card) => card.classList.remove('active')); // Fade out effect

    setTimeout(() => {
      currentIndex = (currentIndex + 4) % brandImages.length;
      updateBrandCards();
    }, 500);
  }

  // Start cycling brands every 5 seconds
  let brandInterval = setInterval(cycleBrands, 5000);

  // Pause cycling on hover
  const container = document.querySelector(containerSelector);
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(brandInterval));
    container.addEventListener('mouseleave', () => {
      brandInterval = setInterval(cycleBrands, 5000);
    });
  }

  // Initialize first set of images
  updateBrandCards();

  // Initial fade-in effect
  setTimeout(() => {
    brandCards.forEach((card) => card.classList.add('active'));
  }, 500);
}


// Function to find image URL for a given brand
function getBrandImage(brandName) {
  const brand = brandImages.find((b) => b.name === brandName);
  return brand ? brand.url : "/images/default-image.png"; // Fallback image
}

// Product Data Array
const solarProducts = {
  panels: [
    {
      id: 1,
      name: "Canadian Solar 400W",
      brand: 'Canadian Solar',
      specs: "400W Mono PERC",
      country: "Canada",
      warranty: "25 years",
      datasheet: "canadian-400w.pdf",
      image: "/images/Panels/Canadian-Solar-440-W.webp",
      price: 250,
      popularity: 3,
      description: "Solar panel description goes here...",
    },
      {
      id: 2,
      name: "Trina Solar 410W",
      brand: "Trina",      
      specs: "410W Mono PERC",
      country: "China",
      warranty: "25 years",
      datasheet: "trina-410w.pdf",
      image: "/images/Panels/Trina.webp",
      price: 260,
      popularity: 5,
      description: "Solar panel description goes here...",
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
      image: "/images/Inverters/FroniusSymo.png",
      price: 1200,
      popularity: 4,
      description: "Inverter description goes here...",
    },
    {
      id: 2,
      name: "SMA Sunny Boy 5.0",
      brand: "SMA",  
      specs: "5kW Single Phase",
      country: "Germany",
      warranty: "10 years",
      datasheet: "sma-sunny-boy.pdf",
      image: "/images/Inverters/SMA.png",
      price: 1150,
      popularity: 2,
      description: "Inverter description goes here...",
    }
  ]
};


//Create product cards and Update package

let selectedPanel = null;
let selectedInverter = null;

function createProductCard(product, type) {
  const card = document.createElement('div');
  card.className = 'product-card product';
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}Best Perth Solar panel">
    <h3>${product.name}</h3>
    <p>Specs: ${product.specs}</p>
    <p>Country: ${product.country}</p>
    <p>Price: $${product.price}</p>
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
      scrollToSection('inverters-section');
    } else if (type === 'inverter') {
      document.querySelectorAll('#inverters-grid .product-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedInverter = product;
      showSolarPackageSection();
    }
    updatePackageDisplay();
  });
  
  return card;
}


function updatePackageDisplay() {
  const panelImage = document.getElementById('selected-panel-image');
  const inverterImage = document.getElementById('selected-inverter-image');
  const packageDescription = document.getElementById('package-description');
  const confirmButton = document.getElementById('confirm-selection');

  // Create or find logo elements
  let panelLogo = document.getElementById('panel-logo');
  let inverterLogo = document.getElementById('inverter-logo');

  if (!panelLogo) {
    panelLogo = document.createElement('img');
    panelLogo.id = 'panel-logo';
    panelLogo.classList.add('logo-overlay'); // Add the new class for logos
    panelImage.parentNode.appendChild(panelLogo);
  }

  if (!inverterLogo) {
    inverterLogo = document.createElement('img');
    inverterLogo.id = 'inverter-logo';
    inverterLogo.classList.add('logo-overlay'); // Add the new class for logos
    inverterImage.parentNode.appendChild(inverterLogo);
  }

  // Update panel image and logo
  if (selectedPanel) {
    panelImage.src = selectedPanel.image;
    panelImage.style.visibility = 'visible';

    const panelBrand = brandImages.find(brand => brand.name === selectedPanel.brand);
    if (panelBrand) {
      panelLogo.src = panelBrand.url;
      panelLogo.style.visibility = 'visible';
    } else {
      panelLogo.style.visibility = 'hidden';
    }
  }

  // Update inverter image and logo
  if (selectedInverter) {
    inverterImage.src = selectedInverter.image;
    inverterImage.style.visibility = 'visible';

    const inverterBrand = brandImages.find(brand => brand.name === selectedInverter.brand);
    if (inverterBrand) {
      inverterLogo.src = inverterBrand.url;
      inverterLogo.style.visibility = 'visible';
    } else {
      inverterLogo.style.visibility = 'hidden';
    }
  }

  // Update package description and button visibility
  if (selectedPanel && selectedInverter) {
    packageDescription.innerHTML = `
      My installation will consist of <strong>${selectedPanel.name}</strong> panels 
      and <strong>${selectedInverter.name}</strong> inverter
    `;
    document.getElementById('solar-package-input').value = 
      `Panels: ${selectedPanel.name}, Inverter: ${selectedInverter.name}`;
    confirmButton.style.visibility = 'visible';
  } else {
    packageDescription.textContent = '';
    confirmButton.style.visibility = 'hidden';
  }
}


function showSolarPackageSection() {
  const solarPackageSection = document.getElementById('solar-package');
  if (selectedPanel && selectedInverter) {
    solarPackageSection.style.display = 'block';  // Show the section
    scrollToSection('solar-package');  // Scroll to "My Solar Package" section
  }
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    window.scrollTo({
      top: section.offsetTop - 0, // Adjust for header/nav if needed
      behavior: 'smooth'
    });
  }
}

function scrollToForm() {
  const packageForm = document.querySelector('.package-form');
  if (packageForm) {
    window.scrollTo({
      top: packageForm.offsetTop - 50,  // Adjust for any fixed header if needed
      behavior: 'smooth'
    });
  }
}

function initPackagesPage() {
  const panelsGrid = document.getElementById('panels-grid');
  const invertersGrid = document.getElementById('inverters-grid');
  
  solarProducts.panels.forEach(panel => panelsGrid.appendChild(createProductCard(panel, 'panel')));
  solarProducts.inverters.forEach(inverter => invertersGrid.appendChild(createProductCard(inverter, 'inverter')));

  // Initially hide the "My Solar Package" section
  document.getElementById('solar-package').style.display = 'none';

  // Add event listener to "That's correct!" button
  document.getElementById('confirm-selection').addEventListener('click', () => {
    scrollToForm();  // Scroll to the package form section
  });
}

document.addEventListener('DOMContentLoaded', initPackagesPage);

// Open modal when a product card is clicked
function handleModalOpen(e) {
  e.preventDefault();
  const type = e.target.dataset.type;
  const id = parseInt(e.target.dataset.id);
  const product = solarProducts[type + 's'].find(p => p.id === id);

  if (!product) return;

  // Find brand logo URL from brandImages array
  const brand = brandImages.find(b => b.name.toLowerCase() === product.brand.toLowerCase());
  const brandLogoUrl = brand ? brand.url : '';

  // Determine the logo class based on type (panel or inverter)
  const logoClass = type === 'panel' ? 'brand-logo-panel' : 'brand-logo-inverter';

  const modal = document.getElementById('product-modal');
  document.querySelector('.modal-product-image').innerHTML = `
    <div class="product-image-container">
      <img src="${product.image}" alt="${product.name}" class="main-product-image">
      ${brandLogoUrl ? `<img src="${brandLogoUrl}" alt="${product.brand}" class="${logoClass}">` : ''}
    </div>
  `;

  document.querySelector('.modal-product-details').innerHTML = `
    <h2>${product.name}</h2>
    <p><strong>Brand Name: </strong>${product.brand}<br></br></p>
    <p><strong>Specifications:</strong> ${product.specs}</p>
    <p><strong>Country:</strong> ${product.country}</p>
    <p><strong>Warranty:</strong> ${product.warranty}</p>
    <p><strong>Price:</strong> $${product.price}</p>
    <p><strong>Datasheet:</strong> <a href="${product.datasheet}" target="_blank">Download</a><br></br></p>
    <p><strong>Product Description: </strong>${product.description}
  `;

  modal.style.display = 'block'; // Show the modal
}



// Close modal when clicking outside or on the "X" button
document.addEventListener('click', (e) => {
  const modal = document.getElementById('product-modal');
  const closeButton = modal.querySelector('.close'); // Get the close button inside the modal

  // If the user clicks the background (modal itself) or the close button, hide the modal
  if (e.target === modal || e.target === closeButton) {
    modal.style.display = 'none'; // Close the modal
  }
});


// Close modal when clicking outside or on the "X" button
document.addEventListener('click', (e) => {
  const modal = document.getElementById('product-modal');
  const closeButton = document.querySelector('.modal-close'); // Assuming your close button has this class

  if (e.target === modal || e.target === closeButton) {
    modal.style.display = 'none'; // Close modal
  }
});

//Articles - logic
document.addEventListener('DOMContentLoaded', function() {

  // Array of articles - this could be replaced with fetching data from JSON or an API
  const allArticles = [
    { 
      id: 1, 
      title: "Solar Innovation", 
      image: "https://images.pexels.com/photos/2486346/pexels-photo-2486346.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300", 
      snippet: "Latest in solar tech...", 
      fullText: "<br>Publisher Information Księgarnia Akademicka Publishing is an independent scholarly publisher established in 1992 and headquartered in Kraków, Poland. It offers a wide range of academic monographs, conference proceedings and journals, mainly in humanities and social sciences, including digital projects and open access publications. With almost 3,000 published titles, about 15 scholarly journals, over 30 book series and an annual production of more than 100 new publications, including translations, Księgarnia Akademicka Publishing also ranks among the top tier of Polish academic publishers in terms of quality. <br/> <br> Księgarnia Akademicka Publishing’s mission is to disseminate the outstanding works of the Central Eastern European academia across the world, using print and digital media. The publisher’s focus is placed both on Central and Eastern Europe studies (including history, Slavic literature and linguistics, regional studies) and many fields of international, multidisciplinary issues. <br/> <br> A major part of its output is published in Polish and English, but also in Russian, Spanish and German. The publisher cooperates with main Polish universities such as Jagiellonian University and University of Wroclaw, as well as other international and regional cultural and research institutions. Diverse territories of Latin America are immersed in important situations today.<br/> <br> The region is not only facing shortages, inequities, and inequalities a large part of the population has to live with, but also constant information, disinformation and fake news that permeate their minds and erode their freedom of decision and action in democratic processes. The scenario they are going through calls for a deep shake from its foundations, given the discourse of knowledge beyond a robust wave of information, coming from unusual sources, some of them disrupting the effort to ascertain the truth of the facts and being apparently at the service of economic and/or political hegemonies. This text proposes a comprehensive approach to fake news and the scope of influence they have on individual freedom with repercussions on the weak Latin American democracy.",
      publishedDate: "February 5, 2025",
      comment: "A breakthrough worth our times"
    },
    { 
      id: 2, 
      title: "Solar Innovation", 
      image: "https://images.pexels.com/photos/2486346/pexels-photo-2486346.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300", 
      snippet: "Latest in solar tech...", 
      fullText: "<br>Publisher Information Księgarnia Akademicka Publishing is an independent scholarly publisher established in 1992 and headquartered in Kraków, Poland. It offers a wide range of academic monographs, conference proceedings and journals, mainly in humanities and social sciences, including digital projects and open access publications. With almost 3,000 published titles, about 15 scholarly journals, over 30 book series and an annual production of more than 100 new publications, including translations, Księgarnia Akademicka Publishing also ranks among the top tier of Polish academic publishers in terms of quality. <br/> <br> Księgarnia Akademicka Publishing’s mission is to disseminate the outstanding works of the Central Eastern European academia across the world, using print and digital media. The publisher’s focus is placed both on Central and Eastern Europe studies (including history, Slavic literature and linguistics, regional studies) and many fields of international, multidisciplinary issues. <br/> <br> A major part of its output is published in Polish and English, but also in Russian, Spanish and German. The publisher cooperates with main Polish universities such as Jagiellonian University and University of Wroclaw, as well as other international and regional cultural and research institutions. Diverse territories of Latin America are immersed in important situations today.<br/> <br> The region is not only facing shortages, inequities, and inequalities a large part of the population has to live with, but also constant information, disinformation and fake news that permeate their minds and erode their freedom of decision and action in democratic processes. The scenario they are going through calls for a deep shake from its foundations, given the discourse of knowledge beyond a robust wave of information, coming from unusual sources, some of them disrupting the effort to ascertain the truth of the facts and being apparently at the service of economic and/or political hegemonies. This text proposes a comprehensive approach to fake news and the scope of influence they have on individual freedom with repercussions on the weak Latin American democracy.",
      publishedDate: "February 5, 2025",
      comment: "A breakthrough worth our times"
    },
    { 
      id: 3, 
      title: "Solar Innovation", 
      image: "https://images.pexels.com/photos/2486346/pexels-photo-2486346.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300", 
      snippet: "Latest in solar tech...", 
      fullText: "<br>Publisher Information Księgarnia Akademicka Publishing is an independent scholarly publisher established in 1992 and headquartered in Kraków, Poland. It offers a wide range of academic monographs, conference proceedings and journals, mainly in humanities and social sciences, including digital projects and open access publications. With almost 3,000 published titles, about 15 scholarly journals, over 30 book series and an annual production of more than 100 new publications, including translations, Księgarnia Akademicka Publishing also ranks among the top tier of Polish academic publishers in terms of quality. <br/> <br> Księgarnia Akademicka Publishing’s mission is to disseminate the outstanding works of the Central Eastern European academia across the world, using print and digital media. The publisher’s focus is placed both on Central and Eastern Europe studies (including history, Slavic literature and linguistics, regional studies) and many fields of international, multidisciplinary issues. <br/> <br> A major part of its output is published in Polish and English, but also in Russian, Spanish and German. The publisher cooperates with main Polish universities such as Jagiellonian University and University of Wroclaw, as well as other international and regional cultural and research institutions. Diverse territories of Latin America are immersed in important situations today.<br/> <br> The region is not only facing shortages, inequities, and inequalities a large part of the population has to live with, but also constant information, disinformation and fake news that permeate their minds and erode their freedom of decision and action in democratic processes. The scenario they are going through calls for a deep shake from its foundations, given the discourse of knowledge beyond a robust wave of information, coming from unusual sources, some of them disrupting the effort to ascertain the truth of the facts and being apparently at the service of economic and/or political hegemonies. This text proposes a comprehensive approach to fake news and the scope of influence they have on individual freedom with repercussions on the weak Latin American democracy.",
      publishedDate: "February 5, 2025",
      comment: "A breakthrough worth our times"
    },
    { 
      id: 4, 
      title: "Solar Innovation", 
      image: "https://images.pexels.com/photos/2486346/pexels-photo-2486346.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300", 
      snippet: "Latest in solar tech...", 
      fullText: "<br>Publisher Information Księgarnia Akademicka Publishing is an independent scholarly publisher established in 1992 and headquartered in Kraków, Poland. It offers a wide range of academic monographs, conference proceedings and journals, mainly in humanities and social sciences, including digital projects and open access publications. With almost 3,000 published titles, about 15 scholarly journals, over 30 book series and an annual production of more than 100 new publications, including translations, Księgarnia Akademicka Publishing also ranks among the top tier of Polish academic publishers in terms of quality. <br/> <br> Księgarnia Akademicka Publishing’s mission is to disseminate the outstanding works of the Central Eastern European academia across the world, using print and digital media. The publisher’s focus is placed both on Central and Eastern Europe studies (including history, Slavic literature and linguistics, regional studies) and many fields of international, multidisciplinary issues. <br/> <br> A major part of its output is published in Polish and English, but also in Russian, Spanish and German. The publisher cooperates with main Polish universities such as Jagiellonian University and University of Wroclaw, as well as other international and regional cultural and research institutions. Diverse territories of Latin America are immersed in important situations today.<br/> <br> The region is not only facing shortages, inequities, and inequalities a large part of the population has to live with, but also constant information, disinformation and fake news that permeate their minds and erode their freedom of decision and action in democratic processes. The scenario they are going through calls for a deep shake from its foundations, given the discourse of knowledge beyond a robust wave of information, coming from unusual sources, some of them disrupting the effort to ascertain the truth of the facts and being apparently at the service of economic and/or political hegemonies. This text proposes a comprehensive approach to fake news and the scope of influence they have on individual freedom with repercussions on the weak Latin American democracy.",
      publishedDate: "February 5, 2025",
      comment: "A breakthrough worth our times"
    },
    { 
      id: 5, 
      title: "Solar Innovation", 
      image: "https://images.pexels.com/photos/2486346/pexels-photo-2486346.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300", 
      snippet: "Latest in solar tech...", 
      fullText: "<br>Publisher Information Księgarnia Akademicka Publishing is an independent scholarly publisher established in 1992 and headquartered in Kraków, Poland. It offers a wide range of academic monographs, conference proceedings and journals, mainly in humanities and social sciences, including digital projects and open access publications. With almost 3,000 published titles, about 15 scholarly journals, over 30 book series and an annual production of more than 100 new publications, including translations, Księgarnia Akademicka Publishing also ranks among the top tier of Polish academic publishers in terms of quality. <br/> <br> Księgarnia Akademicka Publishing’s mission is to disseminate the outstanding works of the Central Eastern European academia across the world, using print and digital media. The publisher’s focus is placed both on Central and Eastern Europe studies (including history, Slavic literature and linguistics, regional studies) and many fields of international, multidisciplinary issues. <br/> <br> A major part of its output is published in Polish and English, but also in Russian, Spanish and German. The publisher cooperates with main Polish universities such as Jagiellonian University and University of Wroclaw, as well as other international and regional cultural and research institutions. Diverse territories of Latin America are immersed in important situations today.<br/> <br> The region is not only facing shortages, inequities, and inequalities a large part of the population has to live with, but also constant information, disinformation and fake news that permeate their minds and erode their freedom of decision and action in democratic processes. The scenario they are going through calls for a deep shake from its foundations, given the discourse of knowledge beyond a robust wave of information, coming from unusual sources, some of them disrupting the effort to ascertain the truth of the facts and being apparently at the service of economic and/or political hegemonies. This text proposes a comprehensive approach to fake news and the scope of influence they have on individual freedom with repercussions on the weak Latin American democracy.",
      publishedDate: "February 5, 2025",
      comment: "A breakthrough worth our times"
    },
    { 
      id: 6, 
      title: "Solar Innovation", 
      image: "https://images.pexels.com/photos/2486346/pexels-photo-2486346.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300", 
      snippet: "Latest in solar tech...", 
      fullText: "<br>Publisher Information Księgarnia Akademicka Publishing is an independent scholarly publisher established in 1992 and headquartered in Kraków, Poland. It offers a wide range of academic monographs, conference proceedings and journals, mainly in humanities and social sciences, including digital projects and open access publications. With almost 3,000 published titles, about 15 scholarly journals, over 30 book series and an annual production of more than 100 new publications, including translations, Księgarnia Akademicka Publishing also ranks among the top tier of Polish academic publishers in terms of quality. <br/> <br> Księgarnia Akademicka Publishing’s mission is to disseminate the outstanding works of the Central Eastern European academia across the world, using print and digital media. The publisher’s focus is placed both on Central and Eastern Europe studies (including history, Slavic literature and linguistics, regional studies) and many fields of international, multidisciplinary issues. <br/> <br> A major part of its output is published in Polish and English, but also in Russian, Spanish and German. The publisher cooperates with main Polish universities such as Jagiellonian University and University of Wroclaw, as well as other international and regional cultural and research institutions. Diverse territories of Latin America are immersed in important situations today.<br/> <br> The region is not only facing shortages, inequities, and inequalities a large part of the population has to live with, but also constant information, disinformation and fake news that permeate their minds and erode their freedom of decision and action in democratic processes. The scenario they are going through calls for a deep shake from its foundations, given the discourse of knowledge beyond a robust wave of information, coming from unusual sources, some of them disrupting the effort to ascertain the truth of the facts and being apparently at the service of economic and/or political hegemonies. This text proposes a comprehensive approach to fake news and the scope of influence they have on individual freedom with repercussions on the weak Latin American democracy.",
      publishedDate: "February 5, 2025",
      comment: "A breakthrough worth our times"
    },

    
    // ... other articles ...
  ];

  const articlesPerPage = 5;
  let currentPage = 1;

  // Function to display articles
  function displayArticles(page) {
    console.log(`Displaying articles for page ${page}`);
    const articlesGrid = document.getElementById('articles-grid');
    if (!articlesGrid) {
        console.error('Articles grid not found');
        return;
    }
    articlesGrid.innerHTML = '';

    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const articlesToShow = allArticles.slice(startIndex, endIndex);

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
    updatePagination();
    setupArticleClickEvents();
}
    console.log('Articles added to the DOM');


 // Modified handlePageChange function
 // Add scroll logic to pagination handlers

function handlePageChange(newPage) {
  if (newPage === currentPage) return;
  
  const oldPage = currentPage;
  currentPage = newPage;
  
  displayArticles(currentPage);
  if (oldPage !== 1 || currentPage !== 1) {
      scrollToArticlesSection();
  }
}

function scrollToArticlesSection() {
    const articlesSection = document.getElementById('articles');
    if (!articlesSection) return;

    const offset = window.innerWidth <= 768 ? -20 : -100;
    const topPos = articlesSection.offsetTop + offset;

    window.scrollTo({
        top: topPos,
        behavior: 'smooth'
    });
}

displayArticles(currentPage); // This will show articles on first load

function updatePagination() {
  const totalPages = Math.ceil(allArticles.length / articlesPerPage);
  const pageNumbers = document.getElementById('page-numbers');
  let html = '';
  
  // Always show 5 pages, centered around current page
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);
  
  // Adjust if we're at the start or end
  if (currentPage <= 3) {
      endPage = Math.min(5, totalPages);
  }
  if (currentPage >= totalPages - 2) {
      startPage = Math.max(totalPages - 4, 1);
  }

  // Previous button
  html += `<button class="page-nav" id="prev-page" ${currentPage === 1 ? 'disabled' : ''}><</button>`;

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
      html += `<button class="page-number ${i === currentPage ? 'active-page' : ''}" data-page="${i}">${i}</button>`;
  }

  // Next button
  html += `<button class="page-nav" id="next-page" ${currentPage === totalPages ? 'disabled' : ''}>></button>`;

  pageNumbers.innerHTML = html;

  // Event listeners
  document.querySelectorAll('.page-number').forEach(button => {
      button.addEventListener('click', function() {
          handlePageChange(parseInt(this.getAttribute('data-page')));
      });
  });

  document.getElementById('prev-page').addEventListener('click', () => navigatePages('prev'));
  document.getElementById('next-page').addEventListener('click', () => navigatePages('next'));
}


  // Modified navigatePages function
  function navigatePages(direction) {
    const totalPages = Math.ceil(allArticles.length / articlesPerPage);
    const newPage = direction === 'prev' ? currentPage - 1 : currentPage + 1;
    
    if (newPage >= 1 && newPage <= totalPages) {
        handlePageChange(newPage);
    }
}

const prevPage = document.getElementById('prev-page');
const nextPage = document.getElementById('next-page');

if (prevPage) {
  prevPage.addEventListener('click', () => navigatePages('prev'));
}
if (nextPage) {
  nextPage.addEventListener('click', () => navigatePages('next'));
}


  // Setup event listeners for article cards
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

  // Display modal with full article content
function displayModal(article) {
  const modal = document.getElementById('article-modal');
  document.getElementById('modal-article-content').innerHTML = `
    <div class="modal-header">
      <h1 class="modal-title">${article.title}</h1>
      <p class="modal-snippet">${article.snippet}</p> <!-- Snippet under headline -->
    </div>
    <p class="modal-published">${article.publishedDate}</p>
    <img src="${article.image}" alt="${article.title}" class="modal-banner">
    <p class="modal-comment">${article.comment}</p> <!-- Comment under the image -->
    <div class="modal-fulltext">
      <p>${article.fullText}</p>
    </div>
  `;
  modal.style.display = "block";

  // Close modal
  document.querySelector('.close').onclick = function() {
    modal.style.display = "none";
  };

  // Close modal if user clicks outside of it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}
})

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