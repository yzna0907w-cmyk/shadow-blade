// ═══════════════════════════════════════════════════
// EMBER — "صدى"
// الـ 5 NPCs + حواراتهم المتغيرة
// ═══════════════════════════════════════════════════
'use strict';

const NPC_DATA = {

  // ═══════════════════════════════════════════════
  // ⚒️ 1. الحداد — في المقبرة
  // ═══════════════════════════════════════════════
  blacksmith: {
    id: 'blacksmith',
    nameAr: 'الحداد',
    title: 'سيد النار والمطارق',
    icon: '⚒️',
    sectionIdx: 0,
    position: { x: 500, y: 180 },

    // الشكل (Werewolf أسود + تلوين برتقالي)
    sprite: {
      sheet: 'werewolf-white',
      tint: 0xff8040,
      scale: 0.35,
      anim: 'idle'
    },

    // المظهر
    portrait: 'assets/npcs/farmer/touxiang.png',
    shop: 'blacksmith',

    // حوارات متغيرة حسب التقدم
    dialogues: [
      {
        condition: 'first',
        text: 'أهلاً يا... صدى؟ عجيب. لم أرَ فارساً منذ ألف سنة.',
        next: 'أنا الحداد. كنت أسلّح الحراس قبل الظلمة.',
        end: 'عد لي بعد أن تهزم حارس المقبرة. سأحسّن سيفك.'
      },
      {
        condition: 'boss_0_defeated',
        text: 'سمعت صوت السقوط. أحسنت!',
        next: 'سلاحك يحتاج صقلاً. تعال، اختار ما تريد.',
        end: 'وتذكّر: الحديد لا يكذب.'
      },
      {
        condition: 'boss_2_defeated',
        text: 'وصلت للكهوف؟ هذا مكان خطير.',
        next: 'خذ هذه النصيحة: الفأس يكسر الدروع.',
        end: 'ادرس عدوك قبل أن تهجم.'
      },
      {
        condition: 'boss_4_defeated',
        text: 'المصنع... كنت أعمل هناك.',
        next: 'صنعتُ تلك الدبابة. أنا آسف.',
        end: 'اقتلعها. أرجوك.'
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // 🧙 2. الساحر — في المستنقع
  // ═══════════════════════════════════════════════
  wizard: {
    id: 'wizard',
    nameAr: 'الساحر',
    title: 'حافظ الأسرار القديمة',
    icon: '🧙',
    sectionIdx: 1,
    position: { x: 600, y: 180 },

    sprite: {
      sheet: 'farmer',
      tint: 0xa855f7,
      scale: 1.5,
      anim: 'idle'
    },

    portrait: 'assets/npcs/farmer/touxiang 2.png',
    shop: 'wizard',

    dialogues: [
      {
        condition: 'first',
        text: 'أرى فيك... شرارة صغيرة.',
        next: 'أنا الساحر. كنت أحرس البلورات.',
        end: 'تعال لي بعد أن تهزم أم 44.'
      },
      {
        condition: 'boss_1_defeated',
        text: 'أحسنت! أم 44 كانت وحشاً.',
        next: 'لديّ أدوية. اختر ما يعجبك.',
        end: 'الصحة أهم من الذهب.'
      },
      {
        condition: 'boss_3_defeated',
        text: 'الغابة... سمعت بالخنزير.',
        next: 'احذر: الغضب يعمي البصر.',
        end: 'الهدوء... قوتك الحقيقية.'
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // 🧪 3. العطّار — في الكهوف
  // ═══════════════════════════════════════════════
  herbalist: {
    id: 'herbalist',
    nameAr: 'العطّار',
    title: 'صانع الجرعات',
    icon: '🧪',
    sectionIdx: 2,
    position: { x: 700, y: 180 },

    sprite: {
      sheet: 'farmer',
      tint: 0x22c55e,
      scale: 1.5,
      anim: 'idle'
    },

    portrait: 'assets/npcs/farmer/touxiang 3.png',
    shop: 'herbalist',

    dialogues: [
      {
        condition: 'first',
        text: 'أهلاً! أنا العطّار. أصنع الجرعات.',
        next: 'الظلمة أفسدت كل شيء... إلا الأعشاب.',
        end: 'عد بعد الكهوف. سأعطيك جرعة نادرة.'
      },
      {
        condition: 'boss_2_defeated',
        text: 'وصلت؟ رائع! الكهوف كانت مظلمة.',
        next: 'خذ جرعة الحماية. ستحتاجها.',
        end: 'الغابة قادمة... استعد.'
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // 💎 4. تاجر التحف — في الغابة
  // ═══════════════════════════════════════════════
  relic_trader: {
    id: 'relic_trader',
    nameAr: 'تاجر التحف',
    title: 'جامع النوادر',
    icon: '💎',
    sectionIdx: 3,
    position: { x: 800, y: 180 },

    sprite: {
      sheet: 'werewolf-white',
      tint: 0xffd700,
      scale: 0.3,
      anim: 'idle'
    },

    portrait: 'assets/npcs/farmer/touxiang.png',
    shop: 'relic_trader',

    dialogues: [
      {
        condition: 'first',
        text: 'أوه! زبون! لم أرَ أحداً منذ...',
        next: 'أنا تاجر التحف. أبيع القدرات النادرة.',
        end: 'جمع "ذرات" من الوحوش. تعال لي.'
      },
      {
        condition: 'boss_3_defeated',
        text: 'أحسنت! الخنزير كان شرساً.',
        next: 'عندي قدرة جديدة. اشتريها إن أردت.',
        end: 'المصنع... خطير. جهّز نفسك.'
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // 🗝️ 5. بائع الأسرار — في المصنع
  // ═══════════════════════════════════════════════
  secret_seller: {
    id: 'secret_seller',
    nameAr: 'بائع الأسرار',
    title: 'ظل الصمت',
    icon: '🗝️',
    sectionIdx: 4,
    position: { x: 900, y: 180 },

    sprite: {
      sheet: 'werewolf-red',
      tint: 0x1a1a2a,
      scale: 0.3,
      anim: 'idle'
    },

    portrait: 'assets/npcs/farmer/touxiang 2.png',
    shop: 'secret_seller',

    dialogues: [
      {
        condition: 'first',
        text: 'أخيراً... وصلت.',
        next: 'أنا بائع الأسرار. أعرف كل شيء.',
        end: 'لكن الأسرار... بثمن. أرواح.'
      },
      {
        condition: 'boss_4_defeated',
        text: 'قتلت الدبابة. أحسنت.',
        next: 'قبل النهاية... استعد.',
        end: 'الظل الأول ينتظرك. لا تخف.'
      }
    ]
  }
};

// ═══════════════════════════════════════════════════
// دوال مساعدة
// ═══════════════════════════════════════════════════
const NPCs = {

  get(id){ return NPC_DATA[id] || null; },

  getAll(){ return Object.keys(NPC_DATA).map(k => NPC_DATA[k]); },

  // حسب القسم
  getForSection(sectionIdx){
    return this.getAll().filter(n => n.sectionIdx === sectionIdx);
  },

  // الحوار الحالي حسب التقدم
  getCurrentDialogue(npcId){
    const npc = NPC_DATA[npcId];
    if(!npc) return null;

    const progress = State.data.progress;

    // نفحص كل حوار من الأخير للأول
    let selectedDialogue = null;

    npc.dialogues.forEach(d => {
      if(d.condition === 'first'){
        // أول لقاء
        if(!State.npc.hasMet(npcId)){
          if(!selectedDialogue) selectedDialogue = d;
        }
      } else {
        // شروط متقدمة
        const parts = d.condition.split('_');
        if(parts[0] === 'boss' && parts[2] === 'defeated'){
          const bossIdx = parseInt(parts[1]);
          if(progress.bossesDefeated[bossIdx]){
            if(!selectedDialogue) selectedDialogue = d;
          }
        }
      }
    });

    return selectedDialogue || npc.dialogues[npc.dialogues.length - 1];
  },

  // هل الـ NPC موجود الآن؟
  isAvailable(npcId){
    const npc = NPC_DATA[npcId];
    if(!npc) return false;
    const currentSection = State.data.progress.currentSection;
    return npc.sectionIdx === currentSection;
  },

  // كل NPCs القسم الحالي
  getCurrentSectionNPCs(){
    return this.getForSection(State.data.progress.currentSection);
  },

  count(){ return Object.keys(NPC_DATA).length; },

  order: ['blacksmith', 'wizard', 'herbalist', 'relic_trader', 'secret_seller']
};

console.log('✅ NPC_DATA loaded — ' + NPCs.count() + ' NPCs');
