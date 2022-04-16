const shape = {
    "x": 1,
    "o": -1
}
const player = (shape, turn) => {
    const getTurn = () => turn;
    const toggleTurn = () => {
        turn == 1 ? turn = 0 : turn = 1;
    };
    return { shape, getTurn, toggleTurn };
};
let user1 = player("x", 1);
let user2 = player("o", 0);
const gameBoard = (() => {
    let boardLines = {
        hLine1: Array(3),
        hLine2: Array(3),
        hLine3: Array(3),
        vLine1: Array(3),
        vLine2: Array(3),
        vLine3: Array(3),
        mLine1: Array(3),
        mLine2: Array(3)
    };
    let wholeBoard = Array(9).fill(0);
    const clickSquare = {
        playerVSplayer : function(){
            if (user1.getTurn() == 1) {
                this.textContent = user1.shape;
                user1.toggleTurn();
                user2.toggleTurn();
                fillLinesArray(this, user1.shape);
                this.removeEventListener("click", clickSquare.playerVSplayer);
                checkWinner();
            } else if (user1.getTurn() == 0) {
                this.textContent = user2.shape;
                user2.toggleTurn();
                user1.toggleTurn();
                fillLinesArray(this, user2.shape);
                this.removeEventListener("click", clickSquare.playerVSplayer);
                checkWinner();
            }
        },
        playerVScpu : function(){
            this.textContent = user1.shape;
            fillLinesArray(this, user1.shape);
            this.removeEventListener("click", clickSquare.playerVScpu);
            checkWinner();
            for(let i=0;i<wholeBoard.length && !checkWinner();i++){
                if(wholeBoard[i]==1){
                    if(wholeBoard[i+1]==0){
                        const nextSquare=document.getElementById("s"+`${i+1}`);
                        wholeBoard[i+1]=-1;
                        nextSquare.textContent = user2.shape;
                        fillLinesArray(nextSquare, user2.shape);
                        nextSquare.removeEventListener("click", clickSquare.playerVScpu);
                        checkWinner();
                        break;
                    }
                    else if(wholeBoard[i-1]==0){
                        const nextSquare=document.getElementById("s"+`${i-1}`);
                        wholeBoard[i-1]=-1;
                        nextSquare.textContent = user2.shape;
                        fillLinesArray(nextSquare, user2.shape);
                        nextSquare.removeEventListener("click", clickSquare.playerVScpu);
                        checkWinner();
                        break;
                    }
                }
            }
        }
    }
    const fillLinesArray = function (that, playerShape) {
        //fill main array for deciding winner
        const currentSquareClasses = that.className.split(" ");
        currentSquareClasses.forEach(item => {
            boardLines[item].push(shape[playerShape]);
        });
        //fill array for cpu logic
        const currentSquareId = that.id[1];
        wholeBoard[currentSquareId]=shape[playerShape];
    }
    const checkWinner = function () {
        for (let line in boardLines) {
            if (boardLines[line].reduce((a, b) => a + b, 0) == 3) {
                console.log("x won");
                finishGame();
                return true;
            }
            else if (boardLines[line].reduce((a, b) => a + b, 0) == -3) {
                console.log("o won");
                finishGame();
                return true;
            }
        }
    }
    const boardSquares = document.querySelectorAll(".board > div");
    const finishGame = function () {
        boardSquares.forEach((square) => {
            square.removeEventListener("click", clickSquare.playerVScpu);
        });
    }
    boardSquares.forEach((square) => {
        square.addEventListener("click", clickSquare.playerVScpu);
    });
})();