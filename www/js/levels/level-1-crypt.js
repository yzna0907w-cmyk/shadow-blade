const Level1Crypt = {
  id:'crypt', nameAr:'المقبرة', worldIdx:0, width:3000,
  tileKey:'tile-crypt', bgKey:'bg-crypt',
  bossKey:'robot', bossNameAr:'حارس الأرواح',
  enemies:['slime','slime','boar'], enemyCount:8,

  preload(scene){
    scene.load.image(this.tileKey, 'assets/worlds/01-crypt/tiles.png');
    scene.load.image(this.bgKey, 'assets/worlds/01-crypt/bg.png');
  },

  create(scene){
    LevelCommon.buildBackground(scene, this.id, null);
    LevelCommon.buildGround(scene, this.width, this.tileKey, null);
    LevelCommon.buildPlatforms(scene, this.width, 8, this.tileKey, null);
    LevelCommon.buildCoins(scene, this.width, 20);
    LevelCommon.spawnEnemies(scene, this.enemies, this.enemyCount, this.worldIdx);

    // صناديق
    Puzzles.createChest(scene, 800, CFG.GH - 90);
    Puzzles.createChest(scene, 1800, CFG.GH - 120);
  },

  spawnBoss(scene){
    Bosses.spawn(scene, this.bossKey, this.worldIdx, this.bossNameAr);
  }
};
