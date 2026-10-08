// ═══════════════════════════════════════════════════
// EMBER — نظام المراحل (1/2)
// ═══════════════════════════════════════════════════
'use strict';

const Levels = {

  scene: null,
  currentRoom: null,
  currentRoomId: null,
  roomsVisited: {},
  platformsGroup: null,
  coinsGroup: null,
  builtObjects: [],

  // ═══ التهيئة ═══
  init(scene){
    this.scene = scene;
    this.roomsVisited = {};
    this.builtObjects = [];
    console.log('✅ Levels system initialized');
  },

  // ═══════════════════════════════════════════════
  // تحميل غرفة
  // ═══════════════════════════════════════════════
  loadRoom(roomId){
    if(!roomId){
      console.warn('⚠️ No roomId provided');
      return;
    }

    const room = ROOMS[roomId];
    if(!room){
      console.warn('⚠️ Room missing: ' + roomId);
      return;
    }

    // تنظيف الغرفة السابقة
    this._cleanup();

    this.currentRoom = room;
    this.currentRoomId = roomId;

    // تسجيل الزيارة
    if(!this.roomsVisited[roomId]){
      this.roomsVisited[roomId] = true;
      State.progress.discoverRoom(roomId);
      Events.emit(Events.NAMES.ROOM_ENTERED, { roomId: roomId, room: room });
    }

    // بناء الغرفة
    this._buildBackground(room);
    this._buildPlatforms(room);
    this._buildExits(room);
    this._buildPuzzles(room);
    this._buildNPCs(room);
    this._buildDecor(room);
    this._spawnEnemies(room);

    // موضع اللاعب
    if(Player.sprite){
      Player.sprite.x = 60;
      Player.sprite.y = room.height - 100;
      Player.sprite.body.setVelocity(0, 0);
    }

    // إعدادات الكاميرا
    const cam = this.scene.cameras.main;
    cam.setBounds(0, 0, room.width, room.height);
    if(Player.sprite){
      cam.startFollow(Player.sprite, true, 0.1, 0.1);
      cam.setDeadzone(120, 60);
    }
    cam.fadeIn(500, 0, 0, 0);

    // HUD
    HUD.update();

    // الإشعار
    HUD.showHint(this.scene, room.name, 2000);

    console.log('🚪 Room loaded: ' + roomId + ' (' + room.name + ')');
  },

  // ═══════════════════════════════════════════════
  // التنظيف
  // ═══════════════════════════════════════════════
  _cleanup(){
    // إزالة كل الكائنات
    this.builtObjects.forEach(obj => {
      try {
        if(obj && obj.destroy) obj.destroy();
      } catch(err) {}
    });
    this.builtObjects = [];

    // تنظيف الأعداء
    if(typeof Enemies !== 'undefined' && Enemies.clearAll){
      Enemies.clearAll();
    }

    // تنظيف الألغاز
    if(typeof Puzzles !== 'undefined' && Puzzles.clearAll){
      Puzzles.clearAll();
    }

    // تنظيف المنصات
    if(this.platformsGroup){
      this.platformsGroup.clear(true, true);
    }

    // تنظيف العملات
    if(this.coinsGroup){
      this.coinsGroup.clear(true, true);
    }
  },

  // ═══════════════════════════════════════════════
  // بناء الخلفية
  // ═══════════════════════════════════════════════
  _buildBackground(room){
    const ws = WORLD_SECTIONS[room.section];

    // ═══ MEGA-ROOM: خلفيات متعددة الطبقات ═══
    if(room.isMegaRoom){
      // ═══ Parallax: tileSprite بحجم الشاشة فقط ═══
      const CAM_W = CFG.GW;
      const CAM_H = CFG.GH;
      const farKey = 'bg-' + ws.id + '-far';
      const midKey = 'bg-' + ws.id + '-mid';

      if(this.scene.textures.exists(farKey)){
        const far = this.scene.add.tileSprite(0, 0, CAM_W, CAM_H, farKey);
        far.setOrigin(0, 0);
        far.setScrollFactor(0);
        far.setDepth(-100);
        far._parallaxFactor = 0.2;
        this.builtObjects.push(far);
      }
      if(this.scene.textures.exists(midKey)){
        const mid = this.scene.add.tileSprite(0, 0, CAM_W, CAM_H, midKey);
        mid.setOrigin(0, 0);
        mid.setScrollFactor(0);
        mid.setDepth(-50);
        mid._parallaxFactor = 0.5;
        this.builtObjects.push(mid);
      }
      return;
    }
    const bgKey = 'bg-' + ws.id;

    if(this.scene.textures.exists(bgKey)){
      const bg = this.scene.add.image(0, 0, bgKey);
      bg.setOrigin(0, 0);
      bg.setScrollFactor(0.3);
      bg.setDisplaySize(room.width, room.height);
      bg.setDepth(-30);
      if(ws.bgTint){
        bg.setTint(ws.bgTint);
      }
      this.builtObjects.push(bg);
    } else {
      // خلفية احتياطية
      const bg = this.scene.add.rectangle(
        room.width / 2, room.height / 2,
        room.width, room.height,
        ws.bgTint || 0x050208
      );
      bg.setDepth(-30);
      bg.setScrollFactor(0.3);
      this.builtObjects.push(bg);
    }
  },

  // ═══════════════════════════════════════════════
  // بناء المنصات
  // ═══════════════════════════════════════════════
  _buildPlatforms(room){
    const ws = WORLD_SECTIONS[room.section];
    const tileKey = 'tile-' + ws.id;

    // إنشاء المجموعة
    if(!this.platformsGroup){
      this.platformsGroup = this.scene.physics.add.staticGroup();
      // ربط scene.platforms بنفس المجموعة (للبوسات والأعداء)
      this.scene.platforms = this.platformsGroup;
    }

    room.platforms.forEach(plat => {
      let vis = null;

      // للـmega-rooms: sprite 1x1 + tint (WebGL batch أفضل)
      if(room.isMegaRoom){
        // 🟫 الأرضية
        if(!this.scene.textures.exists('white-pixel')){
          const g = this.scene.add.graphics();
          g.fillStyle(0xffffff, 1);
          g.fillRect(0, 0, 1, 1);
          g.generateTexture('white-pixel', 1, 1);
          g.destroy();
        }
        vis = this.scene.add.image(plat.x, plat.y, 'white-pixel');
        vis.setDisplaySize(plat.w, plat.h);
        vis.setTint(0x1a2540);
        vis.setDepth(-5);
        this.builtObjects.push(vis);

        // ⬆️ حافة علوية
        const edge = this.scene.add.image(plat.x, plat.y - plat.h/2 + 4, 'white-pixel');
        edge.setDisplaySize(plat.w, 8);
        edge.setTint(0x4a6aaa);
        edge.setDepth(-4);
        this.builtObjects.push(edge);

        // جسم فيزيائي
        const body = this.platformsGroup.create(plat.x, plat.y, 'platform');
        body.setDisplaySize(plat.w, plat.h);
        body.setVisible(false);
        body.refreshBody();
        return;
      }

      // الافتراضي
      if(!vis && this.scene.textures.exists(tileKey)){
        vis = this.scene.add.tileSprite(plat.x, plat.y, plat.w, plat.h, tileKey);
        vis.setOrigin(0.5, 0.5);
        vis.setDepth(-5);
        if(ws.tintTiles) vis.setTint(ws.tintTiles);
      }

      if(!vis){
        vis = this.scene.add.rectangle(plat.x, plat.y, plat.w, plat.h, ws.bgTint || 0x3a2f26);
        vis.setDepth(-5);
      }

      this.builtObjects.push(vis);

      // الجسم الفيزيائي
      const body = this.platformsGroup.create(plat.x, plat.y, 'platform');
      body.setDisplaySize(plat.w, plat.h);
      body.setVisible(false);
      body.refreshBody();
    });

    // ربط اللاعب بالمنصات
    if(Player.sprite && this.platformsGroup){
      this.scene.physics.add.collider(Player.sprite, this.platformsGroup);
    }

    // ربط الأعداء بالمنصات
    if(Enemies.group && this.platformsGroup){
      this.scene.physics.add.collider(Enemies.group, this.platformsGroup);
    }
  },

  // ═══════════════════════════════════════════════
  // بناء المخارج
  // ═══════════════════════════════════════════════
  _buildExits(room){
    if(!room.exits) return;

    const exitColors = {
      left: 0x22c55e,
      right: 0x22c55e,
      up: 0x22d3ee,
      down: 0xfbbf24
    };

    const exitPositions = {
      left: { x: 20, y: room.height - 150 },
      right: { x: room.width - 20, y: room.height - 150 },
      up: { x: room.width / 2, y: 20 },
      down: { x: room.width / 2, y: room.height - 20 }
    };

    for(const dir in room.exits){
      const targetRoomId = room.exits[dir];
      const pos = exitPositions[dir];
      if(!pos) continue;

      // جسم شفاف (للتفاعل فقط - مو مرئي)
      const door = this.scene.add.rectangle(pos.x, pos.y, 30, 60, exitColors[dir] || 0x22c55e);
      door.setDepth(5);
      door.setAlpha(0.15);
      door.setStrokeStyle(1, 0xffffff, 0.3);

      // سهم صغير أنيق يدل على الاتجاه
      let arrowIcon = "→";
      if(dir === "left") arrowIcon = "←";
      else if(dir === "up") arrowIcon = "↑";
      else if(dir === "down") arrowIcon = "↓";

      const arrow = this.scene.add.text(pos.x, pos.y, arrowIcon, {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3
      }).setOrigin(0.5).setDepth(6);
      arrow.setAlpha(0.6);

      // تأثير نبض خفيف
      this.scene.tweens.add({
        targets: arrow,
        alpha: 0.2,
        scale: 1.2,
        duration: 1200,
        yoyo: true,
        repeat: -1
      });

      // نخزن السهم للتنظيف
      this.builtObjects.push(arrow);

      this.scene.physics.add.existing(door, true);
      door.body.setSize(30, 60);

      // فحص المرور
      door.checkTimer = this.scene.time.addEvent({
        delay: 300,
        loop: true,
        callback: () => {
          if(!door.active) return;
          const player = Player.sprite;
          if(!player) return;

          if(Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), door.getBounds())){
            this._exitRoom(targetRoomId);
          }
        }
      });

      this.builtObjects.push(door);
      door.checkTimerRef = door.checkTimer;
    }
  },

  // ═══════════════════════════════════════════════
  // الانتقال بين الغرف
  // ═══════════════════════════════════════════════
  _exitRoom(nextRoomId){
    if(this._transitioning) return;
    this._transitioning = true;

    const cam = this.scene.cameras.main;
    cam.fadeOut(300, 0, 0, 0);

    Audio.playDoor();

    this.scene.time.delayedCall(350, () => {
      this.loadRoom(nextRoomId);
      this.scene.time.delayedCall(200, () => {
        this._transitioning = false;
      });
    });
  },

  // ═══════════════════════════════════════════════
  // بناء الألغاز
  // ═══════════════════════════════════════════════
  _buildPuzzles(room){
    if(!room.puzzles || room.puzzles.length === 0) return;
    if(typeof Puzzles === 'undefined') return;

    room.puzzles.forEach(pz => {
      try {
        this._createPuzzle(pz);
      } catch(err) {
        console.warn('Puzzle error:', err);
      }
    });
  },

  _createPuzzle(pz){
    const scene = this.scene;

    switch(pz.type){
      case 'spike':
        Puzzles.createSpike(scene, pz.x, pz.y, pz);
        break;

      case 'lever':
        Puzzles.createLever(scene, pz.x, pz.y, null, pz);
        break;

      case 'plate':
        Puzzles.createPlate(scene, pz.x, pz.y, null, pz);
        break;

      case 'door':
        Puzzles.createDoor(scene, pz.x, pz.y, pz);
        break;

      case 'moving-platform':
        Puzzles.createMovingPlatform(scene, pz.x, pz.y, pz);
        break;

      case 'locked-chest':
        Puzzles.createLockedChest(scene, pz.x, pz.y, pz);
        break;

      case 'memory':
        Puzzles.createMemoryPuzzle(scene, pz);
        break;

      case 'crystal-puzzle':
        Puzzles.createCrystalPuzzle(scene, pz.crystals, pz);
        break;

      case 'arena':
        Puzzles.createArena(scene, {
          x: pz.x, y: pz.y,
          width: pz.width, height: pz.height,
          enemyCount: pz.enemyCount,
          enemyType: pz.enemyType,
          sectionIdx: pz.sectionIdx
        });
        break;

      case 'push-block':
        Puzzles.createPushBlock(scene, pz.x, pz.y, pz);
        break;

      case 'portal':
        Puzzles.createPortal(scene, pz.x, pz.y, pz.targetX, pz.targetY, pz);
        break;

      case 'light':
        Puzzles.createLightPuzzle(scene, pz);
        break;

      default:
        console.warn('Unknown puzzle type: ' + pz.type);
    }
  },

  // ═══════════════════════════════════════════════
  // بناء NPCs
  // ═══════════════════════════════════════════════
  _buildNPCs(room){
    if(!room.npcs || room.npcs.length === 0) return;

    room.npcs.forEach(npcPos => {
      const npcData = NPC_DATA[npcPos.key];
      if(!npcData) return;

      // استخدام سبريت حقيقي لو توفر
      let sprite = null;
      const sheetKey = npcData.sprite && npcData.sprite.sheet;
      // نستخدم الفريم الواحد لو موجود، وإلا السبريت الكامل
      let spriteTexture = sheetKey ? (sheetKey + '-idle-frame') : null;
      if(!spriteTexture || !this.scene.textures.exists(spriteTexture)){
        spriteTexture = sheetKey ? (sheetKey + '-idle') : null;
      }

      if(spriteTexture && this.scene.textures.exists(spriteTexture)){
        sprite = this.scene.add.image(npcPos.x, npcPos.y, spriteTexture);
        sprite.setScale(npcData.sprite.scale || 0.3);
        if(npcData.sprite.tint) sprite.setTint(npcData.sprite.tint);
        sprite.setDepth(15);
      } else {
        // احتياط: دائرة
        sprite = this.scene.add.circle(npcPos.x, npcPos.y, 25, npcData.sprite.tint || 0xffd700);
        sprite.setDepth(15);
        sprite.setStrokeStyle(3, 0xffffff);
      }

      sprite.npcKey = npcPos.key;
      sprite.isNPC = true;

      // أيقونة فوق الرأس
      const icon = this.scene.add.text(npcPos.x, npcPos.y - 55, npcData.icon, {
        fontSize: '28px'
      }).setOrigin(0.5).setDepth(16);

      // الاسم تحت
      const name = this.scene.add.text(npcPos.x, npcPos.y + 45, npcData.nameAr, {
        fontFamily: 'Arial', fontSize: '12px', color: '#ffffff',
        stroke: '#000', strokeThickness: 2
      }).setOrigin(0.5).setDepth(16);

      // نبض (بالحجم الأصلي)
      const baseScale = sprite.scaleX || 1;
      this.scene.tweens.add({
        targets: sprite,
        scaleX: baseScale * 1.08,
        scaleY: baseScale * 1.08,
        duration: 1000,
        yoyo: true,
        repeat: -1
      });

      this.builtObjects.push(sprite);
      this.builtObjects.push(icon);
      this.builtObjects.push(name);
    });
  },

  // ═══════════════════════════════════════════════
  // توليد الأعداء
  // ═══════════════════════════════════════════════
  _buildDecor(room){
    if(!room.decor || room.decor.length === 0) return;
    room.decor.forEach(d => {
      const key = 'decor-' + d.key;
      if(!this.scene.textures.exists(key)) return;
      const sprite = this.scene.add.image(d.x, d.y, key);
      sprite.setScale(d.scale || 1);
      sprite.setOrigin(0.5, 1);
      sprite.setDepth(d.depth || 5);
      this.builtObjects.push(sprite);
    });
  },

  _spawnEnemies(room){
    if(!room.enemies || room.enemies.length === 0) return;
    if(typeof Enemies === 'undefined') return;

    room.enemies.forEach(en => {
      const e = Enemies.spawn(this.scene, en.x, en.y, en.type, room.section);
      if(e && en.patrolMin && en.patrolMax){
        e.patrolMin = en.patrolMin;
        e.patrolMax = en.patrolMax;
      }
    });
  },

  // ═══════════════════════════════════════════════
  // توليد قسم كامل تلقائياً (لغير المقبرة)
  // ═══════════════════════════════════════════════
  generateSection(sectionIdx, roomCount){
    roomCount = roomCount || 30;
    const ws = WORLD_SECTIONS[sectionIdx];
    const rooms = [];
    const roomIds = [];

    // غرفة البداية
    const startId = ws.id + '-01';
    roomIds.push(startId);

    // غرف عشوائية
    for(let i = 2; i <= roomCount; i++){
      const id = ws.id + '-' + String(i).padStart(2, '0');
      roomIds.push(id);
    }

    // بناء الغرف
    roomIds.forEach((id, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === roomCount - 1;
      const isBossIdx = idx === roomCount - 3;
      const isNPCIdx = idx === 3;

      const type = isFirst || isNPCIdx ? 'small'
                 : isBossIdx || isLast ? 'large'
                 : (idx % 5 === 0 ? 'tower' : 'medium');

      const width = type === 'large' ? 1440
                  : type === 'tower' ? 480
                  : type === 'small' ? 480
                  : 960;

      const height = type === 'tower' ? 810
                   : type === 'large' ? 540
                   : 270;

      // منصات
      const platforms = this._generatePlatforms(type, width, height);

      // أعداء
      const enemies = isFirst || isNPCIdx ? [] : this._generateEnemies(
        ws.enemyTypes, type, width, height, sectionIdx
      );

      // أحياناً وحش نخبة
      if(type === 'large' && ws.eliteTypes && ws.eliteTypes.length > 0 && idx % 7 === 0){
        enemies.push({
          type: ws.eliteTypes[0],
          x: width / 2,
          y: height - 200
        });
      }

      // NPC
      const npcs = isNPCIdx ? [{ key: ws.npc, x: width / 2, y: height - 100 }] : [];

      // ألغاز
      const puzzles = this._generatePuzzles(type, idx, width, height, sectionIdx);

      // مخارج
      const exits = {};
      if(idx > 0) exits.left = roomIds[idx - 1];
      if(idx < roomIds.length - 1) exits.right = roomIds[idx + 1];

      // البوس
      const isBossRoom = isLast;

      rooms.push({
        id: id,
        section: sectionIdx,
        type: type,
        width: width,
        height: height,
        bg: 'bg-' + ws.id,
        tiles: 'tile-' + ws.id,
        name: ws.nameAr + ' - غرفة ' + (idx + 1),
        platforms: platforms,
        enemies: enemies,
        npcs: npcs,
        puzzles: puzzles,
        exits: exits,
        isBossRoom: isBossRoom
      });

      // تسجيل في ROOMS العامة
      ROOMS[id] = rooms[rooms.length - 1];
    });

    console.log('✅ Generated ' + rooms.length + ' rooms for section: ' + ws.id);
    return rooms;
  },

  _generatePlatforms(type, width, height){
    const platforms = [];

    if(type === 'tower'){
      platforms.push({ x: width / 2, y: height - 30, w: width, h: 30 });
      for(let y = height - 130; y > 100; y -= 130){
        const x = (y % 260 === 0) ? 120 : 360;
        platforms.push({ x: x, y: y, w: 200, h: 20 });
      }
    } else if(type === 'large'){
      platforms.push({ x: width / 2, y: height - 30, w: width, h: 30 });
      for(let i = 1; i < 4; i++){
        platforms.push({
          x: 300 * i,
          y: height - 30 - (i * 100),
          w: 150,
          h: 20
        });
      }
    } else if(type === 'small'){
      platforms.push({ x: width / 2, y: height - 30, w: width, h: 30 });
    } else {
      platforms.push({ x: 200, y: height - 30, w: 400, h: 30 });
      platforms.push({ x: width - 200, y: height - 30, w: 400, h: 30 });
      if(Math.random() < 0.5){
        platforms.push({ x: width / 2, y: height - 150, w: 180, h: 20 });
      }
    }

    return platforms;
  },

  _generateEnemies(enemyTypes, type, width, height, sectionIdx){
    const enemies = [];
    if(!enemyTypes || enemyTypes.length === 0) return enemies;

    let count = 0;
    if(type === 'large') count = 5;
    else if(type === 'medium') count = 3;
    else if(type === 'tower') count = 2;
    else count = 1;

    for(let i = 0; i < count; i++){
      const typeKey = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      const x = 200 + (i + 1) * ((width - 400) / (count + 1));
      const y = height - 120;
      enemies.push({ type: typeKey, x: x, y: y });
    }

    return enemies;
  },

  _generatePuzzles(type, idx, width, height, sectionIdx){
    const puzzles = [];

    // لغز واحد كل 5 غرف
    if(idx % 5 === 0 && idx > 0){
      const choices = ['lever', 'plate', 'moving-platform', 'locked-chest', 'memory'];
      const choice = choices[idx % choices.length];

      const base = { type: choice, x: width / 2, y: height - 150 };

      if(choice === 'locked-chest'){
        base.keyId = 'key_gold';
        base.rewards = { shards: 20 + (sectionIdx * 10), atoms: 1 };
      }

      puzzles.push(base);
    }

    // أشواك عشوائية في الغرف المتوسطة
    if(type === 'medium' && Math.random() < 0.3){
      puzzles.push({ type: 'spike', x: width / 2, y: height - 40, width: 100, height: 20 });
    }

    return puzzles;
  },

  // ═══════════════════════════════════════════════
  // الانتقال بين الأقسام
  // ═══════════════════════════════════════════════
  nextSection(){
    const currentIdx = State.data.progress.currentSection;
    const nextIdx = currentIdx + 1;
    if(nextIdx >= WORLD_SECTIONS.length) return false;

    // توليد القسم إن لم يكن موجوداً
    if(Rooms.countBySection(nextIdx) === 0){
      this.generateSection(nextIdx, 30);
    }

    // الانتقال
    State.data.progress.setCurrentSection(nextIdx);
    State.save();

    const firstRoom = Rooms.getFirstRoom(nextIdx);
    if(firstRoom){
      this.loadRoom(firstRoom.id);
    }

    return true;
  },

  // ═══ استعلامات ═══
  getCurrentRoom(){ return this.currentRoom; },
  getCurrentRoomId(){ return this.currentRoomId; },
  getVisitedCount(){ return Object.keys(this.roomsVisited).length; },
  isVisited(id){ return this.roomsVisited[id] === true; }
};

console.log('✅ Levels system (1/2) loaded');
