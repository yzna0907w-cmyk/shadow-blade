'use strict';

const Save = {
  KEY: 'ember_save_v3',
  load(){
    try{
      const d = JSON.parse(localStorage.getItem(this.KEY) || '{}');
      return {
        gold: d.gold || 0,
        zone: d.zone || 0,
        totalKills: d.totalKills || 0,
        unlockedZones: d.unlockedZones || [true,false,false,false],
        bossesDefeated: d.bossesDefeated || [false,false,false,false]
      };
    }catch(e){ return {gold:0,zone:0,totalKills:0,unlockedZones:[true,false,false,false],bossesDefeated:[false,false,false,false]}; }
  },
  save(data){ try{ localStorage.setItem(this.KEY, JSON.stringify(data)); }catch(e){} },
  reset(){ try{ localStorage.removeItem(this.KEY); }catch(e){} }
};

const ZONES = [
  { nameAr:'الرماد', bg:'bg_crypt', platform:'platform_crypt',
    enemies:['skeleton','bat','slime'], enemyCount:8,
    bossSprite:'skeletonKing', boss:{ nameAr:'ملك الرماد', hp:300, gold:15 },
    layout:'ground' },
  { nameAr:'الصدأ', bg:'bg_fire', platform:'platform_fire',
    enemies:['fireGolem','imp'], enemyCount:10,
    bossSprite:'fireDemon', boss:{ nameAr:'المحترق', hp:500, gold:25 },
    layout:'vertical' },
  { nameAr:'الصقيع', bg:'bg_frozen', platform:'platform_frozen',
    enemies:['iceWraith','frostSpider','iceGolem'], enemyCount:12,
    bossSprite:'iceQueen', boss:{ nameAr:'الأم المتجمدة', hp:700, gold:35 },
    layout:'gaps' },
  { nameAr:'الفراغ', bg:'bg_shadow', platform:'platform_shadow',
    enemies:['shadowBeast','voidCrawler','nightmare','cryptHorror'], enemyCount:14,
    bossSprite:'shadowLord', boss:{ nameAr:'الظلام', hp:1000, gold:50 },
    layout:'maze' }
];

const State = {
  data: Save.load(),
  started: false,
  zoneIdx: 0
};

let scene, player, cursors, keys;
let platforms, enemies, coins, bgTile;
let hp = 100, maxHp = 100, gold = 0, kills = 0;
let facing = 1;
let invulnTimer = 0, coyoteTimer = 0, jumpPressedAt = 0;
let lastAttack = 0;
let currentZone = 0;
let boss = null, bossActive = false, bossDefeated = false;
let bossBarWrap = null;
const keysMap = {left:false,right:false,jump:false,attack:false};

const GW = 480, GH = 270;
const GRAVITY = 900;
const MOVE_SPEED = 140;
const JUMP_VELOCITY = -360;
const COYOTE_TIME = 120;
const JUMP_BUFFER = 150;
const ATK_COOLDOWN = 600;
const ATK_DURATION = 280;
const ATK_RANGE = 32;
const INVULN_TIME = 1400;
const PLAYER_DAMAGE = 60;
const BASE_HP = 100;

/* Scales - SMALL now */
const SCALE_PLAYER = 0.025;
const SCALE_ENEMY = 0.020;
const SCALE_BOSS = 0.070;

const ZONE_WIDTH = 6000;

/* ===== Preload ===== */
function preload(){
  scene.load.image('player', 'assets/knight.png');
  scene.load.image('bg_crypt', 'assets/bg_crypt.png');
  scene.load.image('bg_fire', 'assets/bg_fire.png');
  scene.load.image('bg_frozen', 'assets/bg_frozen.png');
  scene.load.image('bg_shadow', 'assets/bg_shadow.png');
  scene.load.image('platform_crypt', 'assets/platform_crypt.png');
  scene.load.image('platform_fire', 'assets/platform_fire.png');
  scene.load.image('platform_frozen', 'assets/platform_frozen.png');
  scene.load.image('platform_shadow', 'assets/platform_shadow.png');
  ['bat','slime','skeleton','imp','fireGolem','iceWraith','frostSpider','iceGolem','shadowBeast','voidCrawler','nightmare','cryptHorror'].forEach(k=>{
    scene.load.image(k, 'assets/'+k+'.png');
  });
  ['skeletonKing','fireDemon','iceQueen','shadowLord','umbra'].forEach(k=>{
    scene.load.image(k, 'assets/'+k+'.png');
  });
  scene.load.image('coin', 'assets/coin.png');
  scene.load.image('slash', 'assets/slash.png');
}

function create(){
  scene = this;
  scene.physics.world.setBounds(0, -200, ZONE_WIDTH, 1500);
  loadZone(0);

  player = scene.physics.add.sprite(40, 100, 'player');
  player.setScale(SCALE_PLAYER);
  player.setDepth(10);
  player.body.setSize(400, 800).setOffset(300, 200);
  player.body.setMaxVelocity(300, 600);

  scene.cameras.main.setBounds(0, 0, ZONE_WIDTH, GH);
  scene.cameras.main.startFollow(player, true, 0.12, 0.1);
  scene.cameras.main.setDeadzone(120, 60);
  scene.cameras.main.setBackgroundColor('#050208');

  cursors = scene.input.keyboard.createCursorKeys();
  keys = scene.input.keyboard.addKeys('A,D,W,S,SPACE,J,K,ENTER');

  bindMobileButtons();
  scene.physics.add.collider(player, platforms);
  updateHUD();
}

function updateHUD(){
  const fill = document.getElementById('flameFill');
  if(fill) fill.style.width = Math.max(0, hp/maxHp*100) + '%';
  const goldEl = document.getElementById('goldCount');
  if(goldEl) goldEl.textContent = gold;
  const z = document.getElementById('zoneName');
  if(z) z.textContent = ZONES[currentZone].nameAr;
}

function loadZone(idx){
  currentZone = idx;
  const z = ZONES[idx];

  if(platforms) platforms.clear(true, true);
  if(enemies) enemies.clear(true, true);
  if(coins) coins.clear(true, true);
  if(bgTile){ bgTile.destroy(); bgTile = null; }
  if(boss){ boss.destroy(); boss = null; }
  bossActive = false;
  bossDefeated = State.data.bossesDefeated[idx];

  platforms = scene.physics.add.staticGroup();
  enemies = scene.physics.add.group();
  coins = scene.physics.add.group();

  /* Background tileSprite */
  if(scene.textures.exists(z.bg)){
    bgTile = scene.add.tileSprite(0, 0, GW, GH, z.bg);
    bgTile.setOrigin(0, 0);
    bgTile.setScrollFactor(0);
    bgTile.setDepth(-20);
    bgTile.setAlpha(0.7);
  }

  /* Dark overlay for depth */
  const overlay = scene.add.rectangle(0, 0, GW, GH, 0x000000, 0.25);
  overlay.setOrigin(0, 0);
  overlay.setScrollFactor(0);
  overlay.setDepth(-19);

  buildLevel(z, idx);
  spawnEnemies(idx);

  scene.physics.add.collider(enemies, platforms);
  scene.physics.add.collider(coins, platforms);
}

function buildLevel(z, idx){
  const groundY = GH - 30;
  const layout = z.layout;

  if(layout === 'ground'){
    /* Simple: solid ground with small gaps */
    let x = 0;
    while(x < ZONE_WIDTH - 200){
      const w = Phaser.Math.Between(140, 220);
      addPlatform(x + w/2, groundY, w, 40, z.platform, groundY);
      x += w;
      if(Math.random() < 0.3){
        /* small floating platform */
        const fx = x + Phaser.Math.Between(30, 80);
        const fy = groundY - Phaser.Math.Between(70, 110);
        addPlatform(fx, fy, Phaser.Math.Between(60, 100), 10, z.platform, groundY);
      }
      x += Phaser.Math.Between(20, 50);
    }
  } else if(layout === 'vertical'){
    /* Vertical jumps */
    let x = 0;
    let baseY = groundY;
    while(x < ZONE_WIDTH - 200){
      addPlatform(x + 80, baseY, 160, 40, z.platform, groundY);
      /* stack of platforms going up */
      let nextY = baseY - Phaser.Math.Between(50, 80);
      if(nextY < 60) nextY = 60;
      addPlatform(x + Phaser.Math.Between(180, 240), nextY, 100, 12, z.platform, groundY);
      x += 280;
      if(Math.random() < 0.4) baseY = Math.min(groundY, nextY + Phaser.Math.Between(30, 60));
    }
  } else if(layout === 'gaps'){
    /* Big gaps requiring jumps */
    let x = 0;
    while(x < ZONE_WIDTH - 200){
      const w = Phaser.Math.Between(120, 180);
      addPlatform(x + w/2, groundY, w, 40, z.platform, groundY);
      x += w + Phaser.Math.Between(70, 110);
      /* floating platforms in the gaps */
      if(Math.random() < 0.6){
        const fx = x - 40;
        const fy = groundY - Phaser.Math.Between(50, 90);
        addPlatform(fx, fy, 60, 10, z.platform, groundY);
      }
    }
  } else {
    /* Maze: lots of stacked platforms */
    let x = 0;
    while(x < ZONE_WIDTH - 200){
      const w = Phaser.Math.Between(120, 200);
      addPlatform(x + w/2, groundY, w, 40, z.platform, groundY);
      /* Multiple levels */
      for(let lvl = 1; lvl <= 3; lvl++){
        if(Math.random() < 0.5){
          const fx = x + Phaser.Math.Between(0, w);
          const fy = groundY - lvl * 55;
          addPlatform(fx, fy, Phaser.Math.Between(60, 100), 10, z.platform, groundY);
        }
      }
      x += w + Phaser.Math.Between(20, 60);
    }
  }

  /* Final platform (boss arena) */
  addPlatform(ZONE_WIDTH - 150, groundY, 300, 40, z.platform, groundY);

  /* Coins */
  for(let i=0;i<30;i++){
    const cx = Phaser.Math.Between(200, ZONE_WIDTH - 400);
    const cy = Phaser.Math.Between(60, GH - 80);
    const c = coins.create(cx, cy, 'coin');
    c.setScale(0.6);
    c.setDepth(5);
    scene.tweens.add({targets:c, y:cy-5, duration:1200, yoyo:true, repeat:-1, ease:'Sine.easeInOut'});
  }
}

function addPlatform(cx, cy, w, h, key, groundY){
  const plat = platforms.create(cx, cy, key);
  const imgW = plat.width || 64;
  const imgH = plat.height || 32;
  plat.setScale(w / imgW, h / imgH);
  plat.refreshBody();
  plat.setDepth(-5);
  /* Tint bottom */
  return plat;
}

function spawnEnemies(idx){
  const z = ZONES[idx];
  for(let i=0;i<z.enemyCount;i++){
    setTimeout(()=>{
      if(!scene) return;
      const key = z.enemies[i % z.enemies.length];
      const ex = Phaser.Math.Between(250, ZONE_WIDTH - 600);
      const e = enemies.create(ex, 60, key);
      e.setScale(SCALE_ENEMY);
      e.setDepth(8);
      e.hp = 30 + idx*20;
      e.maxHp = e.hp;
      e.damage = 8;
      e.speed = 25 + Math.random()*20;
      e.body.setSize(400, 400).setOffset(300, 400);
      e.body.setVelocityX(Math.random()<0.5 ? -e.speed : e.speed);
      e.body.setCollideWorldBounds(false);
    }, i * 500);
  }
}

function bindMobileButtons(){
  const map = [
    {id:'btnLeft', key:'left'},
    {id:'btnRight', key:'right'},
    {id:'btnJump', key:'jump'},
    {id:'btnAttack', key:'attack'}
  ];
  map.forEach(m=>{
    const el = document.getElementById(m.id);
    if(!el) return;
    const set = (v)=>{
      keysMap[m.key] = v;
      if(v) el.classList.add('pressed'); else el.classList.remove('pressed');
      if(v && m.key==='jump') jumpPressedAt = performance.now();
    };
    el.addEventListener('touchstart', e=>{e.preventDefault();set(true);}, {passive:false});
    el.addEventListener('touchend', e=>{e.preventDefault();set(false);}, {passive:false});
    el.addEventListener('touchcancel', e=>{e.preventDefault();set(false);}, {passive:false});
    el.addEventListener('mousedown', e=>{e.preventDefault();set(true);});
    el.addEventListener('mouseup', e=>{e.preventDefault();set(false);});
    el.addEventListener('mouseleave', e=>{set(false);});
  });
}

function update(time, delta){
  if(!player || !player.active) return;
  if(bgTile){
    bgTile.tilePositionX = scene.cameras.main.scrollX * 0.3;
  }
  handleInput(time, delta);
  handleEnemies(delta);
  handleCoins();
  handleBoss(delta);
  updateHUD();
}

function handleInput(time, delta){
  const left = cursors.left.isDown || keys.A.isDown || keysMap.left;
  const right = cursors.right.isDown || keys.D.isDown || keysMap.right;
  const jumpDown = cursors.up.isDown || keys.W.isDown || keys.SPACE.isDown || keysMap.jump;
  const attackDown = keys.J.isDown || keys.K.isDown || keys.ENTER.isDown || keysMap.attack;

  if(left && !right){
    player.body.setVelocityX(-MOVE_SPEED);
    facing = -1;
    player.setFlipX(true);
  } else if(right && !left){
    player.body.setVelocityX(MOVE_SPEED);
    facing = 1;
    player.setFlipX(false);
  } else {
    player.body.setVelocityX(0);
  }

  if(player.body.blocked.down || player.body.touching.down){
    coyoteTimer = COYOTE_TIME;
  } else {
    coyoteTimer = Math.max(0, coyoteTimer - delta);
  }

  if(jumpDown && !player._prevJump){
    jumpPressedAt = time;
  }
  player._prevJump = jumpDown;

  if(time - jumpPressedAt < JUMP_BUFFER && coyoteTimer > 0){
    player.body.setVelocityY(JUMP_VELOCITY);
    jumpPressedAt = 0;
    coyoteTimer = 0;
    scene.tweens.add({
      targets:player,
      scaleY: player.scaleY*1.2, scaleX: player.scaleX*0.85,
      duration:100, yoyo:true, ease:'Quad.easeOut'
    });
    burst(player.x, player.y + 15, 6, 0xff8c3c);
  }

  if(attackDown && time - lastAttack > ATK_COOLDOWN){
    lastAttack = time;
    doAttack();
  }

  if(invulnTimer > 0){
    invulnTimer -= delta;
    player.alpha = (Math.floor(time/70)%2===0) ? 0.3 : 1;
  } else {
    player.alpha = 1;
  }
}

function doAttack(){
  /* Slash sprite instead of circle */
  const arcX = facing === 1 ? player.x + 18 : player.x - 18;
  if(scene.textures.exists('slash')){
    const arc = scene.add.image(arcX, player.y - 4, 'slash');
    arc.setScale(0.15);
    arc.setDepth(11);
    if(facing === -1) arc.setFlipX(true);
    scene.tweens.add({
      targets:arc,
      alpha:0, scaleX: arc.scaleX*1.5,
      duration: ATK_DURATION,
      onComplete:()=>arc.destroy()
    });
  } else {
    const arc = scene.add.circle(arcX, player.y - 4, 10, 0xff8c3c, 0.6);
    arc.setDepth(11);
    scene.tweens.add({targets:arc, alpha:0, scale:2, duration:ATK_DURATION, onComplete:()=>arc.destroy()});
  }

  const range = facing === 1
    ? Phaser.Geom.Rectangle(player.x + 8, player.y - 14, ATK_RANGE, 28)
    : Phaser.Geom.Rectangle(player.x - ATK_RANGE - 8, player.y - 14, ATK_RANGE, 28);

  enemies.getChildren().forEach(e=>{
    if(e.active && Phaser.Geom.Intersects.RectangleToRectangle(range, e.getBounds())){
      damageEnemy(e, PLAYER_DAMAGE);
    }
  });

  if(boss && boss.active && !boss._defeated){
    if(Phaser.Geom.Intersects.RectangleToRectangle(range, boss.getBounds())){
      damageBoss(PLAYER_DAMAGE);
    }
  }
}

function damageEnemy(e, dmg){
  e.hp -= dmg;
  e.setTint(0xffffff);
  scene.time.delayedCall(80, ()=>{ if(e.active) e.clearTint(); });
  e.body.setVelocityX(facing * 180);
  scene.physics.world.pause();
  scene.time.delayedCall(60, ()=>scene.physics.world.resume());
  scene.cameras.main.shake(120, 0.006);
  burst(e.x, e.y, 8, 0xff8c3c);

  if(e.hp <= 0){
    kills++;
    if(Math.random() < 0.5){ gold += 1; State.data.gold = gold; Save.save(State.data); }
    State.data.totalKills = (State.data.totalKills||0) + 1;
    burst(e.x, e.y, 15, 0xfbbf24);
    scene.cameras.main.shake(180, 0.01);
    e.destroy();
  }
}

function damageBoss(dmg){
  boss.hp -= dmg;
  boss.setTint(0xffffff);
  scene.time.delayedCall(80, ()=>{ if(boss && boss.active) boss.clearTint(); });
  scene.cameras.main.shake(120, 0.008);
  burst(boss.x, boss.y, 12, 0xff8c3c);

  const bf = document.getElementById('bossFill');
  if(bf){ bf.style.width = Math.max(0, boss.hp/boss.maxHp*100) + '%'; }

  if(boss.hp <= 0){
    boss._defeated = true;
    bossDefeated = true;
    State.data.bossesDefeated[currentZone] = true;
    if(currentZone+1 < 4) State.data.unlockedZones[currentZone+1] = true;
    gold += ZONES[currentZone].boss.gold;
    State.data.gold = gold;
    State.data.zone = currentZone;
    Save.save(State.data);
    burst(boss.x, boss.y, 40, 0xff8c3c);
    burst(boss.x, boss.y, 40, 0xfbbf24);
    scene.cameras.main.shake(800, 0.02);
    if(bossBarWrap) bossBarWrap.style.display = 'none';
    scene.time.delayedCall(1500, ()=>{
      if(boss) boss.destroy();
      boss = null;
      bossActive = false;
      playZoneClearScene();
    });
  }
}

function burst(x, y, count, color){
  for(let i=0;i<count;i++){
    const p = scene.add.rectangle(x, y, 2, 2, color);
    p.setDepth(15);
    const angle = Math.random()*Math.PI*2;
    const dist = 15 + Math.random()*30;
    scene.tweens.add({
      targets:p,
      x: x + Math.cos(angle)*dist,
      y: y + Math.sin(angle)*dist,
      alpha: 0,
      scale: 0,
      duration: 400 + Math.random()*300,
      onComplete:()=>p.destroy()
    });
  }
}

function damagePlayer(dmg){
  if(invulnTimer > 0) return;
  hp -= dmg;
  invulnTimer = INVULN_TIME;
  scene.cameras.main.shake(220, 0.012);
  burst(player.x, player.y, 12, 0xff3c14);
  player.body.setVelocityX(-facing * 120);
  player.body.setVelocityY(-100);
  updateHUD();
  if(hp <= 0){
    hp = maxHp;
    player.x = 40;
    player.y = 60;
    player.body.setVelocity(0, 0);
    scene.cameras.main.flash(400, 255, 60, 20);
  }
}

function handleEnemies(delta){
  enemies.getChildren().forEach(e=>{
    if(!e.active) return;
    if(e.y > GH + 60){ e.destroy(); return; }

    const dist = player.x - e.x;
    if(Math.abs(dist) < 250){
      if(dist > 0) e.body.setVelocityX(Math.abs(e.speed) * 1.3);
      else e.body.setVelocityX(-Math.abs(e.speed) * 1.3);
    }

    if(Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), e.getBounds())){
      damagePlayer(e.damage);
    }
  });

  if(boss && boss.active && !boss._defeated){
    const dist = player.x - boss.x;
    if(Math.abs(dist) < 280){
      if(dist > 0) boss.body.setVelocityX(40);
      else boss.body.setVelocityX(-40);
    } else {
      boss.body.setVelocityX(0);
    }
    if(Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), boss.getBounds())){
      damagePlayer(12);
    }
  }
}

function handleCoins(){
  coins.getChildren().forEach(c=>{
    if(!c.active) return;
    if(Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), c.getBounds())){
      gold += 2;
      State.data.gold = gold;
      Save.save(State.data);
      burst(c.x, c.y, 5, 0xfbbf24);
      c.destroy();
    }
  });
}

function handleBoss(delta){
  if(bossActive || bossDefeated) return;
  if(player.x > ZONE_WIDTH - 450){
    spawnBoss();
  }
}

function spawnBoss(){
  bossActive = true;
  const z = ZONES[currentZone];

  if(window.BossPrompt){
    BossPrompt.show(z.boss.nameAr, ()=>{
      const bx = player.x + 180;
      const by = 80;
      boss = scene.physics.add.sprite(bx, by, z.bossSprite);
      boss.setScale(SCALE_BOSS);
      boss.setDepth(12);
      boss.hp = z.boss.hp;
      boss.maxHp = z.boss.hp;
      boss.body.setSize(700, 800).setOffset(150, 150);
      scene.physics.add.collider(boss, platforms);

      ensureBossUI();
      if(bossBarWrap){
        bossBarWrap.style.display = 'block';
        const nm = document.getElementById('bossName');
        if(nm) nm.textContent = z.boss.nameAr;
        const bf = document.getElementById('bossFill');
        if(bf) bf.style.width = '100%';
      }
      scene.cameras.main.shake(600, 0.015);
    }, ()=>{ bossActive = false; });
  } else {
    bossActive = false;
  }
}

function ensureBossUI(){
  if(document.getElementById('bossBar')){ bossBarWrap = document.getElementById('bossBar'); return; }
  bossBarWrap = document.createElement('div');
  bossBarWrap.id = 'bossBar';
  bossBarWrap.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);width:60%;max-width:400px;z-index:120;pointer-events:none;background:rgba(5,2,8,0.9);padding:8px 12px;border-radius:12px;border:2px solid rgba(255,140,60,0.6);backdrop-filter:blur(6px);box-shadow:0 0 30px rgba(255,140,60,0.5);display:none';
  bossBarWrap.innerHTML = '<div id="bossName" style="text-align:center;font-family:Cairo,sans-serif;font-size:0.85rem;color:#ffb87a;letter-spacing:3px;margin-bottom:6px">BOSS</div><div style="width:100%;height:10px;background:rgba(0,0,0,0.9);border-radius:50px;overflow:hidden;border:1px solid rgba(255,140,60,0.4)"><div id="bossFill" style="width:100%;height:100%;background:linear-gradient(90deg,#ff8c3c,#ff3c14,#c084fc);border-radius:50px;transition:width 0.2s;box-shadow:0 0 10px #ff8c3c"></div></div>';
  document.body.appendChild(bossBarWrap);
}

function playZoneClearScene(){
  const scenes = ['ashes_clear','rust_clear','frost_clear','void_clear'];
  const chapters = [Story.chapters.ashes,Story.chapters.rust,Story.chapters.frost,Story.chapters.void];
  if(window.Story && currentZone < 4){
    Story.play(scenes[currentZone], ()=>{
      if(currentZone === 3){
        Story.play('father_intro', ()=>{ playFinale(); }, Story.chapters.father);
      } else {
        currentZone++;
        State.data.zone = currentZone;
        Save.save(State.data);
        reloadZone();
      }
    }, chapters[currentZone]);
  }
}

function playFinale(){
  /* Final scene: father ending */
  if(window.Story){
    Story.play('father_clear', ()=>{
      Story.play('ending', ()=>{
        location.reload();
      }, Story.chapters.ending);
    }, Story.chapters.father);
  } else {
    location.reload();
  }
}

function reloadZone(){
  player.x = 40;
  player.y = 60;
  player.body.setVelocity(0, 0);
  loadZone(currentZone);
  scene.physics.add.collider(player, platforms);
  scene.cameras.main.setBounds(0, 0, ZONE_WIDTH, GH);
}

window.EmberGame = {
  start(isNew){
    if(isNew){
      gold = 0;
      hp = BASE_HP;
      maxHp = BASE_HP;
      kills = 0;
      currentZone = 0;
      if(window.Story){
        Story.play('intro', ()=>{ startGame(); }, Story.chapters.intro);
      } else {
        startGame();
      }
    } else {
      gold = State.data.gold || 0;
      hp = BASE_HP;
      maxHp = BASE_HP;
      kills = State.data.totalKills || 0;
      currentZone = State.data.zone || 0;
      startGame();
    }
  }
};

function startGame(){
  if(State.started) return;
  State.started = true;

  /* Ensure boss UI exists */
  ensureBossUI();

  const config = {
    type: Phaser.AUTO,
    width: GW,
    height: GH,
    parent: 'game-wrap',
    backgroundColor: '#050208',
    physics: { default: 'arcade', arcade: { gravity: { y: GRAVITY }, debug: false } },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    pixelArt: false,
    scene: { preload, create, update }
  };
  window._emberGame = new Phaser.Game(config);
}
