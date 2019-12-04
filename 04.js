const input = '236491-713787';

// Test...
// console.log(valid('111111'));
// console.log(valid('223450'));
// console.log(valid('123789'));
// console.log(valid('111123'));
// console.log(valid('255148'));
// console.log(valid('133697'));
// console.log(valid('244248'));
// console.log(valid('242200'));
// console.log(valid('239116'));

let n = 0;
for (let i = 236491; i < 713787 + 1; i++) {
    if(valid(i.toString()) == true) {        
        n++;
    }
}
console.log('Del 1: Number of pwd: ' + n);

function valid(ti) {
    for (let i = 0; i < ti.length - 1; i++) {
        const a = parseInt(ti[i]);
        const b = parseInt(ti[i + 1]);
        if(a > b) {
            return false;
        }
    }
    let repeats = ti.match(/(.)\1/);
    if(repeats) { 
        return true;
    }
    return false;
}