document.addEventListener('DOMContentLoaded', function () {
    initializeBrandImages();
    populateBrandSlider();
    populateBatteryGrid();
    attachModalHandlers();
    attachSorting();
    attachEnquiryScroll();
    attachFormSubmitHandler(); // Attach handler for form submission via AJAX
});

// ===================== BRAND SLIDER =====================
function populateBrandSlider() {
    const brandContainer = document.querySelector('.solar-brands-container');
    if (!brandContainer) return;

    brandContainer.innerHTML = "";
    brandImages.slice(0, 4).forEach(brand => {
        const card = document.createElement('div');
        card.className = 'solar-brand-card';
        card.innerHTML = `<img src="${brand.url}" alt="${brand.name}">`;
        brandContainer.appendChild(card);
    });

    initializeBrandSlider('.solar-brand-card', '#solar-logo-cards-container');
}

// ===================== BATTERY GRID POPULATION =====================
function populateBatteryGrid() {
    const batteryGrid = document.getElementById('battery-grid');
    if (!batteryGrid) return;

    solarProducts.batteries.forEach(battery => {
        const card = createProductCard(battery, 'battery');
        card.setAttribute('data-id', battery.id);

        card.addEventListener('click', function (e) {
            if (!e.target.classList.contains('read-more-btn')) {
                handleBatterySelection(battery, this);
            }
        });

        batteryGrid.appendChild(card);
    });
    
    // Append the bundle button below the battery grid as an anchor element so it can redirect later
    const bundleButton = document.createElement('a');
    bundleButton.id = 'bundle-btn';
    bundleButton.classList.add('fancy-button');
    bundleButton.textContent = 'Bundle with solar system';
    bundleButton.href = '../packages/packages.html'; // Update with your desired path later.
    batteryGrid.insertAdjacentElement('afterend', bundleButton);
}

// ===================== BATTERY SELECTION =====================
function handleBatterySelection(battery, card) {
    document.querySelectorAll('.product-card').forEach(c => c.classList.remove('selected-battery'));
    card.classList.add('selected-battery');
    selectedBattery = battery;
    updateBatteryPackageDisplay();

    setTimeout(() => {
        scrollToSection('battery-package');
        // Updated text cloud message for battery-only page:
        showTextCloud("Here’s a glimpse of your future battery package.", 2000);
    }, 300);
}

// ===================== UPDATE BATTERY PACKAGE DISPLAY =====================
function updateBatteryPackageDisplay() {
    const batteryImage = document.getElementById('selected-battery-alone-image');
    const batteryPackage = document.getElementById('battery-package');
    const totalCostDisplay = document.getElementById('total-cost');
    const batteryContainer = document.getElementById('battery-image-combination');

    if (!selectedBattery) return;

    // Set the battery image and make it visible
    batteryImage.src = selectedBattery.image;
    batteryImage.style.visibility = 'visible';

    // Find the matching brand logo based on the selected battery name
    const matchingBrand = brandImages.find(brand =>
        selectedBattery.name.toLowerCase().includes(brand.name.toLowerCase())
    );

    // Get the brand logo overlay element
    const brandLogo = document.getElementById('brand-logo-overlay');

    if (matchingBrand) {
        brandLogo.src = matchingBrand.url;
        brandLogo.alt = matchingBrand.name;
        brandLogo.style.display = 'block'; // Make it visible
    } else {
        brandLogo.style.display = 'none'; // Hide if no brand matches
    }

    // Update text descriptions and cost with improved text mapping
    document.getElementById('package-description').innerHTML = 
        `<strong>${selectedBattery.name}</strong> - ${selectedBattery.specs}`;
    
    totalCostDisplay.textContent = `Total: $${selectedBattery.price} AUD`;
    totalCostDisplay.style.display = 'block';

    // Insert enquiry description between the total cost and the enquiry button
    let enquiryDescription = document.getElementById('enquiry-description');
    if (!enquiryDescription) {
        enquiryDescription = document.createElement('p');
        enquiryDescription.id = 'enquiry-description';
        const buttonContainer = document.querySelector('#battery-package .button-container');
        buttonContainer.parentNode.insertBefore(enquiryDescription, buttonContainer);
    }
    enquiryDescription.innerHTML = `I would like to enquire about ${selectedBattery.specs}, <strong>${selectedBattery.name}</strong> battery storage system.`;

    batteryPackage.style.display = 'block';

    // Dynamic updating: If a summary already exists, update it.
    if (document.getElementById('package-summary')) {
        updateBatteryFormSummary();
    }
}

// ===================== BATTERY PACKAGE SUMMARY HELPER FUNCTIONS =====================
function collectBatteryPackageData() {
    return `
        <ul class="package-summary-list">
            <li>Battery: <strong>${selectedBattery ? selectedBattery.name : "Not selected"}</strong></li>
            <li>Specs: <strong>${selectedBattery ? selectedBattery.specs : "Not selected"}</strong></li>
        </ul>
    `;
}

function updateBatteryFormSummary() {
    const packageForm = document.querySelector('.package-form');
    if (packageForm) {
        let packageSummary = document.getElementById('package-summary');
        if (!packageSummary) {
            packageSummary = document.createElement('div');
            packageSummary.id = 'package-summary';
            // Insert the summary before the first visible form group (if any)
            const firstFormGroup = packageForm.querySelector('.form-group');
            if (firstFormGroup) {
                packageForm.insertBefore(packageSummary, firstFormGroup);
            } else {
                packageForm.insertAdjacentElement('afterbegin', packageSummary);
            }
        }
        packageSummary.innerHTML = collectBatteryPackageData();
    }
}

// ===================== SCROLL TO FORM & SHOW TEXT CLOUD =====================
function attachEnquiryScroll() {
    // Only the confirm-selection button scrolls to the form
    document.getElementById('confirm-selection').addEventListener('click', () => {
        if (!selectedBattery) {
            showTextCloud("Please select a battery before enquiring.", 3000);
            // Wait for the text cloud duration before scrolling to the battery selection section
            setTimeout(() => {
                scrollToSection('battery-grid');
            }, 3000);
        } else {
            // Generate the battery summary at the top of the form on confirm click.
            updateBatteryFormSummary();
            scrollToForm();
        }
    });
    // Removed any additional click handler for the enquire-button to avoid multiple text clouds.
}

// ===================== ATTACH FORM SUBMISSION HANDLER =====================
function attachFormSubmitHandler() {
    const packageForm = document.querySelector('.package-form');
    if (packageForm) {
        packageForm.addEventListener('submit', function(e) {
            // Prevent submission if battery is not selected
            if (!selectedBattery) {
                e.preventDefault();
                showTextCloud("Please select a battery before submitting the form.", 3000);
                // Wait for the text cloud duration before scrolling to the battery selection section
                setTimeout(() => {
                    scrollToSection('battery-grid');
                }, 3000);
                return;
            }
            
            e.preventDefault();

            // Update the solar package input field with battery info if it exists.
            // Now includes both battery name and specs.
            const solarPackageInput = document.getElementById('solar-package-input');
            if (selectedBattery && solarPackageInput) {
                solarPackageInput.value = `Battery: ${selectedBattery.name} - ${selectedBattery.specs}`;
            }

            const formData = new FormData(packageForm);
            fetch(packageForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    showTextCloud("Thank you, your message has been forwarded. Have a nice day.", 4000);
                    packageForm.reset();
                } else {
                    showTextCloud("Oops! There was a problem submitting your form.", 4000);
                }
            })
            .catch(error => {
                showTextCloud("Oops! There was a problem submitting your form.", 4000);
            });
        });
    }
}

// ===================== SCROLL TO FORM FUNCTION =====================
function scrollToForm() {
    const formSection = document.querySelector('.package-form');
    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===================== MODAL HANDLERS =====================
function attachModalHandlers() {
    const modal = document.getElementById('product-modal');
    const closeModalButton = document.querySelector('.close');

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('close')) {
                modal.style.display = 'none';
            }
        });
    }
}

// ===================== SORTING FUNCTION =====================
function attachSorting() {
    document.getElementById('battery-filter').addEventListener('change', function () {
        sortProducts('battery', this.value);
    });
}

// ===================== SCROLL FUNCTION =====================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===================== SHOW TEXT CLOUD FUNCTION =====================
function showTextCloud(message, duration = 2000) {
    // Immediately remove any existing text clouds
    document.querySelectorAll('.text-cloud').forEach(tc => tc.remove());
    
    const cloud = document.createElement('div');
    cloud.className = 'text-cloud';
    cloud.textContent = message;
    document.body.appendChild(cloud);

    setTimeout(() => {
        cloud.style.opacity = '0';
        setTimeout(() => cloud.remove(), 500);
    }, duration);
}

// ===================== RESET BATTERY SUMMARY AND TEXT CLOUD ON SCROLL =====================
// When the user scrolls back up to the battery package section, remove the package summary
// and re-display the text cloud message.
window.addEventListener('scroll', function() {
    const batteryPackageSection = document.getElementById('battery-package');
    if (batteryPackageSection) {
        const rect = batteryPackageSection.getBoundingClientRect();
        // If the section's top is near the top of the viewport (within 150px), remove the summary...
        if (rect.top >= 0 && rect.top < 150) {
            const packageSummary = document.getElementById('package-summary');
            if (packageSummary) {
                packageSummary.remove();
            }
            // ...and re-display the text cloud message if not already active.
            if (!document.querySelector('.text-cloud')) {
                showTextCloud("Here’s a glimpse of your future battery package.", 2000);
            }
        }
    }
});
