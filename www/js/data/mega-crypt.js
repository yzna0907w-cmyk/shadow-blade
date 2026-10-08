'use strict';

// ═══════════════════════════════════════════════════
// EMBER — Mega Crypt (خريطة متصلة 5760×540)
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
    // ═══ جدران ═══
    { x: 15, y: 270, w: 30, h: 540 },
    { x: 5745, y: 270, w: 30, h: 540 },

    // ═══ سقف ═══
    { x: 2880, y: 15, w: 5760, h: 30 },

    // ═══ الأرضية الرئيسية (سميكة + بلاط أزرق) ═══
    { x: 2880, y: 515, w: 5760, h: 80 },

    // ═══ سلسلة منصات قابلة للقفز - الشاشة 1-2 ═══
    { x: 500, y: 440, w: 130, h: 24 },
    { x: 720, y: 360, w: 130, h: 24 },
    { x: 940, y: 280, w: 130, h: 24 },

    // ═══ الشاشة 3-4 ═══
    { x: 1250, y: 430, w: 140, h: 24 },
    { x: 1480, y: 350, w: 130, h: 24 },
    { x: 1710, y: 430, w: 130, h: 24 },

    // ═══ الشاشة 5-6 ═══
    { x: 2050, y: 440, w: 140, h: 24 },
    { x: 2280, y: 360, w: 130, h: 24 },
    { x: 2510, y: 440, w: 130, h: 24 },

    // ═══ الشاشة 7 ═══
    { x: 2850, y: 380, w: 160, h: 24 },
    { x: 3080, y: 300, w: 130, h: 24 },

    // ═══ الشاشة 8-9 ═══
    { x: 3420, y: 430, w: 140, h: 24 },
    { x: 3650, y: 350, w: 130, h: 24 },
    { x: 3880, y: 430, w: 130, h: 24 },

    // ═══ الشاشة 10-11 ═══
    { x: 4250, y: 400, w: 140, h: 24 },
    { x: 4480, y: 320, w: 130, h: 24 },
    { x: 4710, y: 400, w: 130, h: 24 },

    // ═══ منصة البوس (الشاشة 12) ═══
    { x: 5250, y: 400, w: 400, h: 24 }
  ],

  decor: [
    // كريستالات صغيرة
    { key: 'crystal-1', x: 200, y: 515, scale: 0.2 },
    { key: 'crystal-2', x: 800, y: 515, scale: 0.25 },
    { key: 'crystal-3', x: 1600, y: 515, scale: 0.2 },
    { key: 'crystal-pile-1', x: 2400, y: 515, scale: 0.22 },
    { key: 'crystal-1', x: 3200, y: 515, scale: 0.2 },
    { key: 'crystal-pile-2', x: 4000, y: 515, scale: 0.25 },
    { key: 'crystal-2', x: 4800, y: 515, scale: 0.2 },
    { key: 'crystal-3', x: 5450, y: 515, scale: 0.25 },

    // شموع
    { key: 'candlestick', x: 400, y: 515, scale: 0.35 },
    { key: 'fire', x: 1200, y: 515, scale: 0.3 },
    { key: 'candlestick', x: 2000, y: 515, scale: 0.35 },
    { key: 'fire', x: 2800, y: 515, scale: 0.3 },
    { key: 'candlestick', x: 3600, y: 515, scale: 0.35 },
    { key: 'fire', x: 4400, y: 515, scale: 0.3 },
    { key: 'candlestick', x: 5200, y: 515, scale: 0.35 },

    // صخور صغيرة
    { key: 'rock-01', x: 600, y: 515, scale: 0.2 },
    { key: 'rock-02', x: 1500, y: 515, scale: 0.22 },
    { key: 'rock-03', x: 2300, y: 515, scale: 0.2 },
    { key: 'rock-04', x: 3100, y: 515, scale: 0.22 },
    { key: 'rock-05', x: 3900, y: 515, scale: 0.2 },
    { key: 'rock-06', x: 4700, y: 515, scale: 0.22 },

    // أعمدة متوسطة
    { key: 'pillar', x: 1400, y: 515, scale: 0.35 },
    { key: 'pillar', x: 3400, y: 515, scale: 0.35 },
    { key: 'pillar', x: 5000, y: 515, scale: 0.35 }
  ],

  enemies: [],
  npcs: [],
  puzzles: [],
  exits: {}
};

if (typeof ROOMS !== 'undefined') {
  ROOMS['mega-crypt'] = MEGA_CRYPT;
}

console.log('✅ MEGA_CRYPT loaded — 5760×540');
