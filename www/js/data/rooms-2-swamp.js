// ═══════════════════════════════════════════════════
// EMBER — القسم 2: المستنقع السام (30 غرفة)
// ═══════════════════════════════════════════════════
'use strict';

Object.assign(ROOMS, {

  // ═══ 1-5: مدخل المستنقع ═══
  'swamp-01': { id: 'swamp-01', section: 1, type: 'small', width: 480, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'ضفاف المستنقع',
    platforms: [{ x: 240, y: 240, w: 480, h: 30 }],
    enemies: [], npcs: [], puzzles: [],
    exits: { right: 'swamp-02' } },

  'swamp-02': { id: 'swamp-02', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'المياه الراكدة',
    platforms: [
      { x: 200, y: 240, w: 400, h: 30 },
      { x: 480, y: 200, w: 180, h: 20 },
      { x: 760, y: 240, w: 400, h: 30 }
    ],
    enemies: [{ type: 'monster-3', x: 400, y: 200 }, { type: 'monster-3', x: 750, y: 200 }],
    npcs: [], puzzles: [], exits: { left: 'swamp-01', right: 'swamp-03' } },

  'swamp-03': { id: 'swamp-03', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'جذور الأشجار',
    platforms: [
      { x: 480, y: 240, w: 960, h: 30 },
      { x: 300, y: 180, w: 120, h: 20 },
      { x: 660, y: 180, w: 120, h: 20 }
    ],
    enemies: [{ type: 'monster-3', x: 480, y: 200 }],
    npcs: [], puzzles: [],
    exits: { left: 'swamp-02', right: 'swamp-04' } },

  'swamp-04': { id: 'swamp-04', section: 1, type: 'small', width: 480, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'كوخ الساحر',
    platforms: [{ x: 240, y: 240, w: 480, h: 30 }],
    enemies: [], npcs: [{ key: 'wizard', x: 300, y: 200 }], puzzles: [],
    exits: { left: 'swamp-03', right: 'swamp-05' } },

  'swamp-05': { id: 'swamp-05', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'ممر الأشواك',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [{ type: 'monster-4', x: 500, y: 200 }],
    npcs: [], puzzles: [
      { type: 'spike', x: 300, y: 220, width: 100, height: 20 },
      { type: 'spike', x: 600, y: 220, width: 100, height: 20 }
    ],
    exits: { left: 'swamp-04', right: 'swamp-06' } },

  // ═══ 6-10: وسط المستنقع ═══
  'swamp-06': { id: 'swamp-06', section: 1, type: 'tower', width: 480, height: 810,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'برج المستنقع',
    platforms: [
      { x: 240, y: 780, w: 480, h: 30 },
      { x: 120, y: 650, w: 200, h: 20 },
      { x: 360, y: 520, w: 200, h: 20 },
      { x: 120, y: 390, w: 200, h: 20 },
      { x: 360, y: 260, w: 200, h: 20 },
      { x: 240, y: 130, w: 480, h: 30 }
    ],
    enemies: [{ type: 'monster-3', x: 120, y: 600 }, { type: 'monster-4', x: 360, y: 470 }],
    npcs: [], puzzles: [],
    exits: { up: 'swamp-07', down: 'swamp-05' } },

  'swamp-07': { id: 'swamp-07', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'معبر الحشرات',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [
      { type: 'monster-3', x: 300, y: 200 },
      { type: 'monster-4', x: 600, y: 200 },
      { type: 'monster-3', x: 800, y: 200 }
    ],
    npcs: [], puzzles: [], exits: { left: 'swamp-06', right: 'swamp-08' } },

  'swamp-08': { id: 'swamp-08', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'المنصة المتحركة',
    platforms: [
      { x: 150, y: 240, w: 300, h: 30 },
      { x: 810, y: 240, w: 300, h: 30 }
    ],
    enemies: [], npcs: [], puzzles: [
      { type: 'moving-platform', x: 480, y: 220, width: 120, moveX: 200, duration: 2800 }
    ],
    exits: { left: 'swamp-07', right: 'swamp-09' } },

  'swamp-09': { id: 'swamp-09', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'بحيرة السم',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [{ type: 'monster-4', x: 480, y: 200 }],
    npcs: [], puzzles: [
      { type: 'arena', x: 480, y: 180, width: 600, height: 400,
        enemyCount: 4, enemyType: 'monster-3', sectionIdx: 1 }
    ],
    exits: { left: 'swamp-08', right: 'swamp-10' } },

  'swamp-10': { id: 'swamp-10', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'وادي الضباب',
    platforms: [
      { x: 300, y: 240, w: 600, h: 30 },
      { x: 750, y: 180, w: 150, h: 20 }
    ],
    enemies: [{ type: 'monster-3', x: 500, y: 200 }],
    npcs: [], puzzles: [
      { type: 'spike', x: 700, y: 220, width: 200, height: 20 }
    ],
    exits: { left: 'swamp-09', right: 'swamp-11' } },

  // ═══ 11-15: ألغاز المستنقع ═══
  'swamp-11': { id: 'swamp-11', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'بوابة الرافعة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'lever', x: 200, y: 200, targetDoor: 'swampDoor' },
      { type: 'door', x: 850, y: 200, width: 40, height: 100, id: 'swampDoor' }
    ],
    exits: { left: 'swamp-10', right: 'swamp-12' } },

  'swamp-12': { id: 'swamp-12', section: 1, type: 'small', width: 480, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'الغرفة السرية',
    platforms: [{ x: 240, y: 240, w: 480, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'locked-chest', x: 240, y: 200, keyId: 'key_silver',
        rewards: { shards: 80, atoms: 2 } }
    ],
    exits: { left: 'swamp-11' } },

  'swamp-13': { id: 'swamp-13', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'لغز الذاكرة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'memory', x: 480, y: 180, count: 4, sequenceLength: 5 }
    ],
    exits: { left: 'swamp-12' } },

  'swamp-14': { id: 'swamp-14', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'غرفة الأشعة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'light', source: { x: 100, y: 150 }, target: { x: 850, y: 150 },
        mirrors: [{ x: 400, y: 150, angle: 45 }, { x: 700, y: 150, angle: 45 }] }
    ],
    exits: { left: 'swamp-13' } },

  'swamp-15': { id: 'swamp-15', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'ضريح البلورات',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'crystal-puzzle', x: 480, y: 180,
        crystals: [{x:380,y:180},{x:480,y:100},{x:580,y:180},{x:680,y:100}] }
    ],
    exits: { left: 'swamp-14' } },

  // ═══ 16-20: عمق المستنقع ═══
  'swamp-16': { id: 'swamp-16', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'ممر السلاسل',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [{ type: 'monster-3', x: 300, y: 200 }, { type: 'monster-4', x: 700, y: 200 }],
    npcs: [], puzzles: [], exits: { left: 'swamp-15', right: 'swamp-17' } },

  'swamp-17': { id: 'swamp-17', section: 1, type: 'large', width: 1440, height: 540,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'قاعة التماثيل',
    platforms: [
      { x: 720, y: 510, w: 1440, h: 30 },
      { x: 400, y: 350, w: 150, h: 20 },
      { x: 720, y: 250, w: 150, h: 20 },
      { x: 1040, y: 350, w: 150, h: 20 }
    ],
    enemies: [
      { type: 'monster-4', x: 400, y: 300 },
      { type: 'monster-3', x: 720, y: 200 },
      { type: 'monster-4', x: 1040, y: 300 }
    ],
    npcs: [], puzzles: [
      { type: 'arena', x: 720, y: 300, width: 800, height: 500,
        enemyCount: 6, enemyType: 'monster-3', sectionIdx: 1 }
    ],
    exits: { left: 'swamp-16', right: 'swamp-18' } },

  'swamp-18': { id: 'swamp-18', section: 1, type: 'tower', width: 480, height: 810,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'العمود المرجاني',
    platforms: [
      { x: 240, y: 780, w: 480, h: 30 },
      { x: 120, y: 650, w: 200, h: 20 },
      { x: 360, y: 520, w: 200, h: 20 },
      { x: 120, y: 390, w: 200, h: 20 },
      { x: 240, y: 130, w: 480, h: 30 }
    ],
    enemies: [{ type: 'monster-3', x: 120, y: 600 }, { type: 'monster-3', x: 360, y: 470 }],
    npcs: [], puzzles: [
      { type: 'push-block', x: 240, y: 700, targetX: 240, targetY: 400 }
    ],
    exits: { up: 'swamp-19', down: 'swamp-17' } },

  'swamp-19': { id: 'swamp-19', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'الوادي المسحور',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [
      { type: 'monster-4', x: 300, y: 200 },
      { type: 'monster-3', x: 600, y: 200 },
      { type: 'monster-4', x: 800, y: 200 }
    ],
    npcs: [], puzzles: [], exits: { left: 'swamp-18', right: 'swamp-20' } },

  'swamp-20': { id: 'swamp-20', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'حلقة الطقوس',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'memory', x: 480, y: 180, count: 4, sequenceLength: 6 }
    ],
    exits: { left: 'swamp-19', right: 'swamp-21' } },

  // ═══ 21-25: قبل البوس ═══
  'swamp-21': { id: 'swamp-21', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'ممر النخبة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [{ type: 'monster-4', x: 480, y: 200 }],
    npcs: [], puzzles: [
      { type: 'arena', x: 480, y: 180, width: 600, height: 400,
        enemyCount: 3, enemyType: 'monster-4', sectionIdx: 1 }
    ],
    exits: { left: 'swamp-20', right: 'swamp-22' } },

  'swamp-22': { id: 'swamp-22', section: 1, type: 'small', width: 480, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'غرفة الحفظ',
    platforms: [{ x: 240, y: 240, w: 480, h: 30 }],
    enemies: [], npcs: [], puzzles: [],
    exits: { left: 'swamp-21', right: 'swamp-23' } },

  'swamp-23': { id: 'swamp-23', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'مدخل العرين',
    platforms: [
      { x: 200, y: 240, w: 400, h: 30 },
      { x: 480, y: 180, w: 200, h: 20 },
      { x: 760, y: 240, w: 400, h: 30 }
    ],
    enemies: [{ type: 'monster-4', x: 480, y: 150 }],
    npcs: [], puzzles: [], exits: { left: 'swamp-22', right: 'swamp-24' } },

  'swamp-24': { id: 'swamp-24', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'قبل العرين',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'lever', x: 200, y: 200, targetDoor: 'swampBossDoor', mandatory: true },
      { type: 'door', x: 850, y: 200, width: 40, height: 100, id: 'swampBossDoor' }
    ],
    exits: { left: 'swamp-23', right: 'swamp-25' } },

  'swamp-25': { id: 'swamp-25', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'الغرفة المختومة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'locked-chest', x: 480, y: 200, keyId: 'key_gold',
        rewards: { shards: 150, atoms: 5 } }
    ],
    exits: { left: 'swamp-24' } },

  // ═══ 26-30: النهاية ═══
  'swamp-26': { id: 'swamp-26', section: 1, type: 'tower', width: 480, height: 810,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'برج الأم',
    platforms: [
      { x: 240, y: 780, w: 480, h: 30 },
      { x: 120, y: 650, w: 200, h: 20 },
      { x: 360, y: 520, w: 200, h: 20 },
      { x: 120, y: 390, w: 200, h: 20 },
      { x: 240, y: 130, w: 480, h: 30 }
    ],
    enemies: [{ type: 'monster-3', x: 120, y: 600 }],
    npcs: [], puzzles: [], exits: { up: 'swamp-27', down: 'swamp-25' } },

  'swamp-27': { id: 'swamp-27', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'الممر الأخير',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [
      { type: 'monster-3', x: 300, y: 200 },
      { type: 'monster-3', x: 600, y: 200 }
    ],
    npcs: [], puzzles: [], exits: { left: 'swamp-26', right: 'swamp-28' } },

  'swamp-28': { id: 'swamp-28', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'باب البوس',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [],
    exits: { left: 'swamp-27', right: 'swamp-29' } },

  'swamp-29': { id: 'swamp-29', section: 1, type: 'medium', width: 960, height: 270,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'قبل الأم',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [
      { type: 'door', x: 850, y: 200, width: 40, height: 100, id: 'swampDoor2' },
      { type: 'lever', x: 200, y: 200, targetDoor: 'swampDoor2', mandatory: true }
    ],
    exits: { left: 'swamp-28', right: 'swamp-30' } },

  'swamp-30': { id: 'swamp-30', section: 1, type: 'large', width: 1440, height: 540,
    bg: 'bg-swamp', tiles: 'tile-swamp', name: 'عرين أم أربعة وأربعين',
    platforms: [{ x: 720, y: 510, w: 1440, h: 30 }],
    enemies: [], npcs: [], puzzles: [],
    exits: { left: 'swamp-29' },
    isBossRoom: true
  }

});

console.log('✅ Swamp section loaded — 30 rooms');
