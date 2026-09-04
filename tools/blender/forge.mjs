import { spawn } from 'node:child_process';
import { copyFile, mkdir, readdir, readFile, rename, unlink } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseGlb, validateGlbJson } from './validate-glb.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '../..');
const blender =
  process.env.BLENDER || '/Applications/Blender.app/Contents/MacOS/Blender';

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

function scriptFor(id) {
  if (id === 'wagon') return join(here, 'generate_wagon.py');
  return join(here, 'generate_prop.py');
}

export async function listJobs(only) {
  const dir = join(here, 'contracts');
  const files = (await readdir(dir)).filter((name) => name.endsWith('.json')).sort();
  const jobs = files.map((file) => {
    const id = file.replace(/\.json$/, '');
    return { id, script: scriptFor(id), contract: join(dir, file) };
  });
  if (!only) return jobs;
  const match = jobs.filter((job) => job.id === only);
  if (!match.length) {
    throw new Error(`unknown id ${only}`);
  }
  return match;
}

async function publish(job, staging) {
  const contract = JSON.parse(await readFile(job.contract, 'utf8'));
  const publicDir = join(repo, 'public', 'models');
  await mkdir(publicDir, { recursive: true });
  const buf = await readFile(staging);
  const report = validateGlbJson(parseGlb(buf), contract);
  console.log(`validated ${job.id}`, report);
  const dest = join(publicDir, contract.file);
  const tmp = `${dest}.tmp`;
  await copyFile(staging, tmp);
  await rename(tmp, dest);
  await unlink(staging).catch(() => {});
  console.log(`forged ${dest}`);
  return report;
}

async function forgeJob(job) {
  const contract = JSON.parse(await readFile(job.contract, 'utf8'));
  const stagingDir = join(repo, 'generated', '.staging');
  await mkdir(stagingDir, { recursive: true });
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
  return publish(job, staging);
}

async function forgePropBatch(jobs) {
  const stagingDir = join(repo, 'generated', '.staging');
  await mkdir(stagingDir, { recursive: true });
  await run(blender, [
    '--background',
    '--python',
    join(here, 'generate_prop.py'),
    '--',
    '--all',
    '--out',
    stagingDir,
  ]);
  for (const job of jobs) {
    const contract = JSON.parse(await readFile(job.contract, 'utf8'));
    await publish(job, join(stagingDir, contract.file));
  }
}

const only = process.argv[2];
try {
  const jobs = await listJobs(only);
  const wagon = jobs.filter((job) => job.id === 'wagon');
  const props = jobs.filter((job) => job.id !== 'wagon');
  for (const job of wagon) await forgeJob(job);
  if (props.length === 1) await forgeJob(props[0]);
  else if (props.length > 1) await forgePropBatch(props);
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
