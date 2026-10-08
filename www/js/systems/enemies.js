// ═══════════════════════════════════════════════════
// EMBER — نظام الأعداء (كامل - ملف واحد)
// ═══════════════════════════════════════════════════
'use strict';

const Enemies = {

  group: null,
  scene: null,
  activeEnemies: [],
  timers: [],

  CULL: {
    ACTIVATION_DIST: 700,
    DEACTIVATION_DIST: 1200,
    CHECK_INTERVAL: 250,
    lastCheck: 0
  },

  init(scene){
    this.scene = scene;
    this.group = scene.physics.add.group();
    this.activeEnemies = [];
    this.timers = [];
    console.log('✅ Enemies system initialized');
  },

  preload(scene){
    for(let i = 1; i <= 10; i++){
      const base = 'assets/enemies/monster-' + i + '/';
      const prefix = 'monster-' + i + '-';

      for(let j = 0; j < 6; j++){
        scene.load.image(prefix + 'idle-' + j, base + 'idle-' + j + '.png');
      }
      for(let j = 0; j < 6; j++){
        scene.load.image(prefix + 'walk-' + j, base + 'walk-' + j + '.png');
      }
      for(let j = 0; j < 6; j++){
        scene.load.image(prefix + 'run-' + j, base + 'run-' + j + '.png');
      }
      for(let j = 0; j < 6; j++){
        scene.load.image(prefix + 'attack-' + j, base + 'attack-' + j + '.png');
      }
      for(let j = 0; j < 6; j++){
        scene.load.image(prefix + 'hurt-' + j, base + 'hurt-' + j + '.png');
      }
      for(let j = 0; j < 6; j++){
        scene.load.image(prefix + 'die-' + j, base + 'die-' + j + '.png');
      }
    }

    ['black', 'white', 'red'].forEach(color => {
      const base = 'assets/bosses/werewolf-' + color + '/';
      scene.load.image('werewolf-' + color + '-idle', 'assets/bosses/werewolf-' + color + '-idle-frame.png');
      scene.load.image('werewolf-' + color + '-walk', base + 'Walk.png');
      scene.load.image('werewolf-' + color + '-run', base + 'Run.png');
      scene.load.image('werewolf-' + color + '-attack1', base + 'Attack_1.png');
      scene.load.image('werewolf-' + color + '-hurt', base + 'Hurt.png');
      scene.load.image('werewolf-' + color + '-dead', base + 'Dead.png');
    });

    console.log('✅ Enemies preload done');
  },

  createAnimations(scene){
    const A = scene.anims;

    for(let i = 1; i <= 10; i++){
      const key = 'monster-' + i;
      const prefix = key + '-';

      if(A.exists(key + '-idle')) continue;

      A.create({
        key: key + '-idle',
        frames: [0,1,2,3,4,5].map(j => ({ key: prefix + 'idle-' + j })),
        frameRate: 6, repeat: -1
      });
      A.create({
        key: key + '-walk',
        frames: [0,1,2,3,4,5].map(j => ({ key: prefix + 'walk-' + j })),
        frameRate: 8, repeat: -1
      });
      A.create({
        key: key + '-run',
        frames: [0,1,2,3,4,5].map(j => ({ key: prefix + 'run-' + j })),
        frameRate: 12, repeat: -1
      });
      A.create({
        key: key + '-attack',
        frames: [0,1,2,3,4,5].map(j => ({ key: prefix + 'attack-' + j })),
        frameRate: 10, repeat: 0
      });
      A.create({
        key: key + '-hurt',
        frames: [0,1,2,3,4,5].map(j => ({ key: prefix + 'hurt-' + j })),
        frameRate: 8, repeat: 0
      });
      A.create({
        key: key + '-die',
        frames: [0,1,2,3,4,5].map(j => ({ key: prefix + 'die-' + j })),
        frameRate: 8, repeat: 0
      });
    }

    console.log('✅ Enemies animations created');
  },

  spawn(scene, x, y, typeKey, sectionIdx){
    const data = Enemies_Data.get(typeKey);
    if(!data) return null;

    const stats = Enemies_Data.getScaledStats(typeKey, sectionIdx);
    if(!stats) return null;

    const useSheet = data.sheetMode === true;
    const spriteKey = useSheet ? typeKey + '-idle' : typeKey + '-idle-0';

    if(!scene.textures.exists(spriteKey)){
      return null;
    }

    const e = this.group.create(x, y, spriteKey);

    e.setScale(data.scale);
    e.setDepth(data.depth || 20);
    e.setFlipX(Math.random() < 0.5);

    // body في وسط السبرايت (حجم مناسب)
    const texW = e.width;
    const texH = e.height;
    e.body.setSize(texW * 0.5, texH * 0.6);
    e.body.setOffset(texW * 0.25, texH * 0.3);

    e.body.setCollideWorldBounds(false);
    e.body.setMaxVelocity(300, 600);

    e.hp = stats.hp;
    e.maxHp = stats.hp;
    e.damage = stats.damage;
    e.speed = stats.speed;
    e.xp = stats.xp;
    e.shards = stats.shards;
    e.enemyKey = typeKey;
    e.enemyData = data;
    e.sectionIdx = sectionIdx;
    e.isElite = data.category === 'elite';
    e.isActive = false;
    e.state = 'idle';
    e.stateTimer = 0;
    e.attackCooldown = 0;
    e.direction = Math.random() < 0.5 ? -1 : 1;

    this.activeEnemies.push(e);

    if(useSheet){
      this._playSheetAnim(e, 'idle');
    } else {
      const idleKey = typeKey + '-idle';
      if(scene.anims.exists(idleKey)) e.play(idleKey, true);
    }

    return e;
  },

  despawn(e){
    if(!e.active) return;
    
    // Object Pooling: نخفيه بدل ما نحذفه
    e.setActive(false);
    e.setVisible(false);
    e.isActive = false;
    e.state = "idle";
    e.hp = 0;
    if(e.body){
      e.body.setVelocity(0, 0);
      e.body.enable = false;
    }
    
    // نخرجه من القائمة النشطة
    const idx = this.activeEnemies.indexOf(e);
    if(idx !== -1) this.activeEnemies.splice(idx, 1);
  },

  clearAll(){
    // إلغاء timers
    this.timers.forEach(t => { try { if(t) t.remove(); } catch(e){} });
    this.timers = [];
    
    // حذف كل الأعداء (destroy حقيقي)
    if(this.group){
      this.group.getChildren().forEach(e => {
        if(e && e.active) e.destroy();
      });
      this.group.clear(true, true);
    }
    this.activeEnemies = [];
  },

  spawnForSection(scene, sectionIdx, options){
    options = options || {};
    const ws = WORLD_SECTIONS[sectionIdx];
    if(!ws) return;

    const count = options.count || ws.enemyCount || 8;
    const width = options.width || 3500;
    const types = ws.enemyTypes || [];
    const elites = ws.eliteTypes || [];

    const segment = (width - 800) / Math.max(count, 1);

    for(let i = 0; i < count; i++){
      const type = types[i % types.length];
      const x = 400 + (segment * i) + Phaser.Math.Between(50, Math.max(60, segment - 50));
      const y = CFG.GH - 120;

      const t = scene.time.delayedCall(i * 200, () => {
        if(scene && this.group){
          this.spawn(scene, x, y, type, sectionIdx);
        }
      });
      this.timers.push(t);
    }

    elites.forEach((eliteKey, idx) => {
      const x = 1500 + (idx * 800) + Phaser.Math.Between(-100, 100);
      const y = CFG.GH - 150;

      const t = scene.time.delayedCall(3000 + (idx * 500), () => {
        if(scene && this.group){
          this.spawn(scene, x, y, eliteKey, sectionIdx);
        }
      });
      this.timers.push(t);
    });
  },

  _playSheetAnim(e, animName){
    if(!e.data || !e.enemyData.sheetMode) return;
    const color = e.enemyKey.replace('werewolf-', '');
    const key = 'werewolf-' + color + '-' + animName;
    if(this.scene.textures.exists(key)){
      try { e.setTexture(key); } catch(err) {}
    }
  },

  update(time, delta){
    if(!this.scene) return;

    if(time - this.CULL.lastCheck > this.CULL.CHECK_INTERVAL){
      this._updateCulling(time);
      this.CULL.lastCheck = time;
    }

    this.activeEnemies.forEach(e => {
      if(!e.active) return;
      this._updateEnemy(e, time, delta);
    });

    this.activeEnemies = this.activeEnemies.filter(e => e && e.active);
  },

  _updateCulling(time){
    const player = Player.sprite;
    if(!player) return;
    
    // استخدام Camera Viewport (أسرع 100×)
    const cam = this.scene.cameras.main;
    const view = cam.worldView;
    const buffer = 200; // مساحة إضافية
    
    const left = view.x - buffer;
    const right = view.x + view.width + buffer;
    const top = view.y - buffer;
    const bottom = view.y + view.height + buffer;
    
    this.activeEnemies.forEach(e => {
      if(!e.active) return;
      
      const inView = e.x >= left && e.x <= right && e.y >= top && e.y <= bottom;
      
      if(inView && !e.isActive){
        // تفعيل
        e.isActive = true;
        if(e.body) e.body.enable = true;
      } else if(!inView && e.isActive){
        // إيقاف (مع إطفاء الفيزياء)
        e.isActive = false;
        if(e.body){
          e.body.setVelocity(0, 0);
          e.body.enable = false;
        }
      }
    });
  },

  _updateEnemy(e, time, delta){
    if(!e.body) return;

    if(e.state === 'die'){
      e.stateTimer -= delta;
      if(e.stateTimer <= 0) this.despawn(e);
      return;
    }

    if(e.state === 'hurt'){
      e.stateTimer -= delta;
      if(e.stateTimer <= 0){
        e.state = 'idle';
        this._playState(e, 'idle');
      }
      return;
    }

    if(e.state === 'attack'){
      e.stateTimer -= delta;
      if(e.stateTimer <= 0){
        e.state = 'idle';
        this._playState(e, 'idle');
      }
      return;
    }

    if(!e.isActive){
      e.body.setVelocityX(0);
      return;
    }

    if(e.attackCooldown > 0) e.attackCooldown -= delta;

    const b = e.enemyData.behavior;

    if(b === 'patrol') this._behaviorPatrol(e, delta);
    else if(b === 'patrol_aggressive') this._behaviorPatrolAggressive(e, delta);
    else if(b === 'charge' || b === 'charge_aggressive') this._behaviorCharge(e, delta);
    else if(b === 'ranged') this._behaviorRanged(e, delta);
    else if(b === 'hover') this._behaviorHover(e, delta);
    else this._behaviorPatrol(e, delta);

    this._checkPlayerCollision(e);
  },

  _behaviorPatrol(e, delta){
    const player = Player.sprite;
    if(!player) return;

    const dist = Math.abs(player.x - e.x);

    if(dist > 250){
      e.body.setVelocityX(e.direction * e.speed);
      this._playState(e, 'walk');
    } else {
      e.direction = player.x > e.x ? 1 : -1;
      e.body.setVelocityX(e.direction * e.speed * 1.3);
      this._playState(e, 'run');
    }

    if(e.body.blocked.left) e.direction = 1;
    if(e.body.blocked.right) e.direction = -1;

    e.setFlipX(e.direction < 0);
  },

  _behaviorPatrolAggressive(e, delta){
    const player = Player.sprite;
    if(!player) return;

    const dist = Math.abs(player.x - e.x);

    if(dist < 400){
      e.direction = player.x > e.x ? 1 : -1;
      e.body.setVelocityX(e.direction * e.speed * 1.5);
      this._playState(e, 'run');

      if(e.body.blocked.down && Math.random() < 0.02){
        e.body.setVelocityY(-250);
      }

      if(dist < 60 && e.attackCooldown <= 0){
        this._startAttack(e);
      }
    } else {
      e.body.setVelocityX(e.direction * e.speed);
      this._playState(e, 'walk');
    }

    if(e.body.blocked.left) e.direction = 1;
    if(e.body.blocked.right) e.direction = -1;

    e.setFlipX(e.direction < 0);
  },

  _behaviorCharge(e, delta){
    const player = Player.sprite;
    if(!player) return;

    const dist = Math.abs(player.x - e.x);

    if(dist < 500){
      e.direction = player.x > e.x ? 1 : -1;
      e.body.setVelocityX(e.direction * e.speed);
      this._playState(e, 'run');

      if(dist < 80 && e.attackCooldown <= 0){
        this._startAttack(e);
      }
    } else {
      e.body.setVelocityX(e.direction * e.speed * 0.5);
      this._playState(e, 'walk');
    }

    if(e.body.blocked.left) e.direction = 1;
    if(e.body.blocked.right) e.direction = -1;

    e.setFlipX(e.direction < 0);
  },

  _behaviorRanged(e, delta){
    const player = Player.sprite;
    if(!player) return;

    const dist = Math.abs(player.x - e.x);

    if(dist < 200){
      e.direction = player.x > e.x ? -1 : 1;
      e.body.setVelocityX(e.direction * e.speed);
    } else if(dist > 350){
      e.direction = player.x > e.x ? 1 : -1;
      e.body.setVelocityX(e.direction * e.speed);
    } else {
      e.body.setVelocityX(0);
    }

    this._playState(e, 'walk');

    if(dist < 400 && e.attackCooldown <= 0 && Math.random() < 0.02){
      this._startRangedAttack(e);
    }

    e.setFlipX(e.direction < 0);
  },

  _behaviorHover(e, delta){
    const player = Player.sprite;
    if(!player) return;

    const dx = player.x - e.x;
    const dy = player.y - e.y;

    e.body.setVelocity(dx * 0.3, dy * 0.3);
    e.setFlipX(dx < 0);

    if(Math.abs(dx) < 60 && Math.abs(dy) < 60 && e.attackCooldown <= 0){
      this._startAttack(e);
    }
  },

  _startAttack(e){
    e.state = 'attack';
    e.stateTimer = 500;
    e.attackCooldown = 1500;

    this._playState(e, 'attack');

    const player = Player.sprite;
    if(player && Math.abs(player.x - e.x) < 70 && Math.abs(player.y - e.y) < 50){
      this._damagePlayer(e);
    }
  },

  _startRangedAttack(e){
    e.state = 'attack';
    e.stateTimer = 600;
    e.attackCooldown = 2000;

    this._playState(e, 'attack');

    const player = Player.sprite;
    if(!player || !this.scene) return;

    const dir = player.x > e.x ? 1 : -1;

    this.scene.time.delayedCall(300, () => {
      if(!e.active) return;
      this._spawnProjectile(e, dir);
    });
  },

  _spawnProjectile(e, dir){
    if(!this.scene) return;

    const proj = this.scene.add.circle(e.x, e.y, 5, 0x88ccff);
    proj.setDepth(25);
    this.scene.physics.add.existing(proj);
    proj.body.setAllowGravity(false);
    proj.body.setVelocityX(dir * 250);

    const checkTimer = this.scene.time.addEvent({
      delay: 50,
      repeat: 40,
      callback: () => {
        if(!proj || !proj.active) return;

        const player = Player.sprite;
        if(!player) return;

        const dist = Phaser.Math.Distance.Between(proj.x, proj.y, player.x, player.y);
        if(dist < 25){
          Player.takeDamage(e.damage, proj.x);
          proj.destroy();
          checkTimer.remove();
          return;
        }

        if(Math.abs(proj.x - player.x) > 600){
          proj.destroy();
          checkTimer.remove();
        }
      }
    });
  },

  _checkPlayerCollision(e){
    const player = Player.sprite;
    if(!player || !player.active) return;

    if(Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), e.getBounds())){
      this._damagePlayer(e);
    }
  },

  _damagePlayer(e){
    const player = Player.sprite;
    if(!player) return;

    if(typeof Player.takeDamage === 'function'){
      Player.takeDamage(e.damage, e.x);
    }
  },

  _playState(e, stateName){
    if(!e.active) return;
    if(e._currentState === stateName) return;
    e._currentState = stateName;

    if(e.data && e.enemyData.sheetMode){
      this._playSheetAnim(e, stateName);
    } else {
      const key = e.enemyKey + '-' + stateName;
      if(this.scene.anims.exists(key)){
        try { e.play(key, true); } catch(err) {}
      }
    }
  },

  damage(scene, e, dmg, fromPlayer){
    if(!e.active) return;
    if(e.state === 'die') return;
    if(!e.body) return;

    e.hp -= dmg;

    e.setTint(0xffffff);
    scene.time.delayedCall(80, () => { if(e.active) e.clearTint(); });

    if(fromPlayer && Player.sprite){
      const dir = e.x > Player.sprite.x ? 1 : -1;
      e.body.setVelocityX(dir * 150);
    }

    scene.cameras.main.shake(100, 0.005);

    if(e.hp <= 0){
      this.kill(scene, e);
    } else {
      e.state = 'hurt';
      e.stateTimer = 300;
      this._playState(e, 'hurt');
    }
  },

  kill(scene, e){
    if(!e.active || e.state === 'die') return;

    e.state = 'die';
    e.stateTimer = 500;
    if(e.body){
      e.body.setVelocity(0, 0);
      e.body.enable = false;
    }

    this._playState(e, 'die');

    const rewards = Enemies_Data.getRewards(e.enemyKey);

    if(rewards.shards > 0){
      State.currency.add('shards', rewards.shards);
      HUD.showCoinPopup(scene, e.x, e.y - 20, rewards.shards);
    }

    if(rewards.atoms > 0){
      State.currency.add('atoms', rewards.atoms);
      HUD.showCoinPopup(scene, e.x, e.y - 40, rewards.atoms + ' atom');
    }

    if(rewards.souls > 0){
      State.currency.add('souls', rewards.souls);
    }

    if(rewards.xp > 0){
      const leveled = State.xp.add(rewards.xp);
      if(leveled) HUD.showLevelUp(scene);
    }

    State.stats.addKill();
    Audio.playKill();
    scene.cameras.main.shake(150, 0.008);

    Events.emit(Events.NAMES.ENEMY_DIED, {
      enemy: e,
      key: e.enemyKey,
      x: e.x,
      y: e.y,
      xp: rewards.xp,
      rewards: rewards
    });

    scene.time.delayedCall(500, () => {
      if(e && e.active) this.despawn(e);
    });
  },

  getInRange(x, y, range){
    return this.activeEnemies.filter(e => {
      if(!e.active) return false;
      return Phaser.Math.Distance.Between(x, y, e.x, e.y) <= range;
    });
  },

  getInRect(rect){
    return this.activeEnemies.filter(e => {
      if(!e.active || !e.body) return false;
      return Phaser.Geom.Intersects.RectangleToRectangle(rect, e.getBounds());
    });
  },

  getActiveCount(){
    return this.activeEnemies.filter(e => e && e.active && e.isActive).length;
  },

  getTotalCount(){
    return this.activeEnemies.length;
  },

  fullReset(){
    this.clearAll();
    this.CULL.lastCheck = 0;
  },

  getCount(){ return this.activeEnemies.length; },
  getActiveEnemies(){ return [].concat(this.activeEnemies); },

  reset(){
    this.clearAll();
    this.group = null;
    this.scene = null;
  }
};

console.log('✅ Enemies system loaded');
