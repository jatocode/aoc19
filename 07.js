const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');
const inputprogram = lines[0].split(',').map(x => parseInt(x));

const test1 = [3, 26, 1001, 26, -4, 26, 3, 27, 1002, 27, 2, 27, 1, 27, 26,
    27, 4, 27, 1001, 28, -1, 28, 1005, 28, 6, 99, 0, 0, 5];
const test2 = [3, 52, 1001, 52, -5, 52, 3, 53, 1, 52, 56, 54, 1007, 54, 5, 55, 1005, 55, 26, 1001, 54,
    -5, 54, 1105, 1, 12, 1, 53, 54, 53, 1008, 54, 0, 55, 1001, 55, 1, 55, 2, 53, 55, 53, 4,
    53, 1001, 56, -1, 56, 1005, 56, 6, 99, 0, 0, 0, 0, 10];

let processes = [];

console.assert(amplifiers([9, 8, 7, 6, 5], test1) == 139629729);
console.assert(amplifiers([9, 7, 8, 5, 6], test2) == 18216);
console.assert(findMax(test1) == 139629729);
console.assert(findMax(test2) == 18216);

// Del 2
console.log(findMax(inputprogram));

function findMax(program, min = 5, max = 10) {
    let maxoutput = 0;
    let seqs = sequences(min, max);
    for (const ps of seqs) {
        let output = amplifiers(ps, program);
        if (output > maxoutput) {
            maxoutput = output;
        }
    }
    return maxoutput;
}

function amplifiers(phaseSeq, program) {
    processes = []; 
    for (let i = 0; i < 5; i++) {
        processes.push({
            pc: 0,
            p: [...program],
            i: 0,
            o: 0,
            wait: true,
            phase: false,
            done: false
        });
    }
    processes[0].wait = false; // Vänta inte på första input, ta 0:an

    while (processes[4].done == false) {
        computer(0, 1, phaseSeq[0]);
        computer(1, 2, phaseSeq[1]);
        computer(2, 3, phaseSeq[2]);
        computer(3, 4, phaseSeq[3]);
        computer(4, 0, phaseSeq[4]);
    }
    return processes[4].o;
}

function computer(amp, nextamp, phase) {
    let a, b, o;
    let running = true;
    let pc = processes[amp].pc;
    let program = processes[amp].p;
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
                if (!processes[amp].phase) {
                    program[a] = phase;
                    processes[amp].phase = true;
                    pc += 2;
                } else {
                    if (processes[amp].wait == false) {
                        program[a] = processes[amp].i;
                        processes[amp].wait = true;
                        pc += 2;
                    } else {
                        running = false;
                    }
                }
                break;
            case 4:
                processes[nextamp].wait = false;
                processes[nextamp].i = program[a];
                processes[amp].o = program[a];
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
                processes[amp].done = true;
                break;
            default:
                break;
        }
    }
    processes[amp].pc = pc;
}

// Ok, det här känns onödigt knövligt för att generera phase-grejorna men orkar inte städa
function sequences(min = 5, max = 10) {
    let s = [];
    for (let a1 = min; a1 < max; a1++) {
        for (let a2 = min; a2 < max; a2++) {
            if (a2 == a1) continue;
            for (let a3 = min; a3 < max; a3++) {
                if (a3 == a2 || a3 == a1) continue;
                for (let a4 = min; a4 < max; a4++) {
                    if (a4 == a3 || a4 == a2 || a4 == a1) continue;
                    for (let a5 = min; a5 < max; a5++) {
                        if (a5 == a4 || a5 == a3 || a5 == a2 || a5 == a1) continue;
                        let ps = [a1, a2, a3, a4, a5];
                        s.push(ps);
                    }
                }
            }
        }
    }
    return s;
}
