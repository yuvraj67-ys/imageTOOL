/* ═══════════════════════════════════════════════════════════
   ImgAURA — Ad Manager (Adsterra)
   When keys are configured, ads load automatically.
   When keys start with YOUR_, nothing is rendered.
   ═══════════════════════════════════════════════════════════ */

const AdsterraManager = {
  config: {
    bannerTop: { key: 'YOUR_BANNER_TOP_KEY', width: 728, height: 90, mobileWidth: 320, mobileHeight: 50 },
    bannerSidebar: { key: 'YOUR_BANNER_SIDEBAR_KEY', width: 300, height: 250 },
    bannerBottom: { key: 'YOUR_BANNER_BOTTOM_KEY', width: 728, height: 90, mobileWidth: 320, mobileHeight: 50 },
    nativeAd: { key: 'YOUR_NATIVE_AD_KEY' },
    popunder: { key: 'YOUR_POPUNDER_KEY', domain: 'YOUR_POPUNDER_DOMAIN' },
  },

  _injectBanner(containerId, key, width, height) {
    const container = document.getElementById(containerId);
    if (!container || key.startsWith('YOUR_')) return;
    const atOptions = { key, format: 'iframe', height, width, params: {} };
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `atOptions = ${JSON.stringify(atOptions)};`;
    container.appendChild(script);
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `//www.highperformanceformat.com/${key}/invoke.js`;
    invokeScript.async = true;
    container.appendChild(invokeScript);
  },

  loadBannerTop(containerId = 'ad-top') {
    const isMobile = window.innerWidth < 768;
    const cfg = this.config.bannerTop;
    this._injectBanner(containerId, cfg.key, isMobile ? cfg.mobileWidth : cfg.width, isMobile ? cfg.mobileHeight : cfg.height);
  },

  loadBannerSidebar(containerId = 'ad-sidebar') {
    const cfg = this.config.bannerSidebar;
    this._injectBanner(containerId, cfg.key, cfg.width, cfg.height);
  },

  loadBannerBottom(containerId = 'ad-bottom') {
    const isMobile = window.innerWidth < 768;
    const cfg = this.config.bannerBottom;
    this._injectBanner(containerId, cfg.key, isMobile ? cfg.mobileWidth : cfg.width, isMobile ? cfg.mobileHeight : cfg.height);
  },

  loadNativeAd(containerId = 'ad-native') {
    const container = document.getElementById(containerId);
    if (!container || this.config.nativeAd.key.startsWith('YOUR_')) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = `//nativeroll.elitevideo.click/${this.config.nativeAd.key}/invoke.js`;
    container.appendChild(script);
  },

  initPopunder() {
    const key = this.config.popunder.key;
    if (key.startsWith('YOUR_') || sessionStorage.getItem('pop_fired')) return;
    document.addEventListener('click', (e) => {
      if (e.target.closest('input[type="file"]')) return;
      if (!sessionStorage.getItem('pop_fired')) {
        sessionStorage.setItem('pop_fired', '1');
        const s = document.createElement('script');
        s.src = `//${this.config.popunder.domain}/invoke.js?key=${key}&t=popunder`;
        s.async = true;
        document.head.appendChild(s);
      }
    }, { once: true });
  },

  initAll(pageType = 'home') {
    this.initPopunder();
    this.loadBannerTop('ad-top');
    if (pageType === 'tool') {
      this.loadBannerSidebar('ad-sidebar');
      this.loadNativeAd('ad-native');
    }
    this.loadBannerBottom('ad-bottom');
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const pageType = document.body.dataset.pageType || 'home';
  AdsterraManager.initAll(pageType);
});
