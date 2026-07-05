# Color Pie — Draft 3
**Rhythm · Echo · Key · Harmony · Discord**
*(supersedes Draft 2 — the Faint tier is removed)*

## What changed and why

Draft 2 solved mono-viability with a third "Faint" tier on combat rows. Draft 3 replaces that entirely with a **board-level solution: damage hexes** — always-present special tiles that deal damage when swept into a line. The pie returns to the sharp two-tier scale everywhere (Major / minor / absent), and identities regain their Draft-1 edges.

The principle: **the only function every deck is guaranteed is offense, and it lives on the board, not in the cards.** A deck that cannot win is unplayable; a deck that defends badly is just aggressive. So damage gets a universal floor; healing, block, and cycling stay color-gated and remain real deckbuilding weaknesses.

---

## Damage hexes — core spec

**What they are.** Special tiles, always present on the board (target count per encounter, e.g. 2–4). Each shows a **variable damage value** — spawned from an encounter-defined table (e.g. values 2 / 4 / 7 at weights 70/25/5). The value is engraved on the tile; bigger numbers should *look* meatier.

**How they behave in lines.**
- **Pass-through:** any line may run through a damage hex regardless of color. They can **not** start or end a line — bookends must be true energy tiles, keeping the same-color rule pure.
- **Consumed on pickup:** including one in a line deals its damage to the enemy immediately and removes it. 
- **Never feed the enemy:** damage hexes do not count as unmatched tiles. They are exempt from spillover entirely.
- They occupy board space (displacing energy tiles), fall with gravity like everything else, and are replaced via the spawn system below.

**Their cost is geographic, not mechanical:** the detour. Two tiles off your efficient path to grab a strike is two tiles of payout you didn't take — and whatever is standing guard.

## Guarded placement — the intelligent population system

Damage hexes spawn **escorted**. When the board places a damage hex, negative hexes are biased into its neighborhood, scaled by value:

- **Low value (2):** usually unguarded. Free nibbles that keep every deck's offense alive.
- **Mid value (4):** ~1 negative hex among its 6 neighbors.
- **High value (7):** 2+ guards, nastier types. Treasure with teeth.

Simple implementation: when spawning a damage hex of value V, the next ⌊V/3⌋ negative-hex spawns are placed in its neighbor ring (falling back to normal placement if the ring is full). Refill inherits the bias: if a high-value hex survives a nearby clear, guards preferentially respawn around it.

**Negative hex examples** (from the existing "special tiles" stub — to be designed properly later): *Feeder* (adds enemy energy when swept into a line), *Cracked* (deals damage to YOU if consumed), *Static* (blocks lines from passing), *Leech* (drains an adjacent charged card while it sits there).

**What this buys:** every high-value strike is a micro-puzzle — thread the line to take the 7 without touching its Feeder escort, or eat the cost, or use tile manipulation to clear the guards first. And because everything obeys gravity, clearing lines *shifts the guard formation* — you can drop a guard away from its treasure. Positional play for free.

**Difficulty dials created:** spawn density, value table, guard ratio, guard nastiness — all per-encounter numbers. A damage-hex-starved fight is an attrition puzzle; a boss that corrupts damage hexes into Feeders is a nightmare; an act-3 elite whose guards are all Static walls turns harvesting into surgery.

## Per-color interactions (cards that touch the system)

The pie doesn't duplicate board damage — it *bends* it, each color in character:

| Color | Relationship with damage hexes |
|---|---|
| **Rhythm** | Amplifies: "damage hexes in your lines strike twice," "+2 to damage hexes on every 3rd line." Harvests harder than anyone. |
| **Echo** | Lingers: "the next damage hex you consume re-strikes after 8 seconds," or leaves a fading copy of itself. |
| **Key** | Positions: locks a damage hex in place against gravity; "reveal + relocate a damage hex"; unlocks guarded value safely. |
| **Harmony** | Abstains. No damage-hex cards — its offense floor is the same board everyone shares, and its pacifist card identity survives intact. (Its tile-manipulation minor tunes *energy* tiles only.) |
| **Discord** | Creates: smashes an energy tile into a damage hex (the most Discord card imaginable); detonates guards; converts a Feeder into a damage hex at a self-cost. |

---

## The grid (restored to sharp tiers)

**M** = major · **m** = minor · **—** = absent

| Mechanic | Rhythm | Echo | Key | Harmony | Discord |
|---|:---:|:---:|:---:|:---:|:---:|
| Direct damage (cards) | **M** | m | — | — | m |
| Healing | — | m | — | **M** | — |
| Block / shields | — | — | **M** | m | — |
| Card cycling / draw | **M** | — | — | m | m |
| Buffs | m | m | — | **M** | — |
| Debuffs / DoTs | — | **M** | m | — | m |
| Tile manipulation | — | — | m | m | **M** |
| Clock manipulation | — | m | **M** | — | — |
| Enemy-energy interaction | — | — | m | — | **M** |
| Discard synergy | — | m | — | — | **M** |
| Line modification | **M** | — | — | m | m |
| Information / scouting | — | m | **M** | — | — |
| Aggressive summons | m | **M** | — | — | m |
| Defensive summons | — | — | m | **M** | — |
| Utility summons | — | **M** | m | m | — |
| *Damage-hex interaction* | m | m | m | — | **M** |

*(New bottom row: cards that manipulate damage hexes. Discord owns creation; Rhythm/Echo/Key each get their flavored minor; Harmony abstains by design.)*

Majors per color: 3 / 3 / 3 / 3 / **4** — Discord's 4th major is deliberate and cheap: damage-hex interaction is B-tier utility, and Discord remains the self-cost color. If it overperforms, demote to minor and let "create a damage hex" cards live at higher rarity instead.

---

## Mono-color win paths, revised

Every mono deck now has guaranteed offense via the board. What separates them is *survival* and *tempo*:

- **Mono-Rhythm — the race.** Card damage plus double-harvested hexes; zero sustain. Fastest clock-beater in the game, folds if the fight goes long.
- **Mono-Echo — the infestation.** DoTs, summons, re-striking echo hexes. Slow and sticky; hates short timers, can't dig.
- **Mono-Key — the long game.** The clock major buys time; block holds the line; damage arrives by patiently unlocking and harvesting guarded hexes — the precise, measured playstyle the color always wanted. No awkward faint-damage cards needed.
- **Mono-Harmony — the choir outlasts.** The hardest mono, deliberately: its only offense is the shared board floor, unamplified. Nearly unkillable, wins very slowly, must respect enrage. The challenge-run color.
- **Mono-Discord — the gamble.** Manufactures its own damage hexes, steals enemy energy, pays in blood. Highest ceiling, most self-inflicted losses.

Target feel unchanged: mono viable, roughly one notch harder than pairs.

---

## Axes & pairs — unchanged from Draft 1

Harmony↔Discord (order/chaos) and Rhythm↔Key (drive/restraint) both survive intact; damage hexes actually *sharpen* Rhythm↔Key — same board floor, opposite harvesting philosophies (greedy sweeps vs. patient surgery). Pair archetype table carries over from Draft 2 unchanged.

## Playtest flags — updated

1. **Detour homogenization.** If damage hexes are too rich, every deck plays the same hex-vacuum game. Guards: low density, modest value table, energy payouts that genuinely compete. Watch whether distinct decks still draw distinct lines.
2. **Guard fairness.** Guarded placement must *read* — players should see the trap around the treasure at a glance. Guard hexes need loud silhouettes.
3. **Mono-Harmony misery check.** It's meant to be the hardest mono, not an unfun one. If it can't beat act 1 with good play, give Harmony a single rare "the swell" style scaler rather than reopening the faint tier.
4. **Discord's 4th major** — demote to minor if Discord's win-rate leads the pack (it also still carries the two S-tier majors and the self-cost tax).
5. **Feeder-corruption bosses** — the "corrupts damage hexes" encounter idea is strong but must be telegraphed hard, or it reads as the game lying about its own rules.
