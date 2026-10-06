var Story=(function(){
'use strict';
var CHAPTERS={intro:'الفصل الأول · السقوط',crypt:'الفصل الثاني · المقبرة',fire:'الفصل الثالث · اللهب',frozen:'الفصل الرابع · الصقيع',shadow:'الفصل الخامس · المرآة',reveal:'الفصل السادس · الحقيقة',umbra:'الفصل الأخير · الأومبرا',ending:'النهاية · الفجر الجديد'};
var SCENES={
intro:["في زمنٍ سحيق، قبل أن تُولد النجوم...","كانت مملكة «أثيل» تُشرق بنورٍ لا ينطفئ.","كان اسمه «القلب الأول».","نورٌ يمنح الحياة. أبديةٌ بلا ثمن.","كان لك أخٌ اسمه «كايان».","أكبر منك بعشر سنوات. حارس النور الأول.","كان يقول لك كل ليلة:","«يا ظلّي، سأحميك حتى نهاية الزمان».","وفي ليلة اكتمال القمر الأسود...","تسلل كايان إلى قلب الشعلة وحيداً.","أراد أن يسرق قطرة نورٍ واحدة...","...ليُطيل عمرك.","لكن القلب لا يُسرق.","احترقت يداه.","امتد الحريق إلى قلبه.","صرخ. صرخةً سمعتها المملكة كلها.","تحوّل. لم يعد أخوك.","صار «سيّد الظل».","مزّق النور إلى أربع قطع.","حبسها في أربعة عوالم مظلمة.","لكن... قبل أن يتحول بالكامل...","خبّأ قطعةً خامسة. في قلبك.","همس: «إن لم أعد... أنت ستُكمل الطريق».","أنت الآن «ظل السيف».","آخر نورٍ في أثيل.","أنقذ أخاك... أو أنقذ العالم."],
crypt_intro:["دخلت إلى «مقبرة الملوك التسعة».","الهواء ثقيل. الظلام يزحف.","فجأة... العظام تتحرك.","الهيكل الذي يحرس البوابة يستيقظ.","«من يعبر أرضي... يعبر جسدي أولاً!»","«أنا سليل الملوك التسعة. الحاجز الأخير».","«أرِني إن كنت تستحق المفتاح الأول»."],
crypt_clear:["سقط الهيكل.","من بين عظامه، ارتفع «مفتاح النسيان».","قطعة من النور دخلت صدرك.","لكن... سمعت همسة.","همسة كايان.","«ظلّي... أنا أنتظرك»."],
fire_intro:["وصلت إلى «البحر المحترق».","لهيبٌ لا ينطفئ. رمادٌ لا يتحرك.","شيطان اللهب يخرج من الحمم.","«كايان أحرقني ذات يوم... لأصير حارسه».","«أنا لست عدوّك، فارس الظل».","«لكنني مُقيّد. وإن لم تقتلني... لن تعبر».","«افعل ما يجب. أنهِ عذابي»."],
fire_clear:["تنفّس الشيطان أنفاسه الأخيرة.","«شكراً... أخيراً... حُررت».","ارتفع «مفتاح اللهب».","مفتاحان من أربعة.","أنت تقترب.","لكن قلبك يثقل.","أتعرف هذا الشعور؟","شعور من يفقد نفسه... قطعةً قطعة."],
frozen_intro:["الثلج لا يعرف الرحمة.","«الملكة الجليدية» تنتظر على عرشها الأبدي.","نظرت إليك بعينين فارغتين.","«كايان جمّد قلبي. لا أستطيع البكاء».","«دموعي صارت جليداً منذ قرون».","«لماذا؟ لماذا تركه يذهب هكذا؟»","«أنت... أنت أخوه. أنت السبب».","«لن أدعك تعبر!»"],
frozen_clear:["ذابت الملكة.","دمعة واحدة سالت... لأول مرة منذ قرون.","ارتفع «مفتاح الصقيع».","ثلاثة من أربعة.","الجليد في قلبك يذوب.","لكنك تسأل نفسك:","هل تصير مثل أخيك؟","أم أنك بالفعل كذلك؟"],
shadow_intro:["الظل يعرف اسمك.","الظل يعرف قلبك.","وصلت إلى «قاعة المرايا».","رأيت نفسك في كل مرآة.","لكنك لم تكن أنت.","كان كايان.","«أخي».","«لماذا جئت؟»","«ألم يكفيك ما فعلته؟»","«لا... لا تقترب».","«إن اقتربت أكثر... سأفقد السيطرة».","«القلب... إنه يسيطر عليّ».","«اقتلني. اقتلني الآن!»"],
shadow_clear:["سقط.","لكن الجسم لم يتوقف.","ارتفع من جديد.","الأسود يزحف من عينيه.","صوته يتغير.","لم يعد صوته.","صار صوتاً آخر. أعمق. أقدم. أشرس.","«أخيراً... تحررت».","«شكراً لك، يا ظلّي الصغير».","«الآن... أنا حُر»."],
reveal:["القلب المظلم خرج من صدر كايان.","إنه ليس قلباً.","إنه كائن.","إنه «الأومبرا».","«كايان كان مجرد وعاء».","«منذ آلاف السنين، كنت أبحث عن جسدٍ».","«جسد يحمل نوراً. جسد يحمل أخاً».","«ووجدتك».","«الآن... أنا حُر».","«أثيل ستسقط».","«العوالم الأربعة... ستصبح عالمي».","«وأنت... ظلّ السيف...»","«أنت مجرد ذكرى».","«استعد للمحو»."],
umbra_intro:["الأومبرا يتمدد.","السماء تصير سوداء.","العوالم الأربعة تهتز.","«أنا ما قبل الزمان».","«أنا ما بعد الفناء».","«وأنا... نهايتك»."],
umbra_clear:["سقط.","سقط الأومبرا.","لكن كايان... لم يعد.","جسده تعفّن.","روحه تحررت.","رأيته. في برهة.","في لَمْحَة.","«أخي».","«لقد... نجحت».","«أنا فخور»."],
ending:["النور عاد إلى أثيل.","لكنه مختلف.","فيه ظلٌ خفيف.","ظلٌ من أخيك.","ظلٌ منك.","العالم لن يعود كما كان.","لن تعود كما كنت.","لكنك ما زلت واقفاً.","والأفق... يلمع.","«النهاية... أو البداية؟»"],
gameover:["سقط ظل السيف...","لكن النبوءة لم تنتهِ بعد.","انهض.","عُد."]
};
var active=false,queue=[],index=0,onDone=null,autoTimer=null,CHAR_DELAY=3500;
function $(id){return document.getElementById(id);}
function setChapter(n){var el=$('storyChapter');if(el&&n)el.textContent=n;}
function showScreen(){var s=$('storyScreen');if(s)s.classList.add('active');active=true;}
function hideScreen(){var s=$('storyScreen');if(s)s.classList.remove('active');active=false;}
function renderLine(text){var el=$('storyText');if(!el)return;el.classList.remove('visible');el.style.transition='none';el.textContent=text;setTimeout(function(){el.style.transition='';el.classList.add('visible');},80);}
function nextLine(){if(autoTimer){clearTimeout(autoTimer);autoTimer=null;}index++;if(index>=queue.length){finish();return;}renderLine(queue[index]);autoTimer=setTimeout(nextLine,CHAR_DELAY);}
function finish(){hideScreen();var cb=onDone;onDone=null;active=false;if(cb)setTimeout(cb,500);}
function play(sceneName,callback,chapterName){
var lines=SCENES[sceneName];if(!lines||lines.length===0){if(callback)callback();return;}
setChapter(chapterName||'');queue=lines.slice();index=0;onDone=callback;showScreen();
renderLine(queue[0]);autoTimer=setTimeout(nextLine,CHAR_DELAY);
try{if(window.Sound&&Sound.portal)Sound.portal();}catch(e){}}
function skip(){if(!active)return;if(autoTimer){clearTimeout(autoTimer);autoTimer=null;}finish();}
function init(){
var nextBtn=$('storyNext'),skipBtn=$('storySkip'),screen=$('storyScreen');
if(nextBtn)nextBtn.addEventListener('click',function(e){e.preventDefault();nextLine();});
if(skipBtn)skipBtn.addEventListener('click',function(e){e.preventDefault();skip();});
if(screen)screen.addEventListener('click',function(e){if(e.target===screen||e.target.classList.contains('story-content')||e.target.classList.contains('story-vignette')||e.target.classList.contains('story-scanlines'))nextLine();});
document.addEventListener('keydown',function(e){if(!active)return;if(e.key===' '||e.key==='Enter'){e.preventDefault();nextLine();}if(e.key==='Escape'){e.preventDefault();skip();}});}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
return{play:play,skip:skip,isActive:function(){return active;},chapters:CHAPTERS};
})();
