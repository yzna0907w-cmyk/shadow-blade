var Story=(function(){
'use strict';
var CHAPTERS={
intro:'البداية',
ashes:'الرماد',
rust:'الصدأ',
frost:'الصقيع',
void:'الفراغ',
father:'الأب',
ending:'الفجر'
};

var SCENES={
intro:[
"قبل عشر سنوات، رحل أبي.",
"قال إنه ذاهب ليُعيد الشمس.",
"قال: «انتظرني، سأرجع قبل أن تكبر».",
"كبرت.",
"لم يرجع.",
"اليوم، أحمل فانوسه.",
"وأسير في نفس الطريق.",
"أربعة عوالم.",
"أربعة حراس.",
"وأب... في النهاية."
],
ashes_intro:[
"الرماد.",
"هنا كانت أول مدينة.",
"لا شيء الآن.",
"فقط عظام، ورماد، وصمت.",
"وفجأة...",
"شيء يتحرك.",
"هيكل يرتدي تاجاً.",
"«من أنت؟»",
"«لن أعبر»."
],
ashes_clear:[
"توقف الملك.",
"قبل أن يسقط قال:",
"«ابني رحل قبلك».",
"«مثلك تماماً».",
"«لم يعد».",
"«إن ذهبت، ستلقى نفس النهاية».",
"لكنني أكملت."
],
rust_intro:[
"الصدأ.",
"مصانع لا تتوقف.",
"حديد يئن.",
"وعلى الحديد...",
"شيطان من نار.",
"«أنا حاولت أن أُشعل الشمس».",
"«احترقت».",
"«لن أدعك تمر»."
],
rust_clear:[
"سقط المحترق.",
"همس قبل أن ينطفئ:",
"«شكراً».",
"«لقد تعبت من الاحتراق».",
"تقدمت."
],
frost_intro:[
"الصقيع.",
"كاتدرائية من جليد.",
"امرأة على عرش.",
"عينان باردتان.",
"«أطفأتُ ابني بالجليد».",
"«أنقذته من الظلام».",
"«لكنه لم يستيقظ».",
"«أنا... لم أقصد»."
],
frost_clear:[
"ذابت.",
"بكت دمعة واحدة.",
"«اذهب».",
"«إلى أبيك».",
"«في أعلى البرج».",
"«وأخبره... أنني آسفة».",
"فتح الباب."
],
void_intro:[
"الفراغ.",
"لا ريح. لا ضوء. لا صوت.",
"فقط سواد يزحف.",
"وصوت.",
"صوت أبي.",
"«أنا لم أستطع».",
"«حاولت. لكن الظلام أقوى».",
"«اذهب».",
"«النجاة ليست لك»."
],
void_clear:[
"سقط الحارس الأخير.",
"لكنه لم يكن أبي.",
"كان شيئاً آخر.",
"كان الظلام نفسه.",
"فانوس أبي...",
"على العرش.",
"مكسور."
],
father_intro:[
"رفعتُ الفانوس.",
"وجدتُ رسالة داخله.",
"خط أبي:",
"«إلى ابني، إذا وصلت هنا...»",
"«أنا لم أفشل في إشعال الشمس».",
"«فشلت في الرجوع إليك».",
"«الظلام أخذني، لكنه لن يأخذك».",
"«خذ الشعلة من قلبي».",
"«وأكمل»."
],
father_clear:[
"دخلتُ إلى قلب الظلام.",
"رأيتُ أبي.",
"نائماً على أرض من رماد.",
"يبتسم في نومه.",
"«أبي»",
"فتح عينيه.",
"«يا ولدي...»"
],
ending:[
"لم نُشعل الشمس.",
"لم نُصلح العالم.",
"لكننا... رجعنا معاً.",
"إلى مملكة ميتة.",
"على قمة جبل.",
"بفانوس صغير.",
"يُضيء... ليالينا.",
"ليس كل نور شمس.",
"أحياناً... يكفي فانوس صغير.",
"— النهاية —"
]
};

var active=false,queue=[],index=0,onDone=null,timer=null,DELAY=3800;
function $(id){return document.getElementById(id);}
function showScreen(){var s=$('storyScreen');if(s)s.classList.add('active');active=true;}
function hideScreen(){var s=$('storyScreen');if(s)s.classList.remove('active');active=false;}
function setChapter(n){var el=$('storyChapter');if(el&&n)el.textContent=n;}
function renderLine(text){
  var el=$('storyText');if(!el)return;
  el.classList.remove('visible');
  el.style.transition='none';
  el.textContent=text;
  setTimeout(function(){el.style.transition='';el.classList.add('visible');},80);
}
function nextLine(){
  if(timer){clearTimeout(timer);timer=null;}
  index++;
  if(index>=queue.length){finish();return;}
  renderLine(queue[index]);
  timer=setTimeout(nextLine,DELAY);
}
function finish(){
  hideScreen();
  var cb=onDone;onDone=null;active=false;
  if(cb)setTimeout(cb,500);
}
function play(sceneName,callback,chapterName){
  var lines=SCENES[sceneName];
  if(!lines||lines.length===0){if(callback)callback();return;}
  setChapter(chapterName||'');
  queue=lines.slice();
  index=0;
  onDone=callback;
  showScreen();
  renderLine(queue[0]);
  timer=setTimeout(nextLine,DELAY);
}
function skip(){if(!active)return;if(timer){clearTimeout(timer);timer=null;}finish();}
function init(){
  var nextBtn=$('storyNext'),skipBtn=$('storySkip'),screen=$('storyScreen');
  if(nextBtn)nextBtn.addEventListener('click',function(e){e.preventDefault();nextLine();});
  if(skipBtn)skipBtn.addEventListener('click',function(e){e.preventDefault();skip();});
  if(screen)screen.addEventListener('click',function(e){
    if(e.target===screen||e.target.classList.contains('story-content')||e.target.classList.contains('story-vignette')||e.target.classList.contains('story-scanlines'))nextLine();
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
return{play:play,skip:skip,isActive:function(){return active;},chapters:CHAPTERS};
})();
