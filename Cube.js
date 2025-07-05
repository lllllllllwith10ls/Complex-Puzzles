class CubePiece {

    static cubePositions = [
        [],
        [0],
        [1],
        [2],
        [3],
        [4],
        [5],
        [0,1],
        [0,2],
        [0,3],
        [0,4],
        [5,1],
        [5,2],
        [5,3],
        [5,4],
        [1,2],
        [1,4],
        [3,2],
        [3,4],
        [0,1,2],
        [5,1,2],
        [0,3,2],
        [5,3,2],
        [0,1,4],
        [5,1,4],
        [0,3,4],
        [5,3,4],
    ]
    position = [0,1,2,3,4,5]; // F L U R D B
    moves = [];
    static enumCycles = {
        0: [0,2,3,4,1,5],
        1: [4,1,0,3,5,2],
        2: [3,0,2,5,4,1],
        3: [2,1,5,3,0,4],
        4: [1,5,2,0,4,3],
        5: [0,4,1,2,3,5],
    }

    constructor(moveNum) {
        this.position = new Array(6);
        this.moves = new Array(6);
        for (let i = 0; i < this.position.length; i++) {
            if (CubePiece.cubePositions[moveNum].includes(i)) {
                this.position[i] = i;
                this.moves[i] = true;
            } else {
                this.position[i] = -1;
                this.moves[i] = false;
            }
        }
    }
    
    move(moveIndex, ccw = false) {
        if (this.moves[moveIndex]) {
            this.position = permute(this.position, CubePiece.enumCycles[moveIndex], ccw);
            this.moves = permute(this.moves, CubePiece.enumCycles[moveIndex], ccw);
        }
    }
    
    draw(ctx, cols, x, y, size) {
        const spacingX = 3 * size;
        const spacingY = 3 * size;
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.fillStyle = this.isSolved() ? '#005500' : '#333333';
        ctx.strokeRect(-spacingX / 2, -spacingY / 2, spacingX, spacingY);
        ctx.fillRect(-spacingX / 2, -spacingY / 2, spacingX, spacingY);
        drawSquare(ctx, CubePiece.colorPiece(this.position[0], cols), 0, 0, size, 0, this.moves[0]);
        drawSquare(ctx, CubePiece.colorPiece(this.position[1], cols), size, 0, size, 0, this.moves[1]);
        drawSquare(ctx, CubePiece.colorPiece(this.position[2], cols), 0, size, size, 0, this.moves[2]);
        drawSquare(ctx, CubePiece.colorPiece(this.position[3], cols), -size, 0, size, 0, this.moves[3]);
        drawSquare(ctx, CubePiece.colorPiece(this.position[4], cols), 0, -size, size, 0, this.moves[4]);
        drawSquare(ctx, CubePiece.colorPiece(this.position[5], cols), size, size, size, 0, this.moves[5]);
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
        if (y < 1) {
            if (x < 1 || x > 2) {
                return null;
            }
            return 4;
        } else if (y > 2) {
            if (x < 1) {
                return null;
            }
            if (x > 2) {
                return 5;
            }
            return 2;
        } else if (x < 1) {
            return 3;
        } else if (x > 2) {
            return 1;
        } else {
            return 0;
        }
    }

    static getSizes(canvas) {
        const gridX = 6;
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
        return 27;
    }
}

class ComplexCubePiece {

    position = [0, 1, 2, 3, 4, 5]; // F L U R D B
    constructor(moveNum) {
        this.moves = [
            moveNum % 2 === 1,
            (moveNum >> 1) % 2 === 1,
            (moveNum >> 2) % 2 === 1,
            (moveNum >> 3) % 2 === 1,
            (moveNum >> 4) % 2 === 1,
            (moveNum >> 5) % 2 === 1,
        ]
    }
    
    move(moveIndex, ccw = false) {
        if (this.moves[moveIndex]) {
            this.position = permute(this.position, CubePiece.enumCycles[moveIndex], ccw);
            this.moves = permute(this.moves, CubePiece.enumCycles[moveIndex], ccw);
        }
    }
    
    
    draw(ctx, cols, x, y, size) {
        const spacingX = 3 * size;
        const spacingY = 3 * size;
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.fillStyle = this.isSolved() ? '#005500' : '#333333';
        ctx.strokeRect(-spacingX / 2, -spacingY / 2, spacingX, spacingY);
        ctx.fillRect(-spacingX / 2, -spacingY / 2, spacingX, spacingY);
        drawSquare(ctx, cols[this.position[0]], 0, 0, size, 0, this.moves[0]);
        drawSquare(ctx, cols[this.position[1]], size, 0, size, 0, this.moves[1]);
        drawSquare(ctx, cols[this.position[2]], 0, size, size, 0, this.moves[2]);
        drawSquare(ctx, cols[this.position[3]], -size, 0, size, 0, this.moves[3]);
        drawSquare(ctx, cols[this.position[4]], 0, -size, size, 0, this.moves[4]);
        drawSquare(ctx, cols[this.position[5]], size, size, size, 0, this.moves[5]);
        ctx.stroke();
        ctx.translate(-x, -y);
    }
    
    
    isSolved() {
        return this.position.every((v,i,a) => !i || a[i-1] <= v);
    }
    
    static getPieceCount() {
        return 1<<6;
    }
    static getSizes(canvas) {
        const gridX = 1<<3;
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

ComplexCubePiece.subInPiece = CubePiece.subInPiece;