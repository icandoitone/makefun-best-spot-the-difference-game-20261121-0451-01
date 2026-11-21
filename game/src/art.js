// Lantern Lane: every picture in the game, drawn with the canvas 2D API.
// One job: paint a scene. drawScene(ctx, sceneId, variant, t) draws the
// whole panel; variant 0 is the left picture, variant 1 the right one, and
// the only things that differ between them are the scene's seven
// differences (see scenes.js). Both panels are always drawn with the same
// time t, so the lanterns sway and the koi swim in step. No assets, no
// network: every pixel is code.
import { PANEL_W, PANEL_H } from './config.js';

/** Deterministic pseudo-random in [0, 1) from an integer seed. */
function rnd(seed) {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function star(ctx, x, y, r, points = 5) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i += 1) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (i * Math.PI) / points - Math.PI / 2;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
}

function starfield(ctx, count, seedBase, maxY) {
  ctx.fillStyle = '#fff8d6';
  for (let i = 0; i < count; i += 1) {
    const x = rnd(seedBase + i * 3) * PANEL_W;
    const y = rnd(seedBase + i * 3 + 1) * maxY;
    const r = 0.8 + rnd(seedBase + i * 3 + 2) * 1.6;
    circle(ctx, x, y, r);
  }
}

function paperLantern(ctx, x, y, sway, colour) {
  ctx.save();
  ctx.translate(x + Math.sin(sway) * 3, y);
  ctx.strokeStyle = '#3a2b1e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - x, -14);
  ctx.lineTo(0, -14);
  ctx.stroke();
  ctx.fillStyle = colour;
  ellipse(ctx, 0, 0, 20, 24);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ellipse(ctx, -6, -8, 7, 9);
  ctx.fillStyle = '#e8a33d';
  rr(ctx, -7, -28, 14, 6, 2);
  rr(ctx, -7, 22, 14, 6, 2);
  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* Scene 1: Lantern Market                                             */
/* ------------------------------------------------------------------ */
function drawMarket(ctx, variant, t) {
  sky(ctx, '#241a4e', '#5b2d6e');
  starfield(ctx, 26, 11, 150);

  // Moon: full in the left picture, a crescent in the right one.
  ctx.fillStyle = '#ffeec2';
  circle(ctx, 472, 62, 26);
  if (variant === 1) {
    ctx.fillStyle = '#3a2a63';
    circle(ctx, 484, 54, 23);
  }

  // Bunting across the top; one flag is missing on the right.
  const flagColours = ['#ff6b5e', '#2ec4b6', '#ffc53d'];
  for (let i = 0; i < 9; i += 1) {
    const x = 40 + i * 60;
    if (variant === 1 && i === 3) continue; // the missing flag
    ctx.fillStyle = flagColours[i % 3];
    ctx.beginPath();
    ctx.moveTo(x - 16, 44);
    ctx.lineTo(x + 16, 44);
    ctx.lineTo(x, 72);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = '#d9c9a3';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 44);
  ctx.lineTo(540, 44);
  ctx.stroke();

  // Paper lanterns on a line; the right picture hangs one more.
  ctx.strokeStyle = '#3a2b1e';
  ctx.beginPath();
  ctx.moveTo(60, 92);
  ctx.lineTo(500, 92);
  ctx.stroke();
  paperLantern(ctx, 120, 116, t * 0.9, '#ff5d5d');
  paperLantern(ctx, 220, 116, t * 0.9 + 2, '#ffb03d');
  paperLantern(ctx, 460, 116, t * 0.9 + 4, '#ff5d5d');
  if (variant === 1) paperLantern(ctx, 352, 116, t * 0.9 + 1, '#7be0c8');

  // Stall: striped awning, counter, crates.
  for (let i = 0; i < 8; i += 1) {
    // One awning stripe changes colour on the right.
    ctx.fillStyle = variant === 1 && i === 3 ? '#2ec4b6' : i % 2 === 0 ? '#ff6b5e' : '#fff3d6';
    ctx.fillRect(120 + i * 40, 128, 40, 34);
  }
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(120, 162, 320, 10);
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(140, 300, 280, 60);
  ctx.fillStyle = '#7d5230';
  ctx.fillRect(140, 300, 280, 8);

  // Hanging sign; a gold star sits on it in the left picture only.
  ctx.fillStyle = '#2b2135';
  rr(ctx, 220, 176, 120, 40, 8);
  ctx.fillStyle = '#ffeec2';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LANTERN LANE', 280, 197);
  if (variant === 0) {
    ctx.fillStyle = '#ffc53d';
    star(ctx, 232, 197, 8);
  }

  // Crates of fruit; apples on the left, oranges on the right.
  ctx.fillStyle = '#a9743f';
  rr(ctx, 400, 300, 72, 44, 4);
  for (let i = 0; i < 6; i += 1) {
    ctx.fillStyle = variant === 1 ? '#ff8c1a' : '#e23b3b';
    circle(ctx, 410 + (i % 3) * 22, 292 - Math.floor(i / 3) * 18, 11);
    ctx.fillStyle = '#3f7a3a';
    ctx.beginPath();
    ctx.moveTo(410 + (i % 3) * 22, 282 - Math.floor(i / 3) * 18);
    ctx.lineTo(416 + (i % 3) * 22, 276 - Math.floor(i / 3) * 18);
    ctx.lineTo(418 + (i % 3) * 22, 284 - Math.floor(i / 3) * 18);
    ctx.closePath();
    ctx.fill();
  }

  // The stall cat, sitting on a crate; its red bow is gone on the right.
  const tailSway = Math.sin(t * 1.4) * 4;
  ctx.fillStyle = '#3a3a4a';
  ctx.beginPath();
  ctx.moveTo(96, 330);
  ctx.quadraticCurveTo(70 + tailSway, 300, 88, 282);
  ctx.quadraticCurveTo(96, 292, 100, 306);
  ctx.lineTo(104, 330);
  ctx.closePath();
  ctx.fill();
  ellipse(ctx, 118, 318, 26, 20);
  circle(ctx, 118, 288, 17);
  ctx.beginPath();
  ctx.moveTo(104, 278);
  ctx.lineTo(108, 262);
  ctx.lineTo(116, 276);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(122, 276);
  ctx.lineTo(130, 262);
  ctx.lineTo(134, 278);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffeec2';
  circle(ctx, 112, 286, 2.5);
  circle(ctx, 124, 286, 2.5);
  if (variant === 0) {
    ctx.fillStyle = '#e23b3b';
    ctx.beginPath();
    ctx.moveTo(118, 304);
    ctx.lineTo(104, 296);
    ctx.lineTo(104, 312);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(118, 304);
    ctx.lineTo(132, 296);
    ctx.lineTo(132, 312);
    ctx.closePath();
    ctx.fill();
    circle(ctx, 118, 304, 4);
  }

  // Cobblestones.
  ctx.fillStyle = '#4a3560';
  ctx.fillRect(0, 360, PANEL_W, 60);
  ctx.fillStyle = '#5d4472';
  for (let i = 0; i < 14; i += 1) {
    ellipse(ctx, 20 + i * 40, 380 + (i % 2) * 18, 18, 8);
  }
}

/* ------------------------------------------------------------------ */
/* Scene 2: Koi Pond Garden                                            */
/* ------------------------------------------------------------------ */
function koi(ctx, x, y, angle, colour, t, phase) {
  const wiggle = Math.sin(t * 2 + phase) * 0.12;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + wiggle);
  ctx.fillStyle = colour;
  ellipse(ctx, 0, 0, 26, 10);
  ctx.beginPath();
  ctx.moveTo(-24, 0);
  ctx.lineTo(-38, -9);
  ctx.lineTo(-38, 9);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fff';
  ellipse(ctx, 8, -3, 9, 5);
  ctx.fillStyle = '#222';
  circle(ctx, 18, -3, 1.8);
  ctx.restore();
}

function drawPond(ctx, variant, t) {
  sky(ctx, '#bfe8c9', '#7ec8a9');
  // Cherry tree, top left; petals fall only in the right picture.
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(28, 60, 14, 90);
  ctx.beginPath();
  ctx.moveTo(35, 70);
  ctx.quadraticCurveTo(70, 30, 110, 55);
  ctx.quadraticCurveTo(70, 55, 35, 84);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f7a8c4';
  for (let i = 0; i < 12; i += 1) {
    circle(ctx, 30 + rnd(i * 7) * 110, 26 + rnd(i * 7 + 1) * 60, 9 + rnd(i * 7 + 2) * 6);
  }
  if (variant === 1) {
    ctx.fillStyle = 'rgba(247,168,196,0.9)';
    for (let i = 0; i < 7; i += 1) {
      const px = 90 + rnd(i * 5) * 60 + Math.sin(t + i) * 6;
      const py = 96 + ((t * 12 + i * 34) % 120);
      circle(ctx, px, py, 3.5);
    }
  }

  // Stone lantern, top right; it glows only in the right picture.
  if (variant === 1) {
    const glow = ctx.createRadialGradient(498, 118, 4, 498, 118, 46);
    glow.addColorStop(0, 'rgba(255,200,90,0.75)');
    glow.addColorStop(1, 'rgba(255,200,90,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(440, 60, 116, 116);
  }
  ctx.fillStyle = '#8d8d94';
  rr(ctx, 482, 148, 32, 12, 2);
  rr(ctx, 486, 128, 24, 20, 2);
  ctx.fillStyle = variant === 1 ? '#ffd76a' : '#4a4a55';
  ctx.fillRect(492, 132, 12, 12);
  ctx.fillStyle = '#8d8d94';
  ctx.beginPath();
  ctx.moveTo(478, 128);
  ctx.lineTo(518, 128);
  ctx.lineTo(498, 110);
  ctx.closePath();
  ctx.fill();

  // Dragonfly, right picture only.
  if (variant === 1) {
    const dx = 312 + Math.sin(t * 1.2) * 8;
    const dy = 82 + Math.cos(t * 0.9) * 5;
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(dx - 10, dy - 4, 12, 4, -0.5, 0, Math.PI * 2);
    ctx.ellipse(dx + 10, dy - 4, 12, 4, 0.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#2ec4b6';
    ellipse(ctx, dx, dy, 9, 3);
  }

  // The pond.
  const pond = ctx.createLinearGradient(0, 170, 0, 390);
  pond.addColorStop(0, '#4db2d8');
  pond.addColorStop(1, '#1f7fa8');
  ctx.fillStyle = pond;
  ctx.beginPath();
  ctx.ellipse(280, 280, 235, 105, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.ellipse(280, 280, 60 + i * 55, 26 + i * 24, 0, 0.2 + Math.sin(t * 0.8 + i) * 0.15, Math.PI * 1.1);
    ctx.stroke();
  }

  // Lily pads; one blooms pink only in the right picture.
  ctx.fillStyle = '#3f9e57';
  ellipse(ctx, 152, 298, 34, 12);
  ellipse(ctx, 420, 320, 30, 11);
  ellipse(ctx, 220, 340, 28, 10);
  if (variant === 1) {
    ctx.fillStyle = '#ff7fb0';
    for (let p = 0; p < 5; p += 1) {
      const a = (p * Math.PI * 2) / 5;
      ellipse(ctx, 152 + Math.cos(a) * 9, 292 + Math.sin(a) * 5, 6, 4);
    }
    ctx.fillStyle = '#ffd76a';
    circle(ctx, 152, 292, 4);
  }

  // Koi; a fourth swims in on the right.
  koi(ctx, 220, 250, 0.2, '#ff8c42', t, 0);
  koi(ctx, 330, 300, -0.4, '#fff3d6', t, 2);
  koi(ctx, 170, 320, 0.9, '#ff8c42', t, 4);
  if (variant === 1) koi(ctx, 398, 282, 2.6, '#ffb03d', t, 1);

  // Wooden bridge over the pond; one plank changes colour on the right.
  ctx.fillStyle = '#8a5a33';
  for (let i = 0; i < 7; i += 1) {
    ctx.fillStyle = variant === 1 && i === 3 ? '#2ec4b6' : '#8a5a33';
    ctx.fillRect(200 + i * 24, 196 - Math.abs(i - 3) * 4, 22, 26);
  }
  ctx.strokeStyle = '#5d3a1e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(196, 196);
  ctx.quadraticCurveTo(280, 168, 364, 196);
  ctx.stroke();

  // Frog on the rock, right picture only.
  if (variant === 1) {
    ctx.fillStyle = '#7a7a82';
    ellipse(ctx, 88, 262, 26, 12);
    ctx.fillStyle = '#57b25e';
    circle(ctx, 82, 248, 10);
    circle(ctx, 94, 248, 10);
    ellipse(ctx, 88, 256, 14, 8);
    ctx.fillStyle = '#222';
    circle(ctx, 82, 246, 2.5);
    circle(ctx, 94, 246, 2.5);
  }

  // Reeds and grass at the edges.
  ctx.strokeStyle = '#2f7a44';
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i += 1) {
    const x = 12 + i * 14;
    ctx.beginPath();
    ctx.moveTo(x, 400);
    ctx.quadraticCurveTo(x + 6, 372, x + Math.sin(t + i) * 4, 352);
    ctx.stroke();
  }
}

/* ------------------------------------------------------------------ */
/* Scene 3: Rooftop Stars                                              */
/* ------------------------------------------------------------------ */
function drawRooftop(ctx, variant, t) {
  sky(ctx, '#141033', '#3a2060');
  starfield(ctx, 40, 77, 200);
  // A new star shines in the right picture.
  if (variant === 1) {
    ctx.fillStyle = '#fff3b0';
    const tw = 1 + Math.sin(t * 3) * 0.25;
    star(ctx, 482, 52, 11 * tw, 4);
  }

  // City skyline; one window lights up on the right.
  ctx.fillStyle = '#1d1440';
  const buildings = [
    [0, 300, 70, 120], [70, 320, 60, 100], [130, 290, 80, 130], [210, 315, 55, 105],
    [265, 295, 75, 125], [340, 320, 60, 100], [400, 300, 70, 120], [470, 315, 90, 105],
  ];
  for (const [x, y, w, h] of buildings) ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#ffd76a';
  for (let i = 0; i < 10; i += 1) {
    ctx.fillRect(18 + rnd(i * 3) * 500, 310 + rnd(i * 3 + 1) * 70, 7, 9);
  }
  if (variant === 1) ctx.fillRect(496, 326, 10, 12);

  // String lights; one bulb is dark on the right.
  ctx.strokeStyle = '#d9c9a3';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 60);
  ctx.quadraticCurveTo(280, 92, 520, 60);
  ctx.stroke();
  for (let i = 0; i < 9; i += 1) {
    const x = 60 + i * 55;
    const y = 66 + Math.sin((x / 520) * Math.PI) * 18;
    const lit = !(variant === 1 && i === 5);
    ctx.fillStyle = lit ? '#ffd76a' : '#4a4a55';
    circle(ctx, x, y + 8, 7);
    if (lit) {
      ctx.fillStyle = 'rgba(255,215,106,0.25)';
      circle(ctx, x, y + 8, 13);
    }
  }

  // Rooftop floor.
  ctx.fillStyle = '#2c2140';
  ctx.fillRect(0, 360, PANEL_W, 60);
  ctx.fillStyle = '#3a2c52';
  ctx.fillRect(0, 360, PANEL_W, 6);

  // Telescope; it tilts upward in the right picture.
  ctx.strokeStyle = '#8d8d94';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(210, 330);
  ctx.lineTo(190, 380);
  ctx.moveTo(210, 330);
  ctx.lineTo(230, 380);
  ctx.moveTo(210, 330);
  ctx.lineTo(210, 380);
  ctx.stroke();
  ctx.save();
  ctx.translate(210, 314);
  ctx.rotate(variant === 1 ? -0.7 : -0.25);
  ctx.fillStyle = '#c9c9d4';
  rr(ctx, -14, -58, 74, 22, 10);
  ctx.fillStyle = '#7b5ea7';
  rr(ctx, 52, -54, 14, 14, 4);
  ctx.fillStyle = '#2b2135';
  circle(ctx, 60, -47, 5);
  ctx.restore();

  // Mug of cocoa; steam rises only in the left picture.
  ctx.fillStyle = '#ff6b5e';
  rr(ctx, 104, 312, 44, 34, 6);
  ctx.strokeStyle = '#ff6b5e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(150, 328, 10, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  if (variant === 0) {
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 2; i += 1) {
      ctx.beginPath();
      const oy = ((t * 14 + i * 22) % 44);
      ctx.moveTo(118 + i * 14, 308 - oy);
      ctx.quadraticCurveTo(124 + i * 14, 300 - oy, 118 + i * 14, 292 - oy);
      ctx.stroke();
    }
  }

  // Potted plant; a flower opens in the right picture.
  ctx.fillStyle = '#c96f2e';
  ctx.beginPath();
  ctx.moveTo(436, 330);
  ctx.lineTo(468, 330);
  ctx.lineTo(462, 360);
  ctx.lineTo(442, 360);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#3f9e57';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(452, 330);
  ctx.lineTo(452, 296);
  ctx.stroke();
  ctx.fillStyle = '#57b25e';
  ellipse(ctx, 442, 306, 10, 5);
  ellipse(ctx, 462, 312, 10, 5);
  if (variant === 1) {
    ctx.fillStyle = '#ff7fb0';
    for (let p = 0; p < 5; p += 1) {
      const a = (p * Math.PI * 2) / 5;
      ellipse(ctx, 452 + Math.cos(a) * 8, 292 + Math.sin(a) * 5, 6, 4);
    }
    ctx.fillStyle = '#ffd76a';
    circle(ctx, 452, 292, 4);
  }

  // Sleeping cat; it dreams (Z z) in the right picture.
  ctx.fillStyle = '#e8e0d0';
  ellipse(ctx, 330, 344, 34, 16);
  circle(ctx, 302, 336, 13);
  ctx.beginPath();
  ctx.moveTo(292, 328);
  ctx.lineTo(295, 318);
  ctx.lineTo(300, 326);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(306, 326);
  ctx.lineTo(311, 318);
  ctx.lineTo(313, 328);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2b2135';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(296, 336);
  ctx.quadraticCurveTo(299, 338, 302, 336);
  ctx.stroke();
  if (variant === 1) {
    ctx.fillStyle = '#9db8ff';
    ctx.font = 'bold 16px Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText('Z', 322, 318 - Math.sin(t) * 2);
    ctx.font = 'bold 11px Georgia, serif';
    ctx.fillText('z', 334, 306 - Math.sin(t) * 2);
  }
}

export function drawScene(ctx, sceneId, variant, t) {
  ctx.clearRect(0, 0, PANEL_W, PANEL_H);
  if (sceneId === 'market') drawMarket(ctx, variant, t);
  else if (sceneId === 'pond') drawPond(ctx, variant, t);
  else drawRooftop(ctx, variant, t);
}
