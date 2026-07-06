// All drawing + DOM rendering.
import { S, DATA } from "./state.js";
import { px, py, R } from "./board.js";
import { playCard, discard, cardReady } from "./cards.js";

export const COLORS = { rhy: "#C6383B", ech: "#6C4F9E", key: "#4E7A96", har: "#CE9A2C", dis: "#5E7F1F" };
export const CNAMES = { rhy: "Rhythm", ech: "Echo", key: "Key", har: "Harmony", dis: "Discord" };

let cv, cx, flash = null;

export function initRender(canvas) {
  cv = canvas; cx = canvas.getContext("2d");
  requestAnimationFrame(draw);
}
export const setFlash = c => { flash = c; };

function hexPath(x, y, r) {
  cx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 180 * (60 * i);
    const X = x + r * Math.cos(a), Y = y + r * Math.sin(a);
    i ? cx.lineTo(X, Y) : cx.moveTo(X, Y);
  }
  cx.closePath();
}

function drawGlyph(t, x, y) {
  cx.strokeStyle = "rgba(255,255,255,.75)";
  cx.fillStyle = "rgba(255,255,255,.75)";
  cx.lineWidth = 3; cx.lineCap = "round"; cx.lineJoin = "round";
  cx.beginPath();
  if (t.c === "rhy") { // pulse
    cx.moveTo(x - 16, y + 2); cx.lineTo(x - 8, y + 2); cx.lineTo(x - 4, y - 11);
    cx.lineTo(x + 2, y + 12); cx.lineTo(x + 7, y - 5); cx.lineTo(x + 10, y + 2); cx.lineTo(x + 16, y + 2);
    cx.stroke();
  } else if (t.c === "ech") { // dot + radiating arcs
    cx.arc(x - 10, y, 2.5, 0, 7); cx.fill();
    for (const r of [7, 13, 19]) { cx.beginPath(); cx.arc(x - 10, y, r, -0.95, 0.95); cx.stroke(); }
  } else if (t.c === "key") { // simplified treble clef
    cx.moveTo(x - 1, y + 14);
    cx.quadraticCurveTo(x - 9, y + 14, x - 4, y + 8);
    cx.lineTo(x + 1, y - 12);
    cx.quadraticCurveTo(x + 2, y - 18, x + 7, y - 14);
    cx.quadraticCurveTo(x + 10, y - 8, x - 3, y - 1);
    cx.quadraticCurveTo(x - 9, y + 4, x - 2, y + 7);
    cx.quadraticCurveTo(x + 6, y + 9, x + 5, y + 2);
    cx.stroke();
  } else if (t.c === "har") { // beamed pair
    cx.moveTo(x - 9, y + 9); cx.lineTo(x - 9, y - 8);
    cx.moveTo(x + 9, y + 6); cx.lineTo(x + 9, y - 11);
    cx.moveTo(x - 9, y - 8); cx.lineTo(x + 9, y - 11);
    cx.stroke();
    cx.beginPath(); cx.ellipse(x - 12, y + 9, 5, 3.6, -0.3, 0, 7); cx.fill();
    cx.beginPath(); cx.ellipse(x + 6, y + 6, 5, 3.6, -0.3, 0, 7); cx.fill();
  } else if (t.c === "dis") { // inverted, snapped note
    cx.ellipse(x - 7, y - 10, 5, 3.6, -0.3, 0, 7); cx.fill();
    cx.beginPath();
    cx.moveTo(x - 2, y - 9); cx.lineTo(x - 2, y - 2);
    cx.moveTo(x + 5, y + 5); cx.lineTo(x + 5, y + 13);
    cx.quadraticCurveTo(x + 13, y + 9, x + 9, y + 3);
    cx.stroke();
  }
}

function draw() {
  cx.clearRect(0, 0, cv.width, cv.height);
  for (const t of S.tiles || []) {
    const x = px(t.q), y = py(t.q, t.r);
    const sel = S.line.includes(t);
    hexPath(x, y, R() - 2);
    if (t.dmg) {
      cx.fillStyle = sel ? "#8a8a96" : "#55555f"; cx.fill();
      cx.strokeStyle = "#2b2b33"; cx.lineWidth = 3; cx.stroke();
      cx.fillStyle = "#fff"; cx.font = "bold 20px Georgia";
      cx.textAlign = "center"; cx.textBaseline = "middle";
      cx.fillText("⚔" + t.dmg, x, y);
    } else {
      cx.fillStyle = COLORS[t.c]; cx.fill();
      cx.strokeStyle = sel ? "#ffffff" : "#00000055"; cx.lineWidth = sel ? 4 : 3; cx.stroke();
      drawGlyph(t, x, y);
    }
    if (sel) { hexPath(x, y, R() - 2); cx.fillStyle = "rgba(255,255,255,.18)"; cx.fill(); }
  }
  if (S.line.length > 1) {
    cx.beginPath(); cx.lineWidth = 6; cx.strokeStyle = "rgba(255,255,255,.85)";
    cx.lineCap = "round"; cx.lineJoin = "round";
    S.line.forEach((t, i) => {
      const x = px(t.q), y = py(t.q, t.r);
      i ? cx.lineTo(x, y) : cx.moveTo(x, y);
    });
    cx.stroke();
  }
  if (flash) { cx.fillStyle = flash + "22"; cx.fillRect(0, 0, cv.width, cv.height); flash = null; }
  requestAnimationFrame(draw);
}

/* ---------- DOM ---------- */
const $ = id => document.getElementById(id);

export function renderHand() {
  const h = $("hand"); h.innerHTML = "";
  S.hand.forEach((c, i) => {
    const d = document.createElement("div");
    d.className = "card" + (cardReady(c) ? " ready" : "");
    let pips = "";
    for (const k of Object.keys(c.cost))
      for (let j = 0; j < c.cost[k]; j++)
        pips += `<div class="pip ${j < c.charge[k] ? "f" : ""}" style="background:${COLORS[k]}"></div>`;
    d.innerHTML = `<div class="disc" title="Discard (feeds enemy ${DATA.tuning.discardFeed})">✕</div>
      <div class="nm">${c.nm}</div><div class="fx">${c.fx}</div><div class="pips">${pips}</div>`;
    d.querySelector(".disc").onclick = e => { e.stopPropagation(); discard(i); };
    d.onclick = () => playCard(i);
    h.appendChild(d);
  });
}

export function renderEnemy() {
  $("ename").textContent = S.enemyName;
  document.querySelector("#ehp .bar").style.width = (100 * S.ehp / DATA.enemies[0].hp) + "%";
  $("ehpTxt").textContent = S.ehp + " / " + DATA.enemies[0].hp;
  const box = $("ecards"); box.innerHTML = "";
  for (const ec of S.ecards) {
    const left = Math.max(0, Math.ceil(ec.t));
    const pct = Math.min(100, 100 * left / ec.wind);
    const d = document.createElement("div");
    d.className = "ecard" + (left <= DATA.tuning.windPerMove ? " ready" : "");
    d.innerHTML = `<b>${ec.nm}</b> — ${ec.fx}
      <div class="barWrap"><div class="bar" style="width:${pct}%"></div></div>
      <span style="color:#8f8f9c">fires in ${left} wind</span>`;
    box.appendChild(d);
  }
}

export function renderStatus() {
  document.querySelector("#php .bar").style.width = (100 * S.php / DATA.tuning.playerHp) + "%";
  $("phpTxt").textContent = S.php + " / " + DATA.tuning.playerHp;
  $("blockTag").textContent = S.block ? ("🛡 " + S.block) : "";
}

export function renderClock() {
  const c = $("clock");
  const m = Math.floor(S.clock / 60), s = Math.floor(S.clock % 60);
  c.textContent = m + ":" + String(s).padStart(2, "0");
  c.className = S.clock < 30 ? "low" : "";
  $("clockNote").textContent = `each move winds the enemy ${DATA.tuning.windPerMove} · off-colour tiles ${DATA.tuning.windPerSpill} each`;
}

export const log = m => { $("log").textContent = m; };

export function showEnrage() { $("enrageBanner").style.display = "block"; }

export function showOverlay(title, sub) {
  $("ovTitle").textContent = title;
  $("ovSub").textContent = sub;
  $("overlay").style.display = "flex";
}
export function hideOverlay() {
  $("overlay").style.display = "none";
  $("enrageBanner").style.display = "none";
}
