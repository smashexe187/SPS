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
 * Startet die Demo-Animation der Kunden-App
 */
function runCustomerDemo() {
    const scanner = document.getElementById('customer-scanner');
    const scanBtn = document.getElementById('scan-btn');
    const scanScreen = document.getElementById('customer-screen-scan');
    const resultScreen = document.getElementById('customer-screen-result');

    scanner.style.display = 'block';
    scanBtn.innerText = 'Scanne...';
    scanBtn.disabled = true;

    setTimeout(() => {
        scanner.style.display = 'none';
        scanScreen.style.display = 'none';
        resultScreen.style.display = 'flex';
    }, 2000);
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
    const email = "lerchjannik7@gmail.com";
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
    const email = "lerchjannik7@gmail.com";
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
    const email = "lerchjannik7@gmail.com";
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

