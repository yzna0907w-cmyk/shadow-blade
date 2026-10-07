// ═══════════════════════════════════════
// واجهة اللاعب (صحة، عملات، مستوى)
// ═══════════════════════════════════════
const HUD = {
  
  // ═══ تحديث الشريط العلوي ═══
  update(){
    if(!State.data) return;
    
    // الصحة
    const fill = document.getElementById('flameFill');
    if(fill){
      const pct = Math.max(0, State.data.hp / State.data.maxHp * 100);
      fill.style.width = pct + '%';
    }
    
    // العملات
    const goldEl = document.getElementById('goldCount');
    if(goldEl) goldEl.textContent = State.data.gold;
    
    // اسم العالم
    const z = document.getElementById('zoneName');
    if(z && WORLDS[State.data.worldIdx]){
      z.textContent = WORLDS[State.data.worldIdx].nameAr;
    }
    
    // المستوى
    const lvlEl = document.getElementById('levelCount');
    if(lvlEl) lvlEl.textContent = State.data.level;
    
    // XP
    const xpFill = document.getElementById('xpFill');
    if(xpFill){
      const xpNeed = State.data.level * 100;
      const pct = Math.min(100, State.data.xp / xpNeed * 100);
      xpFill.style.width = pct + '%';
    }
  },
  
  // ═══ إظهار الواجهة ═══
  show(){
    const hud = document.getElementById('hud');
    const ctrl = document.getElementById('controls');
    if(hud) hud.style.display = 'block';
    if(ctrl) ctrl.style.display = 'block';
    this.update();
  },
  
  // ═══ إخفاء الواجهة ═══
  hide(){
    const hud = document.getElementById('hud');
    const ctrl = document.getElementById('controls');
    if(hud) hud.style.display = 'none';
    if(ctrl) ctrl.style.display = 'none';
  },
  
  // ═══ إشعار ترقية المستوى ═══
  showLevelUp(scene){
    const txt = scene.add.text(CFG.GW/2, CFG.GH/2 - 40, '⬆️ مستوى جديد!', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffd700',
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
    
    const sub = scene.add.text(CFG.GW/2, CFG.GH/2 - 15, 'الصحة زادت!', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ffffff',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
    
    scene.tweens.add({
      targets: [txt, sub],
      y: '-=30',
      alpha: 0,
      duration: 2000,
      ease: 'Cubic.easeOut',
      onComplete: ()=>{ txt.destroy(); sub.destroy(); }
    });
    
    if(scene.sound) scene.sound.play('sfx-kill', {volume: 0.6});
  },
  
  // ═══ إشعار جمع عملة ═══
  showCoinPopup(scene, x, y, amount){
    const txt = scene.add.text(x, y, '+' + amount, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#fbbf24',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(100);
    
    scene.tweens.add({
      targets: txt,
      y: y - 40,
      alpha: 0,
      duration: 800,
      onComplete: ()=> txt.destroy()
    });
  },
  
  // ═══ إشعار الضرر ═══
  showDamageFlash(scene){
    scene.cameras.main.flash(200, 255, 0, 0);
  }
};
