const fs = require('fs');
const path = require('path');
const imgDir = path.join(__dirname, '../public/assets/img');

const alts = [
  'manifold-valves-alt.jpg',
  'check-valves-alt.jpg',
  'tubing-coils-alt.jpg',
  'ball-valves-alt.jpg',
  'needle-valves-alt.jpg'
];

async function dlAlts() {
  for (const img of alts) {
    try {
      const res = await fetch(`https://petroeng.in/assets/img/${img}`);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(path.join(imgDir, img), Buffer.from(buffer));
        console.log(`Downloaded ${img}`);
      }
    } catch (e) {
      console.log('Skipping', img);
    }
  }
}
dlAlts();
