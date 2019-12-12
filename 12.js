const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');
let planets = [];
for (line of lines) {
    let x = 0,y = 0,z = 0;
    [_,x,y,z] = line.match(/<x=(.?\d+), y=(.?\d+), z=(.?\d+)>/);
    planets.push([{p:{x:parseInt(x),y:parseInt(y),z:parseInt(z)}},
                  {v:{x:0,y:0,z:0}}]);
}
console.log(planets);