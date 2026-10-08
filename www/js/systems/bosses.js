// ═══════════════════════════════════════════════════
// EMBER — نظام البوسات
// ═══════════════════════════════════════════════════
'use strict';

const Bosses = {

  current: null,
  scene: null,
  active: false,
  defeated: false,
  phase: 1,
  attackCooldown: 0,
  _phaseTransition: false,

  // ═══ التهيئة ═══
  init(scene){
    this.scene = scene;
    console.log('✅ Bosses system initialized');
  },

  // ═══ Preload ═══
  preload(scene){
    // ═══ Robot ═══
    scene.load.image('robot-idle', 'assets/bosses/robot-idle.png');
    scene.load.image('robot-attack', 'assets/bosses/robot-attack.png');
    scene.load.image('robot-hurt', 'assets/bosses/robot-hurt.png');
    scene.load.image('robot-death', 'assets/bosses/robot-death.png');
    scene.load.image('robot-run', 'assets/bosses/robot-run.png');

    // ═══ Tank ═══
    scene.load.image('tank-idle', 'assets/bosses/tank-idle.png');
    scene.load.image('tank-hurt', 'assets/bosses/tank-hurt.png');
    scene.load.image('tank-death', 'assets/bosses/tank-death.png');
    scene.load.image('tank-gas', 'assets/bosses/tank-gas.png');

    // ═══ Centipede ═══
    scene.load.image('centipede-idle', 'assets/bosses/centipede-idle.png');
    scene.load.image('centipede-walk', 'assets/bosses/centipede-walk.png');
    scene.load.image('centipede-attack', 'assets/bosses/centipede-attack.png');
    scene.load.image('centipede-hurt', 'assets/bosses/centipede-hurt.png');
    scene.load.image('centipede-death', 'assets/bosses/centipede-death.png');

    // ═══ Turtle ═══
    scene.load.image('turtle-idle', 'assets/bosses/turtle-idle.png');
    scene.load.image('turtle-walk', 'assets/bosses/turtle-walk.png');
    scene.load.image('turtle-attack', 'assets/bosses/turtle-attack.png');
    scene.load.image('turtle-hurt', 'assets/bosses/turtle-hurt.png');
    scene.load.image('turtle-death', 'assets/bosses/turtle-death.png');
    scene.load.image('turtle-bullet', 'assets/bosses/turtle-bullet.png');

    console.log('✅ Bosses preload done');
  },

  // ═══ Spawn بوس ═══
  spawn(scene, bossKey, sectionIdx, nameAr){
    const data = Bosses_Data.get(bossKey);
    if(!data){
      console.warn('⚠️ Boss data missing: ' + bossKey);
      return null;
    }

    const bx = Player.sprite ? Player.sprite.x + 350 : 800;
    const by = 100;  // spawn فوق الأرض بقليل

    const spriteKey = 'boss-' + bossKey;
    const actualKey = scene.textures.exists(spriteKey) ? spriteKey : bossKey + '-idle';

    if(!scene.textures.exists(actualKey)){
      console.warn('⚠️ Boss texture missing: ' + actualKey);
      return null;
    }

    this.current = scene.physics.add.sprite(bx, by, actualKey);
    this.current.setDepth(30);
    this.current.setScale(data.scale);
    this.current.setOrigin(0.5, 1);
    // body في أسفل السبرايت
    const bw = this.current.width;
    const bh = this.current.height;
    this.current.body.setSize(bw * 0.7, bh * 0.5);
    this.current.body.setOffset(bw * 0.15, bh * 0.5);
    this.current.body.setCollideWorldBounds(true);
    this.current.body.setMaxVelocity(300, 600);

    // ═══ خصائص ═══
    this.current.hp = data.hp;
    this.current.maxHp = data.hp;
    this.current.damage = data.damage;
    this.current.speed = data.speed;
    this.current.xp = data.xp;
    this.current.shards = data.shards;
    this.current.atoms = data.atoms;
    this.current.souls = data.souls;
    this.current.abilityReward = data.abilityReward;
    this.current.bossKey = bossKey;
    this.current.sectionIdx = sectionIdx;
    this.current.bossData = data;
    this.current._defeated = false;
    this.current.state = 'idle';
    this.current.stateTimer = 0;
    this.current.attackTimer = 0;

    // ═══ المجموعة ═══
    if(scene.platforms){
      scene.physics.add.collider(this.current, scene.platforms);
    }

    this.active = true;
    this.defeated = false;
    this.phase = 1;
    this.attackCooldown = 2000;

    // ═══ الواجهة ═══
    this._showBossUI(nameAr || data.nameAr, this.current.hp, this.current.maxHp);
    this._playAnim('idle');

    // ═══ التأثيرات ═══
    scene.cameras.main.shake(800, 0.02);
    Audio.playBoom();

    Events.emit(Events.NAMES.BOSS_SPAWNED, {
      key: bossKey,
      section: sectionIdx,
      hp: data.hp
    });

    console.log('👑 Boss spawned: ' + bossKey);
    return this.current;
  },

  // ═══ التحديث ═══
  update(time, delta){
    if(!this.current || !this.current.active) return;
    if(this.current._defeated) return;

    const b = this.current;
    const player = Player.sprite;
    if(!player) return;

    // ═══ فحص المرحلة ═══
    this._checkPhase();

    // ═══ الحالة ═══
    if(b.state === 'hurt'){
      b.stateTimer -= delta;
      if(b.stateTimer <= 0){
        b.state = 'idle';
        this._playAnim('idle');
      }
      return;
    }

    if(b.state === 'attack'){
      b.stateTimer -= delta;
      if(b.stateTimer <= 0){
        b.state = 'idle';
        this._playAnim('idle');
      }
      return;
    }

    // ═══ مؤقت الهجوم ═══
    this.attackCooldown -= delta;

    // ═══ الحركة ═══
    const dist = player.x - b.x;
    const absDist = Math.abs(dist);

    if(absDist > 100){
      // يتبع اللاعب
      b.body.setVelocityX(dist > 0 ? b.speed : -b.speed);
      this._playAnim('run');
    } else {
      // قريب
      b.body.setVelocityX(0);
      this._playAnim('idle');
    }

    b.setFlipX(dist < 0);

    // ═══ الهجوم ═══
    if(this.attackCooldown <= 0 && absDist < 200){
      this._doAttack();
    }

    // ═══ الاصطدام باللاعب ═══
    if(Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), b.getBounds())){
      if(typeof Player.takeDamage === 'function'){
        Player.takeDamage(b.damage, b.x);
      }
    }
  },

  // ═══ فحص المرحلة ═══
  _checkPhase(){
    const b = this.current;
    if(!b) return;

    const hpPercent = b.hp / b.maxHp;
    const data = b.bossData;

    if(!data || data.phases <= 1) return;

    if(this.phase === 1 && hpPercent <= 0.6 && data.phases >= 2){
      this._enterPhase(2);
    } else if(this.phase === 2 && hpPercent <= 0.3 && data.phases >= 3){
      this._enterPhase(3);
    }
  },

  _enterPhase(newPhase){
    this.phase = newPhase;
    this.current.speed *= 1.3;
    this.current.damage = Math.floor(this.current.damage * 1.2);

    if(this.scene){
      this.scene.cameras.main.flash(300, 255, 100, 50);
      this.scene.cameras.main.shake(500, 0.02);
    }

    Events.emit('boss:phase', { phase: newPhase });
    console.log('🔥 Boss phase ' + newPhase);
  },

  // ═══ هجوم ═══
  _doAttack(){
    const b = this.current;
    if(!b) return;

    b.state = 'attack';
    b.stateTimer = 600;
    this.attackCooldown = 1800;

    this._playAnim('attack');

    // ═══ ضرر ═══
    const player = Player.sprite;
    if(player && Math.abs(player.x - b.x) < 100){
      if(typeof Player.takeDamage === 'function'){
        Player.takeDamage(b.damage, b.x);
      }
    }

    Audio.playAttack();
  },

  // ═══ أنيميشن ═══
  _playAnim(stateName){
    const b = this.current;
    if(!b.active) return;
    if(b._currentAnim === stateName) return;
    b._currentAnim = stateName;

    const key = b.bossKey + '-' + stateName;
    if(this.scene.textures.exists(key)){
      try { b.setTexture(key); } catch(err) {}
    }
  },

  // ═══ إصابة البوس ═══
  damage(scene, dmg){
    const b = this.current;
    if(!b.active) return;
    if(b._defeated) return;

    b.hp -= dmg;

    b.setTint(0xffffff);
    scene.time.delayedCall(80, () => {
      if(b && b.active) b.clearTint();
    });

    scene.cameras.main.shake(100, 0.008);

    this._updateBossUI(b.hp, b.maxHp);

    // ═══ موت؟ ═══
    if(b.hp <= 0){
      this.kill(scene);
    } else {
      // إصابة
      b.state = 'hurt';
      b.stateTimer = 200;
      this._playAnim('hurt');
    }
  },

  // ═══ قتل البوس ═══
  kill(scene){
    const b = this.current;
    if(b._defeated) return;

    b._defeated = true;
    this.active = false;
    this.defeated = true;

    b.body.setVelocity(0, 0);
    b.body.enable = false;
    this._playAnim('death');

    // ═══ المكافآت ═══
    State.currency.add('shards', b.shards || 0);
    State.currency.add('atoms', b.atoms || 0);
    State.currency.add('souls', b.souls || 0);

    if(b.xp > 0){
      State.xp.add(b.xp);
    }

    // ═══ القدرة ═══
    if(b.abilityReward){
      State.ability.unlock(b.abilityReward);
      scene.time.delayedCall(1500, () => {
        Abilities.unlock(scene, b.abilityReward);
      });
    }

    // ═══ التقدم ═══
    State.progress.defeatBoss(b.sectionIdx);

    // ═══ الأحداث ═══
    Events.emit(Events.NAMES.BOSS_DEFEATED, {
      key: b.bossKey,
      sectionIdx: b.sectionIdx
    });

    // ═══ التأثيرات ═══
    scene.cameras.main.shake(1000, 0.03);
    scene.cameras.main.flash(500, 255, 200, 100);
    Audio.playBoom();

    this._hideBossUI();

    // ═══ الانتقال ═══
    scene.time.delayedCall(2500, () => {
      if(typeof Game !== 'undefined' && Game.nextWorld){
        Game.nextWorld();
      }
    });
  },

  // ═══ واجهة البوس ═══
  _showBossUI(name, hp, maxHp){
    let wrap = document.getElementById('bossBar');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.id = 'bossBar';
      wrap.style.cssText = 'position:fixed;bottom:110px;left:50%;transform:translateX(-50%);width:70%;max-width:500px;z-index:120;pointer-events:none;background:rgba(5,2,8,0.9);padding:10px 16px;border-radius:14px;border:2px solid rgba(255,80,80,0.7);backdrop-filter:blur(8px);box-shadow:0 0 30px rgba(255,80,80,0.4)';
      wrap.innerHTML = '<div id="bossName" style="text-align:center;font-family:Cairo,sans-serif;font-size:1rem;color:#ff8888;letter-spacing:3px;margin-bottom:8px">BOSS</div><div style="width:100%;height:14px;background:rgba(0,0,0,0.9);border-radius:50px;overflow:hidden;border:1px solid rgba(255,80,80,0.4)"><div id="bossFill" style="width:100%;height:100%;background:linear-gradient(90deg,#ff3c14,#ff8c3c,#ffd700);border-radius:50px;transition:width 0.3s;box-shadow:0 0 15px #ff3c14"></div></div>';
      document.body.appendChild(wrap);
    }
    wrap.style.display = 'block';

    const nm = document.getElementById('bossName');
    if(nm) nm.textContent = name;
    const bf = document.getElementById('bossFill');
    if(bf) bf.style.width = '100%';
  },

  _updateBossUI(hp, maxHp){
    const bf = document.getElementById('bossFill');
    if(bf){
      const pct = Math.max(0, hp / maxHp * 100);
      bf.style.width = pct + '%';
    }
  },

  _hideBossUI(){
    const wrap = document.getElementById('bossBar');
    if(wrap) wrap.style.display = 'none';
  },

  // ═══ إعادة تعيين ═══
  reset(){
    if(this.current && this.current.active){
      this.current.destroy();
    }
    this.current = null;
    this.active = false;
    this.defeated = false;
    this.phase = 1;
    this.attackCooldown = 0;
    this._hideBossUI();
  },

  // ═══ استعلامات ═══
  isActive(){ return this.active && this.current && this.current.active; },
  getHp(){ return this.current ? this.current.hp : 0; },
  getMaxHp(){ return this.current ? this.current.maxHp : 0; },

  // ═══ Spawn حسب القسم ═══
  spawnForSection(scene, sectionIdx){
    const ws = WORLD_SECTIONS[sectionIdx];
    if(!ws) return null;
    return this.spawn(scene, ws.bossKey, sectionIdx, ws.bossNameAr);
  }
};

console.log('✅ Bosses system loaded');
