const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');
const orgprogram = lines[0].split(',').map(x => parseInt(x));

// Test:

computer([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], 8);
computer([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], 9);
computer([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], 7);
computer([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], 8);
computer([3, 3, 1108, -1, 8, 3, 4, 3, 99], 8);
computer([3, 3, 1108, -1, 8, 3, 4, 3, 99], 9);
computer([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9], 8);
computer([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9], 1);

computer([3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
    1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
    999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99], 7); // 999
computer([3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
    1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
    999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99], 8); // 1000
computer([3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
    1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
    999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99], 9); // 1001

    //computer(orgprogram, 1)

function computer(program, input) {
    let a, b, o, pc = 0;
    let running = true;
    while (running) {
        let instruction = program[pc].toString();
        let len = instruction.length - 1;
        let o2 = instruction[len - 1] == undefined ? '0' : instruction[len - 1];
        let opcode = parseInt(o2 + instruction[len]);

        let modeC = instruction[len - 2] == undefined ? 0 : parseInt(instruction[len - 2]);
        let modeB = instruction[len - 3] == undefined ? 0 : parseInt(instruction[len - 3]);
        let modeA = instruction[len - 4] == undefined ? 0 : parseInt(instruction[len - 4]);
        console.log('>', pc, opcode, modeC, modeB, modeA);
        switch (opcode) {
            case 1:
                a = getValue(program, pc + 1, modeC);
                b = getValue(program, pc + 2, modeB);
                o = getValue(program, pc + 3, modeA);
                console.log(a,b,o);
                program[o] = a + b;
                pc += 4;
                break;
            case 2:
                a = getValue(program, pc + 1, modeC);
                b = getValue(program, pc + 2, modeB);
                o = getValue(program, pc + 3, modeA);
                console.log(a,b,o);
                program[o] = a * b;
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
            case 5:
                a = getValue(program, pc + 1, modeC);
                b = getValue(program, pc + 2, modeB);
                if (a != 0) {
                    pc = b;
                } else {
                    pc += 3;
                }
                break;
            case 6:
                a = getValue(program, pc + 1, modeC);
                b = getValue(program, pc + 2, modeB);
                if (a == 0) {
                    pc = b;
                } else {
                    pc += 3;
                }
                break;
            case 7:
                a = getValue(program, pc + 1, modeC);
                b = getValue(program, pc + 2, modeB);
                o = getValue(program, pc + 3, modeA);
                console.log(a,b,o);
                if (a < b) {
                    program[o] = 1;
                } else {
                    program[o] = 0;
                }
                pc += 4;
                break;
            case 8:
                a = getValue(program, pc + 1, modeC);
                b = getValue(program, pc + 2, modeB);
                o = getValue(program, pc + 3, modeA);
                console.log(a,b,o);
                if (a == b) {
                    program[o] = 1;
                } else {
                    program[o] = 0;
                }
                pc += 4;
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
