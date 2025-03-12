function runAnimationCycle() {
    // Animate items in left and right containers only.
    document.querySelectorAll('.container').forEach(container => {
      const items = container.querySelectorAll('.item');
      items.forEach((item, index) => {
        // Delay each item's animation: 0ms, 3000ms, 6000ms...
        const delay = index * 3000;
        setTimeout(() => {
          const img = item.querySelector('img');
          const text = item.querySelector('.text');
          if (img) img.classList.add('animate');
          if (text) text.classList.add('animate');
        }, delay);
      });
    });
  
    // Reset animations after a full cycle (approx. 13 seconds) and restart.
    setTimeout(() => {
      document.querySelectorAll('.animate').forEach(el => {
        el.classList.remove('animate');
        void el.offsetWidth; // Force reflow to restart animations
      });
      runAnimationCycle();
    }, 13000);
  }
  
  document.addEventListener("DOMContentLoaded", runAnimationCycle);
  