const input = '236491-713787';

// Test 1
// console.log(valid('111111'));
// console.log(valid('223450'));
// console.log(valid('123789'));
// console.log(valid('111123'));

// Test 2
console.log(valid('112233'));
console.log(valid('123444'));
console.log(valid('111122'));

let n = 0;
for (let i = 236491; i < 713787 + 1; i++) {
    if(valid(i.toString()) == true) {        
        n++;
    }
}
console.log('Del 2: Number of pwd: ' + n);

function valid(ti) {
    for (let i = 0; i < ti.length - 1; i++) {
        const a = parseInt(ti[i]);
        const b = parseInt(ti[i + 1]);
        if (a > b) {
            return false;
        }
    }
    // Find repeating
    let repeats = ti.match(/(.)\1{2,}/g);

    // Find doubles only
    let doubles = ti.match(/(.)\1/g);
    if (doubles) {
        if (repeats) {
            // Städa bort de som ingår i repeterade
            doubles = doubles.filter(d => {
                for (r of repeats) {
                    if (r.startsWith(d)) {
                        return false;
                    }
                }
                return true;
            });
        }
        if (doubles.length > 0) {
            return true;
        }
    }

    return false;
}