const enumPuzzleType = {
    Tetrahedron: 0,
    TriPrism: 1,
    TriplexTet: 2,
    SquareK5: 3,
}

const enumPuzzleSize = {
    [enumPuzzleType.Tetrahedron]: 4,
    [enumPuzzleType.TriPrism]: 5,
    [enumPuzzleType.TriplexTet]: 4,
    [enumPuzzleType.SquareK5]: 5,
}

const enumPuzzlePieceType = {
    [enumPuzzleType.Tetrahedron]: TetPiece,
    [enumPuzzleType.TriPrism]: TriPrismPiece,
    [enumPuzzleType.TriplexTet]: TriplexTetPiece,
    [enumPuzzleType.SquareK5]: SquareK5Piece,
}

class Puzzle {
    pieces;
    puzzleType;
    pieceType;
    undoStack;
    redoStack;

    constructor(type) {
        this.puzzleType = enumPuzzleType[type];
        this.pieceType = enumPuzzlePieceType[this.puzzleType];
        this.pieces = Array(enumPuzzleSize[this.puzzleType]);
        this.reset();
    }

    move(move, dir = false) {
        this.pieces.forEach(x => x.move(move, dir));
        this.undoStack.push([move,dir]);
        this.redoStack = [];
    }

    scramble(n = 100) {
        for(let i = 0; i < n; ++i) {
            const move = Math.floor(Math.random() * enumPuzzleSize[this.puzzleType]);
            const dir = Math.random() > 0.5;
            this.pieces.forEach(x => x.move(move, dir));
        }
    }

    reset() {
        for (let i = 0; i < this.getPieceCount(); ++i) {
            this.pieces[i] = new this.pieceType(i);
        }
        this.undoStack = [];
        this.redoStack = [];
    }

    undo() {
        if (this.undoStack.length > 0) {
            let m = this.undoStack.pop();
            this.pieces.forEach(x => x.move(m[0], !m[1]));
            this.redoStack.push(m);
        }
    }
    
    redo() {
        console.log(this.redoStack);
        if (this.redoStack.length > 0) {
            let m = this.redoStack.pop();
            this.pieces.forEach(x => x.move(m[0], m[1]));
            this.undoStack.push(m);
        }
    }

    subInPiece(x, y) {
        return this.pieceType.subInPiece(x, y);
    }
    
    getSizes(canvas) {
        return this.pieceType.getSizes(canvas);
    }

    getPieceCount() {
        return this.pieceType.getPieceCount();
    }

    isSolved() {
        return this.pieces.every(x => x.isSolved());
    }
}



const permute = (arr, order, ccw = false) => {
    const newArr = Array(arr.length);
    if (ccw) {
        for (let i = 0; i < arr.length; newArr[order[i]] = arr[i++]);
    } else {
        for (let i = 0; i < arr.length; newArr[i] = arr[order[i++]]);
    }
    return newArr;
}

let puzzle = new Puzzle('Tetrahedron');
const cols = ['#008800', '#000088', '#880000', '#bbbb00', '#bbbbbb'];

function initialise() {
    const canvas = document.getElementById('canvas');
    const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
    const canvasTop = canvas.offsetTop + canvas.clientTop;
    const ctx = canvas.getContext('2d');
    canvas.addEventListener('mousedown', function(event) {
        const { size, spacingX, spacingY } = puzzle.getSizes(canvas);
        var clickX = event.pageX - canvasLeft, clickY = event.pageY - canvasTop;
        var gridX = Math.floor(clickX / spacingX), gridY = Math.floor(clickY / spacingY);
        var subX = (clickX % spacingX) / size, subY = (clickY % spacingY) / size;

        var subPiece = puzzle.subInPiece(subX, subY);
        //console.log(subX, subY, subPiece);

        if (subPiece !== null) {
            puzzle.move(subPiece, event.button === 0);
            update();
        }
    });
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.code === 'KeyZ') {
            if (event.shiftKey) {
                puzzle.redo()
            } else {
                puzzle.undo();
            }
            update();
        };
    }, false);
    
    createPuzzle();
}

function createPuzzle() {
    const puzzleType = document.getElementById("puzzle-type").value;
    puzzle = new Puzzle(puzzleType);
    update();
}

function update() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const { gridX, size, spacingX, spacingY, offsetX, offsetY } = puzzle.getSizes(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(offsetX, offsetY);
    for (let i = 0; i < puzzle.getPieceCount(); ++i) {
        puzzle.pieces[i].draw(ctx, cols, 
            (i % gridX) * spacingX, 
            Math.floor(i / gridX ) * spacingY, 
            size);
    }
    ctx.translate(-offsetX, -offsetY);
}

function reset() {
    puzzle.reset();
    update();
}

function scramble() {
    puzzle.scramble();
    update();
}

window.onload = initialise;