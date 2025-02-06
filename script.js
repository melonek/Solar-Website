document.addEventListener('DOMContentLoaded', function() {

  // Array of articles - this could be replaced with fetching data from JSON or an API
  const allArticles = [
    { 
      id: 1, 
      title: "Solar Innovation", 
      image: "https://images.pexels.com/photos/2486346/pexels-photo-2486346.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300", 
      snippet: "Latest in solar tech...", 
      fullText: "<br>Publisher Information Księgarnia Akademicka Publishing is an independent scholarly publisher established in 1992 and headquartered in Kraków, Poland. It offers a wide range of academic monographs, conference proceedings and journals, mainly in humanities and social sciences, including digital projects and open access publications. With almost 3,000 published titles, about 15 scholarly journals, over 30 book series and an annual production of more than 100 new publications, including translations, Księgarnia Akademicka Publishing also ranks among the top tier of Polish academic publishers in terms of quality. <br/> <br> Księgarnia Akademicka Publishing’s mission is to disseminate the outstanding works of the Central Eastern European academia across the world, using print and digital media. The publisher’s focus is placed both on Central and Eastern Europe studies (including history, Slavic literature and linguistics, regional studies) and many fields of international, multidisciplinary issues. <br/> <br> A major part of its output is published in Polish and English, but also in Russian, Spanish and German. The publisher cooperates with main Polish universities such as Jagiellonian University and University of Wroclaw, as well as other international and regional cultural and research institutions. Diverse territories of Latin America are immersed in important situations today.<br/> <br> The region is not only facing shortages, inequities, and inequalities a large part of the population has to live with, but also constant information, disinformation and fake news that permeate their minds and erode their freedom of decision and action in democratic processes. The scenario they are going through calls for a deep shake from its foundations, given the discourse of knowledge beyond a robust wave of information, coming from unusual sources, some of them disrupting the effort to ascertain the truth of the facts and being apparently at the service of economic and/or political hegemonies. This text proposes a comprehensive approach to fake news and the scope of influence they have on individual freedom with repercussions on the weak Latin American democracy.",
      publishedDate: "February 5, 2025",
      comment: "A breakthrough worth our times"
    },
    { 
      id: 1, 
      title: "Solar Innovation", 
      image: "https://images.pexels.com/photos/2486346/pexels-photo-2486346.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300", 
      snippet: "Latest in solar tech...", 
      fullText: "<br>Publisher Information Księgarnia Akademicka Publishing is an independent scholarly publisher established in 1992 and headquartered in Kraków, Poland. It offers a wide range of academic monographs, conference proceedings and journals, mainly in humanities and social sciences, including digital projects and open access publications. With almost 3,000 published titles, about 15 scholarly journals, over 30 book series and an annual production of more than 100 new publications, including translations, Księgarnia Akademicka Publishing also ranks among the top tier of Polish academic publishers in terms of quality. <br/> <br> Księgarnia Akademicka Publishing’s mission is to disseminate the outstanding works of the Central Eastern European academia across the world, using print and digital media. The publisher’s focus is placed both on Central and Eastern Europe studies (including history, Slavic literature and linguistics, regional studies) and many fields of international, multidisciplinary issues. <br/> <br> A major part of its output is published in Polish and English, but also in Russian, Spanish and German. The publisher cooperates with main Polish universities such as Jagiellonian University and University of Wroclaw, as well as other international and regional cultural and research institutions. Diverse territories of Latin America are immersed in important situations today.<br/> <br> The region is not only facing shortages, inequities, and inequalities a large part of the population has to live with, but also constant information, disinformation and fake news that permeate their minds and erode their freedom of decision and action in democratic processes. The scenario they are going through calls for a deep shake from its foundations, given the discourse of knowledge beyond a robust wave of information, coming from unusual sources, some of them disrupting the effort to ascertain the truth of the facts and being apparently at the service of economic and/or political hegemonies. This text proposes a comprehensive approach to fake news and the scope of influence they have on individual freedom with repercussions on the weak Latin American democracy.",
      publishedDate: "February 5, 2025",
      comment: "A breakthrough worth our times"
    },
    { 
      id: 1, 
      title: "Solar Innovation", 
      image: "https://images.pexels.com/photos/2486346/pexels-photo-2486346.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300", 
      snippet: "Latest in solar tech...", 
      fullText: "<br>Publisher Information Księgarnia Akademicka Publishing is an independent scholarly publisher established in 1992 and headquartered in Kraków, Poland. It offers a wide range of academic monographs, conference proceedings and journals, mainly in humanities and social sciences, including digital projects and open access publications. With almost 3,000 published titles, about 15 scholarly journals, over 30 book series and an annual production of more than 100 new publications, including translations, Księgarnia Akademicka Publishing also ranks among the top tier of Polish academic publishers in terms of quality. <br/> <br> Księgarnia Akademicka Publishing’s mission is to disseminate the outstanding works of the Central Eastern European academia across the world, using print and digital media. The publisher’s focus is placed both on Central and Eastern Europe studies (including history, Slavic literature and linguistics, regional studies) and many fields of international, multidisciplinary issues. <br/> <br> A major part of its output is published in Polish and English, but also in Russian, Spanish and German. The publisher cooperates with main Polish universities such as Jagiellonian University and University of Wroclaw, as well as other international and regional cultural and research institutions. Diverse territories of Latin America are immersed in important situations today.<br/> <br> The region is not only facing shortages, inequities, and inequalities a large part of the population has to live with, but also constant information, disinformation and fake news that permeate their minds and erode their freedom of decision and action in democratic processes. The scenario they are going through calls for a deep shake from its foundations, given the discourse of knowledge beyond a robust wave of information, coming from unusual sources, some of them disrupting the effort to ascertain the truth of the facts and being apparently at the service of economic and/or political hegemonies. This text proposes a comprehensive approach to fake news and the scope of influence they have on individual freedom with repercussions on the weak Latin American democracy.",
      publishedDate: "February 5, 2025",
      comment: "A breakthrough worth our times"
    },
    { 
      id: 1, 
      title: "Solar Innovation", 
      image: "https://images.pexels.com/photos/2486346/pexels-photo-2486346.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300", 
      snippet: "Latest in solar tech...", 
      fullText: "<br>Publisher Information Księgarnia Akademicka Publishing is an independent scholarly publisher established in 1992 and headquartered in Kraków, Poland. It offers a wide range of academic monographs, conference proceedings and journals, mainly in humanities and social sciences, including digital projects and open access publications. With almost 3,000 published titles, about 15 scholarly journals, over 30 book series and an annual production of more than 100 new publications, including translations, Księgarnia Akademicka Publishing also ranks among the top tier of Polish academic publishers in terms of quality. <br/> <br> Księgarnia Akademicka Publishing’s mission is to disseminate the outstanding works of the Central Eastern European academia across the world, using print and digital media. The publisher’s focus is placed both on Central and Eastern Europe studies (including history, Slavic literature and linguistics, regional studies) and many fields of international, multidisciplinary issues. <br/> <br> A major part of its output is published in Polish and English, but also in Russian, Spanish and German. The publisher cooperates with main Polish universities such as Jagiellonian University and University of Wroclaw, as well as other international and regional cultural and research institutions. Diverse territories of Latin America are immersed in important situations today.<br/> <br> The region is not only facing shortages, inequities, and inequalities a large part of the population has to live with, but also constant information, disinformation and fake news that permeate their minds and erode their freedom of decision and action in democratic processes. The scenario they are going through calls for a deep shake from its foundations, given the discourse of knowledge beyond a robust wave of information, coming from unusual sources, some of them disrupting the effort to ascertain the truth of the facts and being apparently at the service of economic and/or political hegemonies. This text proposes a comprehensive approach to fake news and the scope of influence they have on individual freedom with repercussions on the weak Latin American democracy.",
      publishedDate: "February 5, 2025",
      comment: "A breakthrough worth our times"
    },
    { 
      id: 1, 
      title: "Solar Innovation", 
      image: "https://images.pexels.com/photos/2486346/pexels-photo-2486346.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300", 
      snippet: "Latest in solar tech...", 
      fullText: "<br>Publisher Information Księgarnia Akademicka Publishing is an independent scholarly publisher established in 1992 and headquartered in Kraków, Poland. It offers a wide range of academic monographs, conference proceedings and journals, mainly in humanities and social sciences, including digital projects and open access publications. With almost 3,000 published titles, about 15 scholarly journals, over 30 book series and an annual production of more than 100 new publications, including translations, Księgarnia Akademicka Publishing also ranks among the top tier of Polish academic publishers in terms of quality. <br/> <br> Księgarnia Akademicka Publishing’s mission is to disseminate the outstanding works of the Central Eastern European academia across the world, using print and digital media. The publisher’s focus is placed both on Central and Eastern Europe studies (including history, Slavic literature and linguistics, regional studies) and many fields of international, multidisciplinary issues. <br/> <br> A major part of its output is published in Polish and English, but also in Russian, Spanish and German. The publisher cooperates with main Polish universities such as Jagiellonian University and University of Wroclaw, as well as other international and regional cultural and research institutions. Diverse territories of Latin America are immersed in important situations today.<br/> <br> The region is not only facing shortages, inequities, and inequalities a large part of the population has to live with, but also constant information, disinformation and fake news that permeate their minds and erode their freedom of decision and action in democratic processes. The scenario they are going through calls for a deep shake from its foundations, given the discourse of knowledge beyond a robust wave of information, coming from unusual sources, some of them disrupting the effort to ascertain the truth of the facts and being apparently at the service of economic and/or political hegemonies. This text proposes a comprehensive approach to fake news and the scope of influence they have on individual freedom with repercussions on the weak Latin American democracy.",
      publishedDate: "February 5, 2025",
      comment: "A breakthrough worth our times"
    },
    { 
      id: 1, 
      title: "Solar Innovation", 
      image: "https://images.pexels.com/photos/2486346/pexels-photo-2486346.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300", 
      snippet: "Latest in solar tech...", 
      fullText: "<br>Publisher Information Księgarnia Akademicka Publishing is an independent scholarly publisher established in 1992 and headquartered in Kraków, Poland. It offers a wide range of academic monographs, conference proceedings and journals, mainly in humanities and social sciences, including digital projects and open access publications. With almost 3,000 published titles, about 15 scholarly journals, over 30 book series and an annual production of more than 100 new publications, including translations, Księgarnia Akademicka Publishing also ranks among the top tier of Polish academic publishers in terms of quality. <br/> <br> Księgarnia Akademicka Publishing’s mission is to disseminate the outstanding works of the Central Eastern European academia across the world, using print and digital media. The publisher’s focus is placed both on Central and Eastern Europe studies (including history, Slavic literature and linguistics, regional studies) and many fields of international, multidisciplinary issues. <br/> <br> A major part of its output is published in Polish and English, but also in Russian, Spanish and German. The publisher cooperates with main Polish universities such as Jagiellonian University and University of Wroclaw, as well as other international and regional cultural and research institutions. Diverse territories of Latin America are immersed in important situations today.<br/> <br> The region is not only facing shortages, inequities, and inequalities a large part of the population has to live with, but also constant information, disinformation and fake news that permeate their minds and erode their freedom of decision and action in democratic processes. The scenario they are going through calls for a deep shake from its foundations, given the discourse of knowledge beyond a robust wave of information, coming from unusual sources, some of them disrupting the effort to ascertain the truth of the facts and being apparently at the service of economic and/or political hegemonies. This text proposes a comprehensive approach to fake news and the scope of influence they have on individual freedom with repercussions on the weak Latin American democracy.",
      publishedDate: "February 5, 2025",
      comment: "A breakthrough worth our times"
    }
    
    // ... other articles ...
  ];

  const articlesPerPage = 5;
  let currentPage = 1;

  // Function to display articles
  function displayArticles(page) {
    console.log(`Displaying articles for page ${page}`);
    const articlesGrid = document.getElementById('articles-grid');
    if (!articlesGrid) {
      console.error('Articles grid not found');
      return;
    }
    articlesGrid.innerHTML = '';

    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const articlesToShow = allArticles.slice(startIndex, endIndex);

    articlesToShow.forEach(article => {
      articlesGrid.innerHTML += `
        <div class="article-card" data-article-id="${article.id}">
          <img src="${article.image}" alt="${article.title}">
          <h3>${article.title}</h3>
          <p>${article.snippet}</p>
          <a href="#" class="read-more-btn">Read More</a>
        </div>
      `;
    });

    console.log('Articles added to the DOM');

    updatePagination();
    setupArticleClickEvents();
  }

  // Update pagination buttons and numbers
  function updatePagination() {
    const totalPages = Math.ceil(allArticles.length / articlesPerPage);
    const pageNumbers = document.getElementById('page-numbers');
    let html = '';

    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-number ${i === currentPage ? 'active-page' : ''}" data-page="${i}">${i}</button>`;
    }

    pageNumbers.innerHTML = html;

    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;

    document.querySelectorAll('.page-number').forEach(button => {
      button.addEventListener('click', function() {
        currentPage = parseInt(this.getAttribute('data-page'));
        displayArticles(currentPage);
      });
    });
  }

  // Handle navigation between pages
  function navigatePages(direction) {
    const totalPages = Math.ceil(allArticles.length / articlesPerPage);
    if (direction === 'prev' && currentPage > 1) {
      currentPage--;
    } else if (direction === 'next' && currentPage < totalPages) {
      currentPage++;
    }
    displayArticles(currentPage);
  }

  document.getElementById('prev-page').addEventListener('click', () => navigatePages('prev'));
  document.getElementById('next-page').addEventListener('click', () => navigatePages('next'));

  // Setup event listeners for article cards
  function setupArticleClickEvents() {
    document.querySelectorAll('.article-card').forEach(card => {
      card.addEventListener('click', function(e) {
        e.preventDefault();
        const articleId = this.getAttribute('data-article-id');
        const article = allArticles.find(a => a.id == articleId);
        if (article) {
          displayModal(article);
        }
      });
    });
  }


  // Display modal with full article content
function displayModal(article) {
  const modal = document.getElementById('article-modal');
  document.getElementById('modal-article-content').innerHTML = `
    <div class="modal-header">
      <h1 class="modal-title">${article.title}</h1>
      <p class="modal-snippet">${article.snippet}</p> <!-- Snippet under headline -->
    </div>
    <p class="modal-published">${article.publishedDate}</p>
    <img src="${article.image}" alt="${article.title}" class="modal-banner">
    <p class="modal-comment">${article.comment}</p> <!-- Comment under the image -->
    <div class="modal-fulltext">
      <p>${article.fullText}</p>
    </div>
  `;
  modal.style.display = "block";

  // Close modal
  document.querySelector('.close').onclick = function() {
    modal.style.display = "none";
  };

  // Close modal if user clicks outside of it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}
  

  // Initial display
  displayArticles(currentPage);

    // Toggle mobile menu
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Handle dropdown for all screen sizes
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    dropdown.addEventListener('click', (e) => {
        if (window.innerWidth > 768) {
            dropdownContent.classList.toggle('active');
        } else {
            // On mobile, prevent default behavior to avoid hiding immediately
            e.stopPropagation();
        }
    });

    // Ensure dropdown closes when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && window.innerWidth <= 768) {
            dropdownContent.classList.remove('active');
        }
    });

    // Ensure dropdown closes when clicking on a link inside it
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', () => {
            dropdownContent.classList.remove('active');
        });
    });
  });

  // Add to your existing JS
document.addEventListener('DOMContentLoaded', function() {
  // Brand images data (replace with your actual image URLs)
  const brandImages = [
    'https://i.postimg.cc/7L6BHd20/Canadian-Solar.webp',
    'https://i.postimg.cc/Jh2pGxNg/Dasolar.webp',
    'https://i.postimg.cc/4yCw13FQ/Fronius.png',
    'https://i.postimg.cc/ZnrHshGt/Growatt.png',
    'https://i.postimg.cc/43m5kcD1/Huawei.png',
    'https://i.postimg.cc/HsgBcVMp/JASolar.png',
    'https://i.postimg.cc/FFcTHj7W/Jinko.png',
    'https://i.postimg.cc/HkS2hzhx/logo-black-scaled.jpg',
    'https://i.postimg.cc/3JF9gYj2/Longi.png',
    'https://i.postimg.cc/JhvQ1nmC/Risen-Solar.png',
    'https://i.postimg.cc/76znbkYG/Seraphim.png',
    'https://i.postimg.cc/2yFdF7WC/SMA.png',
    'https://i.postimg.cc/wMdcmG7W/Sofar.png',
    'https://i.postimg.cc/FFjx4NBw/Solar-Edge.png',
    'https://i.postimg.cc/wTgQxnKM/Solis.png',
    'https://i.postimg.cc/CxKCkDxV/Sungrow.png',
    'https://i.postimg.cc/YqRfv8k3/Trina-Solar.png',
    'https://i.postimg.cc/dQpY2GFc/Screenshot-2025-02-07-at-12-04-38-am.png',
    'https://i.postimg.cc/gkhPNrcX/Screenshot-2025-02-07-at-12-05-06-am.png'
  ];

  const brandCards = document.querySelectorAll('.brand-card');
  let currentIndex = 0;

  // Initialize first set
  updateBrandCards();

  function updateBrandCards() {
    brandCards.forEach((card, i) => {
      const imgIndex = (currentIndex + i) % brandImages.length;
      card.querySelector('img').src = brandImages[imgIndex];
      card.classList.remove('active');
      setTimeout(() => card.classList.add('active'), 50);
    });
  }

  function cycleBrands() {
    brandCards.forEach(card => card.classList.remove('active'));
    
    setTimeout(() => {
      currentIndex = (currentIndex + 4) % brandImages.length;
      updateBrandCards();
    }, 500);
  }

  // Start cycling
  let brandInterval = setInterval(cycleBrands, 5000);

  // Pause cycling on hover
  document.querySelector('#brands').addEventListener('mouseenter', () => {
    clearInterval(brandInterval);
  });

  document.querySelector('#brands').addEventListener('mouseleave', () => {
    brandInterval = setInterval(cycleBrands, 5000);
  });

  // Initial fade-in
  setTimeout(() => {
    brandCards.forEach(card => card.classList.add('active'));
  }, 500);
  
});