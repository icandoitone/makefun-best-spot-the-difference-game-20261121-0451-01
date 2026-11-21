// Lantern Lane: mouse and keyboard play.
// One job: turn a click, a tap or a key press into a game action. It knows
// the canvases' geometry (client pixels to panel coordinates) and the
// keyboard map; the rules of what a click means live in game.js.
import { PANEL_W, PANEL_H } from './config.js';
import { tryClick, useHint, restartGame, nextScene, PHASE_PLAY, PHASE_SCENE_DONE, PHASE_WIN, PHASE_OVER, PHASE_TITLE, startGame } from './game.js';
import { isMuted, setMuted } from './audio.js';

/** Convert a pointer event on a panel canvas to panel coordinates. */
export function eventToPanelPoint(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * PANEL_W;
  const y = ((event.clientY - rect.top) / rect.height) * PANEL_H;
  return { x, y };
}

function flashWrongMarker(game, canvas) {
  if (game.wrongAt) game.wrongAt.panel = canvas.dataset.panel === '1' ? 1 : 0;
}

/**
 * Wire the two panel canvases and the buttons to the game. `ui` carries the
 * DOM the handler updates: onAction() is called after every action so the
 * HUD can refresh.
 */
export function bindInput(game, canvases, ui) {
  for (const canvas of canvases) {
    canvas.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      const point = eventToPanelPoint(event, canvas);
      const result = tryClick(game, point.x, point.y);
      if (result === 'wrong') flashWrongMarker(game, canvas);
      ui.onAction();
    });
    canvas.addEventListener('pointermove', (event) => {
      const point = eventToPanelPoint(event, canvas);
      game.crosshair = { ...point, panel: canvas.dataset.panel === '1' ? 1 : 0 };
    });
  }

  ui.hintButton.addEventListener('click', () => {
    useHint(game);
    ui.onAction();
  });
  ui.restartButton.addEventListener('click', () => {
    restartGame(game);
    ui.onAction();
  });
  ui.muteButton.addEventListener('click', () => {
    setMuted(!isMuted());
    ui.onAction();
  });
  ui.nextButton.addEventListener('click', () => {
    nextScene(game);
    ui.onAction();
  });
  ui.playAgainButton.addEventListener('click', () => {
    restartGame(game);
    ui.onAction();
  });
  ui.startButton.addEventListener('click', () => {
    startGame(game);
    ui.onAction();
  });

  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const step = event.shiftKey ? 24 : 8;
    const cross = game.crosshair;
    if (event.key === 'ArrowLeft') {
      cross.x = Math.max(0, cross.x - step);
      game.crosshairShown = true;
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      cross.x = Math.min(PANEL_W, cross.x + step);
      game.crosshairShown = true;
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      cross.y = Math.max(0, cross.y - step);
      game.crosshairShown = true;
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      cross.y = Math.min(PANEL_H, cross.y + step);
      game.crosshairShown = true;
      event.preventDefault();
    } else if (event.key === ' ' || event.key === 'Enter') {
      if (game.phase === PHASE_PLAY) {
        game.crosshairShown = true;
        const result = tryClick(game, cross.x, cross.y);
        if (result === 'wrong' && game.wrongAt) game.wrongAt.at = performance.now();
        ui.onAction();
      } else if (game.phase === PHASE_TITLE) {
        startGame(game);
        ui.onAction();
      } else if (game.phase === PHASE_SCENE_DONE) {
        nextScene(game);
        ui.onAction();
      } else if (game.phase === PHASE_WIN || game.phase === PHASE_OVER) {
        restartGame(game);
        ui.onAction();
      }
      event.preventDefault();
    } else if (event.key === 'h' || event.key === 'H') {
      useHint(game);
      ui.onAction();
    } else if (event.key === 'r' || event.key === 'R') {
      restartGame(game);
      ui.onAction();
    } else if (event.key === 'm' || event.key === 'M') {
      setMuted(!isMuted());
      ui.onAction();
    }
  });
}
