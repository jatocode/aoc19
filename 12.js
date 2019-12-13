const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');
let planets = [];
let vel = [];

let visitedX = new Set();
let visitedY = new Set();
let visitedZ = new Set();
let cycleX  = 0;
let cycleY  = 0;
let cycleZ  = 0;

for (line of lines) {
    let x = 0, y = 0, z = 0;
    [_, x, y, z] = line.match(/<x=(.?\d+), y=(.?\d+), z=(.?\d+)>/);
    planets.push({ x: parseInt(x), y: parseInt(y), z: parseInt(z), path: [] });
    vel.push({ x: 0, y: 0, z: 0 });
}

for (let time = 0; time < 3000; time++) {
    gravity(time);
    addVelocity();
   //console.log(cycleX, cycleY, cycleZ);
    let g = gcd(cycleX, gcd(cycleY, cycleZ));
   if(time == 1000 || time == 2770 || time == 2772) console.log(g, cycleX, cycleY, cycleZ);
}

function displayEnergy() {
    let energy = [];
    let total = 0;
    for (let i = 0; i < planets.length; i++) {
        const p = planets[i];
        const v = vel[i];
        const pot = Math.abs(p.x) + Math.abs(p.y) + Math.abs(p.z);
        const kin = Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z);
        const tot = pot * kin;
        energy.push([{ pot: pot }, { kin: kin }, { tot: tot }]);
        total += tot;
    }
    console.table(energy);
    console.log('Sum of total energy:' + total);
}

function gravity(time) {
    let xv = '';
    let yv = '';
    let zv = '';
    for (let p1i = 0; p1i < planets.length; p1i++) {
        const p1 = planets[p1i];
        xv += p1.x + ':' + vel[p1i].x + ' '; 
        yv += p1.y + ':' + vel[p1i].y + ' ';
        zv += p1.z + ':' + vel[p1i].z + ' ';
        for (let p2i = 0; p2i < planets.length; p2i++) {
            if (p1i == p2i) continue;
            const p2 = planets[p2i];
            vel[p1i].x += cmp(p1.x, p2.x);
            vel[p1i].y += cmp(p1.y, p2.y);
            vel[p1i].z += cmp(p1.z, p2.z);           
        }
    }

    if(time == 0 || time == 2770 || time == 2772) console.log(time,xv,yv,zv);
    if(visitedX.has(xv)) {
        cycleX = time;
    } 
    visitedX.add(xv);
    if(visitedY.has(yv)) {
        cycleY = time;
    }
    visitedY.add(yv);
    if(visitedZ.has(zv)) {
        cycleZ = time;
    } 
    visitedZ.add(zv);
}

function addVelocity(time) {
    for (let pi = 0; pi < planets.length; pi++) {
        const p = planets[pi];
        p.x += vel[pi].x;
        p.y += vel[pi].y;
        p.z += vel[pi].z;

    }
 
}

function cmp(a, b) {
    if (a > b) return -1;
    if (a < b) return +1;
    return 0;
}

function gcd(a, b) {
    // base cases
    if(a === 0) { return b;}
    if(b === 0) { return a;}

    // decrease and conqure - recursion
    return gcd(b, a % b);
}