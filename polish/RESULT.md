# Sunday Drive — AAA indie polish

Draft PR only. Not merged. Not deployed to production.

## PR

https://github.com/andrewkittridge/sunday-drive/pull/2 (draft)  
Base: `fix/landscape-road-clip` (stacks on #1). Head: `polish/aaa-indie`.

## Thesis

Quiet golden-hour postcard you leave running. Cozy idle — polish is atmosphere and fidelity, not clutter.

## What landed per layer

### 1. Atmosphere
- Fog with depth: near ~38–46 so the wagon stays readable; far ~168–186 so hills melt into the horizon.
- Sun sits on a horizon arc (not stuck overhead). Dusk warms the *horizon* more than the zenith, so the sky keeps a peach-to-cool gradient instead of an orange wall.
- Soft radial contact shadow under the wagon. Directional fill so the woodie reads at dusk.
- Headlamp spots plus a short bumper light that kiss the asphalt as dusk comes up — not stadium beams.
- No bloom, no flare. Grain + vignette stayed whisper-quiet (slightly quieter than before).
- Shadow map still 1024; PCF soft; small bias so contact doesn’t muddy the ground.

### 2. Road / car fidelity
- Clip-fix held: hill corridor `|x| ≥ 12`, roadside clamp `|x| ≥ 6.7`, road `y = 0.08` with `polygonOffset`, camera `near = 0.6`.
- Cleaner asphalt (warmer gray, wheel paths, white edge lines, dashed yellow). Phong spec is low so headlights can kiss the road.
- Wagon is still low-poly, but it reads as a woodie: cream paint, wood side/tail panels, hatch glass, roof rails, hubcaps, antenna, chrome bumpers, vertical tail lamps.

### 3. Roadside postcard
- Fence *runs* with rails instead of a post forest.
- County hero: red barn with white X doors + a windmill. Sparse trees.
- Prop counts cut (trees, tufts, rocks, flowers, signs, extras). One landmark in the typical frame, a second further on.
- Destinations still change palette + one landmark: barn, pond, diner, lighthouse, silo/hay, pines/rocks, mesa.

### 4. HUD calm
- Hierarchy: destination title → big miles → Drive → upgrades. Rate/trip and souvenir sit quieter.
- Upgrade panel is a slightly stronger paper card; toast fades in; no bounce/confetti.
- Live names kept: Tires, Mixtape, Diner, Thermos, Cruise Control, Autopilot Playlist.
- Aging-gamer type sizes and 48px hit targets stayed.

### 5. Camera
- Smooth lerp follow. Drive impulse only nudges the camera (~0.2 m), no FOV pump, no whip-pan.
- Framing: wagon in the lower third, road vanishing into hills.

### 6. Audio
- Procedural mixtape unchanged. Cabin rumble / wind swell a little with Drive.
- **M** and **Sound on/off** still zero the master gain. Capture/screenshot mode does not persist mute.

### 7. Perf
- Fewer meshes on the roadside. No post stack. Pixel ratio still capped at 2.
- `npm run build` succeeded after the pass.

## Evidence

Before:

- `polish/evidence/before-road-idle.png`
- `polish/evidence/before-live-overview.png`
- Moods: `polish/mood-light.png`, `mood-car-road.png`, `mood-hud.png`

After:

- `polish/evidence/after/after-road-idle.png` — HUD idle, county
- `polish/evidence/after/after-live-overview.png` — same framing as the live overview
- `polish/evidence/after/hud-county.png`
- `polish/evidence/after/hud-county-after-drive.png`
- `polish/evidence/after/scene-county.png`
- `polish/evidence/after/scene-county-after-drive.png` — recycled scenery, road still clear
- `polish/evidence/after/scene-pond.png`
- `polish/evidence/after/scene-barn.png`
- `polish/evidence/after/scene-town.png`
- `polish/evidence/after/scene-coast.png`
- `polish/evidence/after/scene-harvest.png`
- `polish/evidence/after/scene-mountain.png`
- `polish/evidence/after/scene-desert.png`

## Unfinished

- Wagon is a better low-poly woodie, not a detailed mesh (no wheel wells, no real chrome env).
- Clouds are still simple discs.
- Pond / diner landmarks are readable but still modest.
- Day/dusk cycle is a slow arc; not a scripted postcard lock besides the default golden-hour start.
- Mixtape remains procedural.
- No new destinations or systems (Content skipped on purpose).
- Did not merge, deploy, or force-push `main`.
