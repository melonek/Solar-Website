document.addEventListener("DOMContentLoaded", function () {
  const imagesData = [
    { src: 'images/AboutUs/7yearsinBusiness.webp', caption: '7 Years in Business' },
    { src: 'images/AboutUs/ABN.webp', caption: 'Australian Business Number Registered' },
    { src: 'images/AboutUs/CEC.webp', caption: 'Clean Energy Council Accredited' },
    { src: 'images/AboutUs/SAA.webp', caption: 'Solar Accreditation Australia Certified' },
    { src: 'images/AboutUs/Tesla.webp', caption: 'Tesla Certified Installer' },
    { src: 'images/AboutUs/EC24072.webp', caption: 'Electrical Contractor 14071 Compliant' }
  ];
  
  let currentIndex = 0;
  const banner = document.querySelector('.banner');
  const bannerImg = document.getElementById('banner-image');
  const landingText = document.getElementById('landing-text');
  const anchorEl = document.querySelector('.anchor-point');
  
  // Animation timing settings
  const landingDuration = 3000;
  const bubbleDelay = 1000;
  const captionDelay = 1500;
  const displayDuration = 5000;
  const fadeDuration = 500;
  
  // Spin settings for fixed image animation
  const initialRotationDegrees = 4000;
  const startingScaleFactor = 1.2;
  const finalScaleFactor = 1;
  
  // Desired anchor position in the image's natural coordinate system (percentages)
  const desiredAnchorNaturalXPercent = 59;
  const desiredAnchorNaturalYPercent = 59;
  
  // Compute the container coordinates for the desired anchor point,
  // taking into account object-fit: cover cropping.
  function getAnchorCenter() {
    const bannerRect = banner.getBoundingClientRect();
    const containerWidth = bannerRect.width;
    const containerHeight = bannerRect.height;
    const naturalWidth = bannerImg.naturalWidth;
    const naturalHeight = bannerImg.naturalHeight;
    
    // Compute scale factor for cover mode
    const scale = Math.max(containerWidth / naturalWidth, containerHeight / naturalHeight);
    const visibleWidth = naturalWidth * scale;
    const visibleHeight = naturalHeight * scale;
    
    // Compute cropping offsets
    const offsetX = (visibleWidth - containerWidth) / 2;
    const offsetY = (visibleHeight - containerHeight) / 2;
    
    // Compute anchor position in the scaled image coordinate system
    const anchorXScaled = (desiredAnchorNaturalXPercent / 100) * visibleWidth;
    const anchorYScaled = (desiredAnchorNaturalYPercent / 100) * visibleHeight;
    
    // Convert to container coordinates
    const containerX = anchorXScaled - offsetX;
    const containerY = anchorYScaled - offsetY;
    
    // Convert to percentages relative to the container
    const xPercent = (containerX / containerWidth) * 100;
    const yPercent = (containerY / containerHeight) * 100;
    
    return { xPercent, yPercent };
  }
  
  // Update the anchor element's position
  function updateAnchorPosition() {
    const anchorPos = getAnchorCenter();
    anchorEl.style.left = `${anchorPos.xPercent}%`;
    anchorEl.style.top = `${anchorPos.yPercent}%`;
  }
  
  // Create a wrapper for the fixed image positioned at the computed anchor
  function createFixedImageWrapper() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('fixed-image-wrapper');
    const anchorPos = getAnchorCenter();
    wrapper.style.left = `${anchorPos.xPercent}%`;
    wrapper.style.top = `${anchorPos.yPercent}%`;
    // Center the wrapper at that point.
    wrapper.style.transform = "translate(-50%, -50%)";
    return wrapper;
  }
  
  // Animate the next fixed image along with its caption.
  function animateNextImage() {
    // If we've reached the end, loop back to the beginning.
    if (currentIndex >= imagesData.length) {
      currentIndex = 0;
    }
    
    const data = imagesData[currentIndex];
    
    // Create and position the fixed image wrapper.
    const wrapper = createFixedImageWrapper();
    banner.appendChild(wrapper);
    
    // Create the fixed image inside the wrapper.
    const landingImage = document.createElement('img');
    landingImage.src = data.src;
    landingImage.alt = 'Fixed Image';
    landingImage.classList.add('fixed-image');
    wrapper.appendChild(landingImage);
    
    // Set caption text and reset its opacity and class.
    landingText.textContent = data.caption;
    landingText.style.opacity = '0';
    landingText.classList.remove('animate-text');
    
    // Ensure the image is visible.
    landingImage.style.opacity = '1';
    
    // Set initial transform (only scale and rotation are animated).
    landingImage.style.transform = `scale(${startingScaleFactor}) rotateY(${initialRotationDegrees}deg)`;
    
    // Animate image transform using requestAnimationFrame.
    requestAnimationFrame(() => {
      landingImage.style.transition = `transform ${landingDuration}ms cubic-bezier(0.1,0.8,0.2,1)`;
      landingImage.style.transform = `scale(${finalScaleFactor}) rotateY(0deg)`;
    });
    
    // After landingDuration + bubbleDelay, add bubble glow and animate the text.
    setTimeout(() => {
      landingImage.classList.add('landing-bubble');
      setTimeout(() => {
        landingText.classList.add('animate-text');
        landingText.style.opacity = '1';
      }, captionDelay);
      
      // After displayDuration, fade out both image and text.
      setTimeout(() => {
        landingImage.style.transition = `opacity ${fadeDuration}ms ease`;
        landingText.style.transition = `opacity ${fadeDuration}ms ease`;
        landingImage.style.opacity = '0';
        landingText.style.opacity = '0';
        setTimeout(() => {
          // Clean up the wrapper and animate the next image.
          banner.removeChild(wrapper);
          landingText.classList.remove('animate-text');
          currentIndex++;
          animateNextImage();
        }, fadeDuration);
      }, displayDuration);
    }, landingDuration + bubbleDelay);
  }
  
  // Update positions on window resize: update both the anchor and any current fixed image wrappers.
  function updatePositionsOnResize() {
    updateAnchorPosition();
    document.querySelectorAll('.fixed-image-wrapper').forEach(wrapper => {
      const anchorPos = getAnchorCenter();
      wrapper.style.left = `${anchorPos.xPercent}%`;
      wrapper.style.top = `${anchorPos.yPercent}%`;
      wrapper.style.transform = "translate(-50%, -50%)";
    });
  }
  
  updateAnchorPosition();
  window.addEventListener('resize', updatePositionsOnResize);
  
  // Start the animation once the banner image is loaded.
  if (bannerImg.complete) {
    animateNextImage();
  } else {
    bannerImg.addEventListener('load', animateNextImage);
  }
});
