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
  const canvas = document.getElementById('hidden-canvas');
  const ctx = canvas.getContext('2d');

  // Animation timing settings
  const landingDuration = 3000;
  const bubbleDelay = 1000;
  const captionDelay = 1500;
  const displayDuration = 5000;
  const fadeDuration = 500;

  // Spin settings
  const initialRotationDegrees = 720;
  const startingScaleFactor = 1.2;
  const finalScaleFactor = 1;

  // Cache red dot position in natural coordinates
  let redDotPosition = null;

  // Function to detect red dot (#ff0000) in natural image coordinates
  function getRedDotPosition() {
    canvas.width = bannerImg.naturalWidth;
    canvas.height = bannerImg.naturalHeight;
    ctx.drawImage(bannerImg, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let redDotX = 0;
    let redDotY = 0;
    let pixelCount = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (r === 255 && g === 0 && b === 0) {
        const x = (i / 4) % canvas.width;
        const y = Math.floor(i / 4 / canvas.width);
        redDotX += x;
        redDotY += y;
        pixelCount++;
      }
    }

    if (pixelCount > 0) {
      redDotX = redDotX / pixelCount;
      redDotY = redDotY / pixelCount;
      console.log(`Red dot (natural): ${redDotX}px, ${redDotY}px`);
      return { x: redDotX, y: redDotY };
    } else {
      console.warn('No red dot found. Using fallback.');
      return { x: bannerImg.naturalWidth * 0.47, y: bannerImg.naturalHeight * 0.30 };
    }
  }

  // Function to position an image over the red dot
  function positionImage(image) {
    if (!redDotPosition) {
      redDotPosition = getRedDotPosition();
    }

    // Get current banner dimensions
    const bannerRect = banner.getBoundingClientRect();
    const bannerWidth = bannerRect.width;
    const bannerHeight = bannerRect.height;

    // Calculate visible area due to object-fit: cover
    const imgNaturalAspect = bannerImg.naturalWidth / bannerImg.naturalHeight;
    const bannerAspect = bannerWidth / bannerHeight;
    let visibleWidth, visibleHeight, offsetX, offsetY;

    if (imgNaturalAspect > bannerAspect) {
      // Image is wider than banner, cropped horizontally
      visibleHeight = bannerImg.naturalHeight;
      visibleWidth = visibleHeight * bannerAspect;
      offsetX = (bannerImg.naturalWidth - visibleWidth) / 2;
      offsetY = 0;
    } else {
      // Image is taller than banner, cropped vertically
      visibleWidth = bannerImg.naturalWidth;
      visibleHeight = visibleWidth / bannerAspect;
      offsetX = 0;
      offsetY = (bannerImg.naturalHeight - visibleHeight) / 2;
    }

    // Scale red dot position to visible area
    const redDotXVisible = redDotPosition.x - offsetX;
    const redDotYVisible = redDotPosition.y - offsetY;
    const scaleX = bannerWidth / visibleWidth;
    const scaleY = bannerHeight / visibleHeight;
    const redDotXScaled = redDotXVisible * scaleX;
    const redDotYScaled = redDotYVisible * scaleY;

    // Center the image over the red dot
    const imageWidth = 260;
    const imageHeight = 260;
    const left = redDotXScaled - (imageWidth / 2);
    const top = redDotYScaled - (imageHeight / 2);

    image.style.left = `${left}px`;
    image.style.top = `${top}px`;
    image.style.transform = `scale(${startingScaleFactor}) rotateY(${initialRotationDegrees}deg)`;

    console.log(`Positioned at: left=${left}px, top=${top}px`);
  }

  function animateNextImage() {
    if (currentIndex >= imagesData.length) {
      return;
    }

    const data = imagesData[currentIndex];
    const landingImage = document.createElement('img');
    landingImage.src = data.src;
    landingImage.alt = 'Fixed Image';
    landingImage.classList.add('fixed-image');
    banner.appendChild(landingImage);

    landingText.textContent = data.caption;
    landingText.style.opacity = '0';

    landingImage.style.opacity = '1';
    landingImage.classList.remove('landing-bubble', 'fade-out');
    landingText.classList.remove('animate-text', 'fade-out');

    // Position the image
    positionImage(landingImage);

    // Trigger reflow
    void landingImage.offsetWidth;

    // Transition to final state
    landingImage.style.transition = `transform ${landingDuration}ms cubic-bezier(0.1, 0.8, 0.2, 1)`;
    landingImage.style.transform = `scale(${finalScaleFactor}) rotateY(0deg)`;

    setTimeout(() => {
      landingImage.classList.add('landing-bubble');
      setTimeout(() => {
        landingText.classList.add('animate-text');
      }, captionDelay);

      setTimeout(() => {
        landingImage.style.transition = `opacity ${fadeDuration}ms ease`;
        landingText.style.transition = `opacity ${fadeDuration}ms ease`;
        landingImage.style.opacity = '0';
        landingText.style.opacity = '0';

        setTimeout(() => {
          banner.removeChild(landingImage);
          landingText.classList.remove('animate-text');
          currentIndex++;
          animateNextImage();
        }, fadeDuration);
      }, displayDuration);
    }, landingDuration + bubbleDelay);
  }

  // Start animation once banner image is loaded
  if (bannerImg.complete) {
    console.log('Banner image already loaded.');
    redDotPosition = getRedDotPosition();
    animateNextImage();
  } else {
    bannerImg.addEventListener('load', () => {
      console.log('Banner image loaded.');
      redDotPosition = getRedDotPosition();
      animateNextImage();
    });
  }

  // Real-time repositioning on resize
  window.addEventListener('resize', () => {
    const currentImage = document.querySelector('.fixed-image');
    if (currentImage) {
      positionImage(currentImage);
      if (currentImage.classList.contains('landing-bubble')) {
        currentImage.style.transform = `scale(1) rotateY(0deg)`;
      } else {
        currentImage.style.transform = `scale(${finalScaleFactor}) rotateY(0deg)`;
      }
    }
  });
});