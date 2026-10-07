// ═══════════════════════════════════════════════════
// EMBER — "صدى"
// الأدوات القابلة للاستخدام
// ═══════════════════════════════════════════════════
'use strict';

const ITEM_DATA = {

  // ═══════════════════════════════════════════════
  // 💊 أدوية (تُشترى من الساحر والعطّار)
  // ═══════════════════════════════════════════════
  health_potion_small: {
    id: 'health_potion_small',
    nameAr: 'جرعة صحة صغيرة',
    icon: '🧪',
    category: 'potion',
    price: 10,
    currency: 'shards',
    effect: { type: 'heal', value: 30 },
    stackable: true,
    maxStack: 9,
    desc: 'تستعيد 30 صحة'
  },

  health_potion_big: {
    id: 'health_potion_big',
    nameAr: 'جرعة صحة كبيرة',
    icon: '🍶',
    category: 'potion',
    price: 25,
    currency: 'shards',
    effect: { type: 'heal', value: 75 },
    stackable: true,
    maxStack: 9,
    desc: 'تستعيد 75 صحة'
  },

  full_restore: {
    id: 'full_restore',
    nameAr: 'جرعة الإحياء',
    icon: '⚗️',
    category: 'potion',
    price: 50,
    currency: 'shards',
    effect: { type: 'heal', value: 999 },
    stackable: true,
    maxStack: 3,
    desc: 'تستعيد كل الصحة'
  },

  attack_boost: {
    id: 'attack_boost',
    nameAr: 'جرعة القوة',
    icon: '🔥',
    category: 'potion',
    price: 30,
    currency: 'shards',
    effect: { type: 'buff', stat: 'attack', value: 50, duration: 15000 },
    stackable: true,
    maxStack: 5,
    desc: 'قوة +50% لمدة 15 ثانية'
  },

  defense_boost: {
    id: 'defense_boost',
    nameAr: 'جرعة الحماية',
    icon: '🛡️',
    category: 'potion',
    price: 30,
    currency: 'shards',
    effect: { type: 'buff', stat: 'defense', value: 50, duration: 15000 },
    stackable: true,
    maxStack: 5,
    desc: 'حماية +50% لمدة 15 ثانية'
  },

  speed_boost: {
    id: 'speed_boost',
    nameAr: 'جرعة السرعة',
    icon: '💨',
    category: 'potion',
    price: 25,
    currency: 'shards',
    effect: { type: 'buff', stat: 'speed', value: 40, duration: 12000 },
    stackable: true,
    maxStack: 5,
    desc: 'سرعة +40% لمدة 12 ثانية'
  },

  // ═══════════════════════════════════════════════
  // 🗝️ مفاتيح (للأبواب والصناديق)
  // ═══════════════════════════════════════════════
  key_silver: {
    id: 'key_silver',
    nameAr: 'مفتاح فضي',
    icon: '🗝️',
    category: 'key',
    price: 0,
    currency: 'atoms',
    effect: { type: 'unlock', tier: 'silver' },
    stackable: true,
    maxStack: 20,
    desc: 'يفتح الصناديق الفضية'
  },

  key_gold: {
    id: 'key_gold',
    nameAr: 'مفتاح ذهبي',
    icon: '🔑',
    category: 'key',
    price: 10,
    currency: 'atoms',
    effect: { type: 'unlock', tier: 'gold' },
    stackable: true,
    maxStack: 20,
    desc: 'يفتح الصناديق الذهبية'
  },

  // ═══════════════════════════════════════════════
  // 🗺️ خرائط (لكشف المراحل)
  // ═══════════════════════════════════════════════
  map_section: {
    id: 'map_section',
    nameAr: 'خريطة قسم',
    icon: '🗺️',
    category: 'utility',
    price: 5,
    currency: 'atoms',
    effect: { type: 'reveal', scope: 'section' },
    stackable: false,
    maxStack: 1,
    desc: 'تكشف القسم بالكامل'
  },

  // ═══════════════════════════════════════════════
  // 💎 أدوات خاصة
  // ═══════════════════════════════════════════════
  soul_fragment: {
    id: 'soul_fragment',
    nameAr: 'شظية روح',
    icon: '👻',
    category: 'material',
    price: 0,
    currency: 'souls',
    effect: { type: 'craft' },
    stackable: true,
    maxStack: 99,
    desc: 'مادة نادرة للتطويرات السرية'
  },

  ancient_relic: {
    id: 'ancient_relic',
    nameAr: 'أثر قديم',
    icon: '🏺',
    category: 'treasure',
    price: 100,
    currency: 'shards',
    effect: { type: 'sell' },
    stackable: true,
    maxStack: 10,
    desc: 'يُباع مقابل شظايا كثيرة'
  },

  // ═══════════════════════════════════════════════
  // 🎁 مكافآت المهام
  // ═══════════════════════════════════════════════
  quest_badge: {
    id: 'quest_badge',
    nameAr: 'شارة المهمة',
    icon: '🎖️',
    category: 'quest',
    price: 0,
    currency: 'souls',
    effect: { type: 'quest' },
    stackable: true,
    maxStack: 10,
    desc: 'دليل على إكمال مهمة'
  }
};

// ═══════════════════════════════════════════════════
// دوال مساعدة
// ═══════════════════════════════════════════════════
const Items = {

  get(id){ return ITEM_DATA[id] || null; },

  getAll(){ return Object.keys(ITEM_DATA).map(k => ITEM_DATA[k]); },

  getByCategory(cat){ return this.getAll().filter(i => i.category === cat); },

  // استخدام أداة
  use(scene, itemId){
    const item = ITEM_DATA[itemId];
    if(!item) return false;

    // فحص التوفر
    if(!State.inventory.hasItem(itemId)) return false;

    // تطبيق التأثير
    const success = this._applyEffect(scene, item);
    if(!success) return false;

    // حذف من الإنفنتوري
    State.inventory.removeItem(itemId, 1);
    Audio.playUISuccess();
    Events.emit('item:used', { item: item });

    return true;
  },

  _applyEffect(scene, item){
    const e = item.effect;
    if(!e) return false;

    switch(e.type){
      case 'heal':
        State.hp.heal(e.value);
        HUD.update();
        this._spawnHealEffect(scene);
        return true;

      case 'buff':
        Buffs.apply(e.stat, e.value, e.duration);
        return true;

      case 'unlock':
        // يفتح شي (يُعالج في مكان آخر)
        return true;

      case 'reveal':
        if(scene && typeof MapSystem !== 'undefined'){
          MapSystem.revealAll();
        }
        return true;

      case 'sell':
        State.currency.add('shards', item.price);
        return true;

      case 'craft':
      case 'quest':
        // يُعالج في مكان آخر
        return true;

      default:
        return false;
    }
  },

  _spawnHealEffect(scene){
    if(!scene || !Player.sprite) return;

    const px = Player.sprite.x;
    const py = Player.sprite.y;

    for(let i = 0; i < 15; i++){
      const angle = (i / 15) * Math.PI * 2;
      const p = scene.add.circle(px, py, 3, 0x00ff00);
      p.setDepth(150);
      scene.tweens.add({
        targets: p,
        x: px + Math.cos(angle) * 50,
        y: py + Math.sin(angle) * 50 - 30,
        alpha: 0,
        scale: 0,
        duration: 800,
        onComplete: () => p.destroy()
      });
    }
  },

  // فحص القدرة على الشراء
  canAfford(itemId){
    const item = ITEM_DATA[itemId];
    if(!item || item.price === 0) return true;
    return State.currency.canAfford(item.currency, item.price);
  },

  // شراء أداة
  buy(itemId){
    const item = ITEM_DATA[itemId];
    if(!item) return false;
    if(!this.canAfford(itemId)) return false;

    // دفع
    if(item.price > 0){
      State.currency.spend(item.currency, item.price);
    }

    // إضافة للإنفنتوري
    State.inventory.addItem({
      id: item.id,
      name: item.nameAr,
      icon: item.icon,
      count: 1
    });

    Audio.playUISuccess();
    Events.emit('item:purchased', { item: item });
    return true;
  },

  // بيع أداة
  sell(itemId){
    const item = ITEM_DATA[itemId];
    if(!item) return false;
    if(!State.inventory.hasItem(itemId)) return false;

    const sellPrice = Math.floor(item.price * 0.5);
    State.currency.add(item.currency === 'shards' ? 'shards' : 'shards', sellPrice);
    State.inventory.removeItem(itemId, 1);

    Audio.playUISelect();
    return true;
  },

  count(){ return Object.keys(ITEM_DATA).length; }
};

console.log('✅ ITEM_DATA loaded — ' + Items.count() + ' items');
