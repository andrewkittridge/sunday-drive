# Sunday Drive — wave 5

Draft PR only. Not merged. Not deployed to production.

## PR

Draft against `main` @ `94c58a0` (wave 4). Head: `wave/5-atmosphere`.

## Thesis

Atmosphere is the drive. Deepen light, fog, sky, and cabin calm until leaving the tab open feels like a Sunday. Cozy aura / Melvor / A Short Hike quiet. Not more systems.

## What landed

### 1. Sky + light
Golden-hour is the default hero again. Day/dusk/night used Three's `(x, min, max)` smoothstep as if it were GLSL, so afternoon mixed as night (stars in “day,” muddy brown air). Lighting now uses a true inverse falloff: late-day is warm key and soft hemi, dusk paints fog and cloud undersides, night is an indigo dome.

Volume clouds stay at four masses. Wrap-light is peach/amber by day and moonlight slate at night. Horizon glow is a thin band, not an orange wall. Night moon is quiet; stars are sparse. **Less motion** still cuts drift.

### 2. Fog depth
Near pulled back so the wagon stays the hero (`near` ~64–78). Far tightened so hills melt into the postcard (`far` ~130–152). Destination fog tints shift gently with theme and pick up a little sky-bottom so they read as air, not a fill. Mist sheets are quieter, narrower, and seated off the paved corridor (`|x| ≥ 12`) so they never hide the road or clip-safe props.

### 3. Road + wagon light
Dusk/night headlight kiss is a short pool on the asphalt (spot + point + one additive plane) — not stadium beams. Contact shadow is softer and a little larger. Wood / cream / glass contrast from wave 4 is held and warmed. Road Phong spec answers the kiss. **No bloom soup, no FOV pump, no shake.** Camera stays FOV 50.

### 4. Cabin calm
Rear glass is a warm tint with a soft interior fill and a whisper glow card behind the hatch — a quiet cocoon, not a second scene. Tiny dust motes drift in the headlight cones at dusk/night; **Less motion** turns them off. No passengers, dogs, lanterns, or new UI. HUD stays quiet cream-on-walnut (vignette/grain a little quieter so the air can read).

## Clip-fix / cozy invariants

Held: hill corridor `|x| ≥ 12`, roadside clamp `|x| ≥ 6.7`, road `y = 0.08` + `polygonOffset`, camera `near = 0.6`. Mute is still **M** + Sound on/off. Larger type, Less motion, and audio beds untouched. Idle economy and destinations unchanged.

## Evidence

Before: `wave5/evidence/before/`  
After: `wave5/evidence/after/`

- `desktop-day.png` — golden-hour key, peach cloud wrap, wagon hero, hills melt
- `desktop-night.png` — indigo dome, quiet moon, sparse stars, slate clouds, cabin glow, soft kiss
- `materials-close.png` — HUD cream-on-walnut + wagon/road/fog
- `mobile-idle.png` — 390×844 idle; Drive planted; Sound / Larger type / Less motion present

Captures: `?capture=1&hud=0&shot=county&phase=0.47` (day) and `phase=0.72` (night).

Bar: `wave5/VISUAL-BAR.md` + `mood-aura-day.png` / `mood-aura-night.png` / `mood-cabin.png`.

`npm run build` succeeded after the pass.

## Unfinished

- Sky is still a two-color dome plus a horizon band, not a photographed golden hour.
- Headlight kiss is lights + a gradient plane, not a projected cookie.
- Cabin glow is a tinted hatch and a fill, not an interior scene (by design).
- Designer eye-check vs `wave5/mood-*.png` is still pending.

## Out of scope

- Merge to `main`
- Production deploy
- Force-push
- FOMO timers, new destinations, idle rewrite
