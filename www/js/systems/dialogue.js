// ═══════════════════════════════════════════════════
// EMBER — نظام الحوار مع NPCs
// ═══════════════════════════════════════════════════
'use strict';

const Dialogue = {

  scene: null,
  currentNPC: null,
  currentDialogue: null,
  currentLine: 0,
  isOpen: false,
  typing: false,
  typeTimer: null,

  // ═══ التهيئة ═══
  init(scene){
    this.scene = scene;
    this._buildUI();
    console.log('✅ Dialogue system initialized');
  },

  // ═══ بناء الواجهة ═══
  _buildUI(){
    let el = document.getElementById('dialogueBox');
    if(el) return;

    el = document.createElement('div');
    el.id = 'dialogueBox';
    el.style.cssText = [
      'position:fixed',
      'bottom:0',
      'left:0',
      'right:0',
      'height:35%',
      'background:linear-gradient(180deg,rgba(5,2,8,0.95),rgba(10,5,15,0.98))',
      'border-top:3px solid #ff8c3c',
      'padding:20px',
      'z-index:500',
      'display:none',
      'font-family:Cairo,sans-serif',
      'direction:rtl',
      'box-shadow:0 -10px 40px rgba(255,140,60,0.3)'
    ].join(';');

    el.innerHTML = [
      '<div id="dialoguePortrait" style="position:absolute;right:20px;top:-60px;width:120px;height:120px;border-radius:50%;border:3px solid #ff8c3c;overflow:hidden;background:#1a0a05;box-shadow:0 0 30px rgba(255,140,60,0.6)"></div>',
      '<div id="dialogueName" style="position:absolute;right:160px;top:10px;font-size:1.1rem;color:#ffd700;font-weight:bold;letter-spacing:2px"></div>',
      '<div id="dialogueText" style="color:#f5f0ff;font-size:1rem;line-height:1.8;margin-top:30px;padding:0 10px;min-height:80px"></div>',
      '<div id="dialogueHint" style="position:absolute;bottom:15px;left:20px;color:#ff8c3c;font-size:0.8rem;opacity:0.7;animation:pulse 1.5s infinite">▼ اضغط للمتابعة</div>',
      '<div id="dialogueActions" style="position:absolute;bottom:15px;right:20px;display:flex;gap:10px"></div>'
    ].join('');

    document.body.appendChild(el);
  },

  // ═══ فتح الحوار ═══
  open(npcKey){
    const npc = NPC_DATA[npcKey];
    if(!npc){
      console.warn('⚠️ NPC missing: ' + npcKey);
      return;
    }

    this.currentNPC = npc;
    this.currentDialogue = NPCs.getCurrentDialogue(npcKey);
    this.currentLine = 0;
    this.isOpen = true;

    // سجل اللقاء
    State.npc.meet(npcKey);
    State.npc.talk(npcKey);

    // عرض
    const box = document.getElementById('dialogueBox');
    if(box) box.style.display = 'block';

    const nameEl = document.getElementById('dialogueName');
    if(nameEl) nameEl.textContent = npc.icon + ' ' + npc.nameAr;

    const portraitEl = document.getElementById('dialoguePortrait');
    if(portraitEl){
      portraitEl.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem">' + npc.icon + '</div>';
    }

    this._renderCurrentLine();
    this._showHint();

    Audio.playUISelect();
    Events.emit('dialogue:opened', { npc: npcKey });
  },

  // ═══ إغلاق الحوار ═══
  close(){
    if(!this.isOpen) return;

    const box = document.getElementById('dialogueBox');
    if(box) box.style.display = 'none';

    this.isOpen = false;
    this.currentNPC = null;
    this.currentDialogue = null;
    this.currentLine = 0;

    if(this.typeTimer){
      clearInterval(this.typeTimer);
      this.typeTimer = null;
    }

    Events.emit('dialogue:closed', {});
  },

  // ═══ السطر الحالي ═══
  _renderCurrentLine(){
    const d = this.currentDialogue;
    if(!d) return;

    let text = '';
    if(this.currentLine === 0) text = d.text || '';
    else if(this.currentLine === 1) text = d.next || '';
    else if(this.currentLine === 2) text = d.end || '';

    // لو ما فيه سطر ثالث، نرجع للأول
    if(!text && this.currentLine > 0){
      this.currentLine = 0;
      text = d.text;
    }

    this._typeText(text);
  },

  // ═══ كتابة تدريجية ═══
  _typeText(text){
    if(!text) return;
    if(this.typeTimer) clearInterval(this.typeTimer);

    const el = document.getElementById('dialogueText');
    if(!el) return;

    el.textContent = '';
    let i = 0;
    this.typing = true;

    this.typeTimer = setInterval(() => {
      if(i < text.length){
        el.textContent += text[i];
        i++;
      } else {
        clearInterval(this.typeTimer);
        this.typeTimer = null;
        this.typing = false;
      }
    }, 25);
  },

  // ═══ السطر التالي ═══
  next(){
    if(!this.isOpen) return;

    // لو لسا يكتب، نوقف الكتابة
    if(this.typing){
      if(this.typeTimer){
        clearInterval(this.typeTimer);
        this.typeTimer = null;
      }
      // نعرض النص كامل
      const d = this.currentDialogue;
      let text = '';
      if(this.currentLine === 0) text = d.text || '';
      else if(this.currentLine === 1) text = d.next || '';
      else if(this.currentLine === 2) text = d.end || '';

      const el = document.getElementById('dialogueText');
      if(el) el.textContent = text;

      this.typing = false;
      return;
    }

    // السطر التالي
    this.currentLine++;

    const d = this.currentDialogue;
    const maxLines = this._countLines(d);

    if(this.currentLine >= maxLines){
      // نهاية الحوار
      this._onDialogueEnd();
      return;
    }

    this._renderCurrentLine();
  },

  // ═══ عدد الأسطر ═══
  _countLines(d){
    let count = 0;
    if(d.text) count++;
    if(d.next) count++;
    if(d.end) count++;
    return count || 1;
  },

  // ═══ نهاية الحوار ═══
  _onDialogueEnd(){
    const npc = this.currentNPC;
    if(!npc){
      this.close();
      return;
    }

    // ═══ عرض خيارات ═══
    if(npc.shop){
      this._showShopOptions(npc);
      return;
    }

    // ═══ إغلاق ═══
    this.close();
  },

  // ═══ خيارات المتجر ═══
  _showShopOptions(npc){
    const actionsEl = document.getElementById('dialogueActions');
    if(!actionsEl) return;

    actionsEl.innerHTML = '';

    // زر "افتح المتجر"
    const shopBtn = document.createElement('button');
    shopBtn.textContent = '🛒 افتح المتجر';
    shopBtn.style.cssText = 'padding:10px 20px;background:linear-gradient(135deg,#ff8c3c,#ff3c14);border:none;border-radius:50px;color:#fff;font-family:Cairo,sans-serif;font-weight:bold;cursor:pointer;font-size:0.95rem;box-shadow:0 4px 15px rgba(255,140,60,0.5)';
    shopBtn.onclick = () => {
      this.close();
      if(typeof Shop !== 'undefined' && Shop.open){
        Shop.open(npc.shop);
      }
    };
    actionsEl.appendChild(shopBtn);

    // زر "وداعاً"
    const byeBtn = document.createElement('button');
    byeBtn.textContent = '👋 وداعاً';
    byeBtn.style.cssText = 'padding:10px 20px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,140,60,0.5);border-radius:50px;color:#ffb87a;font-family:Cairo,sans-serif;cursor:pointer;font-size:0.95rem';
    byeBtn.onclick = () => {
      this.close();
    };
    actionsEl.appendChild(byeBtn);
  },

  // ═══ إظهار التلميح ═══
  _showHint(){
    const hint = document.getElementById('dialogueHint');
    if(!hint) return;
    hint.style.display = 'block';
  },

  // ═══ ربط المدخلات ═══
  handleInput(){
    if(!this.isOpen) return;

    // زر الهجوم = التالي
    if(Input.isAttackPressed()){
      this.next();
    }

    // ESC = إغلاق
    if(Input.keys.pause){
      this.close();
    }
  },

  // ═══ فحص القرب من NPC ═══
  checkNearbyNPCs(){
    if(!Player.sprite) return;
    if(this.isOpen) return;

    const player = Player.sprite;
    const px = player.x;
    const py = player.y;

    // فحص NPCs القسم الحالي
    const sectionNPCs = NPCs.getCurrentSectionNPCs();

    sectionNPCs.forEach(npc => {
      if(!npc.position) return;

      const dist = Phaser.Math.Distance.Between(px, py, npc.position.x, npc.position.y);

      if(dist < 80){
        // عرض تلميح
        this._showNearbyHint(npc);
      }
    });
  },

  _showNearbyHint(npc){
    if(this._hintTimer){
      clearTimeout(this._hintTimer);
    }

    const box = document.getElementById('dialogueBox');
    if(!box || box.style.display === 'block') return;

    // تلميح صغير
    let hint = document.getElementById('npcHint');
    if(!hint){
      hint = document.createElement('div');
      hint.id = 'npcHint';
      hint.style.cssText = 'position:fixed;bottom:200px;left:50%;transform:translateX(-50%);background:rgba(5,2,8,0.9);color:#ffd700;padding:10px 20px;border-radius:50px;border:2px solid #ff8c3c;font-family:Cairo,sans-serif;z-index:400;pointer-events:none';
      document.body.appendChild(hint);
    }

    hint.textContent = '💬 اضغط زر الهجوم للتحدث مع ' + npc.nameAr;
    hint.style.display = 'block';

    this._hintTimer = setTimeout(() => {
      if(hint) hint.style.display = 'none';
    }, 2000);
  },

  // ═══ استعلامات ═══
  isActive(){ return this.isOpen; },
  getCurrentNPC(){ return this.currentNPC; }
};

console.log('✅ Dialogue system loaded');
