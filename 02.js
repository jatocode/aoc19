const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');
const orgprogram = lines[0].split(',').map(x => parseInt(x));

// Del 1
console.log('Del 1:', computer([...orgprogram], 12, 2));

for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
        let output = computer([...orgprogram], noun, verb);
        if(output == 19690720) {
            // Del 2
            console.log('Del 2:', (100*noun + verb));
        }
    }
}

function computer(program, noun, verb) {
    program[1] = noun;
    program[2] = verb;
    let a, b, c = 0;
    let running = true;
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
    return program[0];
}
