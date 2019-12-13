const fs = require('fs');
const args = process.argv.slice(2);
const data = fs.readFileSync(args[0], 'utf8');

const intcode = require('./intcode');
let lines = data.split('\n');
const inputprogram = lines[0].split(',').map(x => parseInt(x));

let c = 0;
let x = 0;
let y= 0;
let screen = [];

intcode([...inputprogram], () => {console.log('input?'); return 0}, draw);

display();

function display() {
    let blocks = 0;
    for (let y = 0; y < screen.length; y++) {
        const row = screen[y];
        let out = '';
        for (let x = 0; x < row.length; x++) {
            out += row[x];
            if(row[x] == '*') blocks++;
        }
        console.log(out);
    }
    console.log('Blocks left:' + blocks);
}

function draw(out) {
    let tile = 0;
    let o = ' ';
    switch(c++ % 3) {
        case 0: x = out; break;
        case 1: y = out; break;
        case 2: 
            tile = out; 
            switch(tile) {
                case 0: o = ' '; break;
                case 1: o = 'X'; break;
                case 2: o = '*'; break;
                case 3: o = '-'; break;
                case 4: o = 'o'; break;
            }
            if(screen[y] == undefined) screen[y] = [];
            if(tile != 4 || screen[y][x] == undefined || screen[y][x] == ' ' ||  screen[y][x] == '*') {
                    screen[y][x] = o;
            }
            break;
        default: 
            break;
    }
}

