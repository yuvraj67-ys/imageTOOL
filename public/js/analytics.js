/* ═══════════════════════════════════════════════════════════
   Simple Analytics — localStorage-based usage tracking
   ═══════════════════════════════════════════════════════════ */

const Analytics = {

  /** Record a page view */
  trackPageView(page) {
    const key = 'ait_pageviews';
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    const today = new Date().toISOString().split('T')[0];
    if (!data[today]) data[today] = {};
    data[today][page] = (data[today][page] || 0) + 1;
    localStorage.setItem(key, JSON.stringify(data));
  },

  /** Record a tool usage event */
  trackEvent(eventName, details = {}) {
    const key = 'ait_events';
    const events = JSON.parse(localStorage.getItem(key) || '[]');
    events.push({
      event: eventName,
      details,
      time: Date.now(),
    });
    // Keep last 500 events max
    if (events.length > 500) events.splice(0, events.length - 500);
    localStorage.setItem(key, JSON.stringify(events));
  },

  /** Get summary stats */
  getSummary() {
    const usage = JSON.parse(localStorage.getItem('ait_usage') || '{}');
    const total = usage._total || 0;
    const tools = { ...usage };
    delete tools._total;
    return { totalProcessed: total, byTool: tools };
  },
};

// Auto-track page view on load
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  Analytics.trackPageView(page);
});
