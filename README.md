# Songblade — Battle Prototype

A no-engine prototype of the battle system.

**Play it live: https://lochaber77.github.io/songblade/** (works on phones —
pushes to `main` redeploy it automatically in a minute or two).

## Run it locally

From this folder, either:

    npx serve

or

    python3 -m http.server 8000

then open the printed URL (e.g. http://localhost:8000) in a browser.
(A local server is required because ES modules and JSON fetches don't work
from file:// — it only serves files to your own browser.)

## Play it

- **Drag** across adjacent hexes to draw a **straight line** (no bends). It
  must **start and end on the same colour**. Drag backwards to undo steps.
- Matched colours charge **every** card in your hand that needs them; the
  **starting colour** gets a scaling bonus (+1 per extra start-colour tile).
- Colours **no card in your hand uses** feed the enemy's energy **and skip
  the clock forward**. Watch the enemy's card bars fill.
- Grey **⚔ tiles** are damage hexes: sweep them mid-line for free damage.
  They can't start or end a line and never feed the enemy.
- **✕** on a card discards it (feeds the enemy). Glowing cards are ready —
  click to play.
- At **0:00** the enemy enrages and hits hard on a loop. Kill it first.

## Tune it

Click the **⚙** in the clock panel for live sliders (clock length, spillover
skip, damage-hex density, enrage, HP…). Values marked * apply on restart;
the rest apply live. Persistent changes go in `data/tuning.json`; new cards
and enemies go in `data/cards.json` / `data/enemies.json` — no code needed.

## What to evaluate

1. Does drawing lines feel good as a pure verb?
2. Do you *feel* spillover stealing your seconds?
3. Does the greed dilemma show up — hesitating over long lines?
4. Does the enemy's filling card bar create dread?

## Project layout

    index.html            page shell
    css/style.css
    js/                   ES modules (see CLAUDE.md for the map)
    data/                 ALL tunable numbers, cards, enemies (edit freely)
    docs/                 design documents — the authoritative specs
    CLAUDE.md             standing brief for Claude Code sessions
