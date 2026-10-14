# poncle.games — concept redesign

An unofficial, fan-made concept for poncle's website. It's plain HTML, CSS and JavaScript, with no build step, no framework and no dependencies.

The page is designed as a **30-minute Vampire Survivors run**:

- Every section is a real stage from the game, stamped with the minute you reach it (05:00 Mad Forest … 29:00 Laborratory).
- The clock in the nav counts up as you scroll, and the level badge goes up at each new section.
- The gems on the right fill in as you pass sections.
- At 30:00 the Reaper is waiting in the footer.

## Run it

| How | Notes |
| --- | --- |
| Open `index.html` | Everything works **except YouTube playback**. YouTube refuses to play inside pages opened as files (Error 153), so the page shows an "open on YouTube" button instead. |
| `abrir-sitio.bat` (Windows) | Serves the folder at `http://localhost:8080` and opens it. YouTube works here. Requires Python. On macOS or Linux, run `python3 -m http.server 8080` in this folder. |
| Any static host | GitHub Pages, Netlify, Vercel or poncle's own server. Upload the folder as is. |

**GitHub Pages:** go to *Settings → Pages*, set *Source* to *Deploy from a branch*, pick `main` and `/ (root)`, and save. The site is served from `index.html`.

## Project structure

```
index.html       Page structure. Visible text is the English default; every
                 translatable node has data-i18n="key".
content.js       ALL editable content (see "Editing content").
icons.js         Platform/social logos as inline SVG paths (Simple Icons).
styles.css       Look & feel. A table of contents sits at the top of the file.
main.js          Behaviour only, in numbered sections (index at the top):
                 i18n, SFX, jukebox, scroll HUD, cards, character select,
                 chests, carousel, TV, buddy, easter eggs, hero parade…
abrir-sitio.bat  Local server launcher (Windows).
assets/
  art/           Steam capsule art (expansions) + gameplay screenshots
  sprites/       Vampire Survivors sprites (community wiki)
  crawlers/      Vampire Crawlers card frames (32×48) and card icons (16×16)
  anim/          Animated GIFs + XP gems used on the current poncle.games
  fonts/         HeinzHeinrich-Regular.otf + its license PDF
  icons/         Source SVGs for icons.js
  ui/            Pixel UI: 9-slice frames, stage dithers, golden shine sprite
  poncle-logo.png, crawlers-death-parade.png
```

## Editing content (`content.js`)

Everything is a plain JavaScript object, and each block has a comment explaining its fields.

| Block | What it controls | How to update |
| --- | --- | --- |
| `featured` | Carousel at the top of "From the crypt" | Add `{ image, kicker {en, es}, title, text {en, es}, ctas }`. It advances every 7s; clicking the screen or a gem dot jumps to another slide. |
| `news` | "Updates" cards | Add `{ date, tag, title {en, es}, url, image }`. Cards sort themselves newest first, and only 4 are shown. |
| `videos` | poncle TV thumbnails | Add `{ id, title }`. The big player always streams the channel's newest upload, so it never needs editing. |
| `music` | Jukebox (♪ in the nav) | Official OST uploads from youtube.com/@poncle_games, as `{ id, title, game }`. |
| `crawlerCards` | The Vampire Crawlers hand | `frame` is one of `attack`, `defence`, `mana`, `wild`, `special`, `evo`, `crawler`, `debuff`. `icon` maps to `assets/crawlers/CSprite-<icon>.png`. |
| `characters` | Character select | Passives and unlock conditions are quoted from the wiki. `cost` makes the slot locked; `konami: true` lets the Konami code unlock it. |
| `expansions` | Treasure chests | Each one has a date, a price and Steam art, shown on a screen when the chest opens. |
| `buddies` | Corner survivor | GIF names from `assets/anim/`. A different one appears on every page load. |
| `strings` | All UI copy, EN + ES | Keys match `data-i18n` attributes. English is the default; Spanish only via the toggle. |

Values that will change over time:

- **Steam ratings** in the hero (98% / 96%) were taken in October 2026. Update them in `index.html` and in `strings` → `hero.*.kicker`.
- **Store links** are the official ones listed on poncle.games/vampire-survivors and /vampire-crawlers.

## Look & feel

| Element | How it's built |
| --- | --- |
| Windows, cards and screens | 9-slice pixel frames from `assets/ui/` via `border-image`: 3× for big panels, 2× for cards, 1× for small controls. Hover and selected states swap to `frame-gold.png`. Shadows use `filter: drop-shadow`, so they follow the stepped corners. |
| Screens (`.crt`) | The same pixel frame with a soft vignette and faint scanlines inside. Used for the expansion chests, the Vampire Survivors art and the featured carousel. |
| Stages | Each section has its own palette (Mad Forest, Inlaid Library, Dairy Plant, Gallo Tower, Cappella Magna, Laborratory). Its top edge is a 4px-block ordered dither (`assets/ui/dither-*.png`) in the previous section's colour, so sections melt into each other instead of being cut. |
| Nav | Transparent over the hero. After 40px of scroll it becomes a floating bar with the pixel frame. |
| Hero | Full-screen split, one half per game, each with real gameplay behind a vignette and a tinted glow. Hovering a half widens it. |
| Parade + platforms | A canvas strip at the bottom of the hero, with pixel grass tufts. The soil continues into the "Available on" strip of platform logos. |

### Typography

| Role | Font |
| --- | --- |
| Big moments (hero, game names, footer, featured titles) | **HeinzHeinrich** (local, by Stefanie Koerner / pheist, freeware). It covers accents and ñ; only `¿` and `¡` fall back to Jersey 10. Its glyphs are about 1.75× the em box, so use roughly 55% of a normal size (36–46px for big titles) and a line-height of at least 1.4. |
| Section titles | Jersey 10 |
| UI labels | Pixelify Sans |
| Numbers, timer, HUD | VT323 |
| Reading text | Rubik |

Store logos under each game always split into two balanced rows: `main.js` sets `--cols = ceil(count / 2)`, so adding or removing a store keeps the grid even.

### Layout rule

Every direct child of `.section` sits in one content lane (`--wrap: 1176px`, centred, with `--gutter` padding), so headings, grids and panels share the same left edge at every width. Don't give a section child its own horizontal margins.

## Interactions

| Feature | What happens |
| --- | --- |
| Parade (hero bottom) | Survivors auto-fight with their real starting weapons. Click or tap to strike with lightning. Kills give gold and XP, and each level adds a survivor to the party. |
| Gold | Shared across the page. It unlocks characters in Character Select. Opening chests and clicking walking cats also gives gold. |
| Crawlers hand | Hover to fan the cards; click a card to play it. |
| Expansion chests | Click a coffin: the chest pops open and its screen switches on with the expansion art. |
| Corner buddy | A different survivor appears on every load, and every so often it turns into a cat. Clicking it gives a random line (some are easter-egg hints); every 5th click starts a Gatti Amari cat invasion. |
| Footer (30:00) | XP gems rain once it scrolls into view. |
| Click empty space | Damage numbers pop up. |

## Easter eggs

Each one is a real thing from Vampire Survivors.

| Trigger | What happens |
| --- | --- |
| `↑↑↓↓←→←→BA` | **Golden mode.** Every frame turns gold and a pixel-art shine sweeps across the screen and the cards. Sprites are gilded, Gatti Amari cats and old Poes rain in the footer, and Mortaccio is unlocked (his real unlock includes the Konami code). |
| Type `rosary` | The Rosary appears in the centre, then a white flash wipes every enemy in the parade. In-game, the Rosary clears the screen. |
| Type `x-x1viiq` | The real spell that unlocks Exdash Exiviiq. The page flickers like a ghost, Exdash floats across, and he is unlocked. |
| Click the nav logo 5× quickly | **Hyper mode**: the parade runs about 1.8× faster and a HYPER badge appears by the clock. Five more clicks turn it off. |
| Poke the footer Reaper 3×, then 3× more | First he becomes **The Ender**, the Cappella Magna boss made of the Reaper, Trickster, Stalker, Drowner and Maddener. Three more pokes "settle the score with the Reaper", the real unlock condition, and **Mask of the Red Death** is unlocked. |

## Accessibility

- Animations respect `prefers-reduced-motion`.
- Sound effects are opt-in, from a toggle inside the jukebox.
- The character grid works with the arrow keys.
- The featured carousel works with ←/→ when focused.
- Icons are `aria-hidden`, and icon-only links have labels.

## Sources

- **poncle.games**: catalogue, release dates, store links, contact emails, the "Latest" list, and the gem rain, buddy GIFs and Konami homage.
- **vampire.survivors.wiki**: characters, passives, unlocks, stages, expansions, The Ender, and Crawlers cards and sprites.
- **Steam store and API**: art, screenshots, prices and review scores.
- **youtube.com/@poncle_games**: trailers and soundtrack.
- **BAFTA 2023 / Guinness World Records**: Best Game and Best Game Design; first solo-developed Best Game winner.

## Known gaps

- The jobs page `poncle1.homerun.co`, which poncle.games links to, currently returns 404. "See open roles" points to poncle.games until there's a working URL.
- Apple Arcade and Meta Quest link to poncle's FAQ pages.

## Credits

- Game names, logo, sprites and art © poncle LTD. This is a fan concept, not affiliated with or endorsed by poncle.
- HeinzHeinrich by Stefanie Koerner (pheist.net), freeware. Its web-font clause allows serving the unmodified file via `@font-face`; the license is in `assets/fonts/HeinzHeinrich-license.pdf`.
- Brand icons from Simple Icons (CC0). Trademarks belong to their owners. The YouTube and play icons are redrawn as pixel art to match the site.
- Google Fonts: Jersey 10, Pixelify Sans, VT323, Rubik (SIL OFL).
