// modern-loading.js

document.addEventListener('DOMContentLoaded', function () {
    // Get all images on the page
    const images = document.images;
    const totalImages = images.length;
    let loadedImages = 0;
  
    // Get the elements for our loading UI
    const progressBar = document.querySelector('.loading-bar');
    const percentageText = document.getElementById('loading-percentage');
    const loadingScreen = document.getElementById('loading-screen');
  
    // Update the loading bar and percentage text
    function updateProgress(percent) {
      progressBar.style.width = percent + '%';
      percentageText.textContent = percent + '%';
    }
  
    // Called once all images are loaded
    function finishLoading() {
      // Delay slightly so the user sees the 100% state
      setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        // After fade-out transition, remove the overlay from display
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          // Optionally, call your page initialization functions here
          if (typeof initPage === 'function') {
            initPage();
          }
        }, 500);
      }, 300);
    }
  
    // Increment the counter for each loaded image
    function incrementCounter() {
      loadedImages++;
      const percent = Math.round((loadedImages / totalImages) * 100);
      updateProgress(percent);
      if (loadedImages === totalImages) {
        finishLoading();
      }
    }
  
    // If there are no images, complete immediately
    if (totalImages === 0) {
      updateProgress(100);
      finishLoading();
    } else {
      // Add event listeners to track each image's load status
      for (let i = 0; i < totalImages; i++) {
        const img = images[i];
        if (img.complete) {
          incrementCounter();
        } else {
          img.addEventListener('load', incrementCounter, false);
          img.addEventListener('error', incrementCounter, false);
        }
      }
    }
  });
  initPage()