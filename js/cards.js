// Hand, charging, playing, discarding.
import { S, DATA } from "./state.js";
import { applyEffects, feedEnemy, checkEnd } from "./combat.js";
import { log, renderHand, renderStatus, renderEnemy } from "./render.js";

export function newCard() {
  const c = DATA.cards[Math.floor(Math.random() * DATA.cards.length)];
  return { ...c, charge: Object.fromEntries(Object.keys(c.cost).map(k => [k, 0])) };
}

export function dealHand() {
  S.hand = Array.from({ length: DATA.tuning.handSize }, newCard);
}

export const cardReady = c =>
  Object.keys(c.cost).every(k => c.charge[k] >= c.cost[k]);

export function playCard(i) {
  const c = S.hand[i];
  if (!cardReady(c) || S.over) return;
  log(`▶ ${c.nm}`);
  applyEffects(c.effects, false);
  S.hand[i] = newCard();
  renderHand(); renderStatus(); renderEnemy();
  checkEnd();
}

export function discard(i) {
  if (S.over) return;
  log(`Discarded ${S.hand[i].nm} — the enemy feeds (+${DATA.tuning.discardFeed}).`);
  S.hand[i] = newCard();
  feedEnemy(DATA.tuning.discardFeed, true);
  renderHand(); renderEnemy();
}
