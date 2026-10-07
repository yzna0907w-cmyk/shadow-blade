// ═══════════════════════════════════════
// البوسات (5 زعماء)
// ═══════════════════════════════════════
const Bosses = {
  current: null,
  active: false,
  
  // ═══ إعدادات البوسات ═══
  types: {
    robot: {
      nameAr: 'حارس الأرواح',
      hp: 400, damage: 15, speed: 50,
      scale: 1.8, xp: 100, gold: 50,
      unlock: null
    },
    centipede: {
      nameAr: 'أم أربعة وأربعين',
      hp: 600, damage: 18, speed: 60,
      scale: 1.6, xp: 150, gold: 75,
      unlock: 'doubleJump'
    },
    turtle: {
      nameAr: 'السلحفاة القتالية',
      hp: 800, damage: 20, speed: 40,
      scale: 1.7, xp: 200, gold: 100,
      unlock: 'dash'
    },
    boar: {
      nameAr: 'الخنزير البري',
      hp: 1000, damage: 22, speed: 80,
      scale: 1.5, xp: 250, gold: 150,
      unlock: 'wallJump'
    },
    tank: {
      nameAr: 'دبابة الحرب',
      hp: 1500, damage: 25, speed: 35,
      scale: 2.0, xp: 400, gold: 250,
      unlock: 'glide'
    }
  },
  
  // ═══ تحميل الصور ═══
  preload(scene){
    // نشيل صورة placeholder لكل بوس (نستخدم صور الأعداء مؤقتاً)
    scene.load.image('boss-robot', 'assets/bosses/factory/boss-1-idle.png');
    scene.load.image('boss-centipede', 'assets/bosses/swamp/centipede-idle.png');
    scene.load.image('boss-turtle', 'assets/bosses/swamp/turtle-idle.png');
    scene.load.image('boss-boar', 'assets/enemies/boar-idle.png');
    scene.load.image('boss-tank', 'assets/bosses/factory/boss-2-idle.png');
  },
  
  // ═══ إنشاء بوس ═══
  spawn(scene, typeKey, worldIdx, nameAr){
    const t = this.types[typeKey];
    if(!t) return null;
    
    const playerX = Player.sprite ? Player.sprite.x : 400;
    const bx = playerX + 200;
    const by = CFG.GH - 200;
    
    const key = 'boss-' + typeKey;
    const spriteKey = scene.textures.exists(key) ? key : 'slime';
    
    this.current = scene.physics.add.sprite(bx, by, spriteKey);
    this.current.setDepth(12);
    this.current.setScale(t.scale);
    this.current.body.setSize(20, 30).setOffset(6, 6);
    this.current.body.setCollideWorldBounds(true);
    
    // خصائص
    this.current.hp = t.hp + (worldIdx * 100);
    this.current.maxHp = this.current.hp;
    this.current.damage = t.damage;
    this.current.speed = t.speed;
    this.current.xp = t.xp;
    this.current.gold = t.gold;
    this.current.typeKey = typeKey;
    this.current.unlockAbility = t.unlock;
    this.current._defeated = false;
    
    scene.physics.add.collider(this.current, scene.platforms);
    
    this.active = true;
    this.showBossUI(nameAr || t.nameAr, this.current.hp, this.current.maxHp);
    
    scene.cameras.main.shake(800, 0.02);
    if(scene.sound) scene.sound.play('sfx-kill', {volume: 0.3});
    
    return this.current;
  },
  
  // ═══ تحديث البوس ═══
  update(scene){
    if(!this.current || !this.current.active || this.current._defeated) return;
    
    const b = this.current;
    const p = Player.sprite;
    if(!p) return;
    
    // حركة نحو اللاعب
    const dist = p.x - b.x;
    if(Math.abs(dist) < 400){
      if(dist > 50) b.body.setVelocityX(b.speed);
      else if(dist < -50) b.body.setVelocityX(-b.speed);
      else b.body.setVelocityX(0);
      b.setFlipX(b.body.velocity.x < 0);
    }
    
    // ضرر اللاعب
    if(Phaser.Geom.Intersects.RectangleToRectangle(p.getBounds(), b.getBounds())){
      if(Player.hurt(scene, b.damage)){
        p.body.setVelocityX(-Player.facing * 200);
        p.body.setVelocityY(-150);
      }
    }
  },
  
  // ═══ إصابة البوس ═══
  damage(scene, dmg){
    if(!this.current || !this.current.active || this.current._defeated) return;
    
    const b = this.current;
    b.hp -= dmg;
    b.setTint(0xffffff);
    scene.time.delayedCall(80, ()=>{ if(b.active) b.clearTint(); });
    
    this.updateBossUI(b.hp, b.maxHp);
    
    if(b.hp <= 0){
      this.kill(scene);
    }
  },
  
  // ═══ قتل البوس ═══
  kill(scene){
    const b = this.current;
    if(!b) return;
    
    b._defeated = true;
    this.active = false;
    
    // إحصائيات
    State.data.gold += b.gold;
    State.data.bossesDefeated[State.data.worldIdx] = true;
    State.addXP(b.xp);
    State.save();
    
    // تأثيرات
    scene.cameras.main.shake(800, 0.02);
    if(scene.sound) scene.sound.play('sfx-kill', {volume: 0.8});
    
    // فتح قدرة جديدة
    if(b.unlockAbility){
      scene.time.delayedCall(1000, ()=>{
        Abilities.unlock(scene, b.unlockAbility);
      });
    }
    
    // إزالة
    scene.tweens.add({
      targets: b,
      alpha: 0, scale: 0,
      duration: 1500,
      onComplete: ()=>{
        if(b) b.destroy();
        this.current = null;
        this.hideBossUI();
        
        // فتح العالم التالي
        scene.time.delayedCall(2000, ()=>{
          if(Game) Game.nextWorld();
        });
      }
    });
  },
  
  // ═══ واجهة البوس ═══
  showBossUI(name, hp, maxHp){
    let wrap = document.getElementById('bossBar');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.id = 'bossBar';
      wrap.style.cssText = 'position:fixed;bottom:110px;left:50%;transform:translateX(-50%);width:60%;max-width:400px;z-index:120;pointer-events:none;background:rgba(5,2,8,0.9);padding:8px 12px;border-radius:12px;border:2px solid rgba(255,140,60,0.6);backdrop-filter:blur(6px);';
      wrap.innerHTML = '<div id="bossName" style="text-align:center;font-family:Cairo,sans-serif;font-size:0.85rem;color:#ffb87a;letter-spacing:3px;margin-bottom:6px">BOSS</div><div style="width:100%;height:10px;background:rgba(0,0,0,0.9);border-radius:50px;overflow:hidden;border:1px solid rgba(255,140,60,0.4)"><div id="bossFill" style="width:100%;height:100%;background:linear-gradient(90deg,#ff8c3c,#ff3c14,#c084fc);border-radius:50px;transition:width 0.2s"></div></div>';
      document.body.appendChild(wrap);
    }
    wrap.style.display = 'block';
    const nm = document.getElementById('bossName');
    if(nm) nm.textContent = name;
    const bf = document.getElementById('bossFill');
    if(bf) bf.style.width = '100%';
  },
  
  updateBossUI(hp, maxHp){
    const bf = document.getElementById('bossFill');
    if(bf) bf.style.width = Math.max(0, hp/maxHp*100) + '%';
  },
  
  hideBossUI(){
    const wrap = document.getElementById('bossBar');
    if(wrap) wrap.style.display = 'none';
  }
};
