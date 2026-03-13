/* ═══════════════════════════════════════════════════════════
   AI Image Tools — Shared Utility Functions
   ═══════════════════════════════════════════════════════════ */

/**
 * Format bytes to human-readable file size
 * @param {number} bytes
 * @returns {string} e.g. "1.2 MB"
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Trigger PNG download from a canvas element
 * @param {HTMLCanvasElement} canvas
 * @param {string} filename
 */
function downloadCanvas(canvas, filename = 'image.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Trigger file download from a Blob
 * @param {Blob} blob
 * @param {string} filename
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/**
 * Read a file as Data URL (base64)
 * @param {File} file
 * @returns {Promise<string>}
 */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Read a file as ArrayBuffer
 * @param {File} file
 * @returns {Promise<ArrayBuffer>}
 */
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Show a floating toast notification
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
    if (container.children.length === 0) container.remove();
  }, 3000);
}

/**
 * Copy text to clipboard with toast feedback
 * @param {string} text
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
  } catch {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    showToast('Copied to clipboard!', 'success');
  }
}

/**
 * Standard debounce function
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Get image dimensions from a file
 * @param {File} file
 * @returns {Promise<{width: number, height: number}>}
 */
function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Convert a canvas to Blob
 * @param {HTMLCanvasElement} canvas
 * @param {string} type - e.g. 'image/png'
 * @param {number} quality - 0 to 1
 * @returns {Promise<Blob>}
 */
function canvasToBlob(canvas, type = 'image/png', quality = 0.92) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

/**
 * Format dimensions string
 * @param {number} w
 * @param {number} h
 * @returns {string} e.g. "1920 × 1080"
 */
function formatDimensions(w, h) {
  return `${w} × ${h}`;
}

/**
 * Track tool usage in localStorage
 * @param {string} toolName
 */
function trackToolUsage(toolName) {
  const key = 'ait_usage';
  const data = JSON.parse(localStorage.getItem(key) || '{}');
  data[toolName] = (data[toolName] || 0) + 1;
  data._total = (data._total || 0) + 1;
  localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Get total usage count (with social-proof base number)
 * @returns {number}
 */
function getTotalUsageCount() {
  const base = 48231; // Social proof starting number
  const data = JSON.parse(localStorage.getItem('ait_usage') || '{}');
  return base + (data._total || 0);
}

/**
 * Load an image from a source
 * @param {string} src
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Setup drag and drop for an upload zone element
 * @param {HTMLElement} zone
 * @param {Function} onFiles - callback(files: FileList)
 */
function setupDragDrop(zone, onFiles) {
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
    zone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  zone.addEventListener('dragenter', () => zone.classList.add('dragover'));
  zone.addEventListener('dragover', () => zone.classList.add('dragover'));
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', (e) => {
    zone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length) onFiles(files);
  });
}

/**
 * Initialize mobile navigation toggle
 */
function initNavbar() {
  const toggle = document.querySelector('.navbar-toggle');
  const links = document.querySelector('.navbar-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }
}

/**
 * Initialize FAQ accordion
 */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      // Toggle current
      if (!isActive) item.classList.add('active');
    });
  });
}

// Auto-init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFAQ();
});
