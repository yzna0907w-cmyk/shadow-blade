const Level3Caves = {
  id:'caves', nameAr:'كهوف الكريستال', worldIdx:2, width:3500,
  tileKey:'tile-caves', bgKey:'bg-caves',
  bossKey:'turtle', bossNameAr:'السلحفاة القتالية',
  enemies:['slime','boar','slime','boar'], enemyCount:12,

  preload(scene){
    scene.load.image(this.tileKey, 'assets/worlds/03-caves/tiles.png');
    scene.load.image(this.bgKey, 'assets/worlds/03-caves/bg.png');
  },

  create(scene){
    LevelCommon.buildBackground(scene, this.id, 0x88aaff);
    LevelCommon.buildGround(scene, this.width, this.tileKey, 0xaaccff);
    LevelCommon.buildPlatforms(scene, this.width, 14, this.tileKey, 0xaaccff);
    LevelCommon.buildCoins(scene, this.width, 30);
    LevelCommon.spawnEnemies(scene, this.enemies, this.enemyCount, this.worldIdx);
    Puzzles.createChest(scene, 1200, CFG.GH - 90);
    Puzzles.createChest(scene, 2500, CFG.GH - 120);
  },

  spawnBoss(scene){
    Bosses.spawn(scene, this.bossKey, this.worldIdx, this.bossNameAr);
  }
};
