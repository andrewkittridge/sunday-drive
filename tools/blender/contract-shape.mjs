export function collectNames(contract) {
  const nodes = contract.nodes || {};
  const names = [];
  if (nodes.root) names.push(nodes.root);
  for (const key of ['required', 'wheels', 'headlamps', 'tails']) {
    if (Array.isArray(nodes[key])) names.push(...nodes[key]);
  }
  if (nodes.head) names.push(nodes.head);
  if (nodes.blades) names.push(nodes.blades);
  if (nodes.front) names.push(nodes.front);
  if (nodes.anchors) names.push(...Object.values(nodes.anchors));
  return uniq(names);
}

export function materialNames(contract) {
  const names = [];
  const walk = (value) => {
    if (typeof value === 'string') names.push(value);
    else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === 'object') Object.values(value).forEach(walk);
  };
  walk(contract.materials || {});
  return uniq(names);
}

function uniq(names) {
  const out = [];
  const seen = new Set();
  for (const name of names) {
    if (!name || seen.has(name)) continue;
    seen.add(name);
    out.push(name);
  }
  return out;
}
