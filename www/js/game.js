(function(){
'use strict';
var VW=320,VH=180,GRAVITY=900,MOVE_SPEED=115,JUMP_FORCE=-340,FRICTION=0.82;
var ATK_DUR=0.22,ATK_CD=0.30,ATK_RANGE=26,PLAYER_DMG=50,ENEMY_DMG=15,INV_TIME=1.2;
var canvas=document.getElementById('game');
var ctx=canvas.getContext('2d');
ctx.imageSmoothingEnabled=true;
function resize(){var s=Math.min(window.innerWidth/VW,window.innerHeight/VH);canvas.style.width=Math.floor(VW*s)+'px';canvas.style.height=Math.floor(VH*s)+'px';}
window.addEventListener('resize',resize);resize();
var input={left:false,right:false,jump:false,attack:false,jp:false,ap:false};
window.addEventListener('keydown',function(e){var k=e.key.toLowerCase();
if(k==='arrowleft'||k==='a')input.left=true;if(k==='arrowright'||k==='d')input.right=true;
if(k===' '||k==='arrowup'||k==='w'){if(!input.jump)input.jp=true;input.jump=true;}
if(k==='j'||k==='k'||k==='enter'){if(!input.attack)input.ap=true;input.attack=true;}
if(['arrowleft','arrowright','arrowup','arrowdown',' '].indexOf(k)!==-1)e.preventDefault();});
window.addEventListener('keyup',function(e){var k=e.key.toLowerCase();
if(k==='arrowleft'||k==='a')input.left=false;if(k==='arrowright'||k==='d')input.right=false;
if(k===' '||k==='arrowup'||k==='w')input.jump=false;
if(k==='j'||k==='k'||k==='enter')input.attack=false;});
function bind(id,onD,onU){var b=document.getElementById(id);if(!b)return;
var p=function(e){e.preventDefault();e.stopPropagation();b.classList.add('pressed');onD();};
var r=function(e){e.preventDefault();e.stopPropagation();b.classList.remove('pressed');if(onU)onU();};
b.addEventListener('touchstart',p,{passive:false});b.addEventListener('touchend',r,{passive:false});
b.addEventListener('touchcancel',r,{passive:false});b.addEventListener('mousedown',p);
b.addEventListener('mouseup',r);b.addEventListener('mouseleave',r);
b.addEventListener('contextmenu',function(e){e.preventDefault();});}
bind('btnLeft',function(){input.left=true;},function(){input.left=false;});
bind('btnRight',function(){input.right=true;},function(){input.right=false;});
bind('btnJump',function(){if(!input.jump)input.jp=true;input.jump=true;},function(){input.jump=false;});
bind('btnAttack',function(){if(!input.attack)input.ap=true;input.attack=true;},function(){input.attack=false;});
var LEVELS=[
{name:'CRYPT',theme:{bg1:'#0a0a18',bg2:'#050510',platTop:'#7c3aed',platBot:'#0a0a18',edge:'#a78bfa',star:'#a78bfa',fog:'rgba(124,58,237,0.08)'},
killTarget:15,enemies:[{kind:'bat',w:12,h:12,hp:60,speed:45,type:'flyer'},{kind:'slime',w:10,h:10,hp:80,speed:25,type:'crawler'},{kind:'skeleton',w:10,h:12,hp:100,speed:35,type:'walker'}],
boss:{kind:'skeletonKing',w:20,h:24,hp:600,dmg:22,name:'SKELETON KING'}},
{name:'FIRE',theme:{bg1:'#1a0505',bg2:'#0a0202',platTop:'#ff6b00',platBot:'#2e0a0a',edge:'#ff9f1c',star:'#ff9f1c',fog:'rgba(255,107,0,0.08)'},
killTarget:20,enemies:[{kind:'imp',w:12,h:12,hp:70,speed:55,type:'flyer'},{kind:'fireGolem',w:12,h:12,hp:140,speed:30,type:'crawler'},{kind:'imp',w:12,h:12,hp:70,speed:55,type:'flyer'}],
boss:{kind:'fireDemon',w:20,h:24,hp:900,dmg:26,name:'FIRE DEMON'}},
{name:'FROZEN',theme:{bg1:'#051018',bg2:'#020810',platTop:'#00d4ff',platBot:'#0a1a2e',edge:'#7dd3fc',star:'#bae6fd',fog:'rgba(0,212,255,0.06)'},
killTarget:25,enemies:[{kind:'iceWraith',w:10,h:11,hp:80,speed:50,type:'flyer'},{kind:'frostSpider',w:12,h:10,hp:100,speed:45,type:'crawler'},{kind:'iceGolem',w:12,h:12,hp:160,speed:28,type:'crawler'}],
boss:{kind:'iceQueen',w:16,h:24,hp:1200,dmg:30,name:'ICE QUEEN'}},
{name:'SHADOW',theme:{bg1:'#0a0518',bg2:'#050208',platTop:'#e879f9',platBot:'#1a0a2e',edge:'#c084fc',star:'#e9d5ff',fog:'rgba(232,121,249,0.08)'},
killTarget:30,enemies:[{kind:'shadowBeast',w:12,h:12,hp:110,speed:60,type:'flyer'},{kind:'voidCrawler',w:12,h:10,hp:130,speed:40,type:'crawler'},{kind:'nightmare',w:12,h:12,hp:180,speed:32,type:'crawler'}],
boss:{kind:'shadowLord',w:18,h:24,hp:1600,dmg:34,name:'SHADOW LORD'}}];
var state='playing',currentLevel=0,level=null,world=null;
var player=null,enemies=[],particles=[],coins=[];
var key=null,portal=null,boss=null;
var camera={x:0},shake={t:0,i:0};
var spawnTimer=0,kills=0,gameTime=0,dtGlobal=0.016;
function buildWorld(){
return{width:1100,platforms:[
{x:0,y:150,w:120,h:30},{x:70,y:120,w:40,h:5},{x:130,y:130,w:40,h:5},
{x:190,y:140,w:40,h:5},{x:250,y:120,w:40,h:5},{x:310,y:105,w:50,h:5},
{x:380,y:130,w:60,h:5},{x:460,y:110,w:40,h:5},{x:520,y:90,w:40,h:5},
{x:580,y:110,w:40,h:5},{x:640,y:130,w:60,h:5},{x:720,y:110,w:50,h:5},
{x:790,y:90,w:50,h:5},{x:860,y:120,w:40,h:5},{x:920,y:150,w:180,h:30}]};}
function initLevel(idx){
level=LEVELS[idx];world=buildWorld();
player={x:30,y:100,vx:0,vy:0,w:12,h:20,onGround:false,facing:1,animTime:0,
hp:100,maxHp:100,attacking:false,attackTimer:0,attackCooldown:0,invincible:0,hitFlash:0};
enemies=[];particles=[];coins=[];key=null;portal=null;boss=null;
kills=0;camera.x=0;spawnTimer=1.2;state='playing';
var positions=[[80,105],[140,115],[200,125],[260,105],[320,90],[390,115],[470,95],
[530,75],[590,95],[650,115],[730,95],[800,75],[870,105],[220,90],
[440,90],[700,90],[880,80],[180,110],[400,105],[640,110]];
for(var i=0;i<positions.length;i++){coins.push({x:positions[i][0],y:positions[i][1],collected:false,bob:Math.random()*Math.PI*2});}}
function rect(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function rand(a,b){return a+Math.random()*(b-a);}
function spawnParticles(x,y,color,n){for(var i=0;i<n;i++){var ang=Math.random()*Math.PI*2,sp=30+Math.random()*90;
particles.push({x:x,y:y,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp-40,life:0.5+Math.random()*0.5,
maxLife:0.5+Math.random()*0.5,color:color,size:1+Math.floor(Math.random()*2)});}}
function shakeNow(i,d){shake.i=i;shake.t=d;}
function spawnEnemy(){if(state!=='playing'||enemies.length>=7)return;
var t=level.enemies[Math.floor(Math.random()*level.enemies.length)];
var fromLeft=Math.random()<0.5;var sx=camera.x+(fromLeft?-20:VW+5);
var baseY=t.type==='flyer'?rand(40,100):140;
enemies.push({cfg:t,kind:t.kind,type:t.type,x:sx,y:baseY,
vx:(fromLeft?1:-1)*t.speed,vy:0,w:t.w,h:t.h,hp:t.hp,maxHp:t.hp,
direction:fromLeft?1:-1,hitFlash:0,hitCooldown:0,dead:false,
baseY:baseY,bobPhase:Math.random()*Math.PI*2});}
function spawnBoss(){var b=level.boss;
boss={cfg:b,kind:b.kind,x:camera.x+VW+30,y:120,vx:-40,vy:0,w:b.w,h:b.h,
hp:b.hp,maxHp:b.hp,state:'enter',stateTimer:1.5,hitFlash:0,hitCooldown:0,
direction:-1,baseY:120,bobPhase:0,attackTimer:2};
Sound.bossRoar();shakeNow(10,0.7);}
function playerPhysics(dt){var move=0;
if(input.left)move-=1;if(input.right)move+=1;
if(move!==0){player.vx+=move*MOVE_SPEED*8*dt;player.facing=move;}
player.vx*=Math.pow(FRICTION,dt*60);
if(input.jp&&player.onGround){player.vy=JUMP_FORCE;player.onGround=false;
Sound.jump();spawnParticles(player.x+6,player.y+19,'#a78bfa',5);}
input.jp=false;player.vy+=GRAVITY*dt;if(player.vy>500)player.vy=500;
player.x+=player.vx*dt;player.y+=player.vy*dt;player.onGround=false;
for(var i=0;i<world.platforms.length;i++){var p=world.platforms[i];
if(rect(player,p)){
if(player.vy>0&&player.y+player.h-player.vy*dt<=p.y+4){player.y=p.y-player.h;player.vy=0;player.onGround=true;}
else if(player.vy<0&&player.y-player.vy*dt>=p.y+p.h-4){player.y=p.y+p.h;player.vy=0;}
else{if(player.vx>0)player.x=p.x-player.w;else if(player.vx<0)player.x=p.x+p.w;player.vx=0;}}}
if(player.x<camera.x){player.x=camera.x;player.vx=0;}
if(player.x+player.w>world.width){player.x=world.width-player.w;player.vx=0;}
if(player.y>VH+30){player.hp-=25;Sound.hurt();
player.x=30;player.y=100;player.vx=0;player.vy=0;player.invincible=1.5;shakeNow(8,0.3);}}
function attackBox(){if(player.facing===1)return{x:player.x+player.w,y:player.y+3,w:ATK_RANGE,h:13};
return{x:player.x-ATK_RANGE,y:player.y+3,w:ATK_RANGE,h:13};}
function updateCombat(dt){
if(player.attackCooldown>0)player.attackCooldown-=dt;
if(player.invincible>0)player.invincible-=dt;
if(player.hitFlash>0)player.hitFlash-=dt;
if(input.ap&&player.attackCooldown<=0&&!player.attacking){
player.attacking=true;player.attackTimer=ATK_DUR;player.attackCooldown=ATK_CD;
Sound.slash();var hb=attackBox();spawnParticles(hb.x+hb.w/2,hb.y+hb.h/2,'#fbbf24',5);}
input.ap=false;
if(player.attacking){player.attackTimer-=dt;
if(player.attackTimer>ATK_DUR*0.4){var hb=attackBox();
for(var i=0;i<enemies.length;i++){var e=enemies[i];
if(e.dead||e.hitCooldown>0)continue;
if(rect(hb,{x:e.x,y:e.y,w:e.w,h:e.h})){
e.hp-=PLAYER_DMG;e.hitFlash=0.15;e.hitCooldown=0.28;e.vx+=player.facing*80;
Sound.hit();spawnParticles(e.x+e.w/2,e.y+e.h/2,'#ff3355',7);shakeNow(3,0.1);
if(e.hp<=0){e.dead=true;kills++;Sound.kill();shakeNow(5,0.18);
spawnParticles(e.x+e.w/2,e.y+e.h/2,'#e879f9',18);
spawnParticles(e.x+e.w/2,e.y+e.h/2,'#ff3355',10);}}}
if(boss&&!boss.dead&&boss.hitCooldown<=0&&boss.state!=='enter'){
if(rect(hb,{x:boss.x,y:boss.y,w:boss.w,h:boss.h})){
boss.hp-=PLAYER_DMG;boss.hitFlash=0.12;boss.hitCooldown=0.15;Sound.bossHit();
spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#ff3355',8);
spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#fbbf24',6);shakeNow(4,0.12);
if(boss.hp<=0){boss.dead=true;Sound.levelComplete();shakeNow(14,0.8);
spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#e879f9',40);
spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#ff3355',30);
spawnParticles(boss.x+boss.w/2,boss.y+boss.h/2,'#fbbf24',25);
setTimeout(function(){nextLevel();},2600);}}}}
if(player.attackTimer<=0)player.attacking=false;}}
function updateEnemies(dt){
for(var i=enemies.length-1;i>=0;i--){var e=enemies[i];
if(e.hitFlash>0)e.hitFlash-=dt;if(e.hitCooldown>0)e.hitCooldown-=dt;
if(e.dead){e.y+=60*dt;if(e.y>260)enemies.splice(i,1);continue;}
if(e.type==='crawler'||e.type==='walker'){
e.x+=e.vx*dt;e.vy+=GRAVITY*dt;e.y+=e.vy*dt;
for(var j=0;j<world.platforms.length;j++){var p=world.platforms[j];
if(rect({x:e.x,y:e.y,w:e.w,h:e.h},p)){if(e.vy>0){e.y=p.y-e.h;e.vy=0;}}}
if(e.y>VH+30){enemies.splice(i,1);continue;}
if(e.x<camera.x-40||e.x>camera.x+VW+40)enemies.splice(i,1);}
else if(e.type==='flyer'){e.x+=e.vx*dt;e.bobPhase+=dt*3;
e.y=e.baseY+Math.sin(e.bobPhase)*10;
if(e.x<camera.x-40||e.x>camera.x+VW+40){enemies.splice(i,1);continue;}}
if(player.invincible<=0&&!player.attacking){
if(rect({x:player.x,y:player.y,w:player.w,h:player.h},{x:e.x,y:e.y,w:e.w,h:e.h})){
damagePlayer(ENEMY_DMG,e.x);}}}}
function damagePlayer(dmg,fromX){player.hp-=dmg;player.invincible=INV_TIME;
player.hitFlash=0.3;Sound.hurt();shakeNow(6,0.22);
spawnParticles(player.x+player.w/2,player.y+player.h/2,'#ff3355',10);
player.vx=(player.x<fromX?-1:1)*130;player.vy=-120;}
function updateBoss(dt){if(!boss||boss.dead)return;
if(boss.hitFlash>0)boss.hitFlash-=dt;if(boss.hitCooldown>0)boss.hitCooldown-=dt;
if(boss.state==='enter'){boss.stateTimer-=dt;boss.x+=boss.vx*dt;
var targetX=camera.x+VW-60;
if(boss.x<targetX){boss.x=targetX;boss.vx=0;boss.state='idle';boss.attackTimer=1.5;}return;}
boss.attackTimer-=dt;
if(boss.state==='idle'){boss.bobPhase+=dt*4;boss.y=boss.baseY+Math.sin(boss.bobPhase)*3;
if(boss.attackTimer<=0){var r=Math.random();
if(r<0.4){boss.state='charge';boss.stateTimer=1.4;
boss.vx=(player.x<boss.x?-1:1)*90;boss.vy=-180;Sound.bossRoar();}
else if(r<0.7){boss.state='shoot';boss.stateTimer=1.2;boss.shootTimer=0;}
else{boss.state='jump';boss.stateTimer=1.0;boss.vy=-280;}
boss.attackTimer=1.8+Math.random()*1.2;}}
else if(boss.state==='charge'){boss.stateTimer-=dt;boss.x+=boss.vx*dt;
boss.vy+=GRAVITY*dt;boss.y+=boss.vy*dt;
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
particles.push({x:boss.x+boss.w/2,y:boss.y+boss.h/2,
vx:dx/len*130,vy:dy/len*130,life:3,maxLife:3,color:'#ff3355',size:3,isProjectile:true,dmg:12});}
if(boss.stateTimer<=0)boss.state='idle';}
else if(boss.state==='jump'){boss.stateTimer-=dt;boss.vy+=GRAVITY*dt;boss.y+=boss.vy*dt;
if(boss.y+boss.h>150){boss.y=150-boss.h;boss.vy=0;shakeNow(8,0.3);
spawnParticles(boss.x+boss.w/2,150,'#fbbf24',15);
if(player.onGround&&Math.abs(player.x-boss.x)<80&&player.invincible<=0){
damagePlayer(boss.cfg.dmg,boss.x);}boss.state='idle';}}}
function updateCoins(){for(var i=0;i<coins.length;i++){var c=coins[i];
if(c.collected)continue;c.bob+=0.08;
if(rect(player,{x:c.x-4,y:c.y-4,w:8,h:8})){c.collected=true;Sound.coin();
spawnParticles(c.x,c.y,'#fbbf24',5);}}}
function updateKeyAndPortal(){
if(!key&&!portal&&state==='playing'&&kills>=level.killTarget){
key={x:player.x,y:player.y-10,vy:-120,bob:0,taken:false};
Sound.key();shakeNow(4,0.3);spawnParticles(key.x,key.y,'#fbbf24',15);}
if(key&&!key.taken){key.bob+=0.12;key.vy+=GRAVITY*dtGlobal;key.y+=key.vy*dtGlobal;
for(var i=0;i<world.platforms.length;i++){var p=world.platforms[i];
if(key.x>p.x&&key.x<p.x+p.w&&key.y>p.y-12&&key.y<p.y+p.h){
if(key.vy>0){key.y=p.y-12;key.vy=0;}}}
if(key.y>VH+30){key.y=140;key.vy=0;}
if(rect(player,{x:key.x-5,y:key.y-7,w:10,h:14})){
key.taken=true;Sound.portal();shakeNow(5,0.3);
spawnParticles(key.x,key.y,'#fbbf24',20);
portal={x:world.width-80,y:120,active:true};}}
if(portal&&portal.active){
if(rect(player,{x:portal.x-6,y:portal.y-14,w:16,h:28})){
portal.active=false;state='boss';spawnBoss();}}}
function nextLevel(){currentLevel++;
if(currentLevel>=LEVELS.length){state='won';return;}
initLevel(currentLevel);}
function updateCamera(){var targetX=player.x-VW*0.4;
if(targetX<0)targetX=0;if(targetX>world.width-VW)targetX=world.width-VW;
camera.x+=(targetX-camera.x)*0.08;
if(camera.x<0)camera.x=0;if(camera.x>world.width-VW)camera.x=world.width-VW;}
function drawBackground(){var t=level.theme;
var grad=ctx.createLinearGradient(0,0,0,VH);
grad.addColorStop(0,t.bg1);grad.addColorStop(1,t.bg2);
ctx.fillStyle=grad;ctx.fillRect(0,0,VW,VH);
ctx.fillStyle=t.star;
for(var i=0;i<70;i++){var sx=(i*73+Math.floor(camera.x*0.2))%VW;var sy=(i*41)%130;
ctx.globalAlpha=0.15+((i*17)%10)/50;
var sz=((i*13)%3===0)?1.5:1;ctx.fillRect(sx,sy,sz,sz);}
ctx.globalAlpha=1;ctx.fillStyle=t.bg2;ctx.beginPath();ctx.moveTo(0,VH);
for(var x=0;x<=VW;x+=15){var y=100+Math.sin((x+camera.x*0.2)*0.04)*15+Math.cos((x+camera.x*0.2)*0.07)*8;ctx.lineTo(x,y);}
ctx.lineTo(VW,VH);ctx.fill();ctx.fillStyle=t.fog;ctx.fillRect(0,0,VW,VH);}
function drawPlatforms(){var t=level.theme;
for(var i=0;i<world.platforms.length;i++){var p=world.platforms[i];
var px=Math.floor(p.x-camera.x);
if(px+p.w<-10||px>VW+10)continue;
ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(px+1,p.y+2,p.w,p.h);
var platGrad=ctx.createLinearGradient(0,p.y,0,p.y+p.h);
platGrad.addColorStop(0,t.platTop);platGrad.addColorStop(0.2,t.platBot);platGrad.addColorStop(1,'#000');
ctx.fillStyle=platGrad;ctx.fillRect(px,p.y,p.w,p.h);
ctx.fillStyle=t.edge;ctx.shadowColor=t.edge;ctx.shadowBlur=4;
ctx.fillRect(px,p.y,p.w,1);ctx.shadowBlur=0;}}
function drawCoins(){for(var i=0;i<coins.length;i++){var c=coins[i];
if(c.collected)continue;var px=Math.floor(c.x-camera.x);
if(px<-10||px>VW+10)continue;drawCoinItem(ctx,px,c.y,c.bob);}}
function drawKey(){if(!key||key.taken)return;var px=Math.floor(key.x-camera.x);drawKeyItem(ctx,px,key.y,key.bob);}
function drawPortal(){if(!portal||!portal.active)return;var px=Math.floor(portal.x-camera.x);drawPortalItem(ctx,px,portal.y,gameTime);}
function drawPlayer(){if(player.invincible>0&&Math.floor(player.invincible*20)%2===0)return;
var px=Math.floor(player.x-camera.x);
var st=(Math.abs(player.vx)>5&&player.onGround)?'walk':'idle';
drawKnight(ctx,px,player.y,player.facing,st,player.animTime,player.hitFlash,player.attacking);}
function drawEnemies(){for(var i=0;i<enemies.length;i++){var e=enemies[i];
var px=Math.floor(e.x-camera.x);if(px<-30||px>VW+30)continue;var hit=e.hitFlash>0;
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
if(e.hp<e.maxHp&&!e.dead){ctx.fillStyle='rgba(0,0,0,0.75)';
ctx.fillRect(px,e.y-6,14,2);ctx.fillStyle='#ff3355';
ctx.fillRect(px,e.y-6,14*(e.hp/e.maxHp),2);}}}
function drawBossEntity(){if(!boss||boss.dead)return;
var px=Math.floor(boss.x-camera.x);var hit=boss.hitFlash>0;
switch(boss.kind){
case 'skeletonKing':drawSkeletonKing(ctx,px,boss.y,-1,gameTime,hit);break;
case 'fireDemon':drawFireDemon(ctx,px,boss.y,-1,gameTime,hit);break;
case 'iceQueen':drawIceQueen(ctx,px,boss.y,-1,gameTime,hit);break;
case 'shadowLord':drawShadowLord(ctx,px,boss.y,-1,gameTime,hit);break;}
var bw=VW-60,bx=30,by=18;
ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(bx-2,by-2,bw+4,12);
ctx.fillStyle='#1a0000';ctx.fillRect(bx,by,bw,8);
var hpPct=Math.max(0,boss.hp/boss.maxHp);
var grad=ctx.createLinearGradient(bx,0,bx+bw,0);
grad.addColorStop(0,'#ff3355');grad.addColorStop(1,'#e879f9');
ctx.fillStyle=grad;ctx.shadowColor='#ff3355';ctx.shadowBlur=8;
ctx.fillRect(bx,by,bw*hpPct,8);ctx.shadowBlur=0;
ctx.fillStyle='#fff';ctx.font='bold 8px monospace';ctx.textAlign='center';
ctx.fillText(boss.cfg.name,VW/2,by+7);ctx.textAlign='left';}
function drawParticles(){for(var i=0;i<particles.length;i++){var p=particles[i];
ctx.globalAlpha=Math.max(0,p.life/p.maxLife);ctx.fillStyle=p.color;
var px=Math.floor(p.x-camera.x);
if(p.isProjectile){ctx.shadowColor=p.color;ctx.shadowBlur=8;
ctx.beginPath();ctx.arc(px,p.y,3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
else{ctx.fillRect(px,Math.floor(p.y),p.size,p.size);}}
ctx.globalAlpha=1;}
function drawAttackEffect(){if(player.attacking&&player.attackTimer>ATK_DUR*0.4){
var hb=attackBox();var hx=Math.floor(hb.x-camera.x);
var swing=1-(player.attackTimer/ATK_DUR);var alpha=1-swing*0.5;
ctx.globalAlpha=alpha*0.7;
var grad=ctx.createLinearGradient(hx,0,hx+hb.w,0);
grad.addColorStop(0,'rgba(251,191,36,0.9)');grad.addColorStop(1,'rgba(251,191,36,0)');
ctx.fillStyle=grad;ctx.fillRect(hx,hb.y,hb.w,hb.h);ctx.globalAlpha=1;}}
function updateHUD(){var hpFill=document.getElementById('hpFill');
var killEl=document.getElementById('killCount');var coinEl=document.getElementById('coinCount');
var levelEl=document.getElementById('levelName');var progressEl=document.getElementById('progressText');
if(hpFill)hpFill.style.width=Math.max(0,player.hp/player.maxHp*100)+'%';
if(killEl)killEl.textContent=kills+'/'+level.killTarget;
var c=0;for(var i=0;i<coins.length;i++)if(coins[i].collected)c++;
if(coinEl)coinEl.textContent=c+'/'+coins.length;
if(levelEl)levelEl.textContent=level.name;
if(progressEl){if(state==='boss')progressEl.textContent='⚔ BOSS FIGHT';
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
function updateProjectiles(dt){for(var i=particles.length-1;i>=0;i--){var p=particles[i];
if(!p.isProjectile)continue;p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
if(player.invincible<=0&&Math.abs(p.x-(player.x+player.w/2))<8&&Math.abs(p.y-(player.y+player.h/2))<10){
damagePlayer(p.dmg||12,p.x);particles.splice(i,1);continue;}
if(p.life<=0)particles.splice(i,1);}}
var last=0;
function loop(ts){var dt=Math.min((ts-last)/1000,0.05);last=ts;dtGlobal=dt;gameTime+=dt;
if(state==='playing'||state==='boss'){player.animTime+=dt;
playerPhysics(dt);updateCombat(dt);
if(state==='playing'){updateEnemies(dt);spawnTimer-=dt;
if(spawnTimer<=0&&kills<level.killTarget){spawnEnemy();spawnTimer=1.6;}
updateCoins();updateKeyAndPortal();}
else if(state==='boss'){updateBoss(dt);}
updateProjectiles(dt);updateCamera();}
for(var i=particles.length-1;i>=0;i--){var p=particles[i];
if(p.isProjectile)continue;p.x+=p.vx*dt;p.y+=p.vy*dt;
p.vy+=300*dt;p.vx*=0.98;p.life-=dt;
if(p.life<=0)particles.splice(i,1);}
var sx=0,sy=0;
if(shake.t>0){shake.t-=dt;sx=(Math.random()-0.5)*shake.i*2;sy=(Math.random()-0.5)*shake.i*2;}
if(player.hp<=0&&state!=='gameover'){state='gameover';Sound.gameOver();
spawnParticles(player.x+6,player.y+10,'#ff3355',30);
spawnParticles(player.x+6,player.y+10,'#e879f9',20);shakeNow(10,0.6);
setTimeout(function(){initLevel(currentLevel);},2200);}
updateHUD();ctx.clearRect(0,0,VW,VH);ctx.save();
ctx.translate(Math.floor(sx),Math.floor(sy));
drawBackground();drawPlatforms();drawCoins();drawKey();drawPortal();
drawEnemies();if(state==='boss')drawBossEntity();
drawPlayer();drawAttackEffect();drawParticles();ctx.restore();
drawWinOverlay();requestAnimationFrame(loop);}
Sound.init();
document.addEventListener('touchstart',function u(){Sound.init();document.removeEventListener('touchstart',u);},{once:true});
document.addEventListener('mousedown',function u(){Sound.init();document.removeEventListener('mousedown',u);},{once:true});
initLevel(0);
document.getElementById('loading').classList.add('hide');
requestAnimationFrame(function(t){last=t;requestAnimationFrame(loop);});
console.log('%c⚔️ Shadow Blade v0.5','color:#a78bfa;font-size:20px;font-weight:900;');
console.log('%cVector Art + Themed Levels','color:#e879f9;font-size:11px;');
})();
