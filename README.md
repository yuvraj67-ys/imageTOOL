# ✦ ImgAURA

**Free AI-powered image processing tools — 100% browser-based, no signup required.**

## 🛠️ Tools

| Tool | Description |
|------|-------------|
| 🖼️ Background Remover | Remove backgrounds with AI (MediaPipe) |
| ✨ Image Enhancer | Upscale 2x/4x with smart enhancement |
| 🔍 Object Detector | Detect 80+ objects (COCO-SSD) |
| 🔄 Image Converter | Convert PNG/JPEG/WEBP/BMP |
| 📦 Image Compressor | Compress to target size |
| 😶 Face Blur | Auto-detect & blur faces for privacy |

## 🚀 Quick Start

```bash
npm install
npm start
# Open http://localhost:3000
```

## 📦 Tech Stack

- **Backend:** Node.js + Express (static serving only)
- **Frontend:** Vanilla HTML5/CSS3/JS (ES2022)
- **AI:** MediaPipe + TensorFlow.js (all browser-based)
- **Styling:** Tailwind CSS (CDN)
- **Hosting:** Vercel (free tier)

## 🔒 Privacy

All processing happens in your browser. No images are ever uploaded to any server.

## 💰 Monetization

Monetized via Adsterra ads. Replace `YOUR_*_KEY` placeholders in `public/js/adsterra.js` with your Adsterra publisher keys.

## 📄 Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

## 📜 License

MIT
