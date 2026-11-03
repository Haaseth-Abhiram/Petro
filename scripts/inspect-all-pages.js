const fs = require('fs');

for (const name of ['about', 'chemicals', 'instrumentation', 'services', 'contact']) {
  const html = fs.readFileSync(`petroeng-${name}.html`, 'utf8');
  const headings = [...html.matchAll(/<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => `  ${m[1]}: ${m[2].replace(/<[^>]+>/g, '').trim()}`);
  console.log(`=== ${name.toUpperCase()} HEADINGS ===\n` + headings.join('\n'));
}
