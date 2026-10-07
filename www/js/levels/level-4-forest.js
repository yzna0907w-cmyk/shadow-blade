const Level4Forest = {
  id:'forest', nameAr:'الغابة الميتة', worldIdx:3, width:3800,
  tileKey:'tile-forest', bgKey:'bg-forest',
  bossKey:'boar', bossNameAr:'الخنزير البري',
  enemies:['boar','boar','slime','boar'], enemyCount:5,

  preload(scene){
    scene.load.image(this.tileKey, 'assets/worlds/04-forest/tiles.png');
    scene.load.image(this.bgKey, 'assets/worlds/04-forest/bg.png');
  },

  create(scene){
    LevelCommon.buildBackground(scene, this.id, 0x66aa66);
    LevelCommon.buildGround(scene, this.width, this.tileKey, 0x88cc88);
    LevelCommon.buildPlatforms(scene, this.width, 16, this.tileKey, 0x88cc88);
    LevelCommon.buildCoins(scene, this.width, 35);
    LevelCommon.spawnEnemies(scene, this.enemies, this.enemyCount, this.worldIdx);
    Puzzles.createChest(scene, 1500, CFG.GH - 90);
    Puzzles.createChest(scene, 2800, CFG.GH - 120);
  },

  spawnBoss(scene){
    Bosses.spawn(scene, this.bossKey, this.worldIdx, this.bossNameAr);
  }
};
