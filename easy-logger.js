// Minimal, zero-dependency client logger
(function(){
  function gaEvent(name, params){
    try{ if (typeof gtag === 'function') { gtag('event', name, params||{}); } }catch(_){ }
  }

  async function emailAlert(payload){
    try{
      if (!window.FORMSPREE_ALERTS) return;
      const endpoint = window.FORMSPREE_ENDPOINT || 'https://formspree.io/f/xovlrjpp';
      const body = {
        subject: payload.subject || 'ClinicIT AI Chat Alert',
        message: String(payload.message||'').slice(0, 500),
        preview: String(payload.preview||'').slice(0, 300),
        page: payload.page || (typeof location !== 'undefined' ? location.href : ''),
        ua: (typeof navigator !== 'undefined' ? navigator.userAgent.slice(0,120) : '')
      };
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body),
        mode: 'cors'
      }).catch(()=>{});
    }catch(_){ }
  }

  window.EASY_LOGGER = { gaEvent, emailAlert };
})();

