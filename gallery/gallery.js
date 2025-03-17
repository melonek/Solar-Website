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

  const jobs = [
    {
      title: "Harrisdale Installation",
      "House Type": "Single-Storey",
      "Installation Type": "Normal Solar",
      "System Size": "6.6kW (15 Panels)",
      roofType: "Concrete Tile",
      completionDate: "04-03-2025",
      difficulty: "Easy",
      timeToComplete: "(9:00am - 12:30pm)",
      suburb: "Harrisdale, WA, 6112",
      mainImage: "/images/Jobs/Job1/house.webp",
      additionalImages: [
        "/images/Jobs/Job1/panels1.webp",
        "/images/Jobs/Job1/panels2.webp",
        "/images/Jobs/Job1/inverter1.webp",
        "/images/Jobs/Job1/inverter2.webp",
      ]
    },
    {
      title: "Westminister Installation",
      "House Type": "Double-Storey",
      "Installation Type": "Battery + Solar",
      "System Size": "6.6kW (15 Panels)",
      roofType: "Metal Tin",
      completionDate: "05-03-2025",
      difficulty: "Easy",
      timeToComplete: "(7:00am - 11:34am)",
      suburb: "Westminister, WA, 6061",
      mainImage: "/images/Jobs/Job2/main.jpg",
      additionalImages: [
        "/images/Jobs/Job2/panels.jpg",
        "/images/Jobs/Job2/panels1.jpg",
        "/images/Jobs/Job2/inverter:battery.jpg",
      ]
    },
    {
      title: "Mount Pleasant Installation",
      "House Type": "Double-Storey",
      "Installation Type": "Normal Solar",
      "System Size": "13.2kW (30 panels)",
      roofType: "Clay Tile",
      completionDate: "06-03-2025",
      difficulty: "High",
      timeToComplete: "(7:30am-5:00pm)",
      suburb: "Mount Pleasant, WA, 6153",
      mainImage: "/images/Jobs/Job3/a6dd0bb1-aed1-411b-aeca-90c20a6df7f8.jpg",
      additionalImages: [
        "/images/Jobs/Job3/48771b1d-ce9c-4f01-a632-e3141255724e.jpg",
        "/images/Jobs/Job3/a71afa1a-b842-427c-abc2-eed41bc355b9.jpg",
        "/images/Jobs/Job3/ed3d4d52-21e3-4755-9fe3-e1c8c2b8de40.jpg",
      ]
    },
    {
      title: "Alexander Heights Installation",
      "House Type": "Single-Storey",
      "Installation Type": "Normal Solar",
      "System Size": "6.6kW (15 Panels)",
      roofType: "Concrete Tile",
      completionDate: "07-03-2025",
      difficulty: "Easy",
      timeToComplete: "(7:00am-11:20am)",
      suburb: "Alexander Heights, WA, 6064",
      mainImage: "/images/Jobs/Job4/df5cb2b5-c55b-477f-a8a5-31e5eeb53ab4.jpg",
      additionalImages: [
        "/images/Jobs/Job4/e2fded1a-6a90-446e-b64f-52567e2c61b8.jpg",
        "/images/Jobs/Job4/ba923769-b190-4e74-b7d5-c5ee831ec7fb.jpg",
        "/images/Jobs/Job4/296592db-fcc6-4bcb-85ee-710e841bf76c.jpg",
        "/images/Jobs/Job4/5207bfe2-040f-45d2-98ef-f6bd97426d45.jpg",
      ]
    },
    {
      title: "Two Rocks Installation",
      "House Type": "Single-Storey",
      "Installation Type": "Normal Solar",
      "System Size": "6.6kW (15 Panels)",
      roofType: "Metal Tin",
      completionDate: "07-03-2025",
      difficulty: "Easy",
      timeToComplete: "(12:30pm-4:00pm)",
      suburb: "Two Rocks, WA, 6037",
      mainImage: "/images/Jobs/Job5/24841301-396b-41c8-a7af-6e6f505f29f8.jpg",
      additionalImages: [
        "/images/Jobs/Job5/da54523a-2d7d-4253-abfc-33ca0cb63f62.jpg",
        "/images/Jobs/Job5/4f0bd18a-c425-43fc-af48-0ee40c2d460a.jpg",
        "/images/Jobs/Job5/ee8b5e94-f9fd-4eeb-8339-2bf6eaadbcb2.jpg",
        "/images/Jobs/Job5/91170244-36a7-417b-97bf-90eb6da330c8.jpg",
      ]
    },
    {
      title: "Kardinya Installation",
      "House Type": "Single-Storey",
      "Installation Type": "Normal Solar",
      "System Size": "6.6kW (15 Panels)",
      roofType: "Clay Tile",
      completionDate: "10-03-2025",
      difficulty: "Easy",
      timeToComplete: "(8:45am-12:00pm)",
      suburb: "Kardinya, WA, 6163",
      mainImage: "/images/Jobs/Job6/Screenshot 2025-03-11 at 2.29.26 pm.png",
      additionalImages: [
        "/images/Jobs/Job6/dj6x8tprrc3aqt1lwslw.webp",
        "/images/Jobs/Job6/ikks9mlyrfz1cjwuga0b.webp",
        "/images/Jobs/Job6/ccjarhy6fomzku85sw9s.webp",
        "/images/Jobs/Job6/vqc2wtzi3obwz2pdgg3r.webp",
      ]
    },
    {
      title: "St James Installation",
      "House Type": "Double-Storey",
      "Installation Type": "Normal Solar",
      "System Size": "6.6kW (15 Panels)",
      roofType: "Metal Tin",
      completionDate: "10-03-2025",
      difficulty: "Easy",
      timeToComplete: "(1:30pm-4:00pm)",
      suburb: "St James, WA, 6102",
      mainImage: "/images/Jobs/Job7/c4cba490-642e-409d-8e82-a5400385acbc.webp",
      additionalImages: [
        "/images/Jobs/Job7/75a6cbd6-cc41-4001-ac75-5b10a8f34d28.webp",
        "/images/Jobs/Job7/83b35a29-2075-484f-b651-3ca17a7a716c.webp",
        "/images/Jobs/Job7/27fc3f48-fc6e-4912-b14b-6f44b17583f8.webp",
        "/images/Jobs/Job7/d8da588a-26b0-4a0f-a156-d4ff90fa593e.webp",
      ]
    },
    {
      title: "Victoria Park Installation",
      "House Type": "Double-Storey",
      "Installation Type": "Normal Solar",
      "System Size": "6.6kW (15 Panels)",
      roofType: "Metal Tin",
      completionDate: "12-03-2025",
      difficulty: "Moderate",
      timeToComplete: "(8:45am-1:15pm)",
      suburb: "Victoria Park, WA, 6100",
      mainImage: "/images/Jobs/Job8/m.jpg",
      additionalImages: [
        "/images/Jobs/Job8/p1.jpg",
        "/images/Jobs/Job8/p2.jpg",
        "/images/Jobs/Job8/i1.jpg",
        "/images/Jobs/Job8/i2.jpg",
      ]
    },
    {
      title: "Apple Cross Installation",
      "House Type": "Double-Storey",
      "Installation Type": "Normal Solar",
      "System Size": "6.6kW (15 Panels)",
      roofType: "Metal Tin",
      completionDate: "13-03-2025",
      difficulty: "Moderate",
      timeToComplete: "(7:45am-10:35am)",
      suburb: "Apple Cross, WA, 6153",
      mainImage: "/images/Jobs/Job9/m.webp",
      additionalImages: [
        "/images/Jobs/Job9/p1.webp",
        "/images/Jobs/Job9/p2.webp",
        "/images/Jobs/Job9/i1.webp",
        "/images/Jobs/Job9/i2.webp",
      ]
    },
    {
      title: "Bayswater Installation",
      "House Type": "Double-Storey",
      "Installation Type": "Normal Solar",
      "System Size": "6.6kW (15 Panels)",
      roofType: "Clay Tile",
      completionDate: "14-03-2025",
      difficulty: "Moderate",
      timeToComplete: "(8:30am-12:15pm)",
      suburb: "Bayswater, WA, 6053",
      mainImage: "/images/Jobs/Job10/m.webp",
      additionalImages: [
        "/images/Jobs/Job10/p1.webp",
        "/images/Jobs/Job10/p2.webp",
        "/images/Jobs/Job10/i1.webp",
        "/images/Jobs/Job10/i2.webp",
      ]
    },
    {
      title: "Victoria Park Installation",
      "House Type": "Double-Storey",
      "Installation Type": "Normal Solar",
      "System Size": "6.6kW (15 Panels)",
      roofType: "Clay Tile",
      completionDate: "14-03-2025",
      difficulty: "Moderate",
      timeToComplete: "(1:20pm-4:33pm)",
      suburb: "Victoria Park, WA, 6100",
      mainImage: "/images/Jobs/Job11/m.webp",
      additionalImages: [
        "/images/Jobs/Job11/p1.webp",
        "/images/Jobs/Job11/p2.webp",
        "/images/Jobs/Job11/i1.webp",
        "/images/Jobs/Job11/i2.webp",
      ]
    }
  ];

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
    modal.style.display = 'block';
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

  // ─── LIGHTBOX (Image Modal) ─────────────────────────────────────
  function openLightbox(src) {
    lightboxContent.src = src;
    lightbox.style.display = 'flex';
    lightbox.style.zIndex = '1000'; // Lightbox on top

    // Disable interactions with the modal
    modal.style.pointerEvents = 'none';
    const modalContent = document.querySelector('#modal .modal-content');
    if (modalContent) {
      modalContent.style.pointerEvents = 'none';
    }

    // Create blurred background overlay (between modal and lightbox)
    const blurredOverlay = document.createElement('div');
    blurredOverlay.id = 'blurred-background';
    blurredOverlay.style.position = 'fixed';
    blurredOverlay.style.top = '0';
    blurredOverlay.style.left = '0';
    blurredOverlay.style.width = '100%';
    blurredOverlay.style.height = '100%';
    blurredOverlay.style.zIndex = '999'; // Above modal, below lightbox
    blurredOverlay.style.backgroundImage = `url(${src})`;
    blurredOverlay.style.backgroundSize = 'cover';
    blurredOverlay.style.backgroundPosition = 'center';
    blurredOverlay.style.filter = 'blur(5px)'; // Increased blur for better effect
    blurredOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Dark overlay to obscure modal
    blurredOverlay.style.opacity = '1';
    document.body.appendChild(blurredOverlay);

    // Lock scrolling
    document.body.style.overflow = 'hidden';
  }

  function closeLightboxFunc() {
    lightbox.style.display = 'none';

    // Re-enable modal interactions
    modal.style.pointerEvents = '';
    const modalContent = document.querySelector('#modal .modal-content');
    if (modalContent) {
      modalContent.style.pointerEvents = '';
    }

    // Remove blurred background
    const blurredOverlay = document.getElementById('blurred-background');
    if (blurredOverlay) blurredOverlay.remove();

    // Restore scrolling if modal is not open
    if (modal.style.display !== 'block') {
      document.body.style.overflow = '';
    }
  }

  closeLightbox.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightboxFunc();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) { // Only trigger if clicking the lightbox container
      closeLightboxFunc();
    }
  });

  // Close lightbox on mobile touch (outside image)
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