const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Compression (gzip for faster loads) ──
app.use(compression());

// ── Security Headers (allow CDNs) ──
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'cdn.jsdelivr.net',
          'cdnjs.cloudflare.com',
          'cdn.tailwindcss.com',
          'unpkg.com',
        ],
        styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'cdn.tailwindcss.com', 'fonts.googleapis.com'],
        fontSrc: ["'self'", 'fonts.gstatic.com', 'cdn.jsdelivr.net'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'", 'cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'cdn.tailwindcss.com', 'storage.googleapis.com'],
        frameSrc: ["'self'"],
        workerSrc: ["'self'", 'blob:'],
        mediaSrc: ["'self'", 'blob:'],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// ── Cache-Control Headers ──
// 1 year cache for CSS/JS assets
app.use('/css', express.static(path.join(__dirname, 'public/css'), {
  maxAge: '1y',
  immutable: true,
}));
app.use('/js', express.static(path.join(__dirname, 'public/js'), {
  maxAge: '1y',
  immutable: true,
}));

// No-cache for HTML files
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  },
}));

// ── Custom 404 → redirect to homepage ──
app.use((req, res) => {
  res.status(404).redirect('/');
});

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`🚀 ImgAURA Server running on port ${PORT}`);
});

module.exports = app;
