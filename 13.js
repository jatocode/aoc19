const fs = require('fs');
const args = process.argv.slice(2);
const data = fs.readFileSync(args[0], 'utf8');
const ctx = require('axel');

const intcode = require('./intcode');
let lines = data.split('\n');
const memory = lines[0].split(',').map(x => parseInt(x));

let c = 0;
let x = 0;
let y = 0;
let screen = [];
let ballx = 0;
let paddlex = 0;
ctx.clear();

memory[0] = 2; // Play for free
intcode(memory, joystick, game);

ctx.bg(255, 0, 0);
ctx.fg(255, 255, 255);
ctx.text(16, 12, "GAME OVER");

function joystick() {
    if(ballx < paddlex) return -1;
    if(ballx > paddlex) return 1;
    return 0;
}

function game(out) {
    let tile = 0;
    let o = ' ';
    switch (c++ % 3) {
        case 0: x = out; break;
        case 1: y = out; break;
        case 2:
            tile = out;
            switch (tile) {
                case 0: o = ' '; ctx.bg(00, 00, 00); break;
                case 1: o = 'X'; ctx.bg(66, 22, 22); break;
                case 2: o = '*'; ctx.bg(22, 22, 222); break;
                case 3: o = '-'; 
                    paddlex = x;
                    ctx.bg(222, 222, 222); 
                    break;
                case 4: o = 'o'; 
                    ballx = x;
                    ctx.bg(220, 220, 22); 
                    msleep(10); 
                break;
            }
            if (x == -1 && y == 0) {
                ctx.bg(255, 0, 0);
                ctx.fg(255, 255, 255);
                ctx.text(30, 24, `SCORE: ${out}`);
                ctx.bg(0, 0, 0);
            }
            if (screen[y] == undefined) screen[y] = [];
            if (tile != 4 || screen[y][x] == undefined || screen[y][x] == ' ' || screen[y][x] == '*') {
                screen[y][x] = o;
                ctx.point(x + 1, y + 1);
            }
            break;
        default:
            break;
    }
}

function msleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}