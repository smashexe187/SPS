<inputs>
Ask me for anything below I haven't given you. If I skip it, use the default:
- Screenshots: 3 to 6 of the real interface. Default: capture them yourself from the local site in C:\Users\lerch\Documents\GitHub\SPS (serve it with `python -m http.server 8000`, light mode): the live store map on index.html, the phone demo on customer-dashboard.html in all three states (Zettel erstellen → Zettel scannen → Deine Route), and the timeline on so-funktioniert-es.html. They are reference only.
- Logo: favicon.png (a green "S" drawn as a circuit-style route line with round node ends) plus the wordmark "SHOPGUIDE" as the nav sets it (uppercase, bold, wide letter-spacing).
- Brand colors and font: the ones in style.css, listed under <brand>.
- Music: a royalty-free track with a clear beat. Default: compose one in code.
</inputs>

<direction>
A 15-second product film for ShopGuide (https://shopguide.de), "Das Betriebssystem für den effizienten Einkauf". Research it first by reading the site's own files: what it does, who it's for, its real interface and its brand. In short: shoppers photograph their handwritten shopping list, the AI reads every item, and the app sorts it into the shortest route through the supermarket (chilled goods last) and guides them aisle by aisle to the right shelf; Live-Inventar and Anti-Stau reroute around empty shelves and crowded aisles. Retailers get it without new hardware. Use only what the site shows; never invent screens, features or numbers. The only numbers allowed are ones printed on the site (bis zu 30 % schneller, 95 % Erkennungsgenauigkeit, 0 € Hardware, the "⏱ 4 Min" route chip), and at most one per film.

All on-screen text is German, in the app's own du-voice ("Deine Route", "Zettel scannen").

Through-line object: the green position dot from the live store map (`.mp-dot` on index.html, a #27ae60 circle with a white ring). Make every scene a transformation of it: it starts in the UI, changes shape or role in each scene, and its path becomes the "S" of the logo on the end card. The S already reads as a route with node ends, so the dot ends as one of those nodes. Confirm it in your write-up before you storyboard.

Rebuild the real UI as vector/DOM layers so its parts can move on their own; never slide a flat screenshot in. Key surfaces: the phone mockup (`.phone-pro`: dark frame, 44px radius, Dynamic Island, 9:41 status bar), the app top bar "ShopGuide · KI ✓", the handwritten note with the "Zettel scannen" button and its scan line, the "Deine Route" list (numbered steps, aisle pills like "B · R1", chilled items last), and the store map (shelves Obst & Gemüse, Fleisch & Fisch, Bio-Produkte, Getränke, Drogerie, Unverpackt, Kühlregal, Backwaren, Kasse). A tap pointer drives every interaction with real taps and drags, and the camera zooms screen-studio style so each moment fills the frame.

Look: the site's Liquid Glass style, simplified for film. Pale mint ground, frosted white glass panels with a 1px white edge and a soft layered shadow, navy text, generous corner radii, lots of empty space. It's a product launch: the app UI is the hero.

Motion rules: springs with at most a small overshoot; nothing appears from nothing (it grows, unfolds or is revealed by a mask); the camera never sits still (push from 1.0 to 1.04 across a scene, and start each scene at the zoom the last one ended on); something changes on every beat.

Banned: particle bursts, glows (including the site's phone glows, green glow shadows and the blurred colour blobs behind the glass), lens flares, camera shake, RGB split, crossfades, generic gradients, bouncy easing, holds longer than half a second, emoji, pulsing rings, retailer logos (EDEKA, ALDI, LIDL, PENNY, REWE, Netto are talks, not partners), anything that looks like a template.
</direction>

<brand>
- Typeface: Segoe UI, the site's font, and nothing else (weights 600 and 800). Wordmark: "SHOPGUIDE", uppercase, 800, letter-spacing about 0.13em.
- Accent: #27ae60, used only on the dot and the one key word per scene. Where the real UI is green (top bar, buttons, aisle pills, the coloured step numbers), render it in navy or neutral grey so the green stays reserved.
- Text: #2c3e50. UI fields: #ecf0f1. Ground: #e8f5ee, flat.
- Glass panels: background rgba(255,255,255,0.58), border 1px rgba(255,255,255,0.5), shadow 0 8px 32px rgba(0,0,0,.10), 0 2px 8px rgba(0,0,0,.06), inset 0 1.5px 0 rgba(255,255,255,.65).
- Phone frame: #1c1c1e to #2c2c2e titanium, inner screen radius 36px.
- End card: the same mint ground, the green S mark, the wordmark in navy.
</brand>

<structure>
120 BPM. Write a timed storyboard first, beat by beat, then build exactly that.
Hook (first bar): the problem in three to five German words in big type (for example „Wo ist bloß die Milch?“), which the dot interrupts.
Middle: three or four moments of the product doing what it does best, drawn from: Zettel scannen (the scan line reads the handwriting), KI erkennt (handwritten words become clean product rows), Smart-Route (rows snap into order, chilled goods last), Navigation (the dot walks the map shelf to shelf and detours around the full Getränke aisle). Each begins with the dot turning into the next UI element (the shutter of the scan button, step number 1, the map marker) and lands one readable idea.
Payoff (last bars): the dot reaches Kasse on the biggest beat, then its route bends into the S mark and the end card: SHOPGUIDE and one line of call to action, „Demo ausprobieren → shopguide.de“.
</structure>

<build>
1. One HTML file at 1920x1080. Every style is computed from time inside window.seek(t): no CSS animations, no timers, no state carried between frames.
2. Use spring and exponential easing written as functions of time. Blur follows speed and direction on fast moves.
3. Write a soundtrack in code with the Web Audio API (OfflineAudioContext): a kick on every beat and a hit on each scene change. Render it to WAV.
4. Render with Playwright at 60fps, 3 subframes per frame blended with ffmpeg tmix for motion blur, then mux the audio.
5. Before the full render, render one frame per beat and look at them. Fix anything cluttered, off the beat, overlapping or hard to read.
6. Work in a new folder film/ inside the repo and don't touch the site's files. Final file: film/shopguide-launch.mp4. This machine runs Windows; install Playwright and ffmpeg if they're missing.
</build>

<gotchas>
Measure element positions at runtime for match cuts instead of hard-coding them. When a shape fills the frame, scale it past all four corners. Give outgoing and incoming text separate timing so letters never overlap. Never put will-change on anything the camera scales, or text renders blurry. Segoe UI is a Windows system font: render on this machine and check the beat frames for a fallback font. Draw the S from the dot's route with a stroked path (stroke-dashoffset), not by scaling the dot.
</gotchas>

<start>
Show me what you found, the through-line object and a beat-by-beat storyboard, then build it without asking me anything else. Give me the final MP4.
</start>
