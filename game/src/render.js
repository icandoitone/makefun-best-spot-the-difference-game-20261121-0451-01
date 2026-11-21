// Lantern Lane: everything the player sees.
// One job: paint the two panels and keep the HUD and overlays in step with
// the game state. The pictures themselves are drawn by art.js; this file
// adds the found-difference rings, the hint pulse, the wrong-click cross,
// the keyboard crosshair, and the text around the panels.
import { drawScene } from './art.js';
import { currentScene, foundCount, remainingCount, PHASE_TITLE, PHASE_PLAY, PHASE_SCENE_DONE, PHASE_WIN, PHASE_OVER } from './game.js';
import { isMuted } from './audio.js';
import { DIFFERENCES_PER_SCENE, SCENE_TIME_SECONDS } from './config.js';

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Gold ring + tick over a difference that has been found. */
function drawFoundMarker(ctx, diff, now) {
  const pulse = 1 + Math.sin(now / 240) * 0.05;
  ctx.save();
  ctx.strokeStyle = '#ffc53d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, diff.r * 0.85 * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#fff7e6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, diff.r * 0.85 * pulse + 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#ffc53d';
  ctx.beginPath();
  ctx.arc(diff.x + diff.r * 0.55, diff.y - diff.r * 0.55, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2b2135';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(diff.x + diff.r * 0.55 - 5, diff.y - diff.r * 0.55);
  ctx.lineTo(diff.x + diff.r * 0.55 - 1, diff.y - diff.r * 0.55 + 4);
  ctx.lineTo(diff.x + diff.r * 0.55 + 6, diff.y - diff.r * 0.55 - 5);
  ctx.stroke();
  ctx.restore();
}

function drawHintPulse(ctx, diff, now) {
  const grow = 0.6 + ((now % 900) / 900) * 0.7;
  ctx.save();
  ctx.strokeStyle = 'rgba(46,196,182,0.9)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, diff.r * grow, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawWrongCross(ctx, point, now) {
  const age = now - (point.at ?? now);
  if (age > 500) return;
  const size = 16;
  ctx.save();
  ctx.globalAlpha = 1 - age / 500;
  ctx.strokeStyle = '#ff6b5e';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(point.x - size, point.y - size);
  ctx.lineTo(point.x + size, point.y + size);
  ctx.moveTo(point.x + size, point.y - size);
  ctx.lineTo(point.x - size, point.y + size);
  ctx.stroke();
  ctx.restore();
}

function drawCrosshair(ctx, game, panelIndex, now) {
  if (game.phase !== PHASE_PLAY) return;
  if (!game.crosshairShown) return;
  if (game.crosshair.panel !== panelIndex) return;
  const { x, y } = game.crosshair;
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 18, y);
  ctx.lineTo(x - 8, y);
  ctx.moveTo(x + 8, y);
  ctx.lineTo(x + 18, y);
  ctx.moveTo(x, y - 18);
  ctx.lineTo(x, y - 8);
  ctx.moveTo(x, y + 8);
  ctx.lineTo(x, y + 18);
  ctx.stroke();
  ctx.restore();
}

/** Draw both panels for the current frame. */
export function renderPanels(game, canvases, now) {
  const scene = currentScene(game);
  const t = now / 1000;
  for (let panel = 0; panel < 2; panel += 1) {
    const ctx = canvases[panel].getContext('2d');
    drawScene(ctx, scene.id, panel, t);
    for (const diff of scene.differences) {
      if (game.found.has(diff.id)) drawFoundMarker(ctx, diff, now);
    }
    if (game.hintSpot) drawHintPulse(ctx, game.hintSpot, now);
    if (game.wrongAt && game.wrongAt.panel === panel) {
      drawWrongCross(ctx, game.wrongAt, now);
    }
    drawCrosshair(ctx, game, panel, now);
  }
}

/** Refresh the header, the counter, the buttons and the overlays. */
export function renderHud(game, ui, now) {
  const scene = currentScene(game);
  ui.sceneName.textContent = `Scene ${game.sceneIndex + 1} of 3 · ${scene.name}`;
  ui.timer.textContent = formatTime(game.timeLeft);
  ui.timer.classList.toggle('low', game.timeLeft <= 30 && game.phase === PHASE_PLAY);
  ui.score.textContent = String(game.score);
  ui.best.textContent = String(game.best);
  ui.counter.textContent = `${foundCount(game)} / ${DIFFERENCES_PER_SCENE} found · ${remainingCount(game)} left`;
  ui.counterProgress.style.width = `${(foundCount(game) / DIFFERENCES_PER_SCENE) * 100}%`;
  ui.hintsLeft.textContent = `${Math.max(0, 3 - game.hintsUsed)} hints`;
  ui.hintButton.disabled = game.phase !== PHASE_PLAY || game.hintsUsed >= 3;
  ui.muteButton.textContent = isMuted() ? '🔇 Sound off' : '🔊 Sound on';
  ui.message.textContent = now < game.messageUntil ? game.message : '';
  ui.status.textContent = `${scene.name}: ${foundCount(game)} of ${DIFFERENCES_PER_SCENE} differences found, ${remainingCount(game)} still to find. ${Math.ceil(game.timeLeft)} seconds left. Score ${game.score}.`;

  const show = (el, visible) => el.classList.toggle('hidden', !visible);
  show(ui.titleOverlay, game.phase === PHASE_TITLE);
  show(ui.sceneDoneOverlay, game.phase === PHASE_SCENE_DONE);
  show(ui.winOverlay, game.phase === PHASE_WIN);
  show(ui.overOverlay, game.phase === PHASE_OVER);
  if (game.phase === PHASE_SCENE_DONE) {
    ui.sceneDoneText.textContent = `You found all ${DIFFERENCES_PER_SCENE} differences in ${scene.name} with ${Math.ceil(game.timeLeft)}s to spare. Score: ${game.score}.`;
  }
  if (game.phase === PHASE_WIN) {
    ui.winText.textContent = `Every difference in all three scenes — found! Final score: ${game.score}. Best: ${game.best}.`;
  }
  if (game.phase === PHASE_OVER) {
    ui.overText.textContent = `Time ran out in ${scene.name} with ${remainingCount(game)} difference${remainingCount(game) === 1 ? '' : 's'} still hidden. Score: ${game.score}.`;
  }
  ui.timeBar.style.width = `${(game.timeLeft / SCENE_TIME_SECONDS) * 100}%`;
}
