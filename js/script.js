// js/script.js - BIJGEWERKTE VERSIE 9 (Vereenvoudigde Mobile Dropdown)

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
                    if (elementSelector === 'header.site-header') {
                        // console.log('Header HTML loaded. Setting up menus and links...');
                        setupMobileMenu();
                        setActiveNavLink();
                        setupMobileDropdown(); // Zet mobiele dropdown op na laden header
                    }
                    if (elementSelector === 'footer.site-footer') {
                        updateFooterYear();
                    }
                } else { console.error(`Target element "${elementSelector}" not found.`); }
            })
            .catch(error => { console.error(`Could not load/process HTML from ${url}:`, error); });
    };

    // --- Laad de header en footer ---
    loadHTML('header-include.html', 'header.site-header');
    loadHTML('footer-include.html', 'footer.site-footer');

    // --- Functies voor Header (Mobile Menu, Dropdown, Active Link, Footer Year) ---
    const setupMobileMenu = () => { const headerElement = document.querySelector('header.site-header'); if (!headerElement) return; const menuToggle = headerElement.querySelector('.menu-toggle'); const mobileNavContainer = headerElement.querySelector('.mobile-navigation'); if (!menuToggle || !mobileNavContainer) { console.error('Mobile menu toggle or container not found'); return; } if (!menuToggle.hasAttribute('data-listener-added')) { menuToggle.addEventListener('click', function() { const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true'; menuToggle.setAttribute('aria-expanded', !isExpanded); mobileNavContainer.classList.toggle('nav-active'); }); menuToggle.setAttribute('data-listener-added', 'true'); } };
    const updateFooterYear = () => { const footerElement = document.querySelector('footer.site-footer'); if (!footerElement) return; const yearSpan = footerElement.querySelector('#current-year'); if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); } };
    const setActiveNavLink = () => { const headerElement = document.querySelector('header.site-header'); if (!headerElement) return; const currentPath = window.location.pathname.split('/').pop(); const currentPage = (currentPath === '' || currentPath === 'index.html') ? 'index.html' : currentPath; const navLinks = headerElement.querySelectorAll('.nav-left a, .nav-right a, .nav-menu-mobile a'); navLinks.forEach(link => { const linkPath = link.getAttribute('href').split('/').pop(); const linkPage = (linkPath === '' || linkPath === 'index.html') ? 'index.html' : linkPath; link.classList.remove('active'); if(link.parentElement) link.parentElement.classList.remove('active'); if (linkPage === currentPage && !link.classList.contains('dropdown-trigger') && !link.classList.contains('dropdown-trigger-mobile') ) { link.classList.add('active'); if(link.closest('li')) link.closest('li').classList.add('active'); } }); };

    // --- Functie voor mobiele dropdown toggle (VEREENVOUDIGD) ---
    const setupMobileDropdown = () => {
         const headerElement = document.querySelector('header.site-header');
         if (!headerElement) return;
         const mobileNavContainer = headerElement.querySelector('.mobile-navigation');
         if (!mobileNavContainer) return;

         // Zoek alle mobiele dropdown triggers binnen de mobiele navigatie
         const dropdownTriggers = mobileNavContainer.querySelectorAll('.dropdown-trigger-mobile');

         dropdownTriggers.forEach(trigger => {
             const parentLi = trigger.closest('.has-dropdown-mobile'); // Vind de parent LI
             if (parentLi && !trigger.hasAttribute('data-listener-added')) {
                console.log("Adding click listener to mobile dropdown trigger:", trigger); // DEBUG
                 trigger.addEventListener('click', function(event) {
                     event.preventDefault();
                     console.log("Mobile dropdown trigger CLICKED!"); // DEBUG
                     parentLi.classList.toggle('active'); // Toggle class op LI
                     console.log(`Toggled 'active' class on LI. Has class now?`, parentLi.classList.contains('active')); // DEBUG
                 });
                 trigger.setAttribute('data-listener-added', 'true');
             }
         });
    };


    // --- Download Modal Functionaliteit ---
    // ... (Blijft hetzelfde als V5) ...
    const downloadModal = document.getElementById('download-modal'); const openDownloadModalBtn = document.getElementById('open-download-modal-btn'); const downloadEmailInputHP = document.getElementById('email-download-hp'); const downloadEmailErrorHP = document.getElementById('email-error-hp'); const downloadModalEmailDisplay = document.getElementById('modal-email-display'); const downloadModalEmailInput = document.getElementById('modal-email-input'); const downloadModalForm = document.getElementById('modal-download-form'); const downloadModalFormError = document.getElementById('modal-form-error'); const downloadSuccessModal = document.getElementById('download-success'); const openDownloadModal = () => { const emailValue = downloadEmailInputHP.value.trim(); if (emailValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) { downloadEmailErrorHP.style.display = 'none'; if (downloadModalEmailDisplay) downloadModalEmailDisplay.textContent = emailValue; if (downloadModalEmailInput) downloadModalEmailInput.value = emailValue; if (downloadModal) downloadModal.classList.add('modal-active'); } else { downloadEmailErrorHP.style.display = 'block'; downloadEmailInputHP.focus(); } }; if (openDownloadModalBtn) { openDownloadModalBtn.addEventListener('click', openDownloadModal); } if (downloadEmailInputHP) { downloadEmailInputHP.addEventListener('keypress', function(event) { if (event.key === "Enter") { event.preventDefault(); openDownloadModalBtn.click(); } }); } if (downloadModalForm) { downloadModalForm.addEventListener("submit", function(event) { event.preventDefault(); const submitButton = downloadModalForm.querySelector('button[type="submit"]'); const originalButtonText = submitButton.textContent; submitButton.disabled = true; submitButton.textContent = 'Bezig met verzenden...'; if(downloadModalFormError) downloadModalFormError.style.display = 'none'; const formData = new FormData(downloadModalForm); const formAction = downloadModalForm.action; fetch(formAction, { method: "POST", body: formData, headers: { 'Accept': 'application/json' } }).then(response => { submitButton.disabled = false; submitButton.textContent = originalButtonText; if (response.ok) { closeAllModals(); if(downloadSuccessModal) downloadSuccessModal.style.display = 'block'; if(downloadSuccessModal) downloadSuccessModal.classList.add('modal-active'); downloadEmailInputHP.value = ''; } else { response.json().then(data => { if (downloadModalFormError) { if (data.errors) { downloadModalFormError.textContent = data.errors.map(error => error.message).join(", "); } else { downloadModalFormError.textContent = "Er is iets misgegaan bij het verzenden. Probeer het opnieuw."; } downloadModalFormError.style.display = 'block'; } else { console.error("Form submission error (Download Modal)"); alert("Er is iets misgegaan."); }}) } }).catch(error => { submitButton.disabled = false; submitButton.textContent = originalButtonText; if (downloadModalFormError) { downloadModalFormError.textContent = "Kon formulier niet verzenden. Controleer je internetverbinding."; downloadModalFormError.style.display = 'block'; } else { console.error('Form submission fetch error:', error); alert("Kon formulier niet verzenden."); } }); }); }

    // --- AI Coach Modal Functionaliteit ---
    // ... (Blijft hetzelfde als V5) ...
    const aiCoachModal = document.getElementById('ai-coach-modal'); const openAICoachModalBtn = document.getElementById('open-ai-coach-modal-btn'); const aiCoachEmailInput = document.getElementById('ai-email'); const aiCoachForm = document.getElementById('ai-coach-form'); const aiCoachFormError = document.getElementById('ai-coach-form-error'); const aiCoachSuccessModal = document.getElementById('ai-coach-success'); const openAICoachModal = () => { if(aiCoachForm) aiCoachForm.reset(); if(aiCoachFormError) aiCoachFormError.style.display = 'none'; if(aiCoachModal) aiCoachModal.classList.add('modal-active'); }; if (openAICoachModalBtn) { openAICoachModalBtn.addEventListener('click', openAICoachModal); } if (aiCoachForm) { aiCoachForm.addEventListener("submit", function(event) { event.preventDefault(); if (!aiCoachEmailInput || !aiCoachEmailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(aiCoachEmailInput.value.trim())) { if(aiCoachFormError) { aiCoachFormError.textContent = "Voer een geldig e-mailadres in."; aiCoachFormError.style.display = 'block'; } if(aiCoachEmailInput) aiCoachEmailInput.focus(); return; } const submitButton = aiCoachForm.querySelector('button[type="submit"]'); const originalButtonText = submitButton.textContent; submitButton.disabled = true; submitButton.textContent = 'Bezig met verzenden...'; if(aiCoachFormError) aiCoachFormError.style.display = 'none'; const formData = new FormData(aiCoachForm); const formAction = aiCoachForm.action; fetch(formAction, { method: "POST", body: formData, headers: { 'Accept': 'application/json' } }).then(response => { submitButton.disabled = false; submitButton.textContent = originalButtonText; if (response.ok) { closeAllModals(); if(aiCoachSuccessModal) aiCoachSuccessModal.style.display = 'block'; if(aiCoachSuccessModal) aiCoachSuccessModal.classList.add('modal-active'); } else { response.json().then(data => { if (aiCoachFormError) { if (data.errors) { aiCoachFormError.textContent = data.errors.map(error => error.message).join(", "); } else { aiCoachFormError.textContent = "Er is iets misgegaan bij het verzenden. Probeer het opnieuw."; } aiCoachFormError.style.display = 'block'; } else { console.error("Form submission error (AI Coach Modal)"); alert("Er is iets misgegaan."); }}) } }).catch(error => { submitButton.disabled = false; submitButton.textContent = originalButtonText; if (aiCoachFormError) { aiCoachFormError.textContent = "Kon formulier niet verzenden. Controleer je internetverbinding."; aiCoachFormError.style.display = 'block'; } else { console.error('Form submission fetch error:', error); alert("Kon formulier niet verzenden."); } }); }); }

    // --- Algemene Modal Sluit Functie ---
    const closeModalBtns = document.querySelectorAll('.modal-close');
    const closeAllModals = () => { const allModals = document.querySelectorAll('.modal'); allModals.forEach(m => { m.classList.remove('modal-active'); setTimeout(() => { if (!m.classList.contains('modal-active')) { m.style.display = 'none'; } }, 300); }); if(downloadModalForm) downloadModalForm.reset(); if(downloadModalFormError) downloadModalFormError.style.display = 'none'; if(aiCoachForm) aiCoachForm.reset(); if(aiCoachFormError) aiCoachFormError.style.display = 'none'; if(downloadEmailErrorHP) downloadEmailErrorHP.style.display = 'none'; };
    document.addEventListener('click', function(event){ if(event.target.matches('.modal-close')) { closeAllModals(); } if(event.target.matches('.modal')) { closeAllModals(); } });

}); // Einde DOMContentLoaded
