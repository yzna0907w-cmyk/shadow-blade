// EMBER — Error Handler
window.onerror = function(msg, url, line, col, err){
  var el = document.getElementById('_errOverlay');
  if(!el){
    el = document.createElement('div');
    el.id = '_errOverlay';
    el.style.cssText = 'position:fixed;top:0;left:0;right:0;background:rgba(180,0,0,0.95);color:#fff;font:11px monospace;padding:8px;z-index:99999;max-height:40vh;overflow:auto;white-space:pre-wrap;word-break:break-all;';
    document.body.appendChild(el);
  }
  el.textContent += '❌ ' + msg + '\n   ' + (url||'').split('/').pop() + ':' + line + ':' + col + '\n\n';
  console.error(msg, err);
};
window.addEventListener('unhandledrejection', function(e){
  window.onerror('Promise: ' + e.reason, '', 0, 0, e.reason);
});
console.log('✅ Error handler loaded');
