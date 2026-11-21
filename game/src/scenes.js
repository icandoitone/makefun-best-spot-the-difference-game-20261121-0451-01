// Lantern Lane: the three scenes and their seven differences each.
// One job: data only. A difference is a spot on the picture (x, y in panel
// coordinates, r the click radius) plus the name the game shows when it is
// found. art.js reads `variant` to draw the change; nothing here draws.
export const SCENES = [
  {
    id: 'market',
    name: 'Lantern Market',
    intro: 'A night market stall under paper lanterns. Seven things differ.',
    differences: [
      { id: 'moon', x: 472, y: 62, r: 36, label: 'The moon changed phase' },
      { id: 'bow', x: 118, y: 318, r: 30, label: 'The cat lost its bow' },
      { id: 'stripe', x: 282, y: 128, r: 30, label: 'An awning stripe changed colour' },
      { id: 'lantern', x: 352, y: 96, r: 30, label: 'A paper lantern appeared' },
      { id: 'star', x: 280, y: 176, r: 26, label: 'A star vanished from the sign' },
      { id: 'fruit', x: 436, y: 318, r: 34, label: 'The apples turned into oranges' },
      { id: 'flag', x: 198, y: 56, r: 26, label: 'A bunting flag went missing' },
    ],
  },
  {
    id: 'pond',
    name: 'Koi Pond Garden',
    intro: 'A quiet garden pond with koi, lilies and a stone lantern.',
    differences: [
      { id: 'koi', x: 398, y: 282, r: 34, label: 'A fourth koi swam in' },
      { id: 'bloom', x: 152, y: 298, r: 28, label: 'A lily bloomed' },
      { id: 'glow', x: 498, y: 118, r: 30, label: 'The stone lantern lit up' },
      { id: 'petals', x: 96, y: 96, r: 32, label: 'Blossom petals are falling' },
      { id: 'plank', x: 280, y: 210, r: 30, label: 'A bridge plank changed colour' },
      { id: 'frog', x: 88, y: 258, r: 28, label: 'A frog hopped onto the rock' },
      { id: 'dragonfly', x: 312, y: 82, r: 26, label: 'A dragonfly arrived' },
    ],
  },
  {
    id: 'rooftop',
    name: 'Rooftop Stars',
    intro: 'A rooftop above the sleeping city, telescope pointed skyward.',
    differences: [
      { id: 'star', x: 482, y: 52, r: 28, label: 'A new star appeared' },
      { id: 'scope', x: 210, y: 150, r: 34, label: 'The telescope tilted up' },
      { id: 'bulb', x: 330, y: 66, r: 24, label: 'A string-light bulb went dark' },
      { id: 'flower', x: 452, y: 330, r: 28, label: 'A flower opened in the pot' },
      { id: 'steam', x: 128, y: 300, r: 28, label: 'The cocoa stopped steaming' },
      { id: 'window', x: 500, y: 330, r: 28, label: 'A city window lit up' },
      { id: 'zee', x: 330, y: 330, r: 28, label: 'The cat is dreaming now' },
    ],
  },
];
