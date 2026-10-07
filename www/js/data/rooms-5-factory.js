// ═══════════════════════════════════════════════════
// EMBER — القسم 5: المصنع المحروق (30 غرفة)
// ═══════════════════════════════════════════════════
'use strict';

Object.assign(ROOMS, {

  'factory-01': { id: 'factory-01', section: 4, type: 'small', width: 480, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'بوابة المصنع',
    platforms: [{ x: 240, y: 240, w: 480, h: 30 }],
    enemies: [], npcs: [], puzzles: [],
    exits: { right: 'factory-02' } },

  'factory-02': { id: 'factory-02', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'الخط الأول',
    platforms: [
      { x: 200, y: 240, w: 400, h: 30 },
      { x: 480, y: 180, w: 180, h: 20 },
      { x: 760, y: 240, w: 400, h: 30 }
    ],
    enemies: [{ type: 'monster-9', x: 400, y: 200 }, { type: 'monster-9', x: 750, y: 200 }],
    npcs: [], puzzles: [], exits: { left: 'factory-01', right: 'factory-03' } },

  'factory-03': { id: 'factory-03', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'الأنابيب الساخنة',
    platforms: [
      { x: 480, y: 240, w: 960, h: 30 },
      { x: 300, y: 180, w: 150, h: 20 },
      { x: 660, y: 180, w: 150, h: 20 }
    ],
    enemies: [{ type: 'monster-10', x: 480, y: 150 }],
    npcs: [], puzzles: [
      { type: 'spike', x: 300, y: 220, width: 100, height: 20, damage: 25 },
      { type: 'spike', x: 600, y: 220, width: 100, height: 20, damage: 25 }
    ],
    exits: { left: 'factory-02', right: 'factory-04' } },

  'factory-04': { id: 'factory-04', section: 4, type: 'small', width: 480, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'مخبأ بائع الأسرار',
    platforms: [{ x: 240, y: 240, w: 480, h: 30 }],
    enemies: [], npcs: [{ key: 'secret_seller', x: 300, y: 200 }], puzzles: [],
    exits: { left: 'factory-03', right: 'factory-05' } },

  'factory-05': { id: 'factory-05', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'حقل الألغام',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [{ type: 'monster-9', x: 500, y: 200 }],
    npcs: [], puzzles: [
      { type: 'spike', x: 250, y: 220, width: 100, height: 20, damage: 25 },
      { type: 'spike', x: 480, y: 220, width: 100, height: 20, damage: 25 },
      { type: 'spike', x: 710, y: 220, width: 100, height: 20, damage: 25 }
    ],
    exits: { left: 'factory-04', right: 'factory-06' } },

  'factory-06': { id: 'factory-06', section: 4, type: 'tower', width: 480, height: 810,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'برج التبريد',
    platforms: [
      { x: 240, y: 780, w: 480, h: 30 },
      { x: 120, y: 650, w: 200, h: 20 },
      { x: 360, y: 520, w: 200, h: 20 },
      { x: 120, y: 390, w: 200, h: 20 },
      { x: 360, y: 260, w: 200, h: 20 },
      { x: 240, y: 130, w: 480, h: 30 }
    ],
    enemies: [{ type: 'monster-9', x: 120, y: 600 }, { type: 'monster-10', x: 360, y: 470 }],
    npcs: [], puzzles: [],
    exits: { up: 'factory-07', down: 'factory-05' } },

  'factory-07': { id: 'factory-07', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'قاعة الآلات',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [
      { type: 'monster-9', x: 300, y: 200 },
      { type: 'monster-10', x: 600, y: 200 },
      { type: 'monster-9', x: 800, y: 200 }
    ],
    npcs: [], puzzles: [], exits: { left: 'factory-06', right: 'factory-08' } },

  'factory-08': { id: 'factory-08', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'ناقل الحركة',
    platforms: [
      { x: 150, y: 240, w: 300, h: 30 },
      { x: 810, y: 240, w: 300, h: 30 }
    ],
    enemies: [], npcs: [], puzzles: [
      { type: 'moving-platform', x: 480, y: 220, width: 140, moveX: 250, duration: 2200 }
    ],
    exits: { left: 'factory-07', right: 'factory-09' } },

  'factory-09': { id: 'factory-09', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'حوض الحمم',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [{ type: 'monster-10', x: 480, y: 200 }],
    npcs: [], puzzles: [
      { type: 'arena', x: 480, y: 180, width: 600, height: 400,
        enemyCount: 5, enemyType: 'monster-9', sectionIdx: 4 }
    ],
    exits: { left: 'factory-08', right: 'factory-10' } },

  'factory-10': { id: 'factory-10', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'وادي الحديد',
    platforms: [
      { x: 300, y: 240, w: 600, h: 30 },
      { x: 750, y: 180, w: 150, h: 20 }
    ],
    enemies: [{ type: 'monster-9', x: 500, y: 200 }],
    npcs: [], puzzles: [
      { type: 'spike', x: 700, y: 220, width: 200, height: 20, damage: 28 }
    ],
    exits: { left: 'factory-09', right: 'factory-11' } },

  'factory-11': { id: 'factory-11', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'بوابة الرافعة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'lever', x: 200, y: 200, targetDoor: 'factoryDoor' },
      { type: 'door', x: 850, y: 200, width: 40, height: 100, id: 'factoryDoor' }
    ],
    exits: { left: 'factory-10', right: 'factory-12' } },

  'factory-12': { id: 'factory-12', section: 4, type: 'small', width: 480, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'الغرفة السرية',
    platforms: [{ x: 240, y: 240, w: 480, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'locked-chest', x: 240, y: 200, keyId: 'key_silver',
        rewards: { shards: 200, atoms: 5 } }
    ],
    exits: { left: 'factory-11' } },

  'factory-13': { id: 'factory-13', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'لغز الذاكرة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'memory', x: 480, y: 180, count: 4, sequenceLength: 7 }
    ],
    exits: { left: 'factory-12' } },

  'factory-14': { id: 'factory-14', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'قاعة الأشعة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'light', source: { x: 100, y: 150 }, target: { x: 850, y: 150 },
        mirrors: [{ x: 300, y: 150, angle: 45 }, { x: 550, y: 150, angle: 45 }, { x: 750, y: 150, angle: 45 }] }
    ],
    exits: { left: 'factory-13' } },

  'factory-15': { id: 'factory-15', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'مذبح البلورات',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'crystal-puzzle', x: 480, y: 180,
        crystals: [{x:300,y:180},{x:400,y:100},{x:500,y:180},{x:600,y:100},{x:700,y:180}] }
    ],
    exits: { left: 'factory-14' } },

  'factory-16': { id: 'factory-16', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'ممر الدبابة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [{ type: 'monster-9', x: 300, y: 200 }, { type: 'monster-10', x: 700, y: 200 }],
    npcs: [], puzzles: [], exits: { left: 'factory-15', right: 'factory-17' } },

  'factory-17': { id: 'factory-17', section: 4, type: 'large', width: 1440, height: 540,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'قاعة الحرب',
    platforms: [
      { x: 720, y: 510, w: 1440, h: 30 },
      { x: 400, y: 350, w: 150, h: 20 },
      { x: 720, y: 250, w: 150, h: 20 },
      { x: 1040, y: 350, w: 150, h: 20 }
    ],
    enemies: [
      { type: 'monster-10', x: 400, y: 300 },
      { type: 'monster-9', x: 720, y: 200 },
      { type: 'monster-10', x: 1040, y: 300 }
    ],
    npcs: [], puzzles: [
      { type: 'arena', x: 720, y: 300, width: 800, height: 500,
        enemyCount: 8, enemyType: 'monster-9', sectionIdx: 4 }
    ],
    exits: { left: 'factory-16', right: 'factory-18' } },

  'factory-18': { id: 'factory-18', section: 4, type: 'tower', width: 480, height: 810,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'برج الدبابة',
    platforms: [
      { x: 240, y: 780, w: 480, h: 30 },
      { x: 120, y: 650, w: 200, h: 20 },
      { x: 360, y: 520, w: 200, h: 20 },
      { x: 120, y: 390, w: 200, h: 20 },
      { x: 240, y: 130, w: 480, h: 30 }
    ],
    enemies: [{ type: 'monster-10', x: 120, y: 600 }, { type: 'monster-10', x: 360, y: 470 }],
    npcs: [], puzzles: [
      { type: 'push-block', x: 240, y: 700, targetX: 240, targetY: 400 }
    ],
    exits: { up: 'factory-19', down: 'factory-17' } },

  'factory-19': { id: 'factory-19', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'الوادي المحترق',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [
      { type: 'monster-10', x: 300, y: 200 },
      { type: 'monster-9', x: 600, y: 200 },
      { type: 'monster-10', x: 800, y: 200 }
    ],
    npcs: [], puzzles: [], exits: { left: 'factory-18', right: 'factory-20' } },

  'factory-20': { id: 'factory-20', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'حلقة الطقوس',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'memory', x: 480, y: 180, count: 4, sequenceLength: 8 }
    ],
    exits: { left: 'factory-19', right: 'factory-21' } },

  'factory-21': { id: 'factory-21', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'ممر النخبة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [{ type: 'monster-10', x: 480, y: 200 }],
    npcs: [], puzzles: [
      { type: 'arena', x: 480, y: 180, width: 600, height: 400,
        enemyCount: 5, enemyType: 'monster-10', sectionIdx: 4 }
    ],
    exits: { left: 'factory-20', right: 'factory-22' } },

  'factory-22': { id: 'factory-22', section: 4, type: 'small', width: 480, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'غرفة الحفظ',
    platforms: [{ x: 240, y: 240, w: 480, h: 30 }],
    enemies: [], npcs: [], puzzles: [],
    exits: { left: 'factory-21', right: 'factory-23' } },

  'factory-23': { id: 'factory-23', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'مدخل العرين',
    platforms: [
      { x: 200, y: 240, w: 400, h: 30 },
      { x: 480, y: 180, w: 200, h: 20 },
      { x: 760, y: 240, w: 400, h: 30 }
    ],
    enemies: [{ type: 'monster-10', x: 480, y: 150 }],
    npcs: [], puzzles: [], exits: { left: 'factory-22', right: 'factory-24' } },

  'factory-24': { id: 'factory-24', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'قبل الدبابة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'lever', x: 200, y: 200, targetDoor: 'factoryBossDoor', mandatory: true },
      { type: 'door', x: 850, y: 200, width: 40, height: 100, id: 'factoryBossDoor' }
    ],
    exits: { left: 'factory-23', right: 'factory-25' } },

  'factory-25': { id: 'factory-25', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'الغرفة المختومة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'locked-chest', x: 480, y: 200, keyId: 'key_gold',
        rewards: { shards: 300, atoms: 10 } }
    ],
    exits: { left: 'factory-24' } },

  'factory-26': { id: 'factory-26', section: 4, type: 'tower', width: 480, height: 810,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'برج النهاية',
    platforms: [
      { x: 240, y: 780, w: 480, h: 30 },
      { x: 120, y: 650, w: 200, h: 20 },
      { x: 360, y: 520, w: 200, h: 20 },
      { x: 120, y: 390, w: 200, h: 20 },
      { x: 240, y: 130, w: 480, h: 30 }
    ],
    enemies: [{ type: 'monster-9', x: 120, y: 600 }],
    npcs: [], puzzles: [], exits: { up: 'factory-27', down: 'factory-25' } },

  'factory-27': { id: 'factory-27', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'الممر الأخير',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [
      { type: 'monster-10', x: 300, y: 200 },
      { type: 'monster-10', x: 600, y: 200 }
    ],
    npcs: [], puzzles: [], exits: { left: 'factory-26', right: 'factory-28' } },

  'factory-28': { id: 'factory-28', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'باب الدبابة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [],
    exits: { left: 'factory-27', right: 'factory-29' } },

  'factory-29': { id: 'factory-29', section: 4, type: 'medium', width: 960, height: 270,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'قبل الدبابة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'door', x: 850, y: 200, width: 40, height: 100, id: 'factoryDoor2' },
      { type: 'lever', x: 200, y: 200, targetDoor: 'factoryDoor2', mandatory: true }
    ],
    exits: { left: 'factory-28', right: 'factory-30' } },

  'factory-30': { id: 'factory-30', section: 4, type: 'large', width: 1440, height: 540,
    bg: 'bg-factory', tiles: 'tile-factory', name: 'عرين دبابة الحرب',
    platforms: [{ x: 720, y: 510, w: 1440, h: 30 }],
    enemies: [], npcs: [], puzzles: [],
    exits: { left: 'factory-29' },
    isBossRoom: true
  }

});

console.log('✅ Factory section loaded — 30 rooms');
