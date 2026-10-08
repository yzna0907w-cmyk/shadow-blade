'use strict';

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

    // ═══ الأرضية الرئيسية ═══
    { x: 2880, y: 515, w: 5760, h: 80 },

    // ═══ المنطقة 1: مقدمة (سلسلة صعود) ═══
    { x: 350, y: 445, w: 120, h: 20 },
    { x: 550, y: 385, w: 120, h: 20 },
    { x: 750, y: 325, w: 120, h: 20 },

    // ═══ المنطقة 2: وسط ═══
    { x: 1050, y: 445, w: 140, h: 20 },
    { x: 1280, y: 385, w: 120, h: 20 },

    // ═══ المنطقة 3: سلسلة ثانية ═══
    { x: 1600, y: 445, w: 120, h: 20 },
    { x: 1800, y: 385, w: 120, h: 20 },
    { x: 2000, y: 325, w: 120, h: 20 },

    // ═══ المنطقة 4: هبوط آمن ═══
    { x: 2300, y: 445, w: 160, h: 20 },

    // ═══ المنطقة 5: برج ═══
    { x: 2700, y: 445, w: 120, h: 20 },
    { x: 2900, y: 385, w: 120, h: 20 },
    { x: 3100, y: 325, w: 120, h: 20 },

    // ═══ المنطقة 6: إعادة الصعود ═══
    { x: 3450, y: 445, w: 120, h: 20 },
    { x: 3650, y: 385, w: 120, h: 20 },

    // ═══ المنطقة 7: طريق مفتوح ═══
    { x: 4000, y: 445, w: 180, h: 20 },

    // ═══ المنطقة 8: قفزات نهائية ═══
    { x: 4350, y: 445, w: 120, h: 20 },
    { x: 4550, y: 385, w: 120, h: 20 },

    // ═══ منصة البوس ═══
    { x: 5200, y: 420, w: 500, h: 20 }
  ],

  decor: [
    // ═══ كريستالات (على الأرض) — توزيع كل 600px ═══
    { key: 'crystal-pile-1', x: 300,  y: 480, scale: 0.45 },
    { key: 'crystal-1',      x: 900,  y: 480, scale: 0.4 },
    { key: 'crystal-pile-2', x: 1500, y: 480, scale: 0.45 },
    { key: 'crystal-2',      x: 2100, y: 480, scale: 0.4 },
    { key: 'crystal-3',      x: 2700, y: 480, scale: 0.45 },
    { key: 'crystal-pile-1', x: 3400, y: 480, scale: 0.4 },
    { key: 'crystal-2',      x: 4100, y: 480, scale: 0.45 },
    { key: 'crystal-pile-2', x: 4900, y: 480, scale: 0.4 },

    // ═══ شموع (وسط) — توزيع كل 800px ═══
    { key: 'candlestick', x: 600,  y: 480, scale: 0.5 },
    { key: 'fire',        x: 1300, y: 480, scale: 0.45 },
    { key: 'candlestick', x: 2200, y: 480, scale: 0.5 },
    { key: 'fire',        x: 3000, y: 480, scale: 0.45 },
    { key: 'candlestick', x: 3800, y: 480, scale: 0.5 },
    { key: 'fire',        x: 4700, y: 480, scale: 0.45 },

    // ═══ أشجار ميتة (3 فقط، واضحة) ═══
    { key: 'tree', x: 1200, y: 480, scale: 0.7 },
    { key: 'tree', x: 3200, y: 480, scale: 0.7 },
    { key: 'tree', x: 4500, y: 480, scale: 0.7 },

    // ═══ أعمدة (3 فقط، فخمة) ═══
    { key: 'pillar', x: 1800, y: 480, scale: 0.6 },
    { key: 'pillar', x: 3600, y: 480, scale: 0.6 },
    { key: 'pillar', x: 5100, y: 480, scale: 0.6 },

    // ═══ صخور صغيرة ═══
    { key: 'rock-01', x: 500,  y: 490, scale: 0.35 },
    { key: 'rock-03', x: 1600, y: 490, scale: 0.35 },
    { key: 'rock-02', x: 2500, y: 490, scale: 0.35 },
    { key: 'rock-05', x: 3900, y: 490, scale: 0.35 }
  ],

  enemies: [
    // ═══ الشاشة 3-4 (1000-1900) ═══
    { type: 'monster-1', x: 1100, y: 400 },
    { type: 'monster-1', x: 1700, y: 400 },

    // ═══ الشاشة 5-6 (1900-2900) ═══
    { type: 'monster-2', x: 2100, y: 400 },
    { type: 'monster-1', x: 2500, y: 400 },
    { type: 'monster-2', x: 2800, y: 400 },

    // ═══ الشاشة 7-8 (2900-3900) ═══
    { type: 'monster-1', x: 3100, y: 400 },
    { type: 'monster-2', x: 3500, y: 400 },
    { type: 'monster-1', x: 3800, y: 400 },

    // ═══ الشاشة 9-10 (3900-4800) ═══
    { type: 'monster-2', x: 4100, y: 400 },
    { type: 'monster-2', x: 4400, y: 400 },
    { type: 'monster-1', x: 4700, y: 400 }
  ],
  npcs: [],
  puzzles: [
    // ═══ أشواك ═══
    { type: 'spike', x: 1900, y: 480, width: 100, height: 20, damage: 10 },
    { type: 'spike', x: 3300, y: 480, width: 120, height: 20, damage: 12 },
    { type: 'spike', x: 4200, y: 480, width: 100, height: 20, damage: 10 },

    // ═══ صناديق كنز ═══
    { type: 'locked-chest', x: 1400, y: 430,
      keyId: 'key_silver', rewards: { shards: 30, atoms: 1 } },
    { type: 'locked-chest', x: 2600, y: 430,
      keyId: 'key_silver', rewards: { shards: 50, atoms: 1 } },
    { type: 'locked-chest', x: 3900, y: 430,
      keyId: 'key_gold', rewards: { shards: 80, atoms: 2 } },
    { type: 'locked-chest', x: 4900, y: 430,
      keyId: 'key_gold', rewards: { shards: 120, atoms: 3 } }
  ],

  // ═══ مُشغّل البوس (يبدأ عند وصول اللاعب) ═══
  bossTrigger: { x: 5100, bossKey: 'robot' },
  exits: {
    right: 'mega-crypt-next'   // placeholder — نفعّله لاحقاً
  }
};

if (typeof ROOMS !== 'undefined') {
  ROOMS['mega-crypt'] = MEGA_CRYPT;
}

console.log('✅ MEGA_CRYPT loaded — 5760×540');
