// ═══════════════════════════════════════════════════
// EMBER — نظام المتاجر
// ═══════════════════════════════════════════════════
'use strict';

const Shop = {

  scene: null,
  isOpen: false,
  currentShopId: null,
  currentShop: null,
  currentCategory: 'all',

  // ═══ التهيئة ═══
  init(scene){
    this.scene = scene;
    this._buildUI();
    console.log('✅ Shop system initialized');
  },

  // ═══ بناء الواجهة ═══
  _buildUI(){
    let el = document.getElementById('shopBox');
    if(el) return;

    el = document.createElement('div');
    el.id = 'shopBox';
    el.style.cssText = [
      'position:fixed',
      'top:0','left:0','right:0','bottom:0',
      'background:rgba(5,2,8,0.97)',
      'z-index:700',
      'display:none',
      'font-family:Cairo,sans-serif',
      'direction:rtl',
      'padding:20px',
      'overflow-y:auto'
    ].join(';');

    el.innerHTML = [
      '<div style="max-width:700px;margin:0 auto">',
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px">',
      '<h2 id="shopTitle" style="color:#ffd700;margin:0;font-size:1.5rem">🛒 المتجر</h2>',
      '<button id="shopClose" style="background:rgba(255,80,80,0.2);border:1px solid rgba(255,80,80,0.5);color:#ff8888;padding:8px 16px;border-radius:50px;font-family:Cairo,sans-serif;cursor:pointer">✕ إغلاق</button>',
      '</div>',
      '<div id="shopWallet" style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap"></div>',
      '<div id="shopList" style="display:grid;gap:10px;margin-bottom:20px"></div>',
      '<div id="shopMsg" style="text-align:center;color:#ffd700;font-size:1rem;min-height:30px;padding:10px"></div>',
      '</div>'
    ].join('');

    document.body.appendChild(el);

    const closeBtn = document.getElementById('shopClose');
    if(closeBtn){
      closeBtn.onclick = () => this.close();
    }
  },

  // ═══ فتح متجر ═══
  open(shopId){
    if(this.isOpen) return;

    const shopData = PRICES[shopId];
    if(!shopData){
      console.warn('⚠️ Shop missing: ' + shopId);
      return;
    }

    this.currentShopId = shopId;
    this.currentShop = shopData;
    this.isOpen = true;

    State.shop.visit(shopId);

    const box = document.getElementById('shopBox');
    if(box) box.style.display = 'block';

    const title = document.getElementById('shopTitle');
    if(title) title.textContent = '🛒 ' + shopData.nameAr;

    this._refresh();
    Audio.playUISelect();

    if(this.scene && this.scene.physics){
      this.scene.physics.world.pause();
    }

    Events.emit('shop:opened', { shopId: shopId });
  },

  // ═══ إغلاق ═══
  close(){
    if(!this.isOpen) return;
    this.isOpen = false;

    const box = document.getElementById('shopBox');
    if(box) box.style.display = 'none';

    if(this.scene && this.scene.physics){
      this.scene.physics.world.resume();
    }

    Events.emit('shop:closed', {});
  },

  // ═══ تحديث العرض ═══
  _refresh(){
    this._refreshWallet();
    this._refreshList();
  },

  // ═══ محفظة اللاعب ═══
  _refreshWallet(){
    const el = document.getElementById('shopWallet');
    if(!el) return;

    const c = State.currency.getAll();

    el.innerHTML = [
      '<div style="background:rgba(251,191,36,0.15);border:1px solid rgba(251,191,36,0.4);border-radius:50px;padding:6px 14px;color:#fbbf24">🪙 ' + c.shards + '</div>',
      '<div style="background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.4);border-radius:50px;padding:6px 14px;color:#a855f7">💎 ' + c.atoms + '</div>',
      '<div style="background:rgba(34,211,238,0.15);border:1px solid rgba(34,211,238,0.4);border-radius:50px;padding:6px 14px;color:#22d3ee">👻 ' + c.souls + '</div>'
    ].join('');
  },

  // ═══ قائمة العناصر ═══
  _refreshList(){
    const el = document.getElementById('shopList');
    if(!el) return;

    const shop = this.currentShop;
    if(!shop) return;

    let html = '';

    // ═══ الحداد (تطويرات) ═══
    if(this.currentShopId === 'blacksmith'){
      const weapons = ['sword', 'axe', 'spear'];
      weapons.forEach(wKey => {
        const w = WEAPON_DATA[wKey];
        const tier = State.weapon.getTier(wKey);
        const nextTier = tier + 1;
        const priceData = Prices.getWeaponUpgrade(wKey, nextTier);

        if(!priceData){
          html += this._itemCard(w.icon + ' ' + w.nameAr, 'مطور بالكامل (Tier ' + tier + ')', null, null, true, 0, null);
          return;
        }

        const canAfford = State.currency.canAfford(priceData.currency, priceData.price);
        const tierName = UPGRADE_TIERS[nextTier].nameAr;
        const newDamage = Math.floor(w.baseDamage * UPGRADE_TIERS[nextTier].damageMul);

        html += this._itemCard(
          w.icon + ' ' + w.nameAr + ' → ' + tierName,
          'ضرر: ' + State.weapon.getDamage(wKey) + ' → ' + newDamage,
          priceData.price,
          priceData.currency,
          canAfford,
          wKey,
          'upgrade'
        );
      });
    }

    // ═══ تاجر التحف (قدرات) ═══
    else if(this.currentShopId === 'relic_trader'){
      const abilities = shop.items || [];
      abilities.forEach(ab => {
        const abData = CFG.ABILITIES[ab.ability];
        if(!abData) return;

        const owned = State.ability.has(ab.ability);
        const canAfford = State.currency.canAfford(ab.currency, ab.price);

        if(owned){
          html += this._itemCard(abData.icon + ' ' + abData.nameAr, 'مفتوحة ✅', null, null, true, ab.ability, 'owned');
          return;
        }

        html += this._itemCard(
          abData.icon + ' ' + abData.nameAr,
          abData.desc,
          ab.price,
          ab.currency,
          canAfford,
          ab.ability,
          'ability'
        );
      });
    }

    // ═══ متاجر الأدوات (الساحر، العطّار، بائع الأسرار) ═══
    else {
      const itemIds = shop.items || [];
      itemIds.forEach(itemId => {
        const item = ITEM_DATA[itemId];
        if(!item) return;

        const canAfford = State.currency.canAfford(item.currency, item.price);
        const owned = Inventory.getItemCount(itemId);

        const desc = item.desc + (owned > 0 ? ' (لديك: ' + owned + ')' : '');

        html += this._itemCard(
          item.icon + ' ' + item.nameAr,
          desc,
          item.price,
          item.currency,
          canAfford,
          itemId,
          'item'
        );
      });
    }

    el.innerHTML = html;

    // ═══ ربط الأزرار ═══
    el.querySelectorAll('[data-buy]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.buy;
        const type = btn.dataset.type;
        this._handleBuy(id, type);
      };
    });
  },

  // ═══ بطاقة عنصر ═══
  _itemCard(title, desc, price, currency, canAfford, id, type){
    const currencyIcons = { shards: '🪙', atoms: '💎', souls: '👻' };
    const currencyColors = { shards: '#fbbf24', atoms: '#a855f7', souls: '#22d3ee' };

    const cIcon = currency ? (currencyIcons[currency] || '💰') : '';
    const cColor = currency ? (currencyColors[currency] || '#ffd700') : '#888';

    const isOwned = (type === 'owned');
    const disabled = isOwned || !canAfford;

    return [
      '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,140,60,' + (canAfford ? '0.5' : '0.2') + ');border-radius:12px;padding:14px;display:flex;justify-content:space-between;align-items:center;gap:10px;' + (isOwned ? 'opacity:0.5' : '') + '">',
      '<div style="flex:1">',
      '<div style="color:#ffd700;font-weight:bold;font-size:1rem;margin-bottom:4px">' + title + '</div>',
      '<div style="color:#aaa;font-size:0.85rem">' + desc + '</div>',
      '</div>',
      price !== null && price !== undefined ? '<div style="color:' + cColor + ';font-weight:bold;font-size:1rem;white-space:nowrap">' + cIcon + ' ' + price + '</div>' : '',
      isOwned ? '' : '<button data-buy="' + id + '" data-type="' + type + '" style="padding:10px 18px;background:' + (canAfford ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'rgba(255,255,255,0.1)') + ';border:none;border-radius:50px;color:#fff;font-family:Cairo,sans-serif;font-weight:bold;cursor:' + (canAfford ? 'pointer' : 'not-allowed') + ';font-size:0.9rem;white-space:nowrap">' + (canAfford ? '🛒 اشترِ' : '❌ لا يكفي') + '</button>',
      '</div>'
    ].join('');
  },

  // ═══ معالجة الشراء ═══
  _handleBuy(id, type){
    if(type === 'upgrade'){
      this._buyUpgrade(id);
    } else if(type === 'ability'){
      this._buyAbility(id);
    } else if(type === 'item'){
      this._buyItem(id);
    }
  },

  // ═══ شراء تطوير سلاح ═══
  _buyUpgrade(weaponKey){
    const tier = State.weapon.getTier(weaponKey);
    const nextTier = tier + 1;
    const priceData = Prices.getWeaponUpgrade(weaponKey, nextTier);
    if(!priceData){
      this._showMsg('❌ مطور بالكامل!', '#ff8888');
      return;
    }

    if(!State.currency.spend(priceData.currency, priceData.price)){
      this._showMsg('❌ لا تملك ما يكفي!', '#ff8888');
      Audio.playUIError();
      return;
    }

    State.data.weapons.upgrades[weaponKey] = nextTier;
    State.save();

    Audio.playUISuccess();
    const w = WEAPON_DATA[weaponKey];
    this._showMsg('✅ تم تطوير ' + w.nameAr + ' إلى ' + UPGRADE_TIERS[nextTier].nameAr + '!', '#22c55e');

    Events.emit('weapon:upgraded', { weapon: weaponKey, tier: nextTier });
    this._refresh();
  },

  // ═══ شراء قدرة ═══
  _buyAbility(abilityKey){
    const priceData = Prices.getAbilityPrice(abilityKey);
    if(!priceData){
      this._showMsg('❌ غير متوفرة', '#ff8888');
      return;
    }

    if(State.ability.has(abilityKey)){
      this._showMsg('✅ لديك هذه القدرة', '#22c55e');
      return;
    }

    if(!State.currency.spend(priceData.currency, priceData.price)){
      this._showMsg('❌ لا تملك ما يكفي!', '#ff8888');
      Audio.playUIError();
      return;
    }

    State.ability.unlock(abilityKey);
    State.save();

    Audio.playAbility();
    const abData = CFG.ABILITIES[abilityKey];
    this._showMsg('🎉 فتحت ' + abData.nameAr + '!', '#ffd700');

    Events.emit(Events.NAMES.ABILITY_UNLOCKED, { key: abilityKey });
    this._refresh();
  },

  // ═══ شراء أداة ═══
  _buyItem(itemId){
    const success = Items.buy(itemId);

    if(success){
      const item = ITEM_DATA[itemId];
      this._showMsg('✅ اشتريت ' + item.nameAr, '#22c55e');
      Audio.playUISuccess();
      this._refresh();
    } else {
      this._showMsg('❌ لا تملك ما يكفي!', '#ff8888');
      Audio.playUIError();
    }
  },

  // ═══ رسالة ═══
  _showMsg(text, color){
    const el = document.getElementById('shopMsg');
    if(!el) return;

    el.textContent = text;
    el.style.color = color || '#ffd700';

    if(this._msgTimer) clearTimeout(this._msgTimer);
    this._msgTimer = setTimeout(() => {
      if(el) el.textContent = '';
    }, 2500);
  },

  // ═══ استعلامات ═══
  isActive(){ return this.isOpen; },
  getCurrentShop(){ return this.currentShopId; }
};

console.log('✅ Shop system loaded');
