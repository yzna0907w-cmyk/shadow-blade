// ═══════════════════════════════════════
// واجهة المستخدم (الأزرار، الشاشات)
// ═══════════════════════════════════════
(function(){
'use strict';

function $(id){ return document.getElementById(id); }

// ═══ فحص اتجاه الشاشة ═══
function checkOrientation(){
  var w = $('rotate-warning');
  if(!w) return;
  if(window.innerHeight > window.innerWidth) w.classList.add('active');
  else w.classList.remove('active');
}
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', function(){ setTimeout(checkOrientation, 300); });
checkOrientation();

// ═══ الجسيمات (شاشة البداية) ═══
function spawnParticles(){
  var c = $('titleParticles');
  if(!c) return;
  for(var i=0;i<35;i++){
    var p = document.createElement('div');
    p.className = 'title-particle';
    p.style.left = Math.random()*100 + '%';
    p.style.animationDuration = (5 + Math.random()*7) + 's';
    p.style.animationDelay = (Math.random()*6) + 's';
    p.style.opacity = 0.3 + Math.random()*0.6;
    var sz = 1 + Math.random()*2;
    p.style.width = sz + 'px';
    p.style.height = sz + 'px';
    c.appendChild(p);
  }
}

// ═══ ربط زر ═══
function bindButton(id, handler){
  var el = $(id);
  if(!el) return;
  var lock = false;
  var fire = function(e){
    if(e){ e.preventDefault(); e.stopPropagation(); }
    if(lock) return;
    lock = true;
    setTimeout(function(){ lock = false; }, 400);
    try { handler(e); } catch(err){ console.error(id, err); }
  };
  el.addEventListener('click', fire);
  el.addEventListener('touchstart', fire, { passive:false });
}

// ═══ إظهار/إخفاء واجهة اللعب ═══
function showGameUI(show){
  var hud = $('hud'), ctrl = $('controls');
  if(hud) hud.style.display = show ? 'block' : 'none';
  if(ctrl) ctrl.style.display = show ? 'block' : 'none';
}

function show(id){ var el = $(id); if(el) el.classList.add('active'); }
function hide(id){ var el = $(id); if(el) el.classList.remove('active'); }

// ═══ ربط الأزرار ═══
function bindUI(){
  // بدء الرحلة (لعبة جديدة)
  bindButton('btnNewGame', function(){
    try { if(window.State) State.reset(); } catch(e){}
    var t = $('title-screen');
    if(t) t.classList.add('hide');
    setTimeout(function(){
      if(t) t.style.display = 'none';
      showGameUI(true);
      if(window.EmberGame) EmberGame.start();
    }, 600);
  });

  // متابعة
  bindButton('btnContinue', function(){
    var t = $('title-screen');
    if(t) t.classList.add('hide');
    setTimeout(function(){
      if(t) t.style.display = 'none';
      showGameUI(true);
      if(window.EmberGame) EmberGame.start();
    }, 600);
  });

  // الدعم
  bindButton('btnWebsite', function(){
    var url = 'https://yzn-support.netlify.app/'\;
    try {
      if(window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Browser)
        window.Capacitor.Plugins.Browser.open({ url: url });
      else window.open(url, '_system');
    } catch(e){ window.open(url, '_system'); }
  });
}

// ═══ شاشة طلب البوس ═══
window.BossPrompt = {
  show: function(name, onYes, onNo){
    var nm = $('bossPromptName');
    if(nm) nm.textContent = '👑 ' + name;
    var yb = $('bossAcceptBtn'), nb = $('bossDeclineBtn');
    if(yb){
      var nY = yb.cloneNode(true);
      yb.parentNode.replaceChild(nY, yb);
      nY.id = 'bossAcceptBtn';
      nY.addEventListener('click', function(e){
        e.preventDefault(); e.stopPropagation();
        hide('bossPromptScreen');
        if(onYes) onYes();
      });
    }
    if(nb){
      var nN = nb.cloneNode(true);
      nb.parentNode.replaceChild(nN, nb);
      nN.id = 'bossDeclineBtn';
      nN.addEventListener('click', function(e){
        e.preventDefault(); e.stopPropagation();
        hide('bossPromptScreen');
        if(onNo) onNo();
      });
    }
    show('bossPromptScreen');
  }
};

// ═══ تشغيل ═══
function init(){
  spawnParticles();
  bindUI();
  var l = $('loading');
  if(l) setTimeout(function(){ l.classList.add('hide'); }, 500);
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

window.UI = { showGameUI: showGameUI };
console.log('✅ UI loaded');
})();
