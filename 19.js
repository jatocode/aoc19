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
find10x10(0,0,2,2);

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
        let row = y + '|';
        for (let x = 0; x < maxx; x++) {
            row += space[`${x},${y}`];
        }
        console.log(row);
    }
}


function find10x10(startx, starty, sizex, sizey) {
    if(startx > maxx) {
        find10x10(0, starty+1, sizex, sizey);
        return;
    }
    if(starty > maxy) {
        console.log('Not found');
        return;
    }
    if( beamed(startx, starty) &&         beamed(startx + sizex, starty) &&
        beamed(startx, starty + sizey) && beamed(startx + sizex, starty + sizey)) {
        console.log('Fit at', startx, starty);
        return;
    } else {
       // console.log(startx, starty);
        find10x10(startx+1, starty, sizex, sizey);
    } 
}

function beamed(x,y) {
    return space[`${x},${y}`] == '#';
}
