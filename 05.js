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
        let len = instruction.length  - 1;
        let opcode = parseInt(instruction[len]);
 
        let modeC = instruction[len - 2] == undefined ? 0 :  parseInt(instruction[len - 2]);
        let modeB = instruction[len - 3] == undefined ? 0 :  parseInt(instruction[len - 3]);
        let modeA = instruction[len - 4] == undefined ? 0 :  parseInt(instruction[len - 4]);
        switch (opcode) {
            case 1:
                a = getValue(program, pc + 1, modeC);
                b = getValue(program, pc + 2, modeB);
                setValue(program, pc + 3, modeA, a + b);
                pc += 4;
                break;
            case 2:
                a = getValue(program, pc + 1, modeC);
                b = getValue(program, pc + 2, modeB);
                setValue(program, pc + 3, modeA,  a * b);
                pc += 4; 
                break;
            case 3:
                a = getValue(program, pc + 1, modeC);
                setValue(program, a, modeA, input);
                pc += 2;
                break;
            case 4:
                a = getValue(program, pc + 1, modeC);
                console.log(`Output: ${a}`);
                pc += 2;
                break;
            case 99:
                running = false;
                break;
            default:
                pc++;
                break;
        }
    }
    return program[0];
}

function getValue(program, pc, mode) {
    switch(mode) {
        case 0: // Position mode
            return program[program[pc]];
        case 1: // Immediate mode
            return program[pc];
    }
}

function setValue(program, pc, mode, value) {
    switch(mode) {
        case 0: // Position mode
            program[program[pc]] = value;
            break;
        case 1: // Immediate mode
            program[pc + 1] = value;
            break;
    }
}