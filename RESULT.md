# Sunday Drive — backlog result

Draft only. Not committed, not deployed.

## Local URL

**http://127.0.0.1:5173/**

Vite is already running with `--host 127.0.0.1 --port 5173` (HTTP 200).

## How to run / restart

```bash
cd /workspace/sunday-drive
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Then open **http://127.0.0.1:5173/** (Vite will pick the next free port if 5173 is taken and print it).

Production check (succeeded):

```bash
npm run build
```

## File paths

| Path | Role |
| --- | --- |
| `/workspace/sunday-drive/index.html` | Shell, HUD, save-file control |
| `/workspace/sunday-drive/src/main.js` | Input, modals, toasts, save import/export |
| `/workspace/sunday-drive/src/game.js` | Miles, upgrades, prestige, save schema |
| `/workspace/sunday-drive/src/scene.js` | Three.js road, wagon, headlights, day/dusk |
| `/workspace/sunday-drive/src/route.js` | Per-destination palettes, landmarks, props |
| `/workspace/sunday-drive/src/audio.js` | Procedural mixtape + mute |
| `/workspace/sunday-drive/src/style.css` | Large-type overlay |
| `/workspace/sunday-drive/package.json` | Vite + `three` |
| `/workspace/sunday-drive/README.md` | Run instructions |
| `/workspace/sunday-drive/SPEC.md` | Original spec |

Save key: `sunday-drive-save-v1` in `localStorage`. Spare copies via **Save file**.

## What landed (backlog 1–5)

### 1. Distinct destinations on prestige
Each destination now has its own sky, fog, horizon tint, grass, and landmark silhouette. Prestige is no longer a label swap.

| Destination | Landmark | Roadside | Palette |
| --- | --- | --- | --- |
| The county line | barn | fence | golden hour |
| Miller's Pond | pond + dock | reeds | cool water |
| Red barn overlook | barns + silo | fence | terra / maple |
| The next town over | diner | lamps, mailboxes | town dusk |
| Coastal two-lane | lighthouse | dunes | sea haze |
| Harvest road | silo | hay | gold wheat |
| Mountain pass | rocks | pines | cooler slate |
| Lakeside loop | dock + boat | reeds | blue-green |
| Desert stretch | mesa | sage | sand |
| Somewhere quiet | chapel | sparse posts | pale dusk |

Headless Chrome confirmed 10 unique looks (landmark / extras / grass / fog).

### 2. Car + road juice
Wood-panel wagon (still low-poly, readable): grille, mirrors, roof rails, hubcaps, antenna. Headlights are emissive lamps plus forward spotlights that come up at dusk. More recycled roadside props: tufts, rocks, wildflowers, road signs, plus destination extras.

### 3. Real mixtape audio
Procedural Web Audio loops (pad / melody / tape hiss) keyed by destination and mixtape upgrade tier. Cabin rumble stays quiet underneath. **M** and **Sound on/off** mute immediately; gain stays at 0 while muted; no one-shots after mute; audio still waits for a gesture.

### 4. Soft balance + toasts
Early upgrades are cheaper and pay a little more. First prestige is 5,000 trip miles; souvenir bonus is 0.15× each so prestige still matters. Big readable toasts for offline return, upgrade unlocks, first purchases, odometer marks, destination reached, and prestige. No timers, no FOMO countdowns. Offline catch-up modal is still honest (30-day cap on earnings, full time away shown).

### 5. Clean save / export
**Save file** opens a backup modal: download JSON, copy to clipboard, choose a file, or paste. Import validates schema and asks before replacing the current trip. Bad paste / bad file leaves the current save alone.

## Smoke

Headless Chrome against **http://127.0.0.1:5173/**:

- Mute button and **M** toggle `Sound on` / `Sound off`; audio master follows
- Save file modal has Download a copy + paste import
- Prestige looks: 10 destinations, 10 unique visual signatures
- `npm run build` succeeds
- Page HTTP 200

## What's unfinished

- Car is a better low-poly wagon, not a detailed model
- Mixtape is procedural, not licensed songs
- Destinations wrap after ten roads
- No reset-all besides prestige (by design)
- Out of scope as specified: accounts, ads, IAP, mobile store, multiplayer
