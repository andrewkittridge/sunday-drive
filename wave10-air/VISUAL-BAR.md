# Sunday Drive. Wave 10 Air visual bar

Owner: Designer. Audience: Engineer. Status: **draft only**
Base: live `main` @ `958547a` (wave 8 UI). Branch: `wave/10-cozy-air`
Viewports: desktop **1280×800**. Phone **390×844**.

---

## Thesis

The postcard is one Air. Destination palette stays identity. Glow, disc, and fog cannot disagree.

## 1. Day still (`?phase=0.47`)

- Clouds recede and melt. They are not stickers on the sky.
- Horizon is one ribbon. Fog starts in the mid-ground. The wagon stays clear.
- Shadows match a low sun. Key y-floor is 5.2, not a noon shelf.
- Tire bottoms sit on asphalt. Cookie does not pitch into the road.
- One barn and windmill hero. Grass reads the county destination.

## 2. Night still (`?phase=0.72`)

- Indigo air. Cookie on the road. Fill does not flatten the wagon.
- No brown CSS hoop. Vignette follows `--air-night`. Grain stays 0.04.
- No leaves across the moon.

## 3. HUD still (`desktop-1280.png`)

- Wave 8 hierarchy. Destination, miles, Drive, The car. Menu. No `--horizon` on `--paper`.

## Preferred build order

1. Air. `scoreAir` then `paintAir`. Capture day and night.
2. Clouds. Road-depth fade, distinct Z, recycle Z.
3. Deck. `restY`, cookie reparent, kiss 11, width 8.6.
4. Hero. One `HERO_SLOT`. `barns` is one farm group. Spin mill blades. Gate leaves.
5. Veil. `--air-night` on `.vignette`.

Evidence: `wave10-air/evidence/before|after/`
Rerun: `node wave10-air/capture.mjs`

## Hard no

- EffectComposer, bloom, FOV pump, volume clouds, gobo, cabin interior
- New destinations, HUD redesign, extracting `src/air.js`
- Exporting Air, DECK, or `cycleAt`
- Changing mute or Less motion
- Merge without Andrew yes
