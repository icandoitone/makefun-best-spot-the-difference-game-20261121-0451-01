// Lantern Lane: shared constants for the spot-the-difference game.
// One job: the numbers every other module agrees on (panel size, timer,
// scoring, colours). No drawing, no state, no input here.
export const PANEL_W = 560;
export const PANEL_H = 420;
export const DIFFERENCES_PER_SCENE = 7;
export const SCENE_TIME_SECONDS = 150;
export const POINTS_PER_FIND = 100;
export const POINTS_WRONG_CLICK = -10;
export const POINTS_HINT = -25;
export const TIME_PENALTY_SECONDS = 5;
export const MAX_HINTS_PER_SCENE = 3;
export const FIND_RADIUS = 34;

export const COLOURS = {
  ink: '#2b2135',
  paper: '#fff7e6',
  gold: '#ffc53d',
  coral: '#ff6b5e',
  teal: '#2ec4b6',
  plum: '#7b5ea7',
};

export const SCENE_NAMES = ['Lantern Market', 'Koi Pond Garden', 'Rooftop Stars'];
