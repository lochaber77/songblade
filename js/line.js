// Line drawing input + resolution. This file IS the core loop.
import { S } from "./state.js";
import { neighbors, gravity, px, py, R } from "./board.js";
import { dmgEnemy, feedEnemy, enemyTryFire, checkEnd } from "./combat.js";
import { log, renderHand, renderEnemy, CNAMES } from "./render.js";

export function setupInput(cv) {
  const pos = e => {
    const b = cv.getBoundingClientRect();
    const X = (e.touches ? e.touches[0].clientX : e.clientX) - b.left;
    const Y = (e.touches ? e.touches[0].clientY : e.clientY) - b.top;
    return [X * cv.width / b.width, Y * cv.height / b.height];
  };
  const hit = (x, y) => S.tiles.find(t => {
    const dx = x - px(t.q), dy = y - py(t.q, t.r);
    return dx * dx + dy * dy < R() * R() * 0.85;
  });

  const down = e => {
    e.preventDefault();
    if (S.over) return;
    const t = hit(...pos(e));
    if (t && !t.dmg) { S.drag = true; S.line = [t]; } // lines start on energy tiles only
  };
  const move = e => {
    if (!S.drag) return;
    e.preventDefault();
    const t = hit(...pos(e));
    if (!t) return;
    const L = S.line;
    if (t === L[L.length - 1]) return;
    if (L.length > 1 && t === L[L.length - 2]) { L.pop(); return; } // backtrack
    if (L.includes(t)) return;                                      // no revisits
    if (!neighbors(L[L.length - 1]).includes(t)) return;
    if (L.length > 1) {
      // straight lines only: the next step must continue the line's direction
      const a = L[L.length - 2], b = L[L.length - 1];
      const ex = 2 * px(b.q) - px(a.q), ey = 2 * py(b.q, b.r) - py(a.q, a.r);
      const dx = px(t.q) - ex, dy = py(t.q, t.r) - ey;
      if (dx * dx + dy * dy > R() * R() * 0.25) return;
    }
    L.push(t);
  };
  const up = () => {
    if (!S.drag) return;
    S.drag = false;
    const L = S.line, energy = L.filter(t => !t.dmg);
    const ok = L.length >= 2 && energy.length >= 2
      && !L[0].dmg && !L[L.length - 1].dmg          // bookends are energy tiles
      && L[0].c === L[L.length - 1].c;              // same-colour bookend rule
    if (ok) resolveLine();
    else if (L.length > 1) log("Invalid line — must start and end on the same colour.");
    S.line = [];
  };

  cv.addEventListener("mousedown", down);
  cv.addEventListener("mousemove", move);
  window.addEventListener("mouseup", up);
  cv.addEventListener("touchstart", down, { passive: false });
  cv.addEventListener("touchmove", move, { passive: false });
  cv.addEventListener("touchend", up);
}

function resolveLine() {
  const line = S.line;
  const energy = line.filter(t => !t.dmg);
  const start = energy[0];
  let spill = 0, hexDmg = 0;

  for (const t of line) if (t.dmg) hexDmg += t.dmg; // damage hexes never spill

  // Broadcast: one tile charges EVERY card in hand that still needs its colour.
  // Matched-but-full = lost. Colour absent from all costs = spillover.
  const grant = c => {
    let any = false, hasColor = false;
    for (const card of S.hand) {
      if (card.cost[c] !== undefined) {
        hasColor = true;
        if (card.charge[c] < card.cost[c]) { card.charge[c]++; any = true; }
      }
    }
    if (!any && !hasColor) spill++;
  };
  for (const t of energy) grant(t.c);

  // Start-colour scaling bonus: +1 per start-colour tile beyond the first.
  const n = energy.filter(t => t.c === start.c).length;
  for (let i = 0; i < n - 1; i++)
    for (const card of S.hand)
      if (card.cost[start.c] !== undefined && card.charge[start.c] < card.cost[start.c])
        card.charge[start.c]++;

  if (hexDmg) {
    dmgEnemy(hexDmg);
    log(`Damage hexes strike for ${hexDmg}!` + (spill ? ` Spillover ${spill}.` : ""));
  } else if (n > 1) {
    log(`${CNAMES[start.c]} line ×${energy.length} (bonus +${n - 1}).` + (spill ? ` Spillover ${spill}.` : ""));
  }

  S.tiles = S.tiles.filter(t => !line.includes(t));
  gravity();

  if (spill) feedEnemy(spill, false);
  else enemyTryFire();

  renderHand(); renderEnemy(); checkEnd();
}
