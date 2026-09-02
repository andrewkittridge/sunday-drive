# Sunday Drive — wave 9 mobile upgrades

Draft PR only. Not merged. Not deployed to production.

## PR

(see GitHub draft after push)  
Base: `main` @ `958547a` (wave 8). Head: `wave/9-mobile-upgrades`.

## Thesis

When The car is open, **buy wins**. Drive stays planted below — it must not steal the thumb. Taller shopping sheet, whole-row buy targets (~72px+), affordable vs locked contrast, scroll without Drive theft. Hold w7/w8. No FOMO.

## What landed

### 1. Taller shopping sheet
Portrait open `max-height` raised so **≥2–3 upgrade rows** show at 390×844 (`min(36vh, 17.5rem)`) and **≥2** on ~667 (`min(32vh, 14.25rem)`). Collapsed default stays short (panel hidden; base short max-height untouched for closed path). Hide stays in the sheet header. Drive planted (≥48px) with a clearer gap under the sheet.

Measured after (local preview):
- 390×844: panel ~280px, **3 full rows** (+1 partial), Drive ~56px
- 390×667: panel ~213px, **2 full rows** (+1 partial), Drive ~50px

### 2. Whole-row buy targets
Open portrait upgrade rows use **min-height: 72px** (64px on short ~667). Cost stays gold / obvious as the buy affordance; name + one-line meta remain readable without hover. Whole row remains the hit target.

### 3. Affordable vs locked
Stopped opacity-only disabled styling. Buyable (`:not(:disabled)`): stronger cream fill + gold border + bold gold cost. Unaffordable disabled: muted without opacity fade. **Locked / Soon** (`.locked`): darker wash + dimmer type so one glance separates “I can buy this” from “not yet.” Larger type still inherits contrast (not opacity-only).

### 4. Scroll without Drive theft
`.upgrades` keeps `touch-action: pan-y` + `overscroll-behavior: contain`; open sheet adds bottom padding. Drive-wrap margin/gap increased when panel open so a fling is less likely to land on Drive. Drive stays enabled and planted.

### 5. Hide stays Hide
Header-only dismiss via existing panel-toggle overlay on the sheet. No upgrade styled like dismiss.

## Hold / hard no

Held: w7 safe-area / short-phone / landscape / type; w8 Menu + Drive primary when sheet closed; clip-safe corridor, mute (**M**), Less motion, Larger type, audio. No FOMO, no new destinations/systems, no comfort-ghost re-stack. Cookie/deer untouched.

## Evidence

Before: `wave9-mobile-upgrades/evidence/before/`  
After: `wave9-mobile-upgrades/evidence/after/`

- `phone-390-sheet.png` — ≥2–3 rows, Drive free, Hide header
- `phone-short-667.png` — ≥2 rows, Drive free
- `phone-390-locked-vs-buyable.png` — optional contrast close-up

Bar: `wave9-mobile-upgrades/VISUAL-BAR.md` + `mood-sheet-390.png` / `mood-sheet-short.png` (layout feel only; live upgrade names/economy kept).

`npm run build` succeeded (exit 0).

## Unfinished

- Designer eye-check vs moods (moods invent BUY chips / coastal props; live prefers whole-row tap + real names).
- Real-device thumb glance (scroll fling → Drive) still pending.
- Soft w8 Menu nits / soft w6 cookie-deer / desktop density / prestige copy = ship-next, not this PR.

## Out of scope

- Merge to `main`
- Production deploy
- Force-push
- FOMO timers / streaks / EVENT chrome
- New destinations / idle rewrite / save-schema
