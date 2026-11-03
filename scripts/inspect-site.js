const fs = require('fs');
const html = fs.readFileSync('petroeng-home.html', 'utf8');

const regex = /href=["']([^"']+)["']/g;
const links = [];
let match;
while ((match = regex.exec(html)) !== null) {
  links.push(match[1]);
}
console.log('Unique links:', [...new Set(links)]);

const imgRegex = /src=["']([^"']+)["']/g;
const images = [];
while ((match = imgRegex.exec(html)) !== null) {
  images.push(match[1]);
}
console.log('Images:', [...new Set(images)]);
