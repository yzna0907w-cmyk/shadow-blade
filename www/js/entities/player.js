// ═══════════════════════════════════════════════════
// EMBER — "صدى"
// البطل: صدی - الجزء 1/3 (الحالة + preload + create)
// ═══════════════════════════════════════════════════
'use strict';

const Player = {

  // ═══ الحالة الأساسية ═══
  sprite: null,
  scene: null,
  state: 'idle',
  facing: 1,

  // ═══ الفيزياء ═══
  physics: {
    velocityX: 0,
    velocityY: 0,
    onGround: false,
    wasOnGround: false,
    onWall: 0,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    jumpCount: 0,
    jumpReleased: true,
    landTimer: 0,
    maxFallSpeed: 600
  },

  // ═══ الهجوم ═══
  attack: {
    isAttacking: false,
    attackTimer: 0,
    cooldown: 0,
    lastAttackTime: 0,
    comboCount: 0,
    comboWindow: 0,
    canAttack: true,
    hitEnemiesThisSwing: [],
    arcEffect: null
  },

  // ═══ الانطلاق ═══
  dash: {
    isDashing: false,
    dashTimer: 0,
    cooldownTimer: 0,
    dashesLeft: 1,
    direction: 1
  },

  // ═══ القفز المزدوج ═══
  doubleJump: { used: false },

  // ═══ التسلق ═══
  wallJump: {
    isSliding: false,
    slideTimer: 0,
    slideSpeed: 50,
    jumpCooldown: 0,
    direction: 1
  },

  // ═══ الطيران ═══
  glide: {
    isGliding: false,
    maxGlideSpeed: 60,
    particleTimer: 0
  },

  // ═══ الهجوم المشحون ═══
  chargedAttack: {
    isCharging: false,
    chargeTime: 0,
    chargeMax: 1000,
    chargeRatio: 0,
    aura: null
  },

  // ═══ الصحة ═══
  health: {
    invulnTimer: 0,
    hurtTimer: 0,
    flashTimer: 0,
    isFlashing: false
  },

  // ═══ الأنيميشن ═══
  anim: {
    currentKey: null,
    lastKey: null,
    weaponSuffix: 'sword'
  },

  // ═══ الإحصائيات ═══
  runtime: {
    distanceTraveled: 0,
    enemiesKilledThisLife: 0,
    timeInAir: 0
  },

  // ═══════════════════════════════════════════════════
  //                    Preload
  // ═══════════════════════════════════════════════════
  preload(scene){
    const weapons = ['sword', 'axe', 'spear'];

    weapons.forEach(weapon => {
      const base = 'assets/player/' + weapon + '/';

      for(let i = 0; i < 4; i++){
        scene.load.image('player-' + weapon + '-idle-' + i, base + 'idle-' + i + '.png');
      }
      for(let i = 0; i < 6; i++){
        scene.load.image('player-' + weapon + '-walk-' + i, base + 'run-' + i + '.png');
        scene.load.image('player-' + weapon + '-run-' + i, base + 'run-' + i + '.png');
      }
      for(let i = 0; i < 4; i++){
        scene.load.image('player-' + weapon + '-jump-' + i, base + 'jump-' + i + '.png');
        scene.load.image('player-' + weapon + '-fall-' + i, base + 'jump-' + i + '.png');
      }
      for(let i = 0; i < 5; i++){
        scene.load.image('player-' + weapon + '-attack-' + i, base + 'attack-' + i + '.png');
      }
      scene.load.image('player-' + weapon + '-hurt', base + 'hurt.png');
      for(let i = 0; i < 4; i++){
        scene.load.image('player-' + weapon + '-die-' + i, base + 'die-' + i + '.png');
      }
    });

    console.log('✅ Player preload done');
  },

  // ═══════════════════════════════════════════════════
  //                    Create
  // ═══════════════════════════════════════════════════
  create(scene, x = 60, y = 100){
    this.scene = scene;

    const currentWeapon = State.weapon.getCurrent();
    this.anim.weaponSuffix = currentWeapon;

    this.sprite = scene.physics.add.sprite(x, y, 'player-' + currentWeapon + '-idle-0');

    this.sprite.setDepth(100);
    this.sprite.setScale(CFG.PLAYER.SCALE);
    // تثبيت العرض والطول (لتجنب تغير الحجم مع الأنيميشن)
    this.sprite.body.setSize(CFG.PLAYER.BODY_SIZE.w, CFG.PLAYER.BODY_SIZE.h);
    this.sprite.body.setOffset(CFG.PLAYER.BODY_OFFSET.x, CFG.PLAYER.BODY_OFFSET.y);
    this.sprite.body.setMaxVelocity(400, CFG.PLAYER.MAX_FALL_SPEED);
    // منع تعليق اللاعب في الجدران
    if(this.sprite.body.setTilePadding){
      this.sprite.body.setTilePadding(2, 2);
    }
    this.sprite.body.setCollideWorldBounds(false);

    this._resetState();
    this._createAnimations(scene);
    this._playAnim('idle');
    this._bindEvents();

    console.log('✅ Player created at (' + x + ', ' + y + ')');
    return this.sprite;
  },

  // ═══════════════════════════════════════════════════
  //              إعادة تعيين الحالة
  // ═══════════════════════════════════════════════════
  _resetState(){
    this.state = 'idle';
    this.facing = 1;
    this.physics.velocityX = 0;
    this.physics.velocityY = 0;
    this.physics.onGround = false;
    this.physics.wasOnGround = false;
    this.physics.onWall = 0;
    this.physics.coyoteTimer = 0;
    this.physics.jumpBufferTimer = 0;
    this.physics.jumpCount = 0;
    this.physics.jumpReleased = true;
    this.physics.landTimer = 0;
    this.attack.isAttacking = false;
    this.attack.attackTimer = 0;
    this.attack.cooldown = 0;
    this.attack.comboCount = 0;
    this.dash.isDashing = false;
    this.dash.dashTimer = 0;
    this.dash.cooldownTimer = 0;
    this.dash.dashesLeft = 1;
    this.doubleJump.used = false;
    this.wallJump.isSliding = false;
    this.wallJump.jumpCooldown = 0;
    this.glide.isGliding = false;
    this.chargedAttack.isCharging = false;
    this.chargedAttack.chargeTime = 0;
    this.health.invulnTimer = 0;
    this.health.hurtTimer = 0;
    this.health.isFlashing = false;
    this.runtime.timeInAir = 0;
  },

  // ═══════════════════════════════════════════════════
  //              إنشاء الأنيميشنات
  // ═══════════════════════════════════════════════════
  _createAnimations(scene){
    const weapons = ['sword', 'axe', 'spear'];
    const A = scene.anims;

    weapons.forEach(weapon => {
      const prefix = 'player-' + weapon;

      if(!A.exists(weapon + '-idle')){
        A.create({ key: weapon + '-idle', frames: [0,1,2,3].map(i => ({ key: prefix + '-idle-' + i })), frameRate: ANIM_FPS.idle, repeat: -1 });
      }
      if(!A.exists(weapon + '-walk')){
        A.create({ key: weapon + '-walk', frames: [0,1,2,3,4,5].map(i => ({ key: prefix + '-walk-' + i })), frameRate: ANIM_FPS.walk, repeat: -1 });
      }
      if(!A.exists(weapon + '-run')){
        A.create({ key: weapon + '-run', frames: [0,1,2,3,4,5].map(i => ({ key: prefix + '-run-' + i })), frameRate: ANIM_FPS.run, repeat: -1 });
      }
      if(!A.exists(weapon + '-jump')){
        A.create({ key: weapon + '-jump', frames: [0,1,2,3].map(i => ({ key: prefix + '-jump-' + i })), frameRate: ANIM_FPS.jump, repeat: 0 });
      }
      if(!A.exists(weapon + '-fall')){
        A.create({ key: weapon + '-fall', frames: [0,1,2,3].map(i => ({ key: prefix + '-fall-' + i })), frameRate: ANIM_FPS.fall, repeat: 0 });
      }
      if(!A.exists(weapon + '-attack')){
        A.create({ key: weapon + '-attack', frames: [0,1,2,3,4].map(i => ({ key: prefix + '-attack-' + i })), frameRate: ANIM_FPS.attack, repeat: 0 });
      }
      if(!A.exists(weapon + '-hurt')){
        A.create({ key: weapon + '-hurt', frames: [{ key: prefix + '-hurt' }], frameRate: ANIM_FPS.hurt, repeat: 0 });
      }
      if(!A.exists(weapon + '-die')){
        A.create({ key: weapon + '-die', frames: [0,1,2,3].map(i => ({ key: prefix + '-die-' + i })), frameRate: ANIM_FPS.die, repeat: 0 });
      }
    });

    console.log('✅ Player animations created');
  },

  // ═══════════════════════════════════════════════════
  //              ربط الأحداث
  // ═══════════════════════════════════════════════════
  _bindEvents(){
    Events.on(Events.NAMES.WEAPON_SWITCHED, (data) => {
      if(data && data.weapon){
        this.anim.weaponSuffix = data.weapon;
        this._playAnim(this.state, true);
      }
    });
  }
};

console.log('✅ Player (part 1/3) loaded');

// ═══════════════════════════════════════════════════
//              الجزء 2/3 — التحديث والحركة
// ═══════════════════════════════════════════════════

Player.update = function(time, delta){
  if(!this.sprite || !this.sprite.active) return;

  const dt = delta / 1000;

  this._updatePhysics(dt);
  this._updateGroundCheck();
  this._updateTimers(delta);
  this._handleInput(time, delta);
  this._updateDash(delta);
  this._updateWallSlide(dt);
  this._updateGlide(dt);
  this._updateAttack(delta);
  this._updateChargedAttack(delta);
  this._updateHealth(delta);
  this._updateAnimation();
  this._updateRuntime(delta);
};

// ═══ الفيزياء ═══
Player._updatePhysics = function(dt){
  this.physics.velocityX = this.sprite.body.velocity.x;
  this.physics.velocityY = this.sprite.body.velocity.y;
};

// ═══ الأرض والجدران ═══
Player._updateGroundCheck = function(){
  const body = this.sprite.body;
  this.physics.wasOnGround = this.physics.onGround;
  this.physics.onGround = body.blocked.down || body.touching.down;

  this.physics.onWall = 0;
  if(State.ability.has('wallJump')){
    if(body.blocked.left && !this.physics.onGround) this.physics.onWall = -1;
    else if(body.blocked.right && !this.physics.onGround) this.physics.onWall = 1;
  }

  if(this.physics.onGround){
    this.physics.coyoteTimer = CFG.PLAYER.COYOTE_TIME;
    this.physics.jumpCount = 0;
    this.physics.jumpReleased = true;
    this.dash.dashesLeft = 1;
    this.doubleJump.used = false;

    if(!this.physics.wasOnGround){
      this._onLand();
    }
  } else {
    this.physics.coyoteTimer = Math.max(0, this.physics.coyoteTimer - 16);
  }
};

// ═══ المؤقتات ═══
Player._updateTimers = function(delta){
  if(this.physics.jumpBufferTimer > 0) this.physics.jumpBufferTimer -= delta;
  if(this.attack.cooldown > 0) this.attack.cooldown -= delta;
  if(this.attack.comboWindow > 0) this.attack.comboWindow -= delta;
  if(this.wallJump.jumpCooldown > 0) this.wallJump.jumpCooldown -= delta;
};

// ═══ المدخلات ═══
Player._handleInput = function(time, delta){
  const dir = Input.getDirection();

  // الحركة الأفقية (يسمح بالحركة أثناء الهجوم)
  if(!this.dash.isDashing){
    if(dir !== 0){
      const speed = CFG.PLAYER.WALK_SPEED;
      this.sprite.body.setVelocityX(dir * speed);
      this.facing = dir;
      this.sprite.setFlipX(dir < 0);
    } else {
      // توقف فوري على الأرض، تباطؤ بسيط في الهواء
      if(this.physics.onGround){
        this.sprite.body.setVelocityX(0);
      } else {
        this.sprite.body.setVelocityX(this.physics.velocityX * 0.9);
      }
    }
  }

  // القفز
  if(Input.isJumpPressed()){
    this.physics.jumpBufferTimer = CFG.PLAYER.JUMP_BUFFER;
  }

  if(this.physics.jumpBufferTimer > 0){
    if(this.physics.coyoteTimer > 0 && !this.attack.isAttacking && !this.dash.isDashing){
      this._doJump();
      this.physics.jumpBufferTimer = 0;
      this.physics.coyoteTimer = 0;
    } else if(this.wallJump.isSliding && this.wallJump.jumpCooldown <= 0){
      this._doWallJump();
      this.physics.jumpBufferTimer = 0;
    } else if(State.ability.has('doubleJump') && !this.doubleJump.used && !this.physics.onGround){
      this._doDoubleJump();
      this.physics.jumpBufferTimer = 0;
    }
  }

  // Variable Jump (قطع أقل حدة)
  if(!Input.isJumpDown() && this.physics.jumpReleased === false){
    if(this.sprite.body.velocity.y < -50){
      this.sprite.body.setVelocityY(this.sprite.body.velocity.y * 0.7);
    }
    this.physics.jumpReleased = true;
  }

  // الهجوم
  if(Input.isAttackPressed() && this.attack.cooldown <= 0 && !this.dash.isDashing){
    this._doAttack();
  }

  // الهجوم المشحون
  if(State.ability.has('chargedAttack')){
    if(Input.isAttackDown() && !this.attack.isAttacking && !this.dash.isDashing){
      this._startCharging();
    } else if(this.chargedAttack.isCharging){
      this._releaseChargedAttack();
    }
  }

  // الانطلاق
  if(Input.isDashPressed() && this.dash.cooldownTimer <= 0 && this.dash.dashesLeft > 0 && State.ability.has('dash')){
    this._doDash();
  }

  // الطيران
  if(State.ability.has('glide') && Input.isJumpDown() && !this.physics.onGround && this.sprite.body.velocity.y > 0){
    this.glide.isGliding = true;
  } else {
    this.glide.isGliding = false;
  }

  // تبديل السلاح
  if(Input.isSwitchWeaponPressed()){
    this._switchWeapon();
  }
};

// ═══ القفز العادي ═══
Player._doJump = function(){
  this.sprite.body.setVelocityY(CFG.PLAYER.JUMP_VELOCITY);
  this.physics.jumpReleased = false;
  this.physics.jumpCount = 1;
  this.runtime.timeInAir = 0;
  Audio.playJump();
  this._spawnDust(6);
  Events.emit(Events.NAMES.PLAYER_JUMP, { type: 'normal' });
};

// ═══ القفز المزدوج ═══
Player._doDoubleJump = function(){
  this.sprite.body.setVelocityY(CFG.PLAYER.DOUBLE_JUMP_VELOCITY);
  this.doubleJump.used = true;
  this.physics.jumpReleased = false;
  this.physics.jumpCount = 2;
  Audio.playJump();
  this._spawnDoubleJumpParticles();
  Events.emit(Events.NAMES.PLAYER_JUMP, { type: 'double' });
};

// ═══ القفز من الجدار ═══
Player._doWallJump = function(){
  const jumpDir = -this.physics.onWall;
  this.sprite.body.setVelocityX(jumpDir * 200);
  this.sprite.body.setVelocityY(CFG.PLAYER.JUMP_VELOCITY * 0.9);
  this.facing = jumpDir;
  this.sprite.setFlipX(jumpDir < 0);
  this.wallJump.jumpCooldown = 300;
  this.wallJump.isSliding = false;
  Audio.playJump();
  this._spawnDust(4);
  Events.emit(Events.NAMES.PLAYER_JUMP, { type: 'wall' });
};

// ═══ الهبوط ═══
Player._onLand = function(){
  this.physics.landTimer = 100;
  this.physics.jumpReleased = true;
  Audio.playLand();
  this._spawnDust(8);
  Events.emit(Events.NAMES.PLAYER_LAND);
};

// ═══ الهجوم ═══
Player._doAttack = function(){
  const weapon = State.weapon.getCurrent();
  const weaponData = CFG.WEAPONS[weapon];

  this.attack.isAttacking = true;
  this.attack.attackTimer = 250;
  this.attack.cooldown = weaponData.cooldown;
  this.attack.lastAttackTime = this.scene.time.now;
  this.attack.hitEnemiesThisSwing = [];
  this.state = 'attack';
  this._playAnim('attack', true);
  Audio.playAttack();
  this._checkAttackHit();
  this._spawnAttackArc();

  Events.emit(Events.NAMES.PLAYER_ATTACK, {
    weapon: weapon,
    damage: State.weapon.getDamage(weapon)
  });
};

// ═══ كشف الأعداء المضروبين ═══
Player._checkAttackHit = function(){
  const weapon = State.weapon.getCurrent();
  const weaponData = CFG.WEAPONS[weapon];
  const damage = State.weapon.getDamage(weapon);
  const px = this.sprite.x;
  const py = this.sprite.y;

  const hitbox = this.facing === 1
    ? new Phaser.Geom.Rectangle(px + 10, py - 30, weaponData.range, 60)
    : new Phaser.Geom.Rectangle(px - weaponData.range - 10, py - 30, weaponData.range, 60);

  if(typeof Enemies !== 'undefined' && Enemies.group){
    Enemies.group.getChildren().forEach(e => {
      if(!e.active || !e.body.enable) return;
      if(this.attack.hitEnemiesThisSwing.includes(e)) return;
      if(Phaser.Geom.Intersects.RectangleToRectangle(hitbox, e.getBounds())){
        this.attack.hitEnemiesThisSwing.push(e);
        if(typeof Enemies.damage === 'function'){
          Enemies.damage(this.scene, e, damage, true);
        }
      }
    });
  }

  if(typeof Bosses !== 'undefined' && Bosses.current && Bosses.current.active && !Bosses.current._defeated){
    if(Phaser.Geom.Intersects.RectangleToRectangle(hitbox, Bosses.current.getBounds())){
      if(typeof Bosses.damage === 'function'){
        Bosses.damage(this.scene, damage);
      }
    }
  }
};

// ═══ بدء الشحن ═══
Player._startCharging = function(){
  if(this.chargedAttack.isCharging) return;
  this.chargedAttack.isCharging = true;
  this.chargedAttack.chargeTime = 0;
  this.chargedAttack.chargeRatio = 0;

  this.chargedAttack.aura = this.scene.add.circle(this.sprite.x, this.sprite.y, 40, 0xffd700, 0.3);
  this.chargedAttack.aura.setDepth(90);
};

// ═══ إطلاق الشحن ═══
Player._releaseChargedAttack = function(){
  if(!this.chargedAttack.isCharging) return;

  const ratio = this.chargedAttack.chargeRatio;

  if(this.chargedAttack.aura){
    this.chargedAttack.aura.destroy();
    this.chargedAttack.aura = null;
  }

  if(ratio >= 0.8){
    const weapon = State.weapon.getCurrent();
    const baseDamage = State.weapon.getDamage(weapon);
    const chargedDamage = Math.floor(baseDamage * 3);

    this._spawnChargedExplosion();

    if(typeof Enemies !== 'undefined' && Enemies.group){
      Enemies.group.getChildren().forEach(e => {
        if(!e.active || !e.body.enable) return;
        const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, e.x, e.y);
        if(dist < 120){
          if(typeof Enemies.damage === 'function'){
            Enemies.damage(this.scene, e, chargedDamage, true);
          }
        }
      });
    }

    this.scene.cameras.main.shake(300, 0.02);
    Audio.playBoom();
    Events.emit('player:charged_attack', { damage: chargedDamage });
  }

  this.chargedAttack.isCharging = false;
  this.chargedAttack.chargeTime = 0;
  this.chargedAttack.chargeRatio = 0;
};

// ═══ تحديث الهجوم ═══
Player._updateAttack = function(delta){
  if(!this.attack.isAttacking) return;
  this.attack.attackTimer -= delta;
  if(this.attack.attackTimer <= 0){
    this.attack.isAttacking = false;
    this.anim.currentKey = null;
  }
};

// ═══ تحديث الشحن ═══
Player._updateChargedAttack = function(delta){
  if(!this.chargedAttack.isCharging) return;

  this.chargedAttack.chargeTime += delta;
  this.chargedAttack.chargeRatio = Math.min(1, this.chargedAttack.chargeTime / this.chargedAttack.chargeMax);

  if(this.chargedAttack.aura){
    this.chargedAttack.aura.x = this.sprite.x;
    this.chargedAttack.aura.y = this.sprite.y;
    const scale = 0.5 + this.chargedAttack.chargeRatio * 0.8;
    this.chargedAttack.aura.setScale(scale);
    this.chargedAttack.aura.setAlpha(0.3 + this.chargedAttack.chargeRatio * 0.4);
  }
};

// ═══ الانطلاق ═══
Player._doDash = function(){
  this.dash.isDashing = true;
  this.dash.dashTimer = CFG.PLAYER.DASH_DURATION;
  this.dash.cooldownTimer = CFG.PLAYER.DASH_COOLDOWN;
  this.dash.dashesLeft--;
  this.dash.direction = this.facing;

  this.sprite.body.setVelocityX(this.facing * CFG.PLAYER.DASH_SPEED);
  this.sprite.body.setVelocityY(0);
  this.sprite.body.setAllowGravity(false);
  this.sprite.setAlpha(0.7);

  this._spawnDashParticles();
  Audio.playDash();
  Events.emit(Events.NAMES.PLAYER_DASH);
};

Player._updateDash = function(delta){
  if(this.dash.cooldownTimer > 0) this.dash.cooldownTimer -= delta;
  if(!this.dash.isDashing) return;

  this.dash.dashTimer -= delta;

  if(Math.random() < 0.5) this._spawnAfterimage();

  if(this.dash.dashTimer <= 0){
    this.dash.isDashing = false;
    this.sprite.body.setAllowGravity(true);
    this.sprite.setAlpha(1);
  }
};

// ═══ الانزلاق على الجدار ═══
Player._updateWallSlide = function(dt){
  if(!State.ability.has('wallJump')) return;

  const shouldSlide = this.physics.onWall !== 0
    && !this.physics.onGround
    && this.sprite.body.velocity.y > 0
    && this.facing === this.physics.onWall;

  if(shouldSlide){
    this.wallJump.isSliding = true;
    if(this.sprite.body.velocity.y > this.wallJump.slideSpeed){
      this.sprite.body.setVelocityY(this.wallJump.slideSpeed);
    }
  } else {
    this.wallJump.isSliding = false;
  }
};

// ═══ الطيران ═══
Player._updateGlide = function(dt){
  if(!this.glide.isGliding) return;

  if(this.sprite.body.velocity.y > this.glide.maxGlideSpeed){
    this.sprite.body.setVelocityY(this.glide.maxGlideSpeed);
  }

  this.glide.particleTimer += dt;
  if(this.glide.particleTimer > 0.1){
    this._spawnGlideParticle();
    this.glide.particleTimer = 0;
  }
};

console.log('✅ Player (part 2/3) loaded');

// ═══════════════════════════════════════════════════
//              الجزء 3/3 — الصحة والموت والجسيمات
// ═══════════════════════════════════════════════════

// ═══ تحديث الصحة ═══
Player._updateHealth = function(delta){
  if(this.health.invulnTimer > 0){
    this.health.invulnTimer -= delta;
    const blink = Math.floor(this.health.invulnTimer / 60) % 2 === 0;
    this.sprite.alpha = blink ? 0.3 : 1;

    if(this.health.invulnTimer <= 0){
      this.sprite.alpha = 1;
      this.sprite.clearTint();
    }
  }

  if(this.health.hurtTimer > 0){
    this.health.hurtTimer -= delta;
  }
};

// ═══ استقبال الضرر ═══
Player.takeDamage = function(amount, fromX = null){
  if(this.health.invulnTimer > 0) return false;
  if(State.ability.has('godMode')) return false;

  State.hp.damage(amount);
  this.health.invulnTimer = CFG.PLAYER.INVULN_TIME;
  this.health.hurtTimer = 300;

  this.sprite.setTint(0xff0000);
  this.scene.cameras.main.shake(200, 0.01);

  if(fromX !== null){
    const dir = this.sprite.x < fromX ? -1 : 1;
    this.sprite.body.setVelocityX(dir * 180);
    this.sprite.body.setVelocityY(-200);
  }

  Audio.playHurt();
  Events.emit(Events.NAMES.PLAYER_HURT, { amount: amount });

  if(State.hp.isDead()){
    this.die();
  }

  return true;
};

// ═══ الموت ═══
Player.die = function(){
  if(this.state === 'die') return;

  this.state = 'die';
  this.sprite.body.setVelocity(0, 0);
  this._playAnim('die', true);
  Audio.playDeath();
  this.scene.cameras.main.shake(500, 0.02);

  Events.emit(Events.NAMES.PLAYER_DIED);

  this.scene.time.delayedCall(2000, () => {
    this.respawn();
  });
};

// ═══ إعادة الظهور ═══
Player.respawn = function(x, y){
  const spawnX = x !== undefined ? x : 60;
  const spawnY = y !== undefined ? y : CFG.GH - 200;

  this.sprite.x = spawnX;
  this.sprite.y = spawnY;
  this.sprite.body.setVelocity(0, 0);
  this.sprite.setAlpha(1);
  this.sprite.clearTint();

  State.data.player.hp = State.data.player.maxHp;
  State.save();

  this._resetState();
  this._playAnim('idle', true);

  Events.emit(Events.NAMES.PLAYER_RESPAWN);
  console.log('🔄 Player respawned');
};

// ═══ تبديل السلاح ═══
Player._switchWeapon = function(){
  const newWeapon = State.weapon.cycle();
  if(newWeapon !== this.anim.weaponSuffix){
    this.anim.weaponSuffix = newWeapon;
    this._playAnim(this.state, true);
    Audio.playUISelect();
    Events.emit(Events.NAMES.WEAPON_SWITCHED, { weapon: newWeapon });
  }
};

// ═══ تحديث الأنيميشن ═══
Player._updateAnimation = function(){
  if(this.state === 'die') return;
  if(this.attack.isAttacking) return;

  let targetState = 'idle';

  if(!this.physics.onGround){
    if(this.sprite.body.velocity.y < 0){
      targetState = 'jump';
    } else {
      targetState = 'fall';
    }
  } else {
    const absVel = Math.abs(this.sprite.body.velocity.x);
    if(absVel > 120){
      targetState = 'run';
    } else if(absVel > 15){
      targetState = 'walk';
    } else {
      targetState = 'idle';
    }
  }

  // نقارن المفتاح الفعلي بدل state
  const weapon = this.anim.weaponSuffix;
  const targetKey = weapon + '-' + targetState;

  if(this.anim.currentKey !== targetKey){
    this.state = targetState;
    this._playAnim(targetState, true);
  }
};

// ═══ تشغيل أنيميشن ═══
Player._playAnim = function(stateName, force = false){
  if(!this.sprite || !this.sprite.anims) return;

  const weapon = this.anim.weaponSuffix;
  const key = weapon + '-' + stateName;

  if(!this.scene.anims.exists(key)) return;
  if(!force && this.anim.currentKey === key) return;

  this.anim.lastKey = this.anim.currentKey;
  this.anim.currentKey = key;

  try {
    this.sprite.play(key, true);
  } catch(e) {}
};

// ═══ الإحصائيات ═══
Player._debugSize = function(){
  if(!this.sprite) return "";
  return "w:" + Math.round(this.sprite.displayWidth) + " h:" + Math.round(this.sprite.displayHeight);
};

Player._updateRuntime = function(delta){
  if(!this.physics.onGround){
    this.runtime.timeInAir += delta;
  } else {
    this.runtime.timeInAir = 0;
  }

  const dx = Math.abs(this.sprite.body.velocity.x) * (delta / 1000);
  this.runtime.distanceTraveled += dx;
};

// ═══════════════════════════════════════════════════
//                    الجسيمات
// ═══════════════════════════════════════════════════

Player._spawnDust = function(count){
  if(!this.scene) return;
  for(let i = 0; i < count; i++){
    const p = this.scene.add.rectangle(this.sprite.x, this.sprite.y + 20, 3, 3, 0xaaaaaa);
    p.setDepth(99);
    p.setAlpha(0.6);
    const angle = Math.random() * Math.PI - Math.PI / 2;
    const dist = 20 + Math.random() * 20;
    this.scene.tweens.add({
      targets: p,
      x: p.x + Math.cos(angle) * dist,
      y: p.y + Math.sin(angle) * dist,
      alpha: 0,
      scale: 0.2,
      duration: 400,
      onComplete: () => p.destroy()
    });
  }
};

Player._spawnDoubleJumpParticles = function(){
  if(!this.scene) return;
  for(let i = 0; i < 12; i++){
    const angle = (i / 12) * Math.PI * 2;
    const p = this.scene.add.circle(this.sprite.x, this.sprite.y, 3, 0xffd700);
    p.setDepth(99);
    this.scene.tweens.add({
      targets: p,
      x: p.x + Math.cos(angle) * 40,
      y: p.y + Math.sin(angle) * 40,
      alpha: 0,
      scale: 0,
      duration: 400,
      onComplete: () => p.destroy()
    });
  }
};

Player._spawnDashParticles = function(){
  if(!this.scene) return;
  for(let i = 0; i < 8; i++){
    const p = this.scene.add.rectangle(
      this.sprite.x - this.facing * 20,
      this.sprite.y + (Math.random() * 40 - 20),
      4, 4, 0x88ddff
    );
    p.setDepth(99);
    this.scene.tweens.add({
      targets: p,
      x: p.x - this.facing * 60,
      alpha: 0,
      duration: 300,
      onComplete: () => p.destroy()
    });
  }
};

Player._spawnAfterimage = function(){
  if(!this.scene) return;
  const afterimage = this.scene.add.image(
    this.sprite.x,
    this.sprite.y,
    this.sprite.texture.key
  );
  afterimage.setDepth(99);
  afterimage.setAlpha(0.4);
  afterimage.setScale(CFG.PLAYER.SCALE);
  afterimage.setFlipX(this.sprite.flipX);
  afterimage.setTint(0x88ddff);
  this.scene.tweens.add({
    targets: afterimage,
    alpha: 0,
    duration: 300,
    onComplete: () => afterimage.destroy()
  });
};

Player._spawnGlideParticle = function(){
  if(!this.scene) return;
  const p = this.scene.add.circle(
    this.sprite.x + (Math.random() * 20 - 10),
    this.sprite.y + 20,
    2, 0xffffff
  );
  p.setDepth(99);
  p.setAlpha(0.5);
  this.scene.tweens.add({
    targets: p,
    y: p.y + 40,
    alpha: 0,
    duration: 500,
    onComplete: () => p.destroy()
  });
};

Player._spawnAttackArc = function(){
  if(!this.scene) return;
  const arcX = this.facing === 1 ? this.sprite.x + 30 : this.sprite.x - 30;
  const arcY = this.sprite.y;
  const arc = this.scene.add.circle(arcX, arcY, 20, 0xffcc66, 0.6);
  arc.setDepth(101);

  this.scene.tweens.add({
    targets: arc,
    alpha: 0,
    scaleX: 2,
    scaleY: 2,
    duration: 300,
    onComplete: () => { try { arc.destroy(); } catch(e){} }
  });

  // شبكة امان: حذف مضمون
  this.scene.time.delayedCall(500, () => {
    try { if(arc && arc.active) arc.destroy(); } catch(e){}
  });
};

Player._spawnChargedExplosion = function(){
  if(!this.scene) return;
  for(let i = 0; i < 30; i++){
    const angle = Math.random() * Math.PI * 2;
    const p = this.scene.add.circle(this.sprite.x, this.sprite.y, 5, 0xffd700);
    p.setDepth(101);
    this.scene.tweens.add({
      targets: p,
      x: p.x + Math.cos(angle) * 120,
      y: p.y + Math.sin(angle) * 120,
      alpha: 0,
      scale: 0,
      duration: 600,
      onComplete: () => p.destroy()
    });
  }
};

// ═══════════════════════════════════════════════════
//                  استعلامات مساعدة
// ═══════════════════════════════════════════════════
Player.getX = function(){ return this.sprite ? this.sprite.x : 0; };
Player.getY = function(){ return this.sprite ? this.sprite.y : 0; };
Player.isAlive = function(){ return this.sprite && this.sprite.active && this.state !== 'die'; };
Player.isOnGround = function(){ return this.physics.onGround; };
Player.isAttacking = function(){ return this.attack.isAttacking; };
Player.isDashing = function(){ return this.dash.isDashing; };
Player.getFacing = function(){ return this.facing; };

// ═══ إعادة تعيين كامل ═══
Player.reset = function(x, y){
  this._resetState();
  if(this.sprite){
    this.sprite.x = x || 60;
    this.sprite.y = y || 100;
    this.sprite.body.setVelocity(0, 0);
    this.sprite.setAlpha(1);
    this.sprite.clearTint();
    this._playAnim('idle', true);
  }
};

// ═══ تنظيف ═══
Player.destroy = function(){
  if(this.sprite){
    this.sprite.destroy();
    this.sprite = null;
  }
  if(this.chargedAttack.aura){
    this.chargedAttack.aura.destroy();
    this.chargedAttack.aura = null;
  }
};

console.log('✅ Player system loaded (3/3)');
