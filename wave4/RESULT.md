# Sunday Drive — wave 4

Draft PR only. Not merged. Not deployed to production.

## PR

https://github.com/andrewkittridge/sunday-drive/pull/5 (draft)  
Base: `main` @ `4b5fac1` (wave 3 + audio). Head: `wave/4-cozy-visual`.

## Thesis

Cozier feel, not new content. Deepen the golden-hour postcard and cabin calm — cloud volume, a deer that reads in 1s, material/light depth, short-phone sheet clearance. Still Melvor / A Short Hike quiet. Still one Drive.

## What landed

### 1. Cloud volume puff
Replaced pancake ovals with **four layered puff masses** (stacked spheres, wrap-lit shader). Day/dusk: peach–amber rims and warm undersides. Night: soft slate volumes with moonlight. Drift stays gentle; **Less motion** still cuts intensity. Restraint: 2–4 readable masses, never a storm wall.

### 2. Deer silhouette read
Low-poly deer at the shoulder (`|x| = 8.25 ≥ 6.7`): elongated body, jointed legs, neck, snout, ears, branching antlers, cream rump. Gift only — no banner, timer, tap, or EVENT chrome. Long cooldown, max one moment. Capture: `?event=deer`.

### 3. Material / light depth
- **Wagon:** lighter cream body vs taller wood sides + wood tailgate vs blue-grey glass. Stronger contact shadow.
- **Road:** darker asphalt that takes a soft **headlight kiss** at dusk/night; dashes stay crisp; `polygonOffset` held.
- **Fog:** near pulled back so the wagon stays hero; far kept so hills melt. No bloom, no FOV pump, no shake.

### 4. Short-phone sheet vs Drive
Open **The car** is a shorter bottom sheet (`max-height: min(22vh, 10.5rem)`, shorter on short phones) with internal scroll. Miles hide while the sheet is open so the wagon roof/horizon stay in view. **Drive** stays planted in the thumb zone (`min-height: 4.4rem`, ≥48px). Collapsed default and landscape two-column still stand. Capture: `?panel=1` at ~390×844.

## Clip-fix / cozy invariants

Held: hill corridor `|x| ≥ 12`, roadside clamp `|x| ≥ 6.7`, road `y = 0.08` + `polygonOffset`, camera `near = 0.6`. Mute is still **M** + Sound on/off. Larger type, Less motion, and audio beds untouched. Idle economy unchanged.

## Evidence

Before: `wave4/evidence/before/`  
After: `wave4/evidence/after/`

- `desktop-day.png` — volume clouds, wagon wood/cream/glass
- `desktop-night.png` — slate clouds, moonlight, near-clear wagon, headlight kiss
- `event-deer.png` — deer at the shoulder
- `materials-close.png` — HUD + wagon/road/fog
- `mobile-panel.png` — 390×844, sheet open, Drive planted, wagon roof visible

Bar: `wave4/VISUAL-BAR.md` + `mood-clouds.png` / `mood-deer.png` / `mood-materials.png` / `mood-phone-sheet.png`.

`npm run build` succeeded after the pass.

## Unfinished

- Deer is a readable low-poly silhouette, not a sculpted animal.
- Clouds are stylized puff clusters, not simulated volume.
- Headlight kiss is a point + spots on Phong asphalt, not a projected cookie.
- Open-car sheet on a short phone still shares the bottom with Drive; upgrades scroll.
- Designer eye-check vs `wave4/mood-*.png` is still pending.

## Out of scope

- Merge to `main`
- Production deploy
- Force-push
- FOMO timers, new destinations, idle rewrite
