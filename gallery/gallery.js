/* gallery.js */

document.addEventListener('DOMContentLoaded', function() {
  const fallbackImage = "https://www.wienerberger.co.uk/content/dam/wienerberger/united-kingdom/marketing/photography/productshots/in-roof-solar/UK_MKT_PHO_REF_Solar_Grasmere_002.jpg.imgTransformer/media_16to10/md-2/1686313825853/UK_MKT_PHO_REF_Solar_Grasmere_002.jpg";
  
  const jobs = [
    {
      title: "Harrisdale Installation",
      "House Type": "Single-story",
      "Installation Type": "Normal Solar",
      "System Size": "6.6kW (15 Panels)",
      roofType: "Concrete Tile",
      completionDate: "04-03-2025",
      difficulty: "Easy",
      timeToComplete: "(9:00am - 12:30pm)",
      suburb: "Harrisdale, WA, 6112",
      mainImage: "../images/Jobs/Job1/house.webp",
      additionalImages: [
        "../images/Jobs/Job1/panels1.webp",
        "../images/Jobs/Job1/panels2.webp",
        "../images/Jobs/Job1/inverter1.webp",
        "../images/Jobs/Job1/inverter2.webp",
      ]
    },
    {
      title: "Westminister Installation",
      "House Type": "Two-story",
      "Installation Type": "Battery + Solar",
      "System Size": "6.6kW (15 Panels)",
      roofType: "Metal Tin",
      completionDate: "05-03-2025",
      difficulty: "Easy",
      timeToComplete: "(7:00am - 11:34pm)",
      suburb: "Westminister, WA, 6061",
      mainImage: "../images/Jobs/Job2/main.jpg",
      additionalImages: [
        "../images/Jobs/Job2/panels.jpg",
        "../images/Jobs/Job2/panels1.jpg",
        "../images/Jobs/Job2/inverter:battery.jpg",
      ]
    },
    {
      title: "Mount Pleasant Installation",
      "House Type": "Double-story",
      "Installation Type": "Normal Solar",
      "System Size": "13.2kW (30 panels)",
      roofType: "Clay Tile",
      completionDate: "06-03-2025",
      difficulty: "High",
      timeToComplete: "(7:30am-5:00pm)",
      suburb: "Mount Pleasant, WA, 6153",
      mainImage: "../images/Jobs/Job3/a6dd0bb1-aed1-411b-aeca-90c20a6df7f8.jpg",
      additionalImages: [
        "../images/Jobs/Job3/48771b1d-ce9c-4f01-a632-e3141255724e.jpg",
        "../images/Jobs/Job3/a71afa1a-b842-427c-abc2-eed41bc355b9.jpg",
        "../images/Jobs/Job3/ed3d4d52-21e3-4755-9fe3-e1c8c2b8de40.jpg",
      ]
    },
    {
      title: "Alexander Heights Installation",
      "House Type": "Single-story",
      "Installation Type": "Normal Solar",
      "System Size": "6.6kW (15 Panels)",
      roofType: "Concrete Tile",
      completionDate: "07-03-2025",
      difficulty: "Easy",
      timeToComplete: "(7:00am-11:20am)",
      suburb: "Alexander Heights, WA, 6064",
      mainImage: "../images/Jobs/Job4/df5cb2b5-c55b-477f-a8a5-31e5eeb53ab4.jpg",
      additionalImages: [
        "../images/Jobs/Job4/e2fded1a-6a90-446e-b64f-52567e2c61b8.jpg",
        "../images/Jobs/Job4/ba923769-b190-4e74-b7d5-c5ee831ec7fb.jpg",
        "../images/Jobs/Job4/296592db-fcc6-4bcb-85ee-710e841bf76c.jpg",
        "../images/Jobs/Job4/5207bfe2-040f-45d2-98ef-f6bd97426d45.jpg",
      ]
    },
    {
      title: "Two Rocks Installation",
      "House Type": "Single-story",
      "Installation Type": "Normal Solar",
      "System Size": "6.6kW (15 Panels)",
      roofType: "Metal Tin",
      completionDate: "07-03-2025",
      difficulty: "Easy",
      timeToComplete: "(12:30pm-4:00pm)",
      suburb: "Two Rocks, WA, 6037",
      mainImage: "../images/Jobs/Job5/24841301-396b-41c8-a7af-6e6f505f29f8.jpg",
      additionalImages: [
        "../images/Jobs/Job5/da54523a-2d7d-4253-abfc-33ca0cb63f62.jpg",
        "../images/Jobs/Job5/4f0bd18a-c425-43fc-af48-0ee40c2d460a.jpg",
        "../images/Jobs/Job5/ee8b5e94-f9fd-4eeb-8339-2bf6eaadbcb2.jpg",
        "../images/Jobs/Job5/4f0bd18a-c425-43fc-af48-0ee40c2d460a.jpg",
      ]
    }
  ];

  function formatDate(dateStr) {
      const [day, month, year] = dateStr.split("-");
      return `${day}-${month}-${year}`;
  }

  const carousel = document.querySelector('.carousel');
  const leftBtn = document.querySelector('.left-btn');
  const rightBtn = document.querySelector('.right-btn');
  const modal = document.getElementById('modal');
  const modalBody = document.querySelector('.modal-body');
  const closeModal = document.querySelector('.close-modal');
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.querySelector('.lightbox-content');

  let scrollSpeed = 0.5;
  let currentTranslateX = 0;
  
  // Updated createCard function
  function createCard(job) {
      const card = document.createElement('div');
      card.className = 'card';
      
      const mainImg = document.createElement('img');
      mainImg.src = job.mainImage;
      mainImg.alt = job.title;
      validateImage(mainImg);
      mainImg.addEventListener('click', () => openLightbox(mainImg.src));
      card.appendChild(mainImg);
      
      // Title as a separate centered element above details-row
      const title = document.createElement('h3');
      title.className = 'card-title';
      title.innerHTML = job.title;
      card.appendChild(title);
      
      const detailsRow = document.createElement('div');
      detailsRow.className = 'details-row';
      
      // Left column: House Type, Installation Type
      const detailsContainer = document.createElement('div');
      detailsContainer.className = 'job-details';
      detailsContainer.innerHTML = `
        <p><strong>House Type:</strong> ${job["House Type"]}</p>
        <p><strong>Installation Type:</strong> ${job["Installation Type"]}</p>
      `;
      
      // Right column: System Size, Completion
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'button-container';
      buttonContainer.innerHTML = `
        <p><strong>System Size:</strong> ${job["System Size"]}</p>
        <p><strong>Completion:</strong> ${formatDate(job.completionDate)}</p>
      `;
      
      detailsRow.appendChild(detailsContainer);
      detailsRow.appendChild(buttonContainer);
      
      // Button wrapper (centered below both columns)
      const buttonWrapper = document.createElement('div');
      buttonWrapper.className = 'button-wrapper';
      
      const readMoreBtn = document.createElement('button');
      readMoreBtn.className = 'read-more shiny';
      const innerSpan = document.createElement('span');
      innerSpan.className = 'button-inner';
      innerSpan.textContent = 'Read More';
      readMoreBtn.appendChild(innerSpan);
      
      readMoreBtn.addEventListener('click', () => openModal(job));
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
        img.addEventListener('click', () => openLightbox(img.src));
        imagesContainer.appendChild(img);
      });
      card.appendChild(imagesContainer);
      
      card.addEventListener('mouseenter', () => scrollSpeed = 0);
      card.addEventListener('mouseleave', () => scrollSpeed = 0.5);
      
      return card;
  }

  function validateImage(img) {
    img.addEventListener('error', function() {
      img.src = fallbackImage;
    });
  }
  
  function renderCarousel() {
    jobs.forEach(job => {
      const card = createCard(job);
      carousel.appendChild(card);
    });
    jobs.forEach(job => {
      const cardClone = createCard(job);
      carousel.appendChild(cardClone);
    });
  }
  
  function openModal(job) {
    modalBody.innerHTML = '';
    
    const mainImg = document.createElement('img');
    mainImg.className = 'modal-main-img';
    mainImg.src = job.mainImage;
    mainImg.alt = job.title;
    validateImage(mainImg);
    mainImg.addEventListener('click', () => openLightbox(mainImg.src));
    modalBody.appendChild(mainImg);
    
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'modal-details';
    detailsDiv.innerHTML = `
      <p><strong>House Type:</strong> ${job["House Type"]}</p>
      <p><strong>Installation Type:</strong> ${job["Installation Type"]}</p>
      <p><strong>System Size:</strong> ${job["System Size"]}</p>
      <p><strong>Roof Type:</strong> ${job.roofType}</p>
      <p><strong>Completion:</strong> ${formatDate(job.completionDate)}</p>
      <p><strong>Difficulty:</strong> ${job.difficulty}</p>
      <p><strong>Time:</strong> ${job.timeToComplete}</p>
      <p><strong>Suburb:</strong> ${job.suburb}</p>
    `;
    modalBody.appendChild(detailsDiv);
    
    const columnsContainer = document.createElement('div');
    columnsContainer.className = 'modal-columns';
    
    const leftColumn = document.createElement('div');
    leftColumn.className = 'modal-column';
    leftColumn.innerHTML = `<h1>Rooftop solar installation (Panels)</h1>`;
    job.additionalImages.slice(0,2).forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = job.title;
      validateImage(img);
      img.addEventListener('click', () => openLightbox(img.src));
      leftColumn.appendChild(img);
    });
    
    const rightColumn = document.createElement('div');
    rightColumn.className = 'modal-column';
    rightColumn.innerHTML = `<h1>Wall-mounted inverter installation</h1>`;
    job.additionalImages.slice(2,4).forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = job.title;
      validateImage(img);
      img.addEventListener('click', () => openLightbox(img.src));
      rightColumn.appendChild(img);
    });
    
    columnsContainer.appendChild(leftColumn);
    columnsContainer.appendChild(rightColumn);
    modalBody.appendChild(columnsContainer);
    
    modal.style.display = 'block';
  }
  
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  window.addEventListener('touchstart', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
  });
  
  function openLightbox(src) {
    lightboxContent.src = src;
    lightbox.style.display = 'flex';
  }
  
  const closeLightbox = document.querySelector('.close-lightbox');
  closeLightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });
  
  lightbox.addEventListener('click', (e) => {
      if (!lightboxContent.contains(e.target)) {
        lightbox.style.display = 'none';
      }
  });
    
  lightbox.addEventListener('touchstart', (e) => {
      if (!lightboxContent.contains(e.target)) {
        lightbox.style.display = 'none';
      }
  });
  
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
  
  renderCarousel();
  autoScroll();
});