const gameBoard = (() => {
    //players
    let player1 = {
        turn: 1,
        shape: undefined,
        getShape: function () { return player1.shape },
        setShape: function (x) { player1.shape = x },
        toggleTurn: function () {
            player1.turn == 1 ? player1.turn = 0 : player1.turn = 1;
        }
    }
    let player2 = {
        turn: 0,
        shape: undefined,
        getShape: function () { return player2.shape },
        setShape: function (x) { player2.shape = x },
        toggleTurn: function () {
            player2.turn == 1 ? player2.turn = 0 : player2.turn = 1;
        }
    }
    const shape = {
        "x": 1,
        "o": -10
    }
    let mode;
    const setMode = function (x) {
        mode = x;
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
    const randomIndex = function () {
        Array.prototype.random = function () {
            return this[Math.floor((Math.random() * this.length))];
        }
        return Object.values(bSquares).filter(x => x.content == 0).map(x => x.id).random();
    }
    const checkWinningCondition = function (shapeValue) {
        for (let line in boardLines) {
            if (boardLines[line].reduce((a, b) => a + b.content, 0) == shapeValue * 2) {
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
        nextSquare.textContent = player2.shape;
        fillSquaresObject(nextSquare, player2.shape);
        nextSquare.removeEventListener("click", gameMode.playerVScpu);
    }
    const gameMode = {
        playerVSplayer: function () {
            if (player1.turn == 1) {
                this.textContent = player1.shape;
                player1.toggleTurn();
                player2.toggleTurn();
                fillSquaresObject(this, player1.shape);
                this.removeEventListener("click", gameMode.playerVSplayer);
                checkWinner();
            } else if (player1.turn == 0) {
                this.textContent = player2.shape;
                player2.toggleTurn();
                player1.toggleTurn();
                fillSquaresObject(this, player2.shape);
                this.removeEventListener("click", gameMode.playerVSplayer);
                checkWinner();
            }
        },
        playerVScpu: function () {
            let shapeValue = (player1.shape == "x") ? 1 : -10;
            this.textContent = player1.shape;
            fillSquaresObject(this, player1.shape);
            this.removeEventListener("click", gameMode.playerVScpu);
            const winnerStatus = checkWinner();
            //player played for the first time. cpu plays at random place.
            if (Object.values(bSquares).reduce((a, b) => a + b.content, 0) == shapeValue) {
                fillRandomSquare();
            }
            else if (!winnerStatus) {
                for (let line in boardLines) {
                    //if player is winning next turn
                    if (boardLines[line].reduce((a, b) => a + b.content, 0) == shapeValue * 2) {
                        for (let item of boardLines[line]) {
                            if (item.content == 0) {
                                const nextSquare = document.getElementById(Object.keys(bSquares).find(key => bSquares[key].id == item.id));
                                nextSquare.textContent = player2.shape;
                                fillSquaresObject(nextSquare, player2.shape);
                                nextSquare.removeEventListener("click", gameMode.playerVScpu);
                                checkWinner();
                            }
                        }
                        break;
                    }
                    //if player isn't winning next turn
                    else if (!checkWinningCondition(shapeValue)) {
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
        const results = document.querySelector(".results");
        for (let line in boardLines) {
            if (boardLines[line].reduce((a, b) => a + b.content, 0) == 3) {
                results.textContent = "X Won (ﾉ^_^)ﾉ";
                removeListeners();
                return true;
            }
            else if (boardLines[line].reduce((a, b) => a + b.content, 0) == -30) {
                results.textContent = "O Won (ﾉ^_^)ﾉ";
                removeListeners();
                return true;
            }
        }
        if (Object.values(bSquares).filter(x => x.content == 0).length == 0) {
            results.textContent = "Tie (-_-)";
            removeListeners();
            return true;
        }
    }
    const addListeners = function () {
        const boardSquareSelected = document.querySelectorAll(".board > div");
        boardSquareSelected.forEach((square) => {
            square.addEventListener("click", gameMode[mode]);
        });
    }
    const removeListeners = function () {
        const boardSquareSelected = document.querySelectorAll(".board > div");
        boardSquareSelected.forEach((square) => {
            square.removeEventListener("click", gameMode[mode]);
        });
    }
    return { setMode, addListeners, removeListeners, bSquares, gameMode, player1, player2 };
})();

/* USER INTERFACE ========================================*/
const userInterface = (() => {
    const pickMode = function () {
        const gameMode = document.querySelector(".ui .game-mode");
        gameMode.classList.remove("hide");
        const vsCpu = document.querySelector(".vsCpu");
        const vsPlayer = document.querySelector(".vsPlayer");
        vsCpu.addEventListener("click", () => {
            gameBoard.setMode("playerVScpu");
            gameMode.classList.add("hide");
            pickShape();
        });
        vsPlayer.addEventListener("click", () => {
            gameBoard.setMode("playerVSplayer");
            gameMode.classList.add("hide");
            pickShape();
        });
    }
    const pickShape = function () {
        const gameShape = document.querySelector(".ui .pickShape");
        gameShape.classList.remove("hide");
        const xButton = document.querySelector(".xButton");
        const oButton = document.querySelector(".oButton");
        xButton.addEventListener("click", () => {
            gameShape.classList.add("hide");
            if (gameBoard.player1.turn == 0) {
                gameBoard.player1.toggleTurn();
                gameBoard.player2.toggleTurn();
            }
            gameBoard.player1.setShape("x");
            gameBoard.player2.setShape("o");
            gameBoard.addListeners();
            pickRestartOrGameMode();
        });
        oButton.addEventListener("click", () => {
            gameShape.classList.add("hide");
            if (gameBoard.player1.turn == 0) {
                gameBoard.player1.toggleTurn();
                gameBoard.player2.toggleTurn();
            }
            gameBoard.player1.setShape("o");
            gameBoard.player2.setShape("x");
            gameBoard.addListeners();
            pickRestartOrGameMode();
        });
    }
    const pickRestartOrGameMode = function () {
        const gameUi = document.querySelector(".ui .change-restart");
        gameUi.classList.remove("hide");
        const change = document.querySelector(".change");
        const restart = document.querySelector(".restart");
        const results = document.querySelector(".results");
        change.addEventListener("click", () => {
            gameUi.classList.add("hide");
            Object.values(gameBoard.bSquares).forEach(item => {
                item.content = 0;
            });
            //empty the board
            const boardSquares = document.querySelectorAll(".board > div");
            boardSquares.forEach((square) => {
                square.textContent = "";
            });
            //remove listeners
            gameBoard.removeListeners();
            results.textContent = "";
            pickMode();
        });
        restart.addEventListener("click", () => {
            gameUi.classList.add("hide");
            Object.values(gameBoard.bSquares).forEach(item => {
                item.content = 0;
            });
            //empty the board
            const boardSquares = document.querySelectorAll(".board > div");
            boardSquares.forEach((square) => {
                square.textContent = "";
            });
            //remove listeners
            gameBoard.removeListeners();
            results.textContent = "";
            pickShape();
        });
    }
    return { pickMode };
})();
const darkMode = (() => {
    let theme;
    const darkButton = document.querySelector(".dark-button");
    const osDarkThem = window.matchMedia("(prefers-color-scheme: dark)");
    if (osDarkThem.matches) {
        localStorage.setItem("theme", "dark");
        document.body.classList.add("darkTheme");
    } else {
        localStorage.setItem("theme", "light");
        document.body.classList.add("lightTheme");
    }
    darkButton.addEventListener("click", function () {
        if (document.body.classList.contains("lightTheme")) {
            document.body.classList.remove("lightTheme");
            document.body.classList.add("darkTheme");
            theme = "dark";
        } else {
            document.body.classList.remove("darkTheme");
            document.body.classList.add("lightTheme");
            theme = "light";
        }
        localStorage.setItem("theme", theme);
    });
})();
userInterface.pickMode();