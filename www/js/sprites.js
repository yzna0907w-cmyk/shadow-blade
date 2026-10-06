/* ===== Gradient Helpers ===== */
function lg(c,x1,y1,x2,y2,s){var g=c.createLinearGradient(x1,y1,x2,y2);for(var i=0;i<s.length;i++)g.addColorStop(s[i][0],s[i][1]);return g;}
function rg(c,x,y,r,s){var g=c.createRadialGradient(x,y,0,x,y,r);for(var i=0;i<s.length;i++)g.addColorStop(s[i][0],s[i][1]);return g;}

/* ===== Load Images ===== */
var IMG = {};
function loadImg(name, src){
  var img = new Image();
  img.src = src;
  img.loaded = false;
  img.onload = function(){img.loaded = true;};
  img.onerror = function(){img.loaded = true;};
  IMG[name] = img;
  return img;
}
loadImg('knight',        'assets/knight.png');
loadImg('bat',           'assets/bat.png');
loadImg('slime',         'assets/slime.png');
loadImg('skeleton',      'assets/skeleton.png');
loadImg('imp',           'assets/imp.png');
loadImg('fireGolem',     'assets/fireGolem.png');
loadImg('iceWraith',     'assets/iceWraith.png');
loadImg('frostSpider',   'assets/frostSpider.png');
loadImg('iceGolem',      'assets/iceGolem.png');
loadImg('shadowBeast',   'assets/shadowBeast.png');
loadImg('voidCrawler',   'assets/voidCrawler.png');
loadImg('nightmare',     'assets/nightmare.png');
loadImg('cryptHorror',   'assets/cryptHorror.png');
loadImg('skeletonKing',  'assets/skeletonKing.png');
loadImg('fireDemon',     'assets/fireDemon.png');
loadImg('iceQueen',      'assets/iceQueen.png');
loadImg('shadowLord',    'assets/shadowLord.png');
loadImg('umbra',         'assets/umbra.png');
loadImg('shopkeeper',    'assets/shopkeeper.png');
loadImg('blacksmith',    'assets/blacksmith.png');
loadImg('shopBooth',     'assets/shop_booth.png');
loadImg('forgeWorkshop', 'assets/forge_workshop.png');
loadImg('coin',          'assets/coin.png');
loadImg('key',           'assets/key.png');
loadImg('portal',        'assets/portal.png');

var BG = {};
BG.crypt  = new Image(); BG.crypt.src  = 'assets/bg_crypt.png';
BG.fire   = new Image(); BG.fire.src   = 'assets/bg_fire.png';
BG.frozen = new Image(); BG.frozen.src = 'assets/bg_frozen.png';
BG.shadow = new Image(); BG.shadow.src = 'assets/bg_shadow.png';

var PLAT_IMG = {};
PLAT_IMG.crypt  = new Image(); PLAT_IMG.crypt.src  = 'assets/platform_crypt.png';
PLAT_IMG.fire   = new Image(); PLAT_IMG.fire.src   = 'assets/platform_fire.png';
PLAT_IMG.frozen = new Image(); PLAT_IMG.frozen.src = 'assets/platform_frozen.png';
PLAT_IMG.shadow = new Image(); PLAT_IMG.shadow.src = 'assets/platform_shadow.png';

/* ===== Sprite Data ===== */
var SPRITE = {
  knight:      {img:'knight',      cols:3, rows:2, total:6},
  bat:         {img:'bat',         cols:2, rows:2, total:4},
  slime:       {img:'slime',       cols:3, rows:2, total:5},
  skeleton:    {img:'skeleton',    cols:2, rows:2, total:4},
  imp:         {img:'imp',         cols:2, rows:2, total:4},
  fireGolem:   {img:'fireGolem',   cols:2, rows:2, total:4},
  iceWraith:   {img:'iceWraith',   cols:2, rows:2, total:4},
  frostSpider: {img:'frostSpider', cols:2, rows:2, total:4},
  iceGolem:    {img:'iceGolem',    cols:2, rows:2, total:4},
  shadowBeast: {img:'shadowBeast', cols:2, rows:2, total:4},
  voidCrawler: {img:'voidCrawler', cols:2, rows:2, total:4},
  nightmare:   {img:'nightmare',   cols:2, rows:2, total:4},
  cryptHorror: {img:'cryptHorror', cols:2, rows:2, total:4},
  skeletonKing:{img:'skeletonKing',cols:3, rows:2, total:6},
  fireDemon:   {img:'fireDemon',   cols:3, rows:2, total:6},
  iceQueen:    {img:'iceQueen',    cols:3, rows:2, total:6},
  shadowLord:  {img:'shadowLord',  cols:3, rows:2, total:6},
  umbra:       {img:'umbra',       cols:3, rows:2, total:6}
};

/* ===== Draw Knight (6 frames: 3 walk + 3 attack) ===== */
function drawKnight(ctx,x,y,facing,state,time,hitFlash,attacking,vx,vy,onGround,attackTimer,ATK_DUR){
  var img = IMG.knight;
  if(!img || !img.loaded){ctx.fillStyle='#c4b5fd';ctx.fillRect(x-4,y-15,20,35);return;}
  ctx.globalAlpha = 0.4;
  var halo = rg(ctx,x+6,y+10,26,[[0,hitFlash>0?'rgba(255,80,100,0.9)':'rgba(139,92,246,0.7)'],[1,'rgba(124,58,237,0)']]);
  ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(x+6,y+10,26,0,Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1;
  var frame;
  if(attacking){
    var prog = 1 - (attackTimer/ATK_DUR);
    frame = 3 + Math.min(2, Math.floor(prog * 3));
  } else if(state === 'walk'){
    frame = Math.floor(time * 8) % 3;
  } else {frame = 1;}
  var fw = img.width / 3, fh = img.height / 2;
  var sx = (frame % 3) * fw;
  var sy = Math.floor(frame / 3) * fh;
  var tW = 40, tH = 55;
  var px = x - 14, py = y - 25;
  var bob = (state === 'walk') ? Math.sin(time*10)*1 : 0;
  ctx.save();
  if(facing === -1){ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);}
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, sx, sy, fw, fh, px, py+bob, tW, tH);
  ctx.restore();
  if(hitFlash > 0){ctx.globalAlpha=0.4;ctx.fillStyle='#ff3355';ctx.fillRect(px,py+bob,tW,tH);ctx.globalAlpha=1;}
  if(attacking && attackTimer > ATK_DUR*0.3){
    var trailA = (attackTimer/ATK_DUR - 0.3)/0.7;
    ctx.globalAlpha = trailA*0.5;
    var tGrad = lg(ctx,x-15,-9,x+15,4,[[0,'rgba(196,181,253,0)'],[0.5,'rgba(232,121,249,0.7)'],[1,'rgba(196,181,253,0)']]);
    ctx.strokeStyle=tGrad;ctx.lineWidth=3;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(x-12,y-4);
    ctx.bezierCurveTo(x-6,y-9,x+6,y-9,x+14,y-4);ctx.stroke();
    ctx.globalAlpha=1;
  }
}

/* ===== Draw Enemy ===== */
function drawEnemy(ctx,key,x,y,facing,time,hitFlash){
  var s = SPRITE[key];
  if(!s)return;
  var img = IMG[s.img];
  if(!img || !img.loaded)return;
  ctx.globalAlpha = 0.35;
  var halo = rg(ctx,x+6,y+6,20,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(139,92,246,0.5)'],[1,'rgba(124,58,237,0)']]);
  ctx.fillStyle=halo;ctx.beginPath();ctx.arc(x+6,y+6,20,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha = 1;
  var frame = Math.floor(time*7) % s.total;
  var fw = img.width/s.cols, fh = img.height/s.rows;
  var sx = (frame % s.cols) * fw;
  var sy = Math.floor(frame / s.cols) * fh;
  var tW = 36, tH = 36;
  var px = x - 12, py = y - 14;
  var bob = Math.sin(time*3 + x*0.01) * 1.5;
  ctx.save();
  if(facing === -1){ctx.translate(x+6,0);ctx.scale(-1,1);ctx.translate(-(x+6),0);}
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, sx, sy, fw, fh, px, py+bob, tW, tH);
  ctx.restore();
  if(hitFlash > 0){ctx.globalAlpha=0.5;ctx.fillStyle='#ff3355';ctx.fillRect(px,py+bob,tW,tH);ctx.globalAlpha=1;}
}

/* ===== Draw Boss ===== */
function drawBoss(ctx,key,x,y,facing,time,hitFlash){
  var s = SPRITE[key];
  if(!s)return;
  var img = IMG[s.img];
  if(!img || !img.loaded)return;
  ctx.globalAlpha = 0.5;
  var halo = rg(ctx,x+10,y+12,55,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(232,121,249,0.6)'],[1,'rgba(124,58,237,0)']]);
  ctx.fillStyle=halo;ctx.beginPath();ctx.arc(x+10,y+12,55,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha = 1;
  var frame = Math.floor(time*4) % s.total;
  var fw = img.width/s.cols, fh = img.height/s.rows;
  var sx = (frame % s.cols) * fw;
  var sy = Math.floor(frame / s.cols) * fh;
  var tW = 90, tH = 100;
  var px = x - 35, py = y - 35;
  var bob = Math.sin(time*2) * 3;
  ctx.save();
  if(facing === -1){ctx.translate(x+10,0);ctx.scale(-1,1);ctx.translate(-(x+10),0);}
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, sx, sy, fw, fh, px, py+bob, tW, tH);
  ctx.restore();
  if(hitFlash > 0){ctx.globalAlpha=0.5;ctx.fillStyle='#ff3355';ctx.fillRect(px,py+bob,tW,tH);ctx.globalAlpha=1;}
}

/* ===== Individual Enemy Drawers ===== */
function drawBat(ctx,x,y,f,t,h){drawEnemy(ctx,'bat',x,y,f,t,h);}
function drawSlime(ctx,x,y,f,t,h){drawEnemy(ctx,'slime',x,y,f,t,h);}
function drawSkeleton(ctx,x,y,f,t,h){drawEnemy(ctx,'skeleton',x,y,f,t,h);}
function drawImp(ctx,x,y,f,t,h){drawEnemy(ctx,'imp',x,y,f,t,h);}
function drawFireGolem(ctx,x,y,f,t,h){drawEnemy(ctx,'fireGolem',x,y,f,t,h);}
function drawIceWraith(ctx,x,y,f,t,h){drawEnemy(ctx,'iceWraith',x,y,f,t,h);}
function drawFrostSpider(ctx,x,y,f,t,h){drawEnemy(ctx,'frostSpider',x,y,f,t,h);}
function drawIceGolem(ctx,x,y,f,t,h){drawEnemy(ctx,'iceGolem',x,y,f,t,h);}
function drawShadowBeast(ctx,x,y,f,t,h){drawEnemy(ctx,'shadowBeast',x,y,f,t,h);}
function drawVoidCrawler(ctx,x,y,f,t,h){drawEnemy(ctx,'voidCrawler',x,y,f,t,h);}
function drawNightmare(ctx,x,y,f,t,h){drawEnemy(ctx,'nightmare',x,y,f,t,h);}
function drawCryptHorror(ctx,x,y,f,t,h){drawEnemy(ctx,'cryptHorror',x,y,f,t,h);}

/* ===== Boss Drawers ===== */
function drawSkeletonKing(ctx,x,y,f,t,h){drawBoss(ctx,'skeletonKing',x,y,f,t,h);}
function drawFireDemon(ctx,x,y,f,t,h){drawBoss(ctx,'fireDemon',x,y,f,t,h);}
function drawIceQueen(ctx,x,y,f,t,h){drawBoss(ctx,'iceQueen',x,y,f,t,h);}
function drawShadowLord(ctx,x,y,f,t,h){drawBoss(ctx,'shadowLord',x,y,f,t,h);}
function drawUmbra(ctx,x,y,f,t,h){drawBoss(ctx,'umbra',x,y,f,t,h);}

/* ===== Items ===== */
function drawCoinItem(ctx,x,y,bob){
  var img = IMG.coin;
  if(!img || !img.loaded){ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();return;}
  var bounce = Math.sin(bob)*2;
  var fw = img.width/4;
  var frame = Math.floor(bob*3)%4;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, frame*fw, 0, fw, img.height, x-10, y-10+bounce, 20, 20);
}
function drawKeyItem(ctx,x,y,bob){
  var img = IMG.key;
  if(!img || !img.loaded){ctx.fillStyle='#fbbf24';ctx.fillRect(x-4,y-8,8,16);return;}
  var bounce = Math.sin(bob)*2;
  var fw = img.width/4;
  var frame = Math.floor(bob*3)%4;
  ctx.imageSmoothingEnabled = false;
  ctx.shadowColor='#fbbf24';ctx.shadowBlur=15;
  ctx.drawImage(img, frame*fw, 0, fw, img.height, x-15, y-15+bounce, 30, 30);
  ctx.shadowBlur=0;
}
function drawPortalItem(ctx,x,y,time){
  var img = IMG.portal;
  if(!img || !img.loaded){ctx.fillStyle='#06ffa5';ctx.beginPath();ctx.arc(x,y,15,0,Math.PI*2);ctx.fill();return;}
  var pulse = 1 + Math.sin(time*3)*0.1;
  var fw = img.width/4;
  var frame = Math.floor(time*4)%4;
  ctx.imageSmoothingEnabled = false;
  ctx.shadowColor='#06ffa5';ctx.shadowBlur=20;
  ctx.drawImage(img, frame*fw, 0, fw, img.height, x-25*pulse, y-25*pulse, 50*pulse, 50*pulse);
  ctx.shadowBlur=0;
}

/* ===== NPCs (characters) ===== */
function drawShopkeeper(ctx,x,y,time){
  var img = IMG.shopkeeper;
  if(!img || !img.loaded){ctx.fillStyle='#fbbf24';ctx.fillRect(x-12,y-20,24,35);return;}
  var bob = Math.sin(time*2)*2;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, x-20, y-25+bob, 40, 40);
}
function drawBlacksmith(ctx,x,y,time){
  var img = IMG.blacksmith;
  if(!img || !img.loaded){ctx.fillStyle='#dc2626';ctx.fillRect(x-12,y-20,24,35);return;}
  var bob = Math.sin(time*2)*2;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, x-20, y-25+bob, 40, 40);
}

/* ===== Booths (map buildings) ===== */
function drawShopBooth(ctx,x,y,time){
  var img = IMG.shopBooth;
  if(!img || !img.loaded){ctx.fillStyle='#7c3aed';ctx.fillRect(x-40,y-60,80,60);return;}
  var bob = Math.sin(time*1.5)*1.5;
  ctx.imageSmoothingEnabled = false;
  ctx.shadowColor='#fbbf24';ctx.shadowBlur=15;
  ctx.drawImage(img, x-50, y-80+bob, 100, 100);
  ctx.shadowBlur=0;
}
function drawForgeWorkshop(ctx,x,y,time){
  var img = IMG.forgeWorkshop;
  if(!img || !img.loaded){ctx.fillStyle='#dc2626';ctx.fillRect(x-40,y-60,80,60);return;}
  var bob = Math.sin(time*1.5)*1.5;
  ctx.imageSmoothingEnabled = false;
  ctx.shadowColor='#ff6b00';ctx.shadowBlur=15;
  ctx.drawImage(img, x-50, y-80+bob, 100, 100);
  ctx.shadowBlur=0;
}
