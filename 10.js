const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');

let asteroids = [];
for (line of lines) {
    asteroids.push(line.trim().split(''));
}

findBest();

function findBest() {
    let best = { a: '', detected: 0 };
    for (let y = 0; y < asteroids[0].length; y++) {
        const arow = asteroids[y];
        for (let x = 0; x < arow.length; x++) {
            if (arow[x] != '.') {
                const l = calcLines(x, y);
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
    for (let y = 0; y < asteroids[0].length; y++) {
        const arow = asteroids[y];
        for (let x = 0; x < arow.length; x++) {
            if (arow[x] == '#') {
                let g = findLoS(fx, fy, x, y);
                linjer.add(g);
            } 
        }
    }
    return linjer.size - 1;
}

function findLoS(x1, y1, x2, y2) {
    let xd = Math.abs(x2 - x1);
    let yd = Math.abs(y2 - y1);

    if (x1 == x2 && y1 == y2) return 'X';
    let h = x1 - x2 < 0 ? 'R' : 'D';
    let v = y1 - y2 < 0 ? 'D' : 'U';
    return `${h}${v}-${yd/xd}`
}