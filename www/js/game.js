(function(){
'use strict';

window.addEventListener('error',function(e){console.error('❌ Game Error:',e.message,'at line',e.lineno);});

/* ===== INLINE SAVE ===== */
var Save=(function(){
  var KEY='sb_save_v7', SK='sb_settings_v7';
  var DD={gold:0,weaponLevel:1,armorLevel:1,bossesDefeated:[false,false,false,false],totalKills:0,playerX:60,playerY:100,currentZone:0,unlockedZones:[true,false,false,false]};
  var DS={master:50,sfx:70,vibration:true,particles:true};
  function load(){try{var r=localStorage.getItem(KEY);if(!r)return JSON.parse(JSON.stringify(DD));var d=JSON.parse(r);for(var k in DD)if(d[k]===undefined)d[k]=DD[k];return d;}catch(e){return JSON.parse(JSON.stringify(DD));}}
  function save(d){try{d.lastSaved=Date.now();localStorage.setItem(KEY,JSON.stringify(d));return true;}catch(e){return false;}}
  function reset(){try{localStorage.removeItem(KEY);}catch(e){}}
  function loadS(){try{var r=localStorage.getItem(SK);if(!r)return JSON.parse(JSON.stringify(DS));var s=JSON.parse(r);for(var k in DS)if(s[k]===undefined)s[k]=DS[k];return s;}catch(e){return JSON.parse(JSON.stringify(DS));}}
  function saveS(s){try{localStorage.setItem(SK,JSON.stringify(s));return true;}catch(e){return false;}}
  return{load:load,save:save,reset:reset,loadSettings:loadS,saveSettings:saveS};
})();
window.Save=Save;

var VW=480,VH=270,GRAVITY=900,MOVE_SPEED=140,JUMP_FORCE=-380,FRICTION=0.82;
var ATK_DUR=0.22,ATK_CD=0.30,ATK_RANGE=30,INV_TIME=1.2;
var BASE_DAMAGE=30,BASE_HP=100;

var canvas=document.getElementById('game');
var ctx=canvas.getContext('2d');
function resize(){canvas.width=VW;canvas.height=VH;}
window.addEventListener('resize',resize);
window.addEventListener('orientationchange',function(){setTimeout(resize,300);});
resize();

var saveData=Save.load();
var settings=Save.loadSettings();
var gameRunning=false;

/* ===== INPUT ===== */
var input={left:false,right:false,jump:false,attack:false,jp:false,ap:false};
window.addEventListener('keydown',function(e){var k=e.key.toLowerCase();
  if(k==='arrowleft'||k==='a')input.left=true;
  if(k==='arrowright'||k==='d')input.right=true;
  if(k===' '||k==='arrowup'||k==='w'){if(!input.jump)input.jp=true;input.jump=true;}
  if(k==='j'||k==='k'||k==='enter'){if(!input.attack)input.ap=true;input.attack=true;}
  if(['arrowleft','arrowright','arrowup','arrowdown',' '].indexOf(k)!==-1)e.preventDefault();});
window.addEventListener('keyup',function(e){var k=e.key.toLowerCase();
  if(k==='arrowleft'||k==='a')input.left=false;
  if(k==='arrowright'||k==='d')input.right=false;
  if(k===' '||k==='arrowup'||k==='w')input.jump=false;
  if(k==='j'||k==='k'||k==='enter')input.attack=false;});

function bindBtn(id,onD,onU){
  var b=document.getElementById(id);if(!b)return;
  var pressed=false;
  var p=function(e){if(e){e.preventDefault();e.stopPropagation();}if(pressed)return;pressed=true;b.classList.add('pressed');try{if(window.Sound){Sound.init();Sound.resume();}}catch(err){}onD();};
  var r=function(e){if(e){e.preventDefault();e.stopPropagation();}if(!pressed)return;pressed=false;b.classList.remove('pressed');if(onU)onU();};
  b.addEventListener('touchstart',p,{passive:false});
  b.addEventListener('touchend',r,{passive:false});
  b.addEventListener('touchcancel',r,{passive:false});
  b.addEventListener('mousedown',p);
  b.addEventListener('mouseup',r);
  b.addEventListener('mouseleave',r);
  b.addEventListener('contextmenu',function(e){e.preventDefault();});
}
bindBtn('btnLeft',function(){input.left=true;},function(){input.left=false;});
bindBtn('btnRight',function(){input.right=true;},function(){input.right=false;});
bindBtn('btnJump',function(){if(!input.jump)input.jp=true;input.jump=true;},function(){input.jump=false;});
bindBtn('btnAttack',function(){if(!input.attack)input.ap=true;input.attack=true;},function(){input.attack=false;});

/* ===== ZONES ===== */
var ZONES=[
  {name:'CRYPT',startX:0,endX:2000,
   theme:{bg1:'#1a0d2e',bg2:'#0a0515',bg3:'#050208',platTop:'#7c3aed',platBot:'#1a1030',edge:'#c4b5fd',star:'#c4b5fd',fog:'rgba(139,92,246,0.12)'},
   enemies:[{kind:'bat',w:12,h:12,hp:60,speed:55,type:'flyer'},{kind:'slime',w:10,h:10,hp:80,speed:30,type:'crawler'},{kind:'skeleton',w:10,h:12,hp:100,speed:40,type:'walker'}],
   boss:{kind:'skeletonKing',w:22,h:26,hp:800,dmg:22,name:'SKELETON KING',gold:15},spawnCount:16},
  {name:'FIRE',startX:2000,endX:4000,
   theme:{bg1:'#3a0a05',bg2:'#1a0402',bg3:'#0a0202',platTop:'#ff6b00',platBot:'#3e0a05',edge:'#ffb366',star:'#ff9f1c',fog:'rgba(255,107,0,0.12)'},
   enemies:[{kind:'imp',w:12,h:12,hp:80,speed:65,type:'flyer'},{kind:'fireGolem',w:12,h:12,hp:160,speed:35,type:'crawler'},{kind:'imp',w:12,h:12,hp:80,speed:65,type:'flyer'}],
   boss:{kind:'fireDemon',w:22,h:26,hp:1200,dmg:26,name:'FIRE DEMON',gold:20},spawnCount:20},
  {name:'FROZEN',startX:4000,endX:6000,
   theme:{bg1:'#0a2540',bg2:'#041525',bg3:'#020810',platTop:'#00d4ff',platBot:'#0a2540',edge:'#7dd3fc',star:'#bae6fd',fog:'rgba(0,212,255,0.1)'},
   enemies:[{kind:'iceWraith',w:10,h:11,hp:100,speed:60,type:'flyer'},{kind:'frostSpider',w:12,h:10,hp:120,speed:55,type:'crawler'},{kind:'iceGolem',w:12,h:12,hp:200,speed:32,type:'crawler'}],
   boss:{kind:'iceQueen',w:20,h:26,hp:1600,dmg:30,name:'ICE QUEEN',gold:30},spawnCount:22},
  {name:'SHADOW',startX:6000,endX:8000,
   theme:{bg1:'#2a0a40',bg2:'#14051f',bg3:'#050208',platTop:'#e879f9',platBot:'#2a0a40',edge:'#f0abfc',star:'#e9d5ff',fog:'rgba(232,121,249,0.12)'},
   enemies:[{kind:'shadowBeast',w:12,h:12,hp:140,speed:70,type:'flyer'},{kind:'voidCrawler',w:12,h:10,hp:160,speed:50,type:'crawler'},{kind:'nightmare',w:12,h:12,hp:220,speed:38,type:'crawler'},{kind:'cryptHorror',w:12,h:12,hp:180,speed:45,type:'crawler'}],
   boss:{kind:'shadowLord',w:20,h:26,hp:2400,dmg:36,name:'SHADOW LORD',gold:40},spawnCount:26}
];

/* ===== WORLD GENERATION ===== */
function genZone0(sx,ex){var p=[];var x=sx+20;while(x<ex-220){var w=110+Math.floor(Math.random()*60);if(x+w>ex-220)w=ex-220-x;if(w<50)break;p.push({x:x,y:230,w:w,h:40});if(Math.random()<0.5){var py=150+Math.floor(Math.random()*30);p.push({x:x+20,y:py,w:50+Math.floor(Math.random()*30),h:8});}x+=w+20+Math.floor(Math.random()*20);}p.push({x:ex-220,y:230,w:220,h:40});p.push({x:ex-160,y:130,w:120,h:8});return p;}
function genZone1(sx,ex){var p=[];var x=sx+20;while(x<ex-250){var w=80+Math.floor(Math.random()*50);if(x+w>ex-250)w=ex-250-x;if(w<50)break;p.push({x:x,y:230,w:w,h:40});x+=w+60+Math.floor(Math.random()*40);}p.push({x:ex-220,y:230,w:220,h:40});p.push({x:ex-170,y:140,w:100,h:8});return p;}
function genZone2(sx,ex){var p=[];p.push({x:sx+20,y:230,w:120,h:40});for(var i=0;i<12;i++){var tx=sx+180+i*140;if(tx>ex-100)break;var th=60+Math.floor(Math.random()*80);p.push({x:tx,y:230-th,w:50,h:th+40});if(Math.random()<0.6)p.push({x:tx-10,y:230-th-30,w:70,h:6});}p.push({x:ex-220,y:230,w:220,h:40});p.push({x:ex-160,y:120,w:120,h:8});return p;}
function genZone3(sx,ex){var p=[];var x=sx+20;while(x<ex-250){var w=90+Math.floor(Math.random()*50);if(x+w>ex-250)w=ex-250-x;if(w<50)break;p.push({x:x,y:250,w:w,h:20});x+=w+30+Math.floor(Math.random()*30);}p.push({x:ex-220,y:250,w:220,h:20});for(var i=0;i<14;i++){var px=sx+80+i*110;if(px>ex-120)break;var py=140+Math.floor(Math.random()*60);p.push({x:px,y:py,w:60,h:6});}for(var j=0;j<10;j++){var qx=sx+140+j*140;if(qx>ex-100)break;p.push({x:qx,y:80,w:50,h:6});}p.push({x:ex-160,y:130,w:120,h:8});return p;}

function buildWorld(){
  var platforms=[];
  platforms=platforms.concat(genZone0(0,2000));
  platforms=platforms.concat(genZone1(2000,4000));
  platforms=platforms.concat(genZone2(4000,6000));
  platforms=platforms.concat(genZone3(6000,8000));
  var buildings=[{type:'shop',x:800,y:220},{type:'forge',x:1450,y:220}];
  return{width:8000,platforms:platforms,buildings:buildings};
}
var world=buildWorld();

/* ===== STATE ===== */
var state='idle',camera={x:0},shake={t:0,i:0},hitPause=0,gameTime=0,currentZoneIdx=0;
var bossKilled=[false,false,false,false],zoneBossActive=[false,false,false,false],zoneEnemiesSpawned=[false,false,false,false];
var enemies=[],particles=[],enemyProjectiles=[],heroParticles=[];
var boss=null,player=null,activeBuilding=null,bossPromptShown=[false,false,false,false];

function rect(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function rand(a,b){return a+Math.random()*(b-a);}
function shakeNow(i,d){shake.i=i;shake.t=d;}
function spawnParticles(x,y,color,n,sz){if(!settings.particles)return;sz=sz||2;for(var i=0;i<n;i++){var ang=Math.random()*Math.PI*2,sp=40+Math.random()*140;particles.push({x:x,y:y,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp-60,life:0.5+Math.random()*0.5,maxLife:0.5+Math.random()*0.5,color:color,size:1+Math.random()*sz});}}
function initPlayer(){var bonusHP=(saveData.armorLevel-1)*40;player={x:60,y:100,vx:0,vy:0,w:12,h:20,onGround:false,facing:1,animTime:0,hp:BASE_HP+bonusHP,maxHp:BASE_HP+bonusHP,attacking:false,attackTimer:0,attackCooldown:0,invincible:0,hitFlash:0,playerDamage:BASE_DAMAGE+(saveData.weaponLevel-1)*20};}
function getZoneIndex(px){for(var i=0;i<ZONES.length;i++){if(px>=ZONES[i].startX&&px<ZONES[i].endX)return i;}return ZONES.length-1;}
function getVisiblePlatforms(){var result=[],buffer=200;var minX=camera.x-buffer,maxX=camera.x+VW+buffer;for(var i=0;i<world.platforms.length;i++){var p=world.platforms[i];if(p.x+p.w>minX&&p.x<maxX)result.push(p);}return result;}
function unlockNextZone(zi){if(zi+1<4&&saveData.unlockedZones){saveData.unlockedZones[zi+1]=true;Save.save(saveData);if(window.GameMap)GameMap.refreshLocks();}}

/* ===== PLAYER PHYSICS ===== */
function playerPhysics(dt){
  var move=0;if(input.left)move-=1;if(input.right)move+=1;
  if(move!==0){player.vx+=move*MOVE_SPEED*8*dt;player.facing=move;}
  player.vx*=Math.pow(FRICTION,dt*60);
  if(input.jp&&player.onGround){player.vy=JUMP_FORCE;player.onGround=false;try{if(window.Sound)Sound.jump();}catch(e){}spawnParticles(player.x+6,player.y+19,'#a78bfa',5,1.5);}
  input.jp=false;player.vy+=GRAVITY*dt;if(player.vy>550)player.vy=550;
  player.x+=player.vx*dt;player.y+=player.vy*dt;player.onGround=false;
  var visible=getVisiblePlatforms();
  for(var i=0;i<visible.length;i++){var p=visible[i];if(rect(player,p)){
    if(player.vy>0&&player.y+player.h-player.vy*dt<=p.y+6){player.y=p.y-player.h;player.vy=0;player.onGround=true;}
    else if(player.vy<0&&player.y-player.vy*dt>=p.y+p.h-6){player.y=p.y+p.h;player.vy=0;}
    else{if(player.vx>0)player.x=p.x-player.w;else if(player.vx<0)player.x=p.x+p.w;player.vx=0;}}}
  if(player.x<0){player.x=0;player.vx=0;}
  if(player.x+player.w>world.width){player.x=world.width-player.w;player.vx=0;}
  if(player.y>VH+80){player.hp-=20;try{if(window.Sound)Sound.hurt();}catch(e){}player.x=Math.max(0,player.x-100);player.y=100;player.vx=0;player.vy=0;player.invincible=1.5;shakeNow(8,0.3);}
}

function attackBox(){if(player.facing===1)return{x:player.x+player.w,y:player.y+3,w:ATK_RANGE,h:13};return{x:player.x-ATK_RANGE,y:player.y+3,w:ATK_RANGE,h:13};}
function damagePlayer(dmg,fromX){player.hp-=dmg;player.invincible=INV_TIME;player.hitFlash=0.3;try{if(window.Sound)Sound.hurt();}catch(e){}shakeNow(7,0.25);hitPause=0.08;spawnParticles(player.x+player.w/2,player.y+player.h/2,'#ff3355',12,2);player.vx=(player.x<fromX?-1:1)*130;player.vy=-120;}

/* ===== COMBAT ===== */
function updateCombat(dt){
  if(player.attackCooldown>0)player.attackCooldown-=dt;
  if(player.invincible>0)player.invincible-=dt;
  if(player.hitFlash>0)player.hitFlash-=dt;
  if(input.ap&&player.attackCooldown<=0&&!player.attacking){
    player.attacking=true;player.attackTimer=ATK_DUR;player.attackCooldown=ATK_CD;
    try{if(window.Sound)Sound.slash();}catch(e){}
    var hb=attackBox();spawnParticles(hb.x+hb.w/2,hb.y+hb.h/2,'#fbbf24',6,1.5);
  }
  input.ap=false;
  if(player.attacking){
    player.attackTimer-=dt;
    if(player.attackTimer>ATK_DUR*0.4){
      var hb=attackBox();
      for(var i=0;i<enemies.length;i++){
        var e=enemies[i];if(e.dead||e.hitCooldown>0)continue;
        if(rect(hb,{x:e.x,y:e.y,w:e.w,h:e.h})){
          e.hp-=player.playerDamage;e.hitFlash=0.15;e.hitCooldown=0.28;
          e.knockback=0.3;e.knockVx=player.facing*300;e.knockVy=-120;
          try{if(window.Sound)Sound.hit();}catch(err){}
          hitPause=0.05;
          spawnParticles(e.x+e.w/2,e.y+e.h/2,'#ff3355',10,2);shakeNow(4,0.12);
          if(e.hp<=0){
            e.dead=true;saveData.totalKills++;
            if(Math.random()<0.3)saveData.gold+=1;
            try{if(window.Sound)Sound.kill();}catch(err){}
            shakeNow(6,0.22);
            spawnParticles(e.x+e.w/2,e.y+e.h/2,'#e879f9',22,2.5);
            spawnParticles(e.x+e.w/2,e.y+e.h/2,'#ff3355',14,2);
            spawnParticles(e.x+e.w/2,e.y+e.h/2,'#fbbf24',10,2);
          }
        }
      }
      if(boss&&!boss.dead&&boss.hitCooldown<=0&&boss.state!=='enter'){
        if(rect(hb,{x:boss.x,y:boss.y,w:boss.w,h:boss.h})){
          boss.hp-=player.playerDamage;boss.hitFlash=0.12;boss.hitCooldown=0.15;
          try{if(window.Sound)Sound.bossHit();}catch(err){}
          hitPause=0.08;
          spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#ff3355',10,2);
          spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#fbbf24',8,2);
          shakeNow(5,0.14);
          if(boss.hp<=0){
            boss.dead=true;
            try{if(window.Sound)Sound.levelComplete();}catch(err){}
            shakeNow(16,0.9);
            bossKilled[boss.zone]=true;saveData.bossesDefeated[boss.zone]=true;
            saveData.gold+=(boss.cfg.gold||20);
            unlockNextZone(boss.zone);
            Save.save(saveData);
            spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#e879f9',50,3);
            spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#ff3355',40,3);
            spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#fbbf24',30,3);
            var bz=boss.zone;var isLast=(bz===3);
            var clearScenes=['crypt_clear','fire_clear','frozen_clear','shadow_clear'];
            var chaps=[Story?Story.chapters.crypt:'',Story?Story.chapters.fire:'',Story?Story.chapters.frozen:'',Story?Story.chapters.shadow:''];
            setTimeout(function(){
              boss=null;zoneBossActive[bz]=false;
              if(isLast&&window.Story){
                gameRunning=false;
                Story.play('shadow_clear',function(){Story.play('reveal',function(){spawnUmbra();gameRunning=true;},Story.chapters.reveal);},Story.chapters.shadow);
              } else if(window.Story&&clearScenes[bz]){
                gameRunning=false;
                Story.play(clearScenes[bz],function(){gameRunning=true;},chaps[bz]);
              }
            },2500);
          }
        }
      }
    }
    if(player.attackTimer<=0)player.attacking=false;
  }
}

/* ===== SPAWN UMBRA ===== */
function spawnUmbra(){
  boss={cfg:{kind:'umbra',w:30,h:36,hp:3500,dmg:42,name:'THE UMBRA',gold:60},kind:'umbra',x:player.x+120,y:150,vx:-40,vy:0,w:30,h:36,hp:3500,maxHp:3500,state:'enter',stateTimer:1.5,hitFlash:0,hitCooldown:0,direction:-1,baseY:150,bobPhase:0,attackTimer:2,skillTimer:4,skillActive:0,skillPhase:0,zone:3,isUmbra:true};
  zoneBossActive[3]=true;
  try{if(window.Sound)Sound.bossRoar();}catch(e){}
  shakeNow(14,1.2);
}

/* ===== SPAWN ENEMY (with variations) ===== */
function spawnEnemyInZone(zi){
  var z=ZONES[zi];if(zoneBossActive[zi]||bossKilled[zi])return;
  var t=z.enemies[Math.floor(Math.random()*z.enemies.length)];
  var fromLeft=Math.random()<0.5;
  var sx=player.x+(fromLeft?-40:VW+40);
  if(sx<z.startX+20)sx=z.startX+20;
  if(sx>z.endX-20)sx=z.endX-20;
  var baseY=t.type==='flyer'?rand(60,160):200;
  var skillOffset=1.5+Math.random()*4;
  var speedVar=0.85+Math.random()*0.4;
  var attractRange=140+Math.random()*100;
  enemies.push({
    cfg:t,kind:t.kind,type:t.type,x:sx,y:baseY,
    vx:(fromLeft?1:-1)*t.speed*speedVar,vy:0,w:t.w,h:t.h,
    hp:t.hp,maxHp:t.hp,direction:fromLeft?1:-1,
    hitFlash:0,hitCooldown:0,dead:false,
    baseY:baseY,bobPhase:Math.random()*Math.PI*2,
    knockback:0,deathTimer:0,opacity:1,
    attractPhase:Math.random()*6,
    skillTimer:skillOffset,skillActive:0,skillVx:0,skillVy:0,
    zone:zi,attractRange:attractRange
  });
}

/* ===== SPAWN BOSS (with prompt) ===== */
function spawnBoss(zi){
  var z=ZONES[zi];var b=z.boss;
  var bossScenes=['crypt_intro','fire_intro','frozen_intro','shadow_intro'];
  var chaps=[Story?Story.chapters.crypt:'',Story?Story.chapters.fire:'',Story?Story.chapters.frozen:'',Story?Story.chapters.shadow:''];
  
  function startFight(){
    boss={cfg:b,kind:b.kind,x:z.endX-120,y:170,vx:-40,vy:0,w:b.w,h:b.h,hp:b.hp,maxHp:b.hp,state:'enter',stateTimer:1.5,hitFlash:0,hitCooldown:0,direction:-1,baseY:170,bobPhase:0,attackTimer:2,skillTimer:4+Math.random()*2,skillActive:0,skillPhase:0,zone:zi};
    zoneBossActive[zi]=true;
    try{if(window.Sound)Sound.bossRoar();}catch(e){}
    shakeNow(10,0.7);
  }
  
  if(window.BossPrompt){
    BossPrompt.show(b.name,function(){
      if(window.Story&&bossScenes[zi]){gameRunning=false;Story.play(bossScenes[zi],function(){gameRunning=true;startFight();},chaps[zi]);}
      else{startFight();}
    },function(){
      bossPromptShown[zi]=false;
      try{if(window.Sound&&Sound.portal)Sound.portal();}catch(e){}
    });
  } else {
    if(window.Story&&bossScenes[zi]){gameRunning=false;Story.play(bossScenes[zi],function(){gameRunning=true;startFight();},chaps[zi]);}
    else{startFight();}
  }
}

/* ===== ENEMY SKILLS ===== */
function enemySkill(e,dt){
  if(e.dead)return;
  e.skillTimer-=dt;
  if(e.skillActive>0){
    e.skillActive-=dt;
    if(e.kind==='bat'||e.kind==='imp'||e.kind==='shadowBeast'){e.x+=e.skillVx*dt;e.y+=e.skillVy*dt;}
    else if(e.kind==='fireGolem'||e.kind==='voidCrawler'){e.x+=e.skillVx*dt;}
    return;
  }
  if(e.skillTimer>0)return;
  if(player.invincible>0)return;
  var dx=player.x-e.x,dy=player.y-e.y;
  var dist=Math.sqrt(dx*dx+dy*dy);
  if(dist>(e.attractRange||200))return;
  try{if(window.Sound)Sound.enemySkill();}catch(err){}
  if(e.kind==='bat'){e.skillActive=0.8;e.skillVx=dx/dist*280;e.skillVy=dy/dist*280;}
  else if(e.kind==='slime'){e.vy=-340;e.skillActive=0.5;spawnParticles(e.x+5,e.y+10,'#4ade80',6,1);}
  else if(e.kind==='skeleton'){enemyProjectiles.push({x:e.x+e.w/2,y:e.y+e.h/2,vx:dx/dist*200,vy:dy/dist*200,life:3,dmg:10,color:'#e2e8f0',size:3});}
  else if(e.kind==='imp'){for(var i=0;i<3;i++){var a=Math.atan2(dy,dx)+(i-1)*0.3;enemyProjectiles.push({x:e.x+e.w/2,y:e.y+e.h/2,vx:Math.cos(a)*180,vy:Math.sin(a)*180,life:3,dmg:10,color:'#ff9f1c',size:3});}}
  else if(e.kind==='fireGolem'){e.skillActive=0.5;e.skillVx=(player.x<e.x?-1:1)*280;}
  else if(e.kind==='iceWraith'){e.x=player.x+(Math.random()<0.5?-35:35);e.y=player.y-10+rand(-25,25);spawnParticles(e.x,e.y,'#00d4ff',10,2);}
  else if(e.kind==='frostSpider'){for(var j=0;j<5;j++){var a2=Math.atan2(dy,dx)+(j-2)*0.25;enemyProjectiles.push({x:e.x+e.w/2,y:e.y+e.h/2,vx:Math.cos(a2)*200,vy:Math.sin(a2)*200,life:3,dmg:8,color:'#7dd3fc',size:2});}}
  else if(e.kind==='iceGolem'){spawnParticles(e.x+e.w/2,e.y+e.h,'#7dd3fc',15,2);shakeNow(5,0.2);if(player.onGround&&Math.abs(player.x-e.x)<100&&player.invincible<=0)damagePlayer(15,e.x);}
  else if(e.kind==='shadowBeast'){e.skillActive=0.6;e.skillVx=dx/dist*340;e.skillVy=dy/dist*340;}
  else if(e.kind==='voidCrawler'){e.skillActive=0.5;e.skillVx=dx/dist*220;}
  else if(e.kind==='nightmare'){e.skillActive=1.0;}
  else if(e.kind==='cryptHorror'){for(var k=0;k<6;k++){var a3=Math.PI*2/6*k+Math.random()*0.3;enemyProjectiles.push({x:e.x+e.w/2,y:e.y+e.h/2,vx:Math.cos(a3)*160,vy:Math.sin(a3)*160,life:3,dmg:12,color:'#fbbf24',size:3});}}
  e.skillTimer=2+Math.random()*3;
}

/* ===== UPDATE ENEMIES ===== */
function updateEnemies(dt){
  for(var i=enemies.length-1;i>=0;i--){
    var e=enemies[i];
    if(Math.abs(e.x-player.x)>700&&!e.dead){enemies.splice(i,1);continue;}
    if(e.hitFlash>0)e.hitFlash-=dt;
    if(e.hitCooldown>0)e.hitCooldown-=dt;
    if(e.dead){
      e.deathTimer+=dt;e.opacity=Math.max(0,1-e.deathTimer/0.5);
      e.y-=30*dt;e.x+=e.knockVx*0.3*dt;
      if(e.deathTimer>0.5)enemies.splice(i,1);
      continue;
    }
    if(e.knockback>0){
      e.knockback-=dt;
      e.x+=e.knockVx*dt;e.y+=e.knockVy*dt;
      e.knockVy+=GRAVITY*dt;e.knockVx*=0.9;
      if(e.y>230){e.y=230;e.knockVy=0;}
      if(e.knockback<=0){e.knockVx=0;e.knockVy=0;}
      continue;
    }
    enemySkill(e,dt);
    if(e.skillActive<=0){
      var dx=player.x-e.x,dy=player.y-e.y;
      var dist=Math.sqrt(dx*dx+dy*dy);
      e.attractPhase+=dt*1.5;
      var aStr=Math.sin(e.attractPhase)*0.5+0.5;
      var range=e.attractRange||200;
      if(dist<range&&dist>0){
        var pull=(e.type==='flyer'?40:28)*aStr;
        e.vx+=dx/dist*pull*dt*3.5;
        e.vy+=dy/dist*pull*dt*2.5;
      }
    }
    if(e.type==='crawler'||e.type==='walker'){
      if(e.skillActive<=0||e.kind==='fireGolem'||e.kind==='voidCrawler'){
        var maxSp=e.cfg.speed;
        var spd=Math.sqrt(e.vx*e.vx+e.vy*e.vy);
        if(spd>maxSp*2.5){e.vx=e.vx/spd*maxSp*2.5;e.vy=e.vy/spd*maxSp*2.5;}
        e.x+=e.vx*dt;e.vy+=GRAVITY*dt;e.y+=e.vy*dt;
        var vis=getVisiblePlatforms();
        for(var j=0;j<vis.length;j++){
          var p=vis[j];
          if(rect({x:e.x,y:e.y,w:e.w,h:e.h},p)){if(e.vy>0){e.y=p.y-e.h;e.vy=0;}}
        }
      }
      if(e.y>VH+100){enemies.splice(i,1);continue;}
    } else if(e.type==='flyer'){
      if(e.skillActive<=0){
        var fSp=e.cfg.speed;
        var fspd=Math.sqrt(e.vx*e.vx+e.vy*e.vy);
        if(fspd>fSp*2.5){e.vx=e.vx/fspd*fSp*2.5;e.vy=e.vy/fspd*fSp*2.5;}
        e.x+=e.vx*dt;e.y+=e.vy*dt;
        e.bobPhase+=dt*3;
        if(e.kind!=='bat'&&e.kind!=='imp'&&e.kind!=='shadowBeast'){e.y=e.baseY+Math.sin(e.bobPhase)*10;}
      }
      if(e.y<30)e.vy=Math.abs(e.vy);
      if(e.y>VH-30)e.vy=-Math.abs(e.vy);
    }
    if(player.invincible<=0&&!player.attacking){
      if(rect({x:player.x,y:player.y,w:player.w,h:player.h},{x:e.x,y:e.y,w:e.w,h:e.h})){
        damagePlayer(15,e.x);
      }
    }
  }
}

/* ===== UPDATE PROJECTILES ===== */
function updateEnemyProjectiles(dt){
  for(var i=enemyProjectiles.length-1;i>=0;i--){
    var p=enemyProjectiles[i];
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
    if(player.invincible<=0&&Math.abs(p.x-(player.x+player.w/2))<10&&Math.abs(p.y-(player.y+player.h/2))<12){
      damagePlayer(p.dmg,p.x);enemyProjectiles.splice(i,1);continue;
    }
    if(p.life<=0||p.x<camera.x-80||p.x>camera.x+VW+80)enemyProjectiles.splice(i,1);
  }
}

/* ===== UPDATE BOSS ===== */
function updateBoss(dt){
  if(!boss||boss.dead)return;
  if(boss.hitFlash>0)boss.hitFlash-=dt;
  if(boss.hitCooldown>0)boss.hitCooldown-=dt;
  if(boss.state==='enter'){
    boss.stateTimer-=dt;boss.x+=boss.vx*dt;
    var targetX=camera.x+VW-80;
    if(boss.x<targetX){boss.x=targetX;boss.vx=0;boss.state='idle';boss.attackTimer=1.5;}
    return;
  }
  boss.attackTimer-=dt;boss.skillTimer-=dt;
  if(boss.skillActive>0){
    boss.skillActive-=dt;boss.skillPhase+=dt;
    if(boss.kind==='skeletonKing'){
      if(Math.floor(boss.skillPhase/0.3)>Math.floor((boss.skillPhase-dt)/0.3)){
        if(Math.random()<0.6){
          var z=ZONES[boss.zone];var e=z.enemies[2];
          enemies.push({cfg:e,kind:'skeleton',type:'walker',x:boss.x+rand(-50,50),y:boss.y,vx:rand(-70,70),vy:-100,w:10,h:12,hp:60,maxHp:60,direction:1,hitFlash:0,hitCooldown:0,dead:false,baseY:boss.y,bobPhase:0,knockback:0,deathTimer:0,opacity:1,attractPhase:Math.random()*6,skillTimer:3,skillActive:0,skillVx:0,skillVy:0,zone:boss.zone,attractRange:200});
        }
      }
    } else if(boss.kind==='fireDemon'){
      if(Math.floor(boss.skillPhase/0.15)>Math.floor((boss.skillPhase-dt)/0.15)){
        for(var i=0;i<10;i++){
          var a=Math.PI*2/10*i+boss.skillPhase*3;
          enemyProjectiles.push({x:boss.x+boss.w/2,y:boss.y+boss.h/2,vx:Math.cos(a)*200,vy:Math.sin(a)*200,life:3,dmg:15,color:'#ff6b00',size:4});
        }
      }
    } else if(boss.kind==='iceQueen'){
      if(Math.floor(boss.skillPhase/0.25)>Math.floor((boss.skillPhase-dt)/0.25)){
        for(var j=0;j<4;j++){
          var tgt=player.x+rand(-80,80);
          enemyProjectiles.push({x:tgt,y:20,vx:0,vy:280,life:3,dmg:18,color:'#7dd3fc',size:4});
        }
      }
    } else if(boss.kind==='shadowLord'){
      if(Math.floor(boss.skillPhase/0.2)>Math.floor((boss.skillPhase-dt)/0.2)){
        for(var k=0;k<6;k++){
          var a2=Math.random()*Math.PI*2;
          enemyProjectiles.push({x:boss.x+boss.w/2,y:boss.y+boss.h/2,vx:Math.cos(a2)*180,vy:Math.sin(a2)*180,life:3,dmg:12,color:'#e879f9',size:3});
        }
      }
    } else if(boss.kind==='umbra'){
      if(Math.floor(boss.skillPhase/0.1)>Math.floor((boss.skillPhase-dt)/0.1)){
        for(var m=0;m<12;m++){
          var am=Math.PI*2/12*m+boss.skillPhase*4;
          enemyProjectiles.push({x:boss.x+boss.w/2,y:boss.y+boss.h/2,vx:Math.cos(am)*220,vy:Math.sin(am)*220,life:3,dmg:18,color:'#ff1493',size:5});
        }
      }
    }
    if(boss.skillActive<=0){boss.state='idle';boss.attackTimer=1.5;}
    return;
  }
  if(boss.state==='idle'){
    boss.bobPhase+=dt*4;boss.y=boss.baseY+Math.sin(boss.bobPhase)*3;
    if(boss.skillTimer<=0){
      boss.skillActive=2.0;boss.skillPhase=0;
      try{if(window.Sound)Sound.bossRoar();}catch(e){}
      shakeNow(8,0.4);boss.skillTimer=6+Math.random()*3;
      return;
    }
    if(boss.attackTimer<=0){
      var r=Math.random();
      if(r<0.4){boss.state='charge';boss.stateTimer=1.4;boss.vx=(player.x<boss.x?-1:1)*100;boss.vy=-180;try{if(window.Sound)Sound.bossRoar();}catch(e){}}
      else if(r<0.7){boss.state='shoot';boss.stateTimer=1.2;boss.shootTimer=0;}
      else{boss.state='jump';boss.stateTimer=1.0;boss.vy=-280;}
      boss.attackTimer=1.8+Math.random()*1.2;
    }
  } else if(boss.state==='charge'){
    boss.stateTimer-=dt;boss.x+=boss.vx*dt;boss.vy+=GRAVITY*dt;boss.y+=boss.vy*dt;
    if(boss.y+boss.h>230){boss.y=230-boss.h;boss.vy=0;}
    if(boss.x<camera.x+20)boss.x=camera.x+20;
    if(boss.stateTimer<=0){boss.state='idle';boss.vx=0;}
    if(player.invincible<=0&&rect(player,{x:boss.x,y:boss.y,w:boss.w,h:boss.h}))damagePlayer(boss.cfg.dmg,boss.x);
  } else if(boss.state==='shoot'){
    boss.stateTimer-=dt;boss.shootTimer-=dt;
    if(boss.shootTimer<=0){
      boss.shootTimer=0.35;
      var dx=(player.x+player.w/2)-(boss.x+boss.w/2);
      var dy=(player.y+player.h/2)-(boss.y+boss.h/2);
      var len=Math.sqrt(dx*dx+dy*dy);if(len<1)len=1;
      enemyProjectiles.push({x:boss.x+boss.w/2,y:boss.y+boss.h/2,vx:dx/len*180,vy:dy/len*180,life:3,dmg:14,color:'#ff3355',size:4});
    }
    if(boss.stateTimer<=0)boss.state='idle';
  } else if(boss.state==='jump'){
    boss.stateTimer-=dt;boss.vy+=GRAVITY*dt;boss.y+=boss.vy*dt;
    if(boss.y+boss.h>230){
      boss.y=230-boss.h;boss.vy=0;shakeNow(9,0.35);
      spawnParticles(boss.x+boss.w/2,230,'#fbbf24',20,2);
      if(player.onGround&&Math.abs(player.x-boss.x)<100&&player.invincible<=0)damagePlayer(boss.cfg.dmg,boss.x);
      boss.state='idle';
    }
  }
}

/* ===== HERO PARTICLES ===== */
function updateHeroParticles(dt){
  if(!player||!settings.particles)return;
  if(Math.random()<0.35){
    var ang=Math.random()*Math.PI*2;
    var r=8+Math.random()*8;
    heroParticles.push({x:player.x+6+Math.cos(ang)*r,y:player.y+10+Math.sin(ang)*r,vx:(Math.random()-0.5)*15,vy:-15-Math.random()*20,life:0.8+Math.random()*0.4,maxLife:0.8+Math.random()*0.4,size:1+Math.random()*1.5});
  }
  for(var i=heroParticles.length-1;i>=0;i--){
    var p=heroParticles[i];
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
    if(p.life<=0)heroParticles.splice(i,1);
  }
}

/* ===== ZONE PROGRESSION ===== */
function checkZoneProgression(){
  var zi=getZoneIndex(player.x);
  if(zi!==currentZoneIdx){currentZoneIdx=zi;saveData.currentZone=zi;Save.save(saveData);}
  if(!zoneEnemiesSpawned[zi]&&!zoneBossActive[zi]&&!bossKilled[zi]){
    var z=ZONES[zi];
    for(var i=0;i<z.spawnCount;i++){(function(idx){setTimeout(function(){spawnEnemyInZone(idx);},idx*500);})(zi);}
    zoneEnemiesSpawned[zi]=true;
  }
  if(zoneEnemiesSpawned[zi]&&!zoneBossActive[zi]&&!bossKilled[zi]&&boss===null&&!bossPromptShown[zi]){
    var aliveInZone=0;
    for(var j=0;j<enemies.length;j++){if(enemies[j].zone===zi&&!enemies[j].dead)aliveInZone++;}
    if(aliveInZone<=1){
      var z2=ZONES[zi];
      if(player.x>z2.endX-350){bossPromptShown[zi]=true;spawnBoss(zi);}
    }
  }
}

/* ===== BUILDING INTERACTION ===== */
function checkBuildingInteraction(){
  var closest=null;var closestDist=90;
  for(var i=0;i<world.buildings.length;i++){
    var b=world.buildings[i];
    var d=Math.abs(b.x-player.x);
    if(d<closestDist){closest=b;closestDist=d;}
  }
  if(closest!==activeBuilding){
    activeBuilding=closest;
    if(closest){if(window.Hint)Hint.show();}else{if(window.Hint)Hint.hide();}
  }
  if(activeBuilding&&input.ap){
    input.ap=false;
    if(activeBuilding.type==='shop'){
      try{if(window.Sound)Sound.shop();}catch(e){}
      var openShop=function(){
        Shop.open(saveData.gold,saveData.weaponLevel,function(item){
          if(saveData.gold<item.price)return;
          saveData.gold-=item.price;
          if(item.id[0]==='w'){saveData.weaponLevel++;player.playerDamage=BASE_DAMAGE+(saveData.weaponLevel-1)*20;}
          else{saveData.armorLevel++;var bonus=(saveData.armorLevel-1)*40;player.maxHp=BASE_HP+bonus;player.hp=player.maxHp;}
          Save.save(saveData);
          try{if(window.Sound)Sound.buy();}catch(e){}
          openShop();
        });
      };
      openShop();
    } else if(activeBuilding.type==='forge'){
      try{if(window.Sound)Sound.forge();}catch(e){}
      var openForge=function(){
        Forge.open(saveData.gold,saveData.weaponLevel,function(){
          var prices=[0,0,100,220,400,700];
          var price=prices[saveData.weaponLevel]||0;
          if(saveData.gold<price||saveData.weaponLevel>=5)return;
          saveData.gold-=price;saveData.weaponLevel++;
          player.playerDamage=BASE_DAMAGE+(saveData.weaponLevel-1)*20;
          Save.save(saveData);
          try{if(window.Sound)Sound.buy();}catch(e){}
          openForge();
        });
      };
      openForge();
    }
  }
}

/* ===== HUD ===== */
function updateHUD(){
  var hpFill=document.getElementById('hpFill');
  var goldEl=document.getElementById('goldCount');
  var levelEl=document.getElementById('levelName');
  var killEl=document.getElementById('killCount');
  var keyEl=document.getElementById('keyCount');
  var wLvEl=document.getElementById('weaponLevel');
  if(hpFill)hpFill.style.width=Math.max(0,player.hp/player.maxHp*100)+'%';
  if(goldEl)goldEl.textContent=saveData.gold;
  if(levelEl)levelEl.textContent=ZONES[currentZoneIdx].name;
  if(killEl)killEl.textContent=saveData.totalKills;
  if(wLvEl)wLvEl.textContent='Lv.'+saveData.weaponLevel;
  if(keyEl){
    var kc=0;for(var i=0;i<bossKilled.length;i++)if(bossKilled[i])kc++;
    keyEl.textContent=kc+'/4';
  }
}

/* ===== CAMERA ===== */
function updateCamera(){
  var targetX=player.x-VW*0.4;
  if(targetX<0)targetX=0;
  if(targetX>world.width-VW)targetX=world.width-VW;
  camera.x+=(targetX-camera.x)*0.08;
  if(camera.x<0)camera.x=0;
  if(camera.x>world.width-VW)camera.x=world.width-VW;
}

/* ===== DRAWING ===== */
function drawBackground(){
  try{
    var zi=currentZoneIdx;var t=ZONES[zi].theme;
    var bgImg=[BG.crypt,BG.fire,BG.frozen,BG.shadow][zi];
    if(bgImg && bgImg.complete && bgImg.naturalWidth>0){
      ctx.drawImage(bgImg,0,0,VW,VH);
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(0,0,VW,VH);
      return;
    }
    var sky=lg(ctx,0,0,0,VH,[[0,t.bg1],[0.5,t.bg2],[1,t.bg3]]);
    ctx.fillStyle=sky;ctx.fillRect(0,0,VW,VH);
    ctx.fillStyle=t.fog;ctx.fillRect(0,0,VW,VH);
  }catch(e){ctx.fillStyle='#1a0d2e';ctx.fillRect(0,0,VW,VH);}
}

function drawPlatforms(){
  try{
    var zi=currentZoneIdx;
    var vis=getVisiblePlatforms();
    var platImg = PLAT_IMG[['crypt','fire','frozen','shadow'][zi]];
    if(!platImg || !platImg.complete || platImg.naturalWidth===0){
      var t=ZONES[zi].theme;
      for(var i=0;i<vis.length;i++){
        var p=vis[i];var px=Math.floor(p.x-camera.x);
        var pg=lg(ctx,0,p.y,0,p.y+p.h,[[0,t.platTop],[0.25,t.platBot],[1,'#000']]);
        ctx.fillStyle=pg;ctx.fillRect(px,p.y,p.w,p.h);
        ctx.fillStyle=t.edge;ctx.fillRect(px,p.y,p.w,1.5);
      }
      return;
    }
    var frame=Math.floor(gameTime*2)%3;
    var fw=platImg.width/3;var fh=platImg.height;var sx=frame*fw;
    for(var i=0;i<vis.length;i++){
      var p=vis[i];var px=Math.floor(p.x-camera.x);
      var tileW=64;var drawH=32;var drawY=p.y+p.h-drawH;
      for(var x=0;x<p.w;x+=tileW){
        var segW=Math.min(tileW,p.w-x);
        var srcW=(segW/tileW)*fw;
        ctx.imageSmoothingEnabled=false;
        ctx.drawImage(platImg,sx,0,srcW,fh,px+x,drawY,segW,drawH);
      }
    }
  }catch(e){ctx.fillStyle='#4c1d95';ctx.fillRect(0,220,VW,50);}
}

function drawBuildings(){
  try{
    for(var i=0;i<world.buildings.length;i++){
      var b=world.buildings[i];
      var px=Math.floor(b.x-camera.x);
      if(px<-80||px>VW+80)continue;
      if(b.type==='shop'){if(typeof drawShopBooth==='function')drawShopBooth(ctx,px,b.y,gameTime);}
      else if(b.type==='forge'){if(typeof drawForgeWorkshop==='function')drawForgeWorkshop(ctx,px,b.y,gameTime);}
    }
  }catch(e){}
}

function drawPlayer(){
  if(player.invincible>0&&Math.floor(player.invincible*20)%2===0)return;
  var px=Math.floor(player.x-camera.x);
  var st=(Math.abs(player.vx)>5&&player.onGround)?'walk':(!player.onGround?(player.vy<0?'jump':'fall'):'idle');
  if(typeof drawKnight==='function'){
    drawKnight(ctx,px,player.y,player.facing,st,player.animTime,player.hitFlash,player.attacking,player.vx,player.vy,player.onGround,player.attackTimer,ATK_DUR);
  }
}

function drawEnemies(){
  for(var i=0;i<enemies.length;i++){
    var e=enemies[i];
    var px=Math.floor(e.x-camera.x);
    if(px<-60||px>VW+60)continue;
    ctx.globalAlpha=e.dead?e.opacity:1;
    var hit=e.hitFlash>0;
    var fn=window['draw'+e.kind.charAt(0).toUpperCase()+e.kind.slice(1)];
    if(typeof fn==='function'){fn(ctx,px,e.y,e.direction,gameTime,hit);}
    ctx.globalAlpha=1;
    if(e.hp<e.maxHp&&!e.dead){
      ctx.fillStyle='rgba(0,0,0,0.75)';
      ctx.fillRect(px-1,e.y-8,16,2.5);
      ctx.fillStyle='#ff3355';
      ctx.fillRect(px-1,e.y-8,16*(e.hp/e.maxHp),2.5);
    }
  }
}

function drawBossEntity(){
  if(!boss||boss.dead)return;
  var px=Math.floor(boss.x-camera.x);
  var hit=boss.hitFlash>0;
  var fn=window['draw'+boss.kind.charAt(0).toUpperCase()+boss.kind.slice(1)];
  if(typeof fn==='function'){fn(ctx,px,boss.y,-1,gameTime,hit);}
  var bw=VW-80,bx=40,by=26;
  ctx.fillStyle='rgba(0,0,0,0.85)';
  ctx.fillRect(bx-4,by-4,bw+8,18);
  ctx.fillStyle='#1a0000';ctx.fillRect(bx,by,bw,10);
  var hpPct=Math.max(0,boss.hp/boss.maxHp);
  var grad=lg(ctx,bx,0,bx+bw,0,[[0,'#ff3355'],[1,'#e879f9']]);
  ctx.fillStyle=grad;ctx.shadowColor='#ff3355';ctx.shadowBlur=12;
  ctx.fillRect(bx,by,bw*hpPct,10);ctx.shadowBlur=0;
  ctx.fillStyle='#fff';ctx.font='bold 10px monospace';ctx.textAlign='center';
  ctx.fillText(boss.cfg.name,VW/2,by+8);ctx.textAlign='left';
}

function drawEnemyProjectiles(){
  for(var i=0;i<enemyProjectiles.length;i++){
    var p=enemyProjectiles[i];
    var px=Math.floor(p.x-camera.x);
    if(px<-40||px>VW+40)continue;
    ctx.globalAlpha=Math.max(0,p.life/3);
    ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=12;
    ctx.beginPath();ctx.arc(px,p.y,p.size+1,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
  }
  ctx.globalAlpha=1;
}

function drawHeroParticles(){
  for(var i=0;i<heroParticles.length;i++){
    var p=heroParticles[i];
    ctx.globalAlpha=Math.max(0,p.life/p.maxLife)*0.7;
    ctx.fillStyle='#c4b5fd';ctx.shadowColor='#a78bfa';ctx.shadowBlur=6;
    var px=Math.floor(p.x-camera.x);
    ctx.beginPath();ctx.arc(px,p.y,p.size,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;ctx.shadowBlur=0;
}

function drawParticles(){
  for(var i=0;i<particles.length;i++){
    var p=particles[i];
    ctx.globalAlpha=Math.max(0,p.life/p.maxLife);
    ctx.fillStyle=p.color;
    var px=Math.floor(p.x-camera.x);
    ctx.fillRect(px,Math.floor(p.y),p.size,p.size);
  }
  ctx.globalAlpha=1;
}

function drawAttackEffect(){
  if(player.attacking&&player.attackTimer>ATK_DUR*0.4){
    var hb=attackBox();
    var hx=Math.floor(hb.x-camera.x);
    var swing=1-(player.attackTimer/ATK_DUR);
    var alpha=1-swing*0.5;
    ctx.globalAlpha=alpha*0.8;
    var grad=lg(ctx,hx,0,hx+hb.w,0,[[0,'rgba(251,191,36,0.95)'],[0.5,'rgba(255,255,255,0.7)'],[1,'rgba(251,191,36,0)']]);
    ctx.fillStyle=grad;
    ctx.fillRect(hx,hb.y,hb.w,hb.h);
    ctx.globalAlpha=1;
  }
}

/* ===== MAIN LOOP ===== */
var last=0;
function loop(ts){
  requestAnimationFrame(loop);
  var dt=Math.min((ts-last)/1000,0.05);last=ts;
  if(!gameRunning)return;
  if(hitPause>0){hitPause-=dt;return;}
  gameTime+=dt;
  if(state==='playing'){
    player.animTime+=dt;
    playerPhysics(dt);
    updateCombat(dt);
    updateEnemies(dt);
    updateEnemyProjectiles(dt);
    if(boss)updateBoss(dt);
    updateHeroParticles(dt);
    updateCamera();
    checkZoneProgression();
    checkBuildingInteraction();
  }
  for(var i=particles.length-1;i>=0;i--){
    var p=particles[i];
    p.x+=p.vx*dt;p.y+=p.vy*dt;
    p.vy+=300*dt;p.vx*=0.98;p.life-=dt;
    if(p.life<=0)particles.splice(i,1);
  }
  var sx=0,sy=0;
  if(shake.t>0){
    shake.t-=dt;
    sx=(Math.random()-0.5)*shake.i*2;
    sy=(Math.random()-0.5)*shake.i*2;
  }
  if(player.hp<=0&&state!=='gameover'){
    state='gameover';
    try{if(window.Sound)Sound.gameOver();}catch(e){}
    spawnParticles(player.x+6,player.y+10,'#ff3355',35,3);
    spawnParticles(player.x+6,player.y+10,'#e879f9',25,3);
    shakeNow(12,0.7);
    setTimeout(function(){
      player.hp=player.maxHp;
      player.x=ZONES[currentZoneIdx].startX+60;
      player.y=100;player.vx=0;player.vy=0;
      player.invincible=2;
      state='playing';
    },1800);
  }
  updateHUD();
  ctx.clearRect(0,0,VW,VH);
  ctx.save();
  ctx.translate(Math.floor(sx),Math.floor(sy));
  drawBackground();
  drawPlatforms();
  drawBuildings();
  drawEnemies();
  if(boss)drawBossEntity();
  drawEnemyProjectiles();
  drawPlayer();
  drawHeroParticles();
  drawAttackEffect();
  drawParticles();
  ctx.restore();
}

/* ===== GAME BRIDGE ===== */
window.GameBridge={
  startNewGame:function(){
    saveData=Save.load();
    saveData.gold=0;saveData.weaponLevel=1;saveData.armorLevel=1;
    saveData.totalKills=0;saveData.bossesDefeated=[false,false,false,false];
    saveData.playerX=60;saveData.playerY=100;saveData.currentZone=0;
    saveData.unlockedZones=[true,false,false,false];
    Save.save(saveData);
    bossKilled=[false,false,false,false];zoneBossActive=[false,false,false,false];
    zoneEnemiesSpawned=[false,false,false,false];bossPromptShown=[false,false,false,false];
    enemies=[];particles=[];enemyProjectiles=[];heroParticles=[];
    boss=null;activeBuilding=null;
    initPlayer();
    camera.x=0;currentZoneIdx=0;state='playing';gameRunning=false;
    if(window.GameMap)GameMap.refreshLocks();
    if(window.Story){
      Story.play('intro',function(){state='playing';gameRunning=true;},Story.chapters.intro);
    } else {gameRunning=true;}
  },
  continueGame:function(){
    saveData=Save.load();
    bossKilled=saveData.bossesDefeated.slice();
    zoneBossActive=[false,false,false,false];
    zoneEnemiesSpawned=[false,false,false,false];
    bossPromptShown=bossKilled.slice();
    enemies=[];particles=[];enemyProjectiles=[];heroParticles=[];
    boss=null;activeBuilding=null;
    initPlayer();
    camera.x=Math.max(0,player.x-VW*0.4);
    currentZoneIdx=getZoneIndex(player.x);
    state='playing';gameRunning=true;
    if(window.GameMap)GameMap.refreshLocks();
  },
  teleportTo:function(target){
    if(target==='shop'){player.x=800;player.y=180;camera.x=Math.max(0,player.x-VW*0.4);gameRunning=true;return;}
    if(target==='forge'){player.x=1450;player.y=180;camera.x=Math.max(0,player.x-VW*0.4);gameRunning=true;return;}
    var zi=parseInt(target);if(isNaN(zi))return;
    player.x=ZONES[zi].startX+60;
    player.y=100;
    currentZoneIdx=zi;
    saveData.currentZone=zi;
    Save.save(saveData);
    camera.x=Math.max(0,player.x-VW*0.4);
    state='playing';gameRunning=true;
  },
  pause:function(){if(state==='playing')state='paused';},
  resume:function(){if(state==='paused')state='playing';},
  save:function(){
    if(player){
      saveData.playerX=player.x;saveData.playerY=player.y;
      Save.save(saveData);
    }
  }
};

/* ===== INIT ===== */
try{if(window.Sound)Sound.init();}catch(e){}
initPlayer();

if(window.GameMap){
  GameMap.setTeleportHandler(function(target){
    if(window.GameBridge&&GameBridge.teleportTo)GameBridge.teleportTo(target);
  });
}

requestAnimationFrame(function(t){last=t;requestAnimationFrame(loop);});
console.log('✅ Shadow Blade v4.0 loaded');
})();
