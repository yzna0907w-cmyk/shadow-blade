// ═══════════════════════════════════════
// البطل: أُوار
// ═══════════════════════════════════════
const Player = {
  sprite: null,
  facing: 1,
  invulnTimer: 0,
  coyoteTimer: 0,
  jumpPressedAt: 0,
  lastAttack: 0,
  jumpsLeft: 0,
  isDashing: false,
  isAttacking: false,
  attackEndTime: 0,
  dashTimer: 0,
  _wasOnGround: true,
  _prevJump: false,

  // ═══ تحميل الصور ═══
  preload(scene){
    const base = 'assets/hero/knight-3/';
    // Idle
    for(let i=0;i<4;i++) scene.load.image('hero-idle-'+i, base+'idle-'+i+'.png');
    // Run
    for(let i=0;i<6;i++) scene.load.image('hero-run-'+i, base+'run-'+i+'.png');
    // Jump
    for(let i=0;i<4;i++) scene.load.image('hero-jump-'+i, base+'jump-'+i+'.png');
    // Attack
    for(let i=0;i<5;i++) scene.load.image('hero-attack-'+i, base+'attack-'+i+'.png');
    // Hurt
    scene.load.image('hero-hurt', base+'hurt.png');
    // Death
    for(let i=0;i<4;i++) scene.load.image('hero-die-'+i, base+'die-'+i+'.png');
  },

  // ═══ إنشاء الأنيميشن ═══
  createAnimations(scene){
    const A = scene.anims;
    if(A.exists('hero-idle')) return;

    A.create({ key:'hero-idle', frames:[0,1,2,3].map(i=>({key:'hero-idle-'+i})), frameRate:6, repeat:-1 });
    A.create({ key:'hero-run', frames:[0,1,2,3,4,5].map(i=>({key:'hero-run-'+i})), frameRate:16, repeat:-1 });
    A.create({ key:'hero-jump', frames:[0,1,2,3].map(i=>({key:'hero-jump-'+i})), frameRate:10, repeat:0 });
    A.create({ key:'hero-attack', frames:[0,1,2,3,4].map(i=>({key:'hero-attack-'+i})), frameRate:5, repeat:0 });
    A.create({ key:'hero-hurt', frames:[{key:'hero-hurt'}], frameRate:1, repeat:0 });
    A.create({ key:'hero-die', frames:[0,1,2,3].map(i=>({key:'hero-die-'+i})), frameRate:5, repeat:0 });
  },

  // ═══ إنشاء البطل ═══
  create(scene, x, y){
    this.sprite = scene.physics.add.sprite(x, y, 'hero-idle-0');
    this.sprite.setDepth(10);
    this.sprite.setScale(CFG.PLAYER_SCALE);
    this.sprite.body.setSize(16, 30).setOffset(24, 24);
    this.sprite.body.setCollideWorldBounds(true);
    this.sprite.body.setMaxVelocity(400, 700);
    this.sprite.play('hero-idle');
    this.facing = 1;
    this.jumpsLeft = State.data.abilities.doubleJump ? 2 : 1;
    return this.sprite;
  },

  // ═══ التحديث ═══
  update(time, delta, cursors, keys, keysMap){
    if(!this.sprite || !this.sprite.active) return;

    const left = cursors.left.isDown || keys.A.isDown || keysMap.left;
    const right = cursors.right.isDown || keys.D.isDown || keysMap.right;
    const jumpDown = cursors.up.isDown || keys.W.isDown || keys.SPACE.isDown || keysMap.jump;
    const attackDown = keys.J.isDown || keys.K.isDown || keys.ENTER.isDown || keysMap.attack;

    // ═══ الحركة الأفقية ═══
    if(!this.isDashing){
      if(left && !right){
        this.sprite.body.setVelocityX(-CFG.MOVE_SPEED);
        this.facing = -1;
        this.sprite.setFlipX(true);
      } else if(right && !left){
        this.sprite.body.setVelocityX(CFG.MOVE_SPEED);
        this.facing = 1;
        this.sprite.setFlipX(false);
      } else {
        this.sprite.body.setVelocityX(0);
      }
    }

    // ═══ الأرض ═══
    const onGround = this.sprite.body.blocked.down || this.sprite.body.touching.down;
    if(onGround){
      this.coyoteTimer = CFG.COYOTE_TIME;
      this.jumpsLeft = State.data.abilities.doubleJump ? 2 : 1;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - delta);
    }

    // ═══ القفز ═══
    if(jumpDown && !this._prevJump) this.jumpPressedAt = time;
    this._prevJump = jumpDown;

    const canJump = (time - this.jumpPressedAt < CFG.JUMP_BUFFER);
    if(canJump){
      // قفز مزدوج
      if(!onGround && State.data.abilities.doubleJump && this.jumpsLeft > 0 && this.coyoteTimer <= 0){
        this.sprite.body.setVelocityY(CFG.DOUBLE_JUMP_VELOCITY);
        this.jumpsLeft--;
        this.jumpPressedAt = 0;
        if(scene.sound) scene.sound.play('sfx-jump', {volume: 0.4});
      }
      // قفز عادي
      else if(this.coyoteTimer > 0){
        this.sprite.body.setVelocityY(CFG.JUMP_VELOCITY);
        this.jumpPressedAt = 0;
        this.coyoteTimer = 0;
        if(scene.sound) scene.sound.play('sfx-jump', {volume: 0.4});
      }
    }

    // ═══ الانطلاق (Dash) ═══
    if(State.data.abilities.dash && keys.SHIFT && keys.SHIFT.isDown && !this.isDashing && onGround){
      this.isDashing = true;
      this.dashTimer = CFG.DASH_DURATION;
      this.sprite.body.setVelocityX(this.facing * CFG.DASH_SPEED);
      this.sprite.setAlpha(0.7);
    }
    if(this.isDashing){
      this.dashTimer -= delta;
      if(this.dashTimer <= 0){
        this.isDashing = false;
        this.sprite.setAlpha(1);
      }
    }

    // ═══ الأنيميشن ═══
    if(this.invulnTimer > 0){
      this.invulnTimer -= delta;
      this.sprite.alpha = (Math.floor(time/60)%2===0) ? 0.3 : 1;
    } else {
      this.sprite.alpha = 1;
    }

    if(!onGround){
      this._setAnim('hero-jump');
    } else if(Math.abs(this.sprite.body.velocity.x) > 10){
      this._setAnim('hero-run');
    } else {
      this._setAnim('hero-idle');
    }

    // ═══ الهجوم ═══
    if(attackDown && time - this.lastAttack > CFG.ATK_COOLDOWN){
      this.lastAttack = time;
      this.attack(scene);
    }
  },

  _setAnim(key){
    if(!this.sprite.anims) return;
    if(this.sprite.anims.currentAnim && this.sprite.anims.currentAnim.key === key) return;
    this.sprite.play(key, true);
  },

  // ═══ الهجوم ═══
  attack(scene){
    this.isAttacking = true;
    this.attackEndTime = scene.time.now + 400;
    this.sprite.play("hero-attack", true);
    if(scene.sound) scene.sound.play("sfx-attack", {volume: 0.5});
    const range = this._getAttackRange();
    // كشف الأعداء
    if(Enemies.group){
      Enemies.group.getChildren().forEach(e => {
        if(e.active && e.body.enable && Phaser.Geom.Intersects.RectangleToRectangle(range, e.getBounds())){
          Enemies.damage(scene, e, CFG.PLAYER_DAMAGE, true);
        }
      });
    }
    // كشف البوس
    if(Bosses.current && Bosses.current.active && !Bosses.current._defeated){
      if(Phaser.Geom.Intersects.RectangleToRectangle(range, Bosses.current.getBounds())){
        Bosses.damage(scene, CFG.PLAYER_DAMAGE);
      }
    }
    return range;
  },

  _getAttackRange(){
    const x = this.sprite.x;
    const y = this.sprite.y;
    return this.facing === 1
      ? new Phaser.Geom.Rectangle(x + 10, y - 25, CFG.ATK_RANGE, 50)
      : new Phaser.Geom.Rectangle(x - CFG.ATK_RANGE - 10, y - 25, CFG.ATK_RANGE, 50);
  },

  // ═══ استقبال الضرر ═══
  hurt(scene, dmg){
    if(this.invulnTimer > 0) return false;
    State.data.hp -= dmg;
    this.invulnTimer = CFG.INVULN_TIME;
    this.sprite.setTint(0xff0000);
    scene.time.delayedCall(200, ()=>{ if(this.sprite) this.sprite.clearTint(); });
    if(scene.sound) scene.sound.play('sfx-hurt', {volume: 0.6});
    return true;
  },

  // ═══ الموت ═══
  die(scene){
    this.sprite.play('hero-die', true);
    this.sprite.body.setVelocity(0, 0);
  },

  // ═══ إعادة الظهور ═══
  respawn(x, y){
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.body.setVelocity(0, 0);
    this.sprite.play('hero-idle');
    this.invulnTimer = 2000;
    State.data.hp = State.data.maxHp;
  }
};
