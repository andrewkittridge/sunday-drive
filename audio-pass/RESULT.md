# Sunday Drive — audio pass

Draft PR only. Not merged. Not deployed to production.

## PR

https://github.com/andrewkittridge/sunday-drive/pull/4 (draft)  
Base: `main` (wave 3 shipped, `06cf6bf`). Head: `audio/car-and-lofi`.

## Thesis

A quiet cabin and a real chill lo-fi tape under the miles. Mute still sacred.

## What landed

### 1. Soft car ambience
Loop-trimmed interior idle (`public/audio/cabin.mp3`) sits low under the music. A quieter interior-road bed (`public/audio/road.mp3`) eases up a little with Drive, then settles. Family-car idle, not a sports exhaust. Fallback oscillators only play if the files fail to load, and they fade out once the cabin loop is running.

### 2. Chill lo-fi soundtrack
HoliznaCC0 *Calm Currents* — loop-crossfaded, about 2:03, normalized to ~−18 LUFS. Mixtape upgrades gently open the lowpass and raise presence; they do not swap in a new genre. One tape for the whole drive.

### 3. Mute sacred
**M** and **Sound on/off** still mute *all* audio (lo-fi + cabin + road + the tiny Drive/buy blips). Master gain ramps to 0 in ~70ms and stays there while muted. One-shots refuse to fire when muted. Default master is 0.20 (was 0.26). No extra volume slider — HUD chrome stays the wave 3 cluster.

### 4. A11y
Less motion / `prefers-reduced-motion` (via the existing save flag) freezes the road swell and skips Drive/buy one-shots. No roadside-event stings were added. Sound button `aria-label` now says it mutes the music and the car.

### 5. Licenses
All three beds are CC0. Sources, URLs, and processing notes: `audio-pass/LICENSES.md`.

## Mute / volume behavior

| Control | Effect |
| --- | --- |
| Sound on / **M** | Master gain 0.20. Music + car audible after a user gesture. |
| Sound off / **M** | Master gain 0. Music, cabin, road, Drive thud, buy chime all silent. |
| Less motion | Road bed stays at idle; no Drive/buy blips. Tape still plays if Sound is on. |
| Default | Gentle. Cabin under the tape. No racing engine. |

Audio still waits for a gesture (`resume()` on Drive / mute / first key).

## Evidence

- `audio-pass/evidence/sound-ui.png` — Sound on still sits with Save / Postcards / Larger type / Less motion
- `audio-pass/evidence/lofi-spectrogram.png` — warm midrange tape, ~2 min loop
- `audio-pass/evidence/cabin-spectrogram.png` — energy parked in the rumble band
- `audio-pass/evidence/road-spectrogram.png` — quiet cabin hush

`npm run build` succeeded. Preview served `/audio/lofi.mp3`, `/audio/cabin.mp3`, `/audio/road.mp3` as 200.

## Unfinished

- No on-screen volume slider (kept the HUD uncluttered). Easy on/off only.
- One lo-fi tape for every destination; mixtape tier only brightens it.
- Drive/buy remain original sine blips, not recorded foley.
- Cabin loop is a Freesound HQ preview (CC0), not the original 48 kHz WAV.
- Headless Chrome could not fully exercise Web Audio (WebGL-less screenshot of the HUD only).

## Out of scope

Merge, production deploy, FOMO stings on mail truck / deer / neon.
