var intcode = function intcode(program, input = () => { return 0 }, output = (x) => { console.log(`Output: ${x}`) }) {
    let a, b, o, pc = 0;
    let rb = 0;
    let running = true;
    let lastout = undefined;

    // Två hjälpmetoder
    let get = (pc) => {
        return program[pc] != undefined ? program[pc] : 0;
    }
    let getPointer = (pc, mode) => {
        switch (mode) {
            case 0: return program[pc];
            case 1: return pc;
            case 2: return rb + program[pc];
        }
    }

    while (running) {
        let instruction = program[pc].toString();
        let len = instruction.length - 1;
        let o2 = instruction[len - 1] == undefined ? '0' : instruction[len - 1];
        let opcode = parseInt(o2 + instruction[len]);

        let modeC = instruction[len - 2] == undefined ? 0 : parseInt(instruction[len - 2]);
        let modeB = instruction[len - 3] == undefined ? 0 : parseInt(instruction[len - 3]);
        let modeA = instruction[len - 4] == undefined ? 0 : parseInt(instruction[len - 4]);

        a = getPointer(pc + 1, modeC);
        b = getPointer(pc + 2, modeB);
        o = getPointer(pc + 3, modeA);

        switch (opcode) {
            case 1:
                program[o] = get(a) + get(b);
                pc += 4;
                break;
            case 2:
                program[o] = get(a) * get(b);
                pc += 4;
                break;
            case 3:
                program[a] = input();
                pc += 2;
                break;
            case 4:
                lastout = program[a];
                output(lastout);
                pc += 2;
                break;
            case 5:
                if (get(a) != 0) {
                    pc = get(b)
                } else {
                    pc += 3;
                }
                break;
            case 6:
                if (get(a) == 0) {
                    pc = get(b);
                } else {
                    pc += 3;
                }
                break;
            case 7:
                if (get(a) < get(b)) {
                    program[o] = 1;
                } else {
                    program[o] = 0;
                }
                pc += 4;
                break;
            case 8:
                if (get(a) == get(b)) {
                    program[o] = 1;
                } else {
                    program[o] = 0;
                }
                pc += 4;
                break;
            case 9:
                rb += get(a);
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
    return lastout;
}

module.exports = intcode;