// Add this at the TOP of your existing JS file
function preloadImages(urls) {
  return new Promise((resolve, reject) => {
      const promises = urls.map(url => {
          return new Promise((resolve, reject) => {
              const img = new Image();
              img.src = url;
              img.onload = () => resolve(url);
              img.onerror = () => reject(url);
          });
      });

      Promise.all(promises)
          .then(() => resolve())
          .catch((failedUrl) => 
              console.error(`Failed to preload image: ${failedUrl}`))
          .finally(() => resolve()); // Always resolve to continue execution
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

  // Updated brand images array with your URLs
  const brandImages = [
    'https://i.postimg.cc/7L6BHd20/Canadian-Solar.webp',
    'https://i.postimg.cc/Jh2pGxNg/Dasolar.webp',
    'https://i.postimg.cc/4yCw13FQ/Fronius.png',
    'https://i.postimg.cc/ZnrHshGt/Growatt.png',
    'https://i.postimg.cc/43m5kcD1/Huawei.png',
    'https://i.postimg.cc/HsgBcVMp/JASolar.png',
    'https://i.postimg.cc/FFcTHj7W/Jinko.png',
    'https://i.postimg.cc/HkS2hzhx/logo-black-scaled.jpg',
    'https://i.postimg.cc/3JF9gYj2/Longi.png',
    'https://i.postimg.cc/JhvQ1nmC/Risen-Solar.png',
    'https://i.postimg.cc/76znbkYG/Seraphim.png',
    'https://i.postimg.cc/2yFdF7WC/SMA.png',
    'https://i.postimg.cc/wMdcmG7W/Sofar.png',
    'https://i.postimg.cc/FFjx4NBw/Solar-Edge.png',
    'https://i.postimg.cc/wTgQxnKM/Solis.png',
    'https://i.postimg.cc/CxKCkDxV/Sungrow.png',
    'https://i.postimg.cc/YqRfv8k3/Trina-Solar.png',
    'https://i.postimg.cc/dQpY2GFc/Screenshot-2025-02-07-at-12-04-38-am.png',
    'https://i.postimg.cc/gkhPNrcX/Screenshot-2025-02-07-at-12-05-06-am.png'
  ];
  
  // Modify your existing DOMContentLoaded listener like this:
  document.addEventListener('DOMContentLoaded', function() {
    // Wrap all existing code in this preload promise
    preloadImages(brandImages).then(() => {
        // Original brand-related code
        const brandCards = document.querySelectorAll('.brand-card');
        let currentIndex = 0;
  
        // Initialize first set
        updateBrandCards();
  
        function updateBrandCards() {
            brandCards.forEach((card, i) => {
                const imgIndex = (currentIndex + i) % brandImages.length;
                card.querySelector('img').src = brandImages[imgIndex];
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
  
        // Start cycling
        let brandInterval = setInterval(cycleBrands, 5000);
  
        // Pause cycling on hover
        document.querySelector('#brands').addEventListener('mouseenter', () => {
            clearInterval(brandInterval);
        });
  
        document.querySelector('#brands').addEventListener('mouseleave', () => {
            brandInterval = setInterval(cycleBrands, 5000);
        });
  
        // Initial fade-in
        setTimeout(() => {
            brandCards.forEach(card => card.classList.add('active'));
        }, 500);
  
        
        // Rest of your existing code (articles, menu toggle, etc.)
        // ... [Keep all your existing code here] ...
    });
  });

  // Product Data Array (add to your existing JS)
const solarProducts = {
  panels: [
    {
      id: 1,
      name: "Canadian Solar 400W",
      specs: "400W Mono PERC",
      country: "Canada",
      warranty: "25 years",
      datasheet: "canadian-400w.pdf",
      image: "https://i.postimg.cc/DfHr06Fy/Canadian-Solar-440-W.webp"
    },
    {
      id: 1,
      name: "Canadian Solar 400W",
      specs: "400W Mono PERC",
      country: "Canada",
      warranty: "25 years",
      datasheet: "canadian-400w.pdf",
      image: "https://i.postimg.cc/DfHr06Fy/Canadian-Solar-440-W.webp"
    },
    {
      id: 1,
      name: "Canadian Solar 400W",
      specs: "400W Mono PERC",
      country: "Canada",
      warranty: "25 years",
      datasheet: "canadian-400w.pdf",
      image: "https://i.postimg.cc/DfHr06Fy/Canadian-Solar-440-W.webp"
    },
     {
      id: 1,
      name: "Canadian Solar 400W",
      specs: "400W Mono PERC",
      country: "Canada",
      warranty: "25 years",
      datasheet: "canadian-400w.pdf",
      image: "https://i.postimg.cc/DfHr06Fy/Canadian-Solar-440-W.webp"
    },
    // Add more panels...
  ],
  inverters: [
    {
      id: 1,
      name: "Fronius Primo 5.0",
      specs: "5kW Single Phase",
      country: "Austria",
      warranty: "10 years",
      datasheet: "fronius-primo.pdf",
      image: "https://i.postimg.cc/Jh6Zj5wn/Fronius-Symo.png"
    },
    {
      id: 1,
      name: "Fronius Primo 5.0",
      specs: "5kW Single Phase",
      country: "Austria",
      warranty: "10 years",
      datasheet: "fronius-primo.pdf",
      image: "https://i.postimg.cc/Jh6Zj5wn/Fronius-Symo.png"
    },
    {
      id: 1,
      name: "Fronius Primo 5.0",
      specs: "5kW Single Phase",
      country: "Austria",
      warranty: "10 years",
      datasheet: "fronius-primo.pdf",
      image: "https://i.postimg.cc/Jh6Zj5wn/Fronius-Symo.png"
    },
    {
      id: 1,
      name: "Fronius Primo 5.0",
      specs: "5kW Single Phase",
      country: "Austria",
      warranty: "10 years",
      datasheet: "fronius-primo.pdf",
      image: "https://i.postimg.cc/Jh6Zj5wn/Fronius-Symo.png"
    },
    // Add more inverters...
  ]
};

// Package Selection Logic
let selectedPanel = null;
let selectedInverter = null;

function createProductCard(product, type) {
  const card = document.createElement('div');
  card.className = 'product-card product';
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>Specs: ${product.specs}</p>
    <p>Country: ${product.country}</p>
    <p>Datasheet: ${product.datasheet}</p>
    <button class="read-more-btn" data-type="${type}" data-id="${product.id}">Read More</button>
  `;
  return card;
}

function updatePackageDisplay() {
  const panelImage = document.getElementById('selected-panel-image');
  const inverterImage = document.getElementById('selected-inverter-image');
  const packageDescription = document.getElementById('package-description');
  const confirmButton = document.getElementById('confirm-selection'); // Get the new button

  if (selectedPanel && selectedInverter) {
    // Show images and update text when selections are made
    panelImage.src = selectedPanel.image;
    panelImage.style.visibility = 'visible'; 
    
    inverterImage.src = selectedInverter.image;
    inverterImage.style.visibility = 'visible'; 
    
    packageDescription.innerHTML = `
      My installation will consist of <strong>${selectedPanel.name}</strong> panels 
      and <strong>${selectedInverter.name}</strong> inverter
    `;
    document.getElementById('solar-package-input').value = 
      `Panels: ${selectedPanel.name}, Inverter: ${selectedInverter.name}`;

    // Scroll to the solar package section
    const solarPackageSection = document.getElementById('solar-package');
    if (solarPackageSection) {
      window.scrollTo({
        top: solarPackageSection.offsetTop - 50,
        behavior: 'smooth'
      });
    }

    // Enable the confirm button
    if (confirmButton) {
      confirmButton.style.visibility = 'visible'; // Show the button
      confirmButton.onclick = function() {
        // Scroll to package form
        const packageForm = document.querySelector('.package-form');
        if (packageForm) {
          window.scrollTo({
            top: packageForm.offsetTop - 50,
            behavior: 'smooth'
          });
        }
      }
    }
  } else {
    // Hide images and clear description when no selection or only one selection
    panelImage.style.visibility = 'hidden';
    inverterImage.style.visibility = 'hidden';
    packageDescription.textContent = '';
    confirmButton.style.visibility = 'hidden'; // Hide the button
  }
}

function initPackagesPage() {
  const panelsGrid = document.getElementById('panels-grid');
  const invertersGrid = document.getElementById('inverters-grid');

  // Panels creation and selection logic
  solarProducts.panels.forEach(panel => {
    const card = createProductCard(panel, 'panel');
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('read-more-btn')) {
        // Prevent scroll when "Read More" button is clicked
        return;
      }
      document.querySelectorAll('#panels-grid .product-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedPanel = panel;
      updatePackageDisplay();

      // Scroll to the inverters section after panel selection
      const invertersSection = document.getElementById('inverters-grid');
      if (invertersSection) {
        window.scrollTo({
          top: invertersSection.offsetTop - 100,  // Adjusted offset to leave space for the heading
          behavior: 'smooth'
        });
      }
    });
    panelsGrid.appendChild(card);
  });

  // Inverters creation and selection logic
  solarProducts.inverters.forEach(inverter => {
    const card = createProductCard(inverter, 'inverter');
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('read-more-btn')) {
        // Prevent scroll when "Read More" button is clicked
        return;
      }
      document.querySelectorAll('#inverters-grid .product-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedInverter = inverter;
      updatePackageDisplay();

      // Scroll to the "My Solar Packages" section once both selections are made
      if (selectedPanel && selectedInverter) {
        const solarPackageSection = document.getElementById('solar-package');
        if (solarPackageSection) {
          window.scrollTo({
            top: solarPackageSection.offsetTop - 50, // Adjust for header if needed
            behavior: 'smooth'
          });
        }
      }
    });
    invertersGrid.appendChild(card);
  });

  // Reattach modal functionality after the products are added to the DOM
  document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', handleModalOpen);
  });
}

// Modal open handler
function handleModalOpen(e) {
  e.preventDefault();  // Prevent scrolling and page behavior when "Read More" is clicked
  const type = e.target.dataset.type;
  const id = e.target.dataset.id;
  const product = solarProducts[type === 'panel' ? 'panels' : 'inverters'].find(p => p.id == id);

  const modalContent = `
    <img src="${product.image}" alt="${product.name}">
    <div class="product-specs">
      <h2>${product.name}</h2>
      <p><strong>Specifications:</strong> ${product.specs}</p>
      <p><strong>Country:</strong> ${product.country}</p>
      <p><strong>Warranty:</strong> ${product.warranty}</p>
      <p><strong>Datasheet:</strong> ${product.datasheet}</p>
    </div>
  `;

  const modal = document.getElementById('product-modal');
  modal.style.display = 'block';
  document.querySelector('.modal-product-image').innerHTML = modalContent;

  // Close modal when "X" is clicked
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

// Check if we're on the packages.html page and initialize
if (document.location.pathname.includes('packages.html')) {
  initPackagesPage();
}


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
      id: 1, 
      title: "Solar Innovation", 
      image: "https://images.pexels.com/photos/2486346/pexels-photo-2486346.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300", 
      snippet: "Latest in solar tech...", 
      fullText: "<br>Publisher Information Księgarnia Akademicka Publishing is an independent scholarly publisher established in 1992 and headquartered in Kraków, Poland. It offers a wide range of academic monographs, conference proceedings and journals, mainly in humanities and social sciences, including digital projects and open access publications. With almost 3,000 published titles, about 15 scholarly journals, over 30 book series and an annual production of more than 100 new publications, including translations, Księgarnia Akademicka Publishing also ranks among the top tier of Polish academic publishers in terms of quality. <br/> <br> Księgarnia Akademicka Publishing’s mission is to disseminate the outstanding works of the Central Eastern European academia across the world, using print and digital media. The publisher’s focus is placed both on Central and Eastern Europe studies (including history, Slavic literature and linguistics, regional studies) and many fields of international, multidisciplinary issues. <br/> <br> A major part of its output is published in Polish and English, but also in Russian, Spanish and German. The publisher cooperates with main Polish universities such as Jagiellonian University and University of Wroclaw, as well as other international and regional cultural and research institutions. Diverse territories of Latin America are immersed in important situations today.<br/> <br> The region is not only facing shortages, inequities, and inequalities a large part of the population has to live with, but also constant information, disinformation and fake news that permeate their minds and erode their freedom of decision and action in democratic processes. The scenario they are going through calls for a deep shake from its foundations, given the discourse of knowledge beyond a robust wave of information, coming from unusual sources, some of them disrupting the effort to ascertain the truth of the facts and being apparently at the service of economic and/or political hegemonies. This text proposes a comprehensive approach to fake news and the scope of influence they have on individual freedom with repercussions on the weak Latin American democracy.",
      publishedDate: "February 5, 2025",
      comment: "A breakthrough worth our times"
    },
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
      id: 1, 
      title: "Solar Innovation", 
      image: "https://images.pexels.com/photos/2486346/pexels-photo-2486346.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300", 
      snippet: "Latest in solar tech...", 
      fullText: "<br>Publisher Information Księgarnia Akademicka Publishing is an independent scholarly publisher established in 1992 and headquartered in Kraków, Poland. It offers a wide range of academic monographs, conference proceedings and journals, mainly in humanities and social sciences, including digital projects and open access publications. With almost 3,000 published titles, about 15 scholarly journals, over 30 book series and an annual production of more than 100 new publications, including translations, Księgarnia Akademicka Publishing also ranks among the top tier of Polish academic publishers in terms of quality. <br/> <br> Księgarnia Akademicka Publishing’s mission is to disseminate the outstanding works of the Central Eastern European academia across the world, using print and digital media. The publisher’s focus is placed both on Central and Eastern Europe studies (including history, Slavic literature and linguistics, regional studies) and many fields of international, multidisciplinary issues. <br/> <br> A major part of its output is published in Polish and English, but also in Russian, Spanish and German. The publisher cooperates with main Polish universities such as Jagiellonian University and University of Wroclaw, as well as other international and regional cultural and research institutions. Diverse territories of Latin America are immersed in important situations today.<br/> <br> The region is not only facing shortages, inequities, and inequalities a large part of the population has to live with, but also constant information, disinformation and fake news that permeate their minds and erode their freedom of decision and action in democratic processes. The scenario they are going through calls for a deep shake from its foundations, given the discourse of knowledge beyond a robust wave of information, coming from unusual sources, some of them disrupting the effort to ascertain the truth of the facts and being apparently at the service of economic and/or political hegemonies. This text proposes a comprehensive approach to fake news and the scope of influence they have on individual freedom with repercussions on the weak Latin American democracy.",
      publishedDate: "February 5, 2025",
      comment: "A breakthrough worth our times"
    },
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
      id: 1, 
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