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
    console.log("allArticles in displayArticles:", allArticles);
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

// Display articles for learn section
function displayLearnArticles(page) {
    const learnGrid = document.getElementById('learn-grid');
    if (!learnGrid) {
        console.error("learn-grid element not found");
        return;
    }
    console.log("allArticles in displayLearnArticles:", allArticles);
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
        if (currentArticlePage > 1) {
            currentArticlePage--;
            displayArticles(currentArticlePage);
            scrollToSection('articles');
        }
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
        if (currentArticlePage < totalPages) {
            currentArticlePage++;
            displayArticles(currentArticlePage);
            scrollToSection('articles');
        }
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
        if (currentLearnPage > 1) {
            currentLearnPage--;
            displayLearnArticles(currentLearnPage);
            scrollToSection('learn');
        }
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
        if (currentLearnPage < totalPages) {
            currentLearnPage++;
            displayLearnArticles(currentLearnPage);
            scrollToSection('learn');
        }
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

// Handle summary button clicks
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

// Share article function
function shareArticle(event) {
    if (event) event.preventDefault();

    let button = event 
      ? event.target.closest('.share-button, #full-top-share-button, #learn-top-share-button, #full-share-buttons a')
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
        url: url
    };

    if (!url && articleId) {
        const article = allArticles.find(a => a.id == articleId);
        if (article) {
            shareData.url = getShareableUrl(article);
            shareData.title = article.title;
            shareData.text = article.snippet;
        }
    }

    if (!shareData.url) {
        shareData.url = window.location.href;
        shareData.title = document.querySelector('title').textContent || 'Check this out!';
        shareData.text = document.querySelector('meta[name="description"]')?.content || 'Here is an interesting page for you.';
    }

    console.log("Sharing URL:", shareData.url);

    // Update social media share buttons dynamically for full article page
    if (document.getElementById('full-share-buttons')) {
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
        if (whatsappBtn) {
            whatsappBtn.href = `https://wa.me/?text=${encodeURIComponent(shareData.title + ' ' + shareData.url)}`;
        }
    }

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

// Setup click events for summary and share buttons
function setupArticleClickEvents() {
    document.removeEventListener('click', handleSummaryClick);
    document.addEventListener('click', handleSummaryClick);

    // Attach share events to all share buttons anywhere in the document
    const allShareButtons = document.querySelectorAll('.share-button, #full-share-buttons a, #full-top-share-button, #learn-top-share-button');
    allShareButtons.forEach(button => {
        button.removeEventListener('click', shareArticle);
        button.addEventListener('click', shareArticle);
    });
}

// Initial load with error handling and share button setup
document.addEventListener("DOMContentLoaded", () => {
    console.log("allArticles on load:", allArticles);
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
                const index = mainArticles.findIndex(a => a.id == articleId);
                const page = Math.floor(index / articlesPerPage) + 1;
                currentArticlePage = page;
                displayArticles(page);
                scrollToArticle(articleId);
                setTimeout(() => displayModal(article), 500);
            } else if (article.displayOnLearn) {
                const learnArticles = allArticles.filter(a => a.displayOnLearn)
                    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
                const index = learnArticles.findIndex(a => a.id == articleId);
                const page = Math.floor(index / learnArticlesPerPage) + 1;
                currentLearnPage = page;
                displayLearnArticles(page);
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
            console.log("Initial rendering: displaying articles on index.html");
            displayArticles(currentArticlePage);
        }
        if (document.getElementById('learn-grid')) {
            console.log("Initial rendering: displaying articles on learn.html");
            displayLearnArticles(currentLearnPage);
        }
    }

    // Setup share buttons for full article page
    if (document.getElementById('full-share-buttons')) {
        const articleIdFromScript = document.querySelector('script')?.textContent.match(/const articleId = "(\d+)"/)?.[1];
        if (articleIdFromScript) {
            const article = allArticles.find(a => a.id == articleIdFromScript);
            if (article) {
                shareArticle(); // Call shareArticle without event to set initial hrefs
            }
        }
    }
});