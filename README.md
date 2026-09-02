# Sunday Drive

**Live:** https://sunday-drive-ten.vercel.app  
**Repo:** https://github.com/andrewkittridge/sunday-drive

A cozy Three.js idle. You own a quiet weekend car. Miles accrue while you are away. Spend them on diner stops, mixtapes, tires, and thermos coffee. Prestige is a new destination and a permanent souvenir bonus.

Local draft only — no accounts, ads, or deploy.

## How to run

```bash
cd /workspace/sunday-drive
npm install
npm run dev
```

The Vite dev server listens on **http://127.0.0.1:5173/** (or the next free port Vite prints).

To bind that host and port explicitly:

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

Production build:

```bash
npm run build
npm run preview
```

Preview defaults to **http://127.0.0.1:4173/**.

## How to play

- **Drive** — click the Drive button or press Space. Miles are also earned passively.
- **Upgrades** — tires, mixtape, diner, thermos (later: cruise control, autopilot playlist). Costs miles; raises click power and mi/s.
- **Keys 1–6** buy upgrades in order. **M** or **Sound on/off** toggles the mixtape. Mute stays muted.
- **Postcards** opens a gallery of destinations you have parked at. **Larger type** and **Less motion** sit next to Sound and persist with the save. Less motion also follows the OS reduce-motion preference until you toggle it.
- Close the tab and come back: an honest offline catch-up uses the timestamp in `localStorage`. No punish, no timers.
- Reach the next town to prestige: upgrades reset, souvenir multiplier stays, and the countryside actually changes.
- **Save file** downloads or copies a JSON backup. Load a copy (file or paste) only after confirm; a bad paste will not wipe the trip.

Progress is saved in the browser (`localStorage` key `sunday-drive-save-v1`). A downloaded save is a spare key for another profile or computer.
