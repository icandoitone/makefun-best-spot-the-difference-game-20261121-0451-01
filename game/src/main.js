// Lantern Lane: the entry point.
// One job: wire the DOM to the game and run the frame loop. It collects
// the elements render.js and input.js need, starts the title screen (or a
// staged ?shot= scene for screenshots), and paints every animation frame.
import { createGame, tick, startScene, PHASE_TITLE } from './game.js';
import { bindInput } from './input.js';
import { renderPanels, renderHud } from './render.js';
import { stageShot } from './shots.js';
import { PANEL_W, PANEL_H } from './config.js';

const $ = (id) => document.getElementById(id);

const game = createGame();
try {
  game.best = Number(localStorage.getItem('lantern-lane-best') || 0);
} catch {
  game.best = 0;
}

const canvases = [document.getElementById('panel-left'), document.getElementById('panel-right')];
for (const canvas of canvases) {
  canvas.width = PANEL_W;
  canvas.height = PANEL_H;
}

const ui = {
  sceneName: $('scene-name'),
  timer: $('timer'),
  score: $('score'),
  best: $('best'),
  counter: $('counter'),
  counterProgress: $('counter-progress'),
  hintsLeft: $('hints-left'),
  hintButton: $('hint-button'),
  restartButton: $('restart-button'),
  muteButton: $('mute-button'),
  nextButton: $('next-button'),
  playAgainButton: $('play-again-button'),
  startButton: $('start-button'),
  message: $('message'),
  status: $('status'),
  titleOverlay: $('title-overlay'),
  sceneDoneOverlay: $('scene-done-overlay'),
  winOverlay: $('win-overlay'),
  overOverlay: $('over-overlay'),
  sceneDoneText: $('scene-done-text'),
  winText: $('win-text'),
  overText: $('over-text'),
  timeBar: $('time-bar'),
  onAction() {
    renderHud(game, ui, performance.now());
  },
};

bindInput(game, canvases, ui);

const params = new URLSearchParams(location.search);
const shot = params.get('shot');
if (shot) {
  stageShot(shot, game);
  document.body.classList.add('shot');
} else {
  startScene(game, 0);
  game.phase = PHASE_TITLE;
}

function frame(now) {
  tick(game, now);
  renderPanels(game, canvases, now);
  renderHud(game, ui, now);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
