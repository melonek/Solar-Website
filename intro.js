function runAnimationCycle() {
    // Animate items in both left and right containers.
    document.querySelectorAll('.container').forEach(container => {
      const items = container.querySelectorAll('.item');
      items.forEach((item, index) => {
        // Delay: first item 0ms, second 3000ms, third 6000ms, etc.
        const delay = index * 3000;
        setTimeout(() => {
          const img = item.querySelector('img');
          const text = item.querySelector('.text');
          if (img) img.classList.add('animate');
          if (text) text.classList.add('animate');
        }, delay);
      });
    });
  
    // Calculate total cycle time: last item's delay + animation duration ≈ 6000ms + 6000ms = 12s, plus extra 1s.
    setTimeout(() => {
      // Remove all animation classes and force reflow for a clean restart.
      document.querySelectorAll('.animate').forEach(el => {
        el.classList.remove('animate');
        void el.offsetWidth;
      });
      runAnimationCycle();
    }, 13000);
  }
  
  document.addEventListener("DOMContentLoaded", runAnimationCycle);
  