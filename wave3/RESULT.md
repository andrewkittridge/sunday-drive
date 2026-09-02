# Sunday Drive — wave 3

Draft PR only. Not merged. Not deployed to production.

## PR

https://github.com/andrewkittridge/sunday-drive/pull/3 (draft)  
Base: `main` (clip #1 + polish #2 shipped). Head: `wave/3-weather-sky-events`.

## Thesis

Deepen the postcard without breaking the quiet. Weather and night make destinations feel alive; rare roadside moments are gifts; souvenirs are keepsakes; a11y and a thumb-safe phone HUD keep aging-gamer comfort first.

## What landed

### 1. Weather / seasons (per destination)
Signature atmosphere in `route.js` themes, rendered calmly in `scene.js`. Not a storm roulette.

| Destination | Accent |
| --- | --- |
| county, barn, harvest | Sparse autumn leaves |
| pond, lake | Cool mist sheets |
| coast | Sea haze |
| desert | Heat shimmer on the far road |
| mountain, quiet | Thin cool fog |
| town | Damp dusk + light rain |

Leaves are kite-shaped and amber, not confetti. Mist/haze use faded sheets beside the corridor. Heat haze is a low far-road shimmer. Nothing hides the wagon.

### 2. Clouds + dusk → night
- Disc clouds replaced with layered puff volumes that pick up golden-hour and moonlight.
- Full day/night cycle (slow postcard fade). Default still reads as late-afternoon gold.
- Night: indigo/slate dome, quiet moon, sparse round stars, headlights as the hero, near fog kept so the wagon stays readable.
- Capture: `?phase=0.72` for night.

### 3. Rare quiet roadside events
Mail truck (oncoming lane), deer at the shoulder, diner neon wink. One at a time, long cooldown (~80–140s after the first). No timers, banners, or taps required. Visual-first (mute still sacred). Placement respects clip-fix: deer/neon past the shoulder (`|x| ≥ 6.7`); truck sits on the asphalt. Capture: `?event=deer|mail|neon`.

### 4. Souvenir postcards
Gallery of prestiged destinations, opened from **Postcards**. Collected cards get cream paper, a simple sky+landmark still, Fraunces name, and the souvenir line. Missing slots are soft “Not yet” — no red locks. Persist is the existing souvenir count in the save (first *n* destinations). Capture: `?souvenirs=4&gallery=1`.

### 5. Accessibility
**Larger type** and **Less motion** sit next to Sound/Save, persist with the save, hit targets stay ≥48px.
- Less motion follows OS `prefers-reduced-motion` until toggled; cuts cabin sway, cloud drift, leaf/rain rates, and the Drive camera nudge. Fog/light stay.
- Larger type is one step up for miles, Drive, and upgrades.

### 6. Mobile (same PR)
- Portrait: stacked HUD, miles + full-width Drive at the thumb, **The car** collapsed so upgrades do not cover the road.
- Open panel is a bottom sheet; Drive stays on screen; upgrades scroll.
- Landscape: compact two-column, not broken.
- `viewport-fit=cover` + safe-area padding. Canvas `pointer-events: none` / `touch-action: none` so scroll does not fight the road. Hover styles gated to `(hover: hover)`. Coarse pointers get “Tap Drive”.

## Clip-fix / cozy invariants

Held: hill corridor `|x| ≥ 12`, roadside clamp `|x| ≥ 6.7`, road `y = 0.08` + `polygonOffset`, camera `near = 0.6`. Mute is still **M** + Sound on/off. Idle economy unchanged.

## Evidence

Before: `wave3/evidence/before/` (desktop HUD/scene, mobile portrait/boot/landscape).  
After: `wave3/evidence/after/`

- `hud-county.png` — new chrome, volume clouds, leaves
- `scene-county.png` / `scene-harvest.png` / `scene-pond.png` / `scene-desert.png` — weather accents
- `scene-night.png` — moon, stars, headlights
- `event-deer.png` / `event-mail.png` / `event-neon.png`
- `gallery.png` / `large-type.png`
- `mobile-portrait.png` / `mobile-panel.png` / `mobile-boot.png` / `mobile-landscape.png`

`npm run build` succeeded after the pass.

## Unfinished

- Postcard art is CSS stills, not rendered 3D snapshots.
- Deer is a readable low-poly silhouette, not a sculpted animal.
- Heat haze is a suggestion on the vanishing point, not refraction.
- Night stars are sparse points, not a milky way.
- Open-car sheet on a short phone still has to share height with Drive; upgrades scroll.
- Designer eye-check vs `wave3/mood-*.png` is still pending.

## Out of scope

- Merge to `main`
- Production deploy
- Force-push
