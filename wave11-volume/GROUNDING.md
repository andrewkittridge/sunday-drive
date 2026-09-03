# Wave 11 grounding

How the visual world works after wave 10 Air. Facts from `src/scene.js` and `src/route.js` on `main` @ `3b494c4`.

## Public surface

`createWorld(canvas)` returns `{ applyRoute, update, render, getLook, setPhase, setTime, forceEvent }`. Air, DECK, and `cycleAt` stay private.

## Air

`scoreAir(palette, phase, out)` writes one `Air` sample per frame. `paintAir(stage, air)` is the only writer of lights, fog, sky uniforms, cloud uniforms, grass tint, road specular, wagon lamps, cookie, cabin, and emissives.

`DECK` holds clip-safe and seating knobs. Fog near/far live there. `meltAgree` (0.58) mixes fog toward glow.

Day capture uses `?phase=0.47`. Night uses `?phase=0.72`. Deer uses `?event=deer`.

## What the stills still show

`wave10-air/evidence/after/desktop-day.png` is a toy diorama.

- Hills are `SphereGeometry` scaled `(1.75, 0.34, 1.15)`. Crowns cut the sky as hard ellipses. `addHill` in `src/scene.js`.
- Clouds are 11 scaled puff spheres per lane, 4 lanes. The puff shader lights a sphere, so each mass reads as a cotton ball sticker.
- The wagon is stacked `BoxGeometry` in `createCar`. Wood is a 128px repeating canvas. It reads as a crate, not a woodie.
- Deer is `createDeer()` then `scale.setScalar(2.18)` at `x = ±7.55`, `z = -3.55`. It fills the right third of the frame and reads as a toy horse.
- Road texture fills `#3b3d42` and photographs almost black. Center dash is 10px on a 256 map.
- Moon is a white sphere plus a gray halo sphere. Night still looks like two discs.
- County leaves are `ShapeGeometry` meshes. In the still they read as bright squares in the air.

## Invariants to hold

- Hill inner `|x| >= 12`. Roadside `|x| >= 6.7`. Road `y = 0.08` plus `polygonOffset -2`. Camera near `0.6`. FOV 50. One `renderer.render`.
- Mute is **M**. Less motion cuts juice (cloud X drift, leaf spin), not Air.
- Wave 8 HUD: destination, miles, Drive, The car, Menu. Wave 7–9 phone sheet and safe-area stay.
- Ten destinations. No new save schema. No FOMO. No EffectComposer bloom soup. No FOV pump.
- Do not export Air, DECK, or `cycleAt`. Do not extract `src/air.js`.

## Caller usage that must keep working

```js
const world = createWorld(canvas);
world.applyRoute(destId);
world.setPhase(0.47);
world.forceEvent('deer');
world.update(dt, { speed, reducedMotion, driving });
world.render();
const look = world.getLook(); // night feeds --air-night
```
