// script.js
document.addEventListener('DOMContentLoaded', function() {
    const inverterSelect = document.getElementById('inverter-select');
    const panelSelect = document.getElementById('panel-select');
    const billSlider = document.getElementById('bill-slider');
    const billAmount = document.getElementById('bill-amount');
    const co2Saved = document.getElementById('co2-saved');
    const treesSaved = document.getElementById('trees-saved');
    const totalAmount = document.getElementById('total-amount');
    const summerDaily = document.getElementById('summer-daily');
    const summerYearly = document.getElementById('summer-yearly');
    const winterDaily = document.getElementById('winter-daily');
    const winterYearly = document.getElementById('winter-yearly');
    const yearsSelect = document.getElementById('years-select');

    // Real Data for Inverters
    const inverterData = [
        { name: "Fronius Symo", powerOutput: 5, efficiency: 0.98, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8cLYHQ4zSK1Hncj6raMRM-LZ9kSCmxx1Jg&s" },
        { name: "Huawei", powerOutput: 7, efficiency: 0.97, image: "https://www.solarshoponline.com.au/wp-content/uploads/2021/07/Huawei-5kw-Three-Phase-Hybrid-Solar-Inverter-%E2%80%93-SUN2000L-5KTL-M0M1.jpg" },
        { name: "Growatt", powerOutput: 6, efficiency: 0.96, image: "https://greentechsolar.com.au/wp-content/uploads/2024/01/growatt.png" },
        { name: "Solax", powerOutput: 5.5, efficiency: 0.97, image: "https://www.solaxpower.com/uploads/image/20230620/15/energy-storage-inverter-x1-hybrid-lv-2.webp" },
        { name: "Solis", powerOutput: 6.5, efficiency: 0.96, image: "https://cdn11.bigcommerce.com/s-o8a7xpro4o/images/stencil/300x300/products/895/3576/1__68815.1734680534.png?c=1" },
        { name: "SAJ", powerOutput: 5.8, efficiency: 0.95, image: "https://img.saj-electric.com/file/H1_230731_03-20230731020303243.png" },
        { name: "Solar Edge", powerOutput: 7.5, efficiency: 0.99, image: "https://www.solarbatteriesonline.com.au/wp-content/uploads/2023/11/Solar_Edge-SolarEdge_SE8250H-AUSNBBX14.jpg" }
    ];

    // Real Data for Panels
    const panelData = [
        { name: "DASolar 440W", powerOutput: 440, efficiency: 0.20, image: "https://solarlinkaustralia.com.au/wp-content/uploads/2023/09/DA-Solar.jpg" },
        { name: "Jinko 440W", powerOutput: 440, efficiency: 0.21, image: "https://www.austraenergy.com.au/wp-content/uploads/2023/02/Jinko-Tiger-Neo-440W-R-Product-Image.jpg" },
        { name: "Risen 440W", powerOutput: 440, efficiency: 0.22, image: "https://www.empowersolaraustralia.com.au/wp-content/uploads/2023/12/risen-energy-390W-titan.png" },
        { name: "Seraphim 440W", powerOutput: 440, efficiency: 0.20, image: "https://www.aussiesolarbattery.com.au/wp-content/uploads/2024/06/113769-LONGi-Hi-MO6m-Explorer-440-Wp-Glas-Folie-Solarmodul-LR5-54HTH-1_600x600-removebg-preview-1-300x300.png" },
        { name: "Canadian-Solar 440W", powerOutput: 440, efficiency: 0.21, image: "https://datsolar.com/wp-content/uploads/2020/10/pin-nang-luong-mat-troi-canadian-440w-1111.png" },
        { name: "EgingPV 440W", powerOutput: 440, efficiency: 0.19, image: "https://solarmanda.com.au/wp-content/uploads/2023/10/EGING-2.jpg" },
        { name: "QCells 440W", powerOutput: 440, efficiency: 0.22, image: "https://www.zerogrid.com.au/cdn/shop/files/twmnd-54hs_b06002a07e6fa14d28e8307667a6d57a.png?v=1721264579" }
    ];

    // Populate Inverter and Panel Dropdowns
    inverterData.forEach(inverter => {
        const option = document.createElement('option');
        option.value = inverter.name;
        option.textContent = inverter.name;
        inverterSelect.appendChild(option);
    });

    panelData.forEach(panel => {
        const option = document.createElement('option');
        option.value = panel.name;
        option.textContent = panel.name;
        panelSelect.appendChild(option);
    });

    // Populate Years Dropdown
    for (let i = 1; i <= 15; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} Year${i > 1 ? 's' : ''}`;
        yearsSelect.appendChild(option);
    }

    // Event Listeners
    inverterSelect.addEventListener('change', updateSpecsAndCalculate);
    panelSelect.addEventListener('change', updateSpecsAndCalculate);
    billSlider.addEventListener('input', function() {
        billAmount.textContent = `$${this.value}`;
        calculateSavings();
    });
    yearsSelect.addEventListener('change', calculateSavings);

    // Update Specifications and Calculate Savings
    function updateSpecsAndCalculate() {
        const selectedInverter = inverterData.find(inverter => inverter.name === inverterSelect.value);
        const selectedPanel = panelData.find(panel => panel.name === panelSelect.value);

        // Update Inverter Specs and Image
        document.getElementById('inverter-power').textContent = `${selectedInverter.powerOutput} kW`;
        document.getElementById('inverter-efficiency').textContent = `${selectedInverter.efficiency * 100}%`;
        document.getElementById('inverter-image').src = selectedInverter.image;

        // Update Panel Specs and Image
        document.getElementById('panel-power').textContent = `${selectedPanel.powerOutput} W`;
        document.getElementById('panel-efficiency').textContent = `${selectedPanel.efficiency * 100}%`;
        document.getElementById('panel-image').src = selectedPanel.image;

        calculateSavings();
    }

    // Calculate Savings
    function calculateSavings() {
        const selectedInverter = inverterData.find(inverter => inverter.name === inverterSelect.value);
        const selectedPanel = panelData.find(panel => panel.name === panelSelect.value);
        const monthlyBill = parseFloat(billSlider.value);
        const years = parseFloat(yearsSelect.value);

        // Calculations
        const dailyProduction = (selectedPanel.powerOutput / 1000) * selectedInverter.efficiency * 5; // 5 hours of sunlight
        const yearlyProduction = dailyProduction * 365;
        const totalProduction = yearlyProduction * years;

        const savings = monthlyBill * 12 * years - (totalProduction * 0.15); // $0.15 per kWh

        // Update UI
        co2Saved.textContent = (totalProduction * 0.5).toFixed(2);
        treesSaved.textContent = Math.floor(totalProduction * 0.1);
        totalAmount.textContent = `$${savings.toFixed(2)}`;

        summerDaily.textContent = (dailyProduction * 1.2).toFixed(2);
        summerYearly.textContent = (yearlyProduction * 1.2).toFixed(2);
        winterDaily.textContent = (dailyProduction * 0.8).toFixed(2);
        winterYearly.textContent = (yearlyProduction * 0.8).toFixed(2);
    }

    // Initial Calculation
    updateSpecsAndCalculate();
});