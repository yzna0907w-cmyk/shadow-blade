// ═══════════════════════════════════════════════════
// EMBER — "صدى"
// كل الأسعار والمكافآت
// ═══════════════════════════════════════════════════
'use strict';

const PRICES = {

  // ═══ ⚒️ الحداد ═══
  blacksmith: {
    nameAr: 'الحداد',
    prices: {
      sword_1: { weapon: 'sword', tier: 1, price: 15, currency: 'shards' },
      sword_2: { weapon: 'sword', tier: 2, price: 40, currency: 'shards' },
      sword_3: { weapon: 'sword', tier: 3, price: 100, currency: 'shards' },
      axe_1: { weapon: 'axe', tier: 1, price: 20, currency: 'shards' },
      axe_2: { weapon: 'axe', tier: 2, price: 50, currency: 'shards' },
      axe_3: { weapon: 'axe', tier: 3, price: 120, currency: 'shards' },
      spear_1: { weapon: 'spear', tier: 1, price: 18, currency: 'shards' },
      spear_2: { weapon: 'spear', tier: 2, price: 45, currency: 'shards' },
      spear_3: { weapon: 'spear', tier: 3, price: 110, currency: 'shards' }
    }
  },

  // ═══ 🧙 الساحر ═══
  wizard: {
    nameAr: 'الساحر',
    items: ['health_potion_small', 'health_potion_big', 'full_restore', 'attack_boost']
  },

  // ═══ 🧪 العطّار ═══
  herbalist: {
    nameAr: 'العطّار',
    items: ['health_potion_small', 'defense_boost', 'speed_boost']
  },

  // ═══ 💎 تاجر التحف ═══
  relic_trader: {
    nameAr: 'تاجر التحف',
    items: [
      { ability: 'doubleJump', price: 15, currency: 'atoms' },
      { ability: 'dash', price: 20, currency: 'atoms' },
      { ability: 'wallJump', price: 25, currency: 'atoms' },
      { ability: 'chargedAttack', price: 30, currency: 'atoms' },
      { ability: 'glide', price: 40, currency: 'atoms' }
    ]
  },

  // ═══ 🗝️ بائع الأسرار ═══
  secret_seller: {
    nameAr: 'بائع الأسرار',
    items: ['map_section', 'key_silver', 'key_gold']
  }
};

// ═══════════════════════════════════════════════════
// مكافآت قتل الأعداء
// ═══════════════════════════════════════════════════
const REWARDS = {
  basic_enemy: {
    shards: { min: 1, max: 3 },
    atoms:  { chance: 0.03, amount: 1 },
    souls:  { chance: 0 }
  },
  elite_enemy: {
    shards: { min: 5, max: 12 },
    atoms:  { chance: 0.15, amount: 1 },
    souls:  { chance: 0.02, amount: 1 }
  },
  boss_1: { shards: 25, atoms: 3, souls: 1, xp: 100 },
  boss_2: { shards: 40, atoms: 5, souls: 1, xp: 150 },
  boss_3: { shards: 60, atoms: 7, souls: 1, xp: 200 },
  boss_4: { shards: 80, atoms: 10, souls: 2, xp: 250 },
  boss_5: { shards: 120, atoms: 15, souls: 3, xp: 400 },
  chest_silver: {
    shards: { min: 5, max: 15 },
    atoms: { chance: 0.2, amount: 1 }
  },
  chest_gold: {
    shards: { min: 15, max: 30 },
    atoms: { chance: 0.5, amount: 1 },
    souls: { chance: 0.1, amount: 1 }
  }
};

// ═══════════════════════════════════════════════════
// دوال مساعدة
// ═══════════════════════════════════════════════════
const Prices = {

  getWeaponUpgrade(weapon, tier){
    return PRICES.blacksmith.prices[weapon + '_' + tier] || null;
  },

  getAbilityPrice(abilityKey){
    return PRICES.relic_trader.items.find(i => i.ability === abilityKey) || null;
  },

  rollEnemyRewards(type = 'basic_enemy'){
    const r = REWARDS[type];
    if(!r) return null;

    const rewards = { shards: 0, atoms: 0, souls: 0, xp: 0 };

    if(r.shards){
      if(typeof r.shards === 'number') rewards.shards = r.shards;
      else rewards.shards = Math.floor(Math.random() * (r.shards.max - r.shards.min + 1)) + r.shards.min;
    }

    if(r.atoms && r.atoms.chance){
      if(Math.random() < r.atoms.chance) rewards.atoms = r.atoms.amount || 1;
    } else if(typeof r.atoms === 'number'){
      rewards.atoms = r.atoms;
    }

    if(r.souls && r.souls.chance){
      if(Math.random() < r.souls.chance) rewards.souls = r.souls.amount || 1;
    } else if(typeof r.souls === 'number'){
      rewards.souls = r.souls;
    }

    if(r.xp) rewards.xp = r.xp;
    return rewards;
  },

  getBossRewards(bossIndex){
    return REWARDS['boss_' + (bossIndex + 1)] || null;
  },

  getChestRewards(type = 'chest_silver'){
    return this.rollEnemyRewards(type);
  },

  getShop(shopId){ return PRICES[shopId] || null; },
  getAll(){ return PRICES; }
};

console.log('✅ PRICES loaded — ' + Object.keys(PRICES).length + ' shops, ' + Object.keys(REWARDS).length + ' rewards');
