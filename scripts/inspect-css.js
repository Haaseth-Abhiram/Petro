const fs = require('fs');
const css = fs.readFileSync('petroeng-style.css', 'utf8');

// List section comments
const comments = [...css.matchAll(/\/\* -{10,}\s*([\s\S]*?)\s*-{10,} \*\//g)].map(m => m[1]);
console.log('CSS sections:\n', comments.join('\n'));
