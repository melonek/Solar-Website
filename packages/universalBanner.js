document.addEventListener("DOMContentLoaded", function() {
  // Helper: Preload images
  function preloadImagesUnified(items) {
    return Promise.all(
      items.map(item => {
        const url = typeof item === "string" ? item : item.url;
        return new Promise(resolve => {
          const img = new Image();
          img.src = url;
          img.onload = () => {
            console.log(`Preloaded image: ${url}`);
            resolve(url);
          };
          img.onerror = () => {
            console.error(`Failed to preload image: ${url}`);
            resolve(url); // resolve anyway to avoid blocking
          };
        });
      })
    );
  }

  // Banner image URL
  const crucialBannerImage = 'https://naturespark.com.au/images/universalBanner/Solar-drone-photo-Perth.webp';

  // Select all containers that should have the universal banner
  const universalBanners = document.querySelectorAll('.universalBanner, #faq-banner, #battery-logo-cards-text-section');

  preloadImagesUnified([crucialBannerImage])
    .then(() => {
      universalBanners.forEach(banner => {
        // Look for an element with class "banner-image" inside this container.
        let bannerImageElem = banner.querySelector('.banner-image');
        if (!bannerImageElem) {
          // If not present, create it and prepend to the container.
          bannerImageElem = document.createElement('div');
          bannerImageElem.classList.add('banner-image');
          banner.insertAdjacentElement('afterbegin', bannerImageElem);
        }
        // Apply the background image.
        bannerImageElem.style.backgroundImage = `url(${crucialBannerImage})`;
        // Let your CSS handle background-size and position.

        // Apply GSAP animations (if GSAP and ScrollTrigger are loaded)
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          // Set initial transform: center the banner image
          gsap.set(bannerImageElem, { xPercent: -50, yPercent: -50, scale: 1 });
          // Animate the banner image on scroll
          gsap.to(bannerImageElem, {
            scrollTrigger: {
              trigger: banner,
              start: "top top",
              end: "bottom top",
              scrub: true,
              // markers: true, // Uncomment for debugging
            },
            y: () => banner.clientHeight * 0.35,
            scale: 1.2,
            ease: "none",
            force3D: true
          });
        } else {
          console.warn("GSAP or ScrollTrigger is not loaded.");
        }
      });
    })
    .catch(() => {
      console.error('Banner image preloading failed, proceeding without setting background.');
    });
});
