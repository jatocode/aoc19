const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');

wire1 = lines[0].split(',');
wire2 = lines[1].split(',');

grid = [];
grid['0,0'] = {n:'o', s: 0};

tracewire(wire1, '1');
let cross = tracewire(wire2, '2');
console.log('Del 1: Closest cross distance: ' + cross[0]);
console.log('Del 2: Closest cross steps: ' + cross[1]);

function tracewire(wire, wirename) {
    let x = 0;
    let y = 0;
    let mincross = Number.MAX_SAFE_INTEGER;
    let minsteps = Number.MAX_SAFE_INTEGER;
    let ts = 0;
    for (step of wire) {
        let dir, steps;
        [_, dir, steps] = step.match(/([A-Z])(\d+)/);
        let d = [0, 0];
        switch (dir) {
            case 'R': d = [ 1, 0];  break;
            case 'L': d = [ -1, 0]; break;
            case 'U': d = [ 0, -1]; break;
            case 'D': d = [ 0, 1];  break;
        }
        for (let i=0; i < parseInt(steps); i++) {
            x += d[0];
            y += d[1];
            ts++;
            if(grid[`${x},${y}`] == undefined) {
                grid[`${x},${y}`] = {n:wirename, s: ts};
            } else if(grid[`${x},${y}`].n == wirename) { 
                // Crossed myself
            } else {
                let dist = Math.abs(x) + Math.abs(y);
                mincross = mincross > dist ? dist: mincross;
                minsteps = minsteps > grid[`${x},${y}`].s + ts ? grid[`${x},${y}`].s + ts : minsteps;
            }
        }
    }
    return [mincross, minsteps];
}