const player = function(shape){
    return{shape};
}
const user1=player("x");
const user2=player("o");
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
    this.textContent=user1.shape;
    const currentSquareClasses=this.className.split(" ");
    currentSquareClasses.forEach(item=>{
        gameBoard.boardLines[item].push(1);
    });
    for(let line in gameBoard.boardLines){
        if(gameBoard.boardLines[line].reduce((a,b)=>a+b,0)==3){
            console.log("stop");
        }
    }
}