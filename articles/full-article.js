// Base URL for article navigation
const BASE_URL = window.location.hostname === "melonek.github.io" 
    ? "/Solar-Website/articles/" 
    : "/articles/";

// Check allArticles without redeclaring
if (typeof allArticles === "undefined") {
    console.error("allArticles is not defined. Ensure articleArray.js is loaded correctly.");
    window.allArticles = []; // Assign to global scope without redeclaring
}

// Pagination settings
const articlesPerPage = 6;
let currentArticlePage = 1;

const learnArticlesPerPage = 3;
let currentLearnPage = 1;

// Utility to get article navigation URL
function getArticleNavigationUrl(article) {
    return `${BASE_URL}${article.fullArticlePath}`;
}

// Utility to get shareable URL
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

// Display modal with summary and share button
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
        if (event.target === modal) closeModal();
    };
    
    // Attach share event on the share button inside the modal
    const modalShareBtn = modalContent.querySelector('.share-button');
    if (modalShareBtn) {
        modalShareBtn.addEventListener('click', shareArticle);
    }
}

// Handle summary button clicks (for cards)
function handleSummaryClick(event) {
    if (event.target.classList.contains('summary-btn')) {
        event.preventDefault();
        const articleId = event.target.closest('.article-card, .learn-card')?.getAttribute('data-article-id');
        if (articleId) {
            const article = allArticles.find(a => a.id == articleId);
            if (article) {
                displayModal(article);
            } else {
                console.error("Article not found for ID:", articleId);
            }
        }
    }
}

// Share article function with explicit prevention of default behavior
function shareArticle(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Determine which share button was clicked
    let button = event 
      ? event.target.closest('.share-button, #full-share-buttons a, #learn-share-buttons a, #full-top-share-button, #learn-top-share-button')
      : null;
    
    // Initialize shareData with fallback values
    let shareData = {
        title: document.querySelector('title')?.textContent || 'Check this out!',
        text: document.querySelector('meta[name="description"]')?.content || 'Here is an interesting page for you.',
        url: window.location.href
    };
    
    // If a share button was clicked, use its data-url or find article data
    if (button) {
        const buttonUrl = button.getAttribute('data-url');
        if (buttonUrl) {
            shareData.url = buttonUrl;
        } else {
            const articleId = button.closest('[data-article-id]')?.getAttribute('data-article-id');
            if (articleId) {
                const article = allArticles.find(a => a.id == articleId);
                if (article) {
                    shareData.url = getShareableUrl(article);
                    shareData.title = article.title;
                    shareData.text = article.snippet;
                }
            }
        }
    } else {
        // Fallback: check if articleId is in URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const articleIdFromUrl = urlParams.get('articleId');
        if (articleIdFromUrl) {
            const article = allArticles.find(a => a.id == articleIdFromUrl);
            if (article) {
                shareData.url = getShareableUrl(article);
                shareData.title = article.title;
                shareData.text = article.snippet;
            }
        }
    }
    
    // Update social media links in full-share-buttons container
    const fullShareContainer = document.getElementById('full-share-buttons');
    if (fullShareContainer) {
        const twitterBtn = document.getElementById('full-share-twitter');
        const facebookBtn = document.getElementById('full-share-facebook');
        const linkedinBtn = document.getElementById('full-share-linkedin');
        const whatsappBtn = document.getElementById('full-share-whatsapp');
        
        if (twitterBtn) {
            twitterBtn.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title)}`;
        }
        if (facebookBtn) {
            facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
        }
        if (linkedinBtn) {
            linkedinBtn.href = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(shareData.url)}&title=${encodeURIComponent(shareData.title)}`;
        }
        // Use the official WhatsApp API URL
        if (whatsappBtn) {
            whatsappBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.title + ' ' + shareData.url)}`;
        }
    }
    
    // Update social media links in learn-share-buttons container
    const learnShareContainer = document.getElementById('learn-share-buttons');
    if (learnShareContainer) {
        const twitterBtn = learnShareContainer.querySelector('#learn-share-twitter');
        const facebookBtn = learnShareContainer.querySelector('#learn-share-facebook');
        const linkedinBtn = learnShareContainer.querySelector('#learn-share-linkedin');
        const whatsappBtn = learnShareContainer.querySelector('#learn-share-whatsapp');
        
        if (twitterBtn) {
            twitterBtn.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title)}`;
        }
        if (facebookBtn) {
            facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
        }
        if (linkedinBtn) {
            linkedinBtn.href = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(shareData.url)}&title=${encodeURIComponent(shareData.title)}`;
        }
        // Update WhatsApp share link as well
        if (whatsappBtn) {
            whatsappBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.title + ' ' + shareData.url)}`;
        }
    }
    
    // Use Web Share API if available, else fall back to a custom share popup
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Article shared successfully'))
            .catch(err => console.error('Error sharing:', err));
    } else {
        showSharePopup(shareData);
    }
    
    return false;
}

// Show share popup for browsers without Web Share API
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
        .share-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .share-popup-content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        .share-popup-content input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        .share-popup-content button, .share-popup-content a {
            display: inline-block;
            margin: 5px;
            padding: 10px 20px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            border: none;
            cursor: pointer;
        }
        .share-popup-content button:hover, .share-popup-content a:hover {
            background: #0056b3;
        }
        .close-popup {
            background: #dc3545;
        }
        .close-popup:hover {
            background: #b02a37;
        }
    `;
    document.head.appendChild(style);
    popup.querySelector('.close-popup').onclick = () => document.body.removeChild(popup);
}

// Setup event listeners for summary and share buttons
function setupArticleClickEvents() {
    document.removeEventListener('click', handleSummaryClick);
    document.addEventListener('click', handleSummaryClick);
    
    // Attach listeners to share buttons on article cards or modals
    const allShareButtons = document.querySelectorAll('.share-button');
    allShareButtons.forEach(button => {
        button.removeEventListener('click', shareArticle);
        button.addEventListener('click', shareArticle);
    });
    
    // Also use event delegation on the share button containers
    const fullShareContainer = document.getElementById('full-share-buttons');
    if (fullShareContainer) {
        fullShareContainer.addEventListener('click', function(e) {
            const target = e.target;
            if (target && target.tagName === "A") {
                shareArticle(e);
            }
        });
    }
    const learnShareContainer = document.getElementById('learn-share-buttons');
    if (learnShareContainer) {
        learnShareContainer.addEventListener('click', function(e) {
            const target = e.target;
            if (target && target.tagName === "A") {
                shareArticle(e);
            }
        });
    }
}

// Initial load: render articles and setup share buttons
document.addEventListener("DOMContentLoaded", () => {
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
                scrollToArticle(articleId);
                setTimeout(() => displayModal(article), 500);
            } else if (article.displayOnLearn) {
                const learnArticles = allArticles.filter(a => a.displayOnLearn)
                    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
                currentLearnPage = Math.floor(learnArticles.findIndex(a => a.id == articleId) / learnArticlesPerPage) + 1;
                displayLearnArticles(currentLearnPage);
                scrollToSection('learn');
                setTimeout(() => {
                    scrollToArticle(articleId);
                    setTimeout(() => displayModal(article), 500);
                }, 500);
            }
        } else {
            console.error("Article not found for ID:", articleId);
        }
    } else {
        if (document.getElementById('articles-grid')) {
            displayArticles(currentArticlePage);
        }
        if (document.getElementById('learn-grid')) {
            displayLearnArticles(currentLearnPage);
        }
    }
    
    // If share buttons exist on the page, try to update them
    if (document.getElementById('full-share-buttons') || document.getElementById('learn-share-buttons')) {
        const urlParams = new URLSearchParams(window.location.search);
        const articleIdFromUrl = urlParams.get('articleId');
        if (articleIdFromUrl) {
            const article = allArticles.find(a => a.id == articleIdFromUrl);
            if (article) {
                shareArticle();
            }
        }
    }
});
