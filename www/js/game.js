// ═══════════════════════════════════════
// EMBER - الملف الرئيسي
// ═══════════════════════════════════════
'use strict';

let scene, cursors, keys;
const keysMap = { left:false, right:false, jump:false, attack:false };

const Game = {
  started: false,
  paused: false,
  currentLevel: null,

  // ═══ قائمة المراحل (مرتبة) ═══
  getLevels(){
    return [
      Level1Crypt,
      Level2Swamp,
      Level3Caves,
      Level4Forest,
      Level5Factory
    ];
  },

  // ═══ بدء اللعبة ═══
  start(){
    if(this.started) return;
    this.started = true;

    // القصة أول
    if(window.Story){
      Story.play('intro', ()=> this._startGame(), Story.chapters.intro);
    } else {
      this._startGame();
    }
  },

  _startGame(){
    const config = {
      type: Phaser.AUTO,
      width: CFG.GW,
      height: CFG.GH,
      parent: 'game-wrap',
      backgroundColor: '#050208',
      physics: {
        default: 'arcade',
        arcade: { gravity: { y: CFG.GRAVITY }, debug: false }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      pixelArt: true,
      scene: { preload, create, update }
    };
    window._emberGame = new Phaser.Game(config);
  },

  // ═══ الانتقال للعالم التالي ═══
  nextWorld(){
    const nextIdx = State.data.worldIdx + 1;
    if(nextIdx >= WORLDS.length){
      // نهاية اللعبة
      if(window.Story) Story.play('ending', null, Story.chapters.ending);
      return;
    }
    State.data.worldIdx = nextIdx;
    State.save();
    this.loadWorld(nextIdx);
  },

  // ═══ تحميل عالم ═══
  loadWorld(idx){
    const level = this.getLevels()[idx];
    if(!level) return;

    this.currentLevel = level;
    State.data.worldIdx = idx;

    // تنظيف المشهد الحالي
    this._cleanup();

    // إنشاء المرحلة
    level.create(scene);

    // إعادة تعيين اللاعب
    if(Player.sprite){
      Player.sprite.x = 60;
      Player.sprite.y = CFG.GH - 200;
      Player.sprite.body.setVelocity(0, 0);
    }

    // كاميرا
    scene.cameras.main.setBounds(0, 0, level.width, CFG.GH);
    scene.cameras.main.startFollow(Player.sprite, true, 0.1, 0.1);
    scene.cameras.main.setDeadzone(120, 60);
    scene.cameras.main.fadeIn(600, 0, 0, 0);

    // HUD
    HUD.update();
  },

  // ═══ تنظيف المرحلة ═══
  _cleanup(){
    // إلغاء timers الأعداء
    if(scene._enemyTimers){
      scene._enemyTimers.forEach(t => { try { if(t) t.remove(); } catch(e){} });
      scene._enemyTimers = [];
    }
    if(scene.platforms) scene.platforms.clear(true, true);
    if(scene.coins) scene.coins.clear(true, true);
    if(Enemies.group) Enemies.group.clear(true, true);
    if(Bosses.current){ Bosses.current.destroy(); Bosses.current = null; }
    Bosses.active = false;
    Puzzles.clear();
  }
};

// ═══════════════════════════════════════
// Phaser Scene
// ═══════════════════════════════════════

function preload(){
  scene = this;

  // ═══ الأصول العامة ═══
  Player.preload(scene);
  Enemies.preload(scene);
  Bosses.preload(scene);
  Puzzles.preload(scene);

  // ═══ المراحل ═══
  Game.getLevels().forEach(level => {
    if(level.preload) level.preload(scene);
  });

  // ═══ الأصوات ═══
  scene.load.audio('sfx-jump', 'assets/sounds/jump.wav');
  scene.load.audio('sfx-attack', 'assets/sounds/attack.wav');
  scene.load.audio('sfx-hurt', 'assets/sounds/hit.wav');
  scene.load.audio('sfx-kill', 'assets/sounds/death.wav');
  scene.load.audio('music-dungeon', 'assets/sounds/music-dungeon.ogg');
  scene.load.audio('music-forest', 'assets/sounds/music-forest.ogg');

  // ═══ تكسترات أساسية ═══
  createBasicTextures(scene);
}

function createBasicTextures(scene){
  // تكسترة الأرضية (شفافة - نستخدم tilesprite فوقها)
  if(!scene.textures.exists('platform')){
    const g = scene.add.graphics();
    g.fillStyle(0x000000, 1);
    g.fillRect(0, 0, 32, 32);
    g.generateTexture('platform', 32, 32);
    g.destroy();
  }

  // عملة
  if(!scene.textures.exists('coin')){
    const g = scene.add.graphics();
    g.fillStyle(0xfbbf24, 1);
    g.fillCircle(8, 8, 6);
    g.fillStyle(0xffd700, 1);
    g.fillCircle(8, 8, 4);
    g.generateTexture('coin', 16, 16);
    g.destroy();
  }
}

function create(){
  scene = this;

  // ═══ مجموعات فيزيائية ═══
  scene.platforms = scene.physics.add.staticGroup();
  scene.coins = scene.physics.add.group();
  Enemies.create(scene);

  // ═══ إنشاء البطل ═══
  Player.createAnimations(scene);
  Player.create(scene, 60, CFG.GH - 200);

  // ═══ إعداد المشهد ═══
  scene.physics.world.setBounds(0, 0, 10000, 1500);
  scene.cameras.main.setBackgroundColor('#050208');

  // ═══ تحميل العالم الحالي ═══
  Game.loadWorld(State.data.worldIdx || 0);

  // ═══ تصادمات ═══
  scene.physics.add.collider(Player.sprite, scene.platforms);
  scene.physics.add.collider(Enemies.group, scene.platforms);
  scene.physics.add.collider(scene.coins, scene.platforms);

  // ═══ الموسيقى ═══
  if(!window._gameMusic && scene.sound){
    try {
      window._gameMusic = scene.sound.add("music-dungeon", {volume: 0.25, loop: true});
      window._gameMusic.play();
    } catch(e){ console.log("Music error:", e); }
  }
  
  // ═══ أزرار الجوال ═══
  bindMobileButtons();

  // ═══ الكيبورد ═══
  cursors = scene.input.keyboard.createCursorKeys();
  keys = scene.input.keyboard.addKeys('A,D,W,S,SPACE,J,K,ENTER,SHIFT');

  // ═══ HUD ═══
  HUD.show();
  HUD.update();
}

function update(time, delta){
  if(!Player.sprite || !Player.sprite.active) return;

  // ═══ تحديث البطل ═══
  Player.update(time, delta, cursors, keys, keysMap);

  // ═══ تحديث الأعداء ═══
  Enemies.update(scene, Player);

  // ═══ تحديث البوس ═══
  Bosses.update(scene);

  // ═══ تحديث الألغاز ═══
  Puzzles.update(scene, Player);

  // ═══ العملات ═══
  scene.coins.getChildren().forEach(c => {
    if(!c.active) return;
    if(Phaser.Geom.Intersects.RectangleToRectangle(Player.sprite.getBounds(), c.getBounds())){
      State.data.gold += 2;
      State.save();
      HUD.showCoinPopup(scene, c.x, c.y, 2);
      c.destroy();
    }
  });

  // ═══ سقوط اللاعب ═══
  if(Player.sprite.y > CFG.GH + 100){
    Player.respawn(60, CFG.GH - 200);
  }

  // ═══ موت اللاعب ═══
  if(State.data.hp <= 0){
    State.data.hp = State.data.maxHp;
    State.save();
    Player.respawn(60, CFG.GH - 200);
    scene.cameras.main.flash(300, 255, 60, 20);
  }

  // ═══ اكتشاف البوس ═══
  const level = Game.currentLevel;
  if(level && !Bosses.active && !State.data.bossesDefeated[State.data.worldIdx]){
    if(Player.sprite.x > level.width - 500){
      level.spawnBoss(scene);
    }
  }

  // ═══ HUD ═══
  HUD.update();
}

// ═══════════════════════════════════════
// أزرار الجوال
// ═══════════════════════════════════════
function bindMobileButtons(){
  const map = [
    { id:'btnLeft', key:'left' },
    { id:'btnRight', key:'right' },
    { id:'btnJump', key:'jump' },
    { id:'btnAttack', key:'attack' }
  ];
  map.forEach(m => {
    const el = document.getElementById(m.id);
    if(!el) return;
    const set = (v) => {
      keysMap[m.key] = v;
      if(v) el.classList.add('pressed');
      else el.classList.remove('pressed');
    };
    el.addEventListener('touchstart', e => { e.preventDefault(); set(true); }, { passive:false });
    el.addEventListener('touchend', e => { e.preventDefault(); set(false); }, { passive:false });
    el.addEventListener('touchcancel', e => { e.preventDefault(); set(false); }, { passive:false });
    el.addEventListener('mousedown', e => { e.preventDefault(); set(true); });
    el.addEventListener('mouseup', e => { e.preventDefault(); set(false); });
    el.addEventListener('mouseleave', () => { set(false); });
  });
}

// ═══════════════════════════════════════
// ربط الزر "ابدأ الرحلة"
// ═══════════════════════════════════════
window.EmberGame = {
  start(){ Game.start(); }
};
