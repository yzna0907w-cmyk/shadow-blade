var Sound=(function(){
var ctx=null,master=null,enabled=true;
function init(){if(ctx)return;
try{ctx=new (window.AudioContext||window.webkitAudioContext)();
master=ctx.createGain();master.gain.value=0.5;
var comp=ctx.createDynamicsCompressor();
comp.threshold.value=-12;comp.knee.value=6;comp.ratio.value=4;
comp.attack.value=0.003;comp.release.value=0.15;
master.connect(comp);comp.connect(ctx.destination);}
catch(e){enabled=false;}}
function resume(){if(ctx&&ctx.state==='suspended')ctx.resume();}

function note(freq,dur,wave,vol,attack,release){
if(!enabled||!ctx)return;resume();
try{
var o=ctx.createOscillator(),g=ctx.createGain();
o.type=wave||'sine';
o.frequency.value=freq;
var now=ctx.currentTime;
var atk=attack||0.01,rel=release||dur;
g.gain.setValueAtTime(0,now);
g.gain.linearRampToValueAtTime(vol||0.3,now+atk);
g.gain.exponentialRampToValueAtTime(0.001,now+atk+rel);
o.connect(g);g.connect(master);
o.start(now);o.stop(now+atk+rel+0.05);
}catch(e){}}

function sweep(f1,f2,dur,wave,vol){
if(!enabled||!ctx)return;resume();
try{
var o=ctx.createOscillator(),g=ctx.createGain();
o.type=wave||'sine';
var now=ctx.currentTime;
o.frequency.setValueAtTime(f1,now);
o.frequency.exponentialRampToValueAtTime(f2,now+dur);
g.gain.setValueAtTime(vol||0.3,now);
g.gain.exponentialRampToValueAtTime(0.001,now+dur);
o.connect(g);g.connect(master);
o.start(now);o.stop(now+dur+0.05);
}catch(e){}}

function noise(dur,vol,cutoff,type){
if(!enabled||!ctx)return;resume();
try{
var size=ctx.sampleRate*dur;
var buf=ctx.createBuffer(1,size,ctx.sampleRate);
var d=buf.getChannelData(0);
for(var i=0;i<size;i++)d[i]=Math.random()*2-1;
var src=ctx.createBufferSource();src.buffer=buf;
var fl=ctx.createBiquadFilter();
fl.type=type||'lowpass';
fl.frequency.value=cutoff||1500;
fl.Q.value=1;
var g=ctx.createGain();
var now=ctx.currentTime;
g.gain.setValueAtTime(vol||0.2,now);
g.gain.exponentialRampToValueAtTime(0.001,now+dur);
src.connect(fl);fl.connect(g);g.connect(master);
src.start(now);
}catch(e){}}

function chord(freqs,dur,wave,vol){
freqs.forEach(function(f,i){
setTimeout(function(){note(f,dur,wave,vol,0.005,dur*0.9);},i*20);
});}

return{
init:init,resume:resume,
jump:function(){sweep(400,700,0.15,'sine',0.22);note(800,0.08,'sine',0.15,0.005,0.1);},
slash:function(){sweep(2000,600,0.12,'triangle',0.25);noise(0.08,0.12,4000,'highpass');},
hit:function(){noise(0.06,0.18,800,'lowpass');note(180,0.08,'triangle',0.2,0.005,0.1);},
hurt:function(){sweep(300,180,0.25,'triangle',0.3);note(120,0.15,'sine',0.2,0.01,0.25);},
kill:function(){noise(0.25,0.2,600,'lowpass');note(220,0.15,'triangle',0.15,0.005,0.2);setTimeout(function(){note(160,0.2,'sine',0.12,0.005,0.3);},80);},
coin:function(){note(1200,0.08,'sine',0.22,0.005,0.1);setTimeout(function(){note(1800,0.1,'sine',0.2,0.005,0.15);},50);},
key:function(){chord([880,1174,1320],0.5,'triangle',0.22);},
portal:function(){chord([523,659,784,1047],0.6,'sine',0.2);},
bossRoar:function(){sweep(120,60,1.0,'sawtooth',0.35);noise(0.8,0.15,300,'lowpass');},
bossHit:function(){noise(0.1,0.25,600,'lowpass');note(140,0.12,'triangle',0.2,0.005,0.15);},
enemySkill:function(){note(500,0.1,'sine',0.18,0.005,0.15);note(700,0.12,'sine',0.15,0.005,0.15);},
shop:function(){chord([440,660,880],0.4,'triangle',0.2);},
forge:function(){noise(0.2,0.25,2500,'highpass');setTimeout(function(){note(1200,0.15,'triangle',0.25,0.005,0.2);},100);},
buy:function(){chord([880,1100,1320,1760],0.6,'sine',0.25);},
levelComplete:function(){chord([523,659,784,1047,1319],1.2,'sine',0.25);},
gameOver:function(){chord([440,392,330,262],1.5,'sine',0.25);},
footstep:function(){noise(0.04,0.06,400,'lowpass');}
};})();
