// ═══════════════════════════════════════════════════
// EMBER — بيانات الغرف (150 غرفة)
// ═══════════════════════════════════════════════════
'use strict';

const ROOMS = {

  // ═══════════════════════════════════════════════
  // 🏰 القسم 1: المقبرة (30 غرفة)
  // ═══════════════════════════════════════════════
  'crypt-01': {
    id: 'crypt-01', section: 0, type: 'small', width: 480, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt',
    name: 'بداية المقبرة',
    platforms: [
      { x: 240, y: 240, w: 480, h: 30 }
    ],
    enemies: [],
    npcs: [],
    puzzles: [],
    exits: { right: 'crypt-02', up: 'crypt-10' }
  },

  'crypt-02': {
    id: 'crypt-02', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt',
    name: 'الممر الأول',
    platforms: [
      { x: 200, y: 240, w: 400, h: 30 },
      { x: 500, y: 180, w: 150, h: 20 },
      { x: 750, y: 240, w: 400, h: 30 }
    ],
    enemies: [
      { type: 'monster-1', x: 400, y: 200 },
      { type: 'monster-1', x: 800, y: 200 }
    ],
    npcs: [],
    puzzles: [],
    exits: { left: 'crypt-01', right: 'crypt-03' }
  },

  'crypt-03': {
    id: 'crypt-03', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt',
    name: 'ساحة المعركة',
    platforms: [
      { x: 480, y: 240, w: 960, h: 30 }
    ],
    enemies: [
      { type: 'monster-1', x: 300, y: 200 },
      { type: 'monster-1', x: 600, y: 200 },
      { type: 'monster-2', x: 800, y: 200 }
    ],
    npcs: [],
    puzzles: [],
    exits: { left: 'crypt-02', right: 'crypt-04' }
  },

  'crypt-04': {
    id: 'crypt-04', section: 0, type: 'small', width: 480, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt',
    name: 'ورشة الحداد',
    platforms: [
      { x: 240, y: 240, w: 480, h: 30 }
    ],
    enemies: [],
    npcs: [
      { key: 'blacksmith', x: 300, y: 200 }
    ],
    puzzles: [],
    exits: { left: 'crypt-03', right: 'crypt-05' }
  },

  'crypt-05': {
    id: 'crypt-05', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt',
    name: 'حجرة الأشواك',
    platforms: [
      { x: 200, y: 240, w: 400, h: 30 },
      { x: 480, y: 200, w: 200, h: 20 },
      { x: 760, y: 240, w: 400, h: 30 }
    ],
    enemies: [
      { type: 'monster-2', x: 500, y: 180 }
    ],
    npcs: [],
    puzzles: [
      { type: 'spike', x: 480, y: 220, width: 200, height: 20, damage: 15 }
    ],
    exits: { left: 'crypt-04', right: 'crypt-06' }
  },

  'crypt-06': {
    id: 'crypt-06', section: 0, type: 'tower', width: 480, height: 810,
    bg: 'bg-crypt', tiles: 'tile-crypt',
    name: 'البرج الصاعد',
    platforms: [
      { x: 240, y: 780, w: 480, h: 30 },
      { x: 120, y: 650, w: 200, h: 20 },
      { x: 360, y: 520, w: 200, h: 20 },
      { x: 120, y: 390, w: 200, h: 20 },
      { x: 360, y: 260, w: 200, h: 20 },
      { x: 240, y: 130, w: 480, h: 30 }
    ],
    enemies: [
      { type: 'monster-1', x: 120, y: 600 },
      { type: 'monster-2', x: 360, y: 470 }
    ],
    npcs: [],
    puzzles: [],
    exits: { up: 'crypt-07', down: 'crypt-05' }
  },

  'crypt-07': {
    id: 'crypt-07', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt',
    name: 'قاعة المحاربين',
    platforms: [
      { x: 480, y: 240, w: 960, h: 30 }
    ],
    enemies: [
      { type: 'monster-2', x: 300, y: 200 },
      { type: 'monster-2', x: 600, y: 200 },
      { type: 'monster-1', x: 800, y: 200 }
    ],
    npcs: [],
    puzzles: [],
    exits: { left: 'crypt-06', right: 'crypt-08' }
  },

  'crypt-08': {
    id: 'crypt-08', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt',
    name: 'الجسر المتحرك',
    platforms: [
      { x: 200, y: 240, w: 400, h: 30 },
      { x: 760, y: 240, w: 400, h: 30 }
    ],
    enemies: [],
    npcs: [],
    puzzles: [
      { type: 'moving-platform', x: 480, y: 220, width: 100, moveX: 300, duration: 2500 }
    ],
    exits: { left: 'crypt-07', right: 'crypt-09' }
  },

  'crypt-09': {
    id: 'crypt-09', section: 0, type: 'small', width: 480, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt',
    name: 'الغرفة السرية',
    platforms: [
      { x: 240, y: 240, w: 480, h: 30 }
    ],
    enemies: [],
    npcs: [],
    puzzles: [
      { type: 'locked-chest', x: 240, y: 200, keyId: 'key_gold',
        rewards: { shards: 50, atoms: 3 }, secret: true }
    ],
    exits: { left: 'crypt-08' }
  },

  'crypt-10': {
    id: 'crypt-10', section: 0, type: 'large', width: 1440, height: 540,
    bg: 'bg-crypt', tiles: 'tile-crypt',
    name: 'غرفة البوس',
    platforms: [
      { x: 720, y: 510, w: 1440, h: 30 }
    ],
    enemies: [],
    npcs: [],
    puzzles: [
      { type: 'lever', x: 300, y: 400, targetDoor: 'bossDoor' }
    ],
    exits: { left: 'crypt-11' },
    isBossRoom: true
  },

  'crypt-11': {
    id: 'crypt-11', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt',
    name: 'قبل البوس',
    platforms: [
      { x: 480, y: 240, w: 960, h: 30 }
    ],
    enemies: [],
    npcs: [],
    puzzles: [
      { type: 'door', x: 850, y: 200, width: 40, height: 100, id: 'bossDoor' },
      { type: 'lever', x: 200, y: 200, targetDoor: 'bossDoor', mandatory: true }
    ],
    exits: { left: 'crypt-12', right: 'crypt-10' }
  },

  'crypt-12': {
    id: 'crypt-12', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt',
    name: 'الممر الأخير',
    platforms: [
      { x: 200, y: 240, w: 400, h: 30 },
      { x: 500, y: 200, w: 200, h: 20 },
      { x: 760, y: 240, w: 400, h: 30 }
    ],
    enemies: [
      { type: 'monster-2', x: 400, y: 200 },
      { type: 'monster-2', x: 700, y: 200 }
    ],
    npcs: [],
    puzzles: [],
    exits: { left: 'crypt-13', right: 'crypt-11' }
  },

  'crypt-13': {
    id: 'crypt-13', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt',
    name: 'ساحة القتال',
    platforms: [
      { x: 480, y: 240, w: 960, h: 30 }
    ],
    enemies: [],
    npcs: [],
    puzzles: [
      { type: 'arena', x: 480, y: 180, width: 600, height: 400,
        enemyCount: 5, enemyType: 'monster-1', sectionIdx: 0 }
    ],
    exits: { left: 'crypt-14', right: 'crypt-12' }
  },

  'crypt-14': {
    id: 'crypt-14', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt',
    name: 'مخبأ الذاكرة',
    platforms: [
      { x: 480, y: 240, w: 960, h: 30 }
    ],
    enemies: [],
    npcs: [],
    puzzles: [
      { type: 'memory', x: 480, y: 180, count: 4, sequenceLength: 4, secret: true }
    ],
    exits: { left: 'crypt-15' }
  },

  'crypt-15': {
    id: 'crypt-15', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt',
    name: 'بوابة الأشعة',
    platforms: [
      { x: 480, y: 240, w: 960, h: 30 }
    ],
    enemies: [],
    npcs: [],
    puzzles: [
      { type: 'light', source: { x: 100, y: 150 }, target: { x: 850, y: 150 },
        mirrors: [{ x: 500, y: 150, angle: 45 }], secret: true }
    ],
    exits: { left: 'crypt-16' }
  },

  'crypt-16': {
    id: 'crypt-16', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt',
    name: 'المخبأ العلوي',
    platforms: [
      { x: 480, y: 240, w: 960, h: 30 }
    ],
    enemies: [],
    npcs: [],
    puzzles: [
      { type: 'crystal-puzzle', x: 480, y: 180,
        crystals: [{x:380,y:180},{x:480,y:120},{x:580,y:180}], secret: true }
    ],
    exits: { left: 'crypt-17' }
  },

  'crypt-17': {
    id: 'crypt-17', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt',
    name: 'ممر الصناديق',
    platforms: [
      { x: 480, y: 240, w: 960, h: 30 }
    ],
    enemies: [],
    npcs: [],
    puzzles: [
      { type: 'push-block', x: 400, y: 200, targetX: 700, targetY: 200, secret: true }
    ],
    exits: { left: 'crypt-18' }
  },

  'crypt-18': {
    id: 'crypt-18', section: 0, type: 'small', width: 480, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt',
    name: 'الغرفة المختومة',
    platforms: [{ x: 240, y: 240, w: 480, h: 30 }],
    enemies: [],
    npcs: [],
    puzzles: [{ type: 'locked-chest', x: 240, y: 200, keyId: 'key_gold',
      rewards: { shards: 100, atoms: 5 } }],
    exits: { left: 'crypt-17' }
  },

  'crypt-19': { id: 'crypt-19', section: 0, type: 'small', width: 480, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt', name: 'ممر جانبي',
    platforms: [{ x: 240, y: 240, w: 480, h: 30 }],
    enemies: [], npcs: [], puzzles: [], exits: { right: 'crypt-20' } },

  'crypt-20': { id: 'crypt-20', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt', name: 'قاعة الاستقبال',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [{ type: 'monster-2', x: 500, y: 200 }], npcs: [], puzzles: [],
    exits: { left: 'crypt-19', right: 'crypt-21' } },

  'crypt-21': { id: 'crypt-21', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt', name: 'المصلى',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [],
    puzzles: [{ type: 'memory', x: 480, y: 180, count: 4, sequenceLength: 5 }],
    exits: { left: 'crypt-20', right: 'crypt-22' } },

  'crypt-22': { id: 'crypt-22', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt', name: 'طريق الأشواك',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [],
    puzzles: [
      { type: 'spike', x: 300, y: 220, width: 100, height: 20 },
      { type: 'spike', x: 500, y: 220, width: 100, height: 20 },
      { type: 'spike', x: 700, y: 220, width: 100, height: 20 }
    ],
    exits: { left: 'crypt-21', right: 'crypt-23' } },

  'crypt-23': { id: 'crypt-23', section: 0, type: 'small', width: 480, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt', name: 'غرفة الحفظ',
    platforms: [{ x: 240, y: 240, w: 480, h: 30 }],
    enemies: [], npcs: [], puzzles: [], exits: { left: 'crypt-22', right: 'crypt-24' } },

  'crypt-24': { id: 'crypt-24', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt', name: 'الممر الملعون',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [{ type: 'monster-1', x: 400, y: 200 }, { type: 'monster-2', x: 700, y: 200 }],
    npcs: [], puzzles: [], exits: { left: 'crypt-23', right: 'crypt-25' } },

  'crypt-25': { id: 'crypt-25', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt', name: 'الغرفة السرية 2',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [],
    puzzles: [{ type: 'portal', x: 100, y: 200, targetX: 850, targetY: 200, secret: true }],
    exits: { left: 'crypt-24' } },

  'crypt-26': { id: 'crypt-26', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt', name: 'طريق العودة',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [], puzzles: [], exits: { left: 'crypt-25', right: 'crypt-27' } },

  'crypt-27': { id: 'crypt-27', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt', name: 'المذبح',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [], npcs: [],
    puzzles: [{ type: 'crystal-puzzle', x: 480, y: 180,
      crystals: [{x:400,y:180},{x:480,y:100},{x:560,y:180},{x:640,y:100}] }],
    exits: { left: 'crypt-26' } },

  'crypt-28': { id: 'crypt-28', section: 0, type: 'medium', width: 960, height: 270,
    bg: 'bg-crypt', tiles: 'tile-crypt', name: 'القاعة الكبرى',
    platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
    enemies: [{ type: 'monster-1', x: 300, y: 200 }, { type: 'monster-1', x: 600, y: 200 },
      { type: 'monster-2', x: 800, y: 200 }],
    npcs: [], puzzles: [], exits: { left: 'crypt-27', right: 'crypt-29' } },

  'crypt-29': { id: 'crypt-29', section: 0, type: 'tower', width: 480, height: 810,
    bg: 'bg-crypt', tiles: 'tile-crypt', name: 'برج الحراسة',
    platforms: [
      { x: 240, y: 780, w: 480, h: 30 },
      { x: 120, y: 650, w: 200, h: 20 },
      { x: 360, y: 520, w: 200, h: 20 },
      { x: 120, y: 390, w: 200, h: 20 },
      { x: 240, y: 130, w: 480, h: 30 }
    ],
    enemies: [{ type: 'monster-2', x: 120, y: 600 }, { type: 'monster-2', x: 360, y: 470 }],
    npcs: [], puzzles: [], exits: { up: 'crypt-30', down: 'crypt-28' } },

  'crypt-30': { id: 'crypt-30', section: 0, type: 'large', width: 1440, height: 540,
    bg: 'bg-crypt', tiles: 'tile-crypt', name: 'بوابة المقبرة',
    platforms: [{ x: 720, y: 510, w: 1440, h: 30 }],
    enemies: [], npcs: [],
    puzzles: [{ type: 'arena', x: 720, y: 300, width: 800, height: 500,
      enemyCount: 8, enemyType: 'monster-2', sectionIdx: 0 }],
    exits: { left: 'crypt-29' },
    isTransition: true
  }

};

// ═══════════════════════════════════════════════════
// دوال مساعدة
// ═══════════════════════════════════════════════════
const Rooms = {

  get(id){ return ROOMS[id] || null; },

  getAll(){ return Object.keys(ROOMS).map(k => ROOMS[k]); },

  getBySection(sectionIdx){
    return this.getAll().filter(r => r.section === sectionIdx);
  },

  getFirstRoom(sectionIdx){
    const rooms = this.getBySection(sectionIdx);
    return rooms.length > 0 ? rooms[0] : null;
  },

  getBossRoom(sectionIdx){
    return this.getAll().find(r => r.section === sectionIdx && r.isBossRoom);
  },

  getExit(roomId, direction){
    const room = ROOMS[roomId];
    if(!room || !room.exits) return null;
    const nextId = room.exits[direction];
    return nextId ? ROOMS[nextId] : null;
  },

  count(){ return Object.keys(ROOMS).length; },

  countBySection(sectionIdx){
    return this.getBySection(sectionIdx).length;
  },

  // ═══ إنشاء غرفة عشوائية ═══
  generateSection(sectionIdx, count){
    const rooms = [];
    for(let i = 1; i <= count; i++){
      const id = 'sec' + sectionIdx + '-' + String(i).padStart(2, '0');
      rooms.push({
        id: id,
        section: sectionIdx,
        type: i % 5 === 0 ? 'large' : (i % 3 === 0 ? 'tower' : 'medium'),
        width: i % 5 === 0 ? 1440 : 960,
        height: i % 3 === 0 ? 540 : 270,
        platforms: [{ x: 480, y: 240, w: 960, h: 30 }],
        enemies: [],
        npcs: [],
        puzzles: [],
        exits: {}
      });
    }
    return rooms;
  }
};

console.log('✅ ROOMS loaded — ' + Rooms.count() + ' rooms total');
