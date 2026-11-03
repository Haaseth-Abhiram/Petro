const fs = require('fs');
const html = fs.readFileSync('petroeng-home.html', 'utf8');

const idx = html.indexOf('Precision fittings, valves and analytical systems');
console.log(html.slice(idx, idx + 4000));
