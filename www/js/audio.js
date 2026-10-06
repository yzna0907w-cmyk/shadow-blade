var Sound=(function(){
var ctx=null,master=null,enabled=true;
function init(){if(ctx)return;
try{ctx=new (window.AudioContext||window.webkitAudioContext)();
master=ctx.createGain();master.gain.value=0.7;master.connect(ctx.destination);}
catch(e){enabled=false;}}
function resume(){if(ctx&&ctx.state==='suspended')ctx.resume();}
function tone(f,d,t,v){if(!enabled||!ctx)return;resume();
try{var o=ctx.createOscillator(),g=ctx.createGain();
o.type=t||'square';o.frequency.value=f;
g.gain.setValueAtTime(v||0.3,ctx.currentTime);
g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+d);
o.connect(g);g.connect(master);o.start();o.stop(ctx.currentTime+d);}catch(e){}}
function noise(d,v,f){if(!enabled||!ctx)return;resume();
try{var s=ctx.sampleRate*d,b=ctx.createBuffer(1,s,ctx.sampleRate),dt=b.getChannelData(0);
for(var i=0;i<s;i++)dt[i]=Math.random()*2-1;
var src=ctx.createBufferSource();src.buffer=b;
var fl=ctx.createBiquadFilter();fl.type='lowpass';fl.frequency.value=f||2000;
var g=ctx.createGain();g.gain.setValueAtTime(v||0.3,ctx.currentTime);
g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+d);
src.connect(fl);fl.connect(g);g.connect(master);src.start();}catch(e){}}
return{
init:init,resume:resume,
jump:function(){tone(700,0.1,'square',0.25);tone(1000,0.08,'square',0.18);},
slash:function(){noise(0.09,0.4,3500);tone(1600,0.06,'sawtooth',0.2);},
hit:function(){noise(0.07,0.45,1500);tone(250,0.1,'square',0.25);},
hurt:function(){tone(300,0.22,'sawtooth',0.35);tone(150,0.3,'square',0.25);},
kill:function(){noise(0.3,0.45,900);tone(140,0.32,'sawtooth',0.25);},
coin:function(){tone(900,0.08,'square',0.25);setTimeout(function(){tone(1400,0.12,'square',0.25);},60);},
key:function(){tone(660,0.12,'triangle',0.35);setTimeout(function(){tone(900,0.12,'triangle',0.35);},80);setTimeout(function(){tone(1400,0.25,'triangle',0.35);},160);},
portal:function(){tone(440,0.15,'sine',0.35);setTimeout(function(){tone(660,0.15,'sine',0.35);},100);setTimeout(function(){tone(900,0.32,'sine',0.35);},200);},
bossRoar:function(){tone(70,0.9,'sawtooth',0.5);tone(110,0.7,'square',0.35);noise(0.6,0.35,400);},
bossHit:function(){noise(0.1,0.45,1200);tone(180,0.15,'square',0.3);},
enemySkill:function(){tone(400,0.15,'sawtooth',0.3);tone(600,0.1,'square',0.2);},
levelComplete:function(){[523,659,784,1047].forEach(function(f,i){setTimeout(function(){tone(f,0.28,'triangle',0.35);},i*130);});},
gameOver:function(){[440,370,294,220].forEach(function(f,i){setTimeout(function(){tone(f,0.38,'sawtooth',0.35);},i*180);});}
};})();
