document.addEventListener("DOMContentLoaded", function() {
    // Get the current URL and encode it for use in URLs
    const currentUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent("Check out this article!");

    // Twitter: Uses intent/tweet with URL and text
    const twitterUrl = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareText}`;
    const twitterBtn = document.getElementById("full-share-twitter");
    if (twitterBtn) twitterBtn.href = twitterUrl;

    // Facebook: Uses sharer.php with URL
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
    const facebookBtn = document.getElementById("full-share-facebook");
    if (facebookBtn) facebookBtn.href = facebookUrl;

    // LinkedIn: Uses share-offsite with URL
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
    const linkedInBtn = document.getElementById("full-share-linkedin");
    if (linkedInBtn) linkedInBtn.href = linkedInUrl;

    // WhatsApp: Uses api.whatsapp.com for mobile devices
    const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}%20${currentUrl}`;
    const whatsappBtn = document.getElementById("full-share-whatsapp");
    if (whatsappBtn) whatsappBtn.href = whatsappUrl;
});

// Define base URL for shareable links
const BASE_URL = "https://melonek.github.io"; // Update to "https://meloneksolar.com" if using a custom domain

// Dynamically determine the repository base path (e.g., "/Solar-Website" or "" for local/custom domain)
function getRepoBasePath() {
    const path = window.location.pathname;
    const pathParts = path.split('/').filter(part => part.length > 0);
    return (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost" || pathParts.length === 0) 
        ? "" 
        : `/${pathParts[0]}`; // e.g., "/Solar-Website"
}

// Helper function to determine the base path for articles relative to the root
function getBasePathForArticles() {
    const path = window.location.pathname;
    console.log("Current path:", path); // Debug log
    if (path.includes('articles/')) {
        return ''; // Inside articles/ folder (learn.html)
    }
    return 'articles/'; // Relative to root (index.html)
}

// Function to generate a navigation URL for an article using fullArticlePath
function getArticleNavigationUrl(article) {
    if (!article || !article.fullArticlePath) {
        console.error("fullArticlePath is undefined for article:", article);
        return "#";
    }
    const basePath = getBasePathForArticles();
    const repoBasePath = getRepoBasePath();
    const resolvedUrl = `${repoBasePath}/${basePath}${article.fullArticlePath}`;
    console.log("Navigating to full article URL:", resolvedUrl);
    return resolvedUrl;
}

// Function to generate a shareable URL for an article
function getShareableUrl(article) {
    if (!article || !article.fullArticlePath) {
        console.error("fullArticlePath is undefined for article:", article);
        return "#";
    }
    const repoBasePath = getRepoBasePath();
    const resolvedPath = `${repoBasePath}/articles/${article.fullArticlePath}`;
    console.log("Generated shareable URL:", `${BASE_URL}${resolvedPath}`);
    return `${BASE_URL}${resolvedPath}`;
}

// Main Page Articles (Pagination)
const articlesPerPage = 6;
let currentArticlePage = 1;

// Learn Page Articles (Pagination)
const learnArticlesPerPage = 3;
let currentLearnPage = 1;

// Function to display Full Article cards on the main page
function displayArticles(page) {
    const articlesGrid = document.getElementById('articles-grid');
    if (!articlesGrid) {
        console.error("articles-grid element not found");
        return;
    }
    console.log("allArticles:", allArticles);
    const mainArticles = allArticles.filter(article => article.displayOnMain)
        .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
    console.log("Filtered mainArticles:", mainArticles);
    const startIndex = (page - 1) * articlesPerPage,
          endIndex = startIndex + articlesPerPage,
          articlesToShow = mainArticles.slice(startIndex, endIndex);
    console.log("Articles to show:", articlesToShow);
    articlesGrid.innerHTML = '';
    articlesToShow.forEach(article => {
        const articlePath = getArticleNavigationUrl(article);
        console.log("Card Full Article Path:", articlePath);
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
    updateArticlesPagination(mainArticles.length);
    setupArticleClickEvents();
}

// Function to display Learn cards on the learn page
function displayLearnArticles(page) {
    const learnGrid = document.getElementById('learn-grid');
    if (!learnGrid) {
        console.error("learn-grid element not found");
        return;
    }
    console.log("allArticles:", allArticles);
    const learnArticles = allArticles.filter(article => article.displayOnLearn)
        .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
    console.log("Filtered learnArticles:", learnArticles);
    const startIndex = (page - 1) * learnArticlesPerPage,
          endIndex = startIndex + learnArticlesPerPage,
          articlesToShow = learnArticles.slice(startIndex, endIndex);
    console.log("Articles to show:", articlesToShow);
    learnGrid.innerHTML = '';
    articlesToShow.forEach(article => {
        const articlePath = getArticleNavigationUrl(article);
        console.log("Card Learn More Path:", articlePath);
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
    updateLearnPagination(learnArticles.length);
    setupArticleClickEvents();
}

// Function to update pagination for main articles
function updateArticlesPagination(totalArticles) {
    const totalPages = Math.ceil(totalArticles / articlesPerPage),
          pageNumbers = document.getElementById('page-numbers');
    if (!pageNumbers) {
        console.error("page-numbers element not found");
        return;
    }
    let html = `<button class="page-nav" id="prev-page" ${currentArticlePage === 1 ? 'disabled' : ''}><</button>`;
    let startPage = Math.max(1, currentArticlePage - 2),
        endPage = Math.min(totalPages, currentArticlePage + 2);
    if (currentArticlePage <= 3) { endPage = Math.min(5, totalPages); }
    if (currentArticlePage >= totalPages - 2) { startPage = Math.max(totalPages - 4, 1); }
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page-number ${i === currentArticlePage ? 'active-page' : ''}" data-page="${i}">${i}</button>`;
    }
    html += `<button class="page-nav" id="next-page" ${currentArticlePage === totalPages ? 'disabled' : ''}>></button>`;
    pageNumbers.innerHTML = html;
    document.querySelectorAll('.page-number').forEach(button => {
        button.removeEventListener('click', handleArticlePageClick);
        button.addEventListener('click', handleArticlePageClick);
    });
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    prevButton.removeEventListener('click', navigateArticlesPrev);
    nextButton.removeEventListener('click', navigateArticlesNext);
    prevButton.addEventListener('click', navigateArticlesPrev);
    nextButton.addEventListener('click', navigateArticlesNext);

    function handleArticlePageClick() {
        handleArticlePageChange(parseInt(this.getAttribute('data-page')));
    }

    function navigateArticlesPrev() {
        navigateArticlesPages('prev', totalPages);
    }

    function navigateArticlesNext() {
        navigateArticlesPages('next', totalPages);
    }
}

function handleArticlePageChange(newPage) {
    if (newPage === currentArticlePage) return;
    currentArticlePage = newPage;
    displayArticles(currentArticlePage);
    scrollToSection('articles');
}

function navigateArticlesPages(direction, totalPages) {
    const newPage = direction === 'prev' ? currentArticlePage - 1 : currentArticlePage + 1;
    if (newPage >= 1 && newPage <= totalPages) {
        handleArticlePageChange(newPage);
    }
}

// Function to update pagination for learn articles
function updateLearnPagination(totalArticles) {
    const totalPages = Math.ceil(totalArticles / learnArticlesPerPage),
          pageNumbers = document.getElementById('learn-page-numbers');
    if (!pageNumbers) {
        console.error("learn-page-numbers element not found");
        return;
    }
    let html = `<button class="page-nav" id="learn-prev-page" ${currentLearnPage === 1 ? 'disabled' : ''}><</button>`;
    let startPage = Math.max(1, currentLearnPage - 1),
        endPage = Math.min(totalPages, currentLearnPage + 1);
    if (currentLearnPage <= 2) { endPage = Math.min(3, totalPages); }
    if (currentLearnPage >= totalPages - 1) { startPage = Math.max(totalPages - 2, 1); }
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page-number ${i === currentLearnPage ? 'active-page' : ''}" data-page="${i}">${i}</button>`;
    }
    html += `<button class="page-nav" id="learn-next-page" ${currentLearnPage === totalPages ? 'disabled' : ''}>></button>`;
    pageNumbers.innerHTML = html;
    document.querySelectorAll('#learn-page-numbers .page-number').forEach(button => {
        button.removeEventListener('click', handleLearnPageClick);
        button.addEventListener('click', handleLearnPageClick);
    });
    const prevButton = document.getElementById('learn-prev-page');
    const nextButton = document.getElementById('learn-next-page');
    prevButton.removeEventListener('click', navigateLearnPrev);
    nextButton.removeEventListener('click', navigateLearnNext);
    prevButton.addEventListener('click', navigateLearnPrev);
    nextButton.addEventListener('click', navigateLearnNext);

    function handleLearnPageClick() {
        handleLearnPageChange(parseInt(this.getAttribute('data-page')));
    }

    function navigateLearnPrev() {
        navigateLearnPages('prev', totalPages);
    }

    function navigateLearnNext() {
        navigateLearnPages('next', totalPages);
    }
}

function handleLearnPageChange(newPage) {
    if (newPage === currentLearnPage) return;
    currentLearnPage = newPage;
    displayLearnArticles(currentLearnPage);
    scrollToSection('learn');
}

function navigateLearnPages(direction, totalPages) {
    const newPage = direction === 'prev' ? currentLearnPage - 1 : currentLearnPage + 1;
    if (newPage >= 1 && newPage <= totalPages) {
        handleLearnPageChange(newPage);
    }
}

// Function to scroll to a section
function scrollToSection(sectionId) {
    const targetElement = sectionId === 'articles'
        ? document.getElementById('articles-grid')
        : document.getElementById('learn-grid');
    if (!targetElement) return;
    const offset = window.innerWidth <= 768 ? -20 : -100;
    window.scrollTo({ top: targetElement.offsetTop + offset, behavior: 'smooth' });
}

// Function to scroll to a specific article
function scrollToArticle(articleId) {
    const card = document.querySelector(`[data-article-id="${articleId}"]`);
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.style.border = '2px solid #007bff'; // Optional: Highlight the card
    }
}

// Function to display the modal
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
    console.log("Displaying modal for article:", article.title);
    const articleUrl = getArticleNavigationUrl(article);
    const shareUrl = getShareableUrl(article);
    console.log("Setting Full Article URL:", articleUrl);
    console.log("Setting Share URL:", shareUrl);
    modalContent.innerHTML = `
        <div class="modal-header">
            <h1 class="modal-title">${article.title}</h1>
            <p class="modal-snippet">${article.snippet}</p>
        </div>
        <div class="modal-summary">
            ${article.summary}
            <div class="action-buttons">
                <a href="${articleUrl}" class="full-article-btn" target="_blank">Full Article</a>
                <a href="#" class="share-button" data-url="${shareUrl}">🔗 Share this article</a>
            </div>
        </div>
    `;
    modal.style.display = "block";
    document.body.classList.add('modal-open');

    const closeModal = () => {
        modal.style.display = "none";
        document.body.classList.remove('modal-open');
    };

    document.querySelector('.close').onclick = closeModal;
    window.onclick = (event) => { if (event.target == modal) closeModal(); };

    document.querySelector('.share-button').addEventListener('click', shareArticle);
}

// Consolidated share function for both .share-button and #full-top-share-button
function shareArticle(event) {
    if (event) event.preventDefault();

    const button = event ? event.target.closest('.share-button, #full-top-share-button') : document.getElementById('full-top-share-button');
    if (!button) {
        console.error("Share button not found");
        return;
    }

    let url = button.getAttribute('data-url');
    let articleId = button.closest('[data-article-id]')?.getAttribute('data-article-id');
    const shareData = {
        title: 'Check this out!',
        text: 'Here is an interesting article for you.',
        url: url
    };

    if (!url && articleId) {
        const article = allArticles.find(a => a.id == articleId);
        if (article) {
            shareData.url = getShareableUrl(article);
        }
    }

    if (!shareData.url) {
        shareData.url = window.location.href;
    }

    console.log("Sharing URL:", shareData.url);

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Article shared successfully'))
            .catch(err => console.error('Error sharing:', err));
    } else {
        showSharePopup(shareData);
    }
}

// Custom share popup function
function showSharePopup(shareData) {
    const existingPopup = document.getElementById('share-popup');
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement('div');
    popup.id = 'share-popup';
    popup.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.5);
        z-index: 1000; text-align: center; max-width: 300px;
    `;

    const encodedUrl = encodeURIComponent(shareData.url);
    const encodedText = encodeURIComponent(shareData.text);
    const encodedTitle = encodeURIComponent(shareData.title);

    popup.innerHTML = `
        <h3>Share this article</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" style="background: #3b5998; color: white; padding: 8px; border-radius: 4px; text-decoration: none;">Facebook</a>
            <a href="https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}" target="_blank" style="background: #25D366; color: white; padding: 8px; border-radius: 4px; text-decoration: none;">WhatsApp</a>
            <a href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}" target="_blank" style="background: #1DA1F2; color: white; padding: 8px; border-radius: 4px; text-decoration: none;">Twitter</a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank" style="background: #0077B5; color: white; padding: 8px; border-radius: 4px; text-decoration: none;">LinkedIn</a>
        </div>
        <button id="copy-link-btn" style="margin-top: 10px; padding: 8px; background: #ddd; border: none; border-radius: 4px; cursor: pointer;">Copy Link</button>
        <button id="close-popup-btn" style="margin-top: 10px; padding: 8px; background: #f00; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
    `;

    document.body.appendChild(popup);

    document.getElementById('copy-link-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(shareData.url)
            .then(() => alert("Shareable link copied to clipboard!"))
            .catch(error => console.error("Error copying URL:", error));
    });

    document.getElementById('close-popup-btn').addEventListener('click', () => popup.remove());
}

// Function to handle summary button clicks
function handleSummaryClick(event) {
    if (event.target.classList.contains('summary-btn')) {
        event.preventDefault();
        const articleId = event.target.closest('.article-card, .learn-card').getAttribute('data-article-id');
        console.log("Summary button clicked, articleId:", articleId);
        const article = allArticles.find(a => a.id == articleId);
        if (article) {
            displayModal(article);
        } else {
            console.error("Article not found for ID:", articleId);
        }
    }
}

// Function to set up click events for articles and share buttons
function setupArticleClickEvents() {
    document.removeEventListener('click', handleSummaryClick);
    document.addEventListener('click', handleSummaryClick);

    const allShareButtons = document.querySelectorAll('.share-button, #full-top-share-button');
    allShareButtons.forEach(button => {
        button.removeEventListener('click', shareArticle);
        button.addEventListener('click', shareArticle);
    });
}

// Handle initial rendering
document.addEventListener("DOMContentLoaded", () => {
    console.log("allArticles:", allArticles);
    if (typeof allArticles === "undefined") {
        console.error("allArticles is not defined. Ensure articleArray.js is loaded.");
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
                const index = mainArticles.findIndex(a => a.id == articleId);
                const page = Math.floor(index / articlesPerPage) + 1;
                currentArticlePage = page;
                displayArticles(page);
                scrollToArticle(articleId);
            } else if (article.displayOnLearn) {
                const learnArticles = allArticles.filter(a => a.displayOnLearn)
                    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
                const index = learnArticles.findIndex(a => a.id == articleId);
                const page = Math.floor(index / learnArticlesPerPage) + 1;
                currentLearnPage = page;
                displayLearnArticles(page);
                scrollToArticle(articleId);
            }
        }
    } else {
        if (document.getElementById('articles-grid')) {
            console.log("Initial rendering: displaying articles on index.html");
            displayArticles(currentArticlePage);
        }
        if (document.getElementById('learn-grid')) {
            console.log("Initial rendering: displaying articles on learn.html");
            displayLearnArticles(currentLearnPage);
        }
    }
});

// Fallback rendering
setTimeout(() => {
    if (document.getElementById('articles-grid')) {
        console.log("Fallback rendering: displaying articles on index.html");
        displayArticles(currentArticlePage);
    }
    if (document.getElementById('learn-grid')) {
        console.log("Fallback rendering: displaying articles on learn.html");
        displayLearnArticles(currentLearnPage);
    }
}, 100);