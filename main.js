/* ==========================================================================
   main.js — poncle.games concept · behaviour only
   --------------------------------------------------------------------------
   All copy and data live in content.js; brand icons in icons.js.
   No build step, no dependencies: one IIFE, plain DOM + <canvas>.

   Concept: the page is a 30-minute Vampire Survivors run. Scrolling is time
   survived (nav clock 00:00 → 30:00, LV badge goes up per section, gems on
   the right fill in) and at 30:00 the Reaper waits in the footer.

   Sections in this file
     0. Helpers & shared run state      9. Expansion chests
     1. i18n (EN default / ES)         10. Updates feed
     2. Chiptune SFX (opt-in)          11. Featured carousel
     3. Jukebox (official OST)         12. poncle TV
     4. Mobile menu                    13. Corner buddy + Gatti Amari cats
     5. Scroll HUD (nav, clock, gems)  14. Typed codes: rosary · x-x1viiq
     6. Reveal on scroll + counters    15. Hyper mode · Reaper → The Ender
     7. Gem rain · bursts · dmg nums   16. Konami code → Golden mode
     8. Crawlers hand · Char. select   17. Hero parade (canvas)
                                       18. Icons + boot
   ========================================================================== */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const S = "assets/sprites/";
  const A = "assets/anim/";
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  /* ==========================================================
     0. Helpers & shared run state
     ========================================================== */
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtDate = iso => {
    const d = new Date(iso + "T12:00:00");
    return isNaN(d) ? iso : new Intl.DateTimeFormat(lang === "es" ? "es-MX" : "en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(d);
  };

  /* YouTube embeds need a real http(s) origin (they fail with "Error 153"
     when the page is opened as file://). ytFrame() returns the iframe, or a
     friendly "open on YouTube" fallback when running from a local file. */
  const ytFrame = ({ id, list, title }) => {
    const watch = id ? `https://www.youtube.com/watch?v=${id}` : `https://www.youtube.com/playlist?list=${list}`;
    if (location.protocol === "file:") {
      return `<div class="yt-fallback"><p>${t("yt.local")}</p>
        <a class="btn btn--blood" href="${watch}" target="_blank" rel="noopener"><i class="ico" data-icon="youtube"></i><span>${t("yt.open")}</span></a></div>`;
    }
    const src = id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
                   : `https://www.youtube-nocookie.com/embed/videoseries?list=${list}&autoplay=1&rel=0`;
    return `<iframe src="${src}" title="${esc(title || "YouTube")}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
  };

  // gold / kills / unlocks are shared by the parade, chests, cats and Character Select
  const run = { gold: 0, kills: 0, level: 1, chests: 0, unlocked: new Set() };

  /* ==========================================================
     1. i18n — English by default, Spanish via the EN/ES toggle
     ========================================================== */
  const C = window.PONCLE;
  const T = C.strings;

  let lang = store.get("poncle-lang") === "es" ? "es" : "en";   // English by default
  const t = (k, vars) => {
    let s = (T[lang] && T[lang][k]) ?? T.en[k] ?? k;
    if (vars && typeof s === "string") for (const v in vars) s = s.replaceAll(`{${v}}`, vars[v]);
    return s;
  };

  function applyLang() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-aria]").forEach(el => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
    $$("[data-i18n-title]").forEach(el => el.setAttribute("title", t(el.dataset.i18nTitle)));
    $$(".lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    renderFeatured(); renderDeck(); renderRoster(); renderChests(); renderNews(); renderTV(); renderJukebox(); updateSummary();
    selectChar(current);
  }
  $$(".lang button").forEach(b => b.addEventListener("click", () => {
    lang = b.dataset.lang; store.set("poncle-lang", lang); applyLang(); sfx("blip");
  }));

  /* ==========================================================
     2. Chiptune SFX — WebAudio blips, off by default (toggle in the jukebox)
     ========================================================== */
  let audio = null, sfxOn = store.get("poncle-sfx") === "1";
  const sfxToggle = $("#sfx-toggle");
  sfxToggle.checked = sfxOn;
  sfxToggle.addEventListener("change", () => {
    sfxOn = sfxToggle.checked; store.set("poncle-sfx", sfxOn ? "1" : "0"); sfx("coin");
  });
  function tone(freq, dur, type = "square", vol = .05, slide = 0, at = 0) {
    const t0 = audio.currentTime + at;
    const o = audio.createOscillator(), g = audio.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
    g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
    o.connect(g).connect(audio.destination); o.start(t0); o.stop(t0 + dur + .02);
  }
  function sfx(kind) {
    if (!sfxOn) return;
    try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); } catch { return; }
    if (kind === "blip") tone(660, .06);
    if (kind === "coin") { tone(988, .07, "square", .05); tone(1319, .18, "square", .05, 0, .07); }
    if (kind === "gem") tone(1200 + Math.random() * 300, .05, "triangle", .04);
    if (kind === "hit") tone(180, .06, "sawtooth", .025, -80);
    if (kind === "lvup") [523, 659, 784, 1047].forEach((f, i) => tone(f, .14, "square", .05, 0, i * .08));
    if (kind === "chest") { tone(220, .12, "triangle", .06, 200); [784, 988, 1175, 1568].forEach((f, i) => tone(f, .1, "square", .04, 0, .15 + i * .06)); }
    if (kind === "deny") tone(140, .18, "square", .05, -40);
    if (kind === "meow") { tone(700, .18, "triangle", .05, 300); tone(1000, .2, "triangle", .04, -500, .16); }
  }

  /* ==========================================================
     3. Jukebox — official OST videos, YouTube player loaded on demand
     ========================================================== */
  const jb = $("#jukebox"), jbBtn = $("#music-btn"), jbList = $("#jb-list"), jbPlayer = $("#jb-player");
  let jbTrack = null;
  const setJukebox = open => { jb.hidden = !open; jbBtn.setAttribute("aria-expanded", String(open)); };
  jbBtn.addEventListener("click", () => { setJukebox(jb.hidden); sfx("blip"); });
  $("#jb-close").addEventListener("click", () => setJukebox(false));
  addEventListener("keydown", e => { if (e.key === "Escape" && !jb.hidden) setJukebox(false); });
  function renderJukebox() {
    jbList.innerHTML = C.music.map((m, i) => `
      <li><button data-i="${i}" aria-current="${jbTrack === i}">
        <span class="jukebox__n">${String(i + 1).padStart(2, "0")}</span>
        <span class="jukebox__t"><b>${esc(m.title)}</b><small>${esc(m.game)}</small></span>
      </button></li>`).join("");
    $$("button", jbList).forEach(b => b.addEventListener("click", () => playTrack(+b.dataset.i)));
  }
  function playTrack(i) {
    jbTrack = i;
    jbPlayer.innerHTML = ytFrame({ id: C.music[i].id, title: C.music[i].title });
    hydrateIcons();
    jbBtn.classList.add("is-playing");
    renderJukebox();
  }

  /* ==========================================================
     4. Mobile menu
     ========================================================== */
  const burger = $(".nav__burger"), menu = $("#mobile-menu");
  burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") !== "true";
    burger.setAttribute("aria-expanded", String(open)); menu.hidden = !open;
  });
  $$("a", menu).forEach(a => a.addEventListener("click", () => { burger.setAttribute("aria-expanded", "false"); menu.hidden = true; }));

  /* ==========================================================
     5. Scroll HUD — floating nav, run clock, LV, active link, gem nav, Reaper
     ========================================================== */
  const gemLinks = $$(".gemnav a"), clockBox = $(".clock"), xpLv = $("#run-lv"), clock = $("#run-clock");
  const minuteSections = $$("[data-minute]");
  const navLinks = $$(".nav__links a");
  const footer = $("#reaper-zone");
  let scrollLv = 1, reaped = false;

  const navBar = $(".nav");
  function onScroll() {
    navBar.classList.toggle("is-floating", scrollY > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, scrollY / max) : 0;
    const secs = Math.round(p * 1800);
    clock.textContent = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
    clockBox.classList.toggle("is-late", secs > 1680);

    const mid = scrollY + innerHeight * .5;
    const lv = 1 + minuteSections.filter(s => s.offsetTop < mid).length;
    if (lv > scrollLv) {
      clockBox.classList.remove("is-lvup"); void clockBox.offsetWidth; clockBox.classList.add("is-lvup");
      sfx("lvup");
      const r = clockBox.getBoundingClientRect(); if (r.width) gemBurst(r.left + r.width / 2, r.bottom, 10);
    }
    scrollLv = lv; xpLv.textContent = lv;

    let active = null;
    $$("main section[id]").forEach(s => { if (s.offsetTop <= mid) active = s.id; });
    navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + active));
    // gems: passed sections are "collected", the current one glows
    const cur = active ? gemLinks.findIndex(a => a.getAttribute("href") === "#" + active) : 0;
    gemLinks.forEach((a, k) => { a.classList.toggle("is-got", k < cur); a.classList.toggle("is-here", k === Math.max(0, cur)); });

    if (!reaped && p > .96) { reaped = true; footer.classList.add("is-reaped"); updateSummary(); }
  }
  addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });

  function updateSummary() {
    const el = $("#run-summary"); if (!el || !reaped) return;
    el.textContent = t("summary", { k: run.kills, g: run.gold, l: Math.max(run.level, scrollLv), c: run.chests });
  }

  /* ==========================================================
     6. Reveal on scroll + count-up numbers
     ========================================================== */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const sibs = [...e.target.parentElement.children].filter(c => c.classList.contains("reveal"));
      e.target.style.setProperty("--d", sibs.indexOf(e.target) * 80 + "ms");
      e.target.classList.add("is-in"); io.unobserve(e.target);
    });
  }, { threshold: .15 });
  const observeReveals = () => $$(".reveal:not(.is-in)").forEach(el => io.observe(el));

  const cio = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, suf = el.dataset.suffix || "";
    if (reduced || to <= 1) { el.textContent = to + suf; return; }
    const t0 = performance.now(), dur = 1400;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - k, 4)));
      el.textContent = v + (k === 1 ? suf : ""); if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  $$("[data-count]").forEach(el => cio.observe(el));

  /* ==========================================================
     7. Gem rain (homage to poncle.games), bursts, click damage numbers
     ========================================================== */
  const GEMS = [A + "BlueExperienceGem.png", A + "GreenExperienceGem.png", A + "RedExperienceGem.png"];
  // mode "gems" = XP gems (as on poncle.games); "golden" = Gatti Amari cats + old Poe
  function startRain(box, n = 34, mode = "gems") {
    if (!box || reduced) return;
    box.innerHTML = "";
    const h = box.clientHeight || 600;
    const golden = mode === "golden";
    for (let i = 0; i < n; i++) {
      const d = document.createElement("div");
      const poe = golden && i % 2 === 0;
      d.className = "drop" + (golden ? (poe ? " drop--poe" : " drop--cat") : "");
      d.style.left = Math.random() * 100 + "%";
      d.style.animationDuration = 2.5 + Math.random() * 4 + "s";
      d.style.animationDelay = -Math.random() * 6 + "s";
      d.style.setProperty("--r", Math.floor(Math.random() * 360) + "deg");
      d.style.setProperty("--fall", h * (.5 + Math.random() * .6) + "px");
      if (!golden) d.style.width = 12 + Math.random() * 10 + "px";
      const img = new Image(); img.alt = "";
      img.src = golden ? (poe ? A + "poe.gif" : S + "Gatti_Amari.png") : GEMS[i % 3 === 0 ? 2 : i % 2 === 0 ? 1 : 0];
      d.appendChild(img); box.appendChild(d);
    }
  }
  function gemBurst(x, y, n = 12, src) {
    if (reduced) return;
    for (let i = 0; i < n; i++) {
      const g = new Image(); g.src = src || GEMS[i % 3]; g.className = "gemburst"; g.alt = "";
      g.style.left = x + "px"; g.style.top = y + "px";
      document.body.appendChild(g);
      const a = Math.random() * Math.PI * 2, v = 60 + Math.random() * 120;
      g.animate([
        { transform: "translate(-50%,-50%) scale(.6)", opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * v}px), calc(-50% + ${Math.sin(a) * v - 40}px)) rotate(${a * 90}deg) scale(1)`, opacity: 1, offset: .55 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * v * 1.2}px), calc(-50% + ${Math.sin(a) * v + 80}px)) scale(.4)`, opacity: 0 },
      ], { duration: 900 + Math.random() * 300, easing: "cubic-bezier(.2,.9,.25,1)" }).onfinish = () => g.remove();
    }
  }
  // the last section (30:00) rains XP gems once it comes into view
  const footRain = $("#footer-rain");
  new IntersectionObserver(([e], obs) => {
    if (!e.isIntersecting) return; obs.disconnect();
    startRain(footRain, innerWidth < 600 ? 20 : 40, document.body.classList.contains("is-golden") ? "golden" : "gems");
  }, { threshold: .1 }).observe(footer);

  // click on empty space → floating damage numbers, like in the game
  document.addEventListener("pointerdown", e => {
    if (reduced || e.target.closest("a,button,input,iframe,.cat,#parade,.featured")) return;
    const crit = Math.random() < .15;
    const d = document.createElement("span");
    d.className = "dmg" + (crit ? " dmg--crit" : "");
    d.textContent = crit ? Math.floor(40 + Math.random() * 60) : Math.floor(5 + Math.random() * 25);
    d.style.left = e.clientX + "px"; d.style.top = e.clientY - 10 + "px";
    document.body.appendChild(d); setTimeout(() => d.remove(), 850);
    sfx("hit");
  });

  /* ==========================================================
     8a. Vampire Crawlers hand — real card frames + icons (content.js)
     ========================================================== */
  const deck = $("#deck");
  const CR = "assets/crawlers/";
  function renderDeck() {
    deck.innerHTML = C.crawlerCards.map((c, i) => `
      <button class="card card--${esc(c.frame)}" style="--o:${i - (C.crawlerCards.length - 1) / 2};--a:${Math.abs(i - (C.crawlerCards.length - 1) / 2)}" aria-label="${esc(c.name)}: ${esc(c[lang] || c.en)}">
        <img class="card__frame" src="${CR}UI_sprites_${esc(c.frame)}_card.png" alt="">
        <span class="card__cost">${esc(c.cost)}</span>
        <span class="card__name">${esc(c.name)}</span>
        <img class="card__icon" src="${CR}CSprite-${esc(c.icon)}.png" alt="">
        <span class="card__text">${esc(c[lang] || c.en)}</span>
      </button>`).join("");
    $$(".card", deck).forEach(card => card.addEventListener("click", () => playCard(card)));
  }
  function playCard(card) {
    if (card.classList.contains("is-played")) return;
    card.classList.add("is-played"); deck.classList.add("is-fanned");
    const r = card.getBoundingClientRect();
    gemBurst(r.left + r.width / 2, r.top + r.height * .4, 10);
    sfx("coin");
    setTimeout(() => card.classList.remove("is-played"), 900);
  }
  deck.addEventListener("mouseleave", () => deck.classList.remove("is-fanned"));

  /* ==========================================================
     8b. Character select — locked slots cost run gold
     ========================================================== */
  const CHARS = C.characters;
  let current = 0;
  const grid = $("#roster-grid");
  const isLocked = c => c.cost && !run.unlocked.has(c.sprite);

  function renderRoster() {
    grid.innerHTML = "";
    CHARS.forEach((c, i) => {
      const b = document.createElement("button");
      b.className = "slot" + (isLocked(c) ? " slot--locked" : "");
      b.setAttribute("role", "option");
      b.setAttribute("aria-selected", String(i === current));
      b.setAttribute("aria-label", isLocked(c) ? `${t("roster.locked")} — ${t("roster.cost", { n: c.cost })}` : c.name);
      if (isLocked(c)) b.dataset.cost = c.cost + "g";
      const img = new Image(); img.src = S + c.sprite + ".png"; img.alt = ""; img.loading = "lazy";
      b.appendChild(img);
      b.addEventListener("click", () => onSlot(i, b));
      b.addEventListener("mouseenter", () => !isLocked(c) && sfx("blip"));
      grid.appendChild(b);
    });
  }
  function onSlot(i, el) {
    const c = CHARS[i];
    if (isLocked(c)) {
      if (run.gold >= c.cost) {
        run.gold -= c.cost; run.unlocked.add(c.sprite); syncHud();
        sfx("chest"); const r = el.getBoundingClientRect(); gemBurst(r.left + r.width / 2, r.top + r.height / 2, 14, S + "Gold_Coin.png");
        say(t("buddy.bought", { name: c.name }));
        current = i; renderRoster(); selectChar(i);
        grid.children[i].classList.add("is-unlocking");
      } else {
        el.classList.remove("is-shake"); void el.offsetWidth; el.classList.add("is-shake");
        sfx("deny"); say(t("buddy.poor", { n: c.cost - run.gold }));
        current = i; selectChar(i);   // preview the silhouette + how to unlock it
      }
      return;
    }
    current = i;
    $$(".slot", grid).forEach((s, k) => s.setAttribute("aria-selected", String(k === i)));
    selectChar(i); sfx("coin");
  }
  function selectChar(i) {
    const c = CHARS[i]; if (!c) return;
    const locked = isLocked(c);
    $$(".slot", grid).forEach((s, k) => s.setAttribute("aria-selected", String(k === i)));
    const img = $("#sel-img");
    img.classList.remove("is-swap"); void img.offsetWidth; img.classList.add("is-swap");
    img.src = S + c.sprite + ".png"; img.alt = c.name;
    img.classList.toggle("is-locked", !!locked);
    $("#sel-name").textContent = locked ? "???" : c.name;
    $("#sel-weapon").textContent = locked ? "???" : c.weapon;
    const wi = $("#sel-wimg"); wi.hidden = locked || !c.weaponIcon; if (c.weaponIcon) wi.src = S + c.weaponIcon + ".png";
    $("#sel-desc").textContent = c[lang] || c.en;
    const how = $("#sel-unlock");
    how.hidden = !c.cost;
    if (c.cost) how.innerHTML = `<b>${t("roster.howto")}:</b> ${esc(lang === "es" ? c.unlockEs : c.unlockEn)}` + (locked ? ` · <span class="select__cost">${t("roster.cost", { n: c.cost })}</span>` : "");
  }
  grid.addEventListener("keydown", e => {
    const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
    const map = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols };
    if (!(e.key in map)) return;
    e.preventDefault();
    const idx = $$(".slot", grid).indexOf(document.activeElement);
    const n = Math.max(0, Math.min(CHARS.length - 1, idx + map[e.key]));
    grid.children[n].focus();
  });

  /* ==========================================================
     9. Expansion chests — coffin → open chest, CRT shows the DLC art
     ========================================================== */
  const DLC = C.expansions;
  const opened = new Set();
  function renderChests() {
    const ol = $("#chests"); ol.innerHTML = "";
    DLC.forEach((d, i) => {
      const li = document.createElement("li");
      li.className = "chest reveal" + (opened.has(i) ? " is-open is-in" : "");
      li.innerHTML = `
        <button class="chest__btn" aria-expanded="${opened.has(i)}">
          <span class="crt crt--chest">
            <img class="crt__img" src="${esc(d.image)}" alt="${esc(d.name)}" loading="lazy">
            <img class="chest__img" src="${S}${opened.has(i) ? "Treasure_Chest" : "Coffin"}.png" alt="">
            <span class="chest__hint">${t("dlc.open")}</span>
          </span>
          <span class="chest__year">${fmtDate(d.date)} · ${d.price === "Free" ? t("dlc.free") : esc(d.price)}</span>
          <span class="chest__name">${esc(d.name)}</span>
          <span class="chest__desc">${esc(d[lang] || d.en)} <a href="${esc(d.url)}" target="_blank" rel="noopener">${t("dlc.more")}</a></span>
        </button>`;
      const btn = $(".chest__btn", li);
      btn.addEventListener("click", e => {
        if (e.target.closest("a")) return;
        if (opened.has(i)) return;
        opened.add(i); run.chests++; run.gold += 25; syncHud();
        li.classList.add("is-open"); btn.setAttribute("aria-expanded", "true");
        $(".chest__img", li).src = S + "Treasure_Chest.png";
        const r = btn.getBoundingClientRect();
        gemBurst(r.left + r.width / 2, r.top + 70, 16, S + "Gold_Coin.png");
        gemBurst(r.left + r.width / 2, r.top + 70, 8);
        sfx("chest");
      });
      ol.appendChild(li);
    });
    observeReveals();
  }

  /* ==========================================================
     10. Updates feed — newest 4 items of content.js → news
     ========================================================== */
  const NEWS = [...C.news].sort((a, b) => b.date.localeCompare(a.date));
  function renderNews() {
    const box = $("#news-grid"); if (!box) return;
    box.innerHTML = NEWS.slice(0, 4).map(n => {
      const isArt = n.image && !/sprites\//.test(n.image);
      const media = isArt ? `<img src="${esc(n.image)}" alt="" loading="lazy">`
        : `<div class="news__ph${n.tag === "dlc" ? " news__ph--red" : ""}"><img src="${esc(n.image || S + "Experience_Gem.png")}" alt=""></div>`;
      const d = new Date(n.date + "T12:00:00");
      return `<a class="news__item reveal" href="${esc(n.url)}" target="_blank" rel="noopener">
        ${media}
        <span class="news__meta"><span class="news__tag" data-tag="${esc(n.tag)}">${esc(t("news.tag." + n.tag))}</span><time datetime="${esc(n.date)}">${isNaN(d) ? esc(n.date) : fmtDate(n.date)}</time></span>
        <strong>${esc((n.title && (n.title[lang] || n.title.en)) || "")}</strong></a>`;
    }).join("");
    observeReveals();
  }
  /* ==========================================================
     11. Featured carousel — content.js → featured
     Always automatic (7s). Gem dots, a click on the screen,
     swipe or ←/→ jump to another slide and the timer restarts.
     ========================================================== */
  const feat = $("#featured"), featTrack = $("#feat-track"), featDots = $("#feat-dots");
  const FEAT_MS = 7000;
  let featI = 0, featTimer = 0;
  const GEM_SRC = ["BlueExperienceGem", "GreenExperienceGem", "RedExperienceGem"];
  function renderFeatured() {
    featTrack.innerHTML = C.featured.map((f, i) => `
      <article class="feat${i === featI ? " is-active" : ""}" aria-roledescription="slide" aria-label="${i + 1} / ${C.featured.length}"${i === featI ? "" : ' aria-hidden="true"'}>
        <div class="crt feat__screen"><img class="crt__img" src="${esc(f.image)}" alt="${esc(f.title)}" loading="lazy"></div>
        <div class="feat__copy">
          <p class="feat__kicker">${esc(f.kicker[lang] || f.kicker.en)}</p>
          <h3 class="feat__title">${esc(f.title)}</h3>
          <p class="feat__text">${esc(f.text[lang] || f.text.en)}</p>
          <div class="feat__ctas">${(f.ctas || []).map(b => `
            <a class="btn btn--${esc(b.style || "gold")}" href="${esc(b.url)}" target="_blank" rel="noopener"${i === featI ? "" : ' tabindex="-1"'}>${b.icon ? `<i class="ico" data-icon="${esc(b.icon)}"></i>` : ""}<span>${esc(b.label[lang] || b.label.en)}</span></a>`).join("")}
          </div>
        </div>
      </article>`).join("");
    featDots.innerHTML = C.featured.map((f, i) =>
      `<button class="feat__dot" aria-label="${esc(f.title)}" aria-current="${i === featI}"><img src="${A}${GEM_SRC[i % 3]}.png" alt=""></button>`).join("");
    $$(".feat__dot", featDots).forEach((d, i) => d.addEventListener("click", () => { goFeat(i); sfx("gem"); }));
    hydrateIcons();
  }
  function goFeat(i) {
    featI = (i + C.featured.length) % C.featured.length;
    $$(".feat", featTrack).forEach((el, k) => {
      const on = k === featI;
      el.classList.toggle("is-active", on); el.toggleAttribute("aria-hidden", !on);
      $$("a", el).forEach(a => on ? a.removeAttribute("tabindex") : a.setAttribute("tabindex", "-1"));
    });
    $$(".feat__dot", featDots).forEach((d, k) => d.setAttribute("aria-current", String(k === featI)));
    restartFeat();
  }
  function restartFeat() { clearInterval(featTimer); if (!reduced) featTimer = setInterval(() => goFeat(featI + 1), FEAT_MS); }
  // automatic all the time; clicking the screen (or a gem) jumps and keeps it going
  featTrack.addEventListener("click", e => { if (e.target.closest(".feat__screen")) { goFeat(featI + 1); sfx("gem"); } });
  feat.addEventListener("keydown", e => { if (e.key === "ArrowLeft") goFeat(featI - 1); if (e.key === "ArrowRight") goFeat(featI + 1); });
  let featX = null;
  feat.addEventListener("touchstart", e => { featX = e.touches[0].clientX; }, { passive: true });
  feat.addEventListener("touchend", e => {
    if (featX == null) return; const dx = e.changedTouches[0].clientX - featX; featX = null;
    if (Math.abs(dx) > 40) goFeat(featI + (dx < 0 ? 1 : -1));
  });

  /* ==========================================================
     12. poncle TV — the poster plays the channel's newest upload
     ========================================================== */
  const UPLOADS = "UU" + C.youtubeChannelId.slice(2);   // channel id UC… → uploads playlist UU…
  const VIDEOS = C.videos;
  let tvCurrent = null;
  const thumb = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  function renderTV() {
    const list = $("#tv-list"); if (!list) return;
    if (!$("#tv-screen iframe")) {
      $("#tv-thumb").src = thumb(VIDEOS[0].id);
      $("#tv-label").textContent = `${t("tv.latest")} · ${VIDEOS[0].title}`;
    }
    list.innerHTML = VIDEOS.slice(0, 6).map(v =>
      `<li><button data-id="${esc(v.id)}" aria-current="${tvCurrent === v.id}" title="${esc(v.title)}"><img src="${thumb(esc(v.id))}" alt="${esc(v.title)}" loading="lazy"></button></li>`).join("");
    $$("button", list).forEach(b => b.addEventListener("click", () => playTV(b.dataset.id)));
  }
  function playTV(id) {
    const screen = $("#tv-screen");
    screen.innerHTML = id ? ytFrame({ id, title: "poncle TV" }) : ytFrame({ list: UPLOADS, title: "poncle TV" });
    hydrateIcons();
    screen.classList.add("is-playing");
    tvCurrent = id || VIDEOS[0].id; renderTV(); sfx("blip");
  }
  $("#tv-play")?.addEventListener("click", () => playTV(null));
  /* ==========================================================
     13. Corner buddy + Gatti Amari cats (homage to poncle.games)
     ========================================================== */
  const BUDDIES = C.buddies.map(n => A + n + ".gif");
  const buddy = $("#buddy"), buddyImg = $("#buddy-img"), bubble = $("#buddy-say");
  let sayTimer, buddyClicks = 0;
  function say(text, ms = 3200) {
    bubble.textContent = text; bubble.classList.add("is-on");
    clearTimeout(sayTimer); sayTimer = setTimeout(() => bubble.classList.remove("is-on"), ms);
  }
  function swapBuddy(src) {
    buddy.classList.remove("is-swap"); void buddy.offsetWidth; buddy.classList.add("is-swap");
    buddyImg.src = src || BUDDIES[Math.floor(Math.random() * BUDDIES.length)];
  }
  // a different survivor on every page load (never the same one twice in a row)
  (() => {
    const prev = +store.get("poncle-buddy");
    let i = Math.floor(Math.random() * BUDDIES.length);
    if (BUDDIES.length > 1 && i === prev) i = (i + 1) % BUDDIES.length;
    store.set("poncle-buddy", i); swapBuddy(BUDDIES[i]);
  })();
  buddy.addEventListener("click", () => {
    buddyClicks++;
    if (buddyClicks % 5 === 0) { catInvasion(); return; }
    const lines = t("buddy.lines");
    say(lines[Math.floor(Math.random() * lines.length)]);
    swapBuddy(); sfx("blip");
  });
  // every so often, the buddy changes; sometimes it becomes a cat
  setInterval(() => {
    if (document.hidden) return;
    if (Math.random() < .3) { swapBuddy(S + "Gatti_Amari.png"); walkCat(); }
    else swapBuddy();
  }, 18000);

  const catsBox = $("#cats");
  function walkCat(delay = 0) {
    if (reduced) return;
    setTimeout(() => {
      const c = new Image(); c.src = S + "Gatti_Amari.png"; c.alt = ""; c.className = "cat cat--walk";
      const rtl = Math.random() < .5;
      if (rtl) c.classList.add("cat--rtl");
      c.style.setProperty("--from", rtl ? "calc(100% + 60px)" : "-80px");
      c.style.setProperty("--to", rtl ? "-80px" : "calc(100% + 60px)");
      c.style.setProperty("--dur", 7 + Math.random() * 6 + "s");
      c.style.bottom = 6 + Math.random() * 20 + "px";
      c.addEventListener("click", () => {
        const r = c.getBoundingClientRect(); gemBurst(r.left + 28, r.top + 20, 8, S + "Gold_Coin.png");
        run.gold += 5; syncHud(); sfx("meow"); c.remove();
      });
      c.addEventListener("animationend", ev => ev.animationName === "catwalk" && c.remove());
      catsBox.appendChild(c);
    }, delay);
  }
  function catInvasion() {
    swapBuddy(S + "Gatti_Amari.png");
    say(t("buddy.cat")); sfx("meow");
    for (let i = 0; i < 7; i++) walkCat(i * 380);
  }

  /* ==========================================================
     14. Typed codes (type anywhere; both are real things in the game)
       · "rosary"   → the Rosary pops up, then a flash wipes every
                      enemy in the parade (in-game it clears the screen)
       · "x-x1viiq" → the spell that unlocks Exdash Exiviiq, the ghost:
                      ghost flicker, Exdash floats by, he unlocks
     ========================================================== */
  let typed = "";
  addEventListener("keydown", e => {
    if (e.key.length !== 1 || e.target.closest("input,textarea")) return;
    typed = (typed + e.key.toLowerCase()).slice(-12);

    if (typed.endsWith("rosary")) {
      typed = "";
      const ros = new Image(); ros.src = S + "Rosary.png"; ros.alt = ""; ros.className = "rosary-pop";
      document.body.appendChild(ros); sfx("coin");
      setTimeout(() => {                       // the Rosary shows first → then flash + wipe
        const flash = document.createElement("div"); flash.className = "flash";
        document.body.appendChild(flash); setTimeout(() => flash.remove(), 600);
        G.enemies.forEach(en => hurt(en, 999));
        say(t("buddy.rosary")); sfx("chest");
      }, 700);
      setTimeout(() => ros.remove(), 1100);
    }

    if (typed.endsWith("x-x1viiq")) {
      typed = "";
      document.body.classList.remove("is-ghost"); void document.body.offsetWidth;
      document.body.classList.add("is-ghost");
      setTimeout(() => document.body.classList.remove("is-ghost"), 1600);
      const g = new Image(); g.src = S + "Exdash_Exiviiq.png"; g.alt = ""; g.className = "ghost-fly";
      document.body.appendChild(g); setTimeout(() => g.remove(), 3200);
      run.unlocked.add("Exdash_Exiviiq"); renderRoster(); selectChar(current);
      say(t("buddy.exdash")); sfx("meow");
    }
  });

  /* ==========================================================
     15. Hyper mode + the Reaper (hinted by the corner buddy)
       · click the nav logo ×5      → Hyper mode, a real game modifier:
                                      the parade runs ~1.8× faster
       · poke the footer Reaper ×3  → The Ender (all the Reapers merged)
         ×3 more                    → score settled: Mask of the Red Death
     ========================================================== */
  let hyper = 1;
  let logoClicks = 0, logoTimer = 0;
  $(".nav__logo").addEventListener("click", () => {
    logoClicks++; clearTimeout(logoTimer); logoTimer = setTimeout(() => { logoClicks = 0; }, 1500);
    if (logoClicks < 5) return;
    logoClicks = 0;
    hyper = hyper === 1 ? 1.8 : 1;
    document.body.classList.toggle("is-hyper", hyper > 1);
    say(t(hyper > 1 ? "buddy.hyper.on" : "buddy.hyper.off")); sfx("lvup");
  });
  // The Ender = the Reaper, Trickster, Stalker, Drowner and Maddener merged into
  // one (a real boss from Cappella Magna). "Settle the score with the Reaper" is
  // Mask of the Red Death's real unlock condition.
  let reaperPokes = 0;
  const reaperBox = $(".reaper");
  $("#reaper-img").addEventListener("click", e => {
    const img = e.currentTarget;
    if (reaperBox.classList.contains("is-settled")) return;
    img.classList.remove("is-hit"); void img.offsetWidth; img.classList.add("is-hit");
    sfx("hit");
    reaperPokes++;
    const r = () => img.getBoundingClientRect();
    if (reaperPokes === 3) {
      const flash = document.createElement("div"); flash.className = "flash flash--red";
      document.body.appendChild(flash); setTimeout(() => flash.remove(), 700);
      reaperBox.classList.add("is-ender");
      img.src = S + "The_Ender.png";
      say(t("buddy.ender")); sfx("deny");
    } else if (reaperPokes === 6) {
      reaperBox.classList.remove("is-ender"); reaperBox.classList.add("is-settled");
      const b = r(); gemBurst(b.left + b.width / 2, b.top + b.height / 2, 24, A + "RedExperienceGem.png");
      img.src = S + "Mask_of_the_Red_Death.png";
      run.unlocked.add("Mask_of_the_Red_Death");
      renderRoster(); selectChar(current);
      say(t("buddy.reaper")); sfx("lvup");
    }
  });

  /* ==========================================================
     16. Konami code → Golden mode (gold frames, shine, cats & Poe rain)
     ========================================================== */
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let ki = 0;
  addEventListener("keydown", e => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    ki = k === KONAMI[ki] ? ki + 1 : (k === KONAMI[0] ? 1 : 0);
    if (ki === KONAMI.length) {
      ki = 0;
      const golden = document.body.classList.toggle("is-golden");
      startRain(footRain, innerWidth < 600 ? 20 : 40, golden ? "golden" : "gems");
      if (golden) catInvasion();
      swapBuddy(A + "poe.gif"); say(t("buddy.konami")); sfx("lvup");
      run.gold += 100; syncHud();
      CHARS.filter(c => c.konami).forEach(c => run.unlocked.add(c.sprite));
      renderRoster(); selectChar(current);
    }
  });

  /* ==========================================================
     17. Hero parade — survivors march along the bottom of the hero,
     enemies come from the right. Auto-battles; click to strike.
     Kills and gems feed the shared gold used in Character Select.
     ========================================================== */
  const cv = $("#parade"), ctx = cv.getContext("2d");
  const paradeBox = $(".parade");
  const load = src => { const i = new Image(); i.src = src; return i; };
  const PARTY_POOL = ["Antonio_Belpaese", "Imelda_Belpaese", "Poe_Ratcho", "Pasqualina_Belpaese", "Gennaro_Belpaese", "Suor_Clerici", "Arca_Ladonna", "Porta_Ladonna"];
  const SHOTS = { Antonio_Belpaese: "Whip", Imelda_Belpaese: "Magic_Wand", Poe_Ratcho: "Garlic", Pasqualina_Belpaese: "Runetracer", Gennaro_Belpaese: "Knife", Suor_Clerici: "Santa_Water", Arca_Ladonna: "Fire_Wand", Porta_Ladonna: "Lightning_Ring" };
  const IMG = {
    gem: load(A + "BlueExperienceGem.png"),
    enemies: [
      { img: load(S + "Pipeestrello.png"), w: 26, hp: 1, sp: 70, fly: true },
      { img: load(S + "Skeleton.png"), w: 32, hp: 3, sp: 40 },
      { img: load(S + "Ghost.png"), w: 30, hp: 2, sp: 55, fly: true },
      { img: load(S + "Mudman.png"), w: 36, hp: 5, sp: 30 },
      { img: load(S + "Medusa_Head.png"), w: 26, hp: 2, sp: 80, fly: true },
    ],
    boss: { img: load(S + "Mantichana.png"), w: 70, hp: 45, sp: 22 },
  };
  const charImg = {}, shotImg = {};
  PARTY_POOL.forEach(n => { charImg[n] = load(S + n + ".png"); shotImg[n] = load(S + SHOTS[n] + ".png"); });

  let W = 0, H = 0, DPR = 1;
  function resize() {
    DPR = Math.min(2, devicePixelRatio || 1);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.imageSmoothingEnabled = false;
  }
  resize(); addEventListener("resize", resize);

  // shuffle the starting party so every visit looks a bit different
  const pool = [...PARTY_POOL].sort(() => Math.random() - .5);
  const G = {
    t: 0, scroll: 0, party: pool.slice(0, 3).map((id, i) => ({ id, cd: .4 + i * .3, flash: 0 })),
    enemies: [], shots: [], gems: [], fx: [], nums: [],
    xp: 0, next: 8, level: 1, spawn: 0, bossAt: 45,
  };
  const groundY = () => H - 10;
  const partyX = i => Math.max(70, W * .12) + i * (W < 600 ? 40 : 56);

  function spawnEnemy(boss) {
    const T0 = boss ? IMG.boss : IMG.enemies[Math.floor(Math.random() * IMG.enemies.length)];
    const y = T0.fly ? groundY() - 34 - Math.random() * 30 : groundY() - T0.w * .5;
    const hp = T0.hp * (1 + G.t / 150);
    G.enemies.push({ x: W + 40, y, T: T0, hp, max: hp, flash: 0, kb: 0, boss: !!boss, ph: Math.random() * 6 });
  }
  function hurt(e, dmg) {
    e.hp -= dmg; e.flash = .12; e.kb = .12;
    G.nums.push({ x: e.x, y: e.y - 18, v: Math.round(dmg * 10), life: .7 });
    if (e.hp <= 0 && !e.dead) {
      e.dead = true; run.kills++;
      G.gems.push({ x: e.x, y: e.y, vx: -60 - Math.random() * 80, vy: -120, big: e.boss });
      if (run.kills % 2 === 0 || e.boss) run.gold += e.boss ? 40 : 1;
      G.fx.push({ type: "pop", x: e.x, y: e.y, life: .25 });
      sfx("hit");
    }
  }
  function levelUp() {
    G.level++; run.level = G.level; G.xp = 0; G.next = Math.round(G.next * 1.4 + 4);
    const fresh = pool.find(id => !G.party.some(p => p.id === id));
    if (fresh && G.party.length < (W < 600 ? 4 : 6)) G.party.push({ id: fresh, cd: .5, flash: .6 });
    const lu = $("#levelup"); lu.textContent = t("lvup");
    lu.classList.remove("is-on"); void lu.offsetWidth; lu.classList.add("is-on");
    sfx("lvup");
    const r = cv.getBoundingClientRect(); gemBurst(r.left + partyX(0), r.top + groundY() - 30, 12);
  }

  // click / tap = lightning strike at that x
  cv.addEventListener("pointerdown", e => {
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left;
    G.fx.push({ type: "bolt", x, life: .22 });
    for (const en of G.enemies) if (!en.dead && Math.abs(en.x - x) < 42) hurt(en, 3);
    sfx("hit");
  });

  const hudEls = { gold: $("#hud-gold"), kills: $("#hud-kills"), lv: $("#hud-lv"), xp: $("#hud-xp") };
  function syncHud() {
    hudEls.gold.textContent = run.gold; hudEls.kills.textContent = run.kills;
    hudEls.lv.textContent = G.level; hudEls.xp.style.width = Math.min(100, G.xp / G.next * 100) + "%";
    updateSummary();
  }

  function update(dt) {
    G.t += dt; G.scroll += 40 * dt;
    G.spawn -= dt;
    if (G.spawn <= 0 && G.enemies.length < (W < 600 ? 10 : 22)) { spawnEnemy(); G.spawn = Math.max(.35, 1.4 - G.t / 90); }
    if (G.t > G.bossAt) { spawnEnemy(true); G.bossAt += 70; }

    const front = partyX(G.party.length - 1) + 24;
    for (const e of G.enemies) {
      e.flash = Math.max(0, e.flash - dt); e.kb = Math.max(0, e.kb - dt);
      e.x -= (e.kb > 0 ? -90 : e.T.sp) * dt;
      if (e.T.fly) e.y += Math.sin(G.t * 5 + e.ph) * 12 * dt;
      if (e.x < front) { e.x = front; e.kb = .25; G.party.forEach(p => p.flash = .2); }
    }
    // each survivor throws their starting weapon at the nearest enemy in range
    G.party.forEach((p, i) => {
      p.cd -= dt; p.flash = Math.max(0, p.flash - dt);
      if (p.cd > 0) return;
      const x0 = partyX(i);
      const tgt = G.enemies.find(e => !e.dead && e.x > x0 && e.x - x0 < W * .6);
      if (!tgt) return;
      p.cd = 1 + Math.random() * .5;
      if (p.id === "Antonio_Belpaese") {
        G.fx.push({ type: "whip", x: x0 + 70, y: groundY() - 30, life: .18 });
        for (const e of G.enemies) if (!e.dead && e.x > x0 && e.x < x0 + 150) hurt(e, 2);
      } else {
        const dy = tgt.y - (groundY() - 30), dx = tgt.x - x0, d = Math.hypot(dx, dy) || 1;
        G.shots.push({ x: x0, y: groundY() - 30, vx: dx / d * 360, vy: dy / d * 360, img: shotImg[p.id], life: 2, spin: Math.random() * 6 });
      }
    });
    for (const s of G.shots) {
      s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt; s.spin += dt * 10;
      for (const e of G.enemies) if (!e.dead && Math.abs(s.x - e.x) < 16 && Math.abs(s.y - e.y) < 22) { hurt(e, 2); s.life = 0; break; }
    }
    G.shots = G.shots.filter(s => s.life > 0 && s.x < W + 40);
    G.enemies = G.enemies.filter(e => !e.dead && e.x < W + 120);

    // gems hop, then fly to the leader
    for (const g of G.gems) {
      g.vy += 400 * dt; g.x += g.vx * dt; g.y = Math.min(groundY() - 6, g.y + g.vy * dt);
      const tx = partyX(0), dx = tx - g.x;
      if (Math.abs(dx) < 260) g.x += dx * 4 * dt;
      if (Math.abs(dx) < 14) { g.taken = true; G.xp += g.big ? 8 : 1; sfx("gem"); if (G.xp >= G.next) levelUp(); }
    }
    G.gems = G.gems.filter(g => !g.taken);
    for (const f of G.fx) f.life -= dt; G.fx = G.fx.filter(f => f.life > 0);
    for (const n of G.nums) { n.life -= dt; n.y -= 36 * dt; } G.nums = G.nums.filter(n => n.life > 0);
  }

  function drawSprite(img, x, y, w, flip, alpha = 1, rot = 0) {
    if (!img.complete || !img.naturalWidth) return;
    const h = w * img.naturalHeight / img.naturalWidth;
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); if (rot) ctx.rotate(rot); if (flip) ctx.scale(-1, 1);
    ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    // ground: dark soil + pixel grass tufts, scrolling under their feet
    const gy = groundY();
    ctx.fillStyle = "#13261a"; ctx.fillRect(0, gy, W, H - gy);
    // pixel grass edge: irregular tufts (4px "pixels"), scrolling with the march
    const TUFT = [0, 1, 2, 1, 0, 0, 1, 3, 1, 0, 2, 0, 1, 0, 0, 2, 1, 0, 1, 2, 0, 0, 1, 0];
    const off = Math.floor(G.scroll / 4);
    for (let x = 0; x < W + 4; x += 4) {
      const h = TUFT[(Math.floor(x / 4) + off) % TUFT.length];
      if (!h) continue;
      ctx.fillStyle = "#1d4428"; ctx.fillRect(x, gy - h * 4, 4, h * 4);
      ctx.fillStyle = "#2f6b3c"; ctx.fillRect(x, gy - h * 4, 4, 4);
    }

    for (const g of G.gems) drawSprite(IMG.gem, g.x, g.y, g.big ? 16 : 10);
    for (const e of G.enemies) {
      drawSprite(e.T.img, e.x, e.y, e.T.w, false);
      if (e.flash > 0) { ctx.globalCompositeOperation = "lighter"; drawSprite(e.T.img, e.x, e.y, e.T.w, false, .7); ctx.globalCompositeOperation = "source-over"; }
      if (e.boss) { ctx.fillStyle = "#000"; ctx.fillRect(e.x - 28, e.y - 46, 56, 6); ctx.fillStyle = "#d8202f"; ctx.fillRect(e.x - 27, e.y - 45, 54 * Math.max(0, e.hp / e.max), 4); }
    }
    const step = Math.floor(G.t * 6) % 2;
    G.party.forEach((p, i) => {
      const x = partyX(i), sz = W < 600 ? 52 : 64;
      ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(x - 12, gy - 3, 24, 3);
      drawSprite(charImg[p.id], x, gy - sz / 2 - (step === i % 2 ? 2 : 0), sz, false, p.flash > 0 && Math.floor(G.t * 30) % 2 ? .5 : 1);
    });
    for (const s of G.shots) drawSprite(s.img, s.x, s.y, 18, false, 1, s.spin);
    for (const f of G.fx) {
      if (f.type === "whip") {
        const k = f.life / .18;
        ctx.fillStyle = `rgba(255,255,255,${.85 * k})`;
        ctx.beginPath(); ctx.moveTo(f.x - 60, f.y + 6); ctx.quadraticCurveTo(f.x, f.y - 22 * k - 4, f.x + 70, f.y - 2); ctx.quadraticCurveTo(f.x, f.y - 8, f.x - 60, f.y + 6); ctx.fill();
      } else if (f.type === "bolt") {
        const k = f.life / .22;
        ctx.fillStyle = `rgba(200,230,255,${k})`;
        for (let y = 0, x = f.x; y < gy; y += 10) { x += (Math.random() - .5) * 10; ctx.fillRect(x - 2, y, 4, 10); }
        ctx.fillStyle = `rgba(120,180,255,${k * .4})`; ctx.fillRect(f.x - 30, gy - 6, 60, 6);
      } else if (f.type === "pop") {
        ctx.fillStyle = `rgba(255,220,120,${f.life * 4})`;
        const r = (1 - f.life / .25) * 16; ctx.fillRect(f.x - r, f.y - 2, r * 2, 4); ctx.fillRect(f.x - 2, f.y - r, 4, r * 2);
      }
    }
    ctx.font = "20px VT323, monospace"; ctx.textAlign = "center";
    for (const n of G.nums) {
      ctx.globalAlpha = Math.min(1, n.life * 2);
      ctx.fillStyle = "#000"; ctx.fillText(n.v, n.x + 2, n.y + 2); ctx.fillStyle = "#fff"; ctx.fillText(n.v, n.x, n.y);
    }
    ctx.globalAlpha = 1;
  }

  let paradeVisible = true, last = 0, hudTick = 0, rafId = 0;
  function loop(now) {
    const dt = Math.min(.05, (now - last) / 1000 || 0); last = now;
    update(dt * hyper); draw();
    hudTick += dt; if (hudTick > .2) { hudTick = 0; syncHud(); }
    rafId = requestAnimationFrame(loop);
  }
  function start() { if (!rafId && !reduced) { last = performance.now(); rafId = requestAnimationFrame(loop); } }
  function stop() { cancelAnimationFrame(rafId); rafId = 0; }
  new IntersectionObserver(([e]) => { paradeVisible = e.isIntersecting; paradeVisible && !document.hidden ? start() : stop(); }).observe(paradeBox);
  document.addEventListener("visibilitychange", () => (document.hidden || !paradeVisible) ? stop() : start());
  if (reduced) { Object.values(charImg)[0].onload = draw; draw(); }

  /* ==========================================================
     18. Icons — <i class="ico" data-icon="steam"> → inline SVG (icons.js)
     ========================================================== */
  function hydrateIcons() {
    const I = window.PONCLE_ICONS || {};
    $$("i.ico[data-icon]").forEach(el => {
      const d = I[el.dataset.icon]; if (!d) return;
      el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
    });
  }

  // ---- boot ----
  hydrateIcons();
  // store logo rows: split into two balanced rows, never a lone logo below
  $$(".links").forEach(n => n.style.setProperty("--cols", Math.ceil(n.children.length / 2)));
  applyLang();
  restartFeat();
  observeReveals();
  onScroll();
  console.log("%cThank you visitor, but the vampire is in another coffin!", "font:16px monospace;color:#10ee80;background:#0b0a14;padding:6px 10px");
  console.log("%c(fan-made proposal — try ↑↑↓↓←→←→BA)", "color:#a7a2c9");
})();
