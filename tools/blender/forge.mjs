import { spawn } from 'node:child_process';
import { copyFile, mkdir, readFile, rename, unlink } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGlbJson } from './validate-glb.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '../..');
const blender =
  process.env.BLENDER || '/Applications/Blender.app/Contents/MacOS/Blender';

const JOBS = [
  {
    id: 'wagon',
    script: join(here, 'generate_wagon.py'),
    contract: join(here, 'contracts/wagon.json'),
  },
];

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited ${code}`));
    });
  });
}

function parseGlb(buf) {
  const magic = buf.toString('utf8', 0, 4);
  if (magic !== 'glTF') throw new Error('not a glb');
  const jsonLength = buf.readUInt32LE(12);
  return JSON.parse(buf.slice(20, 20 + jsonLength).toString('utf8'));
}

async function forgeJob(job) {
  const contract = JSON.parse(await readFile(job.contract, 'utf8'));
  const stagingDir = join(repo, 'generated', '.staging');
  const publicDir = join(repo, 'public', 'models');
  await mkdir(stagingDir, { recursive: true });
  await mkdir(publicDir, { recursive: true });

  const staging = join(stagingDir, contract.file);
  await run(blender, [
    '--background',
    '--python',
    job.script,
    '--',
    '--out',
    staging,
    '--contract',
    job.contract,
  ]);

  const buf = await readFile(staging);
  const report = validateGlbJson(parseGlb(buf), contract);
  console.log(`validated ${job.id}`, report);

  const dest = join(publicDir, contract.file);
  const tmp = `${dest}.tmp`;
  await copyFile(staging, tmp);
  await rename(tmp, dest);
  await unlink(staging).catch(() => {});
  console.log(`forged ${dest}`);
}

const only = process.argv[2];
const jobs = only ? JOBS.filter((job) => job.id === only) : JOBS;
if (!jobs.length) {
  console.error(`unknown id ${only}`);
  process.exit(1);
}
for (const job of jobs) {
  await forgeJob(job);
}
