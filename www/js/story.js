var Story=(function(){
'use strict';
var CHAPTERS={
intro:'الفصل الأول · الفانوس',
ashes:'الفصل الثاني · الرماد',
rust:'الفصل الثالث · الصدأ',
frost:'الفصل الرابع · الصقيع',
void:'الفصل الخامس · الفراغ',
father:'الفصل السادس · الأب',
ending:'النهاية'
};

var SCENES={
intro:[
"قبل أن يموت العالم، كانت الشمس تُشرق كل صباح.",
"كانت جدّتك تقول: «كل فانوس يحمل قطرة من الشمس».",
"لكن الشمس ماتت منذ ثلاثمئة سنة.",
"كل الفوانيس انطفأت.",
"إلا فانوسك.",
"أنتِ «جمرة». آخر من يحمل شرارة.",
"عليكِ أن تعبري أربعة عوالم ميتة.",
"وأن تصلي إلى برج الشمس.",
"وتُشعليها من جديد.",
"لكن...",
"كل عالم يحرسه كائن.",
"كان يوماً إنساناً.",
"حاول أن يُشعل الشمس بنفسه.",
"فاحترق.",
"ولم يعد إنساناً."
],
ashes_intro:[
"العالم الأول: الرماد.",
"هنا ماتت أول مدينة.",
"لا ريح. لا صوت. لا لون.",
"فقط رماد.",
"وفجأة...",
"شيء يتحرك في الرماد.",
"عينان بنفسجيتان تفتحان.",
"«لماذا... جئتِ؟»",
"«الجميع مات. ارحلي»."
],
ashes_clear:[
"سقط الحارس.",
"من بين الرماد...",
"خرجت شرارة صغيرة.",
"دخلت الفانوس.",
"الجمرة كبرت قليلاً.",
"لكن قلبك... ثقل أكثر."
],
rust_intro:[
"العالم الثاني: الصدأ.",
"هنا كانت المصانع.",
"الآن كلها حديد يئنّ.",
"صوت طرقات ثقيلة.",
"«أنا بنيتُ كل شيء هنا».",
"«بنيتُ الجنة. ثم... انهارت».",
"«إن كنتِ تبحثين عن الشمس...»",
"«فابحثي عني!»"
],
rust_clear:[
"توقف الحارس.",
"رأيتَ فيه... وجه إنسان.",
"كان يبتسم.",
"«شكراً... لقد نسيتُ كيف أتوقف».",
"شرارة ثانية دخلت الفانوس.",
"الجمرة تكبر.",
"وأنتِ تصغر."
],
frost_intro:[
"العالم الثالث: الصقيع.",
"هنا تجمّد الوقت نفسه.",
"ثلج لا يسقط. صمت لا ينكسر.",
"امرأة جالسة على عرش جليدي.",
"«أنا لم أُرد أن يتجمد العالم».",
"«أردتُ فقط أن يبقى ابني دافئاً».",
"«لكنني... جمّدتُ كل شيء».",
"«حتى قلبي»."
],
frost_clear:[
"ذابت الجليدية.",
"كانت تبتسم.",
"«اذهبي... ابنتي... إلى الأب».",
"«هو من أطفأ الشمس».",
"الجمرة الآن نصف مشتعلة.",
"الطريق إلى البرج... يظهر."
],
void_intro:[
"العالم الرابع: الفراغ.",
"هنا لا شيء.",
"لا رماد. لا صدأ. لا صقيع.",
"فقط سواد.",
"«أنا آخر من رأى الشمس».",
"«أنا من أطفأها».",
"«سألتُ الشمس: لماذا لا تمنحينني قوتك؟»",
"«فقالت: القوة ليست ملكي لأمنحها».",
"«فأطفأتها»."
],
void_clear:[
"سقط الحارس الأخير.",
"الفراغ ينهار.",
"البرج أمامك.",
"آخر درج.",
"وأعلى البرج...",
"رجل عجوز يجلس.",
"يحمل فانوساً... مثلك."
],
father_intro:[
"«أبي...؟»",
"استدار.",
"عيناه شمسان مطفأتان.",
"«لقد انتظرتك».",
"«ثلاثمئة سنة».",
"«كل ليلة، كنت أتساءل: هل ستأتين؟»",
"«قلت لنفسي: إذا أتت...»",
"«سأُشعل الشمس بها».",
"«سأحرقها، كما احترقتُ».",
"«لأن القوة... تحتاج تضحية»."
],
father_clear:[
"سقط.",
"لكن...",
"لم يسقط كعدو.",
"سقط كأب.",
"«جمرة...»",
"«لم أكن أريد أن أحرقك».",
"«كنت أريد فقط... أن أرى الشمس مرة أخرى».",
"«خُذي الشرارة من فانوسي».",
"«وأشعليها».",
"ثم... انطفأ."
],
ending:[
"أشعلتِ الشمس.",
"عاد النور إلى العالم.",
"لكنّك لم تعودي.",
"ذابت جمرتك في النور.",
"أصبحتِ جزءاً من الشمس.",
"وكل مرة تُشرق الشمس...",
"يتذكر الناس فتاة.",
"كانت تحمل فانوساً.",
"ولم تخف من الظلام.",
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
