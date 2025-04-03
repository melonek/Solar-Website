// gallery.js
document.addEventListener('DOMContentLoaded', function() {
  if (!window.jobs) {
    console.error('Jobs array not found. Ensure jobs.js is loaded before gallery.js.');
    return;
  }
  const jobs = window.jobs;

  const modal = document.getElementById('modal');
  const modalBody = document.querySelector('.modal-body');
  const closeModal = document.querySelector('.close-modal');
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.querySelector('.lightbox-content');
  const closeLightbox = document.querySelector('.close-lightbox');
  
  const carousel = document.querySelector('#installation-gallery .carousel');
  const leftBtn = document.querySelector('#installation-gallery .left-btn');
  const rightBtn = document.querySelector('#installation-gallery .right-btn');
  
  const archiveGrid = document.querySelector('.archive-grid');
  const loadMoreBtn = document.querySelector('.load-more');
  const loadMoreWrapper = document.querySelector('.load-more-wrapper');
  
  let scrollSpeed = 0.5;
  let currentTranslateX = 0;
  let carouselPaused = false;
  let modalActive = false;
  let lightboxActive = false;
  let modalWasOpenBeforeLightbox = false;
  
  const fallbackImage = "https://www.wienerberger.co.uk/content/dam/wienerberger/united-kingdom/marketing/photography/productshots/in-roof-solar/UK_MKT_PHO_REF_Solar_Grasmere_002.jpg.imgTransformer/media_16to10/md-2/1686313825853/UK_MKT_PHO_REF_Solar_Grasmere_002.jpg";
  
  function updateCarouselPauseState() {
    if (modalActive || lightboxActive) {
      carouselPaused = true;
    } else {
      carouselPaused = false;
    }
  }
  
  function parseTimeString(timeStr) {
    const match = timeStr.match(/(\d+):(\d+)\s*(am|pm)/i);
    if (match) {
      let hour = parseInt(match[1], 10);
      const minute = parseInt(match[2], 10);
      const period = match[3].toLowerCase();
      if (period === 'pm' && hour !== 12) { hour += 12; }
      if (period === 'am' && hour === 12) { hour = 0; }
      return { hours: hour, minutes: minute };
    }
    return { hours: 0, minutes: 0 };
  }
  
  function calculateDuration(timeStr) {
    const cleaned = timeStr.replace(/[()]/g, '');
    const parts = cleaned.split('-');
    const startStr = parts[0].trim();
    const finishStr = parts[1].trim();
    const start = parseTimeString(startStr);
    const finish = parseTimeString(finishStr);
    const startMinutes = start.hours * 60 + start.minutes;
    const finishMinutes = finish.hours * 60 + finish.minutes;
    const diff = finishMinutes - startMinutes;
    const duration = diff / 60;
    return duration.toFixed(2);
  }
  
  function formatDate(dateStr) {
    const [day, month, year] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }
  
  function openModal(job) {
    if (!modal || !modalBody) {
      console.error('Modal or modal-body not found');
      return;
    }
    modalActive = true;
    updateCarouselPauseState();
    document.body.style.overflow = 'hidden';
  
    window.history.pushState({ jobId: job.id }, job.title, `?job=${job.id}`);
  
    let modalContent = modalBody.querySelector('.modal-content');
    if (!modalContent) {
      modalContent = document.createElement('div');
      modalContent.className = 'modal-content';
      modalBody.appendChild(modalContent);
    }
    modalContent.innerHTML = '';
  
    const mainImg = document.createElement('img');
    mainImg.className = 'modal-main-img';
    mainImg.src = job.mainImage;
    mainImg.alt = job.title;
    validateImage(mainImg);
    mainImg.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(mainImg.src);
    });
    modalContent.appendChild(mainImg);
    
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'modal-details';
    detailsDiv.innerHTML = `
      <p><strong>House Type:</strong> ${job["House Type"]}</p>
      <p><strong>Installation Type:</strong> ${job["Installation Type"]}</p>
      <p><strong>System Size:</strong> ${job["System Size"]}</p>
      <p><strong>Roof Type:</strong> ${job.roofType}</p>
      <p><strong>Completion:</strong> ${formatDate(job.completionDate)}</p>
      <p><strong>Difficulty:</strong> ${job.difficulty}</p>
      <p><strong>Time:</strong> ${job.timeToComplete} (Total: ${calculateDuration(job.timeToComplete)} hours)</p>
      <p><strong>Suburb:</strong> ${job.suburb}</p>
    `;
    modalContent.appendChild(detailsDiv);
    
    const columnsContainer = document.createElement('div');
    columnsContainer.className = 'modal-columns';
    
    const leftColumn = document.createElement('div');
    leftColumn.className = 'modal-column';
    leftColumn.innerHTML = `<h1>Rooftop solar installation (Panels)</h1>`;
    job.additionalImages.slice(0, 2).forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = job.title;
      validateImage(img);
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(img.src);
      });
      leftColumn.appendChild(img);
    });
    
    const rightColumn = document.createElement('div');
    rightColumn.className = 'modal-column';
    rightColumn.innerHTML = `<h1>Wall-mounted inverter installation</h1>`;
    job.additionalImages.slice(2, 4).forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = job.title;
      validateImage(img);
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(img.src);
      });
      rightColumn.appendChild(img);
    });
    
    columnsContainer.appendChild(leftColumn);
    columnsContainer.appendChild(rightColumn);
    modalContent.appendChild(columnsContainer);
  
    // Add centered share button with Facebook "F" logo
    const shareWrapper = document.createElement('div');
    shareWrapper.className = 'share-wrapper';
    const shareButton = document.createElement('button');
    shareButton.className = 'share-btn';
    shareButton.innerHTML = `
      <svg class="fb-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
        <path fill="white" d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.733 0 1.326-.593 1.326-1.326V1.326C24 .593 23.407 0 22.675 0z"/>
      </svg>
      Share This Installation
    `;
    shareButton.addEventListener('click', () => {
      const shareUrl = `https://naturespark.com.au/gallery/job-static-htmls/gallery-${job.id}.html`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('URL copied to clipboard! Paste it on Facebook to share this installation.');
      });
    });
    shareWrapper.appendChild(shareButton);
    modalContent.appendChild(shareWrapper);
    
    modal.style.display = 'flex';
  }
  
  if (closeModal) {
    closeModal.addEventListener('click', function() {
      modalActive = false;
      modal.style.display = 'none';
      document.body.style.overflow = '';
      updateCarouselPauseState();
      window.history.pushState({}, document.title, window.location.pathname);
    });
  }
  
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (!e.target.closest('.modal-content')) {
        modalActive = false;
        modal.style.display = 'none';
        document.body.style.overflow = '';
        updateCarouselPauseState();
        window.history.pushState({}, document.title, window.location.pathname);
      }
    });
    modal.addEventListener('touchstart', function(e) {
      if (!e.target.closest('.modal-content')) {
        modalActive = false;
        modal.style.display = 'none';
        document.body.style.overflow = '';
        updateCarouselPauseState();
        window.history.pushState({}, document.title, window.location.pathname);
      }
    });
  }
  
  function openLightbox(src) {
    if (!lightbox || !lightboxContent) {
      console.error('Lightbox elements not found');
      return;
    }
    if (modalActive) {
      modalWasOpenBeforeLightbox = true;
      modal.style.display = 'none';
    }
    lightboxActive = true;
    updateCarouselPauseState();
    
    lightboxContent.src = src;
    lightbox.style.display = 'flex';
    lightbox.style.zIndex = '1000';
    
    let blurredOverlay = document.getElementById('blurred-background');
    if (!blurredOverlay) {
      blurredOverlay = document.createElement('div');
      blurredOverlay.id = 'blurred-background';
      document.body.appendChild(blurredOverlay);
    }
    Object.assign(blurredOverlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '998',
      backgroundImage: `url(${src})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'blur(5px)',
      opacity: '1',
      pointerEvents: 'none'
    });
    
    let blockingOverlay = document.getElementById('blocking-overlay');
    if (!blockingOverlay) {
      blockingOverlay = document.createElement('div');
      blockingOverlay.id = 'blocking-overlay';
      document.body.appendChild(blockingOverlay);
    }
    Object.assign(blockingOverlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '999',
      backgroundColor: 'transparent'
    });
    
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightboxFunc() {
    lightboxActive = false;
    updateCarouselPauseState();
    
    lightbox.style.display = 'none';
    
    const blurredOverlay = document.getElementById('blurred-background');
    if (blurredOverlay) blurredOverlay.remove();
    
    const blockingOverlay = document.getElementById('blocking-overlay');
    if (blockingOverlay) blockingOverlay.remove();
    
    if (modalWasOpenBeforeLightbox) {
      modal.style.display = 'flex';
      modalWasOpenBeforeLightbox = false;
      updateCarouselPauseState();
    }
    
    if (!modalActive && !lightboxActive) {
      document.body.style.overflow = '';
    }
  }
  
  if (closeLightbox) {
    closeLightbox.addEventListener('click', function(e) {
      e.stopPropagation();
      closeLightboxFunc();
    });
  }
  
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightboxFunc();
      }
    });
    
    let touchStartX, touchStartY;
    lightbox.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', function(e) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = Math.abs(touchEndX - touchStartX);
      const deltaY = Math.abs(touchEndY - touchStartY);
      if (deltaX < 10 && deltaY < 10 && e.target === lightbox) {
        closeLightboxFunc();
      }
    }, { passive: true });
    
    lightboxContent.addEventListener('click', function(e) {
      e.stopPropagation();
    });
    
    lightboxContent.addEventListener('touchstart', function(e) {
      e.stopPropagation();
    }, { passive: true });
  }
  
  function validateImage(img) {
    img.addEventListener('error', function() {
      img.src = fallbackImage;
      console.log(`Image failed to load, using fallback: ${img.src}`);
    });
  }
  
  function createCard(job) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const mainImg = document.createElement('img');
    mainImg.src = job.mainImage;
    mainImg.alt = job.title;
    validateImage(mainImg);
    mainImg.addEventListener('click', function(e) {
      e.stopPropagation();
      openLightbox(mainImg.src);
    });
    card.appendChild(mainImg);
    
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = job.title;
    card.appendChild(title);
    
    const detailsRow = document.createElement('div');
    detailsRow.className = 'details-row';
    
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'job-details';
    detailsContainer.innerHTML = `
      <p><strong>House Type:</strong> ${job["House Type"]}</p>
      <p><strong>Installation Type:</strong> ${job["Installation Type"]}</p>
      <p><strong>Roof Type:</strong> ${job.roofType}</p>
      <p><strong>Difficulty:</strong> ${job.difficulty}</p>
      <p><strong>Time:</strong> ${job.timeToComplete}</p>
      <p><strong>Suburb:</strong> ${job.suburb}</p>
    `;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.innerHTML = `
      <p><strong>System Size:</strong> ${job["System Size"]}</p>
      <p><strong>Completion:</strong> ${formatDate(job.completionDate)} (Total: ${calculateDuration(job.timeToComplete)} hours)</p>
    `;
    
    detailsRow.appendChild(detailsContainer);
    detailsRow.appendChild(buttonContainer);
    
    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'button-wrapper';
    const readMoreBtn = document.createElement('button');
    readMoreBtn.className = 'read-more';
    readMoreBtn.innerHTML = 'Read More';
    readMoreBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      openModal(job);
    });
    buttonWrapper.appendChild(readMoreBtn);
    
    card.appendChild(detailsRow);
    card.appendChild(buttonWrapper);
    
    const imagesContainer = document.createElement('div');
    imagesContainer.className = 'images';
    job.additionalImages.forEach((imgSrc) => {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = job.title;
      validateImage(img);
      img.addEventListener('click', function(e) {
        e.stopPropagation();
        openLightbox(img.src);
      });
      imagesContainer.appendChild(img);
    });
    card.appendChild(imagesContainer);
    
    card.addEventListener('mouseenter', () => scrollSpeed = 0);
    card.addEventListener('mouseleave', () => scrollSpeed = 0.5);
    
    return card;
  }
  
function renderCarousel() {
  if (!carousel) {
    console.error('Carousel not found');
    return;
  }
  console.log("Rendering carousel...");

  // Use the sorted jobs array for displaying the jobs in the carousel
  sortedJobs.forEach(job => {
    const card = createCard(job);
    carousel.appendChild(card);
  });

  // Optionally, duplicate the job cards for infinite scrolling effect
  sortedJobs.forEach(job => {
    const cardClone = createCard(job);
    carousel.appendChild(cardClone);
  });

  console.log("Total cards count:", carousel.children.length);
}

  
  let loadedJobs = 0;
  const batchSize = 20;
  
  function parseDate(dateStr) {
    const [day, month, year] = dateStr.split("-");
    return new Date(year, month - 1, day);
  }
  
  function getStartTime(timeStr) {
    const cleaned = timeStr.replace(/[()]/g, '');
    const parts = cleaned.split('-');
    const startStr = parts[0].trim();
    const timeObj = parseTimeString(startStr);
    return timeObj.hours * 60 + timeObj.minutes;
  }
  
const sortedJobs = jobs.slice().sort((a, b) => {
  const dateA = parseDate(a.completionDate);
  const dateB = parseDate(b.completionDate);
  if (dateA.getTime() !== dateB.getTime()) {
    return dateB - dateA;  // Sort by newest first
  } else {
    return getStartTime(b.timeToComplete) - getStartTime(a.timeToComplete);
  }
});
  
  function createArchiveSquare(job) {
    const square = document.createElement('div');
    square.className = 'archive-square';
    const img = document.createElement('img');
    img.src = job.mainImage;
    img.alt = job.suburb;
    validateImage(img);
    square.appendChild(img);
    const text = document.createElement('div');
    text.textContent = job.suburb;
    square.appendChild(text);
    square.addEventListener('click', function(e) {
      e.stopPropagation();
      openModal(job);
    });
    return square;
  }
  
  function loadArchiveBatch() {
    if (!archiveGrid) return;
    const remainingJobs = sortedJobs.length - loadedJobs;
    const batchCount = Math.min(batchSize, remainingJobs);
    for (let i = 0; i < batchCount; i++) {
      const job = sortedJobs[loadedJobs + i];
      const square = createArchiveSquare(job);
      archiveGrid.appendChild(square);
    }
    loadedJobs += batchCount;
    if (remainingJobs <= 0 && loadedJobs > 0 && loadMoreWrapper) {
      const existingNotification = loadMoreWrapper.querySelector('.load-notification');
      if (!existingNotification) {
        const notification = document.createElement('p');
        notification.className = 'load-notification';
        notification.textContent = "All jobs have been displayed.";
        loadMoreWrapper.appendChild(notification);
      }
    }
  }

  (function() {
    const originalScrollTo = window.scrollTo;
    window.scrollTo = function(x, y) {
      if (x === 0 && y === 0) {
        console.log("Prevented automatic scroll to top via scrollTo.");
        return;
      }
      return originalScrollTo.apply(window, arguments);
    };

    const originalScroll = window.scroll;
    window.scroll = function(options) {
      if (typeof options === "object" && options.top === 0 && options.left === 0) {
        console.log("Prevented automatic scroll to top via scroll.");
        return;
      }
      return originalScroll.apply(window, arguments);
    };
  })();

  // Auto-open modal for static job pages
  if (window.location.pathname.includes('/gallery/job-static-htmls/gallery-job')) {
    const pathParts = window.location.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1]; // e.g., "gallery-job22.html"
    const jobId = fileName.replace('gallery-', '').replace('.html', ''); // e.g., "job22"
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      console.log(`Auto-opening modal for static page job: ${jobId}`);
      openModal(job);
    } else {
      console.error(`Job not found for static page: ${jobId}`);
    }
  }

  // Open modal based on query param (optional, if still used)
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('job');
  if (jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      openModal(job);
    } else {
      console.error(`Job not found for ID: ${jobId}`);
    }
  }
  
  function autoScroll() {
    if (!carouselPaused && carousel) {
      currentTranslateX -= scrollSpeed;
      if (Math.abs(currentTranslateX) >= carousel.scrollWidth / 2) {
        currentTranslateX = 0;
      }
      carousel.style.transform = `translateX(${currentTranslateX}px)`;
    }
    requestAnimationFrame(autoScroll);
  }
  
  if (leftBtn) {
    leftBtn.addEventListener('click', function() {
      currentTranslateX += 200;
      carousel.style.transform = `translateX(${currentTranslateX}px)`;
    });
  }
  if (rightBtn) {
    rightBtn.addEventListener('click', function() {
      currentTranslateX -= 200;
      carousel.style.transform = `translateX(${currentTranslateX}px)`;
    });
  }
  
  window.addEventListener('popstate', function(event) {
    const jobId = event.state?.jobId;
    if (jobId) {
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        openModal(job);
      }
    } else {
      modal.style.display = 'none';
      modalActive = false;
      document.body.style.overflow = '';
      updateCarouselPauseState();
    }
  });
  
  renderCarousel();
  autoScroll();
  if (archiveGrid && loadMoreBtn && loadMoreWrapper) {
    loadArchiveBatch();
    loadMoreBtn.addEventListener('click', loadArchiveBatch);
  }
});

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