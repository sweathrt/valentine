const slider =document.querySelector('#love-slider').addEventListener("change", (e) => {
    if (e.target.checked) {
        document.querySelector('#heart-canvas').style.visibility = "visible";
        document.querySelector('#congrats-container').style.visibility = "hidden";
    } else {
        document.querySelector('#heart-canvas').style.visibility = "hidden";
        document.querySelector('#congrats-container').style.visibility = "visible";
    }
});

function switchScript() {
    var heart_visibility = document.getElementById("heart-canvas").style.visibility;
    if (heart_visibility === "hidden") {
        heart_visibility = "visible";
    } else {
        heart_visibility = "hidden";
    }
}

const ctx = document.getElementById("heart-canvas").getContext("2d");

const WIDTH = HEIGHT = 800;
const x_offset = WIDTH / 2;
const y_offset = HEIGHT / 2;
const ch_width = 14, ch_height = 16;
const cols = Math.floor(WIDTH / ch_width), rows = Math.floor(HEIGHT / ch_height);
const chars = " .,-~:;=!*#$@@";

// zBuffer array, stores z-values of each character
var zBuffer = new Array(rows)
for (let row = 0; row < zBuffer.length; row++) {
    zBuffer[row] = new Array(cols).fill(0);
}

// charBuffer array, stores characters to output
var charBuffer = new Array(rows)
for (let row = 0; row < charBuffer.length; row++) {
  charBuffer[row] = new Array(cols).fill(' ');
}

var theta = 0;

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    let maxz = 0, c = Math.cos(theta), s = Math.sin(theta);
    for (let y = -1; y <= 1; y += .01) {
        // Add the beating effect
        let r = 0.7 + 0.6 * Math.pow(0.5 + 0.2 * Math.sin(theta * 3 + y), 3);
        for (let x = -1; x <= 1; x += .01) {
            let z = -x * x - Math.pow(1.1 * y - Math.abs(x) * 2 / 3, 2) + r * r;
            if (z < 0) {
                continue;
            }
            z = Math.sqrt(z) / (2 - y);

            for (let tz = -z; tz <= z; tz += z / 2) {
                // rotated x & z (rotating is done )
                let nx = x * c - tz * s, nz = x * s + tz * c;

                // Add perspective
                let p = (1 + nz) / 2;
                let vx = Math.round((nx * p + 1) * x_offset / ch_width);
                let vy = Math.round((-y * p + 1) *  y_offset / ch_height);
                if (zBuffer[vy][vx] <= nz) {
                    zBuffer[vy][vx] = nz;
                    if (maxz < nz) {
                        maxz = nz;
                    }
                    charBuffer[vy][vx] = chars[Math.round(zBuffer[vy][vx] / maxz * 12)];
                }
            }
        }
    }

    charBuffer.forEach((row, y) => {
        row.forEach((col, x) => {
            ctx.font="bold 17px Consolas"
            ctx.fillStyle = `rgb(237, 41, 57)`;
            ctx.fillText(charBuffer[y][x], x * ch_width, (y + 3) * ch_height);

            zBuffer[y][x] = 0;
            charBuffer[y][x] = ' ';
        });
    });

    theta += 0.03 + Math.random() * 0.02;
}

setInterval(draw, 50)