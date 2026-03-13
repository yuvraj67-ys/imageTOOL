const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Adsterra script mapping
  if (!content.includes('adsterra.js')) {
    content = content.replace('</body>', '  <script src="/js/adsterra.js" defer></script>\n</body>');
  }

  // ad-banner-bottom
  if (file !== 'index.html' && !content.includes('ad-banner-bottom') && !['privacy.html', 'terms.html', 'contact.html'].includes(file)) {
    content = content.replace('<footer', '  <div id="ad-banner-bottom" style="margin: 2rem auto; max-width: 728px; text-align: center; display: flex; justify-content: center; overflow: hidden;"></div>\n  <footer');
    if (file === 'bg-remover.html') {
      content = content.replace('</div>\n\n\n      </div>', '</div>\n        <div class="tool-sidebar"><div id="ad-native-container" style="margin-top:2rem;"></div></div>\n      </div>');
    }
  }
  
  if (file === 'index.html' && !content.includes('ad-banner-bottom')) {
    content = content.replace('<footer', '  <div id="ad-banner-bottom" style="margin: 2rem auto; max-width: 728px; text-align: center; display: flex; justify-content: center; overflow: hidden;"></div>\n  <footer');
  }

  fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Successfully injected ad hooks into all pages!');
