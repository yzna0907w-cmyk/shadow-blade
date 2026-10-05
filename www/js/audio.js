var Sound = (function(){
  var ctx=null, master=null, enabled=true;
  function init(){
    if (ctx) return;
    try { ctx = new (window.AudioContext||window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = 0.35; master.connect(ctx.destination); }
    catch(e){ enabled = false; }
  }
  function tone(f,d,t,v){
    if (!enabled||!ctx) return;
    try {
      var o=ctx.createOscillator(), g=ctx.createGain();
      o.type=t||'square'; o.frequency.value=f;
      g.gain.setValueAtTime(v||0.2, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+d);
      o.connect(g); g.connect(master); o.start(); o.stop(ctx.currentTime+d);
    } catch(e){}
  }
  function noise(d,v,f){
    if (!enabled||!ctx) return;
    try {
      var s=ctx.sampleRate*d, b=ctx.createBuffer(1,s,ctx.sampleRate), dt=b.getChannelData(0);
      for (var i=0;i<s;i++) dt[i]=Math.random()*2-1;
      var src=ctx.createBufferSource(); src.buffer=b;
      var fl=ctx.createBiquadFilter(); fl.type='lowpass'; fl.frequency.value=f||2000;
      var g=ctx.createGain(); g.gain.setValueAtTime(v||0.2,ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+d);
      src.connect(fl); fl.connect(g); g.connect(master); src.start();
    } catch(e){}
  }
  return {
    init:init,
    jump:function(){tone(600,0.1,'square',0.14);tone(900,0.08,'square',0.1);},
    slash:function(){noise(0.09,0.28,3500);tone(1400,0.05,'sawtooth',0.1);},
    hit:function(){noise(0.07,0.3,1500);tone(220,0.09,'square',0.15);},
    hurt:function(){tone(300,0.2,'sawtooth',0.22);tone(150,0.28,'square',0.15);},
    kill:function(){noise(0.28,0.32,900);tone(140,0.3,'sawtooth',0.16);},
    coin:function(){tone(880,0.07,'square',0.15);setTimeout(function(){tone(1320,0.1,'square',0.15);},60);},
    key:function(){tone(660,0.1,'triangle',0.22);setTimeout(function(){tone(880,0.1,'triangle',0.22);},80);setTimeout(function(){tone(1320,0.22,'triangle',0.22);},160);},
    portal:function(){tone(440,0.14,'sine',0.2);setTimeout(function(){tone(660,0.14,'sine',0.2);},100);setTimeout(function(){tone(880,0.3,'sine',0.2);},200);},
    bossRoar:function(){tone(70,0.8,'sawtooth',0.32);tone(110,0.6,'square',0.2);noise(0.55,0.22,400);},
    bossHit:function(){noise(0.1,0.3,1200);tone(180,0.14,'square',0.18);},
    levelComplete:function(){[523,659,784,1047].forEach(function(f,i){setTimeout(function(){tone(f,0.26,'triangle',0.22);},i*130);});},
    gameOver:function(){[440,370,294,220].forEach(function(f,i){setTimeout(function(){tone(f,0.35,'sawtooth',0.22);},i*180);});}
  };
})();
