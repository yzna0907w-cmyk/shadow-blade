// ═══════════════════════════════════════════════════
// EMBER — "صدى"
// بيانات الأسلحة الكاملة
// ═══════════════════════════════════════════════════
'use strict';

const WEAPON_DATA = {

  // ═══════════════════════════════════════════════
  // 1. السيف (Sword)
  // ═══════════════════════════════════════════════
  sword: {
    id: 'sword',
    nameAr: 'السيف',
    nameEn: 'Sword',
    icon: '🗡️',
    description: 'سريع ومتوازن. مناسب لمعظم المعارك.',

    // ═══ الإحصائيات الأساسية ═══
    baseDamage: 25,
    range: 50,
    width: 60,
    cooldown: 300,
    animFps: 14,

    // ═══ الخصائص ═══
    canBreakArmor: false,
    canHitMultiple: true,
    hitCount: 3,

    // ═══ التطويرات ═══
    tiers: [
      { tier: 0, nameAr: 'عادي', damageMul: 1.0, price: 0, color: '#aaaaaa' },
      { tier: 1, nameAr: 'محسّن', damageMul: 1.25, price: 10, color: '#88ccff' },
      { tier: 2, nameAr: 'قوي', damageMul: 1.5, price: 25, color: '#a855f7' },
      { tier: 3, nameAr: 'أسطوري', damageMul: 2.0, price: 50, color: '#ffd700' }
    ],

    // ═══ المسارات ═══
    assets: {
      basePath: 'assets/player/sword/',
      idleFrames: 4,
      runFrames: 6,
      jumpFrames: 4,
      attackFrames: 5,
      dieFrames: 4
    },

    // ═══ القصة ═══
    lore: 'سيف عادي، لكنه يحمل ذكرى صاحبه القديم.'
  },

  // ═══════════════════════════════════════════════
  // 2. الفأس (Axe)
  // ═══════════════════════════════════════════════
  axe: {
    id: 'axe',
    nameAr: 'الفأس',
    nameEn: 'Axe',
    icon: '🪓',
    description: 'قوي وبطيء. يكسر الدروع ويحدث ضرراً هائلاً.',

    // ═══ الإحصائيات الأساسية ═══
    baseDamage: 50,
    range: 40,
    width: 70,
    cooldown: 600,
    animFps: 10,

    // ═══ الخصائص ═══
    canBreakArmor: true,
    canHitMultiple: true,
    hitCount: 5,

    // ═══ التطويرات ═══
    tiers: [
      { tier: 0, nameAr: 'عادي', damageMul: 1.0, price: 0, color: '#aaaaaa' },
      { tier: 1, nameAr: 'محسّن', damageMul: 1.25, price: 15, color: '#88ccff' },
      { tier: 2, nameAr: 'قوي', damageMul: 1.5, price: 35, color: '#a855f7' },
      { tier: 3, nameAr: 'أسطوري', damageMul: 2.0, price: 70, color: '#ffd700' }
    ],

    assets: {
      basePath: 'assets/player/axe/',
      idleFrames: 4,
      runFrames: 6,
      jumpFrames: 4,
      attackFrames: 5,
      dieFrames: 4
    },

    lore: 'فأس ثقيل، استُخدم في معارك قديمة. لا يزال يقطر بالدم.'
  },

  // ═══════════════════════════════════════════════
  // 3. الرمح (Spear)
  // ═══════════════════════════════════════════════
  spear: {
    id: 'spear',
    nameAr: 'الرمح',
    nameEn: 'Spear',
    icon: '⚔️',
    description: 'مدى طويل. مثالي للأعداء البعيدين.',

    // ═══ الإحصائيات الأساسية ═══
    baseDamage: 35,
    range: 80,
    width: 30,
    cooldown: 500,
    animFps: 12,

    // ═══ الخصائص ═══
    canBreakArmor: false,
    canHitMultiple: false,
    hitCount: 1,
    isPiercing: true,

    // ═══ التطويرات ═══
    tiers: [
      { tier: 0, nameAr: 'عادي', damageMul: 1.0, price: 0, color: '#aaaaaa' },
      { tier: 1, nameAr: 'محسّن', damageMul: 1.25, price: 12, color: '#88ccff' },
      { tier: 2, nameAr: 'قوي', damageMul: 1.5, price: 30, color: '#a855f7' },
      { tier: 3, nameAr: 'أسطوري', damageMul: 2.0, price: 60, color: '#ffd700' }
    ],

    assets: {
      basePath: 'assets/player/spear/',
      idleFrames: 4,
      runFrames: 6,
      jumpFrames: 4,
      attackFrames: 5,
      dieFrames: 4
    },

    lore: 'رمح طويل، صُنع لقتل الوحوش من مسافة آمنة.'
  }
};

// ═══════════════════════════════════════════════════
// دوال مساعدة
// ═══════════════════════════════════════════════════

const Weapons = {

  // الحصول على بيانات سلاح
  get(key){
    return WEAPON_DATA[key] || null;
  },

  // كل الأسلحة
  getAll(){
    return Object.keys(WEAPON_DATA).map(k => WEAPON_DATA[k]);
  },

  // الضرر الحالي حسب التطوير
  getDamage(key, tier){
    const weapon = WEAPON_DATA[key];
    if(!weapon) return 0;
    const tierData = weapon.tiers[tier] || weapon.tiers[0];
    return Math.floor(weapon.baseDamage * tierData.damageMul);
  },

  // لون التطوير
  getTierColor(key, tier){
    const weapon = WEAPON_DATA[key];
    if(!weapon) return '#ffffff';
    const tierData = weapon.tiers[tier] || weapon.tiers[0];
    return tierData.color;
  },

  // اسم التطوير
  getTierName(key, tier){
    const weapon = WEAPON_DATA[key];
    if(!weapon) return '';
    const tierData = weapon.tiers[tier] || weapon.tiers[0];
    return tierData.nameAr;
  },

  // السعر التالي
  getNextTierPrice(key, currentTier){
    const weapon = WEAPON_DATA[key];
    if(!weapon) return 0;
    const nextTier = currentTier + 1;
    if(nextTier >= weapon.tiers.length) return -1;
    return weapon.tiers[nextTier].price;
  },

  // هل يمكن تطويره؟
  canUpgrade(key, currentTier){
    return this.getNextTierPrice(key, currentTier) !== -1;
  },

  // الحصول على السلاح الحالي من State
  getCurrent(){
    const key = State.weapon.getCurrent();
    const tier = State.weapon.getTier(key);
    const weapon = WEAPON_DATA[key];
    if(!weapon) return null;

    return {
      ...weapon,
      tier: tier,
      damage: this.getDamage(key, tier),
      tierColor: this.getTierColor(key, tier),
      tierName: this.getTierName(key, tier)
    };
  },

  // ترتيب الأسلحة
  order: ['sword', 'axe', 'spear'],

  // السلاح التالي
  next(currentKey){
    const idx = this.order.indexOf(currentKey);
    if(idx === -1) return this.order[0];
    return this.order[(idx + 1) % this.order.length];
  },

  // السابق
  prev(currentKey){
    const idx = this.order.indexOf(currentKey);
    if(idx === -1) return this.order[0];
    return this.order[(idx - 1 + this.order.length) % this.order.length];
  }
};

console.log('✅ WEAPON_DATA loaded — ' + Object.keys(WEAPON_DATA).length + ' weapons');
