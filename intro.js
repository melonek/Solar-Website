document.addEventListener("DOMContentLoaded", function() {
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
  
  // Create the landing image element (only once) and append it to the landing container.
  let landingImage = document.createElement("img");
  landingImage.id = "landing-image";
  landingContainer.appendChild(landingImage);
  
  // Timing settings (milliseconds)
  const landingDuration = 3000; // Duration for scale & spin transition.
  const bubbleDelay = 1000;     // Delay after transition before image bubble.
  const captionDelay = 1000;    // Delay after image bubble before caption bubble.
  const displayDuration = 5000; // How long the image remains visible.
  const fadeDuration = 500;     // Fade-out duration.
  
  // Spin settings: use rotateY for vertical-axis spin.
  const initialRotationDegrees = 4000; // e.g., start with 720° spin.
  
  // Scale factors: define the starting and final scales relative to the landing container.
  const startingScaleFactor = 1.2;  // Image starts at 120% of container size.
  const finalScaleFactor = 1;       // Final state is 100% (the container's size).
  
  function animateLanding() {
    const data = imagesData[currentIndex];
    landingImage.src = data.src;
    landingText.textContent = data.caption;
    
    // Reset state: make sure both image and caption are fully opaque.
    landingImage.style.opacity = "1";
    landingText.style.opacity = "0";
    landingImage.classList.remove("landing-bubble", "fade-out");
    landingText.classList.remove("animate-text", "fade-out");
    
    // Set the landing image to its initial state (larger scale and spun).
    landingImage.classList.add("landing-initial");
    landingImage.style.transform = `scale(${startingScaleFactor}) rotateY(${initialRotationDegrees}deg)`;
    
    // Force reflow so the initial state is applied.
    void landingImage.offsetWidth;
    
    // Trigger the transition to final state: scale to finalScaleFactor and rotate to 0deg.
    landingImage.style.transition = `transform ${landingDuration}ms cubic-bezier(0.1, 0.8, 0.2, 1)`;
    landingImage.style.transform = `scale(${finalScaleFactor}) rotateY(0deg)`;
    
    // After the landing transition and a bubble delay, trigger the bubble animation on the image.
    setTimeout(() => {
      landingImage.classList.add("landing-bubble");
      
      // After an additional delay, trigger the caption bubble animation.
      setTimeout(() => {
        landingText.classList.add("animate-text");
      }, captionDelay);
      
      // After displayDuration, fade out both the image and the caption.
      setTimeout(() => {
        landingImage.style.transition = `opacity ${fadeDuration}ms ease`;
        landingText.style.transition = `opacity ${fadeDuration}ms ease`;
        landingImage.style.opacity = "0";
        landingText.style.opacity = "0";
        
        // After fade-out, prepare the next image.
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
