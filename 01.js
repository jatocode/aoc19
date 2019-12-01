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
        let fuel = (Math.floor(mass / 3)) - 2;
        // console.log(mass, fuel);
        totalfuel += fuel;
    }
    console.log(totalfuel);
});