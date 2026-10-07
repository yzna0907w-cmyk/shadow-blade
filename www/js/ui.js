// ═══════════════════════════════════════════════════
// EMBER — واجهة المستخدم (كامل)
// ═══════════════════════════════════════════════════
(function(){
'use strict';

function $(id){ return document.getElementById(id); }

// ═══ فحص الاتجاه ═══
function checkOrientation(){
  var w = $('rotate-warning');
  if(!w) return;
  if(window.innerHeight > window.innerWidth) w.classList.add('active');
  else w.classList.remove('active');
}
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', function(){ setTimeout(checkOrientation, 300); });
checkOrientation();

// ═══ جسيمات شاشة البداية ═══
function spawnParticles(){
  var c = $('titleParticles');
  if(!c) return;
  for(var i = 0; i < 35; i++){
    var p = document.createElement('div');
    p.className = 'title-particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (5 + Math.random() * 7) + 's';
    p.style.animationDelay = (Math.random() * 6) + 's';
    p.style.opacity = 0.3 + Math.random() * 0.6;
    var sz = 1 + Math.random() * 2;
    p.style.width = sz + 'px';
    p.style.height = sz + 'px';
    c.appendChild(p);
  }
}

// ═══ إظهار/إخفاء واجهة اللعب ═══
function showGameUI(show){
  var hud = $('hud'), ctrl = $('controls');
  if(hud) hud.style.display = show ? 'block' : 'none';
  if(ctrl) ctrl.style.display = show ? 'block' : 'none';
}

// ═══ بدء اللعبة ═══
function startGame(){
  var t = $('title-screen');
  if(t) t.classList.add('hide');
  setTimeout(function(){
    if(t) t.style.display = 'none';
    showGameUI(true);
    if(window.EmberGame && EmberGame.start) EmberGame.start();
    else console.error('EmberGame not found');
  }, 600);
}

// ═══ Global Click Handlers ═══
window._clickNewGame = function(e){
  if(e) e.preventDefault();
  console.log('🔥 New Game clicked');
  try {
    if(window.State) State.reset();
    startGame();
  } catch(err) {
    console.error('Error:', err);
    alert('خطأ: ' + err.message);
  }
};

window._clickContinue = function(e){
  if(e) e.preventDefault();
  console.log('▶ Continue clicked');
  try {
    startGame();
  } catch(err) {
    console.error('Error:', err);
    alert('خطأ: ' + err.message);
  }
};

window._clickWebsite = function(e){
  if(e) e.preventDefault();
  console.log('🌐 Website clicked');
  var url = 'https://yzn-support.netlify.app/';
  try {
    if(window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Browser)
      window.Capacitor.Plugins.Browser.open({ url: url });
    else
      window.open(url, '_system');
  } catch(err) {
    window.open(url, '_system');
  }
};

// ═══ ربط الأزرار (احتياط) ═══
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
  el.addEventListener('touchstart', fire, { passive: false });
}

// ═══ BossPrompt (نافذة البوس) ═══
window.BossPrompt = {
  show: function(name, onYes, onNo){
    console.log('👑 BossPrompt:', name);
    var nm = document.getElementById('bossPromptName');
    if(nm) nm.textContent = '👑 ' + name;

    var screen = document.getElementById('bossPromptScreen');
    var yb = document.getElementById('bossAcceptBtn');
    var nb = document.getElementById('bossDeclineBtn');

    var newYb = yb ? yb.cloneNode(true) : null;
    var newNb = nb ? nb.cloneNode(true) : null;
    if(yb && newYb) yb.parentNode.replaceChild(newYb, yb);
    if(nb && newNb) nb.parentNode.replaceChild(newNb, nb);

    if(newYb){
      newYb.id = 'bossAcceptBtn';
      newYb.addEventListener('click', function(e){
        e.preventDefault(); e.stopPropagation();
        if(screen) screen.classList.remove('active');
        if(onYes) onYes();
      });
    }
    if(newNb){
      newNb.id = 'bossDeclineBtn';
      newNb.addEventListener('click', function(e){
        e.preventDefault(); e.stopPropagation();
        if(screen) screen.classList.remove('active');
        if(onNo) onNo();
      });
    }

    if(screen) screen.classList.add('active');
  }
};

// ═══ Abilities Helper ═══
window.Abilities = {
  unlock: function(scene, key){
    if(!window.CFG || !CFG.ABILITIES || !CFG.ABILITIES[key]) return;
    var ab = CFG.ABILITIES[key];
    console.log('✨ Ability unlocked:', ab.nameAr);

    if(scene && scene.add){
      var txt = scene.add.text(CFG.GW/2, CFG.GH/2 - 30, ab.icon + ' ' + ab.nameAr, {
        fontFamily: 'Arial', fontSize: '22px', color: '#ffd700',
        stroke: '#000', strokeThickness: 5, fontStyle: 'bold'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(300);

      var sub = scene.add.text(CFG.GW/2, CFG.GH/2, ab.desc, {
        fontFamily: 'Arial', fontSize: '14px', color: '#ffffff',
        stroke: '#000', strokeThickness: 3
      }).setOrigin(0.5).setScrollFactor(0).setDepth(300);

      scene.tweens.add({
        targets: [txt, sub],
        alpha: 0, y: '-=40', duration: 3000,
        onComplete: function(){ txt.destroy(); sub.destroy(); }
      });

      scene.cameras.main.flash(500, 255, 215, 0);
    }
  }
};

// ═══ التهيئة ═══
function init(){
  spawnParticles();
  bindButton('btnNewGame', window._clickNewGame);
  bindButton('btnContinue', window._clickContinue);
  bindButton('btnWebsite', window._clickWebsite);

  var l = $('loading');
  if(l) setTimeout(function(){ l.classList.add('hide'); }, 500);

  console.log('✅ UI loaded — BossPrompt + Abilities + Buttons');
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

// تصدير
window.UI = { showGameUI: showGameUI };
})();
