const BASE_URL = "/articles/";

if (typeof allArticles === "undefined") {
    console.error("allArticles is not defined. Ensure articleArray.js is loaded correctly.");
    window.allArticles = [];
}

const articlesPerPage = 6;
let currentArticlePage = 1;
const learnArticlesPerPage = 3;
let currentLearnPage = 1;

let currentShareData = null;
let currentHighlightedCard = null;

function getArticleNavigationUrl(article) {
    return `${BASE_URL}${article.fullArticlePath}`;
}

function getShareableUrl(article) {
    return `https://naturespark.com.au${getArticleNavigationUrl(article)}`;
}

// Single Intersection Observer for article/learn cards
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
const articleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        entry.target.classList.toggle('revealed', entry.isIntersecting);
    });
}, observerOptions);

function displayArticles(page) {
    const articlesGrid = document.getElementById('articles-grid');
    if (!articlesGrid) {
        console.error("articles-grid element not found");
        return;
    }
    const mainArticles = allArticles.filter(article => article.displayOnMain)
        .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
    const startIndex = (page - 1) * articlesPerPage;
    const articlesToShow = mainArticles.slice(startIndex, startIndex + articlesPerPage);
    articlesGrid.innerHTML = '';
    articlesToShow.forEach(article => {
        const articlePath = getArticleNavigationUrl(article);
        articlesGrid.innerHTML += `
            <div class="article-card" data-article-id="${article.id}">
                <img src="${article.image}" alt="${article.title}">
                <h3>${article.title}</h3>
                <p>${article.snippet}</p>
                <div class="action-buttons">
                    <a href="${articlePath}" class="article-read-more-btn" target="_blank">Full Article</a>
                    <button class="summary-btn">Summary</button>
                </div>
            </div>
        `;
    });
    articlesGrid.querySelectorAll('.article-card').forEach(card => {
        // Avoid re-observing if already observed (prevents duplication)
        if (!card.dataset.observed) {
            articleObserver.observe(card);
            card.dataset.observed = 'true';
        }
    });
    updateArticlesPagination(mainArticles.length);
    setupArticleClickEvents();
}

function displayLearnArticles(page) {
    const learnGrid = document.getElementById('learn-grid');
    if (!learnGrid) {
        console.error("learn-grid element not found");
        return;
    }
    const learnArticles = allArticles.filter(article => article.displayOnLearn)
        .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
    const startIndex = (page - 1) * learnArticlesPerPage;
    const articlesToShow = learnArticles.slice(startIndex, startIndex + learnArticlesPerPage);
    learnGrid.innerHTML = '';
    articlesToShow.forEach(article => {
        const articlePath = getArticleNavigationUrl(article);
        learnGrid.innerHTML += `
            <div class="learn-card" data-article-id="${article.id}">
                <img src="${article.image}" alt="${article.title}">
                <div class="overlay">
                    <h3>${article.title}</h3>
                    <p>${article.snippet}</p>
                    <div class="buttons-container">
                        <a href="${articlePath}" class="learn-read-more-btn" target="_blank">Learn More</a>
                        <button class="summary-btn">Summary</button>
                    </div>
                </div>
            </div>
        `;
    });
    learnGrid.querySelectorAll('.learn-card').forEach(card => {
        if (!card.dataset.observed) {
            articleObserver.observe(card);
            card.dataset.observed = 'true';
        }
    });
    updateLearnPagination(learnArticles.length);
    setupArticleClickEvents();
}

function updateArticlesPagination(totalArticles) {
    const totalPages = Math.ceil(totalArticles / articlesPerPage);
    const pagination = document.getElementById('articles-pagination');
    if (!pagination) return;
    pagination.innerHTML = '';
    if (totalPages <= 1) return;
    
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentArticlePage === 1;
    prevButton.addEventListener('click', () => {
        currentArticlePage--;
        displayArticles(currentArticlePage);
        scrollToSection('articles');
    });
    pagination.appendChild(prevButton);
    
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.toggle('active', i === currentArticlePage);
        pageButton.addEventListener('click', () => {
            currentArticlePage = i;
            displayArticles(currentArticlePage);
            scrollToSection('articles');
        });
        pagination.appendChild(pageButton);
    }
    
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentArticlePage === totalPages;
    nextButton.addEventListener('click', () => {
        currentArticlePage++;
        displayArticles(currentArticlePage);
        scrollToSection('articles');
    });
    pagination.appendChild(nextButton);
}

function updateLearnPagination(totalArticles) {
    const totalPages = Math.ceil(totalArticles / learnArticlesPerPage);
    const pagination = document.getElementById('learn-pagination');
    if (!pagination) return;
    pagination.innerHTML = '';
    if (totalPages <= 1) return;
    
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentLearnPage === 1;
    prevButton.addEventListener('click', () => {
        currentLearnPage--;
        displayLearnArticles(currentLearnPage);
        scrollToSection('learn');
    });
    pagination.appendChild(prevButton);
    
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.toggle('active', i === currentLearnPage);
        pageButton.addEventListener('click', () => {
            currentLearnPage = i;
            displayLearnArticles(currentLearnPage);
            scrollToSection('learn');
        });
        pagination.appendChild(pageButton);
    }
    
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentLearnPage === totalPages;
    nextButton.addEventListener('click', () => {
        currentLearnPage++;
        displayLearnArticles(currentLearnPage);
        scrollToSection('learn');
    });
    pagination.appendChild(nextButton);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

function scrollToArticle(articleId, highlight = false) {
    const articleElement = document.querySelector(`[data-article-id="${articleId}"]`);
    if (articleElement) {
        articleElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (highlight) {
            if (currentHighlightedCard && currentHighlightedCard !== articleElement) {
                currentHighlightedCard.classList.remove('highlighted');
            }
            articleElement.classList.add('highlighted');
            currentHighlightedCard = articleElement;
        }
    }
}

function displayModal(article) {
    const modal = document.getElementById('article-modal');
    if (!modal) {
        console.error("article-modal element not found");
        return;
    }
    const modalContent = document.getElementById('modal-article-content');
    if (!modalContent) {
        console.error("modal-article-content element not found");
        return;
    }
    const articleUrl = getArticleNavigationUrl(article);
    const shareUrl = getShareableUrl(article);

    modalContent.innerHTML = `
        <div class="modal-header">
            <h1 class="modal-title">${article.title}</h1>
            <p class="modal-snippet">${article.snippet}</p>
        </div>
        <div class="action-buttons">
            <a href="${articleUrl}" class="full-article-btn" target="_blank">Full Article</a>
            <button class="share-button" data-url="${shareUrl}" data-title="${article.title}" data-snippet="${article.snippet}">
                🔗 Share this article
            </button>
        </div>
        <div class="modal-summary">
            ${article.summary}
        </div>
    `;

    // Set the unified share data using only the article’s data
    currentShareData = {
        url: shareUrl,
        title: article.title,
        text: article.snippet,
        image: article.image  // Ensures the card uses only the article image
    };

    modalContent.style.display = 'flex';
    modalContent.style.flexDirection = 'column';
    modal.style.display = "flex";
    document.body.classList.add('modal-open');

    const closeModal = () => {
        modal.style.display = "none";
        document.body.classList.remove('modal-open');
        currentShareData = null;
    };

    document.querySelector('.close').onclick = closeModal;
    window.onclick = (event) => {
        if (event.target === modal) closeModal();
    };

    const modalShareBtn = modalContent.querySelector('.share-button');
    if (modalShareBtn) modalShareBtn.addEventListener('click', shareArticle);
}


function handleSummaryClick(event) {
    if (event.target.classList.contains('summary-btn')) {
        event.preventDefault();
        const clickedCard = event.target.closest('.article-card, .learn-card');
        if (clickedCard && currentHighlightedCard && currentHighlightedCard !== clickedCard) {
            currentHighlightedCard.classList.remove('highlighted');
            currentHighlightedCard = null;
        }
        const articleId = clickedCard?.getAttribute('data-article-id');
        if (articleId) {
            const article = allArticles.find(a => a.id == articleId);
            if (article) displayModal(article);
            else console.error("Article not found for ID:", articleId);
        }
    }
}

async function shareArticle(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Build shareData from currentShareData or from meta tags
    let shareData = currentShareData || {
        title: document.querySelector('meta[property="og:title"]')?.content || document.title || 'Check this out!',
        text: document.querySelector('meta[property="og:description"]')?.content || 'Here is an interesting article for you.',
        url: document.querySelector('meta[property="og:url"]')?.content || window.location.href,
        image: document.querySelector('meta[property="og:image"]')?.content || ''
    };

    // Append cache busting query parameter if needed
    shareData.url = `${shareData.url.split('?')[0]}?cacheBust=${Date.now()}`;

    // Prepare a sharePayload for the native share API including the URL and description only.
    const sharePayload = {
        title: shareData.title,  // This is used by the system to build the card
        text: shareData.text,    // Visible text: only the description
        url: shareData.url       // Critical for generating the rich preview from meta tags
    };

    // Determine which platform button triggered this event
    let buttonId = "";
    if (event && event.target && event.target.closest('a')) {
        buttonId = event.target.closest('a').id || "";
    }
    let platform = "";
    if (buttonId.toLowerCase().includes("twitter")) platform = "twitter";
    else if (buttonId.toLowerCase().includes("facebook")) platform = "facebook";
    else if (buttonId.toLowerCase().includes("linkedin")) platform = "linkedin";
    else if (buttonId.toLowerCase().includes("whatsapp")) platform = "whatsapp";

    let shareUrl = "";
    switch (platform) {
        case "twitter":
            // Pass only the description in the text parameter and the URL for preview scraping.
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.text)}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;
        case "facebook":
            // Facebook scrapes the URL; additional text isn’t needed.
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;
        case "linkedin":
            // Use the summary parameter for the description.
            shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(shareData.url)}&title=${encodeURIComponent(shareData.title)}&summary=${encodeURIComponent(shareData.text)}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;
        case "whatsapp":
            // Concatenate description and URL. The card will be built from the URL.
            shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;
        default:
            // For native share API, include our full payload.
            if (navigator.share) {
                try {
                    await navigator.share(sharePayload);
                    console.log('Article shared successfully');
                } catch (err) {
                    console.error('Share failed:', err);
                }
            } else if (navigator.clipboard) {
                try {
                    await navigator.clipboard.writeText(shareData.url);
                    console.log('URL copied to clipboard');
                } catch (err) {
                    console.error('Clipboard copy failed:', err);
                }
            }
            break;
    }
}


function showSharePopup(shareData) {
    const popup = document.createElement('div');
    popup.className = 'share-popup';
    popup.innerHTML = `
        <div class="share-popup-content">
            <h3>Share this article</h3>
            <input type="text" value="${shareData.url}" readonly>
            <button onclick="navigator.clipboard.writeText('${shareData.url}'); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy URL', 2000);">Copy URL</button>
            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title)}" target="_blank">Twitter</a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}" target="_blank">Facebook</a>
            <a href="https://www.linkedin.com/shareArticle?url=${encodeURIComponent(shareData.url)}&title=${encodeURIComponent(shareData.title)}" target="_blank">LinkedIn</a>
            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.title + ' ' + shareData.url)}" target="_blank">WhatsApp</a>
            <button class="close-popup">Close</button>
        </div>
    `;
    document.body.appendChild(popup);
    
    const style = document.createElement('style');
    style.textContent = `
        .share-popup { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .share-popup-content { background: white; padding: 20px; border-radius: 10px; text-align: center; max-width: 400px; width: 90%; }
        .share-popup-content input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px; }
        .share-popup-content button, .share-popup-content a { display: inline-block; margin: 5px; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; border: none; cursor: pointer; }
        .share-popup-content button:hover, .share-popup-content a:hover { background: #0056b3; }
        .close-popup { background: #dc3545; }
        .close-popup:hover { background: #b02a37; }
    `;
    document.head.appendChild(style);
    popup.querySelector('.close-popup').onclick = () => document.body.removeChild(popup);
}

function setupShareButtons() {
    const fullButtons = document.querySelectorAll('#full-share-buttons a');
    fullButtons.forEach(btn => {
        btn.removeEventListener('click', shareArticle);
        btn.addEventListener('click', shareArticle);
    });
    const learnButtons = document.querySelectorAll('#learn-share-buttons a');
    learnButtons.forEach(btn => {
        btn.removeEventListener('click', shareArticle);
        btn.addEventListener('click', shareArticle);
    });
}

function setupArticleClickEvents() {
    document.removeEventListener('click', handleSummaryClick);
    document.addEventListener('click', handleSummaryClick);
    setupShareButtons();
    
    document.querySelectorAll('.article-card, .learn-card').forEach(card => {
        card.removeEventListener('mouseenter', handleMouseEnter); // Prevent duplicate listeners
        card.addEventListener('mouseenter', handleMouseEnter);
    });
}

function handleMouseEnter(event) {
    const card = event.currentTarget;
    if (currentHighlightedCard && currentHighlightedCard !== card) {
        currentHighlightedCard.classList.remove('highlighted');
        currentHighlightedCard = null;
    }
}

window.addEventListener("load", () => {
    if (typeof allArticles === "undefined") {
        console.error("allArticles is not defined. Ensure articleArray.js is loaded.");
        return;
    }
    if (!Array.isArray(allArticles)) {
        console.error("allArticles is not an array:", allArticles);
        return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('articleId');
    if (articleId) {
        const article = allArticles.find(a => a.id == articleId);
        if (article) {
            if (article.displayOnMain) {
                const mainArticles = allArticles.filter(a => a.displayOnMain)
                    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
                currentArticlePage = Math.floor(mainArticles.findIndex(a => a.id == articleId) / articlesPerPage) + 1;
                displayArticles(currentArticlePage);
                scrollToArticle(articleId, true);
                setTimeout(() => displayModal(article), 500);
            } else if (article.displayOnLearn) {
                const learnArticles = allArticles.filter(a => a.displayOnLearn)
                    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
                currentLearnPage = Math.floor(learnArticles.findIndex(a => a.id == articleId) / learnArticlesPerPage) + 1;
                displayLearnArticles(currentLearnPage);
                scrollToSection('learn');
                setTimeout(() => {
                    scrollToArticle(articleId, true);
                    setTimeout(() => displayModal(article), 500);
                }, 500);
            }
        } else {
            console.error("Article not found for ID:", articleId);
        }
    } else {
        if (document.getElementById('articles-grid')) displayArticles(currentArticlePage);
        if (document.getElementById('learn-grid')) displayLearnArticles(currentLearnPage);
    }
    
    setupShareButtons();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }