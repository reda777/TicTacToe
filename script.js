const shape = {
    "x": 1,
    "o": 2
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
    let bSquares = {
        s0: {id:0,content:0},
        s1: {id:1,content:0},
        s2: {id:2,content:0},

        s3: {id:3,content:0},
        s4: {id:4,content:0},
        s5: {id:5,content:0},
        
        s6: {id:6,content:0},
        s7: {id:7,content:0},
        s8: {id:8,content:0}
    };
    let boardLines = {
        hLine1: [bSquares.s0,bSquares.s1,bSquares.s2],
        hLine2: [bSquares.s3,bSquares.s4,bSquares.s5],
        hLine3: [bSquares.s6,bSquares.s7,bSquares.s8],
        vLine1: [bSquares.s0,bSquares.s3,bSquares.s6],
        vLine2: [bSquares.s1,bSquares.s4,bSquares.s7],
        vLine3: [bSquares.s2,bSquares.s5,bSquares.s8],
        mLine1: [bSquares.s0,bSquares.s4,bSquares.s8],
        mLine2: [bSquares.s2,bSquares.s4,bSquares.s6]
    };
    const randomIndex = function(){
        return Math.floor(Math.random()*9);
    }
    const clickSquare = {
        playerVSplayer : function(){
            if (user1.getTurn() == 1) {
                this.textContent = user1.shape;
                user1.toggleTurn();
                user2.toggleTurn();
                fillSquaresObject(this, user1.shape);
                this.removeEventListener("click", clickSquare.playerVSplayer);
                checkWinner();
            } else if (user1.getTurn() == 0) {
                this.textContent = user2.shape;
                user2.toggleTurn();
                user1.toggleTurn();
                fillSquaresObject(this, user2.shape);
                this.removeEventListener("click", clickSquare.playerVSplayer);
                checkWinner();
            }
        },
        playerVScpu : function(){
            this.textContent = user1.shape;
            fillSquaresObject(this, user1.shape);
            this.removeEventListener("click", clickSquare.playerVScpu);
            const winnerStatus=checkWinner();
            //player played for the first time. cpu plays at random place.
            if (Object.values(bSquares).reduce((a, b) => a + b.content, 0) == 1) {
                console.log(Object.values(bSquares).reduce((a, b) => a + b.content, 0));
                let cpuSquareIndex=randomIndex();
                while(true){
                    if(bSquares['s'+cpuSquareIndex].content==1)
                        cpuSquareIndex=randomIndex();
                    else
                        break;
                }
                const nextSquare=document.getElementById(Object.keys(bSquares).find(key=>bSquares[key].id==cpuSquareIndex));
                nextSquare.textContent=user2.shape;
                fillSquaresObject(nextSquare, user2.shape);
                nextSquare.removeEventListener("click", clickSquare.playerVScpu);
            }
            /*player played for the second time. cpu should prevent player from winning if the player won't be winning next turn
             pick random place.*/
            if(Object.values(bSquares).reduce((a, b) => a + b.content, 0)>1){
                let cpuSquareIndex;
                for (let line in boardLines) {
                    if(boardLines[line].reduce((a, b) => a + b.content, 0) == 2){
                        Object.keys(bSquares).find(key=>bSquares[key].id==cpuSquareIndex);
                    }
                }
            }
            // this.textContent = user1.shape;
            // fillSquaresObject(this, user1.shape);
            // this.removeEventListener("click", clickSquare.playerVScpu);
            // checkWinner();
            // for(let i=0;i<wholeBoard.length && !checkWinner();i++){
            //     if(wholeBoard[i]==1){
            //         if(wholeBoard[i+1]==0){
            //             const nextSquare=document.getElementById("s"+`${i+1}`);
            //             wholeBoard[i+1]=-1;
            //             nextSquare.textContent = user2.shape;
            //             fillSquaresObject(nextSquare, user2.shape);
            //             nextSquare.removeEventListener("click", clickSquare.playerVScpu);
            //             checkWinner();
            //             break;
            //         }
            //         else if(wholeBoard[i-1]==0){
            //             const nextSquare=document.getElementById("s"+`${i-1}`);
            //             wholeBoard[i-1]=-1;
            //             nextSquare.textContent = user2.shape;
            //             fillSquaresObject(nextSquare, user2.shape);
            //             nextSquare.removeEventListener("click", clickSquare.playerVScpu);
            //             checkWinner();
            //             break;
            //         }
            //     }
            // }
        }
    }
    const fillSquaresObject = function (that, playerShape) {
        //fill squares object
        const currentSquareId = that.id;
        bSquares[currentSquareId].content=shape[playerShape];
    }
    const checkWinner = function () {
        for (let line in boardLines) {
            if (boardLines[line].reduce((a, b) => a + b.content, 0) == 3) {
                console.log("x won",line,boardLines[line]);
                finishGame();
                return true;
            }
            else if (boardLines[line].reduce((a, b) => a + b.content, 0) == 6) {
                console.log("o won",line,boardLines[line]);
                finishGame();
                return true;
            }
        }
    }
    const boardSquareSelected = document.querySelectorAll(".board > div");
    const finishGame = function () {
        boardSquareSelected.forEach((square) => {
            square.removeEventListener("click", clickSquare.playerVScpu);
        });
    }
    boardSquareSelected.forEach((square) => {
        square.addEventListener("click", clickSquare.playerVScpu);
    });
})();