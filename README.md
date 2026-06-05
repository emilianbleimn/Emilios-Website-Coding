# M&M Unternehmensgruppe – Website

Moderne, professionelle und vertrauenswürdige Website für die **M&M Unternehmensgruppe**
(M&M Maschinenhandel GmbH) aus Groß-Umstadt – RAL GGWL-zertifizierter Forstbetrieb mit
Leistungen in Forstwirtschaft, Baumfällung, Landschaftsbau, Brennholz, Maschinenhandel,
Vermietung und Containerlösungen.

## Highlights

- **Premium-Design** in Dunkelgrün, Anthrazit, Schwarz & Weiß
- **Statische Multi-Page-Website** (HTML/CSS/Vanilla-JS) – ohne Build-Schritt, ohne externe Abhängigkeiten
- **Schnell & DSGVO-freundlich**: eigene SVG-Grafiken/Icons statt externer Bild-CDNs, keine Tracker, keine externen Fonts
- **Voll responsiv** & mobil optimiert, mit Scroll-Animationen (respektiert `prefers-reduced-motion`)
- **Hell-/Dunkel-Modus** mit Umschalter im Header & Menü (wird gespeichert, folgt der Systemeinstellung, ohne Flackern)
- **Logo-Vorschau (Splash)** beim Öffnen der Website – einmal pro Browser-Sitzung
- **SEO**: pro Seite eigene Meta-Tags, Open Graph, JSON-LD (LocalBusiness, BreadcrumbList, FAQPage), `sitemap.xml`, `robots.txt`
- **DSGVO-konformes Kontaktformular** (Pflichtfeld-Validierung, Einwilligung, Spam-Honeypot)
- **Karte mit Zwei-Klick-Lösung** (lädt erst nach Einwilligung)

## Seitenstruktur

| Datei | Inhalt |
|-------|--------|
| `index.html` | Startseite (Hero, Leistungen, Zahlen, Bewertungen, CTA) |
| `ueber-uns.html` | Über uns, RAL GGWL, Werte, Zielgruppen |
| `leistungen.html` | Übersicht aller Leistungen |
| `forstwirtschaft.html` | Forstwirtschaft & Baumfällung |
| `rodung.html` | Rodung & Baufeldfreimachung |
| `landschaftsbau.html` | Garten- & Landschaftsbau |
| `brennholz.html` | Brennholz & Holzverkauf |
| `maschinenhandel.html` | Maschinenhandel |
| `vermietung.html` | Maschinenvermietung |
| `container.html` | Container Kauf & Miete |
| `referenzen.html` | Referenzen / Galerie / Vorher-Nachher |
| `kontakt.html` | Kontakt, Formular, Karte |
| `impressum.html` / `datenschutz.html` | Rechtliches |

```
css/style.css     Design-System
js/site.js        Header/Footer-Injektion, Navigation, Animationen, Formular, Karte
assets/*.svg      Eigene Szenen-Grafiken, Logo, Favicon, OG-Bild
```

## Lokal ansehen

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

## Live-Vorschau (GitHub Pages)

Beim Push auf den Branch deployt der Workflow `.github/workflows/pages.yml` die Seite
automatisch nach GitHub Pages. Die Live-URL erscheint in der Workflow-Zusammenfassung
(Tab **Actions**) und unter **Settings → Pages**.

> Falls Pages nicht automatisch aktiviert wird: **Settings → Pages → Source: GitHub Actions**.

## Vor dem Live-Gang anpassen

- **Echte Fotos** in `assets/` ablegen und die `<img src="assets/scene-*.svg">` ersetzen
  (die SVG-Szenen sind hochwertige Platzhalter).
- **Domain** in `<link rel="canonical">`, Open-Graph-URLs, `sitemap.xml` und `robots.txt`
  anpassen (aktuell `m-m-unternehmensgruppe.de`).
- **Kundenbewertungen** durch echte Stimmen ersetzen (z. B. MyHammer/Google).
- **Kontaktformular**: nutzt aktuell eine `mailto:`-Lösung ohne Backend. Für serverseitigen
  Versand einen Endpoint/Formulardienst in `js/site.js` (Funktion `initForm`) anbinden.
- **Impressum & Datenschutz** rechtlich prüfen lassen.

## Stammdaten

M&M Maschinenhandel GmbH · Robert-Bosch-Straße 11 · 64823 Groß-Umstadt
Tel. 06078 9687991 · maschinenhandel@m-m-unternehmensgruppe.de
