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
    // ═══ جدار يسار (يمنع الخروج) ═══
    { x: 15, y: 270, w: 30, h: 540 },

    // ═══ جدار يمين (يمنع الخروج) ═══
    { x: 5745, y: 270, w: 30, h: 540 },

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

  decor: [
    { key: 'crystal-1', x: 400, y: 525, scale: 0.6 },
    { key: 'crystal-2', x: 1100, y: 525, scale: 0.7 },
    { key: 'crystal-3', x: 1800, y: 525, scale: 0.6 },
    { key: 'crystal-pile-1', x: 2400, y: 525, scale: 0.8 },
    { key: 'crystal-1', x: 3100, y: 525, scale: 0.6 },
    { key: 'crystal-pile-2', x: 3900, y: 525, scale: 0.7 },
    { key: 'crystal-2', x: 4600, y: 525, scale: 0.6 },
    { key: 'crystal-3', x: 5300, y: 525, scale: 0.7 },
    { key: 'candlestick', x: 300, y: 525, scale: 0.9 },
    { key: 'fire', x: 900, y: 525, scale: 0.8 },
    { key: 'candlestick', x: 1500, y: 525, scale: 0.9 },
    { key: 'fire', x: 2200, y: 525, scale: 0.8 },
    { key: 'candlestick', x: 2900, y: 525, scale: 0.9 },
    { key: 'fire', x: 3600, y: 525, scale: 0.8 },
    { key: 'candlestick', x: 4300, y: 525, scale: 0.9 },
    { key: 'fire', x: 5000, y: 525, scale: 0.8 },
    { key: 'rock-01', x: 700, y: 525, scale: 0.7 },
    { key: 'rock-02', x: 1400, y: 525, scale: 0.8 },
    { key: 'rock-03', x: 2100, y: 525, scale: 0.7 },
    { key: 'rock-04', x: 2800, y: 525, scale: 0.8 },
    { key: 'rock-05', x: 3500, y: 525, scale: 0.7 },
    { key: 'rock-06', x: 4200, y: 525, scale: 0.8 },
    { key: 'rock-01', x: 4900, y: 525, scale: 0.7 },
    { key: 'pillar', x: 1300, y: 525, scale: 1.0 },
    { key: 'pillar', x: 3300, y: 525, scale: 1.0 },
    { key: 'pillar', x: 5200, y: 525, scale: 1.0 },
    { key: 'tree', x: 500, y: 525, scale: 0.9 },
    { key: 'tree', x: 2500, y: 525, scale: 0.9 },
    { key: 'tree', x: 4400, y: 525, scale: 0.9 }
  ],
  enemies: [],
  npcs: [],
  puzzles: [],
  exits: {}
};

if (typeof ROOMS !== 'undefined') {
  ROOMS['mega-crypt'] = MEGA_CRYPT;
}

console.log('✅ MEGA_CRYPT loaded — 5760×540, 12 screens');
