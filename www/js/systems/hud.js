// ═══════════════════════════════════════════════════
// EMBER — نظام الواجهة (HUD)
// ═══════════════════════════════════════════════════
'use strict';

const HUD = {

  scene: null,
  _updateTimer: null,
  _lastUpdate: 0,
  UPDATE_INTERVAL: 100, // كل 100ms نحدث (لتوفير الأداء)

  // ═══ التهيئة ═══
  init(scene){
    this.scene = scene;
    this._ensureUI();
    console.log('✅ HUD system initialized');
  },

  // ═══ إنشاء عناصر HUD إن لم تكن موجودة ═══
  _ensureUI(){
    // HUD موجود في index.html، لكن نتأكد من العناصر
    const required = ['flameFill', 'goldCount', 'zoneName', 'hud'];
    required.forEach(id => {
      if(!document.getElementById(id)){
        console.warn('⚠️ HUD element missing: ' + id);
      }
    });
  },

  // ═══ التحديث الرئيسي ═══
  update(){
    // لتوفير الأداء، ما نحدث كل إطار
    const now = Date.now();
    if(now - this._lastUpdate < this.UPDATE_INTERVAL) return;
    this._lastUpdate = now;

    this._updateHealth();
    this._updateCurrencies();
    this._updateZone();
    this._updateLevel();
  },

  // ═══ الصحة ═══
  _updateHealth(){
    const fill = document.getElementById('flameFill');
    if(!fill) return;

    const hp = State.hp.get();
    const maxHp = State.hp.getMax();
    const pct = maxHp > 0 ? (hp / maxHp) * 100 : 0;

    fill.style.width = Math.max(0, Math.min(100, pct)) + '%';

    // تغيير اللون حسب الصحة
    if(pct <= 25){
      fill.style.background = 'linear-gradient(90deg, #ff0000, #ff3c14)';
      fill.style.boxShadow = '0 0 15px #ff0000';
    } else if(pct <= 50){
      fill.style.background = 'linear-gradient(90deg, #ff3c14, #ff8c3c)';
      fill.style.boxShadow = '0 0 15px #ff3c14';
    } else {
      fill.style.background = 'linear-gradient(90deg, #ff8c3c, #ff3c14)';
      fill.style.boxShadow = '0 0 10px #ff8c3c';
    }
  },

  // ═══ العملات ═══
  _updateCurrencies(){
    const c = State.currency.getAll();

    const goldEl = document.getElementById('goldCount');
    if(goldEl) goldEl.textContent = c.shards;

    // إظهار الذرات والأرواح لو موجودة
    this._ensureCurrencyDisplay('atomsCount', c.atoms, '💎');
    this._ensureCurrencyDisplay('soulsCount', c.souls, '👻');
  },

  _ensureCurrencyDisplay(id, value, icon){
    let el = document.getElementById(id);

    if(value > 0 && !el){
      // إنشاء عنصر جديد
      const goldEl = document.getElementById('goldCount');
      if(!goldEl || !goldEl.parentElement) return;

      el = document.createElement('span');
      el.id = id;
      el.style.cssText = 'margin-right:10px;font-weight:bold;color:#ffd700';
      el.textContent = icon + ' ' + value;
      goldEl.parentElement.appendChild(el);
    } else if(el){
      el.textContent = icon + ' ' + value;
    }
  },

  // ═══ اسم القسم ═══
  _updateZone(){
    const el = document.getElementById('zoneName');
    if(!el) return;

    const idx = State.data.progress.currentSection;
    const ws = WORLD_SECTIONS[idx];
    if(ws) el.textContent = ws.nameAr;
  },

  // ═══ المستوى ═══
  _updateLevel(){
    const level = State.xp.getLevel();

    let el = document.getElementById('levelCount');
    if(!el){
      const hud = document.querySelector('.hud-top');
      if(!hud) return;

      el = document.createElement('div');
      el.id = 'levelCount';
      el.style.cssText = 'background:rgba(5,2,8,0.7);padding:6px 14px;border-radius:50px;border:1.5px solid rgba(168,85,247,0.6);color:#c084fc;font-weight:bold;font-family:Cairo,sans-serif;font-size:0.9rem;display:flex;align-items:center;gap:6px';
      el.innerHTML = '<span>⭐</span><span id="levelNum">1</span>';
      hud.appendChild(el);
    }

    const numEl = document.getElementById('levelNum');
    if(numEl) numEl.textContent = level;
  },

  // ═══ إظهار HUD ═══
  show(){
    const hud = document.getElementById('hud');
    if(hud) hud.style.display = 'block';
    this.update();
  },

  // ═══ إخفاء HUD ═══
  hide(){
    const hud = document.getElementById('hud');
    if(hud) hud.style.display = 'none';
  },

  // ═══ إشعار ترقية مستوى ═══
  showLevelUp(scene){
    if(!scene) scene = this.scene;
    if(!scene) return;

    const level = State.xp.getLevel();

    // نص كبير
    const txt = scene.add.text(CFG.GW / 2, CFG.GH / 2 - 50, '⭐ LEVEL UP!', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffd700',
      stroke: '#000',
      strokeThickness: 5,
      fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(300);

    const sub = scene.add.text(CFG.GW / 2, CFG.GH / 2 - 20, 'المستوى ' + level, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff',
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5).setScrollFactor(0).setDepth(300);

    // حركة
    scene.tweens.add({
      targets: [txt, sub],
      y: '-=40',
      alpha: 0,
      duration: 2500,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        txt.destroy();
        sub.destroy();
      }
    });

    // تأثير بصري
    scene.cameras.main.flash(400, 255, 215, 0);

    // صوت
    Audio.playAbility();

    // شفاء كامل
    State.hp.set(State.hp.getMax());

    Events.emit(Events.NAMES.PLAYER_LEVELUP, { level: level });
  },

  // ═══ إشعار عملة ═══
  showCoinPopup(scene, x, y, amount){
    if(!scene) return;

    const txt = scene.add.text(x, y - 20, '+' + amount, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#fbbf24',
      stroke: '#000',
      strokeThickness: 3,
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(250);

    scene.tweens.add({
      targets: txt,
      y: y - 60,
      alpha: 0,
      duration: 900,
      ease: 'Cubic.easeOut',
      onComplete: () => txt.destroy()
    });
  },

  // ═══ إشعار قدرة جديدة ═══
  showAbilityUnlock(scene, abilityKey){
    if(!scene) return;

    const abData = CFG.ABILITIES[abilityKey];
    if(!abData) return;

    // نص كبير
    const txt = scene.add.text(CFG.GW / 2, CFG.GH / 2 - 30, abData.icon + ' ' + abData.nameAr, {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#ffd700',
      stroke: '#000',
      strokeThickness: 5,
      fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(300);

    const sub = scene.add.text(CFG.GW / 2, CFG.GH / 2, abData.desc, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff',
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5).setScrollFactor(0).setDepth(300);

    scene.tweens.add({
      targets: [txt, sub],
      alpha: 0,
      y: '-=30',
      duration: 3000,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        txt.destroy();
        sub.destroy();
      }
    });

    scene.cameras.main.flash(500, 255, 215, 0);
    Audio.playAbility();
  },

  // ═══ إشعار رسالة ═══
  showMessage(scene, text, options){
    options = options || {};
    if(!scene) scene = this.scene;
    if(!scene) return;

    const color = options.color || '#ffffff';
    const duration = options.duration || 2000;
    const y = options.y || CFG.GH / 2;

    const txt = scene.add.text(CFG.GW / 2, y, text, {
      fontFamily: 'Arial',
      fontSize: options.size || '18px',
      color: color,
      stroke: '#000',
      strokeThickness: 4,
      fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(280);

    if(options.fadeIn !== false){
      txt.setAlpha(0);
      scene.tweens.add({
        targets: txt,
        alpha: 1,
        duration: 300
      });
    }

    scene.time.delayedCall(duration, () => {
      scene.tweens.add({
        targets: txt,
        alpha: 0,
        duration: 400,
        onComplete: () => txt.destroy()
      });
    });
  },

  // ═══ إشعار جمع ذرة نادرة ═══
  showRareDrop(scene, x, y, type){
    if(!scene) return;

    let text = '';
    let color = '#ffffff';

    if(type === 'atoms'){
      text = '💎 ذرة نادرة!';
      color = '#a855f7';
    } else if(type === 'souls'){
      text = '👻 روح!';
      color = '#22d3ee';
    }

    const txt = scene.add.text(x, y - 30, text, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: color,
      stroke: '#000',
      strokeThickness: 4,
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(300);

    scene.tweens.add({
      targets: txt,
      y: y - 80,
      alpha: 0,
      scale: 1.5,
      duration: 1500,
      ease: 'Cubic.easeOut',
      onComplete: () => txt.destroy()
    });

    scene.cameras.main.flash(200, 168, 85, 247);
    Audio.playAbility();
  },

  // ═══ عرض تلميح (Hint) ═══
  showHint(scene, text, duration){
    if(!scene) return;

    let el = document.getElementById('hintBox');
    if(!el){
      el = document.createElement('div');
      el.id = 'hintBox';
      el.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:rgba(5,2,8,0.9);color:#ffd700;padding:12px 24px;border-radius:50px;border:2px solid #ff8c3c;font-family:Cairo,sans-serif;font-size:0.95rem;z-index:400;pointer-events:none;box-shadow:0 0 20px rgba(255,140,60,0.5);text-align:center;max-width:80%';
      document.body.appendChild(el);
    }

    el.textContent = text;
    el.style.display = 'block';
    el.style.opacity = '1';

    if(this._hintTimer) clearTimeout(this._hintTimer);
    this._hintTimer = setTimeout(() => {
      el.style.transition = 'opacity 0.5s';
      el.style.opacity = '0';
      setTimeout(() => { el.style.display = 'none'; el.style.transition = ''; }, 500);
    }, duration || 3000);
  },

  // ═══ إعادة تعيين ═══
  reset(){
    this._lastUpdate = 0;
    if(this._hintTimer){
      clearTimeout(this._hintTimer);
      this._hintTimer = null;
    }
  }
};

console.log('✅ HUD system loaded');
