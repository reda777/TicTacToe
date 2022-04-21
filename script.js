const player = (shape) => {
    let turn;
    const getTurn = () => turn;
    const setTurn = (x) => turn=x;
    const toggleTurn = () => {
        turn == 1 ? turn = 0 : turn = 1;
    };
    return { shape, getTurn, toggleTurn, setTurn };
};
const gameBoard = (() => {
    const shape = {
        "x": 1,
        "o": -10
    }
    let user1 = player("x");
    let user2 = player("o");
    let mode;
    const setMode = function(x){
        mode=x;
    }
    let bSquares = {
        s0: { id: 0, content: 0 },
        s1: { id: 1, content: 0 },
        s2: { id: 2, content: 0 },

        s3: { id: 3, content: 0 },
        s4: { id: 4, content: 0 },
        s5: { id: 5, content: 0 },

        s6: { id: 6, content: 0 },
        s7: { id: 7, content: 0 },
        s8: { id: 8, content: 0 }
    };
    let boardLines = {
        hLine1: [bSquares.s0, bSquares.s1, bSquares.s2],
        hLine2: [bSquares.s3, bSquares.s4, bSquares.s5],
        hLine3: [bSquares.s6, bSquares.s7, bSquares.s8],
        vLine1: [bSquares.s0, bSquares.s3, bSquares.s6],
        vLine2: [bSquares.s1, bSquares.s4, bSquares.s7],
        vLine3: [bSquares.s2, bSquares.s5, bSquares.s8],
        mLine1: [bSquares.s0, bSquares.s4, bSquares.s8],
        mLine2: [bSquares.s2, bSquares.s4, bSquares.s6]
    };
    Array.prototype.random = function () {
        return this[Math.floor((Math.random() * this.length))];
    }
    const randomIndex = function () {
        return Object.values(bSquares).filter(x => x.content == 0).map(x => x.id).random();
    }
    const checkWinningCondition = function () {
        for (let line in boardLines) {
            if (boardLines[line].reduce((a, b) => a + b.content, 0) == 2) {
                return true;
            }
        }
    }
    const fillRandomSquare = function () {
        let cpuSquareIndex = randomIndex();
        while (true) {
            if (bSquares['s' + cpuSquareIndex].content != 0)
                cpuSquareIndex = randomIndex();
            else
                break;
        }
        const nextSquare = document.getElementById(Object.keys(bSquares).find(key => bSquares[key].id == cpuSquareIndex));
        nextSquare.textContent = user2.shape;
        fillSquaresObject(nextSquare, user2.shape);
        nextSquare.removeEventListener("click", gameMode[mode]);
    }
    const gameMode = {
        playerVSplayer: function () {
            if (user1.getTurn() == 1) {
                this.textContent = user1.shape;
                user1.toggleTurn();
                user2.toggleTurn();
                fillSquaresObject(this, user1.shape);
                this.removeEventListener("click", gameMode.playerVSplayer);
                checkWinner();
            } else if (user1.getTurn() == 0) {
                this.textContent = user2.shape;
                user2.toggleTurn();
                user1.toggleTurn();
                fillSquaresObject(this, user2.shape);
                this.removeEventListener("click", gameMode.playerVSplayer);
                checkWinner();
            }
        },
        playerVScpu: function () {
            this.textContent = user1.shape;
            fillSquaresObject(this, user1.shape);
            this.removeEventListener("click", gameMode.playerVScpu);
            const winnerStatus = checkWinner();
            //player played for the first time. cpu plays at random place.
            if (Object.values(bSquares).reduce((a, b) => a + b.content, 0) == 1) {
                fillRandomSquare();
            }
            else if (Object.values(bSquares).reduce((a, b) => a + b.content, 0) < 1 && !winnerStatus) {
                for (let line in boardLines) {
                    //if player is winning next turn
                    if (boardLines[line].reduce((a, b) => a + b.content, 0) == 2) {
                        for (let item of boardLines[line]) {
                            if (item.content == 0) {
                                let cpuSquareIndex;
                                cpuSquareIndex = item.id;
                                const nextSquare = document.getElementById(Object.keys(bSquares).find(key => bSquares[key].id == cpuSquareIndex));
                                nextSquare.textContent = user2.shape;
                                fillSquaresObject(nextSquare, user2.shape);
                                nextSquare.removeEventListener("click", gameMode.playerVScpu);
                                checkWinner();
                            }
                        }
                        break;
                    }
                    //if player isn't winning next turn
                    else if (!checkWinningCondition()) {
                        fillRandomSquare();
                        checkWinner();
                        break;
                    }
                }
            }
        }
    }
    const fillSquaresObject = function (that, playerShape) {
        const currentSquareId = that.id;
        bSquares[currentSquareId].content = shape[playerShape];
    }
    const checkWinner = function () {
        const results=document.querySelector(".results");
        for (let line in boardLines) {
            if (boardLines[line].reduce((a, b) => a + b.content, 0) == 3) {
                results.textContent="X WON";
                console.log("x won", line, boardLines[line]);
                finishGame(mode);
                return true;
            }
            else if (boardLines[line].reduce((a, b) => a + b.content, 0) == -30) {
                results.textContent="O WON";
                console.log("o won", line, boardLines[line]);
                finishGame(mode);
                return true;
            }
            else if (Object.values(bSquares).filter(x => x.content == 0).length == 0) {
                results.textContent="TIE";
                console.log("tie");
                finishGame(mode);
                return true;
            }
        }
    }
    const start=function(modeValue){
        setMode(modeValue);
        const boardSquareSelected = document.querySelectorAll(".board > div");
        boardSquareSelected.forEach((square) => {
            square.addEventListener("click", gameMode[mode]);
        });
        //hide picking options after choosing a shape
        const pickShape=document.querySelector(".pickShape");
        pickShape.classList.add("hide");
        
    }
    const finishGame = function (modeValue) {
        const boardSquareSelected = document.querySelectorAll(".board > div");
        boardSquareSelected.forEach((square) => {
            square.removeEventListener("click", gameMode[modeValue]);
        });
    }
    //restart button
    const restartButton = document.querySelector(".restart");
    const restart=function(mode){
        Object.values(bSquares).forEach(item =>{
            item.content=0;
        });
        const boardSquares = document.querySelectorAll(".board > div");
        boardSquares.forEach((square) => {
            square.textContent="";
        });
        finishGame(mode);
        document.querySelector(".results").textContent="";
        pickShape(mode);
        console.log(bSquares);
    }
    restartButton.addEventListener("click", ()=>{restart()});
    //restart game with set mode
    const vsPlayerButton=document.querySelector(".vsPlayer");
    const vsPlayer=function(){
        restart("playerVSplayer");
    }
    vsPlayerButton.addEventListener("click", vsPlayer);
    const vsCpuButton=document.querySelector(".vsCpu");
    const vsCpu=function(){
        restart("playerVScpu");
    }
    vsCpuButton.addEventListener("click", vsCpu);
    //picking a shape
    const pickShape=function(mode){
        document.querySelector(".hide")?.classList.remove("hide");
        const xButton=document.querySelector(".xButton");
        const oButton=document.querySelector(".oButton");
        xButton.addEventListener("click",()=>{
            user1.setTurn(1);
            user2.setTurn(0);
            start(mode);
        });
        oButton.addEventListener("click",()=>{
            user2.setTurn(1);
            user1.setTurn(0);
            start(mode);
        });
    }
    return {start,pickShape};
})();
gameBoard.pickShape("playerVSplayer");
//choose shape(still doesnt work for cpu)
//fix tie even after winning
//design

