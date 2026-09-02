# Sunday Drive — wave 8 UI chrome

Draft PR only. Not merged. Not deployed to production.

## PR

https://github.com/andrewkittridge/sunday-drive/pull/10 (draft)  
Base: `main` @ `e79031f` (wave 7). Head: `wave/8-ui-chrome`.

## Thesis

Postcard owns the viewport. Chrome answers one question in one glance: **Drive.** Destination → miles → Drive → The car. Comfort controls collapse into one Menu. Hold w7 mobile gains. No FOMO.

## What landed

### 1. Collapse comfort chrome → Menu
Sound / Save file / Postcards / Larger type / Less motion are no longer five equal top-row ghosts. One quiet **Menu** control (word + hamburger) sits in the top-right. The panel lists those five items. **Mute stays sacred:** **M** still toggles with the menu closed; Sound on/off is the labeled item inside Menu. Larger type and Less motion stay reachable in Menu and persist as today. Save file and Postcards still open their existing modals (menu closes first). Escape closes Menu. Capture: `?menu=1`.

### 2. Promote hierarchy
Read order is **destination → miles → Drive → The car**. Destination is the display line; the Sunday Drive wordmark is quieter. Miles stay the big number. **Drive** is the sole primary (≥48px; Space / click), cream-on-walnut. **The car** is one clear toggle into upgrades, collapsed by default on desktop and portrait phone. Rate / trip / souvenir stay whisper-quiet.

### 3. Desktop canvas breathing room (~1280 / ~1440)
The right-hand upgrades column no longer sits on the postcard by default. Menu is a single chip. When The car is open the panel overlays the right; Drive stays planted. Extra HUD inset at 1400px+. Road, wagon, and air fill the frame. Capture: 1280×800 and 1440×900, plus `?panel=1`.

### 4. Phone holds w7 gains
No comfort-row re-stack. Portrait keeps safe-area padding, destination-first topbar, The car above the odometer, Drive planted in the thumb zone, short sheet with Hide in the header, and Larger type without wrapping Drive. Landscape stays two-column calm: upgrades on the right, Drive under them, miles bottom-left, Menu instead of a button salad. Capture: 390×844 collapsed + sheet; short ~667 sheet; landscape 844×390; optional Larger type.

## Clip-fix / cozy invariants

Held: hill corridor `|x| ≥ 12`, roadside clamp `|x| ≥ 6.7`, road `y = 0.08` + `polygonOffset`, camera `near = 0.6`, FOV 50. Mute is still **M** + Sound on/off. Larger type, Less motion, and audio beds untouched. Idle economy and destinations unchanged. Cookie/deer not touched. No FOMO copy.

## Evidence

Before: `wave8-ui/evidence/before/`  
After: `wave8-ui/evidence/after/`

- `desktop-1280.png` / `desktop-1440.png` — quiet chrome, postcard hero, Menu + Drive, The car collapsed
- `phone-390.png` — Menu + Drive; no comfort row stack
- `desktop-1280-menu.png` / `phone-390-menu.png` — optional; Menu open (Sound / Save / Postcards / a11y)
- `desktop-1280-car.png` — optional; The car open, Drive planted
- `phone-390-sheet.png` / `phone-short-667.png` / `phone-landscape.png` / `phone-390-large-type.png` — w7 hold

Bar: `wave8-ui/VISUAL-BAR.md` + `mood-ui-desktop.png` / `mood-ui-phone.png` (layout feel only; live copy/economy/wagon kept).

`npm run build` succeeded after the pass.

## Unfinished

- Designer eye-check vs `wave8-ui/mood-*.png` is still pending (moods invent coastal titles and a full-width Drive bar; live camera and copy kept).
- Desktop Hide stays with the The car toggle (label swaps to Hide) rather than jumping into the overlay header.
- Keyboard legend inside Menu is still ship-next.

## Out of scope

- Merge to `main`
- Production deploy
- Force-push
- FOMO timers, streaks, EVENT chrome
- New destinations / idle rewrite / save-schema
- Soft w6 cookie/deer
- Soft w7 real-device safe-area glance
