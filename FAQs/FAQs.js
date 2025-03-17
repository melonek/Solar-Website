document.addEventListener("DOMContentLoaded", function () {
    // FAQ toggle functionality for hardcoded items
    const faqHeaders = document.querySelectorAll('.faq-item h3');
    faqHeaders.forEach(header => {
      header.addEventListener('click', function () {
        this.parentElement.classList.toggle('active');
      });
    });
  
    // Additional FAQs array – these can be expanded as needed
    const additionalFaqs = [
      {
        question: "Q11: Can I expand my solar system in the future?",
        answer: "Absolutely. Our systems are designed with scalability in mind, so you can easily add more panels or storage solutions as your energy needs grow."
      },
      {
        question: "Q12: What warranties are offered with solar installations?",
        answer: "We offer a 25-year performance warranty on the panels and a 10-year warranty on the inverter and installation work."
      },
      {
        question: "Q13: How do I monitor the system performance?",
        answer: "After installation, you receive an app that provides real-time data on your energy production and savings."
      },
      {
        question: "Q14: What is the typical payback period for solar panels?",
        answer: "Most systems pay for themselves in about 5 to 10 years, depending on local energy rates and available incentives."
      }
    ];
  
    // Batch settings – here we load up to 10 at a time (if available)
    let faqIndex = 0;
    const batchSize = 10;
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const faqContainer = document.querySelector('.faq-container');
    const noMoreFaqsMsg = document.getElementById('noMoreFaqs');
  
    loadMoreBtn.addEventListener('click', function () {
      let count = 0;
      // Append additional FAQs in batches until batchSize is met or no FAQs remain
      while (faqIndex < additionalFaqs.length && count < batchSize) {
        const faq = additionalFaqs[faqIndex];
        // Create a new FAQ item
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
  
        const faqHeader = document.createElement('h3');
        faqHeader.innerHTML = faq.question + '<span class="arrow">▼</span>';
        // Add toggle functionality to the newly created header
        faqHeader.addEventListener('click', function () {
          faqItem.classList.toggle('active');
        });
        faqItem.appendChild(faqHeader);
  
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer';
        const answerP = document.createElement('p');
        // Derive the answer label from the question (e.g., Q11 becomes A11)
        const answerLabel = faq.question.split(':')[0].replace('Q', 'A') + ':';
        answerP.innerHTML = `<strong>${answerLabel}</strong> ${faq.answer}`;
        answerDiv.appendChild(answerP);
        faqItem.appendChild(answerDiv);
  
        faqContainer.appendChild(faqItem);
        faqIndex++;
        count++;
      }
      // If no more FAQs to load, hide the button and display a notification
      if (faqIndex >= additionalFaqs.length) {
        loadMoreBtn.style.display = 'none';
        noMoreFaqsMsg.style.display = 'block';
      }
    });
  });
  