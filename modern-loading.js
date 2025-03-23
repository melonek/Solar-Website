document.addEventListener('DOMContentLoaded', function () {
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent = document.getElementById('main-content');
  const progressCircle = document.querySelector('.loader-progress');
  const percentageText = document.querySelector('.loader-percentage');

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;

  if (localStorage.getItem('loadingScreenShown')) {
    loadingScreen.style.display = 'none';
    if (mainContent) {
      mainContent.style.display = 'block';
    }
    window.initPage();
  } else {
    const totalFakeDuration = 5000;
    let startTime = performance.now();

    function updateProgress() {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min((elapsed / totalFakeDuration) * 100, 100);
      percentageText.textContent = Math.round(progress) + '%';
      const newOffset = circumference - (circumference * progress / 100);
      progressCircle.style.strokeDashoffset = newOffset;
      if (elapsed < totalFakeDuration) {
        requestAnimationFrame(updateProgress);
      }
    }

    progressCircle.style.strokeDashoffset = circumference;
    requestAnimationFrame(updateProgress);

    setTimeout(() => {
      percentageText.textContent = '100%';
      progressCircle.style.strokeDashoffset = 0;
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        if (mainContent) {
          mainContent.style.display = 'block';
        }
        window.initPage();
        localStorage.setItem('loadingScreenShown', 'true');
      }, 500);
    }, totalFakeDuration);
  }
});