(function(){
'use strict';
var VW=320,VH=180,GRAVITY=900,MOVE_SPEED=115,JUMP_FORCE=-340,FRICTION=0.82;
var ATK_DUR=0.22,ATK_CD=0.30,ATK_RANGE=26,PLAYER_DMG=50,ENEMY_DMG=15,INV_TIME=1.2;
var SAVE_KEY='shadow_blade_save_v3';
var canvas=document.getElementById('game');
var ctx=canvas.getContext('2d');
function resize(){var s=Math.min(window.innerWidth/VW,window.innerHeight/VH);
canvas.style.width=Math.floor(VW*s)+'px';canvas.style.height=Math.floor(VH*s)+'px';}
window.addEventListener('resize',resize);resize();

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
function bind(id,onD,onU){var b=document.getElementById(id);if(!b)return;
var p=function(e){e.preventDefault();e.stopPropagation();b.classList.add('pressed');Sound.init();Sound.resume();onD();};
var r=function(e){e.preventDefault();e.stopPropagation();b.classList.remove('pressed');if(onU)onU();};
b.addEventListener('touchstart',p,{passive:false});
b.addEventListener('touchend',r,{passive:false});
b.addEventListener('touchcancel',r,{passive:false});
b.addEventListener('mousedown',p);b.addEventListener('mouseup',r);
b.addEventListener('mouseleave',r);
b.addEventListener('contextmenu',function(e){e.preventDefault();});}
bind('btnLeft',function(){input.left=true;},function(){input.left=false;});
bind('btnRight',function(){input.right=true;},function(){input.right=false;});
bind('btnJump',function(){if(!input.jump)input.jp=true;input.jump=true;},function(){input.jump=false;});
bind('btnAttack',function(){if(!input.attack)input.ap=true;input.attack=true;},function(){input.attack=false;});

var LEVELS=[
{name:'CRYPT',theme:{bg1:'#1a0d2e',bg2:'#0a0515',bg3:'#050208',platTop:'#7c3aed',platBot:'#1a1030',edge:'#c4b5fd',star:'#c4b5fd',fog:'rgba(139,92,246,0.12)',particle:'rgba(196,181,253,0.6)'},
killTarget:12,enemies:[{kind:'bat',w:12,h:12,hp:60,speed:45,type:'flyer'},{kind:'slime',w:10,h:10,hp:80,speed:25,type:'crawler'},{kind:'skeleton',w:10,h:12,hp:100,speed:35,type:'walker'}],
boss:{kind:'skeletonKing',w:20,h:24,hp:600,dmg:22,name:'SKELETON KING'}},
{name:'FIRE',theme:{bg1:'#3a0a05',bg2:'#1a0402',bg3:'#0a0202',platTop:'#ff6b00',platBot:'#3e0a05',edge:'#ffb366',star:'#ff9f1c',fog:'rgba(255,107,0,0.12)',particle:'rgba(255,159,28,0.7)'},
killTarget:15,enemies:[{kind:'imp',w:12,h:12,hp:70,speed:55,type:'flyer'},{kind:'fireGolem',w:12,h:12,hp:140,speed:30,type:'crawler'},{kind:'imp',w:12,h:12,hp:70,speed:55,type:'flyer'}],
boss:{kind:'fireDemon',w:20,h:24,hp:900,dmg:26,name:'FIRE DEMON'}},
{name:'FROZEN',theme:{bg1:'#0a2540',bg2:'#041525',bg3:'#020810',platTop:'#00d4ff',platBot:'#0a2540',edge:'#7dd3fc',star:'#bae6fd',fog:'rgba(0,212,255,0.1)',particle:'rgba(186,230,253,0.7)'},
killTarget:18,enemies:[{kind:'iceWraith',w:10,h:11,hp:80,speed:50,type:'flyer'},{kind:'frostSpider',w:12,h:10,hp:100,speed:45,type:'crawler'},{kind:'iceGolem',w:12,h:12,hp:160,speed:28,type:'crawler'}],
boss:{kind:'iceQueen',w:16,h:24,hp:1200,dmg:30,name:'ICE QUEEN'}},
{name:'SHADOW',theme:{bg1:'#2a0a40',bg2:'#14051f',bg3:'#050208',platTop:'#e879f9',platBot:'#2a0a40',edge:'#f0abfc',star:'#e9d5ff',fog:'rgba(232,121,249,0.12)',particle:'rgba(232,121,249,0.7)'},
killTarget:22,enemies:[{kind:'shadowBeast',w:12,h:12,hp:110,speed:60,type:'flyer'},{kind:'voidCrawler',w:12,h:10,hp:130,speed:40,type:'crawler'},{kind:'nightmare',w:12,h:12,hp:180,speed:32,type:'crawler'}],
boss:{kind:'shadowLord',w:18,h:24,hp:1600,dmg:34,name:'SHADOW LORD'}}];

var state='playing',currentLevel=0,level=null,world=null;
var player=null,enemies=[],particles=[],coins=[],enemyProjectiles=[];
var key=null,portal=null,boss=null;
var camera={x:0},shake={t:0,i:0},hitPause=0;
var spawnTimer=0,kills=0,gameTime=0,dtGlobal=0.016;
var deathStreak=0;
var MAX_STREAK=3;
var heroParticles=[];
var bossDeathStreak=0;

function saveGame(){
try{
var collected=0;
for(var i=0;i<coins.length;i++)if(coins[i].collected)collected++;
var data={level:currentLevel,kills:kills,coins:collected,deaths:deathStreak,
bossDeaths:bossDeathStreak,state:state,bossHP:boss?boss.hp:null,
playerHP:player.hp,timestamp:Date.now()};
localStorage.setItem(SAVE_KEY,JSON.stringify(data));
}catch(e){}}
function loadGame(){try{var r=localStorage.getItem(SAVE_KEY);if(!r)return null;return JSON.parse(r);}catch(e){return null;}}
function clearSave(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}}

function buildWorld(){return{width:1100,platforms:[
{x:0,y:150,w:120,h:30},{x:70,y:120,w:40,h:5},{x:130,y:130,w:40,h:5},
{x:190,y:140,w:40,h:5},{x:250,y:120,w:40,h:5},{x:310,y:105,w:50,h:5},
{x:380,y:130,w:60,h:5},{x:460,y:110,w:40,h:5},{x:520,y:90,w:40,h:5},
{x:580,y:110,w:40,h:5},{x:640,y:130,w:60,h:5},{x:720,y:110,w:50,h:5},
{x:790,y:90,w:50,h:5},{x:860,y:120,w:40,h:5},{x:920,y:150,w:180,h:30}]};}

function initLevel(idx,keepState){
level=LEVELS[idx];world=buildWorld();
player={x:30,y:100,vx:0,vy:0,w:12,h:20,onGround:false,facing:1,animTime:0,
hp:100,maxHp:100,attacking:false,attackTimer:0,attackCooldown:0,invincible:0,hitFlash:0};
enemies=[];particles=[];coins=[];enemyProjectiles=[];heroParticles=[];
key=null;portal=null;boss=null;
if(!keepState){kills=0;deathStreak=0;bossDeathStreak=0;}
camera.x=0;spawnTimer=1.2;state='playing';hitPause=0;
var pos=[[80,105],[140,115],[200,125],[260,105],[320,90],[390,115],[470,95],
[530,75],[590,95],[650,115],[730,95],[800,75],[870,105],[220,90],
[440,90],[700,90],[880,80],[180,110],[400,105],[640,110]];
for(var i=0;i<pos.length;i++){coins.push({x:pos[i][0],y:pos[i][1],collected:false,bob:Math.random()*Math.PI*2});}}

function restoreGame(){
var s=loadGame();if(!s)return false;
currentLevel=Math.min(s.level,LEVELS.length-1);
initLevel(currentLevel,true);
kills=s.kills||0;deathStreak=s.deaths||0;bossDeathStreak=s.bossDeaths||0;
if(s.coins){var r=0;for(var i=0;i<coins.length&&r<s.coins;i++){coins[i].collected=true;r++;}}
player.hp=Math.max(50,s.playerHP||100);
if(s.state==='boss'){state='boss';setTimeout(function(){spawnBoss();},100);}
return true;}

function rect(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function rand(a,b){return a+Math.random()*(b-a);}
function spawnParticles(x,y,color,n,sz){sz=sz||2;
for(var i=0;i<n;i++){var ang=Math.random()*Math.PI*2,sp=40+Math.random()*120;
particles.push({x:x,y:y,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp-50,
life:0.5+Math.random()*0.5,maxLife:0.5+Math.random()*0.5,color:color,
size:1+Math.random()*sz});}}
function shakeNow(i,d){shake.i=i;shake.t=d;}

function spawnEnemy(){
if(state!=='playing'||enemies.length>=10)return;
var t=level.enemies[Math.floor(Math.random()*level.enemies.length)];
var fromLeft=Math.random()<0.5;
var sx=camera.x+(fromLeft?-20:VW+5);
var baseY=t.type==='flyer'?rand(40,100):140;
enemies.push({cfg:t,kind:t.kind,type:t.type,x:sx,y:baseY,
vx:(fromLeft?1:-1)*t.speed,vy:0,w:t.w,h:t.h,hp:t.hp,maxHp:t.hp,
direction:fromLeft?1:-1,hitFlash:0,hitCooldown:0,dead:false,
baseY:baseY,bobPhase:Math.random()*Math.PI*2,
knockback:0,deathTimer:0,opacity:1,attractPhase:Math.random()*6,
skillTimer:2+Math.random()*2,skillActive:0,skillVx:0,skillVy:0,
scale:1});}

function spawnGroup(){var n=Math.random();
if(n<0.1)return 4;if(n<0.35)return 2;return 1;}

function spawnBoss(){var b=level.boss;
boss={cfg:b,kind:b.kind,x:camera.x+VW+30,y:120,vx:-40,vy:0,w:b.w,h:b.h,
hp:b.hp,maxHp:b.hp,state:'enter',stateTimer:1.5,hitFlash:0,hitCooldown:0,
direction:-1,baseY:120,bobPhase:0,attackTimer:2,
skillTimer:4+Math.random()*2,skillActive:0,skillPhase:0};
Sound.bossRoar();shakeNow(10,0.7);saveGame();}

function playerPhysics(dt){var move=0;
if(input.left)move-=1;if(input.right)move+=1;
if(move!==0){player.vx+=move*MOVE_SPEED*8*dt;player.facing=move;}
player.vx*=Math.pow(FRICTION,dt*60);
if(input.jp&&player.onGround){player.vy=JUMP_FORCE;player.onGround=false;
Sound.jump();spawnParticles(player.x+6,player.y+19,'#a78bfa',6,1.5);}
input.jp=false;player.vy+=GRAVITY*dt;if(player.vy>500)player.vy=500;
player.x+=player.vx*dt;player.y+=player.vy*dt;player.onGround=false;
for(var i=0;i<world.platforms.length;i++){var p=world.platforms[i];
if(rect(player,p)){
if(player.vy>0&&player.y+player.h-player.vy*dt<=p.y+4){player.y=p.y-player.h;player.vy=0;player.onGround=true;
if(Math.abs(player.vy)>300){spawnParticles(player.x+6,player.y+player.h,'#c4b5fd',4,1);}}
else if(player.vy<0&&player.y-player.vy*dt>=p.y+p.h-4){player.y=p.y+p.h;player.vy=0;}
else{if(player.vx>0)player.x=p.x-player.w;else if(player.vx<0)player.x=p.x+p.w;player.vx=0;}}}
if(player.x<camera.x){player.x=camera.x;player.vx=0;}
if(player.x+player.w>world.width){player.x=world.width-player.w;player.vx=0;}
if(player.y>VH+30){player.hp-=25;Sound.hurt();
player.x=30;player.y=100;player.vx=0;player.vy=0;
player.invincible=1.5;shakeNow(8,0.3);}}

function attackBox(){if(player.facing===1)return{x:player.x+player.w,y:player.y+3,w:ATK_RANGE,h:13};
return{x:player.x-ATK_RANGE,y:player.y+3,w:ATK_RANGE,h:13};}

function updateCombat(dt){
if(player.attackCooldown>0)player.attackCooldown-=dt;
if(player.invincible>0)player.invincible-=dt;
if(player.hitFlash>0)player.hitFlash-=dt;
if(input.ap&&player.attackCooldown<=0&&!player.attacking){
player.attacking=true;player.attackTimer=ATK_DUR;player.attackCooldown=ATK_CD;
Sound.slash();var hb=attackBox();
spawnParticles(hb.x+hb.w/2,hb.y+hb.h/2,'#fbbf24',6,1.5);}
input.ap=false;
if(player.attacking){player.attackTimer-=dt;
if(player.attackTimer>ATK_DUR*0.4){var hb=attackBox();
for(var i=0;i<enemies.length;i++){var e=enemies[i];
if(e.dead||e.hitCooldown>0)continue;
if(rect(hb,{x:e.x,y:e.y,w:e.w,h:e.h})){
e.hp-=PLAYER_DMG;e.hitFlash=0.15;e.hitCooldown=0.28;
e.knockback=0.3;e.knockVx=player.facing*280;e.knockVy=-100;
Sound.hit();hitPause=0.05;
spawnParticles(e.x+e.w/2,e.y+e.h/2,'#ff3355',10,2);shakeNow(4,0.12);
if(e.hp<=0){e.dead=true;kills++;Sound.kill();shakeNow(6,0.22);
spawnParticles(e.x+e.w/2,e.y+e.h/2,'#e879f9',25,2.5);
spawnParticles(e.x+e.w/2,e.y+e.h/2,'#ff3355',15,2);
spawnParticles(e.x+e.w/2,e.y+e.h/2,'#fbbf24',10,2);
saveGame();}}}
if(boss&&!boss.dead&&boss.hitCooldown<=0&&boss.state!=='enter'){
if(rect(hb,{x:boss.x,y:boss.y,w:boss.w,h:boss.h})){
boss.hp-=PLAYER_DMG;boss.hitFlash=0.12;boss.hitCooldown=0.15;
Sound.bossHit();hitPause=0.08;
spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#ff3355',10,2);
spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#fbbf24',8,2);shakeNow(5,0.14);
if(boss.hp<=0){boss.dead=true;Sound.levelComplete();shakeNow(16,0.9);
bossDeathStreak=0;
spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#e879f9',50,3);
spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#ff3355',40,3);
spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#fbbf24',30,3);
setTimeout(function(){nextLevel();},2600);}}}}
if(player.attackTimer<=0)player.attacking=false;}}

function enemySkill(e,dt){
if(e.dead)return;
e.skillTimer-=dt;
if(e.skillActive>0){e.skillActive-=dt;
if(e.kind==='bat'){e.x+=e.skillVx*dt;e.y+=e.skillVy*dt;}
else if(e.kind==='imp'){e.x+=e.skillVx*dt;e.y+=e.skillVy*dt;}
else if(e.kind==='fireGolem'){e.x+=e.skillVx*dt;}
else if(e.kind==='shadowBeast'){e.x+=e.skillVx*dt;}
else if(e.kind==='iceGolem'){}
else if(e.kind==='nightmare'){
if(Math.random()<0.05){
enemies.push({cfg:{kind:'bat',w:10,h:10,hp:30,speed:55,type:'flyer'},
kind:'bat',type:'flyer',x:e.x,y:e.y,vx:(Math.random()<0.5?-1:1)*55,vy:0,
w:10,h:10,hp:30,maxHp:30,direction:1,hitFlash:0,hitCooldown:0,dead:false,
baseY:e.y,bobPhase:Math.random()*6,knockback:0,deathTimer:0,opacity:1,
attractPhase:Math.random()*6,skillTimer:5,skillActive:0,skillVx:0,skillVy:0,scale:1});}}
}
if(e.skillActive>0)return;
if(e.skillTimer>0)return;
if(player.invincible>0)return;
var dx=player.x-e.x,dy=player.y-e.y;
var dist=Math.sqrt(dx*dx+dy*dy);
if(dist>200)return;
if(e.kind==='bat'){
e.skillActive=0.8;
e.skillVx=dx/dist*250;e.skillVy=dy/dist*250;
Sound.enemySkill();
} else if(e.kind==='slime'){
e.vy=-320;
e.skillActive=0.5;
spawnParticles(e.x+5,e.y+10,'#4ade80',6,1);
} else if(e.kind==='skeleton'){
enemyProjectiles.push({x:e.x+e.w/2,y:e.y+e.h/2,
vx:dx/dist*180,vy:dy/dist*180,life:3,dmg:10,color:'#e2e8f0',size:3});
Sound.enemySkill();
} else if(e.kind==='imp'){
for(var i=0;i<3;i++){
var a=Math.atan2(dy,dx)+(i-1)*0.3;
enemyProjectiles.push({x:e.x+e.w/2,y:e.y+e.h/2,
vx:Math.cos(a)*160,vy:Math.sin(a)*160,life:3,dmg:10,color:'#ff9f1c',size:3});}
Sound.enemySkill();
} else if(e.kind==='fireGolem'){
e.skillActive=0.5;
e.skillVx=(player.x<e.x?-1:1)*250;
Sound.enemySkill();
} else if(e.kind==='iceWraith'){
e.x=player.x+(Math.random()<0.5?-30:30);
e.y=player.y-10+rand(-20,20);
spawnParticles(e.x,e.y,'#00d4ff',10,2);
Sound.enemySkill();
} else if(e.kind==='frostSpider'){
for(var j=0;j<5;j++){
var a2=Math.atan2(dy,dx)+(j-2)*0.25;
enemyProjectiles.push({x:e.x+e.w/2,y:e.y+e.h/2,
vx:Math.cos(a2)*180,vy:Math.sin(a2)*180,life:3,dmg:8,color:'#7dd3fc',size:2});}
Sound.enemySkill();
} else if(e.kind==='iceGolem'){
spawnParticles(e.x+e.w/2,e.y+e.h,'#7dd3fc',15,2);
shakeNow(5,0.2);
if(player.onGround&&Math.abs(player.x-e.x)<80&&player.invincible<=0){
damagePlayer(15,e.x);}
Sound.enemySkill();
} else if(e.kind==='shadowBeast'){
e.skillActive=0.6;
e.skillVx=dx/dist*300;e.skillVy=dy/dist*300;
Sound.enemySkill();
} else if(e.kind==='voidCrawler'){
e.skillActive=0.5;
e.skillVx=dx/dist*200;
Sound.enemySkill();
} else if(e.kind==='nightmare'){
e.skillActive=1.0;
Sound.enemySkill();
}
e.skillTimer=2.5+Math.random()*2;
}

function updateEnemies(dt){
for(var i=enemies.length-1;i>=0;i--){var e=enemies[i];
if(e.hitFlash>0)e.hitFlash-=dt;
if(e.hitCooldown>0)e.hitCooldown-=dt;
if(e.dead){e.deathTimer+=dt;e.opacity=Math.max(0,1-e.deathTimer/0.5);
e.y-=30*dt;e.x+=e.knockVx*0.3*dt;
if(e.deathTimer>0.5)enemies.splice(i,1);continue;}
if(e.knockback>0){e.knockback-=dt;
e.x+=e.knockVx*dt;e.y+=e.knockVy*dt;
e.knockVy+=GRAVITY*dt;e.knockVx*=0.9;
if(e.y>140){e.y=140;e.knockVy=0;}
for(var k=0;k<world.platforms.length;k++){var pp=world.platforms[k];
if(rect({x:e.x,y:e.y,w:e.w,h:e.h},pp)){if(e.knockVy>0){e.y=pp.y-e.h;e.knockVy=0;}}}
if(e.knockback<=0){e.knockVx=0;e.knockVy=0;}
continue;}
enemySkill(e,dt);
if(e.skillActive>0){
if(e.kind!=='nightmare')e.skillActive=Math.max(0,e.skillActive-dt);
} else {
var dx=player.x-e.x,dy=player.y-e.y;
var dist=Math.sqrt(dx*dx+dy*dy);
e.attractPhase+=dt*1.5;
var aStr=Math.sin(e.attractPhase)*0.5+0.5;
if(dist<180&&dist>0){
var pull=(e.type==='flyer'?35:25)*aStr;
e.vx+=dx/dist*pull*dt*3.5;
e.vy+=dy/dist*pull*dt*2.5;}
}
if(e.type==='crawler'||e.type==='walker'){
if(e.skillActive<=0||e.kind==='fireGolem'||e.kind==='voidCrawler'){
var maxSp=e.cfg.speed;
var spd=Math.sqrt(e.vx*e.vx+e.vy*e.vy);
if(spd>maxSp*2.5){e.vx=e.vx/spd*maxSp*2.5;e.vy=e.vy/spd*maxSp*2.5;}
e.x+=e.vx*dt;e.vy+=GRAVITY*dt;e.y+=e.vy*dt;
for(var j=0;j<world.platforms.length;j++){var p=world.platforms[j];
if(rect({x:e.x,y:e.y,w:e.w,h:e.h},p)){if(e.vy>0){e.y=p.y-e.h;e.vy=0;}}}}
if(e.y>VH+80){enemies.splice(i,1);continue;}
if(e.x<camera.x-300)e.x=camera.x-300;
if(e.x>camera.x+VW+300)e.x=camera.x+VW+300;}
else if(e.type==='flyer'){
if(e.skillActive<=0){
var fSp=e.cfg.speed;
var fspd=Math.sqrt(e.vx*e.vx+e.vy*e.vy);
if(fspd>fSp*2.5){e.vx=e.vx/fspd*fSp*2.5;e.vy=e.vy/fspd*fSp*2.5;}
e.x+=e.vx*dt;e.y+=e.vy*dt;
e.bobPhase+=dt*3;
if(e.kind!=='bat'&&e.kind!=='imp'&&e.kind!=='shadowBeast'){
e.y=e.baseY+Math.sin(e.bobPhase)*10;}}
else{if(e.kind!=='bat'&&e.kind!=='imp'&&e.kind!=='shadowBeast'){
e.x+=e.vx*dt;}}
if(e.x<camera.x-300)e.x=camera.x-300;
if(e.x>camera.x+VW+300)e.x=camera.x+VW+300;
if(e.y<20)e.vy=Math.abs(e.vy);
if(e.y>VH-20)e.vy=-Math.abs(e.vy);}
if(player.invincible<=0&&!player.attacking){
if(rect({x:player.x,y:player.y,w:player.w,h:player.h},{x:e.x,y:e.y,w:e.w,h:e.h})){
damagePlayer(ENEMY_DMG,e.x);}}}}

function updateEnemyProjectiles(dt){
for(var i=enemyProjectiles.length-1;i>=0;i--){
var p=enemyProjectiles[i];
p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
if(player.invincible<=0&&Math.abs(p.x-(player.x+player.w/2))<8&&Math.abs(p.y-(player.y+player.h/2))<10){
damagePlayer(p.dmg,p.x);enemyProjectiles.splice(i,1);continue;}
if(p.life<=0||p.x<camera.x-50||p.x>camera.x+VW+50)enemyProjectiles.splice(i,1);}}

function damagePlayer(dmg,fromX){player.hp-=dmg;player.invincible=INV_TIME;
player.hitFlash=0.3;Sound.hurt();shakeNow(7,0.25);hitPause=0.08;
spawnParticles(player.x+player.w/2,player.y+player.h/2,'#ff3355',12,2);
player.vx=(player.x<fromX?-1:1)*130;player.vy=-120;}

function updateBoss(dt){if(!boss||boss.dead)return;
if(boss.hitFlash>0)boss.hitFlash-=dt;if(boss.hitCooldown>0)boss.hitCooldown-=dt;
if(boss.state==='enter'){boss.stateTimer-=dt;boss.x+=boss.vx*dt;
var targetX=camera.x+VW-60;
if(boss.x<targetX){boss.x=targetX;boss.vx=0;boss.state='idle';boss.attackTimer=1.5;}return;}
boss.attackTimer-=dt;
boss.skillTimer-=dt;
if(boss.skillActive>0){boss.skillActive-=dt;
boss.skillPhase+=dt;
if(boss.kind==='skeletonKing'){
if(Math.floor(boss.skillPhase/0.3)>Math.floor((boss.skillPhase-dt)/0.3)){
if(Math.random()<0.6){
enemies.push({cfg:level.enemies[2],kind:'skeleton',type:'walker',
x:boss.x+rand(-40,40),y:boss.y,vx:rand(-60,60),vy:-100,
w:10,h:12,hp:60,maxHp:60,direction:1,hitFlash:0,hitCooldown:0,dead:false,
baseY:boss.y,bobPhase:0,knockback:0,deathTimer:0,opacity:1,
attractPhase:Math.random()*6,skillTimer:3,skillActive:0,skillVx:0,skillVy:0,scale:1});}}}
else if(boss.kind==='fireDemon'){
if(Math.floor(boss.skillPhase/0.15)>Math.floor((boss.skillPhase-dt)/0.15)){
for(var i=0;i<8;i++){
var a=Math.PI*2/8*i+boss.skillPhase*3;
enemyProjectiles.push({x:boss.x+boss.w/2,y:boss.y+boss.h/2,
vx:Math.cos(a)*180,vy:Math.sin(a)*180,life:3,dmg:15,color:'#ff6b00',size:4});}}}
else if(boss.kind==='iceQueen'){
if(Math.floor(boss.skillPhase/0.25)>Math.floor((boss.skillPhase-dt)/0.25)){
for(var j=0;j<3;j++){
var tgt=player.x+rand(-60,60);
enemyProjectiles.push({x:tgt,y:20,vx:0,vy:250,life:3,dmg:18,color:'#7dd3fc',size:4});}}}
else if(boss.kind==='shadowLord'){
if(Math.floor(boss.skillPhase/0.2)>Math.floor((boss.skillPhase-dt)/0.2)){
for(var k=0;k<5;k++){
var a2=Math.random()*Math.PI*2;
enemyProjectiles.push({x:boss.x+boss.w/2,y:boss.y+boss.h/2,
vx:Math.cos(a2)*150,vy:Math.sin(a2)*150,life:3,dmg:12,color:'#e879f9',size:3});}}}
if(boss.skillActive<=0){boss.state='idle';boss.attackTimer=1.5;}
return;}
if(boss.state==='idle'){boss.bobPhase+=dt*4;
boss.y=boss.baseY+Math.sin(boss.bobPhase)*3;
if(boss.skillTimer<=0){
boss.skillActive=2.0;boss.skillPhase=0;
Sound.bossRoar();shakeNow(8,0.4);
boss.skillTimer=6+Math.random()*3;return;}
if(boss.attackTimer<=0){var r=Math.random();
if(r<0.4){boss.state='charge';boss.stateTimer=1.4;
boss.vx=(player.x<boss.x?-1:1)*90;boss.vy=-180;Sound.bossRoar();}
else if(r<0.7){boss.state='shoot';boss.stateTimer=1.2;boss.shootTimer=0;}
else{boss.state='jump';boss.stateTimer=1.0;boss.vy=-280;}
boss.attackTimer=1.8+Math.random()*1.2;}}
else if(boss.state==='charge'){boss.stateTimer-=dt;
boss.x+=boss.vx*dt;boss.vy+=GRAVITY*dt;boss.y+=boss.vy*dt;
if(boss.y+boss.h>150){boss.y=150-boss.h;boss.vy=0;}
if(boss.x<camera.x+20)boss.x=camera.x+20;
if(boss.stateTimer<=0){boss.state='idle';boss.vx=0;}
if(player.invincible<=0&&rect(player,{x:boss.x,y:boss.y,w:boss.w,h:boss.h})){
damagePlayer(boss.cfg.dmg,boss.x);}}
else if(boss.state==='shoot'){boss.stateTimer-=dt;boss.shootTimer-=dt;
if(boss.shootTimer<=0){boss.shootTimer=0.35;
var dx=(player.x+player.w/2)-(boss.x+boss.w/2);
var dy=(player.y+player.h/2)-(boss.y+boss.h/2);
var len=Math.sqrt(dx*dx+dy*dy);if(len<1)len=1;
enemyProjectiles.push({x:boss.x+boss.w/2,y:boss.y+boss.h/2,
vx:dx/len*160,vy:dy/len*160,life:3,dmg:14,color:'#ff3355',size:4});}
if(boss.stateTimer<=0)boss.state='idle';}
else if(boss.state==='jump'){boss.stateTimer-=dt;boss.vy+=GRAVITY*dt;
boss.y+=boss.vy*dt;
if(boss.y+boss.h>150){boss.y=150-boss.h;boss.vy=0;shakeNow(9,0.35);
spawnParticles(boss.x+boss.w/2,150,'#fbbf24',20,2);
if(player.onGround&&Math.abs(player.x-boss.x)<80&&player.invincible<=0){
damagePlayer(boss.cfg.dmg,boss.x);}
boss.state='idle';}}}

function updateCoins(){for(var i=0;i<coins.length;i++){var c=coins[i];
if(c.collected)continue;c.bob+=0.08;
if(rect(player,{x:c.x-4,y:c.y-4,w:8,h:8})){c.collected=true;Sound.coin();
spawnParticles(c.x,c.y,'#fbbf24',8,1.5);saveGame();}}}

function updateKeyAndPortal(){
if(!key&&!portal&&state==='playing'&&kills>=level.killTarget){
key={x:player.x,y:player.y-10,vy:-120,bob:0,taken:false};
Sound.key();shakeNow(4,0.3);spawnParticles(key.x,key.y,'#fbbf24',20,2);}
if(key&&!key.taken){key.bob+=0.12;key.vy+=GRAVITY*dtGlobal;key.y+=key.vy*dtGlobal;
for(var i=0;i<world.platforms.length;i++){var p=world.platforms[i];
if(key.x>p.x&&key.x<p.x+p.w&&key.y>p.y-12&&key.y<p.y+p.h){
if(key.vy>0){key.y=p.y-12;key.vy=0;}}}
if(key.y>VH+30){key.y=140;key.vy=0;}
if(rect(player,{x:key.x-5,y:key.y-7,w:10,h:14})){
key.taken=true;Sound.portal();shakeNow(5,0.3);
spawnParticles(key.x,key.y,'#fbbf24',25,2);
portal={x:world.width-80,y:120,active:true};saveGame();}}
if(portal&&portal.active){
if(rect(player,{x:portal.x-6,y:portal.y-14,w:16,h:28})){
portal.active=false;state='boss';spawnBoss();}}}

function nextLevel(){currentLevel++;
if(currentLevel>=LEVELS.length){state='won';clearSave();return;}
deathStreak=0;bossDeathStreak=0;
initLevel(currentLevel,false);
saveGame();}

function updateCamera(){var targetX=player.x-VW*0.4;
if(targetX<0)targetX=0;if(targetX>world.width-VW)targetX=world.width-VW;
camera.x+=(targetX-camera.x)*0.08;
if(camera.x<0)camera.x=0;if(camera.x>world.width-VW)camera.x=world.width-VW;}

function drawBackground(){
var t=level.theme;var idx=currentLevel;var camX=camera.x;
if(idx===0){
var sky=lg(ctx,0,0,0,VH,[[0,'#1a0d2e'],[0.4,'#0f0720'],[0.7,'#0a0515'],[1,'#050208']]);
ctx.fillStyle=sky;ctx.fillRect(0,0,VW,VH);
for(var i=0;i<80;i++){
var sx=(i*73+Math.floor(camX*0.05))%VW;var sy=(i*41)%130;
var tw=Math.sin(gameTime*2+i)*0.5+0.5;
ctx.globalAlpha=(0.15+((i*17)%10)/50)*tw;
var sz=((i*13)%3===0)?1.5:1;
ctx.fillStyle=t.star;ctx.fillRect(sx,sy,sz,sz);}
ctx.globalAlpha=1;
for(var c=0;c<4;c++){
var cx=(c*180+Math.floor(camX*0.1))%VW;var cy=30+c*15;
ctx.fillStyle='rgba(45,27,94,'+(0.5+c*0.1)+')';
ctx.beginPath();ctx.moveTo(cx-40,cy+30);
ctx.bezierCurveTo(cx-30,cy-10,cx-15,cy-25,cx-5,cy-5);
ctx.bezierCurveTo(cx,cy-15,cx+5,cy-20,cx+10,cy-8);
ctx.bezierCurveTo(cx+20,cy-25,cx+35,cy-10,cx+45,cy+30);
ctx.closePath();ctx.fill();}
ctx.fillStyle='rgba(26,15,48,0.7)';
for(var p=0;p<6;p++){
var px=(p*140+Math.floor(camX*0.3))%VW-30;
ctx.beginPath();ctx.moveTo(px,VH);
ctx.lineTo(px-8,VH-70);ctx.lineTo(px-3,VH-75);
ctx.lineTo(px+1,VH-60);ctx.lineTo(px+5,VH-73);
ctx.lineTo(px+9,VH-68);ctx.lineTo(px+13,VH);
ctx.closePath();ctx.fill();}
var stal=lg(ctx,0,0,0,60,[[0,'rgba(45,27,94,0.85)'],[1,'rgba(26,15,48,0)']]);
ctx.fillStyle=stal;
for(var s=0;s<10;s++){
var sx2=(s*37+Math.floor(camX*0.6))%VW;var sLen=15+((s*23)%35);
ctx.beginPath();ctx.moveTo(sx2-6,0);
ctx.bezierCurveTo(sx2-4,sLen*0.5,sx2-2,sLen*0.8,sx2,sLen);
ctx.bezierCurveTo(sx2+2,sLen*0.8,sx2+4,sLen*0.5,sx2+6,0);
ctx.closePath();ctx.fill();}
}
else if(idx===1){
var sky2=lg(ctx,0,0,0,VH,[[0,'#3a0a05'],[0.4,'#1a0402'],[0.7,'#0a0202'],[1,'#000000']]);
ctx.fillStyle=sky2;ctx.fillRect(0,0,VW,VH);
var moonX=VW*0.7;var moonY=60;
var mg=rg(ctx,moonX,moonY,60,[[0,'rgba(255,159,28,0.6)'],[0.4,'rgba(220,38,38,0.3)'],[1,'rgba(220,38,38,0)']]);
ctx.fillStyle=mg;ctx.beginPath();ctx.arc(moonX,moonY,60,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.arc(moonX,moonY,18,0,Math.PI*2);ctx.fill();
ctx.fillStyle='rgba(220,38,38,0.7)';
ctx.beginPath();ctx.arc(moonX-5,moonY-5,4,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(moonX+7,moonY+3,3,0,Math.PI*2);ctx.fill();
for(var i2=0;i2<30;i2++){
var sx3=(i2*79+Math.floor(camX*0.08))%VW;var sy2=(i2*47)%120;
ctx.globalAlpha=0.3+Math.sin(gameTime*3+i2)*0.2;
ctx.fillStyle='#dc2626';ctx.fillRect(sx3,sy2,1.5,1.5);}
ctx.globalAlpha=1;
ctx.fillStyle='#450a0a';ctx.beginPath();ctx.moveTo(0,VH);
for(var mx=0;mx<=VW;mx+=20){
var my=100+Math.sin((mx+camX*0.2)*0.04)*18+Math.cos((mx+camX*0.2)*0.07)*8;
ctx.lineTo(mx,my);}
ctx.lineTo(VW,VH);ctx.fill();
ctx.strokeStyle='#fbbf24';ctx.lineWidth=1.5;
ctx.shadowColor='#fbbf24';ctx.shadowBlur=12;
ctx.beginPath();ctx.moveTo(0,VH);
for(var vx=0;vx<=VW;vx+=20){
var vy=100+Math.sin((vx+camX*0.2)*0.04)*18+Math.cos((vx+camX*0.2)*0.07)*8;
ctx.lineTo(vx,vy);}
ctx.stroke();ctx.shadowBlur=0;
var lavaGlow=lg(ctx,0,VH-50,0,VH,[[0,'rgba(251,191,36,0)'],[0.5,'rgba(255,107,0,0.3)'],[1,'rgba(220,38,38,0.6)']]);
ctx.fillStyle=lavaGlow;ctx.fillRect(0,VH-50,VW,50);
for(var lb=0;lb<15;lb++){
var lx=(lb*53+Math.floor(gameTime*20))%VW;
var ly=VH-10-Math.sin(gameTime*3+lb)*15;
ctx.globalAlpha=0.6;ctx.fillStyle='#fbbf24';
ctx.beginPath();ctx.arc(lx,ly,1.5,0,Math.PI*2);ctx.fill();}
ctx.globalAlpha=1;
}
else if(idx===2){
var sky3=lg(ctx,0,0,0,VH,[[0,'#0a2540'],[0.4,'#041525'],[0.7,'#020810'],[1,'#000000']]);
ctx.fillStyle=sky3;ctx.fillRect(0,0,VW,VH);
for(var a=0;a<3;a++){
var ax=(a*140+Math.floor(camX*0.1))%VW;
ctx.globalAlpha=0.15;
var ag=lg(ctx,ax,0,ax+60,80,[[0,'rgba(125,211,252,0)'],[0.5,'rgba(0,212,255,0.5)'],[1,'rgba(125,211,252,0)']]);
ctx.fillStyle=ag;ctx.beginPath();ctx.moveTo(ax-20,0);
ctx.bezierCurveTo(ax-10,30,ax+10,60,ax+20,90);
ctx.bezierCurveTo(ax+40,60,ax+60,30,ax+80,0);
ctx.closePath();ctx.fill();}
ctx.globalAlpha=1;
for(var s2=0;s2<50;s2++){
var sx4=(s2*67+Math.floor(camX*0.05))%VW;var sy3=(s2*37)%VH;
ctx.globalAlpha=0.4+Math.sin(gameTime*2+s2)*0.3;
ctx.fillStyle='#bae6fd';ctx.fillRect(sx4,sy3,1,1);}
ctx.globalAlpha=1;
ctx.fillStyle='#0c4a6e';ctx.beginPath();ctx.moveTo(0,VH);
for(var mx2=0;mx2<=VW;mx2+=20){
var my2=95+Math.sin((mx2+camX*0.15)*0.03)*20+Math.cos((mx2+camX*0.15)*0.06)*10;
ctx.lineTo(mx2,my2);}
ctx.lineTo(VW,VH);ctx.fill();
ctx.strokeStyle='rgba(186,230,253,0.4)';ctx.lineWidth=0.8;
ctx.beginPath();ctx.moveTo(0,VH);
for(var vx2=0;vx2<=VW;vx2+=20){
var vy2=95+Math.sin((vx2+camX*0.15)*0.03)*20+Math.cos((vx2+camX*0.15)*0.06)*10;
ctx.lineTo(vx2,vy2);}
ctx.stroke();
for(var sn=0;sn<30;sn++){
var snx=(sn*43+Math.floor(gameTime*15))%VW;
var sny=((sn*29)+Math.floor(gameTime*25))%(VH);
ctx.globalAlpha=0.6;ctx.fillStyle='#e0f2fe';
ctx.beginPath();ctx.arc(snx,sny,1,0,Math.PI*2);ctx.fill();}
ctx.globalAlpha=1;
}
else{
var sky4=lg(ctx,0,0,0,VH,[[0,'#2a0a40'],[0.4,'#14051f'],[0.7,'#050208'],[1,'#000000']]);
ctx.fillStyle=sky4;ctx.fillRect(0,0,VW,VH);
for(var o=0;o<5;o++){
var ox=(o*90+Math.floor(camX*0.08))%VW;var oy=30+o*20;
var og=rg(ctx,ox,oy,50,[[0,'rgba(232,121,249,0.15)'],[1,'rgba(232,121,249,0)']]);
ctx.fillStyle=og;ctx.beginPath();ctx.arc(ox,oy,50,0,Math.PI*2);ctx.fill();}
for(var e=0;e<25;e++){
var ex=(e*47+Math.floor(camX*0.06))%VW;var ey=(e*29)%130;
var pulse=0.3+Math.sin(gameTime*4+e*0.5)*0.4;
ctx.globalAlpha=pulse;
ctx.fillStyle=e%3===0?'#e879f9':'#a78bfa';
ctx.shadowColor='#e879f9';ctx.shadowBlur=4;
ctx.beginPath();ctx.arc(ex,ey,1.3,0,Math.PI*2);ctx.fill();}
ctx.globalAlpha=1;ctx.shadowBlur=0;
ctx.fillStyle='rgba(76,29,149,0.6)';
for(var pi=0;pi<5;pi++){
var pix=(pi*100+Math.floor(camX*0.25))%VW-30;
ctx.beginPath();ctx.moveTo(pix,VH);
ctx.bezierCurveTo(pix-10,VH-40,pix-5,VH-60,pix,VH-80);
ctx.bezierCurveTo(pix+5,VH-60,pix+10,VH-40,pix+20,VH);
ctx.closePath();ctx.fill();}
ctx.fillStyle='rgba(30,27,75,0.9)';
ctx.beginPath();ctx.moveTo(0,VH);
for(var mx3=0;mx3<=VW;mx3+=20){
var my3=95+Math.sin((mx3+camX*0.2)*0.04)*18;
ctx.lineTo(mx3,my3);}
ctx.lineTo(VW,VH);ctx.fill();
}
ctx.fillStyle=t.fog;ctx.fillRect(0,0,VW,VH);
var vig=rg(ctx,VW/2,VH/2,200,[[0,'rgba(0,0,0,0)'],[0.7,'rgba(0,0,0,0.3)'],[1,'rgba(0,0,0,0.65)']]);
ctx.fillStyle=vig;ctx.fillRect(0,0,VW,VH);}

function drawPlatforms(){var t=level.theme;
for(var i=0;i<world.platforms.length;i++){var p=world.platforms[i];
var px=Math.floor(p.x-camera.x);
if(px+p.w<-10||px>VW+10)continue;
ctx.fillStyle='rgba(0,0,0,0.55)';ctx.fillRect(px+2,p.y+3,p.w,p.h);
var pg=lg(ctx,0,p.y,0,p.y+p.h,[[0,t.platTop],[0.25,t.platBot],[1,'#000']]);
ctx.fillStyle=pg;ctx.fillRect(px,p.y,p.w,p.h);
ctx.fillStyle=t.edge;ctx.shadowColor=t.edge;ctx.shadowBlur=6;
ctx.fillRect(px,p.y,p.w,1);ctx.shadowBlur=0;
ctx.fillStyle='rgba(255,255,255,0.08)';
ctx.fillRect(px,p.y+1,p.w,1);}}

function drawCoins(){for(var i=0;i<coins.length;i++){var c=coins[i];
if(c.collected)continue;var px=Math.floor(c.x-camera.x);
if(px<-10||px>VW+10)continue;drawCoinItem(ctx,px,c.y,c.bob);}}
function drawKey(){if(!key||key.taken)return;
var px=Math.floor(key.x-camera.x);drawKeyItem(ctx,px,key.y,key.bob);}
function drawPortal(){if(!portal||!portal.active)return;
var px=Math.floor(portal.x-camera.x);drawPortalItem(ctx,px,portal.y,gameTime);}

function drawPlayer(){
if(player.invincible>0&&Math.floor(player.invincible*20)%2===0)return;
var px=Math.floor(player.x-camera.x);
var st=(Math.abs(player.vx)>5&&player.onGround)?'walk':
(!player.onGround?(player.vy<0?'jump':'fall'):'idle');
drawKnight(ctx,px,player.y,player.facing,st,player.animTime,
player.hitFlash,player.attacking,player.vx,player.vy,player.onGround,
player.attackTimer,ATK_DUR);}

function drawEnemies(){for(var i=0;i<enemies.length;i++){var e=enemies[i];
var px=Math.floor(e.x-camera.x);
if(px<-40||px>VW+40)continue;
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
case 'nightmare':drawNightmare(ctx,px,e.y,e.direction,gameTime,hit);break;}
ctx.globalAlpha=1;
if(e.hp<e.maxHp&&!e.dead){ctx.fillStyle='rgba(0,0,0,0.75)';
ctx.fillRect(px,e.y-7,14,2);ctx.fillStyle='#ff3355';
ctx.fillRect(px,e.y-7,14*(e.hp/e.maxHp),2);}}}

function drawBossEntity(){if(!boss||boss.dead)return;
var px=Math.floor(boss.x-camera.x);var hit=boss.hitFlash>0;
switch(boss.kind){
case 'skeletonKing':drawSkeletonKing(ctx,px,boss.y,-1,gameTime,hit);break;
case 'fireDemon':drawFireDemon(ctx,px,boss.y,-1,gameTime,hit);break;
case 'iceQueen':drawIceQueen(ctx,px,boss.y,-1,gameTime,hit);break;
case 'shadowLord':drawShadowLord(ctx,px,boss.y,-1,gameTime,hit);break;}
var bw=VW-60,bx=30,by=18;
ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(bx-3,by-3,bw+6,14);
ctx.fillStyle='#1a0000';ctx.fillRect(bx,by,bw,8);
var hpPct=Math.max(0,boss.hp/boss.maxHp);
var grad=lg(ctx,bx,0,bx+bw,0,[[0,'#ff3355'],[1,'#e879f9']]);
ctx.fillStyle=grad;ctx.shadowColor='#ff3355';ctx.shadowBlur=10;
ctx.fillRect(bx,by,bw*hpPct,8);ctx.shadowBlur=0;
ctx.fillStyle='#fff';ctx.font='bold 8px monospace';ctx.textAlign='center';
ctx.fillText(boss.cfg.name,VW/2,by+7);ctx.textAlign='left';}

function drawParticles(){for(var i=0;i<particles.length;i++){var p=particles[i];
ctx.globalAlpha=Math.max(0,p.life/p.maxLife);ctx.fillStyle=p.color;
var px=Math.floor(p.x-camera.x);
ctx.fillRect(px,Math.floor(p.y),p.size,p.size);}
ctx.globalAlpha=1;}

function drawEnemyProjectiles(){
for(var i=0;i<enemyProjectiles.length;i++){var p=enemyProjectiles[i];
var px=Math.floor(p.x-camera.x);
if(px<-20||px>VW+20)continue;
ctx.globalAlpha=Math.max(0,p.life/3);
ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=10;
ctx.beginPath();ctx.arc(px,p.y,p.size+1,0,Math.PI*2);ctx.fill();
ctx.globalAlpha=0.3;
ctx.beginPath();ctx.arc(px,p.y,p.size+5,0,Math.PI*2);ctx.fill();
ctx.shadowBlur=0;}
ctx.globalAlpha=1;}

function updateHeroParticles(dt){
if(!player)return;
if(Math.random()<0.35){
var ang=Math.random()*Math.PI*2;
var r=8+Math.random()*8;
heroParticles.push({x:player.x+6+Math.cos(ang)*r,
y:player.y+10+Math.sin(ang)*r,
vx:(Math.random()-0.5)*15,vy:-15-Math.random()*20,
life:0.8+Math.random()*0.4,maxLife:0.8+Math.random()*0.4,
size:1+Math.random()*1.5});}
for(var i=heroParticles.length-1;i>=0;i--){
var p=heroParticles[i];
p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
if(p.life<=0)heroParticles.splice(i,1);}}

function drawHeroParticles(){
for(var i=0;i<heroParticles.length;i++){var p=heroParticles[i];
var a=Math.max(0,p.life/p.maxLife);
ctx.globalAlpha=a*0.7;ctx.fillStyle='#c4b5fd';
ctx.shadowColor='#a78bfa';ctx.shadowBlur=6;
var px=Math.floor(p.x-camera.x);
ctx.beginPath();ctx.arc(px,p.y,p.size,0,Math.PI*2);ctx.fill();}
ctx.globalAlpha=1;ctx.shadowBlur=0;}

function drawAttackEffect(){if(player.attacking&&player.attackTimer>ATK_DUR*0.4){
var hb=attackBox();var hx=Math.floor(hb.x-camera.x);
var swing=1-(player.attackTimer/ATK_DUR);
var alpha=1-swing*0.5;
ctx.globalAlpha=alpha*0.75;
var grad=lg(ctx,hx,0,hx+hb.w,0,[[0,'rgba(251,191,36,0.95)'],[0.5,'rgba(255,255,255,0.7)'],[1,'rgba(251,191,36,0)']]);
ctx.fillStyle=grad;ctx.fillRect(hx,hb.y,hb.w,hb.h);
ctx.globalAlpha=1;}}

function updateHUD(){var hpFill=document.getElementById('hpFill');
var killEl=document.getElementById('killCount');
var coinEl=document.getElementById('coinCount');
var levelEl=document.getElementById('levelName');
var progressEl=document.getElementById('progressText');
if(hpFill)hpFill.style.width=Math.max(0,player.hp/player.maxHp*100)+'%';
if(killEl)killEl.textContent=kills+'/'+level.killTarget;
var c=0;for(var i=0;i<coins.length;i++)if(coins[i].collected)c++;
if(coinEl)coinEl.textContent=c+'/'+coins.length;
if(levelEl)levelEl.textContent=level.name+' ✕'+deathStreak;
if(progressEl){
if(state==='boss')progressEl.textContent='⚔ BOSS · ✕'+bossDeathStreak;
else if(key&&key.taken)progressEl.textContent='🔑 TO PORTAL';
else if(kills>=level.killTarget)progressEl.textContent='🔑 KEY DROPPED';
else progressEl.textContent='☠ '+kills+'/'+level.killTarget;}}

function drawWinOverlay(){if(state!=='won')return;
ctx.fillStyle='rgba(0,0,0,0.9)';ctx.fillRect(0,0,VW,VH);
ctx.fillStyle='#fbbf24';ctx.font='bold 24px monospace';ctx.textAlign='center';
ctx.shadowColor='#fbbf24';ctx.shadowBlur=20;
ctx.fillText('★ VICTORY ★',VW/2,VH/2-15);ctx.shadowBlur=0;
ctx.fillStyle='#e879f9';ctx.font='11px monospace';
ctx.fillText('All 4 Levels Cleared!',VW/2,VH/2+10);
ctx.fillStyle='#a78bfa';ctx.font='9px monospace';
ctx.fillText('Restarting in 6s...',VW/2,VH/2+30);ctx.textAlign='left';
if(!window.__victoryTimer){window.__victoryTimer=setTimeout(function(){location.reload();},6000);}}

var last=0;
function loop(ts){var dt=Math.min((ts-last)/1000,0.05);last=ts;
if(hitPause>0){hitPause-=dt;requestAnimationFrame(loop);return;}
dtGlobal=dt;gameTime+=dt;
if(state==='playing'||state==='boss'){
player.animTime+=dt;
playerPhysics(dt);updateCombat(dt);
if(state==='playing'){
updateEnemies(dt);
spawnTimer-=dt;
if(spawnTimer<=0&&kills<level.killTarget){
var g=spawnGroup();
for(var s=0;s<g;s++)setTimeout(function(){spawnEnemy();},s*100);
spawnTimer=1+Math.random()*2;}
updateCoins();updateKeyAndPortal();}
else if(state==='boss'){updateBoss(dt);}
updateEnemyProjectiles(dt);updateCamera();updateHeroParticles(dt);}
for(var i=particles.length-1;i>=0;i--){var p=particles[i];
p.x+=p.vx*dt;p.y+=p.vy*dt;
p.vy+=300*dt;p.vx*=0.98;p.life-=dt;
if(p.life<=0)particles.splice(i,1);}
var sx=0,sy=0;
if(shake.t>0){shake.t-=dt;
sx=(Math.random()-0.5)*shake.i*2;
sy=(Math.random()-0.5)*shake.i*2;}
if(player.hp<=0&&state!=='gameover'){state='gameover';
if(state==='boss'){bossDeathStreak++;
if(bossDeathStreak>=MAX_STREAK){
bossDeathStreak=0;
kills=0;
setTimeout(function(){initLevel(currentLevel,false);},2200);
} else {
setTimeout(function(){
initLevel(currentLevel,true);
setTimeout(function(){state='boss';spawnBoss();},100);
},2200);}
} else {
deathStreak++;
if(deathStreak>=MAX_STREAK){deathStreak=0;}
setTimeout(function(){initLevel(currentLevel,true);},2200);}
Sound.gameOver();
spawnParticles(player.x+6,player.y+10,'#ff3355',35,3);
spawnParticles(player.x+6,player.y+10,'#e879f9',25,3);
shakeNow(12,0.7);}
updateHUD();
ctx.clearRect(0,0,VW,VH);
ctx.save();
ctx.translate(Math.floor(sx),Math.floor(sy));
drawBackground();drawPlatforms();drawCoins();drawKey();drawPortal();
drawEnemies();
if(state==='boss')drawBossEntity();
drawEnemyProjectiles();
drawPlayer();drawHeroParticles();drawAttackEffect();drawParticles();
ctx.restore();
drawWinOverlay();
requestAnimationFrame(loop);}

Sound.init();
document.addEventListener('touchstart',function u(){Sound.init();Sound.resume();document.removeEventListener('touchstart',u);},{once:true});
document.addEventListener('mousedown',function u(){Sound.init();Sound.resume();document.removeEventListener('mousedown',u);},{once:true});
var restored=restoreGame();
if(!restored){initLevel(0,false);}
document.getElementById('loading').classList.add('hide');
requestAnimationFrame(function(t){last=t;requestAnimationFrame(loop);});
console.log('%c⚔️ Shadow Blade v1.0','color:#a78bfa;font-size:20px;font-weight:900;');
console.log('%cFull release with skills, themes, save system','color:#e879f9;font-size:11px;');
})();
