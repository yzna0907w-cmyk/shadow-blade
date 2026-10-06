(function(){
'use strict';

var VW=480,VH=270,GRAVITY=900,MOVE_SPEED=130,JUMP_FORCE=-370,FRICTION=0.82;
var ATK_DUR=0.22,ATK_CD=0.30,ATK_RANGE=28,INV_TIME=1.2;
var BASE_DAMAGE=30;
var BASE_HP=100;

var canvas=document.getElementById('game');
var ctx=canvas.getContext('2d');
function resize(){
  var s=Math.min(window.innerWidth/VW,window.innerHeight/VH);
  canvas.style.width=Math.floor(VW*s)+'px';
  canvas.style.height=Math.floor(VH*s)+'px';
}
window.addEventListener('resize',resize);resize();

/* ============ SAVE DATA ============ */
var saveData=Save.load();
var settings=Save.loadSettings();

/* ============ INPUT ============ */
var input={left:false,right:false,jump:false,attack:false,jp:false,ap:false};
window.addEventListener('keydown',function(e){var k=e.key.toLowerCase();
  if(k==='arrowleft'||k==='a')input.left=true;
  if(k==='arrowright'||k==='d')input.right=true;
  if(k===' '||k==='arrowup'||k==='w'){if(!input.jump)input.jp=true;input.jump=true;}
  if(k==='j'||k==='k'||k==='enter'){if(!input.attack)input.ap=true;input.attack=true;}
  if(['arrowleft','arrowright','arrowup','arrowdown',' '].indexOf(k)!==-1)e.preventDefault();
});
window.addEventListener('keyup',function(e){var k=e.key.toLowerCase();
  if(k==='arrowleft'||k==='a')input.left=false;
  if(k==='arrowright'||k==='d')input.right=false;
  if(k===' '||k==='arrowup'||k==='w')input.jump=false;
  if(k==='j'||k==='k'||k==='enter')input.attack=false;
});

function bind(id,onD,onU){
  var b=document.getElementById(id);if(!b)return;
  var p=function(e){e.preventDefault();e.stopPropagation();b.classList.add('pressed');Sound.init();Sound.resume();onD();};
  var r=function(e){e.preventDefault();e.stopPropagation();b.classList.remove('pressed');if(onU)onU();};
  b.addEventListener('touchstart',p,{passive:false});
  b.addEventListener('touchend',r,{passive:false});
  b.addEventListener('touchcancel',r,{passive:false});
  b.addEventListener('mousedown',p);b.addEventListener('mouseup',r);
  b.addEventListener('mouseleave',r);
  b.addEventListener('contextmenu',function(e){e.preventDefault();});
}
bind('btnLeft',function(){input.left=true;},function(){input.left=false;});
bind('btnRight',function(){input.right=true;},function(){input.right=false;});
bind('btnJump',function(){if(!input.jump)input.jp=true;input.jump=true;},function(){input.jump=false;});
bind('btnAttack',function(){if(!input.attack)input.ap=true;input.attack=true;},function(){input.attack=false;});

/* ============ ZONES ============ */
var ZONE_W=1200;
var ZONES=[
  {name:'CRYPT',startX:0,endX:1200,
   theme:{bg1:'#1a0d2e',bg2:'#0a0515',bg3:'#050208',platTop:'#7c3aed',platBot:'#1a1030',edge:'#c4b5fd',star:'#c4b5fd',fog:'rgba(139,92,246,0.12)',particle:'rgba(196,181,253,0.6)'},
   enemies:[
     {kind:'bat',w:12,h:12,hp:60,speed:55,type:'flyer'},
     {kind:'slime',w:10,h:10,hp:80,speed:30,type:'crawler'},
     {kind:'skeleton',w:10,h:12,hp:100,speed:40,type:'walker'}
   ],
   boss:{kind:'skeletonKing',w:22,h:26,hp:800,dmg:22,name:'SKELETON KING'},
   spawnCount:10},
  {name:'FIRE',startX:1200,endX:2400,
   theme:{bg1:'#3a0a05',bg2:'#1a0402',bg3:'#0a0202',platTop:'#ff6b00',platBot:'#3e0a05',edge:'#ffb366',star:'#ff9f1c',fog:'rgba(255,107,0,0.12)',particle:'rgba(255,159,28,0.7)'},
   enemies:[
     {kind:'imp',w:12,h:12,hp:80,speed:65,type:'flyer'},
     {kind:'fireGolem',w:12,h:12,hp:160,speed:35,type:'crawler'},
     {kind:'imp',w:12,h:12,hp:80,speed:65,type:'flyer'}
   ],
   boss:{kind:'fireDemon',w:22,h:26,hp:1200,dmg:26,name:'FIRE DEMON'},
   spawnCount:12},
  {name:'FROZEN',startX:2400,endX:3600,
   theme:{bg1:'#0a2540',bg2:'#041525',bg3:'#020810',platTop:'#00d4ff',platBot:'#0a2540',edge:'#7dd3fc',star:'#bae6fd',fog:'rgba(0,212,255,0.1)',particle:'rgba(186,230,253,0.7)'},
   enemies:[
     {kind:'iceWraith',w:10,h:11,hp:100,speed:60,type:'flyer'},
     {kind:'frostSpider',w:12,h:10,hp:120,speed:55,type:'crawler'},
     {kind:'iceGolem',w:12,h:12,hp:200,speed:32,type:'crawler'}
   ],
   boss:{kind:'iceQueen',w:20,h:26,hp:1600,dmg:30,name:'ICE QUEEN'},
   spawnCount:14},
  {name:'SHADOW',startX:3600,endX:4800,
   theme:{bg1:'#2a0a40',bg2:'#14051f',bg3:'#050208',platTop:'#e879f9',platBot:'#2a0a40',edge:'#f0abfc',star:'#e9d5ff',fog:'rgba(232,121,249,0.12)',particle:'rgba(232,121,249,0.7)'},
   enemies:[
     {kind:'shadowBeast',w:12,h:12,hp:140,speed:70,type:'flyer'},
     {kind:'voidCrawler',w:12,h:10,hp:160,speed:50,type:'crawler'},
     {kind:'nightmare',w:12,h:12,hp:220,speed:38,type:'crawler'},
     {kind:'cryptHorror',w:12,h:12,hp:180,speed:45,type:'crawler'}
   ],
   boss:{kind:'shadowLord',w:20,h:26,hp:2400,dmg:36,name:'SHADOW LORD'},
   spawnCount:16}
];

/* ============ WORLD GENERATION ============ */
function buildWorld(){
  var platforms=[];
  var npcs=[];
  for(var zi=0;zi<ZONES.length;zi++){
    var z=ZONES[zi];
    var sx=z.startX;
    // أرض متصلة مع فجوات
    var x=sx;
    var groundY=230;
    while(x<z.endX-200){
      var segW=60+Math.floor(Math.random()*80);
      if(x+segW>z.endX-200)segW=z.endX-200-x;
      if(segW<30)break;
      platforms.push({x:x,y:groundY,w:segW,h:40});
      // منصات علوية
      if(Math.random()<0.4){
        var py=140+Math.floor(Math.random()*40);
        var pw=50+Math.floor(Math.random()*50);
        platforms.push({x:x+20,y:py,w:pw,h:8});
      }
      x+=segW+30+Math.floor(Math.random()*40);
    }
    // أرضية البوس النهائية
    platforms.push({x:z.endX-200,y:groundY,w:200,h:40});
    // منصة للبوس
    platforms.push({x:z.endX-160,y:120,w:120,h:8});
  }
  // NPCs في منطقة البداية
  npcs.push({x:350,y:200,type:'shop'});
  npcs.push({x:520,y:200,type:'forge'});
  return{width:ZONES[ZONES.length-1].endX,platforms:platforms,npcs:npcs,groundY:groundY};
}

var world=buildWorld();

/* ============ STATE ============ */
var state='playing';
var camera={x:0,y:0};
var shake={t:0,i:0};
var hitPause=0;
var gameTime=0;
var dtGlobal=0.016;
var currentZoneIdx=0;
var bossKilled=[false,false,false,false];
var zoneBossActive=[false,false,false,false];
var zoneEnemiesSpawned=[false,false,false,false];

/* ============ PLAYER ============ */
var player=null;

function initPlayer(){
  var bonusHP=(saveData.armorLevel-1)*40;
  player={
    x:saveData.playerX||60,
    y:saveData.playerY||100,
    vx:0,vy:0,w:12,h:20,
    onGround:false,facing:1,animTime:0,
    hp:BASE_HP+bonusHP,maxHp:BASE_HP+bonusHP,
    attacking:false,attackTimer:0,attackCooldown:0,
    invincible:0,hitFlash:0,
    playerDamage:BASE_DAMAGE+(saveData.weaponLevel-1)*20
  };
}

/* ============ ENEMIES/ITEMS ============ */
var enemies=[];
var particles=[];
var enemyProjectiles=[];
var heroParticles=[];
var boss=null;
var currentNpc=null;

function rect(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function rand(a,b){return a+Math.random()*(b-a);}
function clamp(v,a,b){return v<a?a:(v>b?b:v);}
function shakeNow(i,d){shake.i=i;shake.t=d;}

function spawnParticles(x,y,color,n,sz){
  if(!settings.particles)return;
  sz=sz||2;
  for(var i=0;i<n;i++){
    var ang=Math.random()*Math.PI*2,sp=40+Math.random()*140;
    particles.push({x:x,y:y,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp-60,
      life:0.5+Math.random()*0.5,maxLife:0.5+Math.random()*0.5,
      color:color,size:1+Math.random()*sz});
  }
}

/* ============ ENEMY SPAWNING ============ */
function getZoneIndex(px){
  for(var i=0;i<ZONES.length;i++){
    if(px>=ZONES[i].startX&&px<ZONES[i].endX)return i;
  }
  return ZONES.length-1;
}

function spawnEnemyInZone(zi){
  var z=ZONES[zi];
  if(zoneBossActive[zi])return;
  var t=z.enemies[Math.floor(Math.random()*z.enemies.length)];
  var fromLeft=Math.random()<0.5;
  var sx=player.x+(fromLeft?-40:VW+40);
  if(sx<z.startX+20)sx=z.startX+20;
  if(sx>z.endX-20)sx=z.endX-20;
  var baseY=t.type==='flyer'?rand(60,160):200;
  enemies.push({
    cfg:t,kind:t.kind,type:t.type,x:sx,y:baseY,
    vx:(fromLeft?1:-1)*t.speed,vy:0,w:t.w,h:t.h,
    hp:t.hp,maxHp:t.hp,direction:fromLeft?1:-1,
    hitFlash:0,hitCooldown:0,dead:false,
    baseY:baseY,bobPhase:Math.random()*Math.PI*2,
    knockback:0,deathTimer:0,opacity:1,
    attractPhase:Math.random()*6,skillTimer:2+Math.random()*2,
    skillActive:0,skillVx:0,skillVy:0,zone:zi
  });
}

function spawnBoss(zi){
  var z=ZONES[zi];
  var b=z.boss;
  boss={
    cfg:b,kind:b.kind,
    x:z.endX-100,y:170,vx:-40,vy:0,
    w:b.w,h:b.h,hp:b.hp,maxHp:b.hp,
    state:'enter',stateTimer:1.5,
    hitFlash:0,hitCooldown:0,direction:-1,
    baseY:170,bobPhase:0,attackTimer:2,
    skillTimer:4+Math.random()*2,skillActive:0,skillPhase:0,
    zone:zi
  };
  zoneBossActive[zi]=true;
  Sound.bossRoar();
  shakeNow(10,0.7);
}

/* ============ PLAYER PHYSICS ============ */
function playerPhysics(dt){
  var move=0;
  if(input.left)move-=1;
  if(input.right)move+=1;
  if(move!==0){player.vx+=move*MOVE_SPEED*8*dt;player.facing=move;}
  player.vx*=Math.pow(FRICTION,dt*60);

  if(input.jp&&player.onGround){
    player.vy=JUMP_FORCE;player.onGround=false;
    Sound.jump();
    spawnParticles(player.x+6,player.y+19,'#a78bfa',5,1.5);
  }
  input.jp=false;
  player.vy+=GRAVITY*dt;
  if(player.vy>550)player.vy=550;
  player.x+=player.vx*dt;
  player.y+=player.vy*dt;
  player.onGround=false;

  for(var i=0;i<world.platforms.length;i++){
    var p=world.platforms[i];
    if(rect(player,p)){
      if(player.vy>0&&player.y+player.h-player.vy*dt<=p.y+6){
        player.y=p.y-player.h;player.vy=0;player.onGround=true;
        if(Math.abs(player.vy)>300)spawnParticles(player.x+6,player.y+player.h,'#c4b5fd',4,1);
      } else if(player.vy<0&&player.y-player.vy*dt>=p.y+p.h-6){
        player.y=p.y+p.h;player.vy=0;
      } else {
        if(player.vx>0)player.x=p.x-player.w;
        else if(player.vx<0)player.x=p.x+p.w;
        player.vx=0;
      }
    }
  }
  if(player.x<0){player.x=0;player.vx=0;}
  if(player.x+player.w>world.width){player.x=world.width-player.w;player.vx=0;}

  if(player.y>VH+80){
    player.hp-=20;Sound.hurt();
    player.x=Math.max(0,player.x-100);player.y=100;
    player.vx=0;player.vy=0;player.invincible=1.5;
    shakeNow(8,0.3);
  }
}

/* ============ COMBAT ============ */
function attackBox(){
  if(player.facing===1)return{x:player.x+player.w,y:player.y+3,w:ATK_RANGE,h:13};
  return{x:player.x-ATK_RANGE,y:player.y+3,w:ATK_RANGE,h:13};
}

function damagePlayer(dmg,fromX){
  player.hp-=dmg;player.invincible=INV_TIME;player.hitFlash=0.3;
  Sound.hurt();shakeNow(7,0.25);hitPause=0.08;
  spawnParticles(player.x+player.w/2,player.y+player.h/2,'#ff3355',12,2);
  player.vx=(player.x<fromX?-1:1)*130;player.vy=-120;
}

function updateCombat(dt){
  if(player.attackCooldown>0)player.attackCooldown-=dt;
  if(player.invincible>0)player.invincible-=dt;
  if(player.hitFlash>0)player.hitFlash-=dt;

  if(input.ap&&player.attackCooldown<=0&&!player.attacking){
    player.attacking=true;player.attackTimer=ATK_DUR;player.attackCooldown=ATK_CD;
    Sound.slash();
    var hb=attackBox();
    spawnParticles(hb.x+hb.w/2,hb.y+hb.h/2,'#fbbf24',6,1.5);
  }
  input.ap=false;

  if(player.attacking){
    player.attackTimer-=dt;
    if(player.attackTimer>ATK_DUR*0.4){
      var hb=attackBox();
      for(var i=0;i<enemies.length;i++){
        var e=enemies[i];
        if(e.dead||e.hitCooldown>0)continue;
        if(rect(hb,{x:e.x,y:e.y,w:e.w,h:e.h})){
          e.hp-=player.playerDamage;
          e.hitFlash=0.15;e.hitCooldown=0.28;
          e.knockback=0.3;e.knockVx=player.facing*300;e.knockVy=-120;
          Sound.hit();hitPause=0.05;
          spawnParticles(e.x+e.w/2,e.y+e.h/2,'#ff3355',10,2);
          shakeNow(4,0.12);
          if(e.hp<=0){
            e.dead=true;saveData.totalKills++;
            Sound.kill();shakeNow(6,0.22);
            spawnParticles(e.x+e.w/2,e.y+e.h/2,'#e879f9',22,2.5);
            spawnParticles(e.x+e.w/2,e.y+e.h/2,'#ff3355',14,2);
            spawnParticles(e.x+e.w/2,e.y+e.h/2,'#fbbf24',10,2);
          }
        }
      }
      if(boss&&!boss.dead&&boss.hitCooldown<=0&&boss.state!=='enter'){
        if(rect(hb,{x:boss.x,y:boss.y,w:boss.w,h:boss.h})){
          boss.hp-=player.playerDamage;
          boss.hitFlash=0.12;boss.hitCooldown=0.15;
          Sound.bossHit();hitPause=0.08;
          spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#ff3355',10,2);
          spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#fbbf24',8,2);
          shakeNow(5,0.14);
          if(boss.hp<=0){
            boss.dead=true;Sound.levelComplete();shakeNow(16,0.9);
            bossKilled[boss.zone]=true;
            saveData.bossesDefeated[boss.zone]=true;
            saveData.gold+=80;
            Save.save(saveData);
            spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#e879f9',50,3);
            spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#ff3355',40,3);
            spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#fbbf24',30,3);
            setTimeout(function(){boss=null;zoneBossActive[boss?boss.zone:0]=false;},2500);
          }
        }
      }
    }
    if(player.attackTimer<=0)player.attacking=false;
  }
}

/* ============ ENEMY SKILLS ============ */
function enemySkill(e,dt){
  if(e.dead)return;
  e.skillTimer-=dt;
  if(e.skillActive>0){
    e.skillActive-=dt;
    if(e.kind==='bat'||e.kind==='imp'||e.kind==='shadowBeast'){
      e.x+=e.skillVx*dt;e.y+=e.skillVy*dt;
    } else if(e.kind==='fireGolem'||e.kind==='voidCrawler'){
      e.x+=e.skillVx*dt;
    }
    return;
  }
  if(e.skillTimer>0)return;
  if(player.invincible>0)return;
  var dx=player.x-e.x,dy=player.y-e.y;
  var dist=Math.sqrt(dx*dx+dy*dy);
  if(dist>220)return;

  if(e.kind==='bat'){
    e.skillActive=0.8;
    e.skillVx=dx/dist*280;e.skillVy=dy/dist*280;
    Sound.enemySkill();
  } else if(e.kind==='slime'){
    e.vy=-340;e.skillActive=0.5;
    spawnParticles(e.x+5,e.y+10,'#4ade80',6,1);
    Sound.enemySkill();
  } else if(e.kind==='skeleton'){
    enemyProjectiles.push({x:e.x+e.w/2,y:e.y+e.h/2,
      vx:dx/dist*200,vy:dy/dist*200,life:3,dmg:10,color:'#e2e8f0',size:3});
    Sound.enemySkill();
  } else if(e.kind==='imp'){
    for(var i=0;i<3;i++){
      var a=Math.atan2(dy,dx)+(i-1)*0.3;
      enemyProjectiles.push({x:e.x+e.w/2,y:e.y+e.h/2,
        vx:Math.cos(a)*180,vy:Math.sin(a)*180,life:3,dmg:10,color:'#ff9f1c',size:3});
    }
    Sound.enemySkill();
  } else if(e.kind==='fireGolem'){
    e.skillActive=0.5;
    e.skillVx=(player.x<e.x?-1:1)*280;
    Sound.enemySkill();
  } else if(e.kind==='iceWraith'){
    e.x=player.x+(Math.random()<0.5?-35:35);
    e.y=player.y-10+rand(-25,25);
    spawnParticles(e.x,e.y,'#00d4ff',10,2);
    Sound.enemySkill();
  } else if(e.kind==='frostSpider'){
    for(var j=0;j<5;j++){
      var a2=Math.atan2(dy,dx)+(j-2)*0.25;
      enemyProjectiles.push({x:e.x+e.w/2,y:e.y+e.h/2,
        vx:Math.cos(a2)*200,vy:Math.sin(a2)*200,life:3,dmg:8,color:'#7dd3fc',size:2});
    }
    Sound.enemySkill();
  } else if(e.kind==='iceGolem'){
    spawnParticles(e.x+e.w/2,e.y+e.h,'#7dd3fc',15,2);
    shakeNow(5,0.2);
    if(player.onGround&&Math.abs(player.x-e.x)<100&&player.invincible<=0)damagePlayer(15,e.x);
    Sound.enemySkill();
  } else if(e.kind==='shadowBeast'){
    e.skillActive=0.6;
    e.skillVx=dx/dist*340;e.skillVy=dy/dist*340;
    Sound.enemySkill();
  } else if(e.kind==='voidCrawler'){
    e.skillActive=0.5;
    e.skillVx=dx/dist*220;
    Sound.enemySkill();
  } else if(e.kind==='nightmare'){
    e.skillActive=1.0;
    Sound.enemySkill();
  } else if(e.kind==='cryptHorror'){
    for(var k=0;k<6;k++){
      var a3=Math.PI*2/6*k+Math.random()*0.3;
      enemyProjectiles.push({x:e.x+e.w/2,y:e.y+e.h/2,
        vx:Math.cos(a3)*160,vy:Math.sin(a3)*160,life:3,dmg:12,color:'#fbbf24',size:3});
    }
    Sound.enemySkill();
  }
  e.skillTimer=2.5+Math.random()*2;
}

/* ============ ENEMIES UPDATE ============ */
function updateEnemies(dt){
  for(var i=enemies.length-1;i>=0;i--){
    var e=enemies[i];
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
      if(dist<200&&dist>0){
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
        for(var j=0;j<world.platforms.length;j++){
          var p=world.platforms[j];
          if(rect({x:e.x,y:e.y,w:e.w,h:e.h},p)){
            if(e.vy>0){e.y=p.y-e.h;e.vy=0;}
          }
        }
      }
      if(e.y>VH+100){enemies.splice(i,1);continue;}
      if(e.x<player.x-400)e.x=player.x-400;
      if(e.x>player.x+400)e.x=player.x+400;
    } else if(e.type==='flyer'){
      if(e.skillActive<=0){
        var fSp=e.cfg.speed;
        var fspd=Math.sqrt(e.vx*e.vx+e.vy*e.vy);
        if(fspd>fSp*2.5){e.vx=e.vx/fspd*fSp*2.5;e.vy=e.vy/fspd*fSp*2.5;}
        e.x+=e.vx*dt;e.y+=e.vy*dt;
        e.bobPhase+=dt*3;
        if(e.kind!=='bat'&&e.kind!=='imp'&&e.kind!=='shadowBeast'){
          e.y=e.baseY+Math.sin(e.bobPhase)*10;
        }
      }
      if(e.x<player.x-400)e.x=player.x-400;
      if(e.x>player.x+400)e.x=player.x+400;
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

function updateEnemyProjectiles(dt){
  for(var i=enemyProjectiles.length-1;i>=0;i--){
    var p=enemyProjectiles[i];
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
    if(player.invincible<=0&&Math.abs(p.x-(player.x+player.w/2))<10&&Math.abs(p.y-(player.y+player.h/2))<12){
      damagePlayer(p.dmg,p.x);enemyProjectiles.splice(i,1);continue;
    }
    if(p.life<=0||p.x<camera.x-60||p.x>camera.x+VW+60)enemyProjectiles.splice(i,1);
  }
}

/* ============ BOSS UPDATE ============ */
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

  boss.attackTimer-=dt;
  boss.skillTimer-=dt;

  if(boss.skillActive>0){
    boss.skillActive-=dt;
    boss.skillPhase+=dt;
    if(boss.kind==='skeletonKing'){
      if(Math.floor(boss.skillPhase/0.3)>Math.floor((boss.skillPhase-dt)/0.3)){
        if(Math.random()<0.6){
          var z=ZONES[boss.zone];
          var e=z.enemies[2];
          enemies.push({cfg:e,kind:'skeleton',type:'walker',
            x:boss.x+rand(-50,50),y:boss.y,vx:rand(-70,70),vy:-100,
            w:10,h:12,hp:60,maxHp:60,direction:1,hitFlash:0,hitCooldown:0,dead:false,
            baseY:boss.y,bobPhase:0,knockback:0,deathTimer:0,opacity:1,
            attractPhase:Math.random()*6,skillTimer:3,skillActive:0,skillVx:0,skillVy:0,zone:boss.zone});
        }
      }
    } else if(boss.kind==='fireDemon'){
      if(Math.floor(boss.skillPhase/0.15)>Math.floor((boss.skillPhase-dt)/0.15)){
        for(var i=0;i<10;i++){
          var a=Math.PI*2/10*i+boss.skillPhase*3;
          enemyProjectiles.push({x:boss.x+boss.w/2,y:boss.y+boss.h/2,
            vx:Math.cos(a)*200,vy:Math.sin(a)*200,life:3,dmg:15,color:'#ff6b00',size:4});
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
          enemyProjectiles.push({x:boss.x+boss.w/2,y:boss.y+boss.h/2,
            vx:Math.cos(a2)*180,vy:Math.sin(a2)*180,life:3,dmg:12,color:'#e879f9',size:3});
        }
      }
    }
    if(boss.skillActive<=0){boss.state='idle';boss.attackTimer=1.5;}
    return;
  }

  if(boss.state==='idle'){
    boss.bobPhase+=dt*4;
    boss.y=boss.baseY+Math.sin(boss.bobPhase)*3;
    if(boss.skillTimer<=0){
      boss.skillActive=2.0;boss.skillPhase=0;
      Sound.bossRoar();shakeNow(8,0.4);
      boss.skillTimer=6+Math.random()*3;
      return;
    }
    if(boss.attackTimer<=0){
      var r=Math.random();
      if(r<0.4){boss.state='charge';boss.stateTimer=1.4;
        boss.vx=(player.x<boss.x?-1:1)*100;boss.vy=-180;Sound.bossRoar();}
      else if(r<0.7){boss.state='shoot';boss.stateTimer=1.2;boss.shootTimer=0;}
      else{boss.state='jump';boss.stateTimer=1.0;boss.vy=-280;}
      boss.attackTimer=1.8+Math.random()*1.2;
    }
  } else if(boss.state==='charge'){
    boss.stateTimer-=dt;
    boss.x+=boss.vx*dt;boss.vy+=GRAVITY*dt;boss.y+=boss.vy*dt;
    if(boss.y+boss.h>230){boss.y=230-boss.h;boss.vy=0;}
    if(boss.x<camera.x+20)boss.x=camera.x+20;
    if(boss.stateTimer<=0){boss.state='idle';boss.vx=0;}
    if(player.invincible<=0&&rect(player,{x:boss.x,y:boss.y,w:boss.w,h:boss.h})){
      damagePlayer(boss.cfg.dmg,boss.x);
    }
  } else if(boss.state==='shoot'){
    boss.stateTimer-=dt;boss.shootTimer-=dt;
    if(boss.shootTimer<=0){
      boss.shootTimer=0.35;
      var dx=(player.x+player.w/2)-(boss.x+boss.w/2);
      var dy=(player.y+player.h/2)-(boss.y+boss.h/2);
      var len=Math.sqrt(dx*dx+dy*dy);if(len<1)len=1;
      enemyProjectiles.push({x:boss.x+boss.w/2,y:boss.y+boss.h/2,
        vx:dx/len*180,vy:dy/len*180,life:3,dmg:14,color:'#ff3355',size:4});
    }
    if(boss.stateTimer<=0)boss.state='idle';
  } else if(boss.state==='jump'){
    boss.stateTimer-=dt;boss.vy+=GRAVITY*dt;boss.y+=boss.vy*dt;
    if(boss.y+boss.h>230){
      boss.y=230-boss.h;boss.vy=0;
      shakeNow(9,0.35);
      spawnParticles(boss.x+boss.w/2,230,'#fbbf24',20,2);
      if(player.onGround&&Math.abs(player.x-boss.x)<100&&player.invincible<=0){
        damagePlayer(boss.cfg.dmg,boss.x);
      }
      boss.state='idle';
    }
  }
}

/* ============ NPCs & SHOP ============ */
function checkNpcInteraction(){
  var closest=null;var closestDist=70;
  for(var i=0;i<world.npcs.length;i++){
    var npc=world.npcs[i];
    var d=Math.abs(npc.x-player.x);
    if(d<closestDist){closest=npc;closestDist=d;}
  }
  if(closest!==currentNpc){
    currentNpc=closest;
    if(closest){
      Hint.show();
    } else {
      Hint.hide();
    }
  }
  if(currentNpc&&input.ap){
    input.ap=false;
    if(currentNpc.type==='shop'){
      Sound.shop();
      Shop.open(saveData.gold,saveData.weaponLevel,function(item){
        if(saveData.gold<item.price)return;
        saveData.gold-=item.price;
        if(item.id[0]==='w'){
          saveData.weaponLevel++;
          player.playerDamage=BASE_DAMAGE+(saveData.weaponLevel-1)*20;
        } else {
          saveData.armorLevel++;
          var bonus=(saveData.armorLevel-1)*40;
          player.maxHp=BASE_HP+bonus;
          player.hp=player.maxHp;
        }
        Save.save(saveData);
        Sound.buy();
        Shop.open(saveData.gold,saveData.weaponLevel,arguments.callee);
        updateHUD();
      });
    } else if(currentNpc.type==='forge'){
      Sound.forge();
      Forge.open(saveData.gold,saveData.weaponLevel,function(){
        var prices=[0,0,80,180,350,600];
        var price=prices[saveData.weaponLevel]||0;
        if(saveData.gold<price||saveData.weaponLevel>=5)return;
        saveData.gold-=price;
        saveData.weaponLevel++;
        player.playerDamage=BASE_DAMAGE+(saveData.weaponLevel-1)*20;
        Save.save(saveData);
        Sound.buy();
        Forge.open(saveData.gold,saveData.weaponLevel,arguments.callee);
        updateHUD();
      });
    }
  }
}

/* ============ HERO PARTICLES ============ */
function updateHeroParticles(dt){
  if(!player||!settings.particles)return;
  if(Math.random()<0.35){
    var ang=Math.random()*Math.PI*2;
    var r=8+Math.random()*8;
    heroParticles.push({x:player.x+6+Math.cos(ang)*r,
      y:player.y+10+Math.sin(ang)*r,
      vx:(Math.random()-0.5)*15,vy:-15-Math.random()*20,
      life:0.8+Math.random()*0.4,maxLife:0.8+Math.random()*0.4,
      size:1+Math.random()*1.5});
  }
  for(var i=heroParticles.length-1;i>=0;i--){
    var p=heroParticles[i];
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
    if(p.life<=0)heroParticles.splice(i,1);
  }
}

/* ============ ZONE PROGRESSION ============ */
function checkZoneProgression(){
  var zi=getZoneIndex(player.x);
  if(zi!==currentZoneIdx){
    currentZoneIdx=zi;
    saveData.currentZone=zi;
    Save.save(saveData);
  }
  // Spawn enemies once per zone
  if(!zoneEnemiesSpawned[zi]&&!zoneBossActive[zi]&&!bossKilled[zi]){
    var z=ZONES[zi];
    for(var i=0;i<z.spawnCount;i++){
      setTimeout(function(){spawnEnemyInZone(zi);},i*400);
    }
    zoneEnemiesSpawned[zi]=true;
  }
  // Spawn boss if all zone enemies cleared
  if(zoneEnemiesSpawned[zi]&&!zoneBossActive[zi]&&!bossKilled[zi]){
    var aliveInZone=0;
    for(var j=0;j<enemies.length;j++){
      if(enemies[j].zone===zi&&!enemies[j].dead)aliveInZone++;
    }
    if(aliveInZone===0&&boss===null){
      var z2=ZONES[zi];
      if(player.x>z2.endX-250){
        spawnBoss(zi);
      }
    }
  }
}

/* ============ HUD ============ */
function updateHUD(){
  var hpFill=document.getElementById('hpFill');
  var goldEl=document.getElementById('goldCount');
  var levelEl=document.getElementById('levelName');
  var killEl=document.getElementById('killCount');
  var wLvEl=document.getElementById('weaponLevel');
  var aLvEl=document.getElementById('armorLevel');
  if(hpFill)hpFill.style.width=Math.max(0,player.hp/player.maxHp*100)+'%';
  if(goldEl)goldEl.textContent=saveData.gold;
  if(levelEl)levelEl.textContent=ZONES[currentZoneIdx].name;
  if(killEl)killEl.textContent=saveData.totalKills;
  if(wLvEl)wLvEl.textContent='Lv.'+saveData.weaponLevel;
  if(aLvEl)aLvEl.textContent='Lv.'+saveData.armorLevel;
}

/* ============ CAMERA ============ */
function updateCamera(){
  var targetX=player.x-VW*0.4;
  if(targetX<0)targetX=0;
  if(targetX>world.width-VW)targetX=world.width-VW;
  camera.x+=(targetX-camera.x)*0.08;
  if(camera.x<0)camera.x=0;
  if(camera.x>world.width-VW)camera.x=world.width-VW;
}

/* ============ DRAWING ============ */
function drawBackground(){
  var zi=currentZoneIdx;
  var t=ZONES[zi].theme;
  var camX=camera.x;
  if(zi===0){
    var sky=lg(ctx,0,0,0,VH,[[0,'#1a0d2e'],[0.4,'#0f0720'],[0.7,'#0a0515'],[1,'#050208']]);
    ctx.fillStyle=sky;ctx.fillRect(0,0,VW,VH);
    for(var i=0;i<100;i++){
      var sx=(i*73+Math.floor(camX*0.05))%VW;
      var sy=(i*41)%200;
      var tw=Math.sin(gameTime*2+i)*0.5+0.5;
      ctx.globalAlpha=(0.15+((i*17)%10)/50)*tw;
      var sz=((i*13)%3===0)?2:1;
      ctx.fillStyle=t.star;ctx.fillRect(sx,sy,sz,sz);
    }
    ctx.globalAlpha=1;
    for(var c=0;c<6;c++){
      var cx=(c*220+Math.floor(camX*0.1))%VW;
      var cy=40+c*20;
      ctx.fillStyle='rgba(45,27,94,'+(0.4+c*0.08)+')';
      ctx.beginPath();
      ctx.moveTo(cx-60,cy+50);
      ctx.bezierCurveTo(cx-40,cy-20,cx-20,cy-40,cx-10,cy-10);
      ctx.bezierCurveTo(cx,cy-25,cx+10,cy-30,cx+15,cy-12);
      ctx.bezierCurveTo(cx+30,cy-35,cx+50,cy-15,cx+65,cy+50);
      ctx.closePath();ctx.fill();
    }
    var stal=lg(ctx,0,0,0,90,[[0,'rgba(45,27,94,0.9)'],[1,'rgba(26,15,48,0)']]);
    ctx.fillStyle=stal;
    for(var s=0;s<15;s++){
      var sx2=(s*41+Math.floor(camX*0.6))%VW;
      var sLen=20+((s*23)%50);
      ctx.beginPath();
      ctx.moveTo(sx2-7,0);
      ctx.bezierCurveTo(sx2-5,sLen*0.5,sx2-3,sLen*0.8,sx2,sLen);
      ctx.bezierCurveTo(sx2+3,sLen*0.8,sx2+5,sLen*0.5,sx2+7,0);
      ctx.closePath();ctx.fill();
    }
  } else if(zi===1){
    var sky2=lg(ctx,0,0,0,VH,[[0,'#3a0a05'],[0.4,'#1a0402'],[0.7,'#0a0202'],[1,'#000000']]);
    ctx.fillStyle=sky2;ctx.fillRect(0,0,VW,VH);
    var moonX=VW*0.75;
    var moonY=80;
    var mg=rg(ctx,moonX,moonY,80,[[0,'rgba(255,159,28,0.6)'],[0.4,'rgba(220,38,38,0.3)'],[1,'rgba(220,38,38,0)']]);
    ctx.fillStyle=mg;ctx.beginPath();ctx.arc(moonX,moonY,80,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.arc(moonX,moonY,26,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(220,38,38,0.7)';
    ctx.beginPath();ctx.arc(moonX-8,moonY-8,5,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(moonX+10,moonY+4,4,0,Math.PI*2);ctx.fill();
    for(var i2=0;i2<40;i2++){
      var sx3=(i2*79+Math.floor(camX*0.08))%VW;
      var sy2=(i2*47)%180;
      ctx.globalAlpha=0.3+Math.sin(gameTime*3+i2)*0.2;
      ctx.fillStyle='#dc2626';ctx.fillRect(sx3,sy2,2,2);
    }
    ctx.globalAlpha=1;
    ctx.fillStyle='#450a0a';ctx.beginPath();ctx.moveTo(0,VH);
    for(var mx=0;mx<=VW;mx+=20){
      var my=160+Math.sin((mx+camX*0.2)*0.04)*25+Math.cos((mx+camX*0.2)*0.07)*12;
      ctx.lineTo(mx,my);
    }
    ctx.lineTo(VW,VH);ctx.fill();
    ctx.strokeStyle='#fbbf24';ctx.lineWidth=2;
    ctx.shadowColor='#fbbf24';ctx.shadowBlur=15;
    ctx.beginPath();ctx.moveTo(0,VH);
    for(var vx=0;vx<=VW;vx+=20){
      var vy=160+Math.sin((vx+camX*0.2)*0.04)*25+Math.cos((vx+camX*0.2)*0.07)*12;
      ctx.lineTo(vx,vy);
    }
    ctx.stroke();ctx.shadowBlur=0;
    var lavaGlow=lg(ctx,0,VH-80,0,VH,[[0,'rgba(251,191,36,0)'],[0.5,'rgba(255,107,0,0.3)'],[1,'rgba(220,38,38,0.7)']]);
    ctx.fillStyle=lavaGlow;ctx.fillRect(0,VH-80,VW,80);
    for(var lb=0;lb<20;lb++){
      var lx=(lb*63+Math.floor(gameTime*30))%VW;
      var ly=VH-20-Math.sin(gameTime*3+lb)*20;
      ctx.globalAlpha=0.6;ctx.fillStyle='#fbbf24';
      ctx.beginPath();ctx.arc(lx,ly,2,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
  } else if(zi===2){
    var sky3=lg(ctx,0,0,0,VH,[[0,'#0a2540'],[0.4,'#041525'],[0.7,'#020810'],[1,'#000000']]);
    ctx.fillStyle=sky3;ctx.fillRect(0,0,VW,VH);
    for(var a=0;a<4;a++){
      var ax=(a*180+Math.floor(camX*0.1))%VW;
      ctx.globalAlpha=0.2;
      var ag=lg(ctx,ax,0,ax+80,120,[[0,'rgba(125,211,252,0)'],[0.5,'rgba(0,212,255,0.5)'],[1,'rgba(125,211,252,0)']]);
      ctx.fillStyle=ag;
      ctx.beginPath();ctx.moveTo(ax-30,0);
      ctx.bezierCurveTo(ax-15,50,ax+15,80,ax+30,130);
      ctx.bezierCurveTo(ax+50,80,ax+80,40,ax+100,0);
      ctx.closePath();ctx.fill();
    }
    ctx.globalAlpha=1;
    for(var s2=0;s2<70;s2++){
      var sx4=(s2*67+Math.floor(camX*0.05))%VW;
      var sy3=(s2*37)%VH;
      ctx.globalAlpha=0.4+Math.sin(gameTime*2+s2)*0.3;
      ctx.fillStyle='#bae6fd';ctx.fillRect(sx4,sy3,2,2);
    }
    ctx.globalAlpha=1;
    ctx.fillStyle='#0c4a6e';ctx.beginPath();ctx.moveTo(0,VH);
    for(var mx2=0;mx2<=VW;mx2+=20){
      var my2=150+Math.sin((mx2+camX*0.15)*0.03)*28+Math.cos((mx2+camX*0.15)*0.06)*14;
      ctx.lineTo(mx2,my2);
    }
    ctx.lineTo(VW,VH);ctx.fill();
    ctx.strokeStyle='rgba(186,230,253,0.5)';ctx.lineWidth=1.2;
    ctx.beginPath();ctx.moveTo(0,VH);
    for(var vx2=0;vx2<=VW;vx2+=20){
      var vy2=150+Math.sin((vx2+camX*0.15)*0.03)*28+Math.cos((vx2+camX*0.15)*0.06)*14;
      ctx.lineTo(vx2,vy2);
    }
    ctx.stroke();
    for(var sn=0;sn<50;sn++){
      var snx=(sn*43+Math.floor(gameTime*20))%VW;
      var sny=((sn*29)+Math.floor(gameTime*35))%VH;
      ctx.globalAlpha=0.7;ctx.fillStyle='#e0f2fe';
      ctx.beginPath();ctx.arc(snx,sny,1.5,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
  } else {
    var sky4=lg(ctx,0,0,0,VH,[[0,'#2a0a40'],[0.4,'#14051f'],[0.7,'#050208'],[1,'#000000']]);
    ctx.fillStyle=sky4;ctx.fillRect(0,0,VW,VH);
    for(var o=0;o<7;o++){
      var ox=(o*120+Math.floor(camX*0.08))%VW;
      var oy=50+o*25;
      var og=rg(ctx,ox,oy,70,[[0,'rgba(232,121,249,0.15)'],[1,'rgba(232,121,249,0)']]);
      ctx.fillStyle=og;ctx.beginPath();ctx.arc(ox,oy,70,0,Math.PI*2);ctx.fill();
    }
    for(var e=0;e<40;e++){
      var ex=(e*47+Math.floor(camX*0.06))%VW;
      var ey=(e*29)%200;
      var pulse=0.3+Math.sin(gameTime*4+e*0.5)*0.4;
      ctx.globalAlpha=pulse;
      ctx.fillStyle=e%3===0?'#e879f9':'#a78bfa';
      ctx.shadowColor='#e879f9';ctx.shadowBlur=6;
      ctx.beginPath();ctx.arc(ex,ey,1.6,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;ctx.shadowBlur=0;
    ctx.fillStyle='rgba(76,29,149,0.6)';
    for(var pi=0;pi<7;pi++){
      var pix=(pi*140+Math.floor(camX*0.25))%VW-40;
      ctx.beginPath();ctx.moveTo(pix,VH);
      ctx.bezierCurveTo(pix-15,VH-50,pix-8,VH-80,pix,VH-110);
      ctx.bezierCurveTo(pix+8,VH-80,pix+15,VH-50,pix+30,VH);
      ctx.closePath();ctx.fill();
    }
    ctx.fillStyle='rgba(30,27,75,0.9)';
    ctx.beginPath();ctx.moveTo(0,VH);
    for(var mx3=0;mx3<=VW;mx3+=20){
      var my3=150+Math.sin((mx3+camX*0.2)*0.04)*25;
      ctx.lineTo(mx3,my3);
    }
    ctx.lineTo(VW,VH);ctx.fill();
  }
  ctx.fillStyle=t.fog;ctx.fillRect(0,0,VW,VH);
  var vig=rg(ctx,VW/2,VH/2,280,[[0,'rgba(0,0,0,0)'],[0.7,'rgba(0,0,0,0.3)'],[1,'rgba(0,0,0,0.7)']]);
  ctx.fillStyle=vig;ctx.fillRect(0,0,VW,VH);
}

function drawPlatforms(){
  var t=ZONES[currentZoneIdx].theme;
  for(var i=0;i<world.platforms.length;i++){
    var p=world.platforms[i];
    var px=Math.floor(p.x-camera.x);
    if(px+p.w<-20||px>VW+20)continue;
    ctx.fillStyle='rgba(0,0,0,0.55)';
    ctx.fillRect(px+3,p.y+4,p.w,p.h);
    var pg=lg(ctx,0,p.y,0,p.y+p.h,[[0,t.platTop],[0.25,t.platBot],[1,'#000']]);
    ctx.fillStyle=pg;ctx.fillRect(px,p.y,p.w,p.h);
    ctx.fillStyle=t.edge;ctx.shadowColor=t.edge;ctx.shadowBlur=8;
    ctx.fillRect(px,p.y,p.w,1.5);
    ctx.shadowBlur=0;
    ctx.fillStyle='rgba(255,255,255,0.1)';
    ctx.fillRect(px,p.y+2,p.w,1);
  }
}

function drawNpcs(){
  for(var i=0;i<world.npcs.length;i++){
    var npc=world.npcs[i];
    var px=Math.floor(npc.x-camera.x);
    if(px<-50||px>VW+50)continue;
    if(npc.type==='shop')drawShopkeeper(ctx,px,npc.y,gameTime);
    else drawForge(ctx,px,npc.y,gameTime);
  }
}

function drawPlayer(){
  if(player.invincible>0&&Math.floor(player.invincible*20)%2===0)return;
  var px=Math.floor(player.x-camera.x);
  var st=(Math.abs(player.vx)>5&&player.onGround)?'walk':
    (!player.onGround?(player.vy<0?'jump':'fall'):'idle');
  drawKnight(ctx,px,player.y,player.facing,st,player.animTime,
    player.hitFlash,player.attacking,player.vx,player.vy,player.onGround,
    player.attackTimer,ATK_DUR);
}

function drawEnemies(){
  for(var i=0;i<enemies.length;i++){
    var e=enemies[i];
    var px=Math.floor(e.x-camera.x);
    if(px<-50||px>VW+50)continue;
    ctx.globalAlpha=e.dead?e.opacity:1;
    var hit=e.hitFlash>0;
    switch(e.kind){
      case 'bat':drawBat(ctx,px,e.y,e.direction,gameTime,hit);break;
      case 'slime':drawSlime(ctx,px,e.y,e.direction,gameTime,hit);break;
      case 'skeleton':drawSkeleton(ctx,px,e.y,e.direction,gameTime,hit);break;
      case 'imp':drawImp(ctx,px,e.y,e.direction,gameTime,hit);break;
      case 'fireGolem':drawFireGolem(ctx,px,e.y,e.direction,gameTime,hit);break;
      case 'iceWraith':drawIceWraith(ctx,px,e.y,e.direction,gameTime,hit);break;
      case 'frostSpider':drawFrostSpider(ctx,px,e.y,e.direction,gameTime,hit);break;
      case 'iceGolem':drawIceGolem(ctx,px,e.y,e.direction,gameTime,hit);break;
      case 'shadowBeast':drawShadowBeast(ctx,px,e.y,e.direction,gameTime,hit);break;
      case 'voidCrawler':drawVoidCrawler(ctx,px,e.y,e.direction,gameTime,hit);break;
      case 'nightmare':drawNightmare(ctx,px,e.y,e.direction,gameTime,hit);break;
      case 'cryptHorror':drawCryptHorror(ctx,px,e.y,e.direction,gameTime,hit);break;
    }
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
  switch(boss.kind){
    case 'skeletonKing':drawSkeletonKing(ctx,px,boss.y,-1,gameTime,hit);break;
    case 'fireDemon':drawFireDemon(ctx,px,boss.y,-1,gameTime,hit);break;
    case 'iceQueen':drawIceQueen(ctx,px,boss.y,-1,gameTime,hit);break;
    case 'shadowLord':drawShadowLord(ctx,px,boss.y,-1,gameTime,hit);break;
  }
  var bw=VW-80,bx=40,by=26;
  ctx.fillStyle='rgba(0,0,0,0.85)';
  ctx.fillRect(bx-4,by-4,bw+8,18);
  ctx.fillStyle='#1a0000';ctx.fillRect(bx,by,bw,10);
  var hpPct=Math.max(0,boss.hp/boss.maxHp);
  var grad=lg(ctx,bx,0,bx+bw,0,[[0,'#ff3355'],[1,'#e879f9']]);
  ctx.fillStyle=grad;
  ctx.shadowColor='#ff3355';ctx.shadowBlur=12;
  ctx.fillRect(bx,by,bw*hpPct,10);
  ctx.shadowBlur=0;
  ctx.fillStyle='#fff';ctx.font='bold 10px monospace';ctx.textAlign='center';
  ctx.fillText(boss.cfg.name,VW/2,by+8);
  ctx.textAlign='left';
}

function drawEnemyProjectiles(){
  for(var i=0;i<enemyProjectiles.length;i++){
    var p=enemyProjectiles[i];
    var px=Math.floor(p.x-camera.x);
    if(px<-30||px>VW+30)continue;
    ctx.globalAlpha=Math.max(0,p.life/3);
    ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=12;
    ctx.beginPath();ctx.arc(px,p.y,p.size+1,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=0.3;
    ctx.beginPath();ctx.arc(px,p.y,p.size+6,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
  }
  ctx.globalAlpha=1;
}

function drawHeroParticles(){
  for(var i=0;i<heroParticles.length;i++){
    var p=heroParticles[i];
    var a=Math.max(0,p.life/p.maxLife);
    ctx.globalAlpha=a*0.7;ctx.fillStyle='#c4b5fd';
    ctx.shadowColor='#a78bfa';ctx.shadowBlur=6;
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

/* ============ MAIN LOOP ============ */
var last=0;
function loop(ts){
  var dt=Math.min((ts-last)/1000,0.05);last=ts;
  if(hitPause>0){hitPause-=dt;requestAnimationFrame(loop);return;}
  dtGlobal=dt;gameTime+=dt;

  if(state==='playing'){
    player.animTime+=dt;
    playerPhysics(dt);
    updateCombat(dt);
    updateEnemies(dt);
    updateEnemyProjectiles(dt);
    if(boss)updateBoss(dt);
    updateHeroParticles(dt);
    updateCamera();
    checkNpcInteraction();
    checkZoneProgression();
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
    Sound.gameOver();
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
  drawNpcs();
  drawEnemies();
  if(boss)drawBossEntity();
  drawEnemyProjectiles();
  drawPlayer();
  drawHeroParticles();
  drawAttackEffect();
  drawParticles();
  ctx.restore();

  requestAnimationFrame(loop);
}

/* ============ GAME BRIDGE API ============ */
window.GameBridge={
  startNewGame:function(){
    saveData=Save.load();
    saveData.gold=0;
    saveData.weaponLevel=1;
    saveData.armorLevel=1;
    saveData.totalKills=0;
    saveData.bossesDefeated=[false,false,false,false];
    saveData.playerX=60;
    saveData.playerY=100;
    saveData.currentZone=0;
    Save.save(saveData);
    bossKilled=[false,false,false,false];
    zoneBossActive=[false,false,false,false];
    zoneEnemiesSpawned=[false,false,false,false];
    enemies=[];
    particles=[];
    enemyProjectiles=[];
    heroParticles=[];
    boss=null;
    currentNpc=null;
    Hint.hide();
    initPlayer();
    camera.x=0;
    currentZoneIdx=0;
    state='playing';
  },
  continueGame:function(){
    saveData=Save.load();
    bossKilled=saveData.bossesDefeated.slice();
    zoneBossActive=[false,false,false,false];
    zoneEnemiesSpawned=[false,false,false,false];
    enemies=[];
    particles=[];
    enemyProjectiles=[];
    heroParticles=[];
    boss=null;
    currentNpc=null;
    Hint.hide();
    initPlayer();
    camera.x=Math.max(0,player.x-VW*0.4);
    currentZoneIdx=getZoneIndex(player.x);
    state='playing';
  },
  pause:function(){
    if(state==='playing')state='paused';
  },
  resume:function(){
    if(state==='paused')state='playing';
  },
  save:function(){
    if(player){
      saveData.playerX=player.x;
      saveData.playerY=player.y;
      saveData.playerHP=player.hp;
      Save.save(saveData);
    }
  },
  setVolume:function(v){
    // الحجم يتم تطبيقه في audio.js
  }
};

/* ============ INIT ============ */
Sound.init();
document.addEventListener('touchstart',function u(){
  Sound.init();Sound.resume();
  document.removeEventListener('touchstart',u);
},{once:true});
document.addEventListener('mousedown',function u(){
  Sound.init();Sound.resume();
  document.removeEventListener('mousedown',u);
},{once:true});

initPlayer();
requestAnimationFrame(function(t){last=t;requestAnimationFrame(loop);});
console.log('%c⚔️ Shadow Blade v2.0','color:#a78bfa;font-size:20px;font-weight:900;');
console.log('%cFull open world · 4 zones · Save system · Shop · Forge','color:#e879f9;font-size:11px;');
})();
