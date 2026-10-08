// ═══════════════════════════════════════════════════
// EMBER — نظام الألغاز (1/2)
// ═══════════════════════════════════════════════════
'use strict';

const Puzzles = {

  scene: null,
  puzzleGroups: {},
  active: [],

  // ═══ التهيئة ═══
  init(scene){
    this.scene = scene;
    this.puzzleGroups = {};
    this.active = [];
    console.log('✅ Puzzles system initialized');
  },

  // ═══ Preload ═══
  preload(scene){
    scene.load.image('puzzle-spike', 'assets/ui/spike.png');
    scene.load.image('puzzle-plate', 'assets/ui/plate.png');
    scene.load.image('puzzle-lever', 'assets/ui/lever.png');
    scene.load.image('puzzle-door', 'assets/ui/door.png');
    scene.load.image('puzzle-key', 'assets/ui/key-gold.png');
    scene.load.image('puzzle-chest', 'assets/ui/chest-gold.png');
    scene.load.image('puzzle-brick', 'assets/ui/brick.png');

    console.log('✅ Puzzles preload done');
  },

  // ═══════════════════════════════════════════════
  // 1. الأشواك (Spikes)
  // ═══════════════════════════════════════════════
  createSpike(scene, x, y, options){
    options = options || {};
    const damage = options.damage || 15;
    const width = options.width || 32;
    const height = options.height || 16;

    const spike = scene.add.rectangle(x, y, width, height, 0xff3333, 0.8);
    spike.setDepth(15);
    spike.setStrokeStyle(2, 0xffffff);
    spike.damage = damage;
    spike.isSpike = true;

    // جسم فيزيائي
    scene.physics.add.existing(spike, true);
    spike.body.setSize(width, height);

    spike.checkTimer = scene.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        const player = Player.sprite;
        if(!player || !player.active) return;
        if(Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), spike.getBounds())){
          Player.takeDamage(spike.damage, spike.x);
        }
      }
    });

    this.active.push({ type: 'spike', obj: spike });
    return spike;
  },

  // ═══════════════════════════════════════════════
  // 2. ألواح الضغط (Pressure Plates)
  // ═══════════════════════════════════════════════
  createPlate(scene, x, y, targetDoor, options){
    options = options || {};

    const plate = scene.add.rectangle(x, y, 60, 12, 0x6a4a2a);
    plate.setDepth(10);
    plate.setStrokeStyle(2, 0xff8c3c);
    plate.isPlate = true;
    plate.pressed = false;
    plate.targetDoor = targetDoor;
    plate.stayPressed = options.stayPressed || false;

    scene.physics.add.existing(plate, true);
    plate.body.setSize(60, 12);

    // فحص الضغط
    plate.checkTimer = scene.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        if(!plate.active) return;

        const player = Player.sprite;
        if(!player || !player.active) return;

        const onPlate = Phaser.Geom.Intersects.RectangleToRectangle(
          player.getBounds(), plate.getBounds()
        );

        if(onPlate && !plate.pressed){
          this._pressPlate(plate);
        } else if(!onPlate && plate.pressed && !plate.stayPressed){
          this._releasePlate(plate);
        }
      }
    });

    this.active.push({ type: 'plate', obj: plate });
    return plate;
  },

  _pressPlate(plate){
    plate.pressed = true;
    plate.setFillStyle(0xff8c3c);

    if(plate.targetDoor && plate.targetDoor.active){
      this._openDoor(plate.targetDoor);
    }

    Audio.playUISuccess();
    Events.emit('puzzle:plate_pressed', { plate: plate });
  },

  _releasePlate(plate){
    plate.pressed = false;
    plate.setFillStyle(0x6a4a2a);

    if(plate.targetDoor && plate.targetDoor.active && !plate.stayPressed){
      this._closeDoor(plate.targetDoor);
    }
  },

  // ═══════════════════════════════════════════════
  // 3. الرافعات (Levers)
  // ═══════════════════════════════════════════════
  createLever(scene, x, y, targetDoor, options){
    options = options || {};

    const lever = scene.add.circle(x, y, 20, 0x4a3a2a);
    lever.setDepth(10);
    lever.setStrokeStyle(3, 0xff8c3c);
    lever.isLever = true;
    lever.pulled = false;
    lever.targetDoor = targetDoor;

    // إضافة عصا
    const stick = scene.add.rectangle(x, y - 15, 6, 30, 0x8a6a4a);
    stick.setDepth(11);
    lever.stick = stick;

    scene.physics.add.existing(lever, true);
    lever.body.setSize(40, 40);

    // فحص النقر/الاقتراب
    lever.checkTimer = scene.time.addEvent({
      delay: 150,
      loop: true,
      callback: () => {
        if(!lever.active || lever.pulled) return;

        const player = Player.sprite;
        if(!player || !player.active) return;

        const dist = Phaser.Math.Distance.Between(player.x, player.y, lever.x, lever.y);
        if(dist < 50 && Input.isAttackPressed()){
          this._pullLever(lever);
        }
      }
    });

    this.active.push({ type: 'lever', obj: lever });
    return lever;
  },

  _pullLever(lever){
    lever.pulled = true;
    lever.setFillStyle(0x22c55e);

    // حركة العصا
    if(lever.stick && this.scene){
      this.scene.tweens.add({
        targets: lever.stick,
        angle: 45,
        duration: 200
      });
    }

    if(lever.targetDoor && lever.targetDoor.active){
      this._openDoor(lever.targetDoor);
    }

    Audio.playUISuccess();
    Events.emit('puzzle:lever_pulled', { lever: lever });
  },

  // ═══════════════════════════════════════════════
  // 4. الأبواب (Doors)
  // ═══════════════════════════════════════════════
  createDoor(scene, x, y, options){
    options = options || {};
    const width = options.width || 40;
    const height = options.height || 100;
    const needsKey = options.needsKey || false;
    const keyId = options.keyId || null;

    const door = scene.add.rectangle(x, y, width, height, 0x4a3a2a);
    door.setDepth(8);
    door.setStrokeStyle(3, 0xff8c3c);
    door.isDoor = true;
    door.isOpen = false;
    door.needsKey = needsKey;
    door.keyId = keyId;
    door.originalY = y;

    // جسم فيزيائي (يصد اللاعب)
    scene.physics.add.existing(door, true);
    door.body.setSize(width, height);

    // تصادم
    if(scene.platforms){
      scene.platforms.add(door);
    }

    this.active.push({ type: 'door', obj: door });
    return door;
  },

  _openDoor(door){
    if(door.isOpen) return;
    door.isOpen = true;

    // حركة
    if(this.scene){
      this.scene.tweens.add({
        targets: door,
        y: door.originalY - door.height,
        alpha: 0.3,
        duration: 500
      });
    }

    if(door.body){
      door.body.enable = false;
    }

    Audio.playDoor();
    Events.emit('puzzle:door_opened', { door: door });
  },

  _closeDoor(door){
    if(!door.isOpen) return;
    door.isOpen = false;

    if(this.scene){
      this.scene.tweens.add({
        targets: door,
        y: door.originalY,
        alpha: 1,
        duration: 500
      });
    }

    if(door.body){
      door.body.enable = true;
    }
  },

  // ═══════════════════════════════════════════════
  // 5. الجدران القابلة للتكسير (Breakable Walls)
  // ═══════════════════════════════════════════════
  createBreakableWall(scene, x, y, options){
    options = options || {};
    const width = options.width || 40;
    const height = options.height || 80;
    const hp = options.hp || 3;

    const wall = scene.add.rectangle(x, y, width, height, 0x5a4a3a);
    wall.setDepth(8);
    wall.setStrokeStyle(2, 0x3a2a1a);
    wall.isWall = true;
    wall.hp = hp;

    scene.physics.add.existing(wall, true);
    wall.body.setSize(width, height);

    if(scene.platforms){
      scene.platforms.add(wall);
    }

    // فحص الضرب
    const checkTimer = scene.time.addEvent({
      delay: 200,
      loop: true,
      callback: () => {
        if(!wall.active) return;
        if(!Player.sprite || !Player.isAttacking()) return;

        const range = Player._getAttackRange();
        if(Phaser.Geom.Intersects.RectangleToRectangle(range, wall.getBounds())){
          this._hitWall(wall);
        }
      }
    });
    wall.checkTimer = checkTimer;

    this.active.push({ type: 'wall', obj: wall });
    return wall;
  },

  _hitWall(wall){
    wall.hp--;
    wall.setFillStyle(0x8a6a4a);

    if(this.scene){
      this.scene.tweens.add({
        targets: wall,
        alpha: 0.5,
        duration: 100,
        yoyo: true
      });
    }

    if(wall.hp <= 0){
      this._breakWall(wall);
    } else {
      Audio.playHit();
    }
  },

  _breakWall(wall){
    if(this.scene){
      // جسيمات
      for(let i = 0; i < 15; i++){
        const p = this.scene.add.rectangle(wall.x, wall.y, 4, 4, 0x5a4a3a);
        p.setDepth(15);
        this.scene.tweens.add({
          targets: p,
          x: p.x + (Math.random() - 0.5) * 100,
          y: p.y + (Math.random() - 0.5) * 100,
          alpha: 0,
          duration: 500,
          onComplete: () => p.destroy()
        });
      }
    }

    if(wall.body) wall.body.enable = false;
    if(wall.checkTimer) wall.checkTimer.remove();

    Audio.playBreak();
    Events.emit('puzzle:wall_broken', { wall: wall });

    wall.destroy();
  },

  // ═══════════════════════════════════════════════
  // 6. المنصات المتحللة (Crumbling Platforms)
  // ═══════════════════════════════════════════════
  createCrumblingPlatform(scene, x, y, options){
    options = options || {};
    const width = options.width || 100;
    const delay = options.delay || 500;
    const respawnTime = options.respawnTime || 3000;

    const platform = scene.add.rectangle(x, y, width, 15, 0x6a5a4a);
    platform.setDepth(5);
    platform.setStrokeStyle(1, 0x3a2a1a);
    platform.isCrumbling = true;
    platform.isCrumblingNow = false;

    scene.physics.add.existing(platform, true);
    platform.body.setSize(width, 15);
    platform.body.setAllowGravity(false);
    platform.body.setImmovable(true);

    if(scene.platforms){
      scene.platforms.add(platform);
    }

    // فحص الوقوف
    const checkTimer = scene.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        if(!platform.active || platform.isCrumblingNow) return;

        const player = Player.sprite;
        if(!player || !player.active) return;

        const onPlatform = player.body.blocked.down &&
          Math.abs(player.x - platform.x) < width / 2 + 20 &&
          Math.abs(player.y - platform.y) < 30;

        if(onPlatform){
          this._startCrumble(platform, delay, respawnTime);
        }
      }
    });
    platform.checkTimer = checkTimer;

    this.active.push({ type: 'crumbling', obj: platform });
    return platform;
  },

  _startCrumble(platform, delay, respawnTime){
    platform.isCrumblingNow = true;

    if(this.scene){
      this.scene.tweens.add({
        targets: platform,
        alpha: 0.5,
        duration: 100,
        yoyo: true,
        repeat: Math.floor(delay / 200)
      });

      this.scene.time.delayedCall(delay, () => {
        if(!platform.active) return;
        this._destroyPlatform(platform);

        this.scene.time.delayedCall(respawnTime, () => {
          this._respawnPlatform(platform);
        });
      });
    }
  },

  _destroyPlatform(platform){
    if(platform.body) platform.body.enable = false;
    platform.setVisible(false);
    Audio.playBreak();

    if(this.scene){
      for(let i = 0; i < 10; i++){
        const p = this.scene.add.rectangle(platform.x, platform.y, 5, 5, 0x6a5a4a);
        p.setDepth(15);
        this.scene.tweens.add({
          targets: p,
          y: p.y + 100,
          alpha: 0,
          duration: 600,
          onComplete: () => p.destroy()
        });
      }
    }
  },

  _respawnPlatform(platform){
    if(!platform.active) return;
    platform.setVisible(true);
    platform.setAlpha(1);
    platform.isCrumblingNow = false;
    if(platform.body) platform.body.enable = true;
  },

  // ═══════════════════════════════════════════════
  // 7. المنصات المتحركة (Moving Platforms)
  // ═══════════════════════════════════════════════
  createMovingPlatform(scene, x, y, options){
    options = options || {};
    const width = options.width || 100;
    const moveX = options.moveX || 200;
    const moveY = options.moveY || 0;
    const duration = options.duration || 2000;

    const platform = scene.add.rectangle(x, y, width, 15, 0x5a6a7a);
    platform.setDepth(5);
    platform.setStrokeStyle(2, 0x8ac0e0);
    platform.isMoving = true;

    scene.physics.add.existing(platform, true);
    platform.body.setSize(width, 15);
    platform.body.setAllowGravity(false);
    platform.body.setImmovable(true);

    if(scene.platforms){
      scene.platforms.add(platform);
    }

    // حركة
    const tween = scene.tweens.add({
      targets: platform,
      x: x + moveX,
      y: y + moveY,
      duration: duration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        if(platform.body) platform.body.updateFromGameObject();
      }
    });
    platform.moveTween = tween;

    this.active.push({ type: 'moving', obj: platform });
    return platform;
  },

  // ═══════════════════════════════════════════════
  // 8. الصناديق المقفلة (Locked Chests)
  // ═══════════════════════════════════════════════
  createLockedChest(scene, x, y, options){
    options = options || {};
    const keyId = options.keyId || 'key_gold';
    const rewards = options.rewards || { shards: 20, atoms: 2 };

    const chest = scene.add.rectangle(x, y, 50, 40, 0x6a4a1a);
    chest.setDepth(7);
    chest.setStrokeStyle(3, 0xffd700);
    chest.isChest = true;
    chest.keyId = keyId;
    chest.opened = false;
    chest.rewards = rewards;

    scene.physics.add.existing(chest, true);
    chest.body.setSize(50, 40);

    // فحص الفتح
    const checkTimer = scene.time.addEvent({
      delay: 200,
      loop: true,
      callback: () => {
        if(!chest.active || chest.opened) return;

        const player = Player.sprite;
        if(!player || !player.active) return;

        if(Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), chest.getBounds())){
          this._tryOpenChest(chest);
        }
      }
    });
    chest.checkTimer = checkTimer;

    this.active.push({ type: 'chest', obj: chest });
    return chest;
  },

  _tryOpenChest(chest){
    // فحص المفتاح
    if(!State.inventory.hasItem(chest.keyId)){
      this._showMsg('🔒 يحتاج مفتاح: ' + chest.keyId, '#ff8888');
      return;
    }

    // استخدام المفتاح
    State.inventory.removeItem(chest.keyId, 1);
    chest.opened = true;
    chest.setFillStyle(0xffd700);

    // المكافآت
    if(chest.rewards.shards) State.currency.add('shards', chest.rewards.shards);
    if(chest.rewards.atoms) State.currency.add('atoms', chest.rewards.atoms);
    if(chest.rewards.souls) State.currency.add('souls', chest.rewards.souls);

    // تأثيرات
    if(this.scene){
      this.scene.cameras.main.flash(300, 255, 215, 0);
      this._spawnRewardParticles(chest.x, chest.y);
    }

    Audio.playUISuccess();
    this._showMsg('🎁 حصلت على: ' + (chest.rewards.shards || 0) + '🪙 ' + (chest.rewards.atoms || 0) + '💎', '#ffd700');

    Events.emit('puzzle:chest_opened', { chest: chest, rewards: chest.rewards });

    if(chest.checkTimer) chest.checkTimer.remove();
    chest.destroy();
  },

  _spawnRewardParticles(x, y){
    if(!this.scene) return;
    for(let i = 0; i < 20; i++){
      const p = this.scene.add.circle(x, y, 4, 0xffd700);
      p.setDepth(150);
      const angle = (i / 20) * Math.PI * 2;
      this.scene.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * 80,
        y: y + Math.sin(angle) * 80,
        alpha: 0,
        scale: 0,
        duration: 800,
        onComplete: () => p.destroy()
      });
    }
  },

  // ═══ رسالة ═══
  _showMsg(text, color){
    const el = document.getElementById('npcHint');
    if(!el) return;

    el.textContent = text;
    el.style.color = color || '#ffd700';
    el.style.display = 'block';

    if(this._msgTimer) clearTimeout(this._msgTimer);
    this._msgTimer = setTimeout(() => { el.style.display = 'none'; }, 2500);
  },

  // ═══ التحديث ═══
  update(time, delta){
    // المنصات المتحركة - تحديث تلقائي
    this.active.forEach(p => {
      if(p.type === 'moving' && p.obj.body){
        p.obj.body.updateFromGameObject();
      }
    });
  },

  // ═══ التنظيف ═══
  clearAll(){
    this.active.forEach(p => {
      if(p.obj){
        if(p.obj.checkTimer) p.obj.checkTimer.remove();
        if(p.obj.moveTween) p.obj.moveTween.remove();
        if(p.obj.active) p.obj.destroy();
      }
    });
    this.active = [];
  },

  reset(){
    this.clearAll();
    this.scene = null;
  }
};

console.log('✅ Puzzles system (1/2) loaded');

// ═══════════════════════════════════════════════════
// الجزء 2/2 — ألغاز متقدمة (8 أنواع)
// ═══════════════════════════════════════════════════

// ═══════════════════════════════════════════════════
// 9. لوحات التسلسل (Sequence Plates)
// ═══════════════════════════════════════════════════
Puzzles.createSequencePlate = function(scene, x, y, order, options){
  options = options || {};
  const groupId = options.groupId || 'seq-1';
  const color = options.color || 0x6a4a2a;

  if(!this.puzzleGroups[groupId]){
    this.puzzleGroups[groupId] = {
      plates: [],
      pressedOrder: [],
      correctOrder: options.correctOrder || [0, 1, 2, 3],
      onComplete: options.onComplete || null,
      failed: false
    };
  }

  const plate = scene.add.rectangle(x, y, 50, 50, color);
  plate.setDepth(10);
  plate.setStrokeStyle(3, 0xff8c3c);
  plate.isSeqPlate = true;
  plate.plateIndex = order;
  plate.groupId = groupId;
  plate.pressed = false;
  plate.numLabel = scene.add.text(x, y, String(order + 1), {
    fontFamily: 'Arial', fontSize: '18px', color: '#ffd700', stroke: '#000', strokeThickness: 2
  }).setOrigin(0.5).setDepth(11);

  scene.physics.add.existing(plate, true);
  plate.body.setSize(50, 50);

  plate.checkTimer = scene.time.addEvent({
    delay: 150,
    loop: true,
    callback: () => {
      if(!plate.active || plate.pressed) return;
      const player = Player.sprite;
      if(!player || !player.active) return;

      if(Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), plate.getBounds())){
        this._pressSequencePlate(plate);
      }
    }
  });

  this.puzzleGroups[groupId].plates.push(plate);
  this.active.push({ type: 'seqplate', obj: plate });
  return plate;
};

Puzzles._pressSequencePlate = function(plate){
  const group = this.puzzleGroups[plate.groupId];
  if(!group) return;

  plate.pressed = true;
  plate.setFillStyle(0x22c55e);
  group.pressedOrder.push(plate.plateIndex);

  Audio.playUISelect();

  const idx = group.pressedOrder.length - 1;
  const expected = group.correctOrder[idx];

  if(expected !== plate.plateIndex){
    // فشل
    group.failed = true;
    this._resetSequence(group);
    Audio.playUIError();
    this._showMsg('❌ ترتيب خاطئ!', '#ff8888');
    return;
  }

  // نجاح؟
  if(group.pressedOrder.length === group.correctOrder.length){
    group.plates.forEach(p => {
      p.setFillStyle(0xffd700);
      if(p.numLabel) p.numLabel.setColor('#000');
    });

    Audio.playUISuccess();
    this._showMsg('🎉 لغز التسلسل اكتمل!', '#ffd700');

    if(group.onComplete) group.onComplete(this.scene);
    Events.emit('puzzle:sequence_complete', { groupId: plate.groupId });
  }
};

Puzzles._resetSequence = function(group){
  group.pressedOrder = [];
  group.plates.forEach(p => {
    p.pressed = false;
    p.setFillStyle(0x6a4a2a);
  });

  setTimeout(() => {
    group.failed = false;
  }, 1500);
};

// ═══════════════════════════════════════════════════
// 10. الأشعة والمرايا (Light Beams)
// ═══════════════════════════════════════════════════
Puzzles.createLightPuzzle = function(scene, options){
  options = options || {};
  const source = options.source || { x: 100, y: 200 };
  const target = options.target || { x: 800, y: 200 };
  const mirrors = options.mirrors || [];

  const group = {
    source: source,
    target: target,
    mirrors: [],
    beams: [],
    isSolved: false
  };

  // مصدر
  const sourceObj = scene.add.circle(source.x, source.y, 15, 0xffd700);
  sourceObj.setDepth(12);
  sourceObj.isLightSource = true;
  sourceObj.beamData = {
    x: source.x, y: source.y,
    dirX: 1, dirY: 0
  };

  // هدف
  const targetObj = scene.add.circle(target.x, target.y, 25, 0x22d3ee);
  targetObj.setDepth(12);
  targetObj.setStrokeStyle(3, 0x22d3ee);
  targetObj.isLightTarget = true;

  group.sourceObj = sourceObj;
  group.targetObj = targetObj;

  // مرايا
  mirrors.forEach((mPos, idx) => {
    const mirror = scene.add.rectangle(mPos.x, mPos.y, 40, 8, 0xc0c0c0);
    mirror.setDepth(11);
    mirror.setAngle(mPos.angle || 45);
    mirror.isMirror = true;
    mirror.mirrorAngle = mPos.angle || 45;
    mirror.beamData = {
      hit: false,
      dirOut: mPos.dirOut || 'up'
    };

    scene.physics.add.existing(mirror, true);
    mirror.body.setSize(40, 8);

    // فحص النقر للتدوير
    mirror.checkTimer = scene.time.addEvent({
      delay: 200,
      loop: true,
      callback: () => {
        if(!mirror.active) return;
        const player = Player.sprite;
        if(!player) return;

        const dist = Phaser.Math.Distance.Between(player.x, player.y, mirror.x, mirror.y);
        if(dist < 60 && Input.isAttackPressed()){
          mirror.mirrorAngle = (mirror.mirrorAngle + 45) % 360;
          mirror.setAngle(mirror.mirrorAngle);
          Audio.playUISelect();
          this._updateLightBeams(group);
        }
      }
    });

    group.mirrors.push(mirror);
  });

  // تحديث أولي
  scene.time.delayedCall(500, () => {
    this._updateLightBeams(group);
  });

  // فحص دوري
  const checkTimer = scene.time.addEvent({
    delay: 500,
    loop: true,
    callback: () => {
      if(group.isSolved) return;
      this._checkLightTargetHit(group);
    }
  });

  group.checkTimer = checkTimer;
  this.active.push({ type: 'light', obj: group });
  return group;
};

Puzzles._updateLightBeams = function(group){
  // حذف الأشعة القديمة
  group.beams.forEach(b => { if(b) b.destroy(); });
  group.beams = [];

  let currentX = group.source.x;
  let currentY = group.source.y;
  let dirX = 1;
  let dirY = 0;

  // 5 ارتدادات كحد أقصى
  for(let bounce = 0; bounce < 6; bounce++){
    // إيجاد أقرب مرآة في الاتجاه
    let nearest = null;
    let nearestDist = Infinity;

    group.mirrors.forEach(m => {
      if(m.beamData && m.beamData.hit) return;

      // فحص إذا على نفس الخط
      if(dirX !== 0 && Math.abs(m.y - currentY) < 20 && (m.x - currentX) * dirX > 0){
        const d = Math.abs(m.x - currentX);
        if(d < nearestDist){
          nearestDist = d;
          nearest = m;
        }
      } else if(dirY !== 0 && Math.abs(m.x - currentX) < 20 && (m.y - currentY) * dirY > 0){
        const d = Math.abs(m.y - currentY);
        if(d < nearestDist){
          nearestDist = d;
          nearest = m;
        }
      }
    });

    // الهدف
    const targetHit = (dirX !== 0 && Math.abs(group.target.y - currentY) < 25 && (group.target.x - currentX) * dirX > 0) ||
                       (dirY !== 0 && Math.abs(group.target.x - currentX) < 25 && (group.target.y - currentY) * dirY > 0);

    const endX = targetHit ? group.target.x : (nearest ? nearest.x : currentX + dirX * 500);
    const endY = targetHit ? group.target.y : (nearest ? nearest.y : currentY + dirY * 500);

    // رسم الشعاع
    const beam = this.scene.add.rectangle(
      (currentX + endX) / 2,
      (currentY + endY) / 2,
      dirX !== 0 ? Math.abs(endX - currentX) : 3,
      dirY !== 0 ? Math.abs(endY - currentY) : 3,
      0xffd700, 0.6
    );
    beam.setDepth(10);
    group.beams.push(beam);

    if(targetHit){
      group.isSolved = true;
      break;
    }

    if(!nearest) break;

    // ارتداد المرآة
    currentX = nearest.x;
    currentY = nearest.y;

    // زاوية 45 درجة
    const newDir = this._reflectBeam(dirX, dirY, nearest.mirrorAngle);
    dirX = newDir.dirX;
    dirY = newDir.dirY;
  }
};

Puzzles._reflectBeam = function(dirX, dirY, angle){
  const rad = (angle % 360) * Math.PI / 180;
  // تبسيط: على 45 أو 135
  if(Math.abs(Math.sin(rad)) > 0.5){
    return { dirX: 0, dirY: dirX > 0 ? -1 : (dirX < 0 ? 1 : -dirY) };
  } else {
    return { dirX: dirY > 0 ? 1 : (dirY < 0 ? -1 : -dirX), dirY: 0 };
  }
};

Puzzles._checkLightTargetHit = function(group){
  if(!group.isSolved) return;

  group.targetObj.setFillStyle(0x22c55e);
  Audio.playUISuccess();
  this._showMsg('💡 الأشعة وصلت للهدف!', '#22d3ee');
  Events.emit('puzzle:light_solved', { group: group });
};

// ═══════════════════════════════════════════════════
// 11. الصناديق القابلة للدفع (Push Blocks)
// ═══════════════════════════════════════════════════
Puzzles.createPushBlock = function(scene, x, y, options){
  options = options || {};
  const targetX = options.targetX || null;
  const targetY = options.targetY || null;
  const size = options.size || 50;

  const block = scene.add.rectangle(x, y, size, size, 0x8a6a4a);
  block.setDepth(9);
  block.setStrokeStyle(3, 0x4a3a2a);
  block.isPushBlock = true;
  block.targetX = targetX;
  block.targetY = targetY;
  block.onPlace = options.onPlace || null;

  scene.physics.add.existing(block);
  block.body.setSize(size, size);
  block.body.setCollideWorldBounds(true);
  block.body.setDrag(500, 500);
  block.body.setMaxVelocity(60, 60);

  if(scene.platforms){
    scene.physics.add.collider(block, scene.platforms);
  }

  // فحص الوصول للهدف
  if(targetX !== null){
    block.checkTimer = scene.time.addEvent({
      delay: 300,
      loop: true,
      callback: () => {
        if(!block.active) return;
        const dist = Phaser.Math.Distance.Between(block.x, block.y, targetX, targetY);
        if(dist < 30){
          block.setFillStyle(0x22c55e);
          if(block.onPlace) block.onPlace(scene);
          Events.emit('puzzle:block_placed', { block: block });
          block.checkTimer.remove();
        }
      }
    });
  }

  this.active.push({ type: 'pushblock', obj: block });
  return block;
};

// ═══════════════════════════════════════════════════
// 12. الأبواب الموقوتة (Timed Doors - تحدي)
// ═══════════════════════════════════════════════════
Puzzles.createTimedChallenge = function(scene, x, y, options){
  options = options || {};
  const duration = options.duration || 5000;
  const doorTarget = options.doorTarget;
  const onComplete = options.onComplete;

  const challenge = scene.add.circle(x, y, 25, 0xff3c14);
  challenge.setDepth(11);
  challenge.setStrokeStyle(3, 0xffd700);
  challenge.isChallenge = true;
  challenge.timer = duration;
  challenge.isActive = false;

  scene.physics.add.existing(challenge, true);
  challenge.body.setSize(50, 50);

  challenge.checkTimer = scene.time.addEvent({
    delay: 100,
    loop: true,
    callback: () => {
      if(!challenge.active) return;
      if(challenge.isActive) return;

      const player = Player.sprite;
      if(!player) return;

      if(Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), challenge.getBounds())){
        this._startTimedChallenge(scene, challenge, duration, doorTarget, onComplete);
      }
    }
  });

  this.active.push({ type: 'challenge', obj: challenge });
  return challenge;
};

Puzzles._startTimedChallenge = function(scene, challenge, duration, doorTarget, onComplete){
  challenge.isActive = true;
  challenge.setFillStyle(0xffd700);

  // فتح الباب
  if(doorTarget && doorTarget.active){
    this._openDoor(doorTarget);
  }

  // عرض العد التنازلي
  const bar = scene.add.rectangle(CFG.GW / 2, 60, 300, 20, 0xff3c14);
  bar.setScrollFactor(0);
  bar.setDepth(200);
  bar.maxWidth = 300;

  let elapsed = 0;
  const tick = scene.time.addEvent({
    delay: 50,
    loop: true,
    callback: () => {
      elapsed += 50;
      const pct = 1 - (elapsed / duration);
      bar.width = 300 * pct;

      // إعادة اللون
      if(pct < 0.3) bar.fillColor = 0x22c55e;
      else if(pct < 0.6) bar.fillColor = 0xffd700;

      if(elapsed >= duration){
        tick.remove();
        bar.destroy();

        // إغلاق الباب
        if(doorTarget && doorTarget.active){
          this._closeDoor(doorTarget);
        }

        // هل اللاعب نجح؟
        const player = Player.sprite;
        if(doorTarget && player){
          const playerPassedDoor = (player.x > doorTarget.x + 30) ||
                                    (player.x < doorTarget.x - 30);

          if(playerPassedDoor){
            Audio.playUISuccess();
            this._showMsg('⏱️ نجحت!', '#22c55e');
            if(onComplete) onComplete(scene);
          } else {
            Audio.playUIError();
            this._showMsg('⏱️ فشلت! أعد المحاولة', '#ff8888');
            challenge.isActive = false;
            challenge.setFillStyle(0xff3c14);
          }
        }
      }
    }
  });

  challenge.tickEvent = tick;
};

// ═══════════════════════════════════════════════════
// 13. ساحة القتال (Kill All Enemies)
// ═══════════════════════════════════════════════════
Puzzles.createArena = function(scene, options){
  options = options || {};
  const zoneX = options.x || 800;
  const zoneY = options.y || 200;
  const zoneW = options.width || 500;
  const zoneH = options.height || 400;
  const enemyCount = options.enemyCount || 5;
  const enemyType = options.enemyType || 'monster-1';
  const onClear = options.onClear || null;
  const sectionIdx = options.sectionIdx || 0;

  const arena = scene.add.rectangle(zoneX, zoneY, zoneW, zoneH, 0xff3c14, 0.1);
  arena.setDepth(1);
  arena.setStrokeStyle(2, 0xff3c14);
  arena.isArena = true;
  arena.started = false;
  arena.cleared = false;
  arena.enemies = [];
  arena.remaining = enemyCount;

  const trigger = scene.add.rectangle(zoneX, zoneY, 60, 60, 0xffd700);
  trigger.setDepth(11);
  trigger.setAlpha(0.7);

  scene.physics.add.existing(trigger, true);
  trigger.body.setSize(60, 60);

  trigger.checkTimer = scene.time.addEvent({
    delay: 200,
    loop: true,
    callback: () => {
      if(arena.started || arena.cleared) return;
      const player = Player.sprite;
      if(!player) return;

      if(Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), trigger.getBounds())){
        this._startArena(scene, arena, zoneX, zoneY, enemyCount, enemyType, sectionIdx, onClear);
      }
    }
  });

  this.active.push({ type: 'arena', obj: arena });
  return arena;
};

Puzzles._startArena = function(scene, arena, x, y, count, enemyType, sectionIdx, onClear){
  arena.started = true;
  this._showMsg('⚔️ ساحة قتال! اهزم كل الأعداء', '#ff3c14');
  Audio.playBoom();

  // بوابة اللاعب (يمنع الخروج)
  const leftWall = scene.add.rectangle(x - 250, y, 20, 400, 0xff3c14, 0.5);
  const rightWall = scene.add.rectangle(x + 250, y, 20, 400, 0xff3c14, 0.5);
  leftWall.setDepth(2);
  rightWall.setDepth(2);

  if(scene.platforms){
    scene.platforms.add(leftWall);
    scene.platforms.add(rightWall);
  }

  arena.walls = [leftWall, rightWall];

  // توليد أعداء
  for(let i = 0; i < count; i++){
    const ex = x - 200 + (i * (400 / count));
    const ey = y - 100;

    const enemy = Enemies.spawn(scene, ex, ey, enemyType, sectionIdx);
    if(enemy){
      arena.enemies.push(enemy);
      enemy.isArenaEnemy = true;
      enemy.arena = arena;
    }
  }

  // فحص القتل
  const tick = scene.time.addEvent({
    delay: 500,
    loop: true,
    callback: () => {
      if(arena.cleared) {
        tick.remove();
        return;
      }

      const alive = arena.enemies.filter(e => e && e.active && e.state !== 'die');
      arena.remaining = alive.length;

      if(alive.length === 0){
        arena.cleared = true;
        tick.remove();
        this._clearArena(scene, arena, onClear);
      }
    }
  });
  arena.tickEvent = tick;
};

Puzzles._clearArena = function(scene, arena, onClear){
  this._showMsg('🎉 نجحت!', '#22c55e');
  Audio.playUISuccess();

  // إزالة الحواجز
  arena.walls.forEach(w => { if(w) w.destroy(); });

  // جسيمات
  for(let i = 0; i < 30; i++){
    const p = scene.add.circle(arena.x, arena.y, 5, 0x22c55e);
    p.setDepth(150);
    scene.tweens.add({
      targets: p,
      x: arena.x + (Math.random() - 0.5) * 400,
      y: arena.y + (Math.random() - 0.5) * 300,
      alpha: 0,
      duration: 1000,
      onComplete: () => p.destroy()
    });
  }

  if(onClear) onClear(scene);
  Events.emit('puzzle:arena_cleared', { arena: arena });
};

// ═══════════════════════════════════════════════════
// 14. الذاكرة (Memory Puzzle - Simon Says)
// ═══════════════════════════════════════════════════
Puzzles.createMemoryPuzzle = function(scene, options){
  options = options || {};
  const x = options.x || 800;
  const y = options.y || 200;
  const count = options.count || 4;
  const sequenceLength = options.sequenceLength || 4;
  const onSolve = options.onSolve || null;

  const memory = {
    crystals: [],
    sequence: [],
    playerInput: [],
    isShowing: false,
    solved: false
  };

  const colors = [0xff3c14, 0x22c55e, 0x22d3ee, 0xffd700];

  // إنشاء 4 بلورات
  for(let i = 0; i < count; i++){
    const cx = x - 150 + (i * 100);
    const cy = y;
    const crystal = scene.add.circle(cx, cy, 30, colors[i]);
    crystal.setDepth(11);
    crystal.setStrokeStyle(3, 0xffffff);
    crystal.crystalIndex = i;
    crystal.baseColor = colors[i];
    crystal.isLit = false;

    scene.physics.add.existing(crystal, true);
    crystal.body.setSize(60, 60);

    crystal.checkTimer = scene.time.addEvent({
      delay: 200,
      loop: true,
      callback: () => {
        if(memory.isShowing || memory.solved) return;
        const player = Player.sprite;
        if(!player) return;

        if(Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), crystal.getBounds())){
          this._playerPressMemory(scene, memory, crystal, onSolve);
        }
      }
    });

    memory.crystals.push(crystal);
  }

  // زر البدء
  const startBtn = scene.add.rectangle(x, y + 100, 120, 40, 0xffd700);
  startBtn.setDepth(11);
  startBtn.setStrokeStyle(2, 0xff8c3c);

  const startLabel = scene.add.text(x, y + 100, '▶ ابدأ', {
    fontFamily: 'Arial', fontSize: '18px', color: '#000'
  }).setOrigin(0.5).setDepth(12);

  startBtn.checkTimer = scene.time.addEvent({
    delay: 200,
    loop: true,
    callback: () => {
      if(memory.isShowing || memory.solved) return;
      const player = Player.sprite;
      if(!player) return;

      if(Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), startBtn.getBounds())){
        this._startMemorySequence(scene, memory, sequenceLength);
        startBtn.checkTimer.remove();
      }
    }
  });

  memory.startBtn = startBtn;
  memory.startLabel = startLabel;

  this.active.push({ type: 'memory', obj: memory });
  return memory;
};

Puzzles._startMemorySequence = function(scene, memory, length){
  memory.isShowing = true;
  memory.playerInput = [];

  // توليد التسلسل
  memory.sequence = [];
  for(let i = 0; i < length; i++){
    memory.sequence.push(Math.floor(Math.random() * memory.crystals.length));
  }

  this._showMsg('👀 راقب التسلسل...', '#ffd700');

  // عرض التسلسل
  let idx = 0;
  const interval = scene.time.addEvent({
    delay: 700,
    repeat: length - 1,
    callback: () => {
      const crystalIdx = memory.sequence[idx];
      const crystal = memory.crystals[crystalIdx];

      if(crystal){
        crystal.setFillStyle(0xffffff);
        scene.tweens.add({
          targets: crystal,
          scaleX: 1.3,
          scaleY: 1.3,
          duration: 200,
          yoyo: true,
          onComplete: () => {
            crystal.setFillStyle(crystal.baseColor);
          }
        });
        Audio.playUISelect();
      }

      idx++;

      if(idx >= length){
        scene.time.delayedCall(800, () => {
          memory.isShowing = false;
          this._showMsg('🎯 دورك!', '#22d3ee');
        });
      }
    }
  });
};

Puzzles._playerPressMemory = function(scene, memory, crystal, onSolve){
  if(memory.solved || memory.isShowing) return;

  // تأثير
  crystal.setFillStyle(0xffffff);
  scene.tweens.add({
    targets: crystal,
    scaleX: 1.2,
    scaleY: 1.2,
    duration: 150,
    yoyo: true,
    onComplete: () => crystal.setFillStyle(crystal.baseColor)
  });

  memory.playerInput.push(crystal.crystalIndex);
  Audio.playUISelect();

  const idx = memory.playerInput.length - 1;
  const expected = memory.sequence[idx];

  if(memory.playerInput[idx] !== expected){
    // فشل
    memory.playerInput = [];
    Audio.playUIError();
    this._showMsg('❌ خطأ! أعد المحاولة', '#ff8888');
    return;
  }

  // نجاح كامل؟
  if(memory.playerInput.length === memory.sequence.length){
    memory.solved = true;
    Audio.playUISuccess();
    this._showMsg('🎉 أكملت الذاكرة!', '#22c55e');

    memory.crystals.forEach(c => c.setFillStyle(0x22c55e));

    if(onSolve) onSolve(scene);
    Events.emit('puzzle:memory_solved', { memory: memory });
  }
};

// ═══════════════════════════════════════════════════
// 15. البوابات (Portals/Teleporters)
// ═══════════════════════════════════════════════════
Puzzles.createPortal = function(scene, x, y, targetX, targetY, options){
  options = options || {};
  const color = options.color || 0xa855f7;

  const portal = scene.add.circle(x, y, 35, color, 0.6);
  portal.setDepth(11);
  portal.setStrokeStyle(3, color);
  portal.isPortal = true;

  scene.physics.add.existing(portal, true);
  portal.body.setSize(70, 70);

  // تأثير دوران
  if(scene.tweens){
    scene.tweens.add({
      targets: portal,
      angle: 360,
      duration: 3000,
      repeat: -1
    });
  }

  portal.checkTimer = scene.time.addEvent({
    delay: 500,
    loop: true,
    callback: () => {
      if(!portal.active) return;
      const player = Player.sprite;
      if(!player || !player.active) return;

      if(Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), portal.getBounds())){
        this._teleportPlayer(scene, player, targetX, targetY);
      }
    }
  });

  this.active.push({ type: 'portal', obj: portal });
  return portal;
};

Puzzles._teleportPlayer = function(scene, player, targetX, targetY){
  if(this._teleporting) return;
  this._teleporting = true;

  scene.cameras.main.flash(300, 200, 100, 255);
  Audio.playUISuccess();

  player.x = targetX;
  player.y = targetY;
  player.body.setVelocity(0, 0);

  scene.time.delayedCall(800, () => {
    this._teleporting = false;
  });
};

// ═══════════════════════════════════════════════════
// 16. تفعيل كل البلورات (Activate All Crystals)
// ═══════════════════════════════════════════════════
Puzzles.createCrystalPuzzle = function(scene, crystals, options){
  options = options || {};
  const onComplete = options.onComplete || null;

  const puzzle = {
    crystals: [],
    activatedCount: 0,
    total: crystals.length,
    solved: false
  };

  crystals.forEach((pos, idx) => {
    const crystal = scene.add.circle(pos.x, pos.y, 25, 0x4a5a9a);
    crystal.setDepth(11);
    crystal.setStrokeStyle(3, 0x6a8acc);
    crystal.isCrystal = true;
    crystal.crystalIdx = idx;
    crystal.activated = false;

    scene.physics.add.existing(crystal, true);
    crystal.body.setSize(50, 50);

    crystal.checkTimer = scene.time.addEvent({
      delay: 300,
      loop: true,
      callback: () => {
        if(crystal.activated) return;
        const player = Player.sprite;
        if(!player) return;

        if(Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), crystal.getBounds())){
          crystal.activated = true;
          crystal.setFillStyle(0x6a8acc);
          puzzle.activatedCount++;
          Audio.playUISelect();

          // تأثير
          for(let i = 0; i < 10; i++){
            const p = scene.add.circle(crystal.x, crystal.y, 3, 0x6a8acc);
            p.setDepth(150);
            const angle = (i / 10) * Math.PI * 2;
            scene.tweens.add({
              targets: p,
              x: crystal.x + Math.cos(angle) * 60,
              y: crystal.y + Math.sin(angle) * 60,
              alpha: 0,
              duration: 500,
              onComplete: () => p.destroy()
            });
          }

          // فحص الاكتمال
          if(puzzle.activatedCount === puzzle.total){
            puzzle.solved = true;
            this._showMsg('💎 كل البلورات مفعّلة!', '#6a8acc');
            Audio.playAbility();
            if(onComplete) onComplete(scene);
            Events.emit('puzzle:crystals_complete', { puzzle: puzzle });
          }
        }
      }
    });

    puzzle.crystals.push(crystal);
  });

  this.active.push({ type: 'crystalpuzzle', obj: puzzle });
  return puzzle;
};

// ═══════════════════════════════════════════════════
// دوال مساعدة
// ═══════════════════════════════════════════════════

// فحص إكمال لغز حسب نوعه
Puzzles.checkCompletion = function(type){
  return this.active.some(p => p.type === type && p.obj && p.obj.isSolved);
};

// الحصول على عدد الألغاز المحلولة
Puzzles.getSolvedCount = function(){
  return this.active.filter(p => {
    if(p.type === 'light') return p.obj.isSolved;
    if(p.type === 'memory') return p.obj.solved;
    if(p.type === 'crystalpuzzle') return p.obj.solved;
    if(p.type === 'arena') return p.obj.cleared;
    return false;
  }).length;
};

// الحصول على عدد الألغاز الكلي
Puzzles.getTotalCount = function(){
  return this.active.length;
};

console.log('✅ Puzzles system (2/2) loaded — 16 puzzle types');
