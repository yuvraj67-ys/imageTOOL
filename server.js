const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Multer for file uploads (memory storage for serverless)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  },
}));

// ── Background Removal API ──
let removeBackground = null;

app.post('/api/remove-bg', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Lazy-load the heavy module
    if (!removeBackground) {
      const bgRemoval = await import('@imgly/background-removal-node');
      removeBackground = bgRemoval.removeBackground || bgRemoval.default;
    }

    // Convert buffer to Blob for the library
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });

    const result = await removeBackground(blob, {
      debug: false,
      output: { format: 'image/png' }
    });

    // Convert result blob to buffer
    const arrayBuffer = await result.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.set({
      'Content-Type': 'image/png',
      'Content-Length': buffer.length,
      'Cache-Control': 'no-cache'
    });
    res.send(buffer);

  } catch (err) {
    console.error('BG Removal Error:', err);
    res.status(500).json({ error: err.message || 'Processing failed' });
  }
});

app.use((req, res) => {
  res.status(404).redirect('/');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 ImgAURA Server running on port ${PORT}`);
  });
}

module.exports = app;
