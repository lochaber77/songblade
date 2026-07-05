// Boot: load data, wire modules, start the fight.
import { loadData, resetState } from "./state.js";
import { buildBoard } from "./board.js";
import { dealHand } from "./cards.js";
import { setupInput } from "./line.js";
import { initRender, renderHand, renderEnemy, renderStatus, renderClock, hideOverlay, log } from "./render.js";
import { startClock } from "./clockloop.js";
import { initDebug } from "./debug.js";

function initFight() {
  resetState();
  buildBoard();
  dealHand();
  hideOverlay();
  renderHand(); renderEnemy(); renderStatus(); renderClock();
  log("Drag a line: start and end on the same colour. ⚔ tiles are damage hexes.");
}

async function boot() {
  await loadData();
  const canvas = document.getElementById("board");
  initRender(canvas);
  setupInput(canvas);
  initDebug(initFight);
  document.getElementById("restartBtn").onclick = initFight;
  initFight();
  startClock();
}

boot().catch(e => {
  document.getElementById("log").textContent =
    "Failed to load — run this from a local server (see README). " + e;
});
