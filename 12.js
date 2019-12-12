const fs = require('fs');
var ctx = require('axel');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');
let planets = [];
let vel = [];
for (line of lines) {
    let x = 0, y = 0, z = 0;
    [_, x, y, z] = line.match(/<x=(.?\d+), y=(.?\d+), z=(.?\d+)>/);
    planets.push({ x: parseInt(x), y: parseInt(y), z: parseInt(z), path: [] });
    vel.push({ x: 0, y: 0, z: 0 });
}
//display();
ctx.bg(0,0,0);
ctx.clear();


for (let time = 1; time < 1001; time++) {
    gravity();
    addVelocity();
    // if (time == 1000) {
    //     console.log(`After ${time} steps`);
    //     display();
    //     displayEnergy();
    // }
}
ctx.cursor.restore();

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

function gravity() {
    for (let p1i = 0; p1i < planets.length; p1i++) {
        const p1 = planets[p1i];
        for (let p2i = 0; p2i < planets.length; p2i++) {
            if (p1i == p2i) continue;
            const p2 = planets[p2i];
            vel[p1i].x += cmp(p1.x, p2.x);
            vel[p1i].y += cmp(p1.y, p2.y);
            vel[p1i].z += cmp(p1.z, p2.z);
        }
    }
}

function addVelocity() {
    const colors = [[0, 128, 255], [0, 255, 128], [255, 128, 0], [255, 0, 255], [0, 0, 255]];
    for (let pi = 0; pi < planets.length; pi++) {
        const p = planets[pi];
        p.x += vel[pi].x;
        p.y += vel[pi].y;
        p.z += vel[pi].z;

        p.path.unshift([(p.x / 4), (p.y / 4), (p.z)]);
        p.path = p.path.slice(0,20);
        const c = colors[pi];
        for (const point of p.path) {
            ctx.bg(fade(c[0], point[2]), fade(c[1], point[2]), fade(c[2], point[2]));
            ctx.point(20+point[0], 20+point[1]);
        }
        if (p.path.length > 0) {
            const point = p.path[p.path.length - 1];
            //console.log(point);
            ctx.bg(0, 0, 0);
            ctx.point(20 + point[0], 20 +point[1]);
        }
    }
}

function fade(c, z) {
    let nc = (c - Math.abs(z*10));
    return nc > 0 ? nc : 0;
}

function cmp(a, b) {
    if (a > b) return -1;
    if (a < b) return +1;
    return 0;
}