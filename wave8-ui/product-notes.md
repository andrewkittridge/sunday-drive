# Sunday Drive — wave 8 UI product notes
2026-09-02. Product. Evidence: https://sunday-drive-ten.vercel.app @ `e79031f` · index HUD (Sound / Save / Postcards / Larger type / Less motion as equal ghosts) · wave8-ui/BRIEF.md

## Thesis

Andrew: UI isn’t intuitive and takes up lots of page. The game is the **postcard** — road, wagon, air. Chrome should answer one question in one glance: **Drive.** Everything else is secondary or tucked.

Wave 6–7 fixed phone sheet vs Drive. Wave 8 is **overall hierarchy and density** (desktop + phone): promote the primary path, collapse competing ghosts, give the canvas back.

## Promote (always obvious)

1. **Destination** — where you are.
2. **Miles** — big number.
3. **Drive** — sole primary action (≥48px; Space / click).
4. **The car** — one clear toggle into upgrades (collapsed by default).

Keep read order: destination → miles → Drive → The car.

## Hide / collapse (ship-now)

Put these behind **one quiet control** (e.g. Menu / Settings) — not five equal top-row ghosts:

| Control | Why collapse |
| --- | --- |
| Sound on/off | Sacred mute stays (**M** + labeled item inside menu). Don’t remove; don’t equal-weight with Drive. |
| Save file | Occasional. Modal from menu. |
| Postcards | Occasional gallery. |
| Larger type | A11y — must stay reachable; lives in menu, not a permanent peer to Drive. |
| Less motion | Same as Larger type. |

Also whisper-quiet (already secondary — don’t promote): rate line, trip progress, souvenir line.

## Ship now (one PR, ranked)

1. **Primary path only** — destination / miles / Drive / The car own the HUD. Clear “what do I do?”
2. **Collapse comfort chrome** — one Menu for Sound / Save / Postcards / Larger type / Less motion. Persist a11y + mute state as today.
3. **More canvas, less dashboard** — desktop ~1280/1440: quieter chrome, postcard owns viewport. Phone: keep w7 safe-area / short sheet / landscape / type wins; don’t re-stack a comfort row.
4. **Intuitive labels** — Drive stays Drive; The car stays the upgrades entry. No FOMO copy.

## Ship next (not this PR)

- Soft w6 cookie/deer.
- Soft w7 real-device safe-area glance / Larger-type blurb.
- Deeper cabin / settings redesign.
- Keyboard legend only inside Menu if needed.

## Never (this wave)

- Removing mute or a11y (burying forever / no keyboard).
- FOMO timers, streaks, EVENT chrome.
- New destinations / idle rewrite / save-schema for layout.
- Undoing w7 mobile gains (Drive planted, short sheet, safe-area, landscape).
- Equal-weight button salad again.
- Merge / deploy without Andrew yes.

## Build order

1. Designer: VISUAL-BAR + moods (~1280/1440 + phone 390) — quiet chrome, clear Drive.
2. Engineer: one draft PR; before/after under `wave8-ui/evidence/`.
3. Designer eye-check; Jarvis → Andrew. Draft only.

## Handoff

- Done: promote vs collapse named; ranked ship-now
- Evidence: live HUD equal ghosts; brief ask
- Unresolved: Designer menu pattern (icon vs “Menu” word)
- Next: Designer bar → Engineer one PR
