/* ============================================
   Shadow Blade - Image Loader + Draw Functions
   ============================================ */

/* ===== Helper: Gradient Functions ===== */
function lg(c,x1,y1,x2,y2,s){var g=c.createLinearGradient(x1,y1,x2,y2);for(var i=0;i<s.length;i++)g.addColorStop(s[i][0],s[i][1]);return g;}
function rg(c,x,y,r,s){var g=c.createRadialGradient(x,y,0,x,y,r);for(var i=0;i<s.length;i++)g.addColorStop(s[i][0],s[i][1]);return g;}

/* ===== Smart Background Remover ===== */
function loadTransparentImage(src){
  var img = new Image();
  img.crossOrigin = 'anonymous';
  img.loaded = false;
  img.onload = function(){
    try{
      var c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      var x = c.getContext('2d');
      x.drawImage(img, 0, 0);
      var data = x.getImageData(0, 0, c.width, c.height);
      var p = data.data;
      var w = c.width, h = c.height;
      var corners = [0, (w-1)*4, (h-1)*w*4, ((h-1)*w + (w-1))*4];
      var bgR=0, bgG=0, bgB=0;
      for(var ci=0;ci<4;ci++){
        var ii=corners[ci];
        bgR += p[ii]; bgG += p[ii+1]; bgB += p[ii+2];
      }
      bgR = Math.round(bgR/4); bgG = Math.round(bgG/4); bgB = Math.round(bgB/4);
      var tolerance = 100;
      for(var j = 0; j < p.length; j += 4){
        var r = p[j], g = p[j+1], b = p[j+2];
        var diff = Math.abs(r-bgR) + Math.abs(g-bgG) + Math.abs(b-bgB);
        if(diff < tolerance){p[j+3] = 0;}
        else if(diff < tolerance * 1.5){
          var alpha = Math.floor(255 * ((diff - tolerance) / (tolerance * 0.5)));
          p[j+3] = Math.min(255, Math.max(0, alpha));
        }
      }
      x.putImageData(data, 0, 0);
      img.src = c.toDataURL('image/png');
      img.loaded = true;
    } catch(e){img.loaded = true;}
  };
  img.onerror = function(){img.loaded = true;};
  img.src = src;
  return img;
}

/* ===== Load All Images ===== */
var IMG = {};
IMG.knight       = loadTransparentImage('assets/knight.png');
IMG.bat          = loadTransparentImage('assets/bat.png');
IMG.slime        = loadTransparentImage('assets/slime.png');
IMG.skeleton     = loadTransparentImage('assets/skeleton.png');
IMG.imp          = loadTransparentImage('assets/imp.png');
IMG.fireGolem    = loadTransparentImage('assets/fireGolem.png');
IMG.iceWraith    = loadTransparentImage('assets/iceWraith.png');
IMG.frostSpider  = loadTransparentImage('assets/frostSpider.png');
IMG.iceGolem     = loadTransparentImage('assets/iceGolem.png');
IMG.shadowBeast  = loadTransparentImage('assets/shadowBeast.png');
IMG.voidCrawler  = loadTransparentImage('assets/voidCrawler.png');
IMG.nightmare    = loadTransparentImage('assets/nightmare.png');
IMG.cryptHorror  = loadTransparentImage('assets/cryptHorror.png');
IMG.skeletonKing = loadTransparentImage('assets/skeletonKing.png');
IMG.fireDemon    = loadTransparentImage('assets/fireDemon.png');
IMG.iceQueen     = loadTransparentImage('assets/iceQueen.png');
IMG.shadowLord   = loadTransparentImage('assets/shadowLord.png');
IMG.umbra        = loadTransparentImage('assets/umbra.png');
IMG.coin         = loadTransparentImage('assets/coin.png');
IMG.key          = loadTransparentImage('assets/key.png');
IMG.portal       = loadTransparentImage('assets/portal.png');
IMG.shopkeeper   = loadTransparentImage('assets/shopkeeper.png');
IMG.blacksmith   = loadTransparentImage('assets/blacksmith.png');

/* ===== Backgrounds (بدون إزالة خلفية) ===== */
var BG = {};
BG.crypt  = new Image(); BG.crypt.src  = 'assets/bg_crypt.png';
BG.fire   = new Image(); BG.fire.src   = 'assets/bg_fire.png';
BG.frozen = new Image(); BG.frozen.src = 'assets/bg_frozen.png';
BG.shadow = new Image(); BG.shadow.src = 'assets/bg_shadow.png';

/* ===== Sprite Sheet Helper ===== */
var SPRITE = {
  knight:      {img:'knight',      cols:3, rows:2, total:6,  fw:0, fh:0},
  bat:         {img:'bat',         cols:2, rows:2, total:4,  fw:0, fh:0},
  slime:       {img:'slime',       cols:2, rows:2, total:4,  fw:0, fh:0},
  skeleton:    {img:'skeleton',    cols:2, rows:2, total:4,  fw:0, fh:0},
  imp:         {img:'imp',         cols:2, rows:2, total:4,  fw:0, fh:0},
  fireGolem:   {img:'fireGolem',   cols:2, rows:2, total:4,  fw:0, fh:0},
  iceWraith:   {img:'iceWraith',   cols:2, rows:2, total:4,  fw:0, fh:0},
  frostSpider: {img:'frostSpider', cols:2, rows:2, total:4,  fw:0, fh:0},
  iceGolem:    {img:'iceGolem',    cols:2, rows:2, total:4,  fw:0, fh:0},
  shadowBeast: {img:'shadowBeast', cols:2, rows:2, total:4,  fw:0, fh:0},
  voidCrawler: {img:'voidCrawler', cols:2, rows:2, total:4,  fw:0, fh:0},
  nightmare:   {img:'nightmare',   cols:2, rows:2, total:4,  fw:0, fh:0},
  cryptHorror: {img:'cryptHorror', cols:2, rows:2, total:4,  fw:0, fh:0},
  skeletonKing:{img:'skeletonKing',cols:2, rows:3, total:6,  fw:0, fh:0},
  fireDemon:   {img:'fireDemon',   cols:2, rows:3, total:6,  fw:0, fh:0},
  iceQueen:    {img:'iceQueen',    cols:2, rows:3, total:6,  fw:0, fh:0},
  shadowLord:  {img:'shadowLord',  cols:2, rows:3, total:6,  fw:0, fh:0},
  umbra:       {img:'umbra',       cols:2, rows:3, total:6,  fw:0, fh:0}
};

/* ===== Draw Sprite from Sheet ===== */
function drawSpriteFrame(ctx,key,x,y,targetW,targetH,facing,animTime,speed){
  var s = SPRITE[key];
  if(!s) return;
  var img = IMG[s.img];
  if(!img || !img.loaded) return;
  speed = speed || 8;
  var frame = Math.floor(animTime * speed) % s.total;
  var col = frame % s.cols;
  var row = Math.floor(frame / s.cols);
  var fw = img.width / s.cols;
  var fh = img.height / s.rows;
  var sx = col * fw;
  var sy = row * fh;
  ctx.save();
  if(facing === -1){
    ctx.translate(x + targetW/2, 0);
    ctx.scale(-1, 1);
    ctx.translate(-(x + targetW/2), 0);
  }
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, sx, sy, fw, fh, x, y, targetW, targetH);
  ctx.restore();
}

/* ===== Draw Functions ===== */
function drawKnight(ctx,x,y,facing,state,time,hitFlash,attacking,vx,vy,onGround,attackTimer,ATK_DUR){
  var speed = (state==='walk') ? 10 : 4;
  var w = 26, h = 39;
  var px = x - 6;
  var py = y - 12;
  // هالة
  ctx.globalAlpha = 0.35;
  var halo = rg(ctx,x+6,y+10,22,[[0,hitFlash>0?'rgba(255,80,100,0.9)':'rgba(139,92,246,0.7)'],[1,'rgba(124,58,237,0)']]);
  ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(x+6,y+10,22,0,Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1;
  if(attacking){
    var prog = 1 - (attackTimer/ATK_DUR);
    var angle = Math.sin(prog*Math.PI) * 0.18;
    ctx.save();
    ctx.translate(x+6, y+10);
    ctx.rotate(angle);
    ctx.translate(-(x+6), -(y+10));
    drawSpriteFrame(ctx,'knight',px,py,w,h,facing,time,speed);
    ctx.restore();
  } else {
    drawSpriteFrame(ctx,'knight',px,py,w,h,facing,time,speed);
  }
  if(hitFlash > 0){
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'rgba(255,50,80,0.5)';
    ctx.fillRect(px,py,w,h);
    ctx.globalCompositeOperation = 'source-over';
  }
}

function drawEnemy(ctx,key,x,y,facing,time,hitFlash){
  var w = 24, h = 24;
  var px = x - 6, py = y - 4;
  ctx.globalAlpha = 0.35;
  var halo = rg(ctx,x+6,y+6,16,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(139,92,246,0.5)'],[1,'rgba(124,58,237,0)']]);
  ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(x+6,y+6,16,0,Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1;
  drawSpriteFrame(ctx,key,px,py,w,h,facing,time,7);
  if(hitFlash > 0){
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'rgba(255,50,80,0.55)';
    ctx.fillRect(px,py,w,h);
    ctx.globalCompositeOperation = 'source-over';
  }
}

function drawBoss(ctx,key,x,y,facing,time,hitFlash){
  var w = 60, h = 72;
  var px = x - 20, py = y - 25;
  ctx.globalAlpha = 0.5;
  var halo = rg(ctx,x+10,y+12,45,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(232,121,249,0.6)'],[1,'rgba(124,58,237,0)']]);
  ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(x+10,y+12,45,0,Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1;
  drawSpriteFrame(ctx,key,px,py,w,h,facing,time,4);
  if(hitFlash > 0){
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'rgba(255,50,80,0.55)';
    ctx.fillRect(px,py,w,h);
    ctx.globalCompositeOperation = 'source-over';
  }
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
  if(!img || !img.loaded) return;
  var frame = Math.floor(bob * 3) % 4;
  var fw = img.width/4;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, frame*fw, 0, fw, img.height, x-8, y-8, 16, 16);
}

function drawKeyItem(ctx,x,y,bob){
  var img = IMG.key;
  if(!img || !img.loaded) return;
  var frame = Math.floor(bob * 3) % 4;
  var fw = img.width/4;
  ctx.imageSmoothingEnabled = false;
  ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 15;
  ctx.drawImage(img, frame*fw, 0, fw, img.height, x-12, y-12, 24, 24);
  ctx.shadowBlur = 0;
}

function drawPortalItem(ctx,x,y,time){
  var img = IMG.portal;
  if(!img || !img.loaded) return;
  var frame = Math.floor(time * 4) % 4;
  var fw = img.width/4;
  ctx.imageSmoothingEnabled = false;
  ctx.shadowColor = '#06ffa5'; ctx.shadowBlur = 20;
  ctx.drawImage(img, frame*fw, 0, fw, img.height, x-20, y-20, 40, 40);
  ctx.shadowBlur = 0;
}

/* ===== NPCs ===== */
function drawShopkeeper(ctx,x,y,time){
  var img = IMG.shopkeeper;
  if(!img || !img.loaded){
    ctx.fillStyle='#fbbf24'; ctx.fillRect(x-10,y-20,20,30);
    return;
  }
  var frame = Math.floor(time * 4) % 4;
  var fw = img.width/2, fh = img.height/2;
  var col = frame % 2, row = Math.floor(frame/2);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, col*fw, row*fh, fw, fh, x-15, y-15, 30, 30);
}

function drawBlacksmith(ctx,x,y,time){
  var img = IMG.blacksmith;
  if(!img || !img.loaded){
    ctx.fillStyle='#dc2626'; ctx.fillRect(x-10,y-20,20,30);
    return;
  }
  var frame = Math.floor(time * 4) % 4;
  var fw = img.width/2, fh = img.height/2;
  var col = frame % 2, row = Math.floor(frame/2);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, col*fw, row*fh, fw, fh, x-15, y-15, 30, 30);
}
