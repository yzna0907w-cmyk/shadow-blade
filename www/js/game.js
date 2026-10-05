/* ============================================
   Shadow Blade - Game Engine (Mobile Buttons)
   ============================================ */

(function() {
  'use strict';

  var VIRTUAL_W = 320;
  var VIRTUAL_H = 180;
  var GRAVITY = 900;
  var MOVE_SPEED = 90;
  var JUMP_FORCE = -260;
  var FRICTION = 0.85;

  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // ===== تحجيم الشاشة =====
  function resize() {
    var winW = window.innerWidth;
    var winH = window.innerHeight;
    var scale = Math.min(winW / VIRTUAL_W, winH / VIRTUAL_H);
    canvas.style.width = Math.floor(VIRTUAL_W * scale) + 'px';
    canvas.style.height = Math.floor(VIRTUAL_H * scale) + 'px';
  }
  window.addEventListener('resize', resize);
  resize();

  // ===== Input State =====
  var input = {
    left: false,
    right: false,
    jump: false,
    jumpPressed: false // عشان نضمن القفزة مرة وحدة
  };

  // ===== Keyboard =====
  window.addEventListener('keydown', function(e) {
    var k = e.key.toLowerCase();
    if (k === 'arrowleft' || k === 'a') input.left = true;
    if (k === 'arrowright' || k === 'd') input.right = true;
    if (k === ' ' || k === 'arrowup' || k === 'w') {
      if (!input.jump) input.jumpPressed = true;
      input.jump = true;
      e.preventDefault();
    }
  });
  window.addEventListener('keyup', function(e) {
    var k = e.key.toLowerCase();
    if (k === 'arrowleft' || k === 'a') input.left = false;
    if (k === 'arrowright' || k === 'd') input.right = false;
    if (k === ' ' || k === 'arrowup' || k === 'w') input.jump = false;
  });

  // ===== ربط الأزرار =====
  function bindButton(id, onDown, onUp) {
    var btn = document.getElementById(id);
    if (!btn) return;

    var press = function(e) {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.add('pressed');
      onDown();
    };
    var release = function(e) {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.remove('pressed');
      if (onUp) onUp();
    };

    btn.addEventListener('touchstart', press, { passive: false });
    btn.addEventListener('touchend', release, { passive: false });
    btn.addEventListener('touchcancel', release, { passive: false });
    btn.addEventListener('mousedown', press);
    btn.addEventListener('mouseup', release);
    btn.addEventListener('mouseleave', release);
    // منع القائمة الطويلة
    btn.addEventListener('contextmenu', function(e){ e.preventDefault(); });
  }

  bindButton('btnLeft',
    function(){ input.left = true; },
    function(){ input.left = false; }
  );
  bindButton('btnRight',
    function(){ input.right = true; },
    function(){ input.right = false; }
  );
  bindButton('btnJump',
    function(){
      if (!input.jump) input.jumpPressed = true;
      input.jump = true;
    },
    function(){ input.jump = false; }
  );

  // ===== World =====
  var world = {
    gravity: GRAVITY,
    platforms: [
      { x: 0,   y: 150, w: 320, h: 30 },
      { x: 60,  y: 120, w: 40,  h: 6  },
      { x: 130, y: 100, w: 40,  h: 6  },
      { x: 210, y: 80,  w: 40,  h: 6  },
      { x: 260, y: 120, w: 40,  h: 6  },
    ]
  };

  // ===== Player =====
  var player = {
    x: 100, y: 100,
    vx: 0, vy: 0,
    w: 12, h: 22,
    onGround: false,
    facing: 1,
    animTime: 0,
    hp: 100,
    maxHp: 100
  };

  function rectOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
  }

  // ===== Physics =====
  function physics(dt) {
    var move = 0;
    if (input.left)  move -= 1;
    if (input.right) move += 1;

    if (move !== 0) {
      player.vx += move * MOVE_SPEED * 8 * dt;
      player.facing = move;
    }
    player.vx *= Math.pow(FRICTION, dt * 60);

    // قفز
    if (input.jumpPressed && player.onGround) {
      player.vy = JUMP_FORCE;
      player.onGround = false;
    }
    input.jumpPressed = false; // نصفّرها بعد كل إطار

    // جاذبية
    player.vy += world.gravity * dt;
    if (player.vy > 400) player.vy = 400;

    // حركة
    player.x += player.vx * dt;
    player.y += player.vy * dt;

    // تصادم
    player.onGround = false;
    for (var i = 0; i < world.platforms.length; i++) {
      var p = world.platforms[i];
      var pr = { x: player.x, y: player.y, w: player.w, h: player.h };
      if (rectOverlap(pr, p)) {
        if (player.vy > 0 && player.y + player.h - player.vy * dt <= p.y + 2) {
          player.y = p.y - player.h;
          player.vy = 0;
          player.onGround = true;
        } else if (player.vy < 0 && player.y - player.vy * dt >= p.y + p.h - 2) {
          player.y = p.y + p.h;
          player.vy = 0;
        } else {
          if (player.vx > 0) player.x = p.x - player.w;
          else if (player.vx < 0) player.x = p.x + p.w;
          player.vx = 0;
        }
      }
    }

    if (player.x < 0) { player.x = 0; player.vx = 0; }
    if (player.x + player.w > 320) { player.x = 320 - player.w; player.vx = 0; }
  }

  // ===== Drawing =====
  function drawBackground() {
    var grad = ctx.createLinearGradient(0, 0, 0, VIRTUAL_H);
    grad.addColorStop(0, '#0a0a18');
    grad.addColorStop(1, '#050510');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, VIRTUAL_W, VIRTUAL_H);

    ctx.fillStyle = '#a78bfa';
    for (var i = 0; i < 40; i++) {
      var sx = (i * 73) % VIRTUAL_W;
      var sy = (i * 41) % 100;
      ctx.globalAlpha = 0.1 + ((i * 17) % 10) / 40;
      ctx.fillRect(sx, sy, 1, 1);
    }
    ctx.globalAlpha = 1;
  }

  function drawPlatforms() {
    for (var i = 0; i < world.platforms.length; i++) {
      var p = world.platforms[i];
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#7c3aed';
      ctx.fillRect(p.x, p.y, p.w, 1);
      ctx.fillStyle = '#050508';
      ctx.fillRect(p.x, p.y + p.h - 1, p.w, 1);
    }
  }

  function drawPlayer() {
    // هالة
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.arc(player.x + 6, player.y + 11, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    var isMoving = Math.abs(player.vx) > 5 && player.onGround;
    var sprite = isMoving && Math.floor(player.animTime * 8) % 2 === 0 ? KNIGHT_WALK : KNIGHT_IDLE;

    ctx.save();
    if (player.facing === -1) {
      ctx.translate(player.x + player.w, 0);
      ctx.scale(-1, 1);
      drawSprite(ctx, sprite, 0, player.y, 1);
    } else {
      drawSprite(ctx, sprite, player.x, player.y, 1);
    }
    ctx.restore();
  }

  // ===== HUD =====
  function updateHUD() {
    var hpFill = document.getElementById('hpFill');
    if (hpFill) hpFill.style.width = (player.hp / player.maxHp * 100) + '%';
  }

  // ===== Game Loop =====
  var lastTime = 0;
  function gameLoop(timestamp) {
    var dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;
    update(dt);
    render();
    requestAnimationFrame(gameLoop);
  }

  function update(dt) {
    player.animTime += dt;
    physics(dt);
    updateHUD();
  }

  function render() {
    ctx.clearRect(0, 0, VIRTUAL_W, VIRTUAL_H);
    drawBackground();
    drawPlatforms();
    drawPlayer();
  }

  document.getElementById('loading').classList.add('hide');
  requestAnimationFrame(function(t) {
    lastTime = t;
    requestAnimationFrame(gameLoop);
  });

  console.log('%c⚔️ Shadow Blade', 'color:#a78bfa;font-size:20px;font-weight:900;');
  console.log('%cMobile buttons ready', 'color:#7c3aed;font-size:11px;');

})();
