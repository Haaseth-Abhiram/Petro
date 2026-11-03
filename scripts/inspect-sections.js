const fs = require('fs');
const html = fs.readFileSync('petroeng-home.html', 'utf8');

const sectionRegex = /<(section|header|footer|div class="[^"]*hero[^"]*")[^>]*>([\s\S]*?)<\/\1>/gi;
// Let's print out all h1, h2, h3 and section tags
const headings = [...html.matchAll(/<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => `${m[1]}: ${m[2].replace(/<[^>]+>/g, '').trim()}`);
console.log('Headings in petroeng-home.html:\n', headings.join('\n'));
