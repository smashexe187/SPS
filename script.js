/* ========================================
   SHOPGUIDE - HAUPTLOGIK
   ========================================
   Diese Datei steuert alle interaktiven Funktionen
   der ShopGuide-Website:
   - Seitennavigation
   - Verifizierung (Kunden/Händler)
   - App-Demo
   - ROI-Rechner
   - Ladenlayout-Planer
======================================== */

"use strict";

/* ========================================
   1. SEITEN-NAVIGATION
   ======================================== */

/**
 * Wechselt zwischen verschiedenen Seiten der Single-Page-Application
 * @param {string} pageId - Die ID der anzuzeigenden Seite
 * 
 * Funktionsweise:
 * - Entfernt 'active' class von allen Seiten (blendet sie aus)
 * - Fügt 'active' class zur Zielseite hinzu (blendet sie ein)
 * - Scrollt zum Seitenanfang
 */
function showPage(pageId) {
    // Alle vorhandenen Seiten finden
    const pages = document.querySelectorAll('.page');
    
    // Alle Seiten durchgehen und ausblenden
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Die gewünschte Zielseite finden
    const targetPage = document.getElementById(pageId);
    
    // Wenn die Seite existiert: einblenden und nach oben scrollen
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0); // Scrollt zur obersten Position
    }
}


/* ========================================
   2. CHECKBOX-VALIDIERUNG
   ======================================== */

/**
 * Event-Listener der ausgeführt wird, sobald das DOM vollständig geladen ist
 * Initialisiert die Checkbox-Logik für beide Verifizierungsseiten
 */
document.addEventListener('DOMContentLoaded', () => {
    
    /* --- KUNDEN-BEREICH --- */
    // Elemente aus dem DOM holen
    const custCheck = document.getElementById('customer-confirm');  // Checkbox
    const custBtn = document.getElementById('customer-proceed');    // Button
    
    // Nur ausführen, wenn beide Elemente existieren
    if(custCheck && custBtn) {
        // Event-Listener: Reagiert auf Checkbox-Änderungen
        custCheck.addEventListener('change', function() {
            if (this.checked) {
                // Checkbox aktiviert → Button aktivieren
                custBtn.disabled = false;
                custBtn.style.opacity = '1';
                custBtn.style.cursor = 'pointer';
            } else {
                // Checkbox deaktiviert → Button deaktivieren
                custBtn.disabled = true;
                custBtn.style.opacity = '0.5';
                custBtn.style.cursor = 'not-allowed';
            }
        });
    }

    /* --- HÄNDLER-BEREICH --- */
    // Gleiche Logik für den Händler-Bereich
    const merchCheck = document.getElementById('merchant-confirm');
    const merchBtn = document.getElementById('merchant-proceed');

    if(merchCheck && merchBtn) {
        merchCheck.addEventListener('change', function() {
            if (this.checked) {
                // Checkbox aktiviert → Button aktivieren
                merchBtn.disabled = false;
                merchBtn.style.opacity = '1';
                merchBtn.style.cursor = 'pointer';
            } else {
                // Checkbox deaktiviert → Button deaktivieren
                merchBtn.disabled = true;
                merchBtn.style.opacity = '0.5';
                merchBtn.style.cursor = 'not-allowed';
            }
        });
    }
});


/* ========================================
   3. KUNDEN APP-DEMO
   ======================================== */

/**
 * Startet die Demo-Animation der Kunden-App
 * Simuliert das Scannen eines Einkaufszettels und zeigt das Ergebnis
 */
function runCustomerDemo() {
    // Alle relevanten UI-Elemente aus dem DOM holen
    const scanner = document.getElementById('customer-scanner');      // Scan-Overlay
    const scanBtn = document.getElementById('scan-btn');              // Scan-Button
    const scanScreen = document.getElementById('customer-screen-scan');    // Scan-Bildschirm
    const resultScreen = document.getElementById('customer-screen-result'); // Ergebnis-Bildschirm

    // Scan-Animation starten
    scanner.style.display = 'block';  // Overlay einblenden
    scanBtn.innerText = 'Scanne...';  // Button-Text ändern
    scanBtn.disabled = true;          // Button während des Scannens deaktivieren

    // Nach 2 Sekunden zum Ergebnis wechseln
    setTimeout(() => {
        scanner.style.display = 'none';      // Overlay ausblenden
        scanScreen.style.display = 'none';   // Scan-Screen ausblenden
        resultScreen.style.display = 'flex'; // Ergebnis-Screen einblenden
    }, 2000); // 2000ms = 2 Sekunden
}

/**
 * Setzt die Demo zurück auf den Ausgangszustand
 * Ermöglicht es, die Demo erneut zu starten
 */
function resetCustomerDemo() {
    // Bildschirme zurücksetzen
    document.getElementById('customer-screen-scan').style.display = 'flex';
    document.getElementById('customer-screen-result').style.display = 'none';
    
    // Button-Status zurücksetzen
    const scanBtn = document.getElementById('scan-btn');
    scanBtn.innerText = 'Zettel scannen';
    scanBtn.disabled = false;
}


/* ========================================
   4. HÄNDLER ROI-RECHNER
   ======================================== */

/**
 * Berechnet das Einsparpotenzial für Händler
 * Basiert auf Kundenanzahl, Anfragen und Stundenlohn
 * 
 * Formel:
 * - Jede Kundenanfrage = 2 Minuten Personalzeit
 * - Stunden pro Tag = (Anfragen × 2) ÷ 60
 * - Monatlich = Tageswert × 25 Arbeitstage
 * - Geldersparnis = Stunden × Stundenlohn
 */
function calculateROI() {
    // Eingabewerte aus den Formularfeldern lesen
    // parseFloat wandelt String in Zahl um, || 0 setzt Default auf 0
    const customers = parseFloat(document.getElementById('customerCount').value) || 0;
    const questions = parseFloat(document.getElementById('questionsCount').value) || 0;
    const wage = parseFloat(document.getElementById('hourlyWage').value) || 0;

    // Berechnung: Jede Frage dauert 2 Minuten
    // Beispiel: 50 Fragen × 2 Min = 100 Min = 1,67 Stunden
    const hoursSavedPerDay = (questions * 2) / 60;
    
    // Monatliche Berechnung (25 Arbeitstage)
    const hoursSavedPerMonth = hoursSavedPerDay * 25;
    
    // Finanzielle Ersparnis
    const moneySavedPerMonth = hoursSavedPerMonth * wage;

    // Ergebnisse im DOM anzeigen
    // Math.round() rundet auf ganze Zahlen
    document.getElementById('timeSaved').innerText = Math.round(hoursSavedPerMonth) + " Std.";
    
    // toLocaleString formatiert die Zahl im deutschen Format (z.B. 1.500 €)
    document.getElementById('moneySaved').innerText = Math.round(moneySavedPerMonth).toLocaleString('de-DE') + " €";
    
    // Ergebnis-Box einblenden
    document.getElementById('calc-result').style.display = 'block';
}


/* ========================================
   5. LADENLAYOUT-PLANER LOGIK
   ======================================== */

// Globale Variablen für den aktuellen Werkzeug-Status
let currentTool = 'wall';           // Aktuell ausgewähltes Werkzeug (default: Wand)
let currentToolEmoji = '🧱';        // Emoji des aktuellen Werkzeugs

/**
 * Initialisierung des Layout-Planers
 * Wird ausgeführt, sobald das DOM geladen ist
 */
document.addEventListener('DOMContentLoaded', () => {
    // Grid-Container aus dem DOM holen
    const grid = document.getElementById('store-grid');
    
    // Wenn kein Grid vorhanden, Funktion beenden
    if (!grid) return;

    /* --- GRID ERSTELLEN --- */
    // 100 Zellen für ein 10×10 Raster erstellen
    for (let i = 0; i < 100; i++) {
        // Neue Zelle erstellen
        const cell = document.createElement('div');
        
        // Koordinaten berechnen
        const row = String.fromCharCode(65 + Math.floor(i / 10)); // 65 = 'A' in ASCII
        const col = (i % 10) + 1;                                  // Spalte 1-10
        
        // Koordinate formatieren (z.B. "A-01", "B-05")
        const coord = `${row}-${col < 10 ? '0' + col : col}`;
        
        // Koordinate als data-Attribut speichern
        cell.dataset.coord = coord;
        
        /* --- EVENT-LISTENER FÜR JEDE ZELLE --- */
        
        // Klick-Event: Werkzeug anwenden
        cell.addEventListener('mousedown', () => applyTool(cell));
        
        // Hover-Event: Koordinaten anzeigen + Zeichnen bei gedrückter Maustaste
        cell.addEventListener('mouseover', (e) => {
            // Koordinaten-Display aktualisieren
            document.getElementById('coord-display').innerText = coord;
            
            // Wenn Maustaste gedrückt (e.buttons === 1), Werkzeug anwenden
            // Ermöglicht "Zeichnen" durch Ziehen mit der Maus
            if (e.buttons === 1) applyTool(cell);
        });
        
        // Zelle zum Grid hinzufügen
        grid.appendChild(cell);
    }

    /* --- WERKZEUG-AUSWAHL --- */
    // Event-Listener für alle Tool-Buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Spezialfall: "Alles löschen" Button
            if (this.id === 'clear-grid') {
                // Alle Zellen zurücksetzen
                document.querySelectorAll('#store-grid div').forEach(c => {
                    c.className = '';    // CSS-Klasse entfernen
                    c.innerText = '';    // Emoji entfernen
                });
                updateStats();           // Statistik aktualisieren
                return;                  // Funktion beenden
            }
            
            // Normaler Werkzeug-Button:
            // 1. Alle Buttons deaktivieren (active-class entfernen)
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            
            // 2. Aktuellen Button aktivieren
            this.classList.add('active');
            
            // 3. Werkzeug-Status aktualisieren
            currentTool = this.dataset.tool;                    // z.B. "shelf", "wall"
            currentToolEmoji = this.innerText.split(' ')[0];   // Erstes Wort (das Emoji)
            
            // 4. Anzeige aktualisieren
            document.getElementById('current-tool').innerText = this.innerText;
        });
    });
});

/**
 * Wendet das aktuell ausgewählte Werkzeug auf eine Zelle an
 * @param {HTMLElement} cell - Die Zelle, auf die das Werkzeug angewendet wird
 */
function applyTool(cell) {
    if (currentTool === 'delete') {
        // Löschen-Werkzeug: Zelle zurücksetzen
        cell.className = '';
        cell.innerText = '';
    } else {
        // Anderes Werkzeug: Klasse und Emoji setzen
        cell.className = currentTool;      // CSS-Klasse (z.B. "shelf", "wall")
        cell.innerText = currentToolEmoji;  // Emoji anzeigen
    }
    
    // Nach jeder Änderung Statistik aktualisieren
    updateStats();
}

/**
 * Aktualisiert die Statistik-Anzeige
 * Zählt verschiedene Elemente im Grid
 */
function updateStats() {
    // Anzahl der Regale zählen (Elemente mit class="shelf")
    const shelves = document.querySelectorAll('#store-grid .shelf').length;
    
    // Gesamtanzahl aller platzierten Elemente (nicht-leere Zellen)
    const total = document.querySelectorAll('#store-grid div:not(:empty)').length;
    
    // Werte im DOM aktualisieren
    document.getElementById('shelf-count').innerText = shelves;
    document.getElementById('total-items').innerText = total;
    document.getElementById('area-used').innerText = total + "%";  // % der genutzten Fläche
}


/* ========================================
   6. DUMMY-FUNKTIONEN FÜR LAYOUT-AKTIONEN
   ======================================== */

/**
 * Speichert das Layout (Platzhalter-Funktion)
 * TODO: Implementierung mit Backend/LocalStorage
 */
function saveLayout() { 
    alert("Layout wurde in der Cloud gespeichert!"); 
}

/**
 * Lädt ein vordefiniertes Beispiel-Layout
 * Erstellt einen realistischen Supermarkt-Grundriss
 */
function loadSampleLayout() { 
    // Zuerst alles löschen
    document.querySelectorAll('#store-grid div').forEach(c => {
        c.className = '';
        c.innerText = '';
    });
    
    // Beispiel-Layout Daten
    // Format: {coordinate: {tool: 'toolname', emoji: '🔧'}}
    const sampleLayout = {
        // Eingang unten mittig (J-05, J-06)
        'J-05': {tool: 'entrance', emoji: '🚪'},
        'J-06': {tool: 'entrance', emoji: '🚪'},
        
        // Kassen unten (J-04, J-07)
        'J-04': {tool: 'cash', emoji: '💰'},
        'J-07': {tool: 'cash', emoji: '💰'},
        
        // Wände außen (Rahmen)
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
        
        // Kühlregale hinten (A-02 bis A-09)
        'A-02': {tool: 'cooling', emoji: '❄️'}, 'A-03': {tool: 'cooling', emoji: '❄️'},
        'A-04': {tool: 'cooling', emoji: '❄️'}, 'A-05': {tool: 'cooling', emoji: '❄️'},
        'A-06': {tool: 'cooling', emoji: '❄️'}, 'A-07': {tool: 'cooling', emoji: '❄️'},
        'A-08': {tool: 'cooling', emoji: '❄️'}, 'A-09': {tool: 'cooling', emoji: '❄️'},
        
        // Regal-Gang 1 (B-03 bis B-08)
        'B-03': {tool: 'shelf', emoji: '📦'}, 'B-04': {tool: 'shelf', emoji: '📦'},
        'B-05': {tool: 'shelf', emoji: '📦'}, 'B-06': {tool: 'shelf', emoji: '📦'},
        'B-07': {tool: 'shelf', emoji: '📦'}, 'B-08': {tool: 'shelf', emoji: '📦'},
        
        // Regal-Gang 2 (D-03 bis D-08)
        'D-03': {tool: 'shelf', emoji: '📦'}, 'D-04': {tool: 'shelf', emoji: '📦'},
        'D-05': {tool: 'shelf', emoji: '📦'}, 'D-06': {tool: 'shelf', emoji: '📦'},
        'D-07': {tool: 'shelf', emoji: '📦'}, 'D-08': {tool: 'shelf', emoji: '📦'},
        
        // Regal-Gang 3 (F-03 bis F-08)
        'F-03': {tool: 'shelf', emoji: '📦'}, 'F-04': {tool: 'shelf', emoji: '📦'},
        'F-05': {tool: 'shelf', emoji: '📦'}, 'F-06': {tool: 'shelf', emoji: '📦'},
        'F-07': {tool: 'shelf', emoji: '📦'}, 'F-08': {tool: 'shelf', emoji: '📦'},
        
        // Regal-Gang 4 (H-03 bis H-08)
        'H-03': {tool: 'shelf', emoji: '📦'}, 'H-04': {tool: 'shelf', emoji: '📦'},
        'H-05': {tool: 'shelf', emoji: '📦'}, 'H-06': {tool: 'shelf', emoji: '📦'},
        'H-07': {tool: 'shelf', emoji: '📦'}, 'H-08': {tool: 'shelf', emoji: '📦'},
    };
    
    // Layout auf das Grid anwenden
    document.querySelectorAll('#store-grid div').forEach(cell => {
        const coord = cell.dataset.coord;
        if (sampleLayout[coord]) {
            cell.className = sampleLayout[coord].tool;
            cell.innerText = sampleLayout[coord].emoji;
        }
    });
    
    // Statistik aktualisieren
    updateStats();
    
    // Bestätigung anzeigen
    alert("Beispiel-Layout geladen: Supermarkt mit 4 Regal-Gängen, Kühlzone und Kassenbereich!");
}

/**
 * Exportiert/Druckt das Layout
 * Nutzt die Browser-Druckfunktion
 */
function printLayout() { 
    window.print(); 
}


/* ========================================
   7. BEARBEITUNGSMODUS (OPTIONAL)
   ======================================== 
   Verhindert ungewolltes Scrollen während der Bearbeitung
*/

// Status-Variable für Bearbeitungsmodus
let isEditing = false;

/**
 * Aktiviert den Bearbeitungsmodus
 * Verhindert Scrollen im Grid
 */
function startEditing() {
    isEditing = true;
    
    // Overflow ausschalten (kein Scrollen möglich)
    document.querySelector('.grid').style.overflow = 'hidden';
    
    // Scroll-Event abfangen
    document.querySelector('.grid').addEventListener('wheel', preventScroll, { passive: false });
}

/**
 * Deaktiviert den Bearbeitungsmodus
 * Erlaubt wieder normales Scrollen
 */
function stopEditing() {
    isEditing = false;
    
    // Overflow wieder erlauben
    document.querySelector('.grid').style.overflow = 'auto';
    
    // Event-Listener entfernen
    document.querySelector('.grid').removeEventListener('wheel', preventScroll);
}

/**
 * Verhindert Scroll-Events im Bearbeitungsmodus
 * @param {Event} e - Das Wheel-Event
 */
function preventScroll(e) {
    if (isEditing) {
        e.preventDefault(); // Standard-Scroll-Verhalten unterdrücken
    }
}

/* --- EVENT-LISTENER FÜR BEARBEITUNGSMODUS --- */

// Bearbeitungsmodus starten, wenn ein Tool ausgewählt wird
document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        startEditing();
    });
});

// Bearbeitungsmodus beenden (benötigt einen "Fertig"-Button im HTML)
// ACHTUNG: Dieser Button existiert nicht im aktuellen HTML!
// Falls benötigt, muss er erst hinzugefügt werden
const doneBtn = document.querySelector('.done-btn');
if (doneBtn) {
    doneBtn.addEventListener('click', () => {
        stopEditing();
    });
}


/**
 * Leitet zur Google Cloud weiter, um das Layout zu speichern
 * Nutzer muss sich dort anmelden und kann dann die Datei speichern
 */
function saveLayout() { 
    // Prüfen ob ein Layout existiert
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
        window.open('https://cloud.google.com/free?utm_source=google&utm_medium=cpc&utm_campaign=Cloud-SS-DR-GCP-1713666-GCP-DR-EMEA-DE-de-Google-BKWS-MIX-na&utm_content=c-Hybrid+%7C+BKWS+-+MIX+%7C+Txt+-+Generic+Cloud-Cloud+Generic-Core+GCP-6458750523&utm_term=google+cloud&gclsrc=aw.ds&gad_source=1&gad_campaignid=20535180210&gclid=CjwKCAiAj8LLBhAkEiwAJjbY7_LjTNQwiJm-6qF8cTyAtGcXChqJTVukgpBb927wTfD-OXQpwEXMnhoCQP4QAvD_BwE', '_blank');
        
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
 * @returns {Object} Layout-Daten im strukturierten Format
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
 * Exportiert das Layout als JSON-Datei
 * Diese Datei kann dann manuell zu Google Cloud hochgeladen werden
 */
function exportLayoutJSON() {
    const cells = document.querySelectorAll('#store-grid div:not(:empty)');
    
    if (cells.length === 0) {
        alert("⚠️ Kein Layout zum Exportieren vorhanden!");
        return;
    }
    
    const layoutData = collectLayoutData();
    
    // Metadata hinzufügen
    const exportData = {
        version: "1.0",
        shopName: prompt("Laden-Name für Export:", "Mein Supermarkt") || "Unbenannt",
        createdAt: new Date().toISOString(),
        statistics: {
            shelves: document.querySelectorAll('#store-grid .shelf').length,
            walls: document.querySelectorAll('#store-grid .wall').length,
            cooling: document.querySelectorAll('#store-grid .cooling').length,
            total: cells.length
        },
        layout: layoutData
    };
    
    // JSON erstellen und als Datei herunterladen
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopguide-layout-${exportData.shopName.replace(/\s+/g, '-')}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`✅ Layout als JSON exportiert!\n\n` +
          `📁 Dateiname: ${a.download}\n\n` +
          `☁️ Sie können diese Datei jetzt zu Google Cloud Storage hochladen:\n` +
          `1. Gehen Sie zu console.cloud.google.com/storage\n` +
          `2. Erstellen Sie einen Bucket oder wählen einen aus\n` +
          `3. Laden Sie die JSON-Datei hoch\n\n` +
          `💡 Für automatische Integration kontaktieren Sie unser Support-Team.`);
}

/**
 * Importiert ein Layout aus einer JSON-Datei
 * @param {Event} event - File input change event
 */
function importLayoutJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);
            
            // Validierung
            if (!importData.layout) {
                throw new Error("Ungültiges Layout-Format");
            }
            
            // Grid leeren
            document.querySelectorAll('#store-grid div').forEach(c => {
                c.className = '';
                c.innerText = '';
            });
            
            // Layout anwenden
            document.querySelectorAll('#store-grid div').forEach(cell => {
                const coord = cell.dataset.coord;
                if (importData.layout[coord]) {
                    cell.className = importData.layout[coord].tool;
                    cell.innerText = importData.layout[coord].emoji;
                }
            });
            
            updateStats();
            
            alert(`✅ Layout "${importData.shopName}" erfolgreich importiert!\n\n` +
                  `📊 Statistik:\n` +
                  `• Erstellt am: ${new Date(importData.createdAt).toLocaleString('de-DE')}\n` +
                  `• Regale: ${importData.statistics.shelves}\n` +
                  `• Elemente gesamt: ${importData.statistics.total}`);
            
        } catch (error) {
            alert(`❌ Fehler beim Importieren:\n${error.message}\n\nBitte verwenden Sie eine gültige ShopGuide-Layoutdatei.`);
        }
    };
    reader.readAsText(file);
    
    // Input zurücksetzen für wiederholte Imports
    event.target.value = '';
}

/* ========================================
   8. HÄNDLER-KONTAKT FUNKTIONEN
   ======================================== */

/**
 * Öffnet Email-Client für Beratungsgespräch-Anfrage
 */
function bookConsultation() {
    const email = "lerchjannik7@gmail.com"; // Hier deine Email-Adresse eintragen
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

    // mailto-Link erstellen und öffnen
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Öffnet Email-Client für Pilot-Programm-Bewerbung
 */
function applyPilot() {
    const email = "lerchjannik7@gmail.com"; // Hier deine Email-Adresse eintragen
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
    const email = "lerchjannik7@gmail.com"; // Hier deine Email-Adresse eintragen
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

/**
 * Zeigt gespeicherte Layouts in einer Übersicht
 */
function showSavedLayouts() {
    const savedLayouts = JSON.parse(localStorage.getItem('shopguide_layouts') || '{}');
    const layoutNames = Object.keys(savedLayouts);
    
    if (layoutNames.length === 0) return;
    
    const loadExisting = confirm(
        `💾 Gespeicherte Layouts (${layoutNames.length}):\n\n` +
        layoutNames.map((name, i) => `${i + 1}. ${name}`).join('\n') +
        `\n\nMöchten Sie ein Layout laden?`
    );
    
    if (loadExisting) {
        const selectedName = prompt(
            "Geben Sie den Namen des zu ladenden Layouts ein:\n\n" +
            layoutNames.join('\n')
        );
        
        if (selectedName && savedLayouts[selectedName]) {
            loadLayoutFromStorage(selectedName);
        }
    }
}

/**
 * Lädt ein gespeichertes Layout aus dem LocalStorage
 * @param {string} layoutName - Name des zu ladenden Layouts
 */
function loadLayoutFromStorage(layoutName) {
    const savedLayouts = JSON.parse(localStorage.getItem('shopguide_layouts') || '{}');
    const layout = savedLayouts[layoutName];
    
    if (!layout) {
        alert("Layout nicht gefunden!");
        return;
    }
    
    // Grid leeren
    document.querySelectorAll('#store-grid div').forEach(c => {
        c.className = '';
        c.innerText = '';
    });
    
    // Layout anwenden
    document.querySelectorAll('#store-grid div').forEach(cell => {
        const coord = cell.dataset.coord;
        if (layout.data[coord]) {
            cell.className = layout.data[coord].tool;
            cell.innerText = layout.data[coord].emoji;
        }
    });
    
    updateStats();
    
    alert(`✅ Layout "${layoutName}" geladen!\n\nErstellt: ${new Date(layout.timestamp).toLocaleString('de-DE')}`);
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
    
    // Toggle active class
    panel.classList.toggle('active');
    overlay.classList.toggle('active');
}

/**
 * Schaltet zwischen Dark und Light Mode um
 * Speichert die Präferenz im LocalStorage
 */
function toggleDarkMode() {
    const isDarkMode = document.getElementById('darkModeToggle').checked;
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
}

/**
 * Lädt die Dark Mode Präferenz beim Seitenstart
 */
document.addEventListener('DOMContentLoaded', () => {
    // Prüfe gespeicherte Präferenz
    const darkModePreference = localStorage.getItem('darkMode');
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (darkModePreference === 'enabled') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.checked = true;
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
            }
        }
    });
});
