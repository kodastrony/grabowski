/* ============================================================
   GRABOWSKI — Pracownia Stolarska
   SPA: routing hash + widoki ofert / projektów / stron
   Animacje: GSAP + ScrollTrigger + ScrollSmoother + SplitText
   ============================================================ */

if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
  // CDN niedostępny — strona działa bez animacji (brak klasy .js = wszystko widoczne)
  throw new Error('GSAP nie został załadowany — pomijam animacje.');
}

document.documentElement.classList.add('js');

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
// Karta otwarta w tle (np. ctrl+klik): bootujemy od razu w stanie końcowym,
// bo rAF nie tyka — intro i odsłony zostałyby zamrożone.
// ?anim=1 wymusza pełne animacje (testy / nagrania).
const startHidden = document.visibilityState === 'hidden';
const forceAnim = /[?&]anim=1/.test(location.search);
const instantBoot = prefersReduced || (startHidden && !forceAnim);

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

/* ------------------------------------------------------------
   OBRAZKI — srcset + lazy loading
   ------------------------------------------------------------ */
const UNSPLASH = 'https://images.unsplash.com/';

function imgTag(id, alt, opts = {}) {
  const widths = opts.widths || [600, 900, 1400, 2000];
  const sizes = opts.sizes || '(max-width: 900px) 100vw, 70vw';
  const srcset = widths.map((w) => `${UNSPLASH}${id}?w=${w}&q=70&auto=format&fit=crop ${w}w`).join(', ');
  const src = `${UNSPLASH}${id}?w=${widths[widths.length - 2]}&q=70&auto=format&fit=crop`;
  const eager = opts.eager
    ? ' fetchpriority="high"'
    : ' loading="lazy" decoding="async"';
  return `<img src="${src}" srcset="${srcset}" sizes="${sizes}" alt="${alt}"${eager}${opts.speed ? ` data-speed="${opts.speed}"` : ''}>`;
}

/* ------------------------------------------------------------
   DANE TREŚCI
   ------------------------------------------------------------ */
const PROJECTS = {
  'apartament-mokotow': {
    title: 'Apartament Mokotów',
    place: 'Warszawa',
    year: '2025',
    scope: 'Kuchnia, spiżarnia, zabudowa RTV',
    desc: 'Kuchnia w amerykańskim orzechu, otwarta na salon. Czarny kamień, mosiężne detale i fronty bez uchwytów — całość rozrysowana tak, by domownicy mijali się bez kolizji nawet w godzinach szczytu.',
    credits: 'Projekt wnętrza: Studio Czwarte Piętro · Zdjęcia: M. Zaleska',
    next: 'dom-pod-lasem',
    images: [
      { id: 'photo-1771270731051-9cfbb7222946', ar: '0.74', alt: 'Wnęka kuchenna w orzechu z czarnym kamieniem' },
      { id: 'photo-1622372738946-62e02505feb3', ar: '1.05', alt: 'Ciemna kuchnia z ryflowanymi frontami i wyspą' },
      { id: 'photo-1772442363851-738a548f6c5c', ar: '1.5', alt: 'Jadalnia w popołudniowym świetle, ryflowana podstawa stołu' },
      { id: 'photo-1774437290626-34d18c49598a', ar: '0.8', alt: 'Detal ciemnej zabudowy z drewnianym gniazdem elektrycznym' },
      { id: 'photo-1576249720336-35b043fce96d', ar: '0.67', alt: 'Orzechowy stół w smudze popołudniowego światła' },
      { id: 'photo-1631396328093-e5941f59cf7b', ar: '1.5', alt: 'Wióry i nóż na stole warsztatowym — dopasowanie frontów' },
      { id: 'photo-1779648596383-fc041f8bd4da', ar: '0.8', alt: 'Spiżarnia z ryflowanego orzecha' },
      { id: 'photo-1736506159776-22ca388780fa', ar: '0.68', alt: 'Usłojenie orzecha amerykańskiego z bliska' },
    ],
  },
  'dom-pod-lasem': {
    title: 'Dom pod Lasem',
    place: 'Konstancin',
    year: '2024',
    scope: 'Kuchnia, jadalnia, schody',
    desc: 'Dom wśród sosen: jesionowe fronty, sufit z litych lameli i blat, który łapie popołudniowe światło. Zabudowy poprowadzone od podłogi po kalenicę — bez jednej listwy maskującej.',
    credits: 'Architektura: Pracownia Północ · Zdjęcia: K. Brzeski',
    next: 'mieszkanie-na-woli',
    images: [
      { id: 'photo-1729837149090-764b4272c2d7', ar: '1.45', alt: 'Jasna kuchnia z drewnianym sufitem i frontami z jesionu' },
      { id: 'photo-1515446134809-993c501ca304', ar: '1.3', alt: 'Przekrój pnia dębu — słoje przyrostu rocznego' },
      { id: 'photo-1605635544350-5796fb1622d1', ar: '1.5', alt: 'Stół jadalniany z litych desek jesionu' },
      { id: 'photo-1583606638441-b9c746100447', ar: '1.45', alt: 'Sosnowy las we mgle za oknami domu' },
      { id: 'photo-1638718260002-18bdc8082608', ar: '0.67', alt: 'Trasowanie ołówkiem miejsca cięcia na pniu' },
      { id: 'photo-1597960194599-22929afc25b1', ar: '1.5', alt: 'Hala pracowni w porannym słońcu — tu powstawały fronty' },
      { id: 'photo-1644358687651-464c503972fe', ar: '1.5', alt: 'Sezonowane deski jesionu w sztaplach' },
      { id: 'photo-1463082459669-fd1ca1692fea', ar: '1.5', alt: 'Szlifowanie jesionowej deski w pracowni' },
    ],
  },
  'mieszkanie-na-woli': {
    title: 'Mieszkanie na Woli',
    place: 'Warszawa',
    year: '2023',
    scope: 'Regały, gabinet, sypialnia',
    desc: 'System regałów, który rośnie razem z biblioteką właścicieli. Dąb olejowany na biało, wsporniki frezowane na pełny czop — ani jednego metalowego kątownika.',
    credits: 'Zdjęcia: M. Zaleska',
    next: 'apartament-mokotow',
    images: [
      { id: 'photo-1594026112284-02bb6f3352fe', ar: '1.45', alt: 'Autorski system półek z dębu i bieli na ścianie salonu' },
      { id: 'photo-1593069431672-f903a33c286f', ar: '1.3', alt: 'Zabudowa z orzecha i bieli z otwartą wnęką biurka' },
      { id: 'photo-1720391793902-06a80038b1ed', ar: '0.67', alt: 'Narożnik dębowego stołu w bocznym świetle' },
      { id: 'photo-1497219055242-93359eeed651', ar: '1.85', alt: 'Dłuto prowadzone wzdłuż rysunku na desce' },
      { id: 'photo-1590635022668-81cc8696a19d', ar: '1.5', alt: 'Próbki gatunków drewna — dobór dębu do projektu' },
      { id: 'photo-1426927308491-6380b6a9936f', ar: '1.5', alt: 'Ściana narzędzi ręcznych w pracowni' },
      { id: 'photo-1779277301060-ca36c5afead5', ar: '1.5', alt: 'Sypialnia z meblami z ciemnego drewna' },
    ],
  },
};

const OFFERS = {
  kuchnie: {
    label: 'Kuchnie',
    titleLines: ['Kuchnia, która', 'zaczyna się', 'od rozmowy'],
    statement: 'Projektujemy wokół ruchów, które wykonujesz codziennie — od porannej kawy po gotowanie w sześć rąk. Fronty z litego drewna, ciche okucia, blat na wysokość łokcia.',
    detailLabel: 'Zakres',
    detail: 'Projekt w skali 1:1, dobór gatunku i wykończenia, integracja AGD, montaż w dwa dni i opieka serwisowa na lata.',
    slides: [
      { id: 'photo-1622372738946-62e02505feb3', ar: '1.05', alt: 'Ciemna kuchnia z ryflowanymi frontami i mosiężnymi detalami' },
      { id: 'photo-1729837149090-764b4272c2d7', ar: '1.45', alt: 'Jasna kuchnia z drewnianym sufitem z litych lameli' },
      { id: 'photo-1771270731051-9cfbb7222946', ar: '0.74', alt: 'Wnęka kuchenna w orzechu amerykańskim' },
      { id: 'photo-1774437290626-34d18c49598a', ar: '0.8', alt: 'Detal ciemnej zabudowy kuchennej' },
      { id: 'photo-1772442363851-738a548f6c5c', ar: '1.5', alt: 'Jadalnia przy kuchni w popołudniowym świetle' },
    ],
    projects: ['apartament-mokotow', 'dom-pod-lasem'],
  },
  zabudowy: {
    label: 'Zabudowy',
    titleLines: ['Zabudowy, które', 'znikają w ścianie'],
    statement: 'Garderoby, szafy i ściany funkcyjne mierzone co do milimetra. Zagospodarujemy każdy skos i wnękę tak, by przedmioty zniknęły, a wnętrze mogło odetchnąć.',
    detailLabel: 'Zakres',
    detail: 'Garderoby i szafy wnękowe, ściany RTV, biblioteki, zabudowy skosów, drzwi przesuwne i ukryte.',
    slides: [
      { id: 'photo-1760072513393-b9d81f65dd7e', ar: '1.35', alt: 'Zabudowa garderobiana na całą ścianę sypialni' },
      { id: 'photo-1779648596383-fc041f8bd4da', ar: '0.8', alt: 'Garderoba z ryflowanego orzecha z toaletką' },
      { id: 'photo-1593069431672-f903a33c286f', ar: '1.3', alt: 'Zabudowa z orzecha i bieli z wnęką na biurko' },
      { id: 'photo-1779277301060-ca36c5afead5', ar: '1.5', alt: 'Sypialnia z zabudową z ciemnego drewna' },
    ],
    projects: ['apartament-mokotow', 'mieszkanie-na-woli'],
  },
  meble: {
    label: 'Meble',
    titleLines: ['Meble z podpisem', 'pracowni'],
    statement: 'Stoły, regały i pojedyncze bryły, w których widać rękę projektanta i słoje deski. Każdy mebel dostaje numer, datę i gatunek — bo dobre rzeczy warto metrykować.',
    detailLabel: 'Zakres',
    detail: 'Stoły i ławy, regały modułowe, komody, biurka oraz pojedyncze projekty autorskie na zamówienie.',
    slides: [
      { id: 'photo-1772442363851-738a548f6c5c', ar: '1.5', alt: 'Stół i krzesła w ciepłym popołudniowym świetle' },
      { id: 'photo-1605635544350-5796fb1622d1', ar: '1.5', alt: 'Stół jadalniany z litych desek' },
      { id: 'photo-1720391793902-06a80038b1ed', ar: '0.67', alt: 'Narożnik dębowego stołu — detal połączenia' },
      { id: 'photo-1594026112284-02bb6f3352fe', ar: '1.45', alt: 'System półek z dębu i bieli' },
      { id: 'photo-1463082459669-fd1ca1692fea', ar: '1.5', alt: 'Szlifowanie blatu w pracowni' },
    ],
    projects: ['mieszkanie-na-woli', 'dom-pod-lasem'],
  },
};

const PAGES = {
  filozofia: {
    label: 'Filozofia',
    titleLines: ['W zgodzie', 'z materiałem'],
    banner: [
      { id: 'photo-1583606638441-b9c746100447', alt: 'Sosnowy las we mgle' },
      { id: 'photo-1590635022668-81cc8696a19d', alt: 'Ściana próbek różnych gatunków drewna' },
      { id: 'photo-1644358687651-464c503972fe', alt: 'Sezonowane deski ułożone w sztaple' },
      { id: 'photo-1515446134809-993c501ca304', alt: 'Przekrój pnia ze słojami' },
    ],
    statement: 'Cztery zasady prowadzą każdy nasz projekt — od wyboru deski po ostatnią warstwę oleju.',
    topics: [
      {
        title: 'Jedno ścięte, trzy posadzone',
        text: 'Kupujemy drewno wyłącznie z certyfikowanych, polskich tartaków, a za każdy metr sześcienny finansujemy nowe nasadzenia. Las, z którego żyjemy, ma rosnąć szybciej, niż my heblujemy.',
      },
      {
        title: 'Drewno cięte we właściwym czasie',
        text: 'Deski sezonują u nas od dwóch do pięciu lat — najpierw pod wiatą, potem w suszarni. Drewno, któremu dano czas, pracuje mniej i nie zaskakuje pęknięciem w środku zimy.',
      },
      {
        title: 'Złącza zamiast kleju',
        text: 'Czopy, wczepy i jaskółcze ogony przenoszą siły tam, gdzie chemia z czasem odpuszcza. Kleju używamy wstrzemięźliwie, a wkrętów — tylko tam, gdzie kiedyś trzeba będzie coś rozkręcić.',
      },
      {
        title: 'Energia z własnego dachu',
        text: 'Fotowoltaika na dachu warsztatu pokrywa większość zużycia maszyn, a brykiet z naszych wiórów ogrzewa halę zimą. Resztki nigdy nie lecą do kontenera — wracają do obiegu.',
      },
    ],
    closingImg: { id: 'photo-1638718260002-18bdc8082608', alt: 'Znaczenie ołówkiem miejsca cięcia na pniu', caption: 'Każde cięcie zaczyna się od kreski ołówka.' },
  },
  pracownia: {
    label: 'Pracownia',
    titleLines: ['Ludzie', 'i miejsce'],
    statement: 'Czterech stolarzy, jedna projektantka i czterysta metrów warsztatu na skraju Milanówka. Od 1987 roku w tym samym miejscu — dziś z frezarką CNC ustawioną obok strugnic po dziadku.',
    numbers: [
      { value: 1987, label: 'rok założenia' },
      { value: 420, suffix: ' m²', label: 'warsztatu i showroomu' },
      { value: 200, suffix: '+', label: 'zrealizowanych projektów' },
      { value: 5, label: 'osób w zespole' },
    ],
    rows: [
      {
        img: { id: 'photo-1601058268499-e52658b8bb88', alt: 'Stolarz trasujący element przy pile formatowej' },
        title: 'Warsztat',
        text: 'Hala z piłą formatową, frezarką CNC i lakiernią olejną. Maszyny robią to, w czym są niezawodne; ostatnie przejście dłutem i pacą z olejem zawsze należy do człowieka.',
      },
      {
        img: { id: 'photo-1426927308491-6380b6a9936f', alt: 'Ściana ręcznych narzędzi stolarskich' },
        title: 'Narzędzia z historią',
        text: 'Połowa naszych strugów i dłut ma więcej lat niż my. Ostrzymy je co piątek — rytuał, który uczy szacunku do narzędzia i do materiału.',
      },
      {
        img: { id: 'photo-1631396326838-de37e5f8bcbc', alt: 'Stolarz w fartuchu przy stole warsztatowym' },
        title: 'Zespół',
        text: 'Jan założył pracownię, Helena projektuje, Tomasz i Paweł budują, Michał montuje. Mały zespół znaczy tyle, że osoba, z którą rozmawiasz przy pomiarze, stanie też przy montażu.',
      },
    ],
  },
  kontakt: {
    label: 'Kontakt',
    titleLines: ['Dojazd', 'i kontakt'],
    statement: 'Pracownia i showroom pod jednym dachem, dziesięć minut pieszo od stacji PKP Milanówek. Wpadnij dotknąć frontów, pooglądać próbki i porozmawiać o projekcie.',
    info: [
      { label: 'Adres', html: 'ul. Dębowa 12<br>05-822 Milanówek<br><a class="footer__contact-link" href="https://maps.google.com/?q=Milan%C3%B3wek+D%C4%99bowa+12" target="_blank" rel="noopener">Trasa w Google Maps ↗</a>' },
      { label: 'Godziny', html: 'pon–pt 8:00–17:00<br>sob 9:00–13:00 (po umówieniu)' },
      { label: 'Kontakt', html: '<a class="footer__contact-link" href="tel:+48227584012">T 22 758 40 12</a><br><a class="footer__contact-link" href="mailto:pracownia@grabowski.studio">pracownia@grabowski.studio</a>' },
    ],
    gallery: [
      { id: 'photo-1453806839674-d1a9087ca1ed', alt: 'Komplet dłut rzeźbiarskich na blacie' },
      { id: 'photo-1501516069922-a9982bd6f3bd', alt: 'Przyrządy kreślarskie na desce projektowej' },
      { id: 'photo-1590635022668-81cc8696a19d', alt: 'Próbki gatunków drewna na ścianie showroomu' },
      { id: 'photo-1638718260002-18bdc8082608', alt: 'Trasowanie ołówkiem na pniu' },
      { id: 'photo-1547609434-b732edfee020', alt: 'Praca piłą ręczną w świetle warsztatu' },
      { id: 'photo-1631396328093-e5941f59cf7b', alt: 'Nóż i wióry na stole warsztatowym' },
    ],
  },
};

/* ------------------------------------------------------------
   ROLL HOVER — podwójny tekst dla [data-roll]
   ------------------------------------------------------------ */
function buildRolls(scope) {
  (scope || document).querySelectorAll('[data-roll]').forEach((el) => {
    if (el.querySelector('.roll')) return;
    const text = el.textContent.trim();
    el.textContent = '';
    const wrap = document.createElement('span');
    wrap.className = 'roll';
    const main = document.createElement('span');
    main.className = 'roll__item roll__item--main';
    main.textContent = text;
    const ghost = document.createElement('span');
    ghost.className = 'roll__item roll__item--ghost';
    ghost.textContent = text;
    ghost.setAttribute('aria-hidden', 'true');
    wrap.append(main, ghost);
    el.appendChild(wrap);
  });
}
buildRolls(document);

/* ------------------------------------------------------------
   SCROLLSMOOTHER
   ------------------------------------------------------------ */
let smoother = null;

function createSmoother() {
  if (smoother || prefersReduced) return;
  smoother = ScrollSmoother.create({
    smooth: 1.9,
    effects: true,
    smoothTouch: 0.15,
    normalizeScroll: true,
  });
}

if (!prefersReduced && (!startHidden || forceAnim)) {
  createSmoother();
} else if (startHidden && !prefersReduced) {
  document.addEventListener('visibilitychange', function onVis() {
    if (document.visibilityState === 'visible') {
      document.removeEventListener('visibilitychange', onVis);
      createSmoother();
      ScrollTrigger.refresh();
    }
  });
}

function setScroll(y) {
  if (smoother) smoother.scrollTop(y);
  else window.scrollTo(0, y);
}

function scrollToTarget(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  if (smoother) {
    gsap.to(smoother, {
      scrollTop: Math.max(0, smoother.offset(el, 'top 96px')),
      duration: 1.1,
      ease: 'power3.inOut',
    });
  } else {
    el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
  }
}

/* ------------------------------------------------------------
   ELEMENTY GLOBALNE
   ------------------------------------------------------------ */
const header = document.querySelector('[data-header]');
const pageLabel = document.querySelector('[data-page-label]');
const backBtn = document.querySelector('[data-back]');
const veil = document.querySelector('[data-veil]');
const homeView = document.querySelector('[data-view="home"]');
const pageView = document.querySelector('[data-view="page"]');

ScrollTrigger.create({
  start: 60,
  end: 'max',
  onToggle: (self) => header.classList.toggle('is-scrolled', self.isActive),
});

let currentLabel = pageLabel ? pageLabel.textContent : '';

function swapLabel(text) {
  if (!pageLabel || text === currentLabel) return;
  currentLabel = text;
  if (prefersReduced) { pageLabel.textContent = text; return; }
  gsap.timeline()
    .to(pageLabel, { yPercent: -110, duration: 0.3, ease: 'power2.in', overwrite: 'auto' })
    .add(() => { pageLabel.textContent = text; })
    .fromTo(pageLabel, { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: 'power3.out' });
}

/* ------------------------------------------------------------
   MENU OVERLAY
   ------------------------------------------------------------ */
const menuEl = document.querySelector('[data-menu]');
const menuBtn = document.querySelector('[data-menu-toggle]');
const backdrop = document.querySelector('[data-menu-backdrop]');
let menuOpen = false;

gsap.set(menuEl, { yPercent: -101 });

const menuTl = gsap.timeline({ paused: true });
menuTl
  .set(menuEl, { visibility: 'visible' })
  .set(backdrop, { visibility: 'visible' })
  .to(backdrop, { opacity: 1, duration: 0.55, ease: 'power2.out' }, 0)
  .to(menuEl, { yPercent: 0, duration: 0.75, ease: 'power3.inOut' }, 0)
  .from(menuEl.querySelectorAll('.menu__col'), {
    y: 28, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out',
  }, 0.28);

function setMenu(open) {
  if (open === menuOpen) return;
  menuOpen = open;
  document.body.classList.toggle('menu-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  if (open) menuTl.timeScale(1).play();
  else menuTl.timeScale(1.35).reverse();
  refreshCursorZone();
  window.dispatchEvent(new Event('menu-toggle'));
}

menuBtn.addEventListener('click', () => setMenu(!menuOpen));
backdrop.addEventListener('click', () => setMenu(false));
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

/* ------------------------------------------------------------
   CUSTOM CURSOR — strefy sliderów
   Strefa jest sprawdzana przez elementFromPoint także przy scrollu
   i zmianie widoku, bo elementy uciekają spod kursora bez pointermove.
   ------------------------------------------------------------ */
const cursor = document.querySelector('[data-cursor]');
let refreshCursorZone = () => {};

if (cursor && finePointer && !prefersReduced) {
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });
  let visible = false;
  let lastX = -1;
  let lastY = -1;

  const setVisible = (show) => {
    if (show === visible) return;
    visible = show;
    gsap.to(cursor, {
      opacity: show ? 1 : 0,
      scale: show ? 1 : 0.6,
      duration: 0.3,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  refreshCursorZone = () => {
    if (lastX < 0 || menuOpen) { setVisible(false); return; }
    const el = document.elementFromPoint(lastX, lastY);
    setVisible(Boolean(el && el.closest && el.closest('[data-cursor-zone]')));
  };

  window.addEventListener('pointermove', (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
    xTo(lastX);
    yTo(lastY);
    refreshCursorZone();
  }, { passive: true });

  document.documentElement.addEventListener('pointerleave', () => {
    lastX = -1;
    setVisible(false);
  });

  // smoother dowozi scroll po puszczeniu kółka — sprawdzaj strefę
  // przez cały czas trwania przewijania
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: refreshCursorZone });
} else if (cursor) {
  cursor.style.display = 'none';
}

/* ------------------------------------------------------------
   WSPÓLNE ANIMACJE SCROLLOWE (w obrębie widoku)
   ------------------------------------------------------------ */
let viewCleanups = [];

function buildScrollAnimations(scope) {
  if (instantBoot) {
    gsap.utils.toArray(scope.querySelectorAll('[data-reveal], [data-news-item] .news__link, [data-process-row]'))
      .forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
    scope.querySelectorAll('[data-count-to]').forEach((el) => {
      el.textContent = el.dataset.countTo;
    });
    return;
  }

  gsap.utils.toArray(scope.querySelectorAll('[data-reveal]')).forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.15, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  const newsLinks = gsap.utils.toArray(scope.querySelectorAll('[data-news-item] .news__link'));
  if (newsLinks.length) {
    gsap.to(newsLinks, {
      opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: scope.querySelector('.news__list'), start: 'top 85%', once: true },
    });
  }

  const processRows = gsap.utils.toArray(scope.querySelectorAll('[data-process-row]'));
  if (processRows.length) {
    gsap.to(processRows, {
      opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: scope.querySelector('.process__list'), start: 'top 82%', once: true },
    });
  }

  gsap.utils.toArray(scope.querySelectorAll('[data-lines]')).forEach((el) => {
    const split = new SplitText(el, { type: 'lines', mask: 'lines', autoSplit: true });
    viewCleanups.push(() => split.revert());
    gsap.from(split.lines, {
      yPercent: 112, duration: 1.2, stagger: 0.1, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 84%', once: true },
    });
  });

  // odsłony zdjęć: clip + delikatny zoom (zoom pomijamy tam,
  // gdzie CSS animuje skalę na hover — inline transform by ją zablokował)
  gsap.utils.toArray(scope.querySelectorAll('[data-imgrev]')).forEach((fig) => {
    const img = fig.querySelector('img');
    const hoverScaled = fig.closest('.teaser, .work');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: fig, start: 'top 86%', once: true },
    });
    tl.fromTo(fig, { clipPath: 'inset(0% 0% 16% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 1.35, ease: 'expo.out',
    }, 0);
    if (img && !hoverScaled) {
      tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0);
    }
  });

  // liczniki
  scope.querySelectorAll('[data-count-to]').forEach((el) => {
    const target = parseInt(el.dataset.countTo, 10);
    const obj = { v: Math.max(0, target - Math.min(target, 140)) };
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => { el.textContent = String(Math.round(obj.v)); },
    });
  });
}

/* ------------------------------------------------------------
   SLIDERY — wspólna mechanika przejścia
   Wyłącznie transformy (kompozytor GPU), bez clip-path.
   Przejście jest przerywalne: wywołujący finalizuje poprzednie
   przez tl.progress(1) i od razu startuje następne.
   ------------------------------------------------------------ */
function slideTransition(outMedia, inMedia, onDone) {
  const inImg = inMedia.querySelector('img');
  const outImg = outMedia.querySelector('img');
  inMedia.classList.add('is-active');

  if (prefersReduced) {
    gsap.set(inMedia, { visibility: 'visible', zIndex: 1, xPercent: 0 });
    gsap.set(outMedia, { visibility: 'hidden', zIndex: 0 });
    outMedia.classList.remove('is-active');
    if (onDone) onDone();
    return null;
  }

  gsap.set(inMedia, { visibility: 'visible', zIndex: 2, xPercent: 100 });

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.set(outMedia, { visibility: 'hidden', zIndex: 0, xPercent: 0 });
      gsap.set(outImg, { xPercent: 0, scale: 1 });
      gsap.set(inMedia, { zIndex: 1 });
      outMedia.classList.remove('is-active');
      if (onDone) onDone();
    },
  });
  // klasyczne przepchnięcie: stare zdjęcie AKTYWNIE wyjeżdża w lewo,
  // nowe wjeżdża z prawej tym samym ruchem; obrazki w środku dostają
  // kontrprzesunięcie (parallax okna) — jeden wspólny easing
  const D = 1.05;
  const EASE = 'power3.inOut';
  tl.fromTo(inMedia, { xPercent: 100 }, { xPercent: 0, duration: D, ease: EASE }, 0)
    .fromTo(inImg, { xPercent: -32, scale: 1.05 }, { xPercent: 0, scale: 1, duration: D, ease: EASE }, 0)
    .to(outMedia, { xPercent: -100, duration: D, ease: EASE }, 0)
    .to(outImg, { xPercent: 32, duration: D, ease: EASE }, 0);
  return tl;
}

function rollCounterTo(countEl, value) {
  if (!countEl) return;
  if (prefersReduced) { countEl.textContent = value; return; }
  gsap.killTweensOf(countEl);
  gsap.timeline()
    .to(countEl, { yPercent: -110, duration: 0.28, ease: 'power2.in' })
    .add(() => { countEl.textContent = value; })
    .fromTo(countEl, { yPercent: 110 }, { yPercent: 0, duration: 0.34, ease: 'power3.out' });
}

const pad2 = (n) => String(n + 1).padStart(2, '0');

/* --- slider home (panel + autoplay) ---
   Pasek postępu to JEDYNY zegar autoplayu: restart przy każdej
   zmianie slajdu, pauza gdy hover / poza ekranem / menu otwarte.
   Klik zmienia slajd NATYCHMIAST (poprzednie przejście jest
   finalizowane skokiem do końca — zero cooldownu). */
function initHomeSlider(root) {
  const slides = gsap.utils.toArray(root.querySelectorAll('.slider__slide'));
  const medias = gsap.utils.toArray(root.querySelectorAll('.slider__media'));
  const nextBtn = root.querySelector('[data-slider-next]');
  const countEl = root.querySelector('[data-slider-count]');
  const progressEl = root.querySelector('[data-slider-progress]');
  const stage = root.querySelector('.slider__stage');

  const AUTOPLAY = 6.5;
  let index = 0;
  let activeTl = null;
  let inView = false;
  let hovering = false;

  const progress = prefersReduced ? null : gsap.fromTo(progressEl,
    { scaleX: 0 },
    { scaleX: 1, duration: AUTOPLAY, ease: 'none', paused: true, onComplete: () => go(index + 1) });

  const syncProgress = () => {
    if (!progress) return;
    if (inView && !hovering && !menuOpen) progress.play();
    else progress.pause();
  };

  function go(to) {
    if (slides.length < 2) return;
    const from = index;
    index = (to + slides.length) % slides.length;
    if (index === from) return;

    if (activeTl) { activeTl.progress(1); activeTl = null; }
    if (progress) { progress.pause(0); }

    slides.forEach((s) => s.classList.remove('is-active'));
    const inSlide = slides[index];
    inSlide.classList.add('is-active');

    // tekst: crossfade robi CSS po klasie; JS dokłada tylko delikatny
    // wjazd nagłówka i opisu — zawsze z killem poprzednich tweenów
    const copy = inSlide.querySelectorAll('.slider__heading, .slider__desc');
    gsap.killTweensOf(copy);
    if (!prefersReduced) {
      gsap.fromTo(copy, { y: 26 }, {
        y: 0, duration: 0.85, stagger: 0.09, ease: 'expo.out', delay: 0.15, clearProps: 'transform',
      });
    }

    activeTl = slideTransition(medias[from], medias[index], () => { activeTl = null; });
    rollCounterTo(countEl, pad2(index));
    syncProgress();
  }

  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault(); go(index + 1); });
  stage.addEventListener('click', () => go(index + 1));
  stage.addEventListener('pointerenter', () => { hovering = true; syncProgress(); });
  stage.addEventListener('pointerleave', () => { hovering = false; syncProgress(); });

  const onMenuToggle = () => syncProgress();
  window.addEventListener('menu-toggle', onMenuToggle);

  const st = ScrollTrigger.create({
    trigger: root,
    start: 'top 92%',
    end: 'bottom 8%',
    onToggle: (self) => { inView = self.isActive; syncProgress(); },
  });

  syncProgress();

  return () => {
    if (progress) progress.kill();
    if (activeTl) activeTl.kill();
    st.kill();
    window.removeEventListener('menu-toggle', onMenuToggle);
    gsap.killTweensOf([progressEl, ...medias, ...medias.map((m) => m.querySelector('img')), ...slides.flatMap((s) => [...s.querySelectorAll('.slider__heading, .slider__desc')]), countEl]);
  };
}

/* --- pozioma galeria (pin + scrub) — projekty i strony ofertowe --- */
function initGallery(root) {
  const track = root.querySelector('.hgallery__track');
  if (instantBoot) {
    root.classList.add('hgallery--static');
    return () => {};
  }
  const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
  // 85% dystansu pinowania = jazda w poziomie, ostatnie 15% = postój
  // przy prawej krawędzi — galeria ZAWSZE dojeżdża do końca, zanim
  // strona ruszy w dół (scrub nie zdąży „uciec" w pion)
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top 96px',
      end: () => '+=' + Math.round(dist() * 1.7),
      pin: true,
      scrub: 1.2,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });
  tl.to(track, { x: () => -dist(), ease: 'none', duration: 0.85 })
    .to(track, { x: () => -dist(), ease: 'none', duration: 0.15 });
  return () => {
    tl.scrollTrigger && tl.scrollTrigger.kill();
    tl.kill();
    gsap.set(track, { clearProps: 'transform' });
  };
}

/* --- formularz kontaktowy (demo) --- */
function initContactForm(root) {
  const form = root.querySelector('[data-form]');
  if (!form) return () => {};
  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const fields = form.querySelector('.form__fields');
    const success = form.querySelector('.form__success');
    if (instantBoot) {
      fields.style.display = 'none';
      success.hidden = false;
      return;
    }
    gsap.timeline()
      .to(fields, { opacity: 0, y: -18, duration: 0.45, ease: 'power2.in' })
      .set(fields, { display: 'none' })
      .set(success, { hidden: false })
      .from(success.children, { y: 26, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' });
  };
  form.addEventListener('submit', onSubmit);
  return () => form.removeEventListener('submit', onSubmit);
}

/* ------------------------------------------------------------
   SZABLONY WIDOKÓW
   ------------------------------------------------------------ */
function workCardHTML(slug) {
  const p = PROJECTS[slug];
  const img = p.images[0];
  return `
    <a class="work" href="#/projekt/${slug}">
      <figure class="work__media" data-imgrev>
        ${imgTag(img.id, img.alt, { sizes: '(max-width: 900px) 100vw, 44vw', speed: 'auto' })}
      </figure>
      <div class="work__meta">
        <h3 class="work__title" data-roll>${p.title}</h3>
        <span class="work__place">${p.place}, ${p.year}</span>
      </div>
    </a>`;
}

function pageHeroHTML(titleLines) {
  return `
    <section class="page-hero container">
      <h1 class="page-hero__title" data-page-title>${titleLines.join('<br>')}</h1>
    </section>`;
}

function offerViewHTML(slug) {
  const o = OFFERS[slug];
  const items = o.slides.map((s, i) => `
    <figure class="hgallery__item" style="aspect-ratio: ${s.ar};" data-gallery-item>
      ${imgTag(s.id, s.alt, { sizes: '(max-width: 900px) 92vw, 60vw', eager: i === 0, widths: [700, 1100, 1600] })}
    </figure>`).join('');
  return `
    ${pageHeroHTML(o.titleLines)}
    <section class="hgallery" data-hgallery aria-label="Galeria — ${o.label}">
      <div class="hgallery__track">${items}</div>
    </section>
    <section class="statement container">
      <p class="statement__text" data-lines>${o.statement}</p>
    </section>
    <section class="page-section container">
      <div class="row-split">
        <div class="row-split__label" data-reveal>${o.detailLabel}</div>
        <div class="row-split__content">
          <p class="statement__text statement__text--sm" data-lines>${o.detail}</p>
        </div>
      </div>
    </section>
    <section class="page-section container">
      <div class="works__label" data-reveal>Realizacje — ${o.label.toLowerCase()}</div>
      <div class="pgrid">${o.projects.map(workCardHTML).join('')}</div>
    </section>`;
}

function projectViewHTML(slug) {
  const p = PROJECTS[slug];
  const next = PROJECTS[p.next];
  const items = p.images.map((img, i) => `
    <figure class="hgallery__item" style="aspect-ratio: ${img.ar};" data-gallery-item>
      ${imgTag(img.id, img.alt, { sizes: '(max-width: 900px) 92vw, 60vw', eager: i === 0, widths: [700, 1100, 1600] })}
    </figure>`).join('');
  return `
    <h1 class="sr-only">${p.title} — ${p.place}, ${p.year}</h1>
    <section class="hgallery" data-hgallery aria-label="Galeria projektu ${p.title}">
      <div class="hgallery__track">
        <div class="hgallery__item hgallery__item--text" data-gallery-item>
          <p class="hgallery__desc">${p.desc}</p>
          <p class="hgallery__credits">${p.credits}</p>
        </div>
        ${items}
        <div class="hgallery__item hgallery__item--end" data-gallery-item>
          <span class="hgallery__end-label">Następny projekt</span>
          <a class="hgallery__end-next" href="#/projekt/${p.next}">
            <span data-roll>${next.title}</span>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h17M14 5l7 7-7 7" stroke="currentColor" stroke-width="1.2"/></svg>
          </a>
          <span class="hgallery__end-label hgallery__end-label--second">albo</span>
          <a class="hgallery__end-next hgallery__end-next--home" href="#/">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12H4M10 5l-7 7 7 7" stroke="currentColor" stroke-width="1.2"/></svg>
            <span data-roll>Strona główna</span>
          </a>
        </div>
      </div>
    </section>
    <section class="pmeta container">
      <div class="pmeta__grid" data-reveal>
        <div class="pmeta__label">Metryka projektu</div>
        <div class="pmeta__cell"><span class="pmeta__label">Lokalizacja</span>${p.place}</div>
        <div class="pmeta__cell"><span class="pmeta__label">Rok</span>${p.year}</div>
        <div class="pmeta__cell"><span class="pmeta__label">Zakres</span>${p.scope}</div>
      </div>
    </section>`;
}

function filozofiaViewHTML() {
  const f = PAGES.filozofia;
  const banner = f.banner.map((b) => `
    <figure class="pbanner__item" data-imgrev>
      ${imgTag(b.id, b.alt, { sizes: '(max-width: 900px) 46vw, 23vw', widths: [400, 700, 1000] })}
    </figure>`).join('');
  const topics = f.topics.map((t, i) => `
    <div class="topic" data-reveal>
      <span class="topic__num">0${i + 1}</span>
      <h3 class="topic__title">${t.title}</h3>
      <p class="topic__text">${t.text}</p>
    </div>`).join('');
  return `
    ${pageHeroHTML(f.titleLines)}
    <section class="pbanner container">${banner}</section>
    <section class="statement container">
      <p class="statement__text" data-lines>${f.statement}</p>
    </section>
    <section class="page-section container">
      <div class="topics">${topics}</div>
    </section>
    <section class="page-section container">
      <div class="row-split">
        <div class="row-split__label" data-reveal>Od kreski do mebla</div>
        <div class="row-split__content">
          <figure class="material__figure" data-imgrev>
            ${imgTag(f.closingImg.id, f.closingImg.alt, { sizes: '(max-width: 900px) 92vw, 40vw', widths: [600, 900, 1300] })}
            <figcaption>${f.closingImg.caption}</figcaption>
          </figure>
          <a class="card__link" style="margin-top:2rem" href="#proces" data-roll>Zobacz nasz proces&nbsp;→</a>
        </div>
      </div>
    </section>`;
}

function pracowniaViewHTML() {
  const w = PAGES.pracownia;
  const numbers = w.numbers.map((n) => `
    <div class="num" data-reveal>
      <span class="num__value"><span data-count-to="${n.value}">0</span>${n.suffix || ''}</span>
      <span class="num__label">${n.label}</span>
    </div>`).join('');
  const rows = w.rows.map((r, i) => `
    <div class="prow${i % 2 ? ' prow--flip' : ''}">
      <figure class="prow__media" data-imgrev>
        ${imgTag(r.img.id, r.img.alt, { sizes: '(max-width: 900px) 92vw, 46vw', widths: [600, 1000, 1400], speed: 'auto' })}
      </figure>
      <div class="prow__body">
        <h3 class="prow__title" data-reveal>${r.title}</h3>
        <p class="prow__text" data-reveal>${r.text}</p>
      </div>
    </div>`).join('');
  return `
    ${pageHeroHTML(w.titleLines)}
    <section class="statement container">
      <p class="statement__text" data-lines>${w.statement}</p>
    </section>
    <section class="page-section container">
      <div class="nums">${numbers}</div>
    </section>
    <section class="page-section container">
      <div class="prows">${rows}</div>
    </section>
    <section class="page-section container">
      <div class="pnext__labelwrap" data-reveal>
        <span class="pnext__label">Zobacz na żywo</span><br>
        <a class="pnext__link" href="#/kontakt">
          <span data-roll>Umów wizytę w pracowni</span>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h17M14 5l7 7-7 7" stroke="currentColor" stroke-width="1.2"/></svg>
        </a>
      </div>
    </section>`;
}

function kontaktViewHTML() {
  const k = PAGES.kontakt;
  const info = k.info.map((i) => `
    <div class="kinfo__cell" data-reveal>
      <span class="pmeta__label">${i.label}</span>
      <div class="kinfo__body">${i.html}</div>
    </div>`).join('');
  const gallery = k.gallery.map((g) => `
    <figure class="kgallery__item" data-imgrev>
      ${imgTag(g.id, g.alt, { sizes: '(max-width: 900px) 92vw, 30vw', widths: [500, 800, 1100] })}
    </figure>`).join('');
  return `
    ${pageHeroHTML(k.titleLines)}
    <section class="statement container">
      <p class="statement__text" data-lines>${k.statement}</p>
    </section>
    <section class="page-section container">
      <div class="kinfo">${info}</div>
    </section>
    <section class="page-section container" id="formularz">
      <div class="row-split">
        <div class="row-split__label" data-reveal>Umów wizytę</div>
        <div class="row-split__content">
          <form class="form" data-form novalidate>
            <div class="form__fields">
              <div class="form__row">
                <label class="form__field"><span>Imię i nazwisko</span>
                  <input type="text" name="name" required autocomplete="name">
                </label>
                <label class="form__field"><span>E-mail</span>
                  <input type="email" name="email" required autocomplete="email">
                </label>
              </div>
              <div class="form__row">
                <label class="form__field"><span>Temat rozmowy</span>
                  <select name="topic">
                    <option>Kuchnia</option>
                    <option>Zabudowa na wymiar</option>
                    <option>Mebel autorski</option>
                    <option>Inny temat</option>
                  </select>
                </label>
                <fieldset class="form__field form__field--days">
                  <legend>Preferowane dni</legend>
                  <label class="form__check"><input type="checkbox" name="days" value="pn-pt" checked><span>pon–pt</span></label>
                  <label class="form__check"><input type="checkbox" name="days" value="sob"><span>sobota</span></label>
                </fieldset>
              </div>
              <label class="form__field"><span>Wiadomość</span>
                <textarea name="message" rows="4" placeholder="Opowiedz krótko o swoim wnętrzu…"></textarea>
              </label>
              <label class="form__check form__check--consent">
                <input type="checkbox" required>
                <span>Zgadzam się na kontakt w sprawie mojego zapytania.</span>
              </label>
              <div class="form__actions">
                <button class="btn" type="submit">Wyślij zapytanie
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h17M14 5l7 7-7 7" stroke="currentColor" stroke-width="1.6"/></svg>
                </button>
                <span class="form__note">Formularz demonstracyjny — wiadomość nie zostanie wysłana.</span>
              </div>
            </div>
            <div class="form__success" hidden>
              <h3 class="card__title">Dziękujemy!</h3>
              <p class="card__text">Odezwiemy się w ciągu jednego dnia roboczego, żeby umówić dogodny termin.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
    <section class="page-section container">
      <div class="works__label" data-reveal>Wnętrza pracowni</div>
      <div class="kgallery">${gallery}</div>
    </section>`;
}

/* ------------------------------------------------------------
   ROUTER
   ------------------------------------------------------------ */
let viewCtx = null;
let pageEffects = [];
let routeBusy = false;
let pendingRoute = null;
let currentRoute = { type: 'init' };
let pendingScroll = null;
let heroSplit = null;

function parseRoute(hash) {
  const h = hash || location.hash || '#/';
  let m = h.match(/^#\/oferta\/([a-z-]+)/);
  if (m && OFFERS[m[1]]) return { type: 'offer', slug: m[1] };
  m = h.match(/^#\/projekt\/([a-z-]+)/);
  if (m && PROJECTS[m[1]]) return { type: 'project', slug: m[1] };
  m = h.match(/^#\/(filozofia|pracownia|kontakt)/);
  if (m) return { type: 'page', slug: m[1] };
  return { type: 'home' };
}

const sameRoute = (a, b) => a.type === b.type && a.slug === b.slug;

function routeTitle(route) {
  if (route.type === 'offer') return OFFERS[route.slug].label;
  if (route.type === 'project') return PROJECTS[route.slug].title;
  if (route.type === 'page') return PAGES[route.slug].label;
  return 'Strona główna';
}

function cleanupView() {
  viewCleanups.forEach((fn) => fn());
  viewCleanups = [];
  if (viewCtx) { viewCtx.revert(); viewCtx = null; }
  pageEffects.forEach((t) => t && t.kill && t.kill());
  pageEffects = [];
}

const PAGE_BUILDERS = {
  filozofia: filozofiaViewHTML,
  pracownia: pracowniaViewHTML,
  kontakt: kontaktViewHTML,
};

function mountView(route) {
  cleanupView();

  if (route.type === 'home') {
    pageView.hidden = true;
    pageView.innerHTML = '';
    homeView.hidden = false;
  } else {
    homeView.hidden = true;
    pageView.innerHTML = route.type === 'offer'
      ? offerViewHTML(route.slug)
      : route.type === 'project'
        ? projectViewHTML(route.slug)
        : PAGE_BUILDERS[route.slug]();
    pageView.hidden = false;
    buildRolls(pageView);
    if (smoother) pageEffects = smoother.effects(pageView.querySelectorAll('[data-speed]')) || [];
  }

  backBtn.hidden = route.type === 'home';
  swapLabel(routeTitle(route));
  document.title = route.type === 'home'
    ? 'Grabowski — Pracownia Stolarska | Kuchnie, zabudowy i meble na wymiar'
    : `${routeTitle(route)} — Grabowski, Pracownia Stolarska`;

  refreshCursorZone();

  viewCtx = gsap.context(() => {
    if (route.type === 'home') {
      viewCleanups.push(initHomeSlider(homeView.querySelector('[data-slider]')));
      if (!instantBoot) {
        homeView.querySelectorAll('[data-label]').forEach((section) => {
          ScrollTrigger.create({
            trigger: section,
            start: 'top 45%',
            end: 'bottom 45%',
            onEnter: () => swapLabel(section.dataset.label),
            onEnterBack: () => swapLabel(section.dataset.label),
          });
        });
      }
      buildScrollAnimations(homeView);
    } else if (route.type === 'offer') {
      viewCleanups.push(initGallery(pageView.querySelector('[data-hgallery]')));
      buildScrollAnimations(pageView);
    } else if (route.type === 'project') {
      viewCleanups.push(initGallery(pageView.querySelector('[data-hgallery]')));
      buildScrollAnimations(pageView);
    } else {
      viewCleanups.push(initContactForm(pageView));
      buildScrollAnimations(pageView);
    }
  }, route.type === 'home' ? homeView : pageView);

  currentRoute = route;
}

/* wejściowa animacja widoku (po zdjęciu kurtyny / intra) */
function enterView(route) {
  if (instantBoot) {
    const t = document.querySelector('[data-page-title]');
    if (t) gsap.set(t, { visibility: 'visible' });
    return gsap.timeline();
  }
  const tl = gsap.timeline();

  if (route.type === 'home') {
    const heroTitle = homeView.querySelector('[data-hero-title]');
    gsap.set(heroTitle, { visibility: 'visible' });
    if (heroSplit) heroSplit.revert();
    heroSplit = new SplitText(heroTitle, { type: 'lines', mask: 'lines', autoSplit: true });
    tl.from(heroSplit.lines, { yPercent: 112, duration: 1.15, stagger: 0.12, ease: 'power4.out' }, 0.05);
    tl.from(homeView.querySelector('[data-slider]'), { y: 56, opacity: 0, duration: 1.1, ease: 'power3.out' }, 0.4);
  } else if (route.type === 'project') {
    tl.from(pageView.querySelectorAll('[data-gallery-item]'), {
      x: 90, opacity: 0, duration: 1.1, stagger: 0.08, ease: 'power3.out',
    }, 0.1);
  } else {
    const title = pageView.querySelector('[data-page-title]');
    const split = new SplitText(title, { type: 'lines', mask: 'lines', autoSplit: true });
    tl.from(split.lines, { yPercent: 112, duration: 1.1, stagger: 0.1, ease: 'power4.out' }, 0.05);
    const gItems = pageView.querySelectorAll('[data-gallery-item]');
    if (gItems.length) {
      tl.from(gItems, { x: 90, opacity: 0, duration: 1.1, stagger: 0.08, ease: 'power3.out' }, 0.4);
    } else {
      const media = pageView.querySelector('.pbanner, .statement');
      if (media) tl.from(media, { y: 64, opacity: 0, duration: 1.05, ease: 'power3.out' }, 0.35);
    }
  }
  return tl;
}

/* przejście z kurtyną */
function transitionTo(route) {
  if (routeBusy) { pendingRoute = route; return; }
  routeBusy = true;
  setMenu(false);

  const finish = () => {
    routeBusy = false;
    ScrollTrigger.refresh();
    if (pendingScroll) {
      const target = pendingScroll;
      pendingScroll = null;
      setTimeout(() => scrollToTarget(target), 60);
    }
    if (pendingRoute) { const r = pendingRoute; pendingRoute = null; transitionTo(r); }
  };

  if (instantBoot) {
    mountView(route);
    setScroll(0);
    enterView(route);
    finish();
    return;
  }

  gsap.timeline({
    onComplete: () => {
      // DOM nowego widoku musi istnieć, zanim zbudujemy animację wejścia,
      // dlatego timeline wyjściowy powstaje dopiero tutaj
      mountView(route);
      setScroll(0);
      ScrollTrigger.refresh();
      gsap.timeline({ onComplete: finish })
        .to(veil, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85, ease: 'power4.inOut', delay: 0.12 })
        .add(enterView(route), '-=0.55')
        .set(veil, { visibility: 'hidden' });
    },
  })
    .set(veil, { visibility: 'visible', clipPath: 'inset(100% 0% 0% 0%)' })
    .to(veil, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power2.in' });
}

window.addEventListener('hashchange', () => {
  const route = parseRoute();
  if (sameRoute(route, currentRoute)) return;
  transitionTo(route);
});

/* ------------------------------------------------------------
   LINKI — kotwice w obrębie widoku vs. trasy
   ------------------------------------------------------------ */
document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('a[href^="#"]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (href.startsWith('#/')) {
    setMenu(false);
    // klik w logo / link bieżącej trasy = płynnie na górę strony
    if (sameRoute(parseRoute(href), currentRoute)) {
      e.preventDefault();
      if (smoother) gsap.to(smoother, { scrollTop: 0, duration: 1.1, ease: 'power3.inOut' });
      else window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    }
    return; // router obsłuży hashchange
  }
  e.preventDefault();
  setMenu(false);
  const target = document.querySelector(href);
  const inActiveView = target && !target.closest('[hidden]');
  if (inActiveView) {
    scrollToTarget(target);
  } else if (currentRoute.type !== 'home') {
    pendingScroll = href;
    location.hash = '#/';
  }
});

const toTopBtn = document.querySelector('[data-to-top]');
if (toTopBtn) {
  toTopBtn.addEventListener('click', () => {
    if (smoother) gsap.to(smoother, { scrollTop: 0, duration: 1.2, ease: 'power3.inOut' });
    else window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });
}

if (backBtn) {
  backBtn.addEventListener('click', () => {
    if (history.length > 1) history.back();
    else location.hash = '#/';
  });
}

/* ------------------------------------------------------------
   INTRO + BOOT
   ------------------------------------------------------------ */
const intro = document.querySelector('[data-intro]');
const initialRoute = parseRoute();

if (instantBoot) {
  if (intro) intro.remove();
  gsap.set(header, { opacity: 1 });
  const heroTitle = homeView.querySelector('[data-hero-title]');
  if (heroTitle) gsap.set(heroTitle, { visibility: 'visible' });
  mountView(initialRoute);
  enterView(initialRoute);
  ScrollTrigger.refresh();
} else {
  if (smoother) smoother.paused(true);
  mountView(initialRoute);

  const left = intro.querySelector('[data-mark-left]');
  const right = intro.querySelector('[data-mark-right]');
  const word = intro.querySelector('.intro__word');
  const sub = intro.querySelector('.intro__sub');

  document.fonts.ready.then(() => {
    gsap.timeline({
      onComplete: () => {
        intro.remove();
        if (smoother) smoother.paused(false);
        ScrollTrigger.refresh();
      },
    })
      .from(left, { x: -26, opacity: 0, duration: 0.85, ease: 'power3.out' }, 0.15)
      .from(right, { x: 26, opacity: 0, duration: 0.85, ease: 'power3.out' }, 0.15)
      .to(word, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.7)
      .to(sub, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.85)
      .to(intro, { yPercent: -100, duration: 1.0, ease: 'power4.inOut', delay: 0.55 })
      .to(header, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.5')
      .add(enterView(initialRoute), '-=0.75');
  });
}

window.addEventListener('load', () => ScrollTrigger.refresh());
