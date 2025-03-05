function shareArticle() {
    const shareData = {
      title: 'Check this out!',
      text: 'Here is an interesting article for you.',
      url: window.location.href
    };
  
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Article shared successfully'))
        .catch((err) => console.error('Error sharing the article:', err));
    } else {
      // Fallback: copy URL to clipboard
      copyToClipboard(shareData.url);
      alert('Your URL has been copied to clipboard');
    }
  }
  
  function copyToClipboard(text) {
    const tempInput = document.createElement('input');
    tempInput.style.position = 'absolute';
    tempInput.style.left = '-9999px';
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    // Get the current URL and encode it for use in URLs
    const currentUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent("Check out this article!");
  
    // Twitter: Uses intent/tweet with URL and text
    const twitterUrl = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareText}`;
    document.getElementById("full-share-twitter").href = twitterUrl;
  
    // Facebook: Uses sharer.php with URL
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
    document.getElementById("full-share-facebook").href = facebookUrl;
  
    // LinkedIn: Uses share-offsite with URL
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
    document.getElementById("full-share-linkedin").href = linkedInUrl;
  
    // WhatsApp: Uses api.whatsapp.com for mobile devices
    const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}%20${currentUrl}`;
    document.getElementById("full-share-whatsapp").href = whatsappUrl;
  });
  