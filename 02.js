const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');
let program = lines[0].split(',').map(x => parseInt(x));
let running = true;
let a, b, c = 0;
while (running) {
    let opcode = program[c];
    switch (opcode) {
        case 1:
            a = program[program[c + 1]];
            b = program[program[c + 2]];
            program[program[c + 3]] = a + b;
            c += 4;
            break;
        case 2:
            a = program[program[c + 1]];
            b = program[program[c + 2]];
            program[program[c + 3]] = a * b;
            c += 4; break;
        case 99:
            running = false;
            break;
        default:
            c++;
            break;
    }
}
console.log(program[0]);
