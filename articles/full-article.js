// Base URL for article navigation
const BASE_URL = window.location.hostname === "melonek.github.io" 
    ? "/Solar-Website/articles/" 
    : "/articles/";

// Ensure allArticles is defined
if (typeof allArticles === "undefined") {
    console.error("allArticles is not defined. Ensure articleArray.js is loaded correctly.");
    window.allArticles = [];
}

// Pagination settings
const articlesPerPage = 6;
let currentArticlePage = 1;
const learnArticlesPerPage = 3;
let currentLearnPage = 1;

// Utility: Get article navigation URL
function getArticleNavigationUrl(article) {
    return `${BASE_URL}${article.fullArticlePath}`;
}

// Utility: Get shareable URL
function getShareableUrl(article) {
    return `https://melonek.github.io${getArticleNavigationUrl(article)}`;
}

// Display articles for main section
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
    updateArticlesPagination(mainArticles.length);
    setupArticleClickEvents();
}

// Display articles for learn section
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
    updateLearnPagination(learnArticles.length);
    setupArticleClickEvents();
}

// Update pagination for main articles
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

// Update pagination for learn articles
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

// Scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Scroll to specific article
function scrollToArticle(articleId) {
    const articleElement = document.querySelector(`[data-article-id="${articleId}"]`);
    if (articleElement) {
        articleElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Display modal with summary
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
            <a href="#" class="share-button" data-url="${shareUrl}">🔗 Share this article</a>
        </div>
        <div class="modal-summary">
            ${article.summary}
        </div>
    `;
    modalContent.style.display = 'flex';
    modalContent.style.flexDirection = 'column';
    modal.style.display = "flex";
    document.body.classList.add('modal-open');

    const closeModal = () => {
        modal.style.display = "none";
        document.body.classList.remove('modal-open');
    };

    document.querySelector('.close').onclick = closeModal;
    window.onclick = (event) => {
        if (event.target == modal) closeModal();
    };

    document.querySelector('.share-button').addEventListener('click', shareArticle);
}

// Share article function
function shareArticle(event) {
    if (event) event.preventDefault();
    let button = event ? event.target.closest('.share-button, #full-top-share-button, #learn-top-share-button, #full-share-buttons a')
                       : (document.getElementById('learn-top-share-button') || document.getElementById('full-top-share-button'));
    if (!button) {
        console.error("Share button not found");
        const shareData = {
            title: document.querySelector('title').textContent || 'Check this out!',
            text: document.querySelector('meta[name="description"]')?.content || 'Here is an interesting page for you.',
            url: window.location.href
        };
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('Page shared successfully'))
                .catch(err => console.error('Error sharing:', err));
        } else {
            showSharePopup(shareData);
        }
        return;
    }
    let url = button.getAttribute('data-url');
    let articleId = button.closest('[data-article-id]')?.getAttribute('data-article-id');
    const shareData = {
        title: 'Check this out!',
        text: 'Here is an interesting article for you.',
        url: url || (articleId ? getShareableUrl(allArticles.find(a => a.id == articleId)) : window.location.href)
    };
    console.log("Sharing URL:", shareData.url);
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Article shared successfully'))
            .catch(err => console.error('Error sharing:', err));
    } else {
        showSharePopup(shareData);
    }
}

// Show share popup for non-Web Share API browsers
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
            <a href="https://wa.me/?text=${encodeURIComponent(shareData.title + ' ' + shareData.url)}" target="_blank">WhatsApp</a>
            <button class="close-popup">Close</button>
        </div>
    `;
    document.body.appendChild(popup);
    popup.querySelector('.close-popup').onclick = () => document.body.removeChild(popup);
}

// Setup click events for summary and share buttons
function setupArticleClickEvents() {
    document.removeEventListener('click', handleSummaryClick);
    document.addEventListener('click', handleSummaryClick);
    const allShareButtons = document.querySelectorAll('.share-button, #full-share-buttons a, #full-top-share-button, #learn-top-share-button');
    allShareButtons.forEach(button => {
        button.removeEventListener('click', shareArticle);
        button.addEventListener('click', shareArticle);
    });
}

// Handle summary button clicks
function handleSummaryClick(event) {
    if (event.target.classList.contains('summary-btn')) {
        event.preventDefault();
        const articleId = event.target.closest('.article-card, .learn-card').getAttribute('data-article-id');
        const article = allArticles.find(a => a.id == articleId);
        if (article) {
            displayModal(article);
        } else {
            console.error("Article not found for ID:", articleId);
        }
    }
}

// Initial load with error handling
document.addEventListener("DOMContentLoaded", () => {
    if (typeof allArticles === "undefined") {
        console.error("allArticles is not defined. Ensure articleArray.js is loaded.");
        return;
    }
    if (!Array.isArray(allArticles)) {
        console.error("allArticles is not an array:", allArticles);
        return;
    }
    // Update meta tags dynamically
    const articleId = "4";
    const article = allArticles.find(a => a.id == articleId);
    if (article) {
        document.querySelector('title').textContent = article.title;
        document.querySelector('meta[name="description"]').content = article.snippet;
        document.querySelector('meta[property="og:title"]').content = article.title;
        document.querySelector('meta[property="og:description"]').content = article.snippet;
        document.querySelector('meta[property="og:image"]').content = article.image;
        document.querySelector('meta[property="og:url"]').content = getShareableUrl(article);
        document.querySelector('meta[name="twitter:title"]').content = article.title;
        document.querySelector('meta[name="twitter:description"]').content = article.snippet;
        document.querySelector('meta[name="twitter:image"]').content = article.image;
        document.querySelector('meta[name="twitter:url"]').content = getShareableUrl(article);
    }
    // Attach event listener to sticky share buttons in #full-share-buttons
    const stickyShareButtons = document.querySelectorAll("#full-share-buttons a");
    stickyShareButtons.forEach(button => {
        button.addEventListener("click", shareArticle);
    });
    
    // Check URL parameters for articleId for modal display, etc.
    const urlParams = new URLSearchParams(window.location.search);
    const paramArticleId = urlParams.get('articleId');
    if (paramArticleId) {
        const article = allArticles.find(a => a.id == paramArticleId);
        if (article) {
            if (article.displayOnMain) {
                const mainArticles = allArticles.filter(a => a.displayOnMain)
                    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
                const index = mainArticles.findIndex(a => a.id == paramArticleId);
                currentArticlePage = Math.floor(index / articlesPerPage) + 1;
                displayArticles(currentArticlePage);
                scrollToArticle(paramArticleId);
                setTimeout(() => displayModal(article), 500);
            } else if (article.displayOnLearn) {
                const learnArticles = allArticles.filter(a => a.displayOnLearn)
                    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
                const index = learnArticles.findIndex(a => a.id == paramArticleId);
                currentLearnPage = Math.floor(index / learnArticlesPerPage) + 1;
                displayLearnArticles(currentLearnPage);
                scrollToSection('learn');
                setTimeout(() => {
                    scrollToArticle(paramArticleId);
                    setTimeout(() => displayModal(article), 500);
                }, 500);
            }
        } else {
            console.error("Article not found for ID:", paramArticleId);
        }
    } else {
        if (document.getElementById('articles-grid')) {
            displayArticles(currentArticlePage);
        }
        if (document.getElementById('learn-grid')) {
            displayLearnArticles(currentLearnPage);
        }
    }
});
