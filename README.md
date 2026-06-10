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
- **Strony ofertowe** — wielki nagłówek (maskowane linie), pełnoszerokościowy
  slider z rolowanym licznikiem 01 — 04, kursorem-strzałką i autoplayem
  (pauza na hover / poza viewportem), statement, zakres, siatka realizacji
- **Strony projektów** — opis + credits jako pierwszy kafel **poziomej
  galerii pinowanej do ekranu i scrubowanej pionowym scrollem**
  (7–8 zdjęć, zwolnione tempo 1.35×), na końcu kafel nawigacyjny
  z dużymi linkami „Następny projekt" i „Strona główna", metryka projektu
- **Intro** — znak logo (zazębiające się grzebienie = złącze stolarskie)
  składa się z dwóch stron, potem plansza wyjeżdża do góry
- **Smooth scroll + parallax** — ScrollSmoother, zdjęcia z `data-speed="auto"`
- **Hero** — kicker, tytuł, lead i link „Zobacz, co robimy"
- **Hero slider (2 slajdy)** — biały panel z tekstem + zdjęcie; przejścia
  wyłącznie na transformach (nasunięcie z prawej + parallax okna),
  przerywalne bez cooldownu (klik zawsze działa), pasek postępu jako
  jedyny zegar autoplayu (restart przy zmianie, pauza na hover/poza
  ekranem/przy otwartym menu), rolowany licznik 01—02, kursor-strzałka
- **Rolowane linki** (hover) — generowane przez JS z `[data-roll]`
- **Reveals** — SplitText maskowane linie dużych akapitów + fade-up sekcji
- **Mega-menu** — panel zjeżdżający spod headera, 3 kolumny, backdrop;
  kotwice działają też z podstron (powrót na home + doscrollowanie)
- Home: hero, slider, statement, aktualności, oferta (teasery → podstrony),
  proces 01–04, materiał, realizacje (→ projekty), cytat, karty, footer

Treści podstron (oferty, projekty) siedzą w `js/main.js` w obiektach
`OFFERS` i `PROJECTS` — łatwo podmienić teksty i zdjęcia w jednym miejscu.

## Zachowania brzegowe

- `prefers-reduced-motion` — wszystko widoczne od razu, bez animacji;
  pozioma galeria projektu przechodzi w pionowy układ statyczny
- Karta otwarta w tle (`document.hidden`) — boot w stanie końcowym,
  ScrollSmoother dopina się przy pierwszym pokazaniu karty
- `?anim=1` w URL — wymusza pełne animacje mimo ukrytej karty
  (testy automatyczne, nagrania)
- Brak GSAP (padnięty CDN) — strona w pełni czytelna bez animacji

## Uwaga techniczna (lekcja z debugowania)

Nie ustawiać transformów startowych animowanych przez GSAP w arkuszu CSS —
GSAP parsuje computed style jako macierz w px i `yPercent` w cache'u zostaje 0,
przez co tween „nie ma czego" animować. Stan startowy ustawia `gsap.set()`.
