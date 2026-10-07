const Level5Factory = {
  id:'factory', nameAr:'المصنع المحروق', worldIdx:4, width:4000,
  tileKey:'tile-factory', bgKey:'bg-factory',
  bossKey:'tank', bossNameAr:'دبابة الحرب',
  enemies:['boar','slime','boar','slime'], enemyCount:16,

  preload(scene){
    scene.load.image(this.tileKey, 'assets/worlds/05-factory/tiles.png');
    scene.load.image(this.bgKey, 'assets/worlds/05-factory/bg.png');
  },

  create(scene){
    LevelCommon.buildBackground(scene, this.id, 0xffaa66);
    LevelCommon.buildGround(scene, this.width, this.tileKey, 0xff8844);
    LevelCommon.buildPlatforms(scene, this.width, 18, this.tileKey, 0xff8844);
    LevelCommon.buildCoins(scene, this.width, 40);
    LevelCommon.spawnEnemies(scene, this.enemies, this.enemyCount, this.worldIdx);
    Puzzles.createChest(scene, 1800, CFG.GH - 90);
    Puzzles.createChest(scene, 3200, CFG.GH - 120);
  },

  spawnBoss(scene){
    Bosses.spawn(scene, this.bossKey, this.worldIdx, this.bossNameAr);
  }
};
