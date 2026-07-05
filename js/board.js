// Hex board: geometry, generation, gravity, damage-hex population.
import { S, DATA } from "./state.js";

export const CKEYS = ["rhy", "ech", "key", "har", "dis"];

export const R = () => DATA.tuning.R;
export const H = () => Math.sqrt(3) * DATA.tuning.R; // flat-top hex height
export const px = q => 60 + q * 1.5 * R();
export const py = (q, r) => 46 + r * H() + (q % 2 ? H() / 2 : 0);

const randColor = () => CKEYS[Math.floor(Math.random() * CKEYS.length)];

function rollDamage() {
  let x = Math.random(), a = 0;
  for (const [v, p] of DATA.tuning.dmgTable) { a += p; if (x < a) return v; }
  return DATA.tuning.dmgTable[0][0];
}

export function makeTile(q, r, allowDmg) {
  const nDmg = S.tiles.filter(t => t.dmg).length;
  if (allowDmg && nDmg < DATA.tuning.dmgTarget && Math.random() < DATA.tuning.dmgSpawnChance)
    return { q, r, dmg: rollDamage() };
  return { q, r, c: randColor() };
}

export function buildBoard() {
  const { cols, rows, dmgTarget } = DATA.tuning;
  S.tiles = [];
  for (let q = 0; q < cols; q++)
    for (let r = 0; r < rows; r++) S.tiles.push(makeTile(q, r, true));
  // guarantee the target damage-hex count on a fresh board
  while (S.tiles.filter(t => t.dmg).length < dmgTarget) {
    const t = S.tiles[Math.floor(Math.random() * S.tiles.length)];
    if (!t.dmg) { delete t.c; t.dmg = rollDamage(); }
  }
}

export function neighbors(t) {
  const lim = (H() * 1.15) ** 2;
  return S.tiles.filter(o => {
    if (o === t) return false;
    const dx = px(o.q) - px(t.q), dy = py(o.q, o.r) - py(t.q, t.r);
    return dx * dx + dy * dy < lim;
  });
}

export function gravity() {
  const { cols, rows, dmgTarget } = DATA.tuning;
  for (let q = 0; q < cols; q++) {
    const col = S.tiles.filter(t => t.q === q).sort((a, b) => a.r - b.r);
    let r = rows - 1;
    for (let i = col.length - 1; i >= 0; i--) col[i].r = r--;
    while (r >= 0) S.tiles.push(makeTile(q, r--, true));
  }
  // keep the damage-hex floor alive: convert a top-row tile if we're short
  while (S.tiles.filter(t => t.dmg).length < dmgTarget) {
    const tops = S.tiles.filter(t => t.r === 0 && !t.dmg);
    if (!tops.length) break;
    const t = tops[Math.floor(Math.random() * tops.length)];
    delete t.c; t.dmg = rollDamage();
  }
}
