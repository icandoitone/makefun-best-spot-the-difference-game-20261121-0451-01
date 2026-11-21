// Lantern Lane: the staged scenes behind ?shot=… for screenshots.
// One job: put the real game into a photogenic state without faking
// anything. Each shot starts a fresh scene through the game's own rules
// and marks differences found through its own tryClick, so the frame is
// exactly what a player would see mid-game: gold rings on the found
// differences, several still unfound, and the counter showing how many
// remain. The same seed always gives the same frame.
import { startScene, tryClick, PHASE_PLAY, PHASE_SCENE_DONE } from './game.js';
import { SCENES } from './scenes.js';

/**
 * Stage the named shot on `game` and return the phase the page should show:
 * - cover: scene 1, three differences found, four left, 2:05 on the clock
 * - play:  scene 2, two found, five left, 1:40 on the clock
 * - pond:  scene 3, four found, three left, 1:12 on the clock
 * - win:   scene 1, all seven found, the scene-complete overlay up
 * Anything else is the title screen.
 */
export function stageShot(name, game) {
  const plan = {
    cover: { scene: 0, found: 3, timeLeft: 125, phase: PHASE_PLAY },
    play: { scene: 1, found: 2, timeLeft: 100, phase: PHASE_PLAY },
    pond: { scene: 2, found: 4, timeLeft: 72, phase: PHASE_PLAY },
    win: { scene: 0, found: 7, timeLeft: 96, phase: PHASE_SCENE_DONE },
  }[name];
  if (!plan) return PHASE_PLAY;

  startScene(game, plan.scene);
  game.timeLeft = plan.timeLeft;
  game.score = 0;
  const scene = SCENES[plan.scene];
  for (let i = 0; i < plan.found; i += 1) {
    const diff = scene.differences[i];
    tryClick(game, diff.x, diff.y);
  }
  // The staged finds earned points and messages; keep the points, drop the
  // toast so the shot is clean, and hold the clock where the plan puts it.
  game.message = '';
  game.messageUntil = 0;
  game.timeLeft = plan.timeLeft;
  if (plan.phase === PHASE_SCENE_DONE) {
    game.phase = PHASE_SCENE_DONE;
    game.message = `Scene complete! Time bonus +${Math.round(game.timeLeft) * 2}`;
    game.messageUntil = performance.now() + 4000;
  }
  return game.phase;
}
