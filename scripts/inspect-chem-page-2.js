const fs = require('fs');
const html = fs.readFileSync('petroeng-chemicals.html', 'utf8');

console.log(html.slice(4000, 15000));
