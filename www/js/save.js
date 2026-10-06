/* ============================================
   Shadow Blade - Save System
   ============================================ */
var Save=(function(){
var KEY='shadow_blade_save_v3';
var SETTINGS_KEY='shadow_blade_settings_v3';

var defaultData={
gold:0,
weaponLevel:1,
armorLevel:1,
zonesCleared:[false,false,false,false],
bossesDefeated:[false,false,false,false],
totalKills:0,
playerX:60,
playerY:100,
currentZone:0,
playerHP:100,
playtime:0,
lastSaved:0
};

var defaultSettings={
master:50,
sfx:70,
vibration:true,
particles:true,
blood:true
};

function load(){
try{
var raw=localStorage.getItem(KEY);
if(!raw)return JSON.parse(JSON.stringify(defaultData));
var d=JSON.parse(raw);
for(var k in defaultData){
if(d[k]===undefined)d[k]=defaultData[k];
}
return d;
}catch(e){return JSON.parse(JSON.stringify(defaultData));}
}

function save(data){
try{
data.lastSaved=Date.now();
localStorage.setItem(KEY,JSON.stringify(data));
return true;
}catch(e){return false;}
}

function reset(){
try{localStorage.removeItem(KEY);}catch(e){}
}

function hasSave(){
try{return git pushlocalStorage.getItem(KEY);}catch(e){return false;}
}

function loadSettings(){
try{
var raw=localStorage.getItem(SETTINGS_KEY);
if(!raw)return JSON.parse(JSON.stringify(defaultSettings));
var s=JSON.parse(raw);
for(var k in defaultSettings){
if(s[k]===undefined)s[k]=defaultSettings[k];
}
return s;
}catch(e){return JSON.parse(JSON.stringify(defaultSettings));}
}

function saveSettings(s){
try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));return true;}
catch(e){return false;}
}

return{
load:load,save:save,reset:reset,hasSave:hasSave,
loadSettings:loadSettings,saveSettings:saveSettings,
get defaultData(){return JSON.parse(JSON.stringify(defaultData));},
get defaultSettings(){return JSON.parse(JSON.stringify(defaultSettings));}
};
})();
