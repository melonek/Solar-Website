document.addEventListener('DOMContentLoaded', function () {
  const loadingScreen = document.getElementById('loading-screen');
  const progressCircle = document.querySelector('.loader-progress');
  const percentageText = document.querySelector('.loader-percentage');
  
  // Our circle has r = 50; its circumference is:
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  
  // Set the dash pattern so the progress stays inside the circle.
  // "5 5" gives a series of small dashes.
  progressCircle.style.strokeDasharray = "5 5";
  
  // Total fake duration: 5 seconds (5000 ms) divided into four segments:
  const totalFakeDuration = 5000; // milliseconds
  const segments = [
    { start: 0, end: 33, duration: 1250 },
    { start: 33, end: 54, duration: 1250 },
    { start: 54, end: 78, duration: 1250 },
    { start: 78, end: 100, duration: 1250 }
  ];
  
  let startTime = performance.now();
  
  function updateProgress() {
    const now = performance.now();
    const elapsed = now - startTime;
    let progress;
    
    if (elapsed >= totalFakeDuration) {
      progress = 100;
    } else if (elapsed < segments[0].duration) {
      progress = (elapsed / segments[0].duration) * (segments[0].end - segments[0].start) + segments[0].start;
    } else if (elapsed < segments[0].duration + segments[1].duration) {
      const segElapsed = elapsed - segments[0].duration;
      progress = segments[1].start + (segElapsed / segments[1].duration) * (segments[1].end - segments[1].start);
    } else if (elapsed < segments[0].duration + segments[1].duration + segments[2].duration) {
      const segElapsed = elapsed - segments[0].duration - segments[1].duration;
      progress = segments[2].start + (segElapsed / segments[2].duration) * (segments[2].end - segments[2].start);
    } else {
      const segElapsed = elapsed - segments[0].duration - segments[1].duration - segments[2].duration;
      progress = segments[3].start + (segElapsed / segments[3].duration) * (segments[3].end - segments[3].start);
    }
    
    // Update the percentage display (rounded)
    percentageText.textContent = Math.round(progress) + '%';
    
    // Animate the stroke-dashoffset from full (circumference) to 0:
    const newOffset = circumference * (1 - progress / 100);
    progressCircle.style.strokeDashoffset = newOffset;
    
    if (progress < 100) {
      requestAnimationFrame(updateProgress);
    } else {
      // Fade out the loading screen when complete
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
  }
  
  // Set initial offset so no progress is visible (i.e. full offset)
  progressCircle.style.strokeDashoffset = circumference;
  
  // Start the fake progress animation
  requestAnimationFrame(updateProgress);
});
