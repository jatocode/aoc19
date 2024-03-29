const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');
let totalfuel = 0;
for (line of lines) {
    let mass = parseFloat(line);
    totalfuel += calcfuel(0, mass);
}
console.log(totalfuel);

function calcfuel(total, mass) {
    let fuel = (Math.floor(mass / 3)) - 2;
    if (fuel > 0) {
        return calcfuel(total + fuel, fuel);
    }
    return total;
}