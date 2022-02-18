class TriPrismPiece {
    position = [0,1,2,3,4]; // F BR BL U D
    moves = [];
    static enumCycles = {
        0: [0,2,1,4,3],
        1: [2,1,0,4,3],
        2: [1,0,2,4,3],
        3: [1,2,0,3,4],
        4: [2,0,1,3,4],   
    }

    constructor(moveNum) {
        this.moves = [
            moveNum % 2 === 0,
            (moveNum >> 1) % 2 === 0,
            (moveNum >> 2) % 2 === 0,
            (moveNum >> 3) % 2 === 0,
            (moveNum >> 4) % 2 === 0,
        ]
    }
    
    move(moveIndex, ccw = false) {
        if (this.moves[moveIndex]) {
            this.position = permute(this.position, TriPrismPiece.enumCycles[moveIndex], ccw);
            this.moves = permute(this.moves, TriPrismPiece.enumCycles[moveIndex], ccw);
        }
    }
    
    draw(ctx, cols, x, y, size) {
        const spacingX = 3 * size;
        const spacingY = size * (1 + sqrt3);
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.fillStyle = this.isSolved() ? '#005500' : '#333333';
        ctx.strokeRect(-spacingX / 2, -spacingY / 2, spacingX, spacingY);
        ctx.fillRect(-spacingX / 2, -spacingY / 2, spacingX, spacingY);
        const triRad = size / sqrt3;
        const angle = Math.PI / 6;
        drawSquare(ctx, cols[this.position[0]], 0, 0, size, 0, this.moves[0]);
        drawSquare(ctx, cols[this.position[1]], size, 0, size, 0, this.moves[1]);
        drawSquare(ctx, cols[this.position[2]], -size, 0, size, 0, this.moves[2]);
        drawTriangle(ctx, cols[this.position[3]], 0, -size * (1 + 1 / sqrt3) / 2, triRad, -Math.PI / 2, this.moves[3]);
        drawTriangle(ctx, cols[this.position[4]], 0, size * (1 + 1 / sqrt3) / 2, triRad, Math.PI / 2, this.moves[4]);
        ctx.stroke();
        ctx.translate(-x, -y);
    }
    
    isSolved() {
        return this.position.every((v,i,a) => !i || a[i-1] <= v);
    }

    static subInPiece(x, y) {
        if (y < sqrt3 / 2) {
            if (y < sqrt3 * (Math.abs(x - 1.5))) {
                return null;
            }
            return 3;
        } else if (y > 1 + sqrt3 / 2) {
            if (y > (1 + sqrt3) - sqrt3 * Math.abs(x - 1.5)){
                return null;
            }
            return 4;
        } else if (x < 1) {
            return 2;
        } else if (x > 2) {
            return 1;
        } else {
            return 0;
        }
    }

    static getSizes(canvas) {
        const size = canvas.height / 12;
        const spacingX = 3 * size;
        const spacingY = size * (1 + sqrt3)
        return {
            size,
            spacingX,
            spacingY,
            offsetX: spacingX / 2,
            offsetY: spacingY / 2,
        }
    }
}