/* ============================================
   Shadow Blade - Full Combat Engine
   ============================================ */

(function() {
  'use strict';

  // ===== الإعدادات =====
  var VIRTUAL_W = 320;
  var VIRTUAL_H = 180;
  var GRAVITY = 900;
  var MOVE_SPEED = 90;
  var JUMP_FORCE = -260;
  var FRICTION = 0.85;
  var ATTACK_DURATION = 0.22;   // مدة السيف
  var ATTACK_COOLDOWN = 0.35;   // فترة ما بين الضربات
  var ATTACK_RANGE = 22;        // مدى السيف
  var PLAYER_DAMAGE = 34;       // الضرر اللي يسويه الفارس
  var ENEMY_DAMAGE = 15;        // ضرر العدو
  var INVINCIBILITY_TIME = 1.0; // ثانية وميض بعد الضرر
  var SPAWN_INTERVAL = 2.5;     // كل كم ثانية يطلع عدو

  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // ===== تحجيم =====
  function resize() {
    var winW = window.innerWidth;
    var winH = window.innerHeight;
    var scale = Math.min(winW / VIRTUAL_W, winH / VIRTUAL_H);
    canvas.style.width = Math.floor(VIRTUAL_W * scale) + 'px';
    canvas.style.height = Math.floor(VIRTUAL_H * scale) + 'px';
  }
  window.addEventListener('resize', resize);
  resize();

  // ===== Input =====
  var input = {
    left: false, right: false, jump: false,
    attack: false, jumpPressed: false, attackPressed: false
  };

  window.addEventListener('keydown', function(e) {
    var k = e.key.toLowerCase();
    if (k === 'arrowleft' || k === 'a') input.left = true;
    if (k === 'arrowright' || k === 'd') input.right = true;
    if (k === ' ' || k === 'arrowup' || k === 'w') {
      if (!input.jump) input.jumpPressed = true;
      input.jump = true;
    }
    if (k === 'j' || k === 'k' || k === 'enter') {
      if (!input.attack) input.attackPressed = true;
      input.attack = true;
    }
    if (['arrowleft','arrowright','arrowup','arrowdown',' '].indexOf(k) !== -1) e.preventDefault();
  });
  window.addEventListener('keyup', function(e) {
    var k = e.key.toLowerCase();
    if (k === 'arrowleft' || k === 'a') input.left = false;
    if (k === 'arrowright' || k === 'd') input.right = false;
    if (k === ' ' || k === 'arrowup' || k === 'w') input.jump = false;
    if (k === 'j' || k === 'k' || k === 'enter') input.attack = false;
  });

  function bindButton(id, onDown, onUp) {
    var btn = document.getElementById(id);
    if (!btn) return;
    var press = function(e) {
      e.preventDefault(); e.stopPropagation();
      btn.classList.add('pressed'); onDown();
    };
    var release = function(e) {
      e.preventDefault(); e.stopPropagation();
      btn.classList.remove('pressed');
      if (onUp) onUp();
    };
    btn.addEventListener('touchstart', press, { passive: false });
    btn.addEventListener('touchend', release, { passive: false });
    btn.addEventListener('touchcancel', release, { passive: false });
    btn.addEventListener('mousedown', press);
    btn.addEventListener('mouseup', release);
    btn.addEventListener('mouseleave', release);
    btn.addEventListener('contextmenu', function(e){ e.preventDefault(); });
  }

  bindButton('btnLeft', function(){ input.left = true; }, function(){ input.left = false; });
  bindButton('btnRight', function(){ input.right = true; }, function(){ input.right = false; });
  bindButton('btnJump',
    function(){ if (!input.jump) input.jumpPressed = true; input.jump = true; },
    function(){ input.jump = false; }
  );
  bindButton('btnAttack',
    function(){ if (!input.attack) input.attackPressed = true; input.attack = true; },
    function(){ input.attack = false; }
  );

  // ===== World =====
  var world = {
    gravity: GRAVITY,
    platforms: [
      { x: 0,   y: 150, w: 320, h: 30 },
      { x: 30,  y: 120, w: 50,  h: 6  },
      { x: 120, y: 105, w: 50,  h: 6  },
      { x: 220, y: 90,  w: 50,  h: 6  },
    ]
  };

  // ===== Player =====
  var player = {
    x: 140, y: 100,
    vx: 0, vy: 0,
    w: 12, h: 22,
    onGround: false,
    facing: 1,
    animTime: 0,
    hp: 100, maxHp: 100,
    attacking: false,
    attackTimer: 0,
    attackCooldown: 0,
    invincible: 0,       // timer
    hitFlash: 0
  };

  // ===== Enemies =====
  var enemies = [];
  var particles = [];
  var score = 0;
  var spawnTimer = 1.5;
  var shakeTime = 0;
  var shakeIntensity = 0;

  function spawnEnemy() {
    var type = Math.random() < 0.6 ? 'crawler' : 'flyer';
    var fromLeft = Math.random() < 0.5;
    if (type === 'crawler') {
      enemies.push({
        type: 'crawler',
        x: fromLeft ? -20 : VIRTUAL_W + 5,
        y: 138,
        vx: fromLeft ? 25 : -25,
        vy: 0,
        w: 12, h: 12,
        hp: 100, maxHp: 100,
        direction: fromLeft ? 1 : -1,
        hitFlash: 0,
        dead: false
      });
    } else {
      enemies.push({
        type: 'flyer',
        x: fromLeft ? -20 : VIRTUAL_W + 5,
        y: 60 + Math.random() * 30,
        vx: fromLeft ? 35 : -35,
        vy: 0,
        w: 14, h: 12,
        hp: 60, maxHp: 60,
        direction: fromLeft ? 1 : -1,
        hitFlash: 0,
        dead: false,
        baseY: 60 + Math.random() * 30,
        bobPhase: Math.random() * Math.PI * 2
      });
    }
  }

  function spawnParticles(x, y, color, count) {
    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = 30 + Math.random() * 80;
      particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 30,
        life: 0.5 + Math.random() * 0.4,
        maxLife: 0.5 + Math.random() * 0.4,
        color: color,
        size: 1 + Math.floor(Math.random() * 2)
      });
    }
  }

  function triggerShake(intensity, duration) {
    shakeIntensity = intensity;
    shakeTime = duration;
  }

  // ===== Physics =====
  function rectOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function physics(dt) {
    var move = 0;
    if (input.left)  move -= 1;
    if (input.right) move += 1;

    if (move !== 0) {
      player.vx += move * MOVE_SPEED * 8 * dt;
      player.facing = move;
    }
    player.vx *= Math.pow(FRICTION, dt * 60);

    if (input.jumpPressed && player.onGround) {
      player.vy = JUMP_FORCE;
      player.onGround = false;
      spawnParticles(player.x + 6, player.y + 22, '#7c3aed', 4);
    }
    input.jumpPressed = false;

    player.vy += world.gravity * dt;
    if (player.vy > 400) player.vy = 400;

    player.x += player.vx * dt;
    player.y += player.vy * dt;

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
    if (player.x + player.w > VIRTUAL_W) { player.x = VIRTUAL_W - player.w; player.vx = 0; }
  }

  // ===== Combat =====
  function getAttackHitbox() {
    var reach = ATTACK_RANGE;
    if (player.facing === 1) {
      return { x: player.x + player.w, y: player.y + 4, w: reach, h: 14 };
    } else {
      return { x: player.x - reach, y: player.y + 4, w: reach, h: 14 };
    }
  }

  function updateCombat(dt) {
    // cooldown
    if (player.attackCooldown > 0) player.attackCooldown -= dt;
    if (player.invincible > 0) player.invincible -= dt;
    if (player.hitFlash > 0) player.hitFlash -= dt;

    // بدء ضربة
    if (input.attackPressed && player.attackCooldown <= 0 && !player.attacking) {
      player.attacking = true;
      player.attackTimer = ATTACK_DURATION;
      player.attackCooldown = ATTACK_COOLDOWN;
      // صوت بصري: شرائط ضوئية
      var hb = getAttackHitbox();
      spawnParticles(hb.x + hb.w / 2, hb.y + hb.h / 2, '#ffd166', 6);
    }
    input.attackPressed = false;

    // استمرار الضربة
    if (player.attacking) {
      player.attackTimer -= dt;

      // فحص الاصطدام مع الأعداء (فقط بأول 60% من الضربة)
      if (player.attackTimer > ATTACK_DURATION * 0.4) {
        var hb = getAttackHitbox();
        for (var i = 0; i < enemies.length; i++) {
          var e = enemies[i];
          if (e.dead) continue;
          if (e.hitCooldown > 0) continue;
          var er = { x: e.x, y: e.y, w: e.w, h: e.h };
          if (rectOverlap(hb, er)) {
            e.hp -= PLAYER_DAMAGE;
            e.hitFlash = 0.15;
            e.hitCooldown = 0.25;
            e.vx += player.facing * 60;
            triggerShake(3, 0.12);
            spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#ff3355', 8);
            if (e.hp <= 0) {
              e.dead = true;
              score++;
              triggerShake(5, 0.2);
              spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#e879f9', 20);
              spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#ff3355', 12);
            }
          }
        }
      }

      if (player.attackTimer <= 0) {
        player.attacking = false;
      }
    }
  }

  function updateEnemies(dt) {
    for (var i = enemies.length - 1; i >= 0; i--) {
      var e = enemies[i];

      if (e.hitFlash > 0) e.hitFlash -= dt;
      if (e.hitCooldown > 0) e.hitCooldown -= dt;

      if (e.dead) {
        e.y += 50 * dt;
        if (e.y > 200) enemies.splice(i, 1);
        continue;
      }

      // حركة
      if (e.type === 'crawler') {
        e.x += e.vx * dt;
        // ارتداد على الحواف
        if (e.x < 0) { e.x = 0; e.vx = Math.abs(e.vx); e.direction = 1; }
        if (e.x + e.w > VIRTUAL_W) { e.x = VIRTUAL_W - e.w; e.vx = -Math.abs(e.vx); e.direction = -1; }
        // جاذبية
        e.vy += world.gravity * dt;
        e.y += e.vy * dt;
        // تصادم مع الأرض
        for (var j = 0; j < world.platforms.length; j++) {
          var p = world.platforms[j];
          var er = { x: e.x, y: e.y, w: e.w, h: e.h };
          if (rectOverlap(er, p)) {
            if (e.vy > 0) {
              e.y = p.y - e.h;
              e.vy = 0;
            }
          }
        }
      } else if (e.type === 'flyer') {
        e.x += e.vx * dt;
        e.bobPhase += dt * 3;
        e.y = e.baseY + Math.sin(e.bobPhase) * 8;
        if (e.x < -30 || e.x > VIRTUAL_W + 30) {
          enemies.splice(i, 1);
          continue;
        }
      }

      // اصطدام مع الفارس
      if (player.invincible <= 0 && !player.attacking) {
        var pr = { x: player.x, y: player.y, w: player.w, h: player.h };
        var er = { x: e.x, y: e.y, w: e.w, h: e.h };
        if (rectOverlap(pr, er)) {
          player.hp -= ENEMY_DAMAGE;
          player.invincible = INVINCIBILITY_TIME;
          player.hitFlash = 0.3;
          triggerShake(6, 0.25);
          spawnParticles(player.x + player.w/2, player.y + player.h/2, '#ff3355', 10);
          // دفع الفارس
          player.vx = (player.x < e.x ? -1 : 1) * 120;
          player.vy = -120;
        }
      }
    }
  }

  function updateParticles(dt) {
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 300 * dt;
      p.vx *= 0.98;
      p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function updateSpawns(dt) {
    spawnTimer -= dt;
    if (spawnTimer <= 0 && enemies.length < 8) {
      spawnEnemy();
      spawnTimer = SPAWN_INTERVAL;
    }
  }

  // ===== Drawing =====
  var shakeX = 0, shakeY = 0;

  function updateShake(dt) {
    if (shakeTime > 0) {
      shakeTime -= dt;
      shakeX = (Math.random() - 0.5) * shakeIntensity * 2;
      shakeY = (Math.random() - 0.5) * shakeIntensity * 2;
    } else {
      shakeX = 0; shakeY = 0;
    }
  }

  function drawBackground() {
    var grad = ctx.createLinearGradient(0, 0, 0, VIRTUAL_H);
    grad.addColorStop(0, '#0a0a18');
    grad.addColorStop(1, '#050510');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, VIRTUAL_W, VIRTUAL_H);

    // نجوم
    ctx.fillStyle = '#a78bfa';
    for (var i = 0; i < 50; i++) {
      var sx = (i * 73) % VIRTUAL_W;
      var sy = (i * 41) % 110;
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
    // وميض عند اللاحصانة
    if (player.invincible > 0 && Math.floor(player.invincible * 20) % 2 === 0) {
      return; // نخفي الفارس في إطارات معينة
    }

    // هالة
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = player.hitFlash > 0 ? '#ff3355' : '#7c3aed';
    ctx.beginPath();
    ctx.arc(player.x + 6, player.y + 11, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    var sprite = KNIGHT_IDLE;
    if (player.attacking) sprite = KNIGHT_ATTACK;
    else if (Math.abs(player.vx) > 5 && player.onGround && Math.floor(player.animTime * 8) % 2 === 0) {
      sprite = KNIGHT_WALK;
    }

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

  function drawEnemies() {
    for (var i = 0; i < enemies.length; i++) {
      var e = enemies[i];
      var sprite = e.type === 'crawler' ? CRAWLER : FLYER;
      ctx.save();
      if (e.hitFlash > 0) {
        ctx.globalAlpha = 0.6;
      }
      if (e.direction === -1) {
        ctx.translate(e.x + e.w, 0);
        ctx.scale(-1, 1);
        drawSprite(ctx, sprite, 0, e.y, 1);
      } else {
        drawSprite(ctx, sprite, e.x, e.y, 1);
      }
      ctx.restore();

      // شريط صحة صغير
      if (e.hp < e.maxHp && !e.dead) {
        var hpW = 12;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(e.x, e.y - 4, hpW, 2);
        ctx.fillStyle = '#ff3355';
        ctx.fillRect(e.x, e.y - 4, hpW * (e.hp / e.maxHp), 2);
      }
    }
  }

  function drawParticles() {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  function drawAttackEffect() {
    if (player.attacking && player.attackTimer > ATTACK_DURATION * 0.4) {
      var hb = getAttackHitbox();
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = '#ffd166';
      ctx.fillRect(hb.x, hb.y, hb.w, hb.h);
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = '#fff';
      ctx.fillRect(hb.x, hb.y + 5, hb.w, 2);
      ctx.globalAlpha = 1;
    }
  }

  // ===== HUD =====
  function updateHUD() {
    var hpFill = document.getElementById('hpFill');
    var killCount = document.getElementById('killCount');
    if (hpFill) hpFill.style.width = Math.max(0, player.hp / player.maxHp * 100) + '%';
    if (killCount) killCount.textContent = score;
  }

  // ===== Game Over =====
  var gameOver = false;
  function checkGameOver() {
    if (player.hp <= 0 && !gameOver) {
      gameOver = true;
      spawnParticles(player.x + 6, player.y + 11, '#ff3355', 30);
      spawnParticles(player.x + 6, player.y + 11, '#e879f9', 20);
      triggerShake(10, 0.6);
      setTimeout(function() {
        player.hp = player.maxHp;
        player.x = 140; player.y = 100;
        player.vx = 0; player.vy = 0;
        player.invincible = 2;
        score = 0;
        enemies.length = 0;
        gameOver = false;
      }, 2000);
    }
  }

  // ===== Loop =====
  var lastTime = 0;
  function gameLoop(timestamp) {
    var dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;

    if (!gameOver) {
      player.animTime += dt;
      physics(dt);
      updateCombat(dt);
      updateEnemies(dt);
      updateSpawns(dt);
    }
    updateParticles(dt);
    updateShake(dt);
    checkGameOver();
    updateHUD();
    render();

    requestAnimationFrame(gameLoop);
  }

  function render() {
    ctx.clearRect(0, 0, VIRTUAL_W, VIRTUAL_H);
    ctx.save();
    ctx.translate(Math.floor(shakeX), Math.floor(shakeY));
    drawBackground();
    drawPlatforms();
    drawEnemies();
    drawPlayer();
    drawAttackEffect();
    drawParticles();
    ctx.restore();
  }

  document.getElementById('loading').classList.add('hide');
  requestAnimationFrame(function(t) {
    lastTime = t;
    requestAnimationFrame(gameLoop);
  });

  console.log('%c⚔️ Shadow Blade v0.2', 'color:#a78bfa;font-size:20px;font-weight:900;');
  console.log('%cCombat Engine Ready', 'color:#ff3355;font-size:11px;');

})();
