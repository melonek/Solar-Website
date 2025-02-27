// -------------------------
// FACEBOOK SDK INITIALIZATION & TIMELINE PRELOAD
// -------------------------
window.fbAsyncInit = function() {
  FB.init({
      appId     : '1426450195430892',  // Your Facebook App ID
      xfbml     : true,
      version   : 'v22.0'
  });
  preloadFBTimelines();
};

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = 'https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v22.0&appId=1426450195430892';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function preloadFBTimelines() {
  const wrappers = document.querySelectorAll('.fb-page-wrapper');
  wrappers.forEach(wrapper => {
    if (typeof FB !== 'undefined' && !wrapper.classList.contains('fb-parsed')) {
      FB.XFBML.parse(wrapper);
      wrapper.classList.add('fb-parsed', 'revealed');
    }
  });
}

// Re-render Facebook timelines when needed
function updateFBTimeline(container) {
  if (container && typeof FB !== 'undefined') {
    FB.XFBML.parse(container);
  } else {
    console.error("Container not found or FB is not defined.");
  }
}

function scaleFacebookTimelines() {
  const containers = document.querySelectorAll('.timeline-container');

  containers.forEach(container => {
    // Target the new .scaler element instead of .fb-page-wrapper
    const scaler = container.querySelector('.scaler');
    const fbPage = container.querySelector('.fb-page');

    if (scaler && fbPage) {
      const containerWidth = container.clientWidth - 40; // Subtract 20px left/right margin
      const defaultWidth = 500;
      const defaultHeight = 600;

      // Calculate scale factor based on width
      const scale = containerWidth / defaultWidth; // Maintain aspect ratio

      // Apply scaling to the scaler wrapper
      scaler.style.transform = `scale(${scale})`;
      scaler.style.transformOrigin = 'top left';
      scaler.style.width = `${defaultWidth}px`;
      scaler.style.height = `${defaultHeight}px`;

      // Set dimensions on the fb-page if needed
      fbPage.style.width = `${defaultWidth}px`;
      fbPage.style.height = `${defaultHeight}px`;

      // Adjust the container height dynamically
      container.style.height = `${defaultHeight * scale + 40}px`; // Add 20px margin top/bottom
    }
  });
}

window.addEventListener('resize', scaleFacebookTimelines);
document.addEventListener('DOMContentLoaded', scaleFacebookTimelines);


// Run on page load and resize
window.addEventListener('resize', scaleFacebookTimelines);
document.addEventListener('DOMContentLoaded', scaleFacebookTimelines);


// -------------------------
// CONSOLIDATED INIT & EVENT HANDLERS
// -------------------------
document.addEventListener('DOMContentLoaded', () => {
  // --- Track scrolling and touch for preventing accidental clicks ---
  let isScrolling = false;
  let isTouching = false;
  window.addEventListener('scroll', () => {
    isScrolling = true;
    setTimeout(() => { isScrolling = false; }, 200);
  });

  // -------------------------
  // HERO SECTION PARALLAX
  // -------------------------
  const heroSection = document.querySelector('.hero-section');
  const heroImage = document.querySelector('.hero-image img');
  let lastScroll = 0;
  const imageWidth = 4000,
        imageHeight = 1000;
  if (heroImage) {
    heroImage.style.width = `${imageWidth}px`;
    heroImage.style.height = `${imageHeight}px`;
  }
  function updateParallax() {
    const scrollY = window.scrollY;
    if (!heroSection) return;
    const sectionTop = heroSection.offsetTop,
          sectionHeight = heroSection.clientHeight;
    if (scrollY > sectionTop + sectionHeight || scrollY < sectionTop) return;
    const progress = (scrollY - sectionTop) / sectionHeight,
          parallaxY = progress * sectionHeight * 0.25;
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
  // BUILD SOLAR SECTION PARALLAX
  // -------------------------
  const buildSolarSection = document.getElementById('build-solar');
  const buildSolarVideo = document.querySelector('.build-solar-video video');
  let lastScrollBuild = 0;
  function updateParallaxBuild() {
    const scrollY = window.scrollY;
    if (!buildSolarSection) return;
    const sectionTop = buildSolarSection.offsetTop,
          sectionHeight = buildSolarSection.clientHeight;
    if (scrollY > sectionTop + sectionHeight || scrollY < sectionTop) return;
    const progress = (scrollY - sectionTop) / sectionHeight,
          parallaxY = progress * sectionHeight * 0.25;
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
  // REVEAL FUNCTIONS
  // -------------------------
// REVEAL FACEBOOK TIMELINES
function revealFacebookTimelines() {
  const timelines = document.querySelectorAll('.fb-page-wrapper');
  const triggerBottom = window.innerHeight * 0.8;
  timelines.forEach(timeline => {
    const timelineTop = timeline.getBoundingClientRect().top;
    if (timelineTop < triggerBottom) {
      timeline.classList.add('revealed'); // Trigger the flip effect
    } else {
      timeline.classList.remove('revealed'); // Reset if out of view
    }
  });
}

// Add scroll event listener to trigger reveal on scroll
window.addEventListener('scroll', revealFacebookTimelines);
// Also call it on page load to reveal visible timelines immediately
revealFacebookTimelines();
  function revealButtons() {
    const buttons = document.querySelectorAll('.fancy-button'),
          triggerBottom = window.innerHeight * 0.8;
    buttons.forEach(button => {
      const buttonTop = button.getBoundingClientRect().top;
      button.classList.toggle('revealed', buttonTop < triggerBottom);
    });
  }
  
  function revealCards() {
    const cards = document.querySelectorAll('.brand-card'),
          triggerBottom = window.innerHeight * 0.9;
    cards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      card.classList.toggle('active', cardTop < triggerBottom);
    });
  }
  function revealArticles() {
    const articles = document.querySelectorAll('.article-card'),
          triggerBottom = window.innerHeight * 0.8;
    articles.forEach((article, index) => {
      const articleTop = article.getBoundingClientRect().top;
      if (articleTop < triggerBottom) {
        setTimeout(() => { article.classList.add('revealed'); }, index * 200);
      } else {
        article.classList.remove('revealed');
      }
    });
  }
  function revealUniqueServices() {
    const products = document.querySelectorAll('#unique-services .unique-service-product'),
          triggerBottom = window.innerHeight * 0.8;
    products.forEach(product => {
      const productTop = product.getBoundingClientRect().top,
            revealDirection = product.getAttribute('data-reveal-direction'),
            delay = parseFloat(product.getAttribute('data-reveal-delay')) || 0;
      if (productTop < triggerBottom) {
        setTimeout(() => {
          product.classList.add('revealed');
          product.style.transform = 'translateX(0)';
        }, delay * 200);
      } else {
        product.classList.remove('revealed');
        product.style.transform = (revealDirection === 'right') ? 'translateX(50px)' : 'translateX(-50px)';
      }
    });
  }
  function revealLearnCards() {
    const learnCards = document.querySelectorAll('.learn-card'),
          triggerBottom = window.innerHeight * 0.8;
    learnCards.forEach((card, index) => {
      const cardTop = card.getBoundingClientRect().top;
      if (cardTop < triggerBottom) {
        setTimeout(() => { card.classList.add('revealed'); }, index * 300);
      } else {
        card.classList.remove('revealed');
      }
    });
  }
  function revealProductSections() {
    const sections = document.querySelectorAll('.panels-grid .product, .inverters-grid .product, .battery-grid .product'),
          triggerBottom = window.innerHeight * 0.8;
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      section.classList.toggle('revealed', sectionTop < triggerBottom);
    });
  }
  window.addEventListener('scroll', revealProductSections);
  revealFacebookTimelines();
  revealProductSections();
  
  // Combined Scroll Handler (throttled) to trigger reveal functions
  let lastCall = 0, scrollTimeout;
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

  // Initial reveal on window load
  function initAll() {
    revealButtons();
    revealCards();
    revealArticles();
    revealUniqueServices();
    revealLearnCards();
    if (typeof preloadFBTimelines === 'function') preloadFBTimelines();
  }
  window.addEventListener('load', initAll);

  // -------------------------
  // BUTTON CLICK HANDLERS
  // -------------------------
  // Handler for fancy buttons (includes prevention of accidental clicks during scroll/touch)
  document.querySelectorAll('.fancy-button').forEach(button => {
    button.addEventListener('click', function (event) {
      if (isScrolling || isTouching) {
        event.preventDefault();
        return false;
      }
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
    button.addEventListener('touchstart', () => { isTouching = true; });
    button.addEventListener('touchend', function (event) {
      isTouching = false;
      event.preventDefault();
      this.click();
    }, { passive: false });
  });
  
  // Handler for savings and build buttons with original click logic implemented
  document.querySelectorAll('.savings-btn, .build-button').forEach(button => {
    button.addEventListener('click', function (event) {
      if (isScrolling || isTouching) {
        event.preventDefault();
        return false;
      }
      // Original click action: navigate using the element’s href attribute.
      const url = this.getAttribute('href');
      if (url) {
        if (this.classList.contains('mirror-left')) {
          event.preventDefault();
          setTimeout(() => {
            window.open(url, '_blank', 'noopener,noreferrer');
          }, 100);
        } else {
          window.location.href = url;
        }
      }
    });
  });
  
// -------------------------
// NAVIGATION DROPDOWN & TOGGLER
// -------------------------
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const mediaQuery = window.matchMedia('(max-width: 768px)');

// Update dropdown links:
// If a link’s href ends with "#unique-services" (even with a prefix), we leave it alone.
// Otherwise, on mobile we override its href.
function toggleHrefs() {
  document.querySelectorAll('.dropdown > a').forEach(toggle => {
    const href = toggle.getAttribute('href');
    // Use endsWith to catch variants like "./#unique-services" or "../#unique-services"
    if (href && href.endsWith("#unique-services")) {
      return; // Do not override Services link
    }
    if (mediaQuery.matches) {
      toggle.dataset.originalHref = href;
      toggle.href = 'javascript:void(0);';
    } else if (toggle.dataset.originalHref) {
      toggle.href = toggle.dataset.originalHref;
    }
  });
}
toggleHrefs();

if (mobileMenu && navLinks) {
  mobileMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
    mobileMenu.classList.toggle('open'); // Activates the toggler animation
  });
}

// Handle clicks for each dropdown link on mobile.
document.querySelectorAll('.dropdown > a').forEach(toggle => {
  toggle.addEventListener('click', function(e) {
    if (!mediaQuery.matches) return; // On desktop, do nothing special.
    const href = this.getAttribute('href');
    // Check if this is the "Services" link by testing if the href ends with "#unique-services"
    if (href && href.endsWith("#unique-services")) {
      // For "Services" link: implement double-click behavior.
      if (!this.dataset.toggledOnce) {
        // First click: open submenu and prevent navigation.
        e.preventDefault();
        e.stopPropagation();
        const dropdown = this.parentElement;
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        closeAllDropdowns();
        navLinks.classList.remove('active');
        dropdownContent.classList.add('active');
        dropdown.classList.add('active');
        this.dataset.toggledOnce = "true";
        setTimeout(() => {
          delete this.dataset.toggledOnce;
        }, 2000);
      } else {
        // Second click (flag is present): allow navigation.
        delete this.dataset.toggledOnce;
        closeAllDropdowns();
        navLinks.classList.remove('active');
        // Manually navigate using the actual href (which might be relative).
        window.location.href = this.getAttribute('href');
      }
    } else {
      // For other dropdown links: simply toggle the submenu.
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
    }
  });
});

// When a link inside a dropdown is clicked on mobile, close all dropdowns and the nav.
document.querySelectorAll('.dropdown-content a').forEach(link => {
  link.addEventListener('click', () => {
    if (mediaQuery.matches) {
      closeAllDropdowns();
      navLinks.classList.remove('active');
    }
  });
});

// Close dropdowns if clicking outside the nav.
document.addEventListener('click', function(e) {
  if (!e.target.closest('.nav-links')) {
    closeAllDropdowns();
    navLinks.classList.remove('active');
  }
});

// Update href overrides on window resize and reset dropdowns when switching to desktop.
window.addEventListener('resize', () => {
  toggleHrefs();
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

  
  // -------------------------
  // MAIN PAGE ARTICLES (MODAL & PAGINATION)
  // -------------------------
  const articlesPerPage = 6;
  let currentArticlePage = 1;
  
  function displayArticles(page) {
    const articlesGrid = document.getElementById('articles-grid');
    if (!articlesGrid) return;
    const mainArticles = allArticles.filter(article => article.displayOnMain)
      .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
    const startIndex = (page - 1) * articlesPerPage,
          endIndex = startIndex + articlesPerPage,
          articlesToShow = mainArticles.slice(startIndex, endIndex);
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
  
  function updateArticlesPagination(totalArticles) {
    const totalPages = Math.ceil(totalArticles / articlesPerPage),
          pageNumbers = document.getElementById('page-numbers');
    let html = `<button class="page-nav" id="prev-page" ${currentArticlePage === 1 ? 'disabled' : ''}><</button>`;
    let startPage = Math.max(1, currentArticlePage - 2),
        endPage = Math.min(totalPages, currentArticlePage + 2);
    if (currentArticlePage <= 3) { endPage = Math.min(5, totalPages); }
    if (currentArticlePage >= totalPages - 2) { startPage = Math.max(totalPages - 4, 1); }
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
    const targetElement = sectionId === 'articles' ?
      document.getElementById('articles-grid') :
      document.getElementById('learn-grid');
    if (!targetElement) return;
    const offset = window.innerWidth <= 768 ? -20 : -100;
    window.scrollTo({ top: targetElement.offsetTop + offset, behavior: 'smooth' });
  }
  
  function setupArticleClickEvents() {
    document.querySelectorAll('.article-card').forEach(card => {
      card.addEventListener('click', function(e) {
        e.preventDefault();
        const articleId = this.getAttribute('data-article-id'),
              article = allArticles.find(a => a.id == articleId);
        if (article) displayModal(article);
      });
    });
  }
  
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
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };
  }
  
  if (document.getElementById('articles-grid')) {
    displayArticles(currentArticlePage);
  }
  
  // -------------------------
  // LEARN PAGE ARTICLES (PAGINATION)
  // -------------------------
  const learnArticlesPerPage = 3;
  let currentLearnPage = 1;
  
  function displayLearnArticles(page) {
    const learnGrid = document.getElementById('learn-grid');
    if (!learnGrid) return;
    const learnArticles = allArticles.filter(article => article.displayOnLearn)
      .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
    const startIndex = (page - 1) * learnArticlesPerPage,
          endIndex = startIndex + learnArticlesPerPage,
          articlesToShow = learnArticles.slice(startIndex, endIndex);
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
  
  function updateLearnPagination(totalArticles) {
    const totalPages = Math.ceil(totalArticles / learnArticlesPerPage),
          pageNumbers = document.getElementById('learn-page-numbers');
    let html = `<button class="page-nav" id="learn-prev-page" ${currentLearnPage === 1 ? 'disabled' : ''}><</button>`;
    let startPage = Math.max(1, currentLearnPage - 1),
        endPage = Math.min(totalPages, currentLearnPage + 1);
    if (currentLearnPage <= 2) { endPage = Math.min(3, totalPages); }
    if (currentLearnPage >= totalPages - 1) { startPage = Math.max(totalPages - 2, 1); }
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
  
  if (document.getElementById('learn-grid')) {
    displayLearnArticles(currentLearnPage);
  }
});
