import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, 'contracts');

function kind(id, extra) {
  return {
    id,
    file: `${id}.glb`,
    origin: 'ground',
    maxTriangles: 8000,
    ...extra,
  };
}

const contracts = [
  kind('round', {
    aabbMax: { length: 4.5, width: 4.5, height: 5.5 },
    nodes: { root: 'Round', required: ['Trunk', 'Canopy', 'Canopy_A', 'Canopy_B'] },
    materials: { bark: 'Mat_Bark', tint: 'Mat_Foliage' },
  }),
  kind('willow', {
    aabbMax: { length: 4.8, width: 4.8, height: 6.2 },
    nodes: { root: 'Willow', required: ['Trunk', 'Crown', 'Drape_L', 'Drape_R'] },
    materials: { bark: 'Mat_Bark', tint: 'Mat_Foliage' },
  }),
  kind('pine', {
    aabbMax: { length: 4.5, width: 4.5, height: 8.5 },
    nodes: { root: 'Pine', required: ['Trunk', 'Bough_0', 'Bough_1', 'Bough_2', 'Bough_3'] },
    materials: { bark: 'Mat_Bark', tint: 'Mat_Foliage' },
  }),
  kind('scrub', {
    aabbMax: { length: 3.8, width: 3.8, height: 2.8 },
    nodes: { root: 'Scrub', required: ['Lobe_A', 'Lobe_B', 'Lobe_C'] },
    materials: { bark: 'Mat_Bark', tint: 'Mat_Foliage' },
  }),
  kind('sage', {
    aabbMax: { length: 3.2, width: 3.2, height: 2.2 },
    nodes: { root: 'Sage', required: ['Clump_A', 'Clump_B', 'Clump_C'] },
    materials: { bark: 'Mat_Bark', tint: 'Mat_Foliage' },
  }),
  kind('barn', {
    aabbMax: { length: 8.5, width: 10.5, height: 7.5 },
    nodes: { root: 'Barn', required: ['Body', 'Roof_L', 'Roof_R', 'Door', 'Loft'] },
    materials: { paint: 'Mat_Paint', roof: 'Mat_Roof', trim: 'Mat_Trim' },
  }),
  kind('windmill', {
    aabbMax: { length: 5.5, width: 5.5, height: 9.5 },
    nodes: {
      root: 'Windmill',
      required: ['Tower', 'Nacelle', 'Tail', 'Blades'],
      blades: 'Blades',
    },
    materials: { wood: 'Mat_Wood', sail: 'Mat_Sail', iron: 'Mat_Iron' },
  }),
  kind('silo', {
    aabbMax: { length: 4.5, width: 4.5, height: 8.5 },
    nodes: { root: 'Silo', required: ['Drum', 'Hoop_A', 'Cap', 'Chute'] },
    materials: { metal: 'Mat_Metal', cap: 'Mat_Cap', rust: 'Mat_Rust' },
  }),
  kind('pond', {
    aabbMax: { length: 18, width: 18, height: 4.5 },
    nodes: { root: 'Pond', required: ['Water', 'Bank', 'Dock', 'Shed', 'ShedRoof'] },
    materials: { water: 'Mat_Water', wood: 'Mat_Wood', bank: 'Mat_Bank' },
  }),
  kind('diner', {
    aabbMax: { length: 8.5, width: 10.5, height: 6.5 },
    nodes: { root: 'Diner', required: ['Body', 'Roof', 'Stripe', 'Window_0', 'Sign'] },
    materials: {
      chrome: 'Mat_Chrome',
      roof: 'Mat_Roof',
      neon: ['Mat_Neon', 'Mat_Window'],
    },
  }),
  kind('lighthouse', {
    aabbMax: { length: 6.5, width: 6.5, height: 12 },
    nodes: { root: 'Lighthouse', required: ['Base', 'Tower', 'Stripe', 'Lantern', 'Cap'] },
    materials: { paint: 'Mat_Paint', stripe: 'Mat_Stripe', emit: ['Mat_Lantern'] },
  }),
  kind('rocks', {
    aabbMax: { length: 10, width: 10, height: 5.5 },
    nodes: { root: 'Rocks', required: ['Boulder_A', 'Boulder_B', 'Boulder_C', 'Boulder_D'] },
    materials: { stone: 'Mat_Stone', lichen: 'Mat_Lichen' },
  }),
  kind('dock', {
    aabbMax: { length: 20, width: 20, height: 5.5 },
    nodes: { root: 'Dock', required: ['Water', 'Pier', 'Pile_0', 'Hull', 'House'] },
    materials: { water: 'Mat_Water', wood: 'Mat_Wood', paint: 'Mat_Paint' },
  }),
  kind('mesa', {
    aabbMax: { length: 16, width: 16, height: 7.5 },
    nodes: { root: 'Mesa', required: ['Butte', 'Caprock', 'Talus'] },
    materials: { earth: 'Mat_Earth', cap: 'Mat_Cap', dust: 'Mat_Dust' },
  }),
  kind('chapel', {
    aabbMax: { length: 8.5, width: 7.5, height: 9.5 },
    nodes: { root: 'Chapel', required: ['Nave', 'Roof', 'Door', 'Steeple', 'Spire'] },
    materials: { paint: 'Mat_Paint', roof: 'Mat_Roof', trim: 'Mat_Trim' },
  }),
  kind('fence', {
    aabbMax: { length: 12, width: 1.6, height: 2.2 },
    nodes: { root: 'Fence', required: ['Post_0', 'Post_1', 'Post_2', 'Rail_Lo', 'Rail_Hi'] },
    materials: { post: 'Mat_Post', rail: 'Mat_Rail' },
  }),
  kind('reed', {
    aabbMax: { length: 2.2, width: 2.2, height: 2.6 },
    nodes: { root: 'Reed', required: ['Stem_0', 'Head_0', 'Stem_1', 'Head_1'] },
    materials: { stem: 'Mat_Stem', head: 'Mat_Head' },
  }),
  kind('mailbox', {
    aabbMax: { length: 1.8, width: 1.6, height: 2.2 },
    nodes: { root: 'Mailbox', required: ['Post', 'Box', 'Flag', 'Door'] },
    materials: { post: 'Mat_Post', box: 'Mat_Box', flag: 'Mat_Flag' },
  }),
  kind('lamp', {
    aabbMax: { length: 1.8, width: 1.8, height: 4.2 },
    nodes: { root: 'Lamp', required: ['Post', 'Arm', 'Housing', 'Bulb'] },
    materials: { iron: 'Mat_Iron', emit: ['Mat_Bulb'] },
  }),
  kind('hay', {
    aabbMax: { length: 2.4, width: 2.4, height: 2.2 },
    nodes: { root: 'Hay', required: ['Bale', 'Twine_A', 'Twine_B'] },
    materials: { straw: 'Mat_Straw', twine: 'Mat_Twine' },
  }),
  kind('dune', {
    aabbMax: { length: 10, width: 12, height: 3.2 },
    nodes: { root: 'Dune', required: ['Rise', 'Crest', 'Slip'] },
    materials: { sand: 'Mat_Sand', shadow: 'Mat_Shadow' },
  }),
  kind('tuft', {
    aabbMax: { length: 1.4, width: 1.4, height: 1.4 },
    nodes: { root: 'Tuft', required: ['Blade_0', 'Blade_1', 'Blade_2'] },
    materials: { tint: 'Mat_Blade', tip: 'Mat_Tip' },
  }),
  kind('rock', {
    aabbMax: { length: 2.2, width: 2.2, height: 1.6 },
    nodes: { root: 'Rock', required: ['Boulder', 'Chip'] },
    materials: { stone: 'Mat_Stone', moss: 'Mat_Moss' },
  }),
  kind('wildflowers', {
    aabbMax: { length: 1.6, width: 1.6, height: 1.4 },
    nodes: { root: 'Wildflowers', required: ['Stem_0', 'Bloom_0', 'Stem_1', 'Bloom_1'] },
    materials: { stem: 'Mat_Stem', tint: 'Mat_Bloom' },
  }),
  kind('sign', {
    aabbMax: { length: 1.4, width: 1.6, height: 2.6 },
    nodes: { root: 'Sign', required: ['Pole', 'Board', 'Bolt'] },
    materials: { pole: 'Mat_Pole', board: 'Mat_Board' },
  }),
  kind('mail', {
    forward: '-z',
    aabbMax: { length: 5.2, width: 2.6, height: 3.2 },
    nodes: {
      root: 'Mail',
      required: ['Body', 'Cab', 'Stripe', 'Glass', 'Bumper'],
      front: 'Bumper',
    },
    materials: { paint: 'Mat_Paint', stripe: 'Mat_Stripe', glass: 'Mat_Glass' },
  }),
  kind('deer', {
    aabbMax: { length: 2.4, width: 1.4, height: 2.2 },
    nodes: {
      root: 'Deer',
      required: ['Body', 'Chest', 'Rump', 'Neck'],
      head: 'Head',
    },
    materials: { hide: 'Mat_Hide', dark: 'Mat_Dark', cream: 'Mat_Cream' },
  }),
  kind('neon', {
    aabbMax: { length: 1.8, width: 2.8, height: 4.6 },
    nodes: { root: 'Neon', required: ['Post', 'Board', 'Script'] },
    materials: { post: 'Mat_Post', neon: ['Mat_Neon', 'Mat_Eat'] },
  }),
];

await mkdir(dir, { recursive: true });
for (const contract of contracts) {
  const path = join(dir, `${contract.id}.json`);
  await writeFile(path, `${JSON.stringify(contract, null, 2)}\n`);
  console.log('wrote', path);
}
console.log(`contracts ${contracts.length}`);
