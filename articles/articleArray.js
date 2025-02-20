  // ----- Article Data Array -----
  // Each article now includes extra properties:
  // - displayOnMain: if true, show on the main page articles (with modal)
  // - displayOnLearn: if true, show on the Learn page as a square card
  // - fullArticlePath: the path to the full article HTML file (for Learn page "Read More")
  //This variable is responsible for giving /path to the actual article and making 
  const allArticles = [
    {
      id: 1,
      title: "Solar Rebates and Financial Incentives in Western Australia",
      image: "https://gosolarquotes.com.au/wp-content/uploads/2021/01/solar-installation-perth-5kW.jpg",
      snippet: "Discover how government incentives, STCs, and feed-in tariffs can help you save on solar energy investments in Western Australia.",
      fullText: `
        <h2>Introduction</h2>
        <p>In Western Australia, the government offers various financial incentives to encourage the adoption of solar energy. These include Small-Scale Technology Certificates (STCs), rebates, and feed-in tariffs. Let's explore how these incentives can reduce the cost of your solar installation and help you contribute to a more sustainable future.</p>
    
        <h2>Table of Contents</h2>
        <ul>
          <li><a href="#stcs">Small-Scale Technology Certificates (STCs)</a></li>
          <li><a href="#rebates">State Rebates in WA</a></li>
          <li><a href="#feedintariffs">Feed-in Tariffs</a></li>
          <li><a href="#pricing">Rebate Pricing in 2025</a></li>
        </ul>
    
        <h2 id="stcs">Small-Scale Technology Certificates (STCs)</h2>
        <p>STCs are the key federal government incentive for solar panel installations. Homeowners can earn STCs based on the size of their system and its location. The more efficient and larger the system, the greater the number of STCs you can receive, which translates into a greater rebate off the cost of the installation.</p>
        <img src="https://proaccionaau.blob.core.windows.net/media/1kvbc4ud/rooftop-solar.jpg" alt="Solar Panels in Perth, Western Australia" style="width:100%; height:auto;">
        
        <h2 id="rebates">State Rebates in WA</h2>
        <p>In addition to the federal incentives, the Western Australian government offers additional rebates to encourage solar uptake. One of the most notable is the <strong>Solar Homes Program</strong>, which provides up to $3,000 towards the installation of solar power systems for eligible households.</p>
        
        <h2 id="feedintariffs">Feed-in Tariffs</h2>
        <p>Western Australia offers competitive feed-in tariffs for excess solar energy fed back into the grid. The rate depends on your retailer, but it can range from 6c to 11c per kWh in some areas. This helps offset the cost of your electricity bills, making solar energy even more attractive for households and businesses.</p>
        
        <h2 id="pricing">Rebate Pricing in 2025</h2>
        <p>The average cost of a 6.6kW solar system in Western Australia is around $4,000 to $6,000 after rebates. This is based on current solar panel prices and available incentives in 2025. The cost may vary depending on the size of the system and the installer, but with rebates and feed-in tariffs, you can see a return on your investment in just a few years.</p>
        
        <h2>Conclusion</h2>
        <p>By taking advantage of federal and state incentives, homeowners in Western Australia can significantly reduce the upfront cost of solar power systems. Additionally, feed-in tariffs allow you to generate income by selling excess energy back to the grid. As solar technology continues to improve, the savings and benefits of solar power will only continue to grow.</p>
    
        <p><strong>Published Date:</strong> February 20, 2025</p>
        <p><strong>Comment:</strong> This is an example article on solar rebates and financial incentives in Western Australia.</p>
      `,
      publishedDate: "February 20, 2025",
      comment: "My first ever article upload",
      displayOnMain: true,
      displayOnLearn: true,
      fullArticlePath: "../articles/Solar-Rebates-and-Financial-Incentives/Solar-Rebates-and-Financial-Incentives.html"
    }
    
    // ... add more articles as needed ...
  ];
