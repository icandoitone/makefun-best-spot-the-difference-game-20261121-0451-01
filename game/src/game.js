// Lantern Lane: the game state and its rules.
// One job: what the game is doing right now. It owns the scene index, the
// found differences, the timer, the score and the hints, and answers the
// questions the renderer and the input handler ask. It draws nothing and
// reads no input.
import { SCENES } from './scenes.js';
import {
  DIFFERENCES_PER_SCENE,
  POINTS_PER_FIND,
  POINTS_WRONG_CLICK,
  POINTS_HINT,
  TIME_PENALTY_SECONDS,
  MAX_HINTS_PER_SCENE,
  SCENE_TIME_SECONDS,
} from './config.js';
import { playFound, playWrong, playHint, playWin } from './audio.js';

export const PHASE_TITLE = 'title';
export const PHASE_PLAY = 'play';
export const PHASE_SCENE_DONE = 'scene-done';
export const PHASE_WIN = 'win';
export const PHASE_OVER = 'over';

export function createGame() {
  return {
    phase: PHASE_TITLE,
    sceneIndex: 0,
    found: new Set(),
    hintsUsed: 0,
    hintSpot: null,
    hintUntil: 0,
    score: 0,
    best: 0,
    timeLeft: SCENE_TIME_SECONDS,
    lastTick: 0,
    message: '',
    messageUntil: 0,
    wrongAt: null,
    wrongUntil: 0,
    crosshair: { x: 280, y: 210, panel: 0 },
    crosshairShown: false,
    startedAt: 0,
  };
}

export function currentScene(game) {
  return SCENES[game.sceneIndex];
}

export function foundCount(game) {
  return game.found.size;
}

export function remainingCount(game) {
  return DIFFERENCES_PER_SCENE - game.found.size;
}

export function startScene(game, index) {
  game.sceneIndex = index;
  game.found = new Set();
  game.hintsUsed = 0;
  game.hintSpot = null;
  game.timeLeft = SCENE_TIME_SECONDS;
  game.phase = PHASE_PLAY;
  game.message = currentScene(game).intro;
  game.messageUntil = performance.now() + 2600;
  game.startedAt = performance.now();
  game.lastTick = performance.now();
}

export function startGame(game) {
  game.score = 0;
  startScene(game, 0);
}

export function restartGame(game) {
  startGame(game);
}

export function nextScene(game) {
  if (game.sceneIndex + 1 < SCENES.length) {
    startScene(game, game.sceneIndex + 1);
    return true;
  }
  return false;
}

/** Advance the clock; called once per animation frame. */
export function tick(game, now) {
  if (game.phase !== PHASE_PLAY) {
    game.lastTick = now;
    return;
  }
  const dt = Math.min(1, (now - game.lastTick) / 1000);
  game.lastTick = now;
  game.timeLeft -= dt;
  if (game.hintSpot && now > game.hintUntil) game.hintSpot = null;
  if (game.timeLeft <= 0) {
    game.timeLeft = 0;
    game.phase = PHASE_OVER;
    game.message = 'Time ran out!';
  }
}

function showMessage(game, text, ms = 2200) {
  game.message = text;
  game.messageUntil = performance.now() + ms;
}

/**
 * Try the point (x, y) in panel coordinates. Returns 'found', 'wrong' or
 * 'already' (an already-found difference was clicked again).
 */
export function tryClick(game, x, y) {
  if (game.phase !== PHASE_PLAY) return 'idle';
  const scene = currentScene(game);
  for (const diff of scene.differences) {
    const dx = x - diff.x;
    const dy = y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) {
      if (game.found.has(diff.id)) return 'already';
      game.found.add(diff.id);
      game.score += POINTS_PER_FIND;
      playFound();
      showMessage(game, `Found! ${diff.label}  (+${POINTS_PER_FIND})`);
      if (game.found.size === DIFFERENCES_PER_SCENE) {
        const bonus = Math.round(game.timeLeft) * 2;
        game.score += bonus;
        playWin();
        if (game.sceneIndex + 1 < SCENES.length) {
          game.phase = PHASE_SCENE_DONE;
          showMessage(game, `Scene complete! Time bonus +${bonus}`, 4000);
        } else {
          game.phase = PHASE_WIN;
          game.best = Math.max(game.best, game.score);
          try {
            const stored = Number(localStorage.getItem('lantern-lane-best') || 0);
            game.best = Math.max(stored, game.score);
            localStorage.setItem('lantern-lane-best', String(game.best));
          } catch {
            // Storage may be unavailable; the best score is a nicety.
          }
        }
      }
      return 'found';
    }
  }
  game.score += POINTS_WRONG_CLICK;
  game.timeLeft = Math.max(0, game.timeLeft - TIME_PENALTY_SECONDS);
  game.wrongAt = { x, y, panel: 0, at: performance.now() };
  game.wrongUntil = performance.now() + 500;
  playWrong();
  showMessage(game, `Not a difference. -${TIME_PENALTY_SECONDS}s, ${POINTS_WRONG_CLICK} pts`);
  return 'wrong';
}

/** Flash a pulsing ring around one unfound difference. Costs points. */
export function useHint(game) {
  if (game.phase !== PHASE_PLAY) return false;
  if (game.hintsUsed >= MAX_HINTS_PER_SCENE) {
    showMessage(game, 'No hints left in this scene');
    return false;
  }
  const scene = currentScene(game);
  const unfound = scene.differences.filter((d) => !game.found.has(d.id));
  if (unfound.length === 0) return false;
  const pick = unfound[Math.floor(Math.random() * unfound.length)];
  game.hintsUsed += 1;
  game.score += POINTS_HINT;
  game.hintSpot = pick;
  game.hintUntil = performance.now() + 1800;
  playHint();
  showMessage(game, `Hint: look near the ${pick.label.toLowerCase()}… (${POINTS_HINT} pts)`, 1800);
  return true;
}
