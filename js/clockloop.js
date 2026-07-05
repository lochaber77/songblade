// Real-time systems: the clock, DoT ticks, enrage.
import { S, DATA } from "./state.js";
import { dmgEnemy, dmgPlayer, checkEnd } from "./combat.js";
import { log, renderClock, showEnrage } from "./render.js";

let last = performance.now();

export function startClock() {
  requestAnimationFrame(tick);
}

function tick(now) {
  const dt = (now - last) / 1000;
  last = now;
  if (!S.over && S.tiles.length) {
    S.clock = Math.max(0, S.clock - dt);

    for (const d of S.dots) {
      d.t -= dt;
      if (d.t <= 0 && d.left > 0) {
        d.left--; d.t = d.every;
        dmgEnemy(d.tick);
        log(`The wail bites for ${d.tick}.`);
      }
    }
    S.dots = S.dots.filter(d => d.left > 0);

    if (S.clock <= 0 && !S.enraged) {
      S.enraged = true;
      S.enrageT = DATA.tuning.enrageEvery;
      showEnrage();
      log("The song ends. The enemy is ENRAGED.");
    }
    if (S.enraged) {
      S.enrageT -= dt;
      if (S.enrageT <= 0) {
        S.enrageT = DATA.tuning.enrageEvery;
        dmgPlayer(DATA.tuning.enrageHit);
        log(`Enrage hits for ${DATA.tuning.enrageHit}!`);
      }
    }
    renderClock();
    checkEnd();
  }
  requestAnimationFrame(tick);
}
