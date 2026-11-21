# makefun-best-spot-the-difference-game-20261121-0451-01

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/icandoitone/makefun-best-spot-the-difference-game-20261121-0451-01/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/icandoitone/makefun-best-spot-the-difference-game-20261121-0451-01/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Lantern Lane** is an original spot-the-difference game that plays offline in a desktop browser from static files — no build step, no network requests, no borrowed art, names or sounds. Two near-identical pictures hang side by side in the lantern light; seven little things differ between them. Find them all before the lanterns burn down.

Three hand-drawn scenes (every pixel is procedural canvas art): a night market stall under paper lanterns, a koi pond garden, and a starlit rooftop. Each scene has 7 differences, a 2:30 timer, a score with time bonuses, 3 hints, wrong-click penalties, keyboard play (arrow keys + Space, H for hint, R to restart, M to mute), WebAudio chimes synthesised in code, a scene-complete state, a win screen and a restart.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## Hand in

`main.ts` (Node 22, standard library only) copies `game/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=f30pc5fq&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
