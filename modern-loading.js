// modern-loading.js

document.addEventListener('DOMContentLoaded', function () {
  const images = document.images;
  const totalImages = images.length;
  let loadedImages = 0;
  
  const progressBar = document.querySelector('.loading-bar');
  const percentageText = document.getElementById('loading-percentage');
  const loadingScreen = document.getElementById('loading-screen');
  
  function updateProgress(percent) {
    progressBar.style.width = percent + '%';
    percentageText.textContent = percent + '%';
  }
  
  function finishLoading() {
    // Delay slightly so the user sees 100%
    setTimeout(() => {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        // No need to unhide main content as it’s already rendered in the DOM.
      }, 500);
    }, 300);
  }
  
  function incrementCounter() {
    loadedImages++;
    const percent = Math.round((loadedImages / totalImages) * 100);
    updateProgress(percent);
    if (loadedImages === totalImages) {
      finishLoading();
    }
  }
  
  if (totalImages === 0) {
    updateProgress(100);
    finishLoading();
  } else {
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
