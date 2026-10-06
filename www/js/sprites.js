function lg(c,x1,y1,x2,y2,s){var g=c.createLinearGradient(x1,y1,x2,y2);for(var i=0;i<s.length;i++)g.addColorStop(s[i][0],s[i][1]);return g;}
function rg(c,x,y,r,s){var g=c.createRadialGradient(x,y,0,x,y,r);for(var i=0;i<s.length;i++)g.addColorStop(s[i][0],s[i][1]);return g;}

function drawKnight(ctx,x,y,facing,state,time,hitFlash,attacking,vx,vy,onGround,attackTimer,ATK_DUR){
var t=time,breath=Math.sin(t*1.8)*0.7,inAir=!onGround;
var stretch=1;
if(inAir){if(vy<-50)stretch=1.14;else if(vy>100)stretch=0.93;}
else stretch=1+breath*0.006;
var squash=1/stretch;
ctx.save();ctx.translate(x+6,y+10);if(facing===-1)ctx.scale(-1,1);
var sh=rg(ctx,0,11,8,[[0,'rgba(0,0,0,0.6)'],[1,'rgba(0,0,0,0)']]);
ctx.fillStyle=sh;ctx.beginPath();ctx.ellipse(0,11,7,2,0,0,Math.PI*2);ctx.fill();
var halo=rg(ctx,0,-4,26,[[0,hitFlash>0?'rgba(255,90,120,0.9)':'rgba(139,92,246,0.55)'],[0.4,'rgba(124,58,237,0.15)'],[1,'rgba(124,58,237,0)']]);
ctx.fillStyle=halo;ctx.beginPath();ctx.arc(0,-4,26,0,Math.PI*2);ctx.fill();
for(var i=0;i<5;i++){var pA=t*1.2+i*1.25,pR=10+Math.sin(t*2+i)*3;
var px=Math.cos(pA)*pR,py=Math.sin(pA)*pR-6;
ctx.fillStyle='rgba(196,181,253,'+(0.25+Math.sin(t*3+i)*0.15)+')';
ctx.beginPath();ctx.arc(px,py,0.9,0,Math.PI*2);ctx.fill();}
ctx.save();ctx.scale(squash,stretch);
var sway=vx*0.018+Math.sin(t*2.5)*1.3,billow=inAir?1.6:1;
var clk=lg(ctx,0,-7,0,12,[[0,'#2a1a4a'],[0.35,'#1a0f30'],[0.75,'#0a0518'],[1,'#050208']]);
ctx.fillStyle=clk;
ctx.beginPath();
ctx.moveTo(-4.5,-3);
ctx.bezierCurveTo(-7,-1,-8.5+sway*0.5,-1,-9.5+sway*billow*0.7,7);
ctx.bezierCurveTo(-10+sway*billow,0,-7.5+sway*billow,11.5,-4+sway*0.6,12);
ctx.bezierCurveTo(-2.5,12.3,-1.5,12.5,0,13);
ctx.bezierCurveTo(1.5,12.5,2.5,12.3,4+sway*0.6,12);
ctx.bezierCurveTo(7.5+sway*billow,11.5,10+sway*billow,0,9.5+sway*billow*0.7,7);
ctx.bezierCurveTo(8.5+sway*0.5,-1,7,-1,4.5,-3);
ctx.closePath();ctx.fill();
ctx.strokeStyle='rgba(167,139,250,0.45)';ctx.lineWidth=0.6;ctx.stroke();
ctx.strokeStyle='rgba(196,181,253,0.18)';ctx.lineWidth=0.4;
ctx.beginPath();ctx.moveTo(-2,-1);ctx.bezierCurveTo(-3,3,-2.5,7,-1.5,11);ctx.stroke();
ctx.beginPath();ctx.moveTo(2,-1);ctx.bezierCurveTo(3,3,2.5,7,1.5,11);ctx.stroke();
ctx.beginPath();ctx.moveTo(0,-2);ctx.lineTo(0,10);ctx.stroke();
var legL=state==='walk'?Math.sin(t*10)*3:0,legBend=inAir?4:0;
ctx.strokeStyle='#0a0518';ctx.lineWidth=2.8;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(-2,9);ctx.bezierCurveTo(-2+legL*0.4,11,-2.5+legL,13-legBend*0.5,-3+legL,14-legBend);ctx.stroke();
ctx.beginPath();ctx.moveTo(2,9);ctx.bezierCurveTo(2-legL*0.4,11,2.5-legL,13-legBend*0.5,3-legL,14-legBend);ctx.stroke();
var hY=-9+breath*0.6,hT=Math.sin(t*2)*0.05+(vx||0)*0.003;
ctx.save();ctx.translate(0,hY);ctx.rotate(hT);
var mS=rg(ctx,0,0,9,[[0,'rgba(0,0,0,0.35)'],[1,'rgba(0,0,0,0)']]);
ctx.fillStyle=mS;ctx.beginPath();ctx.ellipse(0,0,8,9,0,0,Math.PI*2);ctx.fill();
var hornSway=Math.sin(t*1.5)*0.5+(vx||0)*0.005;
ctx.fillStyle='#f5f0ff';ctx.strokeStyle='#1a0a2e';ctx.lineWidth=0.5;
ctx.beginPath();
ctx.moveTo(-2.5,-4);
ctx.bezierCurveTo(-4.5,-8,-6-hornSway,-12,-4-hornSway*1.2,-16);
ctx.bezierCurveTo(-3.3-hornSway*1.2,-15,-2.8,-13,-2,-10.5);
ctx.closePath();ctx.fill();ctx.stroke();
ctx.beginPath();
ctx.moveTo(2.5,-4);
ctx.bezierCurveTo(4.5,-8,6+hornSway,-12,4+hornSway*1.2,-16);
ctx.bezierCurveTo(3.3+hornSway*1.2,-15,2.8,-13,2,-10.5);
ctx.closePath();ctx.fill();ctx.stroke();
ctx.fillStyle='#c4b5fd';
ctx.beginPath();ctx.arc(-4-hornSway*1.2,-16,0.7,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(4+hornSway*1.2,-16,0.7,0,Math.PI*2);ctx.fill();
var mG=rg(ctx,-1.5,-1,7,[[0,'#ffffff'],[0.5,'#ede9fe'],[0.85,'#c4b5fd'],[1,'#a78bfa']]);
ctx.fillStyle=mG;
ctx.beginPath();
ctx.moveTo(0,-6);
ctx.bezierCurveTo(3,-6,5,-4.5,5.2,-2);
ctx.bezierCurveTo(5.2,0.5,4,3,2,4.5);
ctx.bezierCurveTo(1,5.2,0,5.5,0,5.5);
ctx.bezierCurveTo(0,5.5,-1,5.2,-2,4.5);
ctx.bezierCurveTo(-4,3,-5.2,0.5,-5.2,-2);
ctx.bezierCurveTo(-5,-4.5,-3,-6,0,-6);
ctx.closePath();ctx.fill();
ctx.strokeStyle='#4c1d95';ctx.lineWidth=0.5;ctx.stroke();
ctx.strokeStyle='rgba(124,58,237,0.4)';ctx.lineWidth=0.4;
ctx.beginPath();ctx.moveTo(-3,-3);ctx.lineTo(-3,2);ctx.stroke();
ctx.beginPath();ctx.moveTo(3,-3);ctx.lineTo(3,2);ctx.stroke();
var eg=attacking?9:5;
ctx.fillStyle='#0a0518';
ctx.beginPath();ctx.ellipse(-1.8,0,1.7,2.7,0.15,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(1.8,0,1.7,2.7,-0.15,0,Math.PI*2);ctx.fill();
ctx.fillStyle=attacking?'#fbbf24':'#c4b5fd';
ctx.shadowColor=attacking?'#fbbf24':'#a78bfa';ctx.shadowBlur=eg;
ctx.beginPath();ctx.ellipse(-1.8,0,1,1.8,0.15,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(1.8,0,1,1.8,-0.15,0,Math.PI*2);ctx.fill();
ctx.shadowBlur=0;
ctx.fillStyle='rgba(255,255,255,0.75)';
ctx.beginPath();ctx.arc(-2.3,-0.8,0.4,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.3,-0.8,0.4,0,Math.PI*2);ctx.fill();
ctx.restore();
var armA=0,armX=0;
if(attacking){var pr=1-(attackTimer/ATK_DUR);var e=pr<0.5?pr*2:(1-(pr-0.5)*2);
armA=-Math.PI*0.4+e*Math.PI*1.5;armX=e*5;}
else if(state==='walk')armA=Math.sin(t*10)*0.25;
else armA=Math.sin(t*2)*0.05;
ctx.save();ctx.translate(3,-2+breath*0.3);ctx.rotate(armA);
ctx.strokeStyle='#1a0f30';ctx.lineWidth=2.7;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(1.5,0,2.5,0.2,4,0.2);ctx.stroke();
var nailG=lg(ctx,4,0,24,-3,[[0,'#c4b5fd'],[0.3,'#f5f0ff'],[0.7,'#ffffff'],[1,'#fbbf24']]);
ctx.strokeStyle=nailG;ctx.lineWidth=2.5;
ctx.shadowColor=attacking?'#fbbf24':'#a78bfa';ctx.shadowBlur=attacking?20:6;
ctx.beginPath();ctx.moveTo(4+armX,0.2);ctx.lineTo(22+armX,-3);ctx.stroke();
ctx.shadowBlur=0;
ctx.strokeStyle='#7c3aed';ctx.lineWidth=2.2;
ctx.beginPath();ctx.moveTo(2,1.5);ctx.lineTo(4.5,-0.5);ctx.stroke();
ctx.fillStyle='#fbbf24';
ctx.beginPath();ctx.arc(4,0.2,0.9,0,Math.PI*2);ctx.fill();
ctx.restore();ctx.restore();ctx.restore();
}

function drawBat(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+6,y+6);
ctx.globalAlpha=0.3;var h=rg(ctx,0,0,14,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(255,51,85,0.85)'],[1,'rgba(255,51,85,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,14,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var flap=Math.sin(time*14)*5;
var wg=lg(ctx,-12,-4,0,4,[[0,'#450a0a'],[1,'#7f1d1d']]);
ctx.fillStyle=wg;
ctx.beginPath();ctx.moveTo(-2,-1);
ctx.bezierCurveTo(-6,-5-flap,-12,-6-flap,-14,1);
ctx.bezierCurveTo(-12,0,-10,2,-9,3);
ctx.bezierCurveTo(-8,1,-7,2,-5,3);
ctx.bezierCurveTo(-4,2,-3,1,-2,2);ctx.closePath();ctx.fill();
ctx.strokeStyle='#050508';ctx.lineWidth=0.5;ctx.stroke();
ctx.beginPath();ctx.moveTo(2,-1);
ctx.bezierCurveTo(6,-5-flap,12,-6-flap,14,1);
ctx.bezierCurveTo(12,0,10,2,9,3);
ctx.bezierCurveTo(8,1,7,2,5,3);
ctx.bezierCurveTo(4,2,3,1,2,2);ctx.closePath();ctx.fill();ctx.stroke();
var bg=rg(ctx,0,0,5,[[0,'#dc2626'],[1,'#450a0a']]);
ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(0,0,4,4.5,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#7f1d1d';
ctx.beginPath();ctx.moveTo(-2.5,-4);ctx.lineTo(-3.8,-7.5);ctx.lineTo(-1,-5);ctx.closePath();ctx.fill();
ctx.beginPath();ctx.moveTo(2.5,-4);ctx.lineTo(3.8,-7.5);ctx.lineTo(1,-5);ctx.closePath();ctx.fill();
ctx.fillStyle='#f5f0ff';
ctx.beginPath();ctx.ellipse(0,-2,2,2.2,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#050508';
ctx.beginPath();ctx.ellipse(-0.9,-2,0.6,0.9,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(0.9,-2,0.6,0.9,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#ff3355';ctx.shadowColor='#ff3355';ctx.shadowBlur=6;
ctx.beginPath();ctx.arc(-0.9,-2,0.4,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(0.9,-2,0.4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#f5f0ff';
ctx.beginPath();ctx.moveTo(-1.2,1);ctx.lineTo(-0.8,3);ctx.lineTo(-0.4,1);ctx.fill();
ctx.beginPath();ctx.moveTo(1.2,1);ctx.lineTo(0.8,3);ctx.lineTo(0.4,1);ctx.fill();
ctx.restore();
}

function drawSlime(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+5,y+8);
ctx.globalAlpha=0.3;var h=rg(ctx,0,4,13,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(74,222,128,0.85)'],[1,'rgba(74,222,128,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.ellipse(0,4,13,8,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var sq=Math.sin(time*4)*0.18+1,sc=1/sq;
var bg=rg(ctx,0,3,9,[[0,'rgba(134,239,172,0.9)'],[0.6,'rgba(74,222,128,0.8)'],[1,'rgba(22,101,52,0.9)']]);
ctx.fillStyle=bg;
ctx.beginPath();
ctx.moveTo(0,-7*sc);
ctx.bezierCurveTo(4,-7*sc,7*sq,-3,7*sq,1);
ctx.bezierCurveTo(7*sq,5,5*sq,7,0,7);
ctx.bezierCurveTo(-5*sq,7,-7*sq,5,-7*sq,1);
ctx.bezierCurveTo(-7*sq,-3,-4,-7*sc,0,-7*sc);
ctx.fill();
ctx.strokeStyle='rgba(22,101,52,0.7)';ctx.lineWidth=0.6;ctx.stroke();
var cg=rg(ctx,0,2,3,[[0,'rgba(255,255,255,0.95)'],[1,'rgba(134,239,172,0.3)']]);
ctx.fillStyle=cg;ctx.beginPath();ctx.arc(0,2,2.5,0,Math.PI*2);ctx.fill();
ctx.fillStyle='rgba(255,255,255,0.7)';
ctx.beginPath();ctx.ellipse(-2.5,0,1.8,1.2,-0.5,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#0a0518';
ctx.beginPath();ctx.arc(-2.2,2.5,1,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.2,2.5,1,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#fff';
ctx.beginPath();ctx.arc(-2.5,2.2,0.35,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.9,2.2,0.35,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#4ade80';ctx.globalAlpha=0.6;
for(var i=0;i<2;i++){var dy=6+Math.sin(time*3+i)*1;
ctx.beginPath();ctx.arc(-4+i*8,dy,0.7,0,Math.PI*2);ctx.fill();}
ctx.globalAlpha=1;ctx.restore();
}

function drawSkeleton(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+5,y+6);
var b=Math.sin(time*6)*1;
ctx.globalAlpha=0.3;var h=rg(ctx,0,0,13,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(148,163,184,0.85)'],[1,'rgba(148,163,184,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,13,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var capeG=lg(ctx,0,-3,0,11,[[0,'#1e1b4b'],[1,'#050208']]);
ctx.fillStyle=capeG;
ctx.beginPath();ctx.moveTo(-4,-2);
ctx.bezierCurveTo(-6,2,-5,8,-4,11);
ctx.lineTo(4,11);
ctx.bezierCurveTo(5,8,6,2,4,-2);ctx.closePath();ctx.fill();
ctx.strokeStyle='#0a0518';ctx.lineWidth=1.2;ctx.lineCap='round';
for(var i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-4,1+i*2.5);ctx.bezierCurveTo(-2,2+i*2.5,2,2+i*2.5,4,1+i*2.5);ctx.stroke();}
ctx.beginPath();ctx.moveTo(0,-1);ctx.lineTo(0,10);ctx.stroke();
ctx.fillStyle='#e2e8f0';
ctx.beginPath();ctx.ellipse(-4,1,1.5,1.8,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(4,1,1.5,1.8,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(-3,5,1.5,1.5,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(3,5,1.5,1.5,0,0,Math.PI*2);ctx.fill();
var skullG=rg(ctx,-1,-4+b,6,[[0,'#f5f0ff'],[0.7,'#e2e8f0'],[1,'#94a3b8']]);
ctx.fillStyle=skullG;
ctx.beginPath();ctx.ellipse(0,-4+b,4,4.5,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#475569';ctx.lineWidth=0.5;ctx.stroke();
ctx.strokeStyle='#475569';ctx.lineWidth=0.3;
ctx.beginPath();ctx.moveTo(-1,-7+b);ctx.lineTo(-1.5,-3+b);ctx.lineTo(0,-2+b);ctx.lineTo(1.5,-4+b);ctx.stroke();
ctx.fillStyle='#050508';
ctx.beginPath();ctx.ellipse(-1.6,-4+b,1.1,1.5,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(1.6,-4+b,1.1,1.5,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#ff3355';ctx.shadowColor='#ff3355';ctx.shadowBlur=5;
ctx.beginPath();ctx.arc(-1.6,-4+b,0.5,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.6,-4+b,0.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#e2e8f0';
ctx.fillRect(-2.5,-1+b,5,0.4);
for(var j=0;j<4;j++){ctx.fillRect(-2.2+j*1.3,-0.5+b,0.7,1.2);}
ctx.fillStyle='#dc2626';ctx.globalAlpha=0.8;
ctx.beginPath();ctx.moveTo(0,-7+b);ctx.lineTo(0.5,-8+b);ctx.lineTo(-0.5,-8+b);ctx.closePath();ctx.fill();
ctx.globalAlpha=1;ctx.restore();
}

function drawImp(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+6,y+6);
var flap=Math.sin(time*12)*3;
ctx.globalAlpha=0.4;var h=rg(ctx,0,0,14,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(255,107,0,0.9)'],[1,'rgba(255,107,0,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,14,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var wg=lg(ctx,-12,-4,0,4,[[0,'#7f1d1d'],[1,'#450a0a']]);
ctx.fillStyle=wg;
ctx.beginPath();ctx.moveTo(-2,0);
ctx.bezierCurveTo(-6,-4-flap,-13,-6-flap,-15,2);
ctx.bezierCurveTo(-12,0,-9,2,-7,3);
ctx.bezierCurveTo(-6,1,-4,2,-2,2);ctx.closePath();ctx.fill();
ctx.beginPath();ctx.moveTo(2,0);
ctx.bezierCurveTo(6,-4-flap,13,-6-flap,15,2);
ctx.bezierCurveTo(12,0,9,2,7,3);
ctx.bezierCurveTo(6,1,4,2,2,2);ctx.closePath();ctx.fill();
var bg=rg(ctx,0,0,5,[[0,'#ff9f1c'],[0.5,'#dc2626'],[1,'#7f1d1d']]);
ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(0,0,4.5,4.8,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#050508';ctx.lineWidth=1.8;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(-2.5,-3.5);ctx.bezierCurveTo(-4,-6,-4.5,-8,-2.5,-8.5);ctx.stroke();
ctx.beginPath();ctx.moveTo(2.5,-3.5);ctx.bezierCurveTo(4,-6,4.5,-8,2.5,-8.5);ctx.stroke();
ctx.strokeStyle='#450a0a';ctx.lineWidth=1.5;
ctx.beginPath();ctx.moveTo(2,3);
ctx.bezierCurveTo(5,4,7,6,6,9);
ctx.bezierCurveTo(5,8,4,7,3,6);ctx.stroke();
ctx.fillStyle='#f5f0ff';
ctx.beginPath();ctx.moveTo(6,9);ctx.lineTo(7,11);ctx.lineTo(5.5,10.5);ctx.closePath();ctx.fill();
ctx.fillStyle='#ffd166';ctx.shadowColor='#ffd166';ctx.shadowBlur=7;
ctx.beginPath();ctx.arc(-1.4,-0.5,1,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.4,-0.5,1,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.strokeStyle='#450a0a';ctx.lineWidth=0.8;
ctx.beginPath();ctx.moveTo(-1.5,2);ctx.lineTo(0,2.5);ctx.lineTo(1.5,2);ctx.stroke();
ctx.fillStyle='#f5f0ff';
ctx.beginPath();ctx.moveTo(-1,2.4);ctx.lineTo(-0.6,3.3);ctx.lineTo(-0.2,2.4);ctx.fill();
ctx.beginPath();ctx.moveTo(0.2,2.4);ctx.lineTo(0.6,3.3);ctx.lineTo(1,2.4);ctx.fill();
ctx.restore();
}

function drawFireGolem(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+6,y+6);
var p=Math.sin(time*5)*0.12+1;
ctx.globalAlpha=0.45;var h=rg(ctx,0,0,16,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(255,107,0,0.95)'],[1,'rgba(255,107,0,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,16,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
ctx.fillStyle='rgba(255,159,28,0.6)';
for(var i=0;i<4;i++){var a=time*2+i*1.57,r=10+Math.sin(time*3+i)*2;
var px=Math.cos(a)*r,py=Math.sin(a)*r-2;
ctx.beginPath();ctx.arc(px,py,1.2,0,Math.PI*2);ctx.fill();}
var bodyG=rg(ctx,-2,-2,8,[[0,'#ff9f1c'],[0.4,'#dc2626'],[1,'#450a0a']]);
ctx.fillStyle=bodyG;
ctx.beginPath();ctx.arc(0,0,7*p,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#450a0a';ctx.lineWidth=0.7;ctx.stroke();
ctx.strokeStyle='#fbbf24';ctx.lineWidth=1.2;ctx.shadowColor='#fbbf24';ctx.shadowBlur=8;
ctx.beginPath();ctx.moveTo(-4,-4);ctx.lineTo(-2,-1);ctx.lineTo(-3,2);ctx.lineTo(-1,5);ctx.stroke();
ctx.beginPath();ctx.moveTo(3,-5);ctx.lineTo(4,-1);ctx.lineTo(2,2);ctx.lineTo(3,5);ctx.stroke();
ctx.beginPath();ctx.moveTo(-1,-6);ctx.lineTo(1,-3);ctx.stroke();
ctx.shadowBlur=0;
ctx.fillStyle='#fff8dc';ctx.shadowColor='#fbbf24';ctx.shadowBlur=10;
ctx.beginPath();ctx.arc(-2.2,-1,1.3,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.2,-1,1.3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#0a0518';
ctx.beginPath();ctx.arc(-2.2,-1,0.5,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.2,-1,0.5,0,Math.PI*2);ctx.fill();
ctx.restore();
}
function drawIceWraith(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+5,y+6);
var f=Math.sin(time*3)*2;
ctx.globalAlpha=0.45;var h=rg(ctx,0,f,14,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(0,212,255,0.9)'],[1,'rgba(0,212,255,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,f,14,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
for(var i=0;i<3;i++){var a=time*1.5+i*2.1,r=9+Math.sin(time*2+i)*2;
var px=Math.cos(a)*r,py=Math.sin(a)*r*0.5+f;
ctx.fillStyle='rgba(186,230,253,0.7)';
ctx.beginPath();ctx.arc(px,py,1,0,Math.PI*2);ctx.fill();}
var bodyG=lg(ctx,0,-7+f,0,7+f,[[0,'rgba(224,242,254,0.95)'],[0.4,'rgba(125,211,252,0.85)'],[1,'rgba(2,132,199,0.2)']]);
ctx.fillStyle=bodyG;
ctx.beginPath();
ctx.moveTo(0,-7+f);
ctx.bezierCurveTo(4,-5+f,5,-2+f,4.5,1+f);
ctx.bezierCurveTo(4,4+f,2,6+f,1,7+f);
ctx.bezierCurveTo(0,8+f,-1,7+f,-2,6+f);
ctx.bezierCurveTo(-4,4+f,-4.5,1+f,-5,-2+f);
ctx.bezierCurveTo(-5,-5+f,-4,-5+f,0,-7+f);
ctx.fill();
ctx.strokeStyle='rgba(12,74,110,0.6)';ctx.lineWidth=0.5;ctx.stroke();
ctx.strokeStyle='rgba(255,255,255,0.6)';ctx.lineWidth=0.3;
ctx.beginPath();ctx.moveTo(-2,-4+f);ctx.lineTo(0,0+f);ctx.lineTo(2,-3+f);ctx.stroke();
ctx.fillStyle='#0c4a6e';
ctx.beginPath();ctx.ellipse(-1.5,0+f,1,1.5,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(1.5,0+f,1,1.5,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#bae6fd';ctx.shadowColor='#7dd3fc';ctx.shadowBlur=6;
ctx.beginPath();ctx.arc(-1.5,0+f,0.4,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.5,0+f,0.4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.strokeStyle='#0c4a6e';ctx.lineWidth=0.5;
ctx.beginPath();ctx.moveTo(-1,3+f);ctx.bezierCurveTo(0,4+f,1,3+f,0.5,4.5+f);ctx.stroke();
ctx.restore();
}

function drawFrostSpider(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+6,y+5);
var lm=Math.sin(time*10)*2;
ctx.globalAlpha=0.3;var h=rg(ctx,0,0,12,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(125,211,252,0.9)'],[1,'rgba(125,211,252,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,12,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
ctx.strokeStyle='#0c4a6e';ctx.lineWidth=1.3;ctx.lineCap='round';
for(var i=0;i<4;i++){
var phase=(i-1.5)*0.4;
var bend=Math.sin(time*8+i)*1.5;
ctx.beginPath();ctx.moveTo(-3,0);
ctx.bezierCurveTo(-5,-1+i*0.5,-7-bend,-1+i*1.5,-9,-2+i*2.5+lm);ctx.stroke();
ctx.beginPath();ctx.moveTo(3,0);
ctx.bezierCurveTo(5,-1+i*0.5,7+bend,-1+i*1.5,9,-2+i*2.5-lm);ctx.stroke();}
ctx.strokeStyle='#e0f2fe';ctx.lineWidth=0.5;
for(var j=0;j<4;j++){
var bend2=Math.sin(time*8+j)*1.5;
ctx.beginPath();ctx.moveTo(-3,0);
ctx.bezierCurveTo(-5,-1+j*0.5,-7-bend2,-1+j*1.5,-9,-2+j*2.5+lm);ctx.stroke();
ctx.beginPath();ctx.moveTo(3,0);
ctx.bezierCurveTo(5,-1+j*0.5,7+bend2,-1+j*1.5,9,-2+j*2.5-lm);ctx.stroke();}
var bodyG=rg(ctx,-1,-1,6,[[0,'#e0f2fe'],[0.5,'#7dd3fc'],[1,'#0369a1']]);
ctx.fillStyle=bodyG;
ctx.beginPath();ctx.ellipse(0,0,5,4,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#0c4a6e';ctx.lineWidth=0.5;ctx.stroke();
ctx.strokeStyle='rgba(255,255,255,0.7)';ctx.lineWidth=0.4;
ctx.beginPath();ctx.moveTo(-3,-1);ctx.bezierCurveTo(-1,0,1,0,3,-1);ctx.stroke();
ctx.fillStyle='#dc2626';ctx.shadowColor='#dc2626';ctx.shadowBlur=6;
ctx.beginPath();ctx.arc(-1.5,-1,0.9,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.5,-1,0.9,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(-0.7,1,0.6,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(0.7,1,0.6,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#fff';
ctx.beginPath();ctx.arc(-1.7,-1.2,0.3,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.3,-1.2,0.3,0,Math.PI*2);ctx.fill();
ctx.restore();
}

function drawIceGolem(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+6,y+6);
var p=Math.sin(time*3)*0.08+1;
ctx.globalAlpha=0.45;var h=rg(ctx,0,0,16,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(125,211,252,0.9)'],[1,'rgba(125,211,252,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,16,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var bodyG=rg(ctx,-2,-2,7,[[0,'#ffffff'],[0.35,'#7dd3fc'],[1,'#0369a1']]);
ctx.fillStyle=bodyG;
ctx.beginPath();
ctx.moveTo(0,-8*p);
ctx.bezierCurveTo(3,-7*p,6,-3,6.5,1);
ctx.bezierCurveTo(6.5,4,4,6.5,0,7.5*p);
ctx.bezierCurveTo(-4,6.5,-6.5,4,-6.5,1);
ctx.bezierCurveTo(-6,-3,-3,-7*p,0,-8*p);
ctx.fill();
ctx.strokeStyle='#0c4a6e';ctx.lineWidth=0.7;ctx.stroke();
ctx.strokeStyle='rgba(255,255,255,0.85)';ctx.lineWidth=0.5;
ctx.beginPath();ctx.moveTo(-3,-4);ctx.lineTo(1,-1);ctx.lineTo(-2,3);ctx.stroke();
ctx.beginPath();ctx.moveTo(2,-3);ctx.lineTo(3,1);ctx.stroke();
ctx.fillStyle='#0c4a6e';
ctx.beginPath();ctx.arc(-2.3,-1,1.1,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.3,-1,1.1,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#bae6fd';ctx.shadowColor='#7dd3fc';ctx.shadowBlur=5;
ctx.beginPath();ctx.arc(-2.3,-1,0.5,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.3,-1,0.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='rgba(255,255,255,0.9)';
for(var i=0;i<3;i++){var a=time+i*2.1,r=10;
var px=Math.cos(a)*r,py=Math.sin(a)*r*0.4;
ctx.globalAlpha=0.5;
ctx.beginPath();ctx.arc(px,py,0.8,0,Math.PI*2);ctx.fill();}
ctx.globalAlpha=1;ctx.restore();
}

function drawShadowBeast(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+6,y+6);
var flap=Math.sin(time*10)*5;
ctx.globalAlpha=0.55;var h=rg(ctx,0,0,16,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(232,121,249,0.95)'],[0.5,'rgba(124,58,237,0.4)'],[1,'rgba(124,58,237,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,16,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var wingG=lg(ctx,-13,-5,0,5,[[0,'rgba(10,5,24,0.95)'],[1,'rgba(76,29,149,0.6)']]);
ctx.fillStyle=wingG;
ctx.beginPath();ctx.moveTo(-2,0);
ctx.bezierCurveTo(-6,-4-flap,-12,-5-flap,-15,2);
ctx.bezierCurveTo(-12,-1,-10,1,-8,2);
ctx.bezierCurveTo(-7,0,-5,1,-2,2);ctx.closePath();ctx.fill();
ctx.beginPath();ctx.moveTo(2,0);
ctx.bezierCurveTo(6,-4-flap,12,-5-flap,15,2);
ctx.bezierCurveTo(12,-1,10,1,8,2);
ctx.bezierCurveTo(7,0,5,1,2,2);ctx.closePath();ctx.fill();
ctx.strokeStyle='rgba(232,121,249,0.5)';ctx.lineWidth=0.4;ctx.stroke();
var bodyG=rg(ctx,0,0,5,[[0,'#c084fc'],[1,'#1e1b4b']]);
ctx.fillStyle=bodyG;ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();
ctx.fillStyle='rgba(10,5,24,0.9)';
ctx.beginPath();ctx.moveTo(-2,-3);ctx.lineTo(-4,-7);ctx.lineTo(-1,-4.5);ctx.closePath();ctx.fill();
ctx.beginPath();ctx.moveTo(2,-3);ctx.lineTo(4,-7);ctx.lineTo(1,-4.5);ctx.closePath();ctx.fill();
ctx.fillStyle='#e879f9';ctx.shadowColor='#e879f9';ctx.shadowBlur=9;
ctx.beginPath();ctx.arc(-1.8,-0.5,1,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.8,-0.5,1,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='rgba(255,255,255,0.8)';
ctx.beginPath();ctx.arc(-2,-0.8,0.4,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.6,-0.8,0.4,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#e879f9';ctx.lineWidth=0.6;
ctx.beginPath();ctx.moveTo(-2,2.5);ctx.bezierCurveTo(-1,3.5,1,3.5,2,2.5);ctx.stroke();
ctx.fillStyle='#fff';
for(var i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-1.5+i*1.5,2.8);ctx.lineTo(-1+i*1.5,3.8);ctx.lineTo(-0.5+i*1.5,2.8);ctx.fill();}
ctx.restore();
}

function drawVoidCrawler(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+6,y+5);
var lm=Math.sin(time*10)*2.5;
ctx.globalAlpha=0.45;var h=rg(ctx,0,0,14,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(167,139,250,0.9)'],[1,'rgba(167,139,250,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,14,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
ctx.strokeStyle='#4c1d95';ctx.lineWidth=1.7;ctx.lineCap='round';
for(var i=0;i<4;i++){
var b1=Math.sin(time*8+i)*1.5;
ctx.beginPath();ctx.moveTo(-3,0);
ctx.bezierCurveTo(-5,1+i,-7-b1,2+i*1.5,-9-i*0.5,4+i*2+lm);ctx.stroke();
ctx.beginPath();ctx.moveTo(3,0);
ctx.bezierCurveTo(5,1+i,7+b1,2+i*1.5,9+i*0.5,4+i*2-lm);ctx.stroke();}
ctx.strokeStyle='#c4b5fd';ctx.lineWidth=0.5;
for(var j=0;j<4;j++){
var b2=Math.sin(time*8+j)*1.5;
ctx.beginPath();ctx.moveTo(-3,0);
ctx.bezierCurveTo(-5,1+j,-7-b2,2+j*1.5,-9-j*0.5,4+j*2+lm);ctx.stroke();
ctx.beginPath();ctx.moveTo(3,0);
ctx.bezierCurveTo(5,1+j,7+b2,2+j*1.5,9+j*0.5,4+j*2-lm);ctx.stroke();}
var bodyG=rg(ctx,-1,-1,6,[[0,'#c4b5fd'],[0.5,'#8b5cf6'],[1,'#4c1d95']]);
ctx.fillStyle=bodyG;
ctx.beginPath();ctx.ellipse(0,0,5.5,4.5,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#1e1b4b';ctx.lineWidth=0.6;ctx.stroke();
ctx.strokeStyle='rgba(232,121,249,0.7)';ctx.lineWidth=0.4;
ctx.beginPath();ctx.moveTo(-3,-1);ctx.bezierCurveTo(0,0,0,0,3,-1);ctx.stroke();
ctx.fillStyle='#e879f9';ctx.shadowColor='#e879f9';ctx.shadowBlur=8;
ctx.beginPath();ctx.arc(-1.6,-1,1,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.6,-1,1,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#fff';
ctx.beginPath();ctx.arc(-1.8,-1.3,0.4,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.4,-1.3,0.4,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#050208';
ctx.beginPath();ctx.ellipse(0,2,1.5,0.8,0,0,Math.PI*2);ctx.fill();
ctx.restore();
}

function drawNightmare(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+6,y+6);
var p=Math.sin(time*4)*0.15+1;
var f=Math.sin(time*2)*1.5;
ctx.globalAlpha=0.55;var h=rg(ctx,0,f,18,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(139,92,246,0.95)'],[0.5,'rgba(124,58,237,0.5)'],[1,'rgba(30,27,75,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,f,18,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
for(var i=0;i<4;i++){var a=time*1.5+i*1.57,r=12+Math.sin(time*2+i)*2;
var px=Math.cos(a)*r,py=Math.sin(a)*r*0.5+f;
ctx.fillStyle='rgba(196,181,253,0.7)';
ctx.beginPath();ctx.arc(px,py,1.2,0,Math.PI*2);ctx.fill();}
var bodyG=rg(ctx,0,f,7,[[0,'#e9d5ff'],[0.5,'#8b5cf6'],[1,'#1e1b4b']]);
ctx.fillStyle=bodyG;ctx.beginPath();ctx.arc(0,f,6.5*p,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#1e1b4b';ctx.lineWidth=0.6;ctx.stroke();
ctx.strokeStyle='#4c1d95';ctx.lineWidth=2.4;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(-3.5,-4+f);ctx.bezierCurveTo(-5,-7+f,-6,-9+f,-4,-10+f);ctx.stroke();
ctx.beginPath();ctx.moveTo(3.5,-4+f);ctx.bezierCurveTo(5,-7+f,6,-9+f,4,-10+f);ctx.stroke();
ctx.fillStyle='#1e1b4b';
ctx.beginPath();ctx.ellipse(0,0+f,5.5,5,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#050508';
ctx.beginPath();ctx.moveTo(-4,2.5+f);ctx.bezierCurveTo(-2,4+f,2,4+f,4,2.5+f);
ctx.bezierCurveTo(2,4.5+f,-2,4.5+f,-4,2.5+f);ctx.fill();
ctx.fillStyle='#fff';
for(var j=0;j<5;j++){ctx.beginPath();ctx.moveTo(-3+j*1.5,2.8+f);ctx.lineTo(-2.4+j*1.5,4+f);ctx.lineTo(-1.8+j*1.5,2.8+f);ctx.fill();}
ctx.fillStyle='#e879f9';ctx.shadowColor='#e879f9';ctx.shadowBlur=11;
ctx.beginPath();ctx.arc(-2,-1+f,1.4,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2,-1+f,1.4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#fff';
ctx.beginPath();ctx.arc(-2.3,-1.4+f,0.5,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.7,-1.4+f,0.5,0,Math.PI*2);ctx.fill();
ctx.restore();
}

function drawSkeletonKing(ctx,x,y,facing,time,hitFlash){
var b=Math.sin(time*3)*1.5;
ctx.save();ctx.translate(x+10,y+12);
ctx.globalAlpha=0.5;var h=rg(ctx,0,0,34,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(226,232,240,0.7)'],[1,'rgba(226,232,240,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,34,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var cl=lg(ctx,0,-6,0,15,[[0,'#4a044e'],[0.5,'#2d1b4e'],[1,'#1e1b4b']]);
ctx.fillStyle=cl;
ctx.beginPath();ctx.moveTo(-10,-6);
ctx.bezierCurveTo(-13,2,-13,10,-12,15);
ctx.lineTo(12,15);
ctx.bezierCurveTo(13,10,13,2,10,-6);ctx.closePath();ctx.fill();
ctx.strokeStyle='#fbbf24';ctx.lineWidth=1.2;ctx.stroke();
ctx.strokeStyle='rgba(251,191,36,0.5)';ctx.lineWidth=0.5;
ctx.beginPath();ctx.moveTo(-8,-3);ctx.bezierCurveTo(-10,3,-10,9,-9,14);ctx.stroke();
ctx.beginPath();ctx.moveTo(8,-3);ctx.bezierCurveTo(10,3,10,9,9,14);ctx.stroke();
var sk1=rg(ctx,-8,-5,3,[[0,'#f5f0ff'],[1,'#94a3b8']]);
ctx.fillStyle=sk1;
ctx.beginPath();ctx.arc(-8,-5,2.2,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(8,-5,2.2,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#050508';
ctx.beginPath();ctx.arc(-8.5,-5,0.5,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(7.5,-5,0.5,0,Math.PI*2);ctx.fill();
var skullG=rg(ctx,-1,-10+b,9,[[0,'#f5f0ff'],[0.6,'#e2e8f0'],[1,'#94a3b8']]);
ctx.fillStyle=skullG;
ctx.beginPath();ctx.ellipse(0,-10+b,7.5,8.5,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#475569';ctx.lineWidth=0.6;ctx.stroke();
ctx.fillStyle='#cbd5e1';
ctx.beginPath();ctx.ellipse(0,-3.5+b,5.5,3,0,0,Math.PI);ctx.fill();
ctx.fillStyle='#e2e8f0';
for(var i=0;i<5;i++){ctx.fillRect(-4.5+i*2.2,-3.5+b,1.2,2.2);}
ctx.fillStyle='#050508';
ctx.beginPath();ctx.ellipse(-2.8,-11+b,1.8,2.4,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(2.8,-11+b,1.8,2.4,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#ff3355';ctx.shadowColor='#ff3355';ctx.shadowBlur=14;
ctx.beginPath();ctx.arc(-2.8,-11+b,0.9,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.8,-11+b,0.9,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#fff';
ctx.beginPath();ctx.arc(-3.1,-11.5+b,0.35,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.5,-11.5+b,0.35,0,Math.PI*2);ctx.fill();
var crownG=lg(ctx,0,-23+b,0,-17+b,[[0,'#fde68a'],[0.5,'#fbbf24'],[1,'#a16207']]);
ctx.fillStyle=crownG;ctx.strokeStyle='#78350f';ctx.lineWidth=0.6;
ctx.beginPath();
ctx.moveTo(-7,-17+b);ctx.lineTo(-5.5,-23+b);ctx.lineTo(-4,-18+b);
ctx.lineTo(-2,-24+b);ctx.lineTo(0,-18.5+b);
ctx.lineTo(2,-24+b);ctx.lineTo(4,-18+b);ctx.lineTo(5.5,-23+b);ctx.lineTo(7,-17+b);
ctx.closePath();ctx.fill();ctx.stroke();
ctx.fillStyle='#dc2626';
ctx.beginPath();ctx.arc(0,-21.5+b,0.9,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#06ffa5';
ctx.beginPath();ctx.arc(-4,-20+b,0.6,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(4,-20+b,0.6,0,Math.PI*2);ctx.fill();
ctx.restore();
}

function drawFireDemon(ctx,x,y,facing,time,hitFlash){
var p=Math.sin(time*4)*0.12+1,flap=Math.sin(time*8)*5;
ctx.save();ctx.translate(x+10,y+12);
ctx.globalAlpha=0.55;var h=rg(ctx,0,0,40,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(255,107,0,0.9)'],[0.4,'rgba(220,38,38,0.6)'],[1,'rgba(220,38,38,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,40,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
for(var i=0;i<6;i++){var a=time*1.8+i*1.05,r=14+Math.sin(time*3+i)*3;
var px=Math.cos(a)*r,py=Math.sin(a)*r*0.6-3;
ctx.fillStyle='rgba(251,191,36,'+(0.3+Math.sin(time*4+i)*0.2)+')';
ctx.beginPath();ctx.arc(px,py,1.3,0,Math.PI*2);ctx.fill();}
var wg=lg(ctx,-16,-6,-4,8,[[0,'#dc2626'],[0.5,'#7f1d1d'],[1,'#450a0a']]);
ctx.fillStyle=wg;
ctx.beginPath();ctx.moveTo(-4,-3);
ctx.bezierCurveTo(-10,-6-flap,-18,-7-flap,-18,4);
ctx.bezierCurveTo(-15,1,-12,3,-10,5);
ctx.bezierCurveTo(-8,3,-6,4,-4,4);ctx.closePath();ctx.fill();
ctx.strokeStyle='#450a0a';ctx.lineWidth=0.7;ctx.stroke();
ctx.strokeStyle='#fbbf24';ctx.lineWidth=0.5;
ctx.beginPath();ctx.moveTo(-6,-4);ctx.bezierCurveTo(-12,-3,-15,0,-16,3);ctx.stroke();
ctx.beginPath();ctx.moveTo(4,-3);
ctx.bezierCurveTo(10,-6-flap,18,-7-flap,18,4);
ctx.bezierCurveTo(15,1,12,3,10,5);
ctx.bezierCurveTo(8,3,6,4,4,4);ctx.closePath();ctx.fill();ctx.stroke();
ctx.beginPath();ctx.moveTo(6,-4);ctx.bezierCurveTo(12,-3,15,0,16,3);ctx.stroke();
var bodyG=rg(ctx,-2,-2,10,[[0,'#ff9f1c'],[0.4,'#dc2626'],[1,'#450a0a']]);
ctx.fillStyle=bodyG;ctx.beginPath();ctx.arc(0,0,9*p,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#450a0a';ctx.lineWidth=0.8;ctx.stroke();
ctx.strokeStyle='#fbbf24';ctx.lineWidth=1.7;ctx.shadowColor='#fbbf24';ctx.shadowBlur=13;
ctx.beginPath();ctx.moveTo(-5,-6);ctx.lineTo(-3,0);ctx.lineTo(-5,5);ctx.stroke();
ctx.beginPath();ctx.moveTo(4,-6);ctx.lineTo(5,-1);ctx.lineTo(4,4);ctx.stroke();
ctx.beginPath();ctx.moveTo(-1,-9);ctx.lineTo(1,-5);ctx.stroke();
ctx.beginPath();ctx.moveTo(2,-8);ctx.lineTo(3,-4);ctx.stroke();
ctx.shadowBlur=0;
ctx.strokeStyle='#450a0a';ctx.lineWidth=3.2;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(-6,-6);ctx.bezierCurveTo(-10,-11,-8,-15,-5,-16);ctx.stroke();
ctx.beginPath();ctx.moveTo(6,-6);ctx.bezierCurveTo(10,-11,8,-15,5,-16);ctx.stroke();
ctx.fillStyle='#fde68a';
ctx.beginPath();ctx.arc(-5,-16,1,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(5,-16,1,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#fff8dc';ctx.shadowColor='#ff9f1c';ctx.shadowBlur=18;
ctx.beginPath();ctx.ellipse(-3.2,-1,1.7,2.4,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(3.2,-1,1.7,2.4,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#dc2626';
ctx.beginPath();ctx.ellipse(-3.2,-1,0.7,1.3,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(3.2,-1,0.7,1.3,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#050508';
ctx.beginPath();ctx.ellipse(0,3,5,1.5,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#fff';
for(var j=0;j<6;j++){ctx.beginPath();ctx.moveTo(-4+j*1.5,3);ctx.lineTo(-3.4+j*1.5,4.6);ctx.lineTo(-2.8+j*1.5,3);ctx.fill();}
ctx.restore();
}

function drawIceQueen(ctx,x,y,facing,time,hitFlash){
var f=Math.sin(time*2.5)*2;
ctx.save();ctx.translate(x+8,y+12);
ctx.globalAlpha=0.55;var h=rg(ctx,0,f,36,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(125,211,252,0.9)'],[0.5,'rgba(14,165,233,0.4)'],[1,'rgba(14,165,233,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,f,36,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
for(var i=0;i<8;i++){var a=time*1.2+i*0.78,r=13+Math.sin(time*2+i)*3;
var px=Math.cos(a)*r,py=Math.sin(a)*r*0.7+f;
ctx.fillStyle='rgba(186,230,253,'+(0.5+Math.sin(time*3+i)*0.2)+')';
ctx.beginPath();ctx.arc(px,py,1,0,Math.PI*2);ctx.fill();}
var dg=lg(ctx,0,-7+f,0,14,[[0,'#bae6fd'],[0.3,'#7dd3fc'],[0.7,'#0ea5e9'],[1,'#0c4a6e']]);
ctx.fillStyle=dg;
ctx.beginPath();ctx.moveTo(0,-8+f);
ctx.bezierCurveTo(5,-6+f,9,-1+f,9.5,7+f);
ctx.bezierCurveTo(9.5,11+f,6,13+f,0,13+f);
ctx.bezierCurveTo(-6,13+f,-9.5,11+f,-9.5,7+f);
ctx.bezierCurveTo(-9,-1+f,-5,-6+f,0,-8+f);ctx.fill();
ctx.strokeStyle='rgba(224,242,254,0.85)';ctx.lineWidth=0.9;ctx.stroke();
ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=0.5;
ctx.beginPath();ctx.moveTo(-3,-2+f);ctx.bezierCurveTo(-5,2+f,-4,7+f,-3,11+f);ctx.stroke();
ctx.beginPath();ctx.moveTo(3,-2+f);ctx.bezierCurveTo(5,2+f,4,7+f,3,11+f);ctx.stroke();
var skinG=rg(ctx,-1,-10+f,7,[[0,'#ffffff'],[0.6,'#e0f2fe'],[1,'#7dd3fc']]);
ctx.fillStyle=skinG;
ctx.beginPath();ctx.ellipse(0,-11+f,5.5,6,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#0c4a6e';ctx.lineWidth=0.5;ctx.stroke();
ctx.fillStyle='#e0f2fe';ctx.strokeStyle='#0369a1';ctx.lineWidth=0.5;
for(var c=0;c<5;c++){var a2=(c-2)*0.45,tx=Math.sin(a2)*7.5,ty=-15+f-Math.cos(a2)*4.5;
ctx.beginPath();ctx.moveTo(tx-1.2,-14+f);ctx.lineTo(tx,ty);ctx.lineTo(tx+1.2,-14+f);ctx.closePath();ctx.fill();ctx.stroke();}
ctx.fillStyle='#0c4a6e';
ctx.beginPath();ctx.ellipse(-2,-11+f,1.1,1.6,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(2,-11+f,1.1,1.6,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#bae6fd';ctx.shadowColor='#7dd3fc';ctx.shadowBlur=7;
ctx.beginPath();ctx.arc(-2,-11+f,0.5,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2,-11+f,0.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.strokeStyle='#0c4a6e';ctx.lineWidth=0.5;
ctx.beginPath();ctx.moveTo(-1.2,-7.5+f);ctx.bezierCurveTo(0,-6.5+f,1.2,-7.5+f,0.5,-6.8+f);ctx.stroke();
ctx.fillStyle='#fff';
ctx.beginPath();ctx.moveTo(-1,-7+f);ctx.lineTo(-0.6,-6.2+f);ctx.lineTo(-0.2,-7+f);ctx.fill();
ctx.restore();
}

function drawShadowLord(ctx,x,y,facing,time,hitFlash){
var p=Math.sin(time*3)*0.08+1,f=Math.sin(time*2)*2.5;
ctx.save();ctx.translate(x+9,y+12);
ctx.globalAlpha=0.6;var h=rg(ctx,0,f,42,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(232,121,249,0.95)'],[0.4,'rgba(124,58,237,0.5)'],[1,'rgba(30,27,75,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,f,42,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
for(var i=0;i<6;i++){var a=time*2+i*1.05,r=16+Math.sin(time*2.5+i)*3;
var px=Math.cos(a)*r,py=Math.sin(a)*r*0.4+f;
ctx.fillStyle='rgba(192,132,252,'+(0.4+Math.sin(time*3+i)*0.2)+')';
ctx.beginPath();ctx.arc(px,py,1.4,0,Math.PI*2);ctx.fill();}
var cl=lg(ctx,0,-8+f,0,15+f,[[0,'#4c1d95'],[0.4,'#2a1a4a'],[1,'#050208']]);
ctx.fillStyle=cl;
ctx.beginPath();ctx.moveTo(-3,-6+f);
ctx.bezierCurveTo(-8,-4+f,-12,0+f,-11.5,13+f);
ctx.lineTo(11.5,13+f);
ctx.bezierCurveTo(12,0+f,8,-4+f,3,-6+f);ctx.closePath();ctx.fill();
ctx.strokeStyle='rgba(232,121,249,0.75)';ctx.lineWidth=0.8;ctx.stroke();
ctx.strokeStyle='rgba(232,121,249,0.3)';ctx.lineWidth=0.5;
ctx.beginPath();ctx.moveTo(-4,-2+f);ctx.bezierCurveTo(-7,2+f,-8,8+f,-8,12+f);ctx.stroke();
ctx.beginPath();ctx.moveTo(4,-2+f);ctx.bezierCurveTo(7,2+f,8,8+f,8,12+f);ctx.stroke();
var hd=rg(ctx,-1,-10+f,8,[[0,'#e9d5ff'],[0.5,'#8b5cf6'],[1,'#1e1b4b']]);
ctx.fillStyle=hd;
ctx.beginPath();ctx.ellipse(0,-10+f,6.5,7.5*p,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#1e1b4b';ctx.lineWidth=0.6;ctx.stroke();
ctx.strokeStyle='#4c1d95';ctx.lineWidth=2.8;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(-5,-14+f);ctx.bezierCurveTo(-8,-19+f,-9,-23+f,-6,-25+f);ctx.stroke();
ctx.beginPath();ctx.moveTo(5,-14+f);ctx.bezierCurveTo(8,-19+f,9,-23+f,6,-25+f);ctx.stroke();
ctx.fillStyle='#e879f9';ctx.shadowColor='#e879f9';ctx.shadowBlur=12;
ctx.beginPath();ctx.arc(-6,-25+f,1.1,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(6,-25+f,1.1,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#e879f9';ctx.shadowColor='#e879f9';ctx.shadowBlur=17;
ctx.beginPath();ctx.arc(-2.8,-11+f,1.5,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.8,-11+f,1.5,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(0,-6.5+f,1.1,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#fff';
ctx.beginPath();ctx.arc(-3,-11.5+f,0.5,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.6,-11.5+f,0.5,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#050208';
ctx.beginPath();ctx.moveTo(-3,1+f);ctx.bezierCurveTo(-1,3+f,1,3+f,3,1+f);
ctx.bezierCurveTo(1,3.5+f,-1,3.5+f,-3,1+f);ctx.fill();
ctx.fillStyle='#e879f9';
for(var j=0;j<4;j++){ctx.beginPath();ctx.moveTo(-2+j*1.3,1.4+f);ctx.lineTo(-1.5+j*1.3,2.8+f);ctx.lineTo(-1+j*1.3,1.4+f);ctx.fill();}
ctx.restore();
}

function drawCoinItem(ctx,x,y,bob){
ctx.save();ctx.translate(x,y+Math.sin(bob)*2);
ctx.globalAlpha=0.55;var h=rg(ctx,0,0,10,[[0,'rgba(251,191,36,0.95)'],[1,'rgba(251,191,36,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,10,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var g=rg(ctx,-1,-1,4,[[0,'#fff8dc'],[0.5,'#fbbf24'],[1,'#a16207']]);
ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,3.8,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#78350f';ctx.lineWidth=0.5;ctx.stroke();
ctx.strokeStyle='rgba(255,255,255,0.6)';ctx.lineWidth=0.3;
ctx.beginPath();ctx.arc(-1,-1,1.5,0,Math.PI*2);ctx.stroke();
ctx.fillStyle='#78350f';ctx.fillRect(-0.5,-2.2,1,4.4);
ctx.restore();
}

function drawKeyItem(ctx,x,y,bob){
ctx.save();ctx.translate(x,y+Math.sin(bob)*2);
ctx.globalAlpha=0.75;var h=rg(ctx,0,0,17,[[0,'rgba(251,191,36,1)'],[0.5,'rgba(251,191,36,0.5)'],[1,'rgba(251,191,36,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,17,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var kg=rg(ctx,0,-3,3.2,[[0,'#fde68a'],[0.6,'#fbbf24'],[1,'#a16207']]);
ctx.fillStyle=kg;ctx.strokeStyle='#78350f';ctx.lineWidth=0.7;
ctx.beginPath();ctx.arc(0,-3,3.2,0,Math.PI*2);ctx.fill();ctx.stroke();
ctx.fillStyle='#78350f';ctx.beginPath();ctx.arc(0,-3,1.1,0,Math.PI*2);ctx.fill();
ctx.fillStyle=kg;
ctx.fillRect(-1.1,-1,2.2,7);
ctx.strokeRect(-1.1,-1,2.2,7);
ctx.fillRect(1.1,3,2,1.3);
ctx.strokeRect(1.1,3,2,1.3);
ctx.fillRect(1.1,5,2,1.3);
ctx.strokeRect(1.1,5,2,1.3);
ctx.restore();
}

function drawPortalItem(ctx,x,y,time){
ctx.save();ctx.translate(x,y+6);
var p=1+Math.sin(time*3)*0.12;
ctx.globalAlpha=0.5;var h=rg(ctx,0,0,26*p,[[0,'rgba(6,255,165,0.95)'],[0.5,'rgba(6,255,165,0.4)'],[1,'rgba(6,255,165,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,26*p,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var pt=rg(ctx,0,0,11,[[0,'#ffffff'],[0.3,'#06ffa5'],[0.7,'#047857'],[1,'#064e3b']]);
ctx.fillStyle=pt;
ctx.beginPath();ctx.ellipse(0,0,7*p,12,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#06ffa5';ctx.lineWidth=1.3;ctx.shadowColor='#06ffa5';ctx.shadowBlur=10;
ctx.globalAlpha=0.9;ctx.stroke();ctx.shadowBlur=0;ctx.globalAlpha=1;
for(var i=0;i<8;i++){var a=time*2+i*0.78,r=11+Math.sin(time*2+i)*4;
ctx.fillStyle='rgba(167,243,208,'+(0.5+Math.sin(time*3+i)*0.3)+')';
ctx.beginPath();ctx.arc(Math.cos(a)*r,Math.sin(a)*r,1.2,0,Math.PI*2);ctx.fill();}
ctx.restore();
}
