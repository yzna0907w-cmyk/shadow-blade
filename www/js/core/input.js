// ═══════════════════════════════════════════════════
// EMBER — "صدى"
// ملف التحكم (كيبورد + جوال)
// ═══════════════════════════════════════════════════
'use strict';

const Input = {

  // ═══════════════════════════════════════════════
  // 1. حالة الأزرار
  // ═══════════════════════════════════════════════
  keys: {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    attack: false,
    dash: false,
    interact: false,
    inventory: false,
    map: false,
    pause: false,
    switchWeapon: false,
    // حالات الانتقال (edge detection)
    jumpPressed: false,
    attackPressed: false,
    dashPressed: false,
    interactPressed: false,
    switchWeaponPressed: false
  },

  // ═══════════════════════════════════════════════
  // 2. الكيبورد
  // ═══════════════════════════════════════════════
  keyboard: null,
  cursors: null,
  _keyMap: null,

  initKeyboard(scene){
    if(!scene.input || !scene.input.keyboard) return;

    this.cursors = scene.input.keyboard.createCursorKeys();

    this._keyMap = scene.input.keyboard.addKeys({
      A: Phaser.Input.Keyboard.KeyCodes.A,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      W: Phaser.Input.Keyboard.KeyCodes.W,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
      J: Phaser.Input.Keyboard.KeyCodes.J,
      K: Phaser.Input.Keyboard.KeyCodes.K,
      L: Phaser.Input.Keyboard.KeyCodes.L,
      ENTER: Phaser.Input.Keyboard.KeyCodes.ENTER,
      SHIFT: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      TAB: Phaser.Input.Keyboard.KeyCodes.TAB,
      M: Phaser.Input.Keyboard.KeyCodes.M,
      ESC: Phaser.Input.Keyboard.KeyCodes.ESC
    });
  },

  updateKeyboard(){
    if(!this.cursors || !this._keyMap) return;

    const K = this._keyMap;
    const C = this.cursors;

    // ═══ اتجاهات ═══
    this.keys.left  = C.left.isDown  || K.A.isDown;
    this.keys.right = C.right.isDown || K.D.isDown;
    this.keys.up    = C.up.isDown    || K.W.isDown;
    this.keys.down  = C.down.isDown  || K.S.isDown;

    // ═══ قفز ═══
    const jumpNow = K.SPACE.isDown || C.up.isDown || K.W.isDown;
    this.keys.jumpPressed = jumpNow && !this.keys.jump;
    this.keys.jump = jumpNow;

    // ═══ هجوم ═══
    const attackNow = K.J.isDown || K.ENTER.isDown;
    this.keys.attackPressed = attackNow && !this.keys.attack;
    this.keys.attack = attackNow;

    // ═══ انطلاق ═══
    const dashNow = K.SHIFT.isDown || K.K.isDown;
    this.keys.dashPressed = dashNow && !this.keys.dash;
    this.keys.dash = dashNow;

    // ═══ تفاعل ═══
    const interactNow = K.ENTER.isDown || C.up.isDown;
    this.keys.interactPressed = interactNow && !this.keys.interact;
    this.keys.interact = interactNow;

    // ═══ تبديل سلاح ═══
    const switchNow = K.TAB.isDown || K.L.isDown;
    this.keys.switchWeaponPressed = switchNow && !this.keys.switchWeapon;
    this.keys.switchWeapon = switchNow;

    // ═══ إنفنتوري / خريطة / إيقاف ═══
    this.keys.inventory = K.TAB.isDown;
    this.keys.map = K.M.isDown;
    this.keys.pause = K.ESC.isDown;
  },

  // ═══════════════════════════════════════════════
  // 3. أزرار الجوال
  // ═══════════════════════════════════════════════
  _mobileBindings: [],

  initMobile(){
    const bindings = [
      { id: 'btnLeft',  key: 'left' },
      { id: 'btnRight', key: 'right' },
      { id: 'btnJump',  key: 'jump' },
      { id: 'btnAttack', key: 'attack' },
      { id: 'btnDash',  key: 'dash' },
      { id: 'btnSwitch', key: 'switchWeapon' }
    ];

    bindings.forEach(b => {
      const el = document.getElementById(b.id);
      if(!el) return;

      const setPressed = (val) => {
        const wasPressed = this.keys[b.key];
        this.keys[b.key] = val;

        // حقل "Pressed" للانتقال
        if(b.key === 'jump') this.keys.jumpPressed = val && !wasPressed;
        if(b.key === 'attack') this.keys.attackPressed = val && !wasPressed;
        if(b.key === 'dash') this.keys.dashPressed = val && !wasPressed;
        if(b.key === 'switchWeapon') this.keys.switchWeaponPressed = val && !wasPressed;

        if(val) el.classList.add('pressed');
        else el.classList.remove('pressed');
      };

      // Touch
      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        setPressed(true);
      }, { passive: false });

      el.addEventListener('touchend', (e) => {
        e.preventDefault();
        setPressed(false);
      }, { passive: false });

      el.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        setPressed(false);
      }, { passive: false });

      // Mouse (للاختبار على الكمبيوتر)
      el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        setPressed(true);
      });

      el.addEventListener('mouseup', (e) => {
        e.preventDefault();
        setPressed(false);
      });

      el.addEventListener('mouseleave', () => {
        setPressed(false);
      });

      this._mobileBindings.push({ el, key: b.key });
    });

    console.log('✅ Mobile controls bound: ' + this._mobileBindings.length);
  },

  // ═══════════════════════════════════════════════
  // 4. إظهار / إخفاء أزرار الجوال
  // ═══════════════════════════════════════════════
  showMobileControls(show){
    ['btnLeft', 'btnRight', 'btnJump', 'btnAttack', 'btnDash', 'btnSwitch'].forEach(id => {
      const el = document.getElementById(id);
      if(el){
        if(show) el.style.display = 'flex';
        else el.style.display = 'none';
      }
    });
  },

  // ═══════════════════════════════════════════════
  // 5. تحديث عام (يُستدعى كل إطار)
  // ═══════════════════════════════════════════════
  update(){
    this.updateKeyboard();
  },

  // ═══════════════════════════════════════════════
  // 6. قراءة الأزرار (واجهة نظيفة)
  // ═══════════════════════════════════════════════
  isLeft(){ return this.keys.left; },
  isRight(){ return this.keys.right; },
  isUp(){ return this.keys.up; },
  isDown(){ return this.keys.down; },
  isJumpDown(){ return this.keys.jump; },
  isJumpPressed(){ return this.keys.jumpPressed; },
  isAttackDown(){ return this.keys.attack; },
  isAttackPressed(){ return this.keys.attackPressed; },
  isDashDown(){ return this.keys.dash; },
  isDashPressed(){ return this.keys.dashPressed; },
  isInteractDown(){ return this.keys.interact; },
  isInteractPressed(){ return this.keys.interactPressed; },
  isSwitchWeaponDown(){ return this.keys.switchWeapon; },
  isSwitchWeaponPressed(){ return this.keys.switchWeaponPressed; },
  isInventoryOpen(){ return this.keys.inventory; },
  isMapOpen(){ return this.keys.map; },
  isPausePressed(){ return this.keys.pause; },

  // ═══════════════════════════════════════════════
  // 7. توجيه اللاعب
  // ═══════════════════════════════════════════════
  getDirection(){
    if(this.keys.left && !this.keys.right) return -1;
    if(this.keys.right && !this.keys.left) return 1;
    return 0;
  },

  // ═══════════════════════════════════════════════
  // 8. مسح كل الأزرار (عند تغيير المرحلة)
  // ═══════════════════════════════════════════════
  clearAll(){
    for(const key in this.keys){
      this.keys[key] = false;
    }
    this._mobileBindings.forEach(b => {
      if(b.el) b.el.classList.remove('pressed');
    });
  },

  // ═══════════════════════════════════════════════
  // 9. فحص إذا كان اللاعب يستخدم الجوال
  // ═══════════════════════════════════════════════
  isMobile(){
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  },

  // ═══════════════════════════════════════════════
  // 10. تهيئة عامة
  // ═══════════════════════════════════════════════
  init(scene){
    this.initKeyboard(scene);
    this.initMobile();
    console.log('✅ Input initialized (mobile: ' + this.isMobile() + ')');
  }
};
