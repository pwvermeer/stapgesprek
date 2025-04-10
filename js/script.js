// js/script.js - VERSIE 3 (met Modal & Formspree)

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
    const modal = document.getElementById('download-modal');
    const openModalBtn = document.getElementById('open-download-modal-btn');
    const closeModalBtns = document.querySelectorAll('.modal-close');
    const emailInputHP = document.getElementById('email-download-hp');
    const emailErrorHP = document.getElementById('email-error-hp');
    const modalEmailDisplay = document.getElementById('modal-email-display');
    const modalEmailInput = document.getElementById('modal-email-input');
    const modalForm = document.getElementById('modal-download-form');
    const modalFormError = document.getElementById('modal-form-error');
    const successModal = document.getElementById('download-success');

    const openModal = () => { const emailValue = emailInputHP.value.trim(); if (emailValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) { emailErrorHP.style.display = 'none'; if (modalEmailDisplay) modalEmailDisplay.textContent = emailValue; if (modalEmailInput) modalEmailInput.value = emailValue; if (modal) modal.classList.add('modal-active'); } else { emailErrorHP.style.display = 'block'; emailInputHP.focus(); } };
    const closeAllModals = () => { if (modal) modal.classList.remove('modal-active'); if (successModal) successModal.style.display = 'none'; if(successModal) successModal.classList.remove('modal-active'); if(modalForm) modalForm.reset(); if(modalFormError) modalFormError.style.display = 'none'; };
    if (openModalBtn) { openModalBtn.addEventListener('click', openModal); }
    if (emailInputHP) { emailInputHP.addEventListener('keypress', function(event) { if (event.key === "Enter") { event.preventDefault(); openModalBtn.click(); } }); }
    closeModalBtns.forEach(btn => { btn.addEventListener('click', closeAllModals); });
    if (modal) { modal.addEventListener('click', function(event) { if (event.target === modal) { closeAllModals(); } }); }
    if (successModal) { successModal.addEventListener('click', function(event) { if (event.target === successModal) { closeAllModals(); } }); }

    // --- Formspree Formulier Verzenden ---
    if (modalForm) {
        modalForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const submitButton = modalForm.querySelector('button[type="submit"]'); const originalButtonText = submitButton.textContent; submitButton.disabled = true; submitButton.textContent = 'Bezig met verzenden...'; if(modalFormError) modalFormError.style.display = 'none';
            const formData = new FormData(modalForm); const formAction = modalForm.action;
            fetch(formAction, { method: "POST", body: formData, headers: { 'Accept': 'application/json' } })
            .then(response => {
                submitButton.disabled = false; submitButton.textContent = originalButtonText;
                if (response.ok) {
                    closeAllModals(); if(successModal) successModal.style.display = 'block'; if(successModal) successModal.classList.add('modal-active'); emailInputHP.value = '';
                } else {
                    response.json().then(data => {
                        if (modalFormError) { if (data.errors) { modalFormError.textContent = data.errors.map(error => error.message).join(", "); } else { modalFormError.textContent = "Er is iets misgegaan bij het verzenden. Probeer het opnieuw."; } modalFormError.style.display = 'block'; }
                        else { console.error("Form submission error, but no error display element found."); alert("Er is iets misgegaan bij het verzenden."); }
                    })
                }
            }).catch(error => {
                 submitButton.disabled = false; submitButton.textContent = originalButtonText;
                 if (modalFormError) { modalFormError.textContent = "Kon formulier niet verzenden. Controleer je internetverbinding."; modalFormError.style.display = 'block'; }
                 else { console.error('Form submission fetch error:', error); alert("Kon formulier niet verzenden."); }
            });
        });
    }

}); // Einde DOMContentLoaded
