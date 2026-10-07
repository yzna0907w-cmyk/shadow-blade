// ═══════════════════════════════════════════════════
// EMBER — "صدى"
// ملف الإعدادات الرئيسي
// ═══════════════════════════════════════════════════
'use strict';

const CFG = {

  // ═══════════════════════════════════════════════
  // 1. إعدادات الشاشة والعرض
  // ═══════════════════════════════════════════════
  GW: 480,           // عرض الشاشة (منطقي)
  GH: 270,           // ارتفاع الشاشة (منطقي)
  SCALE_MODE: 'FIT',
  BG_COLOR: '#050208',

  // ═══════════════════════════════════════════════
  // 2. الفيزياء الأساسية
  // ═══════════════════════════════════════════════
  GRAVITY: 900,
  MAX_FALL_SPEED: 600,

  // ═══════════════════════════════════════════════
  // 3. البطل — الحركة
  // ═══════════════════════════════════════════════
  PLAYER: {
    WALK_SPEED: 130,
    RUN_SPEED: 180,
    JUMP_VELOCITY: -400,
    DOUBLE_JUMP_VELOCITY: -380,
    DASH_SPEED: 400,
    DASH_DURATION: 200,
    DASH_COOLDOWN: 600,
    COYOTE_TIME: 120,
    JUMP_BUFFER: 120,
    MAX_HP: 100,
    INVULN_TIME: 1200,
    SCALE: 1.5,
    BODY_SIZE: { w: 16, h: 30 },
    BODY_OFFSET: { x: 24, y: 24 }
  },

  // ═══════════════════════════════════════════════
  // 4. الأسلحة (3 أنواع)
  // ═══════════════════════════════════════════════
  WEAPONS: {
    sword: {
      nameAr: 'السيف',
      icon: '🗡️',
      damage: 25,
      range: 50,
      cooldown: 300,
      animFps: 14,
      desc: 'سريع، متوازن'
    },
    axe: {
      nameAr: 'الفأس',
      icon: '🪓',
      damage: 50,
      range: 40,
      cooldown: 600,
      animFps: 10,
      desc: 'قوي، بطيء'
    },
    spear: {
      nameAr: 'الرمح',
      icon: '⚔️',
      damage: 35,
      range: 80,
      cooldown: 500,
      animFps: 12,
      desc: 'بعيد، ثقب'
    }
  },
  WEAPON_ORDER: ['sword', 'axe', 'spear'],
  DEFAULT_WEAPON: 'sword',

  // ═══════════════════════════════════════════════
  // 5. القدرات (تفتح بالتدريج)
  // ═══════════════════════════════════════════════
  ABILITIES: {
    doubleJump: {
      nameAr: 'القفز المزدوج',
      icon: '⬆️⬆️',
      desc: 'اقفز مرة ثانية في الهواء',
      price: 15,
      currency: 'atoms'
    },
    dash: {
      nameAr: 'الانطلاق',
      icon: '💨',
      desc: 'اندفع بسرعة في اتجاه النظر',
      price: 20,
      currency: 'atoms'
    },
    wallJump: {
      nameAr: 'التسلق',
      icon: '🧗',
      desc: 'اقفز من الجدران',
      price: 25,
      currency: 'atoms'
    },
    chargedAttack: {
      nameAr: 'الهجوم المشحون',
      icon: '⚡',
      desc: 'هجوم قوي بعد شحن',
      price: 30,
      currency: 'atoms'
    },
    glide: {
      nameAr: 'الطيران',
      icon: '🦅',
      desc: 'انزلق في الهواء',
      price: 40,
      currency: 'atoms'
    }
  },

  // ═══════════════════════════════════════════════
  // 6. العملات
  // ═══════════════════════════════════════════════
  CURRENCIES: {
    shards: { nameAr: 'شظايا', icon: '🪙', color: '#fbbf24' },
    atoms: { nameAr: 'ذرات', icon: '💎', color: '#a855f7' },
    souls: { nameAr: 'أرواح', icon: '👻', color: '#22d3ee' }
  },

  // ═══════════════════════════════════════════════
  // 7. الأعداء (الأساسيات)
  // ═══════════════════════════════════════════════
  ENEMY_BASE: {
    ACTIVATION_RANGE: 600,   // مدى تفعيل العدو
    DEACTIVATION_RANGE: 1000, // مدى إيقاف العدو
    DROP_RATE_ATOMS: 0.05     // 5% فرصة ذرة
  },

  // ═══════════════════════════════════════════════
  // 8. XP والمستويات
  // ═══════════════════════════════════════════════
  XP: {
    BASE_REQUIREMENT: 100,
    GROWTH_PER_LEVEL: 1.25,
    HP_PER_LEVEL: 20,
    DAMAGE_PER_LEVEL: 2
  },

  // ═══════════════════════════════════════════════
  // 9. الحفظ
  // ═══════════════════════════════════════════════
  SAVE_KEY: 'ember_save_v3',
  SAVE_VERSION: 3,
  AUTO_SAVE_INTERVAL: 30000, // كل 30 ثانية

  // ═══════════════════════════════════════════════
  // 10. الأصوات
  // ═══════════════════════════════════════════════
  AUDIO: {
    MASTER_VOLUME: 0.5,
    SFX_VOLUME: 0.6,
    MUSIC_VOLUME: 0.25,
    MUTE: false
  },

  // ═══════════════════════════════════════════════
  // 11. التصحيح (للتطوير فقط)
  // ═══════════════════════════════════════════════
  DEBUG: {
    ENABLED: false,
    SHOW_HITBOXES: false,
    SHOW_FPS: false,
    GOD_MODE: false,
    SHOW_DEBUG_PANEL: false
  }
};

// ═══════════════════════════════════════════════════
// الأقسام الخمسة (العالم الواحد)
// ═══════════════════════════════════════════════════
const WORLD_SECTIONS = [
  {
    id: "crypt", nameAr: "المقبرة", index: 0,
    bgTint: 0x6a5a8a, tintTiles: 0x8a7aaa,
    bossKey: "robot", bossNameAr: "حارس الأرواح",
    enemyTypes: ["monster-1", "monster-2"],
    eliteTypes: [],
    enemyCount: 6,
    npc: "blacksmith",
    abilityReward: null
  },
  {
    id: "swamp", nameAr: "المستنقع السام", index: 1,
    bgTint: 0x4a7a4a, tintTiles: 0x6aaa6a,
    bossKey: "centipede", bossNameAr: "أم أربعة وأربعين",
    enemyTypes: ["monster-3", "monster-4"],
    eliteTypes: [],
    enemyCount: 8,
    npc: "wizard",
    abilityReward: "doubleJump"
  },
  {
    id: "caves", nameAr: "كهوف الكريستال", index: 2,
    bgTint: 0x4a5a9a, tintTiles: 0x6a8acc,
    bossKey: "turtle", bossNameAr: "السلحفاة القتالية",
    enemyTypes: ["monster-5", "monster-6"],
    eliteTypes: ["werewolf-white"],
    enemyCount: 10,
    npc: "herbalist",
    abilityReward: "dash"
  },
  {
    id: "forest", nameAr: "الغابة الميتة", index: 3,
    bgTint: 0x3a6a3a, tintTiles: 0x5a9a5a,
    bossKey: "boar", bossNameAr: "الخنزير البري",
    enemyTypes: ["monster-7", "monster-8"],
    eliteTypes: ["werewolf-black"],
    enemyCount: 12,
    npc: "relic_trader",
    abilityReward: "wallJump"
  },
  {
    id: "factory", nameAr: "المصنع المحروق", index: 4,
    bgTint: 0x8a4a2a, tintTiles: 0xc06a3a,
    bossKey: "tank", bossNameAr: "دبابة الحرب",
    enemyTypes: ["monster-9", "monster-10"],
    eliteTypes: ["werewolf-red"],
    enemyCount: 14,
    npc: "secret_seller",
    abilityReward: "chargedAttack"
  }
];;

// ═══════════════════════════════════════════════════
// الإطارات الزمنية
// ═══════════════════════════════════════════════════
const ANIM_FPS = {
  idle: 6,
  walk: 12,
  run: 16,
  jump: 10,
  fall: 10,
  attack: 14,
  hurt: 12,
  die: 8
};

// ═══════════════════════════════════════════════════
// مستويات التطوير
// ═══════════════════════════════════════════════════
const UPGRADE_TIERS = [
  { tier: 0, nameAr: 'عادي', damageMul: 1.0, price: 0 },
  { tier: 1, nameAr: 'محسّن', damageMul: 1.25, price: 10 },
  { tier: 2, nameAr: 'قوي', damageMul: 1.5, price: 25 },
  { tier: 3, nameAr: 'أسطوري', damageMul: 2.0, price: 50 }
];

console.log('✅ CFG loaded — ' + Object.keys(CFG).length + ' sections');
