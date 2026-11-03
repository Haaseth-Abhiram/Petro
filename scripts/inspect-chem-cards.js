const fs = require('fs');
const html = fs.readFileSync('petroeng-home.html', 'utf8');

const regex = /<div class="chem-card">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;
let match;
let i = 1;
while ((match = regex.exec(html)) !== null) {
  const card = match[1];
  const title = card.match(/<h3>([\s\S]*?)<\/h3>/)?.[1] || '';
  const num = card.match(/<span class="chem-num">([\s\S]*?)<\/span>/)?.[1] || '';
  const img = card.match(/<img[^>]+src="([^">]+)"/)?.[1] || '';
  const items = [...card.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1].trim());
  console.log(`[Group ${i}] ${num}: ${title.trim()} (${img})`);
  console.log('  Items:', items);
  i++;
}
