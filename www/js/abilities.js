// ═══════════════════════════════════════
// القدرات (تفتح بعد هزيمة البوسات)
// ═══════════════════════════════════════
const Abilities = {
  // ═══ قائمة القدرات ═══
  list: {
    doubleJump:   { nameAr:'القفز المزدوج',  icon:'⬆️⬆️', desc:'اقفز مرة ثانية في الهواء' },
    dash:         { nameAr:'الانطلاق',        icon:'💨',   desc:'اندفع بسرعة في اتجاه النظر' },
    wallJump:     { nameAr:'التسلق',          icon:'🧗',   desc:'اقفز من الجدران' },
    chargedAttack:{ nameAr:'الهجوم المشحون',  icon:'⚡',   desc:'هجوم قوي بعد شحن' },
    glide:        { nameAr:'الطيران',         icon:'🦅',   desc:'انزلق في الهواء' }
  },

  // ═══ فتح قدرة ═══
  unlock(scene, key){
    if(State.data.abilities[key]) return;
    State.data.abilities[key] = true;
    State.save();

    const ab = this.list[key];
    if(!ab) return;

    // تأثير بصري
    this._showUnlockNotification(scene, ab);
  },

  // ═══ إشعار الفتح ═══
  _showUnlockNotification(scene, ab){
    const cam = scene.cameras.main;
    const x = cam.scrollX + cam.width/2;
    const y = cam.scrollY + cam.height/2;

    // نص
    const txt = scene.add.text(x, y, ab.icon + ' ' + ab.nameAr + '!', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffd700',
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(100).setScrollFactor(0);
    txt.setPosition(CFG.GW/2, CFG.GH/2);

    // وصف
    const desc = scene.add.text(CFG.GW/2, CFG.GH/2 + 30, ab.desc, {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ffffff',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(100).setScrollFactor(0);

    // حركة
    scene.tweens.add({
      targets: [txt, desc],
      y: '-=20',
      alpha: 0,
      duration: 2500,
      ease: 'Cubic.easeOut',
      onComplete: ()=>{ txt.destroy(); desc.destroy(); }
    });
  },

  // ═══ عرض القدرات في القائمة ═══
  getAll(){
    return Object.keys(this.list).map(key => ({
      key: key,
      ...this.list[key],
      unlocked: State.data.abilities[key] || false
    }));
  }
};
