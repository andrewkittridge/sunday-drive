# Sunday Drive — audio pass (draft PR)

Repo: andrewkittridge/sunday-drive. Base: `main` @ latest (wave 3 shipped, ~06cf6bf).
Live: https://sunday-drive-ten.vercel.app

**Draft only.** No merge to main. No production deploy. No force-push.

## Goal
Calm car sounds + a good chill lo-fi soundtrack for aging-gamer Sunday drive energy.

## Implement
1. **Soft car ambience** — engine idle / road hush. Cozy, not racing or sporty. Low level under the music.
2. **Chill lo-fi soundtrack** — loop-friendly, low-key, warm. Prefer real royalty-free / clear-license audio files over pure oscillators if quality is better; procedural OK as fallback if you cannot land licensed assets.
3. **Mute sacred** — existing Sound toggle + `M` must mute *all* audio (music + car). Default volume gentle. Easy on/off; optional simple volume if cheap without clutter.
4. **A11y** — respect Less motion / `prefers-reduced-motion` where it affects audio motion (no frantic FX). Do not invent FOMO sound stings for roadside events.
5. **Licenses** — only royalty-free / clear-license assets. Document source, license, URL in `audio-pass/LICENSES.md` (and short note in PR body). Commit assets under `public/audio/` or equivalent.
6. Keep cozy idle identity. Clip-fix / wave3 HUD untouched unless audio UI needs a tiny Sound control tweak.

## Deliver
1. Branch e.g. `audio/car-and-lofi`
2. Implement + `npm run build` OK
3. Draft PR + `audio-pass/RESULT.md` (PR URL, mute/volume behavior, asset licenses, unfinished)
4. Optional: short note or spectrogram/screenshot of Sound UI; no need for video unless easy

## Hard no
- Copyrighted tracks without license
- Loud defaults, racing engine, arcade SFX spam
- Breaking mute
- Merge / prod deploy
