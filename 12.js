const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');
let planets = [];
let vel = [];
for (line of lines) {
    let x = 0, y = 0, z = 0;
    [_, x, y, z] = line.match(/<x=(.?\d+), y=(.?\d+), z=(.?\d+)>/);
    planets.push({ x: parseInt(x), y: parseInt(y), z: parseInt(z) });
    vel.push({ x: 0, y: 0, z: 0 });
}
display();

for(let time=1;time < 1001;time++) {
    gravity();
    addVelocity();

    if(time == 1000) {
        console.log(`After ${time} steps`);
        display();
        displayEnergy();
    }
}

function display() {
    for (let i = 0; i < planets.length; i++) {
        const p = planets[i];
        const v = vel[i];
        console.log(p, v);
    }
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
        energy.push([{pot:pot},{kin:kin},{tot:tot}]);
        total += tot;
    }
    console.table(energy);
    console.log('Sum of total energy:' + total);
}

function gravity() {
    for (let p1i = 0; p1i < planets.length; p1i++) {
        const p1 = planets[p1i];
        for (let p2i = 0; p2i < planets.length; p2i++) {
            if (p1i == p2i) continue;
            const p2 = planets[p2i];
            vel[p1i].x += cmp(p1.x, p2.x);
            vel[p1i].y += cmp(p1.y, p2.y);
            vel[p1i].z += cmp(p1.z, p2.z);
            // console.log(p1i, p2i);
            // display();
        }
    }
}

function addVelocity() {
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