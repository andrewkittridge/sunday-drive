# Sunday Drive — wave 7 mobile product notes
2026-09-02. Product. Evidence: https://sunday-drive-ten.vercel.app @ `8c12073` · wave7-mobile/BRIEF.md · wave6 phone sheet PASS · wave3 mobile foundation

## Thesis

Andrew: improve mobile. Atmosphere is still the drive — on a phone that means **thumb-first calm**, not a desktop polish pass squeezed into a narrow viewport.

Wave 6 already shortened **The car** and planted Drive at ~390×844. Wave 7 deepens what still breaks the Sunday: safe areas, short phones, landscape, readable type, and calm frame rate if the cabin feels heavy. Soft w6 cookie/deer nits stay **deferred** — they do not help thumb reach.

One draft PR. Feel only. No new destinations, no FOMO, no idle rewrite.

## Ship now (one PR, ranked)

1. **Safe-area + home-indicator hardening** — Drive and primary chrome clear of notch / home indicator (`env(safe-area-inset-*)`). Miles + Drive never sit under the system bar. Canvas/HUD padding honest on notched phones.
2. **Short-phone sheet vs canvas (~667 and below)** — Prove open **The car** still leaves wagon/horizon + full Drive at short heights (not only 390×844). Shorter max / harder scroll if needed; collapsed default stands.
3. **Landscape thumb path** — Two-column stays calm: Drive reachable, upgrades don’t cover the road, no broken stack. Portrait remains the hero layout.
4. **Mobile type hierarchy** — Destination → miles → Drive → upgrades. Larger type step still works on phone without wrapping Drive or crowding the postcard. Aging-gamer first.
5. **Calm mobile perf (only if needed)** — Cap pixel ratio / shadow cost if phone stills or play feel hitch. Prefer fog + materials over post stacks. Skip if 60-ish already holds.

Hold clip-fix, mute, Less motion, Larger type, audio beds. Wave 6 sheet rules (Hide in header, Drive planted ≥48px) stay.

## Ship next (not this PR)

- Soft w6 cookie frontal pool / deer contrast (desktop leftovers).
- Boot → first Drive coach copy for first-run phones.
- PWA / add-to-home polish.
- Sparse night stars / weather accents / 3D postcard snaps.

## Never (this wave)

- Ranking cookie/deer as ship-now “for mobile.”
- New destinations, systems, FOMO timers, EVENT chrome.
- Idle rewrite / save-schema for layout.
- Desktop-only atmosphere rewrite as the primary deliverable.
- Bloom soup, FOV pump, arcade shake.
- Breaking clip-fix / mute / Less motion / Larger type / audio.
- Merge / deploy without Andrew yes.

## Build order

1. Designer: VISUAL-BAR + moods at **390×844**, short ~**667**, and **landscape**.
2. Engineer: one Grok draft PR against that bar + this list; evidence on those viewports under `wave7-mobile/evidence/`.
3. Designer eye-check; Jarvis → Andrew. Draft only.

## Handoff

- Done: ranked mobile ship-now; cookie/deer deferred
- Evidence: live @ `8c12073`; w6 phone sheet PASS; brief focus list
- Unresolved: Designer bar; Engineer draft PR
- Next: Designer → Engineer one PR
