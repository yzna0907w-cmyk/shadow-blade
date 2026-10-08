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
    this.createAnimations(scene);
    console.log('✅ Bosses system initialized');
  },

  createAnimations(scene){
    const A = scene.anims;

    // ═══ Robot ═══
    if(!A.exists('robot-idle')){
      A.create({
        key: 'robot-idle',
        frames: [0,1,2,3].map(j => ({ key: 'robot-idle-' + j })),
        frameRate: 6, repeat: -1
      });
    }
    if(!A.exists('robot-run')){
      A.create({
        key: 'robot-run',
        frames: [0,1,2,3,4,5].map(j => ({ key: 'robot-run-' + j })),
        frameRate: 10, repeat: -1
      });
    }
    if(!A.exists('robot-attack')){
      A.create({
        key: 'robot-attack',
        frames: [0,1,2,3,4,5].map(j => ({ key: 'robot-attack-' + j })),
        frameRate: 12, repeat: 0
      });
    }
    if(!A.exists('robot-hurt')){
      A.create({
        key: 'robot-hurt',
        frames: [0,1].map(j => ({ key: 'robot-hurt-' + j })),
        frameRate: 10, repeat: 0
      });
    }
    if(!A.exists('robot-death')){
      A.create({
        key: 'robot-death',
        frames: [0,1,2,3,4,5].map(j => ({ key: 'robot-death-' + j })),
        frameRate: 10, repeat: 0
      });
    }

    console.log('✅ Boss animations created');
  },

  // ═══ Preload ═══
  preload(scene){
    // ═══ Robot — 36 فريم ═══
    const ROBOT = 'assets/bosses/robot-';
    for(let i = 0; i < 4; i++) scene.load.image('robot-idle-' + i, ROBOT + 'idle-' + i + '.png');
    for(let i = 0; i < 6; i++) scene.load.image('robot-run-' + i, ROBOT + 'run-' + i + '.png');
    for(let i = 0; i < 6; i++) scene.load.image('robot-attack-' + i, ROBOT + 'attack-' + i + '.png');
    for(let i = 0; i < 2; i++) scene.load.image('robot-hurt-' + i, ROBOT + 'hurt-' + i + '.png');
    for(let i = 0; i < 6; i++) scene.load.image('robot-death-' + i, ROBOT + 'death-' + i + '.png');

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

    // ═══ نبحث عن الفريم الأول ═══
    const singleKey = 'boss-' + bossKey;
    const firstFrameKey = bossKey + '-idle-0';
    const legacyKey = bossKey + '-idle';

    let actualKey;
    if(scene.textures.exists(firstFrameKey)){
      actualKey = firstFrameKey;   // ← جديد: 36 فريم
    } else if(scene.textures.exists(singleKey)){
      actualKey = singleKey;
    } else if(scene.textures.exists(legacyKey)){
      actualKey = legacyKey;
    } else {
      console.warn('⚠️ Boss texture missing for: ' + bossKey);
      return null;
    }

    this.current = scene.physics.add.sprite(bx, by, actualKey);
    this.current.setDepth(30);
    this.current.setScale(data.scale);
    this.current.setOrigin(0.5, 0.5);
    // body في أسفل السبرايت
    const texW = this.current.width;
    const texH = this.current.height;
    this.current.body.setSize(texW * 0.6, texH * 0.5);
    this.current.body.setOffset(texW * 0.2, texH * 0.5);
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
    if(!b || !b.active) return;
    if(b._currentAnim === stateName) return;
    b._currentAnim = stateName;

    const animKey = b.bossKey + '-' + stateName;
    const textureKey = b.bossKey + '-' + stateName;

    // أولاً: نحاول نشغّل أنيميشن
    if(this.scene.anims && this.scene.anims.exists(animKey)){
      try {
        b.play(animKey, true);
        return;
      } catch(e) {}
    }

    // ثانياً: صورة واحدة (legacy)
    if(this.scene.textures.exists(textureKey)){
      try { b.setTexture(textureKey); } catch(e) {}
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

    // ═══ ما فيه انتقال تلقائي — اللاعب يكمل بنفسه ═══
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
