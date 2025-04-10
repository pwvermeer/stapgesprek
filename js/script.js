// js/script.js - BIJGEWERKTE VERSIE 2

document.addEventListener('DOMContentLoaded', function() {

    // --- Functie om HTML content te laden ---
    const loadHTML = (url, elementSelector) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    console.error(`Failed to fetch ${url}. Status: ${response.status}`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                const element = document.querySelector(elementSelector);
                if (element) {
                    element.innerHTML = data;
                    element.classList.add('loaded');

                    // Functies uitvoeren specifiek voor geladen content
                    if (elementSelector === 'header.site-header') {
                        // Zet menu *en* active link logic *nadat* header geladen is
                        setupMobileMenu();
                        setActiveNavLink(); 
                        setupMobileDropdown(); // Activeer mobiele dropdown
                    }
                    if (elementSelector === 'footer.site-footer') {
                        updateFooterYear();
                    }
                } else {
                    console.error(`Target element with selector "${elementSelector}" not found in the main HTML.`);
                }
            })
            .catch(error => {
                console.error(`Could not load or process HTML from ${url}:`, error);
            });
    };

    // --- Laad de header en footer ---
    // Gebruik de namen die je gekozen hebt (bv. header-include.html)
    loadHTML('header-include.html', 'header.site-header');
    loadHTML('footer-include.html', 'footer.site-footer');

    // --- Functie voor mobiel hoofdmenu toggle ---
    const setupMobileMenu = () => {
        // BELANGRIJK: Selecteer de knop *binnen* de geladen header
        const headerElement = document.querySelector('header.site-header');
        if (!headerElement) return; // Stop als header nog niet geladen is

        const menuToggle = headerElement.querySelector('.menu-toggle');
        // BELANGRIJK: Target het mobiele menu UL element
        const mobileNavMenu = headerElement.querySelector('#primary-mobile-menu'); 

        if (menuToggle && mobileNavMenu) {
            const newMenuToggle = menuToggle.cloneNode(true);
            menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);

            newMenuToggle.addEventListener('click', function() {
                const isExpanded = newMenuToggle.getAttribute('aria-expanded') === 'true';
                newMenuToggle.setAttribute('aria-expanded', !isExpanded);
                // Toggle de class op het UL element
                mobileNavMenu.classList.toggle('nav-active'); 
            });
        } else {
             if (!menuToggle) console.error("Mobile menu toggle button (.menu-toggle) not found after header load.");
             if (!mobileNavMenu) console.error("Mobile navigation menu (#primary-mobile-menu) not found after header load.");
        }
    };

    // --- Functie voor mobiele dropdown toggle ---
    const setupMobileDropdown = () => {
         const headerElement = document.querySelector('header.site-header');
         if (!headerElement) return;

         const dropdownTrigger = headerElement.querySelector('.dropdown-trigger-mobile');
         const dropdownMenu = headerElement.querySelector('.dropdown-menu-mobile');
         const parentLi = headerElement.querySelector('.has-dropdown-mobile'); // Selecteer parent LI

         if(dropdownTrigger && dropdownMenu && parentLi) {
            // Clone & replace om zeker te zijn dat listener werkt na innerHTML
            const newDropdownTrigger = dropdownTrigger.cloneNode(true);
            dropdownTrigger.parentNode.replaceChild(newDropdownTrigger, dropdownTrigger);

             newDropdownTrigger.addEventListener('click', function(event) {
                 event.preventDefault(); // Voorkom dat '#' link werkt
                 // Toggle een 'active' class op de parent LI
                 parentLi.classList.toggle('active'); 
                 
                 // Toggle display of max-height voor het menu
                 if (dropdownMenu.style.maxHeight && dropdownMenu.style.maxHeight !== '0px') {
                     dropdownMenu.style.maxHeight = '0px';
                 } else {
                     // Bereken hoogte of zet vaste max hoogte
                     dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + "px"; 
                 }
             });
         } else {
             if (!dropdownTrigger) console.error("Mobile dropdown trigger (.dropdown-trigger-mobile) not found.");
             if (!dropdownMenu) console.error("Mobile dropdown menu (.dropdown-menu-mobile) not found.");
             if (!parentLi) console.error("Mobile dropdown parent LI (.has-dropdown-mobile) not found.");
         }
    };


    // --- Functie voor footer jaar ---
    const updateFooterYear = () => {
        const footerElement = document.querySelector('footer.site-footer');
        if (!footerElement) return;
        const yearSpan = footerElement.querySelector('#current-year'); // Zoek binnen geladen footer
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        } else {
             console.error("Year span (#current-year) not found after footer load.");
        }
    };

    // --- Functie om actieve navigatielink te markeren ---
    const setActiveNavLink = () => {
        const headerElement = document.querySelector('header.site-header');
         if (!headerElement) return; // Wacht tot header geladen is

        const currentPath = window.location.pathname.split('/').pop(); // Krijg bestandsnaam (bv. index.html, voor-jou.html)
        // Behandel homepage geval apart (pad is '/' of 'index.html')
        const currentPage = (currentPath === '' || currentPath === 'index.html') ? 'index.html' : currentPath; 

        // Selecteer alle links in desktop en mobiele menu's
        const navLinks = headerElement.querySelectorAll('.nav-left a, .nav-right a, .nav-menu-mobile a');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
            const linkPage = (linkPath === '' || linkPath === 'index.html') ? 'index.html' : linkPath;
            
            // Verwijder eventuele bestaande active class
            link.classList.remove('active');
            link.parentElement.classList.remove('active'); // Ook van parent LI

            // Voeg active class toe bij match (check ook of het geen dropdown trigger is)
            if (linkPage === currentPage && !link.classList.contains('dropdown-trigger') && !link.classList.contains('dropdown-trigger-mobile') ) {
                 // Voeg class toe aan link EN parent LI voor meer styling opties
                 link.classList.add('active'); 
                 link.closest('li').classList.add('active'); 
            }
        });
    };

    // --- Initiële setup na laden van de hoofdpagina DOM (excl. header/footer) ---
    // Deze functies moeten mogelijk *ook* binnen loadHTML worden aangeroepen als ze
    // afhankelijk zijn van elementen *binnen* de header/footer.
    // setActiveNavLink(); // Verplaatst naar binnen loadHTML callback

});
