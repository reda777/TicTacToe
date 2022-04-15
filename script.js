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
    const boardSquares = document.querySelectorAll(".board > div")
    boardSquares.forEach((square) => {
        square.addEventListener("click", clickSquare);
    });
    return{boardLines};
})();

function clickSquare(){
    if(user1.getTurn()==1){
        this.textContent=user1.shape;
        user1.toggleTurn();
        user2.toggleTurn();
        fillBoardLines(this,user1.shape);
        this.removeEventListener("click", clickSquare);
    }else if(user1.getTurn()==0){
        this.textContent=user2.shape;
        user2.toggleTurn();
        user1.toggleTurn();
        fillBoardLines(this,user2.shape);
        this.removeEventListener("click", clickSquare);
    }
    for(let line in gameBoard.boardLines){
        if(gameBoard.boardLines[line].reduce((a,b)=>a+b,0)==3){
            console.log("x won");
        }
        else if(gameBoard.boardLines[line].reduce((a,b)=>a+b,0)==-3){
            console.log("o won");
        }
    }
}
function fillBoardLines(that,playerShape){
    const currentSquareClasses=that.className.split(" ");
        currentSquareClasses.forEach(item=>{
            gameBoard.boardLines[item].push(shape[playerShape]);
    });
}