const fs = require('fs');
const args = process.argv.slice(2);
const data = fs.readFileSync(args[0], 'utf8');
const ctx = require('axel');
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const intcode = require('./intcode');
let lines = data.split('\n');
const memory = lines[0].split(',').map(x => parseInt(x));

let c = 0;
let x = 0;
let y = 0;
let screen = [];
let left = false;
let right = false;

ctx.clear();

memory[0] = 2; // Play for free
intcode(memory, joystick, game);
ctx.bg(255, 0, 0);
ctx.fg(255, 255, 255);
ctx.text(16, 12, "GAME OVER");

function joystick() {
    let o = 0;
    if (left) o = -1;
    if (right) o = +1;
    ctx.bg(255, 0, 0);
    ctx.fg(255, 255, 255);
    ctx.text(1, 24, o.toString());
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
                case 3: o = '-'; ctx.bg(222, 222, 222); break;
                case 4: o = 'o'; ctx.bg(220, 220, 22); msleep(200); break;
            }
            if (x == -1 && y == 0) {
                ctx.bg(255, 0, 0);
                ctx.fg(255, 255, 255);
                ctx.text(30, 24, out.toString());
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

process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit();
    } else if (key.name === 'left') {
        left = true;
        right = false;
    } else if (key.name === 'right') {
        left = false;
        right = true;
    } 
    ctx.bg(255,0,0);
    ctx.fg(255,255,255);
    ctx.text(1, 24, left == true? '-1': '0');  
});  

function msleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}