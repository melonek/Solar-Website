// Data stored in an array – each object holds the job description and images.
const installations = [
    {
      jobTitle: "Installation 1",
      roofType: "Asphalt Shingle",
      completionDate: "2023-08-15",
      difficulty: "Medium",
      timeToComplete: "3 days",
      mainImage: "https://via.placeholder.com/300x200?text=Main+Image+1",
      extraImages: [
        "https://via.placeholder.com/150x100?text=Inverter",
        "https://via.placeholder.com/150x100?text=Solar+Module+1",
        "https://via.placeholder.com/150x100?text=Solar+Module+2"
      ]
    },
    {
      jobTitle: "Installation 2",
      roofType: "Metal Roof",
      completionDate: "2023-09-10",
      difficulty: "High",
      timeToComplete: "5 days",
      mainImage: "https://via.placeholder.com/300x200?text=Main+Image+2",
      extraImages: [
        "https://via.placeholder.com/150x100?text=Inverter",
        "https://via.placeholder.com/150x100?text=Solar+Module+1",
        "https://via.placeholder.com/150x100?text=Solar+Module+2"
      ]
    },
    {
      jobTitle: "Installation 3",
      roofType: "Tile Roof",
      completionDate: "2023-07-22",
      difficulty: "Low",
      timeToComplete: "2 days",
      mainImage: "https://via.placeholder.com/300x200?text=Main+Image+3",
      extraImages: [
        "https://via.placeholder.com/150x100?text=Inverter",
        "https://via.placeholder.com/150x100?text=Solar+Module+1",
        "https://via.placeholder.com/150x100?text=Solar+Module+2"
      ]
    }
    // Add more installations as needed
  ];
  
  const gallery = document.getElementById('gallery');
  
  // Generate card elements from the installations array.
  installations.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
  
    // Main image at the top.
    const mainImg = document.createElement('img');
    mainImg.src = item.mainImage;
    mainImg.alt = item.jobTitle;
    // Click to enlarge main image.
    mainImg.addEventListener('click', () => {
      openImageModal(item.mainImage);
    });
    card.appendChild(mainImg);
  
    // Job details styled similar to article content.
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'job-details';
    detailsDiv.innerHTML = `
      <h3>${item.jobTitle}</h3>
      <p><strong>Roof Type:</strong> ${item.roofType}</p>
      <p><strong>Completion Date:</strong> ${item.completionDate}</p>
      <p><strong>Difficulty:</strong> ${item.difficulty}</p>
      <p><strong>Time to Complete:</strong> ${item.timeToComplete}</p>
    `;
    card.appendChild(detailsDiv);
  
    // Extra images container (e.g. inverter and solar modules).
    const extraContainer = document.createElement('div');
    extraContainer.className = 'extra-images';
    item.extraImages.forEach(imgSrc => {
      const extraImg = document.createElement('img');
      extraImg.src = imgSrc;
      extraImg.alt = 'Extra Image';
      extraImg.addEventListener('click', () => {
        openImageModal(imgSrc);
      });
      extraContainer.appendChild(extraImg);
    });
    card.appendChild(extraContainer);
  
    // "See More" button that opens a modal with additional details.
    const seeMoreBtn = document.createElement('a');
    seeMoreBtn.className = 'see-more-btn';
    seeMoreBtn.textContent = 'See More';
    seeMoreBtn.href = "#";
    seeMoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openDetailsModal(item);
    });
    card.appendChild(seeMoreBtn);
  
    gallery.appendChild(card);
  });
  
  // Auto-scroll the gallery slowly to the left.
  let autoScrollInterval;
  const scrollSpeed = 1; // pixels per interval
  const intervalTime = 20; // milliseconds
  
  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      // Scroll the parent container.
      gallery.parentElement.scrollLeft += scrollSpeed;
      // If reached the end, loop back to start.
      if (gallery.parentElement.scrollLeft >= gallery.scrollWidth - gallery.parentElement.clientWidth) {
        gallery.parentElement.scrollLeft = 0;
      }
    }, intervalTime);
  }
  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }
  startAutoScroll();
  
  // Pause auto-scroll when user hovers over the gallery.
  gallery.parentElement.addEventListener('mouseenter', stopAutoScroll);
  gallery.parentElement.addEventListener('mouseleave', startAutoScroll);
  
  // Control buttons to manually slide the gallery.
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  prevBtn.addEventListener('click', () => {
    gallery.parentElement.scrollLeft -= 300; // approximate card width
  });
  nextBtn.addEventListener('click', () => {
    gallery.parentElement.scrollLeft += 300;
  });
  
  // Modal for "See More" details.
  const detailsModal = document.getElementById('detailsModal');
  const modalClose = document.getElementById('modalClose');
  const modalBody = document.getElementById('modalBody');
  
  function openDetailsModal(item) {
    modalBody.innerHTML = `
      <h2>${item.jobTitle}</h2>
      <p><strong>Roof Type:</strong> ${item.roofType}</p>
      <p><strong>Completion Date:</strong> ${item.completionDate}</p>
      <p><strong>Difficulty:</strong> ${item.difficulty}</p>
      <p><strong>Time to Complete:</strong> ${item.timeToComplete}</p>
      <img src="${item.mainImage}" alt="${item.jobTitle}" style="width:100%; border-radius: 5px; margin-top:10px; cursor:pointer;" id="modalMainImg">
      <div class="modal-images">
        ${item.extraImages.map(src => `<img src="${src}" alt="Extra" style="cursor:pointer;">`).join('')}
      </div>
    `;
    detailsModal.classList.add('active');
    // Enlarge images when clicked inside modal.
    document.getElementById('modalMainImg').addEventListener('click', () => {
      openImageModal(item.mainImage);
    });
    document.querySelectorAll('.modal-images img').forEach(img => {
      img.addEventListener('click', () => {
        openImageModal(img.src);
      });
    });
  }
  modalClose.addEventListener('click', () => {
    detailsModal.classList.remove('active');
  });
  
  // Modal for enlarged images.
  const imageModal = document.getElementById('imageModal');
  const imageModalClose = document.getElementById('imageModalClose');
  const enlargedImage = document.getElementById('enlargedImage');
  function openImageModal(src) {
    enlargedImage.src = src;
    imageModal.classList.add('active');
  }
  imageModalClose.addEventListener('click', () => {
    imageModal.classList.remove('active');
  });
  // Close modals when clicking outside content.
  window.addEventListener('click', (e) => {
    if (e.target === detailsModal) {
      detailsModal.classList.remove('active');
    }
    if (e.target === imageModal) {
      imageModal.classList.remove('active');
    }
  });
  