const sqrt3 = Math.sqrt(3);

class TetPiece {
    position = [0,1,2,3]; // F BR BL D
    moves = [];
    static enumCycles = {
        0: [0,2,3,1],
        1: [3,1,0,2],
        2: [1,3,2,0],
        3: [2,0,1,3],   
    }

    constructor(moveNum) {
        this.moves = [
            moveNum % 2 === 1,
            (moveNum >> 1) % 2 === 1,
            (moveNum >> 2) % 2 === 1,
            (moveNum >> 3) % 2 === 1,
        ]
    }
    
    move(moveIndex, ccw = false) {
        if (this.moves[moveIndex]) {
            this.position = permute(this.position, TetPiece.enumCycles[moveIndex], ccw);
            this.moves = permute(this.moves, TetPiece.enumCycles[moveIndex], ccw);
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

    static subInPiece(x, y) {
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

    static getSizes(canvas) {
        const gridX = 4;
        const size = canvas.width / (sqrt3 * gridX);
        return {
            gridX,
            size,
            spacingX: sqrt3 * size,
            spacingY: 3 * size / 2,
            offsetX: sqrt3 * size / 2,
            offsetY: size / 2,
        }
    }

    static getPieceCount() {
        return 1<<4;
    }
}

class TriplexTetPiece {
    position = [0,1,2,3]; // F BR BL D
    moves = [];
    static enumCycles = {
        0: [0,2,3,1],
        1: [3,1,0,2],
        2: [1,3,2,0],
        3: [2,0,1,3],   
    }

    constructor(moveNum) {
        this.moves = [
            moveNum % 3,
            Math.floor(moveNum / 3) % 3,
            Math.floor(moveNum / 9) % 3,
            Math.floor(moveNum / 27) % 3,
        ]
    }
    
    move(moveIndex, ccw = false) {
        if (this.moves[moveIndex] > 0) {
            const dir = this.moves[moveIndex] === 2;
            this.position = permute(this.position, TetPiece.enumCycles[moveIndex], dir != ccw);
            this.moves = permute(this.moves, TetPiece.enumCycles[moveIndex], dir != ccw);
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
        drawTriangle(ctx, cols[this.position[0]], 0, 0, smallRad, Math.PI - angle, this.moves[0] > 0, this.moves[0] === 1 ? '#000': '#555');
        drawTriangle(ctx, cols[this.position[3]], 0, smallRad, smallRad, -angle, this.moves[3] > 0, this.moves[3] === 1 ? '#000': '#555');
        drawTriangle(ctx, cols[this.position[1]], ...pointOnCircle(smallRad, -angle), smallRad, -angle, this.moves[1] > 0, this.moves[1] === 1 ? '#000': '#555');
        drawTriangle(ctx, cols[this.position[2]], ...pointOnCircle(smallRad, -5 * angle), smallRad, -angle, this.moves[2] > 0, this.moves[2] === 1 ? '#000': '#555');
        ctx.stroke();
        ctx.translate(-x, -y);
    }
    
    isSolved() {
        return this.position.every((v,i,a) => !i || a[i-1] <= v);
    }

    static subInPiece(x, y) {
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

    static getSizes(canvas) {
        const gridX = 9;
        const size = canvas.width / (sqrt3 * gridX);
        return {
            gridX,
            size,
            spacingX: sqrt3 * size,
            spacingY: 3 * size / 2,
            offsetX: sqrt3 * size / 2,
            offsetY: size / 2,
        }
    }

    static getPieceCount() {
        return 3**4;
    }
}
