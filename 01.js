var fs = require('fs');
var args = process.argv.slice(2);

function read(file, parse) {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        parse(data);
    });
}

read(args[0], function (data) {
    let lines = data.split('\n');
    let totalfuel = 0;
    for(line of lines) {
        let mass = parseFloat(line);
        totalfuel += calcfuel(0, mass);
    }
    console.log(totalfuel);
});

function calcfuel(total, mass) {
    let fuel = (Math.floor(mass / 3)) - 2;
    if(fuel > 0) {
        return calcfuel(total + fuel, fuel);
    }   
    return total;
}