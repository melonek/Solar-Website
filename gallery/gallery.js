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

document.addEventListener('DOMContentLoaded', function() {
  const fallbackImage = "https://www.wienerberger.co.uk/content/dam/wienerberger/united-kingdom/marketing/photography/productshots/in-roof-solar/UK_MKT_PHO_REF_Solar_Grasmere_002.jpg.imgTransformer/media_16to10/md-2/1686313825853/UK_MKT_PHO_REF_Solar_Grasmere_002.jpg";

  // Utility functions
  function parseTimeString(timeStr) {
    const match = timeStr.match(/(\d+):(\d+)\s*(am|pm)/i);
    if (match) {
      let hour = parseInt(match[1], 10);
      const minute = parseInt(match[2], 10);
      const period = match[3].toLowerCase();
      if (period === 'pm' && hour !== 12) {
        hour += 12;
      }
      if (period === 'am' && hour === 12) {
        hour = 0;
      }
      return { hours: hour, minutes: minute };
    }
    return { hours: 0, minutes: 0 };
  }

  function parseFinish(job) {
    const timeRange = job.timeToComplete.replace(/[()]/g, '');
    const parts = timeRange.split('-');
    const finishTimeStr = parts[1].trim();
    const [day, month, year] = job.completionDate.split('-').map(Number);
    const { hours, minutes } = parseTimeString(finishTimeStr);
    return new Date(year, month - 1, day, hours, minutes);
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

  // DOM selectors
  const carousel = document.querySelector('#installation-gallery .carousel');
  const leftBtn = document.querySelector('#installation-gallery .left-btn');
  const rightBtn = document.querySelector('#installation-gallery .right-btn');
  const modal = document.getElementById('modal');
  const modalBody = document.querySelector('.modal-body'); // Container for job modal content
  const closeModal = document.querySelector('.close-modal');

  // Lightbox (image modal) elements
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.querySelector('.lightbox-content');
  const closeLightbox = document.querySelector('.close-lightbox');
  const archiveGrid = document.querySelector('.archive-grid');
  const loadMoreBtn = document.querySelector('.load-more');
  const loadMoreWrapper = document.querySelector('.load-more-wrapper');

  let scrollSpeed = 0.5;
  let currentTranslateX = 0;
  let loadedJobs = 0;
  const batchSize = 20;

  // Sort jobs (newest to oldest) for the archive grid
  const sortedJobs = jobs.slice().sort((a, b) => parseFinish(b) - parseFinish(a));

  // Create a card for the carousel
  function createCard(job) {
    const card = document.createElement('div');
    card.className = 'card';

    const mainImg = document.createElement('img');
    mainImg.src = job.mainImage;
    mainImg.alt = job.title;
    validateImage(mainImg);
    // Stop propagation so the lightbox click doesn't interfere with the job modal
    mainImg.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(mainImg.src);
    });
    card.appendChild(mainImg);

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.innerHTML = job.title;
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
    readMoreBtn.className = 'read-more shiny';
    const innerSpan = document.createElement('span');
    innerSpan.className = 'button-inner';
    innerSpan.textContent = 'Read More';
    readMoreBtn.appendChild(innerSpan);
    // Clicking Read More opens the job modal
    readMoreBtn.addEventListener('click', (e) => {
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
      img.addEventListener('click', (e) => {
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

  // Create an archive square (for the archive grid)
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

    square.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(job);
    });

    return square;
  }

  // Fallback for broken images
  function validateImage(img) {
    img.addEventListener('error', function() {
      img.src = fallbackImage;
    });
  }

  // Render the carousel with duplicate sets for smooth scrolling
  function renderCarousel() {
    console.log("Rendering carousel...");
    jobs.forEach(job => {
      const card = createCard(job);
      carousel.appendChild(card);
    });
    console.log("Cards after first pass:", carousel.children.length);
    jobs.forEach(job => {
      const cardClone = createCard(job);
      carousel.appendChild(cardClone);
    });
    console.log("Total cards count:", carousel.children.length);
  }

  // Load jobs in batches for the archive grid
  function loadArchiveBatch() {
    const remainingJobs = sortedJobs.length - loadedJobs;
    const batchCount = Math.min(batchSize, remainingJobs);

    for (let i = 0; i < batchCount; i++) {
      const job = sortedJobs[loadedJobs + i];
      const square = createArchiveSquare(job);
      archiveGrid.appendChild(square);
    }

    loadedJobs += batchCount;

    if (remainingJobs <= 0 && loadedJobs > 0) {
      const existingNotification = loadMoreWrapper.querySelector('.load-notification');
      if (!existingNotification) {
        const notification = document.createElement('p');
        notification.className = 'load-notification';
        notification.textContent = "All images have been displayed.";
        loadMoreWrapper.appendChild(notification);
      }
    }
  }

  // ─── JOB MODAL (Job Details Modal) ──────────────────────────────
  // This function builds a proper modal structure with a wrapper (".modal-content")
  function openModal(job) {
    // Disable background scrolling when modal is open
    document.body.style.overflow = 'hidden';
    modalBody.innerHTML = ''; // Clear previous content

    // Create a container for all job modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // Main image
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

    // Job details
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'modal-details';
    detailsDiv.innerHTML = `
      <p><strong>House Type:</strong> ${job["House Type"]}</p>
      <p><strong>Installation Type:</strong> ${job["Installation Type"]}</p>
      <p><strong>System Size:</strong> ${job["System Size"]}</p>
      <p><strong>Roof Type:</strong> ${job.roofType}</p>
      <p><strong>Completion:</strong> ${formatDate(job.completionDate)}</p>
      <p><strong>Difficulty:</strong> ${job.difficulty}</p>
      <p><strong>Time:</strong> ${job.timeToComplete} // Total: ${calculateDuration(job.timeToComplete)} hours</p>
      <p><strong>Suburb:</strong> ${job.suburb}</p>
    `;
    modalContent.appendChild(detailsDiv);

    // Columns for additional images
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

    // Append the content to the modal body and show the job modal
    modalBody.appendChild(modalContent);
    modal.style.display = 'block';
  }

  // Close job modal when clicking on the close button
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
  });

  // Close job modal when clicking outside the modal-content wrapper
  modal.addEventListener('click', (e) => {
    if (!e.target.closest('.modal-content')) {
      modal.style.display = 'none';
      document.body.style.overflow = ''; // Restore scrolling
    }
  });

  modal.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.modal-content')) {
      modal.style.display = 'none';
      document.body.style.overflow = ''; // Restore scrolling
    }
  });

  // ─── LIGHTBOX (Image Modal) ─────────────────────────────────────
  function openLightbox(src) {
    lightboxContent.src = src;
    lightbox.style.display = 'flex';
    // Ensure lightbox appears above everything (set a higher z-index)
    lightbox.style.zIndex = '1000';
    // Completely disable any interaction on the modal by:
    // 1. Disabling pointer events on the modal element
    modal.style.pointerEvents = 'none';
    // 2. Creating a full-page transparent overlay to intercept any touches/clicks
    const overlay = document.createElement('div');
    overlay.id = 'global-modal-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '999'; // Below the lightbox (which is 1000)
    overlay.style.background = 'transparent';
    document.body.appendChild(overlay);
    // Lock scrolling
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightboxFunc() {
    lightbox.style.display = 'none';
    // Re-enable modal interactions
    modal.style.pointerEvents = '';
    // Remove the global overlay if it exists
    const overlay = document.getElementById('global-modal-overlay');
    if (overlay) overlay.remove();
    // Only restore scrolling if the job modal is not open
    if (modal.style.display !== 'block') {
      document.body.style.overflow = '';
    }
  }
  
  // Prevent clicks on the close button from bubbling up
  closeLightbox.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightboxFunc();
  });
  
  // Close lightbox when clicking directly on the lightbox overlay area
  lightbox.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      closeLightboxFunc();
    }
  });
  
  // Close lightbox on mobile touchend if tapped on the overlay area
  lightbox.addEventListener('touchend', (e) => {
    if (e.target === e.currentTarget) {
      closeLightboxFunc();
    }
  });
  
  // Prevent lightbox from closing when clicking on the image
  lightboxContent.addEventListener('click', function(e) {
    e.stopPropagation();
  });

  // ─── CAROUSEL SCROLLING ──────────────────────────────────────────
  function autoScroll() {
    currentTranslateX -= scrollSpeed;
    if (Math.abs(currentTranslateX) >= carousel.scrollWidth / 2) {
      currentTranslateX = 0;
    }
    carousel.style.transform = `translateX(${currentTranslateX}px)`;
    requestAnimationFrame(autoScroll);
  }

  leftBtn.addEventListener('click', () => {
    currentTranslateX += 200;
    carousel.style.transform = `translateX(${currentTranslateX}px)`;
  });

  rightBtn.addEventListener('click', () => {
    currentTranslateX -= 200;
    carousel.style.transform = `translateX(${currentTranslateX}px)`;
  });

  // ─── INITIALIZE ──────────────────────────────────────────────────
  renderCarousel();
  autoScroll();
  loadArchiveBatch();
  loadMoreBtn.addEventListener('click', loadArchiveBatch);
});
