function drawKnight(ctx,x,y,facing,state,time,hitFlash,attacking){
  ctx.save(); ctx.translate(x+6,y+10); if(facing===-1) ctx.scale(-1,1);
  ctx.globalAlpha=0.35;
  var h=ctx.createRadialGradient(0,0,2,0,0,18);
  h.addColorStop(0,hitFlash>0?'rgba(255,51,85,0.8)':'rgba(124,58,237,0.7)');
  h.addColorStop(1,'rgba(124,58,237,0)');
  ctx.fillStyle=h; ctx.beginPath(); ctx.arc(0,0,18,0,Math.PI*2); ctx.fill();
  ctx.globalAlpha=1;
  var sway=Math.sin(time*4)*1.5;
  var cl=ctx.createLinearGradient(0,-5,0,12);
  cl.addColorStop(0,'#1a1a2e'); cl.addColorStop(0.5,'#0f0f20'); cl.addColorStop(1,'#050508');
  ctx.fillStyle=cl;
  ctx.beginPath(); ctx.moveTo(-6,-2); ctx.quadraticCurveTo(-8+sway,6,-7,12); ctx.lineTo(0,11); ctx.lineTo(7,12); ctx.quadraticCurveTo(8+sway,6,6,-2); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#7c3aed'; ctx.lineWidth=0.6; ctx.globalAlpha=0.7; ctx.stroke(); ctx.globalAlpha=1;
  var mg=ctx.createRadialGradient(-1,-7,0.5,0,-6,7);
  mg.addColorStop(0,'#ffffff'); mg.addColorStop(0.6,'#f5f0ff'); mg.addColorStop(1,'#c8bce8');
  ctx.fillStyle=mg; ctx.beginPath(); ctx.ellipse(0,-6,5.5,6.5,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#050508'; ctx.lineWidth=0.5; ctx.stroke();
  ctx.strokeStyle='#f5f0ff'; ctx.lineWidth=2.2; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(-3,-11); ctx.quadraticCurveTo(-5,-16,-3.5,-18); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(3,-11); ctx.quadraticCurveTo(5,-16,3.5,-18); ctx.stroke();
  ctx.fillStyle='#f5f0ff'; ctx.beginPath(); ctx.arc(-3.5,-18,1,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(3.5,-18,1,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#a78bfa'; ctx.shadowColor='#a78bfa'; ctx.shadowBlur=4;
  ctx.beginPath(); ctx.ellipse(-2,-6,0.9,2,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(2,-6,0.9,2,0,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0;
  if(state==='walk'){
    var ls=Math.sin(time*12)*2;
    ctx.strokeStyle='#0a0a18'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(-2,10); ctx.lineTo(-2+ls,15); ctx.moveTo(2,10); ctx.lineTo(2-ls,15); ctx.stroke();
  } else {
    ctx.strokeStyle='#0a0a18'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(-2,10); ctx.lineTo(-2,15); ctx.moveTo(2,10); ctx.lineTo(2,15); ctx.stroke();
  }
  if(attacking){
    ctx.save(); ctx.rotate(-Math.PI*0.15);
    ctx.shadowColor='#ffd166'; ctx.shadowBlur=12;
    ctx.strokeStyle='#fff8dc'; ctx.lineWidth=2; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(6,-2); ctx.lineTo(20,-4); ctx.stroke();
    ctx.shadowBlur=0; ctx.strokeStyle='#ffd166'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.moveTo(4,1); ctx.lineTo(7,-2); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}
function drawBat(ctx,x,y,facing,time,hitFlash){
  ctx.save(); ctx.translate(x+6,y+6);
  var flap=Math.sin(time*12)*4;
  ctx.globalAlpha=0.3; ctx.fillStyle=hitFlash>0?'#fff':'#ff3355';
  ctx.beginPath(); ctx.arc(0,0,10,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  ctx.fillStyle='#7f1d1d';
  ctx.beginPath(); ctx.moveTo(-2,-1); ctx.quadraticCurveTo(-8,-3-flap,-10,2); ctx.quadraticCurveTo(-7,1,-5,3); ctx.lineTo(-2,2); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(2,-1); ctx.quadraticCurveTo(8,-3-flap,10,2); ctx.quadraticCurveTo(7,1,5,3); ctx.lineTo(2,2); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#050508'; ctx.lineWidth=0.5; ctx.stroke();
  var bg=ctx.createRadialGradient(0,0,0.5,0,0,5);
  bg.addColorStop(0,'#dc2626'); bg.addColorStop(1,'#7f1d1d');
  ctx.fillStyle=bg; ctx.beginPath(); ctx.ellipse(0,0,4,4.5,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#7f1d1d';
  ctx.beginPath(); ctx.moveTo(-2.5,-4); ctx.lineTo(-3.5,-7); ctx.lineTo(-1,-5); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(2.5,-4); ctx.lineTo(3.5,-7); ctx.lineTo(1,-5); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#ffd166'; ctx.shadowColor='#ffd166'; ctx.shadowBlur=4;
  ctx.beginPath(); ctx.arc(-1.5,-0.5,0.8,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(1.5,-0.5,0.8,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0; ctx.restore();
}
function drawSlime(ctx,x,y,facing,time,hitFlash){
  ctx.save(); ctx.translate(x+5,y+8);
  var sq=Math.sin(time*4)*0.15+1, sc=1/sq;
  ctx.globalAlpha=0.3; ctx.fillStyle=hitFlash>0?'#fff':'#4ade80';
  ctx.beginPath(); ctx.ellipse(0,4,10,6,0,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  var g=ctx.createRadialGradient(-1,0,1,0,4,8);
  g.addColorStop(0,'#86efac'); g.addColorStop(0.5,'#4ade80'); g.addColorStop(1,'#166534');
  ctx.fillStyle=g;
  ctx.beginPath(); ctx.moveTo(0,-6*sc); ctx.quadraticCurveTo(7*sq,-2,7*sq,3); ctx.quadraticCurveTo(7*sq,7,0,7); ctx.quadraticCurveTo(-7*sq,7,-7*sq,3); ctx.quadraticCurveTo(-7*sq,-2,0,-6*sc); ctx.fill();
  ctx.strokeStyle='#050508'; ctx.lineWidth=0.5; ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.ellipse(-2,0,2,1.5,-0.5,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#050508'; ctx.beginPath(); ctx.arc(-2,2,0.9,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(2,2,0.9,0,Math.PI*2); ctx.fill();
  ctx.restore();
}
function drawSkeleton(ctx,x,y,facing,time,hitFlash){
  ctx.save(); ctx.translate(x+5,y+6);
  var b=Math.sin(time*6)*1;
  ctx.globalAlpha=0.25; ctx.fillStyle=hitFlash>0?'#fff':'#94a3b8';
  ctx.beginPath(); ctx.arc(0,0,11,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=1.4; ctx.lineCap='round';
  for(var i=0;i<3;i++){ ctx.beginPath(); ctx.moveTo(-4,2+i*2.5); ctx.quadraticCurveTo(0,3+i*2.5,4,2+i*2.5); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,10); ctx.stroke();
  ctx.fillStyle='#e2e8f0'; ctx.beginPath(); ctx.ellipse(0,-3+b,4,4.5,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#cbd5e1'; ctx.beginPath(); ctx.ellipse(0,0.5+b,3,1.8,0,0,Math.PI); ctx.fill();
  ctx.fillStyle='#050508'; ctx.beginPath(); ctx.ellipse(-1.5,-3+b,1,1.4,0,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(1.5,-3+b,1,1.4,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#ff3355'; ctx.shadowColor='#ff3355'; ctx.shadowBlur=3;
  ctx.beginPath(); ctx.arc(-1.5,-3+b,0.4,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(1.5,-3+b,0.4,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0; ctx.restore();
}
function drawImp(ctx,x,y,facing,time,hitFlash){
  ctx.save(); ctx.translate(x+6,y+6);
  var flap=Math.sin(time*10)*3;
  ctx.globalAlpha=0.35;
  var h=ctx.createRadialGradient(0,0,2,0,0,12);
  h.addColorStop(0,'rgba(255,159,28,0.9)'); h.addColorStop(1,'rgba(255,159,28,0)');
  ctx.fillStyle=h; ctx.beginPath(); ctx.arc(0,0,12,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  ctx.fillStyle='#7f1d1d';
  ctx.beginPath(); ctx.moveTo(-2,0); ctx.quadraticCurveTo(-9,-2-flap,-10,3); ctx.quadraticCurveTo(-6,1,-2,2); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(2,0); ctx.quadraticCurveTo(9,-2-flap,10,3); ctx.quadraticCurveTo(6,1,2,2); ctx.closePath(); ctx.fill();
  var g=ctx.createRadialGradient(0,0,1,0,0,5);
  g.addColorStop(0,'#ff9f1c'); g.addColorStop(0.6,'#dc2626'); g.addColorStop(1,'#7f1d1d');
  ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(0,0,4,4.5,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#050508'; ctx.lineWidth=1.8; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(-2.5,-3.5); ctx.quadraticCurveTo(-4,-6,-2.5,-7.5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(2.5,-3.5); ctx.quadraticCurveTo(4,-6,2.5,-7.5); ctx.stroke();
  ctx.fillStyle='#ffd166'; ctx.shadowColor='#ffd166'; ctx.shadowBlur=5;
  ctx.beginPath(); ctx.arc(-1.3,-0.5,0.8,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(1.3,-0.5,0.8,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0; ctx.restore();
}
function drawFireGolem(ctx,x,y,facing,time,hitFlash){
  ctx.save(); ctx.translate(x+6,y+6);
  var p=Math.sin(time*5)*0.15+1;
  ctx.globalAlpha=0.4;
  var h=ctx.createRadialGradient(0,0,2,0,0,14);
  h.addColorStop(0,'rgba(255,107,0,0.9)'); h.addColorStop(1,'rgba(255,107,0,0)');
  ctx.fillStyle=h; ctx.beginPath(); ctx.arc(0,0,14,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  var g=ctx.createRadialGradient(-2,-2,1,0,0,7);
  g.addColorStop(0,'#ff9f1c'); g.addColorStop(0.5,'#dc2626'); g.addColorStop(1,'#450a0a');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,6*p,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#fbbf24'; ctx.lineWidth=1; ctx.shadowColor='#fbbf24'; ctx.shadowBlur=6;
  ctx.beginPath(); ctx.moveTo(-3,-3); ctx.lineTo(-1,0); ctx.lineTo(-2,3); ctx.moveTo(2,-4); ctx.lineTo(3,-1); ctx.lineTo(2,2); ctx.stroke();
  ctx.shadowBlur=0;
  ctx.fillStyle='#fff8dc'; ctx.shadowColor='#fbbf24'; ctx.shadowBlur=8;
  ctx.beginPath(); ctx.arc(-2,-1,1,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(2,-1,1,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0; ctx.restore();
}
function drawIceWraith(ctx,x,y,facing,time,hitFlash){
  ctx.save(); ctx.translate(x+5,y+6);
  var f=Math.sin(time*3)*2;
  ctx.globalAlpha=0.4;
  var h=ctx.createRadialGradient(0,f,2,0,f,12);
  h.addColorStop(0,'rgba(0,212,255,0.7)'); h.addColorStop(1,'rgba(0,212,255,0)');
  ctx.fillStyle=h; ctx.beginPath(); ctx.arc(0,f,12,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  var g=ctx.createLinearGradient(0,-6+f,0,6+f);
  g.addColorStop(0,'#e0f2fe'); g.addColorStop(0.5,'#7dd3fc'); g.addColorStop(1,'rgba(2,132,199,0.3)');
  ctx.fillStyle=g;
  ctx.beginPath(); ctx.moveTo(0,-6+f); ctx.quadraticCurveTo(5,-3+f,4,0+f); ctx.quadraticCurveTo(4,3+f,2,5+f); ctx.quadraticCurveTo(0,7+f,-2,5+f); ctx.quadraticCurveTo(-4,3+f,-4,0+f); ctx.quadraticCurveTo(-5,-3+f,0,-6+f); ctx.fill();
  ctx.fillStyle='#0c4a6e'; ctx.beginPath(); ctx.ellipse(-1.5,0+f,0.8,1.2,0,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(1.5,0+f,0.8,1.2,0,0,Math.PI*2); ctx.fill();
  ctx.restore();
}
function drawFrostSpider(ctx,x,y,facing,time,hitFlash){
  ctx.save(); ctx.translate(x+6,y+5);
  var lm=Math.sin(time*8)*1.5;
  ctx.globalAlpha=0.3; ctx.fillStyle='#7dd3fc';
  ctx.beginPath(); ctx.arc(0,0,10,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  ctx.strokeStyle='#0c4a6e'; ctx.lineWidth=1.2; ctx.lineCap='round';
  for(var i=0;i<4;i++){
    ctx.beginPath(); ctx.moveTo(-3,0); ctx.quadraticCurveTo(-6,-2+i,-8,2+i*2+lm); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(3,0); ctx.quadraticCurveTo(6,-2+i,8,2+i*2-lm); ctx.stroke();
  }
  var g=ctx.createRadialGradient(-1,-1,1,0,0,6);
  g.addColorStop(0,'#e0f2fe'); g.addColorStop(1,'#0369a1');
  ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(0,0,5,4,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#dc2626'; ctx.shadowColor='#dc2626'; ctx.shadowBlur=4;
  ctx.beginPath(); ctx.arc(-1.5,-1,0.7,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(1.5,-1,0.7,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0; ctx.restore();
}
function drawIceGolem(ctx,x,y,facing,time,hitFlash){
  ctx.save(); ctx.translate(x+6,y+6);
  var p=Math.sin(time*3)*0.1+1;
  ctx.globalAlpha=0.4;
  var h=ctx.createRadialGradient(0,0,2,0,0,14);
  h.addColorStop(0,'rgba(125,211,252,0.8)'); h.addColorStop(1,'rgba(125,211,252,0)');
  ctx.fillStyle=h; ctx.beginPath(); ctx.arc(0,0,14,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  var g=ctx.createRadialGradient(-2,-2,1,0,0,7);
  g.addColorStop(0,'#ffffff'); g.addColorStop(0.4,'#7dd3fc'); g.addColorStop(1,'#0369a1');
  ctx.fillStyle=g;
  ctx.beginPath(); ctx.moveTo(0,-7*p); ctx.lineTo(6*p,-2); ctx.lineTo(6*p,4); ctx.lineTo(0,7*p); ctx.lineTo(-6*p,4); ctx.lineTo(-6*p,-2); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#0c4a6e'; ctx.lineWidth=0.6; ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,0.7)'; ctx.lineWidth=0.5;
  ctx.beginPath(); ctx.moveTo(-2,-4); ctx.lineTo(1,0); ctx.lineTo(-1,3); ctx.stroke();
  ctx.fillStyle='#0c4a6e'; ctx.beginPath(); ctx.arc(-2,-1,0.9,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(2,-1,0.9,0,Math.PI*2); ctx.fill();
  ctx.restore();
}
function drawShadowBeast(ctx,x,y,facing,time,hitFlash){
  ctx.save(); ctx.translate(x+6,y+6);
  var flap=Math.sin(time*8)*4;
  ctx.globalAlpha=0.5;
  var h=ctx.createRadialGradient(0,0,2,0,0,14);
  h.addColorStop(0,'rgba(232,121,249,0.7)'); h.addColorStop(1,'rgba(232,121,249,0)');
  ctx.fillStyle=h; ctx.beginPath(); ctx.arc(0,0,14,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  ctx.fillStyle='rgba(10,5,24,0.9)';
  ctx.beginPath(); ctx.moveTo(-2,0); ctx.quadraticCurveTo(-10,-4-flap,-12,3); ctx.quadraticCurveTo(-8,2,-2,3); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(2,0); ctx.quadraticCurveTo(10,-4-flap,12,3); ctx.quadraticCurveTo(8,2,2,3); ctx.closePath(); ctx.fill();
  var g=ctx.createRadialGradient(0,0,1,0,0,5);
  g.addColorStop(0,'#c084fc'); g.addColorStop(1,'#1e1b4b');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,4.5,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#e879f9'; ctx.shadowColor='#e879f9'; ctx.shadowBlur=6;
  ctx.beginPath(); ctx.arc(-1.5,-0.5,0.8,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(1.5,-0.5,0.8,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0; ctx.restore();
}
function drawVoidCrawler(ctx,x,y,facing,time,hitFlash){
  ctx.save(); ctx.translate(x+6,y+5);
  var lm=Math.sin(time*10)*2;
  ctx.globalAlpha=0.4; ctx.fillStyle='#a78bfa';
  ctx.beginPath(); ctx.arc(0,0,11,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  ctx.strokeStyle='#1e1b4b'; ctx.lineWidth=1.5; ctx.lineCap='round';
  for(var i=0;i<3;i++){
    ctx.beginPath(); ctx.moveTo(-3,0); ctx.lineTo(-6-i,3+i+lm); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(3,0); ctx.lineTo(6+i,3+i-lm); ctx.stroke();
  }
  var g=ctx.createRadialGradient(-1,-1,1,0,0,6);
  g.addColorStop(0,'#c4b5fd'); g.addColorStop(1,'#4c1d95');
  ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(0,0,5,4,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#e879f9'; ctx.shadowColor='#e879f9'; ctx.shadowBlur=5;
  ctx.beginPath(); ctx.arc(-1.5,-1,0.9,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(1.5,-1,0.9,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0; ctx.restore();
}
function drawNightmare(ctx,x,y,facing,time,hitFlash){
  ctx.save(); ctx.translate(x+6,y+6);
  var p=Math.sin(time*4)*0.2+1;
  ctx.globalAlpha=0.5;
  var h=ctx.createRadialGradient(0,0,2,0,0,16);
  h.addColorStop(0,'rgba(139,92,246,0.9)'); h.addColorStop(1,'rgba(139,92,246,0)');
  ctx.fillStyle=h; ctx.beginPath(); ctx.arc(0,0,16,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  var g=ctx.createRadialGradient(0,0,1,0,0,7);
  g.addColorStop(0,'#e9d5ff'); g.addColorStop(0.5,'#8b5cf6'); g.addColorStop(1,'#1e1b4b');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,6*p,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#4c1d95'; ctx.lineWidth=2; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(-3,-4); ctx.lineTo(-5,-8); ctx.moveTo(3,-4); ctx.lineTo(5,-8); ctx.stroke();
  ctx.strokeStyle='#050508'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(-3,2); ctx.quadraticCurveTo(0,4,3,2); ctx.stroke();
  ctx.fillStyle='#fff';
  for(var i=0;i<4;i++){ ctx.beginPath(); ctx.moveTo(-2+i*1.3,2.2); ctx.lineTo(-1.5+i*1.3,3.5); ctx.lineTo(-1+i*1.3,2.2); ctx.fill(); }
  ctx.fillStyle='#e879f9'; ctx.shadowColor='#e879f9'; ctx.shadowBlur=8;
  ctx.beginPath(); ctx.arc(-2,-1,1.1,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(2,-1,1.1,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0; ctx.restore();
}
function drawSkeletonKing(ctx,x,y,facing,time,hitFlash){
  ctx.save(); ctx.translate(x+10,y+12);
  var b=Math.sin(time*3)*1.5;
  ctx.globalAlpha=0.5;
  var h=ctx.createRadialGradient(0,0,4,0,0,30);
  h.addColorStop(0,'rgba(226,232,240,0.7)'); h.addColorStop(1,'rgba(226,232,240,0)');
  ctx.fillStyle=h; ctx.beginPath(); ctx.arc(0,0,30,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  var cl=ctx.createLinearGradient(0,-5,0,15);
  cl.addColorStop(0,'#4a044e'); cl.addColorStop(1,'#1e1b4b');
  ctx.fillStyle=cl;
  ctx.beginPath(); ctx.moveTo(-10,-6); ctx.quadraticCurveTo(-13,5,-12,15); ctx.lineTo(12,15); ctx.quadraticCurveTo(13,5,10,-6); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#fbbf24'; ctx.lineWidth=1; ctx.stroke();
  ctx.fillStyle='#e2e8f0'; ctx.beginPath(); ctx.arc(-8,-5,2,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(8,-5,2,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#e2e8f0'; ctx.beginPath(); ctx.ellipse(0,-10+b,7,8,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#cbd5e1'; ctx.beginPath(); ctx.ellipse(0,-4+b,5.5,3,0,0,Math.PI); ctx.fill();
  ctx.fillStyle='#e2e8f0'; for(var i=0;i<5;i++){ ctx.fillRect(-4+i*2,-4+b,1,2); }
  ctx.fillStyle='#ff3355'; ctx.shadowColor='#ff3355'; ctx.shadowBlur=12;
  ctx.beginPath(); ctx.ellipse(-2.5,-11+b,1.5,2,0,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(2.5,-11+b,1.5,2,0,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0;
  ctx.fillStyle='#fbbf24'; ctx.strokeStyle='#78350f'; ctx.lineWidth=0.6;
  ctx.beginPath(); ctx.moveTo(-7,-17+b); ctx.lineTo(-5,-22+b); ctx.lineTo(-3,-18+b); ctx.lineTo(0,-23+b); ctx.lineTo(3,-18+b); ctx.lineTo(5,-22+b); ctx.lineTo(7,-17+b); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#ff3355'; ctx.beginPath(); ctx.arc(0,-21+b,0.8,0,Math.PI*2); ctx.fill();
  ctx.restore();
}
function drawFireDemon(ctx,x,y,facing,time,hitFlash){
  ctx.save(); ctx.translate(x+10,y+12);
  var p=Math.sin(time*4)*0.15+1, flap=Math.sin(time*6)*4;
  ctx.globalAlpha=0.5;
  var h=ctx.createRadialGradient(0,0,4,0,0,35);
  h.addColorStop(0,'rgba(255,107,0,0.9)'); h.addColorStop(0.5,'rgba(220,38,38,0.5)'); h.addColorStop(1,'rgba(220,38,38,0)');
  ctx.fillStyle=h; ctx.beginPath(); ctx.arc(0,0,35,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  var wg=ctx.createLinearGradient(-14,-5,-5,8);
  wg.addColorStop(0,'#dc2626'); wg.addColorStop(1,'#7f1d1d');
  ctx.fillStyle=wg;
  ctx.beginPath(); ctx.moveTo(-4,-3); ctx.quadraticCurveTo(-14,-6-flap,-16,6); ctx.quadraticCurveTo(-12,4,-8,7); ctx.quadraticCurveTo(-5,5,-4,4); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(4,-3); ctx.quadraticCurveTo(14,-6-flap,16,6); ctx.quadraticCurveTo(12,4,8,7); ctx.quadraticCurveTo(5,5,4,4); ctx.closePath(); ctx.fill();
  var bg=ctx.createRadialGradient(-2,-2,2,0,0,10);
  bg.addColorStop(0,'#ff9f1c'); bg.addColorStop(0.4,'#dc2626'); bg.addColorStop(1,'#450a0a');
  ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(0,0,9*p,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#fbbf24'; ctx.lineWidth=1.5; ctx.shadowColor='#fbbf24'; ctx.shadowBlur=10;
  ctx.beginPath(); ctx.moveTo(-4,-5); ctx.lineTo(-2,0); ctx.lineTo(-4,5); ctx.moveTo(3,-6); ctx.lineTo(5,-1); ctx.lineTo(3,4); ctx.moveTo(-1,-8); ctx.lineTo(1,-4); ctx.stroke();
  ctx.shadowBlur=0;
  ctx.strokeStyle='#450a0a'; ctx.lineWidth=3; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(-5,-6); ctx.quadraticCurveTo(-9,-12,-6,-15); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(5,-6); ctx.quadraticCurveTo(9,-12,6,-15); ctx.stroke();
  ctx.fillStyle='#fff8dc'; ctx.shadowColor='#ff9f1c'; ctx.shadowBlur=15;
  ctx.beginPath(); ctx.ellipse(-3,-1,1.5,2,0,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(3,-1,1.5,2,0,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0; ctx.restore();
}
function drawIceQueen(ctx,x,y,facing,time,hitFlash){
  ctx.save(); ctx.translate(x+8,y+12);
  var f=Math.sin(time*2.5)*2;
  ctx.globalAlpha=0.55;
  var h=ctx.createRadialGradient(0,f,4,0,f,32);
  h.addColorStop(0,'rgba(125,211,252,0.9)'); h.addColorStop(1,'rgba(125,211,252,0)');
  ctx.fillStyle=h; ctx.beginPath(); ctx.arc(0,f,32,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  var d=ctx.createLinearGradient(0,-5,0,15);
  d.addColorStop(0,'#7dd3fc'); d.addColorStop(0.5,'#0ea5e9'); d.addColorStop(1,'#0c4a6e');
  ctx.fillStyle=d;
  ctx.beginPath(); ctx.moveTo(0,-8+f); ctx.quadraticCurveTo(8,-2+f,9,12); ctx.lineTo(-9,12); ctx.quadraticCurveTo(-8,-2+f,0,-8+f); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#e0f2fe'; ctx.lineWidth=0.8; ctx.globalAlpha=0.7; ctx.stroke(); ctx.globalAlpha=1;
  var sk=ctx.createRadialGradient(-1,-10+f,1,0,-10+f,6);
  sk.addColorStop(0,'#ffffff'); sk.addColorStop(0.7,'#bae6fd'); sk.addColorStop(1,'#0ea5e9');
  ctx.fillStyle=sk; ctx.beginPath(); ctx.ellipse(0,-11+f,5,5.5,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#e0f2fe'; ctx.strokeStyle='#0369a1'; ctx.lineWidth=0.5;
  for(var i=0;i<5;i++){ var a=(i-2)*0.5, tx=Math.sin(a)*7, ty=-16+f-Math.cos(a)*4;
    ctx.beginPath(); ctx.moveTo(tx-1,-15+f); ctx.lineTo(tx,ty); ctx.lineTo(tx+1,-15+f); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle='#0c4a6e'; ctx.beginPath(); ctx.ellipse(-2,-11+f,0.9,1.3,0,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(2,-11+f,0.9,1.3,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#0c4a6e'; ctx.lineWidth=0.4;
  ctx.beginPath(); ctx.moveTo(-1.5,-8+f); ctx.quadraticCurveTo(0,-7+f,1.5,-8+f); ctx.stroke();
  ctx.fillStyle='#bae6fd'; ctx.globalAlpha=0.7;
  for(var j=0;j<3;j++){ var angle=time*1.5+j*2.1, r=12+Math.sin(time+j)*2;
    var px=Math.cos(angle)*r, py=Math.sin(angle)*r*0.5+f;
    ctx.beginPath(); ctx.arc(px,py,1,0,Math.PI*2); ctx.fill(); }
  ctx.globalAlpha=1; ctx.restore();
}
function drawShadowLord(ctx,x,y,facing,time,hitFlash){
  ctx.save(); ctx.translate(x+9,y+12);
  var p=Math.sin(time*3)*0.1+1, f=Math.sin(time*2)*2;
  ctx.globalAlpha=0.6;
  var h=ctx.createRadialGradient(0,f,4,0,f,38);
  h.addColorStop(0,'rgba(232,121,249,0.9)'); h.addColorStop(0.5,'rgba(124,58,237,0.5)'); h.addColorStop(1,'rgba(30,27,75,0)');
  ctx.fillStyle=h; ctx.beginPath(); ctx.arc(0,f,38,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  for(var i=0;i<4;i++){ var angle=time*2+i*1.57, r=14;
    var px=Math.cos(angle)*r, py=Math.sin(angle)*r*0.4+f;
    ctx.fillStyle='rgba(192,132,252,0.7)'; ctx.beginPath(); ctx.arc(px,py,1.2,0,Math.PI*2); ctx.fill(); }
  var cl=ctx.createLinearGradient(0,-8,0,15);
  cl.addColorStop(0,'#4c1d95'); cl.addColorStop(0.5,'#1e1b4b'); cl.addColorStop(1,'#050208');
  ctx.fillStyle=cl;
  ctx.beginPath(); ctx.moveTo(-3,-6+f); ctx.quadraticCurveTo(-12,-2+f,-11,13); ctx.lineTo(11,13); ctx.quadraticCurveTo(12,-2+f,3,-6+f); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#e879f9'; ctx.lineWidth=0.6; ctx.globalAlpha=0.7; ctx.stroke(); ctx.globalAlpha=1;
  var hd=ctx.createRadialGradient(-1,-10+f,1,0,-10+f,7);
  hd.addColorStop(0,'#e9d5ff'); hd.addColorStop(0.5,'#8b5cf6'); hd.addColorStop(1,'#1e1b4b');
  ctx.fillStyle=hd; ctx.beginPath(); ctx.ellipse(0,-10+f,6,7*p,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#4c1d95'; ctx.lineWidth=2.5; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(-5,-14+f); ctx.quadraticCurveTo(-9,-20+f,-6,-24+f); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(5,-14+f); ctx.quadraticCurveTo(9,-20+f,6,-24+f); ctx.stroke();
  ctx.fillStyle='#e879f9'; ctx.shadowColor='#e879f9'; ctx.shadowBlur=15;
  ctx.beginPath(); ctx.arc(-2.5,-11+f,1.3,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(2.5,-11+f,1.3,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(0,-7+f,0.9,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0; ctx.restore();
}
function drawCoinItem(ctx,x,y,bob){
  ctx.save(); ctx.translate(x,y+Math.sin(bob)*2);
  ctx.globalAlpha=0.5;
  var h=ctx.createRadialGradient(0,0,1,0,0,8);
  h.addColorStop(0,'rgba(251,191,36,0.9)'); h.addColorStop(1,'rgba(251,191,36,0)');
  ctx.fillStyle=h; ctx.beginPath(); ctx.arc(0,0,8,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  var g=ctx.createRadialGradient(-1,-1,0.5,0,0,4);
  g.addColorStop(0,'#fff8dc'); g.addColorStop(0.5,'#fbbf24'); g.addColorStop(1,'#a16207');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,3.5,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#78350f'; ctx.lineWidth=0.4; ctx.stroke();
  ctx.fillStyle='#78350f'; ctx.fillRect(-0.5,-2,1,4);
  ctx.restore();
}
function drawKeyItem(ctx,x,y,bob){
  ctx.save(); ctx.translate(x,y+Math.sin(bob)*2);
  ctx.globalAlpha=0.6;
  var h=ctx.createRadialGradient(0,0,2,0,0,14);
  h.addColorStop(0,'rgba(251,191,36,1)'); h.addColorStop(1,'rgba(251,191,36,0)');
  ctx.fillStyle=h; ctx.beginPath(); ctx.arc(0,0,14,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  ctx.fillStyle='#fbbf24'; ctx.strokeStyle='#78350f'; ctx.lineWidth=0.6;
  ctx.beginPath(); ctx.arc(0,-3,3,0,Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#78350f'; ctx.beginPath(); ctx.arc(0,-3,1,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#fbbf24'; ctx.lineWidth=1.8; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(0,-1); ctx.lineTo(0,6); ctx.stroke();
  ctx.lineWidth=1.4;
  ctx.beginPath(); ctx.moveTo(0,4); ctx.lineTo(2,4); ctx.moveTo(0,6); ctx.lineTo(2,6); ctx.stroke();
  ctx.restore();
}
function drawPortalItem(ctx,x,y,time){
  ctx.save(); ctx.translate(x,y+6);
  var p=1+Math.sin(time*3)*0.1;
  var h=ctx.createRadialGradient(0,0,3,0,0,22*p);
  h.addColorStop(0,'rgba(6,255,165,0.9)'); h.addColorStop(0.5,'rgba(6,255,165,0.4)'); h.addColorStop(1,'rgba(6,255,165,0)');
  ctx.fillStyle=h; ctx.beginPath(); ctx.arc(0,0,22*p,0,Math.PI*2); ctx.fill();
  var pt=ctx.createRadialGradient(0,0,2,0,0,10);
  pt.addColorStop(0,'#ffffff'); pt.addColorStop(0.4,'#06ffa5'); pt.addColorStop(1,'#047857');
  ctx.fillStyle=pt; ctx.beginPath(); ctx.ellipse(0,0,7*p,12,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#06ffa5'; ctx.lineWidth=1; ctx.globalAlpha=0.8; ctx.stroke(); ctx.globalAlpha=1;
  for(var i=0;i<5;i++){ var a=time*2+i*1.26, r=10+Math.sin(time*2+i)*3;
    ctx.fillStyle='#a7f3d0'; ctx.beginPath(); ctx.arc(Math.cos(a)*r,Math.sin(a)*r,1,0,Math.PI*2); ctx.fill(); }
  ctx.restore();
}
