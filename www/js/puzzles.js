// ═══════════════════════════════════════
// الألغاز (صناديق، مفاتيح، أزرار)
// ═══════════════════════════════════════
const Puzzles = {
  chests: [],
  keys: [],
  buttons: [],
  doors: [],
  
  // ═══ تحميل الصور ═══
  preload(scene){
    scene.load.image('chest-closed', 'assets/ui/chest-closed.png');
    scene.load.image('chest-open', 'assets/ui/chest-open.png');
    scene.load.image('key', 'assets/ui/key.png');
    scene.load.image('button', 'assets/ui/button.png');
    scene.load.image('door', 'assets/ui/door.png');
  },
  
  // ═══ إنشاء صندوق ═══
  createChest(scene, x, y){
    const chest = scene.physics.add.sprite(x, y, 'chest-closed');
    chest.setDepth(7);
    chest.opened = false;
    chest.body.setAllowGravity(true);
    chest.body.setCollideWorldBounds(true);
    this.chests.push(chest);
    return chest;
  },
  
  // ═══ فتح صندوق ═══
  openChest(scene, chest){
    if(chest.opened) return;
    chest.opened = true;
    chest.setTexture('chest-open');
    
    // هدية عشوائية
    const reward = Math.random();
    if(reward < 0.5){
      // عملات
      const amount = Phaser.Math.Between(5, 15);
      State.data.gold += amount;
      State.save();
      HUD.showCoinPopup(scene, chest.x, chest.y - 30, amount);
    } else if(reward < 0.8){
      // صحة
      State.data.hp = Math.min(State.data.maxHp, State.data.hp + 30);
      HUD.update();
    } else {
      // XP
      State.addXP(50);
    }
    
    if(scene.sound) scene.sound.play('sfx-kill', {volume: 0.4});
    scene.cameras.main.shake(200, 0.005);
  },
  
  // ═══ إنشاء مفتاح ═══
  createKey(scene, x, y){
    const key = scene.physics.add.sprite(x, y, 'key');
    key.setDepth(6);
    key.setScale(0.8);
    this.keys.push(key);
    scene.tweens.add({
      targets: key, y: y - 8, duration: 1000,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });
    return key;
  },
  
  // ═══ إنشاء زر ═══
  createButton(scene, x, y, targetDoor){
    const btn = scene.physics.add.sprite(x, y, 'button');
    btn.setDepth(6);
    btn.targetDoor = targetDoor;
    btn.pressed = false;
    this.buttons.push(btn);
    return btn;
  },
  
  // ═══ إنشاء باب ═══
  createDoor(scene, x, y){
    const door = scene.physics.add.sprite(x, y, 'door');
    door.setDepth(6);
    door.setImmovable(true);
    door.body.setAllowGravity(false);
    door.opened = false;
    this.doors.push(door);
    return door;
  },
  
  // ═══ تحديث ═══
  update(scene, player){
    if(!player.sprite) return;
    const pBounds = player.sprite.getBounds();
    
    // الصناديق
    this.chests.forEach(chest => {
      if(!chest.active) return;
      if(Phaser.Geom.Intersects.RectangleToRectangle(pBounds, chest.getBounds())){
        this.openChest(scene, chest);
      }
    });
    
    // المفاتيح
    this.keys.forEach(key => {
      if(!key.active) return;
      if(Phaser.Geom.Intersects.RectangleToRectangle(pBounds, key.getBounds())){
        key.destroy();
        if(scene.sound) scene.sound.play('sfx-kill', {volume: 0.4});
      }
    });
    
    // الأزرار
    this.buttons.forEach(btn => {
      if(!btn.active || btn.pressed) return;
      if(Phaser.Geom.Intersects.RectangleToRectangle(pBounds, btn.getBounds())){
        btn.pressed = true;
        if(btn.targetDoor && btn.targetDoor.active){
          btn.targetDoor.destroy();
        }
        if(scene.sound) scene.sound.play('sfx-kill', {volume: 0.4});
      }
    });
  },
  
  // ═══ تنظيف ═══
  clear(){
    this.chests = [];
    this.keys = [];
    this.buttons = [];
    this.doors = [];
  }
};
