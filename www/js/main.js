// ═══════════════════════════════════════════════════
// EMBER — الملف الرئيسي (1/2)
// ═══════════════════════════════════════════════════
'use strict';

let scene = null;
let cursors = null;
let keys = null;

const Game = {

  phaserGame: null,
  started: false,
  paused: false,
  loadingAssets: false,
  totalAssets: 0,
  loadedAssets: 0,

  // ═══════════════════════════════════════════════
  // بدء اللعبة
  // ═══════════════════════════════════════════════
  start(){
    if(this.started) return;
    this.started = true;

    // نلعب القصة أول
    if(window.Story){
      Story.play('intro', () => this._launchGame(), Story.chapters.intro);
    } else {
      this._launchGame();
    }
  },

  _launchGame(){
    const config = {
      type: Phaser.AUTO,
      width: CFG.GW,
      height: CFG.GH,
      parent: 'game-wrap',
      backgroundColor: CFG.BG_COLOR,
      pixelArt: true,
      roundPixels: true,
      antialias: false,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: CFG.GRAVITY },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: CFG.GW,
        height: CFG.GH
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };

    this.phaserGame = new Phaser.Game(config);
    console.log('🎮 Game launched');
  },

  // ═══════════════════════════════════════════════
  // إيقاف/استئناف
  // ═══════════════════════════════════════════════
  pause(){
    if(this.paused) return;
    this.paused = true;
    if(scene && scene.physics){
      scene.physics.world.pause();
    }
    Events.emit(Events.NAMES.GAME_PAUSE);
  },

  resume(){
    if(!this.paused) return;
    this.paused = false;
    if(scene && scene.physics){
      scene.physics.world.resume();
    }
    Events.emit(Events.NAMES.GAME_RESUME);
  },

  // ═══════════════════════════════════════════════
  // إعادة تشغيل
  // ═══════════════════════════════════════════════
  restart(){
    if(this.phaserGame){
      this.phaserGame.destroy(true);
      this.phaserGame = null;
      this.started = false;
      this.paused = false;
    }
  },

  // ═══════════════════════════════════════════════
  // الانتقال للقسم التالي
  // ═══════════════════════════════════════════════
  nextWorld(){
    const currentIdx = State.data.progress.currentSection;

    // لو خلصنا كل الأقسام
    if(currentIdx >= WORLD_SECTIONS.length - 1){
      Events.emit(Events.NAMES.GAME_COMPLETE);
      if(window.Story){
        Story.play('ending', () => this._showEndScreen(), Story.chapters.ending);
      }
      return;
    }

    // ننتقل للقسم التالي
    const nextIdx = currentIdx + 1;
    State.data.progress.setCurrentSection(nextIdx);
    State.save();

    // نلعب قصة القسم الجديد
    const storyKeys = ['crypt_intro', 'swamp_intro', 'caves_intro', 'forest_intro', 'factory_intro'];
    if(window.Story && storyKeys[nextIdx]){
      Story.play(storyKeys[nextIdx], () => {
        this._enterSection(nextIdx);
      });
    } else {
      this._enterSection(nextIdx);
    }
  },

  _enterSection(sectionIdx){
    // تحميل أول غرفة في القسم
    const firstRoom = Rooms.getFirstRoom(sectionIdx);
    if(firstRoom && Levels){
      Levels.loadRoom(firstRoom.id);
    }

    // تشغيل موسيقى القسم
    const ws = WORLD_SECTIONS[sectionIdx];
    if(ws && Audio){
      Audio.playMusicForSection(ws.id);
    }
  },

  _showEndScreen(){
    // شاشة النهاية
    const el = document.createElement('div');
    el.id = 'endScreen';
    el.style.cssText = [
      'position:fixed',
      'inset:0',
      'background:#000',
      'z-index:9999',
      'display:flex',
      'flex-direction:column',
      'align-items:center',
      'justify-content:center',
      'font-family:Cairo,sans-serif',
      'color:#ffd700',
      'text-align:center',
      'padding:40px'
    ].join(';');

    el.innerHTML = [
      '<div style="font-size:4rem;margin-bottom:20px">🌅</div>',
      '<h1 style="font-size:2.5rem;margin-bottom:20px;letter-spacing:4px">النهاية</h1>',
      '<p style="font-size:1.2rem;color:#f5f0ff;margin-bottom:30px;line-height:2">' +
        'أشعلت الشمس.<br>عاد النور للعالم.<br>لكنك... لم تعد.' +
      '</p>',
      '<p style="font-size:1rem;color:#ffb87a;opacity:0.8">— صدى —</p>',
      '<button id="endRestart" style="margin-top:30px;padding:14px 40px;background:linear-gradient(135deg,#ff8c3c,#ff3c14);border:none;border-radius:50px;color:#fff;font-family:Cairo,sans-serif;font-weight:bold;font-size:1rem;cursor:pointer">🔄 العب مرة أخرى</button>'
    ].join('');

    document.body.appendChild(el);

    const restartBtn = document.getElementById('endRestart');
    if(restartBtn){
      restartBtn.onclick = () => {
        State.reset();
        location.reload();
      };
    }
  }
};

// ═══════════════════════════════════════════════════
// Phaser — Preload
// ═══════════════════════════════════════════════════
function preload(){
  scene = this;

  // ═══ شريط التحميل ═══
  const cam = scene.cameras.main;
  const bg = scene.add.rectangle(CFG.GW/2, CFG.GH/2, CFG.GW, CFG.GH, 0x050208);
  const barBg = scene.add.rectangle(CFG.GW/2, CFG.GH/2, 300, 20, 0x1a1a1a);
  const barFill = scene.add.rectangle(CFG.GW/2 - 150, CFG.GH/2, 0, 16, 0xff8c3c);
  barFill.setOrigin(0, 0.5);
  const barTxt = scene.add.text(CFG.GW/2, CFG.GH/2 - 30, '... جاري التحميل', {
    fontFamily: 'Arial', fontSize: '14px', color: '#ffd700'
  }).setOrigin(0.5);

  // تحديث شريط التحميل
  scene.load.on('progress', (value) => {
    barFill.width = 300 * value;
    const pct = Math.floor(value * 100);
    barTxt.setText(pct + '%');
  });

  scene.load.on('complete', () => {
    barTxt.setText('جاهز!');
    scene.time.delayedCall(300, () => {
      bg.destroy();
      barBg.destroy();
      barFill.destroy();
      barTxt.destroy();
    });
  });

  // ═══ تحميل الأصول ═══
  console.log('📦 Loading assets...');

  // Player
  if(typeof Player !== 'undefined') Player.preload(scene);

  // Enemies
  if(typeof Enemies !== 'undefined') Enemies.preload(scene);

  // Bosses
  if(typeof Bosses !== 'undefined') Bosses.preload(scene);

  // Puzzles
  if(typeof Puzzles !== 'undefined') Puzzles.preload(scene);

  // Assets Manager
  loadAllAssets(scene);

  // الأصوات
  loadAllSounds(scene);

  console.log('⏳ Waiting for load...');
}

// ═══════════════════════════════════════════════════
// تحميل كل الأصول
// ═══════════════════════════════════════════════════
function loadAllAssets(scene){
  // ═══ خلفيات الأقسام ═══
  const sections = ['crypt', 'swamp', 'caves', 'forest', 'factory'];

  sections.forEach((sec, idx) => {
    const bgPath = 'assets/worlds/0' + (idx + 1) + '-' + sec + '/bg.png';
    const tilePath = 'assets/worlds/0' + (idx + 1) + '-' + sec + '/tiles.png';

    scene.load.image('bg-' + sec, bgPath);
    scene.load.image('tile-' + sec, tilePath);
  });

  // Parallax للمقبرة
  scene.load.image('bg-crypt-far', 'assets/worlds/01-crypt/backgrounds/bg-far.png');
  scene.load.image('bg-crypt-mid', 'assets/worlds/01-crypt/backgrounds/bg-mid.png');

  // ديكور المقبرة
  const decorKeys = ['crystal-1','crystal-2','crystal-3','crystal-pile-1','crystal-pile-2','rock-01','rock-02','rock-03','rock-04','rock-05','rock-06','candlestick','fire','pillar','tree'];
  decorKeys.forEach(k => {
    scene.load.image('decor-' + k, 'assets/worlds/01-crypt/decor/' + k + '.png');
  });

  // بلاط الأرضية من Crystal Caves
  for(let i = 1; i <= 13; i++){
    const num = String(i).padStart(2, '0');
    scene.load.image('crypt-ground-' + num, 'assets/worlds/01-crypt/platforms/ground-' + num + '.png');
  }
  for(let i = 1; i <= 7; i++){
    const num = String(i).padStart(2, '0');
    scene.load.image('crypt-ground-add-' + num, 'assets/worlds/01-crypt/platforms/ground-add-' + num + '.png');
  }

  // ═══ NPCs ═══
  scene.load.image('npc-farmer', 'assets/npcs/farmer/sheet.png');

  // ═══ Items ═══
  scene.load.image('items-sheet', 'assets/items/items-sheet.png');
  scene.load.image('bottles-sheet', 'assets/items/bottles-sheet.png');
  scene.load.image('armor-sheet', 'assets/items/armor-sheet.png');

  // ═══ UI ═══
  scene.load.image('chest-gold', 'assets/ui/chest-gold.png');
  scene.load.image('chest-locked', 'assets/ui/chest-locked.png');
  scene.load.image('key-gold', 'assets/ui/key-gold.png');
  scene.load.image('key-silver', 'assets/ui/key-silver.png');
  scene.load.image('coin-0', 'assets/ui/coin-0.png');
  scene.load.image('coin-1', 'assets/ui/coin-1.png');
  scene.load.image('coin-2', 'assets/ui/coin-2.png');
  scene.load.image('coin-3', 'assets/ui/coin-3.png');
  scene.load.image('heart', 'assets/ui/heart.png');
  scene.load.image('crystal', 'assets/ui/crystal.png');
}

// ═══════════════════════════════════════════════════
// تحميل الأصوات
// ═══════════════════════════════════════════════════
function loadAllSounds(scene){
  // مؤثرات
  const sfx = [
    'jump', 'attack', 'hit', 'hurt', 'death', 'land', 'dash',
    'boom', 'break', 'ability', 'door-crash',
    'ui-select', 'ui-success', 'ui-error', 'health-up',
    'slime-death', 'slime-hit'
  ];

  sfx.forEach(s => {
    scene.load.audio('sfx-' + s, 'assets/sounds/sfx/' + s + '.wav');
  });

  // موسيقى
  scene.load.audio('music-dungeon', 'assets/sounds/music/dungeon.ogg');
  scene.load.audio('music-forest', 'assets/sounds/music/forest.ogg');
  scene.load.audio('music-title', 'assets/sounds/music/title.ogg');
}

console.log('✅ Main (1/2) loaded');

// ═══════════════════════════════════════════════════
// Phaser — Create
// ═══════════════════════════════════════════════════
function create(){
  scene = this;

  console.log('🎬 Creating game world...');

  // ═══════════════════════════════════════════════
  // 1. إعداد الفيزياء
  // ═══════════════════════════════════════════════
  scene.physics.world.setBounds(0, 0, 10000, 2000);

  // ═══════════════════════════════════════════════
  // 2. المجموعات الأساسية
  // ═══════════════════════════════════════════════
  scene.platforms = scene.physics.add.staticGroup();
  scene.coins = scene.physics.add.group();

  // إنشاء تكسترة platform الأساسية
  createBaseTextures(scene);

  // ═══════════════════════════════════════════════
  // 3. تهيئة الأنظمة
  // ═══════════════════════════════════════════════
  if(typeof Input !== 'undefined') Input.init(scene);
  if(typeof Audio !== 'undefined') Audio.init(scene);
  if(typeof Enemies !== 'undefined'){
    Enemies.init(scene);
    Enemies.createAnimations(scene);
  }
  if(typeof Bosses !== 'undefined') Bosses.init(scene);
  if(typeof Puzzles !== 'undefined') Puzzles.init(scene);
  if(typeof Levels !== 'undefined') Levels.init(scene);
  if(typeof Combat !== 'undefined') Combat.init(scene);
  if(typeof HUD !== 'undefined') HUD.init(scene);
  if(typeof Dialogue !== 'undefined') Dialogue.init(scene);
  if(typeof Inventory !== 'undefined') Inventory.init(scene);
  if(typeof Shop !== 'undefined') Shop.init(scene);

  // ═══════════════════════════════════════════════
  // 4. إنشاء البطل
  // ═══════════════════════════════════════════════
  if(typeof Player !== 'undefined'){
    const startX = 100;
    const startY = 100;
    Player.create(scene, startX, startY);

    // نضيفه للمنصات
    if(scene.platforms){
      scene.physics.add.collider(Player.sprite, scene.platforms);
    }
  }

  // ═══════════════════════════════════════════════
  // 5. الكيبورد
  // ═══════════════════════════════════════════════
  if(scene.input && scene.input.keyboard){
    cursors = scene.input.keyboard.createCursorKeys();
    keys = scene.input.keyboard.addKeys('A,D,W,S,SPACE,J,K,ENTER,SHIFT,TAB,M,ESC');
  }

  // ═══════════════════════════════════════════════
  // 6. تحميل القسم الحالي
  // ═══════════════════════════════════════════════
  const currentSection = State.data.progress.currentSection || 0;
  let firstRoom;
  if(currentSection === 0 && typeof ROOMS["mega-crypt"] !== "undefined"){
    firstRoom = ROOMS["mega-crypt"];
  } else {
    firstRoom = Rooms.getFirstRoom(currentSection);
  }

  if(firstRoom && Levels){
    Levels.loadRoom(firstRoom.id);
  }

  // ═══════════════════════════════════════════════
  // 7. الموسيقى
  // ═══════════════════════════════════════════════
  const ws = WORLD_SECTIONS[currentSection];
  if(ws && Audio){
    Audio.playMusicForSection(ws.id);
  }

  // ═══════════════════════════════════════════════
  // 8. الواجهة
  // ═══════════════════════════════════════════════
  if(typeof HUD !== 'undefined') HUD.show();

  // ═══════════════════════════════════════════════
  // 9. الأحداث
  // ═══════════════════════════════════════════════
  bindGameEvents(scene);

  // ═══════════════════════════════════════════════
  // 10. رسالة بدء
  // ═══════════════════════════════════════════════
  scene.cameras.main.fadeIn(1000, 0, 0, 0);

  if(typeof HUD !== 'undefined'){
    scene.time.delayedCall(800, () => {
      HUD.showMessage(scene, 'المقبرة - القسم الأول', {
        color: '#ffd700',
        size: '18px',
        duration: 2500,
        y: 80
      });
    });
  }

  console.log('✅ Game world created');
}

// ═══════════════════════════════════════════════════
// إنشاء تكسترات أساسية
// ═══════════════════════════════════════════════════
function createBaseTextures(scene){
  // Platform (شفافة - تُستخدم للأجسام الفيزيائية)
  if(!scene.textures.exists('platform')){
    const g = scene.add.graphics();
    g.fillStyle(0x000000, 1);
    g.fillRect(0, 0, 32, 32);
    g.generateTexture('platform', 32, 32);
    g.destroy();
  }

  // Coin
  if(!scene.textures.exists('coin')){
    const g = scene.add.graphics();
    g.fillStyle(0xfbbf24, 1);
    g.fillCircle(8, 8, 6);
    g.fillStyle(0xffd700, 1);
    g.fillCircle(8, 8, 4);
    g.generateTexture('coin', 16, 16);
    g.destroy();
  }

  // Dust particle
  if(!scene.textures.exists('dust')){
    const g = scene.add.graphics();
    g.fillStyle(0xffffff, 1);
    g.fillCircle(4, 4, 3);
    g.generateTexture('dust', 8, 8);
    g.destroy();
  }
}

// ═══════════════════════════════════════════════════
// ربط الأحداث
// ═══════════════════════════════════════════════════
function bindGameEvents(scene){
  // ═══ عند موت اللاعب ═══
  Events.on(Events.NAMES.PLAYER_DIED, () => {
    scene.cameras.main.fadeOut(800, 0, 0, 0);
  });

  // ═══ عند إعادة الظهور ═══
  Events.on(Events.NAMES.PLAYER_RESPAWN, () => {
    scene.cameras.main.fadeIn(500, 0, 0, 0);
  });

  // ═══ عند هزيمة بوس ═══
  Events.on(Events.NAMES.BOSS_DEFEATED, (data) => {
    console.log('👑 Boss defeated:', data);
  });

  // ═══ عند اكتشاف غرفة ═══
  Events.on(Events.NAMES.ROOM_DISCOVERED, (data) => {
    console.log('🚪 Room discovered:', data.roomId);
  });
}

// ═══════════════════════════════════════════════════
// Phaser — Update
// ═══════════════════════════════════════════════════
function update(time, delta){
  if(!scene) return;
  if(Game.paused) return;

  // ═══ المدخلات ═══
  if(typeof Input !== 'undefined'){
    Input.update();

    // Escape = قائمة
    if(Input.keys.pause && !scene._pauseHandled){
      scene._pauseHandled = true;
      togglePauseMenu();
    } else if(!Input.keys.pause){
      scene._pauseHandled = false;
    }

    // Tab = إنفنتوري
    if(Input.keys.inventory && !scene._invHandled){
      scene._invHandled = true;
      if(typeof Inventory !== 'undefined') Inventory.toggle();
    } else if(!Input.keys.inventory){
      scene._invHandled = false;
    }
  }

  // ═══ البطل ═══
  if(typeof Player !== 'undefined' && Player.sprite && Player.sprite.active){
    Player.update(time, delta, cursors, keys, Input.keys);
  }

  // ═══ الأعداء ═══
  if(typeof Enemies !== 'undefined'){
    Enemies.update(time, delta);
  }

  // ═══ البوسات ═══
  if(typeof Bosses !== 'undefined'){
    Bosses.update(time, delta);
  }

  // ═══ الألغاز ═══
  if(typeof Puzzles !== 'undefined'){
    Puzzles.update(time, delta);
  }

  // ═══ القتال ═══
  if(typeof Combat !== 'undefined'){
    Combat.fullUpdate(time, delta);
  }

  // ═══ الحوار ═══
  if(typeof Dialogue !== 'undefined'){
    Dialogue.handleInput();
    Dialogue.checkNearbyNPCs();
  }

  // ═══ HUD ═══
  if(typeof HUD !== 'undefined'){
    HUD.update();
  }

  // ═══ العملات ═══
  if(scene.coins && Player.sprite && Player.sprite.active){
    scene.coins.getChildren().forEach(c => {
      if(!c.active) return;
      if(Phaser.Geom.Intersects.RectangleToRectangle(
        Player.sprite.getBounds(), c.getBounds()
      )){
        State.currency.add('shards', 2);
        HUD.showCoinPopup(scene, c.x, c.y, 2);
        Audio.playCoin();
        c.destroy();
      }
    });
  }

  // ═══ سقوط اللاعب ═══
  if(Player.sprite && Player.sprite.active){
    const room = Levels.getCurrentRoom();
    if(room && Player.sprite.y > room.height + 100){
      Player.sprite.y = 100;
      Player.sprite.body.setVelocity(0, 0);
    }
  }

  // ═══ DEBUG Update ═══
  if(scene._debugText && typeof Input !== "undefined"){
    scene._debugText.setText(
      "L:" + (Input.keys.left ? "1" : "0") +
      " R:" + (Input.keys.right ? "1" : "0") +
      " J:" + (Input.keys.jump ? "1" : "0") +
      " vx:" + Math.round(Player.sprite ? Player.sprite.body.velocity.x : 0) +
      " atk:" + (Player.attack && Player.attack.isAttacking ? "1" : "0") +
      " size:" + (Player._debugSize ? Player._debugSize() : "")
    );
  }
  
  // ═══ فحص البوس ═══
  checkBossTrigger();
}

// ═══════════════════════════════════════════════════
// فحص تفعيل البوس
// ═══════════════════════════════════════════════════
function checkBossTrigger(){
  if(!Player.sprite || !Player.sprite.active) return;
  if(typeof Bosses === 'undefined') return;
  if(Bosses.active) return;

  const room = Levels.getCurrentRoom();
  if(!room) return;

  // ═══ mega-room: نستخدم bossTrigger.x ═══
  if(room.isMegaRoom && room.bossTrigger){
    const sectionIdx = room.section;
    if(State.progress.isBossDefeated(sectionIdx)) return;

    if(Player.sprite.x >= room.bossTrigger.x){
      const bossKey = room.bossTrigger.bossKey;
      const ws = WORLD_SECTIONS[sectionIdx];
      if(ws && bossKey){
        Bosses.spawn(scene, bossKey, sectionIdx, ws.bossNameAr);
      }
    }
    return;
  }

  // ═══ غرفة بوس عادية ═══
  if(!room.isBossRoom) return;

  const sectionIdx = room.section;
  if(State.progress.isBossDefeated(sectionIdx)) return;

  const ws = WORLD_SECTIONS[sectionIdx];
  if(ws){
    Bosses.spawn(scene, ws.bossKey, sectionIdx, ws.bossNameAr);
  }
}

// ═══════════════════════════════════════════════════
// قائمة الإيقاف
// ═══════════════════════════════════════════════════
function togglePauseMenu(){
  let el = document.getElementById('pauseMenu');
  if(el){
    el.remove();
    Game.resume();
    return;
  }

  Game.pause();

  el = document.createElement('div');
  el.id = 'pauseMenu';
  el.style.cssText = [
    'position:fixed',
    'inset:0',
    'background:rgba(5,2,8,0.95)',
    'z-index:800',
    'display:flex',
    'flex-direction:column',
    'align-items:center',
    'justify-content:center',
    'font-family:Cairo,sans-serif',
    'gap:15px'
  ].join(';');

  el.innerHTML = [
    '<h2 style="color:#ffd700;font-size:2rem;margin-bottom:20px">⏸ توقف</h2>',
    '<button id="pauseResume" style="padding:14px 40px;background:linear-gradient(135deg,#22c55e,#16a34a);border:none;border-radius:50px;color:#fff;font-family:Cairo,sans-serif;font-weight:bold;font-size:1rem;cursor:pointer;min-width:200px">▶ استئناف</button>',
    '<button id="pauseMenu2" style="padding:14px 40px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);border:none;border-radius:50px;color:#fff;font-family:Cairo,sans-serif;font-weight:bold;font-size:1rem;cursor:pointer;min-width:200px">🏠 القائمة الرئيسية</button>',
    '<button id="pauseRestart" style="padding:14px 40px;background:linear-gradient(135deg,#ff8c3c,#ff3c14);border:none;border-radius:50px;color:#fff;font-family:Cairo,sans-serif;font-weight:bold;font-size:1rem;cursor:pointer;min-width:200px">🔄 إعادة تشغيل</button>'
  ].join(';');

  document.body.appendChild(el);

  document.getElementById('pauseResume').onclick = () => {
    el.remove();
    Game.resume();
  };

  document.getElementById('pauseMenu2').onclick = () => {
    location.reload();
  };

  document.getElementById('pauseRestart').onclick = () => {
    State.reset();
    location.reload();
  };
}

// ═══════════════════════════════════════════════════
// ربط EmberGame
// ═══════════════════════════════════════════════════
window.EmberGame = {
  start(){ Game.start(); },
  pause(){ Game.pause(); },
  resume(){ Game.resume(); },
  restart(){ Game.restart(); }
};

console.log('✅ Main (2/2) loaded — Game ready!');
