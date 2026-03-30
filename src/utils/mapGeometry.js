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

export const DESKS = [
  { x: 12, y: 4, w: 2, h: 2, ownerId: 'user-h', ownerName: 'Harshil' },
  { x: 50, y: 4, w: 2, h: 2, ownerId: 'user-t', ownerName: 'Twisha' },
  { x: 12, y: 24, w: 2, h: 2, ownerId: 'user-m', ownerName: 'Meet' },
  { x: 50, y: 24, w: 2, h: 2, ownerId: 'user-s', ownerName: 'Shivansh' },
];

// Furniture sprites placed throughout the map
// sprite: filename in /sprites/, x/y: tile position, w/h: size in tiles, z: layer order
export const FURNITURE = [
  // === HARSHIL's Cabin (Top-Left: 1-23, 1-13) ===
  { sprite: 'table.png', x: 6, y: 2, w: 6, h: 4 },
  { sprite: 'monitor.png', x: 8, y: 1, w: 3, h: 3 },
  { sprite: 'laptop.png', x: 11, y: 2, w: 2, h: 2 },
  { sprite: 'chair.png', x: 9, y: 5, w: 2, h: 2 },
  { sprite: 'plant.png', x: 2, y: 2, w: 2, h: 2 },
  { sprite: 'cactus.png', x: 20, y: 2, w: 2, h: 3 },

  // === TWISHA's Cabin (Top-Right: 40-62, 1-13) ===
  { sprite: 'table.png', x: 44, y: 2, w: 6, h: 4 },
  { sprite: 'monitor.png', x: 46, y: 1, w: 3, h: 3 },
  { sprite: 'laptop.png', x: 49, y: 2, w: 2, h: 2 },
  { sprite: 'chair.png', x: 47, y: 5, w: 2, h: 2 },
  { sprite: 'plant.png', x: 41, y: 11, w: 2, h: 2 },
  { sprite: 'plant.png', x: 58, y: 2, w: 2, h: 2 },

  // === MEET's Cabin (Bottom-Left: 1-23, 22-34) ===
  { sprite: 'table.png', x: 6, y: 22, w: 6, h: 4 },
  { sprite: 'monitor.png', x: 8, y: 21, w: 3, h: 3 },
  { sprite: 'laptop.png', x: 11, y: 22, w: 2, h: 2 },
  { sprite: 'chair.png', x: 9, y: 25, w: 2, h: 2 },
  { sprite: 'cactus.png', x: 2, y: 30, w: 2, h: 3 },
  { sprite: 'plant.png', x: 20, y: 22, w: 2, h: 2 },

  // === SHIVANSH's Cabin (Bottom-Right: 40-62, 22-34) ===
  { sprite: 'table.png', x: 44, y: 22, w: 6, h: 4 },
  { sprite: 'monitor.png', x: 46, y: 21, w: 3, h: 3 },
  { sprite: 'laptop.png', x: 49, y: 22, w: 2, h: 2 },
  { sprite: 'chair.png', x: 47, y: 25, w: 2, h: 2 },
  { sprite: 'plant.png', x: 58, y: 30, w: 2, h: 2 },
  { sprite: 'cactus.png', x: 41, y: 22, w: 2, h: 3 },

  // === HALLWAY / FLEX AREA (center: 25-38, 1-35) ===
  { sprite: 'cushion-double.png', x: 30, y: 3, w: 2, h: 2 },
  { sprite: 'cushion-single.png', x: 33, y: 4, w: 1, h: 1 },
  { sprite: 'cushion-double.png', x: 30, y: 31, w: 2, h: 2 },
  { sprite: 'cushion-single.png', x: 33, y: 32, w: 1, h: 1 },
  { sprite: 'plant.png', x: 26, y: 1, w: 2, h: 2 },
  { sprite: 'plant.png', x: 36, y: 1, w: 2, h: 2 },
  { sprite: 'cactus.png', x: 31, y: 14, w: 2, h: 3 },
  { sprite: 'cactus.png', x: 31, y: 22, w: 2, h: 3 },
  { sprite: 'chair.png', x: 27, y: 10, w: 2, h: 2 },
  { sprite: 'chair.png', x: 35, y: 10, w: 2, h: 2 },
  { sprite: 'plant.png', x: 26, y: 33, w: 2, h: 2 },
  { sprite: 'plant.png', x: 36, y: 33, w: 2, h: 2 },
];
