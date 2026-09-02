# Audio licenses

All shipped beds are royalty-free with a clear public-domain / CC0 license. Files in `public/audio/` are loop-trimmed, filtered, and loudness-normalized derivatives of the sources below. No Content ID tracks. No copyrighted radio rips.

| In-game file | Role | Source | Author | License | URL |
| --- | --- | --- | --- | --- | --- |
| `public/audio/lofi.mp3` | Chill lo-fi soundtrack (looped) | *Calm Currents (Lofi, Relax, Calm)* from the album *Public Domain Lofi* | HoliznaCC0 | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | https://freemusicarchive.org/music/holiznacc0/public-domain-lofi/calm-currents-lofi-relax-calm/ |
| `public/audio/cabin.mp3` | Soft engine idle (interior, looped, low-passed) | *Vehicle_Car_Peugeot_308_Idle_Interior_LoopMono_.wav* (Freesound HQ preview) | Nox_Sound | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | https://freesound.org/people/Nox_Sound/sounds/522223/ |
| `public/audio/road.mp3` | Quiet cabin road hush (looped) | *Car interior driving 01.wav* (Freesound HQ preview) | Daphne_in_Wonderland | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | https://freesound.org/people/Daphne_in_Wonderland/sounds/383470/ |

## Notes

- HoliznaCC0 releases the *Public Domain Lofi* album under CC0 1.0. The artist invites reuse; support links live on the FMA page.
- Freesound HQ previews of CC0 originals are used (smaller than the source WAV) and remain CC0.
- Processing: trim fade-in/out, equal-power loop crossfade, gentle low/high-pass on the car beds, loudnorm to about −18 LUFS (music), −23 LUFS (cabin), −27 LUFS (road).
- Procedural oscillators remain only as a silent-until-loaded fallback if a file fails to decode. Drive/buy one-shots are original sine blips, not third-party SFX.
- Roadside events (mail truck, deer, neon) stay visual-only. No licensed stings were added.

## Considered, not used

- Mixkit lo-fi catalog (Mixkit License) — CDN downloads 403'd from this environment.
- Other HoliznaCC0 album cuts (*Shimmer*, *Peaceful Drift*, *We Drove All Night*) — louder or less loop-steady than *Calm Currents*.
