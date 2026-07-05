# Overworld & Run Structure — Draft 1
*Step-based isometric overworld · real-time combat · "the world is quiet until the music starts"*

## Core loop of the layer

The world advances in lockstep: **one player step = one world step.** Mobs patrol deterministically, sight is exact tile geometry, and the overworld plays as a calm routing-and-stealth puzzle between clocked fights. Thinking is free out here by design — this is the exhale layer.

---

## 1. Mob behavior archetypes (the literacy system)

Every mob **species** has one fixed, deterministic movement archetype. Players learn species behavior once and own that knowledge forever — the overworld twin of the combat bestiary. Same philosophy as enemy scripts and hidden cards: **knowledge is the progression.**

Starter roster of archetypes:

| Archetype | Behavior | Teaches |
|---|---|---|
| **Sentry** | Stationary; rotates facing 90° per step in a fixed cycle | Timing a dash through a gaze |
| **Looper** | Walks a fixed closed patrol route | Route memorization, safe shadows |
| **Pacer** | Walks a line, reverses at the ends | The rhythm of a corridor |
| **Drifter** | Steps in a repeating pattern (e.g. N-N-E-S), wrapping the zone | Prediction over memorization |
| **Sleeper** | Dormant until player steps within N tiles; wakes with loud telegraph, becomes a Chaser for X steps | Distance management, bait plays |
| **Chaser** | Moves 1 step toward player when player is in sight cone; loses interest after X steps unseen | Kiting, line-of-sight breaks |
| **Warden** | Looper that guards a treasure/exit; never leaves a radius | Risk/reward around loot |
| **Herald** | Flees toward the nearest mob when it spots you; if it reaches one, that battle gains a second enemy or an alarm buff | Priority targeting, the "kill the runner" dilemma |

Rules of the roster: archetypes are **species-locked** (the crab-thing always Paces; the eye-thing is always a Sentry), never randomized per-instance — determinism is the whole promise. Variety comes from *composition* (which species, where) not from behavioral noise. Elites may combine two archetypes (a Sleeper-Warden guarding a chest) — telegraphed by visibly hybrid art.

## 2. Sight & initiative (the bridge into combat)

**Sight cones** are exact and visible-on-demand: each species has a cone (e.g. 90° forward) and a range in tiles (e.g. 3–5), blocked by walls/obstacles. A toggle or artifact shows cones; base game shows facing clearly at minimum.

Contact resolution, checked every step:

- **SPOTTED** — you enter a mob's cone: battle starts with **enemy advantage**: enemy begins with a pool of starting energy (per-species amount, e.g. 15–30% of its cheapest card).
- **AMBUSH** — you step onto/adjacent to a mob from outside its cone: battle starts with **player advantage**, choose one on contact:
  - **Tempo:** +20 seconds banked on the fight clock, or
  - **Insight:** enemy's card masks revealed for this fight, or
  - **Overture:** one random card in your opening hand starts 50% charged.
- **COLLIDE** — mutual/simultaneous or ambiguous contact: neutral start.

(The choose-one keeps ambushes exciting for every deck: Key decks take Insight, Rhythm takes Tempo, etc. If choice feels heavy, lock each advantage to *how* you ambushed later — rear = Tempo, from cover = Insight.)

**Fleeing:** stepping away from a Chaser that hasn't cornered you is legal; being caught from behind = Spotted-tier disadvantage. No mid-battle flee (combat is committed once the music starts) — revisit if testing wants an escape artifact.

## 3. Zone anatomy

Zones are **handcrafted small maps** (roughly 20×20 to 30×30 tiles of walkable space) with **procedurally assigned contents** — the Hades model: authored geometry, variable population.

Standard zone contents, placed by the populator:
- 3–6 mobs (species mix drawn from the act's roster)
- 1 treasure (guarded — Warden or geographic risk)
- 1 exit (sometimes 2, forking the run)
- 0–1 event tile (shrine, NPC, forge — the "?" node equivalent)
- 0–1 elite (higher-value guaranteed drop, hybrid archetype, visibly marked)

**Local pressure only, no global overworld clock:** the calm layer stays calm. Pressure spikes are geographic — Heralds, tight corridors, a zone where the treasure sits inside three overlapping cones. (A soft anti-dawdle rule can exist invisibly: mobs never despawn, nothing regenerates, so there is simply nothing to farm by waiting.)

**Fights are chosen, not gated:** most mobs are avoidable with skill. The economy makes avoidance costly — skipped fights are skipped card rewards and gold. Target: a skilled player *can* ghost a zone fighting only the elite; a typical run fights 60–80% of encountered mobs.

## 4. Act & run skeleton (first numbers to test)

- **Run = 3 acts.** Act = **4 zones + boss zone.** With ~2 forks per act, routes differ meaningfully run to run.
- **Act rosters:** each act introduces 2–3 new mob species (new archetypes or nastier stats) plus carries some forward. Act 1 uses only Sentry/Looper/Pacer species — the readable teachers. Sleepers and Heralds arrive in Act 2. Act 3 composes cruel combinations.
- **Boss zones** are set-pieces: a short authored gauntlet (2–3 unavoidable minion packs max, or a pure walk) into the boss battle. Bosses are never ambushable by default — earning a boss ambush can be a rare artifact/event payoff.
- **Target run length: 60–90 minutes.** Rough budget: ~12–14 battles × 3–5 min + overworld navigation + reward screens. Tune zone size down before tuning fight count down if runs bloat.

## 5. Rewards & the artifact space

- **Battle rewards:** card pick (3 offered), gold, occasional consumable. Elites: guaranteed artifact. Bosses: artifact + rare card pick + full heal (tunable).
- **Overworld treasure:** gold, consumables, sometimes cards — the *guarded* chests carry artifacts.
- **Artifacts now split into two clean families:**
  - **Combat artifacts** — touch the fight (start with shield, first line each battle pays double, etc.)
  - **Overworld artifacts** — the new design space this layer bought: sight-range reducer (cloak), +1 step per world step (boots, mobs move every 2nd step), a lure consumable (pulls nearest mob 5 tiles), cone-visualizer (monocle), "first Sleeper per zone never wakes," Herald-silencer, treasure-sense, one free disengage per act...
- Overworld artifacts are balance-cheap (they never touch combat math) — be generous here; it's where run-to-run texture lives.

## 6. Scope guardrails (the ship-it clauses)

1. Overworld verbs are **walk, see, touch. Nothing else.** No overworld combat, pushing, switches-and-doors logic beyond keys, or physics. Every new verb here is a week of code.
2. Geometry is authored, population is procedural. No procgen level layout in v1.
3. Prototype the whole layer as **colored squares on a grid** before any iso art exists. The puzzle must be fun as rectangles or it isn't fun.
4. Iso is a *camera and art* decision, not a systems one — build logic on a plain grid; skin it isometric later. (Godot tilemaps support this split natively.)
5. Step animation gets juice (hop-tweens, ~0.1s), not systems. Stiffness is an animation problem, never a reason to go real-time.

## Playtest flags

1. **Ghost-run viability** — if avoiding everything is both easy and correct, the economy is broken. Watch fight-rate.
2. **Advantage swing** — Spotted vs. Ambush must matter without deciding fights outright. If ambush advantage decides >~15% of battle outcomes on its own, shrink it.
3. **Cone readability** — players must never feel spotted "unfairly." When in doubt, make cones visible by default.
4. **Herald rage** — the runner mob will generate the strongest emotions in the game. That's its job; make sure it's *catchable* with good play.
5. **Zone reuse fatigue** — handcrafted zones repeat across runs; if fatigue appears, add zone variants (same geometry, altered obstacle placement) before considering procgen.
