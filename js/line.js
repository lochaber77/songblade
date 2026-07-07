// Line drawing input + resolution. This file IS the core loop.
// Lines are omnidirectional: press a tile, drag at ANY angle, release on a
// same-colour tile. The segment runs centre-to-centre and the line consumes
// every hex the segment passes through.
import { S, DATA } from "./state.js";
import { gravity, px, py, R } from "./board.js";
import { dmgEnemy, windEnemy, checkEnd } from "./combat.js";
import { log, renderHand, renderEnemy, CNAMES } from "./render.js";
import { lineNote } from "./audio.js";

// All hexes the straight segment (x0,y0)→(x1,y1) passes through, in order.
// Hex centres form a Voronoi partition of the plane, so dense sampling with
// nearest-centre classification matches true hex containment.
export function tilesOnSegment(x0, y0, x1, y1) {
  const out = [];
  const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / (R() / 6)));
  for (let i = 0; i <= steps; i++) {
    const x = x0 + (x1 - x0) * i / steps, y = y0 + (y1 - y0) * i / steps;
    let best = null, bd = R() * R() * 1.05; // a hex point is at most R from centre
    for (const t of S.tiles) {
      const dx = x - px(t.q), dy = y - py(t.q, t.r);
      const d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = t; }
    }
    if (best && !out.includes(best)) out.push(best);
  }
  return out;
}

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

  // Recompute the previewed path: snap the free end to the hovered tile's
  // centre (that is what resolution will use), else follow the pointer.
  let sung = 0; // how many energy tiles the current drag has played notes for
  const preview = (x, y) => {
    const t = hit(x, y);
    S.term = t || null;
    const ex = t ? px(t.q) : x, ey = t ? py(t.q, t.r) : y;
    S.dragEnd = [ex, ey];
    S.line = tilesOnSegment(px(S.origin.q), py(S.origin.q, S.origin.r), ex, ey);
    // the line sings: one rising scale step per energy tile it gains
    const n = S.line.filter(o => !o.dmg).length;
    for (let i = sung + 1; i <= n; i++) lineNote(i, (i - sung - 1) * 0.05);
    sung = n;
  };

  const down = e => {
    e.preventDefault();
    if (S.over) return;
    const t = hit(...pos(e));
    if (t && !t.dmg) { // lines start on energy tiles only
      S.drag = true; S.origin = t; S.term = t;
      S.line = [t]; S.dragEnd = [px(t.q), py(t.q, t.r)];
      sung = 1; lineNote(1);
    }
  };
  const move = e => {
    if (!S.drag) return;
    e.preventDefault();
    preview(...pos(e));
  };
  const up = () => {
    if (!S.drag) return;
    S.drag = false;
    const o = S.origin, t = S.term;
    const ok = t && !t.dmg && t !== o && t.c === o.c; // energy bookends, same colour
    if (ok) resolveLine();
    else if (S.line.length > 1) log("Invalid line — must start and end on the same colour.");
    S.line = []; S.origin = null; S.term = null; S.dragEnd = null;
  };

  cv.addEventListener("mousedown", down);
  cv.addEventListener("mousemove", move);
  window.addEventListener("mouseup", up);
  cv.addEventListener("touchstart", down, { passive: false });
  cv.addEventListener("touchmove", move, { passive: false });
  cv.addEventListener("touchend", up);
}

function resolveLine() {
  const T = DATA.tuning;
  const line = S.line;
  const energy = line.filter(t => !t.dmg);
  const start = line[0]; // always an energy tile (bookend rule)
  let hexDmg = 0;

  for (const t of line) if (t.dmg) hexDmg += t.dmg; // damage hexes never spill

  // Only tiles of the bookend colour generate energy: each one charges EVERY
  // card in hand that still needs that colour (charged-but-full = lost).
  // Every OTHER energy tile spills — it winds the enemy's cards down.
  let spill = 0;
  for (const t of energy) {
    if (t.c !== start.c) { spill++; continue; }
    for (const card of S.hand)
      if (card.cost[start.c] !== undefined && card.charge[start.c] < card.cost[start.c])
        card.charge[start.c]++;
  }
  const matched = energy.length - spill;

  // Every resolved line is a "move" — it winds the enemy on its own,
  // plus more per spilled tile.
  const wind = T.windPerMove + spill * T.windPerSpill;

  let msg = `${CNAMES[start.c]} ×${matched}`;
  if (hexDmg) msg += ` · ⚔ ${hexDmg} damage`;
  msg += ` · winds enemy ${wind}`;
  log(msg);

  if (hexDmg) dmgEnemy(hexDmg);

  S.tiles = S.tiles.filter(t => !line.includes(t));
  gravity();

  windEnemy(wind, true);

  renderHand(); renderEnemy(); checkEnd();
}
