/* ═══════════════════════════════════════════════════════════
   ImgAURA — Ad Manager (V3)
   Clean ads only: Native Banner + Smartlink + Bottom Banner.
   No pop-ups, no overlays, no click hijacking.
   ═══════════════════════════════════════════════════════════ */

const AdManager = {
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

  // Native Banner Ad
  injectNativeBanner(containerId = 'ad-native-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const invokeScript = document.createElement('script');
    invokeScript.async = true;
    invokeScript.dataset.cfasync = 'false';
    invokeScript.src = 'https://pl28909645.effectivegatecpm.com/93473ff7b9d6e0da14ef534d15b31530/invoke.js';
    container.appendChild(invokeScript);

    const div = document.createElement('div');
    div.id = 'container-93473ff7b9d6e0da14ef534d15b31530';
    container.appendChild(div);
  },

  // Smartlink — add sponsored links to tool pages
  injectSmartlinks() {
    const links = document.querySelectorAll('.smartlink-ad');
    links.forEach(link => {
      link.href = 'https://www.effectivegatecpm.com/szqdx4yn?key=c8d3c63b22aca39c625ad99bbf99d20e';
      link.target = '_blank';
      link.rel = 'noopener sponsored';
    });
  },

  init() {
    this.injectResponsiveBanner('ad-banner-bottom');
    this.injectNativeBanner('ad-native-container');
    this.injectSmartlinks();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AdManager.init();
});
