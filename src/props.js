import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { bindProp, spawnBound } from './prop-bind.js';

const loader = new GLTFLoader();
const contractModules = import.meta.glob('../tools/blender/contracts/*.json', {
  eager: true,
  import: 'default',
});

const contracts = new Map(
  Object.values(contractModules).map((contract) => [contract.id, contract]),
);
const protos = new Map();
let prepareWork = null;

export function propContract(id) {
  const contract = contracts.get(id);
  if (!contract) throw new Error(`unknown prop ${id}`);
  return contract;
}

export function propIds() {
  return [...contracts.keys()].sort();
}

export async function prepareProps() {
  if (protos.size === contracts.size && contracts.size) return;
  if (prepareWork) {
    await prepareWork;
    return;
  }
  prepareWork = (async () => {
    await Promise.all(
      [...contracts.values()].map(async (contract) => {
        const gltf = await loader.loadAsync(`/models/${contract.file}`);
        const root = gltf.scene.getObjectByName(contract.nodes.root) || gltf.scene;
        protos.set(contract.id, bindProp(root, contract));
      }),
    );
  })();
  try {
    await prepareWork;
  } finally {
    prepareWork = null;
  }
}

export function spawnProp(id, opts = {}) {
  const proto = protos.get(id);
  if (!proto) throw new Error(`prepareProps() must finish before spawnProp('${id}')`);
  return spawnBound(proto, propContract(id), opts);
}

export function spawnWagon(opts = {}) {
  return spawnProp('wagon', opts);
}
