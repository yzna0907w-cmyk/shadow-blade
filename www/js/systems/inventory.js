// ═══════════════════════════════════════════════════
// EMBER — نظام الإنفنتوري
// ═══════════════════════════════════════════════════
'use strict';

const Inventory = {

  scene: null,
  isOpen: false,
  selectedIndex: 0,
  items: [],

  // ═══ التهيئة ═══
  init(scene){
    this.scene = scene;
    this._buildUI();
    console.log('✅ Inventory system initialized');
  },

  // ═══ بناء الواجهة ═══
  _buildUI(){
    let el = document.getElementById('inventoryBox');
    if(el) return;

    el = document.createElement('div');
    el.id = 'inventoryBox';
    el.style.cssText = [
      'position:fixed',
      'top:0','left:0','right:0','bottom:0',
      'background:rgba(5,2,8,0.95)',
      'z-index:600',
      'display:none',
      'font-family:Cairo,sans-serif',
      'direction:rtl',
      'padding:20px',
      'overflow-y:auto'
    ].join(';');

    el.innerHTML = [
      '<div style="max-width:600px;margin:0 auto">',
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">',
      '<h2 style="color:#ffd700;margin:0;font-size:1.5rem">🎒 الحقيبة</h2>',
      '<button id="invClose" style="background:rgba(255,80,80,0.2);border:1px solid rgba(255,80,80,0.5);color:#ff8888;padding:8px 16px;border-radius:50px;font-family:Cairo,sans-serif;cursor:pointer">✕ إغلاق</button>',
      '</div>',
      '<div id="invCurrencies" style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap"></div>',
      '<div id="invGrid" style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:20px"></div>',
      '<div id="invDetails" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,140,60,0.3);border-radius:12px;padding:15px;min-height:100px"></div>',
      '</div>'
    ].join('');

    document.body.appendChild(el);

    const closeBtn = document.getElementById('invClose');
    if(closeBtn){
      closeBtn.onclick = () => this.close();
    }
  },

  // ═══ فتح ═══
  open(){
    if(this.isOpen) return;
    this.isOpen = true;

    const box = document.getElementById('inventoryBox');
    if(box) box.style.display = 'block';

    this._refresh();
    Audio.playUISelect();

    // إيقاف اللعبة
    if(this.scene && this.scene.physics){
      this.scene.physics.world.pause();
    }

    Events.emit('inventory:opened');
  },

  // ═══ إغلاق ═══
  close(){
    if(!this.isOpen) return;
    this.isOpen = false;

    const box = document.getElementById('inventoryBox');
    if(box) box.style.display = 'none';

    if(this.scene && this.scene.physics){
      this.scene.physics.world.resume();
    }

    Events.emit('inventory:closed');
  },

  // ═══ تبديل ═══
  toggle(){
    if(this.isOpen) this.close();
    else this.open();
  },

  // ═══ تحديث العرض ═══
  _refresh(){
    this._refreshCurrencies();
    this._refreshGrid();
    this._refreshDetails();
  },

  // ═══ العملات ═══
  _refreshCurrencies(){
    const el = document.getElementById('invCurrencies');
    if(!el) return;

    const currencies = State.currency.getAll();

    el.innerHTML = [
      '<div style="background:rgba(251,191,36,0.15);border:1px solid rgba(251,191,36,0.4);border-radius:50px;padding:6px 14px;color:#fbbf24">🪙 شظايا: ' + currencies.shards + '</div>',
      '<div style="background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.4);border-radius:50px;padding:6px 14px;color:#a855f7">💎 ذرات: ' + currencies.atoms + '</div>',
      '<div style="background:rgba(34,211,238,0.15);border:1px solid rgba(34,211,238,0.4);border-radius:50px;padding:6px 14px;color:#22d3ee">👻 أرواح: ' + currencies.souls + '</div>'
    ].join('');
  },

  // ═══ الشبكة ═══
  _refreshGrid(){
    const grid = document.getElementById('invGrid');
    if(!grid) return;

    const items = State.inventory.getItems();
    const maxSlots = State.data.inventory.maxSlots || 20;

    let html = '';

    for(let i = 0; i < maxSlots; i++){
      const item = items[i];

      if(item){
        const data = ITEM_DATA[item.id];
        const icon = data ? data.icon : '📦';
        const count = item.count > 1 ? '<span style="position:absolute;bottom:2px;right:4px;font-size:0.7rem;color:#ffd700;font-weight:bold">' + item.count + '</span>' : '';

        html += '<div class="inv-slot" data-index="' + i + '" style="position:relative;aspect-ratio:1;background:rgba(255,140,60,0.1);border:2px solid rgba(255,140,60,0.4);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;cursor:pointer;transition:all 0.2s">' + icon + count + '</div>';
      } else {
        html += '<div style="aspect-ratio:1;background:rgba(255,255,255,0.03);border:2px dashed rgba(255,255,255,0.1);border-radius:12px"></div>';
      }
    }

    grid.innerHTML = html;

    // ربط النقر
    grid.querySelectorAll('.inv-slot').forEach(slot => {
      slot.onclick = () => {
        const idx = parseInt(slot.dataset.index);
        this.selectItem(idx);
      };
    });
  },

  // ═══ اختيار عنصر ═══
  selectItem(idx){
    this.selectedIndex = idx;
    this._refreshDetails();

    // تأثير بصري
    const grid = document.getElementById('invGrid');
    if(grid){
      grid.querySelectorAll('.inv-slot').forEach((slot, i) => {
        if(i === idx){
          slot.style.borderColor = '#ffd700';
          slot.style.boxShadow = '0 0 20px rgba(255,215,0,0.6)';
        } else {
          slot.style.borderColor = 'rgba(255,140,60,0.4)';
          slot.style.boxShadow = 'none';
        }
      });
    }

    Audio.playUISelect();
  },

  // ═══ تفاصيل العنصر ═══
  _refreshDetails(){
    const el = document.getElementById('invDetails');
    if(!el) return;

    const items = State.inventory.getItems();
    const item = items[this.selectedIndex];

    if(!item){
      el.innerHTML = '<div style="color:#888;text-align:center;padding:20px">اختر عنصراً لعرض تفاصيله</div>';
      return;
    }

    const data = ITEM_DATA[item.id];
    if(!data){
      el.innerHTML = '<div style="color:#888">معلومات غير متوفرة</div>';
      return;
    }

    const canUse = this._canUse(item.id);

    el.innerHTML = [
      '<div style="display:flex;align-items:center;gap:15px;margin-bottom:15px">',
      '<div style="font-size:3rem">' + data.icon + '</div>',
      '<div>',
      '<div style="color:#ffd700;font-size:1.2rem;font-weight:bold">' + data.nameAr + '</div>',
      '<div style="color:#aaa;font-size:0.85rem">' + (data.desc || '') + '</div>',
      '<div style="color:#22d3ee;font-size:0.8rem;margin-top:5px">العدد: ' + item.count + '</div>',
      '</div>',
      '</div>',
      canUse ? '<button id="invUseBtn" style="width:100%;padding:12px;background:linear-gradient(135deg,#22c55e,#16a34a);border:none;border-radius:50px;color:#fff;font-family:Cairo,sans-serif;font-weight:bold;cursor:pointer;font-size:1rem">✅ استخدام</button>' : ''
    ].join('');

    const useBtn = document.getElementById('invUseBtn');
    if(useBtn){
      useBtn.onclick = () => this.useItem(this.selectedIndex);
    }
  },

  // ═══ هل يمكن الاستخدام؟ ═══
  _canUse(itemId){
    const data = ITEM_DATA[itemId];
    if(!data) return false;

    if(data.category === 'potion') return true;
    if(data.category === 'utility') return true;

    return false;
  },

  // ═══ استخدام عنصر ═══
  useItem(idx){
    const items = State.inventory.getItems();
    const item = items[idx];
    if(!item) return;

    const success = Items.use(this.scene, item.id);

    if(success){
      // تحديث
      this._refresh();
      Audio.playUISuccess();
    } else {
      Audio.playUIError();
    }
  },

  // ═══ إضافة عنصر ═══
  addItem(itemId, count){
    count = count || 1;
    const data = ITEM_DATA[itemId];
    if(!data) return false;

    const success = State.inventory.addItem({
      id: itemId,
      name: data.nameAr,
      icon: data.icon,
      count: count
    });

    if(success){
      Events.emit('inventory:item_added', { id: itemId, count: count });
    }

    return success;
  },

  // ═══ استعلامات ═══
  isActive(){ return this.isOpen; },
  getItemCount(itemId){
    const items = State.inventory.getItems();
    const item = items.find(i => i.id === itemId);
    return item ? item.count : 0;
  }
};

console.log('✅ Inventory system loaded');
