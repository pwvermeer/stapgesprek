// js/script.js - AANGEPASTE VERSIE

document.addEventListener('DOMContentLoaded', function() {

    // Functie om HTML content te laden en in te voegen
    const loadHTML = (url, elementSelector) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    // Log de URL die de fout gaf
                    console.error(`Failed to fetch ${url}. Status: ${response.status}`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                const element = document.querySelector(elementSelector);
                if (element) {
                    element.innerHTML = data;
                    // Voeg een class toe om te laten zien dat content geladen is (voor CSS transitie)
                    element.classList.add('loaded'); 
                    
                    // Hier triggeren we opnieuw de menu-toggle setup voor de *geladen* header
                    if (elementSelector === 'header.site-header') {
                        setupMobileMenu();
                    }
                    // En update het jaar voor de *geladen* footer
                    if (elementSelector === 'footer.site-footer') {
                         updateFooterYear();
                    }
                } else {
                    console.error(`Target element with selector "${elementSelector}" not found in the main HTML.`);
                }
            })
            .catch(error => {
                // Log de URL die de fout gaf ook hier
                console.error(`Could not load or process HTML from ${url}:`, error);
            });
    };

    // Laad de header en footer met de NIEUWE bestandsnamen
    // VERVANG 'header-include.html' en 'footer-include.html' 
    // ALS JE ANDERE NAMEN HEBT GEKOZEN!
    loadHTML('header-include.html', 'header.site-header'); // <-- AANGEPAST!
    loadHTML('footer-include.html', 'footer.site-footer'); // <-- AANGEPAST!


    // Functie om mobiel menu op te zetten (wordt aangeroepen na laden header)
    const setupMobileMenu = () => {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('#primary-menu');

        if (menuToggle && navMenu) {
            // Verwijder eventuele oude listeners om dubbelen te voorkomen
            const newMenuToggle = menuToggle.cloneNode(true); // Kloon eerst
            menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle); // Vervang dan

            newMenuToggle.addEventListener('click', function() {
                const isExpanded = newMenuToggle.getAttribute('aria-expanded') === 'true';
                newMenuToggle.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('nav-active');
            });
        } else {
            // Log als knop/menu niet gevonden wordt in de geladen header
            if (!menuToggle) console.error("Menu toggle button (.menu-toggle) not found in loaded header.");
            if (!navMenu) console.error("Navigation menu (#primary-menu) not found in loaded header.");
        }
    };

    // Functie om footer jaar te updaten (wordt aangeroepen na laden footer)
    const updateFooterYear = () => {
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        } else {
             // Log als span niet gevonden wordt in de geladen footer
             console.error("Year span (#current-year) not found in loaded footer.");
        }
    };

    // Initiële setup voor elementen die *niet* in header/footer staan
    // (Indien nodig, voeg hier andere JS toe die direct moet werken)

});
