# Sunday Drive — visual bar (AAA indie polish)

Owner: Designer · Audience: Engineer polish wave · Status: **draft only**  
Depends on: landscape/road clip draft PR (`docs/clip-fix/`) first.  
Live today: https://sunday-drive-ten.vercel.app · Local: `/workspace/sunday-drive/`

Evidence of current craft: `polish/evidence/before-road-idle.png`, `before-live-overview.png`.  
Mood targets: `mood-light.png`, `mood-car-road.png`, `mood-hud.png`.

---

## Thesis

Sunday Drive should feel like a **quiet golden-hour postcard you leave running** — soft light, a lovable wagon on a real road, sparse roadside that means something, and a HUD that never shouts. Polish is atmosphere and fidelity. Polish is **not** clutter, FOMO, loot noise, or busy VFX.

Identity: cozy idle for aging / returning gamers (Melvor / Egg Inc. calm). One clear Drive action. Miles while away. Prestige = new countryside, not a new UI costume.

---

## Lighting & atmosphere

- **Golden hour is the default hero.** Warm key (`#ffd4a0` family), soft hemi fill, dusk that actually changes the fog color (already in `route.js` themes — push the *feel*, not just hex swaps).
- **Fog with depth:** near clear enough to read the car; far soft enough that hills melt into horizon. Avoid flat solid fill that kills distance.
- **Soft shadows under the car and roadside** (PCF soft already on — make contact readable without muddy ground).
- **Headlights at dusk** should kiss the asphalt and a little grass — not stadium spots, not invisible.
- **Restraint:** no bloom soup, no lens-flare spam, no god-ray overload. One soft bloom or none.
- **Grain + vignette** stay whisper-quiet (current CSS is close — don’t crank).

## Car & roadside

- Wagon should read as a **character**: wood panel, cabin glass, hubcaps, antenna — still low-poly OK, but silhouette + materials beat “beige box.”
- **Road first:** clean asphalt, center dashes, edge that doesn’t z-fight grass. After clip-fix: landmarks/props **beside** the road, never through it.
- Roadside is **sparse punctuation** — barn, fence, reeds, lamp, mailbox — 1–3 readable heroes in frame, not prop salad.
- Destination themes (barn / pond / diner / lighthouse / harvest / pass / lake / desert / chapel) should be recognizable in 2 seconds from palette + one landmark.
- Motion juice (subtle): wheel spin, tiny cabin sway, headlight glow — never nausea, never arcade shake.

## Camera

- Smooth third-person follow behind the wagon; horizon stable.
- No whip-pan, no FOV pumping on Drive clicks.
- Framing: car lower-third, road vanishing into hills — postcard crop.

## HUD calm

- Keep **Fraunces + Atkinson** / cream-on-walnut palette (`style.css` tokens).
- Hierarchy: destination title → big miles → Drive → upgrades. Everything else quieter.
- Drive button: warm terra, large hit target — primary, not neon arcade.
- Upgrade panel: paper card, readable type, short flavor lines — no badges, streaks, or red urgency.
- Motion: soft number ticks / toast fades only. No bouncing icons, no confetti.
- Aging-gamer bar: high contrast cream on dark paper; don’t shrink type for “minimal.”

## Perf (visual budget)

- Target stable ~60 FPS mid laptop.
- Prefer baked/simple materials + fog over heavy post stacks.
- Shadow map already 1024 — don’t jump to 4K maps for polish vanity.

---

## Safe / Feel wave (prefer order)

1. **Atmosphere:** fog depth + dusk lerp feel + soft car contact shadow + restrained exposure.
2. **Road/car fidelity:** clip-fix held; asphalt/edge read; wagon material contrast (wood vs body vs glass).
3. **Roadside postcard:** 1 landmark + few props correctly grounded; no clipping.
4. **HUD calm pass:** spacing, type scale, quieter secondary chrome; toast softness.

Skip Content (new destinations, new systems) until Safe/Feel reads AAA-cozy.

---

## Hard no

- Clutter / FOMO timers / lootbox / streak guilt UI
- Merge / prod deploy / force-push without Andrew yes
- Rewriting the idle loop or save schema for “visuals”
- Loud bloom, screen shake, arcade HUD
- Blocking on perfect car meshes — readable low-poly with good light wins first

---

## Handoff

Engineer owns implementation + draft PR after clip-fix lands.  
Designer owns this bar + mood stills; eye-check after frames vs moods when PR is up.  
Bring Jarvis: PR URL + before/after paths. Draft only.

## Mood note
Mood stills are **feel targets**, not literal UI copy or a new upgrade list. Keep tires / mixtape / diner / thermos naming from the live game.
