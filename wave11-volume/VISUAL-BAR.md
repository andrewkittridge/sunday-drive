# Sunday Drive. Wave 11 volume visual bar

Owner: Designer. Audience: Engineer. Status: **locked**
Base: live `main` @ `3b494c4` (wave 10 Air). Branch: `wave/11-volume`
Viewports: desktop **1280×800**. Phone **390×844**.

---

## Thesis

The postcard is a painted volume, not a toy diorama. Destination palette stays identity. Shapes must melt into Air.

## 1. Day still (`?phase=0.47`, HUD off)

- Hill crowns fade into peach air. No hard elliptical cap against the sky.
- Clouds are layered atmosphere with soft edges. Not four cotton-ball stickers.
- Wagon reads as a cream wood-panel station wagon in one second. Rounded cabin. Wood sides. Wheels on asphalt.
- Road is gray-brown asphalt with a thin center dash and a sun kiss. Not a black void.
- Grass recedes. Fence stays at the shoulder. One barn hero.

## 2. Night still (`?phase=0.72`, HUD off)

- Indigo air. Moon is a small disc in a soft halo, not a gray donut.
- Cookie pool sits on the road ahead of the bumper. Fill does not flatten the wagon.
- Stars are pinpoints. No leaves across the moon.

## 3. Deer still (`?event=deer`)

- Deer stands at the shoulder, about fence-high, not barn-high.
- Legs, neck, cream rump. Reads as a deer in one second.
- Clip-safe `|x| >= 6.7`. Drive never blocked.

## 4. HUD stills (desktop 1280, phone 390)

- Wave 8 hierarchy. Destination, miles, Drive, The car, Menu.
- Phone keeps Drive in the thumb zone and the short sheet.
- Paper chrome stays quieter than the postcard. No FOMO.

## Preferred build order (one draft PR)

1. Capture lever + baseline
2. Terrain melt
3. Volume clouds
4. Road light
5. Wagon silhouette
6. Deer scale and silhouette
7. Sky and night disc
8. HUD hold

Evidence: `wave11-volume/evidence/before|after/`
Rerun: `node wave11-volume/capture.mjs`

## Hard no

- EffectComposer bloom soup, FOV pump, arcade shake
- New destinations, HUD redesign, extracting `src/air.js`
- Exporting Air, DECK, or `cycleAt`
- Changing mute or Less motion
- Undoing wave 7–9 phone
- Merge without Andrew yes
