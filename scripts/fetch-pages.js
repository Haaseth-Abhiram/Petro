const fs = require('fs');

const pages = ['chemicals', 'instrumentation', 'services', 'about', 'contact'];

async function fetchPages() {
  for (const page of pages) {
    try {
      const res = await fetch(`https://petroeng.in/${page}`);
      if (res.ok) {
        const text = await res.text();
        fs.writeFileSync(`petroeng-${page}.html`, text);
        console.log(`Saved petroeng-${page}.html (${text.length} bytes)`);
      } else {
        console.warn(`Could not fetch ${page}: status ${res.status}`);
      }
    } catch (e) {
      console.error(`Error fetching ${page}:`, e.message);
    }
  }
}

fetchPages();
