function cycles(cycles, array) {
    for (let i = 0; i < cycles.length; i++) {
        init = array[cycles[i][0]]
        for (let j = 1; j < cycles[i].length; j++)  {
            array[cycles[i][j - 1]] = array[cycles[i][j]];
        }
        array[cycles[i][cycles[i].length - 1]] = init;
    }
    return array;
}

function choose(arr, k, prefix = []) {
    if (k == 0) return [prefix];
    return arr.flatMap((v, i) =>
        choose(arr.slice(i + 1), k - 1, [...prefix, v])
    );
}

class TesPiece {
    static lastClick = null;
    position = [0, 1, 2, 3, 4, 5, 6, 7]; // F L U R D B I O
    static grips = [0, 1, 2, 3, 4, 5, 6, 7];
    static axes = [0, 1, 2, 6];
    moves = [];
    static opposites = {
        0: [0,5],
        1: [1,3],
        2: [2,4],
        3: [1,3],
        4: [2,4],
        5: [0,5],
        6: [6,7],
        7: [6,7],
    };

    static tesPositions = [];

    static caclulateTesPositions(array = [], iteration = 0) {
        if (iteration === 4) {
            TesPiece.tesPositions.push(array);
        } else {
            TesPiece.caclulateTesPositions(array.concat([TesPiece.axes[iteration]]), iteration + 1);
            TesPiece.caclulateTesPositions(array, iteration + 1);
            TesPiece.caclulateTesPositions(array.concat([TesPiece.opposites[TesPiece.axes[iteration]][1]]), iteration + 1);
        }
        if (iteration === 0) {
            TesPiece.tesPositions.sort((a, b) => a.length - b.length);
        }
    }

    static calculateTesMove(x, y) {
        if (TesPiece.opposites[x].includes(x) && TesPiece.opposites[x].includes(y)) {
            return TesPiece.grips;
        } else {
            let array = TesPiece.axes.filter(a => !(TesPiece.opposites[x].includes(a) || TesPiece.opposites[y].includes(a)));
            array = array.map(a => TesPiece.opposites[a]);
            let sign = 1;
            if (x !== TesPiece.opposites[x][0]) {
                sign = -sign;
                x = TesPiece.opposites[x][0];
            }
            if (y !== TesPiece.opposites[y][0]) {
                sign = -sign;
                y = TesPiece.opposites[y][0];
            }
            if (x > y) {
                sign = -sign;
            }
            if (sign == 1) {
                array = [array[0][0], array[1][0], array[0][1], array[1][1]];
            } else {
                array = [array[1][0], array[0][0], array[1][1], array[0][1]];
            }
            return cycles([array], TesPiece.grips.concat());
        }
    }

    

    constructor(moveNum) {
        if (TesPiece.lastClick !== null) {
            TesPiece.lastClick = null;
        }
        if (TesPiece.tesPositions.length == 0) {
            TesPiece.caclulateTesPositions();
        }
        this.position = new Array(8);
        this.moves = new Array(8);
        for (let i = 0; i < this.position.length; i++) {
            if (TesPiece.tesPositions[moveNum].includes(i)) {
                this.position[i] = i;
                this.moves[i] = true;
            } else {
                this.position[i] = -1;
                this.moves[i] = false;
            }
        }
    }
    
    move(moveIndex, ccw = false) {
        if (moveIndex < 0) {
            return;
        }
        let x = Math.floor(moveIndex / 8);
        let y = moveIndex % 8;
        if (this.moves[x]) {
            let permutation = TesPiece.calculateTesMove(x, y);
            this.position = permute(this.position, permutation, ccw);
            this.moves = permute(this.moves, permutation, ccw);
        }
    }

    static piecePositions = [
        [0, 0],
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
    ];
    
    draw(ctx, cols, x, y, size) {
        const spacingX = 3 * size;
        const spacingY = 3 * size;
        size = size * 0.9;
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.fillStyle = this.isSolved() ? '#005500' : '#333333';
        ctx.strokeRect(-spacingX / 2, -spacingY / 2, spacingX, spacingY);
        ctx.fillRect(-spacingX / 2, -spacingY / 2, spacingX, spacingY);
        for (let i = 0; i < TesPiece.grips.length; i++) {
            drawSquare(ctx, TesPiece.colorPiece(this.position[i], cols), size * TesPiece.piecePositions[i][0], size * TesPiece.piecePositions[i][1], size, 0, this.moves[i]);
        }
        if (TesPiece.lastClick !== null) {
            let i = TesPiece.lastClick;
            ctx.strokeStyle = '#FF0';
            drawSquare(ctx, TesPiece.colorPiece(this.position[i], cols), size * TesPiece.piecePositions[i][0], size * TesPiece.piecePositions[i][1], size, 0, this.moves[i]);
        }
        ctx.stroke();
        ctx.translate(-x, -y);
    }

    static colorPiece(piece, cols) {
        if (piece === -1) {
            return "#000000"
        } else {
            return cols[piece];
        }
    }
    
    isSolved() {
        return this.position.every((v,i) => i === v || v === -1);
    }

    static subInPiece(x, y) {
        let result = null;
        if (y < 1) {
            if (x < 1) {
                result = null;
            } else if (x > 2) {
                result = 6;
            } else {
                result = 4;
            }
        } else if (y > 2) {
            if (x < 1) {
                result = 7;
            } else if (x > 2) {
                result = 5;
            } else {
                result = 2;
            }
        } else if (x < 1) {
            result = 3;
        } else if (x > 2) {
            result = 1;
        } else {
            result = 0;
        }
        if (result == null) {
            TesPiece.lastClick = null;
            return -1;
        }
        if (TesPiece.lastClick == null) {
            TesPiece.lastClick = result;
            return -1;
        }
        let value = TesPiece.lastClick * 8 + result; 
        TesPiece.lastClick = null;
        return value;
    }

    static getSizes(canvas) {
        const gridX = 9;
        const size = canvas.height / (3 * gridX);
        const spacingX = 3 * size;
        const spacingY = 3 * size;
        return {
            gridX,
            size,
            spacingX,
            spacingY,
            offsetX: spacingX / 2,
            offsetY: spacingY / 2,
        }
    }

    static getPieceCount() {
        return 81;
    }
}


class ComplexTesPiece {

    position = [0, 1, 2, 3, 4, 5, 6, 7]; // F L U R D B I O
    constructor(moveNum) {
        this.moves = [
            moveNum % 2 === 1,
            (moveNum >> 1) % 2 === 1,
            (moveNum >> 2) % 2 === 1,
            (moveNum >> 3) % 2 === 1,
            (moveNum >> 4) % 2 === 1,
            (moveNum >> 5) % 2 === 1,
            (moveNum >> 6) % 2 === 1,
            (moveNum >> 7) % 2 === 1,
        ]
    }
    
    move(moveIndex, ccw = false) {
        if (moveIndex < 0) {
            return;
        }
        let x = Math.floor(moveIndex / 8);
        let y = moveIndex % 8;
        if (this.moves[x]) {
            let permutation = TesPiece.calculateTesMove(x, y);
            this.position = permute(this.position, permutation, ccw)
            this.moves = permute(this.moves, permutation, ccw);
        }
    }
    
    
    draw(ctx, cols, x, y, size) {
        const spacingX = 3 * size;
        const spacingY = 3 * size;
        size = size * 0.9;
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.fillStyle = this.isSolved() ? '#005500' : '#333333';
        ctx.strokeRect(-spacingX / 2, -spacingY / 2, spacingX, spacingY);
        ctx.fillRect(-spacingX / 2, -spacingY / 2, spacingX, spacingY);
        for (let i = 0; i < TesPiece.grips.length; i++) {
            drawSquare(ctx, cols[this.position[i]], size * TesPiece.piecePositions[i][0], size * TesPiece.piecePositions[i][1], size, 0, this.moves[i]);
        }
        if (TesPiece.lastClick !== null) {
            let i = TesPiece.lastClick;
            ctx.strokeStyle = '#FF0';
            drawSquare(ctx, cols[this.position[i]], size * TesPiece.piecePositions[i][0], size * TesPiece.piecePositions[i][1], size, 0, this.moves[i]);
        }
        ctx.stroke();
        ctx.translate(-x, -y);
    }
    
    
    isSolved() {
        return this.position.every((v,i,a) => !i || a[i-1] <= v);
    }
    
    static getPieceCount() {
        return 1<<8;
    }
    static getSizes(canvas) {
        const gridX = 1<<4;
        const size = canvas.height / (3 * gridX);
        const spacingX = 3 * size;
        const spacingY = 3 * size;
        return {
            gridX,
            size,
            spacingX,
            spacingY,
            offsetX: spacingX / 2,
            offsetY: spacingY / 2,
        }
    }
}

ComplexTesPiece.subInPiece = TesPiece.subInPiece;