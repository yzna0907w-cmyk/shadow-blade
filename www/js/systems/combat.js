// ═══════════════════════════════════════════════════
// EMBER — "صدى"
// نظام القتال — الجزء 1/2
// ═══════════════════════════════════════════════════
'use strict';

const Combat = {

  // ═══════════════════════════════════════════════
  // 1. الحالة
  // ═══════════════════════════════════════════════
  scene: null,
  activeAttack: null,
  hitStopTimer: 0,
  slowMotionTimer: 0,
  comboCounter: 0,
  comboTimer: 0,

  // ═══════════════════════════════════════════════
  // 2. تهيئة
  // ═══════════════════════════════════════════════
  init(scene){
    this.scene = scene;
    this._bindEvents();
    console.log('✅ Combat initialized');
  },

  _bindEvents(){
    // عند هجوم البطل
    Events.on(Events.NAMES.PLAYER_ATTACK, (data) => {
      this._onPlayerAttack(data);
    });

    // عند موت عدو
    Events.on(Events.NAMES.ENEMY_DIED, (data) => {
      this._onEnemyDied(data);
    });

    // عند إصابة البوس
    Events.on(Events.NAMES.BOSS_HURT, (data) => {
      this._onBossHurt(data);
    });
  },

  // ═══════════════════════════════════════════════
  // 3. تحديث (يُستدعى كل إطار)
  // ═══════════════════════════════════════════════
  update(time, delta){
    if(this.hitStopTimer > 0){
      this.hitStopTimer -= delta;
      if(this.hitStopTimer <= 0){
        this._resumePhysics();
      }
    }
  },

  // ═══════════════════════════════════════════════
  // 4. حساب الضرر الكامل
  // ═══════════════════════════════════════════════
  calculateDamage(baseDamage, options = {}){
    let damage = baseDamage;

    // ═══ مكافأة القوة ═══
    if(options.strengthBonus){
      damage += options.strengthBonus;
    }

    // ═══ مضاعف السلاح ═══
    if(options.weaponMultiplier){
      damage *= options.weaponMultiplier;
    }

    // ═══ مضاعف المستوى ═══
    const level = State.xp.getLevel();
    damage *= (1 + (level - 1) * 0.05);

    // ═══ خصم الدروع ═══
    if(options.targetArmor){
      damage -= options.targetArmor;
    }

    // ═══ مقاومة ═══
    if(options.resistance){
      damage *= (1 - options.resistance);
    }

    // ═══ منع السلبية ═══
    damage = Math.max(1, Math.floor(damage));

    return damage;
  },

  // ═══════════════════════════════════════════════
  // 5. تنفيذ ضربة
  // ═══════════════════════════════════════════════
  executeAttack(attacker, targets, options = {}){
    if(!attacker || !targets) return [];

    const results = [];
    const baseDamage = options.damage || 0;

    targets.forEach(target => {
      if(!target || !target.active) return;

      const damage = this.calculateDamage(baseDamage, {
        weaponMultiplier: options.weaponMultiplier,
        targetArmor: target.armorValue || 0,
        resistance: target.resistance || 0
      });

      const result = this.applyDamage(target, damage, attacker, options);
      results.push(result);
    });

    return results;
  },

  // ═══════════════════════════════════════════════
  // 6. تطبيق الضرر
  // ═══════════════════════════════════════════════
  applyDamage(target, damage, attacker, options = {}){
    if(!target || !target.active) return null;

    // ═══ حفظ HP قبل ═══
    const beforeHp = target.hp || 0;

    // ═══ تطبيق الضرر ═══
    if(target.hp !== undefined){
      target.hp -= damage;
    }

    // ═══ تأثيرات ═══
    this._applyHitEffects(target, damage, options);

    // ═══ تسجيل الإحصائيات ═══
    State.stats.addDamage(damage);

    // ═══ النتيجة ═══
    const result = {
      target: target,
      damage: damage,
      beforeHp: beforeHp,
      afterHp: target.hp,
      killed: target.hp !== undefined && target.hp <= 0,
      critical: options.critical || false
    };

    return result;
  },

  // ═══════════════════════════════════════════════
  // 7. تأثيرات الإصابة
  // ═══════════════════════════════════════════════
  _applyHitEffects(target, damage, options = {}){
    if(!this.scene) return;

    // ═══ وميض أبيض ═══
    if(target.setTint){
      target.setTint(0xffffff);
      this.scene.time.delayedCall(80, () => {
        if(target && target.active) target.clearTint();
      });
    }

    // ═══ اهتزاز الكاميرا ═══
    const shakeIntensity = Math.min(0.01, damage / 5000);
    this.scene.cameras.main.shake(100, shakeIntensity);

    // ═══ ارتداد ═══
    if(options.knockback && target.body){
      const dir = attacker && attacker.x > target.x ? -1 : 1;
      const knockbackX = dir * options.knockback;
      target.body.setVelocityX(knockbackX);
    }

    // ═══ جسيمات ═══
    this._spawnHitParticles(target.x, target.y, options.hitColor || 0xff8c3c, 8);

    // ═══ hit stop (تجميد لحظي) ═══
    if(options.hitStop){
      this.hitStopTimer = options.hitStop;
      this._pausePhysics();
    }
  },

  // ═══════════════════════════════════════════════
  // 8. تجميد الفيزياء (Hit Stop)
  // ═══════════════════════════════════════════════
  _pausePhysics(){
    if(!this.scene || !this.scene.physics) return;
    if(this.scene.physics.world.isPaused) return;
    this.scene.physics.world.pause();
  },

  _resumePhysics(){
    if(!this.scene || !this.scene.physics) return;
    if(!this.scene.physics.world.isPaused) return;
    this.scene.physics.world.resume();
  },

  // ═══════════════════════════════════════════════
  // 9. عند هجوم البطل
  // ═══════════════════════════════════════════════
  _onPlayerAttack(data){
    // زيادة العداد
    this.comboCounter++;
    this.comboTimer = 1500;

    // لو وصل 5، مكافأة
    if(this.comboCounter >= 5){
      this._triggerComboFinisher();
      this.comboCounter = 0;
    }

    // تأثير ضوئي
    if(this.scene){
      this.scene.cameras.main.shake(80, 0.005);
    }
  },

  _triggerComboFinisher(){
    if(!this.scene || !Player.sprite) return;

    // تأثير كبير
    this.scene.cameras.main.shake(400, 0.025);
    this.scene.cameras.main.flash(200, 255, 200, 50);

    // جسيمات
    for(let i = 0; i < 30; i++){
      const angle = (i / 30) * Math.PI * 2;
      const p = this.scene.add.circle(Player.sprite.x, Player.sprite.y, 6, 0xffd700);
      p.setDepth(150);
      this.scene.tweens.add({
        targets: p,
        x: p.x + Math.cos(angle) * 200,
        y: p.y + Math.sin(angle) * 200,
        alpha: 0,
        scale: 0,
        duration: 700,
        onComplete: () => p.destroy()
      });
    }

    Events.emit('combat:combo_finisher', { count: this.comboCounter });
  },

  // ═══════════════════════════════════════════════
  // 10. عند موت عدو
  // ═══════════════════════════════════════════════
  _onEnemyDied(data){
    if(!this.scene) return;

    // اهتزاز
    this.scene.cameras.main.shake(200, 0.01);

    // جسيمات
    if(data && data.x !== undefined && data.y !== undefined){
      this._spawnDeathParticles(data.x, data.y, 0xfbbf24, 15);
    }
  },

  _onBossHurt(data){
    // نفس التأثيرات
  },

  // ═══════════════════════════════════════════════
  // 11. جسيمات
  // ═══════════════════════════════════════════════
  _spawnHitParticles(x, y, color, count){
    if(!this.scene) return;
    for(let i = 0; i < count; i++){
      const p = this.scene.add.rectangle(x, y, 3, 3, color);
      p.setDepth(150);
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 30;
      this.scene.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0,
        duration: 400 + Math.random() * 200,
        onComplete: () => p.destroy()
      });
    }
  },

  _spawnDeathParticles(x, y, color, count){
    if(!this.scene) return;
    for(let i = 0; i < count; i++){
      const p = this.scene.add.rectangle(x, y, 4, 4, color);
      p.setDepth(150);
      const angle = Math.random() * Math.PI * 2;
      const dist = 40 + Math.random() * 60;
      this.scene.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0,
        duration: 600,
        onComplete: () => p.destroy()
      });
    }
  },

  // ═══════════════════════════════════════════════
  // 12. صحة البطل
  // ═══════════════════════════════════════════════
  damagePlayer(amount, sourceX = null){
    if(!Player.sprite) return false;
    return Player.takeDamage(amount, sourceX);
  },

  // ═══════════════════════════════════════════════
  // 13. الكشف عن الأعداء في نطاق
  // ═══════════════════════════════════════════════
  getEnemiesInRange(x, y, range, exclude = []){
    const result = [];

    if(typeof Enemies !== 'undefined' && Enemies.group){
      Enemies.group.getChildren().forEach(e => {
        if(!e.active || !e.body.enable) return;
        if(exclude.includes(e)) return;

        const dist = Phaser.Math.Distance.Between(x, y, e.x, e.y);
        if(dist <= range){
          result.push(e);
        }
      });
    }

    return result;
  },

  // ═══════════════════════════════════════════════
  // 14. الكشف عن الضربة (Rectangle)
  // ═══════════════════════════════════════════════
  getEnemiesInRect(rect, exclude = []){
    const result = [];

    if(typeof Enemies !== 'undefined' && Enemies.group){
      Enemies.group.getChildren().forEach(e => {
        if(!e.active || !e.body.enable) return;
        if(exclude.includes(e)) return;

        if(Phaser.Geom.Intersects.RectangleToRectangle(rect, e.getBounds())){
          result.push(e);
        }
      });
    }

    return result;
  },

  // ═══════════════════════════════════════════════
  // 15. الكشف عن الدائرة
  // ═══════════════════════════════════════════════
  getEnemiesInCircle(circle, exclude = []){
    const result = [];

    if(typeof Enemies !== 'undefined' && Enemies.group){
      Enemies.group.getChildren().forEach(e => {
        if(!e.active || !e.body.enable) return;
        if(exclude.includes(e)) return;

        const dist = Phaser.Math.Distance.Between(circle.x, circle.y, e.x, e.y);
        if(dist <= circle.radius){
          result.push(e);
        }
      });
    }

    return result;
  },

  // ═══════════════════════════════════════════════
  // 16. أثر السلاح (Weapon Trail)
  // ═══════════════════════════════════════════════
  spawnWeaponTrail(x1, y1, x2, y2, color = 0xffcc66){
    if(!this.scene) return null;

    const trail = this.scene.add.graphics();
    trail.lineStyle(3, color, 0.8);
    trail.beginPath();
    trail.moveTo(x1, y1);
    trail.lineTo(x2, y2);
    trail.strokePath();
    trail.setDepth(150);

    this.scene.tweens.add({
      targets: trail,
      alpha: 0,
      duration: 200,
      onComplete: () => trail.destroy()
    });

    return trail;
  },

  // ═══════════════════════════════════════════════
  // 17. تقييم شدة الضربة
  // ═══════════════════════════════════════════════
  evaluateHitStrength(damage, targetMaxHp){
    if(!targetMaxHp) return 'light';

    const percent = damage / targetMaxHp;

    if(percent >= 0.3) return 'critical';
    if(percent >= 0.15) return 'heavy';
    if(percent >= 0.05) return 'normal';
    return 'light';
  },

  // ═══════════════════════════════════════════════
  // 18. إعادة تعيين
  // ═══════════════════════════════════════════════
  reset(){
    this.hitStopTimer = 0;
    this.slowMotionTimer = 0;
    this.comboCounter = 0;
    this.comboTimer = 0;
    this._resumePhysics();
  }
};

console.log('✅ Combat system loaded (1/2)');

// ═══════════════════════════════════════════════════
//              الجزء 2/2 — القتال المتقدم
// ═══════════════════════════════════════════════════

// ═══ ضربة قوية مع ارتداد ═══
Combat.heavyStrike = function(attacker, target, damage, options = {}){
  if(!attacker || !target) return null;

  const result = this.applyDamage(target, damage, attacker, {
    ...options,
    knockback: 350,
    hitStop: 80,
    hitColor: 0xffd700
  });

  if(result && result.killed){
    this._triggerKillEffect(target, options.color || 0xff8c3c);
  }

  return result;
};

// ═══ ضربة سريعة (بدون ارتداد) ═══
Combat.lightStrike = function(attacker, target, damage, options = {}){
  if(!attacker || !target) return null;

  return this.applyDamage(target, damage, attacker, {
    ...options,
    knockback: 80,
    hitStop: 40,
    hitColor: 0xffffff
  });
};

// ═══ ضربة منطقة (AOE) ═══
Combat.areaStrike = function(attacker, x, y, radius, damage, options = {}){
  if(!this.scene) return [];

  const targets = this.getEnemiesInRange(x, y, radius);
  const results = [];

  targets.forEach(target => {
    const result = this.applyDamage(target, damage, attacker, {
      ...options,
      knockback: 200,
      hitStop: 60,
      hitColor: 0xffa500
    });
    if(result) results.push(result);
  });

  // تأثير بصري
  this._spawnAreaEffect(x, y, radius, options.color || 0xffa500);

  return results;
};

// ═══ تأثير الانفجار ═══
Combat._spawnAreaEffect = function(x, y, radius, color){
  if(!this.scene) return;

  const circle = this.scene.add.circle(x, y, radius, color, 0.3);
  circle.setDepth(150);

  this.scene.tweens.add({
    targets: circle,
    alpha: 0,
    scale: 1.5,
    duration: 400,
    onComplete: () => circle.destroy()
  });

  // جسيمات
  for(let i = 0; i < 20; i++){
    const angle = (i / 20) * Math.PI * 2;
    const p = this.scene.add.circle(x, y, 5, color);
    p.setDepth(150);
    this.scene.tweens.add({
      targets: p,
      x: x + Math.cos(angle) * radius,
      y: y + Math.sin(angle) * radius,
      alpha: 0,
      scale: 0,
      duration: 500,
      onComplete: () => p.destroy()
    });
  }
};

// ═══ تأثير القتل ═══
Combat._triggerKillEffect = function(target, color){
  if(!this.scene || !target) return;

  // انفجار جسيمات
  this._spawnDeathParticles(target.x, target.y, color, 20);

  // اهتزاز الكاميرا
  this.scene.cameras.main.shake(200, 0.015);
};

// ═══ نظام الكومبو ═══
Combat.registerHit = function(){
  this.comboCounter++;
  this.comboTimer = 2000; // 2 ثواني

  // إطلاق حدث
  Events.emit('combat:hit', { combo: this.comboCounter });

  // مكافأة عند 10 ضربات
  if(this.comboCounter === 10){
    this._triggerComboReward();
  }
};

Combat._triggerComboReward = function(){
  if(!this.scene || !Player.sprite) return;

  // استعادة صحة
  State.hp.heal(10);
  HUD.update();

  // تأثير
  this.scene.cameras.main.flash(300, 255, 215, 0);

  Events.emit('combat:combo_reward', { type: 'heal' });
};

Combat.updateCombo = function(delta){
  if(this.comboTimer > 0){
    this.comboTimer -= delta;
    if(this.comboTimer <= 0){
      this.comboCounter = 0;
    }
  }
};

// ═══ الحصول على مضاعف الكومبو ═══
Combat.getComboMultiplier = function(){
  if(this.comboCounter < 5) return 1.0;
  if(this.comboCounter < 10) return 1.2;
  if(this.comboCounter < 20) return 1.5;
  return 2.0;
};

// ═══ تأثير الضربة القاضية (Finisher) ═══
Combat.finisher = function(attacker, target, damage){
  if(!attacker || !target) return null;

  // ضربة قوية
  const result = this.applyDamage(target, damage, attacker, {
    knockback: 500,
    hitStop: 150,
    hitColor: 0xff0000,
    critical: true
  });

  // تأثير
  if(this.scene){
    this.scene.cameras.main.shake(400, 0.03);
    this.scene.cameras.main.flash(200, 255, 100, 50);

    // جسيمات حمراء
    this._spawnHitParticles(target.x, target.y, 0xff0000, 25);
  }

  return result;
};

// ═══ صد الضربات (Parry) ═══
Combat.canParry = function(){
  return State.ability.has('parry');
};

Combat.attemptParry = function(){
  if(!this.canParry()) return false;

  // نافذة الصد: 200ms
  const parryWindow = 200;
  this.parryTimer = parryWindow;

  return true;
};

Combat.updateParry = function(delta){
  if(this.parryTimer > 0){
    this.parryTimer -= delta;
    if(this.parryTimer <= 0){
      this.parryTimer = 0;
    }
  }
};

Combat.isParrying = function(){
  return this.parryTimer > 0;
};

// ═══ تجاهل الضرر (i-frames) ═══
Combat.grantIFrames = function(duration){
  if(Player.health){
    Player.health.invulnTimer = duration || 1000;
  }
};

// ═══ حساب الضرر العكسي (Reflect) ═══
Combat.reflectDamage = function(target, damage){
  if(!target || !target.active) return;

  const reflected = Math.floor(damage * 0.5);
  this.applyDamage(target, reflected, Player, {
    hitColor: 0x88ddff,
    knockback: 100
  });
};

// ═══ حساب ضرر السقوط ═══
Combat.fallDamage = function(fallSpeed){
  if(fallSpeed < 500) return 0;
  return Math.floor((fallSpeed - 500) / 10);
};

// ═══ تنفيذ ضربة على البوس ═══
Combat.hitBoss = function(boss, damage, options = {}){
  if(!boss || !boss.active || boss._defeated) return null;

  const result = this.applyDamage(boss, damage, Player, {
    ...options,
    hitColor: 0xffaa00
  });

  if(result){
    Events.emit(Events.NAMES.BOSS_HURT, { damage: damage });
  }

  return result;
};

// ═══ تنفيذ ضربة على العدو ═══
Combat.hitEnemy = function(enemy, damage, options = {}){
  if(!enemy || !enemy.active || !enemy.body.enable) return null;

  const result = this.applyDamage(enemy, damage, Player, {
    ...options,
    hitColor: 0xff6a3a
  });

  if(result && result.killed){
    Events.emit(Events.NAMES.ENEMY_DIED, {
      enemy: enemy,
      x: enemy.x,
      y: enemy.y,
      xp: enemy.xp || 0
    });
  }

  return result;
};

// ═══ الحصول على شدة الضربة ═══
Combat.getHitStrength = function(damage, targetMaxHp){
  if(!targetMaxHp) return 'light';
  const percent = damage / targetMaxHp;

  if(percent >= 0.3) return 'critical';
  if(percent >= 0.15) return 'heavy';
  if(percent >= 0.05) return 'normal';
  return 'light';
};

// ═══ تأثير الضربة حسب الشدة ═══
Combat.playHitSound = function(strength){
  switch(strength){
    case 'critical':
      Audio.playBoom();
      break;
    case 'heavy':
      Audio.playHit();
      Audio.playBreak();
      break;
    case 'normal':
      Audio.playHit();
      break;
    case 'light':
      Audio.playHit();
      break;
  }
};

// ═══ إعادة تعيين شاملة ═══
Combat.fullReset = function(){
  this.hitStopTimer = 0;
  this.slowMotionTimer = 0;
  this.comboCounter = 0;
  this.comboTimer = 0;
  this.parryTimer = 0;
  this.activeAttack = null;
  this._resumePhysics();
};

// ═══ تحديث كامل (يُستدعى من اللعبة) ═══
Combat.fullUpdate = function(time, delta){
  this.update(time, delta);
  this.updateCombo(delta);
  this.updateParry(delta);
};

console.log('✅ Combat system loaded (2/2)');
