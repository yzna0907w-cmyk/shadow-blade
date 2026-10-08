'use strict';

// ═══════════════════════════════════════════════════
// EMBER — Mega Crypt
// خريطة واحدة متصلة (Hollow Knight style)
// 12 شاشة × 480px = 5760px عرض
// 2 شاشة × 270px = 540px طول
// ═══════════════════════════════════════════════════

const MEGA_CRYPT = {
  id: 'mega-crypt',
  section: 0,
  name: 'المقبرة',
  isMegaRoom: true,
  width: 5760,
  height: 540,

  bg: 'bg-crypt',
  tiles: 'tile-crypt',

  platforms: [
    // الأرضية الرئيسية
    { x: 2880, y: 525, w: 5760, h: 30 },

    // سقف علوي
    { x: 2880, y: 15, w: 5760, h: 30 },

    // منصات الشاشة 2
    { x: 720, y: 400, w: 180, h: 20 },
    { x: 950, y: 300, w: 140, h: 20 },

    // منصات الشاشة 4
    { x: 1680, y: 420, w: 200, h: 20 },
    { x: 1950, y: 320, w: 160, h: 20 },

    // منصات الشاشة 6 (خزانة)
    { x: 2640, y: 380, w: 240, h: 20 },
    { x: 2900, y: 260, w: 160, h: 20 },

    // منصات الشاشة 8
    { x: 3720, y: 400, w: 200, h: 20 },
    { x: 3980, y: 300, w: 150, h: 20 },

    // منصات الشاشة 10 (أرينا)
    { x: 4700, y: 420, w: 220, h: 20 },

    // منصة البوس (الشاشة 12)
    { x: 5400, y: 380, w: 300, h: 20 }
  ],

  decor: [],
  enemies: [],
  npcs: [],
  puzzles: [],
  exits: {}
};

if (typeof ROOMS !== 'undefined') {
  ROOMS['mega-crypt'] = MEGA_CRYPT;
}

console.log('✅ MEGA_CRYPT loaded — 5760×540, 12 screens');
