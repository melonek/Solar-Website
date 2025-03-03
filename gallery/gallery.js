/* gallery.js */

document.addEventListener('DOMContentLoaded', function() {
    // Use the new fallback image link for failed loads:
    const fallbackImage = "https://www.wienerberger.co.uk/content/dam/wienerberger/united-kingdom/marketing/photography/productshots/in-roof-solar/UK_MKT_PHO_REF_Solar_Grasmere_002.jpg.imgTransformer/media_16to10/md-2/1686313825853/UK_MKT_PHO_REF_Solar_Grasmere_002.jpg";
    
    // Updated data array with the new 4th additional image link for each job
    const jobs = [
      {
        title: "Solar Installation 1",
        roofType: "Metal",
        completionDate: "2023-09-01",
        difficulty: "Medium",
        timeToComplete: "2 days",
        suburb: "Sydney",
        mainImage: "https://live-production.wcms.abc-cdn.net.au/f2251d8ae3f73557147fada1afb2508b?impolicy=wcms_crop_resize&cropH=1008&cropW=1789&xPos=0&yPos=46&width=862&height=485",
        additionalImages: [
          "https://images.waunakeeremodeling.com/wp-content/uploads/2020/08/26190626/solar-on-roof6.jpg",
          "https://www.solarpowerworldonline.com/wp-content/uploads/2017/01/Mouli-2.jpg",
          "https://www.greenbuildingafrica.co.za/wp-content/uploads/2019/05/Rooftop-solar-GBA-Stock.jpg",
          fallbackImage
        ]
      },
      {
        title: "Solar Installation 2",
        roofType: "Tile",
        completionDate: "2023-08-15",
        difficulty: "High",
        timeToComplete: "3 days",
        suburb: "Melbourne",
        mainImage: "https://live-production.wcms.abc-cdn.net.au/f2251d8ae3f73557147fada1afb2508b?impolicy=wcms_crop_resize&cropH=1008&cropW=1789&xPos=0&yPos=46&width=862&height=485",
        additionalImages: [
          "https://images.waunakeeremodeling.com/wp-content/uploads/2020/08/26190626/solar-on-roof6.jpg",
          "https://www.solarpowerworldonline.com/wp-content/uploads/2017/01/Mouli-2.jpg",
          "https://www.greenbuildingafrica.co.za/wp-content/uploads/2019/05/Rooftop-solar-GBA-Stock.jpg",
          fallbackImage
        ]
      },
      {
        title: "Solar Installation 3",
        roofType: "Asphalt Shingle",
        completionDate: "2023-07-20",
        difficulty: "Low",
        timeToComplete: "1 day",
        suburb: "Brisbane",
        mainImage: "https://live-production.wcms.abc-cdn.net.au/f2251d8ae3f73557147fada1afb2508b?impolicy=wcms_crop_resize&cropH=1008&cropW=1789&xPos=0&yPos=46&width=862&height=485",
        additionalImages: [
          "https://images.waunakeeremodeling.com/wp-content/uploads/2020/08/26190626/solar-on-roof6.jpg",
          "https://www.solarpowerworldonline.com/wp-content/uploads/2017/01/Mouli-2.jpg",
          "https://www.greenbuildingafrica.co.za/wp-content/uploads/2019/05/Rooftop-solar-GBA-Stock.jpg",
          fallbackImage
        ]
      }
      // Add more job objects as needed.
    ];
  
    const carousel = document.querySelector('.carousel');
    const leftBtn = document.querySelector('.left-btn');
    const rightBtn = document.querySelector('.right-btn');
    const modal = document.getElementById('modal');
    const modalBody = document.querySelector('.modal-body');
    const closeModal = document.querySelector('.close-modal');
  
    let scrollSpeed = 0.5; // pixels per frame for auto-scroll
    let currentTranslateX = 0;
    
// Create a card element from a job object
function createCard(job) {
    const card = document.createElement('div');
    card.className = 'card';
    
    // Card main image (click to open lightbox)
    const mainImg = document.createElement('img');
    mainImg.src = job.mainImage;
    mainImg.alt = job.title;
    validateImage(mainImg);
    mainImg.addEventListener('click', () => openLightbox(mainImg.src));
    card.appendChild(mainImg);
    
    // Create a row container for job details and button
    const detailsRow = document.createElement('div');
    detailsRow.className = 'details-row';
    
    // Left container for job details (50% width)
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'job-details';
    detailsContainer.innerHTML = `
      <h3>${job.title}</h3>
      <p><strong>Roof Type:</strong> ${job.roofType}</p>
      <p><strong>Completion:</strong> ${job.completionDate}</p>
      <p><strong>Difficulty:</strong> ${job.difficulty}</p>
      <p><strong>Time:</strong> ${job.timeToComplete}</p>
    `;
    
    // Right container for the fancy Read More button (50% width)
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    
    // Create the Read More button with an inner span
    const readMoreBtn = document.createElement('button');
    readMoreBtn.className = 'read-more shiny';
    const innerSpan = document.createElement('span');
    innerSpan.className = 'button-inner';
    innerSpan.textContent = 'Read More';
    readMoreBtn.appendChild(innerSpan);
    
    readMoreBtn.addEventListener('click', () => openModal(job));
    buttonContainer.appendChild(readMoreBtn);
    
    // Append job details (left) then button container (right)
    detailsRow.appendChild(detailsContainer);
    detailsRow.appendChild(buttonContainer);
    card.appendChild(detailsRow);
    
    // Additional images container with horizontal scrolling and gap
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
    
    // Pause auto-scroll on hover over the card
    card.addEventListener('mouseenter', () => scrollSpeed = 0);
    card.addEventListener('mouseleave', () => scrollSpeed = 0.5);
    
    return card;
  }
  
      
    
    // Validate image; if it fails to load, use the fallback image
    function validateImage(img) {
      img.addEventListener('error', function() {
        img.src = fallbackImage;
      });
    }
    
    // Render cards into the carousel (and duplicate them for a continuous loop)
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
    
    // Open modal and populate it with job details
    function openModal(job) {
      modalBody.innerHTML = '';
      
      // Modal main image (clickable for lightbox); now slightly taller
      const mainImg = document.createElement('img');
      mainImg.className = 'modal-main-img';
      mainImg.src = job.mainImage;
      mainImg.alt = job.title;
      validateImage(mainImg);
      mainImg.addEventListener('click', () => openLightbox(mainImg.src));
      modalBody.appendChild(mainImg);
      
      // Centered modal details container under the main image
      const detailsDiv = document.createElement('div');
      detailsDiv.className = 'modal-details';
      detailsDiv.innerHTML = `
        <p><strong>Roof Type:</strong> ${job.roofType}</p>
        <p><strong>Completion:</strong> ${job.completionDate}</p>
        <p><strong>Difficulty:</strong> ${job.difficulty}</p>
        <p><strong>Time:</strong> ${job.timeToComplete}</p>
        <p><strong>Suburb:</strong> ${job.suburb}</p>
      `;
      modalBody.appendChild(detailsDiv);
      
      // Container for two columns (each will show header + 2 additional images)
      const columnsContainer = document.createElement('div');
      columnsContainer.className = 'modal-columns';
      
      // Left column: header and first two additional images
      const leftColumn = document.createElement('div');
      leftColumn.className = 'modal-column';
      leftColumn.innerHTML = `<h1>Rooftop solar installation (Solar Panels)</h1>`;
      job.additionalImages.slice(0,2).forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = job.title;
        validateImage(img);
        img.addEventListener('click', () => openLightbox(img.src));
        leftColumn.appendChild(img);
      });
      
      // Right column: header and remaining two additional images
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
    
    // Lightbox functionality: display full-size image (approx 920px x 720px)
    function openLightbox(src) {
      const lightbox = document.getElementById('lightbox');
      const lightboxContent = document.querySelector('.lightbox-content');
      lightboxContent.src = src;
      lightbox.style.display = 'flex';
    }
    
    const closeLightbox = document.querySelector('.close-lightbox');
    closeLightbox.addEventListener('click', () => {
      document.getElementById('lightbox').style.display = 'none';
    });
    
    lightbox.addEventListener('click', (e) => {
        // If the click was outside the lightbox content, close the lightbox.
        if (!lightboxContent.contains(e.target)) {
          lightbox.style.display = 'none';
        }
      });
      
      lightbox.addEventListener('touchstart', (e) => {
        if (!lightboxContent.contains(e.target)) {
          lightbox.style.display = 'none';
        }
      });
    
    // Auto-scroll using requestAnimationFrame for smooth continuous movement
    function autoScroll() {
      currentTranslateX -= scrollSpeed;
      if (Math.abs(currentTranslateX) >= carousel.scrollWidth / 2) {
        currentTranslateX = 0;
      }
      carousel.style.transform = `translateX(${currentTranslateX}px)`;
      requestAnimationFrame(autoScroll);
    }
    
    // Manual control buttons
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
  