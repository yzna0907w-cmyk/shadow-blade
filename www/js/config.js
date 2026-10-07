// ═══════════════════════════════════════
// إعدادات اللعبة العامة
// ═══════════════════════════════════════
const CFG = {
  GW: 480,           // عرض الشاشة
  GH: 270,           // ارتفاع الشاشة
  GRAVITY: 900,
  MOVE_SPEED: 130,
  JUMP_VELOCITY: -340,
  DOUBLE_JUMP_VELOCITY: -300,
  DASH_SPEED: 400,
  DASH_DURATION: 200,
  COYOTE_TIME: 100,
  JUMP_BUFFER: 120,
  ATK_COOLDOWN: 350,
  ATK_RANGE: 45,
  INVULN_TIME: 1200,
  PLAYER_DAMAGE: 25,
  BASE_HP: 100,
  PLAYER_SCALE: 1.0,
  ENEMY_SCALE: 1.0,
  BOSS_SCALE: 1.5
};

// ═══════════════════════════════════════
// إعدادات العوالم
// ═══════════════════════════════════════
const WORLDS = [
  { id:'crypt',   nameAr:'المقبرة',       bgTint:0x4a3a6a, width:3000 },
  { id:'swamp',   nameAr:'المستنقع السام', bgTint:0x3a5a3a, width:3200 },
  { id:'caves',   nameAr:'كهوف الكريستال', bgTint:0x3a4a7a, width:3500 },
  { id:'forest',  nameAr:'الغابة الميتة',  bgTint:0x2a4a2a, width:3800 },
  { id:'factory', nameAr:'المصنع المحروق', bgTint:0x6a3a2a, width:4000 }
];
