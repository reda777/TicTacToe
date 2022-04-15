const shape={
    "x" : 1,
    "o" : -1
}
const player = (shape, turn) => {
    const getTurn = () => turn;
    const toggleTurn = () =>{
        if(turn==1){
            turn=0;
        }
        else{
            turn=1;
        }
    };
    return{shape, getTurn, toggleTurn};
};
let user1=player("x",1);
let user2=player("o",0);
const gameBoard = (() => {
    let boardLines = {
        hLine1 : [],
        hLine2 : [],
        hLine3 : [],
        vLine1 : [],
        vLine2 : [],
        vLine3 : [],
        mLine1 : [],
        mLine2 : []
    };
    const clickSquare = function(){
        if(user1.getTurn()==1){
            this.textContent=user1.shape;
            user1.toggleTurn();
            user2.toggleTurn();
            fillLinesArray(this,user1.shape);
            this.removeEventListener("click", clickSquare);
            checkWinner();
        }else if(user1.getTurn()==0){
            this.textContent=user2.shape;
            user2.toggleTurn();
            user1.toggleTurn();
            fillLinesArray(this,user2.shape);
            this.removeEventListener("click", clickSquare);
            checkWinner();
        }
    }
    const fillLinesArray = function(that,playerShape){
        const currentSquareClasses=that.className.split(" ");
            currentSquareClasses.forEach(item=>{
                boardLines[item].push(shape[playerShape]);
        });
    }
    const  checkWinner = function(){
        for(let line in boardLines){
            if(boardLines[line].reduce((a,b)=>a+b,0)==3){
                console.log("x won");
                finishGame();
            }
            else if(boardLines[line].reduce((a,b)=>a+b,0)==-3){
                console.log("o won");
                finishGame();
            }
        }
    }
    const boardSquares = document.querySelectorAll(".board > div");
    const  finishGame = function(){
        boardSquares.forEach((square) => {
            square.removeEventListener("click", clickSquare);
        });
    }
    boardSquares.forEach((square) => {
        square.addEventListener("click", clickSquare);
    });
})();

