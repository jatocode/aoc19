const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');
const inputprogram = lines[0].split(',').map(x => parseInt(x));

let processes = [{
    pc: 0,
    p: [...inputprogram],
    i: 0,
    o: 0,
    wait: true,
    done: false
}];


let rx = 0;
let ry = 0;
let dir = 0;
let oc = 0;

let hull = [];
let visited = [];

intcode(0, camera, paintrobot);
console.log(Object.keys(visited).length);

function paintrobot(x) {
    if (oc++ % 2 == 0) {
        // Paint
        switch (x) {
            case 0:
                // if (hull[ry] == undefined) hull[ry] = [];
                // hull[ry][rx] = '.';
                hull[`${rx},${ry}`] = '.'; 
                break;
            case 1:
                // if (hull[ry] == undefined) hull[ry] = [];
                // hull[ry][rx] = '#';
                hull[`${rx},${ry}`] = '#'; 
                break;
            default: break;
        }
        if(visited[`${rx},${ry}`] == undefined) visited[`${rx},${ry}`] = 0;
        visited[`${rx},${ry}`] += 1;
    } else {
        const d = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        switch (x) {
            case 0: dir--; break; // Turn left 90
            case 1: dir++; break; // Turn right 90
        }
        if(dir == -1) dir = 3;
        if(dir == 4) dir = 0;
        rx += d[dir][0];
        ry += d[dir][1];
    }
}

function camera() {
    let color = hull[`${rx},${ry}`] == undefined ? '.' : hull[`${rx},${ry}`];
    //let color = hull[ry] == undefined ? '.' : hull[ry][rx] == undefined ? '.' : hull[ry][rx] == undefined;
    return color == '.' ? 0 : 1;
}

function intcode(pid, input = () => { return 0 }, output = (x) => { console.log(`Output: ${x}`) }) {
    let a, b, o = 0;
    let rb = 0;
    let running = true;
    let lastout = undefined;

    let program = processes[pid].p;
    let pc = processes[pid].pc;
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
        processes[pid].pc = pc;
    }
    return lastout;
}