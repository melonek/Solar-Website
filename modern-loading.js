document.addEventListener('DOMContentLoaded', function () {
  const images = document.images;
  const totalImages = images.length;
  let loadedImages = 0;
  
  // Elements for the circular loader
  const progressCircle = document.querySelector('.loader-progress');
  const percentageText = document.querySelector('.loader-percentage');
  const loadingScreen = document.getElementById('loading-screen');
  
  // Calculate circumference (2 * π * r) for r = 50 (as set in SVG)
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  
  // Update progress display
  function updateProgress(percent) {
    percentageText.textContent = percent + '%';
    const offset = circumference * (1 - percent / 100);
    progressCircle.style.strokeDashoffset = offset;
  }
  
  function finishLoading() {
    setTimeout(() => {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
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
