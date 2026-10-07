// ═══════════════════════════════════════════════════
// EMBER — "صدى"
// نظام الأحداث (Event Bus)
// ═══════════════════════════════════════════════════
'use strict';

const Events = {

  // ═══════════════════════════════════════════════
  // 1. السجل
  // ═══════════════════════════════════════════════
  _listeners: {},       // { eventName: [{ callback, once, id }] }
  _nextId: 1,
  _history: [],         // آخر 100 حدث (للتشخيص)
  _maxHistory: 100,
  _debug: false,

  // ═══════════════════════════════════════════════
  // 2. أسماء الأحداث (ثوابت)
  // ═══════════════════════════════════════════════
  NAMES: {
    // ═══ اللعبة ═══
    GAME_START:        'game:start',
    GAME_PAUSE:        'game:pause',
    GAME_RESUME:       'game:resume',
    GAME_OVER:         'game:over',
    GAME_COMPLETE:     'game:complete',

    // ═══ البطل ═══
    PLAYER_DIED:       'player:died',
    PLAYER_RESPAWN:    'player:respawn',
    PLAYER_HURT:       'player:hurt',
    PLAYER_HEAL:       'player:heal',
    PLAYER_LEVELUP:    'player:levelup',
    PLAYER_JUMP:       'player:jump',
    PLAYER_ATTACK:     'player:attack',
    PLAYER_DASH:       'player:dash',
    PLAYER_LAND:       'player:land',
    PLAYER_MOVED:      'player:moved',

    // ═══ الأعداء ═══
    ENEMY_SPAWNED:     'enemy:spawned',
    ENEMY_DIED:        'enemy:died',
    ENEMY_HURT:        'enemy:hurt',

    // ═══ البوسات ═══
    BOSS_SPAWNED:      'boss:spawned',
    BOSS_HURT:         'boss:hurt',
    BOSS_DEFEATED:     'boss:defeated',
    BOSS_PHASE:        'boss:phase',

    // ═══ العملات ═══
    COIN_COLLECTED:    'coin:collected',
    CURRENCY_ADDED:    'currency:added',
    CURRENCY_SPENT:    'currency:spent',
    RARE_DROP:         'drop:rare',

    // ═══ القدرات ═══
    ABILITY_UNLOCKED:  'ability:unlocked',
    ABILITY_USED:      'ability:used',

    // ═══ الأسلحة ═══
    WEAPON_SWITCHED:   'weapon:switched',
    WEAPON_UPGRADED:   'weapon:upgraded',

    // ═══ الإنفنتوري ═══
    ITEM_ADDED:        'item:added',
    ITEM_REMOVED:      'item:removed',
    ITEM_USED:         'item:used',
    INVENTORY_FULL:    'inventory:full',

    // ═══ الألغاز ═══
    PUZZLE_SOLVED:     'puzzle:solved',
    CHEST_OPENED:      'chest:opened',
    DOOR_OPENED:       'door:opened',
    SECRET_FOUND:      'secret:found',

    // ═══ المراحل ═══
    SECTION_ENTERED:   'section:entered',
    ROOM_ENTERED:      'room:entered',
    ROOM_DISCOVERED:   'room:discovered',
    CHECKPOINT_SAVED:  'checkpoint:saved',

    // ═══ NPCs ═══
    NPC_MET:           'npc:met',
    NPC_TALKED:        'npc:talked',
    QUEST_STARTED:     'quest:started',
    QUEST_COMPLETED:   'quest:completed',

    // ═══ المتاجر ═══
    SHOP_OPENED:       'shop:opened',
    SHOP_CLOSED:       'shop:closed',
    ITEM_PURCHASED:    'shop:purchased',

    // ═══ الواجهة ═══
    UI_OPENED:         'ui:opened',
    UI_CLOSED:         'ui:closed',
    STORY_STARTED:     'story:started',
    STORY_ENDED:       'story:ended',

    // ═══ الحفظ ═══
    SAVED:             'save:saved',
    LOADED:            'save:loaded'
  },

  // ═══════════════════════════════════════════════
  // 3. التسجيل (Subscribe)
  // ═══════════════════════════════════════════════
  on(eventName, callback){
    if(typeof callback !== 'function') return null;

    if(!this._listeners[eventName]){
      this._listeners[eventName] = [];
    }

    const id = this._nextId++;
    this._listeners[eventName].push({ callback, once: false, id });

    if(this._debug){
      console.log('📡 Event listener added: ' + eventName + ' (id: ' + id + ')');
    }
    return id;
  },

  // ═══════════════════════════════════════════════
  // 4. التسجيل لمرة واحدة (Once)
  // ═══════════════════════════════════════════════
  once(eventName, callback){
    if(typeof callback !== 'function') return null;

    if(!this._listeners[eventName]){
      this._listeners[eventName] = [];
    }

    const id = this._nextId++;
    this._listeners[eventName].push({ callback, once: true, id });

    if(this._debug){
      console.log('📡 Event once-listener added: ' + eventName + ' (id: ' + id + ')');
    }
    return id;
  },

  // ═══════════════════════════════════════════════
  // 5. الإطلاق (Emit)
  // ═══════════════════════════════════════════════
  emit(eventName, data = null){
    // تسجيل في التاريخ
    this._history.push({
      name: eventName,
      data: data,
      time: Date.now()
    });
    if(this._history.length > this._maxHistory){
      this._history.shift();
    }

    if(this._debug){
      console.log('📡 Event: ' + eventName, data);
    }

    // استدعاء المستمعين
    const listeners = this._listeners[eventName];
    if(!listeners || listeners.length === 0) return;

    const toRemove = [];
    listeners.forEach(listener => {
      try {
        listener.callback(data);
      } catch(e) {
        console.error('Event error in ' + eventName + ':', e);
      }
      if(listener.once){
        toRemove.push(listener.id);
      }
    });

    // إزالة الـ once
    if(toRemove.length > 0){
      this._listeners[eventName] = listeners.filter(l => !toRemove.includes(l.id));
    }
  },

  // ═══════════════════════════════════════════════
  // 6. الإلغاء (Unsubscribe)
  // ═══════════════════════════════════════════════
  off(eventName, id){
    if(!this._listeners[eventName]) return false;
    const before = this._listeners[eventName].length;
    this._listeners[eventName] = this._listeners[eventName].filter(l => l.id !== id);
    return this._listeners[eventName].length < before;
  },

  offAll(eventName){
    if(eventName){
      delete this._listeners[eventName];
    } else {
      this._listeners = {};
    }
  },

  // ═══════════════════════════════════════════════
  // 7. أدوات مساعدة
  // ═══════════════════════════════════════════════
  hasListeners(eventName){
    return this._listeners[eventName] && this._listeners[eventName].length > 0;
  },

  countListeners(eventName){
    if(eventName){
      return (this._listeners[eventName] || []).length;
    }
    let total = 0;
    for(const key in this._listeners){
      total += this._listeners[key].length;
    }
    return total;
  },

  getHistory(count = 20){
    return this._history.slice(-count);
  },

  clearHistory(){
    this._history = [];
  },

  // ═══════════════════════════════════════════════
  // 8. التصحيح
  // ═══════════════════════════════════════════════
  setDebug(enabled){
    this._debug = enabled;
    console.log('📡 Events debug: ' + (enabled ? 'ON' : 'OFF'));
  },

  // ═══════════════════════════════════════════════
  // 9. تشغيل/إيقاف (للحفظ)
  // ═══════════════════════════════════════════════
  pause(){
    this._paused = true;
  },

  resume(){
    this._paused = false;
  },

  isPaused(){
    return this._paused === true;
  },

  // ═══════════════════════════════════════════════
  // 10. إعادة تعيين
  // ═══════════════════════════════════════════════
  reset(){
    this._listeners = {};
    this._history = [];
    this._nextId = 1;
    console.log('🔄 Events reset');
  }
};

// ═══════════════════════════════════════════════════
// دمج مع الأنظمة الأخرى (اختصارات)
// ═══════════════════════════════════════════════════

// لما يموت اللاعب
Events.on(Events.NAMES.PLAYER_DIED, () => {
  State.stats.addDeath();
  State.save();
});

// لما يقتل عدو
Events.on(Events.NAMES.ENEMY_DIED, (data) => {
  State.stats.addKill();
  if(data && data.xp) State.xp.add(data.xp);
});

// لما يفتح قدرة
Events.on(Events.NAMES.ABILITY_UNLOCKED, (data) => {
  State.ability.unlock(data.key);
  State.save();
});

// لما ينتقل لقسم جديد
Events.on(Events.NAMES.SECTION_ENTERED, (data) => {
  if(data && data.index !== undefined){
    State.progress.setCurrentSection(data.index);
  }
});

// لما يكتشف غرفة جديدة
Events.on(Events.NAMES.ROOM_DISCOVERED, (data) => {
  if(data && data.roomId){
    State.progress.discoverRoom(data.roomId);
  }
});

// لما يهزم بوس
Events.on(Events.NAMES.BOSS_DEFEATED, (data) => {
  if(data && data.sectionIdx !== undefined){
    State.progress.defeatBoss(data.sectionIdx);
  }
});

console.log('✅ Events system loaded — ' + Object.keys(Events.NAMES).length + ' event types');
