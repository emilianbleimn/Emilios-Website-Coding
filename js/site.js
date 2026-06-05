/* ==========================================================================
   M&M Unternehmensgruppe – Site Script
   Header/Footer-Injektion, Navigation, Animationen, Formular, Karte
   ========================================================================== */
(function () {
  "use strict";

  /* ----------  Immer oben starten  ----------
     Verhindert, dass mobile Browser beim erneuten Öffnen oder Neuladen eine
     alte Scroll-Position wiederherstellen. So landet man beim Öffnen der
     Website immer am Seitenanfang (auf der Startseite) und nicht mitten in
     einem anderen Abschnitt. In-Page-Anker (#...) bleiben davon unberührt. */
  if ("scrollRestoration" in history) { history.scrollRestoration = "manual"; }
  function ensureTop() { if (!location.hash) { window.scrollTo(0, 0); } }
  ensureTop();
  window.addEventListener("pageshow", ensureTop);
  window.addEventListener("load", ensureTop);

  /* ----------  Logo-Vorschau beim Öffnen (einmal pro Sitzung)  ---------- */
  function initSplash() {
    var KEY = "mm_splash_seen";
    try { if (sessionStorage.getItem(KEY)) return; sessionStorage.setItem(KEY, "1"); } catch (e) {}
    if (!document.body) return;
    var logo = '<svg class="splash__logo" viewBox="0 0 48 48" aria-hidden="true">' +
      '<defs><linearGradient id="slg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#52b788"/><stop offset="1" stop-color="#1b4332"/></linearGradient></defs>' +
      '<rect width="48" height="48" rx="13" fill="url(#slg)"/>' +
      '<path d="M24 8 14 22h4l-6 9h9v9h6v-9h9l-6-9h4z" fill="#fff" opacity=".97"/>' +
      '<path d="M22 40h4v-9h-4z" fill="#0c1f15" opacity=".25"/></svg>';
    var el = document.createElement("div");
    el.className = "splash"; el.id = "splash"; el.setAttribute("role", "status");
    el.setAttribute("aria-label", "M&M Unternehmensgruppe wird geladen");
    el.innerHTML = '<div class="splash__inner">' + logo +
      '<div class="splash__name">M&amp;M</div>' +
      '<div class="splash__sub">Unternehmensgruppe</div>' +
      '<div class="splash__bar"><span></span></div></div>';
    document.body.appendChild(el);
    document.documentElement.style.overflow = "hidden";
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var hold = reduce ? 450 : 1200, done = false;
    function close() {
      if (done) return; done = true;
      el.classList.add("is-hidden");
      document.documentElement.style.overflow = "";
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 650);
    }
    setTimeout(close, hold);
    window.addEventListener("load", function () { setTimeout(close, hold); });
  }
  initSplash();

  /* ----------  Hell-/Dunkel-Modus  ---------- */
  var THEME_KEY = "mm_theme";
  function preferredTheme() {
    try { var t = localStorage.getItem(THEME_KEY); if (t === "dark" || t === "light") return t; } catch (e) {}
    return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  }
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "dark" ? "#0e1311" : "#1b4332");
    var dark = t === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(dark));
      b.setAttribute("aria-label", dark ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln");
      var ic = b.querySelector(".ti-icon"), tx = b.querySelector(".ti-text");
      if (ic) ic.innerHTML = dark ? I.sun : I.moon;
      if (tx) tx.textContent = dark ? "Heller Modus" : "Dunkler Modus";
    });
  }
  function initTheme() {
    applyTheme(preferredTheme());
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.addEventListener("click", function () {
        var cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
        var next = cur === "dark" ? "light" : "dark";
        try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
        applyTheme(next);
      });
    });
  }

  /* ----------  Stammdaten (zentral pflegbar)  ---------- */
  var COMPANY = {
    name: "M&M Unternehmensgruppe",
    legal: "M&M Maschinenhandel GmbH",
    street: "Robert-Bosch-Straße 11",
    city: "64823 Groß-Umstadt",
    phone: "06078 9687991",
    phoneHref: "+4960789687991",
    email: "maschinenhandel@m-m-unternehmensgruppe.de",
    myhammer: "https://www.my-hammer.de/auftragnehmer/holzhandel-fabian-mohr"
  };

  /* ----------  Icon-Bibliothek (inline SVG)  ---------- */
  var I = {
    tree: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 5 11h3l-4 6h6v5h4v-5h6l-4-6h3z"/></svg>',
    saw: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M3 17v4h4"/><path d="M14 4l6 6"/></svg>',
    excavator: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><circle cx="7" cy="17" r="2.4"/><circle cx="15" cy="17" r="2.4"/><path d="M4.6 17h12.8"/><path d="M9 14V9h4l3 5"/><path d="M13 9l5-4 2 3-4 3"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 9-4 12-9 12z"/><path d="M11 20c0-5 2-8 6-10"/></svg>',
    fire: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c1 4-3 5-3 9a3 3 0 0 0 6 0c0-1-.5-2-1-3 2 1 3 3 3 6a6 6 0 1 1-12 0c0-5 5-7 7-12z"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-2.6-1.5L14 .8h-4l-.4 2.7A7.6 7.6 0 0 0 7 5L4.6 4l-2 3.4 2 1.6a7.6 7.6 0 0 0 0 3l-2 1.6 2 3.4 2.4-1c.8.6 1.6 1.1 2.6 1.5L10 23h4l.4-2.7c1-.4 1.8-.9 2.6-1.5l2.4 1 2-3.4z"/></svg>',
    key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3 20 3"/><path d="M16 7l3 3"/><path d="M18 5l2 2"/></svg>',
    container: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M7 6v12M11 6v12M15 6v12M19 6v12"/></svg>',
    axe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3c3 0 6 2 6 5l-4 1-3-3z"/><path d="M13 6 4 19a1.5 1.5 0 0 0 2 2l9-9"/></svg>',
    rope: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v9"/><circle cx="12" cy="14" r="3"/><path d="M9 17c0 2 1 5-3 5M15 17c0 2-1 5 3 5"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.5 8 8 11 4.5-3 8-6 8-11V5z"/><path d="m9 12 2 2 4-4"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6 9 6 9-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
    chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 6 20.4l1.4-6.8L2.3 9l6.8-.7z"/></svg>',
    quote: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7H4v6h3l-1 4h3l1-4V7zm10 0h-3v6h3l-1 4h3l1-4V7z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6h11v10H2zM13 9h4l3 3v4h-7z"/><circle cx="6" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2 0-3 1.3-3 3.3V11H8v3h3v7h3v-7h2.5l.5-3H14V9.4c0-.3.2-.4.5-.4z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
    sprout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-9"/><path d="M12 13C12 9 9 7 4 7c0 5 3 6 8 6z"/><path d="M12 11c0-3 2.5-5 7-5 0 4-2.5 5-7 5z"/></svg>',
    handshake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m3 12 4-4 4 2 3-2 4 2 3-2"/><path d="m11 10 2 2 3-2"/><path d="M3 12v4l5 4 3-3 3 3 5-4v-4"/></svg>',
    award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M4.2 4.2 5.9 5.9M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8 5.9 18.1M18.1 5.9l1.7-1.7"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8z"/></svg>'
  };

  /* ----------  Navigation  ---------- */
  var SERVICES = [
    { href: "forstwirtschaft.html", label: "Forstwirtschaft & Baumfällung", icon: "tree", desc: "Fällung, SKT, Holzeinschlag" },
    { href: "rodung.html", label: "Rodung & Baufeldfreimachung", icon: "axe", desc: "Grundstück & Wurzelentfernung" },
    { href: "landschaftsbau.html", label: "Garten- & Landschaftsbau", icon: "leaf", desc: "Pflasterung, Erdbau, Pflege" },
    { href: "brennholz.html", label: "Brennholz & Holzverkauf", icon: "fire", desc: "Kamin-, Stamm- & Anzündholz" },
    { href: "maschinenhandel.html", label: "Maschinenhandel", icon: "gear", desc: "Verkauf, Service & Wartung" },
    { href: "vermietung.html", label: "Maschinenvermietung", icon: "key", desc: "Bagger, Radlader, Häcksler" },
    { href: "container.html", label: "Container Kauf & Miete", icon: "container", desc: "Verschiedene Größen ab Lager" }
  ];
  var MAIN = [
    { href: "index.html", label: "Startseite" },
    { href: "ueber-uns.html", label: "Über uns" },
    { href: "#", label: "Leistungen", menu: true },
    { href: "referenzen.html", label: "Referenzen" },
    { href: "kontakt.html", label: "Kontakt" }
  ];

  function currentPage() {
    var p = location.pathname.split("/").pop();
    return p === "" ? "index.html" : p;
  }
  var CUR = currentPage();
  var SERVICE_PAGES = SERVICES.map(function (s) { return s.href; });

  /* ----------  Header  ---------- */
  function buildHeader() {
    var navItems = MAIN.map(function (item) {
      if (item.menu) {
        var active = SERVICE_PAGES.indexOf(CUR) > -1 ? " is-active" : "";
        var sub = SERVICES.map(function (s) {
          return '<a href="' + s.href + '">' + I[s.icon] +
            '<span>' + s.label + '<small>' + s.desc + '</small></span></a>';
        }).join("");
        return '<li class="nav__item has-menu">' +
          '<a class="nav__link' + active + '" href="leistungen.html" aria-haspopup="true" aria-expanded="false">Leistungen ' + I.chev + '</a>' +
          '<div class="dropdown" role="menu">' + sub + '</div></li>';
      }
      var act = item.href === CUR ? " is-active" : "";
      return '<li class="nav__item"><a class="nav__link' + act + '" href="' + item.href + '">' + item.label + '</a></li>';
    }).join("");

    return '' +
      '<div class="container container--wide site-header__inner">' +
        '<a class="brand" href="index.html" aria-label="' + COMPANY.name + ' Startseite">' +
          logoSVG() +
          '<span class="brand__text"><span class="brand__name">M&amp;M</span><span class="brand__sub">Unternehmensgruppe</span></span>' +
        '</a>' +
        '<nav class="nav" aria-label="Hauptnavigation"><ul style="display:flex;gap:.3rem;align-items:center">' + navItems + '</ul></nav>' +
        '<div class="header-actions">' +
          '<a class="header-phone" href="tel:' + COMPANY.phoneHref + '">' + I.phone + COMPANY.phone + '</a>' +
          '<a class="btn hide-mobile" href="kontakt.html">Angebot anfordern</a>' +
          '<button class="theme-toggle" type="button" data-theme-toggle aria-label="Modus wechseln"><span class="ti-icon"></span></button>' +
          '<button class="burger" aria-label="Menü öffnen" aria-expanded="false"><span></span><span></span><span></span></button>' +
        '</div>' +
      '</div>';
  }

  function buildMobileNav() {
    var main = MAIN.filter(function (m) { return !m.menu; }).map(function (item) {
      var act = item.href === CUR ? " is-active" : "";
      return '<a class="' + act.trim() + '" href="' + item.href + '">' + item.label + '</a>';
    }).join("");
    var svc = SERVICES.map(function (s) {
      var act = s.href === CUR ? " is-active" : "";
      return '<a class="' + act.trim() + '" href="' + s.href + '">' + I[s.icon] + s.label + '</a>';
    }).join("");
    return '' +
      '<a class="' + (CUR === "index.html" ? "is-active" : "") + '" href="index.html">Startseite</a>' +
      '<a class="' + (CUR === "ueber-uns.html" ? "is-active" : "") + '" href="ueber-uns.html">Über uns</a>' +
      '<div class="mobile-nav__label">Leistungen</div>' + svc +
      '<div class="mobile-nav__label">Mehr</div>' +
      '<a class="' + (CUR === "referenzen.html" ? "is-active" : "") + '" href="referenzen.html">Referenzen</a>' +
      '<a class="' + (CUR === "kontakt.html" ? "is-active" : "") + '" href="kontakt.html">Kontakt</a>' +
      '<div class="mobile-nav__cta">' +
        '<a class="btn btn--block" href="kontakt.html">Angebot anfordern</a>' +
        '<a class="btn btn--ghost btn--block" href="tel:' + COMPANY.phoneHref + '" style="color:#e6efe9;border-color:rgba(255,255,255,.25)">' + I.phone + COMPANY.phone + '</a>' +
        '<button class="theme-toggle" type="button" data-theme-toggle aria-label="Modus wechseln"><span class="ti-icon"></span><span class="ti-text"></span></button>' +
      '</div>';
  }

  /* ----------  Footer  ---------- */
  function buildFooter() {
    var svcLinks = SERVICES.map(function (s) {
      return '<li><a href="' + s.href + '">' + s.label + '</a></li>';
    }).join("");
    return '' +
      '<div class="container container--wide">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<a class="brand" href="index.html">' + logoSVG() +
              '<span class="brand__text"><span class="brand__name">M&amp;M</span><span class="brand__sub" style="color:#8a948e">Unternehmensgruppe</span></span></a>' +
            '<p>RAL GGWL-zertifizierter Forstbetrieb für Forstwirtschaft, Landschaftsbau, Maschinenhandel, Vermietung und Container – für Privat- und Gewerbekunden.</p>' +
            '<div class="footer-social">' +
              '<a href="' + COMPANY.myhammer + '" target="_blank" rel="noopener" aria-label="MyHammer Profil">' + I.award + '</a>' +
              '<a href="#" aria-label="Facebook">' + I.facebook + '</a>' +
              '<a href="#" aria-label="Instagram">' + I.instagram + '</a>' +
            '</div>' +
          '</div>' +
          '<div class="footer-col"><h4>Leistungen</h4><ul>' + svcLinks + '</ul></div>' +
          '<div class="footer-col"><h4>Unternehmen</h4><ul>' +
            '<li><a href="ueber-uns.html">Über uns</a></li>' +
            '<li><a href="leistungen.html">Alle Leistungen</a></li>' +
            '<li><a href="referenzen.html">Referenzen</a></li>' +
            '<li><a href="kontakt.html">Kontakt</a></li>' +
            '<li><a href="impressum.html">Impressum</a></li>' +
            '<li><a href="datenschutz.html">Datenschutz</a></li>' +
          '</ul></div>' +
          '<div class="footer-col"><h4>Kontakt</h4><ul class="footer-contact">' +
            '<li>' + I.pin + '<span>' + COMPANY.legal + '<br>' + COMPANY.street + '<br>' + COMPANY.city + '</span></li>' +
            '<li>' + I.phone + '<a href="tel:' + COMPANY.phoneHref + '">' + COMPANY.phone + '</a></li>' +
            '<li>' + I.mail + '<a href="mailto:' + COMPANY.email + '">' + COMPANY.email + '</a></li>' +
            '<li>' + I.clock + '<span>Mo–Fr 07:00–17:00 Uhr</span></li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<span>© ' + new Date().getFullYear() + ' ' + COMPANY.legal + ' · Alle Rechte vorbehalten.</span>' +
          '<nav aria-label="Rechtliches"><a href="impressum.html">Impressum</a><a href="datenschutz.html">Datenschutz</a><a href="kontakt.html">Kontakt</a></nav>' +
        '</div>' +
      '</div>';
  }

  function logoSVG() {
    return '<svg class="brand__mark" viewBox="0 0 48 48" aria-hidden="true">' +
      '<defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#52b788"/><stop offset="1" stop-color="#1b4332"/></linearGradient></defs>' +
      '<rect width="48" height="48" rx="12" fill="url(#lg)"/>' +
      '<path d="M24 8 14 22h4l-6 9h9v9h6v-9h9l-6-9h4z" fill="#fff" opacity=".95"/>' +
      '<path d="M22 40h4v-9h-4z" fill="#0c1f15" opacity=".25"/></svg>';
  }

  /* ----------  Inject layout  ---------- */
  function inject() {
    var header = document.getElementById("site-header");
    if (header) { header.className = "site-header"; header.innerHTML = buildHeader(); }

    var mnav = document.createElement("nav");
    mnav.className = "mobile-nav"; mnav.setAttribute("aria-label", "Mobile Navigation");
    mnav.innerHTML = buildMobileNav();
    document.body.appendChild(mnav);

    var footer = document.getElementById("site-footer");
    if (footer) { footer.className = "site-footer"; footer.innerHTML = buildFooter(); }

    var fab = document.createElement("a");
    fab.className = "float-cta"; fab.href = "tel:" + COMPANY.phoneHref;
    fab.setAttribute("aria-label", "Jetzt anrufen"); fab.innerHTML = I.phone;
    document.body.appendChild(fab);

    wireHeader(header, mnav);
  }

  /* ----------  Header behaviour  ---------- */
  function wireHeader(header, mnav) {
    if (!header) return;
    var burger = header.querySelector(".burger");

    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 30);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    function setMenu(open) {
      document.body.classList.toggle("menu-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      if (burger) { burger.setAttribute("aria-expanded", String(open)); burger.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen"); }
    }
    if (burger) burger.addEventListener("click", function () { setMenu(!document.body.classList.contains("menu-open")); });
    mnav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 900) setMenu(false); });

    // mobile dropdown trigger jumps to overview page; keyboard expand on desktop
    header.querySelectorAll(".nav__item.has-menu > .nav__link").forEach(function (link) {
      link.addEventListener("keydown", function (e) {
        if (e.key === "Enter") return; // allow navigation
      });
    });
  }

  /* ----------  Scroll reveal  ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ----------  Counters  ---------- */
  function initCounters() {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.getAttribute("data-count")),
            suffix = el.getAttribute("data-suffix") || "", dur = 1500, start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = target * eased;
          el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ----------  FAQ accordion  ---------- */
  function initFaq() {
    document.querySelectorAll(".faq__q").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        var ans = btn.nextElementSibling;
        btn.setAttribute("aria-expanded", String(!open));
        ans.style.maxHeight = open ? null : ans.scrollHeight + "px";
      });
    });
  }

  /* ----------  Map consent (DSGVO 2-Klick)  ---------- */
  function initMap() {
    var box = document.getElementById("map-consent");
    if (!box) return;
    var btn = box.querySelector("[data-load-map]");
    if (btn) btn.addEventListener("click", function () {
      var src = box.getAttribute("data-map-src");
      var wrap = document.createElement("div");
      wrap.className = "map-wrap";
      wrap.innerHTML = '<iframe class="map-embed" src="' + src + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen title="Standort M&M Unternehmensgruppe, Groß-Umstadt"></iframe>';
      box.replaceWith(wrap);
    });
  }

  /* ----------  Lightbox  ---------- */
  function initLightbox() {
    var items = document.querySelectorAll("[data-lightbox]");
    if (!items.length) return;
    var lb = document.createElement("div");
    lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true");
    lb.innerHTML = '<button class="lightbox__close" aria-label="Schließen">' + I.close + '</button><figure></figure>';
    document.body.appendChild(lb);
    var fig = lb.querySelector("figure");
    function open(html, cap) {
      fig.innerHTML = html + (cap ? '<figcaption>' + cap + '</figcaption>' : "");
      lb.classList.add("is-open"); document.body.style.overflow = "hidden";
    }
    function close() { lb.classList.remove("is-open"); document.body.style.overflow = ""; }
    items.forEach(function (it) {
      it.addEventListener("click", function () {
        var inner = it.querySelector("svg, img");
        var cap = it.getAttribute("data-caption") || (it.querySelector("figcaption") ? it.querySelector("figcaption").textContent : "");
        if (inner) open(inner.outerHTML, cap);
      });
    });
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.closest(".lightbox__close")) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* ----------  Contact form (clientseitig, DSGVO)  ---------- */
  function initForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var success = form.querySelector(".form-success");

    function setError(field, on) {
      var wrap = field.closest(".field");
      if (wrap) wrap.classList.toggle("field--error", on);
    }
    function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;

      // Honeypot — Bots füllen dieses versteckte Feld
      var hp = form.querySelector('input[name="website"]');
      if (hp && hp.value) return;

      var required = form.querySelectorAll("[required]");
      required.forEach(function (f) {
        var empty = f.type === "checkbox" ? !f.checked : !f.value.trim();
        var bad = empty || (f.type === "email" && !validEmail(f.value));
        setError(f, bad);
        if (bad) ok = false;
      });

      if (!ok) {
        var firstErr = form.querySelector(".field--error");
        if (firstErr) firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      // Ohne Backend: vorausgefüllte E-Mail erzeugen (mailto). Für Live-Betrieb
      // hier stattdessen einen Server-Endpunkt / Formulardienst anbinden.
      var data = {
        Name: getVal(form, "name"),
        Telefon: getVal(form, "phone"),
        "E-Mail": getVal(form, "email"),
        Anfrageart: getVal(form, "topic"),
        Nachricht: getVal(form, "message")
      };
      var body = Object.keys(data).map(function (k) { return k + ": " + data[k]; }).join("\n");
      var subject = "Anfrage über die Website" + (data.Anfrageart ? " – " + data.Anfrageart : "");
      var mailto = "mailto:" + COMPANY.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      if (success) {
        success.classList.add("is-visible");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
      // E-Mail-Programm öffnen (leicht verzögert, damit die Bestätigung sichtbar ist)
      setTimeout(function () { window.location.href = mailto; }, 600);
    });

    form.querySelectorAll("[required]").forEach(function (f) {
      f.addEventListener("input", function () { setError(f, false); });
      f.addEventListener("change", function () { setError(f, false); });
    });
  }
  function getVal(form, name) { var el = form.querySelector('[name="' + name + '"]'); return el ? el.value.trim() : ""; }

  /* ----------  Year stamp (optional spans)  ---------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ----------  Boot  ---------- */
  function boot() {
    inject();
    initTheme();
    initReveal();
    initCounters();
    initFaq();
    initMap();
    initLightbox();
    initForm();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }

  // Expose icons for inline usage if needed
  window.MM_ICONS = I;
})();
