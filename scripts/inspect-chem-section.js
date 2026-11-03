const fs = require('fs');
const html = fs.readFileSync('petroeng-home.html', 'utf8');

const idx = html.indexOf('Eight solution groups');
console.log(html.slice(idx, idx + 4000));
