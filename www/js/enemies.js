// ═══════════════════════════════════════
// الأعداء
// ═══════════════════════════════════════
const Enemies = {
  group: null,

  // ═══ أنواع الأعداء ═══
  types: {
    slime: {
      nameAr: 'سلايم',
      hp: 30, damage: 8, speed: 25,
      scale: 0.8, xp: 5, gold: 1
    },
    boar: {
      nameAr: 'خنزير بري',
      hp: 50, damage: 12, speed: 45,
      scale: 1.0, xp: 10, gold: 2
    }
  },

  // ═══ تحميل الصور ═══
  preload(scene){
    scene.load.image("slime", "assets/enemies/slime.png");
    scene.load.image("boar-idle", "assets/enemies/boar-idle.png");
    for(let i=0;i<4;i++) scene.load.image("boar-run-" + i, "assets/enemies/boar-run-" + i + ".png");
  },

  // ═══ إنشاء الأنيميشن ═══
  createAnimations(scene){
    const A = scene.anims;
    if(A.exists("boar-walk")) return;
    A.create({ key:"boar-walk", frames:[0,1,2,3].map(i=>({key:"boar-run-" + i})), frameRate:10, repeat:-1 });
  },

  // ═══ تحميل صور الخنزير بفريمات ═══
  preloadBoarFrames(scene){
    for(let i=0;i<4;i++){
      scene.load.image("boar-run-" + i, "assets/enemies/boar-run-" + i + ".png");
    }
  },

  // ═══ إنشاء المجموعة ═══
  create(scene){
    this.group = scene.physics.add.group();
  },

  // ═══ إنشاء عدو ═══
  spawn(scene, x, y, typeKey, worldIdx){
    const t = this.types[typeKey];
    if(!t) return null;

    const spriteKey = typeKey === 'boar' ? 'boar-idle' : typeKey;
    const e = this.group.create(x, y, spriteKey);
    if(typeKey === "boar" && scene.anims.exists("boar-walk")) e.play("boar-walk");
    e.setDepth(20);
    e.setScale(t.scale);
    e.body.setSize(14, 14).setOffset(1, 1);
    e.body.setCollideWorldBounds(false);

    // خصائص
    e.hp = t.hp + (worldIdx * 10);
    e.maxHp = e.hp;
    e.damage = t.damage + worldIdx;
    e.speed = t.speed;
    e.xp = t.xp;
    e.gold = t.gold;
    e.enemyKey = typeKey;
    e.body.setVelocityX(Math.random() < 0.5 ? -e.speed : e.speed);

    return e;
  },

  // ═══ تحديث الأعداء ═══
  update(scene, player){
    if(!this.group) return;
    this.group.getChildren().forEach(e => {
      if(!e.active || !e.body.enable) return;
      if(e.y > CFG.GH + 100){ e.destroy(); return; }

      // تتبع اللاعب إذا قريب
      const dist = player.sprite.x - e.x;
      if(Math.abs(dist) < 200){
        if(dist > 0) e.body.setVelocityX(Math.abs(e.speed) * 1.3);
        else e.body.setVelocityX(-Math.abs(e.speed) * 1.3);
      }

      // اتجاه
      e.setFlipX(e.body.velocity.x < 0);

      // ضرر
      if(Phaser.Geom.Intersects.RectangleToRectangle(player.sprite.getBounds(), e.getBounds())){
        if(player.hurt(scene, e.damage)){
          player.sprite.body.setVelocityX(-player.facing * 120);
          player.sprite.body.setVelocityY(-100);
        }
      }
    });
  },

  // ═══ إصابة عدو ═══
  damage(scene, e, dmg, fromPlayer){
    if(!e.active || !e.body.enable) return;
    e.hp -= dmg;
    e.setTint(0xffffff);
    scene.time.delayedCall(80, ()=>{ if(e.active) e.clearTint(); });

    if(fromPlayer && Player.sprite){
      e.body.setVelocityX(Player.facing * 200);
    }

    scene.cameras.main.shake(100, 0.005);

    if(e.hp <= 0){
      this.kill(scene, e);
    }
  },

  // ═══ قتل عدو ═══
  kill(scene, e){
    if(!e.active) return;

    // إحصائيات
    State.data.kills = (State.data.kills || 0) + 1;
    State.data.gold += e.gold || 0;

    // XP
    const levelUp = State.addXP(e.xp || 5);
    if(levelUp && HUD){
      HUD.showLevelUp(scene);
    }

    State.save();

    // تأثير
    if(scene.sound) scene.sound.play('sfx-kill', {volume: 0.5});
    scene.cameras.main.shake(150, 0.01);

    // إزالة
    e.body.enable = false;
    scene.tweens.add({
      targets: e,
      alpha: 0,
      scale: 0,
      duration: 300,
      onComplete: ()=> e.destroy()
    });
  }
};
