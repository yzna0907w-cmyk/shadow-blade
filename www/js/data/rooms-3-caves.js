// ═══════════════════════════════════════════════════
// EMBER — القسم 3: كهوف الكريستال (30 غرفة)
// ═══════════════════════════════════════════════════
'use strict';

Object.assign(ROOMS, {

  // ═══ 1-5: مدخل الكهوف ═══
  'caves-01': { id: 'caves-01', section: 2, type: 'small', width: 480, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'مدخل الكهوف',
    platforms: [{ x: 240, y: 240, w: 480, h: 30 }],
    enemies: [], npcs: [], puzzles: [],
    exits: { right: 'caves-02' } },

  'caves-02': { id: 'caves-02', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'صالة البلورات',
    platforms: [
      { x: 200, y: 240, w: 400, h: 30 },
      { x: 480, y: 180, w: 180, h: 20 },
      { x: 760, y: 240, w: 400, h: 30 }
    ],
    enemies: [{ type: 'monster-5', x: 400, y: 200 }, { type: 'monster-5', x: 750, y: 200 }],
    npcs: [], puzzles: [], exits: { left: 'caves-01', right: 'caves-03' } },

  'caves-03': { id: 'caves-03', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'الممر المتوهج',
    platforms: [
      { x: 480, y: 240, w: 960, h: 30 },
      { x: 300, y: 180, w: 150, h: 20 },
      { x: 660, y: 180, w: 150, h: 20 }
    ],
    enemies: [{ type: 'monster-6', x: 480, y: 150 }],
    npcs: [], puzzles: [],
    exits: { left: 'caves-02', right: 'caves-04' } },

  'caves-04': { id: 'caves-04', section: 2, type: 'small', width: 480, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'مختبر العطّار',
    platforms: [{ x: 240, y: 240, w: 480, h: 30 }],
    enemies: [], npcs: [{ key: 'herbalist', x: 300, y: 200 }], puzzles: [],
    exits: { left: 'caves-03', right: 'caves-05' } },

  'caves-05': { id: 'caves-05', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'حقل الأشواك الكريستالية',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [{ type: 'monster-5', x: 500, y: 200 }],
    npcs: [], puzzles: [
      { type: 'spike', x: 300, y: 220, width: 120, height: 20, damage: 20 },
      { type: 'spike', x: 600, y: 220, width: 120, height: 20, damage: 20 }
    ],
    exits: { left: 'caves-04', right: 'caves-06' } },

  // ═══ 6-10: وسط الكهوف ═══
  'caves-06': { id: 'caves-06', section: 2, type: 'tower', width: 480, height: 810,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'برج الكهوف',
    platforms: [
      { x: 240, y: 780, w: 480, h: 30 },
      { x: 120, y: 650, w: 200, h: 20 },
      { x: 360, y: 520, w: 200, h: 20 },
      { x: 120, y: 390, w: 200, h: 20 },
      { x: 360, y: 260, w: 200, h: 20 },
      { x: 240, y: 130, w: 480, h: 30 }
    ],
    enemies: [{ type: 'monster-5', x: 120, y: 600 }, { type: 'monster-6', x: 360, y: 470 }],
    npcs: [], puzzles: [],
    exits: { up: 'caves-07', down: 'caves-05' } },

  'caves-07': { id: 'caves-07', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'قاعة الانعكاسات',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [
      { type: 'monster-5', x: 300, y: 200 },
      { type: 'monster-6', x: 600, y: 200 },
      { type: 'monster-5', x: 800, y: 200 }
    ],
    npcs: [], puzzles: [], exits: { left: 'caves-06', right: 'caves-08' } },

  'caves-08': { id: 'caves-08', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'المصعد الكريستالي',
    platforms: [
      { x: 150, y: 240, w: 300, h: 30 },
      { x: 810, y: 240, w: 300, h: 30 }
    ],
    enemies: [], npcs: [], puzzles: [
      { type: 'moving-platform', x: 480, y: 220, width: 130, moveX: 250, duration: 2600 }
    ],
    exits: { left: 'caves-07', right: 'caves-09' } },

  'caves-09': { id: 'caves-09', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'بحيرة متوهجة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [{ type: 'monster-6', x: 480, y: 200 }],
    npcs: [], puzzles: [
      { type: 'arena', x: 480, y: 180, width: 600, height: 400,
        enemyCount: 5, enemyType: 'monster-5', sectionIdx: 2 }
    ],
    exits: { left: 'caves-08', right: 'caves-10' } },

  'caves-10': { id: 'caves-10', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'وادي البلورات',
    platforms: [
      { x: 300, y: 240, w: 600, h: 30 },
      { x: 750, y: 180, w: 150, h: 20 }
    ],
    enemies: [{ type: 'monster-5', x: 500, y: 200 }],
    npcs: [], puzzles: [
      { type: 'spike', x: 700, y: 220, width: 200, height: 20, damage: 25 }
    ],
    exits: { left: 'caves-09', right: 'caves-11' } },

  // ═══ 11-15: ألغاز الكهوف ═══
  'caves-11': { id: 'caves-11', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'بوابة الرافعة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'lever', x: 200, y: 200, targetDoor: 'cavesDoor' },
      { type: 'door', x: 850, y: 200, width: 40, height: 100, id: 'cavesDoor' }
    ],
    exits: { left: 'caves-10', right: 'caves-12' } },

  'caves-12': { id: 'caves-12', section: 2, type: 'small', width: 480, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'الغرفة السرية',
    platforms: [{ x: 240, y: 240, w: 480, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'locked-chest', x: 240, y: 200, keyId: 'key_silver',
        rewards: { shards: 120, atoms: 3 } }
    ],
    exits: { left: 'caves-11' } },

  'caves-13': { id: 'caves-13', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'لغز الذاكرة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'memory', x: 480, y: 180, count: 4, sequenceLength: 6 }
    ],
    exits: { left: 'caves-12' } },

  'caves-14': { id: 'caves-14', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'قاعة الأشعة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'light', source: { x: 100, y: 150 }, target: { x: 850, y: 150 },
        mirrors: [{ x: 350, y: 150, angle: 45 }, { x: 600, y: 150, angle: 45 }] }
    ],
    exits: { left: 'caves-13' } },

  'caves-15': { id: 'caves-15', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'مذبح الكريستال',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'crystal-puzzle', x: 480, y: 180,
        crystals: [{x:340,y:180},{x:440,y:100},{x:540,y:180},{x:640,y:100},{x:740,y:180}] }
    ],
    exits: { left: 'caves-14' } },

  // ═══ 16-20: عمق الكهوف ═══
  'caves-16': { id: 'caves-16', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'ممر الجليد',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [{ type: 'monster-5', x: 300, y: 200 }, { type: 'monster-6', x: 700, y: 200 }],
    npcs: [], puzzles: [], exits: { left: 'caves-15', right: 'caves-17' } },

  'caves-17': { id: 'caves-17', section: 2, type: 'large', width: 1440, height: 540,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'قاعة الحراس',
    platforms: [
      { x: 720, y: 510, w: 1440, h: 30 },
      { x: 400, y: 350, w: 150, h: 20 },
      { x: 720, y: 250, w: 150, h: 20 },
      { x: 1040, y: 350, w: 150, h: 20 }
    ],
    enemies: [
      { type: 'monster-6', x: 400, y: 300 },
      { type: 'monster-5', x: 720, y: 200 },
      { type: 'monster-6', x: 1040, y: 300 }
    ],
    npcs: [], puzzles: [
      { type: 'arena', x: 720, y: 300, width: 800, height: 500,
        enemyCount: 7, enemyType: 'monster-5', sectionIdx: 2 }
    ],
    exits: { left: 'caves-16', right: 'caves-18' } },

  'caves-18': { id: 'caves-18', section: 2, type: 'tower', width: 480, height: 810,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'العمود الصاعد',
    platforms: [
      { x: 240, y: 780, w: 480, h: 30 },
      { x: 120, y: 650, w: 200, h: 20 },
      { x: 360, y: 520, w: 200, h: 20 },
      { x: 120, y: 390, w: 200, h: 20 },
      { x: 240, y: 130, w: 480, h: 30 }
    ],
    enemies: [{ type: 'monster-6', x: 120, y: 600 }, { type: 'monster-5', x: 360, y: 470 }],
    npcs: [], puzzles: [
      { type: 'push-block', x: 240, y: 700, targetX: 240, targetY: 400 }
    ],
    exits: { up: 'caves-19', down: 'caves-17' } },

  'caves-19': { id: 'caves-19', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'الوادي المسحور',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [
      { type: 'monster-6', x: 300, y: 200 },
      { type: 'monster-5', x: 600, y: 200 },
      { type: 'monster-6', x: 800, y: 200 }
    ],
    npcs: [], puzzles: [], exits: { left: 'caves-18', right: 'caves-20' } },

  'caves-20': { id: 'caves-20', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'حلقة الطقوس',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'memory', x: 480, y: 180, count: 4, sequenceLength: 7 }
    ],
    exits: { left: 'caves-19', right: 'caves-21' } },

  // ═══ 21-25: قبل البوس ═══
  'caves-21': { id: 'caves-21', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'ممر النخبة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [{ type: 'monster-6', x: 480, y: 200 }],
    npcs: [], puzzles: [
      { type: 'arena', x: 480, y: 180, width: 600, height: 400,
        enemyCount: 4, enemyType: 'monster-6', sectionIdx: 2 }
    ],
    exits: { left: 'caves-20', right: 'caves-22' } },

  'caves-22': { id: 'caves-22', section: 2, type: 'small', width: 480, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'غرفة الحفظ',
    platforms: [{ x: 240, y: 240, w: 480, h: 30 }],
    enemies: [], npcs: [], puzzles: [],
    exits: { left: 'caves-21', right: 'caves-23' } },

  'caves-23': { id: 'caves-23', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'مدخل عرين السلحفاة',
    platforms: [
      { x: 200, y: 240, w: 400, h: 30 },
      { x: 480, y: 180, w: 200, h: 20 },
      { x: 760, y: 240, w: 400, h: 30 }
    ],
    enemies: [{ type: 'monster-6', x: 480, y: 150 }],
    npcs: [], puzzles: [], exits: { left: 'caves-22', right: 'caves-24' } },

  'caves-24': { id: 'caves-24', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'قبل السلحفاة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'lever', x: 200, y: 200, targetDoor: 'cavesBossDoor', mandatory: true },
      { type: 'door', x: 850, y: 200, width: 40, height: 100, id: 'cavesBossDoor' }
    ],
    exits: { left: 'caves-23', right: 'caves-25' } },

  'caves-25': { id: 'caves-25', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'الغرفة المختومة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'locked-chest', x: 480, y: 200, keyId: 'key_gold',
        rewards: { shards: 200, atoms: 6 } }
    ],
    exits: { left: 'caves-24' } },

  // ═══ 26-30: النهاية ═══
  'caves-26': { id: 'caves-26', section: 2, type: 'tower', width: 480, height: 810,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'برج السلحفاة',
    platforms: [
      { x: 240, y: 780, w: 480, h: 30 },
      { x: 120, y: 650, w: 200, h: 20 },
      { x: 360, y: 520, w: 200, h: 20 },
      { x: 120, y: 390, w: 200, h: 20 },
      { x: 240, y: 130, w: 480, h: 30 }
    ],
    enemies: [{ type: 'monster-5', x: 120, y: 600 }],
    npcs: [], puzzles: [], exits: { up: 'caves-27', down: 'caves-25' } },

  'caves-27': { id: 'caves-27', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'الممر الأخير',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [
      { type: 'monster-5', x: 300, y: 200 },
      { type: 'monster-5', x: 600, y: 200 }
    ],
    npcs: [], puzzles: [], exits: { left: 'caves-26', right: 'caves-28' } },

  'caves-28': { id: 'caves-28', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'باب السلحفاة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [],
    exits: { left: 'caves-27', right: 'caves-29' } },

  'caves-29': { id: 'caves-29', section: 2, type: 'medium', width: 960, height: 270,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'قبل السلحفاة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'door', x: 850, y: 200, width: 40, height: 100, id: 'cavesDoor2' },
      { type: 'lever', x: 200, y: 200, targetDoor: 'cavesDoor2', mandatory: true }
    ],
    exits: { left: 'caves-28', right: 'caves-30' } },

  'caves-30': { id: 'caves-30', section: 2, type: 'large', width: 1440, height: 540,
    bg: 'bg-caves', tiles: 'tile-caves', name: 'عرين السلحفاة القتالية',
    platforms: [{ x: 720, y: 510, w: 1440, h: 30 }],
    enemies: [], npcs: [], puzzles: [],
    exits: { left: 'caves-29' },
    isBossRoom: true
  }

});

console.log('✅ Caves section loaded — 30 rooms');
