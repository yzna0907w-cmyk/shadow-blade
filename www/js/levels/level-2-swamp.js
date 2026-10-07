const Level2Swamp = {
  id:'swamp', nameAr:'المستنقع السام', worldIdx:1, width:3200,
  tileKey:'tile-swamp', bgKey:'bg-swamp',
  bossKey:'centipede', bossNameAr:'أم أربعة وأربعين',
  enemies:['slime','boar','slime'], enemyCount:10,

  preload(scene){
    scene.load.image(this.tileKey, 'assets/worlds/02-swamp/tiles.png');
    scene.load.image(this.bgKey, 'assets/worlds/02-swamp/bg.png');
  },

  create(scene){
    LevelCommon.buildBackground(scene, this.id, 0x88aa66);
    LevelCommon.buildGround(scene, this.width, this.tileKey, 0xaaffaa);
    LevelCommon.buildPlatforms(scene, this.width, 10, this.tileKey, 0xaaffaa);
    LevelCommon.buildCoins(scene, this.width, 25);
    LevelCommon.spawnEnemies(scene, this.enemies, this.enemyCount, this.worldIdx);
    Puzzles.createChest(scene, 1000, CFG.GH - 90);
    Puzzles.createChest(scene, 2200, CFG.GH - 120);
  },

  spawnBoss(scene){
    Bosses.spawn(scene, this.bossKey, this.worldIdx, this.bossNameAr);
  }
};
