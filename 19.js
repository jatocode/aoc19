const fs = require('fs');
const args = process.argv.slice(2);
const data = fs.readFileSync(args[0], 'utf8');
const ctx = require('axel');

const intcode = require('./intcode');
let lines = data.split('\n');
const memory = lines[0].split(',').map(x => parseInt(x));

let x = 0;
let y = 0;
let c = 0;

let maxx = 1500;
let maxy = 1500;

let tot = 0;

let space = [];
tractorbeam();
console.log('Del 1:', tot);
find(100);
//display2(space);

function tractorbeam(startx=0, starty=0) {
    let startx2 = startx;
    for (y = starty; y < maxy - 1; y++) {
        let fr = false;
        for (x = startx2; x < maxx && fr == false; x++) {
            let prev = beamed(x - 1,y);
            intcode([...memory], beam, output);
            if(prev && !beamed(x,y)) fr = true; // Snabba på det hela
        }
        startx2 = Math.round(y*1.1); // Börja lite smartare
        if(y % 50 == 0) {
            console.log(y, maxy);
        }
    }
}

function beam() {
    switch (c++ % 2) {
        case 0: return x;
        case 1: return y;
    }
}

function output(out) {
    tot += out;
    space[`${x},${y}`] = out == 0 ? '.' : '#';
}

function display(space) {
    console.log();
    let row = '   ';
    for (let x = 0; x < maxx; x++) {
        row += ('0' + x).slice(-2) + ' ';
    }
    console.log(row);
    for (let y = 0; y < maxy - 1; y++) {
        let row = ('0' + y).slice(-2) + '|';
        for (let x = 0; x < maxx; x++) {
            row += ' ' + space[`${x},${y}`] + ' ';
        }
        console.log(row);
    }
}

function display2(space) {
    console.log();
    for (let y = 0; y < maxy - 1; y++) {
        let row = '';
        for (let x = 0; x < maxx; x++) {
            row += space[`${x},${y}`] == undefined ? ' ' : space[`${x},${y}`];
        }
        console.log(row);
    }
}

function find(size) {
    let found = false;
    size -= 1;
    for (let y = 0; y < maxy - 1 && found == false; y++) {
        let fr = false;
        for (let x = 0; x < maxx && found == false; x++) {
            if(fr == true && !beamed(x,y)) break;
            if(beamed(x,y)) fr = true;

            if (beamed(x, y) && beamed(x + size, y) &&
                beamed(x, y + size) && beamed(x + size, y + size)
            ) {
                console.log('Found', size+1, x, y, x*10000+y);
                set(x, y, size + 1);
                set(x + size, y, size + 1);
                set(x, y + size, size + 1);
                set(x + size, y + size, size + 1);
                found = true;
            }
        }
    }
}

function beamed(x, y) {
    return space[`${x},${y}`] != '.' && space[`${x},${y}`] != undefined;
}

function set(x, y, s = 'O') {
    if (beamed(x, y)) {
        space[`${x},${y}`] = s;
    }
}