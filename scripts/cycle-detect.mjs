// Cycle detector: follows import + export-from edges, strips comments.
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('src');
const alias = '@/';
const exts = ['.ts', '.tsx', '.js', '.jsx'];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (exts.includes(path.extname(e.name))) out.push(p);
  }
  return out;
}

function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])(\/\/.*)$/gm, '$1 ');
}

function resolveImport(spec, fromFile) {
  let target;
  if (spec.startsWith(alias)) target = path.join(SRC, spec.slice(alias.length));
  else if (spec.startsWith('.')) target = path.resolve(path.dirname(fromFile), spec);
  else return null; // external
  const cands = [];
  if (fs.existsSync(target) && fs.statSync(target).isFile()) cands.push(target);
  for (const x of exts) cands.push(target + x);
  for (const x of exts) cands.push(path.join(target, 'index' + x));
  for (const c of cands) if (fs.existsSync(c) && fs.statSync(c).isFile()) return path.resolve(c);
  return null;
}

const files = walk(SRC);
const graph = new Map();
const edgeRe = /(?:import|export)\b[^'";]*?from\s*['"]([^'"]+)['"]|export\s*\*\s*from\s*['"]([^'"]+)['"]/g;

for (const f of files) {
  const src = stripComments(fs.readFileSync(f, 'utf8'));
  const deps = new Set();
  let m;
  while ((m = edgeRe.exec(src))) {
    const spec = m[1] || m[2];
    if (!spec) continue;
    const r = resolveImport(spec, f);
    if (r) deps.add(r);
  }
  graph.set(path.resolve(f), deps);
}

const WHITE = 0, GRAY = 1, BLACK = 2;
const color = new Map();
const stack = [];
const cycles = [];
function dfs(node) {
  color.set(node, GRAY);
  stack.push(node);
  for (const dep of graph.get(node) || []) {
    const c = color.get(dep) || WHITE;
    if (c === WHITE) dfs(dep);
    else if (c === GRAY) {
      const idx = stack.indexOf(dep);
      if (idx >= 0) cycles.push(stack.slice(idx));
    }
  }
  color.set(node, BLACK);
  stack.pop();
}
for (const node of graph.keys()) if ((color.get(node) || WHITE) === WHITE) dfs(node);

const rel = (p) => path.relative(SRC, p).replace(/\\/g, '/');
if (cycles.length === 0) console.log('NO CIRCULAR IMPORTS FOUND (incl. export * barrels)');
else {
  console.log(`FOUND ${cycles.length} CYCLE(S):\n`);
  cycles.forEach((cy, i) => {
    console.log(`--- cycle ${i + 1} ---`);
    cy.forEach((n, j) => console.log(`  ${j === 0 ? '->' : ' '} ${rel(n)}`));
    console.log(`  -> ${rel(cy[0])}\n`);
  });
}
