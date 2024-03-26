class HemiDodecPiece {
    position = [0,1,2,3,4,5];
    moves = [];
    static enumCycles = {
        0: [0,2,3,4,5,1],
        1: [5,1,0,4,2,3],
        2: [1,4,2,0,5,3],
        3: [2,4,5,3,0,1],
        4: [3,2,5,1,4,0],
        5: [4,0,3,1,2,5],   
    }

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
            this.position = permute(this.position, HemiDodecPiece.enumCycles[moveIndex], !ccw);
            this.moves = permute(this.moves, HemiDodecPiece.enumCycles[moveIndex], !ccw);
        }
    }
    
    draw(ctx, cols, x, y, size) {
        const spacingX = size * (Math.sin(2*Math.PI/5) * 4 + 2 * Math.sin(Math.PI/5));
        const spacingY = size * (1+2*Math.cos(Math.PI/5)) * (1+Math.cos(Math.PI/5));
        const iRad = size * Math.cos(Math.PI/5);
        const angle = Math.PI / 10;
        ctx.translate(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.fillStyle = this.isSolved() ? '#005500' : '#333333';
        ctx.strokeRect(-spacingX / 2, -spacingX / 2 - size * (1 - Math.cos(Math.PI/5)), spacingX, spacingY);
        ctx.fillRect(-spacingX / 2, -spacingX / 2 - size * (1 - Math.cos(Math.PI/5)), spacingX, spacingY);
        drawPentagon(ctx, cols[this.position[0]], 0, 0, size, Math.PI - angle, this.moves[0]);
        drawPentagon(ctx, cols[this.position[1]], 0, -2 * iRad, size, -angle, this.moves[1]);
        drawPentagon(ctx, cols[this.position[2]], ...pointOnCircle(2 * iRad, -angle), size, -angle, this.moves[2]);
        drawPentagon(ctx, cols[this.position[3]], ...pointOnCircle(2 * iRad, 3*angle), size, -angle, this.moves[3]);
        drawPentagon(ctx, cols[this.position[4]], ...pointOnCircle(2 * iRad, 7*angle), size, -angle, this.moves[4]);
        drawPentagon(ctx, cols[this.position[5]], ...pointOnCircle(2 * iRad, 11*angle), size, -angle, this.moves[5]);
        ctx.stroke();
        ctx.translate(-x, -y);
    }
    
    isSolved() {
        return this.position.every((v,i,a) => !i || a[i-1] <= v);
    }

    static subInPiece(x, y) {
        const cX = (Math.sin(2*Math.PI/5) * 2 + Math.sin(Math.PI/5));
        const cY = (1+2*Math.cos(Math.PI/5));
        const bigR = 2*Math.sin(Math.PI/5);
        const iRad = Math.cos(Math.PI/5);
        function inPent(x,y,cx,cy) {
            let tx = x-cx;
            let ty = y-cy;
            return (iRad > Math.sqrt(tx**2+ty**2)*Math.cos((Math.atan2(tx,-ty)+Math.PI/5 + 2*Math.PI) % (2*Math.PI/5) - Math.PI/5));
        }
        if (inPent(x,y,cX,cY)) {
            return 0;
        } else if (inPent(x,y,cX,1)) {
            return 1;
        } else if (inPent(x-cX,y-cY,...pointOnCircle(bigR,-Math.PI/10))) {
            return 2;
        } else if (inPent(x-cX,y-cY,...pointOnCircle(bigR,3*Math.PI/10))) {
            return 3;
        } else if (inPent(x-cX,y-cY,...pointOnCircle(bigR,7*Math.PI/10))) {
            return 4;
        } else if (inPent(x-cX,y-cY,...pointOnCircle(bigR,11*Math.PI/10))) {
            return 5;
        }
    }

    static getSizes(canvas) {
        const gridX = 1<<3;
        const size = canvas.width / ((Math.sin(2*Math.PI/5) * 4 + 2 * Math.sin(Math.PI/5)) * gridX);
        const spacingX = size * (Math.sin(2*Math.PI/5) * 4 + 2 * Math.sin(Math.PI/5));
        const spacingY = size * (1+2*Math.cos(Math.PI/5)) * (1+Math.cos(Math.PI/5));
        return {
            gridX,
            size,
            spacingX,
            spacingY,
            offsetX: spacingX / 2,
            offsetY: size * (Math.sin(2*Math.PI/5) * 2 + 1 * Math.sin(Math.PI/5) + 1 - Math.cos(Math.PI/5)),
        }
    }

    static getPieceCount() {
        return 1<<6;
    }
}