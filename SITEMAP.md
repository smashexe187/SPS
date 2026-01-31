# ShopGuide - Seitenübersicht

## Alle Seiten der Website

### 🏠 Homepage
**Datei:** `index.html`  
**URL:** `/` oder `/index.html`  
**Beschreibung:** Startseite mit Auswahl zwischen Kunden- und Händlerbereich

**Navigation zu:**
- `customer-verify.html` (Kunde-Button)
- `merchant-verify.html` (Händler-Button)
- `impressum.html` (Footer)
- `datenschutz.html` (Footer)

---

### 🛒 Kundenverifizierung
**Datei:** `customer-verify.html`  
**URL:** `/customer-verify.html`  
**Beschreibung:** Bestätigungsseite für Kunden vor Demo-Zugang

**Navigation zu:**
- `index.html` (Zurück-Button)
- `customer-dashboard.html` (Nach Checkbox-Bestätigung)
- `impressum.html` (Footer)
- `datenschutz.html` (Footer)

---

### 🛒 Kundendemo
**Datei:** `customer-dashboard.html`  
**URL:** `/customer-dashboard.html`  
**Beschreibung:** Interaktive Demo der ShopGuide-App für Kunden

**Features:**
- Interaktive App-Demo mit Scan-Funktion
- Story-Section (Sarah's Geschichte)
- Vorteile für Kunden

**Navigation zu:**
- `customer-verify.html` (Zurück-Button)
- `index.html` (Logo)
- `impressum.html` (Footer)
- `datenschutz.html` (Footer)

---

### 🏪 Händlerverifizierung
**Datei:** `merchant-verify.html`  
**URL:** `/merchant-verify.html`  
**Beschreibung:** Bestätigungsseite für Händler vor Dashboard-Zugang

**Navigation zu:**
- `index.html` (Zurück-Button)
- `merchant-dashboard.html` (Nach Checkbox-Bestätigung)
- `impressum.html` (Footer)
- `datenschutz.html` (Footer)

---

### 🏪 Händler-Dashboard
**Datei:** `merchant-dashboard.html`  
**URL:** `/merchant-dashboard.html`  
**Beschreibung:** Business-Dashboard für Händler

**Features:**
- Animierte Statistiken
- ROI-Rechner (interaktiv)
- Ladenlayout-Planer (interaktiv)
- Kontaktbereich mit Copy-to-Clipboard

**Navigation zu:**
- `merchant-verify.html` (Zurück-Button)
- `index.html` (Logo)
- `impressum.html` (Footer)
- `datenschutz.html` (Footer)

---

### 📄 Impressum
**Datei:** `impressum.html`  
**URL:** `/impressum.html`  
**Beschreibung:** Rechtliche Informationen und Firmendaten

**Inhalte:**
- Firmeninformationen (SPS Smart-Path-Solutions GmbH i.G.)
- Kontaktdaten
- Registereinträge
- Haftungsausschlüsse

**Navigation zu:**
- `index.html` (Zurück-Button & Logo)
- `datenschutz.html` (Footer)

---

### 🔒 Datenschutz
**Datei:** `datenschutz.html`  
**URL:** `/datenschutz.html`  
**Beschreibung:** Datenschutzerklärung gemäß DSGVO

**Inhalte:**
- Datenerfassung und -verwendung
- Rechte der Nutzer
- Server-Log-Dateien
- Kontaktformular-Informationen

**Navigation zu:**
- `index.html` (Zurück-Button & Logo)
- `impressum.html` (Footer)

---

## Navigationsfluss

```
index.html (Homepage)
    ├── customer-verify.html
    │       └── customer-dashboard.html
    │
    ├── merchant-verify.html
    │       └── merchant-dashboard.html
    │
    ├── impressum.html
    │
    └── datenschutz.html
```

## Gemeinsame Elemente auf allen Seiten

Jede Seite enthält:
- ✅ Navigation Bar (Logo + Settings-Icon)
- ✅ Settings Panel (Dark Mode Toggle)
- ✅ Scroll Progress Indicator
- ✅ Back-to-Top Button
- ✅ Glass Background Animation
- ✅ Footer mit Links zu Impressum & Datenschutz

## JavaScript-Funktionen pro Seite

### Auf allen Seiten:
- `toggleSettingsPanel()` - Öffnet/Schließt Settings
- `toggleDarkMode()` - Wechselt zwischen Light/Dark Mode
- `scrollToTop()` - Scrollt nach oben
- `updateScrollProgress()` - Aktualisiert Scroll-Indikator

### Nur auf customer-dashboard.html:
- `runCustomerDemo()` - Startet die App-Demo
- `resetCustomerDemo()` - Setzt die Demo zurück

### Nur auf merchant-dashboard.html:
- `calculateROI()` - Berechnet ROI
- `saveLayout()` - Speichert Ladenlayout
- `loadSampleLayout()` - Lädt Beispiel-Layout
- `printLayout()` - Druckt Layout
- `copyToClipboard()` - Kopiert Kontaktdaten
- `bookConsultation()` - Terminbuchung
- `applyPilot()` - Pilot-Bewerbung
- `requestBusinessCase()` - Business-Case anfragen
