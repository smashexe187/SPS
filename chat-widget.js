/* ═══════════════════════════════════════════════════════════════════
   ShopGuide — KI Chat-Widget
   Self-contained: injiziert eigenes CSS + HTML, kein Framework nötig
═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (document.getElementById('sg-chat-root')) return;

  /* ── CSS ─────────────────────────────────────────────────────────── */
  const CSS = `
  #sg-chat-root {
    position: fixed; bottom: 28px; right: 28px;
    z-index: 9990; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  }

  /* ── Bubble ── */
  #sg-bubble {
    width: 62px; height: 62px; border-radius: 50%;
    background: linear-gradient(135deg, #27ae60 0%, #1a9048 100%);
    box-shadow: 0 6px 24px rgba(39,174,96,0.55), 0 2px 8px rgba(0,0,0,0.18),
                inset 0 1px 0 rgba(255,255,255,0.30);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 27px;
    transition: transform .3s cubic-bezier(.175,.885,.32,1.275), box-shadow .3s;
    position: relative;
    border: 2px solid rgba(255,255,255,0.28);
    animation: sgBubbleIn .5s cubic-bezier(.175,.885,.32,1.275);
    user-select: none;
  }
  #sg-bubble:hover { transform: scale(1.10); box-shadow: 0 10px 30px rgba(39,174,96,0.65); }
  #sg-bubble.sg-open { transform: scale(0.88) rotate(90deg); }

  /* ── Badge ── */
  #sg-badge {
    position: absolute; top: -4px; right: -4px;
    background: #e74c3c; color: #fff;
    width: 20px; height: 20px; border-radius: 50%;
    font-size: 11px; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    border: 2.5px solid #fff;
    transition: transform .25s, opacity .25s;
    pointer-events: none;
  }
  #sg-badge.sg-hidden { transform: scale(0); opacity: 0; }
  body.dark-mode #sg-badge { border-color: #1a1a1a; }

  /* ── Chat Window ── */
  #sg-win {
    position: absolute; bottom: 76px; right: 0;
    width: 375px; max-height: 570px;
    border-radius: 26px;
    background: rgba(250, 252, 250, 0.90);
    backdrop-filter: blur(32px) saturate(1.9) brightness(1.04);
    -webkit-backdrop-filter: blur(32px) saturate(1.9) brightness(1.04);
    border: 1px solid rgba(255,255,255,0.55);
    box-shadow: 0 24px 64px rgba(0,0,0,0.16), 0 6px 20px rgba(0,0,0,0.10),
                inset 0 1.5px 0 rgba(255,255,255,0.70);
    display: flex; flex-direction: column;
    overflow: hidden;
    transform: scale(0.82) translateY(16px);
    opacity: 0; pointer-events: none;
    transition: transform .36s cubic-bezier(.175,.885,.32,1.275), opacity .28s ease;
    transform-origin: bottom right;
  }
  #sg-win.sg-open {
    transform: scale(1) translateY(0);
    opacity: 1; pointer-events: all;
  }

  /* ── Header ── */
  .sg-hd {
    background: linear-gradient(135deg, #27ae60 0%, #1a9048 100%);
    padding: 15px 17px;
    display: flex; align-items: center; gap: 11px;
    flex-shrink: 0; position: relative; overflow: hidden;
  }
  .sg-hd::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 42%;
    background: linear-gradient(180deg, rgba(255,255,255,.20) 0%, transparent 100%);
    pointer-events: none;
  }
  .sg-hd-av {
    width: 42px; height: 42px; border-radius: 50%;
    background: rgba(255,255,255,.22); border: 2px solid rgba(255,255,255,.40);
    display: flex; align-items: center; justify-content: center;
    font-size: 21px; flex-shrink: 0; position: relative; z-index: 1;
  }
  .sg-hd-info { flex: 1; position: relative; z-index: 1; }
  .sg-hd-name { color: #fff; font-weight: 700; font-size: 14.5px; letter-spacing: .2px; }
  .sg-hd-status {
    color: rgba(255,255,255,.85); font-size: 11.5px;
    display: flex; align-items: center; gap: 4px; margin-top: 1px;
  }
  .sg-sdot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #a8f5c4; animation: sgPulse 2.2s infinite;
  }
  .sg-aibadge {
    background: rgba(255,255,255,.22); color: #fff;
    font-size: 10px; font-weight: 700; padding: 3px 9px;
    border-radius: 20px; letter-spacing: .6px;
    position: relative; z-index: 1;
  }
  .sg-xbtn {
    background: rgba(255,255,255,.18); border: none; color: #fff;
    width: 30px; height: 30px; border-radius: 50%;
    cursor: pointer; font-size: 14px;
    display: flex; align-items: center; justify-content: center;
    transition: background .2s; flex-shrink: 0; position: relative; z-index: 1;
  }
  .sg-xbtn:hover { background: rgba(255,255,255,.32); }

  /* ── Messages area ── */
  .sg-msgs {
    flex: 1; overflow-y: auto; padding: 14px 13px;
    display: flex; flex-direction: column; gap: 9px;
    scroll-behavior: smooth;
  }
  .sg-msgs::-webkit-scrollbar { width: 3px; }
  .sg-msgs::-webkit-scrollbar-track { background: transparent; }
  .sg-msgs::-webkit-scrollbar-thumb { background: rgba(39,174,96,.22); border-radius: 2px; }

  /* ── Message row ── */
  .sg-row { display: flex; gap: 7px; align-items: flex-end; animation: sgMsgIn .28s ease-out; }
  .sg-row.sg-u { flex-direction: row-reverse; }

  /* ── Bubbles ── */
  .sg-bbl {
    max-width: 82%; padding: 9px 13px;
    border-radius: 18px; font-size: 13.5px; line-height: 1.56;
    word-break: break-word;
  }
  .sg-row.sg-b .sg-bbl {
    background: rgba(255,255,255,.60);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,.45);
    box-shadow: 0 2px 8px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.55);
    border-bottom-left-radius: 5px;
    color: #1a2e1f;
  }
  .sg-row.sg-u .sg-bbl {
    background: linear-gradient(135deg, #27ae60, #1e8449);
    color: #fff; border-bottom-right-radius: 5px;
    box-shadow: 0 3px 12px rgba(39,174,96,.32);
  }
  .sg-bav {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, #27ae60, #1e8449);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(39,174,96,.30);
  }

  /* ── Typing ── */
  .sg-typing { display: flex; gap: 5px; align-items: center; padding: 10px 12px; }
  .sg-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(39,174,96,.65); animation: sgDot 1.3s infinite; }
  .sg-dot:nth-child(2) { animation-delay: .2s; }
  .sg-dot:nth-child(3) { animation-delay: .4s; }

  /* ── Markdown ── */
  .sg-bbl strong { font-weight: 700; }
  .sg-ln { display: block; }
  .sg-ln:empty { height: 5px; }

  /* ── Suggestions ── */
  .sg-chips {
    padding: 5px 13px 8px;
    display: flex; gap: 6px; flex-wrap: nowrap; overflow-x: auto;
    flex-shrink: 0; min-height: 0;
  }
  .sg-chips:empty { padding: 0; }
  .sg-chips::-webkit-scrollbar { display: none; }
  .sg-chip {
    background: rgba(39,174,96,.09);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(39,174,96,.28);
    color: #1a6e35; border-radius: 20px;
    padding: 5px 12px; font-size: 12px; font-weight: 600;
    cursor: pointer; white-space: nowrap; flex-shrink: 0;
    transition: all .2s; font-family: inherit;
  }
  .sg-chip:hover { background: rgba(39,174,96,.19); border-color: rgba(39,174,96,.42); transform: translateY(-1px); }

  /* ── Input area ── */
  .sg-in-row {
    display: flex; gap: 8px; align-items: center;
    padding: 9px 13px 13px;
    border-top: 1px solid rgba(255,255,255,.40);
    flex-shrink: 0;
  }
  #sg-input {
    flex: 1;
    background: rgba(255,255,255,.55);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,.45);
    border-radius: 22px; padding: 9px 15px;
    font-size: 13.5px; font-family: inherit;
    outline: none; transition: all .22s;
    color: #1a2e1f;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.55);
  }
  #sg-input:focus {
    border-color: rgba(39,174,96,.50);
    background: rgba(255,255,255,.78);
    box-shadow: 0 0 0 3px rgba(39,174,96,.12), inset 0 1px 0 rgba(255,255,255,.55);
  }
  #sg-input::placeholder { color: rgba(44,62,80,.42); }
  #sg-sendbtn {
    width: 38px; height: 38px; border-radius: 50%;
    background: linear-gradient(135deg, #27ae60, #1e8449);
    border: none; color: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; font-weight: 700;
    transition: all .2s; flex-shrink: 0;
    box-shadow: 0 3px 10px rgba(39,174,96,.38);
  }
  #sg-sendbtn:hover { transform: scale(1.09); box-shadow: 0 5px 16px rgba(39,174,96,.52); }
  #sg-sendbtn:active { transform: scale(0.94); }

  /* ── Dark Mode ── */
  body.dark-mode #sg-win {
    background: rgba(18, 22, 24, 0.90);
    border-color: rgba(255,255,255,.10);
    box-shadow: 0 24px 64px rgba(0,0,0,.55), 0 6px 20px rgba(0,0,0,.38),
                inset 0 1.5px 0 rgba(255,255,255,.10);
  }
  body.dark-mode .sg-row.sg-b .sg-bbl {
    background: rgba(255,255,255,.07);
    border-color: rgba(255,255,255,.10);
    color: #ddeee3;
  }
  body.dark-mode .sg-chip { color: #5de892; border-color: rgba(46,204,113,.26); background: rgba(46,204,113,.07); }
  body.dark-mode .sg-chip:hover { background: rgba(46,204,113,.16); }
  body.dark-mode #sg-input { background: rgba(255,255,255,.07); border-color: rgba(255,255,255,.12); color: #ecf0f1; }
  body.dark-mode #sg-input::placeholder { color: rgba(236,240,241,.34); }
  body.dark-mode #sg-input:focus { background: rgba(255,255,255,.11); border-color: rgba(46,204,113,.45); }
  body.dark-mode .sg-in-row { border-top-color: rgba(255,255,255,.08); }

  /* ── Animations ── */
  @keyframes sgBubbleIn { from { transform: scale(0) rotate(-15deg); opacity: 0; } to { transform: scale(1) rotate(0); opacity: 1; } }
  @keyframes sgMsgIn    { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes sgDot      { 0%,80%,100% { transform: translateY(0); opacity: .5; } 40% { transform: translateY(-7px); opacity: 1; } }
  @keyframes sgPulse    { 0%,100% { opacity: .75; transform: scale(1); } 50% { opacity: 1; transform: scale(1.25); } }

  /* ── Mobile ── */
  @media (max-width: 480px) {
    #sg-chat-root { bottom: 18px; right: 14px; }
    #sg-win { width: calc(100vw - 28px); right: 0; bottom: 74px; max-height: 75vh; }
  }
  `;

  /* ── HTML ─────────────────────────────────────────────────────────── */
  const HTML = `
  <div id="sg-chat-root">
    <div id="sg-bubble" title="ShopGuide Assistent öffnen">
      🛒
      <span id="sg-badge" class="sg-hidden">1</span>
    </div>
    <div id="sg-win" role="dialog" aria-label="ShopGuide Chat">
      <div class="sg-hd">
        <div class="sg-hd-av">🛒</div>
        <div class="sg-hd-info">
          <div class="sg-hd-name">ShopGuide Assistent</div>
          <div class="sg-hd-status"><span class="sg-sdot"></span>Online &mdash; KI-gestützt</div>
        </div>
        <span class="sg-aibadge">KI</span>
        <button class="sg-xbtn" id="sg-xbtn" aria-label="Chat schließen">✕</button>
      </div>
      <div class="sg-msgs" id="sg-msgs"></div>
      <div class="sg-chips" id="sg-chips"></div>
      <div class="sg-in-row">
        <input type="text" id="sg-input" placeholder="Frag mich alles über ShopGuide…" autocomplete="off" aria-label="Nachricht eingeben">
        <button id="sg-sendbtn" aria-label="Senden">&#8593;</button>
      </div>
    </div>
  </div>`;

  /* ── Wissensdatenbank ────────────────────────────────────────────── */
  const KB = [
    {
      id: 'greeting',
      t: ['hallo','hi','hey','guten tag','guten morgen','guten abend','servus','moin','grüß','grüezi','hello','good morning','howdy'],
      r: `Hey, schön dass du da bist! 👋\n\nIch bin der **KI-Assistent von ShopGuide** und beantworte dir alle Fragen — egal ob du Kunde, Händler oder einfach neugierig bist.\n\nWas möchtest du wissen?`,
      s: ['Was ist ShopGuide?','Für Kunden','Für Händler','Demo ansehen']
    },
    {
      id: 'what-is',
      t: ['was ist','was macht','erkläre','erklär','konzept','idee','produkt','worum','übersicht','zusammenfassung','shopguide','betriebssystem','plattform','lösung','kurz'],
      r: `**ShopGuide** ist das Betriebssystem für den effizienten Einkauf. 🛒\n\nWir verbinden analoge Einkaufszettel mit digitaler Navigation — vollständig **ohne teure Hardware** oder Umbaumaßnahmen im Markt.\n\n**Kurz zusammengefasst:**\nKunden scannen ihren Einkaufszettel → Unsere KI generiert die optimale Route durch den Supermarkt → Händler profitieren durch mehr Umsatz und loyalere Kunden.\n\n**Aktuell in Gesprächen mit:** REWE, EDEKA, ALDI, LIDL, Netto, Penny.`,
      s: ['Wie funktioniert es genau?','Vorteile für Händler','Für Kunden','Welche Technologie?']
    },
    {
      id: 'customer',
      t: ['kunde','kunden','als kunde','für kunden','einkaufen','einkauf','einkaufszettel','liste','navigation','route','scannen','scan','foto','fotografieren','einkaufsliste'],
      r: `Als **Kunde** ist ShopGuide dein intelligenter Einkaufsbegleiter:\n\n📋 **Schritt 1:** Einkaufszettel eintippen oder abfotografieren\n🧠 **Schritt 2:** KI analysiert Produkte und Markt-Layout\n🗺️ **Schritt 3:** Optimale Route — kein Hin- und Herlaufen mehr!\n✅ **Schritt 4:** Produkt für Produkt abhaken, nie mehr vergessen\n\n**Highlights für Kunden:**\n• Bis zu 40 % weniger Zeit im Supermarkt\n• Allergie- & Diätfilter\n• Kostenlos nutzbar\n• Offline-fähig`,
      s: ['Gibt es eine App?','Kostenlos?','Allergie-/Diätfilter?','Demo ausprobieren']
    },
    {
      id: 'merchant',
      t: ['händler','supermarkt','markt','geschäft','filiale','betreiber','für händler','als händler','marktbetreiber','filialleiter','lebensmittel','einzelhandel','retail'],
      r: `Für **Händler** ist ShopGuide ein echter Umsatzbooster:\n\n📈 **Was ShopGuide für Händler tut:**\n• Kunden kaufen durchschnittlich **+23 % mehr** durch smarte Routenführung\n• Weniger Frustration → mehr Wiederkäufer\n• Analytics-Dashboard: Heatmaps, Kundenströme, Conversion-Daten\n• Push-Angebote direkt in die Einkaufsroute integriert\n\n⚙️ **Integration ohne Aufwand:**\n• Kein Hardware-Kauf nötig\n• Keine Baumaßnahmen\n• Grundriss-Setup in 1–2 Tagen\n• ROI typischerweise in **unter 3 Monaten**`,
      s: ['Was kostet es?','ROI-Rechner','Technische Integration','Partnerschaft anfragen']
    },
    {
      id: 'pricing',
      t: ['preis','preise','kosten','kostet','abonnement','abo','gebühr','tarif','plan','lizenz','bezahlen','zahlen','gratis','kostenlos','teuer','günstig','bezahlbar'],
      r: `**Preismodell:**\n\n🆓 **Für Kunden:** Komplett kostenlos — kein Abo, keine versteckten Kosten.\n\n💼 **Für Händler:** Monatliches SaaS-Abonnement, gestaffelt nach Filialanzahl und Marktgröße. Genaue Zahlen besprechen wir im persönlichen Gespräch.\n\n**Early-Adopter-Vorteil:** Da wir uns noch in der Pilotphase befinden, bekommen Händler die jetzt einsteigen besonders attraktive Einstiegskonditionen — und direkten Einfluss auf das Produkt.\n\n💡 Unser **ROI-Rechner** auf der Händlerseite gibt dir eine erste Einschätzung, ab wann sich ShopGuide lohnt!`,
      s: ['ROI-Rechner öffnen','Early Adopter werden','Pilotprojekt anfragen','Wie hoch ist der ROI?']
    },
    {
      id: 'indoor',
      t: ['positioning','indoor','wie weiß','standort','position','koordinaten','gps','wlan','bluetooth','beacon','qr','wie findet','woher weiß','wie erkennt','wo stehen','regal','shelves'],
      r: `Das ist die meistgestellte Frage — und absolut berechtigt! 🎯\n\n**Wie weiß ShopGuide, wo was steht?**\n\n1️⃣ **Händler-Grundriss:** Der Marktbetreiber pflegt einmalig ein, wo welches Produkt steht — über unser einfaches Tool, kein technisches Wissen nötig.\n\n2️⃣ **Kein GPS, keine Hardware:** Wir brauchen weder GPS (indoor nutzlos), noch BLE-Beacons oder Spezial-WLAN.\n\n3️⃣ **Selbstlernend:** Wenn Regale umgestellt werden, kann der Händler das Update in Minuten einpflegen.\n\n4️⃣ **Offline-first:** Beim Betreten des Marktes wird die Karte gecacht — danach alles ohne Netz.`,
      s: ['Setup-Aufwand?','Wer pflegt die Karte?','Offline-Modus','Hardware-Anforderungen']
    },
    {
      id: 'setup',
      t: ['einrichten','setup','wie lange','dauer','aufwand','onboarding','implementierung','integration','einführung','starten','anfangen'],
      r: `**Einrichtung — so einfach wie möglich:**\n\n⏱️ **Gesamtaufwand für Händler:**\n• Grundriss einpflegen: 2–4 Stunden (einmalig)\n• Produktdatenbank verbinden: 1–2 Stunden (falls vorhanden)\n• System testen & Go-Live: ca. 1 Tag\n\n✅ **Ergebnis: In 1–2 Tagen live**\n\n**Was du brauchst:**\n• Einen Computer oder Tablet\n• Den Grundriss deines Markts (Handskizze reicht)\n• Produktliste (Excel, CSV oder Warenwirtschaftssystem)\n\n**Unser Team begleitet dich** beim Onboarding im Pilotprojekt komplett persönlich.`,
      s: ['Technische Anforderungen?','Wer hilft beim Setup?','Pilotprojekt anfragen','Warenwirtschafts-Integration?']
    },
    {
      id: 'technology',
      t: ['technologie','technik','tech','wie funktioniert','künstliche intelligenz','ki','algorithmus','software','entwicklung','stack','architektur','backend','api'],
      r: `**Unsere Technologie im Überblick:**\n\n🧠 **KI-Routenoptimierung:**\nBerechnet den kürzesten Weg unter Berücksichtigung von Laufrichtungen, engen Gängen und Stoßzeiten — wie Google Maps, aber für den Supermarkt.\n\n🗺️ **Indoor-Mapping-Engine:**\nEigenentwickeltes System zur Verwaltung von Markt-Grundrissen. Einfach zu pflegen, auch ohne technisches Know-how.\n\n📊 **Analytics-Layer:**\nEchtzeit-Auswertung von Kundenströmen — anonymisiert und DSGVO-konform.\n\n⚡ **Performance:**\nRoutenberechnung in unter 200 ms. Offline-first für schlechtes Netz in Kellern und Tiefkühlabteilungen.`,
      s: ['DSGVO-konform?','Offline-Modus','Genauigkeit der Navigation?','API-Integration?']
    },
    {
      id: 'dsgvo',
      t: ['dsgvo','datenschutz','privacy','daten','tracking','anonym','sicher','sicherheit','gdpr','compliance','persönlich','personenbezogen'],
      r: `**Datenschutz — das nehmen wir ernst.** 🔒\n\n**Für Kunden:**\n• Keine Pflicht-Registrierung für Grundfunktionen\n• Standortdaten werden nicht dauerhaft gespeichert\n• Keine Weitergabe an Dritte\n• DSGVO-konform, Server in Deutschland ☁️\n\n**Für Händler:**\n• Analytics vollständig anonymisiert\n• Keine individuellen Kundenprofile\n• Nur aggregierte Daten (z.B. "80 % der Kunden besuchen zuerst Obst & Gemüse")\n• Verarbeitung nach Art. 6 DSGVO\n\nVollständige Details findest du in unserer Datenschutzerklärung auf der Website.`,
      s: ['Welche Daten werden gespeichert?','Analytics für Händler','Datenschutzerklärung lesen','Technologie']
    },
    {
      id: 'partners',
      t: ['partner','rewe','edeka','aldi','lidl','netto','penny','welche märkte','verfügbar','mitmachen','partnerschaften','kooperationen'],
      r: `**Aktuelle Partnerships & Gespräche:**\n\nWir sind in aktiven Pilotverhandlungen mit:\n🛒 REWE  🛒 EDEKA  🛒 ALDI\n🛒 LIDL   🛒 Penny   🛒 Netto\n\n**Aktueller Stand:**\nDas Produkt ist in der Pilotphase. Die ersten Live-Märkte starten 2025.\n\nWir priorisieren Händler, die **frühzeitig einsteigen** — Early Adopter erhalten attraktive Konditionen und direkten Einfluss auf die Produktentwicklung.\n\n📩 Interesse, deinen Markt einzubringen? Schreib uns!`,
      s: ['Wie kann mein Markt mitmachen?','Early Adopter Vorteile?','Kontakt aufnehmen','Wann geht es los?']
    },
    {
      id: 'app',
      t: ['app','herunterladen','download','appstore','playstore','ios','android','handy','smartphone','mobile','pwa','installieren'],
      r: `**ShopGuide App:**\n\n📱 ShopGuide ist als **Progressive Web App (PWA)** verfügbar:\n• Kein App-Store-Download nötig\n• Direkt über den Browser nutzbar\n• Läuft auf iOS und Android\n• Kann als App auf dem Homescreen installiert werden\n\n**PWA-Vorteile:**\n✅ Immer automatisch aktuell\n✅ Wenig Speicherbedarf\n✅ Offline-fähig\n✅ Sofort startklar\n\n**Native Apps** für iOS & Android sind für den offiziellen Launch geplant. Willst du informiert werden?`,
      s: ['Wann geht es live?','Demo jetzt testen','Offline-Modus','Benachrichtigung erhalten']
    },
    {
      id: 'offline',
      t: ['offline','kein internet','netz','verbindung','internet','wlan','ohne netz','schwaches netz','keller','tiefkühl'],
      r: `**Offline-Modus — ein echtes Must-Have:** 📶\n\nWir haben das von Tag 1 als Kernfeature eingeplant — Supermarkt-WLAN ist berüchtigt unzuverlässig.\n\n**So funktioniert es:**\n1️⃣ Beim Betreten des Marktes wird die Karte einmalig gecacht\n2️⃣ Route wird lokal auf dem Handy berechnet — kein Server nötig\n3️⃣ Abhaken von Produkten funktioniert komplett offline\n4️⃣ Sync passiert automatisch im Hintergrund, sobald Netz da ist\n\n✅ Kein Verbindungsabbruch = kein Navigations-Abbruch`,
      s: ['Technologie dahinter?','App herunterladen','Demo testen','Akku-Verbrauch?']
    },
    {
      id: 'allergies',
      t: ['allergie','allergien','intoleranz','laktose','gluten','vegan','vegetarisch','halal','koscher','diät','ernährung','bio','nüsse','inhaltsstoffe','ernährungsweise'],
      r: `**Allergie- & Diätfilter:** 🌿\n\n**Was ShopGuide kann:**\n• Produkte nach Allergenen filtern (Gluten, Laktose, Nüsse, Ei, Soja, …)\n• Ernährungspräferenzen speichern (vegan, vegetarisch, halal, koscher)\n• Alternativprodukte vorschlagen\n• Inhaltsstoffe direkt im Produkt anzeigen\n\n**So läuft es ab:**\nEinmalig in deinem Profil einstellen → ShopGuide filtert automatisch alle Produkte in deiner Route und warnt bei problematischen Inhaltsstoffen.\n\n**Status:** Allergie-Filter ist fest eingeplant für den ersten Major Release.`,
      s: ['Wann kommt das Feature?','Demo testen','Was ist ShopGuide?','Für Kunden']
    },
    {
      id: 'roi',
      t: ['roi','rendite','gewinn','umsatz','mehreinnahmen','wirtschaftlich','rechnet sich','lohnt','ertrag','amortisation','break even','kalkulator','rechner'],
      r: `**Return on Investment für Händler:**\n\n📊 **Kennzahlen aus der Pilotphase:**\n• +23 % durchschnittlicher Warenkorbwert\n• +18 % mehr Wiederholungskäufe\n• –35 % Kundenanfragen wegen "Produkt nicht gefunden"\n• Break-Even typischerweise **in unter 3 Monaten**\n\n**Wie entsteht der ROI?**\n1. Kunden entdecken mehr Produkte durch die Route\n2. Weniger Kaufabbrüche ("konnte Produkt nicht finden")\n3. Loyalere Kundschaft durch besseres Einkaufserlebnis\n4. Neue Einnahmen: Hersteller zahlen für Placement in der Route\n\n💡 Unser **ROI-Rechner** auf der Händlerseite gibt eine individuelle Einschätzung!`,
      s: ['Wie öffne ich den ROI-Rechner?','Preise für Händler?','Pilotprojekt starten','Wie lange dauert der Setup?']
    },
    {
      id: 'demo',
      t: ['demo','testen','ausprobieren','live','vorführung','preview','beispiel','ansehen','zeigen','anschauen','probieren'],
      r: `**ShopGuide Demo — direkt auf der Website:**\n\n🛒 **Kunden-Demo:**\nGib eine Einkaufsliste ein, sieh wie ShopGuide die Produkte analysiert und eine optimale Route durch den Beispielmarkt berechnet.\n\n🏪 **Händler-Demo:**\nROI-Rechner, Analytics-Preview und der Layout-Planer für Marktgrundrisse.\n\n📍 **Live-Navigation:**\nAuf der Startseite siehst du die KI-Navigation animiert in Echtzeit.\n\n➡️ Nutze den **"Demo ansehen"** oder **"Demo ausprobieren"** Button auf der jeweiligen Seite!`,
      s: ['Kunden-Demo starten','Händler-Demo','Kontakt für persönliche Demo','Pilotprojekt']
    },
    {
      id: 'contact',
      t: ['kontakt','schreiben','email','mail','anrufen','telefon','erreichbar','sprechen','meeting','termin','anfrage','nachricht','support'],
      r: `**So erreichst du uns:**\n\n📧 **E-Mail:** info@shopguide.de\n\n**Schnellste Option für Händler und Partnerships:**\nSchreib direkt eine Mail oder nutze das Kontaktformular auf der Website. Wir antworten typischerweise **innerhalb von 24 Stunden**.\n\n**Was du erwähnen solltest:**\n• Händler, Investor oder Kunde?\n• Marktgröße / Filialanzahl (falls Händler)\n• Was interessiert dich konkret?\n\n🤝 **Pilotprojekt-Plätze** sind begrenzt — frühzeitig melden lohnt sich!`,
      s: ['Early Adopter werden','Investoren-Infos','Pilotprojekt anfragen','Newsletter abonnieren']
    },
    {
      id: 'waitlist',
      t: ['warteliste','waitlist','anmelden','newsletter','benachrichtigung','launch','wann','verfügbar','wann kommt','release','start','informiert'],
      r: `**Launch & Verfügbarkeit:**\n\n📅 **Status:** MVP / Pilotphase — erste Live-Märkte starten **2025**.\n\n**So bleibst du informiert:**\n📧 Schreib eine kurze Mail an info@shopguide.de mit dem Betreff "Waitlist" — du wirst als Erstes informiert, wenn deine Region oder dein Markt live geht.\n\n**Warum früh dabei sein?**\n✅ Direkter Einfluss auf die Produktentwicklung\n✅ Günstigere Einstiegskonditionen\n✅ Exklusiver Support beim Onboarding\n✅ Wettbewerbsvorteil gegenüber der Konkurrenz`,
      s: ['Kontakt aufnehmen','Ich bin Händler','Ich bin Investor','Ich bin Kunde']
    },
    {
      id: 'investors',
      t: ['investor','investoren','investition','funding','finanzierung','kapital','vc','venture capital','pitch deck','business plan','beteiligung','anteile','seed'],
      r: `**Für Investoren:**\n\nShopGuide ist in der **Seed-Phase** und offen für strategische Investoren.\n\n**Marktpotenzial:**\n• Lebensmitteleinzelhandel Deutschland: ~240 Mrd. €/Jahr\n• Über 38.000 Supermärkte in Deutschland\n• Wachsende Nachfrage nach digitalen Einkaufserlebnissen\n\n**Unsere Stärken:**\n✅ Kein Hardware-Capex für Händler → einfacher Vertrieb\n✅ Setup in 1–2 Tagen → schneller Go-To-Market\n✅ 3 Stakeholder-Gruppen: Kunden + Händler + Hersteller\n✅ 3 Revenue-Streams: SaaS + Placement-Fees + Daten-Insights\n\n📩 Pitch Deck anfordern: info@shopguide.de — Betreff "Investor"`,
      s: ['Business Model erklärt','Kontakt aufnehmen','Marktgröße','Technologie']
    },
    {
      id: 'competition',
      t: ['konkurrent','wettbewerb','konkurrenz','alternative','vergleich','ähnlich','andere anbieter','unterschied','besser als','vs','versus','warum shopguide','andere lösungen'],
      r: `**Warum ShopGuide statt X?**\n\n**Klassische Indoor-Navigations-Lösungen:**\n❌ Benötigen BLE-Beacons (~50.000 €+ Setup)\n❌ Monate lange Installation\n✅ ShopGuide: Kein Hardware nötig, live in 1–2 Tagen\n\n**Supermarkt-eigene Apps:**\n❌ Nur für eine Kette nutzbar\n❌ Keine echte Routenoptimierung\n✅ ShopGuide: Kettenübergreifend, echte KI-Navigation\n\n**Einkaufszettel-Apps:**\n❌ Kein räumlicher Bezug zum Markt\n✅ ShopGuide: Verbindet Liste mit Markt-Geografie\n\n**Unser USP:** Die einzige hardware-freie, händlerübergreifende Navigations- und Analyse-Plattform für den deutschen LEH.`,
      s: ['Wie läuft die Integration ab?','Preise?','Demo ansehen','Kontakt aufnehmen']
    },
    {
      id: 'hardware',
      t: ['hardware','geräte','beacons','sensoren','tablets','displays','screens','infrastruktur','umbau','baumaßnahmen','technische anforderungen','anforderungen'],
      r: `**Hardware-Anforderungen — fast null:** ⚡\n\n**Was Händler brauchen:**\n✅ Standard-Internetanschluss (schon vorhanden)\n✅ Einen Computer oder Tablet zur Kartenpflege\n✅ Das war's!\n\n**Was Händler NICHT brauchen:**\n❌ BLE-Beacons oder Spezial-WLAN-Access-Points\n❌ Bodensticker, QR-Codes oder Kameras\n❌ Neue Kassensysteme\n❌ Baumaßnahmen oder Umbau\n\n**Für Kunden:**\n✅ Nur ein aktuelles Smartphone (iOS oder Android)\n\nDas ist unser Kernvorteil: **Plug & Play ohne Investitionskosten.**`,
      s: ['Wie funktioniert das ohne Hardware?','Indoor-Positioning erklärt','Onboarding-Prozess','Preise']
    },
    {
      id: 'analytics',
      t: ['analytics','statistiken','auswertung','heatmap','insights','berichte','reports','dashboard','metriken','kennzahlen','kpi','kundenströme','bewegungsdaten'],
      r: `**Analytics-Dashboard für Händler:** 📊\n\n**Was ShopGuide trackt (DSGVO-konform, anonym):**\n\n🗺️ **Heatmaps:** Welche Bereiche werden am meisten besucht? Welche werden übersprungen? Ideal für Produktplatzierungen.\n\n🛒 **Warenkorb-Analyse:** Welche Produkte werden häufig zusammen gekauft?\n\n⏱️ **Zeit-Metriken:** Durchschnittliche Einkaufsdauer, Peak-Zeiten, Engpässe.\n\n💡 **Aktionsfähige Insights:** "35 % der Kunden verlassen den Markt ohne Abteilung X — Empfehlung: Platzierung anpassen."\n\nAlle Daten sind vollständig anonymisiert. Kein individuelles User-Tracking.`,
      s: ['DSGVO-konform?','Wie nutze ich die Daten?','Pilotprojekt','Preise für Händler']
    },
    {
      id: 'sustainability',
      t: ['nachhaltig','nachhaltigkeit','umwelt','co2','ökologisch','klima','carbon','grün','green','footprint','eco'],
      r: `**ShopGuide & Nachhaltigkeit:** 🌿\n\nWeniger Laufwege = weniger Zeit, Energie und Frust verschwendet.\n\n**Konkrete Beiträge:**\n🚶 **Kürzere Wege:** Optimale Routen reduzieren den Energieverbrauch im Markt (Heizung, Kühlung).\n\n🥗 **Bessere Entscheidungen:** Allergie- & Diätfilter machen regionale und nachhaltige Produkte leichter auffindbar.\n\n🌍 **Eco-Score** *(geplant)*: Zeigt wie klimafreundlich ein Einkauf war.\n\n♻️ **Weniger Impulskäufe:** Fokussiertes Einkaufen nach Liste = weniger Überkonsum.\n\n☁️ ShopGuide läuft auf nachhaltig betriebenen Rechenzentren in Deutschland.`,
      s: ['Eco-Score Feature','Nachhaltigkeitsfilter','Was ist ShopGuide?','Für Kunden']
    },
    {
      id: 'manufacturer',
      t: ['hersteller','marke','brand','placement','platzierung','werbung','anzeige','sponsored','promotion','revenue','einnahmen','monetarisierung'],
      r: `**Hersteller als dritte Stakeholder-Gruppe:**\n\nDas ist ein oft übersehener Teil des ShopGuide-Modells! 🏭\n\n**Wie Hersteller profitieren:**\nMarken wie Coca-Cola, Nestlé oder Unilever können:\n• Als erste Alternative vorgeschlagen werden (wenn ein Produkt ausverkauft ist)\n• Prominenter in der Einkaufsroute erscheinen\n• "Sponsored Routes" für Aktionen buchen\n• Aggregierte, anonyme Insights kaufen\n\n**Das macht 3 Revenue-Streams:**\n1️⃣ Kunden (kostenlos)\n2️⃣ Händler (SaaS-Abo)\n3️⃣ Hersteller (Placement-Fees + Insights)\n\n**Wichtig:** Für Kunden transparent — keine nervige, irrelevante Werbung.`,
      s: ['Business Model','Für Händler','Investoren-Infos','Kontakt']
    },
    {
      id: 'group-shopping',
      t: ['gruppe','teilen','gemeinsam','freunde','familie','multi','kollaborativ','shared','partner teilen','zusammen einkaufen'],
      r: `**Gruppen-Einkauf & geteilte Listen:** 👥\n\nEin sehr gefragtes Feature!\n\n**Die Vision:**\nDu und dein Partner gehen zusammen einkaufen → Liste teilen → ShopGuide teilt die Route auf **zwei Personen auf** → Ihr seid in halber Zeit fertig!\n\n**Oder:**\nDein Partner schickt dir eine Liste → Du gehst alleine → Beide können den Fortschritt live verfolgen.\n\n**Viraler Effekt:**\nJedes Mal wenn jemand eine Liste teilt, lernt jemand Neues ShopGuide kennen — organisches Wachstum durch genuine Nützlichkeit.\n\n**Status:** Fest eingeplant für das erste Major Update nach dem Launch.`,
      s: ['Aktuelle Features','Wann Launch?','Demo testen','Feature vorschlagen']
    },
    {
      id: 'team',
      t: ['team','gründer','wer','über euch','über uns','company','firma','startup','unternehmen','gegründet','geschichte','hintergrund'],
      r: `**Über ShopGuide:**\n\nEin deutsches Tech-Startup mit dem Ziel, den stationären Lebensmitteleinzelhandel zu digitalisieren — **ohne ihn zu komplizieren**.\n\n**Unsere Mission:**\nDen Einkauf für Millionen Menschen effizienter, angenehmer und nachhaltiger gestalten — und dem stationären Handel echten Mehrwert geben.\n\n**Warum dieser Markt?**\nLebensmittelhandel Deutschland: ~240 Mrd. € Jahresumsatz, über 38.000 Märkte — und trotzdem weit hinter anderen Branchen in der Digital-Experience. Das ist unsere Chance.\n\n📩 Mehr Infos: info@shopguide.de`,
      s: ['Was ist ShopGuide?','Investor werden','Kontakt','Team kennenlernen']
    },
    {
      id: 'goodbye',
      t: ['tschüss','bye','ciao','auf wiedersehen','bis dann','danke','thank you','thanks','vielen dank','super danke','hat geholfen','das wars','ok danke'],
      r: `Sehr gerne! 😊 Falls du noch Fragen hast, bin ich immer hier.\n\n**Auf einen Blick:**\n🌐 shopguide.de — Demo & Infos\n📧 info@shopguide.de — Partnerships & Pilotprojekte\n\nViel Spaß beim nächsten Einkauf! 🛒`,
      s: ['Nochmal von vorne','Demo ansehen','Kontakt aufnehmen']
    },
    {
      id: 'fallback',
      t: [],
      r: `Gute Frage! 🤔 Dazu habe ich leider keine direkte Antwort parat.\n\n**Ich helfe gerne weiter bei:**\n• Was ShopGuide ist und wie es funktioniert\n• Infos für Händler und Kunden\n• Technologie, Datenschutz, Preise\n• Demo, Kontakt, Partnerships\n\nOder schreib uns direkt: **info@shopguide.de** — das Team antwortet innerhalb von 24 Stunden!`,
      s: ['Was ist ShopGuide?','Für Händler','Kontakt aufnehmen','Demo testen']
    }
  ];

  /* ── Matching ────────────────────────────────────────────────────── */
  function findEntry(input) {
    const txt = input.toLowerCase().trim();
    let best = null, bestScore = 0;
    for (const e of KB) {
      if (e.id === 'fallback') continue;
      let score = 0;
      for (const tk of e.t) {
        if (txt.includes(tk)) score += tk.split(' ').length;
      }
      if (score > bestScore) { bestScore = score; best = e; }
    }
    return bestScore > 0 ? best : KB.find(e => e.id === 'fallback');
  }

  /* ── Markdown ────────────────────────────────────────────────────── */
  function md(text) {
    let h = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    h = h.split('\n').map(l => `<span class="sg-ln">${l}</span>`).join('');
    return h;
  }
  function esc(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  /* ── State ───────────────────────────────────────────────────────── */
  let open = false, busy = false, everOpened = false;
  let $bubble, $win, $msgs, $chips, $input, $send, $badge, $close;

  /* ── Toggle ─────────────────────────────────────────────────────── */
  function toggle() {
    open = !open;
    $win.classList.toggle('sg-open', open);
    $bubble.classList.toggle('sg-open', open);
    if (open) {
      hideBadge();
      setTimeout(() => $input.focus(), 300);
      if (!everOpened) {
        everOpened = true;
        setTimeout(() => botSay(KB.find(e => e.id === 'greeting')), 450);
      }
    }
  }

  /* ── Messages ────────────────────────────────────────────────────── */
  function userMsg(text) {
    const d = document.createElement('div');
    d.className = 'sg-row sg-u';
    d.innerHTML = `<div class="sg-bbl">${esc(text)}</div>`;
    $msgs.appendChild(d);
    scrollDown();
  }

  function botSay(entry) {
    if (busy) return;
    busy = true;
    clearChips();

    const typ = document.createElement('div');
    typ.className = 'sg-row sg-b';
    typ.id = 'sg-typind';
    typ.innerHTML = `<div class="sg-bav">🛒</div><div class="sg-bbl"><div class="sg-typing"><div class="sg-dot"></div><div class="sg-dot"></div><div class="sg-dot"></div></div></div>`;
    $msgs.appendChild(typ);
    scrollDown();

    const delay = Math.min(900 + entry.r.length * 1.6, 2200);
    setTimeout(() => {
      document.getElementById('sg-typind')?.remove();
      const d = document.createElement('div');
      d.className = 'sg-row sg-b';
      d.innerHTML = `<div class="sg-bav">🛒</div><div class="sg-bbl">${md(entry.r)}</div>`;
      $msgs.appendChild(d);
      scrollDown();
      busy = false;
      if (entry.s) showChips(entry.s);
    }, delay);
  }

  /* ── Chips / Suggestions ─────────────────────────────────────────── */
  function showChips(list) {
    $chips.innerHTML = '';
    list.forEach(t => {
      const b = document.createElement('button');
      b.className = 'sg-chip';
      b.textContent = t;
      b.onclick = () => send(t);
      $chips.appendChild(b);
    });
  }
  function clearChips() { $chips.innerHTML = ''; }

  /* ── Send ────────────────────────────────────────────────────────── */
  function send(txt) {
    const msg = (txt || $input.value).trim();
    if (!msg || busy) return;
    $input.value = '';
    clearChips();
    userMsg(msg);
    setTimeout(() => botSay(findEntry(msg)), 120);
  }

  /* ── Badge ───────────────────────────────────────────────────────── */
  function showBadge() { if (!open) $badge.classList.remove('sg-hidden'); }
  function hideBadge() { $badge.classList.add('sg-hidden'); }

  /* ── Scroll ──────────────────────────────────────────────────────── */
  function scrollDown() { $msgs.scrollTop = $msgs.scrollHeight; }

  /* ── Boot ────────────────────────────────────────────────────────── */
  function boot() {
    const sty = document.createElement('style');
    sty.textContent = CSS;
    document.head.appendChild(sty);

    const wrap = document.createElement('div');
    wrap.innerHTML = HTML;
    document.body.appendChild(wrap);

    $bubble = document.getElementById('sg-bubble');
    $win    = document.getElementById('sg-win');
    $msgs   = document.getElementById('sg-msgs');
    $chips  = document.getElementById('sg-chips');
    $input  = document.getElementById('sg-input');
    $send   = document.getElementById('sg-sendbtn');
    $badge  = document.getElementById('sg-badge');
    $close  = document.getElementById('sg-xbtn');

    $bubble.addEventListener('click', toggle);
    $close.addEventListener('click', toggle);
    $send.addEventListener('click', () => send());
    $input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });

    // Badge nach 5 s zeigen → zieht Aufmerksamkeit auf sich
    setTimeout(showBadge, 5000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
