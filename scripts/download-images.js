const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '../public/assets/img');
fs.mkdirSync(imgDir, { recursive: true });

const images = [
  'logo.png',
  'chem-01-ro-chemicals.jpg',
  'chem-02-cooling-water.jpg',
  'chem-03-boiler-water.jpg',
  'chem-04-etp-chemicals.jpg',
  'chem-05-water-treatment-plants.jpg',
  'chem-06-wastewater-treatment.jpg',
  'chem-07-commercial-chemicals.jpg',
  'chem-08-laboratory-equipment.jpg',
  'tube-fittings.jpg',
  'ball-valves.jpg',
  'needle-valves.jpg',
  'manifold-valves.jpg',
  'tubing-coils.jpg',
  'analyser-systems.jpg',
  'reverse-osmosis.jpg',
  'gas-analytics.jpg',
  'pipe-fittings.jpg',
  'service-inspection-qa.jpg',
  'service-technical-consultation.jpg'
];

async function downloadAll() {
  for (const img of images) {
    const url = `https://petroeng.in/assets/img/${img}`;
    const dest = path.join(imgDir, img);
    try {
      const res = await fetch(url);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(dest, Buffer.from(buffer));
        console.log(`Downloaded ${img} (${buffer.byteLength} bytes)`);
      } else {
        console.warn(`Failed ${img}: status ${res.status}`);
      }
    } catch (err) {
      console.error(`Error downloading ${img}:`, err.message);
    }
  }
}

downloadAll();
