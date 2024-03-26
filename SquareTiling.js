class SquareK5Piece {
    position = [0,1,2,3,4]; // F BR BL U D
    moves = [];
    static enumCycles = {
        0: [0,4,1,2,3],
        1: [4,1,3,0,2],
        2: [1,3,2,4,0],
        3: [2,0,4,3,1],
        4: [3,2,0,1,4],   
    }

    constructor(moveNum) {
        this.moves = [
            moveNum % 2 === 1,
            (moveNum >> 1) % 2 === 1,
            (moveNum >> 2) % 2 === 1,
            (moveNum >> 3) % 2 === 1,
            (moveNum >> 4) % 2 === 1,
        ]
    }
    
    move(moveIndex, ccw = false) {
        if (this.moves[moveIndex]) {
            this.position = permute(this.position, SquareK5Piece.enumCycles[moveIndex], ccw);
            this.moves = permute(this.moves, SquareK5Piece.enumCycles[moveIndex], ccw);
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
        ctx.stroke();
        ctx.translate(-x, -y);
    }
    
    isSolved() {
        return this.position.every((v,i,a) => !i || a[i-1] <= v);
    }

    static subInPiece(x, y) {
        if (y < 1) {
            if (x < 1 || x > 2) {
                return null;
            }
            return 4;
        } else if (y > 2) {
            if (x < 1 || x > 2){
                return null;
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

    static getPieceCount() {
        return 1<<5;
    }
}