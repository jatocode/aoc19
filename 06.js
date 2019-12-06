const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');

let lines = data.split('\n');
let orbits = [];
for (line of lines) {
    if(line.length == 0) continue;
    let o1, o2;
    [_, o1, o2] = line.match(/(.*)\)(.*)/);
    if (orbits.length == 0) {
        orbits.push({ o: o1, parent: null, children: [] });
    }
    let p2 = orbits.find(x => x.o == o2);
    if (p2 == null) {
        p2 = { o: o2, parent: o1, children: [] };
        orbits.push(p2);
    }

    let p1 = orbits.find(x => x.o == o1);
    if (p1 == null) {
        p1 = { o: o1, parent: null, children: [] };
        orbits.push(p1);
    }

    p2.parent = p1;
    p1.children.push(p2);
}

let n = 0;
for (const o of orbits) {
    let c = countParent(o);
    n += c[0];
    console.log(o, c[0], c[1]);
}
console.log(n);

function countParent(start) {
    let c = 0;
    let plist = [];
    (function recurse(current) {
        if(current.parent != null) {
            c++;
            recurse(current.parent);    
            plist.push(current.parent);
        }
    })(start);
    return [c,plist];
}

function dfs(callback, start) {
    (function recurse(current) {
        console.log(current.children);
        for (const child of current.children) {
            recurse(child);
        }
        callback(current);
    })(start);
};