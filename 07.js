const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');
const inputprog = lines[0].split(',').map(x => parseInt(x));

//Test
console.assert(amplifiers([4, 3, 2, 1, 0],
    [3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0]) == 43210);
console.assert(amplifiers([0, 1, 2, 3, 4], [3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23,
    101, 5, 23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0]) == 54321);
console.assert(amplifiers([1, 0, 4, 3, 2], [3, 31, 3, 32, 1002, 32, 10, 32, 1001, 31, -2, 31, 1007, 31, 0, 33,
    1002, 33, 7, 33, 1, 33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0]) == 65210);
// More test
findMax([3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0]);
findMax([3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23,
    101, 5, 23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0]);
findMax([3, 31, 3, 32, 1002, 32, 10, 32, 1001, 31, -2, 31, 1007, 31, 0, 33,
    1002, 33, 7, 33, 1, 33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0]);

findMax(inputprog);

function findMax(program) {
    let maxoutput = 0;
    let maxps = [];
    for (let a1 = 0; a1 < 5; a1++) {
        for (let a2 = 0; a2 < 5; a2++) {
            if(a2 == a1) continue;
            for (let a3 = 0; a3 < 5; a3++) {
                if(a3 == a2 || a3 == a1) continue;
                for (let a4 = 0; a4 < 5; a4++) {
                    if(a4 == a3|| a4 == a2 || a4 == a1) continue;
                    for (let a5 = 0; a5 < 5; a5++) {
                        if(a5 == a4|| a5 == a3 || a5 == a2 || a5 == a1) continue;
                        let ps = [a1, a2, a3, a4, a5];
                        let output = amplifiers(ps, [...program]);
                        //console.log(ps, output);
                        if(output > maxoutput) {
                            maxoutput = output;
                            maxps = ps;
                        }
                    }
                }
            }
        }
    }
    console.log(maxps, maxoutput);
}

function amplifiers(phaseSeq, program) {
    let input = 0;
    let output = 0;
    for (const phase of phaseSeq) {
        input = output;
        output = computer([...program], phase, input);
    }
    return output;
}

function computer(program, phase, input) {
    let a, b, o, pc = 0;
    let running = true;
    let phasePassDone = false;
    let output = 0;
    while (running) {
        let instruction = program[pc].toString();
        let len = instruction.length - 1;
        let o2 = instruction[len - 1] == undefined ? '0' : instruction[len - 1];
        let opcode = parseInt(o2 + instruction[len]);

        let modeC = instruction[len - 2] == undefined ? 0 : parseInt(instruction[len - 2]);
        let modeB = instruction[len - 3] == undefined ? 0 : parseInt(instruction[len - 3]);
        let modeA = instruction[len - 4] == undefined ? 0 : parseInt(instruction[len - 4]);

        a = (modeC == 0) ? program[pc + 1] : pc + 1;
        b = (modeB == 0) ? program[pc + 2] : pc + 2;
        o = (modeA == 0) ? program[pc + 3] : pc + 3;

        switch (opcode) {
            case 1:
                program[o] = program[a] + program[b];
                pc += 4;
                break;
            case 2:
                program[o] = program[a] * program[b];
                pc += 4;
                break;
            case 3:
                if (!phasePassDone) {
                    program[a] = phase;
                    phasePassDone = true;
                } else {
                    program[a] = input;
                }
                pc += 2;
                break;
            case 4:
                //console.log(`Output (${pc}): ${program[a]}`);
                output = program[a];
                pc += 2;
                break;
            case 5:
                if (program[a] != 0) {
                    pc = program[b];
                } else {
                    pc += 3;
                }
                break;
            case 6:
                if (program[a] == 0) {
                    pc = program[b];
                } else {
                    pc += 3;
                }
                break;
            case 7:
                if (program[a] < program[b]) {
                    program[o] = 1;
                } else {
                    program[o] = 0;
                }
                pc += 4;
                break;
            case 8:
                if (program[a] == program[b]) {
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
    return output;
}

