const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');
const orgprogram = lines[0].split(',').map(x => parseInt(x));

computer(orgprogram, 1)

function computer(program, input) {
    let a, b, pc = 0;
    let running = true;
    while (running) {
        let instruction = program[pc].toString();
        let len = instruction.length - 1;
        let o2 = instruction[len - 1] == undefined ? '0' : instruction[len - 1];
        let opcode = parseInt(o2 + instruction[len]);

        let modeC = instruction[len - 2] == undefined ? 0 : parseInt(instruction[len - 2]);
        let modeB = instruction[len - 3] == undefined ? 0 : parseInt(instruction[len - 3]);
        let modeA = instruction[len - 4] == undefined ? 0 : parseInt(instruction[len - 4]);
        //console.log('>', pc, opcode, modeC, modeB, modeA);
        switch (opcode) {
            case 1:
                a = getValue(program, pc + 1, modeC);
                b = getValue(program, pc + 2, modeB);
                program[program[pc + 3]] = a + b;
                pc += 4;
                break;
            case 2:
                a = getValue(program, pc + 1, modeC);
                b = getValue(program, pc + 2, modeB);
                program[program[pc + 3]] = a * b;
                pc += 4;
                break;
            case 3:
                a = program[pc + 1];
                console.log(`Setting pc at ${a} to ${input}`);
                program[a] = input;
                pc += 2;
                break;
            case 4:
                a = getValue(program, pc + 1, modeC);
                a = program[pc + 1];
                console.log(`Output (${pc}): ${program[a]}`);
                pc += 2;
                break;
            case 99:
                running = false;
                break;
            default:
                console.log('?', opcode);
                break;
        }
    }
    return program[0];
}

function getValue(program, pc, mode) {
    switch (mode) {
        case 0: // Position mode
            return program[program[pc]];
        case 1: // Immediate mode
            return program[pc];
    }
}
