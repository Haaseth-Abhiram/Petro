const fs = require('fs');
const html = fs.readFileSync('petroeng-instrumentation.html', 'utf8');

console.log(html.slice(4000, 16000));
