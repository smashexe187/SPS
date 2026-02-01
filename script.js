/* ========================================
   SHOPGUIDE - HAUPTLOGIK
   ========================================
   Diese Datei steuert alle interaktiven Funktionen
   der ShopGuide-Website:
   - Seitennavigation mit Active-Link-Highlighting
   - Scroll Progress Indicator
   - Back-to-Top Button
   - Smooth Page Transitions
   - Copy-to-Clipboard Funktionalität
   - Dark Mode mit Icon-Swap
   - Verifizierung (Kunden/Händler)
   - App-Demo
   - ROI-Rechner
======================================== */

"use strict";

/* ========================================
   1. SEITEN-NAVIGATION MIT ACTIVE-LINK
   ======================================== */

/**
 * Wechselt zwischen verschiedenen Seiten der Single-Page-Application
 * @param {string} pageId - Die ID der anzuzeigenden Seite
 */
function showPage(pageId) {
    // Alle vorhandenen Seiten finden
    const pages = document.querySelectorAll('.page');
    
    // Fade-out Animation für aktuelle Seite
    const currentPage = document.querySelector('.page.active');
    if (currentPage) {
        currentPage.style.opacity = '0';
        
        setTimeout(() => {
            // Alle Seiten ausblenden
            pages.forEach(page => {
                page.classList.remove('active');
                page.style.opacity = '1';
            });

            // Die gewünschte Zielseite einblenden
            const targetPage = document.getElementById(pageId);
            
            if (targetPage) {
                targetPage.classList.add('active');
                targetPage.classList.add('fade-in');
                
                // Nach Animation fade-in class entfernen
                setTimeout(() => {
                    targetPage.classList.remove('fade-in');
                }, 500);
                
                window.scrollTo(0, 0);
                
                // Active-Link Highlighting aktualisieren
                updateActiveNavLink(pageId);
            }
        }, 150);
    } else {
        // Erste Seite, keine Animation nötig
        pages.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            updateActiveNavLink(pageId);
        }
    }
}

/**
 * Aktualisiert die active class für Navigation Links
 * @param {string} pageId - Die ID der aktuellen Seite
 */
function updateActiveNavLink(pageId) {
    // Alle Nav-Links in der normalen Navigation
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) {
            link.classList.add('active');
        }
    });
    
    // Alle Nav-Links im Settings Panel
    document.querySelectorAll('.panel-nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) {
            link.classList.add('active');
        }
    });
}

/* ========================================
   2. SCROLL PROGRESS INDICATOR
   ======================================== */

/**
 * Aktualisiert die Breite der Scroll-Progress-Bar
 */
function updateScrollProgress() {
    const scrollProgress = document.getElementById('scroll-progress');
    if (!scrollProgress) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    const scrollPercentage = (scrollTop / documentHeight) * 100;
    scrollProgress.style.width = scrollPercentage + '%';
}

/* ========================================
   3. BACK TO TOP BUTTON
   ======================================== */

/**
 * Zeigt/Versteckt den Back-to-Top Button basierend auf Scroll-Position
 */
function updateBackToTopButton() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

/**
 * Scrollt smooth zum Seitenanfang
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/* ========================================
   4. COPY TO CLIPBOARD
   ======================================== */

/**
 * Kopiert Text in die Zwischenablage und zeigt Toast-Notification
 * @param {string} text - Der zu kopierende Text
 * @param {string} type - Der Typ (email oder phone) für die Nachricht
 */
function copyToClipboard(text, type) {
    // Moderne Clipboard API verwenden
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyToast(type);
        }).catch(err => {
            console.error('Fehler beim Kopieren:', err);
            // Fallback für ältere Browser
            fallbackCopyToClipboard(text, type);
        });
    } else {
        // Fallback für ältere Browser
        fallbackCopyToClipboard(text, type);
    }
}

/**
 * Fallback-Methode zum Kopieren für ältere Browser
 */
function fallbackCopyToClipboard(text, type) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyToast(type);
    } catch (err) {
        console.error('Fallback: Fehler beim Kopieren', err);
    }
    
    document.body.removeChild(textArea);
}

/**
 * Zeigt eine Toast-Notification für erfolgreiche Kopieraktion
 * @param {string} type - Der Typ der kopierten Information
 */
function showCopyToast(type) {
    const toast = document.getElementById('copy-toast');
    const message = document.getElementById('toast-message');
    
    if (!toast || !message) return;
    
    const messages = {
        email: '✉️ E-Mail kopiert!',
        phone: '📱 Telefonnummer kopiert!'
    };
    
    message.textContent = messages[type] || '✅ Kopiert!';
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/* ========================================
   5. CHECKBOX-VALIDIERUNG
   ======================================== */

/**
 * Event-Listener der ausgeführt wird, sobald das DOM vollständig geladen ist
 * Initialisiert alle Features
 */
document.addEventListener('DOMContentLoaded', () => {
    
    /* --- SCROLL EVENTS --- */
    window.addEventListener('scroll', () => {
        updateScrollProgress();
        updateBackToTopButton();
    });
    
    // Initial ausführen
    updateScrollProgress();
    updateBackToTopButton();
    
    /* --- KUNDEN-BEREICH --- */
    const custCheck = document.getElementById('customer-confirm');
    const custBtn = document.getElementById('customer-proceed');
    
    if(custCheck && custBtn) {
        custCheck.addEventListener('change', function() {
            if (this.checked) {
                custBtn.disabled = false;
                custBtn.style.opacity = '1';
                custBtn.style.cursor = 'pointer';
            } else {
                custBtn.disabled = true;
                custBtn.style.opacity = '0.5';
                custBtn.style.cursor = 'not-allowed';
            }
        });
    }

    /* --- HÄNDLER-BEREICH --- */
    const merchCheck = document.getElementById('merchant-confirm');
    const merchBtn = document.getElementById('merchant-proceed');

    if(merchCheck && merchBtn) {
        merchCheck.addEventListener('change', function() {
            if (this.checked) {
                merchBtn.disabled = false;
                merchBtn.style.opacity = '1';
                merchBtn.style.cursor = 'pointer';
            } else {
                merchBtn.disabled = true;
                merchBtn.style.opacity = '0.5';
                merchBtn.style.cursor = 'not-allowed';
            }
        });
    }
    
    /* --- ACTIVE LINK INITIAL SETZEN --- */
    updateActiveNavLink('homepage');
});

/* ========================================
   6. KUNDEN APP-DEMO
   ======================================== */

/**
 * Erstellt einen neuen zufälligen Einkaufszettel
 */
function erstelleEinkaufszettel() {
    const anzahl = Math.floor(Math.random() * 6) + 3;
    const produkte = getZufaelligeProdukte(anzahl);
    window.aktuelleProdukte = produkte;
    
    const demoNote = document.getElementById('demo-note');
    let zettelHTML = '';
    produkte.forEach(produkt => {
        zettelHTML += `- ${produkt.name}<br>`;
    });
    demoNote.innerHTML = zettelHTML;
    
    document.getElementById('customer-screen-start').style.display = 'none';
    document.getElementById('customer-screen-note').style.display = 'flex';
}

/**
 * Scannt den Zettel (mit Animation)
 */
function runCustomerDemo() {
    const scanner = document.getElementById('customer-scanner');
    const scanBtn = document.getElementById('scan-btn');
    const noteScreen = document.getElementById('customer-screen-note');
    const resultScreen = document.getElementById('customer-screen-result');

    scanner.style.display = 'block';
    scanBtn.innerText = 'Scanne...';
    scanBtn.disabled = true;

    setTimeout(() => {
        scanner.style.display = 'none';
        noteScreen.style.display = 'none';
        generiereRouteVonProdukten(window.aktuelleProdukte);
        resultScreen.style.display = 'flex';
    }, 2000);
}

/**
 * Erstellt die Route aus den Produkten
 */
function generiereRouteVonProdukten(produkte) {
    const zeit = berechneEinkaufszeit(produkte.length);
    const routeContainer = document.getElementById('route-items-container');
    const zeitAnzeige = document.getElementById('route-zeit');
    
    if (zeitAnzeige) zeitAnzeige.textContent = `${zeit} Min`;
    
    if (routeContainer) {
        let routeHTML = '';
        produkte.forEach(produkt => {
            routeHTML += `
                <div class="route-item">
                    <span>${produkt.emoji} ${produkt.name}</span>
                    <span class="coordinate">${produkt.gang}-${produkt.regal}</span>
                </div>
            `;
        });
        routeContainer.innerHTML = routeHTML;
    }
}

/**
 * Zurück zum Start
 */
function resetCompleteDemo() {
    document.getElementById('customer-screen-start').style.display = 'flex';
    document.getElementById('customer-screen-note').style.display = 'none';
    document.getElementById('customer-screen-result').style.display = 'none';
    
    const scanBtn = document.getElementById('scan-btn');
    if (scanBtn) {
        scanBtn.innerText = 'Zettel scannen';
        scanBtn.disabled = false;
    }
    window.aktuelleProdukte = null;
}

function resetCustomerDemo() {
    resetCompleteDemo();
}

/**
 * Setzt die Demo zurück
 */
function resetCustomerDemo() {
    document.getElementById('customer-screen-scan').style.display = 'flex';
    document.getElementById('customer-screen-result').style.display = 'none';
    
    const scanBtn = document.getElementById('scan-btn');
    scanBtn.innerText = 'Zettel scannen';
    scanBtn.disabled = false;
}
/* ========================================
   PRODUKTDATENBANK FÜR CUSTOMER DEMO
   Diese Sektion NACH Zeile 305 in script.js einfügen
   ======================================== */

/**
 * Große Produktdatenbank mit über 100 Artikeln
 * Jedes Produkt hat: name, emoji, kategorie, gang, regal
 */
const PRODUKTE_DATENBANK = [
    // Obst & Gemüse
    { name: "Tomaten", emoji: "🍅", kategorie: "Obst & Gemüse", gang: "A", regal: "02" },
    { name: "Gurken", emoji: "🥒", kategorie: "Obst & Gemüse", gang: "A", regal: "03" },
    { name: "Paprika", emoji: "🫑", kategorie: "Obst & Gemüse", gang: "A", regal: "04" },
    { name: "Karotten", emoji: "🥕", kategorie: "Obst & Gemüse", gang: "A", regal: "05" },
    { name: "Brokkoli", emoji: "🥦", kategorie: "Obst & Gemüse", gang: "A", regal: "06" },
    { name: "Salat", emoji: "🥬", kategorie: "Obst & Gemüse", gang: "A", regal: "07" },
    { name: "Zwiebeln", emoji: "🧅", kategorie: "Obst & Gemüse", gang: "A", regal: "08" },
    { name: "Knoblauch", emoji: "🧄", kategorie: "Obst & Gemüse", gang: "A", regal: "09" },
    { name: "Kartoffeln", emoji: "🥔", kategorie: "Obst & Gemüse", gang: "A", regal: "10" },
    { name: "Äpfel", emoji: "🍎", kategorie: "Obst & Gemüse", gang: "A", regal: "11" },
    { name: "Bananen", emoji: "🍌", kategorie: "Obst & Gemüse", gang: "A", regal: "12" },
    { name: "Orangen", emoji: "🍊", kategorie: "Obst & Gemüse", gang: "A", regal: "13" },
    { name: "Erdbeeren", emoji: "🍓", kategorie: "Obst & Gemüse", gang: "A", regal: "14" },
    { name: "Trauben", emoji: "🍇", kategorie: "Obst & Gemüse", gang: "A", regal: "15" },
    { name: "Wassermelone", emoji: "🍉", kategorie: "Obst & Gemüse", gang: "A", regal: "16" },
    { name: "Ananas", emoji: "🍍", kategorie: "Obst & Gemüse", gang: "A", regal: "17" },
    { name: "Mango", emoji: "🥭", kategorie: "Obst & Gemüse", gang: "A", regal: "18" },
    { name: "Avocado", emoji: "🥑", kategorie: "Obst & Gemüse", gang: "A", regal: "19" },
    { name: "Zitronen", emoji: "🍋", kategorie: "Obst & Gemüse", gang: "A", regal: "20" },
    
    // Drogerie & Hygiene
    { name: "Zahnpasta", emoji: "🦷", kategorie: "Drogerie", gang: "B", regal: "01" },
    { name: "Shampoo", emoji: "🧴", kategorie: "Drogerie", gang: "B", regal: "02" },
    { name: "Duschgel", emoji: "🧼", kategorie: "Drogerie", gang: "B", regal: "03" },
    { name: "Seife", emoji: "🧼", kategorie: "Drogerie", gang: "B", regal: "04" },
    { name: "Toilettenpapier", emoji: "🧻", kategorie: "Drogerie", gang: "B", regal: "05" },
    { name: "Taschentücher", emoji: "🤧", kategorie: "Drogerie", gang: "B", regal: "06" },
    { name: "Deo", emoji: "💨", kategorie: "Drogerie", gang: "B", regal: "07" },
    { name: "Rasierer", emoji: "🪒", kategorie: "Drogerie", gang: "B", regal: "08" },
    { name: "Creme", emoji: "🧴", kategorie: "Drogerie", gang: "B", regal: "09" },
    { name: "Waschmittel", emoji: "🧺", kategorie: "Drogerie", gang: "B", regal: "10" },
    { name: "Putzmittel", emoji: "🧽", kategorie: "Drogerie", gang: "B", regal: "11" },
    { name: "Spülmittel", emoji: "🫧", kategorie: "Drogerie", gang: "B", regal: "12" },
    { name: "Windeln", emoji: "👶", kategorie: "Drogerie", gang: "B", regal: "13" },
    { name: "Zahnbürste", emoji: "🪥", kategorie: "Drogerie", gang: "B", regal: "14" },
    
    // Milchprodukte & Eier
    { name: "Milch", emoji: "🥛", kategorie: "Kühlware", gang: "C", regal: "01" },
    { name: "Eier", emoji: "🥚", kategorie: "Kühlware", gang: "C", regal: "02" },
    { name: "Butter", emoji: "🧈", kategorie: "Kühlware", gang: "C", regal: "03" },
    { name: "Käse", emoji: "🧀", kategorie: "Kühlware", gang: "C", regal: "04" },
    { name: "Joghurt", emoji: "🥛", kategorie: "Kühlware", gang: "C", regal: "05" },
    { name: "Quark", emoji: "🥛", kategorie: "Kühlware", gang: "C", regal: "06" },
    { name: "Sahne", emoji: "🥛", kategorie: "Kühlware", gang: "C", regal: "07" },
    { name: "Frischkäse", emoji: "🧀", kategorie: "Kühlware", gang: "C", regal: "08" },
    { name: "Mozzarella", emoji: "🧀", kategorie: "Kühlware", gang: "C", regal: "09" },
    
    // Fleisch & Wurst
    { name: "Hähnchen", emoji: "🍗", kategorie: "Fleisch", gang: "D", regal: "01" },
    { name: "Hackfleisch", emoji: "🍖", kategorie: "Fleisch", gang: "D", regal: "02" },
    { name: "Würstchen", emoji: "🌭", kategorie: "Fleisch", gang: "D", regal: "03" },
    { name: "Salami", emoji: "🥓", kategorie: "Fleisch", gang: "D", regal: "04" },
    { name: "Schinken", emoji: "🥓", kategorie: "Fleisch", gang: "D", regal: "05" },
    { name: "Steak", emoji: "🥩", kategorie: "Fleisch", gang: "D", regal: "06" },
    { name: "Bacon", emoji: "🥓", kategorie: "Fleisch", gang: "D", regal: "07" },
    
    // Brot & Backwaren
    { name: "Brot", emoji: "🍞", kategorie: "Backwaren", gang: "E", regal: "01" },
    { name: "Brötchen", emoji: "🥖", kategorie: "Backwaren", gang: "E", regal: "02" },
    { name: "Toast", emoji: "🍞", kategorie: "Backwaren", gang: "E", regal: "03" },
    { name: "Croissant", emoji: "🥐", kategorie: "Backwaren", gang: "E", regal: "04" },
    { name: "Kuchen", emoji: "🍰", kategorie: "Backwaren", gang: "E", regal: "05" },
    { name: "Bagel", emoji: "🥯", kategorie: "Backwaren", gang: "E", regal: "06" },
    
    // Getränke
    { name: "Wasser", emoji: "💧", kategorie: "Getränke", gang: "F", regal: "01" },
    { name: "Cola", emoji: "🥤", kategorie: "Getränke", gang: "F", regal: "02" },
    { name: "Saft", emoji: "🧃", kategorie: "Getränke", gang: "F", regal: "03" },
    { name: "Bier", emoji: "🍺", kategorie: "Getränke", gang: "F", regal: "04" },
    { name: "Wein", emoji: "🍷", kategorie: "Getränke", gang: "F", regal: "05" },
    { name: "Kaffee", emoji: "☕", kategorie: "Getränke", gang: "F", regal: "06" },
    { name: "Tee", emoji: "🍵", kategorie: "Getränke", gang: "F", regal: "07" },
    { name: "Energy Drink", emoji: "🥤", kategorie: "Getränke", gang: "F", regal: "08" },
    { name: "Limonade", emoji: "🥤", kategorie: "Getränke", gang: "F", regal: "09" },
    { name: "Smoothie", emoji: "🥤", kategorie: "Getränke", gang: "F", regal: "10" },
    
    // Süßigkeiten & Snacks
    { name: "Schokolade", emoji: "🍫", kategorie: "Süßwaren", gang: "G", regal: "01" },
    { name: "Chips", emoji: "🍿", kategorie: "Süßwaren", gang: "G", regal: "02" },
    { name: "Gummibärchen", emoji: "🍬", kategorie: "Süßwaren", gang: "G", regal: "03" },
    { name: "Kekse", emoji: "🍪", kategorie: "Süßwaren", gang: "G", regal: "04" },
    { name: "Bonbons", emoji: "🍭", kategorie: "Süßwaren", gang: "G", regal: "05" },
    { name: "Eis", emoji: "🍦", kategorie: "Süßwaren", gang: "G", regal: "06" },
    { name: "Popcorn", emoji: "🍿", kategorie: "Süßwaren", gang: "G", regal: "07" },
    { name: "Nüsse", emoji: "🥜", kategorie: "Süßwaren", gang: "G", regal: "08" },
    { name: "Müsliriegel", emoji: "🍫", kategorie: "Süßwaren", gang: "G", regal: "09" },
    
    // Tiefkühl
    { name: "Pizza", emoji: "🍕", kategorie: "Tiefkühl", gang: "H", regal: "01" },
    { name: "Pommes", emoji: "🍟", kategorie: "Tiefkühl", gang: "H", regal: "02" },
    { name: "Fischstäbchen", emoji: "🐟", kategorie: "Tiefkühl", gang: "H", regal: "03" },
    { name: "Gemüsemix", emoji: "🥦", kategorie: "Tiefkühl", gang: "H", regal: "04" },
    { name: "Erbsen", emoji: "🫛", kategorie: "Tiefkühl", gang: "H", regal: "05" },
    
    // Konserven & Vorräte
    { name: "Nudeln", emoji: "🍝", kategorie: "Vorräte", gang: "I", regal: "01" },
    { name: "Reis", emoji: "🍚", kategorie: "Vorräte", gang: "I", regal: "02" },
    { name: "Mehl", emoji: "🌾", kategorie: "Vorräte", gang: "I", regal: "03" },
    { name: "Zucker", emoji: "🍬", kategorie: "Vorräte", gang: "I", regal: "04" },
    { name: "Salz", emoji: "🧂", kategorie: "Vorräte", gang: "I", regal: "05" },
    { name: "Pfeffer", emoji: "🌶️", kategorie: "Vorräte", gang: "I", regal: "06" },
    { name: "Olivenöl", emoji: "🫒", kategorie: "Vorräte", gang: "I", regal: "07" },
    { name: "Essig", emoji: "🧪", kategorie: "Vorräte", gang: "I", regal: "08" },
    { name: "Tomatenmark", emoji: "🍅", kategorie: "Vorräte", gang: "I", regal: "09" },
    { name: "Ketchup", emoji: "🍅", kategorie: "Vorräte", gang: "I", regal: "10" },
    { name: "Senf", emoji: "🌭", kategorie: "Vorräte", gang: "I", regal: "11" },
    { name: "Mayo", emoji: "🥚", kategorie: "Vorräte", gang: "I", regal: "12" },
    { name: "Honig", emoji: "🍯", kategorie: "Vorräte", gang: "I", regal: "13" },
    { name: "Marmelade", emoji: "🍓", kategorie: "Vorräte", gang: "I", regal: "14" },
    { name: "Nutella", emoji: "🍫", kategorie: "Vorräte", gang: "I", regal: "15" },
    { name: "Dosentomaten", emoji: "🥫", kategorie: "Vorräte", gang: "I", regal: "16" },
    { name: "Bohnen", emoji: "🥫", kategorie: "Vorräte", gang: "I", regal: "17" },
    { name: "Thunfisch", emoji: "🐟", kategorie: "Vorräte", gang: "I", regal: "18" },
    { name: "Mais", emoji: "🌽", kategorie: "Vorräte", gang: "I", regal: "19" },
    
    // Fertiggerichte
    { name: "Suppe", emoji: "🍲", kategorie: "Fertiggerichte", gang: "J", regal: "01" },
    { name: "Ravioli", emoji: "🥫", kategorie: "Fertiggerichte", gang: "J", regal: "02" },
    { name: "Instant Nudeln", emoji: "🍜", kategorie: "Fertiggerichte", gang: "J", regal: "03" },
];

/**
 * Wählt zufällige Produkte aus der Datenbank
 * @param {number} anzahl - Wie viele Produkte sollen ausgewählt werden
 * @returns {Array} - Array mit zufälligen Produkten
 */
function getZufaelligeProdukte(anzahl = 5) {
    const verfuegbar = [...PRODUKTE_DATENBANK];
    const ausgewaehlte = [];
    
    for (let i = 0; i < anzahl && verfuegbar.length > 0; i++) {
        const zufallsIndex = Math.floor(Math.random() * verfuegbar.length);
        ausgewaehlte.push(verfuegbar[zufallsIndex]);
        verfuegbar.splice(zufallsIndex, 1);
    }
    
    return ausgewaehlte;
}

/**
 * Berechnet die Einkaufszeit basierend auf Anzahl der Produkte
 * @param {number} anzahl - Anzahl der Produkte
 * @returns {number} - Geschätzte Zeit in Minuten
 */
function berechneEinkaufszeit(anzahl) {
    return Math.ceil((anzahl * 0.5) + 1);
}

/**
 * Generiert eine neue zufällige Route mit Produkten
 */
function generiereZufaelligeRoute() {
    const anzahl = Math.floor(Math.random() * 6) + 3;
    const produkte = getZufaelligeProdukte(anzahl);
    const zeit = berechneEinkaufszeit(anzahl);
    
    const routeContainer = document.getElementById('route-items-container');
    const zeitAnzeige = document.getElementById('route-zeit');
    
    if (zeitAnzeige) {
        zeitAnzeige.textContent = `${zeit} Min`;
    }
    
    if (routeContainer) {
        let routeHTML = '';
        produkte.forEach(produkt => {
            routeHTML += `
                <div class="route-item">
                    <span>${produkt.emoji} ${produkt.name}</span>
                    <span class="coordinate">${produkt.gang}-${produkt.regal}</span>
                </div>
            `;
        });
        routeContainer.innerHTML = routeHTML;
    }
}

/* ========================================
   7. HÄNDLER ROI-RECHNER
   ======================================== */

/**
 * Berechnet das Einsparpotenzial für Händler
 */
function calculateROI() {
    const customers = parseFloat(document.getElementById('customerCount').value) || 0;
    const questions = parseFloat(document.getElementById('questionsCount').value) || 0;
    const wage = parseFloat(document.getElementById('hourlyWage').value) || 0;

    const hoursSavedPerDay = (questions * 2) / 60;
    const hoursSavedPerMonth = hoursSavedPerDay * 25;
    const moneySavedPerMonth = hoursSavedPerMonth * wage;

    document.getElementById('timeSaved').innerText = Math.round(hoursSavedPerMonth) + " Std.";
    document.getElementById('moneySaved').innerText = Math.round(moneySavedPerMonth).toLocaleString('de-DE') + " €";
    
    const resultBox = document.getElementById('calc-result');
    resultBox.style.display = 'block';
    
    // Smooth scroll zum Ergebnis
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ========================================
   8. HÄNDLER-KONTAKT FUNKTIONEN
   ======================================== */

/**
 * Öffnet Email-Client für Beratungsgespräch-Anfrage
 */
function bookConsultation() {
    const email = "lerkjannik@gmail.com";
    const subject = "Anfrage: Kostenloses Beratungsgespräch";
    const body = `Guten Tag,

ich interessiere mich für ein kostenloses 30-minütiges Beratungsgespräch zu ShopGuide.

Bitte kontaktieren Sie mich für einen Terminvorschlag.

Meine Kontaktdaten:
Name: 
Unternehmen: 
Telefon: 
Bevorzugte Kontaktzeit: 

Mit freundlichen Grüßen`;

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Öffnet Email-Client für Pilot-Programm-Bewerbung
 */
function applyPilot() {
    const email = "lerkjannik@gmail.com";
    const subject = "Bewerbung: 4-Wochen Pilot-Programm";
    const body = `Guten Tag,

ich möchte mich für das 4-wöchige kostenlose Pilot-Programm von ShopGuide bewerben.

Informationen zu unserem Markt:
Name des Marktes: 
Standort: 
Anzahl Filialen: 
Durchschnittliche Kunden pro Tag: 
Verkaufsfläche (m²): 

Warum möchten wir ShopGuide testen:


Bevorzugter Startzeitraum: 

Mit freundlichen Grüßen`;

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Öffnet Email-Client für Business Case Anforderung
 */
function requestBusinessCase() {
    const email = "lerkjannik@gmail.com";
    const subject = "Anforderung: Detaillierter Business Case";
    const body = `Guten Tag,

ich möchte einen detaillierten Business Case für ShopGuide anfordern.

Informationen für die Kalkulation:
Unternehmensname: 
Anzahl Märkte: 
Standorte: 
Durchschnittliche Kunden pro Tag (gesamt): 
Durchschnittliche Verkaufsfläche pro Markt (m²): 
Besondere Anforderungen: 

Bitte senden Sie mir eine auf unsere Situation zugeschnittene Kalkulation.

Mit freundlichen Grüßen`;

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* ========================================
   9. SETTINGS PANEL & DARK MODE
   ======================================== */

/**
 * Öffnet/Schließt das Settings Side Panel
 */
function toggleSettingsPanel() {
    const panel = document.getElementById('settings-panel');
    const overlay = document.getElementById('settings-overlay');
    
    panel.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Verhindere Body-Scroll wenn Panel offen ist
    if (panel.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

/**
 * Schaltet zwischen Dark und Light Mode um
 * Speichert die Präferenz im LocalStorage
 * Tauscht das Icon zwischen Sonne und Mond
 */
function toggleDarkMode() {
    const isDarkMode = document.getElementById('darkModeToggle').checked;
    const darkModeIcon = document.getElementById('dark-mode-icon');
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
        if (darkModeIcon) {
            darkModeIcon.textContent = '☀️'; // Sonne für Dark Mode (weil man zum Light Mode wechseln kann)
        }
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
        if (darkModeIcon) {
            darkModeIcon.textContent = '🌙'; // Mond für Light Mode (weil man zum Dark Mode wechseln kann)
        }
    }
}

/**
 * Lädt die Dark Mode Präferenz beim Seitenstart
 */
document.addEventListener('DOMContentLoaded', () => {
    const darkModePreference = localStorage.getItem('darkMode');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('dark-mode-icon');
    
    if (darkModePreference === 'enabled') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.checked = true;
        }
        if (darkModeIcon) {
            darkModeIcon.textContent = '☀️';
        }
    } else {
        if (darkModeIcon) {
            darkModeIcon.textContent = '🌙';
        }
    }
    
    // Schließe Settings Panel wenn ESC gedrückt wird
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const panel = document.getElementById('settings-panel');
            const overlay = document.getElementById('settings-overlay');
            
            if (panel && panel.classList.contains('active')) {
                panel.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
});

/* ========================================
   10. SMOOTH SCROLL FÜR ANCHOR LINKS
   ======================================== */

/**
 * Fügt smooth scrolling für alle internen Links hinzu
 */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

/* ========================================
   11. PERFORMANCE OPTIMIERUNG
   ======================================== */

/**
 * Debounce Funktion für Performance bei Scroll-Events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimierte Scroll-Listener mit Debouncing
const debouncedScrollProgress = debounce(updateScrollProgress, 10);
const debouncedBackToTop = debounce(updateBackToTopButton, 10);

window.addEventListener('scroll', () => {
    debouncedScrollProgress();
    debouncedBackToTop();
}, { passive: true });

/* ========================================
   12. ACCESSIBILITY VERBESSERUNGEN
   ======================================== */

/**
 * Keyboard Navigation für Settings Panel
 */
document.addEventListener('DOMContentLoaded', () => {
    const settingsIcon = document.querySelector('.settings-icon');
    
    if (settingsIcon) {
        // Enter oder Space öffnet Settings
        settingsIcon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSettingsPanel();
            }
        });
        
        // Macht das Icon fokussierbar
        settingsIcon.setAttribute('tabindex', '0');
        settingsIcon.setAttribute('role', 'button');
        settingsIcon.setAttribute('aria-label', 'Einstellungen öffnen');
    }
});

/* ========================================
   13. ANIMATION BEIM SICHTBARWERDEN
   ======================================== */

/**
 * Intersection Observer für fade-in Animationen
 */
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Beobachte Elemente die animiert werden sollen
    const animatedElements = document.querySelectorAll(
        '.feature-card, .stat-card, .role-card, .benefit-list li'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

console.log('✅ ShopGuide geladen - Alle Features aktiv!');

/* ========================================
   14. LADENLAYOUT-PLANER LOGIK
   ======================================== */

// Globale Variablen für den aktuellen Werkzeug-Status
let currentTool = 'wall';
let currentToolEmoji = '🧱';

/**
 * Initialisierung des Layout-Planers
 */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('store-grid');
    
    if (!grid) return;

    // 100 Zellen für ein 10×10 Raster erstellen
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        
        const row = String.fromCharCode(65 + Math.floor(i / 10));
        const col = (i % 10) + 1;
        const coord = `${row}-${col < 10 ? '0' + col : col}`;
        
        cell.dataset.coord = coord;
        
        cell.addEventListener('mousedown', () => applyTool(cell));
        
        cell.addEventListener('mouseover', (e) => {
            const coordDisplay = document.getElementById('coord-display');
            if (coordDisplay) {
                coordDisplay.innerText = coord;
            }
            if (e.buttons === 1) applyTool(cell);
        });
        
        grid.appendChild(cell);
    }

    // Werkzeug-Auswahl Event-Listener
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.id === 'clear-grid') {
                document.querySelectorAll('#store-grid div').forEach(c => {
                    c.className = '';
                    c.innerText = '';
                });
                updateStats();
                return;
            }
            
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentTool = this.dataset.tool;
            currentToolEmoji = this.innerText.split(' ')[0];
            
            const currentToolDisplay = document.getElementById('current-tool');
            if (currentToolDisplay) {
                currentToolDisplay.innerText = this.innerText;
            }
        });
    });
});

/**
 * Wendet das aktuell ausgewählte Werkzeug auf eine Zelle an
 */
function applyTool(cell) {
    if (currentTool === 'delete') {
        cell.className = '';
        cell.innerText = '';
    } else {
        cell.className = currentTool;
        cell.innerText = currentToolEmoji;
    }
    updateStats();
}

/**
 * Aktualisiert die Statistik-Anzeige
 */
function updateStats() {
    const shelves = document.querySelectorAll('#store-grid .shelf').length;
    const cash = document.querySelectorAll('#store-grid .cash').length;
    const total = document.querySelectorAll('#store-grid div:not(:empty)').length;
    
    const shelfCountEl = document.getElementById('shelf-count');
    const cashCountEl = document.getElementById('cash-count');
    const totalItemsEl = document.getElementById('total-items');
    const areaUsedEl = document.getElementById('area-used');
    
    if (shelfCountEl) shelfCountEl.innerText = shelves;
    if (cashCountEl) cashCountEl.innerText = cash;
    if (totalItemsEl) totalItemsEl.innerText = total;
    if (areaUsedEl) areaUsedEl.innerText = total + "%";
}

/**
 * Speichert das Layout mit Google Cloud Integration
 */
function saveLayout() {
    const cells = document.querySelectorAll('#store-grid div:not(:empty)');
    
    if (cells.length === 0) {
        alert("⚠️ Kein Layout zum Speichern vorhanden!\nBitte platzieren Sie zuerst Elemente im Grid.");
        return;
    }
    
    // Bestätigung anzeigen
    const confirmed = confirm(
        "☁️ Google Cloud Storage\n\n" +
        "Sie werden zur Google Cloud weitergeleitet, wo Sie:\n" +
        "• Ein kostenloses Konto erstellen können\n" +
        "• Ihr Layout sicher speichern können\n" +
        "• Von überall darauf zugreifen können\n\n" +
        "Möchten Sie fortfahren?"
    );
    
    if (confirmed) {
        // Zur Google Cloud Free-Seite weiterleiten
        window.open('https://cloud.google.com/free', '_blank');
        
        // Optional: Layout auch lokal exportieren als Backup
        const exportNow = confirm(
            "💡 Tipp: Möchten Sie Ihr Layout auch als JSON-Datei herunterladen?\n\n" +
            "So haben Sie ein lokales Backup, das Sie dann zu Google Cloud hochladen können."
        );
        
        if (exportNow) {
            exportLayoutJSON();
        }
    }
}

/**
 * Sammelt alle Layout-Daten aus dem Grid
 */
function collectLayoutData() {
    const layoutData = {};
    
    document.querySelectorAll('#store-grid div').forEach(cell => {
        const coord = cell.dataset.coord;
        if (cell.className && cell.innerText) {
            layoutData[coord] = {
                tool: cell.className,
                emoji: cell.innerText
            };
        }
    });
    
    return layoutData;
}

/**
 * Lädt ein vordefiniertes Beispiel-Layout
 */
function loadSampleLayout() {
    document.querySelectorAll('#store-grid div').forEach(c => {
        c.className = '';
        c.innerText = '';
    });
    
    const sampleLayout = {
        'J-05': {tool: 'entrance', emoji: '🚪'},
        'J-06': {tool: 'entrance', emoji: '🚪'},
        'J-04': {tool: 'cash', emoji: '💰'},
        'J-07': {tool: 'cash', emoji: '💰'},
        
        'A-01': {tool: 'wall', emoji: '🧱'}, 'A-02': {tool: 'wall', emoji: '🧱'}, 'A-03': {tool: 'wall', emoji: '🧱'},
        'A-04': {tool: 'wall', emoji: '🧱'}, 'A-05': {tool: 'wall', emoji: '🧱'}, 'A-06': {tool: 'wall', emoji: '🧱'},
        'A-07': {tool: 'wall', emoji: '🧱'}, 'A-08': {tool: 'wall', emoji: '🧱'}, 'A-09': {tool: 'wall', emoji: '🧱'},
        'A-10': {tool: 'wall', emoji: '🧱'},
        
        'B-01': {tool: 'wall', emoji: '🧱'}, 'B-10': {tool: 'wall', emoji: '🧱'},
        'C-01': {tool: 'wall', emoji: '🧱'}, 'C-10': {tool: 'wall', emoji: '🧱'},
        'D-01': {tool: 'wall', emoji: '🧱'}, 'D-10': {tool: 'wall', emoji: '🧱'},
        'E-01': {tool: 'wall', emoji: '🧱'}, 'E-10': {tool: 'wall', emoji: '🧱'},
        'F-01': {tool: 'wall', emoji: '🧱'}, 'F-10': {tool: 'wall', emoji: '🧱'},
        'G-01': {tool: 'wall', emoji: '🧱'}, 'G-10': {tool: 'wall', emoji: '🧱'},
        'H-01': {tool: 'wall', emoji: '🧱'}, 'H-10': {tool: 'wall', emoji: '🧱'},
        'I-01': {tool: 'wall', emoji: '🧱'}, 'I-10': {tool: 'wall', emoji: '🧱'},
        
        'J-01': {tool: 'wall', emoji: '🧱'}, 'J-02': {tool: 'wall', emoji: '🧱'}, 'J-03': {tool: 'wall', emoji: '🧱'},
        'J-08': {tool: 'wall', emoji: '🧱'}, 'J-09': {tool: 'wall', emoji: '🧱'}, 'J-10': {tool: 'wall', emoji: '🧱'},
        
        'B-02': {tool: 'cooling', emoji: '❄️'}, 'B-03': {tool: 'cooling', emoji: '❄️'},
        'B-04': {tool: 'cooling', emoji: '❄️'}, 'B-05': {tool: 'cooling', emoji: '❄️'},
        'B-06': {tool: 'cooling', emoji: '❄️'}, 'B-07': {tool: 'cooling', emoji: '❄️'},
        'B-08': {tool: 'cooling', emoji: '❄️'}, 'B-09': {tool: 'cooling', emoji: '❄️'},
        
        'D-03': {tool: 'shelf', emoji: '📦'}, 'D-04': {tool: 'shelf', emoji: '📦'},
        'D-05': {tool: 'shelf', emoji: '📦'}, 'D-06': {tool: 'shelf', emoji: '📦'},
        'D-07': {tool: 'shelf', emoji: '📦'}, 'D-08': {tool: 'shelf', emoji: '📦'},
        
        'F-03': {tool: 'shelf', emoji: '📦'}, 'F-04': {tool: 'shelf', emoji: '📦'},
        'F-05': {tool: 'shelf', emoji: '📦'}, 'F-06': {tool: 'shelf', emoji: '📦'},
        'F-07': {tool: 'shelf', emoji: '📦'}, 'F-08': {tool: 'shelf', emoji: '📦'},
        
        'H-03': {tool: 'shelf', emoji: '📦'}, 'H-04': {tool: 'shelf', emoji: '📦'},
        'H-05': {tool: 'shelf', emoji: '📦'}, 'H-06': {tool: 'shelf', emoji: '📦'},
        'H-07': {tool: 'shelf', emoji: '📦'}, 'H-08': {tool: 'shelf', emoji: '📦'},
    };
    
    document.querySelectorAll('#store-grid div').forEach(cell => {
        const coord = cell.dataset.coord;
        if (sampleLayout[coord]) {
            cell.className = sampleLayout[coord].tool;
            cell.innerText = sampleLayout[coord].emoji;
        }
    });
    
    updateStats();
    alert("✅ Beispiel-Layout geladen: Supermarkt mit 3 Regal-Gängen, Kühlzone und Kassenbereich!");
}

/**
 * Exportiert das Layout als JSON
 */
function exportLayout() {
    const cells = document.querySelectorAll('#store-grid div:not(:empty)');
    
    if (cells.length === 0) {
        alert("⚠️ Kein Layout zum Exportieren vorhanden!");
        return;
    }
    
    const layoutData = {
        shopName: prompt("Name Ihres Marktes:", "Mein Supermarkt"),
        createdAt: new Date().toISOString(),
        layout: collectLayoutData(),
        statistics: {
            shelves: document.querySelectorAll('#store-grid .shelf').length,
            total: cells.length
        }
    };
    
    const dataStr = JSON.stringify(layoutData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `shopguide-layout-${layoutData.shopName.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    
    alert("✅ Layout wurde als JSON-Datei heruntergeladen!");
}

/**
 * Exportiert das Layout als JSON (wird von saveLayout aufgerufen)
 */
function exportLayoutJSON() {
    const layoutData = {
        shopName: prompt("Name Ihres Marktes:", "Mein Supermarkt"),
        createdAt: new Date().toISOString(),
        layout: collectLayoutData(),
        statistics: {
            shelves: document.querySelectorAll('#store-grid .shelf').length,
            cash: document.querySelectorAll('#store-grid .cash').length,
            cooling: document.querySelectorAll('#store-grid .cooling').length,
            walls: document.querySelectorAll('#store-grid .wall').length,
            entrance: document.querySelectorAll('#store-grid .entrance').length,
            total: document.querySelectorAll('#store-grid div:not(:empty)').length
        }
    };
    
    if (!layoutData.shopName) {
        layoutData.shopName = "Mein Supermarkt";
    }
    
    const dataStr = JSON.stringify(layoutData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `shopguide-layout-${layoutData.shopName.replace(/\s+/g, '-').toLowerCase()}-${new Date().getTime()}.json`;
    link.click();
    
    alert(`✅ Layout "${layoutData.shopName}" wurde als JSON-Datei heruntergeladen!\n\nSie können diese Datei nun zu Google Cloud hochladen.`);
}

/**
 * Druckt das Layout
 */
function printLayout() {
    const printConfirm = confirm(
        "🖨️ Layout drucken\n\n" +
        "Das Layout wird in einem druckfreundlichen Format geöffnet.\n\n" +
        "Möchten Sie fortfahren?"
    );
    
    if (printConfirm) {
        window.print();
    }
}

// ... DEIN GANZER ORIGINALER CODE BLEIBT VORHANDEN ...

/** NEU: Statistik Counter Animation **/
function animateCounter(element, target, duration){
  let start=0;
  const step=Math.ceil(target/(duration*60/1000));
  function update(){
    start+=step;
    if(start>=target){ element.textContent=target; return; }
    element.textContent=start;
    requestAnimationFrame(update);
  } update();
}
let statsAnimated=false;
window.addEventListener('scroll',()=>{
  if(statsAnimated) return;
  let el = document.querySelector('.merchant-stats-animated');
  if(!el) return;
  let rect=el.getBoundingClientRect();
  if(rect.top<window.innerHeight-100){
    document.querySelectorAll('.stat-counter').forEach(sc=>{
      let tgt=parseInt(sc.getAttribute('data-target'),10)||0;
      animateCounter(sc,tgt,900);
    });
    statsAnimated=true;
  }
});

/** (Optional) Newsletter Confetti (Vorlage, noch nicht sichtbar) **/
function createConfetti(parent){
  for(let i=0;i<32;i++){
    let dot=document.createElement('div');
    dot.className='confetti';
    dot.style.left=(Math.random()*100)+'%';
    dot.style.animationDelay=(Math.random()*1.5)+'s';
    dot.style.background='hsl('+(Math.random()*360)+',75%,60%)';
    parent.appendChild(dot);
    setTimeout(()=>{try{parent.removeChild(dot);}catch{}},2300);
  }
}
// Stil: (demo) .confetti { width:12px; height:12px; border-radius:50%; position:absolute; top:0; animation:pop .8s 1; }

/* Alle anderen Funktionen von dir bleiben erhalten – keine Änderungen am Koordinatensystem, Darkmode, E-Mail-Versand, ROI etc! */
/* ========================================
   EASTER EGGS - EINFACH & COOL! 🎉
   ======================================== */

/* ========================================
   EASTER EGG #1: GEHEIME STATISTIK
   Halte SHIFT und drücke S
   ======================================== */

document.addEventListener('keydown', function(e) {
    // SHIFT + S gedrückt?
    if (e.shiftKey && e.key === 'S') {
        e.preventDefault();
        showSecretStats();
    }
});

function showSecretStats() {
    // Zufällige realistische Zahlen generieren
    const einkäufeProWoche = 2;
    const wochenProJahr = 52;
    const jahreErwachsen = 50; // Durchschnitt
    const minutenGespart = 15; // Pro Einkauf mit ShopGuide
    
    const totalEinkäufe = einkäufeProWoche * wochenProJahr * jahreErwachsen;
    const minutenGesamt = totalEinkäufe * minutenGespart;
    const stundenGesamt = Math.round(minutenGesamt / 60);
    const tageGesamt = Math.round(stundenGesamt / 24);
    
    // Zufällige Fun Facts
    const funFacts = [
        `Das sind ${Math.round(tageGesamt / 7)} Wochen reiner Freizeit!`,
        `Damit könntest du ${Math.round(stundenGesamt / 2)} Filme schauen!`,
        `Das entspricht ${Math.round(tageGesamt)} ganzen Tagen!`,
        `In dieser Zeit könntest du ${Math.round(stundenGesamt / 8)} Arbeitstage frei haben!`,
        `Oder ${Math.round(stundenGesamt / 24 / 14)} Urlaube à 2 Wochen machen!`
    ];
    
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    
    // Erstelle Popup
    const popup = document.createElement('div');
    popup.className = 'secret-stats-popup';
    popup.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem;
            border-radius: 25px;
            text-align: center;
            box-shadow: 0 30px 80px rgba(0,0,0,0.6);
            z-index: 999999;
            animation: statsPopIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
            max-width: 90vw;
            border: 3px solid rgba(255,255,255,0.2);
        ">
            <div style="font-size: 4rem; margin-bottom: 1rem;">📊</div>
            <h2 style="margin: 0 0 0.5rem 0; font-size: 1.8rem;">🔓 GEHEIME STATISTIK FREIGESCHALTET!</h2>
            <div style="background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 15px; margin: 1.5rem 0;">
                <div style="font-size: 1rem; opacity: 0.9; margin-bottom: 0.5rem;">Mit ShopGuide sparst du in deinem Leben:</div>
                <div style="font-size: 3.5rem; font-weight: bold; margin: 1rem 0; text-shadow: 3px 3px 6px rgba(0,0,0,0.5);">
                    ${stundenGesamt.toLocaleString()} Stunden
                </div>
                <div style="font-size: 1.1rem; opacity: 0.95; margin-top: 1rem;">
                    ${randomFact}
                </div>
            </div>
            <div style="font-size: 0.9rem; opacity: 0.7; margin-top: 1rem;">
                ⏱️ Basierend auf ${einkäufeProWoche}x Einkaufen/Woche über ${jahreErwachsen} Jahre
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="
                margin-top: 2rem;
                padding: 12px 30px;
                background: rgba(255,255,255,0.2);
                border: 2px solid white;
                border-radius: 25px;
                color: white;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s;
                font-weight: bold;
            " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
               onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                Wow! 🤯
            </button>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Sound-Effekt (optional)
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTcIGWi77eefTRAMUKfj8LZjHAY4ktfyyXstBSJ1xPDekkIKElyw6OyrWBUJQ5zd8sFuIQQngM3z2og3CRhmu+zvn04QC06k5O+2Yx0GN5HX8sp6LQUgc8Tv35JDChFYrujtuVoWCUGZ2/K+bSAFJoDM89qJOAkXZLrr7p9QEgxKoeHvt2MdBjaP1vLKei0FH3HC8N+SRAoQVKzo7rpbFglAmNryvm0gBSZ/y/Paijg=');
        audio.volume = 0.2;
        audio.play().catch(() => {});
    } catch(e) {}
    
    console.log('📊 Geheime Statistik freigeschaltet!');
}


/* ========================================
   EASTER EGG #2: DANKE-KONFETTI
   Nach 30 Sekunden auf der Seite
   ======================================== */

let confettiTimeout = null;
let confettiShown = false;

// Starte Timer sobald Seite geladen ist
document.addEventListener('DOMContentLoaded', function() {
    console.log('⏱️ Danke-Konfetti startet in 30 Sekunden...');
    
    confettiTimeout = setTimeout(function() {
        if (!confettiShown) {
            showThankYouConfetti();
            confettiShown = true;
        }
    }, 30000); // 30 Sekunden
});

// Reset bei Seitenwechsel (für Single-Page-Apps)
document.addEventListener('click', function(e) {
    // Wenn auf Navigation geklickt wird, timer neu starten
    if (e.target.closest('.nav-links, .panel-nav-link')) {
        clearTimeout(confettiTimeout);
        confettiShown = false;
        confettiTimeout = setTimeout(function() {
            if (!confettiShown) {
                showThankYouConfetti();
                confettiShown = true;
            }
        }, 30000);
    }
});

function showThankYouConfetti() {
    console.log('🎉 Danke-Konfetti aktiviert!');
    
    // Erstelle Danke-Popup
    const thankYou = document.createElement('div');
    thankYou.className = 'thank-you-popup';
    thankYou.innerHTML = `
        <div style="
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 2rem 3rem;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.4);
            z-index: 999998;
            animation: thankYouPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
            border: 3px solid rgba(255,255,255,0.3);
        ">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎉</div>
            <h2 style="margin: 0; font-size: 2rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                Danke fürs Bleiben!
            </h2>
            <p style="margin: 1rem 0 0 0; font-size: 1.1rem; opacity: 0.9;">
                Du scheinst wirklich interessiert zu sein 😊
            </p>
        </div>
    `;
    
    document.body.appendChild(thankYou);
    
    // Starte Konfetti-Regen
    startConfettiRain();
    
    // Entferne Popup nach 5 Sekunden
    setTimeout(() => {
        thankYou.style.animation = 'thankYouFade 0.5s forwards';
        setTimeout(() => thankYou.remove(), 500);
    }, 5000);
}

function startConfettiRain() {
    const colors = ['#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7', '#fa709a', '#fee140'];
    const confettiCount = 80;
    const duration = 5000; // 5 Sekunden
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            createConfettiPiece(colors);
        }, i * 60); // Verteilt über Zeit
    }
}

function createConfettiPiece(colors) {
    const confetti = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const startX = Math.random() * window.innerWidth;
    const rotation = Math.random() * 360;
    const size = 8 + Math.random() * 8;
    
    confetti.style.cssText = `
        position: fixed;
        top: -20px;
        left: ${startX}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        z-index: 999999;
        pointer-events: none;
        animation: confettiFall ${3 + Math.random() * 2}s linear forwards;
        transform: rotate(${rotation}deg);
        opacity: 0.9;
    `;
    
    document.body.appendChild(confetti);
    
    // Entferne nach Animation
    setTimeout(() => confetti.remove(), 6000);
}

// CSS Animations
const easterEggStyles = document.createElement('style');
easterEggStyles.innerHTML = `
    @keyframes statsPopIn {
        0% { 
            transform: translate(-50%, -50%) scale(0) rotate(-20deg); 
            opacity: 0; 
        }
        70% { 
            transform: translate(-50%, -50%) scale(1.1) rotate(5deg); 
        }
        100% { 
            transform: translate(-50%, -50%) scale(1) rotate(0deg); 
            opacity: 1; 
        }
    }
    
    @keyframes thankYouPop {
        0% { 
            transform: translate(-50%, -50%) scale(0); 
            opacity: 0; 
        }
        70% { 
            transform: translate(-50%, -50%) scale(1.1); 
        }
        100% { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 1; 
        }
    }
    
    @keyframes thankYouFade {
        to { 
            transform: translate(-50%, -50%) scale(0.8); 
            opacity: 0; 
        }
    }
    
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.9;
        }
        100% {
            transform: translateY(${window.innerHeight + 50}px) rotate(${360 + Math.random() * 720}deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(easterEggStyles);

console.log('✅ Easter Eggs geladen!');
console.log('📊 SHIFT+S = Geheime Statistik');
console.log('🎉 30 Sekunden warten = Danke-Konfetti');