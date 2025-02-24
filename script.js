document.addEventListener('DOMContentLoaded', () => {
  // -------------------------
  // HERO SECTION PARALLAX (Example Functionality)
  // -------------------------
  const heroSection = document.querySelector('.hero-section');
  const heroImage = document.querySelector('.hero-image img');
  let lastScroll = 0;
  const imageWidth = 4000;  // desired width
  const imageHeight = 1000; // desired height
  if (heroImage) {
    heroImage.style.width = `${imageWidth}px`;
    heroImage.style.height = `${imageHeight}px`;
  }
  function updateParallax() {
    const scrollY = window.scrollY;
    if (!heroSection) return;
    const sectionTop = heroSection.offsetTop;
    const sectionHeight = heroSection.clientHeight;
    if (scrollY > sectionTop + sectionHeight || scrollY < sectionTop) return;
    const progress = (scrollY - sectionTop) / sectionHeight;
    const parallaxY = progress * sectionHeight * 0.25;
    heroImage.style.transform = `translate3d(-50%, calc(-50% + ${parallaxY}px), 0)`;
    requestAnimationFrame(updateParallax);
  }
  window.addEventListener('scroll', () => {
    if (Math.abs(window.scrollY - lastScroll) > 2) {
      requestAnimationFrame(updateParallax);
      lastScroll = window.scrollY;
    }
  });
  
  // -------------------------
  // BUILD SOLAR SECTION PARALLAX (Example Functionality)
  // -------------------------
  const buildSolarSection = document.getElementById('build-solar');
  const buildSolarVideo = document.querySelector('.build-solar-video video');
  let lastScrollBuild = 0;
  function updateParallaxBuild() {
    const scrollY = window.scrollY;
    if (!buildSolarSection) return;
    const sectionTop = buildSolarSection.offsetTop;
    const sectionHeight = buildSolarSection.clientHeight;
    if (scrollY > sectionTop + sectionHeight || scrollY < sectionTop) return;
    const progress = (scrollY - sectionTop) / sectionHeight;
    const parallaxY = progress * sectionHeight * 0.25;
    if (buildSolarVideo) {
      buildSolarVideo.style.transform = `translate(-50%, calc(-50% + ${parallaxY}px))`;
    }
    requestAnimationFrame(updateParallaxBuild);
  }
  window.addEventListener('scroll', () => {
    if (Math.abs(window.scrollY - lastScrollBuild) > 2) {
      requestAnimationFrame(updateParallaxBuild);
      lastScrollBuild = window.scrollY;
    }
  });
  
// -------------------------
// FACEBOOK TIMELINES PRELOAD & SDK INITIALIZATION (v22.0)
// -------------------------
window.fbAsyncInit = function() {
  FB.init({
      appId     : '1426450195430892',  // Replace with your actual Facebook App ID
      xfbml     : true,
      version   : 'v22.0' // Correct version based on what you mentioned
  });

  // After FB initialization, parse the timelines and reveal them
  preloadFBTimelines();
};

// Load the Facebook SDK
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = 'https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v22.0&appId=1426450195430892'; // Using your App ID and correct language region
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Function to parse and reveal the Facebook timelines
function preloadFBTimelines() {
  const wrappers = document.querySelectorAll('.fb-page-wrapper');
  wrappers.forEach(wrapper => {
      if (typeof FB !== 'undefined' && !wrapper.classList.contains('fb-parsed')) {
          FB.XFBML.parse(wrapper); // Parse the timeline content
          wrapper.classList.add('fb-parsed');
          wrapper.classList.add('revealed'); // Ensure timelines are visible after parsing
      }
  });
}

// -------------------------
// REVEAL FACEBOOK TIMELINES
// -------------------------
function revealFacebookTimelines() {
  const timelines = document.querySelectorAll('.fb-page-wrapper');
  const triggerBottom = window.innerHeight * 0.8;

  timelines.forEach(timeline => {
    const timelineTop = timeline.getBoundingClientRect().top;
    if (timelineTop < triggerBottom) {
      timeline.classList.add('revealed'); // Trigger the flip effect
    } else {
      timeline.classList.remove('revealed'); // Reset the timeline if it's out of view
    }
  });
}

// Listen for scroll events to trigger the reveal
window.addEventListener('scroll', revealFacebookTimelines);

// Also trigger on page load to ensure visible elements are revealed
document.addEventListener('DOMContentLoaded', revealFacebookTimelines);

// -------------------------
// REVEAL FUNCTIONS
// -------------------------
function revealButtons() {
  const buttons = document.querySelectorAll('.fancy-button');
  const triggerBottom = window.innerHeight * 0.8;
  buttons.forEach(button => {
    const buttonTop = button.getBoundingClientRect().top;
    if (buttonTop < triggerBottom) {
      button.classList.add('revealed');
    } else {
      button.classList.remove('revealed');
    }
  });
}

function revealCards() {
  const cards = document.querySelectorAll('.brand-card');
  const triggerBottom = window.innerHeight * 0.9;
  cards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;
    card.classList.toggle('active', cardTop < triggerBottom);
  });
}

function revealArticles() {
  const articles = document.querySelectorAll('.article-card');
  const triggerBottom = window.innerHeight * 0.8;
  articles.forEach((article, index) => {
    const articleTop = article.getBoundingClientRect().top;
    if (articleTop < triggerBottom) {
      setTimeout(() => {
        article.classList.add('revealed');
      }, index * 200);
    } else {
      article.classList.remove('revealed');
    }
  });
}

function revealUniqueServices() {
  const products = document.querySelectorAll('#unique-services .unique-service-product');
  const triggerBottom = window.innerHeight * 0.8;
  products.forEach((product, index) => {
    const productTop = product.getBoundingClientRect().top;
    const isActive = productTop < triggerBottom;
    const revealDirection = product.getAttribute('data-reveal-direction');
    const delay = parseFloat(product.getAttribute('data-reveal-delay')) || 0;
    if (isActive) {
      setTimeout(() => {
        product.classList.add('revealed');
        product.style.transform = 'translateX(0)';
      }, delay * 200);
    } else {
      product.classList.remove('revealed');
      product.style.transform = revealDirection === 'right' ? 'translateX(50px)' : 'translateX(-50px)';
    }
  });
}

function revealLearnCards() {
  const learnCards = document.querySelectorAll('.learn-card');
  const triggerBottom = window.innerHeight * 0.8;
  learnCards.forEach((card, index) => {
    const cardTop = card.getBoundingClientRect().top;
    if (cardTop < triggerBottom) {
      setTimeout(() => {
        card.classList.add('revealed');
      }, index * 300);
    } else {
      card.classList.remove('revealed');
    }
  });
}

// -------------------------
// REVEAL THE PANELS, INVERTERS, AND BATTERY STORAGE SECTIONS
// -------------------------
function revealProductSections() {
  const sections = document.querySelectorAll('.panels-grid .product, .inverters-grid .product, .battery-grid .product');
  const triggerBottom = window.innerHeight * 0.8;

  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < triggerBottom) {
      section.classList.add('revealed');  // Add reveal class to initiate animations
    } else {
      section.classList.remove('revealed'); // Reset the element if it's out of view
    }
  });
}

// Listen for scroll events to trigger the reveal
window.addEventListener('scroll', revealProductSections);

// Trigger on page load to ensure visible elements are revealed
document.addEventListener('DOMContentLoaded', revealProductSections);


  
  // -------------------------
  // COMBINED SCROLL HANDLER WITH THROTTLING
  // -------------------------
  let lastCall = 0;
  let scrollTimeout;
  function handleScroll() {
    const now = Date.now();
    if (now - lastCall < 100) return;
    lastCall = now;
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        revealButtons();
        revealCards();
        revealArticles();
        revealUniqueServices();
        revealLearnCards();
      });
    }, 100);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // -------------------------
  // INITIAL CALLS ON LOAD
  // -------------------------
  function initAll() {
    revealButtons();
    revealCards();
    revealArticles();
    revealUniqueServices();
    revealLearnCards();
    preloadFBTimelines();
  }
  window.addEventListener('load', initAll);
  
  // -------------------------
  // BUTTON CLICK HANDLERS
  // -------------------------
  document.querySelectorAll('.fancy-button').forEach(button => {
    button.addEventListener('click', function (event) {
      const url = this.getAttribute('href');
      if (this.classList.contains('mirror-left')) {
        event.preventDefault();
        setTimeout(() => {
          window.open(url, '_blank', 'noopener,noreferrer');
        }, 100);
      } else {
        window.location.href = url;
      }
    });
    button.addEventListener('touchend', function (event) {
      event.preventDefault();
      this.click();
    }, { passive: false });
  });
});

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

document.addEventListener('DOMContentLoaded', function() {

  // ----- MAIN PAGE: ARTICLES WITH MODAL & PAGINATION -----
  const articlesPerPage = 6; // 6 articles per page in Articles section
  let currentArticlePage = 1;

  // Render main page articles (only those with displayOnMain true)
  function displayArticles(page) {
    const articlesGrid = document.getElementById('articles-grid');
    if (!articlesGrid) return;

    // Filter based on displayOnMain and sort by publishedDate (newest first)
    const mainArticles = allArticles.filter(article => article.displayOnMain).sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)); 
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

    // Filter articles that have displayOnLearn set to true (NOT displayOnMain) and sort by publishedDate (newest first)
    const learnArticles = allArticles.filter(article => article.displayOnLearn).sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
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

document.addEventListener('DOMContentLoaded', () => {
  let isScrolling = false; // Flag to track if scrolling is happening
  let isTouching = false; // Flag to track if a touch event is happening

  // Function to prevent accidental button clicks while scrolling
  const preventButtonClickWhileScrolling = (e) => {
    if (isScrolling || isTouching) {
      e.preventDefault(); // Prevent button click or touch during scroll
      return false;
    }
    return true;
  };

  // Track scrolling events
  window.addEventListener('scroll', () => {
    isScrolling = true;
    setTimeout(() => {
      isScrolling = false;
    }, 100); // 100ms delay to allow scrolling to stop
  });

  // Track touch events for mobile devices
  document.querySelectorAll('.fancy-button, .savings-btn, .build-button').forEach(button => {
    button.addEventListener('touchstart', (e) => {
      isTouching = true;
    });

    button.addEventListener('touchend', (e) => {
      isTouching = false;
      if (!preventButtonClickWhileScrolling(e)) return; // Check if it's safe to trigger
    });

    button.addEventListener('click', (e) => {
      if (!preventButtonClickWhileScrolling(e)) return; // Check if it's safe to trigger
    });
  });

  // For click handlers
  document.querySelectorAll('.fancy-button').forEach(button => {
    button.addEventListener('click', function (event) {
      if (event.target.classList.contains('mirror-left')) {
        event.preventDefault();
        setTimeout(() => {
          window.open(url, '_blank', 'noopener,noreferrer');
        }, 100);
      } else {
        window.location.href = url;
      }
    });
  });

  // Handle saving button and build button click (for preventing accidental navigation)
  document.querySelector('.savings-btn').addEventListener('click', function (event) {
    if (isScrolling || isTouching) {
      event.preventDefault(); // Prevent click during scroll/touch
      return false;
    }
    // Proceed with the original click action
    // Put your click logic here
  });

  document.querySelector('.build-button').addEventListener('click', function (event) {
    if (isScrolling || isTouching) {
      event.preventDefault(); // Prevent click during scroll/touch
      return false;
    }
    // Proceed with the original click action
    // Put your click logic here
  });
});
