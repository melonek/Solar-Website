document.addEventListener('DOMContentLoaded', function () {
  // Select only crucial images (those with the "crucial" class)
  const crucialImages = Array.from(document.querySelectorAll('img.crucial'));
  const totalImages = crucialImages.length;
  let loadedImages = 0;
  let currentDisplay = 0;

  // Elements for the circular loader
  const progressCircle = document.querySelector('.loader-progress');
  const percentageText = document.querySelector('.loader-percentage');
  const loadingScreen = document.getElementById('loading-screen');

  // For a circle with radius 50 (as defined in the SVG), the circumference is:
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  // Smoothly animate the displayed progress (number and dash offset)
  function animateProgressTo(target) {
    const start = currentDisplay;
    const diff = target - start;
    const duration = 300; // Duration of the animation in milliseconds
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const factor = Math.min(progress / duration, 1);
      const newValue = start + diff * factor;
      currentDisplay = newValue;
      percentageText.textContent = Math.round(newValue) + '%';
      // Update the stroke dash offset to reveal progress:
      const newOffset = circumference * (1 - newValue / 100);
      progressCircle.style.strokeDashoffset = newOffset;
      if (factor < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  function finishLoading() {
    // Ensure we animate to 100% before finishing
    animateProgressTo(100);
    setTimeout(() => {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        // Here you could also initialize your main page functionality if needed.
      }, 500);
    }, 300);
  }

  function incrementCounter() {
    loadedImages++;
    const targetPercent = Math.round((loadedImages / totalImages) * 100);
    animateProgressTo(targetPercent);
    if (loadedImages === totalImages) {
      finishLoading();
    }
  }

  // Fallback: force finish after 5 seconds even if not all crucial images have loaded
  setTimeout(() => {
    if (currentDisplay < 100) {
      finishLoading();
    }
  }, 5000);

  if (totalImages === 0) {
    animateProgressTo(100);
    finishLoading();
  } else {
    crucialImages.forEach(img => {
      if (img.complete) {
        incrementCounter();
      } else {
        img.addEventListener('load', incrementCounter, false);
        img.addEventListener('error', incrementCounter, false);
      }
    });
  }
});
