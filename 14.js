const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');

let chemicals = [];

for (line of lines) {
    let out = [];
    let input = [];
    [_, input, out] = line.match(/(.*) => (.*)/);
    let ocn, oc;
    [ocn, oc] = formula(out);
    chemicals[oc] = {f:ocn, i:input.split(', '), ore:0, waste:0};
}

let ore = react(args[1], 1);
let waste = Object.values(chemicals).reduce((t,c) => t + c.waste, 0);
console.table(chemicals);
console.log(waste);
console.log('ORE:' + (ore + waste));

function react(chemical, amount) {
    let totore = 0;
    let waste = 0;
    //console.log(chemical, amount);
    let c = chemicals[chemical];
    if(c.waste > amount) {
        //console.log('Already prod ' + chemical + ':' + c.waste);
        c.waste -= amount;
        return amount;
    }
    for(let i of c.i) {
        [icn, ic] = formula(i);
        //console.log('Calc:' + ic + ' ' + icn);
        if(ic == 'ORE') {
            c.waste += icn - amount;    
            return amount;
        }
        c.ore += react(ic, icn);
    }
    return c.ore;
}

function formula(r) {
    let on, oc;
    [_, on, oc] = r.match(/(\d+) (.*)/);
    return [parseInt(on), oc];   
}