document.addEventListener('DOMContentLoaded', function() {
  // ----------------------
  // Selectors and Globals
  // ----------------------
  const modal = document.getElementById('modal');
  const modalBody = document.querySelector('.modal-body');
  const closeModal = document.querySelector('.close-modal');
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.querySelector('.lightbox-content');
  const closeLightbox = document.querySelector('.close-lightbox');
  
  // Carousel Elements
  const carousel = document.querySelector('#installation-gallery .carousel');
  const leftBtn = document.querySelector('#installation-gallery .left-btn');
  const rightBtn = document.querySelector('#installation-gallery .right-btn');
  
  // Archive Elements (if used)
  const archiveGrid = document.querySelector('.archive-grid');
  const loadMoreBtn = document.querySelector('.load-more');
  const loadMoreWrapper = document.querySelector('.load-more-wrapper');
  
  // Global variables for carousel scrolling
  let scrollSpeed = 0.5;
  let currentTranslateX = 0;
  
  // Global flag to pause/resume carousel auto-scroll
  let carouselPaused = false;
  
  // Flags for overlays:
  let modalActive = false;
  let lightboxActive = false;
  let modalWasOpenBeforeLightbox = false;
  
  function updateCarouselPauseState() {
    if (modalActive || lightboxActive) {
      carouselPaused = true;
    } else {
      carouselPaused = false;
    }
  }
  
  // Fallback image in case an image fails to load
  const fallbackImage = "https://www.wienerberger.co.uk/content/dam/wienerberger/united-kingdom/marketing/photography/productshots/in-roof-solar/UK_MKT_PHO_REF_Solar_Grasmere_002.jpg.imgTransformer/media_16to10/md-2/1686313825853/UK_MKT_PHO_REF_Solar_Grasmere_002.jpg";
  
  // ----------------------
  // Utility Functions
  // ----------------------
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
  
  // ----------------------
  // Modal Functions
  // ----------------------
  function openModal(job) {
    if (!modal || !modalBody) {
      console.error('Modal or modal-body not found');
      return;
    }
    modalActive = true;
    updateCarouselPauseState();
    document.body.style.overflow = 'hidden';

    // Check for existing modal-content; reuse if present, otherwise create new
    let modalContent = modalBody.querySelector('.modal-content');
    if (!modalContent) {
      modalContent = document.createElement('div');
      modalContent.className = 'modal-content';
      modalBody.appendChild(modalContent);
    }
    modalContent.innerHTML = ''; // Clear existing content

    // Main Image
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
    
    // Details Section
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
    
    // Two columns for additional images
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
    
    // Show modal
    modal.style.display = 'flex';
    
    // Reset scroll position to top
    modal.scrollTop = 0;
    window.requestAnimationFrame(() => { modal.scrollTop = 0; });
  }
  
  // Close modal when clicking the close button
  if (closeModal) {
    closeModal.addEventListener('click', function() {
      modalActive = false;
      modal.style.display = 'none';
      document.body.style.overflow = '';
      updateCarouselPauseState();
    });
  }
  
  // Close modal when clicking outside the modal-content
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (!e.target.closest('.modal-content')) {
        modalActive = false;
        modal.style.display = 'none';
        document.body.style.overflow = '';
        updateCarouselPauseState();
      }
    });
    modal.addEventListener('touchstart', function(e) {
      if (!e.target.closest('.modal-content')) {
        modalActive = false;
        modal.style.display = 'none';
        document.body.style.overflow = '';
        updateCarouselPauseState();
      }
    });
  }
  
  // ----------------------
  // Lightbox Functions
  // ----------------------
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
    
    // Blurred background overlay
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
    
    // Transparent blocking overlay
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
  
  // ----------------------
  // Image Validation Utility
  // ----------------------
  function validateImage(img) {
    img.addEventListener('error', function() {
      img.src = fallbackImage;
    });
  }
  
  // ----------------------
  // Carousel & Archive Rendering
  // ----------------------
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
    jobs.forEach(job => {
      const card = createCard(job);
      carousel.appendChild(card);
    });
    jobs.forEach(job => {
      const cardClone = createCard(job);
      carousel.appendChild(cardClone);
    });
    console.log("Total cards count:", carousel.children.length);
  }
  
  // Render Archive (if present)
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
      return dateB - dateA;
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
    const text = document.createElement('p');
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
        notification.textContent = "All images have been displayed.";
        loadMoreWrapper.appendChild(notification);
      }
    }
  }
  
  // ----------------------
  // Carousel Auto-Scroll
  // ----------------------
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
  
  // Left and Right control buttons
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
  
  // ----------------------
  // Initialize Everything
  // ----------------------
  renderCarousel();
  autoScroll();
  if (archiveGrid && loadMoreBtn && loadMoreWrapper) {
    loadArchiveBatch();
    loadMoreBtn.addEventListener('click', loadArchiveBatch);
  }
});