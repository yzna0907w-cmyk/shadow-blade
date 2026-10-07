// ═══════════════════════════════════════════════════
// EMBER — نظام التحكم (نسخة مضمونة)
// ═══════════════════════════════════════════════════
'use strict';

window.Input = {

  keys: {
    left: false, right: false, up: false, down: false,
    jump: false, attack: false, dash: false,
    interact: false, inventory: false, map: false,
    pause: false, switchWeapon: false,
    jumpPressed: false, attackPressed: false,
    dashPressed: false, switchWeaponPressed: false
  },

  _mobile: {
    left: false, right: false, jump: false,
    attack: false, dash: false, switchWeapon: false
  },

  cursors: null,
  _keyMap: null,
  _mobileBindings: [],
  _debug: true,

  init(scene){
    this.initKeyboard(scene);
    this.initMobile();
    console.log('✅ Input initialized');
  },

  initKeyboard(scene){
    if(!scene.input || !scene.input.keyboard) return;
    this.cursors = scene.input.keyboard.createCursorKeys();
    this._keyMap = scene.input.keyboard.addKeys({
      A: 'A', D: 'D', W: 'W', S: 'S',
      SPACE: 'SPACE', J: 'J', K: 'K', L: 'L',
      ENTER: 'ENTER', SHIFT: 'SHIFT',
      TAB: 'TAB', M: 'M', ESC: 'ESC'
    });
  },

  initMobile(){
    const bindings = [
      { id: 'btnLeft',  key: 'left' },
      { id: 'btnRight', key: 'right' },
      { id: 'btnJump',  key: 'jump' },
      { id: 'btnAttack', key: 'attack' },
      { id: 'btnDash',  key: 'dash' },
      { id: 'btnSwitch', key: 'switchWeapon' }
    ];

    const self = this; // ⚡ مهم: للـ Scope

    bindings.forEach(b => {
      const el = document.getElementById(b.id);
      if(!el){
        console.warn('⚠️ Button missing:', b.id);
        return;
      }

      const setPressed = function(val){
        const was = self._mobile[b.key];
        self._mobile[b.key] = val;

        if(b.key === 'jump') self.keys.jumpPressed = val && !was;
        if(b.key === 'attack') self.keys.attackPressed = val && !was;
        if(b.key === 'dash') self.keys.dashPressed = val && !was;
        if(b.key === 'switchWeapon') self.keys.switchWeaponPressed = val && !was;

        if(val) el.classList.add('pressed');
        else el.classList.remove('pressed');
      };

      el.addEventListener('touchstart', function(e){ e.preventDefault(); setPressed(true); }, { passive: false });
      el.addEventListener('touchend', function(e){ e.preventDefault(); setPressed(false); }, { passive: false });
      el.addEventListener('touchcancel', function(e){ e.preventDefault(); setPressed(false); }, { passive: false });
      el.addEventListener('mousedown', function(e){ e.preventDefault(); setPressed(true); });
      el.addEventListener('mouseup', function(e){ e.preventDefault(); setPressed(false); });
      el.addEventListener('mouseleave', function(){ setPressed(false); });

      self._mobileBindings.push({ el: el, key: b.key });
    });

    console.log('✅ Mobile controls bound: ' + this._mobileBindings.length);
  },

  update(){
    const self = this;

    // ═══ الكيبورد (احتياط) ═══
    let kbLeft = false, kbRight = false, kbJump = false, kbAttack = false, kbDash = false, kbSwitch = false;

    if(self.cursors && self._keyMap){
      const K = self._keyMap;
      const C = self.cursors;
      kbLeft  = C.left.isDown  || K.A.isDown;
      kbRight = C.right.isDown || K.D.isDown;
      kbJump  = K.SPACE.isDown || C.up.isDown || K.W.isDown;
      kbAttack = K.J.isDown || K.ENTER.isDown;
      kbDash = K.SHIFT.isDown || K.K.isDown;
      kbSwitch = K.TAB.isDown || K.L.isDown;

      self.keys.inventory = K.TAB.isDown;
      self.keys.map = K.M.isDown;
      self.keys.pause = K.ESC.isDown;
    }

    // ═══ الدمج (Mobile أولاً، الكيبورد كإضافة) ═══
    const leftNow  = self._mobile.left  || kbLeft;
    const rightNow = self._mobile.right || kbRight;
    const jumpNow  = self._mobile.jump  || kbJump;
    const attackNow = self._mobile.attack || kbAttack;
    const dashNow  = self._mobile.dash  || kbDash;
    const switchNow = self._mobile.switchWeapon || kbSwitch;

    // ═══ Edge Detection ═══
    self.keys.jumpPressed = jumpNow && !self.keys.jump;
    self.keys.attackPressed = attackNow && !self.keys.attack;
    self.keys.dashPressed = dashNow && !self.keys.dash;
    self.keys.switchWeaponPressed = switchNow && !self.keys.switchWeapon;

    // ═══ تحديث الحالة النهائية ═══
    self.keys.left = leftNow;
    self.keys.right = rightNow;
    self.keys.jump = jumpNow;
    self.keys.attack = attackNow;
    self.keys.dash = dashNow;
    self.keys.switchWeapon = switchNow;
  },

  getDirection(){
    if(this.keys.left && !this.keys.right) return -1;
    if(this.keys.right && !this.keys.left) return 1;
    return 0;
  },

  isJumpDown(){ return this.keys.jump; },
  isJumpPressed(){ return this.keys.jumpPressed; },
  isAttackDown(){ return this.keys.attack; },
  isAttackPressed(){ return this.keys.attackPressed; },
  isDashDown(){ return this.keys.dash; },
  isDashPressed(){ return this.keys.dashPressed; },
  isSwitchWeaponPressed(){ return this.keys.switchWeaponPressed; },
  isLeft(){ return this.keys.left; },
  isRight(){ return this.keys.right; },

  clearAll(){
    for(const k in this.keys) this.keys[k] = false;
    for(const k in this._mobile) this._mobile[k] = false;
    this._mobileBindings.forEach(b => {
      if(b.el) b.el.classList.remove('pressed');
    });
  },

  isMobile(){
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  }
};

console.log('✅ Input system loaded (v2)');
