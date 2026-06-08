/* ========================================
   RANDOM VIDEO LOADER
   ======================================== */

function loadRandomVideo() {
    const videos = [
        {
            id: 'DFDkf_CkFA0',
            url: 'https://www.youtube.com/embed/DFDkf_CkFA0',
            title: 'ShopGuide Erklärvideo 1'
        },
        {
            id: 'nJD2PUckmUQ',
            url: 'https://www.youtube.com/embed/nJD2PUckmUQ',
            title: 'ShopGuide Erklärvideo 2'
        }
    ];
    
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    const container = document.getElementById('randomVideoContainer');
    
    if (container) {
        container.innerHTML = `
            <iframe 
                src="${randomVideo.url}?rel=0&modestbranding=1&autohide=1&showinfo=0"
                title="${randomVideo.title}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
            ></iframe>
        `;
        
    }
}

document.addEventListener('DOMContentLoaded', loadRandomVideo);
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
        email: '✉️ E-Mail kopiert!'
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
    
    if (zeitAnzeige) zeitAnzeige.textContent = zeit;
    
    if (routeContainer) {
        // Sort by gang then regal for logical route order
        const sorted = [...produkte].sort((a, b) => {
            if (a.gang !== b.gang) return a.gang.localeCompare(b.gang);
            return a.regal.localeCompare(b.regal);
        });
        
        // Group by Kühlware to show at end (smart logic)
        const warm = sorted.filter(p => p.kategorie !== 'Kühlware' && p.kategorie !== 'Fleisch');
        const kuehl = sorted.filter(p => p.kategorie === 'Kühlware' || p.kategorie === 'Fleisch');
        const ordered = [...warm, ...kuehl];
        
        let routeHTML = '';
        const gangColors = {A:'#27ae60',B:'#e67e22',C:'#3498db',D:'#9b59b6',E:'#e74c3c',F:'#1abc9c'};
        ordered.forEach((produkt, idx) => {
            const isKuehl = produkt.kategorie === 'Kühlware' || produkt.kategorie === 'Fleisch';
            const gangColor = gangColors[produkt.gang] || '#888';
            routeHTML += `
                <div class="route-item" style="animation: routeIn 0.3s ease ${idx * 0.06}s both; border-left-color:${gangColor};">
                    <div style="display:flex;align-items:center;gap:7px;flex:1;min-width:0;">
                        <span style="background:${gangColor};color:#fff;border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;flex-shrink:0;">${idx + 1}</span>
                        <span style="font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${produkt.emoji} ${produkt.name}</span>
                        ${isKuehl ? '<span style="font-size:8px;color:#1abc9c;flex-shrink:0;">❄️</span>' : ''}
                    </div>
                    <span class="coordinate" style="background:${gangColor};">${produkt.gang} · R${produkt.regal}</span>
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

// resetCustomerDemo duplicate removed — use resetCompleteDemo()
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
    { name: "Tomaten", emoji: "🍅", kategorie: "Obst & Gemüse", gang: "A", regal: "01" },
    { name: "Gurken", emoji: "🥒", kategorie: "Obst & Gemüse", gang: "A", regal: "02" },
    { name: "Paprika", emoji: "🫑", kategorie: "Obst & Gemüse", gang: "A", regal: "03" },
    { name: "Karotten", emoji: "🥕", kategorie: "Obst & Gemüse", gang: "A", regal: "04" },
    { name: "Brokkoli", emoji: "🥦", kategorie: "Obst & Gemüse", gang: "A", regal: "05" },
    { name: "Salat", emoji: "🥬", kategorie: "Obst & Gemüse", gang: "A", regal: "06" },
    { name: "Zwiebeln", emoji: "🧅", kategorie: "Obst & Gemüse", gang: "A", regal: "07" },
    { name: "Knoblauch", emoji: "🧄", kategorie: "Obst & Gemüse", gang: "A", regal: "08" },
    { name: "Kartoffeln", emoji: "🥔", kategorie: "Obst & Gemüse", gang: "A", regal: "09" },
    { name: "Äpfel", emoji: "🍎", kategorie: "Obst & Gemüse", gang: "A", regal: "10" },
    { name: "Bananen", emoji: "🍌", kategorie: "Obst & Gemüse", gang: "A", regal: "11" },
    { name: "Orangen", emoji: "🍊", kategorie: "Obst & Gemüse", gang: "A", regal: "12" },
    { name: "Erdbeeren", emoji: "🍓", kategorie: "Obst & Gemüse", gang: "A", regal: "13" },
    { name: "Trauben", emoji: "🍇", kategorie: "Obst & Gemüse", gang: "A", regal: "14" },
    { name: "Wassermelone", emoji: "🍉", kategorie: "Obst & Gemüse", gang: "A", regal: "15" },
    { name: "Ananas", emoji: "🍍", kategorie: "Obst & Gemüse", gang: "A", regal: "16" },
    { name: "Mango", emoji: "🥭", kategorie: "Obst & Gemüse", gang: "A", regal: "17" },
    { name: "Avocado", emoji: "🥑", kategorie: "Obst & Gemüse", gang: "A", regal: "18" },
    { name: "Zitronen", emoji: "🍋", kategorie: "Obst & Gemüse", gang: "A", regal: "19" },
    
    // Drogerie & Hygiene
    { name: "Zahnpasta", emoji: "🦷", kategorie: "Drogerie", gang: "E", regal: "01" },
    { name: "Shampoo", emoji: "🧴", kategorie: "Drogerie", gang: "E", regal: "02" },
    { name: "Duschgel", emoji: "🧼", kategorie: "Drogerie", gang: "E", regal: "03" },
    { name: "Seife", emoji: "🧼", kategorie: "Drogerie", gang: "E", regal: "04" },
    { name: "Toilettenpapier", emoji: "🧻", kategorie: "Drogerie", gang: "E", regal: "05" },
    { name: "Taschentücher", emoji: "🤧", kategorie: "Drogerie", gang: "E", regal: "06" },
    { name: "Deo", emoji: "💨", kategorie: "Drogerie", gang: "E", regal: "07" },
    { name: "Rasierer", emoji: "🪒", kategorie: "Drogerie", gang: "E", regal: "08" },
    { name: "Creme", emoji: "🧴", kategorie: "Drogerie", gang: "E", regal: "09" },
    { name: "Waschmittel", emoji: "🧺", kategorie: "Drogerie", gang: "E", regal: "10" },
    { name: "Putzmittel", emoji: "🧽", kategorie: "Drogerie", gang: "E", regal: "11" },
    { name: "Spülmittel", emoji: "🫧", kategorie: "Drogerie", gang: "E", regal: "12" },
    { name: "Windeln", emoji: "👶", kategorie: "Drogerie", gang: "E", regal: "13" },
    { name: "Zahnbürste", emoji: "🪥", kategorie: "Drogerie", gang: "E", regal: "14" },
    
    // Milchprodukte & Eier
    { name: "Milch", emoji: "🥛", kategorie: "Kühlware", gang: "F", regal: "01" },
    { name: "Eier", emoji: "🥚", kategorie: "Kühlware", gang: "F", regal: "02" },
    { name: "Butter", emoji: "🧈", kategorie: "Kühlware", gang: "F", regal: "03" },
    { name: "Käse", emoji: "🧀", kategorie: "Kühlware", gang: "F", regal: "04" },
    { name: "Joghurt", emoji: "🥛", kategorie: "Kühlware", gang: "F", regal: "05" },
    { name: "Quark", emoji: "🥛", kategorie: "Kühlware", gang: "F", regal: "06" },
    { name: "Sahne", emoji: "🥛", kategorie: "Kühlware", gang: "F", regal: "07" },
    { name: "Frischkäse", emoji: "🧀", kategorie: "Kühlware", gang: "F", regal: "08" },
    { name: "Mozzarella", emoji: "🧀", kategorie: "Kühlware", gang: "F", regal: "09" },
    
    // Fleisch & Wurst
    { name: "Hähnchen", emoji: "🍗", kategorie: "Fleisch", gang: "F", regal: "10" },
    { name: "Hackfleisch", emoji: "🍖", kategorie: "Fleisch", gang: "F", regal: "11" },
    { name: "Würstchen", emoji: "🌭", kategorie: "Fleisch", gang: "F", regal: "12" },
    { name: "Salami", emoji: "🥓", kategorie: "Fleisch", gang: "F", regal: "13" },
    { name: "Schinken", emoji: "🥓", kategorie: "Fleisch", gang: "F", regal: "14" },
    { name: "Steak", emoji: "🥩", kategorie: "Fleisch", gang: "F", regal: "15" },
    { name: "Bacon", emoji: "🥓", kategorie: "Fleisch", gang: "F", regal: "16" },
    
    // Brot & Backwaren
    { name: "Brot", emoji: "🍞", kategorie: "Backwaren", gang: "B", regal: "01" },
    { name: "Brötchen", emoji: "🥖", kategorie: "Backwaren", gang: "B", regal: "02" },
    { name: "Toast", emoji: "🍞", kategorie: "Backwaren", gang: "B", regal: "03" },
    { name: "Croissant", emoji: "🥐", kategorie: "Backwaren", gang: "B", regal: "04" },
    { name: "Kuchen", emoji: "🍰", kategorie: "Backwaren", gang: "B", regal: "05" },
    { name: "Bagel", emoji: "🥯", kategorie: "Backwaren", gang: "B", regal: "06" },
    
    // Getränke
    { name: "Wasser", emoji: "💧", kategorie: "Getränke", gang: "C", regal: "01" },
    { name: "Cola", emoji: "🥤", kategorie: "Getränke", gang: "C", regal: "02" },
    { name: "Saft", emoji: "🧃", kategorie: "Getränke", gang: "C", regal: "03" },
    { name: "Bier", emoji: "🍺", kategorie: "Getränke", gang: "C", regal: "04" },
    { name: "Wein", emoji: "🍷", kategorie: "Getränke", gang: "C", regal: "05" },
    { name: "Kaffee", emoji: "☕", kategorie: "Getränke", gang: "C", regal: "06" },
    { name: "Tee", emoji: "🍵", kategorie: "Getränke", gang: "C", regal: "07" },
    { name: "Energy Drink", emoji: "🥤", kategorie: "Getränke", gang: "C", regal: "08" },
    { name: "Limonade", emoji: "🥤", kategorie: "Getränke", gang: "C", regal: "09" },
    { name: "Smoothie", emoji: "🥤", kategorie: "Getränke", gang: "C", regal: "10" },
    
    // Süßigkeiten & Snacks
    { name: "Schokolade", emoji: "🍫", kategorie: "Süßwaren", gang: "D", regal: "01" },
    { name: "Chips", emoji: "🍿", kategorie: "Süßwaren", gang: "D", regal: "02" },
    { name: "Gummibärchen", emoji: "🍬", kategorie: "Süßwaren", gang: "D", regal: "03" },
    { name: "Kekse", emoji: "🍪", kategorie: "Süßwaren", gang: "D", regal: "04" },
    { name: "Bonbons", emoji: "🍭", kategorie: "Süßwaren", gang: "D", regal: "05" },
    { name: "Eis", emoji: "🍦", kategorie: "Süßwaren", gang: "D", regal: "06" },
    { name: "Popcorn", emoji: "🍿", kategorie: "Süßwaren", gang: "D", regal: "07" },
    { name: "Nüsse", emoji: "🥜", kategorie: "Süßwaren", gang: "D", regal: "08" },
    { name: "Müsliriegel", emoji: "🍫", kategorie: "Süßwaren", gang: "D", regal: "09" },
    
    // Tiefkühl
    { name: "Pizza", emoji: "🍕", kategorie: "Tiefkühl", gang: "D", regal: "10" },
    { name: "Pommes", emoji: "🍟", kategorie: "Tiefkühl", gang: "D", regal: "11" },
    { name: "Fischstäbchen", emoji: "🐟", kategorie: "Tiefkühl", gang: "D", regal: "12" },
    { name: "Gemüsemix", emoji: "🥦", kategorie: "Tiefkühl", gang: "D", regal: "13" },
    { name: "Erbsen", emoji: "🫛", kategorie: "Tiefkühl", gang: "D", regal: "14" },
    
    // Konserven & Vorräte
    { name: "Nudeln", emoji: "🍝", kategorie: "Vorräte", gang: "D", regal: "15" },
    { name: "Reis", emoji: "🍚", kategorie: "Vorräte", gang: "D", regal: "16" },
    { name: "Mehl", emoji: "🌾", kategorie: "Vorräte", gang: "D", regal: "17" },
    { name: "Zucker", emoji: "🍬", kategorie: "Vorräte", gang: "D", regal: "18" },
    { name: "Salz", emoji: "🧂", kategorie: "Vorräte", gang: "D", regal: "19" },
    { name: "Pfeffer", emoji: "🌶️", kategorie: "Vorräte", gang: "D", regal: "20" },
    { name: "Olivenöl", emoji: "🫒", kategorie: "Vorräte", gang: "D", regal: "21" },
    { name: "Essig", emoji: "🧪", kategorie: "Vorräte", gang: "D", regal: "22" },
    { name: "Tomatenmark", emoji: "🍅", kategorie: "Vorräte", gang: "D", regal: "23" },
    { name: "Ketchup", emoji: "🍅", kategorie: "Vorräte", gang: "D", regal: "24" },
    { name: "Senf", emoji: "🌭", kategorie: "Vorräte", gang: "D", regal: "25" },
    { name: "Mayo", emoji: "🥚", kategorie: "Vorräte", gang: "D", regal: "26" },
    { name: "Honig", emoji: "🍯", kategorie: "Vorräte", gang: "D", regal: "27" },
    { name: "Marmelade", emoji: "🍓", kategorie: "Vorräte", gang: "D", regal: "28" },
    { name: "Nutella", emoji: "🍫", kategorie: "Vorräte", gang: "D", regal: "29" },
    { name: "Dosentomaten", emoji: "🥫", kategorie: "Vorräte", gang: "D", regal: "30" },
    { name: "Bohnen", emoji: "🥫", kategorie: "Vorräte", gang: "D", regal: "31" },
    { name: "Thunfisch", emoji: "🐟", kategorie: "Vorräte", gang: "D", regal: "32" },
    { name: "Mais", emoji: "🌽", kategorie: "Vorräte", gang: "D", regal: "33" },
    
    // Fertiggerichte
    { name: "Suppe", emoji: "🍲", kategorie: "Fertiggerichte", gang: "D", regal: "34" },
    { name: "Ravioli", emoji: "🥫", kategorie: "Fertiggerichte", gang: "D", regal: "35" },
    { name: "Instant Nudeln", emoji: "🍜", kategorie: "Fertiggerichte", gang: "D", regal: "36" },
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
    generiereRouteVonProdukten(produkte);
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
   EASTER EGGS
   ======================================== */

// Easter Egg 1: Shift + S für lustige Statistik
let easterEggActive = false;

document.addEventListener('keydown', function(e) {
    if (e.shiftKey && e.key === 'S') {
        e.preventDefault();
        if (!easterEggActive) {
            showFunnyStats();
        }
    }
});

function showFunnyStats() {
    const funnyStats = [
        "🛒 Wusstest du? 73% aller Einkaufswagen quietschen - unsere App auch nicht! 😄",
        "📊 Fun Fact: Du hast gerade mehr Zeit mit diesem Easter Egg verbracht als mit der Suche nach Milch im Supermarkt! 🥛",
        "🎯 Statistik des Tages: 99% der Kunden vergessen mindestens 1 Produkt - ShopGuide vergisst nichts! 🧠",
        "🍕 Breaking News: 87% aller Einkäufe enden mit Spontankäufen. Bei uns endet es mit einem Lächeln! 😊",
        "⚡ Rekord: Der schnellste ShopGuide-Nutzer hat einen Wocheneinkauf in 7 Minuten geschafft. Dein Highscore? 🏆",
        "🎪 Spaßfakt: Mehr Menschen kennen jetzt Shift+S als den Weg zur Kasse im Laden! 🤓",
        "🌟 Easter Egg gefunden! Du gehörst zu den 0,3% Elite-Usern, die Shortcuts kennen! 🎖️",
        "🚀 Wissenschaftlich bewiesen: Menschen mit ShopGuide lächeln 42% mehr beim Einkaufen! 😁",
        "🎲 Zufall des Tages: Die Wahrscheinlichkeit, Shift+S zu drücken, liegt bei 0,0001% - du Glückspilz! 🍀",
        "🏃‍♂️ Fun Fact: Der durchschnittliche Kunde läuft 2,3 km im Supermarkt. Mit ShopGuide nur noch 800m! 📉",
        "🧮 Mathe-Moment: 1 Einkaufszettel + ShopGuide = 100% weniger Stress! ✨",
        "🎭 Plot Twist: Dieser Text hier ist länger als deine durchschnittliche Wartezeit an der Kasse mit ShopGuide! ⏱️",
        "🍎 Wusstest du? Äpfel werden durchschnittlich 23x angefasst, bevor jemand sie kauft. Eklig, oder? 🤢",
        "💡 Geistesblitz: Du könntest jetzt schon fertig sein, wenn du ShopGuide im echten Leben benutzt hättest! 🏁",
        "🎯 Insider-Info: 91% aller Kunden laufen im Supermarkt gegen den Uhrzeigersinn. Chaos! 🌀",
        "🔮 Prophecy: In 5 Jahren wird niemand mehr ohne ShopGuide einkaufen gehen! (Hoffentlich!) 🙏",
        "🎨 Kreativ-Fakt: Mehr Menschen nutzen ihren Einkaufszettel als Notizblock als tatsächlich zum Einkaufen! 📝",
        "🌈 Regenbogen-Statistik: Bunte Produkte werden 67% häufiger gekauft. ShopGuide zeigt dir ALLE Farben! 🎨",
        "🎪 Zirkus-Fakt: Jonglieren ist leichter als ohne Plan durch den Supermarkt zu irren! 🤹",
        "🦸‍♂️ Superhelden-Tipp: Mit ShopGuide hast du die Superkraft der Effizienz! POW! 💥",
        "🎵 Musikfakt: Die durchschnittliche Supermarkt-Musik lässt dich 15% langsamer laufen. ShopGuide beschleunigt dich! 🎶",
        "🧠 Brainfood: Dein Gehirn verbraucht mehr Energie beim Suchen im Supermarkt als beim Sudoku! 🤯",
        "🎰 Glücksspiel: Ohne Plan einzukaufen ist wie Roulette - aber mit schlechteren Gewinnchancen! 🎲",
        "🌍 Weltrekord: Der längste Einkauf aller Zeiten dauerte 4 Stunden. Mit ShopGuide unmöglich! ⏰",
        "🎬 Blockbuster: Dein Einkauf mit ShopGuide ist spannender als die meisten Netflix-Serien! 🍿",
        "🔬 Labor-Ergebnis: 10 von 10 Wissenschaftlern empfehlen, nicht mehr kreuz und quer zu laufen! 👨‍🔬",
        "🎓 Wissen ist Macht: Du weißt jetzt, dass Shift+S existiert. Das zählt schon als Bildung! 📚",
        "🌟 VIP-Status: Du hast gerade den geheimen Entwickler-Modus freigeschaltet! (Nicht wirklich, aber fühlt sich so an!) 🎖️",
        "🍰 Süße Wahrheit: Menschen, die strukturiert einkaufen, sind 38% glücklicher! 😊",
        "🎪 Manege frei: Der Supermarkt ist eine Show - ShopGuide ist dein Regisseur! 🎬",
        "🧩 Puzzle-Piece: Einkaufen ohne ShopGuide ist wie ein 1000-Teile-Puzzle... im Dunkeln... mit verbundenen Augen! 🤷‍♂️",
        "🚁 Hubschrauber-Blick: Mit ShopGuide siehst du den Supermarkt von oben. Ohne? Du bist im Labyrinth! 🌀",
        "💎 Diamant-Tipp: Zeit ist Geld. ShopGuide spart beides. Du bist jetzt reich! 💰",
        "🎈 Party-Fakt: Jeder 100. Shift+S-Drücker bekommt... absolut nichts! Aber trotzdem cool! 🎉",
        "🦄 Einhorn-Status: So selten wie Einhörner sind Leute, die Easter Eggs finden. Du bist eins! 🦄",
        "🎯 Bullseye: Du hast ins Schwarze getroffen! Genau wie ShopGuide bei der Produktsuche! 🎯",
        "🌮 Taco-Tuesday-Fact: Mit der gesparten Zeit kannst du dir 15 Tacos machen. Oder auch nicht. 🌮",
        "🎸 Rock'n'Roll: Shift+S ist der neue Rock'n'Roll! Oder so ähnlich... 🤘",
        "🍕 Pizza-Weisheit: In der Zeit, die du beim Suchen sparst, könntest du 2,3 Pizzen backen! 🍕",
        "🎮 Achievement unlocked: 'Easter Egg Hunter' - 100 Punkte für dein Gamer-Herz! 🏆",
        "🌙 Nachts um 3 Uhr Fakt: Wir hoffen, du liest das nicht um 3 Uhr nachts. Wenn doch: Geh schlafen! 😴",
        "🎨 Kunstwerk: Dein Einkaufsweg ohne ShopGuide sieht aus wie ein Jackson Pollock Gemälde! 🖼️",
        "🔥 Hot Take: ShopGuide ist heißer als die Rabatte am Black Friday! 🔥",
        "🎪 Zaubertrick: Shift+S verwandelt Langeweile in Unterhaltung. Tadaaa! ✨",
        "🌊 Wellen-Effekt: Dein Shift+S-Klick hat gerade eine Welle der Freude ausgelöst! 🌊",
        "🎯 Treffer: Du hast den Code geknackt! Neo wäre stolz auf dich! 💻",
        "🍔 Burger-Fakt: Während du diesen Text liest, wurden weltweit 847 Burger verkauft. Relevant? Nein! 🍔",
        "🎭 Drama: Ohne ShopGuide ist jeder Einkauf ein Drama in 3 Akten. Mit uns? Ein Happy End! 🎬",
        "🌟 Sternstunde: Dies ist deine Sternstunde! Shift+S wird in deine Biografie aufgenommen! 📖",
        "🎪 Konfetti-Kanone: BOOM! 🎊 Du hast gerade virtuelles Konfetti freigeschaltet! (Imagine it!) 🎉",
        "🚀 Raketen-Wissenschaft: ShopGuide ist keine Raketenwissenschaft. Es ist besser! 🧑‍🚀",
        "🎨 Farben-Lehre: Grau = langweiliger Einkauf. Bunt = ShopGuide! 🌈",
        "🍀 Glücksklee: Du hast gerade ein vierblättriges Kleeblatt gefunden! Metaphorisch! 🍀",
        "🎪 Finale: Wenn Easter Eggs eine Show wären, wäre das hier der stehende Applaus! 👏"
    ];
    
    const randomStat = funnyStats[Math.floor(Math.random() * funnyStats.length)];
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s;
    `;
    
    const popup = document.createElement('div');
    popup.style.cssText = `
        background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
        color: white;
        padding: 3rem;
        border-radius: 20px;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.4s;
    `;
    
    popup.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
        <h2 style="margin: 0 0 1rem 0; font-size: 1.8rem;">Easter Egg gefunden!</h2>
        <p style="font-size: 1.2rem; line-height: 1.6; margin: 0 0 2rem 0;">${randomStat}</p>
        <button onclick="this.parentElement.parentElement.remove()" style="
            background: white;
            color: #27ae60;
            border: none;
            padding: 0.8rem 2rem;
            border-radius: 25px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Weiter gehts! 🚀
        </button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    easterEggActive = true;
    
    function closeOverlay() {
        overlay.remove();
        easterEggActive = false;
    }
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeOverlay();
        }
    });
    
    // Update button to use closeOverlay
    popup.querySelector('button').onclick = closeOverlay;
}

// Easter Egg 2: 30 Sekunden auf der Website - NUR EINMAL PRO SESSION
let timeOnSite = 0;
let thirtySecondPopupShown = sessionStorage.getItem('thirtySecondPopupShown') === 'true';

// Nur Zeit zählen wenn Tab aktiv ist
let isTabActive = true;
document.addEventListener('visibilitychange', function() {
    isTabActive = !document.hidden;
});

setInterval(function() {
    if (isTabActive && !thirtySecondPopupShown) {
        timeOnSite++;
        
        if (timeOnSite >= 30) {
            thirtySecondPopupShown = true;
            sessionStorage.setItem('thirtySecondPopupShown', 'true');
            showThirtySecondPopup();
        }
    }
}, 1000);

function showThirtySecondPopup() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.5s;
    `;
    
    const popup = document.createElement('div');
    popup.style.cssText = `
        background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
        color: white;
        padding: 3rem 2.5rem;
        border-radius: 20px;
        max-width: 550px;
        text-align: center;
        box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);
        animation: bounceIn 0.6s;
        position: relative;
    `;
    
    popup.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 1rem;">🎊</div>
        <h2 style="margin: 0 0 1rem 0; font-size: 2rem; font-weight: 700;">Wow, danke für dein Interesse!</h2>
        <p style="font-size: 1.1rem; line-height: 1.7; margin: 0 0 1.5rem 0; opacity: 0.95;">
            Du bist jetzt schon <strong>30 Sekunden</strong> hier und erkundest ShopGuide! 
            Das freut mich wirklich sehr. 🙌
        </p>
        <p style="font-size: 1rem; line-height: 1.6; margin: 0 0 2rem 0; opacity: 0.9;">
            ShopGuide revolutioniert den Einkauf - und du bist einer der Ersten, 
            die das Potenzial erkennen. Danke, dass du dir Zeit nimmst! 🚀
        </p>
        <button onclick="this.parentElement.parentElement.remove()" style="
            background: white;
            color: #2c3e50;
            border: none;
            padding: 1rem 2.5rem;
            border-radius: 30px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 20px rgba(0, 0, 0, 0.3)'" 
           onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px rgba(0, 0, 0, 0.2)'">
            Weiter entdecken! ✨
        </button>
        <p style="font-size: 0.8rem; margin: 1.5rem 0 0 0; opacity: 0.7;">
            PS: Probier mal Shift+S für ein weiteres Goodie! 😉
        </p>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}
// Easter Egg: Typ "supermarkt" irgendwo auf der Seite
let typedText = '';
let typeTimer = null;

document.addEventListener('keypress', function(e) {
    // Nur wenn kein Input-Feld aktiv ist
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        typedText += e.key.toLowerCase();
        
        if (typeTimer) clearTimeout(typeTimer);
        
        if (typedText.includes('supermarkt')) {
            showSupermarktEasterEgg();
            typedText = '';
        }
        
        typeTimer = setTimeout(function() {
            typedText = '';
        }, 2000);
    }
});

function showSupermarktEasterEgg() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #16a085 0%, #27ae60 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s;
    `;
    
    const popup = document.createElement('div');
    popup.style.cssText = `
        background: white;
        color: #2c3e50;
        padding: 3.5rem 3rem;
        border-radius: 25px;
        max-width: 550px;
        text-align: center;
        box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);
        animation: slideIn 0.5s;
    `;
    
    popup.innerHTML = `
        <div style="font-size: 4.5rem; margin-bottom: 1rem;">🏪🎊</div>
        <h2 style="margin: 0 0 1rem 0; font-size: 2rem; color: #27ae60;">Das Zauberwort!</h2>
        <p style="font-size: 1.2rem; line-height: 1.6; margin: 0 0 1.5rem 0;">
            Du hast "supermarkt" getippt! Genau darum geht es hier! 🎯
        </p>
        <p style="font-size: 1.1rem; line-height: 1.6; margin: 0 0 1.5rem 0;">
            <strong>Wusstest du?</strong> Das Wort "Supermarkt" wurde erstmals 1933 verwendet! 
            Aber erst 2026 wurde der Einkauf wirklich smart! 🧠✨
        </p>
        <p style="font-size: 1rem; margin: 0 0 2rem 0; color: #7f8c8d;">
            ShopGuide macht aus jedem Supermarkt einen... <em>Supermarkt!</em> 😄
        </p>
        <button onclick="this.parentElement.parentElement.remove()" style="
            background: linear-gradient(135deg, #27ae60, #229954);
            color: white;
            border: none;
            padding: 1rem 2.5rem;
            border-radius: 30px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Super! 🌟
        </button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

// Easter Egg: Shake/Rüttel das Fenster (Tab schnell wechseln)
let tabSwitchCount = 0;
let tabSwitchTimer = null;

document.addEventListener('visibilitychange', function() {
    tabSwitchCount++;
    
    if (tabSwitchTimer) clearTimeout(tabSwitchTimer);
    
    if (tabSwitchCount >= 5) {
        showTabShakeEasterEgg();
        tabSwitchCount = 0;
    }
    
    tabSwitchTimer = setTimeout(function() {
        tabSwitchCount = 0;
    }, 3000);
});

function showTabShakeEasterEgg() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s;
    `;
    
    const popup = document.createElement('div');
    popup.style.cssText = `
        background: white;
        color: #2c3e50;
        padding: 3.5rem 3rem;
        border-radius: 25px;
        max-width: 550px;
        text-align: center;
        box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);
        animation: shake 0.6s;
    `;
    
    popup.innerHTML = `
        <div style="font-size: 4.5rem; margin-bottom: 1rem;">🤹‍♂️</div>
        <h2 style="margin: 0 0 1rem 0; font-size: 2rem; color: #e67e22;">Multitasking-Meister!</h2>
        <p style="font-size: 1.2rem; line-height: 1.6; margin: 0 0 1.5rem 0;">
            Du wechselst Tabs wie ein DJ Platten! 🎧 5x hin und her in 3 Sekunden!
        </p>
        <p style="font-size: 1.1rem; line-height: 1.6; margin: 0 0 2rem 0;">
            Genau so fühlt man sich beim Einkaufen ohne ShopGuide - ständig hin und her! 
            Mit uns bleibst du fokussiert! 🎯
        </p>
        <button onclick="this.parentElement.parentElement.remove()" style="
            background: linear-gradient(135deg, #e67e22, #d35400);
            color: white;
            border: none;
            padding: 1rem 2.5rem;
            border-radius: 30px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Konzentration! 🧘‍♂️
        </button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

// Easter Egg: Drücke "E" für "Einkauf" 5x hintereinander
let eKeyPresses = 0;
let eKeyTimer = null;

document.addEventListener('keypress', function(e) {
    if (e.key.toLowerCase() === 'e' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        eKeyPresses++;
        
        if (eKeyTimer) clearTimeout(eKeyTimer);
        
        if (eKeyPresses >= 5) {
            showEinkaufEasterEgg();
            eKeyPresses = 0;
        }
        
        eKeyTimer = setTimeout(function() {
            eKeyPresses = 0;
        }, 1500);
    }
});

function showEinkaufEasterEgg() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s;
    `;
    
    const popup = document.createElement('div');
    popup.style.cssText = `
        background: white;
        color: #2c3e50;
        padding: 3.5rem 3rem;
        border-radius: 25px;
        max-width: 550px;
        text-align: center;
        box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);
        animation: bounceIn 0.6s;
    `;
    
    popup.innerHTML = `
        <div style="font-size: 4.5rem; margin-bottom: 1rem;">🛒🎉</div>
        <h2 style="margin: 0 0 1rem 0; font-size: 2rem; color: #16a085;">EEEEE-inkaufen!</h2>
        <p style="font-size: 1.2rem; line-height: 1.6; margin: 0 0 1.5rem 0;">
            Du hast 5x "E" gedrückt! Das "E" in ShopGuide steht für: 
            <strong>Effizient!</strong> ⚡
        </p>
        <p style="font-size: 1.1rem; line-height: 1.6; margin: 0 0 1.5rem 0;">
            Und auch für: <strong>E</strong>infach, <strong>E</strong>lastisch, <strong>E</strong>xzellent, 
            <strong>E</strong>rstklassig und <strong>E</strong>motional! 💚
        </p>
        <p style="font-size: 1rem; margin: 0 0 2rem 0; color: #7f8c8d;">
            Aber hauptsächlich für: <em>Einkaufen war noch nie so easy!</em> 😎
        </p>
        <button onclick="this.parentElement.parentElement.remove()" style="
            background: linear-gradient(135deg, #16a085, #138d75);
            color: white;
            border: none;
            padding: 1rem 2.5rem;
            border-radius: 30px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Echt cool! 🌟
        </button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

// CSS-Animationen für die Easter Eggs
const easterEggStyles = document.createElement('style');
easterEggStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70% { transform: translateX(-5px); }
        20%, 40%, 60% { transform: translateX(5px); }
    }
`;
document.head.appendChild(easterEggStyles);
// CSS Animationen für die Popups
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from {
            transform: translateY(-50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes bounceIn {
        0% {
            transform: scale(0.3);
            opacity: 0;
        }
        50% {
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
`;

document.head.appendChild(style);

/* ========================================
   ACTIVE PAGE HIGHLIGHTING
   ======================================== */

/**
 * Markiert die aktive Seite im Settings Panel basierend auf der aktuellen URL
 */
function highlightActivePage() {
    // Hole den aktuellen Dateinamen aus der URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Mapping von Dateinamen zu data-page Werten
    const pageMapping = {
        'index.html': 'homepage',
        'customer-verify.html': 'customer-verify',
        'customer-dashboard.html': 'customer-dashboard',
        'merchant-verify.html': 'merchant-verify',
        'merchant-dashboard.html': 'merchant-dashboard',
        'about.html': 'about',
        'impressum.html': 'impressum',
        'datenschutz.html': 'datenschutz',
        'faq.html': 'faq',
        'rewe-partner.html': 'rewe-partner'
    };
    
    const activePageId = pageMapping[currentPage] || 'homepage';
    
    // Entferne active class von allen Links
    document.querySelectorAll('.panel-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Füge active class zum aktuellen Link hinzu
    const activeLink = document.querySelector(`.panel-nav-link[data-page="${activePageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Rufe die Funktion beim Laden der Seite auf
document.addEventListener('DOMContentLoaded', highlightActivePage);
/* ========================================
   PWA REGISTRATION + INSTALL BANNER
   → Diesen Block ans Ende von script.js anhängen
   ======================================== */

// Service Worker registrieren
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .catch(err => console.log('SW registration failed:', err));
    });
}

// Install-Banner Logic
let deferredPrompt = null;
const banner = document.getElementById('pwa-install-banner');

// Android/Chrome: beforeinstallprompt abfangen
window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;

    // Banner nur zeigen wenn noch nicht installiert & nicht weggeklickt
    const dismissed = sessionStorage.getItem('pwa-banner-dismissed');
    if (!dismissed && banner) {
        banner.style.display = 'flex';
    }
});

// "Hinzufügen"-Button
function pwaInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(result => {
        deferredPrompt = null;
        if (banner) banner.classList.add('hidden');
    });
}

// "×"-Button
function pwaDismiss() {
    if (banner) banner.classList.add('hidden');
    sessionStorage.setItem('pwa-banner-dismissed', '1');
}

// iOS Safari: kein beforeinstallprompt → manuellen Hinweis zeigen
const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isInStandaloneMode = window.navigator.standalone === true;

if (isIos && !isInStandaloneMode && banner) {
    const dismissed = sessionStorage.getItem('pwa-banner-dismissed');
    if (!dismissed) {
        // iOS-spezifischen Text setzen
        const textEl = banner.querySelector('.pwa-text span');
        const btnEl  = banner.querySelector('.pwa-btn-install');
        if (textEl) textEl.textContent = 'Tippe auf Teilen → "Zum Home-Bildschirm"';
        if (btnEl)  { btnEl.textContent = 'OK'; btnEl.onclick = pwaDismiss; }
        banner.style.display = 'flex';
    }
}
/* ========================================
   SHOPGUIDE SERVICE WORKER
   Cached für Offline-Fähigkeit & schnellere Ladezeiten
   ======================================== */

const CACHE_NAME = 'shopguide-v1';

// Diese Dateien werden sofort gecacht (App-Shell)
const PRECACHE_URLS = [
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/favicon.png',
  '/favicon-32x32.png',
  '/favicon-180x180.png',
  '/hero-background.png',
  '/edeka.png',
  '/rewe.png',
  '/aldi.png',
  '/lidl.png',
  '/penny.png',
  '/netto.png'
];

// Installation: App-Shell sofort cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Aktivierung: alte Caches löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Cache-first für Assets, Network-first für HTML-Seiten
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Nur eigene Requests cachen (kein CDN, kein Analytics)
  if (url.origin !== location.origin) return;

  // HTML-Seiten: Network-first (immer aktuellen Inhalt zeigen)
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Assets (CSS, JS, Bilder): Cache-first für Geschwindigkeit
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});