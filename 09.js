const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');
const inputprogram = lines[0].split(',').map(x => parseInt(x));

// Test:
// computer([109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99], 0);
// computer([1102,34915192,34915192,7,4,7,99,0], 0);
// computer([104,1125899906842624,99],0);


console.log('Del 1: ');
computer(inputprogram, 1)

console.log('Del 2: ');
computer(inputprogram, 2);

function computer(program, input) {
    let a, b, o, pc = 0;
    let rb = 0;
    let running = true;
    while (running) {
        let instruction = program[pc].toString();
        let len = instruction.length - 1;
        let o2 = instruction[len - 1] == undefined ? '0' : instruction[len - 1];
        let opcode = parseInt(o2 + instruction[len]);

        let modeC = instruction[len - 2] == undefined ? 0 : parseInt(instruction[len - 2]);
        let modeB = instruction[len - 3] == undefined ? 0 : parseInt(instruction[len - 3]);
        let modeA = instruction[len - 4] == undefined ? 0 : parseInt(instruction[len - 4]);

        a = getPointer(pc + 1, program, rb, modeC);
        b = getPointer(pc + 2, program, rb, modeB);
        o = getPointer(pc + 3, program, rb, modeA);

        switch (opcode) {
            case 1:
                program[o] = get(a, program) + get(b, program);
                pc += 4;
                break;
            case 2:
                program[o] = get(a, program) * get(b, program);
                pc += 4;
                break;
            case 3:
                program[a] = input;
                pc += 2;
                break;
            case 4:
                console.log(`Output (${pc}): ${program[a]}`);
                pc += 2;
                break;
            case 5:
                if (get(a, program) != 0) {
                    pc = get(b, program)
                } else {
                    pc += 3;
                }
                break;
            case 6:
                if (get(a, program) == 0) {
                    pc = get(b, program);
                } else {
                    pc += 3;
                }
                break;
            case 7:
                if (get(a, program) < get(b, program)) {
                    program[o] = 1;
                } else {
                    program[o] = 0;
                }
                pc += 4;
                break;
            case 8:
                if (get(a, program) == get(b, program)) {
                    program[o] = 1;
                } else {
                    program[o] = 0;
                }
                pc += 4;
                break;
            case 9:
                rb += get(a, program);
                pc +=2;
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

function get(pc, program) {
    return program[pc] != undefined ? program[pc] : 0;
}

function getPointer(pc, program, rb, mode) {
    switch (mode) {
        case 0: return program[pc];
        case 1: return pc; 
        case 2: return rb + program[pc];
    }

}