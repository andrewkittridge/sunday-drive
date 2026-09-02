# Sunday Drive — wave 3 (draft PR)

Repo: andrewkittridge/sunday-drive. Base: latest `main` (clip+polish shipped).
Live: https://sunday-drive-ten.vercel.app

Draft only. No merge to main. No production deploy. No force-push.

## Implement (Jarvis-locked)
1. **Weather/seasons per destination** — rain mist, autumn leaves, heat haze. Calm, not chaotic. Tie to destination themes in `route.js` / scene.
2. **Better clouds + fuller dusk→night sky** — replace disc clouds; richer sky transition into night.
3. **Rare quiet roadside events** — mail truck, deer, diner neon. Low frequency. No FOMO timers / countdowns.
4. **Souvenir gallery / postcard** — gallery of each finished (prestiged) destination; persist with save.
5. **Accessibility** — reduce-motion toggle + larger-type toggle; respect preferences; persist.

## Hard constraints
- Cozy idle identity (Melvor / Egg Inc. calm). Mute sacred (M + button).
- Keep clip-fix invariants: hills outside road corridor, props past shoulder, road y + polygonOffset.
- Smallest coherent wave — not a rewrite. `npm run build` must pass.

## Designer bar (optional)
If present, use `/workspace/sunday-drive/wave3/VISUAL-BAR.md` + moods. Don’t block waiting for it.

## Deliver
1. Branch e.g. `wave/3-weather-sky-events`
2. Before screenshots → `wave3/evidence/before/`
3. Implement + after → `wave3/evidence/after/`
4. Draft PR + `wave3/RESULT.md` (PR URL, what landed, unfinished)

## Mobile design (Andrew add-on — same draft PR)
Fold into this PR; no separate ship.
- Thumb-safe Drive control: large hit target, bottom-friendly
- Stacked / collapsible HUD on narrow viewports — miles + Drive primary; upgrades must not cover the road
- Readable type + safe-area insets (notch / home indicator)
- Touch: no hover-only UX; scroll/drag must not fight the canvas
- Portrait first; landscape not broken
Capture mobile before/after frames (narrow viewport ~390×844) in wave3/evidence/before|after/mobile-*

## Designer bar (confirmed)
Read `/workspace/sunday-drive/wave3/VISUAL-BAR.md` and moods: mood-weather, mood-night, mood-moment, mood-postcard, mood-mobile.
Prefer order: sky/night → weather → rare moments → postcards → reduce-motion/larger-type → mobile portrait (same PR).
Moments are gifts not chores. Postcard mood is feel-only. Mute + clip-fix sacred.

## Designer mobile extension (same PR)
Re-read `/workspace/sunday-drive/wave3/VISUAL-BAR.md` for the mobile portrait section.
Use `wave3/mood-mobile.png` when present.
Thumb Drive, stacked HUD, upgrades must not cover the road. Portrait-first.

## Mobile bar §6 (Designer — same PR)
Thumb Drive ≥48px in lower thumb zone. Stacked HUD. Upgrades/garage as bottom sheet or drawer that stops below horizon — never covers road/wagon. Phone portrait first. Evidence: wave3/evidence/*/mobile-* at ~390×844.
