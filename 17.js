const fs = require('fs');
const args = process.argv.slice(2);
const data = fs.readFileSync(args[0], 'utf8');
const ctx = require('axel');

const intcode = require('./intcode');
let lines = data.split('\n');
const memory = lines[0].split(',').map(x => parseInt(x));

let x = 0;
let y = 0;

let maxx = 0;
let maxy = 0;

let startx = 0;
let starty = 0;

// Superhackigt med 2 scaffolds men orkar inte
let sc = [];
let sc2 = [];

let dir = 0;
let dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
let dc = ['^','>','v','<'];
let is = [];

intcode(memory, () => {}, scaffold);
vacuum(startx, starty);
display(sc2);
let t = is.reduce((t,s) => t + s[1], 0);
console.log(t);

function display(sc) {
    console.log();
    for (let y = 0; y < maxy - 1; y++) {
        let row = '';
        for (let x = 0; x < maxx; x++) {
            row += sc[`${x},${y}`];
        }
        console.log(row);
    }
}

function vacuum(sx, sy) {
    let x = sx;
    let y = sy;
    let s = 0;
    while(s++ < 300) {
        for (let i = dir; i < dirs.length + dir; i++) {
            let ndir = i % 4;
            if(ndir == (dir + 2) % 4) {
                continue;
            }
            if(next(x, y, ndir)) {
                dir = ndir;
                sc2[`${x},${y}`] = dc[dir];
                x += dirs[dir][0];
                y += dirs[dir][1];
                break;
            } 
        }
        sc2[`${x},${y}`] = 'X';
    }
}

function scaffold(out) {
    let c = String.fromCharCode(out);
    switch (out) {
        case 10:
            y++;
            x = 0;
            break;
        case 35:
        case 46:
            sc[`${x},${y}`] = c;
            sc2[`${x},${y}`] = c;
            x++;
            break;
        default:
            // Vacuum
            sc[`${x},${y}`] = c;
            sc2[`${x},${y}`] = c;
            startx = x;
            starty = y;
            x++;
            switch (c) {
                case '^': dir = 0; break;
                case '>': dir = 1; break;
                case 'v': dir = 2; break;
                case '<': dir = 3; break;
            }
            break;
    }
    if (x > maxx) maxx = x;
    if (y > maxy) maxy = y;
}

function next(x, y, dir) {
    let nx = x + dirs[dir][0];
    let ny = y + dirs[dir][1];
    if('^v<>'.includes(sc2[`${nx},${ny}`])) {
        is.push([`${nx},${ny}`, nx*ny]);
    }
    return sc[`${nx},${ny}`] == '#';
}
