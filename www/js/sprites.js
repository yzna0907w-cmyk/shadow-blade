function drawKnight(ctx,x,y,facing,state,time,hitFlash,attacking,vx,vy,onGround,attackTimer,ATK_DUR){
var breath=Math.sin(time*2)*0.5;
var stretch=1;
if(!onGround){if(vy<-30)stretch=1.12;else if(vy>60)stretch=0.94;}
var squash=1/stretch;
ctx.save();
ctx.translate(x+6,y+10);
if(facing===-1)ctx.scale(-1,1);
ctx.scale(squash,stretch);
var halo=ctx.createRadialGradient(0,-5,2,0,-5,24);
var aCol=hitFlash>0?'rgba(255,51,85,0.8)':'rgba(139,92,246,0.7)';
halo.addColorStop(0,aCol);halo.addColorStop(0.5,'rgba(124,58,237,0.15)');halo.addColorStop(1,'rgba(124,58,237,0)');
ctx.fillStyle=halo;ctx.beginPath();ctx.arc(0,-5,24,0,Math.PI*2);ctx.fill();
var cloakSway=vx*0.02+Math.sin(time*3)*1.5;
var cg=ctx.createLinearGradient(0,-8,0,10);
cg.addColorStop(0,'#2a1a4a');cg.addColorStop(0.5,'#1a1030');cg.addColorStop(1,'#050208');
ctx.fillStyle=cg;
ctx.beginPath();ctx.moveTo(-5,-6+breath*0.3);
ctx.quadraticCurveTo(-9,-2,-8+cloakSway,10);
ctx.quadraticCurveTo(-4,9,0,10);
ctx.quadraticCurveTo(4,9,8+cloakSway,10);
ctx.quadraticCurveTo(9,-2,5,-6+breath*0.3);ctx.closePath();ctx.fill();
ctx.strokeStyle='rgba(167,139,250,0.55)';ctx.lineWidth=0.5;ctx.stroke();
ctx.strokeStyle='#0a0518';ctx.lineWidth=2.4;ctx.lineCap='round';
var legSway=0,legBend=0;
if(state==='walk'){legSway=Math.sin(time*10)*3;legBend=Math.abs(Math.cos(time*10))*1.5;}
else if(state==='jump'||state==='fall'){legBend=4;}
ctx.beginPath();ctx.moveTo(-2,4);ctx.quadraticCurveTo(-2+legSway*0.5,6,-3+legSway,9-legBend*0.5);ctx.stroke();
ctx.beginPath();ctx.moveTo(2,4);ctx.quadraticCurveTo(2-legSway*0.5,6,3-legSway,9-legBend*0.5);ctx.stroke();
var bg=ctx.createRadialGradient(-2,-2,1,0,-2,7);
bg.addColorStop(0,'#2a1a4a');bg.addColorStop(1,'#0a0518');
ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(0,-2+breath*0.3,5,6,0,0,Math.PI*2);ctx.fill();
var hY=-10+breath*0.5,hT=Math.sin(time*2)*0.05;
var mg=ctx.createRadialGradient(-1,hY-2,0.5,0,hY,8);
mg.addColorStop(0,'#ffffff');mg.addColorStop(0.5,'#e8e0f5');mg.addColorStop(1,'#a89cc8');
ctx.fillStyle=mg;ctx.beginPath();ctx.ellipse(0,hY,6,7,hT,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#1a0a2e';ctx.lineWidth=0.6;ctx.stroke();
ctx.fillStyle='#0a0518';
ctx.beginPath();ctx.ellipse(-2,hY-1,1.6,2.6,0.2,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(2,hY-1,1.6,2.6,-0.2,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#c4b5fd';ctx.shadowColor='#a78bfa';ctx.shadowBlur=8;
ctx.beginPath();ctx.ellipse(-2,hY-1,0.9,1.6,0.2,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(2,hY-1,0.9,1.6,-0.2,0,Math.PI*2);ctx.fill();
ctx.shadowBlur=0;
var hSway=Math.sin(time*1.5)*0.3;
ctx.strokeStyle='#e8e0f5';ctx.lineWidth=2.6;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(-3,hY-4);ctx.quadraticCurveTo(-7+hSway,hY-12,-4+hSway*2,hY-17);ctx.stroke();
ctx.beginPath();ctx.moveTo(3,hY-4);ctx.quadraticCurveTo(7-hSway,hY-12,4-hSway*2,hY-17);ctx.stroke();
ctx.fillStyle='#c4b5fd';ctx.shadowColor='#a78bfa';ctx.shadowBlur=6;
ctx.beginPath();ctx.arc(-4+hSway*2,hY-17,1,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(4-hSway*2,hY-17,1,0,Math.PI*2);ctx.fill();
ctx.shadowBlur=0;
var armAngle=0;
if(attacking){var t=1-(attackTimer/ATK_DUR);armAngle=-Math.PI*0.3+t*Math.PI*1.3;}
else if(state==='walk')armAngle=Math.sin(time*10)*0.25;
else armAngle=Math.sin(time*2)*0.05;
ctx.save();ctx.translate(4,-2+breath*0.3);ctx.rotate(armAngle);
ctx.strokeStyle='#1a1030';ctx.lineWidth=2.6;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(4,0);ctx.stroke();
var sg=ctx.createLinearGradient(4,0,22,-3);
sg.addColorStop(0,'#f0e8ff');sg.addColorStop(0.5,'#ffffff');sg.addColorStop(1,'#fbbf24');
ctx.strokeStyle=sg;ctx.lineWidth=2.6;
ctx.shadowColor=attacking?'#fbbf24':'#a78bfa';ctx.shadowBlur=attacking?15:5;
ctx.beginPath();ctx.moveTo(4,0);ctx.lineTo(20,-3);ctx.stroke();
ctx.shadowBlur=0;
ctx.strokeStyle='#7c3aed';ctx.lineWidth=2;
ctx.beginPath();ctx.moveTo(2,1);ctx.lineTo(5,-1);ctx.stroke();
if(attacking&&attackTimer>ATK_DUR*0.3){
ctx.globalAlpha=0.45;ctx.strokeStyle='#fbbf24';ctx.lineWidth=5;
ctx.beginPath();ctx.moveTo(4,0);ctx.lineTo(18,-3);ctx.stroke();ctx.globalAlpha=1;}
ctx.restore();ctx.restore();
}

function drawEnemyBase(ctx,x,y,time,hitFlash,color1,color2,drawFn){
ctx.save();ctx.translate(x,y);
ctx.globalAlpha=0.3;
var h=ctx.createRadialGradient(0,0,2,0,0,14);
h.addColorStop(0,hitFlash>0?'rgba(255,255,255,0.9)':color1);
h.addColorStop(1,'rgba(0,0,0,0)');
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,14,0,Math.PI*2);ctx.fill();
ctx.globalAlpha=1;
drawFn(ctx,time);
ctx.restore();
}

function drawBat(ctx,x,y,facing,time,hitFlash){
drawEnemyBase(ctx,x+6,y+6,time,hitFlash,'rgba(255,51,85,0.8)',null,function(c,t){
var flap=Math.sin(t*12)*4;
c.fillStyle='#7f1d1d';
c.beginPath();c.moveTo(-2,-1);c.quadraticCurveTo(-9,-3-flap,-11,2);c.quadraticCurveTo(-7,1,-5,3);c.lineTo(-2,2);c.closePath();c.fill();
c.beginPath();c.moveTo(2,-1);c.quadraticCurveTo(9,-3-flap,11,2);c.quadraticCurveTo(7,1,5,3);c.lineTo(2,2);c.closePath();c.fill();
c.strokeStyle='#050508';c.lineWidth=0.5;c.stroke();
var g=c.createRadialGradient(0,0,0.5,0,0,5);
g.addColorStop(0,'#dc2626');g.addColorStop(1,'#7f1d1d');
c.fillStyle=g;c.beginPath();c.ellipse(0,0,4,4.5,0,0,Math.PI*2);c.fill();
c.fillStyle='#7f1d1d';
c.beginPath();c.moveTo(-2.5,-4);c.lineTo(-3.5,-7);c.lineTo(-1,-5);c.closePath();c.fill();
c.beginPath();c.moveTo(2.5,-4);c.lineTo(3.5,-7);c.lineTo(1,-5);c.closePath();c.fill();
c.fillStyle='#ffd166';c.shadowColor='#ffd166';c.shadowBlur=4;
c.beginPath();c.arc(-1.5,-0.5,0.9,0,Math.PI*2);c.fill();
c.beginPath();c.arc(1.5,-0.5,0.9,0,Math.PI*2);c.fill();c.shadowBlur=0;});
}

function drawSlime(ctx,x,y,facing,time,hitFlash){
drawEnemyBase(ctx,x+5,y+8,time,hitFlash,'rgba(74,222,128,0.8)',null,function(c,t){
var sq=Math.sin(t*4)*0.15+1,sc=1/sq;
var g=c.createRadialGradient(-1,0,1,0,4,8);
g.addColorStop(0,'#86efac');g.addColorStop(0.5,'#4ade80');g.addColorStop(1,'#166534');
c.fillStyle=g;
c.beginPath();c.moveTo(0,-6*sc);c.quadraticCurveTo(7*sq,-2,7*sq,3);c.quadraticCurveTo(7*sq,7,0,7);c.quadraticCurveTo(-7*sq,7,-7*sq,3);c.quadraticCurveTo(-7*sq,-2,0,-6*sc);c.fill();
c.strokeStyle='#050508';c.lineWidth=0.5;c.stroke();
c.fillStyle='rgba(255,255,255,0.5)';c.beginPath();c.ellipse(-2,0,2,1.5,-0.5,0,Math.PI*2);c.fill();
c.fillStyle='#050508';c.beginPath();c.arc(-2,2,0.9,0,Math.PI*2);c.fill();c.beginPath();c.arc(2,2,0.9,0,Math.PI*2);c.fill();});
}

function drawSkeleton(ctx,x,y,facing,time,hitFlash){
drawEnemyBase(ctx,x+5,y+6,time,hitFlash,'rgba(148,163,184,0.8)',null,function(c,t){
var b=Math.sin(t*6)*1;
c.strokeStyle='#e2e8f0';c.lineWidth=1.5;c.lineCap='round';
for(var i=0;i<3;i++){c.beginPath();c.moveTo(-4,2+i*2.5);c.quadraticCurveTo(0,3+i*2.5,4,2+i*2.5);c.stroke();}
c.beginPath();c.moveTo(0,0);c.lineTo(0,10);c.stroke();
c.fillStyle='#e2e8f0';c.beginPath();c.ellipse(0,-3+b,4,4.5,0,0,Math.PI*2);c.fill();
c.fillStyle='#cbd5e1';c.beginPath();c.ellipse(0,0.5+b,3,1.8,0,0,Math.PI);c.fill();
c.fillStyle='#050508';c.beginPath();c.ellipse(-1.5,-3+b,1.1,1.5,0,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(1.5,-3+b,1.1,1.5,0,0,Math.PI*2);c.fill();
c.fillStyle='#ff3355';c.shadowColor='#ff3355';c.shadowBlur=4;
c.beginPath();c.arc(-1.5,-3+b,0.5,0,Math.PI*2);c.fill();c.beginPath();c.arc(1.5,-3+b,0.5,0,Math.PI*2);c.fill();c.shadowBlur=0;});
}

function drawImp(ctx,x,y,facing,time,hitFlash){
drawEnemyBase(ctx,x+6,y+6,time,hitFlash,'rgba(255,159,28,0.9)',null,function(c,t){
var flap=Math.sin(t*10)*3;
c.fillStyle='#7f1d1d';
c.beginPath();c.moveTo(-2,0);c.quadraticCurveTo(-9,-2-flap,-11,3);c.quadraticCurveTo(-7,1,-2,2);c.closePath();c.fill();
c.beginPath();c.moveTo(2,0);c.quadraticCurveTo(9,-2-flap,11,3);c.quadraticCurveTo(7,1,2,2);c.closePath();c.fill();
var g=c.createRadialGradient(0,0,1,0,0,5);
g.addColorStop(0,'#ff9f1c');g.addColorStop(0.6,'#dc2626');g.addColorStop(1,'#7f1d1d');
c.fillStyle=g;c.beginPath();c.ellipse(0,0,4,4.5,0,0,Math.PI*2);c.fill();
c.strokeStyle='#050508';c.lineWidth=1.8;c.lineCap='round';
c.beginPath();c.moveTo(-2.5,-3.5);c.quadraticCurveTo(-4,-6,-2.5,-7.5);c.stroke();
c.beginPath();c.moveTo(2.5,-3.5);c.quadraticCurveTo(4,-6,2.5,-7.5);c.stroke();
c.fillStyle='#ffd166';c.shadowColor='#ffd166';c.shadowBlur=6;
c.beginPath();c.arc(-1.3,-0.5,0.9,0,Math.PI*2);c.fill();c.beginPath();c.arc(1.3,-0.5,0.9,0,Math.PI*2);c.fill();c.shadowBlur=0;});
}

function drawFireGolem(ctx,x,y,facing,time,hitFlash){
drawEnemyBase(ctx,x+6,y+6,time,hitFlash,'rgba(255,107,0,0.95)',null,function(c,t){
var p=Math.sin(t*5)*0.15+1;
var g=c.createRadialGradient(-2,-2,1,0,0,7);
g.addColorStop(0,'#ff9f1c');g.addColorStop(0.5,'#dc2626');g.addColorStop(1,'#450a0a');
c.fillStyle=g;c.beginPath();c.arc(0,0,6*p,0,Math.PI*2);c.fill();
c.strokeStyle='#fbbf24';c.lineWidth=1;c.shadowColor='#fbbf24';c.shadowBlur=7;
c.beginPath();c.moveTo(-3,-3);c.lineTo(-1,0);c.lineTo(-2,3);c.moveTo(2,-4);c.lineTo(3,-1);c.lineTo(2,2);c.stroke();c.shadowBlur=0;
c.fillStyle='#fff8dc';c.shadowColor='#fbbf24';c.shadowBlur=9;
c.beginPath();c.arc(-2,-1,1.1,0,Math.PI*2);c.fill();c.beginPath();c.arc(2,-1,1.1,0,Math.PI*2);c.fill();c.shadowBlur=0;});
}

function drawIceWraith(ctx,x,y,facing,time,hitFlash){
drawEnemyBase(ctx,x+5,y+6,time,hitFlash,'rgba(0,212,255,0.8)',null,function(c,t){
var f=Math.sin(t*3)*2;
var g=c.createLinearGradient(0,-6+f,0,6+f);
g.addColorStop(0,'#e0f2fe');g.addColorStop(0.5,'#7dd3fc');g.addColorStop(1,'rgba(2,132,199,0.3)');
c.fillStyle=g;
c.beginPath();c.moveTo(0,-6+f);c.quadraticCurveTo(5,-3+f,4,0+f);c.quadraticCurveTo(4,3+f,2,5+f);c.quadraticCurveTo(0,7+f,-2,5+f);c.quadraticCurveTo(-4,3+f,-4,0+f);c.quadraticCurveTo(-5,-3+f,0,-6+f);c.fill();
c.fillStyle='#0c4a6e';c.beginPath();c.ellipse(-1.5,0+f,0.9,1.3,0,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(1.5,0+f,0.9,1.3,0,0,Math.PI*2);c.fill();});
}

function drawFrostSpider(ctx,x,y,facing,time,hitFlash){
drawEnemyBase(ctx,x+6,y+5,time,hitFlash,'rgba(125,211,252,0.8)',null,function(c,t){
var lm=Math.sin(t*8)*1.5;
c.strokeStyle='#0c4a6e';c.lineWidth=1.3;c.lineCap='round';
for(var i=0;i<4;i++){
c.beginPath();c.moveTo(-3,0);c.quadraticCurveTo(-6,-2+i,-8,2+i*2+lm);c.stroke();
c.beginPath();c.moveTo(3,0);c.quadraticCurveTo(6,-2+i,8,2+i*2-lm);c.stroke();}
var g=c.createRadialGradient(-1,-1,1,0,0,6);
g.addColorStop(0,'#e0f2fe');g.addColorStop(1,'#0369a1');
c.fillStyle=g;c.beginPath();c.ellipse(0,0,5,4,0,0,Math.PI*2);c.fill();
c.fillStyle='#dc2626';c.shadowColor='#dc2626';c.shadowBlur=5;
c.beginPath();c.arc(-1.5,-1,0.8,0,Math.PI*2);c.fill();c.beginPath();c.arc(1.5,-1,0.8,0,Math.PI*2);c.fill();c.shadowBlur=0;});
}

function drawIceGolem(ctx,x,y,facing,time,hitFlash){
drawEnemyBase(ctx,x+6,y+6,time,hitFlash,'rgba(125,211,252,0.9)',null,function(c,t){
var p=Math.sin(t*3)*0.1+1;
var g=c.createRadialGradient(-2,-2,1,0,0,7);
g.addColorStop(0,'#ffffff');g.addColorStop(0.4,'#7dd3fc');g.addColorStop(1,'#0369a1');
c.fillStyle=g;
c.beginPath();c.moveTo(0,-7*p);c.lineTo(6*p,-2);c.lineTo(6*p,4);c.lineTo(0,7*p);c.lineTo(-6*p,4);c.lineTo(-6*p,-2);c.closePath();c.fill();
c.strokeStyle='#0c4a6e';c.lineWidth=0.6;c.stroke();
c.strokeStyle='rgba(255,255,255,0.8)';c.lineWidth=0.5;
c.beginPath();c.moveTo(-2,-4);c.lineTo(1,0);c.lineTo(-1,3);c.stroke();
c.fillStyle='#0c4a6e';c.beginPath();c.arc(-2,-1,1,0,Math.PI*2);c.fill();c.beginPath();c.arc(2,-1,1,0,Math.PI*2);c.fill();});
}

function drawShadowBeast(ctx,x,y,facing,time,hitFlash){
drawEnemyBase(ctx,x+6,y+6,time,hitFlash,'rgba(232,121,249,0.9)',null,function(c,t){
var flap=Math.sin(t*8)*4;
c.fillStyle='rgba(10,5,24,0.95)';
c.beginPath();c.moveTo(-2,0);c.quadraticCurveTo(-11,-4-flap,-13,3);c.quadraticCurveTo(-8,2,-2,3);c.closePath();c.fill();
c.beginPath();c.moveTo(2,0);c.quadraticCurveTo(11,-4-flap,13,3);c.quadraticCurveTo(8,2,2,3);c.closePath();c.fill();
var g=c.createRadialGradient(0,0,1,0,0,5);
g.addColorStop(0,'#c084fc');g.addColorStop(1,'#1e1b4b');
c.fillStyle=g;c.beginPath();c.arc(0,0,4.5,0,Math.PI*2);c.fill();
c.fillStyle='#e879f9';c.shadowColor='#e879f9';c.shadowBlur=7;
c.beginPath();c.arc(-1.5,-0.5,0.9,0,Math.PI*2);c.fill();c.beginPath();c.arc(1.5,-0.5,0.9,0,Math.PI*2);c.fill();c.shadowBlur=0;});
}

function drawVoidCrawler(ctx,x,y,facing,time,hitFlash){
drawEnemyBase(ctx,x+6,y+5,time,hitFlash,'rgba(167,139,250,0.9)',null,function(c,t){
var lm=Math.sin(t*10)*2;
c.strokeStyle='#1e1b4b';c.lineWidth=1.6;c.lineCap='round';
for(var i=0;i<3;i++){
c.beginPath();c.moveTo(-3,0);c.lineTo(-6-i,3+i+lm);c.stroke();
c.beginPath();c.moveTo(3,0);c.lineTo(6+i,3+i-lm);c.stroke();}
var g=c.createRadialGradient(-1,-1,1,0,0,6);
g.addColorStop(0,'#c4b5fd');g.addColorStop(1,'#4c1d95');
c.fillStyle=g;c.beginPath();c.ellipse(0,0,5,4,0,0,Math.PI*2);c.fill();
c.fillStyle='#e879f9';c.shadowColor='#e879f9';c.shadowBlur=6;
c.beginPath();c.arc(-1.5,-1,1,0,Math.PI*2);c.fill();c.beginPath();c.arc(1.5,-1,1,0,Math.PI*2);c.fill();c.shadowBlur=0;});
}

function drawNightmare(ctx,x,y,facing,time,hitFlash){
drawEnemyBase(ctx,x+6,y+6,time,hitFlash,'rgba(139,92,246,0.95)',null,function(c,t){
var p=Math.sin(t*4)*0.2+1;
var g=c.createRadialGradient(0,0,1,0,0,7);
g.addColorStop(0,'#e9d5ff');g.addColorStop(0.5,'#8b5cf6');g.addColorStop(1,'#1e1b4b');
c.fillStyle=g;c.beginPath();c.arc(0,0,6*p,0,Math.PI*2);c.fill();
c.strokeStyle='#4c1d95';c.lineWidth=2.2;c.lineCap='round';
c.beginPath();c.moveTo(-3,-4);c.lineTo(-5,-8);c.moveTo(3,-4);c.lineTo(5,-8);c.stroke();
c.strokeStyle='#050508';c.lineWidth=1;
c.beginPath();c.moveTo(-3,2);c.quadraticCurveTo(0,4,3,2);c.stroke();
c.fillStyle='#fff';
for(var i=0;i<4;i++){c.beginPath();c.moveTo(-2+i*1.3,2.2);c.lineTo(-1.5+i*1.3,3.5);c.lineTo(-1+i*1.3,2.2);c.fill();}
c.fillStyle='#e879f9';c.shadowColor='#e879f9';c.shadowBlur=9;
c.beginPath();c.arc(-2,-1,1.2,0,Math.PI*2);c.fill();c.beginPath();c.arc(2,-1,1.2,0,Math.PI*2);c.fill();c.shadowBlur=0;});
}

function drawSkeletonKing(ctx,x,y,facing,time,hitFlash){
var b=Math.sin(time*3)*1.5;
ctx.save();ctx.translate(x+10,y+12);
ctx.globalAlpha=0.5;
var h=ctx.createRadialGradient(0,0,4,0,0,32);
h.addColorStop(0,'rgba(226,232,240,0.7)');h.addColorStop(1,'rgba(226,232,240,0)');
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,32,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var cl=ctx.createLinearGradient(0,-5,0,15);
cl.addColorStop(0,'#4a044e');cl.addColorStop(1,'#1e1b4b');
ctx.fillStyle=cl;ctx.beginPath();ctx.moveTo(-10,-6);ctx.quadraticCurveTo(-13,5,-12,15);ctx.lineTo(12,15);ctx.quadraticCurveTo(13,5,10,-6);ctx.closePath();ctx.fill();
ctx.strokeStyle='#fbbf24';ctx.lineWidth=1.2;ctx.stroke();
ctx.fillStyle='#e2e8f0';ctx.beginPath();ctx.arc(-8,-5,2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(8,-5,2,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#e2e8f0';ctx.beginPath();ctx.ellipse(0,-10+b,7,8,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#cbd5e1';ctx.beginPath();ctx.ellipse(0,-4+b,5.5,3,0,0,Math.PI);ctx.fill();
ctx.fillStyle='#e2e8f0';for(var i=0;i<5;i++){ctx.fillRect(-4+i*2,-4+b,1,2);}
ctx.fillStyle='#ff3355';ctx.shadowColor='#ff3355';ctx.shadowBlur=14;
ctx.beginPath();ctx.ellipse(-2.5,-11+b,1.6,2.2,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(2.5,-11+b,1.6,2.2,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#fbbf24';ctx.strokeStyle='#78350f';ctx.lineWidth=0.6;
ctx.beginPath();ctx.moveTo(-7,-17+b);ctx.lineTo(-5,-22+b);ctx.lineTo(-3,-18+b);ctx.lineTo(0,-23+b);ctx.lineTo(3,-18+b);ctx.lineTo(5,-22+b);ctx.lineTo(7,-17+b);ctx.closePath();ctx.fill();ctx.stroke();
ctx.fillStyle='#ff3355';ctx.beginPath();ctx.arc(0,-21+b,0.9,0,Math.PI*2);ctx.fill();
ctx.restore();
}

function drawFireDemon(ctx,x,y,facing,time,hitFlash){
var p=Math.sin(time*4)*0.15+1,flap=Math.sin(time*6)*4;
ctx.save();ctx.translate(x+10,y+12);
ctx.globalAlpha=0.5;
var h=ctx.createRadialGradient(0,0,4,0,0,36);
h.addColorStop(0,'rgba(255,107,0,0.9)');h.addColorStop(0.5,'rgba(220,38,38,0.5)');h.addColorStop(1,'rgba(220,38,38,0)');
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,36,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var wg=ctx.createLinearGradient(-14,-5,-5,8);
wg.addColorStop(0,'#dc2626');wg.addColorStop(1,'#7f1d1d');
ctx.fillStyle=wg;
ctx.beginPath();ctx.moveTo(-4,-3);ctx.quadraticCurveTo(-15,-6-flap,-17,6);ctx.quadraticCurveTo(-12,4,-8,7);ctx.quadraticCurveTo(-5,5,-4,4);ctx.closePath();ctx.fill();
ctx.beginPath();ctx.moveTo(4,-3);ctx.quadraticCurveTo(15,-6-flap,17,6);ctx.quadraticCurveTo(12,4,8,7);ctx.quadraticCurveTo(5,5,4,4);ctx.closePath();ctx.fill();
var bg=ctx.createRadialGradient(-2,-2,2,0,0,10);
bg.addColorStop(0,'#ff9f1c');bg.addColorStop(0.4,'#dc2626');bg.addColorStop(1,'#450a0a');
ctx.fillStyle=bg;ctx.beginPath();ctx.arc(0,0,9*p,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#fbbf24';ctx.lineWidth=1.6;ctx.shadowColor='#fbbf24';ctx.shadowBlur=12;
ctx.beginPath();ctx.moveTo(-4,-5);ctx.lineTo(-2,0);ctx.lineTo(-4,5);ctx.moveTo(3,-6);ctx.lineTo(5,-1);ctx.lineTo(3,4);ctx.moveTo(-1,-8);ctx.lineTo(1,-4);ctx.stroke();ctx.shadowBlur=0;
ctx.strokeStyle='#450a0a';ctx.lineWidth=3;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(-5,-6);ctx.quadraticCurveTo(-9,-12,-6,-15);ctx.stroke();
ctx.beginPath();ctx.moveTo(5,-6);ctx.quadraticCurveTo(9,-12,6,-15);ctx.stroke();
ctx.fillStyle='#fff8dc';ctx.shadowColor='#ff9f1c';ctx.shadowBlur=16;
ctx.beginPath();ctx.ellipse(-3,-1,1.6,2.2,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(3,-1,1.6,2.2,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.restore();
}

function drawIceQueen(ctx,x,y,facing,time,hitFlash){
var f=Math.sin(time*2.5)*2;
ctx.save();ctx.translate(x+8,y+12);
ctx.globalAlpha=0.55;
var h=ctx.createRadialGradient(0,f,4,0,f,34);
h.addColorStop(0,'rgba(125,211,252,0.9)');h.addColorStop(1,'rgba(125,211,252,0)');
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,f,34,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var d=ctx.createLinearGradient(0,-5,0,15);
d.addColorStop(0,'#7dd3fc');d.addColorStop(0.5,'#0ea5e9');d.addColorStop(1,'#0c4a6e');
ctx.fillStyle=d;
ctx.beginPath();ctx.moveTo(0,-8+f);ctx.quadraticCurveTo(8,-2+f,9,12);ctx.lineTo(-9,12);ctx.quadraticCurveTo(-8,-2+f,0,-8+f);ctx.closePath();ctx.fill();
ctx.strokeStyle='#e0f2fe';ctx.lineWidth=0.8;ctx.globalAlpha=0.7;ctx.stroke();ctx.globalAlpha=1;
var sk=ctx.createRadialGradient(-1,-10+f,1,0,-10+f,6);
sk.addColorStop(0,'#ffffff');sk.addColorStop(0.7,'#bae6fd');sk.addColorStop(1,'#0ea5e9');
ctx.fillStyle=sk;ctx.beginPath();ctx.ellipse(0,-11+f,5,5.5,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#e0f2fe';ctx.strokeStyle='#0369a1';ctx.lineWidth=0.5;
for(var i=0;i<5;i++){var a=(i-2)*0.5,tx=Math.sin(a)*7,ty=-16+f-Math.cos(a)*4;
ctx.beginPath();ctx.moveTo(tx-1,-15+f);ctx.lineTo(tx,ty);ctx.lineTo(tx+1,-15+f);ctx.closePath();ctx.fill();ctx.stroke();}
ctx.fillStyle='#0c4a6e';ctx.beginPath();ctx.ellipse(-2,-11+f,1,1.4,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(2,-11+f,1,1.4,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#0c4a6e';ctx.lineWidth=0.4;
ctx.beginPath();ctx.moveTo(-1.5,-8+f);ctx.quadraticCurveTo(0,-7+f,1.5,-8+f);ctx.stroke();
ctx.fillStyle='#bae6fd';ctx.globalAlpha=0.7;
for(var j=0;j<3;j++){var angle=time*1.5+j*2.1,r=12+Math.sin(time+j)*2;
var px=Math.cos(angle)*r,py=Math.sin(angle)*r*0.5+f;
ctx.beginPath();ctx.arc(px,py,1.2,0,Math.PI*2);ctx.fill();}
ctx.globalAlpha=1;ctx.restore();
}

function drawShadowLord(ctx,x,y,facing,time,hitFlash){
var p=Math.sin(time*3)*0.1+1,f=Math.sin(time*2)*2;
ctx.save();ctx.translate(x+9,y+12);
ctx.globalAlpha=0.6;
var h=ctx.createRadialGradient(0,f,4,0,f,40);
h.addColorStop(0,'rgba(232,121,249,0.9)');h.addColorStop(0.5,'rgba(124,58,237,0.5)');h.addColorStop(1,'rgba(30,27,75,0)');
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,f,40,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
for(var i=0;i<5;i++){var angle=time*2+i*1.26,r=15;
var px=Math.cos(angle)*r,py=Math.sin(angle)*r*0.4+f;
ctx.fillStyle='rgba(192,132,252,0.8)';ctx.beginPath();ctx.arc(px,py,1.3,0,Math.PI*2);ctx.fill();}
var cl=ctx.createLinearGradient(0,-8,0,15);
cl.addColorStop(0,'#4c1d95');cl.addColorStop(0.5,'#1e1b4b');cl.addColorStop(1,'#050208');
ctx.fillStyle=cl;
ctx.beginPath();ctx.moveTo(-3,-6+f);ctx.quadraticCurveTo(-12,-2+f,-11,13);ctx.lineTo(11,13);ctx.quadraticCurveTo(12,-2+f,3,-6+f);ctx.closePath();ctx.fill();
ctx.strokeStyle='#e879f9';ctx.lineWidth=0.7;ctx.globalAlpha=0.8;ctx.stroke();ctx.globalAlpha=1;
var hd=ctx.createRadialGradient(-1,-10+f,1,0,-10+f,7);
hd.addColorStop(0,'#e9d5ff');hd.addColorStop(0.5,'#8b5cf6');hd.addColorStop(1,'#1e1b4b');
ctx.fillStyle=hd;ctx.beginPath();ctx.ellipse(0,-10+f,6,7*p,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#4c1d95';ctx.lineWidth=2.6;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(-5,-14+f);ctx.quadraticCurveTo(-9,-20+f,-6,-24+f);ctx.stroke();
ctx.beginPath();ctx.moveTo(5,-14+f);ctx.quadraticCurveTo(9,-20+f,6,-24+f);ctx.stroke();
ctx.fillStyle='#e879f9';ctx.shadowColor='#e879f9';ctx.shadowBlur=16;
ctx.beginPath();ctx.arc(-2.5,-11+f,1.4,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.5,-11+f,1.4,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(0,-7+f,1,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.restore();
}

function drawCoinItem(ctx,x,y,bob){
ctx.save();ctx.translate(x,y+Math.sin(bob)*2);
ctx.globalAlpha=0.55;
var h=ctx.createRadialGradient(0,0,1,0,0,9);
h.addColorStop(0,'rgba(251,191,36,0.95)');h.addColorStop(1,'rgba(251,191,36,0)');
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,9,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var g=ctx.createRadialGradient(-1,-1,0.5,0,0,4);
g.addColorStop(0,'#fff8dc');g.addColorStop(0.5,'#fbbf24');g.addColorStop(1,'#a16207');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,3.5,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#78350f';ctx.lineWidth=0.5;ctx.stroke();
ctx.fillStyle='#78350f';ctx.fillRect(-0.5,-2,1,4);
ctx.restore();
}

function drawKeyItem(ctx,x,y,bob){
ctx.save();ctx.translate(x,y+Math.sin(bob)*2);
ctx.globalAlpha=0.7;
var h=ctx.createRadialGradient(0,0,2,0,0,15);
h.addColorStop(0,'rgba(251,191,36,1)');h.addColorStop(1,'rgba(251,191,36,0)');
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,15,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
ctx.fillStyle='#fbbf24';ctx.strokeStyle='#78350f';ctx.lineWidth=0.7;
ctx.beginPath();ctx.arc(0,-3,3,0,Math.PI*2);ctx.fill();ctx.stroke();
ctx.fillStyle='#78350f';ctx.beginPath();ctx.arc(0,-3,1,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#fbbf24';ctx.lineWidth=2;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(0,-1);ctx.lineTo(0,6);ctx.stroke();
ctx.lineWidth=1.5;
ctx.beginPath();ctx.moveTo(0,4);ctx.lineTo(2,4);ctx.moveTo(0,6);ctx.lineTo(2,6);ctx.stroke();
ctx.restore();
}

function drawPortalItem(ctx,x,y,time){
ctx.save();ctx.translate(x,y+6);
var p=1+Math.sin(time*3)*0.12;
var h=ctx.createRadialGradient(0,0,3,0,0,24*p);
h.addColorStop(0,'rgba(6,255,165,0.95)');h.addColorStop(0.5,'rgba(6,255,165,0.4)');h.addColorStop(1,'rgba(6,255,165,0)');
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,24*p,0,Math.PI*2);ctx.fill();
var pt=ctx.createRadialGradient(0,0,2,0,0,10);
pt.addColorStop(0,'#ffffff');pt.addColorStop(0.4,'#06ffa5');pt.addColorStop(1,'#047857');
ctx.fillStyle=pt;ctx.beginPath();ctx.ellipse(0,0,7*p,12,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#06ffa5';ctx.lineWidth=1.2;ctx.globalAlpha=0.9;ctx.stroke();ctx.globalAlpha=1;
for(var i=0;i<6;i++){var a=time*2+i*1.05,r=10+Math.sin(time*2+i)*4;
ctx.fillStyle='#a7f3d0';ctx.beginPath();ctx.arc(Math.cos(a)*r,Math.sin(a)*r,1.2,0,Math.PI*2);ctx.fill();}
ctx.restore();
}
