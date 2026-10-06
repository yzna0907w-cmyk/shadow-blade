function lg(c,x1,y1,x2,y2,s){var g=c.createLinearGradient(x1,y1,x2,y2);for(var i=0;i<s.length;i++)g.addColorStop(s[i][0],s[i][1]);return g;}
function rg(c,x,y,r,s){var g=c.createRadialGradient(x,y,0,x,y,r);for(var i=0;i<s.length;i++)g.addColorStop(s[i][0],s[i][1]);return g;}

/* ============ KNIGHT (Armored Hero) ============ */
function drawKnight(ctx,x,y,facing,state,time,hitFlash,attacking,vx,vy,onGround,attackTimer,ATK_DUR){
var t=time,breath=Math.sin(t*1.6)*0.6,inAir=!onGround;
var walking=(state==='walk');
var stretch=1;
if(inAir){if(vy<-50)stretch=1.10;else if(vy>100)stretch=0.94;}
else stretch=1+breath*0.004;
var squash=1/stretch;
ctx.save();ctx.translate(x+6,y+10);if(facing===-1)ctx.scale(-1,1);
var shadow=rg(ctx,0,11,8,[[0,'rgba(0,0,0,0.65)'],[0.5,'rgba(76,29,149,0.25)'],[1,'rgba(0,0,0,0)']]);
ctx.fillStyle=shadow;ctx.beginPath();ctx.ellipse(0,11,8,2.4,0,0,Math.PI*2);ctx.fill();
var aura=rg(ctx,0,-4,26,[[0,hitFlash>0?'rgba(255,90,120,0.85)':'rgba(139,92,246,0.55)'],[0.4,'rgba(124,58,237,0.2)'],[1,'rgba(76,29,149,0)']]);
ctx.fillStyle=aura;ctx.beginPath();ctx.arc(0,-4,26,0,Math.PI*2);ctx.fill();
for(var i=0;i<6;i++){var pA=t*0.7+i*1.05,pR=11+Math.sin(t*2+i*1.3)*3.5;
var px=Math.cos(pA)*pR,py=Math.sin(pA)*pR*0.65-4+Math.cos(t*1.5+i)*2;
var a=0.25+Math.sin(t*3+i)*0.2;
ctx.fillStyle='rgba(196,181,253,'+a+')';ctx.shadowColor='#a78bfa';ctx.shadowBlur=5;
ctx.beginPath();ctx.arc(px,py,0.7+i*0.06,0,Math.PI*2);ctx.fill();}
ctx.shadowBlur=0;
ctx.save();ctx.scale(squash,stretch);
var legSwing=walking?Math.sin(t*10)*2.6:0;
var legBend=inAir?3.5:0;
var legKnee=walking?Math.abs(Math.cos(t*10))*1.4:0;
var legGrad=lg(ctx,-4,8,-2,15,[[0,'#3a3a5a'],[0.5,'#1a1a2e'],[1,'#0a0a18']]);
ctx.fillStyle=legGrad;
ctx.beginPath();ctx.moveTo(-3.5,8);
ctx.bezierCurveTo(-4,10,-4+legSwing*0.4,12-legKnee,-4.5+legSwing,14-legBend);
ctx.lineTo(-2.5+legSwing,14.3-legBend);
ctx.bezierCurveTo(-2+legSwing,12-legKnee,-2,10,-1.5,8);
ctx.closePath();ctx.fill();ctx.strokeStyle='#4c1d95';ctx.lineWidth=0.4;ctx.stroke();
ctx.beginPath();ctx.moveTo(1.5,8);
ctx.bezierCurveTo(2,10,2-legSwing*0.4,12-legKnee,2.5-legSwing,14-legBend);
ctx.lineTo(4.5-legSwing,14.3-legBend);
ctx.bezierCurveTo(4-legSwing,12-legKnee,4,10,3.5,8);
ctx.closePath();ctx.fill();ctx.stroke();
ctx.fillStyle='#0a0518';
ctx.beginPath();ctx.ellipse(-3.5+legSwing,14.5-legBend,1.8,0.7,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(3.5-legSwing,14.5-legBend,1.8,0.7,0,0,Math.PI*2);ctx.fill();
var bodyGrad=lg(ctx,0,-4,0,8,[[0,'#4a4a6a'],[0.4,'#2a2a44'],[0.8,'#1a1a2e'],[1,'#0a0518']]);
ctx.fillStyle=bodyGrad;
ctx.beginPath();ctx.moveTo(-4.5,-2);
ctx.bezierCurveTo(-5.5,2,-5,6,-4,8);
ctx.lineTo(4,8);
ctx.bezierCurveTo(5,6,5.5,2,4.5,-2);
ctx.bezierCurveTo(3,-3,1,-3,0,-3);
ctx.bezierCurveTo(-1,-3,-3,-3,-4.5,-2);
ctx.closePath();ctx.fill();
ctx.strokeStyle='#c4b5fd';ctx.lineWidth=0.5;ctx.globalAlpha=0.6;ctx.stroke();ctx.globalAlpha=1;
ctx.strokeStyle='rgba(196,181,253,0.5)';ctx.lineWidth=0.5;
ctx.beginPath();ctx.moveTo(0,-2.5);ctx.lineTo(0,6);ctx.stroke();
ctx.beginPath();ctx.moveTo(-3,1);ctx.lineTo(0,0);ctx.lineTo(3,1);ctx.stroke();
var shoulderGrad=lg(ctx,3,-3,6,2,[[0,'#5a5a7a'],[1,'#2a2a44']]);
ctx.fillStyle=shoulderGrad;
ctx.beginPath();ctx.moveTo(3,-2.5);
ctx.bezierCurveTo(5.5,-2.5,6.5,0,6,1.5);
ctx.bezierCurveTo(5,1.8,4,1.5,3.5,0.5);
ctx.closePath();ctx.fill();ctx.strokeStyle='#c4b5fd';ctx.lineWidth=0.4;ctx.globalAlpha=0.5;ctx.stroke();ctx.globalAlpha=1;
ctx.beginPath();ctx.moveTo(-3,-2.5);
ctx.bezierCurveTo(-5.5,-2.5,-6.5,0,-6,1.5);
ctx.bezierCurveTo(-5,1.8,-4,1.5,-3.5,0.5);
ctx.closePath();ctx.fill();ctx.strokeStyle='#c4b5fd';ctx.lineWidth=0.4;ctx.globalAlpha=0.5;ctx.stroke();ctx.globalAlpha=1;
ctx.fillStyle='#1a0f30';ctx.fillRect(-4,5,8,1.2);
ctx.fillStyle='#fbbf24';ctx.fillRect(-0.8,4.8,1.6,1.6);
var headY=-8+breath*0.5;
var helmetGrad=rg(ctx,-1,headY,7,[[0,'#6a6a8a'],[0.5,'#3a3a5a'],[1,'#1a1a2e']]);
ctx.fillStyle=helmetGrad;
ctx.beginPath();ctx.moveTo(0,headY-5);
ctx.bezierCurveTo(4,headY-5,5.5,headY-2,5.5,headY+1);
ctx.bezierCurveTo(5.5,headY+3,4,headY+4.5,2,headY+4.5);
ctx.lineTo(-2,headY+4.5);
ctx.bezierCurveTo(-4,headY+4.5,-5.5,headY+3,-5.5,headY+1);
ctx.bezierCurveTo(-5.5,headY-2,-4,headY-5,0,headY-5);
ctx.closePath();ctx.fill();ctx.strokeStyle='#c4b5fd';ctx.lineWidth=0.5;ctx.globalAlpha=0.7;ctx.stroke();ctx.globalAlpha=1;
ctx.fillStyle='#050208';
ctx.beginPath();ctx.moveTo(-4,headY-1);ctx.lineTo(4,headY-1);ctx.lineTo(4,headY+0.5);
ctx.lineTo(0.8,headY+0.5);ctx.lineTo(0.8,headY+3);ctx.lineTo(-0.8,headY+3);
ctx.lineTo(-0.8,headY+0.5);ctx.lineTo(-4,headY+0.5);ctx.closePath();ctx.fill();
var eP=attacking?1.4:(1+Math.sin(t*3)*0.12);
var eB=attacking?12:8;
ctx.fillStyle=attacking?'#fbbf24':'#c4b5fd';
ctx.shadowColor=attacking?'#fbbf24':'#a78bfa';ctx.shadowBlur=eB;
ctx.beginPath();ctx.ellipse(-2,headY,0.9,1.2*eP,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(2,headY,0.9,1.2*eP,0,0,Math.PI*2);ctx.fill();
ctx.shadowBlur=0;
ctx.fillStyle='rgba(255,255,255,0.3)';
ctx.beginPath();ctx.ellipse(-3,headY-3,1.5,0.8,-0.3,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#c4b5fd';ctx.lineWidth=1;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(0,headY-5);
ctx.bezierCurveTo(-1,headY-7,0,headY-9,1,headY-8);ctx.stroke();
var armAngle=0,armExtend=0;
if(attacking){var pr=1-(attackTimer/ATK_DUR);
var e=pr<0.5?pr*2:(1-(pr-0.5)*2);
armAngle=-Math.PI*0.5+e*Math.PI*1.7;armExtend=e*6;}
else if(walking){armAngle=Math.sin(t*10)*0.28;}
else{armAngle=Math.sin(t*1.8)*0.05;}
ctx.save();ctx.translate(3.5,-1+breath*0.3);ctx.rotate(armAngle);
ctx.strokeStyle='#3a3a5a';ctx.lineWidth=2.6;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(3,0.3);ctx.stroke();
ctx.fillStyle='#1a0f30';
ctx.beginPath();ctx.arc(3.5,0.3,1.3,0,Math.PI*2);ctx.fill();
var bladeGlow=attacking?20:6;
var bladeGrad=lg(ctx,4,0,24,-3,[[0,'#4c1d95'],[0.3,'#7c3aed'],[0.6,'#c4b5fd'],[1,'#ffffff']]);
ctx.strokeStyle=bladeGrad;ctx.lineWidth=2.4;
ctx.shadowColor=attacking?'#fbbf24':'#a78bfa';ctx.shadowBlur=bladeGlow;
ctx.beginPath();ctx.moveTo(4+armExtend,0.3);ctx.lineTo(22+armExtend,-2.5);ctx.stroke();
ctx.shadowBlur=0;
ctx.strokeStyle='rgba(255,255,255,0.85)';ctx.lineWidth=0.5;
ctx.beginPath();ctx.moveTo(6+armExtend,0.2);ctx.lineTo(20+armExtend,-2.3);ctx.stroke();
ctx.fillStyle='#0a0518';ctx.fillRect(3,0,2,1.5);
ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.arc(3,0.3,0.5,0,Math.PI*2);ctx.fill();
ctx.restore();
if(attacking&&attackTimer>ATK_DUR*0.3){
var trailA=(attackTimer/ATK_DUR-0.3)/0.7;
ctx.globalAlpha=trailA*0.55;
var tGrad=lg(ctx,-15,-9,15,4,[[0,'rgba(196,181,253,0)'],[0.5,'rgba(232,121,249,0.7)'],[1,'rgba(196,181,253,0)']]);
ctx.strokeStyle=tGrad;ctx.lineWidth=3;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(-12,-6);ctx.bezierCurveTo(-6,-11,6,-11,14,-6);ctx.stroke();
ctx.globalAlpha=1;}
ctx.restore();ctx.restore();
}

/* ============ ENEMY 1: BAT ============ */
function drawBat(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+6,y+6);
ctx.globalAlpha=0.4;var h=rg(ctx,0,0,15,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(180,20,40,0.9)'],[1,'rgba(180,20,40,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,15,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var flap=Math.sin(time*14)*6;
var wingG=lg(ctx,-16,-7,0,5,[[0,'#1a0305'],[0.5,'#7f1d1d'],[1,'#450a0a']]);
ctx.fillStyle=wingG;
ctx.beginPath();ctx.moveTo(-2,-1);
ctx.bezierCurveTo(-6,-5-flap,-13,-7-flap,-16,1);
ctx.bezierCurveTo(-14,0,-12,2,-11,3.5);
ctx.bezierCurveTo(-10,1.5,-9,2.5,-7,3.5);
ctx.bezierCurveTo(-6,1.5,-5,2.5,-3,3);
ctx.bezierCurveTo(-2,1.5,-2,0,-2,-1);ctx.closePath();ctx.fill();
ctx.strokeStyle='#050508';ctx.lineWidth=0.5;ctx.stroke();
ctx.beginPath();ctx.moveTo(2,-1);
ctx.bezierCurveTo(6,-5-flap,13,-7-flap,16,1);
ctx.bezierCurveTo(14,0,12,2,11,3.5);
ctx.bezierCurveTo(10,1.5,9,2.5,7,3.5);
ctx.bezierCurveTo(6,1.5,5,2.5,3,3);
ctx.bezierCurveTo(2,1.5,2,0,2,-1);ctx.closePath();ctx.fill();ctx.stroke();
var bg=rg(ctx,0,0,5,[[0,'#dc2626'],[1,'#450a0a']]);
ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(0,0,4.5,5,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#7f1d1d';
ctx.beginPath();ctx.moveTo(-2.8,-4);ctx.lineTo(-4.2,-8);ctx.lineTo(-1.2,-5.5);ctx.closePath();ctx.fill();
ctx.beginPath();ctx.moveTo(2.8,-4);ctx.lineTo(4.2,-8);ctx.lineTo(1.2,-5.5);ctx.closePath();ctx.fill();
ctx.fillStyle='#f5f0ff';ctx.beginPath();ctx.ellipse(0,-2,2.2,2.5,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#050508';
ctx.beginPath();ctx.ellipse(-1,-2,0.7,1,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(1,-2,0.7,1,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#ff3355';ctx.shadowColor='#ff3355';ctx.shadowBlur=6;
ctx.beginPath();ctx.arc(-1,-2,0.4,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1,-2,0.4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#f5f0ff';
ctx.beginPath();ctx.moveTo(-1.3,1);ctx.lineTo(-0.9,3.5);ctx.lineTo(-0.5,1);ctx.fill();
ctx.beginPath();ctx.moveTo(1.3,1);ctx.lineTo(0.9,3.5);ctx.lineTo(0.5,1);ctx.fill();
ctx.restore();
}

/* ============ ENEMY 2: SLIME ============ */
function drawSlime(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+5,y+8);
ctx.globalAlpha=0.35;var h=rg(ctx,0,4,14,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(74,222,128,0.9)'],[1,'rgba(74,222,128,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.ellipse(0,4,14,9,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var sq=Math.sin(time*4)*0.2+1,sc=1/sq;
var bg=rg(ctx,0,3,10,[[0,'rgba(134,239,172,0.95)'],[0.5,'rgba(74,222,128,0.9)'],[1,'rgba(22,101,52,0.95)']]);
ctx.fillStyle=bg;
ctx.beginPath();ctx.moveTo(0,-8*sc);
ctx.bezierCurveTo(4.5,-8*sc,7.5*sq,-3.5,7.5*sq,1);
ctx.bezierCurveTo(7.5*sq,5.5,5.5*sq,7.5,0,7.5);
ctx.bezierCurveTo(-5.5*sq,7.5,-7.5*sq,5.5,-7.5*sq,1);
ctx.bezierCurveTo(-7.5*sq,-3.5,-4.5,-8*sc,0,-8*sc);ctx.fill();
ctx.strokeStyle='rgba(22,101,52,0.8)';ctx.lineWidth=0.6;ctx.stroke();
var cg=rg(ctx,0,2,3.5,[[0,'rgba(255,255,255,0.9)'],[1,'rgba(134,239,172,0.2)']]);
ctx.fillStyle=cg;ctx.beginPath();ctx.arc(0,2,3,0,Math.PI*2);ctx.fill();
ctx.fillStyle='rgba(255,255,255,0.75)';
ctx.beginPath();ctx.ellipse(-3,0,2,1.3,-0.5,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#0a0518';
ctx.beginPath();ctx.arc(-2.5,2.5,1.1,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.5,2.5,1.1,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#fff';
ctx.beginPath();ctx.arc(-2.8,2.2,0.4,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.2,2.2,0.4,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#4ade80';ctx.globalAlpha=0.65;
for(var i=0;i<3;i++){var dy=6.5+Math.sin(time*3+i)*0.8;
ctx.beginPath();ctx.arc(-4+i*4,dy,0.6,0,Math.PI*2);ctx.fill();}
ctx.globalAlpha=1;ctx.restore();
}

/* ============ ENEMY 3: SKELETON ============ */
function drawSkeleton(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+5,y+6);
var b=Math.sin(time*6)*1;
ctx.globalAlpha=0.35;var h=rg(ctx,0,0,14,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(148,163,184,0.9)'],[1,'rgba(148,163,184,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,14,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var capeG=lg(ctx,0,-3,0,12,[[0,'#1e1b4b'],[1,'#050208']]);
ctx.fillStyle=capeG;
ctx.beginPath();ctx.moveTo(-4.5,-2);
ctx.bezierCurveTo(-6.5,2,-5.5,8,-4.5,12);
ctx.lineTo(4.5,12);
ctx.bezierCurveTo(5.5,8,6.5,2,4.5,-2);ctx.closePath();ctx.fill();
ctx.strokeStyle='#e2e8f0';ctx.lineWidth=1.4;ctx.lineCap='round';
for(var i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-4,1+i*2.4);ctx.bezierCurveTo(-2,2+i*2.4,2,2+i*2.4,4,1+i*2.4);ctx.stroke();}
ctx.beginPath();ctx.moveTo(0,-1);ctx.lineTo(0,11);ctx.stroke();
ctx.strokeStyle='#cbd5e1';ctx.lineWidth=0.8;
ctx.beginPath();ctx.moveTo(-4.5,0);ctx.bezierCurveTo(-6,3,-5.5,7,-5,10);ctx.stroke();
ctx.beginPath();ctx.moveTo(4.5,0);ctx.bezierCurveTo(6,3,5.5,7,5,10);ctx.stroke();
ctx.fillStyle='#e2e8f0';
ctx.beginPath();ctx.ellipse(-4.2,1,1.6,1.9,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(4.2,1,1.6,1.9,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(-3.2,5,1.5,1.6,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(3.2,5,1.5,1.6,0,0,Math.PI*2);ctx.fill();
var skullG=rg(ctx,-1,-4+b,7,[[0,'#f5f0ff'],[0.6,'#e2e8f0'],[1,'#94a3b8']]);
ctx.fillStyle=skullG;
ctx.beginPath();ctx.ellipse(0,-4+b,4.5,5,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#475569';ctx.lineWidth=0.5;ctx.stroke();
ctx.fillStyle='#cbd5e1';
ctx.beginPath();ctx.ellipse(0,0.5+b,3.2,1.8,0,0,Math.PI);ctx.fill();
ctx.strokeStyle='#475569';ctx.lineWidth=0.3;
ctx.beginPath();ctx.moveTo(-1.5,-7+b);ctx.lineTo(-2,-3+b);ctx.lineTo(0,-2+b);ctx.lineTo(2,-4+b);ctx.stroke();
ctx.fillStyle='#050508';
ctx.beginPath();ctx.ellipse(-1.8,-4+b,1.2,1.7,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(1.8,-4+b,1.2,1.7,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#ff3355';ctx.shadowColor='#ff3355';ctx.shadowBlur=6;
ctx.beginPath();ctx.arc(-1.8,-4+b,0.55,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.8,-4+b,0.55,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#e2e8f0';
for(var j=0;j<4;j++){ctx.fillRect(-2.4+j*1.3,-0.2+b,0.7,1.3);}
ctx.fillStyle='#dc2626';ctx.globalAlpha=0.85;
ctx.beginPath();ctx.moveTo(0,-8+b);ctx.lineTo(0.6,-9.2+b);ctx.lineTo(-0.6,-9.2+b);ctx.closePath();ctx.fill();
ctx.globalAlpha=1;ctx.restore();
}

/* ============ ENEMY 4: IMP ============ */
function drawImp(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+6,y+6);
var flap=Math.sin(time*12)*4;
ctx.globalAlpha=0.45;var h=rg(ctx,0,0,15,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(255,107,0,0.95)'],[1,'rgba(255,107,0,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,15,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var wg=lg(ctx,-17,-7,0,5,[[0,'#7f1d1d'],[1,'#450a0a']]);
ctx.fillStyle=wg;
ctx.beginPath();ctx.moveTo(-2,0);
ctx.bezierCurveTo(-6,-4-flap,-14,-7-flap,-17,2);
ctx.bezierCurveTo(-13,0,-10,2,-8,3.5);
ctx.bezierCurveTo(-6,1.5,-4,2.5,-2,2.5);ctx.closePath();ctx.fill();
ctx.beginPath();ctx.moveTo(2,0);
ctx.bezierCurveTo(6,-4-flap,14,-7-flap,17,2);
ctx.bezierCurveTo(13,0,10,2,8,3.5);
ctx.bezierCurveTo(6,1.5,4,2.5,2,2.5);ctx.closePath();ctx.fill();
var bg=rg(ctx,0,0,5.5,[[0,'#ff9f1c'],[0.5,'#dc2626'],[1,'#7f1d1d']]);
ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(0,0,5,5.3,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#050508';ctx.lineWidth=2;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(-2.8,-4);ctx.bezierCurveTo(-4.5,-6.5,-5,-9,-2.8,-9.5);ctx.stroke();
ctx.beginPath();ctx.moveTo(2.8,-4);ctx.bezierCurveTo(4.5,-6.5,5,-9,2.8,-9.5);ctx.stroke();
ctx.strokeStyle='#450a0a';ctx.lineWidth=1.8;
ctx.beginPath();ctx.moveTo(2.5,3.5);ctx.bezierCurveTo(6,4.5,8,6.5,7,10);
ctx.bezierCurveTo(6,9,5,7.5,3.5,6.5);ctx.stroke();
ctx.fillStyle='#f5f0ff';
ctx.beginPath();ctx.moveTo(7,10);ctx.lineTo(8,12.5);ctx.lineTo(6.3,11.5);ctx.closePath();ctx.fill();
ctx.fillStyle='#ffd166';ctx.shadowColor='#ffd166';ctx.shadowBlur=8;
ctx.beginPath();ctx.arc(-1.5,-0.5,1.1,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.5,-0.5,1.1,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#050208';
ctx.beginPath();ctx.arc(-1.5,-0.5,0.5,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.5,-0.5,0.5,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#450a0a';ctx.lineWidth=0.9;
ctx.beginPath();ctx.moveTo(-1.8,2);ctx.lineTo(0,2.7);ctx.lineTo(1.8,2);ctx.stroke();
ctx.fillStyle='#f5f0ff';
ctx.beginPath();ctx.moveTo(-1.2,2.4);ctx.lineTo(-0.7,3.5);ctx.lineTo(-0.2,2.4);ctx.fill();
ctx.beginPath();ctx.moveTo(0.2,2.4);ctx.lineTo(0.7,3.5);ctx.lineTo(1.2,2.4);ctx.fill();
ctx.restore();
}

/* ============ ENEMY 5: FIRE GOLEM ============ */
function drawFireGolem(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+6,y+6);
var p=Math.sin(time*5)*0.12+1;
ctx.globalAlpha=0.55;var h=rg(ctx,0,0,17,[[0,hitFlash>0?'rgba(255,255,255,0.95)':'rgba(255,107,0,0.95)'],[1,'rgba(255,107,0,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,17,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
for(var i=0;i<5;i++){var a=time*2+i*1.26,r=11+Math.sin(time*3+i)*2.5;
var px=Math.cos(a)*r,py=Math.sin(a)*r-2;
ctx.fillStyle='rgba(251,191,36,'+(0.4+Math.sin(time*4+i)*0.3)+')';
ctx.shadowColor='#fbbf24';ctx.shadowBlur=6;
ctx.beginPath();ctx.arc(px,py,1.3,0,Math.PI*2);ctx.fill();}
ctx.shadowBlur=0;
var bodyG=rg(ctx,-2.5,-2.5,9,[[0,'#ff9f1c'],[0.4,'#dc2626'],[1,'#450a0a']]);
ctx.fillStyle=bodyG;
ctx.beginPath();
ctx.moveTo(0,-8*p);
ctx.bezierCurveTo(4,-7*p,7,-3,7.5,1);
ctx.bezierCurveTo(7.5,5,4,7.5*p,0,8*p);
ctx.bezierCurveTo(-4,7.5*p,-7.5,5,-7.5,1);
ctx.bezierCurveTo(-7,-3,-4,-7*p,0,-8*p);ctx.fill();
ctx.strokeStyle='#450a0a';ctx.lineWidth=0.8;ctx.stroke();
ctx.strokeStyle='#fbbf24';ctx.lineWidth=1.5;ctx.shadowColor='#fbbf24';ctx.shadowBlur=10;
ctx.beginPath();ctx.moveTo(-4.5,-4.5);ctx.lineTo(-2.5,-1);ctx.lineTo(-3.5,2.5);ctx.lineTo(-1.5,5.5);ctx.stroke();
ctx.beginPath();ctx.moveTo(3.5,-5.5);ctx.lineTo(4.5,-1.5);ctx.lineTo(2.5,2);ctx.lineTo(3.5,5.5);ctx.stroke();
ctx.beginPath();ctx.moveTo(-1,-7);ctx.lineTo(1.5,-3.5);ctx.stroke();
ctx.beginPath();ctx.moveTo(2,-6.5);ctx.lineTo(3.5,-2);ctx.stroke();
ctx.shadowBlur=0;
ctx.fillStyle='#fff8dc';ctx.shadowColor='#fbbf24';ctx.shadowBlur=12;
ctx.beginPath();ctx.arc(-2.5,-1,1.4,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.5,-1,1.4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#0a0518';
ctx.beginPath();ctx.arc(-2.5,-1,0.55,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.5,-1,0.55,0,Math.PI*2);ctx.fill();
ctx.restore();
}

/* ============ ENEMY 6: ICE WRAITH ============ */
function drawIceWraith(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+5,y+6);
var f=Math.sin(time*3)*2.5;
ctx.globalAlpha=0.55;var h=rg(ctx,0,f,15,[[0,hitFlash>0?'rgba(255,255,255,0.95)':'rgba(0,212,255,0.9)'],[1,'rgba(0,212,255,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,f,15,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
for(var i=0;i<4;i++){var a=time*1.5+i*1.57,r=10+Math.sin(time*2+i)*2.5;
var px=Math.cos(a)*r,py=Math.sin(a)*r*0.5+f;
ctx.fillStyle='rgba(186,230,253,'+(0.5+Math.sin(time*3+i)*0.3)+')';
ctx.shadowColor='#7dd3fc';ctx.shadowBlur=5;
ctx.beginPath();ctx.arc(px,py,1.1,0,Math.PI*2);ctx.fill();}
ctx.shadowBlur=0;
var bodyG=lg(ctx,0,-8+f,0,8+f,[[0,'rgba(224,242,254,0.95)'],[0.4,'rgba(125,211,252,0.9)'],[1,'rgba(2,132,199,0.3)']]);
ctx.fillStyle=bodyG;
ctx.beginPath();ctx.moveTo(0,-8+f);
ctx.bezierCurveTo(4.5,-6+f,5.5,-2+f,5,2+f);
ctx.bezierCurveTo(4.5,5+f,2.5,7+f,1.5,8+f);
ctx.bezierCurveTo(0.5,9+f,-0.5,9+f,-1.5,8+f);
ctx.bezierCurveTo(-2.5,7+f,-4.5,5+f,-5,2+f);
ctx.bezierCurveTo(-5.5,-2+f,-4.5,-6+f,0,-8+f);ctx.fill();
ctx.strokeStyle='rgba(12,74,110,0.7)';ctx.lineWidth=0.6;ctx.stroke();
ctx.strokeStyle='rgba(255,255,255,0.7)';ctx.lineWidth=0.4;
ctx.beginPath();ctx.moveTo(-2.5,-4+f);ctx.lineTo(0,0+f);ctx.lineTo(2.5,-3+f);ctx.stroke();
ctx.fillStyle='#0c4a6e';
ctx.beginPath();ctx.ellipse(-1.8,0+f,1.1,1.7,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(1.8,0+f,1.1,1.7,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#bae6fd';ctx.shadowColor='#7dd3fc';ctx.shadowBlur=8;
ctx.beginPath();ctx.arc(-1.8,0+f,0.5,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.8,0+f,0.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.strokeStyle='#0c4a6e';ctx.lineWidth=0.5;
ctx.beginPath();ctx.moveTo(-1,3.5+f);ctx.bezierCurveTo(0,4.5+f,1,3.5+f,0.5,5+f);ctx.stroke();
ctx.restore();
}

/* ============ ENEMY 7: FROST SPIDER ============ */
function drawFrostSpider(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+6,y+5);
var lm=Math.sin(time*10)*2.5;
ctx.globalAlpha=0.35;var h=rg(ctx,0,0,13,[[0,hitFlash>0?'rgba(255,255,255,0.95)':'rgba(125,211,252,0.9)'],[1,'rgba(125,211,252,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,13,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
ctx.strokeStyle='#0c4a6e';ctx.lineWidth=1.5;ctx.lineCap='round';
for(var i=0;i<4;i++){
var bend=Math.sin(time*8+i)*2;
ctx.beginPath();ctx.moveTo(-3,0);
ctx.bezierCurveTo(-5.5,-1.5+i*0.5,-8-bend,-1+i*1.5,-10,-2+i*2.5+lm);ctx.stroke();
ctx.beginPath();ctx.moveTo(3,0);
ctx.bezierCurveTo(5.5,-1.5+i*0.5,8+bend,-1+i*1.5,10,-2+i*2.5-lm);ctx.stroke();}
ctx.strokeStyle='#e0f2fe';ctx.lineWidth=0.6;
for(var j=0;j<4;j++){
var bend2=Math.sin(time*8+j)*2;
ctx.beginPath();ctx.moveTo(-3,0);
ctx.bezierCurveTo(-5.5,-1.5+j*0.5,-8-bend2,-1+j*1.5,-10,-2+j*2.5+lm);ctx.stroke();
ctx.beginPath();ctx.moveTo(3,0);
ctx.bezierCurveTo(5.5,-1.5+j*0.5,8+bend2,-1+j*1.5,10,-2+j*2.5-lm);ctx.stroke();}
var bodyG=rg(ctx,-1,-1,7,[[0,'#e0f2fe'],[0.5,'#7dd3fc'],[1,'#0369a1']]);
ctx.fillStyle=bodyG;ctx.beginPath();ctx.ellipse(0,0,5.5,4.5,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#0c4a6e';ctx.lineWidth=0.6;ctx.stroke();
ctx.strokeStyle='rgba(255,255,255,0.8)';ctx.lineWidth=0.4;
ctx.beginPath();ctx.moveTo(-3.5,-1);ctx.bezierCurveTo(-1,0,1,0,3.5,-1);ctx.stroke();
ctx.fillStyle='#dc2626';ctx.shadowColor='#dc2626';ctx.shadowBlur=8;
ctx.beginPath();ctx.arc(-1.7,-1,1,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.7,-1,1,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(-0.8,1,0.7,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(0.8,1,0.7,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#fff';
ctx.beginPath();ctx.arc(-1.9,-1.2,0.35,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.5,-1.2,0.35,0,Math.PI*2);ctx.fill();
ctx.restore();
}

/* ============ ENEMY 8: ICE GOLEM ============ */
function drawIceGolem(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+6,y+6);
var p=Math.sin(time*3)*0.08+1;
ctx.globalAlpha=0.55;var h=rg(ctx,0,0,17,[[0,hitFlash>0?'rgba(255,255,255,0.95)':'rgba(125,211,252,0.9)'],[1,'rgba(125,211,252,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,17,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var bodyG=rg(ctx,-2,-2,8,[[0,'#ffffff'],[0.35,'#7dd3fc'],[1,'#0369a1']]);
ctx.fillStyle=bodyG;
ctx.beginPath();ctx.moveTo(0,-9*p);
ctx.bezierCurveTo(3.5,-8*p,7,-4,7.5,0);
ctx.bezierCurveTo(7.5,4,4.5,7,0,8.5*p);
ctx.bezierCurveTo(-4.5,7,-7.5,4,-7.5,0);
ctx.bezierCurveTo(-7,-4,-3.5,-8*p,0,-9*p);ctx.fill();
ctx.strokeStyle='#0c4a6e';ctx.lineWidth=0.8;ctx.stroke();
ctx.strokeStyle='rgba(255,255,255,0.9)';ctx.lineWidth=0.6;
ctx.beginPath();ctx.moveTo(-3.5,-4.5);ctx.lineTo(1,-1);ctx.lineTo(-2.5,3.5);ctx.stroke();
ctx.beginPath();ctx.moveTo(2.5,-3.5);ctx.lineTo(4,1);ctx.stroke();
ctx.beginPath();ctx.moveTo(-1,-7);ctx.lineTo(0.5,-4);ctx.stroke();
ctx.fillStyle='#0c4a6e';
ctx.beginPath();ctx.arc(-2.5,-1,1.3,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.5,-1,1.3,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#bae6fd';ctx.shadowColor='#7dd3fc';ctx.shadowBlur=7;
ctx.beginPath();ctx.arc(-2.5,-1,0.6,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.5,-1,0.6,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='rgba(255,255,255,0.9)';
for(var i=0;i<4;i++){var a=time+i*1.57,r=11;
var px=Math.cos(a)*r,py=Math.sin(a)*r*0.4;
ctx.globalAlpha=0.6;
ctx.beginPath();ctx.arc(px,py,0.9,0,Math.PI*2);ctx.fill();}
ctx.globalAlpha=1;ctx.restore();
}

/* ============ ENEMY 9: SHADOW BEAST ============ */
function drawShadowBeast(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+6,y+6);
var flap=Math.sin(time*10)*6;
ctx.globalAlpha=0.65;var h=rg(ctx,0,0,17,[[0,hitFlash>0?'rgba(255,255,255,0.95)':'rgba(232,121,249,0.95)'],[0.5,'rgba(124,58,237,0.5)'],[1,'rgba(124,58,237,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,17,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var wingG=lg(ctx,-16,-6,0,6,[[0,'rgba(10,5,24,0.95)'],[1,'rgba(76,29,149,0.7)']]);
ctx.fillStyle=wingG;
ctx.beginPath();ctx.moveTo(-2,0);
ctx.bezierCurveTo(-7,-5-flap,-14,-6-flap,-16,2);
ctx.bezierCurveTo(-13,-1,-11,1,-9,2.5);
ctx.bezierCurveTo(-8,0.5,-6,1.5,-4,2.5);
ctx.bezierCurveTo(-3,1,-2.5,0,-2,0);ctx.closePath();ctx.fill();
ctx.beginPath();ctx.moveTo(2,0);
ctx.bezierCurveTo(7,-5-flap,14,-6-flap,16,2);
ctx.bezierCurveTo(13,-1,11,1,9,2.5);
ctx.bezierCurveTo(8,0.5,6,1.5,4,2.5);
ctx.bezierCurveTo(3,1,2.5,0,2,0);ctx.closePath();ctx.fill();
ctx.strokeStyle='rgba(232,121,249,0.6)';ctx.lineWidth=0.5;ctx.stroke();
var bodyG=rg(ctx,0,0,5.5,[[0,'#c084fc'],[0.5,'#8b5cf6'],[1,'#1e1b4b']]);
ctx.fillStyle=bodyG;ctx.beginPath();ctx.arc(0,0,5.5,0,Math.PI*2);ctx.fill();
ctx.fillStyle='rgba(10,5,24,0.95)';
ctx.beginPath();ctx.moveTo(-2.3,-3.5);ctx.lineTo(-4.5,-8);ctx.lineTo(-1.2,-5);ctx.closePath();ctx.fill();
ctx.beginPath();ctx.moveTo(2.3,-3.5);ctx.lineTo(4.5,-8);ctx.lineTo(1.2,-5);ctx.closePath();ctx.fill();
ctx.fillStyle='#e879f9';ctx.shadowColor='#e879f9';ctx.shadowBlur=10;
ctx.beginPath();ctx.arc(-2,-0.5,1.1,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2,-0.5,1.1,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='rgba(255,255,255,0.85)';
ctx.beginPath();ctx.arc(-2.2,-0.8,0.4,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.8,-0.8,0.4,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#e879f9';ctx.lineWidth=0.7;
ctx.beginPath();ctx.moveTo(-2.2,2.8);ctx.bezierCurveTo(-1,4,1,4,2.2,2.8);ctx.stroke();
ctx.fillStyle='#fff';
for(var i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-1.8+i*1.2,3);ctx.lineTo(-1.3+i*1.2,4.2);ctx.lineTo(-0.8+i*1.2,3);ctx.fill();}
ctx.restore();
}

/* ============ ENEMY 10: VOID CRAWLER ============ */
function drawVoidCrawler(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+6,y+5);
var lm=Math.sin(time*10)*3;
ctx.globalAlpha=0.55;var h=rg(ctx,0,0,15,[[0,hitFlash>0?'rgba(255,255,255,0.95)':'rgba(167,139,250,0.95)'],[1,'rgba(167,139,250,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,15,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
ctx.strokeStyle='#4c1d95';ctx.lineWidth=1.9;ctx.lineCap='round';
for(var i=0;i<4;i++){
var b1=Math.sin(time*8+i)*2;
ctx.beginPath();ctx.moveTo(-3,0);
ctx.bezierCurveTo(-5.5,1.5+i,-8-b1,2.5+i*1.5,-10.5-i*0.6,4.5+i*2+lm);ctx.stroke();
ctx.beginPath();ctx.moveTo(3,0);
ctx.bezierCurveTo(5.5,1.5+i,8+b1,2.5+i*1.5,10.5+i*0.6,4.5+i*2-lm);ctx.stroke();}
ctx.strokeStyle='#c4b5fd';ctx.lineWidth=0.6;
for(var j=0;j<4;j++){
var b2=Math.sin(time*8+j)*2;
ctx.beginPath();ctx.moveTo(-3,0);
ctx.bezierCurveTo(-5.5,1.5+j,-8-b2,2.5+j*1.5,-10.5-j*0.6,4.5+j*2+lm);ctx.stroke();
ctx.beginPath();ctx.moveTo(3,0);
ctx.bezierCurveTo(5.5,1.5+j,8+b2,2.5+j*1.5,10.5+j*0.6,4.5+j*2-lm);ctx.stroke();}
var bodyG=rg(ctx,-1,-1,7,[[0,'#c4b5fd'],[0.5,'#8b5cf6'],[1,'#4c1d95']]);
ctx.fillStyle=bodyG;ctx.beginPath();ctx.ellipse(0,0,6,5,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#1e1b4b';ctx.lineWidth=0.7;ctx.stroke();
ctx.strokeStyle='rgba(232,121,249,0.8)';ctx.lineWidth=0.5;
ctx.beginPath();ctx.moveTo(-3.5,-1);ctx.bezierCurveTo(0,0,0,0,3.5,-1);ctx.stroke();
ctx.fillStyle='#e879f9';ctx.shadowColor='#e879f9';ctx.shadowBlur=9;
ctx.beginPath();ctx.arc(-1.8,-1,1.1,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.8,-1,1.1,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#fff';
ctx.beginPath();ctx.arc(-2,-1.3,0.45,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.6,-1.3,0.45,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#050208';
ctx.beginPath();ctx.ellipse(0,2.2,1.7,0.9,0,0,Math.PI*2);ctx.fill();
ctx.restore();
}

/* ============ ENEMY 11: NIGHTMARE ============ */
function drawNightmare(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+6,y+6);
var p=Math.sin(time*4)*0.18+1;
var f=Math.sin(time*2)*2;
ctx.globalAlpha=0.65;var h=rg(ctx,0,f,20,[[0,hitFlash>0?'rgba(255,255,255,0.95)':'rgba(139,92,246,0.95)'],[0.5,'rgba(124,58,237,0.55)'],[1,'rgba(30,27,75,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,f,20,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
for(var i=0;i<5;i++){var a=time*1.5+i*1.26,r=13+Math.sin(time*2+i)*2.5;
var px=Math.cos(a)*r,py=Math.sin(a)*r*0.5+f;
ctx.fillStyle='rgba(196,181,253,'+(0.5+Math.sin(time*3+i)*0.3)+')';
ctx.shadowColor='#c4b5fd';ctx.shadowBlur=5;
ctx.beginPath();ctx.arc(px,py,1.3,0,Math.PI*2);ctx.fill();}
ctx.shadowBlur=0;
var bodyG=rg(ctx,0,f,8,[[0,'#e9d5ff'],[0.5,'#8b5cf6'],[1,'#1e1b4b']]);
ctx.fillStyle=bodyG;ctx.beginPath();ctx.arc(0,f,7*p,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#1e1b4b';ctx.lineWidth=0.7;ctx.stroke();
ctx.strokeStyle='#4c1d95';ctx.lineWidth=2.6;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(-4,-4.5+f);ctx.bezierCurveTo(-5.5,-7.5+f,-6.5,-10+f,-4.5,-11+f);ctx.stroke();
ctx.beginPath();ctx.moveTo(4,-4.5+f);ctx.bezierCurveTo(5.5,-7.5+f,6.5,-10+f,4.5,-11+f);ctx.stroke();
ctx.fillStyle='#1e1b4b';
ctx.beginPath();ctx.ellipse(0,0+f,6,5.5,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#050508';
ctx.beginPath();ctx.moveTo(-4.5,2.5+f);ctx.bezierCurveTo(-2,4.5+f,2,4.5+f,4.5,2.5+f);
ctx.bezierCurveTo(2,5+f,-2,5+f,-4.5,2.5+f);ctx.fill();
ctx.fillStyle='#fff';
for(var j=0;j<5;j++){ctx.beginPath();ctx.moveTo(-3.2+j*1.6,2.9+f);ctx.lineTo(-2.5+j*1.6,4.5+f);ctx.lineTo(-1.8+j*1.6,2.9+f);ctx.fill();}
ctx.fillStyle='#e879f9';ctx.shadowColor='#e879f9';ctx.shadowBlur=13;
ctx.beginPath();ctx.arc(-2.2,-1+f,1.5,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.2,-1+f,1.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#fff';
ctx.beginPath();ctx.arc(-2.5,-1.4+f,0.55,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.9,-1.4+f,0.55,0,Math.PI*2);ctx.fill();
ctx.restore();
}

/* ============ ENEMY 12: CRYPT HORROR (L4) ============ */
function drawCryptHorror(ctx,x,y,facing,time,hitFlash){
ctx.save();ctx.translate(x+6,y+6);
var p=Math.sin(time*3)*0.15+1;
var wob=Math.sin(time*5)*1;
ctx.globalAlpha=0.55;var h=rg(ctx,0,0,17,[[0,hitFlash>0?'rgba(255,255,255,0.95)':'rgba(120,53,15,0.9)'],[1,'rgba(120,53,15,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,17,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var bodyG=rg(ctx,-2,-2,9,[[0,'#a16207'],[0.4,'#78350f'],[1,'#3f1d05']]);
ctx.fillStyle=bodyG;
ctx.beginPath();ctx.arc(0,0,8*p,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#3f1d05';ctx.lineWidth=0.8;ctx.stroke();
ctx.strokeStyle='#fbbf24';ctx.lineWidth=1;ctx.shadowColor='#fbbf24';ctx.shadowBlur=7;
for(var i=0;i<6;i++){var a=time+i*1.05,r=5;
var px=Math.cos(a)*r,py=Math.sin(a)*r;
ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(px*1.4,py*1.4);ctx.stroke();}
ctx.shadowBlur=0;
ctx.fillStyle='#ffd166';ctx.shadowColor='#ffd166';ctx.shadowBlur=10;
ctx.beginPath();ctx.arc(-2.5,-0.5+wob*0.3,1.3,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.5,-0.5+wob*0.3,1.3,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(0,2+wob*0.3,1,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#050208';
ctx.beginPath();ctx.arc(-2.5,-0.5,0.5,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.5,-0.5,0.5,0,Math.PI*2);ctx.fill();
ctx.restore();
}

/* ============ BOSS 1: SKELETON KING ============ */
function drawSkeletonKing(ctx,x,y,facing,time,hitFlash){
var b=Math.sin(time*3)*1.5;
ctx.save();ctx.translate(x+10,y+12);
ctx.globalAlpha=0.55;var h=rg(ctx,0,0,36,[[0,hitFlash>0?'rgba(255,255,255,0.95)':'rgba(226,232,240,0.75)'],[1,'rgba(226,232,240,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,36,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
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
ctx.fillStyle='#ff3355';ctx.shadowColor='#ff3355';ctx.shadowBlur=15;
ctx.beginPath();ctx.arc(-2.8,-11+b,0.9,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.8,-11+b,0.9,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#fff';
ctx.beginPath();ctx.arc(-3.1,-11.5+b,0.4,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.5,-11.5+b,0.4,0,Math.PI*2);ctx.fill();
var crownG=lg(ctx,0,-23+b,0,-17+b,[[0,'#fde68a'],[0.5,'#fbbf24'],[1,'#a16207']]);
ctx.fillStyle=crownG;ctx.strokeStyle='#78350f';ctx.lineWidth=0.6;
ctx.beginPath();ctx.moveTo(-7,-17+b);ctx.lineTo(-5.5,-23+b);ctx.lineTo(-4,-18+b);
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

/* ============ BOSS 2: FIRE DEMON ============ */
function drawFireDemon(ctx,x,y,facing,time,hitFlash){
var p=Math.sin(time*4)*0.12+1,flap=Math.sin(time*8)*6;
ctx.save();ctx.translate(x+10,y+12);
ctx.globalAlpha=0.6;var h=rg(ctx,0,0,42,[[0,hitFlash>0?'rgba(255,255,255,0.95)':'rgba(255,107,0,0.95)'],[0.4,'rgba(220,38,38,0.6)'],[1,'rgba(220,38,38,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,42,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
for(var i=0;i<7;i++){var a=time*1.8+i*0.9,r=15+Math.sin(time*3+i)*3;
var px=Math.cos(a)*r,py=Math.sin(a)*r*0.6-3;
ctx.fillStyle='rgba(251,191,36,'+(0.4+Math.sin(time*4+i)*0.25)+')';
ctx.shadowColor='#fbbf24';ctx.shadowBlur=8;
ctx.beginPath();ctx.arc(px,py,1.5,0,Math.PI*2);ctx.fill();}
ctx.shadowBlur=0;
var wg=lg(ctx,-19,-8,-4,8,[[0,'#dc2626'],[0.5,'#7f1d1d'],[1,'#450a0a']]);
ctx.fillStyle=wg;
ctx.beginPath();ctx.moveTo(-4,-3);
ctx.bezierCurveTo(-10,-7-flap,-19,-8-flap,-19,4);
ctx.bezierCurveTo(-16,1,-13,3,-11,5);
ctx.bezierCurveTo(-9,3,-6,4,-4,4);ctx.closePath();ctx.fill();
ctx.strokeStyle='#450a0a';ctx.lineWidth=0.7;ctx.stroke();
ctx.strokeStyle='#fbbf24';ctx.lineWidth=0.6;
ctx.beginPath();ctx.moveTo(-7,-4);ctx.bezierCurveTo(-13,-3,-16,0,-17,3);ctx.stroke();
ctx.beginPath();ctx.moveTo(4,-3);
ctx.bezierCurveTo(10,-7-flap,19,-8-flap,19,4);
ctx.bezierCurveTo(16,1,13,3,11,5);
ctx.bezierCurveTo(9,3,6,4,4,4);ctx.closePath();ctx.fill();ctx.stroke();
ctx.beginPath();ctx.moveTo(7,-4);ctx.bezierCurveTo(13,-3,16,0,17,3);ctx.stroke();
var bodyG=rg(ctx,-2,-2,11,[[0,'#ff9f1c'],[0.4,'#dc2626'],[1,'#450a0a']]);
ctx.fillStyle=bodyG;ctx.beginPath();ctx.arc(0,0,10*p,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#450a0a';ctx.lineWidth=0.8;ctx.stroke();
ctx.strokeStyle='#fbbf24';ctx.lineWidth=1.8;ctx.shadowColor='#fbbf24';ctx.shadowBlur=14;
ctx.beginPath();ctx.moveTo(-5,-7);ctx.lineTo(-3,0);ctx.lineTo(-5,5);ctx.stroke();
ctx.beginPath();ctx.moveTo(4,-6);ctx.lineTo(5,-1);ctx.lineTo(4,4);ctx.stroke();
ctx.beginPath();ctx.moveTo(-1,-10);ctx.lineTo(1,-5);ctx.stroke();
ctx.beginPath();ctx.moveTo(2,-9);ctx.lineTo(3,-4);ctx.stroke();
ctx.shadowBlur=0;
ctx.strokeStyle='#450a0a';ctx.lineWidth=3.4;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(-6,-6);ctx.bezierCurveTo(-11,-11,-9,-16,-6,-17);ctx.stroke();
ctx.beginPath();ctx.moveTo(6,-6);ctx.bezierCurveTo(11,-11,9,-16,6,-17);ctx.stroke();
ctx.fillStyle='#fde68a';
ctx.beginPath();ctx.arc(-6,-17,1.2,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(6,-17,1.2,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#fff8dc';ctx.shadowColor='#ff9f1c';ctx.shadowBlur=20;
ctx.beginPath();ctx.ellipse(-3.5,-1,1.9,2.6,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(3.5,-1,1.9,2.6,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#dc2626';
ctx.beginPath();ctx.ellipse(-3.5,-1,0.8,1.4,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(3.5,-1,0.8,1.4,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#050508';
ctx.beginPath();ctx.ellipse(0,3.5,5.5,1.7,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#fff';
for(var j=0;j<6;j++){ctx.beginPath();ctx.moveTo(-4.2+j*1.7,3.5);ctx.lineTo(-3.5+j*1.7,5.3);ctx.lineTo(-2.8+j*1.7,3.5);ctx.fill();}
ctx.restore();
}

/* ============ BOSS 3: ICE QUEEN ============ */
function drawIceQueen(ctx,x,y,facing,time,hitFlash){
var f=Math.sin(time*2.5)*2.5;
ctx.save();ctx.translate(x+8,y+12);
ctx.globalAlpha=0.6;var h=rg(ctx,0,f,38,[[0,hitFlash>0?'rgba(255,255,255,0.95)':'rgba(125,211,252,0.95)'],[0.5,'rgba(14,165,233,0.45)'],[1,'rgba(14,165,233,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,f,38,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
for(var i=0;i<10;i++){var a=time*1.2+i*0.628,r=14+Math.sin(time*2+i)*3;
var px=Math.cos(a)*r,py=Math.sin(a)*r*0.7+f;
ctx.fillStyle='rgba(186,230,253,'+(0.5+Math.sin(time*3+i)*0.25)+')';
ctx.shadowColor='#7dd3fc';ctx.shadowBlur=6;
ctx.beginPath();ctx.arc(px,py,1.2,0,Math.PI*2);ctx.fill();}
ctx.shadowBlur=0;
var dg=lg(ctx,0,-8+f,0,15+f,[[0,'#bae6fd'],[0.3,'#7dd3fc'],[0.7,'#0ea5e9'],[1,'#0c4a6e']]);
ctx.fillStyle=dg;
ctx.beginPath();ctx.moveTo(0,-9+f);
ctx.bezierCurveTo(6,-7+f,10,-1+f,10.5,7+f);
ctx.bezierCurveTo(10.5,12+f,6,14+f,0,14+f);
ctx.bezierCurveTo(-6,14+f,-10.5,12+f,-10.5,7+f);
ctx.bezierCurveTo(-10,-1+f,-6,-7+f,0,-9+f);ctx.fill();
ctx.strokeStyle='rgba(224,242,254,0.9)';ctx.lineWidth=1;ctx.stroke();
ctx.strokeStyle='rgba(255,255,255,0.55)';ctx.lineWidth=0.6;
ctx.beginPath();ctx.moveTo(-3.5,-3+f);ctx.bezierCurveTo(-6,2+f,-5,8+f,-3.5,12+f);ctx.stroke();
ctx.beginPath();ctx.moveTo(3.5,-3+f);ctx.bezierCurveTo(6,2+f,5,8+f,3.5,12+f);ctx.stroke();
ctx.beginPath();ctx.moveTo(0,-4+f);ctx.lineTo(0,12+f);ctx.stroke();
var skinG=rg(ctx,-1,-11+f,8,[[0,'#ffffff'],[0.6,'#e0f2fe'],[1,'#7dd3fc']]);
ctx.fillStyle=skinG;
ctx.beginPath();ctx.ellipse(0,-12+f,6,6.5,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#0c4a6e';ctx.lineWidth=0.5;ctx.stroke();
ctx.fillStyle='#e0f2fe';ctx.strokeStyle='#0369a1';ctx.lineWidth=0.5;
for(var c=0;c<5;c++){var a2=(c-2)*0.45,tx=Math.sin(a2)*8,ty=-16+f-Math.cos(a2)*5;
ctx.beginPath();ctx.moveTo(tx-1.3,-15+f);ctx.lineTo(tx,ty);ctx.lineTo(tx+1.3,-15+f);ctx.closePath();ctx.fill();ctx.stroke();}
ctx.fillStyle='#0c4a6e';
ctx.beginPath();ctx.ellipse(-2.2,-12+f,1.2,1.7,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(2.2,-12+f,1.2,1.7,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#bae6fd';ctx.shadowColor='#7dd3fc';ctx.shadowBlur=9;
ctx.beginPath();ctx.arc(-2.2,-12+f,0.55,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.2,-12+f,0.55,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.strokeStyle='#0c4a6e';ctx.lineWidth=0.5;
ctx.beginPath();ctx.moveTo(-1.3,-8+f);ctx.bezierCurveTo(0,-7+f,1.3,-8+f,0.5,-7.2+f);ctx.stroke();
ctx.fillStyle='#fff';
ctx.beginPath();ctx.moveTo(-1.1,-7.5+f);ctx.lineTo(-0.7,-6.5+f);ctx.lineTo(-0.3,-7.5+f);ctx.fill();
ctx.restore();
}

/* ============ BOSS 4: SHADOW LORD ============ */
function drawShadowLord(ctx,x,y,facing,time,hitFlash){
var p=Math.sin(time*3)*0.08+1,f=Math.sin(time*2)*3;
ctx.save();ctx.translate(x+9,y+12);
ctx.globalAlpha=0.7;var h=rg(ctx,0,f,44,[[0,hitFlash>0?'rgba(255,255,255,0.95)':'rgba(232,121,249,0.95)'],[0.4,'rgba(124,58,237,0.55)'],[1,'rgba(30,27,75,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,f,44,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
for(var i=0;i<7;i++){var a=time*2+i*0.9,r=17+Math.sin(time*2.5+i)*3;
var px=Math.cos(a)*r,py=Math.sin(a)*r*0.4+f;
ctx.fillStyle='rgba(192,132,252,'+(0.5+Math.sin(time*3+i)*0.25)+')';
ctx.shadowColor='#e879f9';ctx.shadowBlur=7;
ctx.beginPath();ctx.arc(px,py,1.5,0,Math.PI*2);ctx.fill();}
ctx.shadowBlur=0;
var cl=lg(ctx,0,-8+f,0,15+f,[[0,'#4c1d95'],[0.4,'#2a1a4a'],[1,'#050208']]);
ctx.fillStyle=cl;
ctx.beginPath();ctx.moveTo(-3,-6+f);
ctx.bezierCurveTo(-8,-4+f,-12,0+f,-11.5,13+f);
ctx.lineTo(11.5,13+f);
ctx.bezierCurveTo(12,0+f,8,-4+f,3,-6+f);ctx.closePath();ctx.fill();
ctx.strokeStyle='rgba(232,121,249,0.85)';ctx.lineWidth=0.9;ctx.stroke();
ctx.strokeStyle='rgba(232,121,249,0.4)';ctx.lineWidth=0.6;
ctx.beginPath();ctx.moveTo(-4,-2+f);ctx.bezierCurveTo(-7,2+f,-8,8+f,-8,12+f);ctx.stroke();
ctx.beginPath();ctx.moveTo(4,-2+f);ctx.bezierCurveTo(7,2+f,8,8+f,8,12+f);ctx.stroke();
ctx.beginPath();ctx.moveTo(0,-3+f);ctx.lineTo(0,13+f);ctx.stroke();
var hd=rg(ctx,-1,-10+f,9,[[0,'#e9d5ff'],[0.5,'#8b5cf6'],[1,'#1e1b4b']]);
ctx.fillStyle=hd;
ctx.beginPath();ctx.ellipse(0,-11+f,7,8*p,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#1e1b4b';ctx.lineWidth=0.7;ctx.stroke();
ctx.strokeStyle='#4c1d95';ctx.lineWidth=3;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(-5.5,-15+f);ctx.bezierCurveTo(-9,-20+f,-10,-24+f,-7,-26+f);ctx.stroke();
ctx.beginPath();ctx.moveTo(5.5,-15+f);ctx.bezierCurveTo(9,-20+f,10,-24+f,7,-26+f);ctx.stroke();
ctx.fillStyle='#e879f9';ctx.shadowColor='#e879f9';ctx.shadowBlur=13;
ctx.beginPath();ctx.arc(-7,-26+f,1.2,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(7,-26+f,1.2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#e879f9';ctx.shadowColor='#e879f9';ctx.shadowBlur=18;
ctx.beginPath();ctx.arc(-3,-12+f,1.6,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(3,-12+f,1.6,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(0,-7+f,1.2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#fff';
ctx.beginPath();ctx.arc(-3.3,-12.5+f,0.55,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(2.7,-12.5+f,0.55,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#050208';
ctx.beginPath();ctx.moveTo(-3.5,1+f);ctx.bezierCurveTo(-1,3+f,1,3+f,3.5,1+f);
ctx.bezierCurveTo(1,4+f,-1,4+f,-3.5,1+f);ctx.fill();
ctx.fillStyle='#e879f9';
for(var j=0;j<4;j++){ctx.beginPath();ctx.moveTo(-2.4+j*1.5,1.5+f);ctx.lineTo(-1.8+j*1.5,3+f);ctx.lineTo(-1.2+j*1.5,1.5+f);ctx.fill();}
ctx.restore();
}

/* ============ ITEMS ============ */
function drawCoinItem(ctx,x,y,bob){
ctx.save();ctx.translate(x,y+Math.sin(bob)*2);
ctx.globalAlpha=0.6;var h=rg(ctx,0,0,11,[[0,'rgba(251,191,36,0.95)'],[1,'rgba(251,191,36,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,11,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var g=rg(ctx,-1,-1,4.5,[[0,'#fff8dc'],[0.5,'#fbbf24'],[1,'#a16207']]);
ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#78350f';ctx.lineWidth=0.6;ctx.stroke();
ctx.strokeStyle='rgba(255,255,255,0.7)';ctx.lineWidth=0.35;
ctx.beginPath();ctx.arc(-1,-1,1.7,0,Math.PI*2);ctx.stroke();
ctx.fillStyle='#78350f';ctx.fillRect(-0.6,-2.4,1.2,4.8);
ctx.restore();
}

function drawKeyItem(ctx,x,y,bob){
ctx.save();ctx.translate(x,y+Math.sin(bob)*2);
ctx.globalAlpha=0.8;var h=rg(ctx,0,0,19,[[0,'rgba(251,191,36,1)'],[0.5,'rgba(251,191,36,0.55)'],[1,'rgba(251,191,36,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,19,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var kg=rg(ctx,0,-3,3.5,[[0,'#fde68a'],[0.6,'#fbbf24'],[1,'#a16207']]);
ctx.fillStyle=kg;ctx.strokeStyle='#78350f';ctx.lineWidth=0.8;
ctx.beginPath();ctx.arc(0,-3,3.5,0,Math.PI*2);ctx.fill();ctx.stroke();
ctx.fillStyle='#78350f';ctx.beginPath();ctx.arc(0,-3,1.3,0,Math.PI*2);ctx.fill();
ctx.fillStyle=kg;
ctx.fillRect(-1.2,-1,2.4,8);ctx.strokeRect(-1.2,-1,2.4,8);
ctx.fillRect(1.2,3.5,2.2,1.5);ctx.strokeRect(1.2,3.5,2.2,1.5);
ctx.fillRect(1.2,6,2.2,1.5);ctx.strokeRect(1.2,6,2.2,1.5);
ctx.restore();
}

function drawPortalItem(ctx,x,y,time){
ctx.save();ctx.translate(x,y+6);
var p=1+Math.sin(time*3)*0.12;
ctx.globalAlpha=0.6;var h=rg(ctx,0,0,28*p,[[0,'rgba(6,255,165,0.95)'],[0.5,'rgba(6,255,165,0.45)'],[1,'rgba(6,255,165,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,28*p,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
var pt=rg(ctx,0,0,12,[[0,'#ffffff'],[0.3,'#06ffa5'],[0.7,'#047857'],[1,'#064e3b']]);
ctx.fillStyle=pt;
ctx.beginPath();ctx.ellipse(0,0,7.5*p,13,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#06ffa5';ctx.lineWidth=1.5;ctx.shadowColor='#06ffa5';ctx.shadowBlur=12;
ctx.globalAlpha=0.95;ctx.stroke();ctx.shadowBlur=0;ctx.globalAlpha=1;
for(var i=0;i<10;i++){var a=time*2+i*0.628,r=12+Math.sin(time*2+i)*4;
ctx.fillStyle='rgba(167,243,208,'+(0.6+Math.sin(time*3+i)*0.3)+')';
ctx.shadowColor='#06ffa5';ctx.shadowBlur=4;
ctx.beginPath();ctx.arc(Math.cos(a)*r,Math.sin(a)*r,1.3,0,Math.PI*2);ctx.fill();}
ctx.shadowBlur=0;ctx.restore();
}

/* ============ SHOPKEEPER NPC ============ */
function drawShopkeeper(ctx,x,y,time){
ctx.save();ctx.translate(x,y);
var bob=Math.sin(time*2)*2;
var h=rg(ctx,0,0,22,[[0,'rgba(251,191,36,0.5)'],[1,'rgba(251,191,36,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,22,0,Math.PI*2);ctx.fill();
// ساقين
ctx.fillStyle='#3f1d05';
ctx.fillRect(-4,8,2.5,6);
ctx.fillRect(1.5,8,2.5,6);
// الجسم
var bodyG=lg(ctx,0,-2,0,10,[[0,'#a16207'],[0.5,'#78350f'],[1,'#3f1d05']]);
ctx.fillStyle=bodyG;
ctx.beginPath();ctx.ellipse(0,2+bob*0.3,7,7,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#3f1d05';ctx.lineWidth=0.6;ctx.stroke();
// الرأس
ctx.fillStyle='#fbbf24';
ctx.beginPath();ctx.arc(0,-6+bob,4.5,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#78350f';ctx.lineWidth=0.5;ctx.stroke();
// العيون
ctx.fillStyle='#050208';
ctx.beginPath();ctx.arc(-1.5,-6.5+bob,0.6,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.5,-6.5+bob,0.6,0,Math.PI*2);ctx.fill();
// قبعة
ctx.fillStyle='#78350f';
ctx.beginPath();ctx.ellipse(0,-9+bob,7,2,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#a16207';
ctx.fillRect(-3,-15+bob,6,6);
ctx.fillStyle='#fbbf24';
ctx.fillRect(-3,-10.5+bob,6,1);
// ذراع تلوح
ctx.strokeStyle='#78350f';ctx.lineWidth=2;ctx.lineCap='round';
var wave=Math.sin(time*4)*2;
ctx.beginPath();ctx.moveTo(6,0+bob*0.3);ctx.lineTo(9+wave,-4+bob);ctx.stroke();
// عملات طائرة
for(var i=0;i<3;i++){
var a=time*1.5+i*2.1,r=12;
ctx.fillStyle='#fbbf24';ctx.shadowColor='#fbbf24';ctx.shadowBlur=5;
ctx.beginPath();ctx.arc(Math.cos(a)*r,Math.sin(a)*r*0.5-8,1.5,0,Math.PI*2);ctx.fill();
}
ctx.shadowBlur=0;
ctx.restore();
}

/* ============ BLACKSMITH NPC ============ */
function drawBlacksmith(ctx,x,y,time){
ctx.save();ctx.translate(x,y);
var bob=Math.sin(time*2)*1.5;
var h=rg(ctx,0,0,22,[[0,'rgba(255,107,0,0.5)'],[1,'rgba(255,107,0,0)']]);
ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,22,0,Math.PI*2);ctx.fill();
// ساقين
ctx.fillStyle='#450a0a';
ctx.fillRect(-5,8,3,6);
ctx.fillRect(2,8,3,6);
// الجسم (ضخم)
var bodyG=lg(ctx,0,-2,0,11,[[0,'#7f1d1d'],[0.5,'#450a0a'],[1,'#1a0305']]);
ctx.fillStyle=bodyG;
ctx.beginPath();ctx.ellipse(0,2+bob*0.3,8,7.5,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#450a0a';ctx.lineWidth=0.6;ctx.stroke();
// الرأس
ctx.fillStyle='#a16207';
ctx.beginPath();ctx.arc(0,-6+bob,4.5,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#3f1d05';ctx.lineWidth=0.5;ctx.stroke();
// عيون نار
ctx.fillStyle='#fbbf24';ctx.shadowColor='#fbbf24';ctx.shadowBlur=8;
ctx.beginPath();ctx.arc(-1.5,-6.5+bob,0.7,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(1.5,-6.5+bob,0.7,0,Math.PI*2);ctx.fill();
ctx.shadowBlur=0;
// لحية
ctx.fillStyle='#3f1d05';
ctx.beginPath();ctx.moveTo(-4,-4+bob);ctx.bezierCurveTo(-5,-1+bob,5,-1+bob,4,-4+bob);
ctx.bezierCurveTo(2,-2+bob,-2,-2+bob,-4,-4+bob);ctx.fill();
// ذراع يحمل مطرقة
ctx.strokeStyle='#7f1d1d';ctx.lineWidth=2.5;ctx.lineCap='round';
var hit=Math.sin(time*3)*4;
ctx.beginPath();ctx.moveTo(5,0+bob*0.3);ctx.lineTo(9,-3+bob+hit);ctx.stroke();
// المطرقة
ctx.fillStyle='#4a4a6a';
ctx.fillRect(8,-8+bob+hit,5,4);
ctx.fillStyle='#1a1a2e';
ctx.fillRect(9,-7+bob+hit,3,2);
// شرارات
for(var i=0;i<4;i++){
var a=time*2+i*1.57,r=11;
ctx.fillStyle='#fbbf24';ctx.shadowColor='#fbbf24';ctx.shadowBlur=6;
ctx.beginPath();ctx.arc(8+Math.cos(a)*2,-8+bob+hit+Math.sin(a)*2,1,0,Math.PI*2);ctx.fill();
}
ctx.shadowBlur=0;
ctx.restore();
}

function drawUmbra(ctx,x,y,time,hitFlash){
ctx.save();ctx.translate(x+15,y+18);
var p=Math.sin(time*3)*0.1+1,f=Math.sin(time*2)*4;
for(var i=0;i<3;i++){var r=60+i*30+Math.sin(time*2+i)*8;
var g=rg(ctx,0,f,r,[[0,hitFlash>0?'rgba(255,255,255,0.9)':'rgba(255,20,60,'+(0.3-i*0.08)+')'],[1,'rgba(0,0,0,0)']]);
ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,f,r,0,Math.PI*2);ctx.fill();}
var flap=Math.sin(time*4)*8;
ctx.fillStyle='rgba(10,0,20,0.95)';
ctx.beginPath();ctx.moveTo(-3,0);
ctx.bezierCurveTo(-25,-20-flap,-50,-15-flap,-55,15);
ctx.bezierCurveTo(-40,5,-30,10,-20,15);
ctx.bezierCurveTo(-15,5,-8,8,-3,10);ctx.closePath();ctx.fill();
ctx.strokeStyle='#ff1493';ctx.lineWidth=1.5;ctx.stroke();
ctx.beginPath();ctx.moveTo(3,0);
ctx.bezierCurveTo(25,-20-flap,50,-15-flap,55,15);
ctx.bezierCurveTo(40,5,30,10,20,15);
ctx.bezierCurveTo(15,5,8,8,3,10);ctx.closePath();ctx.fill();ctx.stroke();
var bg=rg(ctx,0,f,18,[[0,'#4c1d95'],[0.5,'#1a0a2e'],[1,'#000000']]);
ctx.fillStyle=bg;ctx.beginPath();ctx.arc(0,0,16*p,0,Math.PI*2);ctx.fill();
ctx.fillStyle='rgba(255,20,60,0.6)';
ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(10,0);ctx.lineTo(0,8);ctx.lineTo(-10,0);ctx.closePath();ctx.fill();
ctx.strokeStyle='#ff1493';ctx.lineWidth=1.5;ctx.stroke();
ctx.strokeStyle='#1a0a2e';ctx.lineWidth=4;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(-8,-10);ctx.bezierCurveTo(-15,-25,-20,-30,-12,-35);ctx.stroke();
ctx.beginPath();ctx.moveTo(8,-10);ctx.bezierCurveTo(15,-25,20,-30,12,-35);ctx.stroke();
ctx.fillStyle='#ff1493';ctx.shadowColor='#ff1493';ctx.shadowBlur=15;
ctx.beginPath();ctx.arc(-12,-35,2,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(12,-35,2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#ff1493';ctx.shadowColor='#ff1493';ctx.shadowBlur=25;
ctx.beginPath();ctx.ellipse(-6,-2,3,4,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(6,-2,3,4,0,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.ellipse(0,4,2.5,3,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle='#fff';
ctx.beginPath();ctx.arc(-6,-3,1,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(6,-3,1,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(0,3,0.8,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#000';
ctx.beginPath();ctx.moveTo(-8,10);ctx.bezierCurveTo(-3,14,3,14,8,10);
ctx.bezierCurveTo(3,15,-3,15,-8,10);ctx.fill();
ctx.fillStyle='#ff1493';
for(var j=0;j<5;j++){ctx.beginPath();ctx.moveTo(-6+j*3,10.5);ctx.lineTo(-4.5+j*3,13);ctx.lineTo(-3+j*3,10.5);ctx.fill();}
for(var k=0;k<8;k++){var a=time*1.5+k*0.785,r=28+Math.sin(time*3+k)*6;
var px=Math.cos(a)*r,py=Math.sin(a)*r*0.5+f;
ctx.fillStyle='rgba(255,20,60,'+(0.6+Math.sin(time*4+k)*0.3)+')';
ctx.shadowColor='#ff1493';ctx.shadowBlur=8;
ctx.beginPath();ctx.arc(px,py,1.5,0,Math.PI*2);ctx.fill();}
ctx.shadowBlur=0;ctx.restore();
}
