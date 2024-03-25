class Tri7T3Piece {
    position = [0,1,2,3,4,5,6]; // O A1 A2 A3 B1 B2 B3
    moves = [];
    static enumCycles = {
        0: [0,2,3,1,5,6,4],
        1: [3,1,6,5,2,0,4],
        2: [1,6,2,4,5,3,0],
        3: [2,5,4,3,0,6,1],
        4: [6,2,5,0,4,1,3],
        5: [4,0,3,6,1,5,2],
        6: [5,4,0,1,3,2,6],   
    }

    constructor(moveNum) {
        this.moves = [
            moveNum % 2 === 1,
            (moveNum >> 1) % 2 === 1,
            (moveNum >> 2) % 2 === 1,
            (moveNum >> 3) % 2 === 1,
            (moveNum >> 4) % 2 === 1,
            (moveNum >> 5) % 2 === 1,
            (moveNum >> 6) % 2 === 1,
        ]
    }
    
    move(moveIndex, ccw = false) {
        if (this.moves[moveIndex]) {
            this.position = permute(this.position, Tri7T3Piece.enumCycles[moveIndex], ccw);
            this.moves = permute(this.moves, Tri7T3Piece.enumCycles[moveIndex], ccw);
        }
    }
    
    draw(ctx, cols, x, y, size) {
        const spacingX = 5/2 * size;
        const spacingY = 9/4 * size;
        const smallRad = size / 2;
        const angle = Math.PI / 6;
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.fillStyle = this.isSolved() ? '#005500' : '#333333';
        ctx.strokeRect(-spacingX / 2, -spacingY / 2 - smallRad/3, spacingX, spacingY);
        ctx.fillRect(-spacingX / 2, -spacingY / 2 - smallRad/3, spacingX, spacingY);
        // ctx.strokeRect((-sqrt3 * size) / 2, -size / 2, sqrt3 * size, (3 * size) / 2);
        // ctx.fillRect((-sqrt3 * size) / 2, -size / 2, sqrt3 * size, (3 * size) / 2);
        drawTriangle(ctx, cols[this.position[0]], 0, 0, smallRad, Math.PI - angle, this.moves[0]);
        drawTriangle(ctx, cols[this.position[1]], ...pointOnCircle(smallRad, -angle), smallRad, -angle, this.moves[1]);
        drawTriangle(ctx, cols[this.position[2]], ...pointOnCircle(smallRad, -5 * angle), smallRad, -angle, this.moves[2]);
        drawTriangle(ctx, cols[this.position[3]], 0, smallRad, smallRad, -angle, this.moves[3]);
        drawTriangle(ctx, cols[this.position[4]], 0, -size, smallRad, -angle, this.moves[4]);
        drawTriangle(ctx, cols[this.position[5]], ...pointOnCircle(-size, -angle), smallRad, -angle, this.moves[5]);
        drawTriangle(ctx, cols[this.position[6]], ...pointOnCircle(-size, -5 * angle), smallRad, -angle, this.moves[6]);
        ctx.stroke();
        ctx.translate(-x, -y);
    }
    
    isSolved() {
        return this.position.every((v,i,a) => !i || a[i-1] <= v);
    }

    static subInPiece(x, y) {
        const D = y < 6/4;
        const UR = y > 3/4 + (x - 5/4)*sqrt3;
        const UL = y > 3/4 - (x - 5/4)*sqrt3;
        const U = y > 3/4;
        const DL = y < 9/4 + (x-5/4)*sqrt3;
        const DR = y < 9/4 - (x-5/4)*sqrt3;
        if (U & DL * DR) {
            if (D & UR & UL) {
                return 0;
            } else if (!D) {
                return 3;
            } else if (!UR) {
                return 1;
            } else if (!UL) {
                return 2;
            }
        } else if (!UR & !UL) {
            return 4;
        } else if (!UR & !D & (y < 6/4 - (x-5/2)*sqrt3)) {
            return 6;
        } else if (!UL & !D & (y < 6/4 + (x)*sqrt3)) {
            return 5
        }
    }

    static getSizes(canvas) {
        const gridX = 1<<4;
        const size = canvas.height / (5/2 * gridX);
        const spacingX = 5/2 * size;
        const spacingY = 9/4 * size
        return {
            gridX,
            size,
            spacingX,
            spacingY,
            offsetX: spacingX / 2,
            offsetY: spacingY / 2 + size / 6,
        }
    }

    static getPieceCount() {
        return 1<<7;
    }
}