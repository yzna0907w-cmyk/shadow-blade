(function(){
'use strict';

// ===== Save System =====
var Save=(function(){
  var KEY='sb_save_v4', SK='sb_settings_v4';
  var DD={gold:0,weaponLevel:1,armorLevel:1,bossesDefeated:[false,false,false,false],totalKills:0,playerX:60,playerY:100,currentZone:0};
  var DS={master:50,sfx:70,vibration:true,particles:true,blood:true};
  function load(){try{var r=localStorage.getItem(KEY);if(!r)return JSON.parse(JSON.stringify(DD));var d=JSON.parse(r);for(var k in DD)if(d[k]===undefined)d[k]=DD[k];return d;}catch(e){return JSON.parse(JSON.stringify(DD));}}
  function save(d){try{d.lastSaved=Date.now();localStorage.setItem(KEY,JSON.stringify(d));return true;}catch(e){return false;}}
  function reset(){try{localStorage.removeItem(KEY);}catch(e){}}
  function loadS(){try{var r=localStorage.getItem(SK);if(!r)return JSON.parse(JSON.stringify(DS));var s=JSON.parse(r);for(var k in DS)if(s[k]===undefined)s[k]=DS[k];return s;}catch(e){return JSON.parse(JSON.stringify(DS));}}
  function saveS(s){try{localStorage.setItem(SK,JSON.stringify(s));return true;}catch(e){return false;}}
  return{load:load,save:save,reset:reset,loadSettings:loadS,saveSettings:saveS};
})();
window.Save=Save;

// ===== Constants =====
var VW=480, VH=270;
var GRAVITY=900, MOVE_SPEED=140, JUMP_FORCE=-380, FRICTION=0.82;
var ATK_DUR=0.22, ATK_CD=0.30, ATK_RANGE=30, INV_TIME=1.2;
var BASE_DAMAGE=30, BASE_HP=100;

var canvas=document.getElementById('game');
var ctx=canvas.getContext('2d');

function resize(){
  // الكانفس داخلياً 480x270، CSS يمدده
  canvas.width=VW;
  canvas.height=VH;
}
window.addEventListener('resize',resize);
window.addEventListener('orientationchange',function(){setTimeout(resize,300);});
resize();

var saveData=Save.load();
var settings=Save.loadSettings();
var gameRunning=false;

// ===== Input =====
var input={left:false,right:false,jump:false,attack:false,jp:false,ap:false};

function bindBtn(id,onD,onU){
  var b=document.getElementById(id);
  if(!b)return;
  var pressed=false;
  var p=function(e){
    if(e){e.preventDefault();e.stopPropagation();}
    if(pressed)return;
    pressed=true;
    b.classList.add('pressed');
    try{if(window.Sound){Sound.init();Sound.resume();}}catch(err){}
    onD();
  };
  var r=function(e){
    if(e){e.preventDefault();e.stopPropagation();}
    if(!pressed)return;
    pressed=false;
    b.classList.remove('pressed');
    if(onU)onU();
  };
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

// ===== Zones =====
var ZONES=[
  {name:'CRYPT',startX:0,endX:1200,color:'#7c3aed',accent:'#c4b5fd',bg1:'#1a0d2e',bg2:'#050208'},
  {name:'FIRE',startX:1200,endX:2400,color:'#ff6b00',accent:'#ffb366',bg1:'#3a0a05',bg2:'#0a0202'},
  {name:'FROZEN',startX:2400,endX:3600,color:'#00d4ff',accent:'#7dd3fc',bg1:'#0a2540',bg2:'#020810'},
  {name:'SHADOW',startX:3600,endX:4800,color:'#e879f9',accent:'#f0abfc',bg1:'#2a0a40',bg2:'#050208'}
];

// ===== World =====
function buildWorld(){
  var plats=[];
  var x=0;
  while(x<4800-200){
    var w=100+Math.floor(Math.random()*80);
    plats.push({x:x,y:230,w:w,h:40});
    // منصات علوية
    if(Math.random()<0.5){
      plats.push({x:x+30,y:150+Math.floor(Math.random()*40),w:60,h:8});
    }
    x+=w+50+Math.floor(Math.random()*40);
  }
  plats.push({x:4600,y:230,w:200,h:40});
  return{width:4800,platforms:plats};
}
var world=buildWorld();

// ===== State =====
var state='idle';
var camera={x:0};
var shake={t:0,i:0};
var hitPause=0;
var gameTime=0;
var currentZoneIdx=0;
var bossKilled=[false,false,false,false];
var enemies=[],particles=[],enemyProjectiles=[],heroParticles=[];
var boss=null;
var player=null;

function rect(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function rand(a,b){return a+Math.random()*(b-a);}
function shakeNow(i,d){shake.i=i;shake.t=d;}

function spawnParticles(x,y,color,n,sz){
  if(!settings.particles)return;
  sz=sz||2;
  for(var i=0;i<n;i++){
    var ang=Math.random()*Math.PI*2,sp=40+Math.random()*140;
    particles.push({x:x,y:y,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp-60,
      life:0.5+Math.random()*0.5,maxLife:0.5+Math.random()*0.5,color:color,size:1+Math.random()*sz});
  }
}

function initPlayer(){
  var bonusHP=(saveData.armorLevel-1)*40;
  player={
    x:60,y:100,vx:0,vy:0,w:14,h:20,
    onGround:false,facing:1,animTime:0,
    hp:BASE_HP+bonusHP,maxHp:BASE_HP+bonusHP,
    attacking:false,attackTimer:0,attackCooldown:0,invincible:0,hitFlash:0,
    playerDamage:BASE_DAMAGE+(saveData.weaponLevel-1)*20
  };
}

function spawnEnemy(){
  var zi=getZoneIndex(player.x);
  if(bossKilled[zi])return;
  if(enemies.length>=6)return;
  var fromLeft=Math.random()<0.5;
  var sx=player.x+(fromLeft?-40:VW+40);
  var isFlyer=Math.random()<0.5;
  enemies.push({
    x:sx,y:isFlyer?rand(60,160):190,
    vx:(fromLeft?1:-1)*(30+Math.random()*30),
    vy:0,w:14,h:14,
    hp:60+zi*30,maxHp:60+zi*30,
    isFlyer:isFlyer,direction:fromLeft?1:-1,
    baseY:isFlyer?rand(60,160):190,
    bobPhase:Math.random()*6,
    hitFlash:0,hitCooldown:0,dead:false,deathTimer:0,opacity:1,
    zone:zi,color:ZONES[zi].color
  });
}

function getZoneIndex(px){
  for(var i=0;i<ZONES.length;i++){
    if(px>=ZONES[i].startX&&px<ZONES[i].endX)return i;
  }
  return ZONES.length-1;
}

function getVisiblePlatforms(){
  var result=[],buffer=200;
  var minX=camera.x-buffer,maxX=camera.x+VW+buffer;
  for(var i=0;i<world.platforms.length;i++){
    var p=world.platforms[i];
    if(p.x+p.w>minX&&p.x<maxX)result.push(p);
  }
  return result;
}

// ===== Physics =====
function playerPhysics(dt){
  var move=0;
  if(input.left)move-=1;
  if(input.right)move+=1;
  if(move!==0){player.vx+=move*MOVE_SPEED*8*dt;player.facing=move;}
  player.vx*=Math.pow(FRICTION,dt*60);
  if(input.jp&&player.onGround){
    player.vy=JUMP_FORCE;player.onGround=false;
    try{if(window.Sound)Sound.jump();}catch(e){}
    spawnParticles(player.x+7,player.y+19,'#a78bfa',5,1.5);
  }
  input.jp=false;
  player.vy+=GRAVITY*dt;
  if(player.vy>550)player.vy=550;
  player.x+=player.vx*dt;
  player.y+=player.vy*dt;
  player.onGround=false;
  var vis=getVisiblePlatforms();
  for(var i=0;i<vis.length;i++){
    var p=vis[i];
    if(rect(player,p)){
      if(player.vy>0&&player.y+player.h-player.vy*dt<=p.y+6){
        player.y=p.y-player.h;player.vy=0;player.onGround=true;
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
  if(player.y>VH+80){player.hp-=20;Sound.hurt();player.x=Math.max(0,player.x-100);player.y=100;player.vx=0;player.vy=0;player.invincible=1.5;shakeNow(8,0.3);}
}

function attackBox(){
  if(player.facing===1)return{x:player.x+player.w,y:player.y+3,w:ATK_RANGE,h:14};
  return{x:player.x-ATK_RANGE,y:player.y+3,w:ATK_RANGE,h:14};
}

function damagePlayer(dmg,fromX){
  player.hp-=dmg;player.invincible=INV_TIME;player.hitFlash=0.3;
  try{if(window.Sound)Sound.hurt();}catch(e){}
  shakeNow(7,0.25);hitPause=0.08;
  spawnParticles(player.x+player.w/2,player.y+player.h/2,'#ff3355',12,2);
  player.vx=(player.x<fromX?-1:1)*130;player.vy=-120;
}

function updateCombat(dt){
  if(player.attackCooldown>0)player.attackCooldown-=dt;
  if(player.invincible>0)player.invincible-=dt;
  if(player.hitFlash>0)player.hitFlash-=dt;
  if(input.ap&&player.attackCooldown<=0&&!player.attacking){
    player.attacking=true;player.attackTimer=ATK_DUR;player.attackCooldown=ATK_CD;
    try{if(window.Sound)Sound.slash();}catch(e){}
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
          e.knockVx=player.facing*300;e.knockVy=-120;e.knockback=0.3;
          try{if(window.Sound)Sound.hit();}catch(err){}
          hitPause=0.05;
          spawnParticles(e.x+e.w/2,e.y+e.h/2,'#ff3355',10,2);
          shakeNow(4,0.12);
          if(e.hp<=0){
            e.dead=true;
            saveData.totalKills++;saveData.gold+=2;
            try{if(window.Sound)Sound.kill();}catch(err){}
            shakeNow(6,0.22);
            spawnParticles(e.x+e.w/2,e.y+e.h/2,'#e879f9',22,2.5);
            spawnParticles(e.x+e.w/2,e.y+e.h/2,'#fbbf24',10,2);
          }
        }
      }
    }
    if(player.attackTimer<=0)player.attacking=false;
  }
}

function updateEnemies(dt){
  for(var i=enemies.length-1;i>=0;i--){
    var e=enemies[i];
    if(Math.abs(e.x-player.x)>600&&!e.dead){enemies.splice(i,1);continue;}
    if(e.hitFlash>0)e.hitFlash-=dt;
    if(e.hitCooldown>0)e.hitCooldown-=dt;
    if(e.dead){
      e.deathTimer+=dt;e.opacity=Math.max(0,1-e.deathTimer/0.5);
      e.y-=40*dt;e.x+=e.knockVx*0.3*dt;
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
    // Attraction
    var dx=player.x-e.x,dy=player.y-e.y;
    var dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<180&&dist>0){
      e.vx+=dx/dist*25*dt*3;
      e.vy+=dy/dist*20*dt*2;
    }
    if(e.isFlyer){
      e.x+=e.vx*dt;e.y+=e.vy*dt;
      e.bobPhase+=dt*3;
      // Return to baseY slowly
      e.y+=(e.baseY-e.y)*dt*0.5;
      if(e.y<30)e.y=30;
      if(e.y>VH-30)e.y=VH-30;
    } else {
      e.x+=e.vx*dt;e.vy+=GRAVITY*dt;e.y+=e.vy*dt;
      var vis=getVisiblePlatforms();
      for(var j=0;j<vis.length;j++){
        var p=vis[j];
        if(rect({x:e.x,y:e.y,w:e.w,h:e.h},p)){
          if(e.vy>0){e.y=p.y-e.h;e.vy=0;}
        }
      }
      if(e.y>VH+100){enemies.splice(i,1);continue;}
    }
    if(player.invincible<=0&&!player.attacking){
      if(rect({x:player.x,y:player.y,w:player.w,h:player.h},{x:e.x,y:e.y,w:e.w,h:e.h})){
        damagePlayer(15,e.x);
      }
    }
  }
}

function updateCamera(){
  var targetX=player.x-VW*0.4;
  if(targetX<0)targetX=0;
  if(targetX>world.width-VW)targetX=world.width-VW;
  camera.x+=(targetX-camera.x)*0.08;
  if(camera.x<0)camera.x=0;
  if(camera.x>world.width-VW)camera.x=world.width-VW;
}

function updateHeroParticles(dt){
  if(!player||!settings.particles)return;
  if(Math.random()<0.35){
    var ang=Math.random()*Math.PI*2,r=8+Math.random()*8;
    heroParticles.push({
      x:player.x+7+Math.cos(ang)*r,y:player.y+10+Math.sin(ang)*r,
      vx:(Math.random()-0.5)*15,vy:-15-Math.random()*20,
      life:0.8+Math.random()*0.4,maxLife:0.8+Math.random()*0.4,
      size:1+Math.random()*1.5
    });
  }
  for(var i=heroParticles.length-1;i>=0;i--){
    var p=heroParticles[i];
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
    if(p.life<=0)heroParticles.splice(i,1);
  }
}

function checkZoneProgression(){
  var zi=getZoneIndex(player.x);
  if(zi!==currentZoneIdx){currentZoneIdx=zi;saveData.currentZone=zi;Save.save(saveData);}
}

// ===== Drawing =====
function drawBackground(){
  var zi=currentZoneIdx;
  var z=ZONES[zi];
  var grad=ctx.createLinearGradient(0,0,0,VH);
  grad.addColorStop(0,z.bg1);
  grad.addColorStop(1,z.bg2);
  ctx.fillStyle=grad;
  ctx.fillRect(0,0,VW,VH);
  // نجوم
  ctx.fillStyle=z.accent;
  for(var i=0;i<60;i++){
    var sx=(i*73+Math.floor(camera.x*0.1))%VW;
    var sy=(i*41)%180;
    ctx.globalAlpha=0.2+Math.sin(gameTime*2+i)*0.2;
    ctx.fillRect(sx,sy,1.5,1.5);
  }
  ctx.globalAlpha=1;
}

function drawPlatforms(){
  var z=ZONES[currentZoneIdx];
  var vis=getVisiblePlatforms();
  for(var i=0;i<vis.length;i++){
    var p=vis[i];
    var px=Math.floor(p.x-camera.x);
    // ظل
    ctx.fillStyle='rgba(0,0,0,0.5)';
    ctx.fillRect(px+2,p.y+4,p.w,p.h);
    // الجسم
    var pg=ctx.createLinearGradient(0,p.y,0,p.y+p.h);
    pg.addColorStop(0,z.color);
    pg.addColorStop(0.3,'#1a1a2e');
    pg.addColorStop(1,'#000');
    ctx.fillStyle=pg;
    ctx.fillRect(px,p.y,p.w,p.h);
    // حافة
    ctx.fillStyle=z.accent;
    ctx.fillRect(px,p.y,p.w,1.5);
    ctx.fillStyle='rgba(255,255,255,0.15)';
    ctx.fillRect(px,p.y+2,p.w,1);
  }
}

function drawPlayer(){
  if(player.invincible>0&&Math.floor(player.invincible*20)%2===0)return;
  var px=Math.floor(player.x-camera.x);
  var py=Math.floor(player.y);
  // هالة
  ctx.globalAlpha=0.4;
  var halo=ctx.createRadialGradient(px+7,py+10,2,px+7,py+10,20);
  halo.addColorStop(0,player.hitFlash>0?'rgba(255,51,85,0.8)':'rgba(139,92,246,0.7)');
  halo.addColorStop(1,'rgba(124,58,237,0)');
  ctx.fillStyle=halo;
  ctx.beginPath();ctx.arc(px+7,py+10,20,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=1;
  // الجسم
  var bg=ctx.createLinearGradient(0,py,0,py+20);
  bg.addColorStop(0,'#4a4a6a');
  bg.addColorStop(1,'#1a1a2e');
  ctx.fillStyle=bg;
  ctx.fillRect(px+2,py+6,10,12);
  // الرأس
  ctx.fillStyle='#e8e0f5';
  ctx.beginPath();ctx.arc(px+7,py+4,6,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#1a0a2e';ctx.lineWidth=0.6;ctx.stroke();
  // عيون
  ctx.fillStyle=player.attacking?'#fbbf24':'#c4b5fd';
  ctx.shadowColor=player.attacking?'#fbbf24':'#a78bfa';
  ctx.shadowBlur=8;
  ctx.beginPath();ctx.arc(px+5,py+4,1.2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(px+9,py+4,1.2,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;
  // أرجل
  ctx.fillStyle='#0a0518';
  ctx.fillRect(px+3,py+18,3,4);
  ctx.fillRect(px+8,py+18,3,4);
  // سيف عند الهجوم
  if(player.attacking){
    var hb=attackBox();
    var hx=Math.floor(hb.x-camera.x);
    ctx.fillStyle='rgba(251,191,36,0.8)';
    ctx.shadowColor='#fbbf24';ctx.shadowBlur=15;
    if(player.facing===1){
      ctx.fillRect(px+12,py+8,16,4);
    } else {
      ctx.fillRect(px-16,py+8,16,4);
    }
    ctx.shadowBlur=0;
  }
}

function drawEnemies(){
  for(var i=0;i<enemies.length;i++){
    var e=enemies[i];
    var px=Math.floor(e.x-camera.x);
    var py=Math.floor(e.y);
    if(px<-40||px>VW+40)continue;
    ctx.globalAlpha=e.dead?e.opacity:1;
    // هالة
    ctx.globalAlpha*=0.3;
    var eh=ctx.createRadialGradient(px+7,py+7,2,px+7,py+7,15);
    eh.addColorStop(0,e.color);
    eh.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=eh;
    ctx.beginPath();ctx.arc(px+7,py+7,15,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=e.dead?e.opacity:1;
    // الجسم
    ctx.fillStyle=e.hitFlash>0?'#ffffff':e.color;
    if(e.isFlyer){
      ctx.beginPath();ctx.arc(px+7,py+7,7,0,Math.PI*2);ctx.fill();
      // أجنحة
      ctx.fillStyle='rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.moveTo(px+2,py+5);
      ctx.lineTo(px-6,py+2);
      ctx.lineTo(px+2,py+9);
      ctx.closePath();ctx.fill();
      ctx.beginPath();
      ctx.moveTo(px+12,py+5);
      ctx.lineTo(px+20,py+2);
      ctx.lineTo(px+12,py+9);
      ctx.closePath();ctx.fill();
    } else {
      ctx.fillRect(px,py,14,14);
    }
    // عيون
    ctx.fillStyle='#ff3355';
    ctx.shadowColor='#ff3355';ctx.shadowBlur=6;
    ctx.beginPath();ctx.arc(px+5,py+6,1.5,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(px+9,py+6,1.5,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
    ctx.globalAlpha=1;
    // HP bar
    if(e.hp<e.maxHp&&!e.dead){
      ctx.fillStyle='rgba(0,0,0,0.75)';
      ctx.fillRect(px,py-5,14,2);
      ctx.fillStyle='#ff3355';
      ctx.fillRect(px,py-5,14*(e.hp/e.maxHp),2);
    }
  }
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

function drawHeroParticles(){
  for(var i=0;i<heroParticles.length;i++){
    var p=heroParticles[i];
    ctx.globalAlpha=Math.max(0,p.life/p.maxLife)*0.7;
    ctx.fillStyle='#c4b5fd';
    ctx.shadowColor='#a78bfa';ctx.shadowBlur=6;
    var px=Math.floor(p.x-camera.x);
    ctx.beginPath();ctx.arc(px,p.y,p.size,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;ctx.shadowBlur=0;
}

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

// ===== Main Loop =====
var last=0;
var enemySpawnTimer=0;

function loop(ts){
  requestAnimationFrame(loop);
  var dt=Math.min((ts-last)/1000,0.05);
  last=ts;
  if(!gameRunning)return;
  if(hitPause>0){hitPause-=dt;return;}
  gameTime+=dt;

  if(state==='playing'){
    player.animTime+=dt;
    playerPhysics(dt);
    updateCombat(dt);
    updateEnemies(dt);
    updateHeroParticles(dt);
    updateCamera();
    checkZoneProgression();
    // Spawn enemies
    enemySpawnTimer-=dt;
    if(enemySpawnTimer<=0){
      spawnEnemy();
      enemySpawnTimer=1.5+Math.random()*1.5;
    }
  }

  // Particles
  for(var i=particles.length-1;i>=0;i--){
    var p=particles[i];
    p.x+=p.vx*dt;p.y+=p.vy*dt;
    p.vy+=300*dt;p.vx*=0.98;p.life-=dt;
    if(p.life<=0)particles.splice(i,1);
  }

  // Shake
  var sx=0,sy=0;
  if(shake.t>0){
    shake.t-=dt;
    sx=(Math.random()-0.5)*shake.i*2;
    sy=(Math.random()-0.5)*shake.i*2;
  }

  // Death
  if(player.hp<=0&&state!=='gameover'){
    state='gameover';
    try{if(window.Sound)Sound.gameOver();}catch(e){}
    spawnParticles(player.x+7,player.y+10,'#ff3355',35,3);
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

  // === RENDER ===
  ctx.clearRect(0,0,VW,VH);
  ctx.save();
  ctx.translate(Math.floor(sx),Math.floor(sy));
  drawBackground();
  drawPlatforms();
  drawEnemies();
  drawPlayer();
  drawHeroParticles();
  drawParticles();
  ctx.restore();
}

// ===== Game Bridge =====
window.GameBridge={
  startNewGame:function(){
    saveData=Save.load();
    saveData.gold=0;saveData.weaponLevel=1;saveData.armorLevel=1;
    saveData.totalKills=0;saveData.bossesDefeated=[false,false,false,false];
    saveData.playerX=60;saveData.currentZone=0;
    Save.save(saveData);
    enemies=[];particles=[];heroParticles=[];
    boss=null;
    initPlayer();
    camera.x=0;currentZoneIdx=0;state='playing';gameRunning=true;
    enemySpawnTimer=1;
  },
  continueGame:function(){
    saveData=Save.load();
    enemies=[];particles=[];heroParticles=[];
    boss=null;
    initPlayer();
    camera.x=Math.max(0,player.x-VW*0.4);
    currentZoneIdx=getZoneIndex(player.x);
    state='playing';gameRunning=true;
    enemySpawnTimer=1;
  },
  pause:function(){if(state==='playing')state='paused';},
  resume:function(){if(state==='paused')state='playing';},
  save:function(){
    if(player){
      saveData.playerX=player.x;
      saveData.playerY=player.y;
      Save.save(saveData);
    }
  },
  setVolume:function(v){}
};

// ===== Init =====
try{if(window.Sound)Sound.init();}catch(e){}
initPlayer();

requestAnimationFrame(function(t){last=t;requestAnimationFrame(loop);});

console.log('Shadow Blade ready');

})();
