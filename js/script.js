// js/script.js - VERSIE 4 (met Download Modal + AI Coach Modal)

document.addEventListener('DOMContentLoaded', function() {

    // --- Functie om HTML content te laden (Header/Footer) ---
    const loadHTML = (url, elementSelector) => {
        fetch(url)
            .then(response => {
                if (!response.ok) { console.error(`Failed to fetch ${url}. Status: ${response.status}`); throw new Error(`HTTP error! status: ${response.status}`); }
                return response.text();
            })
            .then(data => {
                const element = document.querySelector(elementSelector);
                if (element) {
                    element.innerHTML = data; element.classList.add('loaded');
                    if (elementSelector === 'header.site-header') { setupMobileMenu(); setActiveNavLink(); setupMobileDropdown(); }
                    if (elementSelector === 'footer.site-footer') { updateFooterYear(); }
                } else { console.error(`Target element "${elementSelector}" not found.`); }
            })
            .catch(error => { console.error(`Could not load/process HTML from ${url}:`, error); });
    };

    // --- Laad de header en footer ---
    loadHTML('header-include.html', 'header.site-header');
    loadHTML('footer-include.html', 'footer.site-footer');

    // --- Functies voor Header (Mobile Menu, Dropdown, Active Link, Footer Year) ---
    const setupMobileMenu = () => { const headerElement = document.querySelector('header.site-header'); if (!headerElement) return; const menuToggle = headerElement.querySelector('.menu-toggle'); const mobileNavMenu = headerElement.querySelector('#primary-mobile-menu'); if (menuToggle && mobileNavMenu) { const newMenuToggle = menuToggle.cloneNode(true); menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle); newMenuToggle.addEventListener('click', function() { const isExpanded = newMenuToggle.getAttribute('aria-expanded') === 'true'; newMenuToggle.setAttribute('aria-expanded', !isExpanded); mobileNavMenu.classList.toggle('nav-active'); }); } else { if (!menuToggle) console.error("Mobile menu toggle button (.menu-toggle) not found after header load."); if (!mobileNavMenu) console.error("Mobile navigation menu (#primary-mobile-menu) not found after header load."); } };
    const setupMobileDropdown = () => { const headerElement = document.querySelector('header.site-header'); if (!headerElement) return; const dropdownTrigger = headerElement.querySelector('.dropdown-trigger-mobile'); const dropdownMenu = headerElement.querySelector('.dropdown-menu-mobile'); const parentLi = headerElement.querySelector('.has-dropdown-mobile'); if(dropdownTrigger && dropdownMenu && parentLi) { const newDropdownTrigger = dropdownTrigger.cloneNode(true); dropdownTrigger.parentNode.replaceChild(newDropdownTrigger, dropdownTrigger); newDropdownTrigger.addEventListener('click', function(event) { event.preventDefault(); parentLi.classList.toggle('active'); if (dropdownMenu.style.maxHeight && dropdownMenu.style.maxHeight !== '0px') { dropdownMenu.style.maxHeight = '0px'; } else { dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + "px"; } }); } else { if (!dropdownTrigger) console.error("Mobile dropdown trigger (.dropdown-trigger-mobile) not found."); if (!dropdownMenu) console.error("Mobile dropdown menu (.dropdown-menu-mobile) not found."); if (!parentLi) console.error("Mobile dropdown parent LI (.has-dropdown-mobile) not found."); } };
    const updateFooterYear = () => { const footerElement = document.querySelector('footer.site-footer'); if (!footerElement) return; const yearSpan = footerElement.querySelector('#current-year'); if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); } else { console.error("Year span (#current-year) not found after footer load."); } };
    const setActiveNavLink = () => { const headerElement = document.querySelector('header.site-header'); if (!headerElement) return; const currentPath = window.location.pathname.split('/').pop(); const currentPage = (currentPath === '' || currentPath === 'index.html') ? 'index.html' : currentPath; const navLinks = headerElement.querySelectorAll('.nav-left a, .nav-right a, .nav-menu-mobile a'); navLinks.forEach(link => { const linkPath = link.getAttribute('href').split('/').pop(); const linkPage = (linkPath === '' || linkPath === 'index.html') ? 'index.html' : linkPath; link.classList.remove('active'); if(link.parentElement) link.parentElement.classList.remove('active'); if (linkPage === currentPage && !link.classList.contains('dropdown-trigger') && !link.classList.contains('dropdown-trigger-mobile') ) { link.classList.add('active'); if(link.closest('li')) link.closest('li').classList.add('active'); } }); };

    // --- Download Modal Functionaliteit ---
    const downloadModal = document.getElementById('download-modal');
    const openDownloadModalBtn = document.getElementById('open-download-modal-btn');
    const downloadEmailInputHP = document.getElementById('email-download-hp');
    const downloadEmailErrorHP = document.getElementById('email-error-hp');
    const downloadModalEmailDisplay = document.getElementById('modal-email-display');
    const downloadModalEmailInput = document.getElementById('modal-email-input');
    const downloadModalForm = document.getElementById('modal-download-form');
    const downloadModalFormError = document.getElementById('modal-form-error');
    const downloadSuccessModal = document.getElementById('download-success');

    const openDownloadModal = () => { const emailValue = downloadEmailInputHP.value.trim(); if (emailValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) { downloadEmailErrorHP.style.display = 'none'; if (downloadModalEmailDisplay) downloadModalEmailDisplay.textContent = emailValue; if (downloadModalEmailInput) downloadModalEmailInput.value = emailValue; if (downloadModal) downloadModal.classList.add('modal-active'); } else { downloadEmailErrorHP.style.display = 'block'; downloadEmailInputHP.focus(); } };

    if (openDownloadModalBtn) { openDownloadModalBtn.addEventListener('click', openDownloadModal); }
    if (downloadEmailInputHP) { downloadEmailInputHP.addEventListener('keypress', function(event) { if (event.key === "Enter") { event.preventDefault(); openDownloadModalBtn.click(); } }); }

    // Formspree submission for Download Modal
    if (downloadModalForm) {
        downloadModalForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const submitButton = downloadModalForm.querySelector('button[type="submit"]'); const originalButtonText = submitButton.textContent; submitButton.disabled = true; submitButton.textContent = 'Bezig met verzenden...'; if(downloadModalFormError) downloadModalFormError.style.display = 'none';
            const formData = new FormData(downloadModalForm); const formAction = downloadModalForm.action;
            fetch(formAction, { method: "POST", body: formData, headers: { 'Accept': 'application/json' } })
            .then(response => {
                submitButton.disabled = false; submitButton.textContent = originalButtonText;
                if (response.ok) {
                    closeAllModals(); if(downloadSuccessModal) downloadSuccessModal.style.display = 'block'; if(downloadSuccessModal) downloadSuccessModal.classList.add('modal-active'); downloadEmailInputHP.value = ''; // Maak initiele veld leeg
                } else {
                    response.json().then(data => { if (downloadModalFormError) { if (data.errors) { downloadModalFormError.textContent = data.errors.map(error => error.message).join(", "); } else { downloadModalFormError.textContent = "Er is iets misgegaan bij het verzenden. Probeer het opnieuw."; } downloadModalFormError.style.display = 'block'; } else { console.error("Form submission error (Download Modal)"); alert("Er is iets misgegaan."); }})
                }
            }).catch(error => { submitButton.disabled = false; submitButton.textContent = originalButtonText; if (downloadModalFormError) { downloadModalFormError.textContent = "Kon formulier niet verzenden. Controleer je internetverbinding."; downloadModalFormError.style.display = 'block'; } else { console.error('Form submission fetch error:', error); alert("Kon formulier niet verzenden."); } });
        });
    }

    // --- NIEUW: AI Coach Modal Functionaliteit ---
    const aiCoachModal = document.getElementById('ai-coach-modal');
    const openAICoachModalBtn = document.getElementById('open-ai-coach-modal-btn');
    const aiCoachEmailInput = document.getElementById('ai-email'); // Het email veld IN de modal
    const aiCoachForm = document.getElementById('ai-coach-form');
    const aiCoachFormError = document.getElementById('ai-coach-form-error');
    const aiCoachSuccessModal = document.getElementById('ai-coach-success');

    const openAICoachModal = () => {
         // Reset form state
         if(aiCoachForm) aiCoachForm.reset();
         if(aiCoachFormError) aiCoachFormError.style.display = 'none';
         // Open modal
         if(aiCoachModal) aiCoachModal.classList.add('modal-active');
    };

    if (openAICoachModalBtn) {
        openAICoachModalBtn.addEventListener('click', openAICoachModal);
    }

    // Formspree submission for AI Coach Modal
    if (aiCoachForm) {
        aiCoachForm.addEventListener("submit", function(event) {
            event.preventDefault();

            // Basic validation for required email in AI Coach form
            if (!aiCoachEmailInput || !aiCoachEmailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(aiCoachEmailInput.value.trim())) {
                 if(aiCoachFormError) {
                     aiCoachFormError.textContent = "Voer een geldig e-mailadres in.";
                     aiCoachFormError.style.display = 'block';
                 }
                 if(aiCoachEmailInput) aiCoachEmailInput.focus();
                 return; // Stop submission
            }

            const submitButton = aiCoachForm.querySelector('button[type="submit"]'); const originalButtonText = submitButton.textContent; submitButton.disabled = true; submitButton.textContent = 'Bezig met verzenden...'; if(aiCoachFormError) aiCoachFormError.style.display = 'none';
            const formData = new FormData(aiCoachForm); const formAction = aiCoachForm.action;

            fetch(formAction, { method: "POST", body: formData, headers: { 'Accept': 'application/json' } })
            .then(response => {
                submitButton.disabled = false; submitButton.textContent = originalButtonText;
                if (response.ok) {
                    closeAllModals(); // Sluit AI Coach Modal
                    if(aiCoachSuccessModal) aiCoachSuccessModal.style.display = 'block'; // Toon AI Coach Succes
                    if(aiCoachSuccessModal) aiCoachSuccessModal.classList.add('modal-active');
                } else {
                     response.json().then(data => { if (aiCoachFormError) { if (data.errors) { aiCoachFormError.textContent = data.errors.map(error => error.message).join(", "); } else { aiCoachFormError.textContent = "Er is iets misgegaan bij het verzenden. Probeer het opnieuw."; } aiCoachFormError.style.display = 'block'; } else { console.error("Form submission error (AI Coach Modal)"); alert("Er is iets misgegaan."); }})
                }
            }).catch(error => { submitButton.disabled = false; submitButton.textContent = originalButtonText; if (aiCoachFormError) { aiCoachFormError.textContent = "Kon formulier niet verzenden. Controleer je internetverbinding."; aiCoachFormError.style.display = 'block'; } else { console.error('Form submission fetch error:', error); alert("Kon formulier niet verzenden."); } });
        });
    }


    // --- Algemene Modal Sluit Functie ---
    const closeAllModals = () => {
        const allModals = document.querySelectorAll('.modal'); // Selecteer ALLE modals
        allModals.forEach(m => {
             m.classList.remove('modal-active');
             // Kleine delay om fade-out effect toe te staan voordat display:none wordt gezet
             setTimeout(() => {
                // Alleen verbergen als het NIET de succes modal is die we net misschien hebben geopend
                if (!m.classList.contains('modal-active')) {
                     // Reset display alleen als de class er echt af is
                     if(m.id !== 'download-success' && m.id !== 'ai-coach-success') {
                        m.style.display = 'none';
                     } else if (m.style.display === 'block' && !m.classList.contains('modal-active') ) {
                         // Verberg succesmodal alleen als hij niet actief is
                          m.style.display = 'none';
                     }
                }
             }, 300); // Match transitie duur
        });

        // Reset forms binnen de modals
        if(downloadModalForm) downloadModalForm.reset();
        if(downloadModalFormError) downloadModalFormError.style.display = 'none';
        if(aiCoachForm) aiCoachForm.reset();
        if(aiCoachFormError) aiCoachFormError.style.display = 'none';
        if(downloadEmailErrorHP) downloadEmailErrorHP.style.display = 'none'; // Reset ook initiele error

    };

    // Event listeners voor alle sluitknoppen (nu generieker)
    document.addEventListener('click', function(event){
        // Sluitknop binnen een modal?
        if(event.target.matches('.modal-close')) {
            closeAllModals();
        }
        // Klik op overlay?
        if(event.target.matches('.modal')) {
            closeAllModals();
        }
    });


}); // Einde DOMContentLoaded
