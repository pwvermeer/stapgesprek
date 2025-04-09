document.addEventListener('DOMContentLoaded', function() {

    // Functie om HTML content te laden en in te voegen
    const loadHTML = (url, elementSelector) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                const element = document.querySelector(elementSelector);
                if (element) {
                    element.innerHTML = data;
                    // Voer eventuele scripts uit die specifiek zijn voor de header/footer
                    // Hier triggeren we opnieuw de menu-toggle setup voor de *geladen* header
                    if (elementSelector === 'header.site-header') {
                        setupMobileMenu();
                    }
                    // En update het jaar voor de *geladen* footer
                    if (elementSelector === 'footer.site-footer') {
                         updateFooterYear();
                    }
                } else {
                    console.error(`Element with selector "${elementSelector}" not found.`);
                }
            })
            .catch(error => {
                console.error(`Could not load HTML from ${url}:`, error);
            });
    };

    // Laad de header en footer
    loadHTML('_header.html', 'header.site-header');
    loadHTML('_footer.html', 'footer.site-footer');


    // Functie om mobiel menu op te zetten (wordt aangeroepen na laden header)
    const setupMobileMenu = () => {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('#primary-menu');

        if (menuToggle && navMenu) {
            // Verwijder eventuele oude listeners om dubbelen te voorkomen
            menuToggle.replaceWith(menuToggle.cloneNode(true));
            // Pak de nieuwe knop referentie
            const newMenuToggle = document.querySelector('.menu-toggle');

            newMenuToggle.addEventListener('click', function() {
                const isExpanded = newMenuToggle.getAttribute('aria-expanded') === 'true';
                newMenuToggle.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('nav-active');
            });
        }
    };

    // Functie om footer jaar te updaten (wordt aangeroepen na laden footer)
    const updateFooterYear = () => {
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    };

    // Initiële setup voor elementen die *niet* in header/footer staan
    // (Indien nodig, voeg hier andere JS toe die direct moet werken)

});
