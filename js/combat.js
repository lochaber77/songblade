// Combat plumbing + the declarative effect interpreter.
import { S, DATA } from "./state.js";
import { log, renderEnemy, renderStatus, setFlash, showOverlay } from "./render.js";

export function dmgEnemy(n) {
  S.ehp = Math.max(0, S.ehp - n);
  setFlash("#e8c060");
  renderEnemy();
}

export function dmgPlayer(n) {
  const b = Math.min(S.block, n);
  S.block -= b; n -= b;
  if (b) log(`Block absorbs ${b}.`);
  S.php = Math.max(0, S.php - n);
  renderStatus();
}

export function heal(n) {
  S.php = Math.min(DATA.tuning.playerHp, S.php + n);
  renderStatus();
}

// Wind every enemy card's timer down by `sec` seconds. Cards fire at zero
// and their timer resets (overshoot carries over, so a huge wind can fire
// a card more than once).
export function windEnemy(sec, silent) {
  if (sec <= 0 || S.over) return;
  for (const ec of S.ecards) ec.t -= sec;
  if (!silent) log(`Enemy timers wind down ${sec.toFixed(1)}s.`);
  fireReady();
  renderEnemy();
}

export function fireReady() {
  let fired = true;
  while (fired && !S.over) {
    fired = false;
    for (const ec of S.ecards) {
      if (ec.t <= 0) {
        ec.t += Math.max(ec.timer, 0.5); // reset; floor guards a 0s timer
        log(`⚔ Enemy plays ${ec.nm}!`);
        applyEffects(ec.effects, true);
        fired = true;
        break;
      }
    }
  }
  checkEnd();
}

// One interpreter for both sides; card/enemy JSON stays declarative.
export function applyEffects(effects, isEnemy) {
  for (const e of effects) {
    switch (e.type) {
      case "damage":     dmgEnemy(e.n); break;
      case "heal":       heal(e.n); log(`Healed ${e.n}.`); break;
      case "block":      S.block += e.n; log(`Block +${e.n}`); renderStatus(); break;
      case "time":       S.clock += e.n; log(`+${e.n} seconds!`); break;
      case "dot":        S.dots.push({ tick: e.tick, every: e.every, left: e.times, t: e.every });
                         log("A wail lingers…"); break;
      case "feed":       windEnemy(e.n, true); log(`Enemy timers −${e.n}s!`); break;
      case "attack":     dmgPlayer(e.n); break;
      case "steal_time": S.clock = Math.max(0, S.clock - e.n);
                         log(`It steals ${e.n} seconds!`); break;
      default: console.warn("Unknown effect", e);
    }
  }
}

export function checkEnd() {
  if (S.over) return;
  if (S.ehp <= 0) { S.over = true; showOverlay("VICTORY", "The chorister falls silent."); }
  else if (S.php <= 0) { S.over = true; showOverlay("DEFEAT", "Your song is unfinished."); }
}
