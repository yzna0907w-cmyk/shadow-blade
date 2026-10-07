// ═══════════════════════════════════════
// دوال مشتركة لكل المراحل
// ═══════════════════════════════════════
const LevelCommon = {

  buildBackground(scene, worldId, tint){
    const bgKey = 'bg-' + worldId;
    if(scene.textures.exists(bgKey)){
      const bg = scene.add.image(0, 0, bgKey);
      bg.setOrigin(0, 0);
      bg.setScrollFactor(0.3);
      bg.setDisplaySize(CFG.GW, CFG.GH);
      bg.setDepth(-30);
      if(tint) bg.setTint(tint);
    }
  },

  buildGround(scene, width, tileKey, tint){
    const groundY = CFG.GH - 60;
    if(scene.textures.exists(tileKey)){
      const ground = scene.add.tileSprite(0, groundY, width, 60, tileKey);
      ground.setOrigin(0, 0);
      ground.setDepth(-5);
      if(tint) ground.setTint(tint);
    }
    const body = scene.platforms.create(width/2, groundY + 30, 'platform');
    body.setVisible(false);
    body.setDisplaySize(width, 60);
    body.refreshBody();
    return groundY;
  },

  buildPlatforms(scene, width, count, tileKey, tint){
    const groundY = CFG.GH - 60;
    for(let i = 0; i < count; i++){
      const px = Phaser.Math.Between(300, width - 400);
      const py = groundY - Phaser.Math.Between(80, 160);
      const pw = Phaser.Math.Between(100, 160);

      if(scene.textures.exists(tileKey)){
        const vis = scene.add.tileSprite(px - pw/2, py, pw, 20, tileKey);
        vis.setOrigin(0, 0);
        vis.setDepth(-5);
        if(tint) vis.setTint(tint);
      }
      const body = scene.platforms.create(px, py + 10, 'platform');
      body.setVisible(false);
      body.setDisplaySize(pw, 20);
      body.refreshBody();
    }
  },

  buildCoins(scene, width, count){
    const groundY = CFG.GH - 60;
    for(let i = 0; i < count; i++){
      const cx = Phaser.Math.Between(200, width - 400);
      const cy = Phaser.Math.Between(80, groundY - 60);
      const c = scene.coins.create(cx, cy, 'coin');
      c.setScale(0.5);
      c.setDepth(5);
      scene.tweens.add({
        targets: c, y: cy - 6, duration: 1200,
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
      });
    }
  },

  spawnEnemies(scene, types, count, worldIdx){
    const width = WORLDS[worldIdx].width;
    for(let i = 0; i < count; i++){
      const type = types[i % types.length];
      const ex = Phaser.Math.Between(400, width - 500);
      Enemies.spawn(scene, ex, 80, type, worldIdx);
    }
  }
};
