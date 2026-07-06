// Shared game state + data loading.
export const DATA = { tuning: null, cards: null, enemies: null };
export const S = {};

export async function loadData() {
  const j = p => fetch(p).then(r => r.json());
  [DATA.tuning, DATA.cards, DATA.enemies] = await Promise.all([
    j("data/tuning.json"), j("data/cards.json"), j("data/enemies.json"),
  ]);
}

export function resetState() {
  const T = DATA.tuning;
  const enemy = DATA.enemies[0];
  Object.assign(S, {
    tiles: [], hand: [], line: [], dots: [],
    php: T.playerHp, block: 0,
    ehp: enemy.hp,
    enemyName: enemy.name,
    ecards: enemy.cards.map(c => ({ ...c, t: c.timer })),
    clock: T.clockStart,
    enraged: false, enrageT: 0,
    drag: false, over: false,
  });
}
