# GRABOWSKI — Pracownia Stolarska

**Live: https://kodastrony.github.io/grabowski/**
Repo: https://github.com/kodastrony/grabowski

Strona portfolio (demo) dla fikcyjnej marki stolarskiej, wykonana przez **KODA**.

Inspiracja klimatem: szwajcarskie strony rzemieślnicze (czysty layout, dużo
światła, duża typografia, płynny scroll). Cała treść, marka „Grabowski",
logo, teksty i kod są oryginalne. Zdjęcia: [Unsplash](https://unsplash.com)
(licencja Unsplash — darmowe użycie komercyjne, hotlinkowane z CDN).

## Stack

- Czysty HTML + CSS + JS (bez bundlera)
- [GSAP 3.13](https://gsap.com) z CDN: ScrollTrigger, ScrollSmoother, SplitText
  (od wersji 3.13 wszystkie pluginy są darmowe)
- Font: Inter Tight (Google Fonts) — zamiennik PP Neue Montreal

## Uruchomienie

Dowolny serwer statyczny, np.:

```
npx serve -l 5173 .
```

albo po prostu otwórz `index.html` (animacje działają też z `file://`).

## Co jest w środku

- **SPA na hash-routingu** — `#/oferta/{kuchnie|zabudowy|meble}`,
  `#/projekt/{slug}`; przejścia między widokami przez beżową „kurtynę"
  (clip-path), reset scrolla, podmiana tytułu karty i etykiety w headerze,
  przycisk „← Wstecz" na podstronach
- **Strony ofertowe** — wielki nagłówek (maskowane linie), pozioma
  galeria pinowana scrubowana scrollem (jak na projektach, 4–5 zdjęć),
  statement, zakres, siatka realizacji
- **Strony projektów** — opis + credits jako pierwszy kafel **poziomej
  galerii pinowanej do ekranu i scrubowanej pionowym scrollem**
  (7–8 zdjęć, zwolnione tempo 1.35×; na ekranach dotykowych i wąskich
  galeria przechodzi w pionowy, statyczny układ), metryka projektu oraz
  dostępna sekcja „Następny projekt / Strona główna" pod galerią
- **Intro** — znak logo (zazębiające się grzebienie = złącze stolarskie)
  składa się z dwóch stron, potem plansza wyjeżdża do góry
- **Smooth scroll + parallax** — ScrollSmoother, zdjęcia z `data-speed="auto"`
- **Hero slider (4 slajdy z opisami)** — biały panel z nagłówkiem
  i krótkim opisem + zdjęcie; **wirtualna taśma**: pozycja jest liczbą
  ułamkową, kliknięcia przesuwają tylko cel, a jeden retargetowany
  tween dowozi pozycję — spam kliknięć daje pojedynczy płynny przejazd
  przez kolejne slajdy (zdjęcia jadą krawędź-w-krawędź z parallaxem
  okna, bez żadnego skoku); pasek postępu jako jedyny zegar autoplayu
  (restart przy zmianie, pauza na hover/poza ekranem/przy otwartym
  menu), rolowany licznik 01—04, kursor-strzałka
- **Rolowane linki** (hover) — generowane przez JS z `[data-roll]`
- **Reveals** — SplitText maskowane linie dużych akapitów + fade-up sekcji
- **Mega-menu** — panel zjeżdżający spod headera, 3 kolumny, backdrop;
  kotwice działają też z podstron (powrót na home + doscrollowanie)
- Home: hero, slider, statement, aktualności, oferta (teasery → podstrony),
  proces 01–04, materiał, realizacje (→ projekty), cytat, karty, footer

Treści podstron (oferty, projekty, strony prawne) siedzą w `js/main.js`
w obiektach `OFFERS`, `PROJECTS`, `PAGES` i `LEGAL` — łatwo podmienić
teksty i zdjęcia w jednym miejscu.

## Struktura plików

```
index.html          strona (statyczny home + kontener podstron SPA)
css/style.css        style + design-tokeny
js/main.js           routing, animacje, dane treści
404.html             markowa strona błędu (GitHub Pages)
robots.txt           indeksowanie + wskazanie sitemap
sitemap.xml          kanoniczny URL strony
site.webmanifest     PWA (nazwa, kolory, ikony)
assets/              apple-touch-icon + ikony 192/512 (znak marki)
```

## Gotowość do publikacji

- **Dostępność (WCAG 2.2 AA):** widoczny fokus klawiatury (`:focus-visible`
  na wszystkim, wyciszony dla myszy), kontrast tekstu pomocniczego ≥ 5,2:1,
  menu jako prawdziwy modal (`inert` + pułapka fokusu + powrót fokusu),
  skip-link, slider z przyciskami prev/next i `aria-live`, `aria-current`
  w menu, komunikat formularza jako `role="status"`, pełne `prefers-reduced-motion`
- **Wydajność:** `preconnect`/`dns-prefetch` do CDN-ów, `defer` na skryptach,
  `preload` obrazu LCP, mniejsze warianty obrazów (≤ 1600 px), `will-change`
  tylko na hover, a na słabych urządzeniach (≤ 4 rdzenie/4 GB lub Save-Data)
  ScrollSmoother i przejmowanie scrolla są wyłączane (natywny scroll)
- **SEO / social:** `canonical`, komplet Open Graph + Twitter Card,
  dane strukturalne JSON-LD (`HomeAndConstructionBusiness`), `robots.txt`,
  `sitemap.xml`, `site.webmanifest`, apple-touch-icon
- **Formularz / RODO:** dostępna walidacja po polsku, pole zgody z `name`,
  link do polityki prywatności; strony `#/polityka-prywatnosci` i `#/regulamin`

## Zachowania brzegowe

- `prefers-reduced-motion` — wszystko widoczne od razu, bez animacji;
  pozioma galeria projektu przechodzi w pionowy układ statyczny
- Karta otwarta w tle (`document.hidden`) — boot w stanie końcowym,
  ScrollSmoother dopina się przy pierwszym pokazaniu karty
- `?anim=1` w URL — wymusza pełne animacje mimo ukrytej karty
  (testy automatyczne, nagrania)
- Słabe urządzenie / Save-Data — ScrollSmoother pomijany, natywny scroll
  (ekrany dotykowe nie mają przejmowania scrolla — zero janku)
- Wolne/zablokowane fonty — intro odpala się po max 1,5 s (timeout zamiast
  zawisu za nieprzezroczystą planszą)
- Brak GSAP lub któregoś pluginu (padnięty CDN) — klasa `.js` nie jest
  dodawana, strona pozostaje w pełni czytelna bez animacji

## Uwaga techniczna (lekcja z debugowania)

Nie ustawiać transformów startowych animowanych przez GSAP w arkuszu CSS —
GSAP parsuje computed style jako macierz w px i `yPercent` w cache'u zostaje 0,
przez co tween „nie ma czego" animować. Stan startowy ustawia `gsap.set()`.
