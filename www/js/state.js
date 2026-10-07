// ═══════════════════════════════════════
// حفظ وتحميل تقدم اللعبة
// ═══════════════════════════════════════
const State = {
  KEY: 'ember_save_v3',
  data: null,

  init(){
    try {
      const saved = JSON.parse(localStorage.getItem(this.KEY) || '{}');
      this.data = {
        hp: saved.hp || CFG.BASE_HP,
        maxHp: saved.maxHp || CFG.BASE_HP,
        gold: saved.gold || 0,
        xp: saved.xp || 0,
        level: saved.level || 1,
        worldIdx: saved.worldIdx || 0,
        // القدرات (تفتح بعد البوسات)
        abilities: saved.abilities || {
          doubleJump: false,
          dash: false,
          wallJump: false,
          chargedAttack: false,
          glide: false
        },
        bossesDefeated: saved.bossesDefeated || [false,false,false,false,false],
        kills: saved.kills || 0
      };
    } catch(e) {
      this.data = this.defaults();
    }
  },

  defaults(){
    return {
      hp: CFG.BASE_HP, maxHp: CFG.BASE_HP,
      gold: 0, xp: 0, level: 1, worldIdx: 0,
      abilities: { doubleJump:false, dash:false, wallJump:false, chargedAttack:false, glide:false },
      bossesDefeated: [false,false,false,false,false],
      kills: 0
    };
  },

  save(){
    try { localStorage.setItem(this.KEY, JSON.stringify(this.data)); } catch(e){}
  },

  reset(){
    try { localStorage.removeItem(this.KEY); } catch(e){}
    this.data = this.defaults();
  },

  addXP(amount){
    this.data.xp += amount;
    const xpNeeded = this.data.level * 100;
    if(this.data.xp >= xpNeeded){
      this.data.xp -= xpNeeded;
      this.data.level++;
      this.data.maxHp += 20;
      this.data.hp = this.data.maxHp;
      return true; // level up!
    }
    return false;
  },

  unlockAbility(name){
    this.data.abilities[name] = true;
    this.save();
  }
};

State.init();
