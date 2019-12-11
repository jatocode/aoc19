const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');

let asteroids = [];
for (line of lines) {
    asteroids.push(line.trim().split(''));
}

findBest();
asteroids[17][13] = '.'; // x/y blir vända här!!

let result = calcLines(13,17);
targets = result[1];
let currentIndex = targets.findIndex(x => x.deg == -90);
let hit = 1;
let current = targets[currentIndex % targets.length];

while(hit < 400) {
    current = targets[currentIndex % targets.length];
    while(current.hit > 0) current = targets[currentIndex++ % targets.length];
    current.hit = hit++;

    asteroids[current.y][current.x] = current.hit;
    if(current.hit == 200) { console.log('Del 2', current.x * 100 + current.y ); }

    if(hit == targets.length + 1) break;

    // Leta upp nästa vinkel
    while(targets[currentIndex % targets.length].deg == current.deg) {
        currentIndex++;
    }; 
}

//console.table(asteroids);
//findBest(); // Del 1

function findBest() {
    let best = { a: '', detected: 0 };
    for (let y = 0; y < asteroids.length; y++) {
        const arow = asteroids[y];
        for (let x = 0; x < arow.length; x++) {
            if (arow[x] != '.') {
                const l = calcLines(x, y)[0];
                if (l > best.detected) {
                    best.detected = l;
                    best.a = `${x},${y}`;
                }
            }
        }
    }
    console.log(best);
}

function calcLines(fx, fy) {
    let linjer = new Set();
    let targets = [];
    for (let y = 0; y < asteroids.length; y++) {
        const arow = asteroids[y];
        for (let x = 0; x < arow.length; x++) {
            if (arow[x] != '.') {
                let dg = calcLoS(fx, fy, x, y);
                linjer.add(dg);

                // Bygg lista av mål
                targets.push({deg: dg, x:x, y:y, dist: Math.abs(fx-x) + Math.abs(fy-y), hit: 0});
            } 
        }
    }

    // Sortera på grad och sen avstånd
    targets = targets.sort((a,b) => a.deg - b.deg || a.dist - b.dist);

    return [linjer.size - 1, targets, Array.from(linjer).sort()];
}

function calcLoS(x1, y1, x2, y2) {
    if (x1 == x2 && y1 == y2) return 'X';
    return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
}