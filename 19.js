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

let maxx = 50;
let maxy = 50;

let tot = 0;

let space = [];
tractorbeam();
display(space);
console.log('Del 1:', tot);

function tractorbeam() {
    for (y = 0; y < maxy - 1; y++) {
        for (x = 0; x < maxx; x++) {
            intcode([...memory], beam, output);     
        }
    }
}

function beam() {
    switch(c++ % 2) {
        case 0: return x;
        case 1: return y;
    }
}

function output(out) {
    tot += out;
    space[`${x},${y}`] = out == 0 ? '.':'#';
}

function display(space) {
    console.log();
    for (let y = 0; y < maxy - 1; y++) {
        let row = '';
        for (let x = 0; x < maxx; x++) {
            row += space[`${x},${y}`];
        }
        console.log(row);
    }
}

