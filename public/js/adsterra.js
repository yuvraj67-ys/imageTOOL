/* ═══════════════════════════════════════════════════════════
   ImgAURA — Ad Manager (V3)
   Clean banners only. No pop-ups, no overlays, no click hijacking.
   ═══════════════════════════════════════════════════════════ */

const AdManager = {
  // Responsive Banner (320x50 on mobile, 728x90 on desktop)
  // Clean, non-intrusive — sits at the bottom of the page
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

  init() {
    // Only clean banner ads — no pop-ups, no native widgets, no overlays
    this.injectResponsiveBanner('ad-banner-bottom');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AdManager.init();
});
