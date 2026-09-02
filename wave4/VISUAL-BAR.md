# Sunday Drive — wave 4 visual bar

Owner: Designer · Audience: Engineer · Status: **draft only**  
Base: live main (wave 3 + audio) · https://sunday-drive-ten.vercel.app  
Prior bars still stand: `polish/VISUAL-BAR.md`, `wave3/VISUAL-BAR.md`  
Carry: wave3 EYECHECK notes (flat clouds, deer read, short-phone sheet)  
Moods: `mood-clouds.png`, `mood-deer.png`, `mood-materials.png`, `mood-phone-sheet.png`

---

## Thesis

Wave 4 is **cozier feel, not new content**. Deepen the golden-hour postcard and cabin calm — cloud volume, a deer that reads in 1s, material/light depth, short-phone sheet clearance. Still Melvor / A Short Hike quiet. Still one Drive. No FOMO, no bloom soup, no prop salad.

---

## 1. Cloud volume puff

Mood: `mood-clouds.png`

- Replace flat oval discs with **layered soft volumes** (stylized/low-poly OK) that catch golden-hour rim and moonlight undersides.
- Day: warm peach/amber edges; dusk: cooler shadow bases; night: soft slate volumes, never aurora circus.
- Drift stays gentle; **Less motion** cuts drift intensity.
- Restraint: 2–4 readable cloud masses, not a storm wall. Never hide the wagon or tank 60 FPS.

## 2. Deer silhouette read

Mood: `mood-deer.png`

- One quiet deer at the **shoulder** (`|x| ≥ 6.7`). Body + head pose must read **deer in ≤1s** (legs, neck, optional antlers). Not a horse blob.
- Gift only: no banner, timer, tap, or EVENT chrome. Drive never blocked.
- Still low-poly; silhouette > mesh detail. Long cooldown; max one moment in mind.
- Clip-fix: never through asphalt; beside fence/grass.

## 3. Material / light depth (wagon + road + fog)

Mood: `mood-materials.png`  
Align polish Safe/Feel: atmosphere → car/road → roadside.

- **Wagon:** wood panel vs cream body vs cabin glass contrast; readable contact shadow; low-poly OK if materials separate.
- **Road:** asphalt that takes a soft **headlight kiss** at dusk/night; dashes stay crisp; no z-fight with grass.
- **Fog:** near clear enough for the wagon hero; far soft so hills melt. No flat fill that kills depth.
- Golden-hour key warm; soft hemi fill. **No bloom soup**, no FOV pump, no shake.

## 4. Short-phone sheet vs Drive

Mood: `mood-phone-sheet.png` — **layout feel only**. Keep live copy/economy; ignore invented tabs/stats in the mood still.

- Open **The car** bottom sheet stays **below** horizon + wagon silhouette.
- **Drive** stays planted in thumb zone (≥48px), fully visible while sheet is open.
- Prefer: shorter max sheet height + internal scroll over growing the sheet upward.
- Collapsed default (wave 3 win) still stands. Landscape not broken.
- Larger type + Less motion + mute still held.

---

## Preferred build order (one draft PR)

1. **Cloud volume puff** — biggest cozy sky lift, lowest product risk.
2. **Deer silhouette read** — finish the wave 3 gift.
3. **Material / light depth** — wagon + road + fog as one pass.
4. **Short-phone sheet clearance** — Drive planted; sheet below wagon.

Capture before/after under `wave4/evidence/` (desktop sky/night, `?event=deer`, materials close, mobile ~390×844 panel open).

---

## Hard no

- FOMO timers, streaks, EVENT banners, loot noise
- New destinations / idle rewrite / save-schema for “visuals”
- Prop salad, second landmark fighting the wagon
- Bloom soup, arcade shake, FOV pump
- Breaking clip-fix, mute, Less motion, Larger type
- Merge / deploy without Andrew yes

---

## Handoff

Engineer builds **one** draft PR against this bar.  
Designer eye-checks after frames vs moods.  
Jarvis brings Andrew. Draft only — Designer does not ask merge.

## Mood note

Moods are feel targets, not pixel matches. Live upgrade names and chrome stay. Phone mood is clearance layout only.
