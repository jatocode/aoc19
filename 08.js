const fs = require('fs');
const args = process.argv.slice(2);

const data = fs.readFileSync(args[0], 'utf8');
let lines = data.split('\n');

const imagedata = lines[0].split('');

const layers = decode(imagedata, 25, 6);
console.log(display(layers));

function display(layers) {
    let image = '';
    for (let h = 0; h < layers[0].length; h++) {
        let row = '';
        for (let w = 0; w < layers[0][0].length; w++) { 
            let pixel = 2;
            for (const layer of layers) {
                if(layer[h][w] != 2) {
                    pixel = layer[h][w] == 0 ? ' ' : '🎅';
                    break;
                } 
            }
            row += pixel.toString();
        }
        image += row + '\n';
    }
    return image;
}

function decode(imagedata, width, height) {
    let image = [];
    let min0 = Number.MAX_SAFE_INTEGER;
    let min0layer = -1;
    let l = 0;
    let layerinfo = [];
    for (let i = 0; i < imagedata.length;) {
        let layer = [];
        let num0 = 0;
        let num1 = 0;
        let num2 = 0;
        for (let h = 0; h < height; h++) {
            let row = [];
            for (let w = 0; w < width; w++) {
                let d = parseInt(imagedata[i++]);
                switch (d) {
                    case 0: num0++; break;
                    case 1: num1++; break;
                    case 2: num2++; break;
                }
                row.push(d);
            }
            layer.push(row);
        }
        layerinfo.push({ num0: num0, num1: num1, num2: num2 });
        if (num0 < min0) {
            min0 = num0;
            min0layer = l;
        }
        l++;
        image.push(layer);
    }
    console.log('Del 1:', layerinfo[min0layer].num1 * layerinfo[min0layer].num2);
    console.log();
    return image;
}


