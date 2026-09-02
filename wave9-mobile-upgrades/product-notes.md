# Sunday Drive — wave 9 mobile upgrades product notes
2026-09-02. Product. Evidence: https://sunday-drive-ten.vercel.app @ `958547a` · BRIEF · panel-open CSS (`max-height: min(22vh, 10.5rem)`; short `18vh` / `8.75rem`; upgrade `min-height: 64px`)

## Thesis

Andrew: hard to pick upgrades on mobile. Failure mode is the **shopping path**, not atmosphere.

Wave 6–8 correctly planted Drive and shortened The car so the postcard survives. On phone that sheet is now so short that upgrade rows are cramped, mostly off-screen, and easy to miss — while a big Drive below still competes for the thumb. **When The car is open, buy must win.** Drive stays visible; it must not steal the tap.

## Named failure

| Failure | What it feels like |
| --- | --- |
| Cramped rows | ~64px rows + tiny sheet → 1 upgrade visible; scroll forever |
| Miss taps | Cost/name not an obvious buy target; fat-finger miss |
| Scroll trap | Finger leaves sheet → hits Drive / Hide by accident |
| Hide vs buy confusion | Header Hide vs upgrade rows fight for attention |
| Affordability unclear | Locked vs buyable look too similar under Larger type |

## Ship now (one PR, ranked)

1. **Taller shopping sheet** — With panel open, raise max-height so **≥2–3 upgrade rows** show at 390×844 and still ≥2 on ~667. Keep Hide in header. Drive stays planted (≥48px) below — no shared-bottom collision. Collapsed default stays short.
2. **Clear buy targets** — Whole upgrade row is the hit target (≥48px, prefer ~72px+ when sheet open). Cost reads as the buy affordance (gold, obvious). Name + one-line meta readable without hover.
3. **Affordable vs locked** — Stronger contrast so “I can buy this” is obvious in one glance (not only opacity).
4. **Scroll without Drive theft** — Sheet scroll stays `pan-y` / contained; add separation so a fling doesn’t land on Drive. Don’t disable Drive entirely.
5. **Hide stays Hide** — One quiet dismiss in the sheet header; never style an upgrade like dismiss.

Hold w7 safe-area / landscape / type; w8 Menu + Drive primary when sheet closed. Mute / Less motion / Larger type / audio / clip-safe. No FOMO. Don’t re-stack five comfort ghosts.

## Ship next (not this PR)

- Soft w8 Menu nits.
- Soft w6 cookie/deer.
- Desktop upgrade density (not the ask).
- Prestige confirm copy polish if still confusing after buy path works.

## Never (this wave)

- Removing Drive while shopping (keep planted; just stop steal).
- Re-opening five equal comfort ghosts.
- New destinations / systems / FOMO.
- Undoing w7/w8 postcard ownership when sheet is **closed**.
- Merge / deploy without Andrew yes.

## Build order

1. Designer: VISUAL-BAR + moods at **390×844** and **~667** with The car **open** — clear buy rows, taller sheet, Drive still free.
2. Engineer: one Grok draft PR; before/after phone evidence under `wave9-mobile-upgrades/evidence/`.
3. Designer eye-check; Jarvis → Andrew. Draft only.

## Handoff

- Done: failure named; ranked ship-now
- Evidence: live sheet height CSS; Andrew report
- Unresolved: exact open max-height in bar (product wants ≥2–3 rows)
- Next: Designer → Engineer one PR
