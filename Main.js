const enumPuzzleType = {
    Tetrahedron: 0,
    TriPrism: 1,
}

const enumPuzzleSize = {
    [enumPuzzleType.Tetrahedron]: 4,
    [enumPuzzleType.TriPrism]: 5,
}

const enumPuzzlePieceType = {
    [enumPuzzleType.Tetrahedron]: TetPiece,
    [enumPuzzleType.TriPrism]: TriPrismPiece,
}

class Puzzle {
    pieces;
    puzzleType;
    pieceType;

    constructor(type) {
        this.puzzleType = enumPuzzleType[type];
        this.pieceType = enumPuzzlePieceType[this.puzzleType];
        this.pieces = Array(enumPuzzleSize[this.puzzleType])
        this.reset();
    }

    move(move, dir = false) {
        this.pieces.forEach(x => x.move(move, dir));
    }

    scramble(n = 100) {
        for(let i = 0; i < n; ++i) {
            const move = Math.floor(Math.random() * enumPuzzleSize[this.puzzleType]);
            const dir = Math.random() > 0.5;
            this.pieces.forEach(x => x.move(move, dir));
        }
    }

    reset() {
        for (let i = 0; i < 1 << enumPuzzleSize[this.puzzleType]; ++i) {
            this.pieces[i] = new this.pieceType(i);
        }
    }

    subInPiece(x, y) {
        return this.pieceType.subInPiece(x, y);
    }
    
    getSizes(canvas) {
        return this.pieceType.getSizes(canvas);
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
    const { size, spacingX, spacingY } = puzzle.getSizes(canvas);
    canvas.addEventListener('mousedown', function(event) {
        event.preventDefault();
        var clickX = event.pageX - canvasLeft, clickY = event.pageY - canvasTop;
        var gridX = Math.floor(clickX / spacingX), gridY = Math.floor(clickY / spacingY);
        var subX = (clickX % spacingX) / size, subY = (clickY % spacingY) / size;

        var subPiece = puzzle.subInPiece(subX, subY);

        if (subPiece !== null) {
            puzzle.move(subPiece, event.button === 0);
            update();
        }
    });
    
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
    const { size, spacingX, spacingY, offsetX, offsetY } = puzzle.getSizes(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(offsetX, offsetY);
    const gridSize = enumPuzzleSize[puzzle.puzzleType];
    const gridX = Math.ceil(gridSize / 2);
    const gridY = gridSize - gridX;
    for (let i = 0; i < 1 << enumPuzzleSize[puzzle.puzzleType]; ++i) {
        puzzle.pieces[i].draw(ctx, cols, 
            ((1 << gridX) - 1 - i % (1 << gridX)) * spacingX, 
            ((1 << gridY) - 1 - (i >> gridX) % (1 << gridY)) * spacingY, 
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