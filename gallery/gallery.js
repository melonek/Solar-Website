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

  // Utility Functions
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

  // DOM Selectors
  const carousel = document.querySelector('#installation-gallery .carousel');
  const leftBtn = document.querySelector('#installation-gallery .left-btn');
  const rightBtn = document.querySelector('#installation-gallery .right-btn');
  const modal = document.getElementById('modal');
  const modalBody = document.querySelector('.modal-body');
  const closeModal = document.querySelector('.close-modal');
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

  const sortedJobs = jobs.slice().sort((a, b) => parseFinish(b) - parseFinish(a));

  function createCard(job) {
    const card = document.createElement('div');
    card.className = 'card';

    const mainImg = document.createElement('img');
    mainImg.src = job.mainImage;
    mainImg.alt = job.title;
    validateImage(mainImg);
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

  function validateImage(img) {
    img.addEventListener('error', function() {
      img.src = fallbackImage;
    });
  }

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

  function openModal(job) {
    document.body.style.overflow = 'hidden';
    modalBody.innerHTML = '';
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

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
      <p><strong>Time:</strong> ${job.timeToComplete} // Total: ${calculateDuration(job.timeToComplete)} hours</p>
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
    modalBody.appendChild(modalContent);

    modal.style.display = 'flex';
    modal.scrollTop = 0; // Reset scroll to top
    // Force reflow to ensure scroll position takes effect
    window.requestAnimationFrame(() => {
      modal.scrollTop = 0;
    });
  }

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  });

  modal.addEventListener('click', (e) => {
    if (!e.target.closest('.modal-content')) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  modal.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.modal-content')) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  // Lightbox (Image Modal)
  function openLightbox(src) {
    lightboxContent.src = src;
    lightbox.style.display = 'flex';
    lightbox.style.zIndex = '1000';

    if (modal.style.display === 'flex') {
      lightbox.style.background = 'rgba(0, 0, 0, 0.3)';
    } else {
      lightbox.style.background = 'rgba(0, 0, 0, 0.8)';
    }

    const blockingOverlay = document.createElement('div');
    blockingOverlay.id = 'blocking-overlay';
    blockingOverlay.style.position = 'fixed';
    blockingOverlay.style.top = '0';
    blockingOverlay.style.left = '0';
    blockingOverlay.style.width = '100%';
    blockingOverlay.style.height = '100%';
    blockingOverlay.style.zIndex = '950';
    blockingOverlay.style.backgroundColor = 'transparent';
    document.body.appendChild(blockingOverlay);

    const blurredOverlay = document.createElement('div');
    blurredOverlay.id = 'blurred-background';
    blurredOverlay.style.position = 'fixed';
    blurredOverlay.style.top = '0';
    blurredOverlay.style.left = '0';
    blurredOverlay.style.width = '100%';
    blurredOverlay.style.height = '100%';
    blurredOverlay.style.zIndex = '900';
    blurredOverlay.style.backgroundImage = `url(${src})`;
    blurredOverlay.style.backgroundSize = 'cover';
    blurredOverlay.style.backgroundPosition = 'center';
    blurredOverlay.style.filter = 'blur(5px)';
    blurredOverlay.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
    blurredOverlay.style.opacity = '1';
    document.body.appendChild(blurredOverlay);

    document.body.style.overflow = 'hidden';
  }

  function closeLightboxFunc() {
    lightbox.style.display = 'none';

    const blurredOverlay = document.getElementById('blurred-background');
    if (blurredOverlay) blurredOverlay.remove();

    const blockingOverlay = document.getElementById('blocking-overlay');
    if (blockingOverlay) blockingOverlay.remove();

    if (modal.style.display !== 'flex') {
      document.body.style.overflow = '';
    }
  }

  closeLightbox.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightboxFunc();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightboxFunc();
    }
  });

  let touchStartX, touchStartY;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = Math.abs(touchEndX - touchStartX);
    const deltaY = Math.abs(touchEndY - touchStartY);
    if (deltaX < 10 && deltaY < 10 && e.target === lightbox) {
      closeLightboxFunc();
    }
  }, { passive: true });

  lightboxContent.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  lightboxContent.addEventListener('touchstart', (e) => {
    e.stopPropagation();
  }, { passive: true });

  // Carousel Scrolling
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

  // Initialize
  renderCarousel();
  autoScroll();
  loadArchiveBatch();
  loadMoreBtn.addEventListener('click', loadArchiveBatch);
});