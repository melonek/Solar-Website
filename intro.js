document.addEventListener("DOMContentLoaded", function() {
    /* 
      === Design Reference Parameters ===
      
      You now have two sets of reference parameters:
      
      1. For the overlay (landing container and image) – already defined.
      2. For the caption text.
      
      The following objects let you control the final positioning and sizing at two reference banner widths.
      
      • Mobile Reference (banner width = 209px)
        - Overlay: (from previous example) mobileDesign
        - Text: mobileTextDesign
      • Desktop Reference (banner width = 1440px)
        - Overlay: desktopDesign
        - Text: desktopTextDesign
        
      Adjust these values as needed.
    */
    
    // --- Overlay (Container & Image) Reference Values ---
    const mobileDesign = {
      bannerWidth: 209,      // Reference banner width for mobile
      // Overlay (landing container) positioning & size at mobile:
      overlayLeft: 235,      // Absolute left offset (in px) at mobile reference
      overlayTop: 285,       // Absolute top offset (in px) at mobile reference
      overlaySize: 300,      // Final overlay (and image) size (width/height) at mobile
      imageOffsetLeft: 10,   // Landing image offset inside container at mobile
      imageOffsetToep: -15
    };
    
    const desktopDesign = {
      bannerWidth: 1640,     // Reference banner width for desktop
      // Overlay positioning & size at desktop:
      overlayLeft: 955,      // Adjust these values to position your overlay on desktop
      overlayTop: 315,
      overlaySize: 340,
      imageOffsetLeft: 10,   // You can change these if desired for desktop
      imageOffsetTop: -15
    };
  
    
    // --- Text (Caption) Reference Values ---
    // Adjust these numbers to position and size your text at the two reference banner widths.
    const mobileTextDesign = {
      bannerWidth: 209,      // Mobile banner width reference for text
      textLeft: -260,         // Caption left offset at mobile reference
      textTop: -100,          // Caption top offset at mobile reference
      fontSize: 12           // Font size at mobile reference
    };
    
    const desktopTextDesign = {
      bannerWidth: 1440,     // Desktop banner width reference for text
      textLeft: 650,         // Caption left offset at desktop reference
      textTop: -100,           // Caption top offset at desktop reference
      fontSize: 40           // Font size at desktop reference
    };
    
    // Array of landing images with captions.
    const imagesData = [
      { src: 'images/AboutUs/7yearsinBusiness.webp', caption: '7 Years in Business' },
      { src: 'images/AboutUs/ABN.webp', caption: 'Australian Business Number Registered' },
      { src: 'images/AboutUs/CEC.webp', caption: 'Clean Energy Council Accredited' },
      { src: 'images/AboutUs/SAA.webp', caption: 'Solar Accreditation Australia Certified' },
      { src: 'images/AboutUs/Tesla.webp', caption: 'Tesla Certified Installer' },
      { src: 'images/AboutUs/EC24072.webp', caption: 'Electrical Contractor 14071 Compliant' }
    ];
    
    let currentIndex = 0;
    const landingContainer = document.getElementById("landing-container");
    const landingText = document.getElementById("landing-text");
    const banner = document.querySelector('.banner');
    
    // Create the landing image element and append it.
    let landingImage = document.createElement("img");
    landingImage.id = "landing-image";
    landingContainer.appendChild(landingImage);
    
    // Linear interpolation helper.
    function lerp(a, b, t) {
      return a + (b - a) * t;
    }
    
    // Update overlay (container and image) and text styling based on current banner width.
    function updateLandingContainer() {
      const bannerRect = banner.getBoundingClientRect();
      const currentWidth = bannerRect.width;
      
      // Compute interpolation factor t (0 = mobileDesign, 1 = desktopDesign).
      let t = (currentWidth - mobileDesign.bannerWidth) / (desktopDesign.bannerWidth - mobileDesign.bannerWidth);
      t = Math.max(0, Math.min(1, t));
      
      // --- Update Overlay Position & Size ---
      const overlayLeft = lerp(mobileDesign.overlayLeft, desktopDesign.overlayLeft, t);
      const overlayTop  = lerp(mobileDesign.overlayTop, desktopDesign.overlayTop, t);
      const overlaySize = lerp(mobileDesign.overlaySize, desktopDesign.overlaySize, t);
      
      landingContainer.style.left = overlayLeft + "px";
      landingContainer.style.top  = overlayTop + "px";
      landingContainer.style.width = overlaySize + "px";
      landingContainer.style.height = overlaySize + "px";
      
      // Update landing image offsets.
      const imageOffsetLeft = lerp(mobileDesign.imageOffsetLeft, desktopDesign.imageOffsetLeft, t);
      const imageOffsetTop  = lerp(mobileDesign.imageOffsetTop, desktopDesign.imageOffsetTop, t);
      
      landingImage.style.width = overlaySize + "px";
      landingImage.style.height = overlaySize + "px";
      landingImage.style.left = imageOffsetLeft + "px";
      landingImage.style.top  = imageOffsetTop + "px";
      
      // --- Update Text (Caption) Position & Font Size ---
      const textLeft = lerp(mobileTextDesign.textLeft, desktopTextDesign.textLeft, t);
      const textTop  = lerp(mobileTextDesign.textTop, desktopTextDesign.textTop, t);
      const textFontSize = lerp(mobileTextDesign.fontSize, desktopTextDesign.fontSize, t);
      
      landingText.style.left = textLeft + "px";
      landingText.style.top = textTop + "px";
      landingText.style.fontSize = textFontSize + "px";
    }
    
    // Listen for banner size changes.
    const resizeObserver = new ResizeObserver(updateLandingContainer);
    resizeObserver.observe(banner);
    updateLandingContainer(); // Initial update
    
    // Animation timing settings.
    const landingDuration = 3000; // Scale & spin transition.
    const bubbleDelay     = 1000; // Delay before bubble animation.
    const captionDelay    = 1000; // Delay before caption bubble.
    const displayDuration = 5000; // How long image remains visible.
    const fadeDuration    = 500;  // Fade-out duration.
    
    // Spin settings.
    const initialRotationDegrees = 4000; // e.g. a 720° spin.
    const startingScaleFactor = 1.2;
    const finalScaleFactor = 1;
    
    function animateLanding() {
      const data = imagesData[currentIndex];
      landingImage.src = data.src;
      landingText.textContent = data.caption;
      
      // Reset state.
      landingImage.style.opacity = "1";
      landingText.style.opacity = "0";
      landingImage.classList.remove("landing-bubble", "fade-out");
      landingText.classList.remove("animate-text", "fade-out");
      
      // Set initial transform.
      landingImage.classList.add("landing-initial");
      landingImage.style.transform = `scale(${startingScaleFactor}) rotateY(${initialRotationDegrees}deg)`;
      
      // Force reflow.
      void landingImage.offsetWidth;
      
      // Transition to final state.
      landingImage.style.transition = `transform ${landingDuration}ms cubic-bezier(0.1, 0.8, 0.2, 1)`;
      landingImage.style.transform = `scale(${finalScaleFactor}) rotateY(0deg)`;
      
      // Bubble and fade animations.
      setTimeout(() => {
        landingImage.classList.add("landing-bubble");
        setTimeout(() => {
          landingText.classList.add("animate-text");
        }, captionDelay);
        
        setTimeout(() => {
          landingImage.style.transition = `opacity ${fadeDuration}ms ease`;
          landingText.style.transition = `opacity ${fadeDuration}ms ease`;
          landingImage.style.opacity = "0";
          landingText.style.opacity = "0";
          
          setTimeout(() => {
            landingImage.classList.remove("landing-bubble");
            landingText.classList.remove("animate-text");
            currentIndex = (currentIndex + 1) % imagesData.length;
            animateLanding();
          }, fadeDuration);
        }, displayDuration);
        
      }, landingDuration + bubbleDelay);
    }
    
    animateLanding();
  });
  