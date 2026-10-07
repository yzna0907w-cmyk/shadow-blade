// ═══════════════════════════════════════════════════
// EMBER — القسم 4: الغابة الميتة (30 غرفة)
// ═══════════════════════════════════════════════════
'use strict';

Object.assign(ROOMS, {

  'forest-01': { id: 'forest-01', section: 3, type: 'small', width: 480, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'أطراف الغابة',
    platforms: [{ x: 240, y: 240, w: 480, h: 30 }],
    enemies: [], npcs: [], puzzles: [],
    exits: { right: 'forest-02' } },

  'forest-02': { id: 'forest-02', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'الممر المسحور',
    platforms: [
      { x: 200, y: 240, w: 400, h: 30 },
      { x: 480, y: 180, w: 180, h: 20 },
      { x: 760, y: 240, w: 400, h: 30 }
    ],
    enemies: [{ type: 'monster-7', x: 400, y: 200 }, { type: 'monster-7', x: 750, y: 200 }],
    npcs: [], puzzles: [], exits: { left: 'forest-01', right: 'forest-03' } },

  'forest-03': { id: 'forest-03', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'أشجار عالية',
    platforms: [
      { x: 480, y: 240, w: 960, h: 30 },
      { x: 300, y: 180, w: 150, h: 20 },
      { x: 660, y: 180, w: 150, h: 20 }
    ],
    enemies: [{ type: 'monster-8', x: 480, y: 150 }],
    npcs: [], puzzles: [],
    exits: { left: 'forest-02', right: 'forest-04' } },

  'forest-04': { id: 'forest-04', section: 3, type: 'small', width: 480, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'كوخ تاجر التحف',
    platforms: [{ x: 240, y: 240, w: 480, h: 30 }],
    enemies: [], npcs: [{ key: 'relic_trader', x: 300, y: 200 }], puzzles: [],
    exits: { left: 'forest-03', right: 'forest-05' } },

  'forest-05': { id: 'forest-05', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'حقل الأشواك',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [{ type: 'monster-7', x: 500, y: 200 }],
    npcs: [], puzzles: [
      { type: 'spike', x: 300, y: 220, width: 120, height: 20, damage: 22 },
      { type: 'spike', x: 600, y: 220, width: 120, height: 20, damage: 22 }
    ],
    exits: { left: 'forest-04', right: 'forest-06' } },

  'forest-06': { id: 'forest-06', section: 3, type: 'tower', width: 480, height: 810,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'شجرة الأبراج',
    platforms: [
      { x: 240, y: 780, w: 480, h: 30 },
      { x: 120, y: 650, w: 200, h: 20 },
      { x: 360, y: 520, w: 200, h: 20 },
      { x: 120, y: 390, w: 200, h: 20 },
      { x: 360, y: 260, w: 200, h: 20 },
      { x: 240, y: 130, w: 480, h: 30 }
    ],
    enemies: [{ type: 'monster-7', x: 120, y: 600 }, { type: 'monster-8', x: 360, y: 470 }],
    npcs: [], puzzles: [],
    exits: { up: 'forest-07', down: 'forest-05' } },

  'forest-07': { id: 'forest-07', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'قاعة القطعان',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [
      { type: 'monster-7', x: 300, y: 200 },
      { type: 'monster-8', x: 600, y: 200 },
      { type: 'monster-7', x: 800, y: 200 }
    ],
    npcs: [], puzzles: [], exits: { left: 'forest-06', right: 'forest-08' } },

  'forest-08': { id: 'forest-08', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'الجسر المعلق',
    platforms: [
      { x: 150, y: 240, w: 300, h: 30 },
      { x: 810, y: 240, w: 300, h: 30 }
    ],
    enemies: [], npcs: [], puzzles: [
      { type: 'moving-platform', x: 480, y: 220, width: 130, moveX: 250, duration: 2400 }
    ],
    exits: { left: 'forest-07', right: 'forest-09' } },

  'forest-09': { id: 'forest-09', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'بحيرة القمر',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [{ type: 'monster-8', x: 480, y: 200 }],
    npcs: [], puzzles: [
      { type: 'arena', x: 480, y: 180, width: 600, height: 400,
        enemyCount: 5, enemyType: 'monster-7', sectionIdx: 3 }
    ],
    exits: { left: 'forest-08', right: 'forest-10' } },

  'forest-10': { id: 'forest-10', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'وادي الظلال',
    platforms: [
      { x: 300, y: 240, w: 600, h: 30 },
      { x: 750, y: 180, w: 150, h: 20 }
    ],
    enemies: [{ type: 'monster-7', x: 500, y: 200 }],
    npcs: [], puzzles: [
      { type: 'spike', x: 700, y: 220, width: 200, height: 20, damage: 25 }
    ],
    exits: { left: 'forest-09', right: 'forest-11' } },

  'forest-11': { id: 'forest-11', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'بوابة الفأس',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'lever', x: 200, y: 200, targetDoor: 'forestDoor' },
      { type: 'door', x: 850, y: 200, width: 40, height: 100, id: 'forestDoor' }
    ],
    exits: { left: 'forest-10', right: 'forest-12' } },

  'forest-12': { id: 'forest-12', section: 3, type: 'small', width: 480, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'الغرفة السرية',
    platforms: [{ x: 240, y: 240, w: 480, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'locked-chest', x: 240, y: 200, keyId: 'key_silver',
        rewards: { shards: 150, atoms: 4 } }
    ],
    exits: { left: 'forest-11' } },

  'forest-13': { id: 'forest-13', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'لغز الذاكرة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'memory', x: 480, y: 180, count: 4, sequenceLength: 6 }
    ],
    exits: { left: 'forest-12' } },

  'forest-14': { id: 'forest-14', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'معبد الأشعة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'light', source: { x: 100, y: 150 }, target: { x: 850, y: 150 },
        mirrors: [{ x: 350, y: 150, angle: 45 }, { x: 600, y: 150, angle: 45 }] }
    ],
    exits: { left: 'forest-13' } },

  'forest-15': { id: 'forest-15', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'مذبح الغابة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'crystal-puzzle', x: 480, y: 180,
        crystals: [{x:340,y:180},{x:440,y:100},{x:540,y:180},{x:640,y:100},{x:740,y:180}] }
    ],
    exits: { left: 'forest-14' } },

  'forest-16': { id: 'forest-16', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'ممر الأوراق',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [{ type: 'monster-7', x: 300, y: 200 }, { type: 'monster-8', x: 700, y: 200 }],
    npcs: [], puzzles: [], exits: { left: 'forest-15', right: 'forest-17' } },

  'forest-17': { id: 'forest-17', section: 3, type: 'large', width: 1440, height: 540,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'قاعة القطيع',
    platforms: [
      { x: 720, y: 510, w: 1440, h: 30 },
      { x: 400, y: 350, w: 150, h: 20 },
      { x: 720, y: 250, w: 150, h: 20 },
      { x: 1040, y: 350, w: 150, h: 20 }
    ],
    enemies: [
      { type: 'monster-8', x: 400, y: 300 },
      { type: 'monster-7', x: 720, y: 200 },
      { type: 'monster-8', x: 1040, y: 300 }
    ],
    npcs: [], puzzles: [
      { type: 'arena', x: 720, y: 300, width: 800, height: 500,
        enemyCount: 8, enemyType: 'monster-7', sectionIdx: 3 }
    ],
    exits: { left: 'forest-16', right: 'forest-18' } },

  'forest-18': { id: 'forest-18', section: 3, type: 'tower', width: 480, height: 810,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'برج الخنزير',
    platforms: [
      { x: 240, y: 780, w: 480, h: 30 },
      { x: 120, y: 650, w: 200, h: 20 },
      { x: 360, y: 520, w: 200, h: 20 },
      { x: 120, y: 390, w: 200, h: 20 },
      { x: 240, y: 130, w: 480, h: 30 }
    ],
    enemies: [{ type: 'monster-8', x: 120, y: 600 }, { type: 'monster-8', x: 360, y: 470 }],
    npcs: [], puzzles: [
      { type: 'push-block', x: 240, y: 700, targetX: 240, targetY: 400 }
    ],
    exits: { up: 'forest-19', down: 'forest-17' } },

  'forest-19': { id: 'forest-19', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'الوادي الملعون',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [
      { type: 'monster-8', x: 300, y: 200 },
      { type: 'monster-7', x: 600, y: 200 },
      { type: 'monster-8', x: 800, y: 200 }
    ],
    npcs: [], puzzles: [], exits: { left: 'forest-18', right: 'forest-20' } },

  'forest-20': { id: 'forest-20', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'حلقة الأشجار',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'memory', x: 480, y: 180, count: 4, sequenceLength: 7 }
    ],
    exits: { left: 'forest-19', right: 'forest-21' } },

  'forest-21': { id: 'forest-21', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'ممر النخبة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [{ type: 'monster-8', x: 480, y: 200 }],
    npcs: [], puzzles: [
      { type: 'arena', x: 480, y: 180, width: 600, height: 400,
        enemyCount: 4, enemyType: 'monster-8', sectionIdx: 3 }
    ],
    exits: { left: 'forest-20', right: 'forest-22' } },

  'forest-22': { id: 'forest-22', section: 3, type: 'small', width: 480, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'غرفة الحفظ',
    platforms: [{ x: 240, y: 240, w: 480, h: 30 }],
    enemies: [], npcs: [], puzzles: [],
    exits: { left: 'forest-21', right: 'forest-23' } },

  'forest-23': { id: 'forest-23', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'مدخل العرين',
    platforms: [
      { x: 200, y: 240, w: 400, h: 30 },
      { x: 480, y: 180, w: 200, h: 20 },
      { x: 760, y: 240, w: 400, h: 30 }
    ],
    enemies: [{ type: 'monster-8', x: 480, y: 150 }],
    npcs: [], puzzles: [], exits: { left: 'forest-22', right: 'forest-24' } },

  'forest-24': { id: 'forest-24', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'قبل الخنزير',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'lever', x: 200, y: 200, targetDoor: 'forestBossDoor', mandatory: true },
      { type: 'door', x: 850, y: 200, width: 40, height: 100, id: 'forestBossDoor' }
    ],
    exits: { left: 'forest-23', right: 'forest-25' } },

  'forest-25': { id: 'forest-25', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'الغرفة المختومة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'locked-chest', x: 480, y: 200, keyId: 'key_gold',
        rewards: { shards: 250, atoms: 8 } }
    ],
    exits: { left: 'forest-24' } },

  'forest-26': { id: 'forest-26', section: 3, type: 'tower', width: 480, height: 810,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'برج الفأس',
    platforms: [
      { x: 240, y: 780, w: 480, h: 30 },
      { x: 120, y: 650, w: 200, h: 20 },
      { x: 360, y: 520, w: 200, h: 20 },
      { x: 120, y: 390, w: 200, h: 20 },
      { x: 240, y: 130, w: 480, h: 30 }
    ],
    enemies: [{ type: 'monster-7', x: 120, y: 600 }],
    npcs: [], puzzles: [], exits: { up: 'forest-27', down: 'forest-25' } },

  'forest-27': { id: 'forest-27', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'الممر الأخير',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [
      { type: 'monster-7', x: 300, y: 200 },
      { type: 'monster-7', x: 600, y: 200 }
    ],
    npcs: [], puzzles: [], exits: { left: 'forest-26', right: 'forest-28' } },

  'forest-28': { id: 'forest-28', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'باب الخنزير',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [],
    exits: { left: 'forest-27', right: 'forest-29' } },

  'forest-29': { id: 'forest-29', section: 3, type: 'medium', width: 960, height: 270,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'قبل الخنزير',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'door', x: 850, y: 200, width: 40, height: 100, id: 'forestDoor2' },
      { type: 'lever', x: 200, y: 200, targetDoor: 'forestDoor2', mandatory: true }
    ],
    exits: { left: 'forest-28', right: 'forest-30' } },

  'forest-30': { id: 'forest-30', section: 3, type: 'large', width: 1440, height: 540,
    bg: 'bg-forest', tiles: 'tile-forest', name: 'عرين الخنزير البري',
    platforms: [{ x: 720, y: 510, w: 1440, h: 30 }],
    enemies: [], npcs: [], puzzles: [],
    exits: { left: 'forest-29' },
    isBossRoom: true
  }

});

console.log('✅ Forest section loaded — 30 rooms');
