// ═══════════════════════════════════════════════════
// EMBER — "صدى"
// بيانات الأعداء (10 وحوش + 3 ذئاب نخبة)
// ═══════════════════════════════════════════════════
'use strict';

const ENEMY_DATA = {

  // ═══ مقبرة (Section 0) ═══
  'monster-1': {
    id: 'monster-1', nameAr: 'شبح الرماد', category: 'ground',
    behavior: 'patrol',
    hp: 30, damage: 8, speed: 30,
    xp: 5, shards: 1, atomsChance: 0.03,
    scale: 0.5, depth: 20,
    assetBase: 'assets/enemies/monster-1/',
    animations: ['idle', 'walk', 'run', 'attack', 'hurt', 'die'],
    lore: 'أول وحش صادفه صدى. كان بشراً يوماً.'
  },

  'monster-2': {
    id: 'monster-2', nameAr: 'زاحف الظلال', category: 'ground',
    behavior: 'patrol_aggressive',
    hp: 45, damage: 10, speed: 40,
    xp: 8, shards: 2, atomsChance: 0.04,
    scale: 0.5, depth: 20,
    assetBase: 'assets/enemies/monster-2/',
    animations: ['idle', 'walk', 'run', 'attack', 'hurt', 'die'],
    lore: 'زحف من المقابر، يبحث عن دفء الأحياء.'
  },

  // ═══ مستنقع (Section 1) ═══
  'monster-3': {
    id: 'monster-3', nameAr: 'محارب الطين', category: 'ground',
    behavior: 'patrol',
    hp: 60, damage: 12, speed: 35,
    xp: 12, shards: 3, atomsChance: 0.05,
    scale: 0.55, depth: 20,
    assetBase: 'assets/enemies/monster-3/',
    animations: ['idle', 'walk', 'run', 'attack', 'hurt', 'die'],
    lore: 'تشكّل من الطين السام. يحمل رمحاً صدئاً.'
  },

  'monster-4': {
    id: 'monster-4', nameAr: 'ساحر المستنقع', category: 'ground',
    behavior: 'ranged',
    hp: 50, damage: 15, speed: 25,
    xp: 15, shards: 4, atomsChance: 0.06,
    scale: 0.5, depth: 22,
    assetBase: 'assets/enemies/monster-4/',
    animations: ['idle', 'walk', 'run', 'attack', 'hurt', 'die'],
    lore: 'كان طبيباً. الظلمة جعلته يسمم بدل أن يشفي.'
  },

  // ═══ كهوف (Section 2) ═══
  'monster-5': {
    id: 'monster-5', nameAr: 'حارس الكريستال', category: 'ground',
    behavior: 'patrol',
    hp: 80, damage: 15, speed: 40,
    xp: 18, shards: 5, atomsChance: 0.07,
    scale: 0.55, depth: 20,
    assetBase: 'assets/enemies/monster-5/',
    animations: ['idle', 'walk', 'run', 'attack', 'hurt', 'die'],
    lore: 'كان يحرس الكهوف. الآن يحرس الموتى.'
  },

  'monster-6': {
    id: 'monster-6', nameAr: 'قناص الكهوف', category: 'ground',
    behavior: 'ranged',
    hp: 70, damage: 18, speed: 30,
    xp: 22, shards: 6, atomsChance: 0.08,
    scale: 0.5, depth: 22,
    assetBase: 'assets/enemies/monster-6/',
    animations: ['idle', 'walk', 'run', 'attack', 'hurt', 'die'],
    lore: 'كان صياداً. الآن يصطاد الأحياء.'
  },

  // ═══ غابة (Section 3) ═══
  'monster-7': {
    id: 'monster-7', nameAr: 'وحش الغابة', category: 'ground',
    behavior: 'charge',
    hp: 100, damage: 20, speed: 60,
    xp: 28, shards: 8, atomsChance: 0.10,
    scale: 0.6, depth: 20,
    assetBase: 'assets/enemies/monster-7/',
    animations: ['idle', 'walk', 'run', 'attack', 'hurt', 'die'],
    lore: 'كان أليفاً. الظلمة جعلته شرساً.'
  },

  'monster-8': {
    id: 'monster-8', nameAr: 'قاتل الظل', category: 'ground',
    behavior: 'charge_aggressive',
    hp: 90, damage: 22, speed: 70,
    xp: 32, shards: 9, atomsChance: 0.11,
    scale: 0.55, depth: 20,
    assetBase: 'assets/enemies/monster-8/',
    animations: ['idle', 'walk', 'run', 'attack', 'hurt', 'die'],
    lore: 'كان مبارزاً. الآن يقتل بلا سبب.'
  },

  // ═══ مصنع (Section 4) ═══
  'monster-9': {
    id: 'monster-9', nameAr: 'آلي فاسد', category: 'ground',
    behavior: 'ranged',
    hp: 120, damage: 25, speed: 45,
    xp: 40, shards: 12, atomsChance: 0.13,
    scale: 0.6, depth: 20,
    assetBase: 'assets/enemies/monster-9/',
    animations: ['idle', 'walk', 'run', 'attack', 'hurt', 'die'],
    lore: 'آلة صنعها البشر. الظلمة استخدمتها ضدهم.'
  },

  'monster-10': {
    id: 'monster-10', nameAr: 'طاغية', category: 'ground',
    behavior: 'charge_aggressive',
    hp: 150, damage: 28, speed: 80,
    xp: 50, shards: 15, atomsChance: 0.15,
    scale: 0.65, depth: 20,
    assetBase: 'assets/enemies/monster-10/',
    animations: ['idle', 'walk', 'run', 'attack', 'hurt', 'die'],
    lore: 'آخر من صنعه صدى. أكبر خطاياه.'
  },

  // ═══ ذئاب نخبة (Elite) ═══
  'werewolf-black': {
    id: 'werewolf-black', nameAr: 'ذئب الظلام', category: 'elite',
    behavior: 'charge_aggressive',
    hp: 200, damage: 30, speed: 90,
    xp: 80, shards: 20, atomsChance: 0.25, soulsChance: 0.02,
    scale: 0.4, depth: 21,
    assetBase: 'assets/bosses/werewolf-black/',
    sheetMode: true,
    frames: { Idle: 8, Walk: 10, Run: 8, Attack_1: 6, Hurt: 3, Dead: 6 },
    lore: 'كان قائداً للقطيع. الآن وحش وحيد.'
  },

  'werewolf-white': {
    id: 'werewolf-white', nameAr: 'ذئب الصقيع', category: 'elite',
    behavior: 'charge_aggressive',
    hp: 250, damage: 32, speed: 85,
    xp: 100, shards: 25, atomsChance: 0.30, soulsChance: 0.03,
    scale: 0.4, depth: 21,
    assetBase: 'assets/bosses/werewolf-white/',
    sheetMode: true,
    frames: { Idle: 8, Walk: 10, Run: 8, Attack_1: 6, Hurt: 3, Dead: 6 },
    lore: 'تجمد قلبه قبل أن يتجمد جسده.'
  },

  'werewolf-red': {
    id: 'werewolf-red', nameAr: 'ذئب الجحيم', category: 'elite',
    behavior: 'charge_aggressive',
    hp: 300, damage: 35, speed: 95,
    xp: 120, shards: 30, atomsChance: 0.35, soulsChance: 0.04,
    scale: 0.4, depth: 21,
    assetBase: 'assets/bosses/werewolf-red/',
    sheetMode: true,
    frames: { Idle: 8, Walk: 10, Run: 8, Attack_1: 6, Hurt: 3, Dead: 6 },
    lore: 'النار لم تحرقه. غضبه أحرقها.'
  }
};

// ═══════════════════════════════════════════════════
// السلوكيات
// ═══════════════════════════════════════════════════
const ENEMY_BEHAVIORS = {
  patrol: { nameAr: 'دورية' },
  patrol_aggressive: { nameAr: 'دورية عدوانية' },
  charge: { nameAr: 'هجوم مباشر' },
  charge_aggressive: { nameAr: 'هجوم عنيف' },
  ranged: { nameAr: 'هجوم بعيد' },
  hover: { nameAr: 'تحليق' }
};

// ═══════════════════════════════════════════════════
// دوال مساعدة
// ═══════════════════════════════════════════════════
const Enemies_Data = {

  get(key){ return ENEMY_DATA[key] || null; },
  getAll(){ return Object.keys(ENEMY_DATA).map(k => ENEMY_DATA[k]); },
  getByCategory(cat){ return this.getAll().filter(e => e.category === cat); },

  getForSection(sectionIdx){
    const ws = WORLD_SECTIONS[sectionIdx];
    if(!ws) return [];
    return ws.enemyTypes.map(k => ENEMY_DATA[k]).filter(Boolean);
  },

  getScaledStats(key, sectionIdx){
    const e = ENEMY_DATA[key];
    if(!e) return null;
    const mult = 1 + (sectionIdx * 0.15);
    return {
      hp: Math.floor(e.hp * mult),
      damage: Math.floor(e.damage * mult),
      xp: Math.floor(e.xp * mult),
      shards: Math.floor(e.shards * mult),
      speed: e.speed,
      scale: e.scale
    };
  },

  getRewards(key){
    const e = ENEMY_DATA[key];
    if(!e) return { xp: 0, shards: 0, atoms: 0, souls: 0 };
    return {
      xp: e.xp,
      shards: e.shards,
      atoms: Math.random() < e.atomsChance ? 1 : 0,
      souls: Math.random() < (e.soulsChance || 0) ? 1 : 0
    };
  },

  count(){ return Object.keys(ENEMY_DATA).length; },
  isFlying(key){ const e = ENEMY_DATA[key]; return e && e.category === 'flying'; },
  isElite(key){ const e = ENEMY_DATA[key]; return e && e.category === 'elite'; }
};

console.log('✅ ENEMY_DATA loaded — ' + Enemies_Data.count() + ' enemies');
