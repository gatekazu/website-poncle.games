/* ==========================================================================
   content.js — EVERYTHING EDITABLE LIVES HERE
   --------------------------------------------------------------------------
   This file is plain data. No build step, no server needed: edit, save,
   refresh. Every block is documented below.

     0.  FEATURED      → carousel at the top of "From the crypt"
     1.  NEWS          → the "Updates" cards (sorted newest first automatically)
     2.  VIDEOS        → poncle TV thumbnails (the big player already shows the
                         newest YouTube upload automatically)
     2b. MUSIC         → the jukebox (♪ in the nav), official OST uploads
     2c. CRAWLER CARDS → the Vampire Crawlers hand (real cards from the wiki)
     3.  CHARACTERS    → the character-select grid
     4.  EXPANSIONS    → the treasure chests
     5.  BUDDIES       → the animated survivor in the bottom-right corner
     6.  STRINGS       → all interface copy (English default + Spanish)

   Facts were taken from poncle.games, the community Vampire Survivors Wiki
   (vampire.survivors.wiki) and press coverage. Sprites © poncle.
   ========================================================================== */

window.PONCLE = {

  /* ------------------------------------------------------------------------
     0. FEATURED — the carousel at the top of the "From the crypt" section.
     image  : shown on the CRT screen
     kicker : small line above the title
     ctas   : up to two buttons → { label: {en, es}, url, icon?, style? }
              style: "gold" (default) | "ghost" | "blood"
     ------------------------------------------------------------------------ */
  featured: [
    {
      image: "assets/crawlers-death-parade.png",
      kicker: { en: "Out now · Vampire Crawlers update", es: "Ya disponible · update de Vampire Crawlers" },
      title: "Death Parade",
      text: { en: "The latest update for Vampire Crawlers is here. Shuffle up and march.", es: "Llegó la nueva actualización de Vampire Crawlers. Baraja y a desfilar." },
      ctas: [
        { label: { en: "Watch the trailer", es: "Ver el tráiler" }, url: "https://www.youtube.com/watch?v=EBdNab2gVTk", icon: "youtube", style: "blood" },
        { label: { en: "Steam", es: "Steam" }, url: "https://store.steampowered.com/app/3265700/", icon: "steam", style: "ghost" },
      ],
    },
    {
      image: "assets/art/slide-bloodmoon.jpg",
      kicker: { en: "New expansion · $0.99", es: "Nueva expansión · $0.99" },
      title: "Legacy of the Bloodmoon",
      text: { en: "The evil twin of Legacy of the Moonspell. The moon turns red, and so does everything else.", es: "El gemelo malvado de Legacy of the Moonspell. La luna se pone roja, y todo lo demás también." },
      ctas: [
        { label: { en: "Get it on Steam", es: "Consíguelo en Steam" }, url: "https://store.steampowered.com/app/4781330/", icon: "steam" },
      ],
    },
    {
      image: "assets/art/slide-ante-chamber.jpg",
      kicker: { en: "Free expansion · Balatro crossover", es: "Expansión gratis · crossover con Balatro" },
      title: "Ante Chamber",
      text: { en: "Jokers, chips and vampires. The second free expansion, themed around LocalThunk's Balatro.", es: "Jokers, fichas y vampiros. La segunda expansión gratuita, inspirada en Balatro de LocalThunk." },
      ctas: [
        { label: { en: "Learn more", es: "Saber más" }, url: "https://poncle.games/ante-chamber-faq" },
      ],
    },
  ],

  /* ------------------------------------------------------------------------
     1. NEWS
     date  : "YYYY-MM-DD" (cards are sorted newest first automatically)
     tag   : "update" | "launch" | "dlc" | "event" | "publishing"
     title : { en, es }
     url   : where the card links to (Steam post, YouTube, FAQ page…)
     image : key art (wide image) or a sprite from assets/sprites/
     Only the newest 4 are displayed.
     ------------------------------------------------------------------------ */
  news: [
    {
      date: "2026-10-12", tag: "update",
      title: { en: "Vampire Crawlers: Death Parade is out now", es: "Vampire Crawlers: Death Parade ya está disponible" },
      url: "https://www.youtube.com/watch?v=EBdNab2gVTk",
      image: "assets/crawlers-death-parade.png",
    },
    {
      date: "2026-10-01", tag: "launch",
      title: { en: "Vampire Crawlers comes to iOS and Android", es: "Vampire Crawlers llega a iOS y Android" },
      url: "https://poncle.games/vampire-crawlers-mobile-faq",
      image: "assets/sprites/Big_Coin_Bag.png",
    },
    {
      date: "2026-08-28", tag: "dlc",
      title: { en: "Legacy of the Bloodmoon, the Moonspell's evil twin, is out", es: "Sale Legacy of the Bloodmoon, el gemelo malvado de Moonspell" },
      url: "https://vampire.survivors.wiki/w/Legacy_of_the_Bloodmoon",
      image: "assets/sprites/Mask_of_the_Red_Death.png",
    },
    {
      date: "2026-04-21", tag: "launch",
      title: { en: "Vampire Crawlers launches on PC, consoles and Game Pass", es: "Vampire Crawlers sale en PC, consolas y Game Pass" },
      url: "https://store.steampowered.com/app/3265700/",
      image: "assets/sprites/Little_Clover.png",
    },
  ],

  /* ------------------------------------------------------------------------
     2. VIDEOS — official channel: youtube.com/@poncle_games
     The big player streams the channel's uploads playlist, so it ALWAYS
     starts on the newest video with zero maintenance. This list only feeds
     the thumbnails underneath: { id: 11-char YouTube id, title }.
     ------------------------------------------------------------------------ */
  youtubeChannelId: "UC9oXsaXIVWOveE9PF8z2HDw",
  videos: [
    { id: "EBdNab2gVTk", title: "Vampire Crawlers: Death Parade | OUT NOW | Launch Trailer" },
    { id: "vuWeoEeoCK0", title: "Barely Staying Alive - Turbo | Vampire Crawlers OST" },
    { id: "gAuNVs8UC8U", title: "Barely Staying Alive - Crawling | Vampire Crawlers OST" },
    { id: "vVAqdtceAYY", title: "11 Lying Fairy Tales | Legacy of the Bloodmoon OST" },
    { id: "Ph6Xol7cVr0", title: "10 Brave Fairy Tales | Legacy of the Bloodmoon OST" },
    { id: "9Rex8RuU6Ws", title: "Disk 04-07 Blade of Moonlight | Vampire Survivors OST" },
  ],

  /* ------------------------------------------------------------------------
     2b. MUSIC — the jukebox (♪ button in the nav). Official soundtrack
     uploads from youtube.com/@poncle_games: { id, title, game }.
     ------------------------------------------------------------------------ */
  music: [
    { id: "kDk8D4VbrFw", title: "Vempair Survaivors (looping)", game: "Vampire Survivors" },
    { id: "dxx6fvhf5Pc", title: "Forest Night Fever", game: "Vampire Survivors OST" },
    { id: "O5A2tijQap4", title: "The Beginning", game: "Vampire Survivors" },
    { id: "p7qpWDSN7lM", title: "Copper Green Intent (looping)", game: "Vampire Survivors" },
    { id: "tHT_UvgjQFs", title: "Bloody Tears", game: "Ode to Castlevania" },
    { id: "pDuzoJqQflA", title: "Vampire Killer", game: "Ode to Castlevania" },
    { id: "t3WYvSQiaGE", title: "Mad Forest", game: "Ode to Castlevania" },
    { id: "s4zN7PtCWsA", title: "Il Cuor non si Spaura", game: "Vampire Crawlers OST" },
    { id: "vuWeoEeoCK0", title: "Barely Staying Alive - Turbo", game: "Vampire Crawlers OST" },
    { id: "vVAqdtceAYY", title: "11 Lying Fairy Tales", game: "Legacy of the Bloodmoon OST" },
  ],


  /* ------------------------------------------------------------------------
     2c. CRAWLER CARDS — the hand shown in the Vampire Crawlers block.
     Real cards, cost and text from the wiki (Crawlers:Cards).
     frame : attack | defence | mana | wild | special | evo | crawler | debuff
             → assets/crawlers/UI_sprites_<frame>_card.png (32×48 originals)
     icon  : assets/crawlers/CSprite-<icon>.png (16×16)
     cost  : mana cost shown in the blue gem ("W" = Wild)
     ------------------------------------------------------------------------ */
  crawlerCards: [
    { name: "Whip", frame: "attack", icon: "Whip", cost: "0",
      en: "Deal 8 damage to multiple enemies.", es: "Inflige 8 de daño a varios enemigos." },
    { name: "Magic Wand", frame: "attack", icon: "Magic_Wand", cost: "0",
      en: "Deal 30 damage. Prioritize attackers.", es: "Inflige 30 de daño. Prioriza atacantes." },
    { name: "King Bible", frame: "attack", icon: "King_Bible", cost: "1",
      en: "Deal 40 damage with a chance to Knockback.", es: "Inflige 40 de daño con probabilidad de empujar." },
    { name: "Armor", frame: "defence", icon: "Armor", cost: "0",
      en: "Add 2 Armor.", es: "Añade 2 de armadura." },
    { name: "Empty Tome", frame: "mana", icon: "Empty_Tome", cost: "0",
      en: "Add 1 Mana.", es: "Añade 1 de maná." },
    { name: "Duplicator", frame: "special", icon: "Duplicator", cost: "1",
      en: "Fire 1 more projectile.", es: "Dispara 1 proyectil más." },
    { name: "Hollow Heart", frame: "special", icon: "Hollow_Heart", cost: "1",
      en: "Gain 3 Max Health. Destroy.", es: "Gana 3 de vida máxima. Se destruye." },
    { name: "Little Clover", frame: "wild", icon: "Little_Clover", cost: "W",
      en: "Add 10% Luck. Destroy.", es: "Añade 10% de suerte. Se destruye." },
  ],


  /* ------------------------------------------------------------------------
     3. CHARACTERS — passives and unlocks quoted from the wiki.
     sprite  : file name in assets/sprites/ (without .png)
     weapon  : starting weapon; weaponIcon = sprite file or null
     cost    : if set, the slot starts locked and costs that much gold
               (gold is earned in the hero mini-game, chests and cats)
     konami  : true → also unlocked by the Konami code (as in the real game)
     ------------------------------------------------------------------------ */
  characters: [
    { sprite: "Antonio_Belpaese", name: "Antonio Belpaese", weapon: "Whip", weaponIcon: "Whip",
      en: "Gains 10% more Damage every 10 levels (max +50%).", es: "Gana 10% más de daño cada 10 niveles (máx. +50%)." },
    { sprite: "Imelda_Belpaese", name: "Imelda Belpaese", weapon: "Magic Wand", weaponIcon: "Magic_Wand",
      en: "Gains 10% more Experience every 5 levels (max +30%).", es: "Gana 10% más de experiencia cada 5 niveles (máx. +30%)." },
    { sprite: "Pasqualina_Belpaese", name: "Pasqualina Belpaese", weapon: "Runetracer", weaponIcon: "Runetracer",
      en: "Projectiles get 10% faster every 5 levels (max +30%).", es: "Los proyectiles van 10% más rápido cada 5 niveles (máx. +30%)." },
    { sprite: "Gennaro_Belpaese", name: "Gennaro Belpaese", weapon: "Knife", weaponIcon: "Knife",
      en: "Permanent +1 projectile (all weapons).", es: "+1 proyectil permanente (todas las armas)." },
    { sprite: "Arca_Ladonna", name: "Arca Ladonna", weapon: "Fire Wand", weaponIcon: "Fire_Wand",
      en: "Weapon cooldown is reduced by 5% every 10 levels (max -15%).", es: "La recarga de armas baja 5% cada 10 niveles (máx. -15%)." },
    { sprite: "Porta_Ladonna", name: "Porta Ladonna", weapon: "Lightning Ring", weaponIcon: "Lightning_Ring",
      en: "Permanent +30% Area. Starts with temporary cooldown bonus.", es: "+30% de área permanente. Empieza con bonus temporal de recarga." },
    { sprite: "Lama_Ladonna", name: "Lama Ladonna", weapon: "Axe", weaponIcon: "Axe",
      en: "Gains +5% Might, Move Speed, and Curse every 10 levels (max +20%).", es: "Gana +5% de poder, velocidad y maldición cada 10 niveles (máx. +20%)." },
    { sprite: "Poe_Ratcho", name: "Poe Ratcho", weapon: "Garlic", weaponIcon: "Garlic",
      en: "Permanent +25% Pickup range and -30 Max Health.", es: "+25% de rango de recogida y -30 de vida máxima, permanentes." },
    { sprite: "Suor_Clerici", name: "Suor Clerici", weapon: "Santa Water", weaponIcon: "Santa_Water",
      en: "Permanent +0.5 HP/s and +50 Max Health. Starts with temporary Area bonus.", es: "+0.5 PV/s y +50 de vida máxima permanentes. Empieza con bonus temporal de área." },
    { sprite: "Dommario", name: "Dommario", weapon: "King Bible", weaponIcon: "King_Bible",
      en: "Permanent +40% Duration and Speed, -40% Move Speed.", es: "+40% de duración y velocidad, -40% de velocidad de movimiento." },
    { sprite: "Krochi_Freetto", name: "Krochi Freetto", weapon: "Cross", weaponIcon: "Cross",
      en: "Starts with 1 Revival. Gains 1 more Revival at level 33.", es: "Empieza con 1 revivir. Gana otro al nivel 33." },
    { sprite: "Christine_Davain", name: "Christine Davain", weapon: "Pentagram", weaponIcon: null,
      en: "Starts with 1 extra level.", es: "Empieza con 1 nivel extra." },
    { sprite: "Pugnala_Provola", name: "Pugnala Provola", weapon: "Phiera Der Tuphello & Eight The Sparrow", weaponIcon: null,
      en: "Gains +1% Might every level.", es: "Gana +1% de poder cada nivel." },
    { sprite: "Mortaccio", name: "Mortaccio", weapon: "Bone", weaponIcon: null, cost: 40, konami: true,
      en: "Gets more projectiles every 20 levels (max +3).", es: "Gana más proyectiles cada 20 niveles (máx. +3).",
      unlockEn: "In-game: defeat 3000 skeletons — or enter the Konami Code.", unlockEs: "En el juego: derrota 3000 esqueletos — o usa el código Konami." },
    { sprite: "Yatta_Cavallo", name: "Yatta Cavallo", weapon: "Cherry Bomb", weaponIcon: null, cost: 60,
      en: "Gets more projectiles every 20 levels (max +3).", es: "Gana más proyectiles cada 20 niveles (máx. +3).",
      unlockEn: "In-game: defeat 3000 Lion Heads.", unlockEs: "En el juego: derrota 3000 Lion Heads." },
    { sprite: "Exdash_Exiviiq", name: "Exdash Exiviiq", weapon: "Ebony Wings", weaponIcon: "Ebony_Wings", cost: 90,
      en: "At least they're lucky.", es: "Al menos tiene suerte.",
      unlockEn: "In-game: cast the spell x-x1viiq, or find a lot of Little Clovers.", unlockEs: "En el juego: lanza el hechizo x-x1viiq o encuentra muchos Little Clovers." },
    { sprite: "Toastie", name: "Toastie", weapon: "Peachone", weaponIcon: "Peachone", cost: 100,
      en: "So much potential.", es: "Tanto potencial.",
      unlockEn: "In-game: uppercut a non-red reaper.", unlockEs: "En el juego: dale un uppercut a un reaper que no sea rojo." },
    { sprite: "Peppino", name: "Peppino", weapon: "Soul Eater", weaponIcon: null, cost: 120,
      en: "Starts with temporarily reduced area.", es: "Empieza con el área reducida temporalmente.",
      unlockEn: "In-game: be a good boy in Il Molise.", unlockEs: "En el juego: pórtate bien en Il Molise." },
    { sprite: "Queen_Sigma", name: "Queen Sigma", weapon: "Victory Sword", weaponIcon: null, cost: 180,
      en: "She owns everything.", es: "Es dueña de todo.",
      unlockEn: "In-game: complete the Collection.", unlockEs: "En el juego: completa la Colección." },
    { sprite: "Mask_of_the_Red_Death", name: "Mask of the Red Death", weapon: "Death Spiral", weaponIcon: "Death_Spiral", cost: 250,
      en: "A blasphemous mockery.", es: "Una burla blasfema.",
      unlockEn: "In-game: settle the score with the Reaper.", unlockEs: "En el juego: salda cuentas con el Reaper." },
  ],

  /* ------------------------------------------------------------------------
     4. EXPANSIONS — dates, prices and themes from the wiki; image = Steam
     capsule art (assets/art/), shown on a CRT screen when the chest opens.
     ------------------------------------------------------------------------ */
  expansions: [
    { name: "Legacy of the Moonspell", image: "assets/art/dlc-moonspell.jpg", date: "2022-12-15", price: "$0.99",
      url: "https://store.steampowered.com/app/2230760/",
      en: "The first expansion. A new stage, Mt.Moonspell, and the mysterious powers of the Moonspell clan.",
      es: "La primera expansión. Un escenario nuevo, Mt.Moonspell, y los poderes misteriosos del clan Moonspell." },
    { name: "Tides of the Foscari", image: "assets/art/dlc-foscari.jpg", date: "2023-04-13", price: "$1.99",
      url: "https://store.steampowered.com/app/2313550/",
      en: "Two new stages, Lake Foscari and Abyss Foscari, plus new characters, monsters and weapons.",
      es: "Dos escenarios nuevos, Lake Foscari y Abyss Foscari, más personajes, monstruos y armas." },
    { name: "Emergency Meeting", image: "assets/art/dlc-emergency-meeting.jpg", date: "2023-12-18", price: "$2.49",
      url: "https://store.steampowered.com/app/2690330/",
      en: "Themed around Among Us by Innersloth. Someone in this run is the impostor.",
      es: "Inspirada en Among Us de Innersloth. Alguien en esta partida es el impostor." },
    { name: "Operation Guns", image: "assets/art/dlc-operation-guns.jpg", date: "2024-05-09", price: "$2.49",
      url: "https://store.steampowered.com/app/2887680/",
      en: "Themed after Konami's run-and-gun series Contra.",
      es: "Inspirada en Contra, la saga run-and-gun de Konami." },
    { name: "Ode to Castlevania", image: "assets/art/dlc-ode-to-castlevania.jpg", date: "2024-10-31", price: "$3.99",
      url: "https://store.steampowered.com/app/3210350/",
      en: "80 new characters and 107 new weapons. The largest expansion to date.",
      es: "80 personajes y 107 armas nuevas. La expansión más grande hasta hoy." },
    { name: "Emerald Diorama", image: "assets/art/dlc-emerald-diorama.jpg", date: "2025-04-10", price: "Free",
      url: "https://store.steampowered.com/app/3451100/",
      en: "The first free expansion, themed around SaGa: Emerald Beyond.",
      es: "La primera expansión gratuita, inspirada en SaGa: Emerald Beyond." },
    { name: "Ante Chamber", image: "assets/art/dlc-ante-chamber.jpg", date: "2025-10-28", price: "Free",
      url: "https://poncle.games/ante-chamber-faq",
      en: "The second free expansion, themed around Balatro by LocalThunk.",
      es: "La segunda expansión gratuita, inspirada en Balatro de LocalThunk." },
    { name: "Legacy of the Bloodmoon", image: "assets/art/dlc-bloodmoon.jpg", date: "2026-08-28", price: "$0.99",
      url: "https://vampire.survivors.wiki/w/Legacy_of_the_Bloodmoon",
      en: "The evil twin of Legacy of the Moonspell.",
      es: "El gemelo malvado de Legacy of the Moonspell." },
  ],

  /* ------------------------------------------------------------------------
     5. BUDDIES — the animated GIFs used on poncle.games itself.
     A different one appears on every page load. Every so often it turns
     into a Gatti Amari cat and a few cats walk across the screen.
     ------------------------------------------------------------------------ */
  buddies: ["poe", "mortaccio", "smith", "suorcleric", "yatta"],

  /* ------------------------------------------------------------------------
     6. STRINGS — keys match data-i18n="…" attributes in index.html.
     English is the default; Spanish only when picked with the EN/ES toggle.
     Section stamps use real Vampire Survivors stage names (one per section).
     {placeholders} are filled in by main.js.
     ------------------------------------------------------------------------ */
  strings: {
    en: {
      skip: "Skip to games", sfx: "Sound effects", "uc.close": "Close",
      "music.title": "Jukebox", "yt.local": "YouTube only plays inside a published site (or one served from localhost — double-click abrir-sitio.bat). Meanwhile:", "yt.open": "Listen on YouTube", "hero.h1": "poncle — makers of Vampire Survivors and Vampire Crawlers",
      "hero.tagline": "Two games. One very long night.", "hero.play": "Play now",
      "hero.vs.kicker": "98% Overwhelmingly Positive · BAFTA Best Game", "hero.vs.text": "Thirty minutes. Thousands of bats. One whip to start.",
      "hero.vc.kicker": "New · 96% Overwhelmingly Positive", "hero.vc.text": "The same night, new rules. A turn-based deckbuilder.",
      "store.label": "Available on", "nav.top": "Top", "nav.news": "News", "parade.hint": "Click to strike", "music.pick": "Pick a track. It plays straight from the official poncle channel.", "music.more": "More on YouTube →",
      "nav.games": "Games", "nav.roster": "Survivors", "nav.dlc": "Expansions", "nav.lore": "Our story", "nav.jobs": "Jobs", "nav.help": "Help",

      "games.stamp": "05:00 · Mad Forest", "games.title": "Two ways to lose an evening",
      "deck.hint": "Hover to fan the hand · click a card to play it",
      "vc.tag": "New · casual turn-based deckbuilder", "vc.sub": "The Turbo Wildcard from Vampire Survivors",
      "vc.pitch": "The same dungeons, seen from a new perspective. Build busted decks, chain world-ending combos and crawl deeper, one card at a time.",
      "vc.s1": "launch", "vc.s2": "on Steam, Day 1 on Game Pass", "vc.s3": "crawlers in week one",
      "vs.tag": "Gothic horror roguelite", "vs.sub": "The one that started it all",
      "vs.pitch": "Survive waves of night creatures for as long as you can. You get one button's worth of decisions; by the end the screen is mostly you, and you're mostly fire.",
      "vs.s1": "playable survivors", "vs.s2": "expansions", "vs.s3": "BAFTA Best Game",
      "l.trailer": "Trailer", "l.patch": "Patch notes",
      "friends.title": "Also crawling out of the crypt", "friends.pub": "Published",
      "friends.ante": "Free expansion themed around Balatro.", "friends.vr": "Vampire Survivors, now around you.",
      "friends.brick": "Turn-based roguelike bullet-builder by Doonutsaur.", "friends.berserk": "Keyboard-bashing hack and slash by solo dev Nao Games.",

      "roster.stamp": "10:00 · Inlaid Library", "roster.title": "Who's taking the night shift?",
      "roster.lede": "20 of the 225. Locked ones cost gold here — earn it whipping bats up top, opening chests or catching cats. In the real game, each has its own unlock.",
      "roster.starts": "Starts with", "roster.count": "Showing 20 of", "roster.all": "see them all on the wiki",
      "roster.locked": "Locked", "roster.cost": "Unlock for {n} gold", "roster.howto": "How to unlock",

      "dlc.stamp": "15:00 · Dairy Plant", "dlc.title": "A chest dropped. Several, actually.",
      "dlc.lede": "Every expansion so far, oldest to newest. Open a chest to switch on its screen.",
      "dlc.more": "More →", "dlc.open": "Click to open", "dlc.free": "Free",

      "lore.stamp": "20:00 · Gallo Tower", "lore.title": "How one developer and a whip got out of hand",
      "lore.1": "Luca Galante builds Vampire Survivors largely on his own. Version 1.0 lands in October; in December, the first expansion, Legacy of the Moonspell.",
      "lore.2": "A BAFTA for Best Game and Best Game Design — the first solo-developed game to win Best Game, says Guinness World Records. Then Switch, local co-op, Adventures and an Emergency Meeting.",
      "lore.3": "Operation Guns, Apple Arcade, PlayStation, the Epic Games Store and Ode to Castlevania, the largest expansion yet.",
      "lore.4": "Emerald Diorama, the first free expansion. poncle starts publishing other people's games: Berserk or Die, spotted at BitSummit, and Kill The Brickman. Then Ante Chamber, online play and VR.",
      "lore.5": "Vampire Crawlers arrives in April and passes a million players in its first week. Legacy of the Bloodmoon rises in August. The team is now 25+ people.",
      "studio.c1": "people on the team", "studio.c2": "playable survivors", "studio.c3": "Vampire Survivors expansions", "studio.c4": "Vampire Crawlers players in week one",

      "news.stamp": "25:00 · Cappella Magna", "news.title": "From the crypt",
      "news.updates": "Updates", "news.steam": "All patch notes on Steam →",
      "news.tag.update": "Update", "news.tag.launch": "Launch", "news.tag.dlc": "Expansion", "news.tag.event": "Event", "news.tag.publishing": "Publishing",
      "tv.title": "poncle TV", "tv.sub": "Subscribe →", "tv.play": "Play the latest video", "tv.latest": "Latest upload",
      "jobs.eyebrow": "Jobs", "jobs.title": "The coven is recruiting",
      "jobs.p": "From one developer to a team of 25+. If you've ever argued about the best evolution at 3am, take a look at what's open.", "jobs.cta": "See open roles",
      "pub.eyebrow": "Publishing", "pub.title": "Making something weird?",
      "pub.p": "Berserk or Die was spotted at BitSummit. Kill The Brickman came next. If you're making a strange little game, say hi.", "pub.cta": "Get in touch",

      "help.stamp": "29:00 · Laborratory", "help.title": "Need a floor chicken?",
      "help.support": "Player support", "help.media": "Press & media", "help.marketing": "Marketing & business", "help.faq": "FAQs & accounts",

      "footer.stamp": "30:00", "footer.title": "He's here. Thanks for surviving.",
      "footer.fan": "Fan-made concept. Not affiliated with poncle LTD. Sprites © poncle.",
      "footer.secret": "↑↑↓↓←→←→BA",
      summary: "Run summary — {k} kills · {g} gold · LV {l} · {c} chests opened",
      lvup: "LEVEL UP!",

      "buddy.aria": "Say hi to the survivor",
      "buddy.lines": [
        "Thank you visitor, but the vampire is in another coffin!",
        "Have you tried more garlic?",
        "I've been standing in this corner all day.",
        "Floor chicken is a complete meal.",
        "Don't scroll too fast. Something is waiting at 30:00.",
        "The cats are not mine. Probably.",
        "Psst. Chests open with a click.",
        "They say the Reaper hates being poked.",
        "A Rosary wipes the screen. Some people just type it.",
        "Click our logo enough times and things get… hyper.",
        "Ghosts answer to a spell. Something like x-x-something.",
      ],
      "buddy.cat": "Meow. (The Gatti Amari have taken over.)",
      "buddy.rosary": "Rosary! Every enemy on screen is gone.",
      "buddy.hyper.on": "Hyper mode on. Everything moves faster.", "buddy.hyper.off": "Hyper mode off. Breathe.",
      "buddy.exdash": "x-x1viiq… Exdash Exiviiq floats by. Unlocked!", "buddy.ender": "Oh no. The Ender — five Reapers merged into one. Keep poking…", "buddy.reaper": "You settled the score with the Reaper. Mask of the Red Death unlocked!",
      "buddy.poor": "Need {n} more gold. Whip some bats up top, open chests, or catch a cat.",
      "buddy.bought": "{name} joins the run!",
      "buddy.konami": "Golden mode! It's raining Poe. Mortaccio unlocked.",
    },

    es: {
      skip: "Saltar a los juegos", sfx: "Efectos de sonido", "uc.close": "Cerrar",
      "music.title": "Rockola", "yt.local": "YouTube solo reproduce dentro de un sitio publicado (o servido en localhost — doble clic en abrir-sitio.bat). Mientras tanto:", "yt.open": "Escuchar en YouTube", "hero.h1": "poncle — creadores de Vampire Survivors y Vampire Crawlers",
      "hero.tagline": "Dos juegos. Una noche muy larga.", "hero.play": "Jugar ahora",
      "hero.vs.kicker": "98% extremadamente positivas · BAFTA Mejor Juego", "hero.vs.text": "Treinta minutos. Miles de murciélagos. Un látigo para empezar.",
      "hero.vc.kicker": "Nuevo · 96% extremadamente positivas", "hero.vc.text": "La misma noche, reglas nuevas. Un deckbuilder por turnos.",
      "store.label": "Disponible en", "nav.top": "Inicio", "nav.news": "Novedades", "parade.hint": "Clic para atacar", "music.pick": "Elige una pista. Suena directo desde el canal oficial de poncle.", "music.more": "Más en YouTube →",
      "nav.games": "Juegos", "nav.roster": "Supervivientes", "nav.dlc": "Expansiones", "nav.lore": "Historia", "nav.jobs": "Empleo", "nav.help": "Ayuda",

      "games.stamp": "05:00 · Mad Forest", "games.title": "Dos formas de perder una noche",
      "deck.hint": "Pasa el cursor para abrir la mano · clic para jugar una carta",
      "vc.tag": "Nuevo · deckbuilder casual por turnos", "vc.sub": "The Turbo Wildcard from Vampire Survivors",
      "vc.pitch": "Las mismas mazmorras, desde una perspectiva nueva. Arma mazos rotos, encadena combos que acaban con el mundo y baja más hondo, carta por carta.",
      "vc.s1": "lanzamiento", "vc.s2": "en Steam, Día 1 en Game Pass", "vc.s3": "jugadores en la 1ª semana",
      "vs.tag": "Roguelite de terror gótico", "vs.sub": "El que empezó todo",
      "vs.pitch": "Sobrevive a oleadas de criaturas de la noche tanto como puedas. Tus decisiones caben en un botón; al final la pantalla eres casi toda tú, y tú eres casi todo fuego.",
      "vs.s1": "supervivientes jugables", "vs.s2": "expansiones", "vs.s3": "BAFTA Mejor Juego",
      "l.trailer": "Tráiler", "l.patch": "Notas de parche",
      "friends.title": "También saliendo de la cripta", "friends.pub": "Publicado",
      "friends.ante": "Expansión gratuita inspirada en Balatro.", "friends.vr": "Vampire Survivors, ahora a tu alrededor.",
      "friends.brick": "Roguelike por turnos de construir balas, de Doonutsaur.", "friends.berserk": "Hack and slash de aporrear el teclado, del dev solitario Nao Games.",

      "roster.stamp": "10:00 · Inlaid Library", "roster.title": "¿Quién cubre el turno de noche?",
      "roster.lede": "20 de los 225. Aquí los bloqueados cuestan oro — gánalo azotando murciélagos arriba, abriendo cofres o atrapando gatos. En el juego real, cada uno tiene su propio desbloqueo.",
      "roster.starts": "Empieza con", "roster.count": "Mostrando 20 de", "roster.all": "velos todos en la wiki",
      "roster.locked": "Bloqueado", "roster.cost": "Desbloquear por {n} de oro", "roster.howto": "Cómo desbloquearlo",

      "dlc.stamp": "15:00 · Dairy Plant", "dlc.title": "Cayó un cofre. Varios, de hecho.",
      "dlc.lede": "Todas las expansiones hasta hoy, de la más vieja a la más nueva. Abre un cofre para encender su pantalla.",
      "dlc.more": "Ver más →", "dlc.open": "Clic para abrir", "dlc.free": "Gratis",

      "lore.stamp": "20:00 · Gallo Tower", "lore.title": "Cómo un desarrollador y un látigo se salieron de control",
      "lore.1": "Luca Galante crea Vampire Survivors prácticamente solo. La versión 1.0 sale en octubre; en diciembre, la primera expansión, Legacy of the Moonspell.",
      "lore.2": "Un BAFTA a Mejor Juego y Mejor Diseño — el primer juego hecho por una sola persona en ganar Mejor Juego, según Guinness World Records. Luego Switch, co-op local, Adventures y un Emergency Meeting.",
      "lore.3": "Operation Guns, Apple Arcade, PlayStation, la Epic Games Store y Ode to Castlevania, la expansión más grande hasta ahora.",
      "lore.4": "Emerald Diorama, la primera expansión gratis. poncle empieza a publicar juegos de otros: Berserk or Die, descubierto en BitSummit, y Kill The Brickman. Luego Ante Chamber, juego online y VR.",
      "lore.5": "Vampire Crawlers llega en abril y supera el millón de jugadores en su primera semana. Legacy of the Bloodmoon se alza en agosto. El equipo ya es de más de 25 personas.",
      "studio.c1": "personas en el equipo", "studio.c2": "supervivientes jugables", "studio.c3": "expansiones de Vampire Survivors", "studio.c4": "jugadores de Vampire Crawlers en la 1ª semana",

      "news.stamp": "25:00 · Cappella Magna", "news.title": "Desde la cripta",
      "news.updates": "Novedades", "news.steam": "Todas las notas de parche en Steam →",
      "news.tag.update": "Update", "news.tag.launch": "Lanzamiento", "news.tag.dlc": "Expansión", "news.tag.event": "Evento", "news.tag.publishing": "Publishing",
      "tv.title": "poncle TV", "tv.sub": "Suscríbete →", "tv.play": "Reproducir el último video", "tv.latest": "Último video",
      "jobs.eyebrow": "Empleo", "jobs.title": "El aquelarre está reclutando",
      "jobs.p": "De un desarrollador a un equipo de más de 25. Si alguna vez discutiste la mejor evolución a las 3am, mira las vacantes.", "jobs.cta": "Ver vacantes",
      "pub.eyebrow": "Publishing", "pub.title": "¿Estás haciendo algo raro?",
      "pub.p": "Berserk or Die fue descubierto en BitSummit. Después vino Kill The Brickman. Si estás haciendo un juego pequeño y extraño, escríbenos.", "pub.cta": "Escríbenos",

      "help.stamp": "29:00 · Laborratory", "help.title": "¿Necesitas un pollo del suelo?",
      "help.support": "Soporte a jugadores", "help.media": "Prensa y medios", "help.marketing": "Marketing y negocios", "help.faq": "FAQs y cuentas",

      "footer.stamp": "30:00", "footer.title": "Ya llegó. Gracias por sobrevivir.",
      "footer.fan": "Concepto hecho por un fan. Sin afiliación con poncle LTD. Sprites © poncle.",
      "footer.secret": "↑↑↓↓←→←→BA",
      summary: "Resumen de la partida — {k} bajas · {g} de oro · NV {l} · {c} cofres abiertos",
      lvup: "¡SUBES DE NIVEL!",

      "buddy.aria": "Saluda al superviviente",
      "buddy.lines": [
        "¡Gracias, visitante, pero el vampiro está en otro ataúd!",
        "¿Ya probaste con más ajo?",
        "Llevo todo el día parado en esta esquina.",
        "El pollo del suelo es una comida completa.",
        "No hagas scroll tan rápido. Algo te espera en el 30:00.",
        "Los gatos no son míos. Creo.",
        "Psst. Los cofres se abren con un clic.",
        "Dicen que al Reaper no le gusta que lo piquen.",
        "Un Rosary limpia la pantalla. Hay quien solo lo escribe.",
        "Dale suficientes clics a nuestro logo y todo se pone… hyper.",
        "Los fantasmas responden a un hechizo. Algo como x-x-algo.",
      ],
      "buddy.cat": "Miau. (Los Gatti Amari tomaron el control.)",
      "buddy.rosary": "¡Rosary! No queda un solo enemigo en pantalla.",
      "buddy.hyper.on": "Hyper mode activado. Todo va más rápido.", "buddy.hyper.off": "Hyper mode desactivado. Respira.",
      "buddy.exdash": "x-x1viiq… Exdash Exiviiq pasa flotando. ¡Desbloqueado!", "buddy.ender": "Ay no. The Ender — cinco Reapers fusionados en uno. Sigue picando…", "buddy.reaper": "Saldaste cuentas con el Reaper. ¡Mask of the Red Death desbloqueado!",
      "buddy.poor": "Te faltan {n} de oro. Azota murciélagos arriba, abre cofres o atrapa un gato.",
      "buddy.bought": "¡{name} se une a la partida!",
      "buddy.konami": "¡Modo dorado! Llueven Poes. Mortaccio desbloqueado.",
    },
  },
};
