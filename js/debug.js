// Live tuning panel. Edits DATA.tuning in place; most values apply instantly,
// clock/HP values apply on Restart.
import { DATA } from "./state.js";

const FIELDS = [
  ["clockStart",    "Clock (s)*"],
  ["windPerMove",   "Wind / move"],
  ["windPerSpill",  "Wind / off-colour"],
  ["discardWind",   "Discard wind"],
  ["dmgTarget",     "Damage hexes"],
  ["dmgSpawnChance","Hex spawn chance"],
  ["enrageHit",     "Enrage hit"],
  ["enrageEvery",   "Enrage every (s)"],
  ["playerHp",      "Player HP*"],
];

export function initDebug(restartFn) {
  const panel = document.getElementById("debugPanel");
  panel.innerHTML = "<h3>Tuning</h3>";
  for (const [key, label] of FIELDS) {
    const row = document.createElement("label");
    row.innerHTML = `<span>${label}</span>`;
    const inp = document.createElement("input");
    inp.type = "number"; inp.step = "any";
    inp.value = DATA.tuning[key];
    inp.onchange = () => { DATA.tuning[key] = parseFloat(inp.value) || 0; };
    row.appendChild(inp);
    panel.appendChild(row);
  }
  const ehpRow = document.createElement("label");
  ehpRow.innerHTML = "<span>Enemy HP*</span>";
  const ehpInp = document.createElement("input");
  ehpInp.type = "number"; ehpInp.value = DATA.enemies[0].hp;
  ehpInp.onchange = () => { DATA.enemies[0].hp = parseInt(ehpInp.value) || 1; };
  ehpRow.appendChild(ehpInp);
  panel.appendChild(ehpRow);

  const btn = document.createElement("button");
  btn.textContent = "Restart fight";
  btn.onclick = restartFn;
  panel.appendChild(btn);

  const hint = document.createElement("div");
  hint.className = "hint";
  hint.textContent = "* applies on restart. Others apply live.";
  panel.appendChild(hint);

  document.getElementById("debugBtn").onclick = () => {
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  };
}
