const enumMoves = {
    F: 0,
    R: 1,
    L: 2,
    D: 3,
}

const enumCycles = {
    0: [0,2,3,1],
    1: [3,1,0,2],
    2: [1,3,2,0],
    3: [2,0,1,3],
}

const cols = ['#008800', '#000088', '#880000', '#bbbb00'];
const sqrt3 = Math.sqrt(3);

const permute = (arr, order, ccw = false) => {
    const newArr = Array(arr.length);
    if (ccw) {
        for (let i = 0; i < arr.length; newArr[order[i]] = arr[i++]);
    } else {
        for (let i = 0; i < arr.length; newArr[i] = arr[order[i++]]);
    }
    return newArr;
}

function pointOnCircle(rad, angle) {
    return [rad * Math.cos(angle), rad * Math.sin(angle)];
}

function drawTriangle(ctx, col, centreX, centreY, rad, angle, circle = false) {
    const points = [
        pointOnCircle(rad, angle), 
        pointOnCircle(rad, angle + 2 * Math.PI / 3), 
        pointOnCircle(rad, angle - 2 * Math.PI / 3)
    ];
    ctx.fillStyle = col;
    ctx.translate(centreX, centreY);
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    ctx.lineTo(...points[1]);
    ctx.lineTo(...points[2]);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (circle) {
        const cRad = rad / 4
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(cRad, 0);
        ctx.arc(0, 0, cRad, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
    ctx.translate(-centreX, -centreY);
}

function subInTri(x, y) {
    if (y > (3 - sqrt3 * Math.abs(2 * x - sqrt3)) / 2) {
        return null;
    } else if (y > 0.75) {
        return 3;
    } else if (y < (sqrt3 * Math.abs(2 * x - sqrt3)) / 2) {
        return x > sqrt3/2 ? 1 : 2;
    } else {
        return 0;
    }
}

class Piece {
    ctx;
    position = [0,1,2,3]; // F BR BL D
    moves = [];
    
    constructor(moves) {
        this.moves = moves;
    }
    
    move(moveIndex, ccw = false) {
        if (this.moves[moveIndex]) {
            this.position = permute(this.position, enumCycles[moveIndex], ccw);
            this.moves = permute(this.moves, enumCycles[moveIndex], ccw);
        }
    }
    
    draw(ctx, cols, x, y, size) {
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.fillStyle = this.isSolved() ? '#005500' : '#333333';
        ctx.strokeRect((-sqrt3 * size) / 2, -size / 2, sqrt3 * size, (3 * size) / 2);
        ctx.fillRect((-sqrt3 * size) / 2, -size / 2, sqrt3 * size, (3 * size) / 2);
        const smallRad = size / 2;
        const angle = Math.PI / 6;
        drawTriangle(ctx, cols[this.position[0]], 0, 0, smallRad, Math.PI - angle, this.moves[0]);
        drawTriangle(ctx, cols[this.position[3]], 0, smallRad, smallRad, -angle, this.moves[3]);
        drawTriangle(ctx, cols[this.position[1]], ...pointOnCircle(smallRad, -angle), smallRad, -angle, this.moves[1]);
        drawTriangle(ctx, cols[this.position[2]], ...pointOnCircle(smallRad, -5 * angle), smallRad, -angle, this.moves[2]);
        ctx.stroke();
        ctx.translate(-x, -y);
    }
    
    isSolved() {
        return this.position.every((v,i,a) => !i || a[i-1] <= v);
    }
}

function getSizes(canvas) {
    const size = canvas.height / 6
    return {
        size,
        spacingX: sqrt3 * size,
        spacingY: 3 * size / 2,
    }
}

const pieces = Array(16);

function scramble() {
    for(let i = 0; i < 100; ++i) {
        pieces.forEach(x => x.move(Math.floor(Math.random() * 4), Math.random() > 0.5));
    }
    update();
}

function reset() {
    for (let i = 0; i < 16; ++i) {
        pieces[i] = new Piece([
            i % 2 === 0,
            (i >> 1) % 2 === 0,
            (i >> 2) % 2 === 0,
            (i >> 3) % 2 === 0,
        ])
    }
    update();
}

function initialise() {
    const canvas = document.getElementById('canvas');
    const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
    const canvasTop = canvas.offsetTop + canvas.clientTop;
    const ctx = canvas.getContext('2d');
    const { size, spacingX, spacingY } = getSizes(canvas);
    canvas.addEventListener('mousedown', function(event) {
        event.preventDefault();
        var clickX = event.pageX - canvasLeft, clickY = event.pageY - canvasTop;
        var gridX = Math.floor(clickX / spacingX), gridY = Math.floor(clickY / spacingY);
        var subX = (clickX % spacingX) / size, subY = (clickY % spacingY) / size;

        var subTri = subInTri(subX, subY);

        if (subTri !== null) {
            pieces.forEach(x => x.move(subTri, event.button === 0));
            update();
        }
    });
    
    reset();
}

function display() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const { size, spacingX, spacingY } = getSizes(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(spacingX / 2, size / 2);
    for (let i = 0; i < 16; ++i) {
        pieces[i].draw(ctx, cols, (3 - i % 4) * spacingX, (3 - (i >> 2) % 4) * spacingY, size);
    }
    ctx.translate(-spacingX / 2, -size / 2)
}

function update() {
    display();
}

window.onload = initialise;