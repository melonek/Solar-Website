document.addEventListener('DOMContentLoaded', function() {
    const inverterSelect = document.getElementById('inverter-select');
    const panelSelect = document.getElementById('panel-select');
    const systemSizeSelect = document.getElementById('system-size-select');
    const billSlider = document.getElementById('bill-slider');
    const billAmount = document.getElementById('bill-amount');
    const co2Saved = document.getElementById('co2-saved');
    const treesSaved = document.getElementById('trees-saved');
    const totalAmount = document.getElementById('total-amount');
    const summerDaily = document.getElementById('summer-daily');
    const winterDaily = document.getElementById('winter-daily');
    const combinedYearlyTotal = document.getElementById('combined-yearly-total');
    const yearsSelect = document.getElementById('years-select');
    const monthlyBillAmount = document.getElementById('monthly-bill-amount'); // displays quarterly bill here
    const annualBill = document.getElementById('annual-bill');
    const co2Emissions = document.getElementById('co2-emissions');

    // Real Data for Inverters
    const inverterData = [
        { name: "Fronius Symo", powerOutput: 5, efficiency: 0.98, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8cLYHQ4zSK1Hncj6raMRM-LZ9kSCmxx1Jg&s" },
        { name: "Huawei", powerOutput: 5, efficiency: 0.984, image: "https://www.solarshoponline.com.au/wp-content/uploads/2021/07/Huawei-5kw-Three-Phase-Hybrid-Solar-Inverter-%E2%80%93-SUN2000L-5KTL-M0M1.jpg" },
        { name: "Growatt", powerOutput: 5, efficiency: 0.96, image: "https://greentechsolar.com.au/wp-content/uploads/2024/01/growatt.png" },
        { name: "Solax", powerOutput: 5, efficiency: 0.97, image: "https://www.solaxpower.com/uploads/image/20230620/15/energy-storage-inverter-x1-hybrid-lv-2.webp" },
        { name: "Solis", powerOutput: 5, efficiency: 0.96, image: "https://cdn11.bigcommerce.com/s-o8a7xpro4o/images/stencil/300x300/products/895/3576/1__68815.1734680534.png?c=1" },
        { name: "SAJ", powerOutput: 5, efficiency: 0.95, image: "https://img.saj-electric.com/file/H1_230731_03-20230731020303243.png" },
        { name: "Solar Edge", powerOutput: 5, efficiency: 0.99, image: "https://www.solarbatteriesonline.com.au/wp-content/uploads/2023/11/Solar_Edge-SolarEdge_SE8250H-AUSNBBX14.jpg" }
    ];

    // Real Data for Panels
    const panelData = [
        { name: "Jinko 440W", powerOutput: 440, efficiency: 0.2323, image: "https://www.austraenergy.com.au/wp-content/uploads/2023/02/Jinko-Tiger-Neo-440W-R-Product-Image.jpg" },
        { name: "DASolar 440W", powerOutput: 440, efficiency: 0.22, image: "https://solarlinkaustralia.com.au/wp-content/uploads/2023/09/DA-Solar.jpg" },
        { name: "Risen 440W", powerOutput: 440, efficiency: 0.22, image: "https://www.empowersolaraustralia.com.au/wp-content/uploads/2023/12/risen-energy-390W-titan.png" },
        { name: "Seraphim 440W", powerOutput: 440, efficiency: 0.20, image: "https://www.aussiesolarbattery.com.au/wp-content/uploads/2024/06/113769-LONGi-Hi-MO6m-Explorer-440-Wp-Glas-Folie-Solarmodul-LR5-54HTH-1_600x600-removebg-preview-1-300x300.png" },
        { name: "Canadian-Solar 440W", powerOutput: 440, efficiency: 0.22, image: "https://datsolar.com/wp-content/uploads/2020/10/pin-nang-luong-mat-troi-canadian-440w-1111.png" },
        { name: "EGingPV 440W", powerOutput: 440, efficiency: 0.19, image: "https://solarmanda.com.au/wp-content/uploads/2023/10/EGING-2.jpg" },
        { name: "QCells 440W", powerOutput: 440, efficiency: 0.24, image: "https://www.zerogrid.com.au/cdn/shop/files/twmnd-54hs_b06002a07e6fa14d28e8307667a6d57a.png?v=1721264579" }
    ];

    // System Size Data
    const systemSizeData = [
        { size: "6.6kW", panels: 15, co2Saved: 9526.5 },
        { size: "10kW", panels: 24, co2Saved: 14400 },
        { size: "13kW", panels: 30, co2Saved: 18000 },
        { size: "20kW", panels: 46, co2Saved: 27600 }
    ];

    // Base Case for Scaling Savings
    const baseCase = {
        inverterEfficiency: 0.98,
        panelEfficiency: 0.2323,
        // Note: baseCase.monthlyBill is no longer used; the slider value now represents a quarterly bill.
        yearlySavings: 1300,
        baseDailyProduction: 29,
        basePanels: 15
    };

    // Populate Inverter, Panel, and System Size Dropdowns
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

    systemSizeData.forEach(system => {
        const option = document.createElement('option');
        option.value = system.size;
        option.textContent = `${system.size} (${system.panels}x440W panels)`;
        systemSizeSelect.appendChild(option);
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
    systemSizeSelect.addEventListener('change', updateSpecsAndCalculate);
    
    // Set the slider display to the default quarterly bill value (600)
    billAmount.textContent = `$${billSlider.value}`;

    billSlider.addEventListener('input', function() {
        billAmount.textContent = `$${this.value}`;
        // Use the slider value as the quarterly bill in calculations
        calculateEmissions(this.value);
        calculateSavings();
    });
    
    yearsSelect.addEventListener('change', calculateSavings);

    // Update Specifications and Calculate Savings
    function updateSpecsAndCalculate() {
        const selectedInverter = inverterData.find(inverter => inverter.name === inverterSelect.value);
        const selectedPanel = panelData.find(panel => panel.name === panelSelect.value);
        const selectedSystemSize = systemSizeData.find(system => system.size === systemSizeSelect.value);

        document.getElementById('inverter-power').textContent = `${selectedInverter.powerOutput} kW`;
        document.getElementById('inverter-efficiency').textContent = `${selectedInverter.efficiency * 100}%`;
        document.getElementById('inverter-image').src = selectedInverter.image;

        document.getElementById('panel-power').textContent = `${selectedPanel.powerOutput} W`;
        document.getElementById('panel-efficiency').textContent = `${selectedPanel.efficiency * 100}%`;
        document.getElementById('panel-image').src = selectedPanel.image;

        calculateSavings();
    }

    // Calculate Savings
    function calculateSavings() {
        const selectedInverter = inverterData.find(inverter => inverter.name === inverterSelect.value);
        const selectedPanel = panelData.find(panel => panel.name === panelSelect.value);
        const selectedSystemSize = systemSizeData.find(system => system.size === systemSizeSelect.value);
        // Here, billSlider.value is the quarterly bill (default 600)
        const quarterlyBill = parseFloat(billSlider.value);
        const years = parseFloat(yearsSelect.value);

        // Efficiency and system size scaling
        const efficiencyFactor = (selectedPanel.efficiency / baseCase.panelEfficiency) * 
                                   (selectedInverter.efficiency / baseCase.inverterEfficiency);
        const systemSizeFactor = selectedSystemSize.panels / baseCase.basePanels;

        const summerDailyProduction = baseCase.baseDailyProduction * efficiencyFactor * systemSizeFactor;
        const winterDailyProduction = summerDailyProduction * 0.7;
        const combinedYearlyProduction = (summerDailyProduction * 147) + 
                                         (summerDailyProduction * 0.8 * 139) + 
                                         (winterDailyProduction * 60);

        // Savings: annual savings = quarterlyBill * 0.5 * 4 * years
        const billReduction = quarterlyBill * 0.5 * 4 * years;
        const scaledSavings = billReduction * efficiencyFactor * systemSizeFactor;

        summerDaily.textContent = `${summerDailyProduction.toFixed(1)} kWh`;
        winterDaily.textContent = `${winterDailyProduction.toFixed(1)} kWh`;
        combinedYearlyTotal.textContent = `${(combinedYearlyProduction * years).toFixed(0)} kWh`;

        const co2Base = 9526.5;
        const co2SavedValue = (co2Base * systemSizeFactor * efficiencyFactor * years).toFixed(0);
        co2Saved.textContent = co2SavedValue;
        treesSaved.textContent = Math.round(co2SavedValue / 22);

        totalAmount.textContent = `$${scaledSavings.toFixed(0)}`;
    }

    // Calculate Emissions
    function calculateEmissions(quarterlyBill) {
        // quarterlyBill is taken directly from the slider (e.g. 600)
        const annual = quarterlyBill * 4;  // Annual bill = quarterly bill * 4
        monthlyBillAmount.textContent = quarterlyBill;
        annualBill.textContent = annual;
        // Emissions calculation using annual electricity cost assumptions
        const kWh = annual / 0.3158;
        const emissions = (kWh * 0.85 / 1000).toFixed(1);
        co2Emissions.textContent = emissions;
    }

    // Additional event listener (already attached above) triggers calculations on slider input.
    billSlider.addEventListener('input', function() {
        calculateEmissions(this.value);
        calculateSavings();
    });

    // Initial Calculation
    updateSpecsAndCalculate();
    calculateEmissions(billSlider.value); // Use default quarterly bill value
});
