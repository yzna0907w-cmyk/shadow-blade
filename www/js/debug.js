window._dbg = 'loading...';
setInterval(function(){
  var el = document.getElementById('_dbgPanel');
  if(!el){
    el = document.createElement('div');
    el.id = '_dbgPanel';
    el.style.cssText = 'position:fixed;top:100px;left:10px;background:rgba(0,0,0,0.75);color:#0f0;font:10px monospace;padding:4px 8px;z-index:99998;border-radius:4px;pointer-events:none;';
    document.body.appendChild(el);
  }
  el.textContent = window._dbg;
}, 200);
