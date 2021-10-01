/*player factory*/
const player=function (name){
    let playerBoard=[];
    return {name,playerBoard};
}
/*module gameboard*/
const gameBoard=(function (){
    const gameBoardSquares=document.querySelectorAll('.table div');
    let playerTurn=true;
    const selectAndPlay=function (player1,player2){
        gameBoardSquares.forEach(element => {
            element.addEventListener('click',()=>{
                if(playerTurn && element.textContent==''){
                    element.textContent='X';
                    playerTurn=false;
                    player1.playerBoard.push(parseInt(element.className.slice(element.className.length-1)));
                }
                else if(!playerTurn && element.textContent==''){
                    element.textContent='O';
                    playerTurn=true;
                    player2.playerBoard.push(parseInt(element.className.slice(element.className.length-1)));
                }
            });
        });
    }
    function checkPlayer(){
        if(searchBingo(1,2,3)||searchBingo(4,5,6)||searchBingo(7,8,9)||searchBingo(1,5,9)||searchBingo(3,5,7)||
        searchBingo(1,4,7)||searchBingo(2,5,8)||searchBingo(3,6,9))
            return true;
        else
            return false;
    }
    function searchBingo(fvalue,svalue,tvalue){
        if (pl1.playerBoard.includes(fvalue) && pl1.playerBoard.includes(svalue) && pl1.playerBoard.includes(tvalue)) 
            return true;
    }
    return {selectAndPlay};
})();
const pl1=player('reda');
const pl2=player('reda2');
gameBoard.selectAndPlay(pl1,pl2);