// ═══════════════════════════════════════════════════
// EMBER — "صدى"
// ملف إدارة الأصوات والموسيقى
// ═══════════════════════════════════════════════════
'use strict';

const Audio = {

  // ═══════════════════════════════════════════════
  // 1. الحالة
  // ═══════════════════════════════════════════════
  scene: null,
  currentMusic: null,
  currentMusicKey: null,
  musicVolume: CFG.AUDIO.MUSIC_VOLUME,
  sfxVolume: CFG.AUDIO.SFX_VOLUME,
  masterVolume: CFG.AUDIO.MASTER_VOLUME,
  muted: CFG.AUDIO.MUTE,
  _musicFade: null,

  // ═══════════════════════════════════════════════
  // 2. قائمة الأصوات المتاحة
  // ═══════════════════════════════════════════════
  SFX: {
    jump: 'sfx-jump',
    attack: 'sfx-attack',
    hit: 'sfx-hit',
    hurt: 'sfx-hurt',
    death: 'sfx-death',
    land: 'sfx-land',
    dash: 'sfx-dash',
    boom: 'sfx-boom',
    break: 'sfx-break',
    coin: 'sfx-coin',
    kill: 'sfx-kill',
    ability: 'sfx-ability',
    doorCrash: 'sfx-door-crash',
    uiSelect: 'sfx-ui-select',
    uiSuccess: 'sfx-ui-success',
    uiError: 'sfx-ui-error',
    healthUp: 'sfx-health-up',
    slimeDeath: 'sfx-slime-death',
    slimeHit: 'sfx-slime-hit'
  },

  MUSIC: {
    title: 'music-title',
    crypt: 'music-dungeon',
    swamp: 'music-dungeon',
    caves: 'music-dungeon',
    forest: 'music-forest',
    factory: 'music-dungeon',
    boss: 'music-dungeon'
  },

  // ═══════════════════════════════════════════════
  // 3. التهيئة
  // ═══════════════════════════════════════════════
  init(scene){
    this.scene = scene;
    if(!scene.sound){
      console.warn('⚠️ Audio: scene.sound not available');
      return;
    }
    scene.sound.volume = this.masterVolume;
    console.log('✅ Audio initialized');
  },

  // ═══════════════════════════════════════════════
  // 4. تشغيل مؤثر صوتي
  // ═══════════════════════════════════════════════
  play(key, options = {}){
    if(this.muted) return null;
    if(!this.scene || !this.scene.sound) return null;

    const volume = (options.volume || 1) * this.sfxVolume;
    const rate = options.rate || 1;

    try {
      const sound = this.scene.sound.add(key, {
        volume: volume,
        rate: rate
      });
      sound.play();
      // تنظيف تلقائي بعد التشغيل
      sound.once('complete', () => sound.destroy());
      return sound;
    } catch(e) {
      console.warn('SFX error: ' + key, e);
      return null;
    }
  },

  // ═══════════════════════════════════════════════
  // 5. مؤثرات محددة (للراحة)
  // ═══════════════════════════════════════════════
  playJump(){ this.play(this.SFX.jump, { volume: 0.5 }); },
  playAttack(){ this.play(this.SFX.attack, { volume: 0.6 }); },
  playHit(){ this.play(this.SFX.hit, { volume: 0.7 }); },
  playHurt(){ this.play(this.SFX.hurt, { volume: 0.7 }); },
  playDeath(){ this.play(this.SFX.death, { volume: 0.8 }); },
  playLand(){ this.play(this.SFX.land, { volume: 0.4 }); },
  playDash(){ this.play(this.SFX.dash, { volume: 0.5 }); },
  playCoin(){
    // عملة بصوت مختلف قليلاً في كل مرة
    const rate = 1 + (Math.random() * 0.2 - 0.1);
    this.play(this.SFX.coin, { volume: 0.5, rate });
  },
  playKill(){ this.play(this.SFX.kill, { volume: 0.6 }); },
  playAbility(){ this.play(this.SFX.ability, { volume: 0.8 }); },
  playDoor(){ this.play(this.SFX.doorCrash, { volume: 0.5 }); },
  playUISelect(){ this.play(this.SFX.uiSelect, { volume: 0.4 }); },
  playUISuccess(){ this.play(this.SFX.uiSuccess, { volume: 0.5 }); },
  playUIError(){ this.play(this.SFX.uiError, { volume: 0.5 }); },
  playBreak(){ this.play(this.SFX.break, { volume: 0.5 }); },
  playBoom(){ this.play(this.SFX.boom, { volume: 0.7 }); },

  // ═══════════════════════════════════════════════
  // 6. الموسيقى
  // ═══════════════════════════════════════════════
  playMusic(key, options = {}){
    if(!this.scene || !this.scene.sound) return null;

    // لو نفس الموسيقى شغالة، ما نعيد
    if(this.currentMusicKey === key && this.currentMusic && this.currentMusic.isPlaying){
      return this.currentMusic;
    }

    // وقف القديمة
    this.stopMusic();

    // شغل الجديدة
    try {
      this.currentMusic = this.scene.sound.add(key, {
        volume: options.volume !== undefined ? options.volume : this.musicVolume,
        loop: options.loop !== undefined ? options.loop : true,
        rate: options.rate || 1
      });
      this.currentMusicKey = key;
      this.currentMusic.play();

      // تلاشي دخول (Fade in)
      if(options.fadeIn){
        this.currentMusic.setVolume(0);
        this._fadeTo(this.currentMusic, this.musicVolume, options.fadeIn);
      }

      return this.currentMusic;
    } catch(e) {
      console.warn('Music error: ' + key, e);
      return null;
    }
  },

  stopMusic(fadeOutMs = 0){
    if(!this.currentMusic) return;
    if(fadeOutMs > 0){
      this._fadeTo(this.currentMusic, 0, fadeOutMs, () => {
        if(this.currentMusic){
          this.currentMusic.stop();
          this.currentMusic.destroy();
          this.currentMusic = null;
          this.currentMusicKey = null;
        }
      });
    } else {
      try {
        this.currentMusic.stop();
        this.currentMusic.destroy();
      } catch(e) {}
      this.currentMusic = null;
      this.currentMusicKey = null;
    }
  },

  // ═══════════════════════════════════════════════
  // 7. تغيير الموسيقى حسب القسم
  // ═══════════════════════════════════════════════
  playMusicForSection(sectionId){
    const key = this.MUSIC[sectionId] || this.MUSIC.crypt;
    this.playMusic(key, { fadeIn: 1000 });
  },

  playBossMusic(){
    this.playMusic(this.MUSIC.boss, { fadeIn: 500 });
  },

  playTitleMusic(){
    this.playMusic(this.MUSIC.title, { loop: true, fadeIn: 800 });
  },

  // ═══════════════════════════════════════════════
  // 8. تلاشي
  // ═══════════════════════════════════════════════
  _fadeTo(sound, targetVol, durationMs, onComplete){
    if(!sound || !this.scene) return;
    if(this._musicFade){
      this._musicFade.remove();
      this._musicFade = null;
    }

    const startVol = sound.volume;
    const tween = this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: durationMs,
      onUpdate: (tween) => {
        const val = tween.getValue();
        const v = startVol + (targetVol - startVol) * val;
        try { sound.setVolume(v); } catch(e) {}
      },
      onComplete: () => {
        this._musicFade = null;
        if(onComplete) onComplete();
      }
    });
    this._musicFade = tween;
  },

  // ═══════════════════════════════════════════════
  // 9. التحكم بالمستويات
  // ═══════════════════════════════════════════════
  setMasterVolume(v){
    this.masterVolume = Math.max(0, Math.min(1, v));
    if(this.scene && this.scene.sound){
      this.scene.sound.volume = this.masterVolume;
    }
  },

  setMusicVolume(v){
    this.musicVolume = Math.max(0, Math.min(1, v));
    if(this.currentMusic){
      try { this.currentMusic.setVolume(this.musicVolume); } catch(e) {}
    }
  },

  setSfxVolume(v){
    this.sfxVolume = Math.max(0, Math.min(1, v));
  },

  getMasterVolume(){ return this.masterVolume; },
  getMusicVolume(){ return this.musicVolume; },
  getSfxVolume(){ return this.sfxVolume; },

  // ═══════════════════════════════════════════════
  // 10. الكتم
  // ═══════════════════════════════════════════════
  mute(){
    this.muted = true;
    if(this.scene && this.scene.sound) this.scene.sound.mute = true;
  },

  unmute(){
    this.muted = false;
    if(this.scene && this.scene.sound) this.scene.sound.mute = false;
  },

  toggleMute(){
    if(this.muted) this.unmute();
    else this.mute();
    return this.muted;
  },

  isMuted(){ return this.muted; },

  // ═══════════════════════════════════════════════
  // 11. إيقاف كل الأصوات
  // ═══════════════════════════════════════════════
  stopAll(){
    if(!this.scene || !this.scene.sound) return;
    try {
      this.scene.sound.stopAll();
      this.currentMusic = null;
      this.currentMusicKey = null;
    } catch(e) {}
  },

  // ═══════════════════════════════════════════════
  // 12. قائمة الأصوات (للتشخيص)
  // ═══════════════════════════════════════════════
  listLoaded(){
    if(!this.scene || !this.scene.sound) return [];
    try {
      return this.scene.sound.sounds.map(s => s.key);
    } catch(e) { return []; }
  }
};
