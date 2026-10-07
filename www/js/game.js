'use strict';

/* ============================================
   EMBER - powered by Phaser 3
   Assets: Gothicvania (CC0)
   ============================================ */

const Save = {
  KEY: 'ember_save_v2',
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

const ENEMY_ANIMS = {
  'skeleton': 'skeleton-walk',
  'skeleton-clothed': 'skeleton-clothed-walk',
  'ghost': 'ghost-float',
  'hell-gato': 'hell-gato-walk'
};

const ZONES = [
  { name:'ASHES', nameAr:'الرماد', bg:'bg-graveyard', tint:0x5a3a2a,
    enemies:['skeleton','skeleton-clothed','hell-gato'], enemyCount:10,
    
    bossSprite:'skeleton-clothed-1', bossAnim:'skeleton-clothed-walk',
    boss:{ nameAr:'حارس الرماد', hp:400, gold:15 } },
  { name:'RUST', nameAr:'الصدأ', bg:'bg-graveyard', tint:0x8a4a2a,
    enemies:['hell-gato','skeleton-clothed'], enemyCount:12,
    
    bossSprite:'hell-gato-1', bossAnim:'hell-gato-walk',
    boss:{ nameAr:'حارس الحديد', hp:600, gold:20 } },
  { name:'FROST', nameAr:'الصقيع', bg:'bg-graveyard', tint:0x3a6a9a,
    enemies:['ghost','skeleton'], enemyCount:14,
    
    bossSprite:'ghost-1', bossAnim:'ghost-float',
    boss:{ nameAr:'الأم المتجمدة', hp:800, gold:30 } },
  { name:'VOID', nameAr:'الفراغ', bg:'bg-graveyard', tint:0x3a2a5a,
    enemies:['ghost','skeleton-clothed','skeleton'], enemyCount:16,
    
    bossSprite:'ghost-1', bossAnim:'ghost-float',
    boss:{ nameAr:'الأب', hp:1500, gold:50 } }
];

const State = { data: Save.load(), started: false };

let scene, player, cursors, keys;
let platforms, enemies, coins;
let hp = 100, maxHp = 100, gold = 0, kills = 0;
let facing = 1;
let invulnTimer = 0, coyoteTimer = 0, jumpPressedAt = 0;
let lastAttack = 0;
let currentZone = 0;
let boss = null, bossActive = false, bossDefeated = false;
let music = null;
const keysMap = {left:false,right:false,jump:false,attack:false};

const GW = 480, GH = 270;
const GRAVITY = 900;
const MOVE_SPEED = 130;
const JUMP_VELOCITY = -340;
const COYOTE_TIME = 100;
const JUMP_BUFFER = 120;
const ATK_COOLDOWN = 350;
const ATK_DURATION = 250;
const ATK_RANGE = 45;
const INVULN_TIME = 1200;
const PLAYER_DAMAGE = 50;
const BASE_HP = 100;
const PLAYER_SCALE = 1.2;
const ENEMY_SCALE = 1.2;
const BOSS_SCALE = 1.8;

/* ===== Preload ===== */
function preload(){
  scene = this;
  for(let i=1;i<=4;i++) scene.load.image('hero-idle-'+i, 'assets/gv/hero/hero-idle-'+i+'.png');
  for(let i=1;i<=6;i++) scene.load.image('hero-run-'+i, 'assets/gv/hero/hero-run-'+i+'.png');
  for(let i=1;i<=4;i++) scene.load.image('hero-jump-'+i, 'assets/gv/hero/hero-jump-'+i+'.png');
  for(let i=1;i<=5;i++) scene.load.image('hero-attack-'+i, 'assets/gv/hero/hero-attack-'+i+'.png');
  scene.load.image('hero-hurt', 'assets/gv/hero/hero-hurt-1.png');

  for(let i=1;i<=8;i++) scene.load.image('skeleton-'+i, 'assets/gv/enemies/skeleton-'+i+'.png');
  for(let i=1;i<=8;i++) scene.load.image('skeleton-clothed-'+i, 'assets/gv/enemies/skeleton-clothed-'+i+'.png');
  for(let i=1;i<=4;i++) scene.load.image('ghost-'+i, 'assets/gv/enemies/ghost-'+i+'.png');
  for(let i=1;i<=4;i++) scene.load.image('hell-gato-'+i, 'assets/gv/enemies/hell-gato-'+i+'.png');
  for(let i=1;i<=5;i++) scene.load.image('enemy-death-'+i, 'assets/gv/enemies/enemy-death-'+i+'.png');

  scene.load.image('bg-graveyard', 'assets/gv/env/bg_crypt.png');
  scene.load.image('tile-0', 'assets/gv/tiles/ground-clean.png');
  scene.load.image('tile-1', 'assets/gv/tiles/ground-clean.png');
  scene.load.image('tile-2', 'assets/gv/tiles/ground-clean.png');
  scene.load.image('tile-3', 'assets/gv/tiles/ground-clean.png');
  scene.load.image('bg-mountains', 'assets/gv/env/mountains.png');
  scene.load.spritesheet('tileset', 'assets/gv/env/tileset.png', { frameWidth: 16, frameHeight: 16 });

  scene.load.audio('sfx-jump', 'assets/gv/sounds/jump.ogg');
  scene.load.audio('sfx-attack', 'assets/gv/sounds/attack.ogg');
  scene.load.audio('sfx-hurt', 'assets/gv/sounds/hurt.ogg');
  scene.load.audio('sfx-kill', 'assets/gv/sounds/kill.ogg');
  scene.load.audio('music-main', 'assets/gv/sounds/sci_fi_platformer04_main_loop.ogg');
}

/* ===== Animations ===== */
function createAnimations(){
  const A = scene.anims;
  if(!A.exists('hero-idle')) A.create({key:'hero-idle', frames:[1,2,3,4].map(i=>({key:'hero-idle-'+i})), frameRate:8, repeat:-1});
  if(!A.exists('hero-run'))  A.create({key:'hero-run',  frames:[1,2,3,4,5,6].map(i=>({key:'hero-run-'+i})), frameRate:12, repeat:-1});
  if(!A.exists('hero-jump')) A.create({key:'hero-jump', frames:[1,2,3,4].map(i=>({key:'hero-jump-'+i})), frameRate:10, repeat:0});
  if(!A.exists('hero-attack')) A.create({key:'hero-attack', frames:[1,2,3,4,5].map(i=>({key:'hero-attack-'+i})), frameRate:20, repeat:0});
  if(!A.exists('hero-hurt')) A.create({key:'hero-hurt', frames:[{key:'hero-hurt'}], frameRate:1, repeat:0});

  if(!A.exists('skeleton-walk')) A.create({key:'skeleton-walk', frames:[1,2,3,4,5,6,7,8].map(i=>({key:'skeleton-'+i})), frameRate:10, repeat:-1});
  if(!A.exists('skeleton-clothed-walk')) A.create({key:'skeleton-clothed-walk', frames:[1,2,3,4,5,6,7,8].map(i=>({key:'skeleton-clothed-'+i})), frameRate:10, repeat:-1});
  if(!A.exists('ghost-float')) A.create({key:'ghost-float', frames:[1,2,3,4].map(i=>({key:'ghost-'+i})), frameRate:6, repeat:-1});
  if(!A.exists('hell-gato-walk')) A.create({key:'hell-gato-walk', frames:[1,2,3,4].map(i=>({key:'hell-gato-'+i})), frameRate:8, repeat:-1});
  if(!A.exists('enemy-death')) A.create({key:'enemy-death', frames:[1,2,3,4,5].map(i=>({key:'enemy-death-'+i})), frameRate:15, repeat:0});
}

/* ===== Create ===== */
function create(){
  scene = this;
  createAnimations();
  scene.physics.world.setBounds(0, 0, 10000, 1500);

  // تكستشرات مساعدة
  // أرضية من الحزمة القوطية الجديدة
  function makeGround(key, tintC){
    if(scene.textures.exists(key)) return;
    const srcImg = scene.textures.get("dungeon").getSourceImage();
    const cv = document.createElement("canvas");
    cv.width = 32; cv.height = 32;
    const ctx = cv.getContext("2d");
    // بلاطة الجدار الحجري (32,0)
    ctx.drawImage(srcImg, 32, 0, 32, 32, 0, 0, 32, 32);
    // تلوين
    const imgData = ctx.getImageData(0, 0, 32, 32);
    const d = imgData.data;
    const tr = (tintC >> 16) & 0xFF;
    const tg = (tintC >> 8) & 0xFF;
    const tb = tintC & 0xFF;
    for(let i=0; i<d.length; i+=4){
      d[i] = Math.min(255, d[i] * 1.3);
      d[i+1] = Math.min(255, d[i+1] * 1.3);
      d[i+2] = Math.min(255, d[i+2] * 1.3);
      d[i] = (d[i] * tr) / 255;
      d[i+1] = (d[i+1] * tg) / 255;
      d[i+2] = (d[i+2] * tb) / 255;
    }
    ctx.putImageData(imgData, 0, 0);
    scene.textures.addCanvas(key, cv);
  }
  makeGround("ground-0", 0xffffff);
  makeGround("ground-1", 0xffb090);
  makeGround("ground-2", 0xa8d0ff);
  makeGround("ground-3", 0xc8a8ff);
  if(!scene.textures.exists('coin')){
    const g = scene.add.graphics();
    g.fillStyle(0xfbbf24, 1);
    g.fillCircle(8, 8, 6);
    g.generateTexture('coin', 16, 16);
    g.destroy();
  }
  if(!scene.textures.exists('dust')){
    const g = scene.add.graphics();
    g.fillStyle(0xffffff, 1);
    g.fillCircle(4, 4, 4);
    g.generateTexture('dust', 8, 8);
    g.destroy();
  }

  loadZone(0);

  player = scene.physics.add.sprite(60, 100, 'hero-idle-1');
  player.play('hero-idle');
  player.setDepth(10);
  player.setScale(PLAYER_SCALE);
  player.body.setSize(14, 28).setOffset(10, 14);
  player.body.setMaxVelocity(300, 500);
  player._wasOnGround = true;

  scene.cameras.main.setBounds(0, 0, ZONES[currentZone].width || 6000, GH);
  scene.cameras.main.startFollow(player, true, 0.1, 0.1);
  scene.cameras.main.setDeadzone(120, 60);
  scene.cameras.main.fadeIn(800, 0, 0, 0);

  cursors = scene.input.keyboard.createCursorKeys();
  keys = scene.input.keyboard.addKeys('A,D,W,S,SPACE,J,K,ENTER');

  bindMobileButtons();
  scene.physics.add.collider(player, platforms);
  updateHUD();

  // موسيقى
  if(!music && scene.sound){
    try{
      music = scene.sound.add('music-main', {volume: 0.18, loop: true});
      music.play();
    }catch(e){}
  }
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
  const W = 3500;
  z.width = W;

  if(platforms) platforms.clear(true, true);
  if(enemies) enemies.clear(true, true);
  if(coins) coins.clear(true, true);
  if(boss){ boss.destroy(); boss = null; }
  bossActive = false;
  bossDefeated = State.data.bossesDefeated[idx];

  platforms = scene.physics.add.staticGroup();
  enemies = scene.physics.add.group();
  coins = scene.physics.add.group();

  // خلفية قوطية
  if(scene.textures.exists('bg-graveyard')){
    const bg = scene.add.image(0, 0, 'bg-graveyard');
    bg.setOrigin(0, 0);
    bg.setScrollFactor(0);
    bg.setDisplaySize(GW, GH);
    bg.setDepth(-30);
    if(z.tint) bg.setTint(z.tint);
  }

  const groundY = GH - 60;
  const tileKey = 'tile-' + idx;

  // الأرضية - tileSprite متكرر
  if(scene.textures.exists(tileKey)){
    const ground = scene.add.tileSprite(0, groundY, W, 60, tileKey);
    ground.setOrigin(0, 0);
    ground.setDepth(-5);
    if(z.tint) ground.setTint(z.tint);
  }

  // جسم مادي للأرضية
  const groundBody = platforms.create(W/2, groundY + 30, 'platform');
  groundBody.setVisible(false);
  groundBody.setDisplaySize(W, 60);
  groundBody.refreshBody();

  // منصات معلقة
  for(let i=0; i<18; i++){
    const px = Phaser.Math.Between(300, W - 400);
    const py = groundY - Phaser.Math.Between(80, 140);
    const pw = Phaser.Math.Between(100, 160);

    if(scene.textures.exists(tileKey)){
      const pfVis = scene.add.tileSprite(px - pw/2, py, pw, 20, tileKey);
      pfVis.setOrigin(0, 0);
      pfVis.setDepth(-5);
      if(z.tint) pfVis.setTint(z.tint);
    }

    const pfBody = platforms.create(px, py + 10, 'platform');
    pfBody.setVisible(false);
    pfBody.setDisplaySize(pw, 20);
    pfBody.refreshBody();
  }

  // آخر منصة
  const endBody = platforms.create(W - 100, groundY + 30, 'platform');
  endBody.setVisible(false);
  endBody.setDisplaySize(200, 60);
  endBody.refreshBody();

  // عملات
  for(let i=0;i<25;i++){
    const cx = Phaser.Math.Between(200, W - 400);
    const cy = Phaser.Math.Between(80, groundY - 60);
    const c = coins.create(cx, cy, 'coin');
    c.setScale(0.5);
    c.setDepth(5);
    scene.tweens.add({targets:c, y:cy-6, duration:1200, yoyo:true, repeat:-1, ease:'Sine.easeInOut'});
  }

  spawnEnemies(idx);
  scene.physics.add.collider(enemies, platforms);
  scene.physics.add.collider(coins, platforms);
}

function spawnEnemies(idx){
  const z = ZONES[idx];
  const W = z.width;
  for(let i=0;i<z.enemyCount;i++){
    setTimeout(()=>{
      if(!scene || !enemies || !player || !player.active) return;
      const key = z.enemies[i % z.enemies.length];
      const ex = Phaser.Math.Between(200, W - 500);
      const e = enemies.create(ex, 80, key + '-1');
      if(ENEMY_ANIMS[key]) e.play(ENEMY_ANIMS[key]);
      e.setScale(ENEMY_SCALE);
      e.setDepth(8);
      e.hp = 40 + idx*30;
      e.maxHp = e.hp;
      e.damage = 10;
      e.speed = 30 + Math.random()*25;
      e.enemyKey = key;
      e.body.setVelocityX(Math.random()<0.5 ? -e.speed : e.speed);
      e.body.setSize(14, 22).setOffset(9, 10);
      e.body.setCollideWorldBounds(false);
      e.setFlipX(e.body.velocity.x < 0);
      
    }, i * 400);
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
  if(player.y > GH + 100){
    player.y = 60;
    player.body.setVelocity(0, 0);
    return;
  }
  handleInput(time, delta);
  handleEnemies(delta);
  handleCoins();
  handleBoss(delta);
  updateHUD();
}

function setPlayerAnim(key){
  if(!player.anims) return;
  if(player.anims.currentAnim && player.anims.currentAnim.key === key) return;
  player.play(key, true);
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

  const onGround = player.body.blocked.down || player.body.touching.down;
  if(onGround) coyoteTimer = COYOTE_TIME;
  else coyoteTimer = Math.max(0, coyoteTimer - delta);

  if(jumpDown && !player._prevJump){
    jumpPressedAt = time;
  }
  player._prevJump = jumpDown;

  if(time - jumpPressedAt < JUMP_BUFFER && coyoteTimer > 0){
    player.body.setVelocityY(JUMP_VELOCITY);
    if(scene.sound) scene.sound.play('sfx-jump', {volume: 0.4});
    jumpPressedAt = 0;
    coyoteTimer = 0;
    spawnDust(player.x, player.y + 12, 5);
  }

  // غبار الهبوط + الجري
  if(onGround && !player._wasOnGround) spawnDust(player.x, player.y + 12, 8);
  if(onGround && Math.abs(player.body.velocity.x) > 50 && Math.random() < 0.15) spawnDust(player.x - facing*8, player.y + 12, 1);
  player._wasOnGround = onGround;

  if(invulnTimer > 0){
    invulnTimer -= delta;
    player.alpha = (Math.floor(time/60)%2===0) ? 0.3 : 1;
  } else {
    player.alpha = 1;
  }

  if(!onGround){
    setPlayerAnim('hero-jump');
  } else if(Math.abs(player.body.velocity.x) > 10){
    setPlayerAnim('hero-run');
  } else {
    setPlayerAnim('hero-idle');
  }

  if(attackDown && time - lastAttack > ATK_COOLDOWN){
    lastAttack = time;
    doAttack();
  }
}

function spawnDust(x, y, count){
  for(let i=0;i<count;i++){
    const d = scene.add.image(x, y, 'dust');
    d.setTint(0xaaaaaa);
    d.setDepth(9);
    d.setAlpha(0.6);
    const vx = (Math.random()-0.5) * 40;
    const vy = -20 - Math.random()*30;
    scene.tweens.add({
      targets: d,
      x: x + vx, y: y + vy,
      alpha: 0, scale: 0.2,
      duration: 400 + Math.random()*200,
      onComplete: ()=>d.destroy()
    });
  }
}

function doAttack(){
  player.play('hero-attack', true);
  if(scene.sound) scene.sound.play('sfx-attack', {volume: 0.5});

  const arcX = facing === 1 ? player.x + 25 : player.x - 25;
  const arc = scene.add.circle(arcX, player.y, 18, 0xff8c3c, 0.7);
  arc.setDepth(11);
  scene.tweens.add({
    targets:arc,
    alpha:0, scale:2.2, duration:ATK_DURATION,
    onComplete:()=>arc.destroy()
  });

  const range = facing === 1
    ? new Phaser.Geom.Rectangle(player.x + 10, player.y - 25, ATK_RANGE, 50)
    : new Phaser.Geom.Rectangle(player.x - ATK_RANGE - 10, player.y - 25, ATK_RANGE, 50);

  let hit = false;
  enemies.getChildren().forEach(e=>{
    if(e.active && e.body.enable && Phaser.Geom.Intersects.RectangleToRectangle(range, e.getBounds())){
      damageEnemy(e, PLAYER_DAMAGE);
      hit = true;
    }
  });

  if(boss && boss.active && !boss._defeated){
    if(Phaser.Geom.Intersects.RectangleToRectangle(range, boss.getBounds())){
      damageBoss(PLAYER_DAMAGE);
      hit = true;
    }
  }

  if(hit) hitStop(60);
}

function hitStop(ms){
  if(scene.physics && scene.physics.world){
    scene.physics.world.pause();
    scene.time.delayedCall(ms, ()=>{ if(scene.physics) scene.physics.world.resume(); });
  }
}

function damageEnemy(e, dmg){
  if(!e.active || !e.body.enable) return;
  e.hp -= dmg;
  e.setTint(0xffffff);
  scene.time.delayedCall(80, ()=>{ if(e.active) e.clearTint(); });
  e.body.setVelocityX(facing * 200);
  scene.cameras.main.shake(100, 0.005);
  burst(e.x, e.y, 8, 0xff8c3c);

  if(e.hp <= 0){
    kills++;
    if(scene.sound) scene.sound.play('sfx-kill', {volume: 0.5});
    if(Math.random() < 0.4){ gold += 1; State.data.gold = gold; Save.save(State.data); }
    State.data.totalKills = (State.data.totalKills||0) + 1;
    burst(e.x, e.y, 15, 0xfbbf24);
    scene.cameras.main.shake(150, 0.01);
    if(e.enemyKey && scene.anims.exists('enemy-death')) e.play('enemy-death');
    e.body.enable = false;
    scene.time.delayedCall(400, ()=>{ if(e.active) e.destroy(); });
  }
}

function damageBoss(dmg){
  if(!boss || !boss.active) return;
  boss.hp -= dmg;
  boss.setTint(0xffffff);
  scene.time.delayedCall(80, ()=>{ if(boss && boss.active) boss.clearTint(); });
  scene.cameras.main.shake(100, 0.008);
  burst(boss.x, boss.y, 12, 0xff8c3c);

  const bossBar = document.getElementById('bossFill');
  if(bossBar){ bossBar.style.width = Math.max(0, boss.hp/boss.maxHp*100) + '%'; }

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
    const wrap = document.getElementById('bossBar');
    if(wrap) wrap.style.display = 'none';
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
    const p = scene.add.rectangle(x, y, 3, 3, color);
    p.setDepth(15);
    const angle = Math.random()*Math.PI*2;
    const dist = 20 + Math.random()*40;
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
  
  if(scene.sound) scene.sound.play('sfx-hurt', {volume: 0.6});
  player.setTint(0xff0000);
  scene.time.delayedCall(200, ()=>{ if(player) player.clearTint(); });
  scene.cameras.main.shake(200, 0.01);
  burst(player.x, player.y, 12, 0xff3c14);
  player.body.setVelocityX(-facing * 120);
  player.body.setVelocityY(-100);
  updateHUD();
  if(hp <= 0){
    hp = maxHp;
    player.x = 60;
    player.y = 60;
    player.body.setVelocity(0, 0);
    
  }
}

function handleEnemies(delta){
  enemies.getChildren().forEach(e=>{
    if(!e.active) return;
    if(e.y > GH + 60){ e.destroy(); return; }

    if(e.body.enable){
      const dist = player.x - e.x;
      if(Math.abs(dist) < 250){
        if(dist > 0) e.body.setVelocityX(Math.abs(e.speed) * 1.3);
        else e.body.setVelocityX(-Math.abs(e.speed) * 1.3);
      }
      e.setFlipX(e.body.velocity.x < 0);
    }

    if(e.body.enable && Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), e.getBounds())){
      damagePlayer(e.damage);
    }
  });

  if(boss && boss.active && !boss._defeated){
    const dist = player.x - boss.x;
    if(Math.abs(dist) < 300){
      if(dist > 0) boss.body.setVelocityX(50);
      else boss.body.setVelocityX(-50);
    } else {
      boss.body.setVelocityX(0);
    }
    boss.setFlipX(boss.body.velocity.x < 0);
    if(Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), boss.getBounds())){
      damagePlayer(15);
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
      // تأثير طيران
      const t = scene.add.image(c.x, c.y, 'coin').setScale(0.5).setDepth(20);
      scene.tweens.add({
        targets: t,
        x: player.x + 60, y: player.y - 100,
        alpha: 0, scale: 0,
        duration: 400,
        onComplete: ()=>t.destroy()
      });
      c.destroy();
    }
  });
}

function handleBoss(delta){
  if(bossDefeated) return;
  if(bossActive) return;
  if(player.x > 800){
    spawnBoss();
  }
}

function spawnBoss(){
  bossActive = true;
  const z = ZONES[currentZone];
  const bx = player.x + 150;
  const by = 80;
  boss = scene.physics.add.sprite(bx, by, z.bossSprite);
  if(z.bossAnim) boss.play(z.bossAnim);
  boss.setDepth(12);
  boss.setScale(BOSS_SCALE);
  boss.hp = z.boss.hp;
  boss.maxHp = z.boss.hp;
  boss.body.setSize(14, 22).setOffset(9, 10);
  boss.body.setCollideWorldBounds(true);
  scene.physics.add.collider(boss, platforms);
  ensureBossUI();
  const wrap = document.getElementById("bossBar");
  if(wrap){
    wrap.style.display = "block";
    const nm = document.getElementById("bossName");
    if(nm) nm.textContent = z.boss.nameAr;
    const bf = document.getElementById("bossFill");
    if(bf) bf.style.width = "100%";
  }
  scene.cameras.main.shake(600, 0.015);
}

function ensureBossUI(){
  if(document.getElementById('bossBar')) return;
  const wrap = document.createElement('div');
  wrap.id = 'bossBar';
  wrap.style.cssText = 'position:fixed;bottom:110px;left:50%;transform:translateX(-50%);width:60%;max-width:400px;z-index:120;pointer-events:none;background:rgba(5,2,8,0.9);padding:8px 12px;border-radius:12px;border:2px solid rgba(255,140,60,0.6);backdrop-filter:blur(6px);box-shadow:0 0 30px rgba(255,140,60,0.5);display:none';
  wrap.innerHTML = '<div id="bossName" style="text-align:center;font-family:Cairo,sans-serif;font-size:0.85rem;color:#ffb87a;letter-spacing:3px;margin-bottom:6px">BOSS</div><div style="width:100%;height:10px;background:rgba(0,0,0,0.9);border-radius:50px;overflow:hidden;border:1px solid rgba(255,140,60,0.4)"><div id="bossFill" style="width:100%;height:100%;background:linear-gradient(90deg,#ff8c3c,#ff3c14,#c084fc);border-radius:50px;transition:width 0.2s;box-shadow:0 0 10px #ff8c3c"></div></div>';
  document.body.appendChild(wrap);
}

function playZoneClearScene(){
  const scenes = ['ashes_clear','rust_clear','frost_clear','void_clear'];
  const chapters = [Story.chapters.ashes,Story.chapters.rust,Story.chapters.frost,Story.chapters.void];
  if(window.Story && currentZone < 4){
    Story.play(scenes[currentZone], ()=>{
      if(currentZone === 3){
        Story.play('shadow_intro', ()=>{ playFinalBoss(); }, Story.chapters.shadow);
      } else {
        currentZone++;
        State.data.zone = currentZone;
        Save.save(State.data);
        reloadZone();
      }
    }, chapters[currentZone]);
  }
}

function playFinalBoss(){
  bossActive = true;
  boss = scene.physics.add.sprite(player.x + 200, 80, 'ghost-1');
  boss.play('ghost-float');
  boss.setDepth(12);
  boss.setScale(BOSS_SCALE + 0.4);
  boss.hp = 2000;
  boss.maxHp = 2000;
  boss.body.setSize(14, 22).setOffset(9, 10);
      boss.body.setCollideWorldBounds(true);
  scene.physics.add.collider(boss, platforms);
  ensureBossUI();
  const wrap = document.getElementById('bossBar');
  if(wrap){
    wrap.style.display = 'block';
    const nm = document.getElementById('bossName');
    if(nm) nm.textContent = 'الأب';
  }
  scene.cameras.main.shake(800, 0.02);
}

function reloadZone(){
  player.x = 60;
  player.y = 60;
  player.body.setVelocity(0, 0);
  loadZone(currentZone);
  scene.physics.add.collider(player, platforms);
  scene.cameras.main.setBounds(0, 0, ZONES[currentZone].width, GH);
  scene.cameras.main.fadeIn(600, 0, 0, 0);
}

window.EmberGame = {
  start(){
    gold = State.data.gold || 0;
    hp = BASE_HP;
    maxHp = BASE_HP;
    kills = State.data.totalKills || 0;
    currentZone = State.data.zone || 0;

    if(window.Story){
      Story.play('intro', ()=>{ startGame(); }, Story.chapters.intro);
    } else {
      startGame();
    }
  }
};

function startGame(){
  if(State.started) return;
  State.started = true;
  const config = {
    type: Phaser.AUTO,
    width: GW,
    height: GH,
    parent: 'game-wrap',
    backgroundColor: '#050208',
    physics: {
      default: 'arcade',
      arcade: { gravity: { y: GRAVITY }, debug: false }
    },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    pixelArt: true,
    scene: { preload, create, update }
  };
  window._emberGame = new Phaser.Game(config);
}
