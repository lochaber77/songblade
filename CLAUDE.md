# Songblade — Battle Prototype

## What this is
A web-based, no-engine prototype of the battle system for a roguelike TCG /
match-puzzle hybrid. Its ONLY job is to answer "is the core loop fun?" and to
find the right numbers. It is deliberately disposable — the real game will be
rebuilt in Godot later. Optimize for iteration speed, not architecture.

## The game in one paragraph
Real-time battles on a flat-top hex board (columns touch vertically; gravity
pulls straight down columns). The player drags STRAIGHT lines (no bends —
direction is fixed after the second tile) that must start AND end on the same
colour. Only tiles of the bookend colour generate energy — each one charges
every card in hand that needs that colour (excess to full cards is lost).
EVERY other energy tile in the line spills: it winds the enemy's cards down
(tuning.windPerSpill units, 3), and each resolved line winds them a flat
tuning.windPerMove (10) on its own. Enemy cards each carry a wind total
(units, per card in enemies.json — sized so roughly 10 enemy cards fire per
fight); at zero the card fires and its wind resets. Wind moves ONLY on
player actions, never in real time. A real-time clock still counts down; at
zero the enemy ENRAGES. Grey ⚔ damage hexes are pass-through tiles (can't start or
end a line, never spill) that deal their value when swept. Discarding a card
feeds the enemy.

## Authoritative sources
- /docs/color_pie_draft3.md — the five colours (Rhythm, Echo, Key, Harmony,
  Discord), mechanic ownership, damage-hex spec, guarded placement (not yet built)
- /docs/overworld_run_structure_draft1.md — future overworld layer (NOT in
  scope for this prototype)
- /docs/energy_tile_icons_v4.svg — tile art direction
When code and docs disagree, ask the user; the docs usually win.

## Hard rules
1. **No frameworks, no build step.** Vanilla ES modules + canvas only.
2. **All tunable numbers live in /data/*.json** — never hardcode a balance
   number in JS. New cards/enemies = new JSON entries, not new code, unless a
   genuinely new effect type is needed (then extend the interpreter in
   combat.js).
3. **No localStorage** unless explicitly requested; prefer export/import JSON
   for any persistence.
4. Keep files small and single-purpose. Current layout:
   - js/state.js  — shared state + data loading
   - js/board.js  — hex geometry, generation, gravity, damage-hex spawning
   - js/line.js   — input + line validation + resolution (THE core loop)
   - js/cards.js  — hand, charging, play/discard
   - js/combat.js — damage/heal/block/feed + declarative effect interpreter
   - js/clockloop.js — real-time clock, DoTs, enrage
   - js/render.js — all canvas + DOM rendering
   - js/debug.js  — live tuning panel
   - js/main.js   — boot wiring
5. Run with any static server (`npx serve` or `python3 -m http.server`);
   ES modules + fetch won't work from file://.

## Known deliberate omissions (don't "fix" unprompted)
Summons, enemy scripted phases/timers, guard placement around damage hexes,
hidden-information masks on enemy cards, a real deck (hand refills from a
random pool), ambush/initiative, meta-progression.

## Effect interpreter vocabulary (combat.js)
Player: damage, heal, block, time, dot{tick,every,times}, feed (winds the
enemy n units)
Enemy: attack, steal_time
Enemy cards have `wind` (units to fire), not an energy cost.
Add new types conservatively and document them here.
