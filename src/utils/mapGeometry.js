export const TILE_SIZE = 32;
export const MAP_WIDTH_TILES = 64;
export const MAP_HEIGHT_TILES = 36;

export const WALLS = [
  // Outer boundaries
  { x: 0, y: 0, w: 64, h: 1 }, // Top
  { x: 0, y: 35, w: 64, h: 1 }, // Bottom
  { x: 0, y: 0, w: 1, h: 36 }, // Left
  { x: 63, y: 0, w: 1, h: 36 }, // Right

  // Top-Left Cabin (Harshil): Box (1 to 24, 1 to 14)
  { x: 1, y: 14, w: 23, h: 1 }, // Bottom wall
  { x: 24, y: 1, w: 1, h: 6 }, // Right wall top part
  { x: 24, y: 9, w: 1, h: 6 }, // Right wall bottom part (Gap at y:7,8 for door)
  
  // Top-Right Cabin (Twisha): Box (39 to 62, 1 to 14)
  { x: 40, y: 14, w: 23, h: 1 }, // Bottom wall
  { x: 39, y: 1, w: 1, h: 6 }, // Left wall top part
  { x: 39, y: 9, w: 1, h: 6 }, // Left wall bottom part
  
  // Bottom-Left Cabin (Meet): Box (1 to 24, 21 to 34)
  { x: 1, y: 21, w: 23, h: 1 }, // Top wall
  { x: 24, y: 21, w: 1, h: 6 }, // Right wall top part
  { x: 24, y: 29, w: 1, h: 6 }, // Right wall bottom part (Gap at y:27,28 for door)
  
  // Bottom-Right Cabin (Shivansh): Box (39 to 62, 21 to 34)
  { x: 40, y: 21, w: 23, h: 1 }, // Top wall
  { x: 39, y: 21, w: 1, h: 6 }, // Left wall top part
  { x: 39, y: 29, w: 1, h: 6 }, // Left wall bottom part
];

export const DOORS = {
  'cabin-tl': { id: 'cabin-tl', x: 24, y: 7, w: 1, h: 2, ownerId: 'user-h', ownerName: 'Harshil' },
  'cabin-tr': { id: 'cabin-tr', x: 39, y: 7, w: 1, h: 2, ownerId: 'user-t', ownerName: 'Twisha' },
  'cabin-bl': { id: 'cabin-bl', x: 24, y: 27, w: 1, h: 2, ownerId: 'user-m', ownerName: 'Meet' },
  'cabin-br': { id: 'cabin-br', x: 39, y: 27, w: 1, h: 2, ownerId: 'user-s', ownerName: 'Shivansh' },
};
