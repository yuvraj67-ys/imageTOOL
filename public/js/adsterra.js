/* ═══════════════════════════════════════════════════════════
   ImgAURA — Ad Manager (V2)
   Implemented cleanly to preserve User Experience while maximizing earnings.
   ═══════════════════════════════════════════════════════════ */

const AdManager = {
  // Global scripts (Social bar / Popunder alternatives)
  injectGlobalScripts() {
    // ❌ REMOVED: These scripts were causing aggressive pop-unders and invisible overlays 
    // that hijack user clicks. Removing them to dramatically improve user experience.
    const scripts = [];

    scripts.forEach(src => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      document.body.appendChild(s);
    });
  },

  // Responsive Banner (320x50 on mobile, 728x90 on desktop)
  injectResponsiveBanner(containerId = 'ad-banner-bottom') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const key = isMobile ? 'da5fdff00b42ecfbe23687b94a23e909' : 'f344d67710f33a71c4c46c61a29bda04';
    const width = isMobile ? 320 : 728;
    const height = isMobile ? 50 : 90;

    const atOptions = { key, format: 'iframe', height, width, params: {} };
    
    const optScript = document.createElement('script');
    optScript.type = 'text/javascript';
    optScript.innerHTML = `atOptions = ${JSON.stringify(atOptions)};`;
    container.appendChild(optScript);

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `https://www.highperformanceformat.com/${key}/invoke.js`;
    container.appendChild(invokeScript);
  },

  // Native Widget
  injectNativeAd(containerId = 'ad-native-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const invokeScript = document.createElement('script');
    invokeScript.async = true;
    invokeScript.dataset.cfasync = "false";
    invokeScript.src = "https://pl28909645.effectivegatecpm.com/93473ff7b9d6e0da14ef534d15b31530/invoke.js";
    container.appendChild(invokeScript);

    const div = document.createElement('div');
    div.id = "container-93473ff7b9d6e0da14ef534d15b31530";
    container.appendChild(div);
  },

  init() {
    this.injectGlobalScripts();
    this.injectResponsiveBanner('ad-banner-bottom');
    this.injectNativeAd('ad-native-container');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AdManager.init();
});
