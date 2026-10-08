// ═══════════════════════════════════════════════════
// EMBER — "صدى"
// بيانات البوسات الخمسة
// ═══════════════════════════════════════════════════
'use strict';

const BOSS_DATA = {

  // ═══════════════════════════════════════════════
  // 1. Robot (روبوت) — المقبرة
  // ═══════════════════════════════════════════════
  robot: {
    id: 'robot',
    nameAr: 'حارس الأرواح',
    nameEn: 'Soul Guardian',
    sectionIdx: 0,

    // ═══ الإحصائيات ═══
    hp: 400,
    damage: 15,
    speed: 50,
    scale: 1.3,

    // ═══ المكافآت ═══
    xp: 100,
    shards: 25,
    atoms: 3,
    souls: 1,
    abilityReward: null,

    // ═══ السلوك ═══
    behaviors: ['walk', 'melee', 'ranged'],
    phases: 1,
    attackCooldown: 1500,

    // ═══ الأصول ═══
    assets: {
      idle: 'boss-robot',
      attack: 'robot-attack',
      hurt: 'robot-hurt',
      death: 'robot-death',
      run: 'robot-run'
    },

    // ═══ القصة ═══
    lore: 'كان يحمي المقبرة. الظلام غيّر وظيفته.',
    introText: 'شيء يتحرك في الظلام...',
    defeatText: 'سقط الحارس. عاد الراحة له.'
  },

  // ═══════════════════════════════════════════════
  // 2. Centipede (أم 44) — المستنقع
  // ═══════════════════════════════════════════════
  centipede: {
    id: 'centipede',
    nameAr: 'أم أربعة وأربعين',
    nameEn: 'Centipede',
    sectionIdx: 1,

    hp: 600,
    damage: 18,
    speed: 60,
    scale: 1.6,

    xp: 150,
    shards: 40,
    atoms: 5,
    souls: 1,
    abilityReward: 'doubleJump',

    behaviors: ['walk', 'melee', 'dash'],
    phases: 2,
    attackCooldown: 1400,

    assets: {
      idle: 'boss-centipede',
      walk: 'centipede-walk',
      attack: 'centipede-attack',
      hurt: 'centipede-hurt',
      death: 'centipede-death'
    },

    lore: 'كانت تحرس المستنقع. الظلام جعلها تتضور جوعاً.',
    introText: 'شيء يزحف في الماء...',
    defeatText: 'ماتت الأم. لم تعد صغارها بحاجة إليها.'
  },

  // ═══════════════════════════════════════════════
  // 3. Turtle (سلحفاة) — الكهوف
  // ═══════════════════════════════════════════════
  turtle: {
    id: 'turtle',
    nameAr: 'السلحفاة القتالية',
    nameEn: 'Battle Turtle',
    sectionIdx: 2,

    hp: 800,
    damage: 20,
    speed: 40,
    scale: 1.7,

    xp: 200,
    shards: 50,
    atoms: 7,
    souls: 1,
    abilityReward: 'dash',

    behaviors: ['walk', 'melee', 'ranged', 'defense'],
    phases: 2,
    attackCooldown: 1300,

    assets: {
      idle: 'boss-turtle',
      walk: 'turtle-walk',
      attack: 'turtle-attack',
      hurt: 'turtle-hurt',
      death: 'turtle-death',
      bullet: 'turtle-bullet'
    },

    lore: 'كانت تحمي بلورة الكهوف. الظلام جعلها ترى الجميع أعداء.',
    introText: 'سلحفاة بحجم جبل...',
    defeatText: 'انكسرت درعها. نامت بسلام.'
  },

  // ═══════════════════════════════════════════════
  // 4. Boar (خنزير) — الغابة
  // ═══════════════════════════════════════════════
  boar: {
    id: 'boar',
    nameAr: 'الخنزير البري',
    nameEn: 'Wild Boar',
    sectionIdx: 3,

    hp: 1000,
    damage: 22,
    speed: 80,
    scale: 1.5,

    xp: 250,
    shards: 60,
    atoms: 10,
    souls: 2,
    abilityReward: 'wallJump',

    behaviors: ['charge', 'melee', 'rage'],
    phases: 3,
    attackCooldown: 1200,

    assets: {
      idle: 'boss-boar',
      run: 'boar-run-sheet',
      attack: 'boar-attack'
    },

    lore: 'كان زعيم القطيع. الظلام جعله وحشاً منفرداً.',
    introText: 'أنيابه كالسيوف...',
    defeatText: 'مات وحيداً. لم يكن له قطيع.'
  },

  // ═══════════════════════════════════════════════
  // 5. Tank (دبابة) — المصنع
  // ═══════════════════════════════════════════════
  tank: {
    id: 'tank',
    nameAr: 'دبابة الحرب',
    nameEn: 'War Tank',
    sectionIdx: 4,

    hp: 1500,
    damage: 25,
    speed: 35,
    scale: 2.0,

    xp: 400,
    shards: 100,
    atoms: 15,
    souls: 3,
    abilityReward: 'chargedAttack',

    behaviors: ['ranged', 'aoe', 'defense', 'summon'],
    phases: 3,
    attackCooldown: 1000,

    assets: {
      idle: 'boss-tank',
      attack: 'tank-gas',
      hurt: 'tank-hurt',
      death: 'tank-death'
    },

    lore: 'آخر سلاح صنعه البشر. الظلام استخدمه ضدهم.',
    introText: 'دبابة عظيمة...',
    defeatText: 'انفجرت. لم يبقَ منها شيء.'
  }
};

// ═══════════════════════════════════════════════════
// مراحل القتال (Phases)
// ═══════════════════════════════════════════════════
const BOSS_PHASES = {

  // Phase 1: عادي
  phase1: {
    nameAr: 'المرحلة الأولى',
    speedMultiplier: 1.0,
    damageMultiplier: 1.0,
    attackCooldownMultiplier: 1.0,
    newBehaviors: []
  },

  // Phase 2: غاضب
  phase2: {
    nameAr: 'الغضب',
    speedMultiplier: 1.3,
    damageMultiplier: 1.2,
    attackCooldownMultiplier: 0.7,
    newBehaviors: ['aggressive'],
    triggerHpPercent: 0.6
  },

  // Phase 3: يائس
  phase3: {
    nameAr: 'اليأس',
    speedMultiplier: 1.5,
    damageMultiplier: 1.5,
    attackCooldownMultiplier: 0.5,
    newBehaviors: ['desperate', 'summon'],
    triggerHpPercent: 0.3
  }
};

// ═══════════════════════════════════════════════════
// هجمات البوسات
// ═══════════════════════════════════════════════════
const BOSS_ATTACKS = {

  // هجمات قريبة
  melee: {
    nameAr: 'ضربة قريبة',
    range: 80,
    damage: 1.0,
    cooldown: 1500,
    windup: 400,
    active: 300,
    recovery: 500
  },

  // هجمات بعيدة
  ranged: {
    nameAr: 'هجوم بعيد',
    range: 400,
    damage: 0.8,
    cooldown: 2000,
    windup: 600,
    active: 200,
    recovery: 700,
    projectileSpeed: 250
  },

  // انطلاق
  dash: {
    nameAr: 'اندفاع',
    range: 300,
    damage: 1.2,
    cooldown: 2500,
    windup: 500,
    active: 400,
    recovery: 800,
    dashSpeed: 400
  },

  // منطقة تأثير (AoE)
  aoe: {
    nameAr: 'موجة صدمية',
    range: 200,
    damage: 1.5,
    cooldown: 3000,
    windup: 800,
    active: 300,
    recovery: 1000
  },

  // دفاع
  defense: {
    nameAr: 'دفاع',
    duration: 2000,
    cooldown: 5000,
    damageReduction: 0.5
  },

  // استدعاء
  summon: {
    nameAr: 'استدعاء',
    count: 2,
    cooldown: 6000,
    enemyType: 'shadowSlime'
  }
};

// ═══════════════════════════════════════════════════
// دوال مساعدة
// ═══════════════════════════════════════════════════
const Bosses_Data = {

  get(key){
    return BOSS_DATA[key] || null;
  },

  getAll(){
    return Object.keys(BOSS_DATA).map(k => BOSS_DATA[k]);
  },

  // حسب القسم
  getForSection(sectionIdx){
    return this.getAll().find(b => b.sectionIdx === sectionIdx);
  },

  // حسب الترتيب
  getByIndex(idx){
    return this.getForSection(idx);
  },

  // إحصائيات البوس في مرحلة معينة
  getPhaseStats(key, phaseNumber){
    const boss = BOSS_DATA[key];
    if(!boss) return null;

    const phaseKey = 'phase' + Math.min(phaseNumber, 3);
    const phase = BOSS_PHASES[phaseKey];
    if(!phase) return null;

    return {
      hp: boss.hp,
      speed: boss.speed * phase.speedMultiplier,
      damage: boss.damage * phase.damageMultiplier,
      attackCooldown: boss.attackCooldown * phase.attackCooldownMultiplier,
      phaseName: phase.nameAr
    };
  },

  // تحديد المرحلة بناءً على HP
  getCurrentPhase(key, currentHp){
    const boss = BOSS_DATA[key];
    if(!boss) return 1;

    const hpPercent = currentHp / boss.hp;

    // إذا عنده 3 مراحل
    if(boss.phases >= 3){
      if(hpPercent <= 0.3) return 3;
      if(hpPercent <= 0.6) return 2;
      return 1;
    }
    // إذا عنده مرحلتين
    else if(boss.phases >= 2){
      if(hpPercent <= 0.5) return 2;
      return 1;
    }
    // مرحلة واحدة
    return 1;
  },

  // هجوم البوس
  getAttack(key){
    return BOSS_ATTACKS[key] || null;
  },

  // المكافآت
  getRewards(key){
    const boss = BOSS_DATA[key];
    if(!boss) return null;

    return {
      xp: boss.xp,
      shards: boss.shards,
      atoms: boss.atoms,
      souls: boss.souls,
      ability: boss.abilityReward
    };
  },

  // عدد البوسات
  count(){
    return Object.keys(BOSS_DATA).length;
  },

  // ترتيب البوسات
  order: ['robot', 'centipede', 'turtle', 'boar', 'tank'],

  // آخر بوس
  isFinalBoss(key){
    const boss = BOSS_DATA[key];
    return boss && boss.sectionIdx === 4;
  },

  // هل البوس يطير؟
  isFlying(key){
    const boss = BOSS_DATA[key];
    return boss && boss.behaviors.includes('fly');
  },

  // إجمالي الأقسام
  totalSections: 5,

  // النص التعريفي
  getIntroText(key){
    const boss = BOSS_DATA[key];
    return boss ? boss.introText : '';
  },

  // نص الهزيمة
  getDefeatText(key){
    const boss = BOSS_DATA[key];
    return boss ? boss.defeatText : '';
  }
};

console.log('✅ BOSS_DATA loaded — ' + Bosses_Data.count() + ' bosses');
