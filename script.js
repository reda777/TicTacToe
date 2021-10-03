/*player factory*/
const player=function (name,turn){
    let board=[];
    return {name,turn,board};
}
/*module gameboard*/
const gameBoard=(function (){
    const gameBoardSquares=document.querySelectorAll('.table div');
    const selectAndStart=function (pl1,pl2){
        gameBoardSquares.forEach(element => {
            element.addEventListener('click',function startGame(){
                let boardNum=parseInt(element.className.slice(element.className.length-1));
                if(!pl1.board.includes(boardNum) && !pl2.board.includes(boardNum) ){
                    if(pl1.turn){
                        element.textContent='X';
                        pl1.turn=false;
                        pl2.turn=true;
                        pl1.board.push(boardNum);
                        checkBoard(pl1);
                        element.removeEventListener('click',startGame);
                    }
                    else{
                        element.textContent='O';
                        pl2.turn=false;
                        pl1.turn=true;
                        pl2.board.push(boardNum);
                        checkBoard(pl2);
                        element.removeEventListener('click',startGame);
                    }
                }
            });
        });
    }

    function checkBoard(pl){
        const searchBingo=function (fvalue,svalue,tvalue){
            return (pl.board.includes(fvalue) && pl.board.includes(svalue) && pl.board.includes(tvalue))?
                true:false;
        }
        if(searchBingo(1,2,3)||searchBingo(4,5,6)||searchBingo(7,8,9)||searchBingo(1,5,9)||searchBingo(3,5,7)||
            searchBingo(1,4,7)||searchBingo(2,5,8)||searchBingo(3,6,9)){
                gameBoardSquares.forEach(element=>{
                    let new_element = element.cloneNode(true);
                    element.parentNode.replaceChild(new_element, element);
                });
                document.querySelector('.res').textContent+='player '+pl.name+' won';
        }
    } 
    return {selectAndStart};
})();
const pl1=player('reda',true);
const pl2=player('reda2',false);
gameBoard.selectAndStart(pl1,pl2);