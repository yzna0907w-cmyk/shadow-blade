// ═══════════════════════════════════════════════════
// EMBER — "صدى"
// ملف الحالة (الحفظ، الإحصائيات، الإنفنتوري)
// ═══════════════════════════════════════════════════
'use strict';

const State = {

  // ═══════════════════════════════════════════════
  // 1. البيانات الأساسية
  // ═══════════════════════════════════════════════
  data: null,
  _autoSaveTimer: null,
  _dirty: false,

  // ═══════════════════════════════════════════════
  // 2. القيم الافتراضية
  // ═══════════════════════════════════════════════
  defaults(){
    return {
      // ═══ الإصدار ═══
      version: CFG.SAVE_VERSION,
      timestamp: Date.now(),

      // ═══ البطل ═══
      player: {
        hp: CFG.PLAYER.MAX_HP,
        maxHp: CFG.PLAYER.MAX_HP,
        level: 1,
        xp: 0,
        xpNext: CFG.XP.BASE_REQUIREMENT,
        position: { x: 60, y: 100 },
        facing: 1
      },

      // ═══ العملات ═══
      currencies: {
        shards: 0,
        atoms: 0,
        souls: 0
      },

      // ═══ التقدم ═══
      progress: {
        currentSection: 0,          // القسم الحالي (0-4)
        currentRoom: 0,             // الغرفة الحالية
        bossesDefeated: [false, false, false, false, false],
        roomsDiscovered: {},        // { 'crypt-01': true, ... }
        sectionsUnlocked: [true, false, false, false, false],
        gameCompleted: false
      },

      // ═══ القدرات ═══
      abilities: {
        doubleJump: false,
        dash: false,
        wallJump: false,
        chargedAttack: false,
        glide: false
      },

      // ═══ الأسلحة ═══
      weapons: {
        current: CFG.DEFAULT_WEAPON,
        unlocked: {
          sword: true,
          axe: true,
          spear: true
        },
        upgrades: {
          sword: 0,
          axe: 0,
          spear: 0
        }
      },

      // ═══ الإنفنتوري ═══
      inventory: {
        items: [],           // [{id, type, name, count, icon}]
        maxSlots: 20,
        potions: 0,          // أدوية
        keys: 0              // مفاتيح
      },

      // ═══ الإحصائيات ═══
      stats: {
        totalKills: 0,
        totalDeaths: 0,
        totalGold: 0,
        totalBossesDefeated: 0,
        playtime: 0,
        roomsVisited: 0,
        questsCompleted: 0,
        damageDealt: 0,
        damageTaken: 0
      },

      // ═══ المهام ═══
      quests: {
        // { questId: { status: 'active'|'completed'|'failed', progress: 0 } }
      },

      // ═══ NPCs ═══
      npcs: {
        met: {},              // { npcId: true }
        talkedTo: {}          // { npcId: count }
      },

      // ═══ المتاجر ═══
      shops: {
        visited: {},          // { shopId: true }
        purchased: {}         // { itemId: count }
      },

      // ═══ الأحداث ═══
      flags: {
        // { eventId: true }
      }
    };
  },

  // ═══════════════════════════════════════════════
  // 3. التهيئة
  // ═══════════════════════════════════════════════
  init(){
    this.load();
    this.startAutoSave();
    console.log('✅ State initialized — Level ' + this.data.player.level);
  },

  // ═══════════════════════════════════════════════
  // 4. الحفظ والتحميل
  // ═══════════════════════════════════════════════
  save(){
    try {
      this.data.timestamp = Date.now();
      localStorage.setItem(CFG.SAVE_KEY, JSON.stringify(this.data));
      this._dirty = false;
      return true;
    } catch(e) {
      console.error('Save error:', e);
      return false;
    }
  },

  load(){
    try {
      const raw = localStorage.getItem(CFG.SAVE_KEY);
      if(!raw){
        this.data = this.defaults();
        return false;
      }

      const parsed = JSON.parse(raw);

      // التحقق من الإصدار
      if(parsed.version !== CFG.SAVE_VERSION){
        console.warn('Save version mismatch — resetting');
        this.data = this.defaults();
        return false;
      }

      // دمج مع الافتراضيات (لو ناقص حقول)
      this.data = this._mergeDeep(this.defaults(), parsed);
      return true;

    } catch(e) {
      console.error('Load error:', e);
      this.data = this.defaults();
      return false;
    }
  },

  // ═══════════════════════════════════════════════
  // 5. دمج عميق (لضمان وجود كل الحقول)
  // ═══════════════════════════════════════════════
  _mergeDeep(target, source){
    const out = { ...target };
    for(const key in source){
      if(source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])){
        out[key] = this._mergeDeep(target[key] || {}, source[key]);
      } else {
        out[key] = source[key];
      }
    }
    return out;
  },

  // ═══════════════════════════════════════════════
  // 6. الحفظ التلقائي
  // ═══════════════════════════════════════════════
  startAutoSave(){
    if(this._autoSaveTimer) clearInterval(this._autoSaveTimer);
    this._autoSaveTimer = setInterval(() => {
      if(this._dirty) this.save();
    }, CFG.AUTO_SAVE_INTERVAL);
  },

  markDirty(){
    this._dirty = true;
  },

  // ═══════════════════════════════════════════════
  // 7. إعادة تعيين
  // ═══════════════════════════════════════════════
  reset(){
    this.data = this.defaults();
    try {
      localStorage.removeItem(CFG.SAVE_KEY);
    } catch(e) {}
    console.log('🔄 State reset');
  },

  // ═══════════════════════════════════════════════
  // 8. إدارة الصحة
  // ═══════════════════════════════════════════════
  hp: {
    get(){ return State.data.player.hp; },
    getMax(){ return State.data.player.maxHp; },
    set(value){
      State.data.player.hp = Math.max(0, Math.min(value, State.data.player.maxHp));
      State.markDirty();
    },
    damage(amount){
      State.data.player.hp = Math.max(0, State.data.player.hp - amount);
      State.data.stats.damageTaken += amount;
      State.markDirty();
      return State.data.player.hp;
    },
    heal(amount){
      State.data.player.hp = Math.min(State.data.player.maxHp, State.data.player.hp + amount);
      State.markDirty();
      return State.data.player.hp;
    },
    isDead(){ return State.data.player.hp <= 0; },
    getPercent(){
      return State.data.player.hp / State.data.player.maxHp;
    }
  },

  // ═══════════════════════════════════════════════
  // 9. إدارة XP والمستوى
  // ═══════════════════════════════════════════════
  xp: {
    add(amount){
      const p = State.data.player;
      p.xp += amount;
      let leveledUp = false;

      while(p.xp >= p.xpNext){
        p.xp -= p.xpNext;
        p.level++;
        p.maxHp += CFG.XP.HP_PER_LEVEL;
        p.hp = p.maxHp; // استعادة كاملة
        p.xpNext = Math.floor(CFG.XP.BASE_REQUIREMENT * Math.pow(CFG.XP.GROWTH_PER_LEVEL, p.level - 1));
        leveledUp = true;
      }

      State.markDirty();
      return leveledUp;
    },
    get(){ return State.data.player.xp; },
    getNext(){ return State.data.player.xpNext; },
    getLevel(){ return State.data.player.level; },
    getPercent(){
      return State.data.player.xp / State.data.player.xpNext;
    }
  },

  // ═══════════════════════════════════════════════
  // 10. إدارة العملات
  // ═══════════════════════════════════════════════
  currency: {
    get(type){ return State.data.currencies[type] || 0; },
    add(type, amount){
      if(!State.data.currencies[type]) State.data.currencies[type] = 0;
      State.data.currencies[type] += amount;
      if(type === 'shards') State.data.stats.totalGold += amount;
      State.markDirty();
      return State.data.currencies[type];
    },
    spend(type, amount){
      if(State.data.currencies[type] < amount) return false;
      State.data.currencies[type] -= amount;
      State.markDirty();
      return true;
    },
    canAfford(type, amount){
      return State.data.currencies[type] >= amount;
    },
    getAll(){
      return { ...State.data.currencies };
    }
  },

  // ═══════════════════════════════════════════════
  // 11. إدارة القدرات
  // ═══════════════════════════════════════════════
  ability: {
    has(key){ return State.data.abilities[key] === true; },
    unlock(key){
      if(State.data.abilities[key]) return false;
      State.data.abilities[key] = true;
      State.markDirty();
      return true;
    },
    getAll(){ return { ...State.data.abilities }; },
    countUnlocked(){
      return Object.values(State.data.abilities).filter(v => v).length;
    }
  },

  // ═══════════════════════════════════════════════
  // 12. إدارة الأسلحة
  // ═══════════════════════════════════════════════
  weapon: {
    getCurrent(){ return State.data.weapons.current; },
    setCurrent(key){
      if(!State.data.weapons.unlocked[key]) return false;
      State.data.weapons.current = key;
      State.markDirty();
      return true;
    },
    isUnlocked(key){ return State.data.weapons.unlocked[key] === true; },
    unlock(key){
      if(State.data.weapons.unlocked[key]) return false;
      State.data.weapons.unlocked[key] = true;
      State.markDirty();
      return true;
    },
    getTier(key){ return State.data.weapons.upgrades[key] || 0; },
    getDamage(key){
      const weapon = CFG.WEAPONS[key];
      const tier = State.weapon.getTier(key);
      const upgrade = UPGRADE_TIERS[tier] || UPGRADE_TIERS[0];
      return Math.floor(weapon.damage * upgrade.damageMul);
    },
    upgrade(key){
      const currentTier = State.weapon.getTier(key);
      if(currentTier >= UPGRADE_TIERS.length - 1) return false;

      const nextTier = UPGRADE_TIERS[currentTier + 1];
      if(!State.currency.canAfford('shards', nextTier.price)) return false;

      State.currency.spend('shards', nextTier.price);
      State.data.weapons.upgrades[key] = currentTier + 1;
      State.markDirty();
      return true;
    },
    cycle(){ // تبديل للسلاح التالي
      const order = CFG.WEAPON_ORDER;
      const current = State.data.weapons.current;
      const idx = order.indexOf(current);
      for(let i = 1; i <= order.length; i++){
        const next = order[(idx + i) % order.length];
        if(State.data.weapons.unlocked[next]){
          State.data.weapons.current = next;
          State.markDirty();
          return next;
        }
      }
      return current;
    }
  },

  // ═══════════════════════════════════════════════
  // 13. إدارة الإنفنتوري
  // ═══════════════════════════════════════════════
  inventory: {
    addItem(item){
      const inv = State.data.inventory;
      const existing = inv.items.find(i => i.id === item.id);
      if(existing){
        existing.count += (item.count || 1);
      } else {
        if(inv.items.length >= inv.maxSlots) return false;
        inv.items.push({ ...item, count: item.count || 1 });
      }
      State.markDirty();
      return true;
    },
    removeItem(itemId, count = 1){
      const inv = State.data.inventory;
      const idx = inv.items.findIndex(i => i.id === itemId);
      if(idx === -1) return false;

      inv.items[idx].count -= count;
      if(inv.items[idx].count <= 0) inv.items.splice(idx, 1);
      State.markDirty();
      return true;
    },
    hasItem(itemId, count = 1){
      const item = State.data.inventory.items.find(i => i.id === itemId);
      return item && item.count >= count;
    },
    getItems(){ return [...State.data.inventory.items]; },
    clear(){
      State.data.inventory.items = [];
      State.markDirty();
    }
  },

  // ═══════════════════════════════════════════════
  // 14. إدارة التقدم
  // ═══════════════════════════════════════════════
  progress: {
    getCurrentSection(){ return State.data.progress.currentSection; },
    setCurrentSection(idx){
      State.data.progress.currentSection = idx;
      State.markDirty();
    },
    getCurrentRoom(){ return State.data.progress.currentRoom; },
    setCurrentRoom(idx){
      State.data.progress.currentRoom = idx;
      State.markDirty();
    },
    defeatBoss(sectionIdx){
      State.data.progress.bossesDefeated[sectionIdx] = true;
      State.data.stats.totalBossesDefeated++;
      if(sectionIdx + 1 < 5) State.data.progress.sectionsUnlocked[sectionIdx + 1] = true;
      State.markDirty();
    },
    isBossDefeated(sectionIdx){
      return State.data.progress.bossesDefeated[sectionIdx] === true;
    },
    discoverRoom(roomId){
      if(State.data.progress.roomsDiscovered[roomId]) return false;
      State.data.progress.roomsDiscovered[roomId] = true;
      State.data.stats.roomsVisited++;
      State.markDirty();
      return true;
    },
    isRoomDiscovered(roomId){
      return State.data.progress.roomsDiscovered[roomId] === true;
    },
    countRoomsDiscovered(){
      return Object.keys(State.data.progress.roomsDiscovered).length;
    }
  },

  // ═══════════════════════════════════════════════
  // 15. إدارة الإحصائيات
  // ═══════════════════════════════════════════════
  stats: {
    addKill(){
      State.data.stats.totalKills++;
      State.markDirty();
    },
    addDeath(){
      State.data.stats.totalDeaths++;
      State.markDirty();
    },
    addDamage(amount){
      State.data.stats.damageDealt += amount;
      State.markDirty();
    },
    get(){ return { ...State.data.stats }; }
  },

  // ═══════════════════════════════════════════════
  // 16. إدارة المهام
  // ═══════════════════════════════════════════════
  quest: {
    start(questId){
      if(State.data.quests[questId]) return false;
      State.data.quests[questId] = { status: 'active', progress: 0 };
      State.markDirty();
      return true;
    },
    updateProgress(questId, value){
      const quest = State.data.quests[questId];
      if(!quest) return false;
      quest.progress = value;
      State.markDirty();
      return true;
    },
    complete(questId){
      const quest = State.data.quests[questId];
      if(!quest) return false;
      quest.status = 'completed';
      State.data.stats.questsCompleted++;
      State.markDirty();
      return true;
    },
    isActive(questId){
      const quest = State.data.quests[questId];
      return quest && quest.status === 'active';
    },
    isCompleted(questId){
      const quest = State.data.quests[questId];
      return quest && quest.status === 'completed';
    },
    get(questId){ return State.data.quests[questId] || null; }
  },

  // ═══════════════════════════════════════════════
  // 17. إدارة NPCs
  // ═══════════════════════════════════════════════
  npc: {
    meet(npcId){
      if(State.data.npcs.met[npcId]) return false;
      State.data.npcs.met[npcId] = true;
      State.markDirty();
      return true;
    },
    hasMet(npcId){ return State.data.npcs.met[npcId] === true; },
    talk(npcId){
      State.data.npcs.talkedTo[npcId] = (State.data.npcs.talkedTo[npcId] || 0) + 1;
      State.markDirty();
    },
    getTalkCount(npcId){
      return State.data.npcs.talkedTo[npcId] || 0;
    }
  },

  // ═══════════════════════════════════════════════
  // 18. إدارة المتاجر
  // ═══════════════════════════════════════════════
  shop: {
    visit(shopId){
      State.data.shops.visited[shopId] = true;
      State.markDirty();
    },
    hasVisited(shopId){
      return State.data.shops.visited[shopId] === true;
    },
    recordPurchase(itemId){
      State.data.shops.purchased[itemId] = (State.data.shops.purchased[itemId] || 0) + 1;
      State.markDirty();
    }
  },

  // ═══════════════════════════════════════════════
  // 19. الأحداث (Flags)
  // ═══════════════════════════════════════════════
  flag: {
    set(flagId, value = true){
      State.data.flags[flagId] = value;
      State.markDirty();
    },
    get(flagId, defaultVal = false){
      return State.data.flags[flagId] !== undefined ? State.data.flags[flagId] : defaultVal;
    },
    has(flagId){ return State.data.flags[flagId] === true; },
    clear(flagId){ delete State.data.flags[flagId]; State.markDirty(); }
  },

  // ═══════════════════════════════════════════════
  // 20. تصدير/استيراد (نسخ احتياطي يدوي)
  // ═══════════════════════════════════════════════
  export(){
    try {
      return btoa(JSON.stringify(this.data));
    } catch(e) { return null; }
  },

  import(encoded){
    try {
      const parsed = JSON.parse(atob(encoded));
      this.data = this._mergeDeep(this.defaults(), parsed);
      this.save();
      return true;
    } catch(e) { return false; }
  }
};

// التهيئة
State.init();
