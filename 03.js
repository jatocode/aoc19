const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');

wire1 = lines[0].split(',');
wire2 = lines[1].split(',');

grid = [];
grid['0,0'] = 'o';

tracewire(wire1, '1');
console.log('Closest cross distance: ' + tracewire(wire2, '2'));

function tracewire(wire, wirename) {
    let x = 0;
    let y = 0;
    let mincross = Number.MAX_SAFE_INTEGER;
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
            if(grid[`${x},${y}`] == undefined) {
                grid[`${x},${y}`] = wirename;
            } else if(grid[`${x},${y}`] == wirename) { 
                // Crossed myself
            } else {
                // console.log(`Cross at ${x},${y}`);
                let dist = Math.abs(x) + Math.abs(y);
                mincross = mincross > dist ? dist: mincross;
            }
        }
    }
    return mincross;
}