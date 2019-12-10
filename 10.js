const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');

let asteroids = [];
for (line of lines) {
    asteroids.push(line.trim().split(''));
}

console.table(asteroids);

console.log(calcLines(3,4));
console.log(calcLines(1,0));

let map = [];
for (let y = 0; y < asteroids[0].length; y++) {
    const arow = asteroids[y];
    for (let x = 0; x < arow.length; x++) {
        const asteroid = arow[x];   
        if (asteroid != '.') {
            const l = calcLines(x,y);
            console.log(x,y,l);
            map[`${x}${y}`] = l;
            arow[x] = l;
        }          
    }
}
console.table(map);
console.table(asteroids);

console.log(calcLines(4,2));


function calcLines(fx, fy) {
    let los = [];
    let linjer = new Set();
    for (let y = 0; y < asteroids[0].length; y++) {
        const element = asteroids[y];
        let nr = [];
        for (let x = 0; x < element.length; x++) {
            let g = findLoS(fx, fy, x, y);
            const asteroid = element[x];
            if (asteroid != '.') {
                nr.push(g);
                linjer.add(g);
            } else {
                nr.push(null);
            }

        }
        los.push(nr);
    }
    console.table(los);
    console.log(linjer);
    //console.log(los);
    return linjer.size;
}
//console.table(asteroids);

function findLoS(x1, y1, x2, y2) {
    let xd = Math.abs(x2) - Math.abs(x1);
    let yd = Math.abs(y2) - Math.abs(y1);
    return xd / yd;
}

/*
  3 - 3  / 4 - 4  = 0 / 0 -> NaN
  3 - 4 / 4 -4 = -1 / 0 

  3 -2 / 4 -4 = 1 / 0


*/